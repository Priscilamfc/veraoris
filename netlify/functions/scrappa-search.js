const SCRAPPA_KEY = process.env.SCRAPPA_KEY;

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
    if (!SCRAPPA_KEY) {
      return { statusCode: 200, headers, body: JSON.stringify({ merged: [], error: 'SCRAPPA_KEY não configurada no Netlify.' }) };
    }

    const params = event.queryStringParameters || {};
    const query = params.query || '';
    const gl = params.gl || 'br';
    const url = 'https://scrappa.co/api/search-advanced?query=' + encodeURIComponent(query) + '&gl=' + encodeURIComponent(gl) + '&search_type=shop';

    const res = await fetch(url, { headers: { 'X-API-KEY': SCRAPPA_KEY } });
    const data = await res.json();

    const products = data.popular_products || [];
    const prices = data.immersive_products || [];
    console.log('SCRAPPA sample immersive_products[0] keys:', JSON.stringify(Object.keys(prices[0] || {})));
    console.log('SCRAPPA sample popular_products[0] keys:', JSON.stringify(Object.keys(products[0] || {})));
    const merged = [];
    for (let i = 0; i < prices.length; i++) {
      const pr = prices[i];
      const match = products[i] || null;
      const src = match ? match.source : null;
      if (pr.extracted_price) {
        var img = pr.thumbnail || (match && match.thumbnail) || null;
        // Try every field name Google Shopping / Scrappa might use for the direct product
        // link, so the "Ir →" button lands on the exact product, not the store's homepage.
        var link = (match && (match.link || match.product_link)) || pr.link || pr.product_link || null;
        merged.push({ title: pr.title, price: pr.extracted_price, store: src || 'Loja online', image: img, link: link });
      }
    }
    console.log('SCRAPPA products with direct link:', merged.filter(function(m){return m.link;}).length, '/', merged.length);

    return { statusCode: 200, headers, body: JSON.stringify({ merged }) };
  } catch (error) {
    return { statusCode: 200, headers, body: JSON.stringify({ merged: [], error: error.message }) };
  }
};
