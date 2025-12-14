import { defineConfig } from 'vite';

export default defineConfig({
  base: "./",
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },
  server: {
    port: 3000,
  },
});
