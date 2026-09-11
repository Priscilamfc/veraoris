// Dermage — chamada DIRETA na API pública do VTEX, mesmo padrão da WePink/Mahogany/Payot.
// Marca própria, mas MULTI-categoria de verdade (skincare, maquiagem/proteção solar com cor,
// cabelo) — auditoria de 11/09/2026 corrigiu a suposição antiga de "sem risco de categoria":
// usa guessSubcat() (ver abaixo) pra classificar pelo campo `categories` real da API, em vez
// de confiar só no título.
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutos, mesmo padrão das outras fontes
const FETCH_TIMEOUT_MS = 8000;
const API_URL = 'https://www.dermage.com.br/api/catalog_system/pub/products/search';

let cache = {}; // { [query]: { data, fetchedAt } }

// Deriva subcategoria (skincare/maquiagem/cabelo/perfumaria) do campo `categories` real —
// achado na auditoria de 11/09/2026: a Dermage é MARCA PRÓPRIA MAS multi-categoria de
// verdade (skincare, maquiagem própria de proteção solar tipo "Base"/"Photoage", cabelo),
// diferente do que o comentário antigo deste arquivo assumia. A VTEX marca protetor solar
// puro E "Base"/tinted sunscreen sob a MESMA raiz genérica "/Maquiagem/Proteção Solar/" —
// por isso só a raiz genérica não basta; exige uma subcategoria de maquiagem ESPECÍFICA
// (Base, Batom, Corretivo, Pó Facial, Máscara de Cílios, Olhos, Lábios, Acessórios) pra
// classificar como maquiagem de verdade. Sem isso, "Base Alta Cobertura FPS45" ficava sem
// nenhuma palavra de MAKEUP_ONLY_NOUNS (só tem "base líquida"/"base liquida", não "base"
// sozinho) e vazava pro filtro de Skincare — exatamente o bug relatado pela Priscila.
function guessSubcat(categories) {
  const joined = (categories || []).join(' ').toLowerCase();
  if (joined.indexOf('/maquiagem/base') >= 0 || joined.indexOf('/maquiagem/batom') >= 0 ||
      joined.indexOf('/maquiagem/corretivo') >= 0 || joined.indexOf('po facial') >= 0 ||
      joined.indexOf('pó facial') >= 0 || joined.indexOf('máscara de cílios') >= 0 ||
      joined.indexOf('mascara de cilios') >= 0 || joined.indexOf('/maquiagem/olhos') >= 0 ||
      joined.indexOf('/maquiagem/labios') >= 0 || joined.indexOf('/maquiagem/lábios') >= 0 ||
      joined.indexOf('/maquiagem/acessórios') >= 0 || joined.indexOf('/maquiagem/acessorios') >= 0) return 'maquiagem';
  if (joined.indexOf('/cabelo') >= 0) return 'cabelo';
  if (joined.indexOf('/rosto') >= 0 || joined.indexOf('/corpo') >= 0 || joined.indexOf('fotoproteção') >= 0 ||
      joined.indexOf('fotoprotecao') >= 0 || joined.indexOf('nutraceutic') >= 0) return 'skincare';
  if (joined.indexOf('perfum') >= 0) return 'perfumaria';
  return null;
}

function bestAvailablePrice(product) {
  let best = null;
  (product.items || []).forEach((item) => {
    (item.sellers || []).forEach((seller) => {
      const offer = seller.commertialOffer || {};
      if (offer.IsAvailable && offer.Price) {
        const price = offer.Price; // API devolve em reais (mesmo formato confirmado nas outras VTEX)
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
        store: 'Dermage',
        link: 'https://www.dermage.com.br/' + encodeURIComponent(p.linkText) + '/p',
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
      console.log('DERMAGE resposta não-OK, status:', res.status);
    }
  } catch (err) {
    console.log('DERMAGE fetch falhou:', err.message);
  } finally {
    clearTimeout(timer);
  }

  const products = normalizeItems(raw);
  console.log('DERMAGE produtos válidos:', products.length, '/', raw.length);
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
    console.log('DERMAGE erro:', error.message);
    return new Response(JSON.stringify({ results: [], error: error.message }), { status: 200, headers });
  }
};

export const config = { path: '/.netlify/functions/dermage-search' };
