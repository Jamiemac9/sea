// Tells Bing, Yandex, Seznam, Naver and other IndexNow search engines about
// new or changed pages, so they crawl them within hours instead of weeks.
// Google does not use IndexNow: submit the sitemap in Search Console instead.
//
// Usage:
//   node scripts/indexnow.mjs --all                    every URL in the live sitemap
//   node scripts/indexnow.mjs --changed <from> <to>    pages changed between two commits
//   node scripts/indexnow.mjs /guides/x/ /updates/y/   specific paths
//
// The key file public/<KEY>.txt must be live on the site first. The GitHub
// workflow .github/workflows/indexnow.yml runs this after every push to main.
import { execSync } from 'node:child_process';

const KEY = '48d8ca8382287108464131d1f048aab6';
const origin = (process.env.SITE_URL || 'https://exemptaccommodation.com').replace(/\/$/, '');
const host = new URL(origin).host;
const keyLocation = `${origin}/${KEY}.txt`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function sitemapUrls() {
  const index = await (await fetch(`${origin}/sitemap-index.xml`)).text();
  const maps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const urls = [];
  for (const map of maps) {
    const xml = await (await fetch(map)).text();
    urls.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  }
  return urls;
}

/** Map changed source files to the pages they affect. */
function changedPaths(from, to) {
  const valid = (sha) => sha && !/^0+$/.test(sha);
  const range = valid(from) ? `${from} ${to}` : `${to}~1 ${to}`;
  const files = execSync(`git diff --name-only ${range}`, { encoding: 'utf8' }).split('\n').filter(Boolean);
  const paths = new Set();
  for (const f of files) {
    let m;
    if ((m = f.match(/^src\/content\/guides\/(.+)\.mdx$/))) paths.add(`/guides/${m[1]}/`).add('/guides/');
    else if ((m = f.match(/^src\/content\/updates\/(.+)\.mdx$/))) paths.add(`/updates/${m[1]}/`).add('/updates/').add('/');
    else if (/^(src\/data\/templates\.ts|public\/downloads\/)/.test(f)) paths.add('/templates/');
    else if (f === 'src/data/glossary.ts') paths.add('/glossary/');
    else if (/^src\/data\/(timeline\.ts|key-facts\.json)$/.test(f)) paths.add('/regulation-tracker/').add('/');
    else if (f === 'src/data/resources.ts') paths.add('/resources/');
    else if (f === 'src/data/faqs.ts') paths.add('/faq/');
    else if ((m = f.match(/^src\/pages\/(.+)\.astro$/)) && !m[1].includes('[')) {
      const p = m[1].replace(/(^|\/)index$/, '');
      paths.add(p ? `/${p}/` : '/');
    }
  }
  paths.delete('/404/');
  return [...paths];
}

async function keyIsLive() {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(keyLocation, { cache: 'no-store' });
      if (res.ok && (await res.text()).trim() === KEY) return true;
    } catch {
      /* not deployed yet */
    }
    await sleep(30_000);
  }
  return false;
}

const args = process.argv.slice(2);
let urls;
if (args[0] === '--all') urls = await sitemapUrls();
else if (args[0] === '--changed') urls = changedPaths(args[1], args[2] || 'HEAD').map((p) => origin + p);
else urls = args.map((p) => (p.startsWith('http') ? p : origin + p));

if (!urls.length) {
  console.log('IndexNow: nothing to submit.');
  process.exit(0);
}
if (!(await keyIsLive())) {
  console.error(`IndexNow: key file not found at ${keyLocation}. Is the site deployed?`);
  process.exit(1);
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key: KEY, keyLocation, urlList: urls.slice(0, 10_000) }),
});
console.log(`IndexNow: ${res.status} for ${urls.length} URL(s)`);
urls.forEach((u) => console.log(`  ${u}`));
// 200 and 202 both mean accepted.
if (res.status !== 200 && res.status !== 202) process.exit(1);
