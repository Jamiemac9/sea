/**
 * Free downloadable templates. Files are built by `npm run templates` into
 * public/downloads/. Each template gets its own landing page, so the page can
 * rank for searches such as "support plan template supported housing".
 */

export type Template = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  file: string;
  format: 'Word' | 'Excel';
  pages: string;
  quickAnswer: string;
  inside: string[];
  /**
   * What the file looks like. For Word files each group is a section of the
   * document. For Excel files the first group is the main sheet's columns, the
   * second is the sheet tabs and any others are listed underneath.
   */
  preview: { heading: string; items: string[] }[];
  steps: { name: string; text: string }[];
  faqs: { q: string; a: string }[];
  guide: { label: string; href: string };
  forAudience: string;
};

export const templates: Template[] = [
  {
    slug: 'support-plan-template',
    title: 'Support plan template for supported housing',
    seoTitle: 'Support plan template for supported housing',
    description:
      "Free Word support plan template for supported housing, with goals in the resident's words, risk, move-on, a review log and a session record.",
    file: '/downloads/support-plan-template.docx',
    format: 'Word',
    pages: '4 pages',
    quickAnswer:
      "A free support plan template in Word, built around what councils and the planned licensing conditions look for. Up to four goals in the resident's own words, first steps, who gives what support and when, risks, a move-on plan, a review log and a session record sheet.",
    inside: [
      'Up to four goals, each with first steps, the support given and how you will know it is working',
      'Risk management and move-on sections',
      'A review log for three-monthly reviews',
      'A landscape support session record with dates, times and the plan goal for each session',
    ],
    preview: [
      { heading: 'About this plan', items: ['Resident name', 'Key worker', 'Plan start date', 'Based on the needs assessment dated', 'Next review date'] },
      {
        heading: 'Each goal',
        items: [
          "The goal, in the resident's own words",
          'Why it matters to them',
          'First steps (the next two weeks)',
          'Support we will give: who, how often, where',
          'How we will know it is working',
          'Target date',
        ],
      },
      { heading: 'Support session record', items: ['Date, start and end time', 'Who was there', 'What we did', 'Plan goal', 'Risks or concerns', 'Next actions'] },
    ],
    steps: [
      { name: 'Start from the needs assessment', text: 'Use the priority needs from the assessment, completed on arrival or within four weeks.' },
      { name: 'Agree goals with the resident', text: 'Write two to four goals in their words, each with first steps they can take in the next two weeks.' },
      { name: 'Set out the support', text: 'Record who gives what support, how often and where, so it can be checked against session records.' },
      { name: 'Record every session', text: 'Fill in the session record on the day, linking each session to a plan goal.' },
      { name: 'Review every three months', text: 'Use the review log, and review sooner after any big change.' },
    ],
    faqs: [
      { q: 'What should a support plan include in supported housing?', a: "Goals in the resident's own words, the support to be given, by whom and how often, risks and how they are managed, a move-on plan and a review date. Session records should link back to the plan." },
      { q: 'How often should a support plan be reviewed?', a: 'At least every three months, and sooner after any significant change such as a hospital stay, an incident or a change in benefits.' },
      { q: 'Can I change the template?', a: "Yes. It is a normal Word document. Add your logo and adapt the sections to your service and your commissioner's requirements." },
    ],
    guide: { label: 'Needs assessments, support plans and support records', href: '/guides/support-planning-and-needs-assessments/' },
    forAudience: 'Support providers',
  },
  {
    slug: 'needs-assessment-template',
    title: 'Needs assessment template for supported housing',
    seoTitle: 'Needs assessment template for supported housing',
    description:
      'Free Word needs assessment template for supported housing residents, covering history, health, money, risk and goals, ready for the four-week deadline.',
    file: '/downloads/needs-assessment-template.docx',
    format: 'Word',
    pages: '4 pages',
    quickAnswer:
      "A free needs assessment template in Word for new residents in supported housing. It covers housing history, health, drug and alcohol use, money, risks, relationships and the resident's own goals, with a summary of needs, consent to share information and sign-off.",
    inside: [
      'Assessment details, including whether it was done within four weeks of move-in',
      'Seven sections with prompts and space to write',
      'A summary of needs with priorities that feed the support plan',
      'Consent to share information, and staff and manager sign-off',
    ],
    preview: [
      {
        heading: 'Sections',
        items: [
          'Housing history',
          'Physical and mental health',
          'Drug and alcohol use',
          'Money, debts and benefits',
          'Risks',
          'Relationships, family, education and work',
          'What the resident wants',
        ],
      },
      { heading: 'After the sections', items: ['Summary of needs and priorities', 'Consent to share information', 'Resident, staff and manager sign-off'] },
    ],
    steps: [
      { name: 'Book it in at move-in', text: 'Complete it on the day the resident moves in, or within four weeks at the latest.' },
      { name: 'Use referral information carefully', text: 'Treat the referral as a starting point, not a copy. People change and referrals go out of date.' },
      { name: 'Work through the sections with the resident', text: 'Use the prompts, and write answers in plain words the resident would recognise.' },
      { name: 'Summarise and prioritise', text: 'List each need with a priority, and move priority needs into the support plan.' },
      { name: 'Get consent and sign off', text: 'Record who information can be shared with, then sign and date it with a manager review.' },
    ],
    faqs: [
      { q: 'How soon must a needs assessment be done in supported housing?', a: 'The April 2026 government response on licensing says each resident needs an assessment when they move in or within four weeks. Many commissioning contracts set shorter deadlines.' },
      { q: 'Who should complete the needs assessment?', a: 'A trained member of staff, with the resident present and involved. A manager should review it.' },
      { q: 'Is this template suitable for under-18s?', a: 'It is written for adults. Supported accommodation for looked-after 16 and 17 year olds must follow the Ofsted quality standards, so adapt it to those requirements.' },
    ],
    guide: { label: 'Needs assessments, support plans and support records', href: '/guides/support-planning-and-needs-assessments/' },
    forAudience: 'Support providers',
  },
  {
    slug: 'rent-and-service-charge-schedule',
    title: 'Rent and service charge schedule template',
    seoTitle: 'Supported housing rent and service charge template',
    description:
      'Free Excel rent and service charge schedule for supported housing, splitting eligible and ineligible charges, with a reconciliation and IHM time record.',
    file: '/downloads/rent-and-service-charge-schedule.xlsx',
    format: 'Excel',
    pages: '4 sheets',
    quickAnswer:
      'A free Excel schedule that turns annual costs into a weekly charge per resident, split into eligible, ineligible and depends-on-evidence lines for Housing Benefit. It includes a year-end reconciliation sheet and an intensive housing management time record.',
    inside: [
      'Example lines for core rent, eligible service charges and common ineligible charges',
      'Automatic weekly charge per resident and totals by type',
      'A reconciliation sheet comparing what you charged with what you spent',
      'An intensive housing management time record that shows the split from support',
    ],
    preview: [
      { heading: 'Schedule columns', items: ['Charge', 'Type', 'How it is calculated', 'Annual cost', 'Weekly per resident', 'Evidence held'] },
      { heading: 'Sheets', items: ['How to use', 'Schedule', 'Reconciliation', 'IHM time record'] },
    ],
    steps: [
      { name: 'Enter the scheme details', text: 'Add the scheme, landlord, charging period and number of bed spaces.' },
      { name: 'Enter annual costs', text: 'Replace the example lines with your own costs and say how each one is calculated.' },
      { name: 'Set the type of each line', text: 'Choose Eligible, Ineligible or Depends. Keep support, counselling and personal care out of the rent.' },
      { name: 'Record intensive housing management time', text: 'Use the time record for staff whose time is split between housing management and support.' },
      { name: 'Reconcile at year end', text: 'Compare what you charged with what you spent, and explain any big difference.' },
    ],
    faqs: [
      { q: 'Which service charges does Housing Benefit cover in supported housing?', a: 'Charges connected with providing adequate accommodation, such as cleaning and lighting communal areas, furniture and intensive housing management. Support, water charges and most personal fuel and meals are ineligible.' },
      { q: 'Why does the schedule have a Depends type?', a: 'Some lines, such as intensive housing management, are only eligible if your evidence shows they are housing management and not support. Marking them separately shows the council you know the difference.' },
      { q: 'Does the spreadsheet work in Google Sheets?', a: 'Yes. Upload it to Google Drive and open it with Google Sheets. The formulas and drop-down lists carry over.' },
    ],
    guide: { label: 'Rent, service charges and Housing Benefit', href: '/guides/housing-benefit-rent-and-service-charges/' },
    forAudience: 'Housing providers and managing agents',
  },
  {
    slug: 'licensing-readiness-checklist',
    title: 'Supported housing licensing readiness checklist',
    seoTitle: 'Supported housing licensing readiness checklist',
    description:
      'Free Excel checklist to prepare for supported housing licensing: 28 items across nine areas, with status, evidence, owner and due date, and an automatic score.',
    file: '/downloads/licensing-readiness-checklist.xlsx',
    format: 'Excel',
    pages: '3 sheets',
    quickAnswer:
      'A free Excel checklist with 28 items across nine areas, built on what councils test in Housing Benefit reviews and what the April 2026 government response says licensing will test. Record a status, where the evidence is, an owner and a due date for each item, and the summary sheet scores each area out of 100.',
    inside: [
      'The 24 questions from our readiness check, plus four licensing preparation items',
      'Drop-down status for each item, with colour coding',
      'Columns for evidence location, owner and due date',
      'A summary sheet that scores each area and the whole service',
    ],
    preview: [
      { heading: 'Checklist columns', items: ['Area', 'Item', 'Status', 'Where the evidence is', 'Owner', 'Due date'] },
      { heading: 'Sheets', items: ['How to use', 'Checklist', 'Summary'] },
      {
        heading: 'Areas',
        items: [
          'Structure and eligibility',
          'Needs assessment and planning',
          'Support delivery and records',
          'Safeguarding and risk',
          'Property and safety',
          'Rent and service charges',
          'Governance and staffing',
          'Resident voice and outcomes',
          'Licensing preparation',
        ],
      },
    ],
    steps: [
      { name: 'Copy the checklist per scheme', text: 'Use one checklist for the whole service, or copy the sheet once for each scheme.' },
      { name: 'Set a status for each item', text: 'Choose Yes, Partly, No or Not sure. Treat Not sure as a gap.' },
      { name: 'Record the evidence', text: 'For each Yes, write where the evidence is kept. A yes with no evidence is a partly.' },
      { name: 'Assign owners and dates', text: 'Give every gap an owner and a due date, starting with resident safety.' },
      { name: 'Repeat every six months', text: 'Use the summary sheet scores to track progress before licensing starts.' },
    ],
    faqs: [
      { q: 'When does supported housing licensing start?', a: 'Licensing of supported exempt accommodation is expected to start in 2027. Draft regulations were due to be consulted on later in 2026.' },
      { q: 'Is this the same as the online readiness check?', a: 'It uses the same 24 questions, plus four licensing preparation items. The spreadsheet adds evidence, owner and due date columns so you can run it as an action plan.' },
      { q: 'Will this checklist guarantee a licence?', a: "No. It helps you find and fix gaps. The final licensing regulations and your council's scheme decide what is required." },
    ],
    guide: { label: 'Licensing and the national standards', href: '/guides/supported-housing-regulatory-oversight-act/' },
    forAudience: 'Support and housing providers',
  },
];

export const templatesBySlug = Object.fromEntries(templates.map((t) => [t.slug, t]));
