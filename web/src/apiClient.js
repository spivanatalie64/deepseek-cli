/**
 * Minimal Deepseek API client for frontend.
 *
 * Usage:
 *   import { search } from './apiClient';
 *   const res = await search('my query', { apiKey: '...', baseUrl: 'https://api.deepseek.example.com' });
 *
 * By default, the API key is read from import.meta.env.VITE_DEEPSEEK_API_KEY and base URL from import.meta.env.VITE_DEEPSEEK_API_BASE.
 * Default placeholder base URL: https://api.deepseek.example.com
 *
 * NOTE / TODO:
 * - Confirm the Deepseek API contract (endpoint path, request/response shapes). This implementation assumes a POST to `${base}/search`
 *   with a JSON body { query } and an Authorization: Bearer <key> header. If the real API differs, update this file accordingly.
 */

export async function search(query, options = {}) {
  const { apiKey, baseUrl, signal, fetch: customFetch } = options || {};

  // Read API key and base URL from options, window global, or Vite import.meta.env when available.
  let key;
  let base;
  try {
    // Prefer explicit option, then runtime global set by UI, then Vite env when available during build/runtime
    key = apiKey || (typeof window !== 'undefined' && window.__DEEPSEEK_API_KEY) || (import.meta && import.meta.env && import.meta.env.VITE_DEEPSEEK_API_KEY) || undefined;
    base = baseUrl || (import.meta && import.meta.env && import.meta.env.VITE_DEEPSEEK_API_BASE) || 'https://api.deepseek.example.com';
  } catch (e) {
    // Fallback for environments where import.meta isn't accessible
    key = apiKey || (typeof window !== 'undefined' && window.__DEEPSEEK_API_KEY) || undefined;
    base = baseUrl || 'https://api.deepseek.example.com';
  }

  if (!key) {
    throw new Error('Missing Deepseek API key. Provide options.apiKey or set VITE_DEEPSEEK_API_KEY in your environment (see web/.env.example).');
  }

  // Allow injection of a custom fetch implementation (useful for Node or tests)
  const f = customFetch || (typeof fetch !== 'undefined' ? fetch.bind(globalThis) : undefined);
  if (!f) {
    throw new Error('No fetch implementation available. Provide options.fetch when running in Node.js or older environments.');
  }

  // Construct URL (ensure no trailing slashes)
  const url = `${base.replace(/\/+$/,'')}/search`;

  const resp = await f(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({ query }),
    signal
  });

  // Handle auth errors specially
  if (resp && resp.status === 401) {
    const body = await _safeText(resp);
    const err = new Error('Unauthorized (401) when calling Deepseek API. Check API key.');
    err.status = 401;
    err.body = body;
    throw err;
  }

  if (!resp || !resp.ok) {
    const body = resp ? await _safeText(resp) : null;
    const err = new Error(`Deepseek API error: ${resp ? resp.status : 'NO_RESPONSE'} ${resp ? resp.statusText : ''}`);
    err.status = resp ? resp.status : null;
    err.body = body;
    throw err;
  }

  // Parse JSON when possible
  const ct = resp.headers && resp.headers.get ? resp.headers.get('content-type') || '' : '';
  if (ct.includes('application/json')) {
    return resp.json();
  }
  return resp.text();
}

async function _safeText(resp) {
  try {
    return await resp.text();
  } catch (e) {
    return null;
  }
}
