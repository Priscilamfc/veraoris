// WePink — chamada DIRETA na API pública do VTEX, mesmo padrão da Época. Diferente da Época,
// a página do produto foi testada e carrega normal (sem CAPTCHA) — por isso o link direto
// aqui é confiável (sem `linkOk:false`).
//
// MIGRADA (24/07/2026) pro runtime moderno do Netlify Functions — ver epoca-search.mjs pro
// contexto completo (elimina o limite de 4KB de variáveis de ambiente do modo antigo).
//
// Auditoria de 11/09/2026: a WePink não vende só maquiagem/cabelo/skincare — tem uma linha
// "wehot" de produtos íntimos/sensuais (gel excitante, calda beijável, óleo de massagem
// erótica) e uma linha "Bem estar" (óleo essencial de aromaterapia). Nenhuma das duas é
// beleza no sentido do site — e um termo comum de busca como "óleo" trazia esses produtos
// junto com óleo corporal de verdade, sem filtro nenhum até agora. `isOutOfScope()` exclui os
// dois inteiramente antes de chegar no site; `guessSubcat()` classifica o resto certo entre
// as 4 categorias usando o campo `categories` real.
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutos, mesmo padrão das outras fontes
const FETCH_TIMEOUT_MS = 8000;
const API_URL = 'https://www.wepink.com.br/api/catalog_system/pub/products/search';

let cache = {}; // { [query]: { data, fetchedAt } }

function isOutOfScope(categories) {
  const joined = (categories || []).join(' ').toLowerCase();
  return joined.indexOf('wehot') >= 0 || joined.indexOf('bem estar') >= 0;
}

function guessSubcat(categories) {
  const joined = (categories || []).join(' ').toLowerCase();
  if (joined.indexOf('/make') >= 0) return 'maquiagem';
  if (joined.indexOf('/hair') >= 0) return 'cabelo';
  if (joined.indexOf('/skincare') >= 0 || joined.indexOf('the cream') >= 0 ||
      joined.indexOf('bath&body') >= 0 || joined.indexOf('/body') >= 0) return 'skincare';
  if (joined.indexOf('perfum') >= 0) return 'perfumaria';
  return null;
}

function bestAvailablePrice(product) {
  let best = null;
  (product.items || []).forEach((item) => {
    (item.sellers || []).forEach((seller) => {
      const offer = seller.commertialOffer || {};
      if (offer.IsAvailable && offer.Price) {
        const price = offer.Price; // API devolve em reais (confirmado igual à Época)
        if (!best || price < best) best = price;
      }
    });
  });
  return best;
}

function normalizeItems(raw) {
  return (raw || [])
    .filter((p) => !isOutOfScope(p.categories))
    .map((p) => {
      const price = bestAvailablePrice(p);
      if (!price || !p.productName || !p.linkText) return null; // sem estoque em nenhum vendedor
      const firstItem = (p.items || [])[0];
      const image = firstItem && firstItem.images && firstItem.images[0] && firstItem.images[0].imageUrl;
      return {
        title: p.productName,
        price,
        store: 'WePink',
        link: 'https://www.wepink.com.br/' + encodeURIComponent(p.linkText) + '/p',
        image: image || null,
        brand: p.brand || null,
        category: guessSubcat(p.categories)
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
      console.log('WEPINK resposta não-OK, status:', res.status);
    }
  } catch (err) {
    console.log('WEPINK fetch falhou:', err.message);
  } finally {
    clearTimeout(timer);
  }

  const products = normalizeItems(raw);
  console.log('WEPINK produtos válidos:', products.length, '/', raw.length);
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
    console.log('WEPINK erro:', error.message);
    return new Response(JSON.stringify({ results: [], error: error.message }), { status: 200, headers });
  }
};

export const config = { path: '/.netlify/functions/wepink-search' };
