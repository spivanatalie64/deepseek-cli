Packaging

To create a publishable npm package that includes the CLI and web build artifacts:

1. Build the web frontend:

   npm run build:web

2. Create an npm package tarball:

   npm run pack

The package.json includes the "files" field to include the bin/ directory and web/dist in the package. Ensure web/dist is built before packing.

Publishing:

  npm publish --access public

