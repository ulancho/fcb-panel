import { resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const srcDir = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
  plugins: [react()],
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
      '/svc-biz-ib-cbk-mbank-id-auth': {
        target: 'https://preprodib.mbank.kg',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
