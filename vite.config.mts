import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';

const srcPath = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': srcPath,
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    open: true,
    cors: true,
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: false,
  },
  build: {
    target: 'esnext',
    sourcemap: process.env.NODE_ENV === 'production' ? false : true,
    cssCodeSplit: true,
    minify: 'esbuild',
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500,
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    css: true,
  },
});
