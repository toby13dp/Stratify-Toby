import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const copies = [
  ['node_modules/bootstrap/dist/css/bootstrap.min.css', 'assets/vendor/bootstrap/css/bootstrap.min.css'],
  ['node_modules/bootstrap/dist/css/bootstrap.min.css.map', 'assets/vendor/bootstrap/css/bootstrap.min.css.map'],
  ['node_modules/bootstrap/dist/js/bootstrap.bundle.min.js', 'assets/vendor/bootstrap/js/bootstrap.bundle.min.js'],
  ['node_modules/bootstrap/dist/js/bootstrap.bundle.min.js.map', 'assets/vendor/bootstrap/js/bootstrap.bundle.min.js.map'],
  ['node_modules/bootstrap-icons/font/bootstrap-icons.min.css', 'assets/vendor/bootstrap-icons/font/bootstrap-icons.min.css'],
  ['node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff', 'assets/vendor/bootstrap-icons/font/fonts/bootstrap-icons.woff'],
  ['node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2', 'assets/vendor/bootstrap-icons/font/fonts/bootstrap-icons.woff2'],
  ['node_modules/gsap/dist/gsap.min.js', 'assets/vendor/gsap/gsap.min.js'],
  ['node_modules/gsap/dist/ScrollTrigger.min.js', 'assets/vendor/gsap/ScrollTrigger.min.js']
];

for (const [source, destination] of copies) {
  const from = resolve(root, source);
  const to = resolve(root, destination);
  await mkdir(dirname(to), { recursive: true });
  await copyFile(from, to);
}

console.log(`Synchronized ${copies.length} frontend vendor files.`);
