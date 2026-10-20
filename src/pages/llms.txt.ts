import type { APIRoute } from 'astro';
import { sortedGuides, sortedUpdates } from '@/lib/content';
import { glossary } from '@/data/glossary';
import { categories } from '@/content.config';
import { site } from '@/site.config';
import { href } from '@/lib/url';
import keyFacts from '@/data/key-facts.json';
import { templates } from '@/data/templates';

/** llms.txt (llmstxt.org): a short map of the site for language models and answer engines. */
export const GET: APIRoute = async ({ site: siteUrl }) => {
  const origin = (siteUrl?.toString() || '').replace(/\/$/, '');
  const abs = (p: string) => `${origin}${href(p)}`;
  const [guides, updates] = await Promise.all([sortedGuides(), sortedUpdates()]);
  const lines: string[] = [
    `# ${site.name}`,
    '',
    `> ${site.name} is a plain-English resource hub on supported exempt accommodation (SEA) and supported housing in England, published by ${site.publisher.name}. It covers exempt and specified accommodation, Housing Benefit rent and service charges, supported living, transitional, emergency and care leaver accommodation, licensing under the Supported Housing (Regulatory Oversight) Act 2023, and best practice.`,
    '',
    `Each guide starts with a quick answer and a short version of no more than five points, and lists its sources. Guidance covers England and is general information, not legal advice. Key facts last checked ${keyFacts.lastChecked}.`,
    '',
  ];
  if (updates.length) {
    lines.push('## Latest updates', '');
    for (const u of updates.slice(0, 10)) lines.push(`- [${u.data.title}](${abs(`/updates/${u.id}/`)}) (${u.data.published.toISOString().slice(0, 10)}): ${u.data.summary.split('. ')[0]}.`);
    lines.push('');
  }
  for (const key of Object.keys(categories) as (keyof typeof categories)[]) {
    const items = guides.filter((g) => g.data.category === key);
    if (!items.length) continue;
    lines.push(`## ${categories[key].label}`, '');
    for (const g of items) lines.push(`- [${g.data.title}](${abs(`/guides/${g.id}/`)}): ${g.data.quickAnswer.split('. ')[0]}.`);
    lines.push('');
  }
  lines.push(
    '## Tools and reference',
    '',
    `- [Regulation tracker](${abs('/regulation-tracker/')}): Key dates for supported exempt accommodation from 1996 to licensing expected in 2027.`,
    `- [Glossary](${abs('/glossary/')}): ${glossary.length} supported housing terms defined in one sentence each.`,
    `- [FAQ](${abs('/faq/')}): Short answers to common questions on licensing, Housing Benefit and running a service.`,
    `- [Audit readiness check](${abs('/tools/audit-readiness/')}): A 24-question self-assessment against what councils and licensing look for.`,
    `- [Exempt accommodation checker](${abs('/tools/exempt-accommodation-checker/')}): Identifies the likely specified accommodation category for a scheme.`,
    `- [Service charge calculator](${abs('/tools/service-charge-calculator/')}): Splits a weekly charge into lines eligible and ineligible for Housing Benefit.`,
    `- [Resources](${abs('/resources/')}): Legislation, official guidance and research with notes on each.`,
    '',
    '## Free templates',
    '',
    ...templates.map((t) => `- [${t.title}](${abs(`/templates/${t.slug}/`)}): ${t.quickAnswer.split('. ')[0]}.`),
    '',
    '## Optional',
    '',
    `- [Full text of every guide](${abs('/llms-full.txt')}): All guides as plain markdown in one file.`,
    `- [About and editorial standards](${abs('/about/')}): Who publishes the hub and how guides are written and checked.`,
    `- [SEA Audit](${site.publisher.url}): Independent audits of supported exempt accommodation.`,
    '',
  );
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
