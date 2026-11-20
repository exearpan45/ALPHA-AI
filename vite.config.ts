import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // This repository is published at https://exearpan45.github.io/ALPHA-AI/
  base: '/ALPHA-AI/',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'copy-unbundled-src-assets',
      apply: 'build',
      closeBundle() {
        const distDir = path.resolve(projectRoot, 'dist');
        const srcAssets = path.resolve(projectRoot, 'src/assets');
        const distAssets = path.resolve(distDir, 'src/assets');
        if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
          fs.cpSync(srcAssets, distAssets, { recursive: true, force: true });
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': projectRoot,
    },
  },
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
});
