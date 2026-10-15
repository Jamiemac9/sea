import type { IconName } from '@/components/Icon.astro';

export type Audience = {
  slug: 'support-providers' | 'housing-providers' | 'managing-agents' | 'proptech';
  label: string;
  icon: IconName;
  headline: string;
  intro: string;
  title: string;
  description: string;
  priorities: string[];
  start: { label: string; href: string; why: string }[];
};

export const audienceList: Audience[] = [
  {
    slug: 'support-providers',
    label: 'Support providers',
    icon: 'heart',
    title: 'Supported housing guidance for support providers',
    description:
      'What support providers need to know: exempt accommodation tests, needs assessments, support records, safeguarding and the coming national standards.',
    headline: 'You deliver the support. The evidence has to show it.',
    intro:
      'Councils test support when they decide Housing Benefit claims, and licensing will test it against national standards from 2027. These are the guides that matter most for teams running support services.',
    priorities: [
      'Needs assessment for every resident within four weeks of moving in',
      'Support plans the resident recognises, reviewed on time',
      'Session records with dates, times and links to the plan',
      'Safeguarding procedures staff actually use',
      'Outcomes, including where people move on to',
    ],
    start: [
      { label: 'Needs assessments, support plans and support records', href: '/guides/support-planning-and-needs-assessments/', why: 'The three documents every review starts with' },
      { label: 'What is exempt accommodation?', href: '/guides/what-is-exempt-accommodation/', why: 'The four tests your support has to meet' },
      { label: 'Licensing and the national standards', href: '/guides/supported-housing-regulatory-oversight-act/', why: 'What licensing will expect from 2027' },
      { label: 'Audit readiness check', href: '/tools/audit-readiness/', why: 'Score your service in about 10 minutes' },
    ],
  },
  {
    slug: 'housing-providers',
    label: 'Housing providers',
    icon: 'building',
    title: 'Supported housing guidance for landlords',
    description:
      'For housing associations, charities and landlords: the exempt accommodation tests, rent and service charges, lease models, property standards and licensing.',
    headline: 'You hold the tenancy, the rent and most of the risk.',
    intro:
      'Whether you are a housing association, a charity or a community interest company, the landlord carries most of the legal duties in supported housing. Start with structure and rent, then property and licensing.',
    priorities: [
      'A structure that passes the exempt accommodation tests',
      'A rent and service charge breakdown that survives review',
      'Property compliance across every scheme',
      'Lease terms you can sustain if Housing Benefit changes',
      'Fit and proper evidence for your board and managers',
    ],
    start: [
      { label: 'Rent, service charges and Housing Benefit', href: '/guides/housing-benefit-rent-and-service-charges/', why: 'How eligible rent is built and tested' },
      { label: 'The four categories of specified accommodation', href: '/guides/specified-accommodation-categories/', why: 'Why category 1 or 2 changes your rent' },
      { label: 'Grey areas', href: '/guides/grey-areas-in-exempt-accommodation/', why: 'CICs, lease models, HMOs and planning' },
      { label: 'Service charge calculator', href: '/tools/service-charge-calculator/', why: 'Split eligible from ineligible charges' },
    ],
  },
  {
    slug: 'managing-agents',
    label: 'Managing agents',
    icon: 'key',
    title: 'Supported housing guidance for managing agents',
    description:
      'For managing agents in supported housing: who carries which duty, management agreements, HMO licensing, compliance, voids and the evidence councils want.',
    headline: 'You keep the buildings safe. Make sure the paperwork says so.',
    intro:
      'Managing agents in supported housing work between investors, landlords and support providers. The agreement sets your duties, and some laws make you liable in your own right.',
    priorities: [
      'A management agreement that names every task and timescale',
      'A compliance tracker with certificates and expiry dates',
      'HMO licensing status for every shared property',
      'Repairs logged with reported and completed dates',
      'Clear void and allocation responsibilities',
    ],
    start: [
      { label: 'Guide for managing agents and proptech', href: '/guides/managing-agents-and-proptech-in-supported-housing/', why: 'Duties, agreements and data' },
      { label: 'Property standards and safety', href: '/guides/property-standards-and-safety/', why: 'Every rule that applies, in one table' },
      { label: "The Renters' Rights Act and supported accommodation", href: '/guides/renters-rights-act-supported-accommodation/', why: 'What changed on 1 May 2026' },
      { label: 'Grey areas', href: '/guides/grey-areas-in-exempt-accommodation/', why: 'HMO exemptions and planning use classes' },
    ],
  },
  {
    slug: 'proptech',
    label: 'Proptech',
    icon: 'cpu',
    title: 'Supported housing guidance for proptech teams',
    description:
      'For proptech teams building for supported housing: the data councils and licensing need, support record design, data protection and Awaab\'s Law.',
    headline: 'Build for the evidence, not the demo.',
    intro:
      'Supported housing software lives or dies on whether it produces evidence a council, commissioner or licensing officer will accept. Start with the data points that matter and the rules behind them.',
    priorities: [
      'Time-stamped records with an audit trail',
      'Needs assessment and review dates tracked per resident',
      'Housing management time kept separate from support time',
      'Special category data handled lawfully',
      'Exports that match how councils ask for evidence',
    ],
    start: [
      { label: 'Guide for managing agents and proptech', href: '/guides/managing-agents-and-proptech-in-supported-housing/', why: 'The data model councils expect' },
      { label: 'Needs assessments, support plans and support records', href: '/guides/support-planning-and-needs-assessments/', why: 'What a good record contains' },
      { label: 'Licensing and the national standards', href: '/guides/supported-housing-regulatory-oversight-act/', why: 'What licensing will test' },
      { label: 'Rent, service charges and Housing Benefit', href: '/guides/housing-benefit-rent-and-service-charges/', why: 'How charges must be broken down' },
    ],
  },
];
