const zlib = require('zlib');

// Cada loja aprovada na Awin com feed de produtos entra aqui como uma variável de ambiente
// nova no Netlify. Todas são buscadas e combinadas — não precisa mexer no resto do código
// pra adicionar mais uma loja, só configurar a variável correspondente no Netlify.
//
// Eudora OCULTA (22/07/2026, decisão da Priscila): mesmo com feed novo, o link direto de
// produto continua quebrado na prática (confirmado por teste manual dela) — problema
// estrutural do lado da loja, não é mais "só gerar feed novo". Até a Awin/Eudora corrigir
// de verdade, ela fica fora da comparação inteira (preço/foto/link), não só com o link
// marcado como não confiável. Reversível: trocar EUDORA_ENABLED de volta pra true.
const EUDORA_ENABLED = false;
// Ama Beleza REATIVADA (24/07/2026, mesma sessão): estava oculta porque o feed "nunca trazia
// produto nenhum" — CAUSA REAL ENCONTRADA: a variável no Netlify se chama
// AWIN_AMOBELEZA_FEED_URL ("AMO", igual ao domínio real da loja amobeleza.com.br) mas o código
// lia AWIN_AMABELEZA_FEED_URL ("AMA") — nome errado, sempre undefined, feed nunca era buscado
// de verdade. Corrigido. Reativando pra testar se o feed em si funciona agora. Se voltar a dar
// problema (feed vazio de verdade, não erro de nome), trocar de volta pra false.
const AMABELEZA_ENABLED = true;
const FEED_URLS = [
  EUDORA_ENABLED ? process.env.AWIN_EUDORA_FEED_URL : null,
  process.env.AWIN_LOCCITANE_FEED_URL,
  AMABELEZA_ENABLED ? process.env.AWIN_AMOBELEZA_FEED_URL : null,
  process.env.AWIN_NATURA_FEED_URL,
  process.env.AWIN_FOREVERLISS_FEED_URL,
  process.env.AWIN_BOTICARIO_FEED_URL
].filter(Boolean);
console.log('AWIN variáveis configuradas -> Eudora:', EUDORA_ENABLED ? !!process.env.AWIN_EUDORA_FEED_URL : 'OCULTA (EUDORA_ENABLED=false)', '| L\'Occitane:', !!process.env.AWIN_LOCCITANE_FEED_URL, '| Ama Beleza:', AMABELEZA_ENABLED ? !!process.env.AWIN_AMOBELEZA_FEED_URL : 'OCULTA (AMABELEZA_ENABLED=false)', '| Natura:', !!process.env.AWIN_NATURA_FEED_URL, '| Forever Liss:', !!process.env.AWIN_FOREVERLISS_FEED_URL, '| Boticário:', !!process.env.AWIN_BOTICARIO_FEED_URL, '| total feeds:', FEED_URLS.length);
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutos

let cache = { data: null, fetchedAt: 0 };

function parseCsvLine(line) {
  const fields = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }
        else { inQuotes = false; }
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      fields.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  fields.push(cur);
  return fields;
}

async function fetchOneFeed(feedUrl) {
  const res = await fetch(feedUrl);
  const buf = Buffer.from(await res.arrayBuffer());
  // Nem todo feed vem comprimido em gzip — depende de como a pessoa gerou o feed no painel da
  // Awin (a Natura, por exemplo, veio como CSV puro, sem compressão, diferente dos outros).
  // Tenta descomprimir; se não for gzip válido, trata como CSV direto.
  let decompressed;
  try {
    decompressed = zlib.gunzipSync(buf).toString('utf-8');
  } catch (err) {
    decompressed = buf.toString('utf-8');
  }
  const lines = decompressed.split('\n').filter(Boolean);
  const header = parseCsvLine(lines[0]).map((h) => h.trim());
  const idx = {};
  header.forEach((h, i) => { idx[h] = i; });

  const products = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length < header.length) continue;
    const price = parseFloat(cols[idx.search_price] || cols[idx.display_price] || cols[idx.store_price] || '0');
    if (!price) continue;
    products.push({
      name: cols[idx.product_name] || '',
      price: price,
      link: cols[idx.aw_deep_link] || cols[idx.merchant_deep_link] || '',
      image: cols[idx.aw_image_url] || cols[idx.merchant_image_url] || '',
      merchant: cols[idx.merchant_name] || ''
    });
  }
  console.log('AWIN feed', feedUrl.split('/fid/')[1] ? 'fid ' + feedUrl.split('/fid/')[1].split('/')[0] : '(?)', '->', products.length, 'produtos,', products.filter((p) => p.image).length, 'com foto');
  return products;
}

