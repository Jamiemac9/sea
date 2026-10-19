import type { APIRoute } from 'astro';
import { sortedGuides, headingsOf } from '@/lib/content';
import { glossary } from '@/data/glossary';
import { faqGroups } from '@/data/faqs';
import { href } from '@/lib/url';
import { templates } from '@/data/templates';

export const GET: APIRoute = async () => {
  const guides = await sortedGuides();
  const entries = [
    ...guides.map((g) => ({
      t: g.data.title,
      d: g.data.description,
      u: href(`/guides/${g.id}/`),
      k: 'Guide',
      h: [...headingsOf(g.body || ''), ...g.data.faqs.map((f) => f.q)].join(' | '),
    })),
    ...glossary.map((t) => ({ t: t.term, d: t.short, u: href(`/glossary/${t.slug}/`), k: 'Term', h: (t.aka || []).join(' | ') })),
    { t: 'Audit readiness check', d: 'Score your service across eight areas in about 10 minutes.', u: href('/tools/audit-readiness/'), k: 'Tool', h: 'audit licensing standards score' },
    { t: 'Exempt accommodation checker', d: 'Find the likely specified accommodation category for a scheme.', u: href('/tools/exempt-accommodation-checker/'), k: 'Tool', h: 'category exempt managed refuge hostel' },
    { t: 'Service charge calculator', d: 'Split a weekly charge into eligible and ineligible lines.', u: href('/tools/service-charge-calculator/'), k: 'Tool', h: 'service charges eligible rent housing benefit' },
    ...templates.map((t) => ({ t: t.title, d: t.description, u: href(`/templates/${t.slug}/`), k: 'Template', h: [t.format, 'download free template', ...t.inside].join(' | ') })),
    { t: 'Free templates', d: 'Word and Excel templates for support plans, needs assessments, service charges and licensing.', u: href('/templates/'), k: 'Page', h: 'download word excel template' },
    { t: 'Regulation tracker', d: 'Key dates from 1996 to licensing in 2027.', u: href('/regulation-tracker/'), k: 'Page', h: 'timeline licensing 2027 consultation' },
    { t: 'Resources', d: 'Legislation, guidance, research and sector bodies.', u: href('/resources/'), k: 'Page', h: 'links legislation guidance' },
    ...faqGroups.flatMap((g) =>
      g.items.map((i) => ({ t: i.q, d: i.a.slice(0, 140) + (i.a.length > 140 ? '...' : ''), u: href(i.href || '/faq/'), k: 'FAQ', h: '' })),
    ),
  ];
  return new Response(JSON.stringify(entries), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
