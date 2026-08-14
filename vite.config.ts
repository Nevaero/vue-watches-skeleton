/// <reference types="vitest" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Port de dev par défaut : 5174 (laisse le 5173 libre pour le voisin react-watches).
export default defineConfig({
  plugins: [vue()],
  server: { port: 5174 },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
