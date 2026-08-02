// Extrafarma — chamada DIRETA na API pública do VTEX, mesmo padrão de Época/WePink/Americanas/
// Mahogany/Lojas Pompéia. Rede de farmácia grande — achada e testada ao vivo em 01/08/2026 a
// pedido da Priscila (aumentar quantidade de lojas/produtos, mesmo sem comissão de afiliado).
// Catálogo enorme (2700+ resultados pra "hidratante") e finalmente traz marca de farmácia que
// nenhuma loja parceira vendia até agora (CeraVe, La Roche-Posay, Vichy, Neutrogena — testado
// ao vivo, todas com resultado real).
// Como é farmácia (vende remédio, fralda, alimento etc., não só beleza) — filtra pelo campo
// `categories`: todo produto de beleza real testado veio com prefixo "/Dermo e Beleza/"
// (confirmado com hidratante, batom, protetor solar, shampoo, cerave — sem nenhum produto
// fora do tema misturado).
const CACHE_TTL_MS = 30 * 60 * 1000;
const FETCH_TIMEOUT_MS = 8000;
const API_URL = 'https://www.extrafarma.com.br/api/catalog_system/pub/products/search';

const BEAUTY_CATEGORY_PREFIX = '/dermo e beleza';

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
        store: 'Extrafarma',
        link: 'https://www.extrafarma.com.br/' + encodeURIComponent(p.linkText) + '/p',
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
      console.log('EXTRAFARMA resposta não-OK, status:', res.status);
    }
  } catch (err) {
    console.log('EXTRAFARMA fetch falhou:', err.message);
  } finally {
    clearTimeout(timer);
  }

  const products = normalizeItems(raw);
  console.log('EXTRAFARMA produtos válidos:', products.length, '/', raw.length);
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
    console.log('EXTRAFARMA erro:', error.message);
    return new Response(JSON.stringify({ results: [], error: error.message }), { status: 200, headers });
  }
};

export const config = { path: '/.netlify/functions/extrafarma-search' };
