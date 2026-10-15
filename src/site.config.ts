/**
 * One place to change the brand, the audit funnel and the ad setup.
 * Anything secret or environment-specific comes from PUBLIC_* env vars so the
 * same build can run on staging without serving live ads.
 */

const env = import.meta.env;

export const site = {
  name: 'SEA Hub',
  legalName: 'SEA Audit',
  tagline: 'Plain-English guidance on supported exempt accommodation',
  description:
    'Guides, checklists and tools on exempt, supported, transitional and emergency accommodation for support providers, housing providers, managing agents and proptech teams in England.',
  locale: 'en-GB',
  // Who publishes the hub. Shown in bylines and Organization structured data.
  publisher: {
    name: 'SEA Audit',
    url: 'https://seaaudit.com',
  },
  editorialTeam: 'The SEA Hub editorial team',
  contactEmail: env.PUBLIC_CONTACT_EMAIL || 'hello@seaaudit.com',
  social: {
    linkedin: env.PUBLIC_LINKEDIN_URL || '',
  },
};

/** Audit funnel. Every outbound link to SEA Audit goes through auditUrl(). */
export const audit = {
  baseUrl: (env.PUBLIC_AUDIT_URL || 'https://seaaudit.com').replace(/\/$/, ''),
  bookPath: env.PUBLIC_AUDIT_BOOK_PATH || '/',
  utmSource: 'sea-hub',
  // Optional: POST endpoint that receives readiness-check results and enquiries
  // as JSON (a CRM webhook, Formspree, a SEA Audit API route). Leave empty to
  // hand results over by URL parameters instead.
  leadEndpoint: env.PUBLIC_LEAD_ENDPOINT || '',
};

export function auditUrl(campaign: string, content?: string, path = audit.bookPath) {
  const url = new URL(path, audit.baseUrl + '/');
  url.searchParams.set('utm_source', audit.utmSource);
  url.searchParams.set('utm_medium', 'referral');
  url.searchParams.set('utm_campaign', campaign);
  if (content) url.searchParams.set('utm_content', content);
  return url.toString();
}

/**
 * Advertising.
 * provider 'adsense' needs PUBLIC_ADSENSE_CLIENT (ca-pub-...) and slot ids.
 * Without a client id every slot shows a house ad for SEA Audit, so the layout
 * and the funnel work before an ad account is approved.
 *
 * consent 'builtin' uses the hub's own banner and Google Consent Mode v2.
 * consent 'external' assumes a Google-certified CMP (for example Google's
 * Privacy & messaging) shows its own message, which Google requires for
 * serving ads to UK and EEA visitors.
 */
export const ads = {
  provider: env.PUBLIC_ADSENSE_CLIENT ? 'adsense' : 'house',
  client: env.PUBLIC_ADSENSE_CLIENT || '',
  consent: (env.PUBLIC_CONSENT_MODE as 'builtin' | 'external') || 'builtin',
  slots: {
    leaderboard: env.PUBLIC_ADSENSE_SLOT_LEADERBOARD || '',
    inArticle: env.PUBLIC_ADSENSE_SLOT_IN_ARTICLE || '',
    sidebar: env.PUBLIC_ADSENSE_SLOT_SIDEBAR || '',
    footer: env.PUBLIC_ADSENSE_SLOT_FOOTER || '',
  },
} as const;

export type AdSlotName = keyof typeof ads.slots;

/** Optional analytics. GA4 only loads after analytics consent. */
export const analytics = {
  ga4: env.PUBLIC_GA4_ID || '',
};

export const nav = [
  { label: 'Guides', href: '/guides/' },
  { label: 'Grey areas', href: '/guides/grey-areas-in-exempt-accommodation/' },
  { label: 'Regulation tracker', href: '/regulation-tracker/' },
  { label: 'Tools', href: '/tools/' },
  { label: 'Glossary', href: '/glossary/' },
  { label: 'Resources', href: '/resources/' },
];
