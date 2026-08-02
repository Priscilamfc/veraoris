// Lojas Pompéia — chamada DIRETA na API pública do VTEX, mesmo padrão de Época/WePink/
// Americanas/Mahogany. Rede de lojas de departamento (bazar/vestuário/beleza), achada
// pesquisando "loja de cosméticos VTEX Brasil" a pedido da Priscila (01/08/2026, pedido pra
// aumentar a quantidade de lojas/produtos do site, mesmo sem comissão). Testado ao vivo:
// API responde sem autenticação nem custo, vende marca de verdade (Vult, Payot, Eudora,
// Siàge, Australian Gold, Niina Secrets, Creamy).
// Como é loja de departamento geral (não só beleza) — mesmo risco de ruído fora do tema que a
// Americanas já teve — filtra pelo campo `categories` da API: todo produto de beleza real
// testado veio com prefixo "/Beleza/..." (confirmado com batom, perfume, shampoo, protetor
// solar), então só aceita isso.
const CACHE_TTL_MS = 30 * 60 * 1000;
const FETCH_TIMEOUT_MS = 8000;
const API_URL = 'https://www.lojaspompeia.com/api/catalog_system/pub/products/search';

const BEAUTY_CATEGORY_PREFIX = '/beleza';

let cache = {}; // { [query]: { data, fetchedAt } }

function isRealBeautyProduct(p) {
  const cats = (p.categories || []).map((c) => c.toLowerCase());
  return cats.some((c) => c.startsWith(BEAUTY_CATEGORY_PREFIX));
}

function bestAvailablePrice(product) {
  let best = null;
  (product.items || []).forEach((item) => {
    (item.sellers || []).forEach((seller) => {
      const offer = seller.commertialOffer || {};
      if (offer.IsAvailable && offer.Price) {
        const price = offer.Price;
        if (!best || price < best) best = price;
      }
    });
  });
  return best;
}

function normalizeItems(raw) {
  return (raw || [])
    .filter(isRealBeautyProduct)
    .map((p) => {
      const price = bestAvailablePrice(p);
      if (!price || !p.productName || !p.linkText) return null;
      const firstItem = (p.items || [])[0];
      const image = firstItem && firstItem.images && firstItem.images[0] && firstItem.images[0].imageUrl;
      const brand = (p.brand && p.brand !== 'Não Disponível') ? p.brand : null;
      return {
        title: p.productName,
        price,
        store: 'Lojas Pompéia',
        link: 'https://www.lojaspompeia.com/' + encodeURIComponent(p.linkText) + '/p',
        image: image || null,
        brand
      };
    })
    .filter(Boolean);
}

async function fetchFeed(query) {
  const now = Date.now();
  const cached = cache[query];
  if (cached && (now - cached.fetchedAt) < CACHE_TTL_MS) {
    return cached.data;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  let raw = [];
  try {
    const res = await fetch(API_URL + '?ft=' + encodeURIComponent(query) + '&_from=0&_to=29', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36',
        'Accept': 'application/json'
      },
      signal: controller.signal
    });
    if (res.ok) {
      const parsed = await res.json();
      if (Array.isArray(parsed)) raw = parsed;
    } else {
      console.log('POMPEIA resposta não-OK, status:', res.status);
    }
  } catch (err) {
    console.log('POMPEIA fetch falhou:', err.message);
  } finally {
    clearTimeout(timer);
  }

  const products = normalizeItems(raw);
  console.log('POMPEIA produtos válidos:', products.length, '/', raw.length);
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
    const url = new URL(request.url);
    const query = (url.searchParams.get('query') || '').trim();
    if (!query) {
      return new Response(JSON.stringify({ results: [] }), { status: 200, headers });
    }

    const products = await fetchFeed(query);
    return new Response(JSON.stringify({ results: products }), { status: 200, headers });
  } catch (error) {
    console.log('POMPEIA erro:', error.message);
    return new Response(JSON.stringify({ results: [], error: error.message }), { status: 200, headers });
  }
};

export const config = { path: '/.netlify/functions/pompeia-search' };
