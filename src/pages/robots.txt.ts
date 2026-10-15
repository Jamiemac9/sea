import type { APIRoute } from 'astro';
import { href } from '@/lib/url';

/**
 * Search engines and AI answer engines are allowed everywhere. The AI user
 * agents are listed by name so the intent is explicit: the hub wants to be
 * read, quoted and cited.
 */
const aiAgents = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
  'CCBot',
];

export const GET: APIRoute = ({ site }) => {
  const origin = (site?.toString() || '').replace(/\/$/, '');
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    ...aiAgents.flatMap((a) => [`User-agent: ${a}`, 'Allow: /', '']),
    `Sitemap: ${origin}${href('/sitemap-index.xml')}`,
    '',
    `# Plain-text guide for language models: ${origin}${href('/llms.txt')}`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
