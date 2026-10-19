# ExemptAccommodation.com

A resource hub for supported exempt accommodation (SEA) and supported housing in England, published by SEA Audit. It is a static Astro site: every page is plain HTML at build time, so search engines and AI answer engines can read all of it without running JavaScript.

## Run it

Needs Node 22.12 or newer.

```sh
npm install
npm run dev         # local dev server at http://localhost:4321
npm run build       # content lint + build + SEO audit, output in dist/
npm run serve       # preview the build
npm run typecheck   # astro check
```

The build fails if the content linter finds a strong AI-writing tell or the SEO audit finds a critical issue (broken internal link, missing title, invalid structured data, AI crawlers blocked).

## Deploy to Cloudflare Pages

1. In the Cloudflare dashboard, go to Workers & Pages, then Create, then Pages, then Connect to Git, and pick `Jamiemac9/sea`.
2. Production branch: `main`.
3. Framework preset: Astro. Build command: `npm run build`. Build output directory: `dist`.
4. Under Environment variables, set `SITE_URL` to the live address, for example `https://exemptaccommodation.com`, plus any of the variables below you need. `.env.example` lists them all.
5. Deploy, then add your custom domain under the project's Custom domains tab.

Every push to `main` deploys to production, and other branches get preview URLs. `.node-version` pins Node 22 for the build. `public/_headers` sets long caching for hashed assets and basic security headers. Cloudflare serves `dist/404.html` for missing pages.

To deploy from your own machine instead: `npm run build && npx wrangler pages deploy dist --project-name sea-hub`.

## Configuration

