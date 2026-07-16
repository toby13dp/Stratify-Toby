import { defineConfig } from 'vite';
import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));

const copyClassicScripts = () => ({
  name: 'copy-classic-scripts',
  async closeBundle() {
    const files = [
      ['assets/vendor/bootstrap/js/bootstrap.bundle.min.js', 'dist/assets/vendor/bootstrap/js/bootstrap.bundle.min.js'],
      ['assets/vendor/bootstrap/js/bootstrap.bundle.min.js.map', 'dist/assets/vendor/bootstrap/js/bootstrap.bundle.min.js.map'],
      ['assets/vendor/gsap/gsap.min.js', 'dist/assets/vendor/gsap/gsap.min.js'],
      ['assets/vendor/gsap/ScrollTrigger.min.js', 'dist/assets/vendor/gsap/ScrollTrigger.min.js'],
      ['assets/js/theme.js', 'dist/assets/js/theme.js']
    ];

    for (const [source, destination] of files) {
      const target = resolve(root, destination);
      await mkdir(dirname(target), { recursive: true });
      await copyFile(resolve(root, source), target);
    }
  }
});

export default defineConfig({
  base: './',
  plugins: [copyClassicScripts()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false
  }
});
