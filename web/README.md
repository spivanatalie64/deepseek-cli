Web Frontend (web)

Overview

This directory contains the new frontend application for Deepseek. It is a Vite + React app (or similar) that communicates with the Deepseek API.

Quickstart

1. Install dependencies

   cd web && npm install

2. Provide your API key

   - Create a .env file in the web/ directory and add your API key:

     VITE_DEEPSEEK_API_KEY=your_api_key_here

   - Alternatively, you can provide the key at runtime (the app will prompt if no key is present) or export it in your shell before starting the dev server:

     export VITE_DEEPSEEK_API_KEY=your_api_key_here

   Notes on configuration:
   - API base URL can be configured via VITE_DEEPSEEK_API_BASE in the same .env file or as an environment variable. If not set, the app will use the default base URL configured in the source.

3. Run the dev server

   cd web && npm run dev

4. Build for production

   cd web && npm run build

Security note

- Do NOT commit real API keys to version control. Add web/.env to .gitignore or use a separate .env.local file that is ignored by Git.
- Preferred ways to provide keys for local development:
  - Use a local .env or .env.local file that is listed in .gitignore
  - Export the variable in your shell (export VITE_DEEPSEEK_API_KEY=...)
  - Use a runtime prompt that only stores the key in memory

Todo & next steps

- See project todo list (session todos) for remaining items. Relevant todo IDs:
  - add-docs — this documentation task

Remaining work to wire the frontend

- Components to finish:
  - API client wiring: ensure the client reads VITE_DEEPSEEK_API_KEY and VITE_DEEPSEEK_API_BASE correctly
  - Auth/Key prompt component: show a prompt when no API key is provided at runtime
  - Env configuration: ensure .env handling is documented in the repo and that defaults are sensible
  - Integration tests and CI: add a way for CI to provide an ephemeral or mocked API key if needed

If you want, I can update the code or create a minimal .env.example file next.
