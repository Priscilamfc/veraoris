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
    const merged = [];
    for (let i = 0; i < prices.length; i++) {
      const pr = prices[i];
      const src = products[i] ? products[i].source : null;
      if (pr.extracted_price) {
        merged.push({ title: pr.title, price: pr.extracted_price, store: src || 'Loja online' });
      }
    }

    return { statusCode: 200, headers, body: JSON.stringify({ merged }) };
  } catch (error) {
    return { statusCode: 200, headers, body: JSON.stringify({ merged: [], error: error.message }) };
  }
};
