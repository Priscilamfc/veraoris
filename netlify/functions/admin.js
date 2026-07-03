const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const ALLOWED = {
  cliques: ['select', 'deleteAll'],
  quiz_completados: ['select', 'deleteAll'],
  mensagens: ['select', 'delete', 'deleteAll'],
  dicas: ['insert', 'delete']
};

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ ok: false, error: 'Method not allowed' }) };
  }

  if (!ADMIN_PASSWORD || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: false, error: 'Servidor não configurado: ADMIN_PASSWORD / SUPABASE_URL / SUPABASE_SERVICE_KEY em falta no Netlify.' })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: 'JSON inválido' }) };
  }

  const { password, action, table, id, data } = body;

  if (password !== ADMIN_PASSWORD) {
    return { statusCode: 401, headers, body: JSON.stringify({ ok: false, error: 'Password incorreta' }) };
  }

  if (action === 'verify') {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  if (!table || !ALLOWED[table] || !ALLOWED[table].includes(action)) {
    return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: 'Ação não permitida para esta tabela' }) };
  }

  const sbHeaders = {
    apikey: SUPABASE_SERVICE_KEY,
    Authorization: 'Bearer ' + SUPABASE_SERVICE_KEY,
    'Content-Type': 'application/json'
  };

  try {
    if (action === 'select') {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&order=data_hora.desc&limit=500`, { headers: sbHeaders });
      const rows = await res.json();
      return { statusCode: 200, headers, body: JSON.stringify({ ok: res.ok, data: rows }) };
    }

    if (action === 'insert') {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: { ...sbHeaders, Prefer: 'return=minimal' },
        body: JSON.stringify(data || {})
      });
      return { statusCode: 200, headers, body: JSON.stringify({ ok: res.ok }) };
    }

    if (action === 'delete') {
      if (id === undefined || id === null) {
        return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: 'id em falta' }) };
      }
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { ...sbHeaders, Prefer: 'return=minimal' }
      });
      return { statusCode: 200, headers, body: JSON.stringify({ ok: res.ok }) };
    }

    if (action === 'deleteAll') {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=gte.0`, {
        method: 'DELETE',
        headers: { ...sbHeaders, Prefer: 'return=minimal' }
      });
      return { statusCode: 200, headers, body: JSON.stringify({ ok: res.ok }) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: 'Ação desconhecida' }) };
  } catch (error) {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: error.message }) };
  }
};
