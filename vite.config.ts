import { resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const srcDir = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
  plugins: [tailwindcss(), react()],

  resolve: {
    alias: {
      '@': srcDir,
      Common: resolve(srcDir, 'common'),
      Modules: resolve(srcDir, 'modules'),
      Assets: resolve(srcDir, 'assets'),
    },
    extensions: ['.tsx', '.ts', '.js'],
    preserveSymlinks: false,
  },
  server: {
    proxy: {
      '/admin-panel': {
        target: 'https://mobile-test.fkb.kg',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
