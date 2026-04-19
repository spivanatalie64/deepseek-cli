const fs = require('fs');
const path = require('path');

const root = process.cwd();
const binPath = path.join(root, 'bin', 'deepseek.js');
const webDist = path.join(root, 'web', 'dist');
let ok = true;

if (!fs.existsSync(binPath)) {
  console.error('Missing CLI binary:', binPath);
  ok = false;
} else {
  console.log('Found CLI binary:', binPath);
}

if (!fs.existsSync(webDist)) {
  console.error('Missing web build output:', webDist);
  ok = false;
} else {
  console.log('Found web build output:', webDist);
}

process.exit(ok ? 0 : 2);
