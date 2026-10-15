import type { APIRoute } from 'astro';
import { ads } from '@/site.config';

/** ads.txt authorises Google to sell this site's inventory. f08c47fec0942fa0 is Google's certification ID. */
export const GET: APIRoute = () => {
  const pub = ads.client.replace(/^ca-/, '');
  const body = pub
    ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`
    : '# No ad network configured yet. Set PUBLIC_ADSENSE_CLIENT to publish the AdSense line.\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
