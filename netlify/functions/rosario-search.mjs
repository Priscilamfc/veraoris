// Drogaria Rosário — chamada DIRETA na API pública do VTEX, mesmo padrão de
// Época/WePink/Americanas/Mahogany/Lojas Pompéia/Extrafarma/Venâncio/Drogal/Pague
// Menos/Catarinense/São João. Rede de farmácia — achada e testada ao vivo em 04-05/08/2026,
// mesmo pedido da Priscila (aumentar quantidade de lojas/produtos, mesmo sem comissão).
// Traz marca de farmácia de verdade (Cetaphil testado ao vivo, resultado real).
// Farmácia (vende de tudo) — filtra pelo campo `categories`. Espalha beleza em 3 raízes
// separadas: "/Dermocosméticos/" (rosto/marca de farmácia), "/Maquiagem/" e "/Cuidados Com
// Os Cabelos/". Achada bastante contaminação testando "hidratante": produtos infantis
// (Pampers, óleo/loção/lenço de bebê) aparecem inteiros sob "/Infantil/" — não entra na
// lista, só as 3 raízes de beleza de verdade.
const CACHE_TTL_MS = 30 * 60 * 1000;
const FETCH_TIMEOUT_MS = 8000;
const API_URL = 'https://www.drogariarosario.com.br/api/catalog_system/pub/products/search';
const BEAUTY_CATEGORY_PREFIXES = ['/dermocosméticos', '/maquiagem', '/cuidados com os cabelos'];

let cache = {}; // { [query]: { data, fetchedAt } }

function isRealBeautyProduct(p) {
  const cats = (p.categories || []).map((c) => c.toLowerCase());
  return cats.some((c) => BEAUTY_CATEGORY_PREFIXES.some((prefix) => c.startsWith(prefix)));
}

// Deriva subcategoria (skincare/maquiagem/cabelo/perfumaria) do campo `categories` que a
// própria loja devolve — mais confiável que adivinhar pelo título do lado do site (achado ao
// vivo, 05/08/2026: título de perfume às vezes não tem nenhuma palavra de perfume, só o nome
// da fragrância). `null` quando não dá pra afirmar, cai no palpite por título sem regressão.
function guessSubcat(categories) {
  const joined = (categories || []).join(' ').toLowerCase();
  if (joined.indexOf('fragrânc') >= 0 || joined.indexOf('perfum') >= 0 || joined.indexOf('colônia') >= 0 || joined.indexOf('colonia') >= 0) return 'perfumaria';
  if (joined.indexOf('maquiagem') >= 0 || joined.indexOf('make') >= 0) return 'maquiagem';
  if (joined.indexOf('cabelo') >= 0 || joined.indexOf('capilar') >= 0) return 'cabelo';
  // "Leite de Colônia" (loção corporal) tem "colônia" no título mas é skincare de
  // verdade -- achado ao vivo 06/08/2026, mesmo padrão em todas as functions de farmácia.
  if (joined.indexOf('cuidados com a pele') >= 0 || joined.indexOf('dermocosmétic') >= 0 || joined.indexOf('dermocosmetic') >= 0 || joined.indexOf('rosto') >= 0) return 'skincare';
  return null;
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
        store: 'Drogaria Rosário',
        link: 'https://www.drogariarosario.com.br/' + encodeURIComponent(p.linkText) + '/p',
        image: image || null,
        brand,
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
      console.log('ROSARIO resposta não-OK, status:', res.status);
    }
  } catch (err) {
    console.log('ROSARIO fetch falhou:', err.message);
  } finally {
    clearTimeout(timer);
  }

  const products = normalizeItems(raw);
  console.log('ROSARIO produtos válidos:', products.length, '/', raw.length);
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
    console.log('ROSARIO erro:', error.message);
    return new Response(JSON.stringify({ results: [], error: error.message }), { status: 200, headers });
  }
};

export const config = { path: '/.netlify/functions/rosario-search' };
