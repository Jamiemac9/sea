import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { sortedGuides, sortedUpdates } from '@/lib/content';
import { site } from '@/site.config';
import { href } from '@/lib/url';

export const GET: APIRoute = async (context) => {
  const [guides, updates] = await Promise.all([sortedGuides(), sortedUpdates()]);
  const items = [
    ...updates.map((u) => ({
      title: u.data.title,
      description: u.data.summary,
      pubDate: u.data.updated || u.data.published,
      link: href(`/updates/${u.id}/`),
      categories: ['Update', u.data.tag],
    })),
    ...guides.map((g) => ({
      title: g.data.title,
      description: g.data.quickAnswer,
      pubDate: g.data.updated,
      link: href(`/guides/${g.id}/`),
      categories: [g.data.category],
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
  return rss({
    title: `${site.name}: updates and guides`,
    description: site.description,
    site: context.site!,
    items,
    customData: '<language>en-gb</language>',
  });
};