Everything brand-related lives in `src/site.config.ts`. The logo is an SVG in `src/components/Logo.astro`, redrawn from the brand artwork, with navy that switches to a light tone in dark mode. Environment variables:

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | Public origin for canonicals, sitemap and structured data. Defaults to `https://exemptaccommodation.com`. Set it before launch. |
| `PUBLIC_ADSENSE_CLIENT` | AdSense publisher id, `ca-pub-...`. Without it every slot shows a SEA Audit house ad. |
| `PUBLIC_ADSENSE_SLOT_LEADERBOARD`, `_IN_ARTICLE`, `_SIDEBAR`, `_FOOTER` | AdSense ad unit ids per placement. |
| `PUBLIC_CONSENT_MODE` | `builtin` (default, the hub's own banner plus Google Consent Mode v2) or `external` (a Google-certified CMP shows the message). |
| `PUBLIC_GA4_ID` | Optional GA4 id. Loads only after analytics consent. |
| `PUBLIC_LEAD_ENDPOINT` | Optional URL that receives readiness check results as JSON. Without it, results open seaaudit.com with scores in the query string. |
| `PUBLIC_AUDIT_URL`, `PUBLIC_AUDIT_BOOK_PATH` | Where "Book an audit" links go. Default `https://seaaudit.com/`. |
| `PUBLIC_CONTACT_EMAIL` | Contact address shown on the site. |

## What is on the site

- 17 guides in `src/content/guides/*.mdx`, grouped into foundations, types of accommodation, rent and Housing Benefit, regulation, best practice and grey areas.
- A glossary of 42 terms with a page each (`src/data/glossary.ts`).
- A regulation tracker (`src/data/timeline.ts`), FAQ (`src/data/faqs.ts`), resources directory (`src/data/resources.ts`) and four audience hubs at `/for/...` (`src/data/audiences.ts`).
- Three tools: the audit readiness check (`src/data/readiness.ts`), the exempt accommodation checker and the service charge calculator.
- About, advertise, privacy and cookie pages.

## Keeping the key facts current

The "Key rules and dates" band on the home page and the "last checked" dates on the regulation tracker and `llms.txt` come from `src/data/key-facts.json`. It holds rules and dates, not statistics, because statistics go out of date fast.

Every couple of months, re-check each item against its source and update `lastChecked`. If it is older than `reviewEveryDays` (60 by default), `npm run build` prints a warning.

## Adding or updating a guide

Create `src/content/guides/your-slug.mdx`. The frontmatter is validated by `src/content.config.ts`:

- `quickAnswer`: the direct answer, 80 to 420 characters. It is shown first and used in structured data.
- `keyPoints`: three to five points for "The short version".
- `nextStep`: one concrete action with a link.
- `faqs`: real questions with direct answers. They become FAQPage structured data.
- `sources`: primary legislation and official guidance first. Mark commentary as commentary in `publisher`.
- `description`: 70 to 160 characters. `seoTitle`: 50 characters or fewer.
- Update `updated:` whenever the substance changes.

In the body you can use `<Callout type="note|watch|practice|grey" title="...">` and `<InArticleAd />` without importing them.

Writing rules, enforced by `npm run lint:content`:

- No em or en dashes in prose, and straight quotes only.
- No "not just X but Y", staged run-ups, chatbot phrases or knowledge-limit disclaimers.
- Sentence case headings.
- Answer first, short lists, one next step at the end.

## How the three referenced repos are used

- [every-app/open-seo](https://github.com/every-app/open-seo): `scripts/seo-audit.mjs` ports OpenSEO's site audit issue registry (titles, descriptions, H1s, heading order, canonicals, thin content, alt text, broken links, orphans, duplicates) and its AI visibility check on `robots.txt`, and runs it on every build. OpenSEO itself is a hosted or self-hosted app that needs a DataForSEO key. Use it after launch for keyword research, rank tracking and AI visibility tracking.
- [blader/humanizer](https://github.com/blader/humanizer): its patterns drive `scripts/lint-content.mjs`, and the guides were written to its rules. The linter flags tells, but cannot rewrite prose. Run the humanizer skill on new drafts before publishing.
- [ayghri/i-have-adhd](https://github.com/ayghri/i-have-adhd): its rules shape every guide. The quick answer leads, "The short version" is capped at five points, steps are numbered, time estimates are specific and each guide ends with one next step. The linter warns on long bulleted lists.

## SEO, AEO and GEO

- Static HTML for every page, with canonical URLs, Open Graph tags and a sitemap.
- JSON-LD on every page: Organization, WebSite, BreadcrumbList, plus Article (with abstract, citations and speakable), FAQPage, HowTo, DefinedTerm and DefinedTermSet, CollectionPage, ItemList and WebApplication where relevant.
- `/llms.txt` and `/llms-full.txt` for language models, `/rss.xml` for feeds, and `/robots.txt` with GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot and others allowed by name.
- Answer-first structure on every guide and glossary page, with dated updates and cited sources.

## Ads

1. Apply for AdSense with the live domain.
2. Set `PUBLIC_ADSENSE_CLIENT` and the slot ids, then redeploy. `/ads.txt` publishes the Google line automatically.
3. For UK and EEA traffic Google requires a certified consent management platform. Turn on Google's Privacy and messaging (or another certified CMP) and set `PUBLIC_CONSENT_MODE=external`.

Every slot reserves its space before it loads, so ads do not shift the layout. If ads are declined or unfilled, the SEA Audit house ad shows instead.

## SEA Audit funnel

- All outbound links go through `auditUrl()` in `src/site.config.ts`, tagged `utm_source=sea-hub` with a campaign per placement.
- The readiness check posts this JSON to `PUBLIC_LEAD_ENDPOINT` when the visitor consents:

```json
{
  "source": "sea-hub-readiness-check",
  "submittedAt": "2026-10-15T10:00:00.000Z",
  "contact": { "name": "", "email": "", "organisation": "", "schemes": "6 to 20" },
  "score": 62,
  "areas": { "structure": 67, "planning": 50, "delivery": 50, "safeguarding": 83, "property": 67, "rent": 50, "governance": 67, "voice": 33 },
  "priorityGaps": ["p1", "d1", "o3", "r2", "s2"],
  "answers": { "s1": 2, "s2": 1 }
}
```

Without an endpoint, the check opens seaaudit.com with `readiness_score`, `areas`, `gaps`, `organisation` and `schemes` as query parameters. Name and email are never put in the URL.

## Before launch

- Have someone with sector knowledge check each guide against its sources, and keep that review going. The about page says this happens.
- Have privacy and cookie pages reviewed by your data protection lead.
- Set `SITE_URL`, verify the domain in Google Search Console and Bing Webmaster Tools, and submit `/sitemap-index.xml`.
- Re-check the regulation tracker when draft licensing regulations are published.

## Regenerating images

`public/og-default.png` and the app icons are rendered from HTML with the site fonts:

```sh
npm install --no-save playwright && npx playwright install chromium
npm run images
```
