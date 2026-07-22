const APIFY_TOKEN = process.env.APIFY_TOKEN;
const ACTOR_ID = 'gio21~americanas-product-scraper';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutos, mesmo padrão do awin-search.js/mercadolivre-search.js
// Ator usa a API VTEX Catalog diretamente (sem navegador) — bem mais rápido que o antigo
// ator do Mercado Livre (que exigia navegador completo e >=100s), por isso um timeout curto
// já é suficiente aqui.
const RUN_TIMEOUT_SECS = 20;

let cache = {}; // { [query]: { data, fetchedAt } }

function normalizeItems(items) {
  return (items || [])
    .map((it) => {
      const title = it.name;
      const price = typeof it.price === 'string' ? parseFloat(it.price.replace(/[^\d,.-]/g, '').replace(',', '.')) : it.price;
      const link = it.url;
      if (!title || !price || !link) return null;
      return { title, price, store: 'Americanas', link, image: it.imageUrl || null, brand: it.brand || null };
    })
    .filter(Boolean);
}

async function runActor(input) {
  // Sem navegador (API VTEX direta) — memória baixa é suficiente, diferente do que precisou
  // pro ator antigo do Mercado Livre.
  const url = `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=${RUN_TIMEOUT_SECS}&memory=512`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  const items = await res.json();
  if (!Array.isArray(items)) {
    console.log('AMERICANAS resposta não é uma lista — status HTTP:', res.status);
    console.log('AMERICANAS corpo da resposta:', JSON.stringify(items));
    return [];
  }
  return items;
}

async function fetchFeed(query) {
  const now = Date.now();
  const cached = cache[query];
  if (cached && (now - cached.fetchedAt) < CACHE_TTL_MS) {
    return cached.data;
  }

  const raw = await runActor({ searchTerm: query, maxItems: 20, onlyAvailable: true });
  console.log('AMERICANAS itens brutos:', raw.length);

  const products = normalizeItems(raw);
  console.log('AMERICANAS produtos válidos após normalizar:', products.length, '/', raw.length);

  cache[query] = { data: products, fetchedAt: now };
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
    if (!APIFY_TOKEN) {
      return { statusCode: 200, headers, body: JSON.stringify({ results: [], error: 'APIFY_TOKEN não configurada no Netlify.' }) };
    }

    const params = event.queryStringParameters || {};
    const query = (params.query || '').trim();
    if (!query) {
      return { statusCode: 200, headers, body: JSON.stringify({ results: [] }) };
    }

    const products = await fetchFeed(query);
    return { statusCode: 200, headers, body: JSON.stringify({ results: products }) };
  } catch (error) {
    console.log('AMERICANAS erro:', error.message);
    return { statusCode: 200, headers, body: JSON.stringify({ results: [], error: error.message }) };
  }
};
