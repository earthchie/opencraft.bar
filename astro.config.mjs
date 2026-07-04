import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://opencraft.bar',
  i18n: {
    locales: ['en', 'th'],
    defaultLocale: 'th',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  image: {
    domains: [],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
