import type { APIRoute } from 'astro';
import { sortedGuides, mdxToText } from '@/lib/content';
import { glossary } from '@/data/glossary';
import { site } from '@/site.config';
import { href } from '@/lib/url';

/** Every guide as plain markdown, with its quick answer, short version, FAQs and sources. */
export const GET: APIRoute = async ({ site: siteUrl }) => {
  const origin = (siteUrl?.toString() || '').replace(/\/$/, '');
  const guides = await sortedGuides();
  const out: string[] = [
    `# ${site.name}: full guide text`,
    '',
    `> Plain-English guidance on supported exempt accommodation in England, published by ${site.publisher.name}. General information, not legal advice.`,
    '',
  ];
  for (const g of guides) {
    const d = g.data;
    out.push(
      '---',
      '',
      `# ${d.title}`,
      '',
      `URL: ${origin}${href(`/guides/${g.id}/`)}`,
      `Updated: ${d.updated.toISOString().slice(0, 10)}`,
      '',
      `Quick answer: ${d.quickAnswer}`,
      '',
      'The short version:',
      ...d.keyPoints.map((p) => `- ${p}`),
      '',
      mdxToText(g.body || ''),
      '',
    );
    if (d.faqs.length) {
      out.push('## Questions people ask', '');
      for (const f of d.faqs) out.push(`### ${f.q}`, '', f.a, '');
    }
    if (d.sources.length) {
      out.push('## Sources', '');
      for (const s of d.sources) out.push(`- ${s.title}${s.publisher ? `, ${s.publisher}` : ''}${s.date ? `, ${s.date}` : ''}: ${s.url}`);
      out.push('');
    }
  }
  out.push('---', '', '# Glossary', '');
  for (const t of glossary) out.push(`- ${t.term}: ${t.short}`);
  out.push('');
  return new Response(out.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
