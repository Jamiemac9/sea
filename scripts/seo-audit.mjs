#!/usr/bin/env node
/**
 * Post-build SEO, AEO and GEO audit of the static output in dist/.
 *
 * The on-page checks, thresholds and wording are ported from OpenSEO's site
 * audit issue registry (github.com/every-app/open-seo, src/shared/audit-issues.ts,
 * MIT licence). OpenSEO crawls live sites; this runs the same checks against
 * the built HTML so problems are caught before deploy. The AI crawler check
 * follows OpenSEO's ai-visibility-audit skill.
 *
 * Usage: node scripts/seo-audit.mjs [--quiet] [--json]
 * Exits 1 when a critical issue is found, so the build fails.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, 'dist');
const quiet = process.argv.includes('--quiet');
const asJson = process.argv.includes('--json');

const ISSUES = {
  'missing-title': { severity: 'critical', title: 'Missing title tag', fix: 'Add a unique, descriptive <title> of roughly 50 to 60 characters.' },
  'broken-internal-link': { severity: 'critical', title: 'Broken internal link', fix: 'Point the link at a live URL or remove it.' },
  'invalid-structured-data': { severity: 'critical', title: 'Structured data does not parse', fix: 'Fix the JSON-LD so it is valid JSON.' },
  'ai-crawler-blocked': { severity: 'critical', title: 'AI crawler blocked in robots.txt', fix: 'Allow OAI-SearchBot, ClaudeBot, PerplexityBot and similar agents if the site should appear in AI answers.' },
  'missing-meta-description': { severity: 'warning', title: 'Missing meta description', fix: 'Add a meta description of roughly 70 to 160 characters.' },
  'duplicate-title': { severity: 'warning', title: 'Duplicate title', fix: 'Write a unique title for each page.' },
  'duplicate-meta-description': { severity: 'warning', title: 'Duplicate meta description', fix: 'Write a unique description for each page.' },
  'missing-h1': { severity: 'warning', title: 'Missing H1 heading', fix: 'Add a single H1 that states the main topic.' },
  'multiple-h1': { severity: 'warning', title: 'Multiple H1 headings', fix: 'Keep one H1 and demote the rest.' },
  'missing-canonical': { severity: 'warning', title: 'Missing canonical', fix: 'Declare the preferred URL with <link rel="canonical">.' },
  'thin-content': { severity: 'warning', title: 'Thin content', fix: 'Expand the page with useful content, or noindex it.' },
  'images-missing-alt': { severity: 'warning', title: 'Images missing alt text', fix: 'Add alt text, or alt="" for decorative images.' },
  'orphan-page': { severity: 'warning', title: 'Orphan page', fix: 'Link to this page from a related page or hub.' },
  'no-outgoing-links': { severity: 'warning', title: 'Page has no outgoing links', fix: 'Link to related pages.' },
  'missing-structured-data': { severity: 'warning', title: 'No structured data', fix: 'Add JSON-LD describing the page.' },
  'guide-without-faq-schema': { severity: 'info', title: 'Guide without FAQPage markup', fix: 'Add a few real questions with direct answers.' },
  'title-too-long': { severity: 'info', title: 'Title too long', fix: 'Shorten to about 60 characters.' },
  'title-too-short': { severity: 'info', title: 'Title too short', fix: 'Expand to a descriptive 30 to 60 characters.' },
  'meta-description-too-long': { severity: 'info', title: 'Meta description too long', fix: 'Trim to about 160 characters.' },
  'meta-description-too-short': { severity: 'info', title: 'Meta description too short', fix: 'Expand to 70 to 160 characters.' },
  'heading-order-skip': { severity: 'info', title: 'Heading levels skip', fix: 'Descend one level at a time.' },
  'missing-og-image': { severity: 'info', title: 'Missing og:image', fix: 'Add an Open Graph image for link previews.' },
};

const AI_AGENTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended'];

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const strip = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<template[\s\S]*?<\/template>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
const attr = (tag, name) => (tag.match(new RegExp(`${name}=("([^"]*)"|'([^']*)')`, 'i')) || [])[2] ?? null;
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');

if (!existsSync(dist)) {
  console.error('dist/ not found. Run astro build first.');
  process.exit(1);
}

const files = walk(dist).filter((f) => f.endsWith('.html'));
const urlOf = (file) => '/' + path.relative(dist, file).replace(/index\.html$/, '').replace(/\\/g, '/');
const existing = new Set(walk(dist).map((f) => '/' + path.relative(dist, f).replace(/\\/g, '/')));
const resolves = (u) => {
  const clean = u.split('#')[0].split('?')[0];
  if (!clean || clean === '/') return true;
  if (existing.has(clean)) return true;
  if (existing.has(clean.replace(/\/?$/, '/index.html'))) return true;
  return false;
};

const pages = files.map((file) => {
  const html = readFileSync(file, 'utf8');
  const head = html.split(/<body/i)[0];
  const body = html.slice(head.length);
  const title = decode((head.match(/<title>([\s\S]*?)<\/title>/i) || [])[1]?.trim() || '');
  const descTag = head.match(/<meta[^>]+name="description"[^>]*>/i)?.[0];
  const description = descTag ? decode(attr(descTag, 'content') || '') : '';
  const canonical = head.match(/<link[^>]+rel="canonical"[^>]*>/i)?.[0];
  const robots = attr(head.match(/<meta[^>]+name="robots"[^>]*>/i)?.[0] || '', 'content') || '';
  const ogImage = /<meta[^>]+property="og:image"/i.test(head);
  // Main content only, so header and footer navigation do not hide thin pages.
  const main = (body.match(/<main[\s\S]*<\/main>/i) || [body])[0];
  const headings = Array.from(main.matchAll(/<h([1-6])[\s>]/gi)).map((m) => Number(m[1]));
  const imgs = Array.from(body.matchAll(/<img\b[^>]*>/gi)).map((m) => m[0]);
  const links = Array.from(body.matchAll(/<a\b[^>]*href="([^"]+)"/gi)).map((m) => decode(m[1]));
  const mainLinks = Array.from(main.matchAll(/<a\b[^>]*href="([^"]+)"/gi)).map((m) => decode(m[1]));
  const ld = Array.from(html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)).map((m) => m[1]);
  return { file, url: urlOf(file), title, description, canonical, robots, ogImage, headings, imgs, links, mainLinks, ld, words: strip(main).split(' ').length };
});

const issues = [];
const add = (type, url, detail = '') => issues.push({ type, url, detail, ...ISSUES[type] });

const titles = new Map();
const descs = new Map();
const inbound = new Map(pages.map((p) => [p.url, 0]));

for (const p of pages) {
  const noindex = /noindex/i.test(p.robots);
  if (!p.title) add('missing-title', p.url);
  else if (p.title.length > 62) add('title-too-long', p.url, `${p.title.length} chars: ${p.title}`);
  else if (p.title.length < 10) add('title-too-short', p.url, p.title);
  if (!p.description) add('missing-meta-description', p.url);
  else if (p.description.length > 160) add('meta-description-too-long', p.url, `${p.description.length} chars`);
  else if (p.description.length < 70) add('meta-description-too-short', p.url, `${p.description.length} chars`);
  if (!noindex) {
    titles.set(p.title, [...(titles.get(p.title) || []), p.url]);
    descs.set(p.description, [...(descs.get(p.description) || []), p.url]);
  }
  const h1s = p.headings.filter((h) => h === 1).length;
  if (h1s === 0) add('missing-h1', p.url);
  if (h1s > 1) add('multiple-h1', p.url, `${h1s} H1s`);
  for (let i = 1; i < p.headings.length; i++) {
    if (p.headings[i] > p.headings[i - 1] + 1) {
      add('heading-order-skip', p.url, `h${p.headings[i - 1]} to h${p.headings[i]}`);
      break;
    }
  }
  if (!p.canonical) add('missing-canonical', p.url);
  if (!p.ogImage) add('missing-og-image', p.url);
  const missingAlt = p.imgs.filter((t) => attr(t, 'alt') === null).length;
  if (missingAlt) add('images-missing-alt', p.url, `${missingAlt} images`);
  // Glossary pages are definitions by design, so they get a lower floor.
  const minWords = p.url.startsWith('/glossary/') && p.url !== '/glossary/' ? 120 : 250;
  if (!noindex && p.words < minWords) add('thin-content', p.url, `${p.words} words in main`);
  if (!p.ld.length) add('missing-structured-data', p.url);
  for (const block of p.ld) {
    try {
      const data = JSON.parse(block);
      const types = JSON.stringify(data);
      if (p.url.startsWith('/guides/') && p.url !== '/guides/' && !types.includes('"FAQPage"')) add('guide-without-faq-schema', p.url);
    } catch (e) {
      add('invalid-structured-data', p.url, e.message);
    }
  }
  const internal = p.links.filter((l) => l.startsWith('/') && !l.startsWith('//'));
  if (!internal.length && !p.links.length) add('no-outgoing-links', p.url);
  const broken = [...new Set(internal.filter((l) => !resolves(l)))];
  for (const b of broken) add('broken-internal-link', p.url, b);
  for (const l of new Set(p.mainLinks.filter((l) => l.startsWith('/')).map((l) => l.split('#')[0]))) {
    if (l !== p.url && inbound.has(l)) inbound.set(l, inbound.get(l) + 1);
  }
}
for (const [t, urls] of titles) if (t && urls.length > 1) urls.forEach((u) => add('duplicate-title', u, t));
for (const [d, urls] of descs) if (d && urls.length > 1) urls.forEach((u) => add('duplicate-meta-description', u));

// Orphans: pages with no links from any other page's main content, nav and footer excluded.
const navLinked = new Set(pages.flatMap((p) => p.links.filter((l) => l.startsWith('/')).map((l) => l.split('#')[0])));
for (const [url, n] of inbound) {
  if (url === '/' || url === '/404.html' || url.endsWith('404/')) continue;
  if (n === 0 && !navLinked.has(url)) add('orphan-page', url);
}

const robotsPath = path.join(dist, 'robots.txt');
if (existsSync(robotsPath)) {
  const robots = readFileSync(robotsPath, 'utf8');
  const groups = robots.split(/\n(?=User-agent:)/i);
  for (const agent of AI_AGENTS) {
    const g = groups.find((x) => new RegExp(`User-agent:\\s*${agent}\\b`, 'i').test(x));
    if (g && /Disallow:\s*\/\s*$/im.test(g)) add('ai-crawler-blocked', '/robots.txt', agent);
  }
  if (/User-agent:\s*\*[\s\S]*?Disallow:\s*\/\s*$/im.test(groups[0] || '')) add('ai-crawler-blocked', '/robots.txt', 'all agents');
}

const bySeverity = (s) => issues.filter((i) => i.severity === s);
const critical = bySeverity('critical');
if (asJson) {
  console.log(JSON.stringify({ pages: pages.length, issues }, null, 2));
} else {
  console.log(`\nSEO audit: ${pages.length} pages, ${critical.length} critical, ${bySeverity('warning').length} warnings, ${bySeverity('info').length} info`);
  const show = quiet ? [...critical, ...bySeverity('warning')] : issues;
  const grouped = {};
  for (const i of show) (grouped[i.type] ||= []).push(i);
  for (const [type, list] of Object.entries(grouped)) {
    console.log(`\n[${list[0].severity}] ${list[0].title} (${list.length})  Fix: ${list[0].fix}`);
    for (const i of list.slice(0, quiet ? 5 : 50)) console.log(`  ${i.url}${i.detail ? `  ${i.detail}` : ''}`);
    if (quiet && list.length > 5) console.log(`  ...and ${list.length - 5} more`);
  }
  console.log('');
}
process.exit(critical.length ? 1 : 0);
