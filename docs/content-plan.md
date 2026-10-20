# Content plan

How ExemptAccommodation.com keeps publishing, keeps old pages accurate, and turns readers into email subscribers, SEA Audit enquiries and affiliate clicks.

## The weekly routine

The scheduled task "Weekly content drafts" does the drafting every Thursday and opens a pull request. Nothing is published until Jamie merges it. The full routine, across all four sites, is in [`docs/marketing/routine.md`](marketing/routine.md).

| When | What | Who |
| --- | --- | --- |
| Thursday | Check for news. Draft next week's guide, any update, the oldest-guide review and three LinkedIn posts. | Scheduled task |
| Thursday to Sunday | Review the pull request. Merge to publish, or comment to ask for changes. | Jamie |
| Monday, Wednesday, Friday | Post the approved LinkedIn post, link in the first comment. | Jamie |
| First Thursday of the month | Also draft a new template and the alerts email. | Scheduled task |
| Every 60 days | Re-check `src/data/key-facts.json` and the regulation tracker. | Scheduled task, in the review step |

Every merge to `main` deploys the site and tells Bing and the other IndexNow engines which pages changed. Google picks changes up from the sitemap.

## Writing an update

An update is 250 to 500 words: what changed, who it affects, what to do. Copy `src/content/updates/competence-and-conduct-standard-in-force.mdx` and keep the same frontmatter. Link to the primary source first and to the guide with the detail. `npm run build` checks the house style.

## Guide calendar

Each guide targets a question people search for, and has a natural next step that earns: an SEA Audit enquiry, a template download, an alerts sign-up or a labelled affiliate link.

| Week | Guide | Search it answers | Earns through |
| --- | --- | --- | --- |
| 1 | How to set up a supported housing service | how to start supported housing | SEA Audit, HMO Profit, insurance and training affiliates |
| 2 | Intensive housing management explained | intensive housing management housing benefit | Service charge calculator, rent schedule template |
| 3 | How councils review exempt accommodation claims | exempt accommodation housing benefit review | SEA Audit |
| 4 | Fire risk assessments for supported shared houses | fire risk assessment supported housing | Fire safety and insurance affiliates |
| 5 | DBS checks for supported housing staff | DBS check supported housing | DBS and training affiliates |
| 6 | Safeguarding adults in supported housing | safeguarding supported housing | Care Skills Training |
| 7 | HMO licensing for supported housing | HMO licence supported housing | HMO Profit, insurance |
| 8 | Supported accommodation for 16 and 17 year olds | Ofsted supported accommodation registration | Training, SEA Audit |
| 9 | Choosing software for supported housing | supported housing software | Software affiliates or sponsors |
| 10 | Rent officer referrals and unreasonably high rents | exempt accommodation rent officer | SEA Audit |
| 11 | Mental health supported accommodation | mental health supported accommodation | Training |
| 12 | Move-on planning that works | move on supported housing | Support plan template |

Swap a week for an update whenever the draft licensing regulations, a consultation or a tribunal decision is published.

## Before publishing

1. The quick answer answers the title in two or three sentences.
2. Every fact has a source, primary sources first.
3. One next step, and one partner block at most.
4. `npm run og` has made the share image for the new page.
5. `npm run build` passes with no errors.
