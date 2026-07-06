const zlib = require('zlib');

const EUDORA_FEED_URL = process.env.AWIN_EUDORA_FEED_URL;
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutos

let cache = { data: null, fetchedAt: 0 };

function parseCsvLine(line) {
  const fields = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }
        else { inQuotes = false; }
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      fields.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  fields.push(cur);
  return fields;
}

async function fetchFeed() {
  const now = Date.now();
  if (cache.data && (now - cache.fetchedAt) < CACHE_TTL_MS) {
    return cache.data;
  }
  const res = await fetch(EUDORA_FEED_URL);
  const buf = Buffer.from(await res.arrayBuffer());
  const decompressed = zlib.gunzipSync(buf).toString('utf-8');
  const lines = decompressed.split('\n').filter(Boolean);
  const header = parseCsvLine(lines[0]).map((h) => h.trim());
  const idx = {};
  header.forEach((h, i) => { idx[h] = i; });

  const products = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length < header.length) continue;
    const price = parseFloat(cols[idx.search_price] || cols[idx.display_price] || cols[idx.store_price] || '0');
    if (!price) continue;
    products.push({
      name: cols[idx.product_name] || '',
      price: price,
      link: cols[idx.aw_deep_link] || cols[idx.merchant_deep_link] || '',
      image: cols[idx.aw_image_url] || cols[idx.merchant_image_url] || '',
      merchant: cols[idx.merchant_name] || 'Eudora'
    });
  }
  cache = { data: products, fetchedAt: now };
  return products;
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    if (!EUDORA_FEED_URL) {
      return { statusCode: 200, headers, body: JSON.stringify({ results: [], error: 'AWIN_EUDORA_FEED_URL não configurada no Netlify.' }) };
    }

    const params = event.queryStringParameters || {};
    const query = (params.query || '').toLowerCase().trim();
    if (!query) {
      return { statusCode: 200, headers, body: JSON.stringify({ results: [] }) };
    }

    const products = await fetchFeed();
    const terms = query.split(/\s+/).filter(Boolean);

    const matches = products
      .map((p) => {
        const nameLower = p.name.toLowerCase();
        const score = terms.reduce((acc, t) => acc + (nameLower.includes(t) ? 1 : 0), 0);
        return { p, score };
      })
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((m) => ({
        title: m.p.name,
        price: m.p.price,
        store: m.p.merchant || 'Eudora',
        link: m.p.link
      }));

    return { statusCode: 200, headers, body: JSON.stringify({ results: matches }) };
  } catch (error) {
    return { statusCode: 200, headers, body: JSON.stringify({ results: [], error: error.message }) };
  }
};
