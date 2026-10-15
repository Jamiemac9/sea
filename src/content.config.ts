import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

export const categories = {
  foundations: { label: 'Foundations', blurb: 'What exempt and specified accommodation are, and how the Housing Benefit rules fit together.' },
  types: { label: 'Types of accommodation', blurb: 'Transitional, emergency, care leaver, refuge, prison leaver and supported living models.' },
  money: { label: 'Rent and Housing Benefit', blurb: 'Core rent, service charges, rent officer referrals and the evidence councils ask for.' },
  regulation: { label: 'Regulation', blurb: "Licensing, national standards, Ofsted, the Renters' Rights Act and what is still to come." },
  practice: { label: 'Best practice', blurb: 'Support planning, safeguarding, property standards and getting audit ready.' },
  grey: { label: 'Grey areas', blurb: 'The niche questions where the rules are unclear and decisions turn on the facts.' },
} as const;

export const audiences = {
  'support-providers': 'Support providers',
  'housing-providers': 'Housing providers',
  'managing-agents': 'Managing agents',
  proptech: 'Proptech',
} as const;

const source = z.object({
  title: z.string(),
  url: z.url(),
  publisher: z.string().optional(),
  date: z.coerce.string().optional(),
});

const guides = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().max(50).optional(),
    description: z.string().min(70).max(165),
    category: z.enum(Object.keys(categories) as [keyof typeof categories, ...(keyof typeof categories)[]]),
    audiences: z.array(z.enum(Object.keys(audiences) as [keyof typeof audiences, ...(keyof typeof audiences)[]])),
    published: z.coerce.date(),
    updated: z.coerce.date(),
    order: z.number().default(50),
    featured: z.boolean().default(false),
    quickAnswer: z.string().min(80).max(420),
    // The short version. Capped at five so it stays scannable.
    keyPoints: z.array(z.string()).min(3).max(5),
    nextStep: z.object({ text: z.string(), label: z.string(), href: z.string() }),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    howTo: z
      .object({ name: z.string(), totalTime: z.string().optional(), steps: z.array(z.object({ name: z.string(), text: z.string() })) })
      .optional(),
    sources: z.array(source).default([]),
    related: z.array(z.string()).default([]),
    auditCta: z.object({ title: z.string(), text: z.string(), campaign: z.string() }).optional(),
  }),
});

export const collections = { guides };
