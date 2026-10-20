// Renders a share image for every guide, update and template, so each link
// posted on LinkedIn or in a chat shows its own title instead of the site card.
// Usage: npm install --no-save playwright && npx playwright install chromium && npm run og
// Writes public/og/<section>/<slug>.jpg. Commit the files.
import { createRequire } from 'node:module';
import { readFileSync, readdirSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { templates } from '../src/data/templates.ts';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW_PATH || 'playwright');
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const font = (pkg, file) => readFileSync(require.resolve(`${pkg}/files/${file}`, { paths: [root] })).toString('base64');
const display = font('@fontsource-variable/bricolage-grotesque', 'bricolage-grotesque-latin-wght-normal.woff2');
const body = font('@fontsource-variable/inter', 'inter-latin-wght-normal.woff2');
const brand = font('@fontsource-variable/figtree', 'figtree-latin-wght-normal.woff2');

// Category labels, same as src/content.config.ts.
const categories = {
  foundations: 'Foundations',
  types: 'Types of accommodation',
  money: 'Rent and Housing Benefit',
  regulation: 'Regulation',
  practice: 'Best practice',
  grey: 'Grey areas',
};

const frontmatter = (file) => {
  const fm = readFileSync(file, 'utf8').split('---')[1] || '';
  const get = (k) => (fm.match(new RegExp(`^${k}:\\s*"?(.*?)"?\\s*$`, 'm')) || [])[1] || '';
  return { title: get('title'), category: get('category'), tag: get('tag') };
};
const entries = (dir) =>
  readdirSync(path.join(root, dir))
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => ({ slug: f.replace(/\.mdx$/, ''), ...frontmatter(path.join(root, dir, f)) }));

const cards = [
  ...entries('src/content/guides').map((g) => ({ out: `guides/${g.slug}`, kicker: categories[g.category] || 'Guide', title: g.title })),
  ...entries('src/content/updates').map((u) => ({ out: `updates/${u.slug}`, kicker: `Update: ${u.tag}`, title: u.title })),
  ...templates.map((t) => ({ out: `templates/${t.slug}`, kicker: `Free ${t.format} template`, title: t.title })),
];

// The logo mark, same paths as src/components/Logo.astro.
const mark = `<svg viewBox="0 0 120 92" fill="none" stroke-width="6.2" stroke-linecap="round" stroke-linejoin="round">
<path d="M22 76 V45 H9 L58 6 L77 21" stroke="#14304F"/><path d="M77 21 V9.5 H90 V30" stroke="#129994"/>
<path d="M90 30 L108 45 H95.5 V74 Q95.5 83 86.5 83 H65 C58 83 52.5 78.5 47.5 72" stroke="#CFA759"/>
<path d="M47.5 72 C37 63 31.5 54 31.5 46 C31.5 37.5 37.5 32 44.5 32 C50.5 32 55.5 36.5 57 43" stroke="#14304F"/>
<path d="M57 43 C58.5 36.5 64 32 70.5 32 C77.5 32 83 37.5 83 45" stroke="#CFA759"/>
<path d="M83 45 C83 58 70 69 57 77 C47 83 37 85.5 30 84.5 C25 83.8 22 80.5 22 76" stroke="#129994"/></svg>`;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const size = (t) => (t.length > 70 ? 54 : t.length > 48 ? 62 : 72);

const html = (c) => `<html><head><style>
@font-face{font-family:D;src:url(data:font/woff2;base64,${display}) format('woff2');font-weight:200 800}
@font-face{font-family:B;src:url(data:font/woff2;base64,${body}) format('woff2');font-weight:100 900}
@font-face{font-family:F;src:url(data:font/woff2;base64,${brand}) format('woff2');font-weight:300 900}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;font-family:B;color:#102a46;position:relative;
background:radial-gradient(640px 420px at 100% 0%,rgba(18,153,148,.16),transparent 60%),radial-gradient(560px 380px at 0% 100%,rgba(207,167,89,.18),transparent 60%),#f7f6f2}
.grid{position:absolute;inset:0;background-image:linear-gradient(to right,rgba(16,42,70,.06) 1px,transparent 1px),linear-gradient(to bottom,rgba(16,42,70,.06) 1px,transparent 1px);background-size:56px 56px;mask-image:radial-gradient(ellipse 80% 80% at 70% 30%,#000 30%,transparent 80%)}
.wrap{position:absolute;inset:0;padding:60px 80px 56px;display:flex;flex-direction:column}
.brand{display:flex;align-items:center;gap:16px;font-family:F;line-height:1.02}
.brand svg{width:84px;height:64px}
.brand b{display:block;font-weight:750;font-size:28px;letter-spacing:-.01em}
.t{color:#129994}.n{color:#14304f}.n i{font-style:normal;font-weight:450}
.kicker{margin-top:auto;display:inline-block;align-self:flex-start;font-size:22px;font-weight:650;color:#fff;background:#0e7a76;padding:9px 20px;border-radius:999px}
h1{font-family:D;font-weight:690;line-height:1.04;letter-spacing:-.03em;margin-top:22px;max-width:1040px}
.foot{margin-top:28px;display:flex;justify-content:space-between;font-size:22px;color:#2c4462}
.bar{position:absolute;left:0;right:0;bottom:0;height:10px;background:linear-gradient(90deg,#129994,#cfa759)}
</style></head><body><div class="grid"></div><div class="bar"></div>
<div class="wrap"><div class="brand">${mark}<div><b class="t">Exempt</b><b class="n">Accommodation<i>.com</i></b></div></div>
<span class="kicker">${esc(c.kicker)}</span>
<h1 style="font-size:${size(c.title)}px">${esc(c.title)}</h1>
<div class="foot"><span>Supported housing in England, in plain English</span><span>exemptaccommodation.com</span></div></div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const c of cards) {
  const file = path.join(root, 'public/og', `${c.out}.jpg`);
  mkdirSync(path.dirname(file), { recursive: true });
  await page.setContent(html(c), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: file, type: 'jpeg', quality: 86 });
}
await browser.close();
console.log(`${cards.length} share images written to public/og/`);
