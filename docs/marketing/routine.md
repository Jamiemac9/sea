# Weekly content routine

The scheduled task "Weekly content drafts" runs every Thursday morning and follows this file. Edit this file to change what it does; the task itself only says "follow docs/marketing/routine.md".

## The one rule

Everything is a draft for Jamie to approve. Open pull requests. Never merge a pull request, never push to `main`, never post to LinkedIn or anywhere else. Merging is how Jamie publishes.

## Repositories

| Site | Repository | Build check |
| --- | --- | --- |
| ExemptAccommodation.com | `Jamiemac9/sea` | `npm ci`, then `PW_PATH=/opt/node-tools/node_modules/playwright npm run og`, then `npm run build` (must end with 0 errors) |
| SEA Audit | `Jamiemac9/supportaudit-site` | `npm install`, then `python3 tools/build.py` |
| APX blog | `Jamiemac9/apx-blog` | Static HTML: open the page and check links |
| APX Digital | `Jamiemac9/apx-digital-new-site` | Static HTML: open the page and check links |

Attach each with push access (`add_repo`, access `push`), clone it, and work on a branch named `content/<monday>`, where `<monday>` is the date of the Monday after the run, such as `content/2026-10-26`.

If a routine pull request on SEA Audit, the APX blog or the APX site is still open from an earlier week, do not open another on that repository. Add a comment to the open one saying this week's slot was skipped. ExemptAccommodation.com gets a pull request every week, because its LinkedIn posts are dated.

## Each run

### 1. Check for news (every run)

Search for anything published in the last seven days about supported exempt accommodation in England: licensing regulations or consultations, the national supported housing standards, Housing Benefit for supported housing, Regulator of Social Housing decisions, tribunal cases and the Renters' Rights Act as it affects supported housing. Prefer gov.uk, legislation.gov.uk and the regulator. If something material changed, it becomes an update (step 2a) and goes on the regulation tracker if it is a date.

### 2. ExemptAccommodation.com (every run)

a. **Update**, only if step 1 found something: a new file in `src/content/updates/`, in the same format as `competence-and-conduct-standard-in-force.mdx`.

b. **Guide:** the next unticked guide in the calendar in `docs/content-plan.md`. Write it in the same format as the existing guides in `src/content/guides/`, with sources and FAQs. Tick it in the calendar in the same pull request.

c. **Review:** the guide with the oldest `updated` date. Check its key facts against its sources. Fix anything out of date, then set `updated` to the run date. If nothing needed changing, still set the date and say so in the pull request.

d. **Template**, on the first run of each month: the next unticked template in `docs/marketing/sites.md`, built with `scripts/make-templates.mjs` and added to `src/data/templates.ts`.

e. **Alerts email**, on the first run of each month: draft `docs/marketing/email/<yyyy-mm>.md`. The month's updates, one guide, one template, and the Mock Audit as the one call to action.

f. **LinkedIn:** if `docs/marketing/linkedin/<monday>.md` does not exist, write three posts for that week (Monday, Wednesday, Friday) in the same format as the existing files. Follow "How to post" in `docs/marketing/linkedin-profile.md`. Link to pages that will be live once this week's pull requests are merged, with the UTM tags in `docs/marketing/README.md`. Mix the sites across the month: mostly SEA Audit and ExemptAccommodation.com, one HMO Profit or APX post at most each fortnight.

g. Run the build check. Then open the pull request "Weekly content: week of <monday>".

### 3. SEA Audit (when no routine pull request is open)

Do the one-off fixes in `docs/marketing/sites.md` first, skipping any that need something from Jamie (photo, ICO number, account access). Then the next unticked guide, at most one every two weeks.

New guides go in `src/pages/` as `guide-<slug>.html`, in the same structure as `guide-support-file.html`, registered in `PAGES` in `tools/build.py` with a `/resources/<slug>/` URL, and linked from `resources.html`. Set `TODAY` in `tools/build.py` to the run date. The byline is "Jamie McCollin, founder, SEA Audit", so mark anything that needs Jamie's own audit experience with a clear `[Jamie: ...]` note to fill in, and list those notes in the pull request.

Tick the items in `docs/marketing/sites.md` in the ExemptAccommodation.com pull request.

### 4. APX (when no routine pull request is open)

On the first run of each month, the next unticked brief in `docs/marketing/sites.md`. Copy the folder structure of an existing brief, such as `web/bloc-architecture-site-rebuild/`, add it to the stream's `index.html`, the home `index.html` and `sitemap.xml`. Use real numbers only from this repository or the GitHub Actions logs, with the date measured.

The work page case studies go in a pull request on `apx-digital-new-site`, once.

### 5. Report

Finish with a short summary: each pull request link, what is in it, and anything Jamie must decide or supply.

## House style for everything

- UK English. Sentence case headings. Straight quotes. No em or en dashes.
- Answer first. Lists of five or fewer, unless they are numbered steps.
- Every fact has a source, primary sources first. Never invent a statistic, a quote, a client or a result.
- No resident details or anything that could identify a scheme.
- Affiliate and sponsor links only through `src/data/partners.ts`, and never more than one partner block on a page.
- Nothing that sells exempt accommodation as a high-yield investment.
- Do not touch secrets, environment variables, DNS or account settings.
