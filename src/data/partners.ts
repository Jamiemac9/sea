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
