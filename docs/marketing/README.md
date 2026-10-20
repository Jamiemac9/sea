# Marketing plan: SEA Audit and its sister sites

One plan for four sites and one LinkedIn profile. Every piece of content has one home, links to the others where it helps the reader, and is approved by Jamie before it goes live.

- `README.md` (this file): what each site is for, how they link, how we measure it.
- `sites.md`: the content plan for each site.
- `linkedin-profile.md`: the new LinkedIn positioning, ready to paste.
- `linkedin/<week>.md`: three posts per week, written in advance.
- `routine.md`: the weekly routine the scheduled task follows, and the approval rules.

## What each site is for

| Site | Job | Who it is for | Money comes from |
| --- | --- | --- | --- |
| [SEA Audit](https://seaaudit.com) | The business. Sells resident support file audits. | Registered Providers, managing agents, support providers | Mock Audits, audit rounds, monitoring |
| [ExemptAccommodation.com](https://exemptaccommodation.com) | The free resource that wins trust and traffic. Owns the "what are the rules" searches. | Everyone in the sector, including landlords and investors | SEA Audit enquiries, email list, AdSense, labelled affiliates |
| [HMO Profit](https://hmoprofit.co.uk) | The calculator. Owns the "will this property work" searches. | Landlords, investors, providers taking on property | Its own model, plus referrals to the guides |
| [APX Digital](https://apxdigital.io) and [the APX blog](https://blog.apxdigital.io) | The agency that built all of the above. Owns the "how it was built" story. | Business owners who want sites and tools that generate leads | Web, SEO and tool builds |

## Who owns which searches

Two of our own sites competing for the same search splits the ranking. Each topic has one home, and the other sites link to it.

| Topic | Home | Others link to it from |
| --- | --- | --- |
| The rules: licensing, Housing Benefit, categories, standards, dates | ExemptAccommodation.com | SEA Audit resources, LinkedIn |
| Audit practice: what a good support file, session note or review looks like | SEA Audit | ExemptAccommodation.com guides on support planning |
| Buying audits: mock audit, audit rounds, independent audit | SEA Audit | ExemptAccommodation.com audit CTAs |
| Property numbers: yield, costs, voids, lease rent | HMO Profit | ExemptAccommodation.com leasing and rent guides |
| Building sector sites, tools and lead generation | APX blog | Footer credit, case studies |

SEA Audit's licensing guide overlaps with ExemptAccommodation.com's. Keep it, but reangle it to "a 12-month plan to get licence-ready" (what to do, with the Mock Audit as the next step) and link to ExemptAccommodation.com for the full rules. See `sites.md`.

## How the sites link

- **ExemptAccommodation.com to SEA Audit:** audit CTAs on every guide, the readiness check results and the house ads. Already live.
- **SEA Audit to ExemptAccommodation.com:** a "Free tools and templates" block on the resources page, and links from SEA Audit's guides to the matching rules guide. Not live yet: first routine run opens the pull request.
- **ExemptAccommodation.com to HMO Profit:** labelled "From our sister site" blocks on the rent, property, managing agents and leasing guides. Already live.
- **HMO Profit to ExemptAccommodation.com:** a link from the supported accommodation part of the calculator to the leasing and rent guides. Needs the HMO Profit repo.
- **APX to everything:** case studies on the APX blog and the APX work page, each linking to the live site. Not live yet: first routine run opens the pull requests.

Rule for all of these: links sit where a reader would want them. No sitewide links between our own sites, apart from the existing footer credit, which is `nofollow`.

## Tracking

Every link we post carries UTM tags so GA4 shows what worked.

| Where the link is | utm_source | utm_medium | utm_campaign |
| --- | --- | --- | --- |
| LinkedIn post | linkedin | social | the post's date and slug, such as `2026-10-26-intro` |
| LinkedIn profile or Featured | linkedin | profile | `featured` |
| Alerts email | newsletter | email | the month, such as `2026-11` |
| One of our sites to another | the source site, such as `seaaudit` | referral | the page |

Check every Monday:

1. Google Search Console and Bing Webmaster Tools: pages indexed, top queries, clicks.
2. GA4 on both sites: sessions by source, alert sign-ups, template downloads, `generate_lead` on SEA Audit.
3. LinkedIn: impressions and profile views per post.
4. Awin: clicks and sales by click reference, once advertisers approve.

## Suggested targets for the first 90 days

Adjust these once the first month's numbers are in.

- Every ExemptAccommodation.com page indexed by Google and Bing.
- 100 regulation alert subscribers.
- 12 new pieces of content on ExemptAccommodation.com and 6 on SEA Audit.
- 36 LinkedIn posts, three a week.
- 5 SEA Audit discovery calls that came from content or LinkedIn.

## The weekly rhythm

| Day | What happens |
| --- | --- |
| Thursday morning | The scheduled task drafts next week's content and LinkedIn posts and opens a pull request on each repo. |
| Thursday to Sunday | Jamie reviews. Merge to publish a site change. Comment on the pull request to ask for edits. |
| Monday, Wednesday, Friday, 8am | Jamie posts the approved LinkedIn post, with the link in the first comment. |
| Monday | Check the numbers above. |

Nothing goes live without Jamie merging it.
