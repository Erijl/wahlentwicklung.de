// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';

// Fully static output (SSG) — see docs/02-concept.md §1.
export default defineConfig({
  site: 'https://wahlentwicklung.de',
  output: 'static',
  integrations: [svelte(), sitemap()],
  i18n: {
    // German canonical at root; English mirror under /en/ lands in v0.2
    // (docs/02-concept.md §3). Configured now so URLs stay stable.
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  redirects: {
    '/wahl': '/wahlen',
    '/partei': '/parteien',
    '/bundesland': '/bundeslaender',
    '/wahlkreis': '/wahlkreise',
  },
});
