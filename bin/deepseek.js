#!/usr/bin/env node
// Minimal Deepseek CLI

const [,, cmd, ...rest] = process.argv;

function usage() {
  console.log('Usage: deepseek search "<query>" [--apiKey KEY] [--baseUrl URL] [--limit N]');
  process.exit(1);
}

if (!cmd) usage();

if (cmd === 'search') {
  const query = rest[0];
  if (!query) { console.error('Missing query'); usage(); }

  // parse simple options
  let apiKey, baseUrl, limit = 10;
  for (let i = 1; i < rest.length; i++) {
    const arg = rest[i];
    if (arg === '--apiKey' && rest[i+1]) { apiKey = rest[i+1]; i++; }
    else if (arg === '--baseUrl' && rest[i+1]) { baseUrl = rest[i+1]; i++; }
    else if (arg === '--limit' && rest[i+1]) { limit = Number(rest[i+1]); i++; }
  }

  (async () => {
    try {
      if (typeof fetch === 'undefined') {
        console.error('No global fetch available. Run with Node 18+ or provide a fetch polyfill.');
        process.exit(1);
      }

      const key = apiKey || process.env.DEEPSEEK_API_KEY;
      const base = (baseUrl || process.env.DEEPSEEK_API_BASE || 'https://api.deepseek.example.com').replace(/\/\/+$/,'') + '/search';

      if (!key) {
        console.error('Missing API key. Provide --apiKey or set DEEPSEEK_API_KEY environment variable.');
        process.exit(2);
      }

      const resp = await fetch(base, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({ query })
      });

      if (resp && resp.status === 401) {
        const body = await safeText(resp);
        console.error('Unauthorized (401) when calling Deepseek API. Check API key.');
        if (body) console.error(body);
        process.exit(2);
      }

      if (!resp || !resp.ok) {
        const body = resp ? await safeText(resp) : null;
        console.error('Deepseek API error:', resp ? resp.status : 'NO_RESPONSE', resp ? resp.statusText : '');
        if (body) console.error(body);
        process.exit(1);
      }

      const ct = resp.headers && resp.headers.get ? resp.headers.get('content-type') || '' : '';
      let data = ct.includes('application/json') ? await resp.json() : await resp.text();

      let items = [];
      if (Array.isArray(data)) items = data;
      else if (data && Array.isArray(data.results)) items = data.results;
      else if (data && Array.isArray(data.items)) items = data.items;

      items = items.slice(0, limit || items.length);
      console.log(JSON.stringify(items, null, 2));
      process.exit(0);
    } catch (e) {
      console.error('Search failed:', e && e.message ? e.message : e);
      process.exit(1);
    }
  })();
} else {
  console.error('Unknown command', cmd);
  usage();
}

async function safeText(resp) {
  try { return await resp.text(); } catch (e) { return null; }
}
