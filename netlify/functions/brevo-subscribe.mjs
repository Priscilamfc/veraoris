// Recebe e-mail + tipo de pele + tipo de cabelo do formulário da Beauty Box (home) e
// cadastra/atualiza o contato na Brevo, já na lista "Beauty Box - Assinantes" (ID #3, ou
// o que estiver em BREVO_LIST_ID) com os atributos TIPOS_DE_PELE / TIPOS_DE_CABELO —
// usados depois pra segmentar o envio semanal por tipo de pele/cabelo.
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID = parseInt(process.env.BREVO_LIST_ID || '3', 10);

export default async (request) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (request.method === 'OPTIONS') {
    return new Response('', { status: 200, headers });
  }
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), { status: 405, headers });
  }
  if (!BREVO_API_KEY) {
    return new Response(JSON.stringify({ ok: false, error: 'BREVO_API_KEY em falta no Netlify' }), { status: 200, headers });
  }

  let body;
  try {
    body = JSON.parse((await request.text()) || '{}');
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: 'JSON inválido' }), { status: 400, headers });
  }

  const email = (body.email || '').trim();
  if (!email || !email.includes('@')) {
    return new Response(JSON.stringify({ ok: false, error: 'E-mail inválido' }), { status: 400, headers });
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        email,
        attributes: {
          TIPOS_DE_PELE: body.skin || '',
          TIPOS_DE_CABELO: body.hair || ''
        },
        listIds: [BREVO_LIST_ID],
        updateEnabled: true
      })
    });

    // Brevo devolve 204 (criado) ou 400 "Contact already exist" quando já existe — com
    // updateEnabled:true isso normalmente já atualiza sozinho, mas tratamos os dois casos
    // como sucesso pra não travar a experiência da pessoa no site por causa disso.
    if (res.ok || res.status === 204) {
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }
    const errBody = await res.json().catch(() => ({}));
    if (errBody.code === 'duplicate_parameter') {
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }
    console.log('BREVO erro:', res.status, JSON.stringify(errBody));
    return new Response(JSON.stringify({ ok: false, error: errBody.message || 'Erro na Brevo' }), { status: 200, headers });
  } catch (error) {
    console.log('BREVO fetch falhou:', error.message);
    return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 200, headers });
  }
};

export const config = { path: '/.netlify/functions/brevo-subscribe' };
