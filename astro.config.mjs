// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';
import mdx from '@astrojs/mdx';
import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// SITE_URL is the public origin used for canonicals, sitemaps and structured data.
// Set it in the deployment environment (Cloudflare Pages > Settings > Variables).
const site = (process.env.SITE_URL || 'https://exemptaccommodation.com').replace(/\/$/, '');
const base = process.env.BASE_PATH || '/';
const port = Number(process.env.PORT || 4321);

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  image: { service: passthroughImageService() },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !/\/(404|thanks|cookies|privacy)\/?$/.test(page),
      changefreq: 'weekly',
      lastmod: new Date(),
    }),
  ],
  markdown: {
    // Keep straight quotes and dashes exactly as written (house style).
    processor: satteri({ features: { smartPunctuation: false } }),
  },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  server: { port, host: true },
  vite: {
    plugins: [tailwindcss()],
    server: { allowedHosts: true },
    preview: { allowedHosts: true },
  },
});
