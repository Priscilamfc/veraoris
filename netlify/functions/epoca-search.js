// Época Cosméticos — chamada DIRETA na API pública do VTEX (mesma tecnologia da Americanas/
// Ama Beleza), sem passar pelo Apify: a API de catálogo responde sem exigir autenticação nem
// pagamento por busca, então não precisa de ator nenhum aqui, diferente da Americanas.
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutos, mesmo padrão das outras fontes
const FETCH_TIMEOUT_MS = 8000;
const API_URL = 'https://www.epocacosmeticos.com.br/api/catalog_system/pub/products/search';

let cache = {}; // { [query]: { data, fetchedAt } }

function bestAvailablePrice(product) {
  let best = null;
  (product.items || []).forEach((item) => {
    (item.sellers || []).forEach((seller) => {
      const offer = seller.commertialOffer || {};
      if (offer.IsAvailable && offer.Price) {
        // Testado em produção (23/07/2026): o campo já vem em reais (ex: 63.99), não em
        // centavos — dividir por 100 gerava preço 100x menor (R$0,64 em vez de R$63,99).
        const price = offer.Price;
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
      return {
        title: p.productName,
        price,
        store: 'Época Cosméticos',
        link: 'https://www.epocacosmeticos.com.br/' + encodeURIComponent(p.linkText) + '/p',
        image: image || null,
        brand: p.brand || null,
        // A página do produto (não a API) mostrou CAPTCHA num teste automatizado (22/07/2026) —
        // tratado como não confiável até a Priscila confirmar clicando de verdade, mesmo
        // tratamento que Eudora/Ama Beleza tiveram no início (cai no botão "Buscar na loja").
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
      console.log('EPOCA resposta não-OK, status:', res.status);
    }
  } catch (err) {
    console.log('EPOCA fetch falhou:', err.message);
  } finally {
    clearTimeout(timer);
  }

  const products = normalizeItems(raw);
  console.log('EPOCA produtos válidos:', products.length, '/', raw.length);
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
    console.log('EPOCA erro:', error.message);
    return { statusCode: 200, headers, body: JSON.stringify({ results: [], error: error.message }) };
  }
};