// DESATIVADO (15/07): mesmo problema do LINK_CHECK_ENABLED abaixo — essa checagem buscava
// cada imagem a partir da function do Netlify (servidor) pra medir o tamanho do arquivo e
// detectar o gráfico genérico "sem foto disponível" da Ama Beleza. Mas logo depois de ligar a
// checagem de link (que provou ter o mesmo tipo de bloqueio), as fotos de produto pararam de
// aparecer pra QUALQUER loja, não só Ama Beleza — sinal de que essas requisições de servidor
// também estão sendo bloqueadas/alteradas na origem (CDN de imagem), fazendo a checagem
// descartar foto real por engano. Desativada até dar pra confirmar a causa de verdade.
const PLACEHOLDER_MAX_BYTES = 8000;
const CHECK_TIMEOUT_MS = 4500;
const IMAGE_CHECK_ENABLED = false;
function fetchWithTimeout(url, ms) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), ms);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(t));
}
async function isLikelyPlaceholderImage(url) {
  if (!url) return false;
  try {
    const res = await fetchWithTimeout(url, CHECK_TIMEOUT_MS);
    const len = parseInt(res.headers.get('content-length') || '0', 10);
    return len > 0 && len < PLACEHOLDER_MAX_BYTES;
  } catch (err) {
    return false;
  }
}

// DESATIVADO (15/07): a checagem abaixo buscava a página do produto pra detectar link morto/
// fora de estoque, mas em produção estava dando falso positivo em quase todo link da Eudora e
// da Ama Beleza — provavelmente essas lojas bloqueiam ou servem conteúdo diferente pra pedidos
// vindos de servidor (sem cabeçalho de navegador real, sem cookies), não de uma pessoa de
// verdade. Resultado: o site estava jogando cliques de link que FUNCIONAM pro Google por engano,
// e ainda gastando tempo de execução (custo) da function à toa em toda busca. Até alguém
// conseguir testar/confirmar uma correção de verdade (ex: enviar um User-Agent de navegador),
// os links do feed voltam a ser usados diretamente, sem essa checagem.
const LINK_CHECK_ENABLED = false;
// Ama Beleza e Eudora tiveram o link direto do produto confirmado quebrado na prática (feed
// desatualizado em relação ao catálogo ao vivo da loja). Regra fixa baseada em teste real de uma
// pessoa — sem depender de nenhuma requisição extra (a checagem via servidor mostrou falso
// positivo por bloqueio anti-bot, ver LINK_CHECK_ENABLED acima). Remover cada loja da lista
// quando o link dela voltar a ser confiável na prática.
// Ama Beleza removida em 22/07/2026: gerou feed novo na Awin, testado (2 produtos reais,
// diferentes) e os dois foram pro produto certo (um em estoque, outro esgotado mas página certa).
const UNRELIABLE_LINK_STORES = ['eudora'];
function hasUnreliableLink(storeName) {
  var s = (storeName || '').toLowerCase();
  return UNRELIABLE_LINK_STORES.some(function (k) { return s.indexOf(k) >= 0; });
}
const DEAD_PAGE_PATTERNS = [
  'não existe mais', 'nao existe mais', 'página não encontrada', 'pagina nao encontrada',
  'produto não encontrado', 'produto nao encontrado', 'not found', 'esta página não existe',
  'esta pagina nao existe', 'não encontramos', 'nao encontramos', 'página indisponível',
  'pagina indisponivel', 'produto indisponível', 'produto indisponivel',
  // Produto ainda existe na loja, mas sem estoque — pro usuário é a mesma frustração de um
  // link morto (clica em "Comprar" e não dá pra comprar nada), então trata igual.
  'não está disponível', 'nao esta disponivel', 'indisponível no momento', 'indisponivel no momento',
  'fora de estoque', 'sem estoque', 'esgotado', 'out of stock', 'quero saber quando estiver disponível',
  'avise-me quando chegar', 'avise quando chegar'
];
async function isDeadProductLink(url) {
  if (!url) return true;
  try {
    const res = await fetchWithTimeout(url, CHECK_TIMEOUT_MS);
    if (!res.ok) return true;
    const text = (await res.text()).toLowerCase();
    return DEAD_PAGE_PATTERNS.some((p) => text.includes(p));
  } catch (err) {
    return false; // falha de rede/timeout: não penaliza, mantém o link como estava
  }
}

