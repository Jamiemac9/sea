// Makes the images for one article: a square image to post on LinkedIn (1200x1200)
// and a wide share image for link previews (1200x630).
// Usage: PW_PATH=/opt/node-tools/node_modules/playwright node make-post-image.mjs spec.json
// spec.json: {
//   "brand": "ea" | "sa",
//   "out": "path/without/extension",        // writes <out>-post.jpg and <out>.jpg
//   "kicker": "Awaab's Law Phase 2",
//   "title": "Does it cover your scheme?",
//   "layout": "compare" | "timeline" | "list",
//   "items": [ { "label": "...", "value": "...", "tone": "good|bad|warn|info" } ],
//   "note": "short line under the items",
//   "source": "Source: MHCLG, Awaab's Law Phase 2 guidance"
// }
// Keep text short. Every fact on an image must also be in the article and its sources.
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW_PATH || 'playwright');
const specFile = process.argv[2];
const spec = JSON.parse(readFileSync(specFile, 'utf8'));
const root = process.cwd();
const b64 = (p) => readFileSync(p).toString('base64');
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const themes = {
  ea: () => {
    const f = (pkg, file) => b64(require.resolve(`${pkg}/files/${file}`, { paths: [root] }));
    return {
      fonts: `@font-face{font-family:D;src:url(data:font/woff2;base64,${f('@fontsource-variable/bricolage-grotesque', 'bricolage-grotesque-latin-wght-normal.woff2')}) format('woff2');font-weight:200 800}
@font-face{font-family:B;src:url(data:font/woff2;base64,${f('@fontsource-variable/inter', 'inter-latin-wght-normal.woff2')}) format('woff2');font-weight:100 900}`,
      bg: `radial-gradient(700px 500px at 100% 0%,rgba(18,153,148,.16),transparent 60%),radial-gradient(600px 420px at 0% 100%,rgba(207,167,89,.18),transparent 60%),#f7f6f2`,
      ink: '#102a46', mute: '#3b5370', card: '#ffffff', line: 'rgba(16,42,70,.12)', kickBg: '#0e7a76', kickInk: '#fff', accent: '#129994',
      good: '#0e7a76', bad: '#b4453a', warn: '#b07d1f', info: '#14304f',
      logo: `<div class="brand"><svg viewBox="0 0 120 92" fill="none" stroke-width="6.2" stroke-linecap="round" stroke-linejoin="round" width="70" height="54"><path d="M22 76 V45 H9 L58 6 L77 21" stroke="#14304F"/><path d="M77 21 V9.5 H90 V30" stroke="#129994"/><path d="M90 30 L108 45 H95.5 V74 Q95.5 83 86.5 83 H65 C58 83 52.5 78.5 47.5 72" stroke="#CFA759"/><path d="M47.5 72 C37 63 31.5 54 31.5 46 C31.5 37.5 37.5 32 44.5 32 C50.5 32 55.5 36.5 57 43" stroke="#14304F"/><path d="M57 43 C58.5 36.5 64 32 70.5 32 C77.5 32 83 37.5 83 45" stroke="#CFA759"/><path d="M83 45 C83 58 70 69 57 77 C47 83 37 85.5 30 84.5 C25 83.8 22 80.5 22 76" stroke="#129994"/></svg><div><b style="color:#129994">Exempt</b><b style="color:#14304f">Accommodation<i>.com</i></b></div></div>`,
      site: 'exemptaccommodation.com',
      bar: 'linear-gradient(90deg,#129994,#cfa759)',
    };
  },
  sa: () => {
    const f = (w) => b64(path.join(root, 'assets/fonts', `schibsted-grotesk-latin-${w}-normal.woff2`));
    return {
      fonts: [400, 600, 800].map((w) => `@font-face{font-family:D;src:url(data:font/woff2;base64,${f(w)}) format('woff2');font-weight:${w}}@font-face{font-family:B;src:url(data:font/woff2;base64,${f(w)}) format('woff2');font-weight:${w}}`).join(''),
      bg: `radial-gradient(800px 520px at 100% 0%,rgba(67,181,129,.14),transparent 60%),radial-gradient(700px 480px at 0% 100%,rgba(212,242,90,.08),transparent 60%),#050E19`,
      ink: '#EEF3F7', mute: '#AEBBC8', card: '#0B1A2C', line: 'rgba(238,243,247,.12)', kickBg: '#D4F25A', kickInk: '#06101C', accent: '#D4F25A',
      good: '#43B581', bad: '#E35D5D', warn: '#F0954A', info: '#E8B84A',
      logo: `<div class="brand"><svg viewBox="0 0 44 44" width="52" height="52"><rect x="2" y="2" width="18" height="18" rx="4" fill="#E8B84A"/><rect x="24" y="2" width="18" height="18" rx="4" fill="#43B581"/><rect x="2" y="24" width="18" height="18" rx="4" fill="#F0954A"/><rect x="24" y="24" width="18" height="18" rx="4" fill="#E35D5D"/></svg><div class="sa"><b>Support</b> <span>Audit</span></div></div>`,
      site: 'supportaudit.co.uk',
      bar: 'linear-gradient(90deg,#E8B84A,#43B581,#F0954A,#E35D5D)',
    };
  },
};

const t = themes[spec.brand]();
const icon = { good: '✓', bad: '✕', warn: '!', info: '→' };

