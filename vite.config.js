import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Мульти-страничный сайт: каждая html — отдельная точка входа.
const pages = ['index', 'about', 'services', 'careers', 'contact', 'thank-you', 'legal', 'terms', 'privacy', '404'];

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: Object.fromEntries(pages.map((p) => [p, resolve(import.meta.dirname, `${p}.html`)])),
    },
  },
});
