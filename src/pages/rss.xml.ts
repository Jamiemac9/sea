import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { sortedGuides } from '@/lib/content';
import { site } from '@/site.config';
import { href } from '@/lib/url';

export const GET: APIRoute = async (context) => {
  const guides = (await sortedGuides()).sort((a, b) => b.data.updated.getTime() - a.data.updated.getTime());
  return rss({
    title: `${site.name} guides`,
    description: site.description,
    site: context.site!,
    items: guides.map((g) => ({
      title: g.data.title,
      description: g.data.quickAnswer,
      pubDate: g.data.updated,
      link: href(`/guides/${g.id}/`),
      categories: [g.data.category],
    })),
    customData: '<language>en-gb</language>',
  });
};