async function fetchFeed() {
  const now = Date.now();
  if (cache.data && (now - cache.fetchedAt) < CACHE_TTL_MS) {
    return cache.data;
  }
  const results = await Promise.all(FEED_URLS.map((url) => fetchOneFeed(url).catch((err) => {
    console.log('AWIN feed falhou:', err.message);
    return [];
  })));
  const products = results.flat();
  cache = { data: products, fetchedAt: now };
  console.log('AWIN total combinado:', products.length, 'produtos de', FEED_URLS.length, 'loja(s)');
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
    if (!FEED_URLS.length) {
      return { statusCode: 200, headers, body: JSON.stringify({ results: [], error: 'Nenhum feed da Awin configurado no Netlify.' }) };
    }

    const params = event.queryStringParameters || {};
    const query = (params.query || '').toLowerCase().trim();
    if (!query) {
      return { statusCode: 200, headers, body: JSON.stringify({ results: [] }) };
    }

    const products = await fetchFeed();
    const terms = query.split(/\s+/).filter(Boolean);

    const scored = products
      .map((p) => {
        const nameLower = p.name.toLowerCase();
        const score = terms.reduce((acc, t) => acc + (nameLower.includes(t) ? 1 : 0), 0);
        return { p, score };
      })
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score);

    // Uma loja com catálogo muito maior (ex: Eudora, 1797 produtos) pode sozinha preencher os
    // 10 primeiros lugares e nunca deixar uma loja menor (ex: L'Occitane, 274 produtos) aparecer,
    // mesmo quando ela também tem produtos relevantes. Round-robin por loja garante que todas as
    // lojas com resultado relevante apareçam, em vez de só a com mais produtos no feed.
    const byStore = new Map();
    scored.forEach((m) => {
      const key = m.p.merchant || 'Eudora';
      if (!byStore.has(key)) byStore.set(key, []);
      byStore.get(key).push(m);
    });
    const queues = Array.from(byStore.values());
    const balanced = [];
    let i = 0;
    while (balanced.length < 10 && queues.some((q) => q.length > i)) {
      queues.forEach((q) => {
        if (balanced.length < 10 && q[i]) balanced.push(q[i]);
      });
      i++;
    }

    const matches = balanced.map((m) => {
      const store = m.p.merchant || 'Eudora';
      const entry = {
        title: m.p.name,
        price: m.p.price,
        store: store,
        link: m.p.link,
        image: m.p.image || null
      };
      if (hasUnreliableLink(store)) entry.linkOk = false;
      return entry;
    });

    let placeholderCount = 0;
    let deadLinkCount = 0;
    await Promise.all(matches.map(async (m) => {
      const checks = [];
      if (IMAGE_CHECK_ENABLED && m.image) checks.push(isLikelyPlaceholderImage(m.image).then((dead) => { if (dead) { m.image = null; placeholderCount++; } }));
      if (LINK_CHECK_ENABLED) checks.push(isDeadProductLink(m.link).then((dead) => { if (dead) { m.linkOk = false; deadLinkCount++; } }));
      await Promise.all(checks);
    }));

    console.log('AWIN busca "' + query + '" ->', matches.length, 'resultado(s), lojas:', matches.map((m) => m.store).join(', '), '|', placeholderCount, 'imagem(ns) placeholder,', deadLinkCount, 'link(s) morto(s) descartado(s)');
    return { statusCode: 200, headers, body: JSON.stringify({ results: matches }) };
  } catch (error) {
    return { statusCode: 200, headers, body: JSON.stringify({ results: [], error: error.message }) };
  }
};
