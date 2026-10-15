/**
 * Glossary. Each term gets its own page, which answer engines can quote.
 * `short` is the one-sentence definition used in lists and structured data.
 */

export type Term = {
  term: string;
  slug: string;
  short: string;
  body: string[];
  aka?: string[];
  guide?: { label: string; href: string };
  related?: string[];
};

export const glossary: Term[] = [
  {
    term: 'Exempt accommodation',
    slug: 'exempt-accommodation',
    short:
      'Supported housing where a not-for-profit landlord or county council, or someone acting for it, provides more than minimal care, support or supervision.',
    body: [
      'Exempt accommodation is category 1 of specified accommodation. The landlord must be a housing association, registered charity, voluntary organisation or non-metropolitan county council, and that landlord or someone acting on its behalf must provide the resident with care, support or supervision.',
      'The name comes from 1996, when this housing was exempted from new limits on how much rent Housing Benefit would pay. Rent is still paid through Housing Benefit, including for residents on Universal Credit.',
    ],
    aka: ['Category 1 specified accommodation', 'Exempt supported housing'],
    guide: { label: 'What is exempt accommodation?', href: '/guides/what-is-exempt-accommodation/' },
    related: ['specified-accommodation', 'supported-exempt-accommodation', 'more-than-minimal'],
  },
  {
    term: 'Supported exempt accommodation (SEA)',
    slug: 'supported-exempt-accommodation',
    short:
      'The term the Supported Housing (Regulatory Oversight) Act 2023 uses for supported housing that can be paid for by Housing Benefit above Local Housing Allowance levels.',
    body: [
      'Section 12 of the 2023 Act defines supported exempt accommodation by reference to the Housing Benefit rules. The April 2026 government response confirmed that licensing will mirror this definition, with a list of exemptions.',
      'People in the sector often shorten it to SEA.',
    ],
    aka: ['SEA'],
    guide: { label: 'Licensing and the national standards', href: '/guides/supported-housing-regulatory-oversight-act/' },
    related: ['exempt-accommodation', 'licensing', 'national-supported-housing-standards'],
  },
  {
    term: 'Specified accommodation',
    slug: 'specified-accommodation',
    short:
      'The four types of supported housing where rent is paid through Housing Benefit, even for people on Universal Credit.',
    body: [
      'The four categories are exempt accommodation, managed properties, domestic abuse refuges and local authority hostels. They were set out in 2014 regulations so supported housing could stay on Housing Benefit when Universal Credit arrived.',
      'Housing Benefit paid for specified accommodation is left out of the benefit cap calculation.',
    ],
    guide: { label: 'The four categories of specified accommodation', href: '/guides/specified-accommodation-categories/' },
    related: ['exempt-accommodation', 'managed-property', 'refuge', 'local-authority-hostel'],
  },
  {
    term: 'Managed property',
    slug: 'managed-property',
    short:
      'Category 2 specified accommodation: not-for-profit supported housing where the resident was admitted to meet a support need, and support can come from anyone.',
    body: [
      'A managed property is provided by a housing association, registered charity, voluntary organisation or county council. The resident must have been admitted to meet a need for care, support or supervision and must receive it, but the landlord does not have to provide it.',
      'Rent is assessed under standard Housing Benefit rules, so the protection exempt accommodation has on rent levels does not apply.',
    ],
    aka: ['Managed accommodation', 'Category 2 specified accommodation'],
    guide: { label: 'The four categories of specified accommodation', href: '/guides/specified-accommodation-categories/' },
    related: ['specified-accommodation', 'exempt-accommodation', 'on-its-behalf'],
  },
  {
    term: 'Refuge',
    slug: 'refuge',
    short:
      'Non-permanent accommodation for people who have left home because of domestic abuse. Category 3 specified accommodation.',
    body: [
      'For Housing Benefit, a refuge is provided by a local authority or not-for-profit body, and the building is used wholly or mainly as non-permanent accommodation for people who have left home because of domestic abuse. There is no separate support test.',
      'Under Part 4 of the Domestic Abuse Act 2021, tier one councils must commission support in safe accommodation, including refuges.',
    ],
    guide: { label: 'Refuges and domestic abuse safe accommodation', href: '/guides/domestic-abuse-safe-accommodation/' },
    related: ['specified-accommodation', 'sanctuary-scheme'],
  },
  {
    term: 'Local authority hostel',
    slug: 'local-authority-hostel',
    short:
      'Category 4 specified accommodation: a non-self-contained hostel run by a council where residents receive care, support or supervision.',
    body: [
      'The hostel must be owned or managed by the local authority, not be self-contained or a care home, provide board or food preparation facilities, and the resident must receive more than minimal care, support or supervision.',
    ],
    guide: { label: 'The four categories of specified accommodation', href: '/guides/specified-accommodation-categories/' },
    related: ['specified-accommodation', 'emergency-accommodation'],
  },
  {
    term: 'Care, support or supervision',
    slug: 'care-support-or-supervision',
    short:
      'The help a resident must receive for accommodation to count as exempt accommodation. It is not defined in the regulations.',
    body: [
      'Councils normally look for help beyond what any tenant gets from a landlord, such as help to manage a tenancy, budgeting, emotional support, linking with health services or supervision because of risk. Ordinary housing management does not count on its own.',
      'The support must be more than minimal and, for exempt accommodation, provided by the landlord or someone acting for it.',
    ],
    aka: ['CSS'],
    guide: { label: 'What is exempt accommodation?', href: '/guides/what-is-exempt-accommodation/' },
    related: ['more-than-minimal', 'on-its-behalf', 'intensive-housing-management'],
  },
  {
    term: 'More than minimal',
    slug: 'more-than-minimal',
    short: 'The threshold, set by case law, that care, support or supervision must pass for exempt accommodation.',
    body: [
      'No number of hours is set in law. In R(H) 7/07 a landlord\'s tenant liaison service was held to be minimal. Councils look at what the support is, how often it happens, who it is for and whether records show it took place.',
    ],
    guide: { label: 'Grey areas in exempt accommodation', href: '/guides/grey-areas-in-exempt-accommodation/' },
    related: ['care-support-or-supervision', 'support-plan'],
  },
  {
    term: 'On its behalf',
    slug: 'on-its-behalf',
    short:
      'The requirement that support in exempt accommodation comes from the landlord or from someone acting for the landlord.',
    body: [
      'If a separate support provider acts for the council that commissions it, its support may not count as provided on the landlord\'s behalf. A written agreement making the landlord responsible for arranging support, backed by real monitoring, is the usual answer.',
    ],
    guide: { label: 'Grey areas in exempt accommodation', href: '/guides/grey-areas-in-exempt-accommodation/' },
    related: ['exempt-accommodation', 'managed-property'],
  },
  {
    term: 'Voluntary organisation',
    slug: 'voluntary-organisation',
    short: 'For Housing Benefit, a body other than a public authority whose activities are carried on otherwise than for profit.',
    body: [
      'Voluntary organisations can be exempt accommodation landlords. Community interest companies can qualify, but councils usually check the constitution, accounts, dividends and any linked companies.',
    ],
    guide: { label: 'Grey areas in exempt accommodation', href: '/guides/grey-areas-in-exempt-accommodation/' },
    related: ['community-interest-company', 'exempt-accommodation'],
  },
  {
    term: 'Community interest company (CIC)',
    slug: 'community-interest-company',
    short: 'A limited company for social enterprises, with an asset lock. Many run supported housing as voluntary organisations.',
    body: [
      'A CIC limited by guarantee pays no dividends. A CIC limited by shares can pay capped dividends, which can lead councils to question whether it operates otherwise than for profit.',
    ],
    aka: ['CIC'],
    related: ['voluntary-organisation'],
  },
  {
    term: 'Registered provider of social housing',
    slug: 'registered-provider',
    short: 'A landlord registered with the Regulator of Social Housing, such as a housing association or council.',
    body: [
      'Registered providers are regulated on governance, finances and consumer standards. Their supported housing is exempt from HMO licensing and, for Housing Benefit subsidy, their exempt rents are generally fully reimbursed to councils.',
    ],
    aka: ['RP', 'Private registered provider', 'PRP', 'Housing association'],
    related: ['rent-officer', 'subsidy-loss', 'lease-based-provider'],
  },
  {
    term: 'Non-commissioned supported housing',
    slug: 'non-commissioned',
    short: 'Supported housing where no council or public body contracts the provider to deliver support.',
    body: [
      'The provider funds support from its own income, usually rent and service charges paid by Housing Benefit. It is lawful, but has had little oversight, which the 2023 Act is designed to change.',
    ],
    aka: ['Non-commissioned exempt accommodation'],
    guide: { label: 'Grey areas in exempt accommodation', href: '/guides/grey-areas-in-exempt-accommodation/' },
    related: ['commissioning', 'licensing'],
  },
  {
    term: 'Commissioning',
    slug: 'commissioning',
    short: 'When a council or public body contracts a provider to deliver support or care, and pays for it.',
    body: [
      'Commissioned services have contract monitoring. Under the April 2026 response, commissioned services will not have to meet the national standards licensing condition directly, because commissioners are expected to buy support that meets them.',
    ],
    related: ['non-commissioned', 'national-supported-housing-standards'],
  },
  {
    term: 'Licensing (supported housing)',
    slug: 'licensing',
    short:
      'The council-run licensing regime for supported exempt accommodation planned under the 2023 Act, expected to start in 2027.',
    body: [
      'Licence holders will have to meet the national supported housing standards, pass a fit and proper person test that extends to the board, check service managers\' suitability and ensure every resident has a needs assessment within four weeks of moving in. A separate licence for each scheme will not be needed.',
    ],
    guide: { label: 'Licensing and the national standards', href: '/guides/supported-housing-regulatory-oversight-act/' },
    related: ['national-supported-housing-standards', 'fit-and-proper-person', 'supported-housing-strategy'],
  },
  {
    term: 'National supported housing standards',
    slug: 'national-supported-housing-standards',
    short: 'Standards for the support provided in supported exempt accommodation, set under the 2023 Act and enforced through licensing.',
    body: [
      'The 2025 consultation proposed standards covering person-centred support, resident empowerment, the living environment, staffing and safeguarding, and meeting local need. The April 2026 response said they would be slightly amended.',
    ],
    aka: ['NSHS'],
    guide: { label: 'Licensing and the national standards', href: '/guides/supported-housing-regulatory-oversight-act/' },
    related: ['licensing', 'needs-assessment'],
  },
  {
    term: 'Fit and proper person test',
    slug: 'fit-and-proper-person',
    short: 'A check on whether the people running a licensed service are suitable, extended to boards under supported housing licensing.',
    body: [
      'The April 2026 response broadened the supported housing test to align with CQC and Ofsted tests rather than HMO licensing. Where the licence holder is an organisation, it covers the board of directors.',
    ],
    related: ['licensing'],
  },
  {
    term: 'Supported housing strategy',
    slug: 'supported-housing-strategy',
    short: 'The strategy every local housing authority in England must publish after reviewing supported exempt accommodation in its area.',
    body: ['The first strategies are currently planned for 31 March 2027. They will shape how councils approach licensing and commissioning.'],
    related: ['licensing'],
  },
  {
    term: 'Needs assessment',
    slug: 'needs-assessment',
    short: 'An assessment of a resident\'s needs, risks and goals, which licensing will require on arrival or within four weeks.',
    body: [
      'A good assessment covers housing history, health, substance use, money, risks, relationships and the person\'s own goals. It is the basis for the support plan.',
    ],
    guide: { label: 'Needs assessments and support plans', href: '/guides/support-planning-and-needs-assessments/' },
    related: ['support-plan'],
  },
  {
    term: 'Support plan',
    slug: 'support-plan',
    short: 'A written plan, agreed with the resident, setting out their goals, the support they will get and when it will be reviewed.',
    body: ['Support plans and the records of support delivered against them are the main evidence councils use when testing whether support is more than minimal.'],
    guide: { label: 'Needs assessments and support plans', href: '/guides/support-planning-and-needs-assessments/' },
    related: ['needs-assessment', 'more-than-minimal'],
  },
  {
    term: 'Eligible rent',
    slug: 'eligible-rent',
    short: 'The amount Housing Benefit is based on: core rent plus eligible service charges.',
    body: ['Support charges, water charges and most personal fuel and meals are not part of eligible rent.'],
    guide: { label: 'Rent, service charges and Housing Benefit', href: '/guides/housing-benefit-rent-and-service-charges/' },
    related: ['eligible-service-charges', 'intensive-housing-management'],
  },
  {
    term: 'Eligible service charges',
    slug: 'eligible-service-charges',
    short: 'Charges for services connected with providing adequate accommodation that Housing Benefit can cover.',
    body: [
      'Examples include cleaning and lighting communal areas, furniture provided with the room and intensive housing management. Schedule 1 to the Housing Benefit Regulations 2006 lists charges that are ineligible.',
    ],
    guide: { label: 'Rent, service charges and Housing Benefit', href: '/guides/housing-benefit-rent-and-service-charges/' },
    related: ['eligible-rent', 'intensive-housing-management'],
  },
  {
    term: 'Intensive housing management',
    slug: 'intensive-housing-management',
    short: 'Housing management that costs more because of residents\' needs, which Housing Benefit can cover if it is not support.',
    body: [
      'Examples include extra property inspections, managing more frequent repairs, faster reletting and more tenancy sustainment visits. It must be kept separate from support and evidenced, often with time records.',
    ],
    aka: ['IHM'],
    guide: { label: 'Rent, service charges and Housing Benefit', href: '/guides/housing-benefit-rent-and-service-charges/' },
    related: ['eligible-service-charges', 'care-support-or-supervision'],
  },
  {
    term: 'Rent officer',
    slug: 'rent-officer',
    short: 'An official at the Valuation Office Agency who assesses rents for Housing Benefit, including exempt rents from non-registered landlords.',
    body: [
      'The rent officer\'s figure caps how much Housing Benefit subsidy the council gets back from the DWP for a non-registered provider\'s exempt rent. It does not by itself cap what the council can pay.',
    ],
    related: ['subsidy-loss', 'registered-provider'],
  },
  {
    term: 'Subsidy loss',
    slug: 'subsidy-loss',
    short: 'Housing Benefit a council pays that the DWP does not reimburse, such as exempt rent above a rent officer\'s figure.',
    body: ['Subsidy loss on exempt accommodation from non-registered providers can cost large councils millions of pounds a year, which is why they scrutinise those rents closely.'],
    related: ['rent-officer'],
  },
  {
    term: 'Suitable alternative accommodation',
    slug: 'suitable-alternative-accommodation',
    short: 'The comparison a council must use before cutting an exempt accommodation rent as unreasonably high.',
    body: [
      'In Birmingham City Council v SS and SA (2016), the Court of Appeal said the council only needs to compare with suitable alternative accommodation, meaning housing that meets the resident\'s needs, including support.',
    ],
    related: ['eligible-rent', 'exempt-accommodation'],
  },
  {
    term: 'Local Housing Allowance (LHA)',
    slug: 'local-housing-allowance',
    short: 'The flat-rate limit on help with rent for private tenants, set for each area and property size. It does not apply to exempt accommodation.',
    body: ['Single people under 35 usually get the lower shared accommodation rate, with exemptions for care leavers under 25 and under-25s who have spent three months in a homeless hostel.'],
    aka: ['LHA'],
    related: ['shared-accommodation-rate'],
  },
  {
    term: 'Shared accommodation rate',
    slug: 'shared-accommodation-rate',
    short: 'The lower Local Housing Allowance rate for most single private tenants under 35.',
    body: [
      'Care leavers under 25, and under-25s who have spent at least three months in a homeless hostel, can claim the one-bedroom rate instead. The care leaver exemption was extended to age 25 on 31 May 2021.',
    ],
    aka: ['SAR'],
    guide: { label: 'Care leavers and 16 to 17 year olds', href: '/guides/care-leavers-supported-accommodation/' },
    related: ['local-housing-allowance'],
  },
  {
    term: 'Benefit cap',
    slug: 'benefit-cap',
    short: 'A limit on total benefits for working-age households. Housing Benefit for specified accommodation is left out of the calculation.',
    body: ['Other benefits the household gets can still be capped.'],
    related: ['specified-accommodation'],
  },
  {
    term: 'Supported living',
    slug: 'supported-living',
    short: 'Long-term housing where an adult holds their own tenancy and receives care from a separate, CQC-registered provider.',
    body: [
      'Care and housing must be genuinely separate. If they are not, the CQC may treat the service as a care home.',
    ],
    guide: { label: 'Supported living explained', href: '/guides/supported-living/' },
    related: ['lease-based-provider', 'managed-property'],
  },
  {
    term: 'Lease-based provider',
    slug: 'lease-based-provider',
    short: 'A registered provider that leases most of its supported housing from investors, often on long, inflation-linked leases.',
    body: [
      'The Regulator of Social Housing warned in 2019 about the risks of this model, including concentration of risk and thin margins, and several lease-based providers have been found non-compliant with governance and viability standards.',
    ],
    related: ['registered-provider', 'supported-living'],
  },
  {
    term: 'Housing First',
    slug: 'housing-first',
    short: 'A model giving people with long histories of homelessness a settled home first, with intensive, open-ended support.',
    body: ['Support is not conditional on treatment or engagement in a set way, and caseloads are small. Rent is usually paid under ordinary rules because the homes are general needs tenancies.'],
    related: ['transitional-housing'],
  },
  {
    term: 'Transitional housing',
    slug: 'transitional-housing',
    short: 'Time-limited supported housing designed to help someone move from crisis to a settled home.',
    body: [
      'Stays usually run from six months to two years, with move-on planning from the first day.',
      "Transitional schemes include young people's foyers, step-down housing for people leaving hospital and move-on flats after a hostel. A scheme where nobody moves on is long-term housing, whatever it is called, and should be planned and funded that way.",
    ],
    guide: { label: 'Transitional housing and move-on', href: '/guides/transitional-housing-and-move-on/' },
    related: ['move-on'],
  },
  {
    term: 'Move-on',
    slug: 'move-on',
    short: 'The planned move from supported housing into more settled accommodation.',
    body: ['A positive move-on is planned, chosen by the resident and affordable, with any ongoing support in place.'],
    related: ['transitional-housing'],
  },
  {
    term: 'Emergency accommodation',
    slug: 'emergency-accommodation',
    short: 'A place to stay at short notice, often arranged by a council under its interim homelessness duty.',
    body: [
      'Emergency accommodation is not automatically supported housing. A placement only counts as exempt accommodation if the landlord and support tests are met.',
      'Councils must provide interim accommodation when they have reason to believe someone may be homeless, eligible for help and in priority need. Night shelters and severe weather beds are emergency accommodation run outside those statutory duties, usually by charities.',
    ],
    guide: { label: 'Emergency and temporary accommodation', href: '/guides/emergency-accommodation/' },
    related: ['temporary-accommodation', 'local-authority-hostel'],
  },
  {
    term: 'Temporary accommodation',
    slug: 'temporary-accommodation',
    short: 'Housing a council arranges under homelessness law while it decides an application or until a settled home is offered.',
    body: ['Bed and breakfast is unsuitable for families with children and pregnant women except in an emergency, and then for no more than six weeks.'],
    aka: ['TA'],
    related: ['emergency-accommodation'],
  },
  {
    term: 'CAS-3',
    slug: 'cas-3',
    short: 'Community Accommodation Service Tier 3: up to 84 nights of temporary accommodation for prison leavers at risk of homelessness.',
    body: ['CAS-3 launched in five probation regions in July 2021 and has since been rolled out across England. It includes basic floating support and help to find longer-term housing.'],
    guide: { label: 'Prison leavers, CAS-3 and supported housing', href: '/guides/prison-leavers-cas3-and-supported-housing/' },
    related: ['emergency-accommodation'],
  },
  {
    term: 'Sanctuary scheme',
    slug: 'sanctuary-scheme',
    short: 'Security measures and support that let a survivor of domestic abuse stay safely in their own home.',
    body: ['Regulations made in 2021 protect households in qualifying sanctuary schemes from the spare bedroom reduction in Housing Benefit and Universal Credit.'],
    related: ['refuge'],
  },
  {
    term: 'House in multiple occupation (HMO)',
    slug: 'hmo',
    short: 'A property shared by people from more than one household who share facilities such as a kitchen or bathroom.',
    body: [
      'A mandatory licence is needed for five or more people from two or more households. Buildings managed by registered providers and some public bodies are exempt under Schedule 14 to the Housing Act 2004. Charities and CICs are not.',
    ],
    aka: ['HMO'],
    guide: { label: 'Property standards and safety', href: '/guides/property-standards-and-safety/' },
    related: ['registered-provider'],
  },
  {
    term: 'Awaab\'s Law',
    slug: 'awaabs-law',
    short: 'Rules requiring social landlords to deal with damp, mould and other hazards within fixed timescales, in force since 27 October 2025.',
    body: ['It applies to almost all social housing let by registered providers under a tenancy, including supported and temporary accommodation. Later phases bring in more hazards.'],
    guide: { label: 'Property standards and safety', href: '/guides/property-standards-and-safety/' },
    related: ['hmo'],
  },
  {
    term: 'Ofsted-registered supported accommodation',
    slug: 'ofsted-supported-accommodation',
    short: 'Supported accommodation for looked-after 16 and 17 year olds and care leavers, which must be registered with Ofsted since 28 October 2023.',
    body: [
      'Providers must meet four quality standards: leadership and management, protection, accommodation and support.',
      'Running this accommodation without registration is an offence. Providers register for the type of accommodation they offer, such as single occupancy, shared accommodation or supported lodgings. Under the April 2026 licensing response, schemes for young people up to 25 with at least one Ofsted-regulated bed are exempt from supported housing licensing.',
    ],
    guide: { label: 'Care leavers and 16 to 17 year olds', href: '/guides/care-leavers-supported-accommodation/' },
    related: ['shared-accommodation-rate'],
  },
  {
    term: 'Licence (occupation)',
    slug: 'licence-to-occupy',
    short: 'Permission to occupy a room or space without a tenancy, common in hostels and shared supported housing.',
    body: ['The label does not decide it. If the resident has exclusive possession, the agreement is likely a tenancy. Licences are outside the Renters\' Rights Act reforms.'],
    guide: { label: "The Renters' Rights Act and supported accommodation", href: '/guides/renters-rights-act-supported-accommodation/' },
    related: ['transitional-housing'],
  },
];

export const glossaryBySlug = Object.fromEntries(glossary.map((t) => [t.slug, t]));
