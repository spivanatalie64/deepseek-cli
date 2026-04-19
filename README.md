Deepseek CLI

This repository contains the Deepseek command line tools and the new web frontend located in the web/ directory.

Frontend

The frontend application lives in web/. See web/README.md for setup instructions, running the dev server, building for production, and recommended security practices for handling API keys.

Repository layout

- web/ — Vite-based frontend application
- (other components) — CLI tools and backend components

Contributing

Please follow the standard contribution workflow: fork, branch, open a PR. Do not commit secrets (API keys, tokens) to the repository.

If you find missing documentation for the frontend, check web/README.md and the project todo list for next steps.

CLI

  A simple CLI is provided at bin/deepseek.js. Install via npm or run with Node 18+.

Packaging

  See PACKAGING.md for instructions to build and pack the project for publishing.
