import { site } from '@/site.config';

/**
 * JSON-LD builders. Search engines and answer engines read these to work out
 * what a page is, who published it and which question it answers.
 */

type Thing = Record<string, unknown>;

export function organization(origin: string): Thing {
  return {
    '@type': 'Organization',
    '@id': `${origin}/#organization`,
    name: site.publisher.name,
    url: site.publisher.url,
    logo: { '@type': 'ImageObject', url: `${origin}/icon-512.png` },
    sameAs: [site.publisher.url, site.social.linkedin].filter(Boolean),
    knowsAbout: [
      'Supported exempt accommodation',
      'Specified accommodation',
      'Supported housing',
      'Housing Benefit',
      'Supported Housing (Regulatory Oversight) Act 2023',
      'Supported living',
      'Care leavers accommodation',
    ],
  };
}

export function website(origin: string): Thing {
  return {
    '@type': 'WebSite',
    '@id': `${origin}/#website`,
    name: site.name,
    url: `${origin}/`,
    inLanguage: site.locale,
    description: site.description,
    publisher: { '@id': `${origin}/#organization` },
  };
}

export function breadcrumbs(items: { name: string; url: string }[]): Thing {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqPage(faqs: { q: string; a: string }[], url: string): Thing {
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function article(opts: {
  url: string;
  origin: string;
  title: string;
  description: string;
  published: Date;
  updated: Date;
  section: string;
  quickAnswer: string;
  keyPoints: string[];
  citations: { title: string; url: string }[];
  about: string[];
}): Thing {
  return {
    '@type': 'Article',
    '@id': `${opts.url}#article`,
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    mainEntityOfPage: opts.url,
    datePublished: opts.published.toISOString(),
    dateModified: opts.updated.toISOString(),
    inLanguage: site.locale,
    articleSection: opts.section,
    author: { '@type': 'Organization', name: site.editorialTeam, url: `${opts.origin}/about/` },
    publisher: { '@id': `${opts.origin}/#organization` },
    isPartOf: { '@id': `${opts.origin}/#website` },
    image: `${opts.origin}/og-default.png`,
    abstract: opts.quickAnswer,
    about: opts.about.map((name) => ({ '@type': 'Thing', name })),
    citation: opts.citations.map((c) => ({ '@type': 'CreativeWork', name: c.title, url: c.url })),
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.quick-answer', '.key-points'] },
    hasPart: {
      '@type': 'ItemList',
      name: 'The short version',
      itemListElement: opts.keyPoints.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p })),
    },
  };
}

export function howTo(opts: { name: string; totalTime?: string; steps: { name: string; text: string }[]; url: string }): Thing {
  return {
    '@type': 'HowTo',
    '@id': `${opts.url}#howto`,
    name: opts.name,
    ...(opts.totalTime ? { totalTime: opts.totalTime } : {}),
    step: opts.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.name, text: s.text, url: `${opts.url}#step-${i + 1}` })),
  };
}

export function definedTermSet(origin: string, terms: { term: string; slug: string; short: string }[]): Thing {
  return {
    '@type': 'DefinedTermSet',
    '@id': `${origin}/glossary/#set`,
    name: 'Supported housing glossary',
    hasDefinedTerm: terms.map((t) => ({
      '@type': 'DefinedTerm',
      '@id': `${origin}/glossary/${t.slug}/#term`,
      name: t.term,
      description: t.short,
      url: `${origin}/glossary/${t.slug}/`,
      inDefinedTermSet: `${origin}/glossary/#set`,
    })),
  };
}

export function graph(...things: Thing[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': things }).replace(/</g, '\\u003c');
}
