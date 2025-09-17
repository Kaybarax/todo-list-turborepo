import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname),
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@todo/ui-web': path.resolve(__dirname, '../lib'),
      '@todo/utils': path.resolve(__dirname, '../../utils/src'),
    },
  },
  css: {
    // Use showcase-local PostCSS (Tailwind) config
    postcss: path.resolve(__dirname, './postcss.config.js'),
  },
  server: {
    port: 3001,
    host: true,
  },
  preview: {
    port: 3001,
    host: true,
  },
});
