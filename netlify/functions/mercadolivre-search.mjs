// MIGRADA (24/07/2026) pro runtime moderno do Netlify Functions — ver epoca-search.mjs pro
// contexto completo (elimina o limite de 4KB de variáveis de ambiente do modo antigo).
const APIFY_TOKEN = process.env.APIFY_TOKEN;
const ACTOR_ID = 'karamelo~mercadolivre-scraper-brasil-portugues';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutos, mesmo padrão do awin-search.js
const RUN_TIMEOUT_SECS = 25; // limite do próprio Apify — evita estourar o tempo da function

let cache = {}; // { [query]: { data, fetchedAt } }

function pick(obj, keys) {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== null && obj[k] !== '') return obj[k];
  }
  return null;
}

function normalizeItems(items) {
  return (items || [])
    .map((it) => {
      const title = pick(it, ['name', 'title', 'productName']);
      const price = pick(it, ['newPrice', 'price', 'currentPrice', 'price_new']);
      const link = pick(it, ['url', 'link', 'productUrl', 'permalink']);
      const image = pick(it, ['imageUrl', 'image', 'thumbnail', 'picture']);
      const priceNum = typeof price === 'string' ? parseFloat(price.replace(/[^\d,.-]/g, '').replace(',', '.')) : price;
      if (!title || !priceNum || !link) return null;
      return { title, price: priceNum, store: 'Mercado Livre', link, image: image || null };
    })
    .filter(Boolean);
}

async function runActor(input) {
  // Memória reduzida (o padrão do actor é 2GB) — como várias buscas podem rodar ao mesmo
  // tempo (uma por produto na tela), pedir menos memória por execução evita estourar o
  // limite total da conta gratuita da Apify.
  const url = `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=${RUN_TIMEOUT_SECS}&memory=1024`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  const items = await res.json();
  if (!Array.isArray(items)) {
    // A Apify não devolveu uma lista de produtos — provavelmente um erro (crédito,
    // permissão, actor pago). Registra o status e o corpo cru pra sabermos o motivo real.
    console.log('MERCADOLIVRE resposta não é uma lista — status HTTP:', res.status);
    console.log('MERCADOLIVRE corpo da resposta:', JSON.stringify(items));
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

  // Formato confirmado direto no Apify Console (aba "JSON" do Input do actor)
  const raw = await runActor({ keyword: query, maxPages: 1, maxPagesOfertas: 1, promoted: false, scrapeOfertas: false });
  console.log('MERCADOLIVRE itens brutos:', raw.length);
  if (raw.length) {
    console.log('MERCADOLIVRE amostra de campos do 1º item:', JSON.stringify(Object.keys(raw[0])));
    console.log('MERCADOLIVRE 1º item completo:', JSON.stringify(raw[0]));
  }

  const products = normalizeItems(raw);
  console.log('MERCADOLIVRE produtos válidos após normalizar:', products.length, '/', raw.length);

  cache[query] = { data: products, fetchedAt: now };
  return products;
}

export default async (request) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (request.method === 'OPTIONS') {
    return new Response('', { status: 200, headers });
  }

  try {
    if (!APIFY_TOKEN) {
      return new Response(JSON.stringify({ results: [], error: 'APIFY_TOKEN não configurada no Netlify.' }), { status: 200, headers });
    }

    const url = new URL(request.url);
    const query = (url.searchParams.get('query') || '').trim();
    if (!query) {
      return new Response(JSON.stringify({ results: [] }), { status: 200, headers });
    }

    const products = await fetchFeed(query);
    return new Response(JSON.stringify({ results: products }), { status: 200, headers });
  } catch (error) {
    console.log('MERCADOLIVRE erro:', error.message);
    return new Response(JSON.stringify({ results: [], error: error.message }), { status: 200, headers });
  }
};

export const config = { path: '/.netlify/functions/mercadolivre-search' };