const items = (layout, wide) => {
  const it = spec.items || [];
  if (layout === 'compare') {
    return `<div class="cmp">${it.map((x) => `<div class="cell ${x.tone || 'info'}"><span class="ic">${icon[x.tone || 'info']}</span><div><div class="lab">${esc(x.label)}</div><div class="val">${esc(x.value)}</div></div></div>`).join('')}</div>`;
  }
  if (layout === 'timeline') {
    return `<div class="tl ${wide ? 'row' : ''}">${it.map((x, i) => `<div class="step ${x.tone || 'info'}"><span class="dot">${i + 1}</span><div><div class="lab">${esc(x.label)}</div><div class="val">${esc(x.value)}</div></div></div>`).join('')}</div>`;
  }
  return `<ul class="lst">${it.map((x) => `<li class="${x.tone || 'info'}"><span class="ic">${icon[x.tone || 'info']}</span><span><b>${esc(x.label)}</b> ${esc(x.value || '')}</span></li>`).join('')}</ul>`;
};

const html = (w, h) => {
  const wide = w / h > 1.5;
  const titleSize = wide ? (spec.title.length > 40 ? 50 : 60) : (spec.title.length > 40 ? 76 : 88);
  return `<html><head><style>${t.fonts}
*{margin:0;box-sizing:border-box}
body{width:${w}px;height:${h}px;overflow:hidden;font-family:B;color:${t.ink};background:${t.bg};position:relative}
.wrap{position:absolute;inset:0;padding:${wide ? '44px 64px 40px' : '72px 76px 64px'};display:flex;flex-direction:column}
.brand{display:flex;align-items:center;gap:14px;line-height:1.02}
.brand b{display:block;font-family:D;font-weight:800;font-size:${wide ? 24 : 28}px;letter-spacing:-.01em}
.brand i{font-style:normal;font-weight:400}
.brand .sa{font-family:D;font-size:${wide ? 30 : 36}px}.brand .sa b{display:inline;font-size:inherit}.brand .sa span{font-weight:400;color:${t.mute}}
.kick{display:inline-block;align-self:flex-start;margin-top:${wide ? 22 : 56}px;font-weight:700;font-size:${wide ? 20 : 26}px;background:${t.kickBg};color:${t.kickInk};padding:${wide ? '7px 16px' : '10px 22px'};border-radius:999px}
h1{font-family:D;font-weight:800;font-size:${titleSize}px;line-height:1.02;letter-spacing:-.03em;margin-top:${wide ? 14 : 24}px;max-width:${wide ? 1080 : 1040}px}
h1 em{font-style:normal;color:${t.accent}}
.body{margin-top:${wide ? 24 : 48}px;flex:1;display:flex;flex-direction:column;gap:${wide ? 14 : 22}px}
.cmp{display:grid;grid-template-columns:${wide ? 'repeat(' + (spec.items || []).length + ',1fr)' : '1fr 1fr'};gap:${wide ? 14 : 20}px}
.cell,.step{background:${t.card};border:1px solid ${t.line};border-radius:18px;padding:${wide ? '16px 18px' : '26px 26px'};display:flex;gap:16px;align-items:flex-start}
.ic,.dot{flex:none;width:${wide ? 38 : 50}px;height:${wide ? 38 : 50}px;border-radius:50%;display:grid;place-items:center;font-weight:800;font-size:${wide ? 20 : 26}px;color:#fff}
.good .ic,.good .dot{background:${t.good}}.bad .ic,.bad .dot{background:${t.bad}}.warn .ic,.warn .dot{background:${t.warn}}.info .ic,.info .dot{background:${t.info}}
${spec.brand === 'sa' ? '.info .ic,.info .dot{color:#06101C}' : ''}
.lab{font-family:D;font-weight:800;font-size:${wide ? 22 : 32}px;letter-spacing:-.01em;line-height:1.1}
.val{margin-top:6px;font-size:${wide ? 17 : 24}px;line-height:1.3;color:${t.mute}}
.tl{display:flex;flex-direction:column;gap:${wide ? 12 : 18}px}.tl.row{flex-direction:row}.tl.row .step{flex:1}
.lst{list-style:none;display:flex;flex-direction:column;gap:${wide ? 10 : 18}px;font-size:${wide ? 20 : 28}px;line-height:1.3}
.lst li{display:flex;gap:16px;align-items:flex-start}.lst b{font-family:D}
.note{font-size:${wide ? 19 : 26}px;line-height:1.35;color:${t.ink};font-weight:600}
.foot{margin-top:auto;display:flex;justify-content:space-between;align-items:flex-end;gap:24px;font-size:${wide ? 16 : 20}px;color:${t.mute}}
.foot b{color:${t.ink};font-weight:700}
.bar{position:absolute;left:0;right:0;bottom:0;height:10px;background:${t.bar}}
</style></head><body><div class="bar"></div><div class="wrap">
${t.logo}
<span class="kick">${esc(spec.kicker)}</span>
<h1>${esc(spec.title).replace(/\*(.+?)\*/g, '<em>$1</em>')}</h1>
<div class="body">${items(spec.layout, wide)}${spec.note && !wide ? `<p class="note">${esc(spec.note)}</p>` : ''}</div>
<div class="foot"><span>${esc(spec.source || '')}</span><b>${t.site}</b></div>
</div></body></html>`;
};

const browser = await chromium.launch();
for (const [w, h, suffix] of [[1200, 1200, '-post'], [1200, 630, '']]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(html(w, h), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const file = path.resolve(root, `${spec.out}${suffix}.jpg`);
  mkdirSync(path.dirname(file), { recursive: true });
  await page.screenshot({ path: file, type: 'jpeg', quality: 88 });
  console.log('wrote', path.relative(root, file));
  await page.close();
}
await browser.close();
