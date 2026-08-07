// Drogal — chamada DIRETA na API pública do VTEX, mesmo padrão de
// Época/WePink/Americanas/Mahogany/Lojas Pompéia/Extrafarma/Venâncio. Rede de farmácia — achada
// e testada ao vivo em 01/08/2026, mesmo pedido da Priscila (aumentar quantidade de lojas/
// produtos, mesmo sem comissão de afiliado). Catálogo grande (2200+ pra "hidratante") e traz
// marca de farmácia (CeraVe testado ao vivo, resultado real).
// Farmácia (vende de tudo) — filtra pelo campo `categories`. Achado testando mais termos
// (02/08/2026): diferente de Americanas/Lojas Pompéia/Extrafarma/Venâncio, a Drogal NÃO usa um
// único guarda-chuva "/Beleza/" pra tudo — maquiagem fica em "/Beleza/", mas hidratante/
// protetor solar ficam em "/Cuidados com a Pele/", shampoo em "/Cuidados com o Cabelo/" e marca
// de farmácia (CeraVe etc.) em "/Dermocosméticos/". Com só "/Beleza/" na lista, a busca de
// "hidratante" (e de qualquer skincare/cabelo) voltava vazia. Ampliado pras 4 categorias reais
// de beleza dela — "Farmácia em Casa", "Higiene Íntima" etc. continuam de fora de propósito.
const CACHE_TTL_MS = 30 * 60 * 1000;
const FETCH_TIMEOUT_MS = 8000;
const API_URL = 'https://www.drogal.com.br/api/catalog_system/pub/products/search';
const BEAUTY_CATEGORY_PREFIXES = ['/beleza', '/cuidados com a pele', '/cuidados com o cabelo', '/dermocosméticos'];

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
  // Ordem importa: raizes de categoria tipo "Beleza e Perfumaria" (Americanas) contem a
  // palavra "perfum" mesmo pra produto que nao e perfume nenhum -- checar maquiagem/cabelo/
  // skincare (mais especificos) primeiro evita falso positivo (achado ao vivo 06/08/2026).
  if (joined.indexOf('maquiagem') >= 0 || joined.indexOf('make') >= 0) return 'maquiagem';
  if (joined.indexOf('cabelo') >= 0 || joined.indexOf('capilar') >= 0) return 'cabelo';
  // Achado ao vivo (06/08/2026): "Leite Corporal Leite de Colônia" (loção/limpeza, marca
  // usa "Colônia" no nome) tem a palavra "colônia" no TÍTULO mas a própria loja classifica
  // como "/Higiene & Beleza/Cuidados com a pele/" -- skincare, não perfume. Sem detectar
  // esse sinal aqui, o filtro de Perfumaria (que confia em PERFUME_ONLY_NOUNS por texto
  // quando `structCat` não desmente) aceitava esse produto por engano.
  if (joined.indexOf('cuidados com a pele') >= 0 || joined.indexOf('dermocosmétic') >= 0 || joined.indexOf('dermocosmetic') >= 0 || joined.indexOf('rosto') >= 0 || joined.indexOf('skincare') >= 0 || joined.indexOf('desodorante') >= 0 || joined.indexOf('higiene pessoal') >= 0) return 'skincare';
  if (joined.indexOf('fragrânc') >= 0 || joined.indexOf('perfum') >= 0 || joined.indexOf('colônia') >= 0 || joined.indexOf('colonia') >= 0) return 'perfumaria';
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
        store: 'Drogal',
        link: 'https://www.drogal.com.br/' + encodeURIComponent(p.linkText) + '/p',
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
      console.log('DROGAL resposta não-OK, status:', res.status);
    }
  } catch (err) {
    console.log('DROGAL fetch falhou:', err.message);
  } finally {
    clearTimeout(timer);
  }

  const products = normalizeItems(raw);
  console.log('DROGAL produtos válidos:', products.length, '/', raw.length);
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
    console.log('DROGAL erro:', error.message);
    return new Response(JSON.stringify({ results: [], error: error.message }), { status: 200, headers });
  }
};

export const config = { path: '/.netlify/functions/drogal-search' };
