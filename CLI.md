Deepseek CLI

Usage

  deepseek search "<query>" [--apiKey KEY] [--baseUrl URL] [--limit N]

Examples

  # use env var
  export DEEPSEEK_API_KEY=your_key
  deepseek search "hello world" --limit 5

  # provide api key inline
  deepseek search "another query" --apiKey abc123 --baseUrl https://api.deepseek.example.com

Notes

- The CLI requires Node 18+ (for global fetch) or a fetch polyfill.
- The CLI prints JSON array of results to stdout.
