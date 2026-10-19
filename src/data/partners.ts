/**
 * Links to sites we have a commercial interest in. Each one is labelled by
 * kind so readers and search engines can tell what it is:
 *
 * - sister: run by the same people. Labelled "From our sister site". A normal
 *   link, placed only where it helps the reader with the page they are on.
 * - affiliate: we earn a commission. Labelled "Affiliate link" with a
 *   disclosure, and rel="sponsored" so search engines know it is paid.
 * - sponsor: a paid placement. Labelled "Sponsored", rel="sponsored".
 *
 * Placements are listed per partner, by guide slug and page key. Keep them
 * few and relevant. A sitewide link to our own sites is the pattern search
 * engines treat as a link scheme, so there is none.
 *
 * Adding an affiliate:
 * 1. Join the programme (Awin, a direct scheme or an introducer agreement).
 * 2. Add an entry below with kind 'affiliate'.
 *    - Awin: set awin to the advertiser's id (awinmid, shown on its Awin
 *      profile) and url to the page readers should land on. The link is
 *      built with our publisher id and a click reference for the page it
 *      sits on, so Awin reports show which page earned the sale.
 *    - Anyone else: set url to the tracking link from their dashboard. It is
 *      used exactly as given.
 * 3. List only the guides and pages where the product helps a reader act on
 *    what they just read.
 * 4. Insurance and mortgages are regulated. Use the wording the partner
 *    gives you, add its FCA number and any risk warning it asks for.
 *
 * Set status 'pending' while an application is waiting. Pending partners
 * are not shown anywhere.
 *
 * Page keys: tools, for-support-providers, for-housing-providers,
 * for-managing-agents, for-proptech.
 */

export type PartnerKind = 'sister' | 'affiliate' | 'sponsor';

export type Partner = {
  kind: PartnerKind;
  name: string;
  url: string;
  title: string;
  text: string;
  cta: string;
  /** Guide slugs whose page shows this partner after the next step. */
  guides: string[];
  /** Other pages: tools, audience pages. */
  pages: string[];
  /** FCA firm reference number, for insurers, brokers and lenders. */
  fca?: string;
  /** Risk warning or legal line the partner requires, shown word for word. */
  warning?: string;
  /** Awin advertiser id. When set, url is the landing page and the Awin link is built for us. */
  awin?: string;
  /** 'pending' hides the partner until the programme approves us. */
  status?: 'pending';
};

export const partners: Record<string, Partner> = {
  'hmo-profit': {
    kind: 'sister',
    name: 'HMO Profit',
    url: 'https://hmoprofit.co.uk',
    title: 'Check a scheme covers its costs',
    text: 'HMO Profit has a calculator for HMOs and supported accommodation. Model rent, running costs, voids and occupancy on a property before you take it on.',
    cta: 'Open HMO Profit',
    guides: [
      'housing-benefit-rent-and-service-charges',
      'property-standards-and-safety',
      'managing-agents-and-proptech-in-supported-housing',
      'leasing-property-to-a-supported-housing-provider',
    ],
    pages: ['tools', 'for-housing-providers', 'for-managing-agents'],
  },

  // Applied October 2026. When approved, replace url with the referral link
  // from the affiliate area, check the course names in text, and delete status.
  'care-skills-training': {
    kind: 'affiliate',
    status: 'pending',
    name: 'Care Skills Training',
    url: 'https://careskillstraining.org/',
    title: 'Online training for care and support staff',
    text: 'Care Skills Training runs online courses for people working in care and support. Use it to fill gaps in your training matrix.',
    cta: 'See the courses',
    guides: ['training-for-supported-housing-staff', 'how-to-prepare-for-a-supported-housing-audit'],
    pages: ['for-support-providers'],
  },

  // Examples to copy once the advertiser approves you. Do not publish these
  // with placeholder values.
  //
  // 'landlord-insurance': {
  //   kind: 'affiliate',
  //   name: 'Insurer name',
  //   awin: '12345',
  //   url: 'https://www.insurer.example/landlord-insurance/',
  //   title: 'Landlord insurance for shared and supported housing',
  //   text: 'Buildings, contents and liability cover for HMOs and properties let to supported housing providers. Check the policy covers your tenant type.',
  //   cta: 'Get a quote',
  //   guides: ['leasing-property-to-a-supported-housing-provider', 'property-standards-and-safety'],
  //   pages: ['for-housing-providers', 'for-managing-agents'],
  //   fca: '000000',
  // },
  //
  // 'specialist-mortgages': {
  //   kind: 'affiliate',
  //   name: 'Broker name',
  //   url: 'https://broker.example/introducer-link',
  //   title: 'Mortgages for HMOs and leases to providers',
  //   text: 'A specialist broker for HMO, limited company and lease-to-provider buy-to-let mortgages.',
  //   cta: 'Speak to a broker',
  //   guides: ['leasing-property-to-a-supported-housing-provider'],
  //   pages: ['for-housing-providers'],
  //   fca: '000000',
  //   warning: 'Your property may be repossessed if you do not keep up repayments on your mortgage.',
  // },
};

export const partnerLabels: Record<PartnerKind, string> = {
  sister: 'From our sister site',
  affiliate: 'Affiliate link',
  sponsor: 'Sponsored',
};

export function partnersFor(where: { guide?: string; page?: string }): [string, Partner][] {
  return Object.entries(partners).filter(
    ([, p]) => p.status !== 'pending' && ((where.guide && p.guides.includes(where.guide)) || (where.page && p.pages.includes(where.page))),
  );
}

/** The link a reader clicks. Awin partners get an Awin tracking link with a click reference. */
export function partnerLink(p: Partner, placement: string, awinPublisherId: string): string {
  if (p.awin) {
    const awin = new URL('https://www.awin1.com/cread.php');
    awin.searchParams.set('awinmid', p.awin);
    awin.searchParams.set('awinaffid', awinPublisherId);
    awin.searchParams.set('clickref', placement.slice(0, 250));
    awin.searchParams.set('ued', p.url);
    return awin.toString();
  }
  return p.url;
}

/** rel values: paid links must carry "sponsored" (Google's link attribute guidance). */
export function partnerRel(kind: PartnerKind): string {
  return kind === 'sister' ? 'noopener' : 'sponsored noopener';
}
