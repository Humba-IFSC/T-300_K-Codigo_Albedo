const fs = require('fs');
const path = process.argv[2];
if (!path) {
  console.error('Usage: node read_png_dim.js <path-to-png>');
  process.exit(2);
}
const buf = fs.readFileSync(path);
const header = buf.slice(0, 16);
console.log('header:', header.toString('hex'));
if (!header.toString('hex').startsWith('89504e470d0a1a0a')) {
  console.error('Not a PNG (header mismatch)');
  process.exit(3);
}
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);
console.log(width, height);
