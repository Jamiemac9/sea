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
 * 1. Join the programme (Awin, a direct scheme or an introducer agreement)
 *    and copy your tracking link from its dashboard.
 * 2. Add an entry below with kind 'affiliate' and the tracking link as url.
 *    Tracking links already carry their own tags, so no UTM is added.
 * 3. List only the guides and pages where the product helps a reader act on
 *    what they just read.
 * 4. Insurance and mortgages are regulated. Use the wording the partner
 *    gives you, add its FCA number and any risk warning it asks for.
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
};

export const partners: Record<string, Partner> = {
  'hmo-profit': {
    kind: 'sister',
    name: 'HMO Profit',
    url: 'https://hmoprofit.co.uk',
    title: 'Check a scheme covers its costs',
    text: 'HMO Profit has a calculator for HMOs and supported accommodation. Model rent, running costs, voids and occupancy on a property before you take it on.',
    cta: 'Open HMO Profit',
    guides: ['housing-benefit-rent-and-service-charges', 'property-standards-and-safety', 'managing-agents-and-proptech-in-supported-housing'],
    pages: ['tools', 'for-housing-providers', 'for-managing-agents'],
  },

  // Examples to copy once you have a real tracking link. Do not publish these
  // with placeholder links.
  //
  // 'landlord-insurance': {
  //   kind: 'affiliate',
  //   name: 'Insurer name',
  //   url: 'https://www.awin1.com/cread.php?awinmid=...&awinaffid=...',
  //   title: 'Landlord insurance for shared and supported housing',
  //   text: 'Buildings, contents and liability cover for HMOs and properties let to supported housing providers. Check the policy covers your tenant type.',
  //   cta: 'Get a quote',
  //   guides: ['property-standards-and-safety'],
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
  //   guides: [],
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
    ([, p]) => (where.guide && p.guides.includes(where.guide)) || (where.page && p.pages.includes(where.page)),
  );
}

/** rel values: paid links must carry "sponsored" (Google's link attribute guidance). */
export function partnerRel(kind: PartnerKind): string {
  return kind === 'sister' ? 'noopener' : 'sponsored noopener';
}
