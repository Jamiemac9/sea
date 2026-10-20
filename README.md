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
| `PUBLIC_LEAD_ENDPOINT` | Optional URL that receives readiness check results as JSON. Set it to `/api/subscribe` to send them through the sign-up function below. Without it, results open seaaudit.com with scores in the query string. |
| `PUBLIC_SUBSCRIBE_ENDPOINT` | Where template downloads and alert sign-ups post. Default `/api/subscribe`, the Pages Function in `functions/api/subscribe.ts`. |
| `PUBLIC_AUDIT_URL`, `PUBLIC_AUDIT_BOOK_PATH` | Where "Book an audit" links go. Default `https://seaaudit.com/`. |
| `PUBLIC_CONTACT_EMAIL` | Contact address shown on the site. |

## What is on the site

- 17 guides in `src/content/guides/*.mdx`, grouped into foundations, types of accommodation, rent and Housing Benefit, regulation, best practice and grey areas.
- A glossary of 42 terms with a page each (`src/data/glossary.ts`).
- A regulation tracker (`src/data/timeline.ts`), FAQ (`src/data/faqs.ts`), resources directory (`src/data/resources.ts`) and four audience hubs at `/for/...` (`src/data/audiences.ts`).
- Three tools: the audit readiness check (`src/data/readiness.ts`), the exempt accommodation checker and the service charge calculator.
- Four free templates at `/templates/` (`src/data/templates.ts`): a support plan and a needs assessment in Word, a rent and service charge schedule and a licensing readiness checklist in Excel.
- Regulation alert sign-ups on the tracker, the home page, regulation guides, the templates page and the footer.
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

The AdSense publisher id (`ca-pub-4641894074417695`) is set in `src/site.config.ts`. Every page carries the `google-adsense-account` meta tag and `/ads.txt` publishes the Google line, so either can be used to verify the site.

1. In AdSense, add `exemptaccommodation.com` under Sites and verify it with the meta tag or ads.txt option. Wait for approval.
2. Create four display ad units (leaderboard, in-article, sidebar, footer) and set their ids as `PUBLIC_ADSENSE_SLOT_LEADERBOARD`, `_IN_ARTICLE`, `_SIDEBAR` and `_FOOTER` in Cloudflare, then redeploy. Until then each slot shows a SEA Audit house ad. Auto ads also work if you switch them on, but they place ads wherever Google chooses.
3. For UK traffic Google requires a certified consent platform. In AdSense, open Privacy and messaging, create and publish a European regulations message, then set `PUBLIC_CONSENT_MODE=external`. Google's message then replaces the site's own banner, and "Cookie settings" in the footer reopens it.

Set `PUBLIC_ADSENSE_CLIENT=off` on a staging build to switch ads off.

Every slot reserves its space before it loads, so ads do not shift the layout. If ads are declined or unfilled, the SEA Audit house ad shows instead.

## SEA Audit funnel

- All outbound links go through `auditUrl()` in `src/site.config.ts`, tagged `utm_source=exemptaccommodation` with a campaign per placement.
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

## Templates

The files are built by a script, so they stay in step with the readiness questions and the house style:

```sh
npm run templates
```

This writes `public/downloads/*.docx` and `*.xlsx`. Commit the files. Each template has a landing page at `/templates/<slug>/` with the quick answer, a drawn preview, how-to steps (HowTo schema) and FAQs (FAQPage schema). `public/_headers` sends `X-Robots-Tag: noindex` for `/downloads/*`, so the landing pages rank instead of the raw files.

The download form asks for name, email and role, with two unticked boxes: regulation alerts and SEA Audit contact. The file is shown whether or not the sign-up goes through, and the browser remembers the visitor so a second download skips the form.

## Email sign-ups

`functions/api/subscribe.ts` is a Cloudflare Pages Function. Cloudflare deploys it automatically from the `functions/` folder; no extra build step. It takes template downloads, alert sign-ups and (optionally) readiness check results, then:

1. Rejects bad email addresses, and quietly drops spam (a hidden field filled in, or a form sent in under 2.5 seconds).
2. Adds the email to Brevo or MailerLite, only on the lists the visitor agreed to:
   - downloads: everyone who downloads a template, for update notices about that template
   - alerts: only when they asked for regulation alerts
   - audit: only when they agreed to SEA Audit contact (the readiness check form requires this)
3. Forwards the whole submission to `LEAD_WEBHOOK_URL` if set, for a CRM, Zapier, Make or SEA Audit.

Set these under Pages, Settings, Variables and secrets. Mark the API key and webhook secret as secrets.

