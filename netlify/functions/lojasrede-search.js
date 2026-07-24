// Lojas Rede — chamada DIRETA na API pública do VTEX, mesmo padrão da Época/WePink/Americanas.
// Loja focada em beleza (categorias testadas em 24/07/2026 só devolveram "Maquiagem/..."),
// não precisa do filtro de categoria pesado que a Americanas (marketplace geral) precisa.
// Link direto ainda não testado clicando de verdade (só a API) — `linkOk:false` por segurança,
// mesmo tratamento inicial que Eudora/Ama Beleza/Época tiveram até confirmação manual.
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutos, mesmo padrão das outras fontes
const FETCH_TIMEOUT_MS = 8000;
const API_URL = 'https://www.lojasrede.com.br/api/catalog_system/pub/products/search';

let cache = {}; // { [query]: { data, fetchedAt } }

function bestAvailablePrice(product) {
  let best = null;
  (product.items || []).forEach((item) => {
    (item.sellers || []).forEach((seller) => {
      const offer = seller.commertialOffer || {};
      if (offer.IsAvailable && offer.Price) {
        const price = offer.Price; // API devolve em reais, igual Época/WePink/Americanas
        if (!best || price < best) best = price;
      }
    });
  });
  return best;
}

function normalizeItems(raw) {
  return (raw || [])
    .map((p) => {
      const price = bestAvailablePrice(p);
      if (!price || !p.productName || !p.linkText) return null; // sem estoque em nenhum vendedor
      const firstItem = (p.items || [])[0];
      const image = firstItem && firstItem.images && firstItem.images[0] && firstItem.images[0].imageUrl;
      const brand = (p.brand && p.brand !== 'Não Disponível') ? p.brand : null;
      return {
        title: p.productName,
        price,
        store: 'Lojas Rede',
        link: p.link || ('https://www.lojasrede.com.br/' + encodeURIComponent(p.linkText) + '/p'),
        image: image || null,
        brand,
        linkOk: false
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
      console.log('LOJASREDE resposta não-OK, status:', res.status);
    }
  } catch (err) {
    console.log('LOJASREDE fetch falhou:', err.message);
  } finally {
    clearTimeout(timer);
  }

  const products = normalizeItems(raw);
  console.log('LOJASREDE produtos válidos:', products.length, '/', raw.length);
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
    const params = event.queryStringParameters || {};
    const query = (params.query || '').trim();
    if (!query) {
      return { statusCode: 200, headers, body: JSON.stringify({ results: [] }) };
    }

    const products = await fetchFeed(query);
    return { statusCode: 200, headers, body: JSON.stringify({ results: products }) };
  } catch (error) {
    console.log('LOJASREDE erro:', error.message);
    return { statusCode: 200, headers, body: JSON.stringify({ results: [], error: error.message }) };
  }
};
