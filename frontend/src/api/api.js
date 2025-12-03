// frontend/src/api/api.js
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export async function apiFetch(path, opts = {}) {
  const headers = opts.headers ? { ...opts.headers } : {};
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!headers['Content-Type'] && !(opts.body instanceof FormData)) headers['Content-Type'] = 'application/json';

  const res = await fetch(API_BASE + path, { ...opts, headers });
  let text = await res.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch(e) { body = text; }

  if (!res.ok) {
    const message = (body && body.message) ? body.message : (res.statusText || 'API error');
    const error = new Error(message);
    error.status = res.status;
    error.body = body;
    throw error;
  }
  return body;
}
