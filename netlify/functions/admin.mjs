// MIGRADA (24/07/2026) pro runtime moderno do Netlify Functions — ver epoca-search.mjs pro
// contexto completo (elimina o limite de 4KB de variáveis de ambiente do modo antigo).
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const ALLOWED = {
  cliques: ['select', 'deleteAll'],
  quiz_completados: ['select', 'deleteAll'],
  mensagens: ['select', 'delete', 'deleteAll'],
  dicas: ['insert', 'delete'],
  promos: ['select', 'insert', 'update', 'delete']
};

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

  if (!ADMIN_PASSWORD || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return new Response(JSON.stringify({ ok: false, error: 'Servidor não configurado: ADMIN_PASSWORD / SUPABASE_URL / SUPABASE_SERVICE_KEY em falta no Netlify.' }), { status: 200, headers });
  }

  let body;
  try {
    const text = await request.text();
    body = JSON.parse(text || '{}');
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: 'JSON inválido' }), { status: 400, headers });
  }

  const { password, action, table, id, data } = body;

  if (password !== ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ ok: false, error: 'Password incorreta' }), { status: 401, headers });
  }

  if (action === 'verify') {
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  }

  if (!table || !ALLOWED[table] || !ALLOWED[table].includes(action)) {
    return new Response(JSON.stringify({ ok: false, error: 'Ação não permitida para esta tabela' }), { status: 400, headers });
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
      return new Response(JSON.stringify({ ok: res.ok, data: rows }), { status: 200, headers });
    }

    if (action === 'insert') {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: { ...sbHeaders, Prefer: 'return=minimal' },
        body: JSON.stringify(data || {})
      });
      return new Response(JSON.stringify({ ok: res.ok }), { status: 200, headers });
    }

    if (action === 'update') {
      if (id === undefined || id === null) {
        return new Response(JSON.stringify({ ok: false, error: 'id em falta' }), { status: 400, headers });
      }
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { ...sbHeaders, Prefer: 'return=minimal' },
        body: JSON.stringify(data || {})
      });
      return new Response(JSON.stringify({ ok: res.ok }), { status: 200, headers });
    }

    if (action === 'delete') {
      if (id === undefined || id === null) {
        return new Response(JSON.stringify({ ok: false, error: 'id em falta' }), { status: 400, headers });
      }
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { ...sbHeaders, Prefer: 'return=minimal' }
      });
      return new Response(JSON.stringify({ ok: res.ok }), { status: 200, headers });
    }

    if (action === 'deleteAll') {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=gte.0`, {
        method: 'DELETE',
        headers: { ...sbHeaders, Prefer: 'return=minimal' }
      });
      return new Response(JSON.stringify({ ok: res.ok }), { status: 200, headers });
    }

    return new Response(JSON.stringify({ ok: false, error: 'Ação desconhecida' }), { status: 400, headers });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 200, headers });
  }
};

export const config = { path: '/.netlify/functions/admin' };
