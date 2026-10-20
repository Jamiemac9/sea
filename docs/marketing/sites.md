# Content plan for each site

The scheduled task works down these lists in order and ticks items off when the pull request is merged. Swap an item for an update whenever something changes in the sector.

## ExemptAccommodation.com (Jamiemac9/sea)

Cadence: one guide or update a week, one guide review a week, one alerts email a month, one new template a month.

The guide calendar and weekly routine are in [`docs/content-plan.md`](../content-plan.md).

### New templates, one a month

Each template gets a landing page under `/templates/`, built from `src/data/templates.ts` and `scripts/make-templates.mjs`.

- [ ] **Staff training matrix** (Excel). Roles, courses, last done, next due, with overdue highlighting. Links to the training guide and Care Skills Training once approved.
- [ ] **Risk assessment and risk management plan** (Word). Links to SEA Audit's risk guide.
- [ ] **Property compliance tracker** (Excel). Certificates, expiry dates and responsible person per property. Links to the property guide and insurance partners.
- [ ] **Move-on plan** (Word). Links to the transitional housing guide.

### Alerts email, once a month

The month's updates, one guide, one template, and the SEA Audit Mock Audit as the one call to action. Draft it in `docs/marketing/email/<yyyy-mm>.md` for Jamie to paste into Brevo or MailerLite.

## SEA Audit (Jamiemac9/supportaudit-site)

Cadence: one guide a fortnight. SEA Audit's guides are about audit practice: what good evidence looks like, written by an auditor. The rules themselves live on ExemptAccommodation.com.

### One-off fixes

- [ ] Add a "Free tools and templates" block to `/resources/`, linking to ExemptAccommodation.com's templates, readiness check and regulation tracker.
- [ ] Reangle `/resources/supported-housing-licensing/` to a 12-month plan to get licence-ready, with the Mock Audit as the next step and a link to ExemptAccommodation.com's licensing guide for the full rules.
- [ ] Replace the `[Founder photo]` and `[ICO number]` placeholders on the about page. Jamie to supply.
- [ ] Set up a Google Business Profile and Bing Places listing as a service-area business for England, using the entity statement in `SEARCH-SPEC.md` word for word.

### Guide calendar

From the "next ten guides" in `SEARCH-SPEC.md`. Three of those topics are rules, not audit practice, so they move to ExemptAccommodation.com: supported exempt accommodation explained (already there), local supported housing strategies, and what councils look for in Housing Benefit claims.

- [ ] Session notes that pass an audit, with examples
- [ ] Support plan goals that evidence real support
- [ ] Risk assessments and risk management plans
- [ ] A simple process for missed support sessions
- [ ] Evidencing move-on in transitional housing
- [ ] What the Gold, Green, Amber and Red ratings mean
- [ ] Registered Provider or managing agent: who is responsible for what in the file
- [ ] A 12-month plan to get licence-ready (the reangled licensing guide)

## HMO Profit (hmoprofit.co.uk)

The repo is not in this GitHub account, so nothing can be drafted for it yet. Add it to the session and the routine will pick these up.

- [ ] Link from the supported accommodation part of the calculator to ExemptAccommodation.com's leasing and rent guides.
- [ ] Leasing to a provider or running it yourself: the numbers side by side.
- [ ] HMO running costs checklist, with the calculator as the next step.
- [ ] What voids really cost an HMO, with a worked example.
- [ ] Rent reviews in a lease to a provider: fixed, capped or linked to inflation.

Keep the framing on whether a property covers its costs. ExemptAccommodation.com does not link to anything that sells exempt accommodation as a high-yield investment.

## APX Digital (Jamiemac9/apx-blog and Jamiemac9/apx-digital-new-site)

Cadence: one brief a month on the blog, plus case studies on the work page. Each brief is a real build story with real numbers, which is what the existing briefs do.

### Blog briefs

- [ ] **Web:** How we built ExemptAccommodation.com: a sector resource site with templates, alerts and a regulation tracker.
- [ ] **Lead generation:** Email-gated templates that never block the download, and why that gets more sign-ups than a hard gate.
- [ ] **Web:** Getting a new site into Bing in a day with IndexNow and a GitHub Action. 84 pages accepted on 20 October 2026.
- [ ] **Web:** SEA Audit's site: a static build with structured data and a search spec written before the first page.

### Work page

- [ ] Add ExemptAccommodation.com and SEA Audit as case studies on `work.html`, each linking to the live site.