| Variable | Purpose |
| --- | --- |
| `EMAIL_PROVIDER` | `brevo` or `mailerlite`. Optional: the key format is enough to tell them apart. |
| `EMAIL_API_KEY` | Brevo API key (`xkeysib-...`) or MailerLite API token. |
| `EMAIL_LIST_DOWNLOADS`, `EMAIL_LIST_ALERTS`, `EMAIL_LIST_AUDIT` | Brevo list ids (numbers) or MailerLite group ids. |
| `BREVO_DOI_TEMPLATE_ID`, `BREVO_DOI_REDIRECT_URL` | Optional double opt-in for alerts in Brevo. Use `https://exemptaccommodation.com/thanks/` as the redirect. In MailerLite, turn on double opt-in for API sign-ups in the account settings instead. |
| `LEAD_WEBHOOK_URL`, `LEAD_WEBHOOK_SECRET` | Optional. Every submission is posted here as JSON, with the secret in `X-Webhook-Secret`. |
| `ALLOWED_ORIGINS` | Optional. Other sites allowed to post to the function, comma separated. By default only this site can. |

With no provider and no webhook, the function answers `503 not-configured`. Downloads still work; alert forms tell the visitor to email you instead.

The webhook receives:

```json
{
  "source": "exemptaccommodation.com",
  "type": "template",
  "email": "sam@example.org",
  "name": "Sam Lee",
  "role": "Support provider",
  "template": "support-plan-template",
  "placement": "",
  "page": "/templates/support-plan-template/",
  "consents": { "alerts": true, "audit": false },
  "repeat": false,
  "submittedAt": "2026-10-19T10:00:00.000Z"
}
```

`type` is `template`, `alerts` or `readiness`. Readiness submissions add a `readiness` object with the organisation, scores, gaps and answers. `repeat: true` is a returning visitor downloading another template; those go to the webhook only.

For rate limiting, add a Cloudflare rate limiting rule on `/api/subscribe` (for example 10 requests a minute per IP).

## Partners, affiliates and sponsorship

`src/data/partners.ts` holds every link to a site we have a commercial interest in, and the pages it appears on. `PartnerBlock` labels each one by kind and sets the rel attribute:

| Kind | Label | rel |
| --- | --- | --- |
| `sister` | From our sister site | `noopener` |
| `affiliate` | Affiliate link, with a commission note | `sponsored noopener` |
| `sponsor` | Sponsored | `sponsored noopener` |

Insurance, mortgage and lending partners are regulated by the FCA. Add their `fca` number and any `warning` they require, and use the wording they approve. Affiliate tracking links are used exactly as given, with no UTM tags added.

HMO Profit is set up as the sister site on the rent, property and managing agents guides, the tools page and the housing provider and managing agent hubs. There is no sitewide link to it on purpose. To add an affiliate, add an entry with `kind: 'affiliate'` and list only the guides where the product helps a reader act on that guide. The about page's "How we make money" section covers all of these. The footer credit to apxdigital.io is `nofollow`.

## Getting indexed

- **Google:** verify the domain in Search Console (the DNS option works with Cloudflare), then submit `https://exemptaccommodation.com/sitemap-index.xml`. To verify with a tag instead, set `PUBLIC_GOOGLE_SITE_VERIFICATION`.
- **Bing:** in Bing Webmaster Tools, import the site from Search Console, or set `PUBLIC_BING_SITE_VERIFICATION`. Submit the same sitemap.
- **IndexNow (Bing, Yandex, Seznam, Naver):** `.github/workflows/indexnow.yml` runs after every push to `main`, waits for the deploy, and submits the pages that changed. The key file is `public/48d8ca8382287108464131d1f048aab6.txt`. To submit every page once, open the Actions tab, choose "Notify search engines" and run it.
- **Cloudflare:** turn on Crawler Hints (Caching, Configuration) for the domain as a backup signal.

## Publishing routine

Updates live in `src/content/updates/` and appear at `/updates/`, on the home page, in the RSS feed and in `llms.txt`. The weekly routine, the guide calendar and the checks before publishing are in `docs/content-plan.md`. The build warns (`review-due`) about any guide not updated for 120 days.

## Before launch

- Have someone with sector knowledge check each guide against its sources, and keep that review going. The about page says this happens.
- Have privacy and cookie pages reviewed by your data protection lead.
- Set `SITE_URL`, verify the domain in Google Search Console and Bing Webmaster Tools, and submit `/sitemap-index.xml`.
- Re-check the regulation tracker when draft licensing regulations are published.

## Share images

Every guide, update and template has its own share image in `public/og/`, so links posted on LinkedIn show the page title. After adding or renaming a page, run `npm run og` (it needs Playwright, like `npm run images`) and commit the new files. Pages without an image fall back to `og-default.png`.

## Regenerating images

`public/og-default.png` and the app icons are rendered from HTML with the site fonts:

```sh
npm install --no-save playwright && npx playwright install chromium
npm run images
```
