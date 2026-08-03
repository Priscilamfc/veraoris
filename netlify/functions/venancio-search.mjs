// Drogaria Venâncio — chamada DIRETA na API pública do VTEX, mesmo padrão de
// Época/WePink/Americanas/Mahogany/Lojas Pompéia/Extrafarma. Rede de farmácia — achada e
// testada ao vivo em 01/08/2026, mesmo pedido da Priscila (aumentar quantidade de lojas/
// produtos, mesmo sem comissão de afiliado). Também traz marca de farmácia (CeraVe, La
// Roche-Posay, Vichy testados ao vivo, todas com resultado real).
// Farmácia (vende de tudo) — filtra pelo campo `categories`. Achado testando mais termos
// (02/08/2026): a Venâncio espalha beleza em 3 raízes — maquiagem/perfume em "/Beleza/", marca
// de farmácia em "/Dermocosméticos/", e shampoo/protetor solar/sabonete dentro de
// "/Higiene e Cuidados Pessoais/..." (mas essa raiz TAMBÉM tem "Higiene Oral" — escova de
// dente — então só aceita as subcategorias reais de beleza dentro dela, nunca a raiz inteira).
const BEAUTY_CATEGORY_PREFIXES = [
  '/beleza',
  '/dermocosméticos',
  '/higiene e cuidados pessoais/cuidados cabelos',
  '/higiene e cuidados pessoais/solar',
  '/higiene e cuidados pessoais/banho e pós banho'
];

let cache = {}; // { [query]: { data, fetchedAt } }

function isRealBeautyProduct(p) {
  const cats = (p.categories || []).map((c) => c.toLowerCase());
  return cats.some((c) => BEAUTY_CATEGORY_PREFIXES.some((prefix) => c.startsWith(prefix)));
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
        store: 'Drogaria Venâncio',
        link: 'https://www.drogariavenancio.com.br/' + encodeURIComponent(p.linkText) + '/p',
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
      console.log('VENANCIO resposta não-OK, status:', res.status);
    }
  } catch (err) {
    console.log('VENANCIO fetch falhou:', err.message);
  } finally {
    clearTimeout(timer);
  }

  const products = normalizeItems(raw);
  console.log('VENANCIO produtos válidos:', products.length, '/', raw.length);
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
    console.log('VENANCIO erro:', error.message);
    return new Response(JSON.stringify({ results: [], error: error.message }), { status: 200, headers });
  }
};

export const config = { path: '/.netlify/functions/venancio-search' };
