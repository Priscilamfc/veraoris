const zlib = require('zlib');

// Cada loja aprovada na Awin com feed de produtos entra aqui como uma variável de ambiente
// nova no Netlify. Todas são buscadas e combinadas — não precisa mexer no resto do código
// pra adicionar mais uma loja, só configurar a variável correspondente no Netlify.
const FEED_URLS = [
  process.env.AWIN_EUDORA_FEED_URL,
  process.env.AWIN_LOCCITANE_FEED_URL
].filter(Boolean);
console.log('AWIN variáveis configuradas -> Eudora:', !!process.env.AWIN_EUDORA_FEED_URL, '| L\'Occitane:', !!process.env.AWIN_LOCCITANE_FEED_URL, '| total feeds:', FEED_URLS.length);
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

async function fetchOneFeed(feedUrl) {
  const res = await fetch(feedUrl);
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
      merchant: cols[idx.merchant_name] || ''
    });
  }
  console.log('AWIN feed', feedUrl.split('/fid/')[1] ? 'fid ' + feedUrl.split('/fid/')[1].split('/')[0] : '(?)', '->', products.length, 'produtos,', products.filter((p) => p.image).length, 'com foto');
  return products;
}

async function fetchFeed() {
  const now = Date.now();
  if (cache.data && (now - cache.fetchedAt) < CACHE_TTL_MS) {
    return cache.data;
  }
  const results = await Promise.all(FEED_URLS.map((url) => fetchOneFeed(url).catch((err) => {
    console.log('AWIN feed falhou:', err.message);
    return [];
  })));
  const products = results.flat();
  cache = { data: products, fetchedAt: now };
  console.log('AWIN total combinado:', products.length, 'produtos de', FEED_URLS.length, 'loja(s)');
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
    if (!FEED_URLS.length) {
      return { statusCode: 200, headers, body: JSON.stringify({ results: [], error: 'Nenhum feed da Awin configurado no Netlify.' }) };
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
        link: m.p.link,
        image: m.p.image || null
      }));

    console.log('AWIN busca "' + query + '" ->', matches.length, 'resultado(s), lojas:', matches.map((m) => m.store).join(', '));
    return { statusCode: 200, headers, body: JSON.stringify({ results: matches }) };
  } catch (error) {
    return { statusCode: 200, headers, body: JSON.stringify({ results: [], error: error.message }) };
  }
};
