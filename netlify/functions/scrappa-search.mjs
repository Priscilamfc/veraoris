// MIGRADA (24/07/2026) pro runtime moderno do Netlify Functions — ver epoca-search.mjs pro
// contexto completo (elimina o limite de 4KB de variáveis de ambiente do modo antigo).
const SCRAPPA_KEY = process.env.SCRAPPA_KEY;

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
    if (!SCRAPPA_KEY) {
      return new Response(JSON.stringify({ merged: [], error: 'SCRAPPA_KEY não configurada no Netlify.' }), { status: 200, headers });
    }

    const url = new URL(request.url);
    const query = url.searchParams.get('query') || '';
    const gl = url.searchParams.get('gl') || 'br';
    const scrappaUrl = 'https://scrappa.co/api/search-advanced?query=' + encodeURIComponent(query) + '&gl=' + encodeURIComponent(gl) + '&search_type=shop';

    const res = await fetch(scrappaUrl, { headers: { 'X-API-KEY': SCRAPPA_KEY } });
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

    return new Response(JSON.stringify({ merged }), { status: 200, headers });
  } catch (error) {
    return new Response(JSON.stringify({ merged: [], error: error.message }), { status: 200, headers });
  }
};

export const config = { path: '/.netlify/functions/scrappa-search' };
