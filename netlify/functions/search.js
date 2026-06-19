const CLIENT_ID = process.env.ML_CLIENT_ID;
const CLIENT_SECRET = process.env.ML_CLIENT_SECRET;

async function getToken() {
  const res = await fetch('https://api.mercadolibre.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error('Auth failed: ' + (data.message || JSON.stringify(data)));
  }
  return data.access_token;
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
    if (!CLIENT_ID || !CLIENT_SECRET) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ error: 'Variáveis de ambiente ML_CLIENT_ID / ML_CLIENT_SECRET não configuradas no Netlify.' })
      };
    }

    const params = event.queryStringParameters || {};
    const { skin, hair_type, concern, hair_concern, maq_area, maq_prod,
            skin_prod, hair_prod, budget, cat } = params;

    let queries = [];

    if (cat === 'skincare') {
      const skinProdMap = {
        sabonete: 'sabonete facial limpeza',
        agua_mic: 'água micelar',
        hidratante: 'hidratante facial',
        serum: 'sérum facial',
        protetor: 'protetor solar facial',
        esfoliante: 'esfoliante facial',
        mascara_f: 'máscara facial',
        acido: 'ácido hialurônico sérum',
        creme_olhos: 'creme olhos contorno'
      };
      if (skin_prod && skinProdMap[skin_prod]) queries.push(skinProdMap[skin_prod]);
      else if (concern === 'hidratacao') queries.push('hidratante facial');
      else if (concern === 'acne') queries.push('sérum acne pele oleosa');
      else if (concern === 'antiidade') queries.push('anti-idade sérum facial');
      else if (concern === 'manchas') queries.push('clareador manchas facial');
      else if (concern === 'solar') queries.push('protetor solar facial');
      else if (concern === 'limpeza') queries.push('gel de limpeza facial');
      else queries.push('skincare facial');
    } else if (cat === 'cabelo') {
      const hairProdMap = {
        shampoo: 'shampoo capilar',
        condicionador: 'condicionador capilar',
        mascara: 'máscara hidratação capilar',
        leave_in: 'leave-in capilar',
        oleo: 'óleo capilar',
        serum_cap: 'sérum capilar',
        protetor_term: 'protetor térmico cabelo',
        tonico: 'tônico capilar',
        creme_pent: 'creme de pentear',
        ampola: 'ampola tratamento capilar'
      };
      if (hair_prod && hairProdMap[hair_prod]) queries.push(hairProdMap[hair_prod]);
      else if (hair_concern === 'antiqueda') queries.push('shampoo antiqueda cabelo');
      else if (hair_concern === 'anticaspa') queries.push('shampoo anticaspa');
      else if (hair_concern === 'hidratacao') queries.push('máscara hidratação capilar');
      else if (hair_concern === 'coloridos') queries.push('shampoo cabelos coloridos');
      else if (hair_concern === 'reconstrucao') queries.push('reconstrução capilar ampola');
      else if (hair_concern === 'brilho') queries.push('leave-in brilho capilar');
      else if (hair_concern === 'volume') queries.push('volumizador capilar');
      else if (hair_concern === 'definicao') queries.push('definidor cachos cabelo');
      else queries.push('tratamento capilar');
    } else if (cat === 'maquiagem') {
      const maqRosto = { base_liq:'base líquida maquiagem', base_po:'base pó facial', bb_cream:'bb cream', primer:'primer facial maquiagem', corretivo:'corretivo facial', po_compacto:'pó compacto facial', bronzer:'bronzer maquiagem', blush:'blush maquiagem', iluminador:'iluminador facial maquiagem' };
      const maqOlhos = { sombra:'paleta sombras maquiagem', rimel:'rímel máscara cílios', delineador:'delineador olhos', lapis_olho:'lápis olho maquiagem' };
      const maqLabios = { batom:'batom labial', gloss:'gloss labial', lip_liner:'lápis boca contorno', lip_balm:'lip balm hidratante labial' };

      if (maq_area === 'rosto') queries.push(maqRosto[maq_prod] || 'maquiagem rosto');
      else if (maq_area === 'olhos') queries.push(maqOlhos[maq_prod] || 'maquiagem olhos');
      else if (maq_area === 'labios') queries.push(maqLabios[maq_prod] || 'maquiagem lábios batom');
      else if (maq_area === 'sobrancelhas') queries.push('lápis sobrancelha maquiagem');
      else queries.push('kit maquiagem');
    } else {
      queries.push('kit cosméticos beleza');
    }

    const query = queries[queries.length - 1] || 'cosméticos beleza';
    const token = await getToken();

    const searchUrl = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(query)}&limit=18`;
    const res = await fetch(searchUrl, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();

    if (!res.ok) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          error: 'Mercado Livre API: ' + (data.message || data.error || ('HTTP ' + res.status)),
          debug: data
        })
      };
    }

    const results = data.results || [];
    let filtered = results;

    if (budget) {
      const ranges = {
        economico: [0, 50],
        medio: [50, 200],
        premium: [200, 999999]
      };
      const range = ranges[budget] || [0, 999999];
      filtered = results.filter(p => p.price >= range[0] && p.price <= range[1]);
      if (filtered.length === 0) filtered = results;
    }

    const products = filtered.slice(0, 12).map(p => ({
      id: p.id,
      title: p.title,
      price: p.price,
      original_price: p.original_price,
      currency: p.currency_id,
      thumbnail: p.thumbnail ? p.thumbnail.replace('I.jpg', 'O.jpg') : p.thumbnail,
      url: p.permalink,
      rating: (p.reviews && p.reviews.rating_average) || null,
      reviews: (p.reviews && p.reviews.total) || null,
      store: 'Mercado Livre',
      condition: p.condition,
      sold: p.sold_quantity
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        query: query,
        total: products.length,
        products: products
      })
    };

  } catch (error) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
