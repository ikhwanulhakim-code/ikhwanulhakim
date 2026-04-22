import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://ikhwanulhakim.vercel.app',
  output: 'static',
  adapter: vercel(),
  integrations: [sitemap()],
  compressHTML: true,
  vite: {
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
  },
});