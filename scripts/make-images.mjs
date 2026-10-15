// Regenerates the social share image and app icons from HTML, using the site's own fonts.
// Usage: PW_PATH=$(npm root -g)/playwright node scripts/make-images.mjs
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
const logo = readFileSync(path.join(pub, 'favicon.svg'), 'utf8');

const css = `
@font-face{font-family:D;src:url(data:font/woff2;base64,${display}) format('woff2');font-weight:200 800}
@font-face{font-family:B;src:url(data:font/woff2;base64,${body}) format('woff2');font-weight:100 900}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;font-family:B;color:#eaf3ef;
background:radial-gradient(700px 420px at 92% -10%,rgba(63,209,173,.38),transparent 60%),radial-gradient(600px 380px at -5% 110%,rgba(216,245,154,.22),transparent 60%),#071417;position:relative}
.grid{position:absolute;inset:0;background-image:linear-gradient(to right,rgba(234,243,239,.06) 1px,transparent 1px),linear-gradient(to bottom,rgba(234,243,239,.06) 1px,transparent 1px);background-size:56px 56px;mask-image:radial-gradient(ellipse 80% 80% at 70% 30%,#000 30%,transparent 80%)}
.wrap{position:absolute;inset:0;padding:72px 80px;display:flex;flex-direction:column}
.brand{display:flex;align-items:center;gap:18px;font-family:D;font-weight:700;font-size:40px;letter-spacing:-.02em}
.brand svg{width:64px;height:64px}
h1{font-family:D;font-weight:690;font-size:78px;line-height:1;letter-spacing:-.035em;margin-top:auto;max-width:900px}
h1 em{font-style:normal;color:#D8F59A}
p{margin-top:26px;font-size:28px;color:#b9cdc8;max-width:860px}
.pill{position:absolute;right:80px;top:84px;font-size:20px;font-weight:600;color:#071417;background:#D8F59A;padding:10px 20px;border-radius:999px}
`;
const og = `<html><head><style>${css}</style></head><body><div class="grid"></div>
<svg style="position:absolute;right:-40px;bottom:-30px;opacity:.5" width="620" height="420" viewBox="0 0 560 420"><path d="M20 400 C 120 400, 130 300, 210 290 S 310 240, 330 160 S 430 60, 520 30" fill="none" stroke="#3FD1AD" stroke-width="4" stroke-dasharray="8 12" stroke-linecap="round"/><circle cx="520" cy="30" r="14" fill="#3FD1AD"/><circle cx="210" cy="290" r="9" fill="#FFB547"/><circle cx="20" cy="400" r="9" fill="#E9654B"/></svg>
<div class="wrap"><div class="brand">${logo}<span>SEA Hub</span></div>
<span class="pill">England · 2026</span>
<h1>Supported housing rules, <em>without the jargon.</em></h1>
<p>Guides, tools and a regulation tracker for supported exempt accommodation.</p></div></body></html>`;

const icon = (size, pad) => `<html><head><style>*{margin:0}body{width:${size}px;height:${size}px;background:#0B1F24;display:grid;place-items:center}svg{width:${size - pad * 2}px;height:${size - pad * 2}px}</style></head><body>${logo.replace('rx="12"', 'rx="0"')}</body></html>`;

const browser = await chromium.launch();
const shoot = async (html, w, h, out) => {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(pub, out), type: 'png' });
  await page.close();
};
await shoot(og, 1200, 630, 'og-default.png');
await shoot(icon(512, 40), 512, 512, 'icon-512.png');
await shoot(icon(192, 16), 192, 192, 'icon-192.png');
await shoot(icon(180, 14), 180, 180, 'apple-touch-icon.png');
await browser.close();
console.log('images written to public/');
