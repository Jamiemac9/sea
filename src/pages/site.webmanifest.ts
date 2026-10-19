import type { APIRoute } from 'astro';
import { site } from '@/site.config';
import { href } from '@/lib/url';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: site.name,
      short_name: site.name,
      description: site.tagline,
      start_url: href('/'),
      display: 'standalone',
      background_color: '#f7f6f2',
      theme_color: '#102a46',
      icons: [
        { src: href('/icon-192.png'), sizes: '192x192', type: 'image/png' },
        { src: href('/icon-512.png'), sizes: '512x512', type: 'image/png' },
      ],
    }),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
