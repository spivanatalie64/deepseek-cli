#!/usr/bin/env node
// Dev-only smoke tests for web/src/apiClient.js
// This script uses injected mock fetch implementations to validate basic fetch logic and error handling.

import { search } from '../src/apiClient.js';

async function run() {
  // Mock success
  const mockFetchSuccess = async (url, opts) => ({
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: { get: (k) => (k.toLowerCase() === 'content-type' ? 'application/json' : null) },
    json: async () => ({ hits: [{ id: '1', text: 'mock result' }], querySent: JSON.parse(opts.body) }),
    text: async () => JSON.stringify({})
  });

  const success = await search('hello world', { apiKey: 'mock-key', baseUrl: 'https://api.example', fetch: mockFetchSuccess });
  console.log('SMOKE_SUCCESS:', success);

  // Mock 401
  const mockFetch401 = async () => ({
    ok: false,
    status: 401,
    statusText: 'Unauthorized',
    headers: { get: () => 'text/plain' },
    text: async () => 'unauthorized'
  });

  try {
    await search('secret', { apiKey: 'bad-key', baseUrl: 'https://api.example', fetch: mockFetch401 });
    console.error('Expected 401 error but got success');
    process.exitCode = 2;
  } catch (e) {
    console.log('SMOKE_401:', e.message, 'status=', e.status, 'body=', e.body);
  }
}

run().catch(err => { console.error('SMOKE_FATAL:', err); process.exit(1); });
