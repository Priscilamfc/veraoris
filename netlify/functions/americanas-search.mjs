// Americanas — chamada DIRETA na API pública do VTEX (mesma tecnologia da Época/WePink),
// sem passar pelo Apify: descoberto em 24/07/2026 que a API de catálogo dela responde sem
// autenticação nem pagamento, igual às outras duas — não precisa mais de ator pago aqui.
// Substitui a versão anterior (ator gio21/americanas-product-scraper via Apify), abandonada
// porque os créditos grátis do Apify acabaram.
//
// MIGRADA (24/07/2026) pro runtime moderno do Netlify Functions — ver epoca-search.mjs pro
// contexto completo (elimina o limite de 4KB de variáveis de ambiente do modo antigo).
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutos, mesmo padrão das outras fontes
const FETCH_TIMEOUT_MS = 8000;
const API_URL = 'https://www.americanas.com.br/api/catalog_system/pub/products/search';

let cache = {}; // { [query]: { data, fetchedAt } }

// Americanas é marketplace geral (vende de tudo), então a busca por palavra livre da VTEX
// devolve muito ruído fora de beleza — testado com "batom": chocolate "Baton", lapiseira/
// caneta formato batom, kit escolar, boneca Barbie. O campo `categories` da própria API já
// classifica isso certinho (ex: "/Beleza e perfumaria/Maquiagem/Batom/" vs "/Papelaria/...",
// "/Alimentos e bebidas/...", "/Brinquedos/..."), então filtramos por ele em vez de tentar
// adivinhar toda palavra de exclusão possível (impossível de enumerar).
const BEAUTY_CATEGORY_PREFIX = '/beleza e perfumaria';
// Mesmo dentro de "Beleza e perfumaria" aparece brinquedo de maquiagem infantil mal
// categorizado (ex: "Kit de Maquiagem Infantil Angel Coroa... /Beleza e perfumaria/
// Maquiagem/") — rede de segurança extra pelo título.
const NON_BEAUTY_TITLE_HINTS = ['infantil', 'brinquedo', 'faz de conta'];

function isRealBeautyProduct(p) {
  const cats = (p.categories || []).map((c) => c.toLowerCase());
  if (!cats.some((c) => c.startsWith(BEAUTY_CATEGORY_PREFIX))) return false;
  const t = (p.productName || '').toLowerCase();
  return !NON_BEAUTY_TITLE_HINTS.some((h) => t.indexOf(h) >= 0);
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
      if (!price || !p.productName || !p.linkText) return null; // sem estoque em nenhum vendedor
      const firstItem = (p.items || [])[0];
      const image = firstItem && firstItem.images && firstItem.images[0] && firstItem.images[0].imageUrl;
      const brand = (p.brand && p.brand !== 'Não Disponível') ? p.brand : null;
      return {
        title: p.productName,
        price,
        store: 'Americanas',
        link: p.link || ('https://www.americanas.com.br/' + encodeURIComponent(p.linkText) + '/p'),
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
    const res = await fetch(API_URL + '?ft=' + encodeURIComponent(query), {
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
      console.log('AMERICANAS resposta não-OK, status:', res.status);
    }
  } catch (err) {
    console.log('AMERICANAS fetch falhou:', err.message);
  } finally {
    clearTimeout(timer);
  }

  const products = normalizeItems(raw);
  console.log('AMERICANAS produtos válidos:', products.length, '/', raw.length);
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
    console.log('AMERICANAS erro:', error.message);
    return new Response(JSON.stringify({ results: [], error: error.message }), { status: 200, headers });
  }
};

export const config = { path: '/.netlify/functions/americanas-search' };
