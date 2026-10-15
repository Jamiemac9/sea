/**
 * Audit readiness check. Eight areas that line up with what councils test in
 * Housing Benefit reviews and what licensing is expected to test from 2027.
 * Each question carries the action shown if the answer is not a clear yes.
 */

export type Question = { id: string; text: string; action: string; href: string };
export type Area = { id: string; title: string; blurb: string; questions: Question[] };

export const areas: Area[] = [
  {
    id: 'structure',
    title: 'Structure and eligibility',
    blurb: 'Whether each scheme meets the exempt accommodation tests.',
    questions: [
      {
        id: 's1',
        text: "For every scheme, can you show the landlord's legal status, such as a registered provider number, charity number, or constitution and accounts?",
        action: "Put evidence of each landlord's status in one folder per scheme.",
        href: '/guides/what-is-exempt-accommodation/',
      },
      {
        id: 's2',
        text: "Where another organisation delivers support, is there a written agreement showing it acts on the landlord's behalf?",
        action: "Write or update support agreements so they show the provider acts for the landlord, and how the landlord monitors it.",
        href: '/guides/grey-areas-in-exempt-accommodation/',
      },
      {
        id: 's3',
        text: 'Could you show a council, for any resident you pick, that their support is more than minimal?',
        action: 'Test five files: could someone who was not there see what support was given and why?',
        href: '/guides/grey-areas-in-exempt-accommodation/',
      },
    ],
  },
  {
    id: 'planning',
    title: 'Needs assessment and planning',
    blurb: 'The four-week assessment and a plan the resident owns.',
    questions: [
      {
        id: 'p1',
        text: 'Does every resident have a needs assessment completed on arrival or within four weeks?',
        action: 'List residents without an assessment within four weeks and complete them this month.',
        href: '/guides/support-planning-and-needs-assessments/',
      },
      {
        id: 'p2',
        text: "Does every resident have a support plan with goals in their own words?",
        action: "Rewrite generic plans with each resident, using two to four goals they chose.",
        href: '/guides/support-planning-and-needs-assessments/',
      },
      {
        id: 'p3',
        text: 'Are support plans reviewed at least every three months, and after significant changes?',
        action: 'Set review dates in your system and flag any plan more than three months old.',
        href: '/guides/support-planning-and-needs-assessments/',
      },
    ],
  },
  {
    id: 'delivery',
    title: 'Support delivery and records',
    blurb: 'Evidence that support happened as planned.',
    questions: [
      {
        id: 'd1',
        text: 'Do support records show the date, time, length and what was done, linked to the support plan?',
        action: 'Change your session note template to require date, time, length and the plan goal it relates to.',
        href: '/guides/support-planning-and-needs-assessments/',
      },
      {
        id: 'd2',
        text: 'Are records written on the day, by the person who delivered the support?',
        action: 'Make same-day recording the rule, and make it quick enough to do on a phone.',
        href: '/guides/managing-agents-and-proptech-in-supported-housing/',
      },
      {
        id: 'd3',
        text: 'Do managers check a sample of records every month?',
        action: 'Start a monthly check of five records per scheme, with feedback to staff.',
        href: '/guides/how-to-prepare-for-a-supported-housing-audit/',
      },
    ],
  },
  {
    id: 'safeguarding',
    title: 'Safeguarding and risk',
    blurb: 'Policies people use, and risk managed from referral.',
    questions: [
      {
        id: 'g1',
        text: 'Is there a safeguarding policy with a named lead, and have all staff been trained on it in the last 12 months?',
        action: 'Name a safeguarding lead and book refresher training for anyone not trained in the last year.',
        href: '/guides/support-planning-and-needs-assessments/',
      },
      {
        id: 'g2',
        text: 'Is every safeguarding concern and incident logged, with who was told and what happened next?',
        action: 'Set up a single log for concerns and incidents, and review it monthly with managers.',
        href: '/guides/support-planning-and-needs-assessments/',
      },
      {
        id: 'g3',
        text: 'Do you get and record risk information before accepting a referral?',
        action: 'Add a risk information step to your referral process, and record what you asked for and received.',
        href: '/guides/prison-leavers-cas3-and-supported-housing/',
      },
    ],
  },
  {
    id: 'property',
    title: 'Property and safety',
    blurb: 'Certificates, licences and repairs across every building.',
    questions: [
      {
        id: 'h1',
        text: 'Are gas safety records, electrical inspections and fire risk assessments in date for every property?',
        action: 'Build a compliance tracker with every certificate and expiry date, and chase anything overdue.',
        href: '/guides/property-standards-and-safety/',
      },
      {
        id: 'h2',
        text: 'Does every shared property that needs an HMO licence have one?',
        action: 'Check the licensing status of each shared house, remembering charities and CICs are not exempt.',
        href: '/guides/property-standards-and-safety/',
      },
      {
        id: 'h3',
        text: 'Are repairs logged with the date reported and the date completed?',
        action: 'Log every repair with dates and track how long each type takes.',
        href: '/guides/property-standards-and-safety/',
      },
    ],
  },
  {
    id: 'rent',
    title: 'Rent and service charges',
    blurb: 'A breakdown that holds up in a Housing Benefit review.',
    questions: [
      {
        id: 'r1',
        text: 'Does each scheme have a line-by-line rent and service charge breakdown?',
        action: 'Produce a breakdown per scheme showing core rent, each service charge and how it is calculated.',
        href: '/guides/housing-benefit-rent-and-service-charges/',
      },
      {
        id: 'r2',
        text: 'Are support costs kept out of the rent, with intensive housing management backed by time records?',
        action: 'Separate support costs from the rent and start time records for staff with split roles.',
        href: '/guides/housing-benefit-rent-and-service-charges/',
      },
      {
        id: 'r3',
        text: 'Do you reconcile service charges against actual spending each year?',
        action: "Run a reconciliation for last year and adjust next year's charges to match real costs.",
        href: '/tools/service-charge-calculator/',
      },
    ],
  },
  {
    id: 'governance',
    title: 'Governance and staffing',
    blurb: 'The fit and proper person test and a capable team.',
    questions: [
      {
        id: 'v1',
        text: 'Could your directors and board pass a fit and proper person test of the kind used by the CQC and Ofsted?',
        action: 'Gather declarations, checks and experience records for each director and board member.',
        href: '/guides/supported-housing-regulatory-oversight-act/',
      },
      {
        id: 'v2',
        text: "Do you check and record service managers' character, capacity, experience and skills?",
        action: 'Create a record for each service manager covering checks, experience and training.',
        href: '/guides/supported-housing-regulatory-oversight-act/',
      },
      {
        id: 'v3',
        text: 'Are staff recruited safely, with references and DBS checks where eligible, then trained and supervised?',
        action: 'Audit staff files for references, DBS checks, training and supervision records.',
        href: '/guides/how-to-prepare-for-a-supported-housing-audit/',
      },
    ],
  },
  {
    id: 'voice',
    title: 'Resident voice and outcomes',
    blurb: 'Residents have a say, and you know where they go next.',
    questions: [
      {
        id: 'o1',
        text: 'Do residents have a clear complaints process, explained when they move in?',
        action: 'Write a one-page complaints guide and go through it at every move-in.',
        href: '/guides/support-planning-and-needs-assessments/',
      },
      {
        id: 'o2',
        text: 'Do residents have a say in how the service runs, with a record of what changed as a result?',
        action: 'Hold regular resident meetings or surveys and record what changed because of them.',
        href: '/guides/support-planning-and-needs-assessments/',
      },
      {
        id: 'o3',
        text: 'Do you record where people move on to and whether the move was planned?',
        action: 'Record move-out date, destination and whether the move was planned for every resident.',
        href: '/guides/transitional-housing-and-move-on/',
      },
    ],
  },
];

export const answerOptions = [
  { value: 2, label: 'Yes' },
  { value: 1, label: 'Partly' },
  { value: 0, label: 'No' },
  { value: -1, label: 'Not sure' },
] as const;
