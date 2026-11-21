import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://opencraft.bar',
  i18n: {
    locales: ['en', 'th'],
    defaultLocale: 'th',
    routing: {
      prefixDefaultLocale: true,
    },
  },
  redirects: {
    // Short, shareable link (bio link) for the Thai link hub
    '/links': '/th/links/',
  },
  image: {
    domains: [],
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      // The tap-list API only allows the production origin, so proxy it
      // same-origin during local development.
      proxy: {
        '/pos-api': {
          target: 'https://pos-api.opencraft.bar',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/pos-api/, '/api'),
        },
      },
    },
  },
});
