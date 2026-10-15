export type FaqGroup = { title: string; slug: string; items: { q: string; a: string; href?: string }[] };

export const faqGroups: FaqGroup[] = [
  {
    title: 'The basics',
    slug: 'basics',
    items: [
      {
        q: 'What is supported exempt accommodation?',
        a: 'It is supported housing where a housing association, registered charity, voluntary organisation or county council is the landlord, and that landlord or someone acting for it gives residents more than minimal care, support or supervision. Housing Benefit pays the rent without the usual local caps.',
        href: '/guides/what-is-exempt-accommodation/',
      },
      {
        q: 'What is the difference between exempt accommodation and specified accommodation?',
        a: 'Specified accommodation is the wider group of four supported housing categories where rent is paid by Housing Benefit. Exempt accommodation is category 1. The others are managed properties, refuges and local authority hostels.',
        href: '/guides/specified-accommodation-categories/',
      },
      {
        q: 'Who regulates supported exempt accommodation?',
        a: 'Until licensing starts, nobody regulates the support in non-commissioned schemes directly. Councils check Housing Benefit claims and property standards, the Regulator of Social Housing regulates registered providers, the CQC regulates personal care and Ofsted regulates accommodation for 16 and 17 year olds in care.',
        href: '/guides/supported-housing-regulatory-oversight-act/',
      },
      {
        q: 'Is supported housing the same as supported living?',
        a: 'No. Supported living is one type of supported housing, usually long-term homes for adults with learning disabilities, autism or mental health needs, with care from a separate CQC-registered provider.',
        href: '/guides/supported-living/',
      },
    ],
  },
  {
    title: 'Licensing and regulation',
    slug: 'regulation',
    items: [
      {
        q: 'When does supported housing licensing start in England?',
        a: 'Licensing is expected to start in 2027. The government planned to consult on draft regulations and guidance later in 2026.',
        href: '/regulation-tracker/',
      },
      {
        q: 'Will every supported housing scheme need its own licence?',
        a: 'No. The April 2026 government response said providers will not need a separate licence for each scheme.',
        href: '/guides/supported-housing-regulatory-oversight-act/',
      },
      {
        q: 'What do the national supported housing standards cover?',
        a: 'The 2025 consultation proposed standards on person-centred support, resident empowerment, the living environment, staffing and safeguarding, and meeting local need. The April 2026 response said they will be slightly amended before being made a licence condition.',
        href: '/guides/supported-housing-regulatory-oversight-act/',
      },
      {
        q: 'Do commissioned services need to meet the national standards?',
        a: 'Commissioned services will not have to meet the standards licensing condition directly. Commissioners are expected to commission support that complies with the standards.',
      },
      {
        q: 'Does the Renters\' Rights Act apply to supported housing?',
        a: 'Yes, where residents have assured tenancies with landlords that are not registered providers, from 1 May 2026. Licences are not covered, and registered providers have different timings for some changes.',
        href: '/guides/renters-rights-act-supported-accommodation/',
      },
    ],
  },
  {
    title: 'Money and Housing Benefit',
    slug: 'money',
    items: [
      {
        q: 'Do people on Universal Credit get their rent paid in supported housing?',
        a: 'In specified accommodation, yes. Rent and eligible service charges are paid as Housing Benefit by the council, and Universal Credit covers living costs.',
      },
      {
        q: 'Does Housing Benefit pay for support charges?',
        a: 'No. Support, counselling and personal care are ineligible. Intensive housing management can be eligible when it is housing management, not support, and is evidenced.',
        href: '/guides/housing-benefit-rent-and-service-charges/',
      },
      {
        q: 'Why do councils refer exempt rents to a rent officer?',
        a: 'For landlords that are not registered providers, the rent officer\'s figure decides how much Housing Benefit subsidy the council gets back from the DWP. Benefit paid above it is subsidy loss for the council.',
      },
      {
        q: 'Can a council reduce the rent in exempt accommodation?',
        a: 'Yes, if the rent is unreasonably high compared with suitable alternative accommodation, or the home is larger than needed. The comparison must be with accommodation that meets the resident\'s needs, including support.',
      },
    ],
  },
  {
    title: 'Running a service',
    slug: 'practice',
    items: [
      {
        q: 'How soon must a needs assessment be done?',
        a: 'Under the licensing conditions set out in April 2026, on moving in or within four weeks. Many commissioning contracts already set shorter deadlines.',
        href: '/guides/support-planning-and-needs-assessments/',
      },
      {
        q: 'Do supported shared houses need an HMO licence?',
        a: 'Usually, if five or more people from two or more households share facilities, unless the building is managed by a registered provider or another exempt public body. Charities and CICs are not exempt.',
        href: '/guides/property-standards-and-safety/',
      },
      {
        q: 'Can we house 16 and 17 year olds in supported housing?',
        a: 'Only if you are registered with Ofsted, where the young person is looked after or a care leaver. Registration has been mandatory since 28 October 2023.',
        href: '/guides/care-leavers-supported-accommodation/',
      },
      {
        q: 'What is the best way to prepare for an audit or licence application?',
        a: 'Map your schemes, test the structure, sample resident files, check property compliance and rent evidence, and write an action plan. Our readiness check gives you a starting score in about 10 minutes.',
        href: '/tools/audit-readiness/',
      },
    ],
  },
];
