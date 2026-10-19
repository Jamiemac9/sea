// Regenerates the social share image and app icons from HTML, using the site's own fonts.
// Usage: npm install --no-save playwright && npx playwright install chromium && npm run images
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW_PATH || 'playwright');
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pub = path.join(root, 'public');
const font = (pkg, file) => readFileSync(require.resolve(`${pkg}/files/${file}`, { paths: [root] })).toString('base64');
const display = font('@fontsource-variable/bricolage-grotesque', 'bricolage-grotesque-latin-wght-normal.woff2');
const body = font('@fontsource-variable/inter', 'inter-latin-wght-normal.woff2');
const brand = font('@fontsource-variable/figtree', 'figtree-latin-wght-normal.woff2');

// The logo mark, same paths as src/components/Logo.astro.
const mark = (stroke = 6.2) => `<svg viewBox="0 0 120 92" fill="none" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">
<path d="M22 76 V45 H9 L58 6 L77 21" stroke="#14304F"/><path d="M77 21 V9.5 H90 V30" stroke="#129994"/>
<path d="M90 30 L108 45 H95.5 V74 Q95.5 83 86.5 83 H65 C58 83 52.5 78.5 47.5 72" stroke="#CFA759"/>
<path d="M47.5 72 C37 63 31.5 54 31.5 46 C31.5 37.5 37.5 32 44.5 32 C50.5 32 55.5 36.5 57 43" stroke="#14304F"/>
<path d="M57 43 C58.5 36.5 64 32 70.5 32 C77.5 32 83 37.5 83 45" stroke="#CFA759"/>
<path d="M83 45 C83 58 70 69 57 77 C47 83 37 85.5 30 84.5 C25 83.8 22 80.5 22 76" stroke="#129994"/></svg>`;

const css = `
@font-face{font-family:D;src:url(data:font/woff2;base64,${display}) format('woff2');font-weight:200 800}
@font-face{font-family:B;src:url(data:font/woff2;base64,${body}) format('woff2');font-weight:100 900}
@font-face{font-family:F;src:url(data:font/woff2;base64,${brand}) format('woff2');font-weight:300 900}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;font-family:B;color:#102a46;position:relative;
background:radial-gradient(640px 420px at 100% 0%,rgba(18,153,148,.16),transparent 60%),radial-gradient(560px 380px at 0% 100%,rgba(207,167,89,.18),transparent 60%),#f7f6f2}
.grid{position:absolute;inset:0;background-image:linear-gradient(to right,rgba(16,42,70,.06) 1px,transparent 1px),linear-gradient(to bottom,rgba(16,42,70,.06) 1px,transparent 1px);background-size:56px 56px;mask-image:radial-gradient(ellipse 80% 80% at 70% 30%,#000 30%,transparent 80%)}
.wrap{position:absolute;inset:0;padding:68px 80px;display:flex;flex-direction:column}
.brand{display:flex;align-items:center;gap:20px;font-family:F;line-height:1.02}
.brand svg{width:118px;height:90px}
.brand b{display:block;font-weight:750;font-size:38px;letter-spacing:-.01em}
.t{color:#129994}.n{color:#14304f}.n i{font-style:normal;font-weight:450}
h1{font-family:D;font-weight:690;font-size:76px;line-height:1.02;letter-spacing:-.035em;margin-top:auto;max-width:920px}
h1 em{font-style:normal;background:linear-gradient(transparent 60%,#ecc66e 60%,#ecc66e 92%,transparent 92%)}
p{margin-top:24px;font-size:28px;color:#2c4462;max-width:880px}
.pill{position:absolute;right:80px;top:88px;font-size:20px;font-weight:600;color:#fff;background:#0e7a76;padding:10px 20px;border-radius:999px}
`;
const og = `<html><head><style>${css}</style></head><body><div class="grid"></div>
<div class="wrap"><div class="brand">${mark()}<div><b class="t">Exempt</b><b class="n">Accommodation<i>.com</i></b></div></div>
<span class="pill">England</span>
<h1>Supported housing rules, <em>without the jargon.</em></h1>
<p>Guides, tools and a regulation tracker for supported exempt accommodation.</p></div></body></html>`;

// App icons: the mark on white, inside the maskable safe zone.
const icon = (size) =>
  `<html><head><style>*{margin:0}body{width:${size}px;height:${size}px;background:#fff;display:grid;place-items:center}svg{width:${Math.round(size * 0.7)}px;height:auto}</style></head><body>${mark(8)}</body></html>`;

const browser = await chromium.launch();
const shoot = async (html, w, h, out) => {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(pub, out), type: 'png' });
  await page.close();
};
await shoot(og, 1200, 630, 'og-default.png');
await shoot(icon(512), 512, 512, 'icon-512.png');
await shoot(icon(192), 192, 192, 'icon-192.png');
await shoot(icon(180), 180, 180, 'apple-touch-icon.png');
await browser.close();
console.log('images written to public/');
