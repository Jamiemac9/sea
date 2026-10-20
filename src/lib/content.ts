import { getCollection, type CollectionEntry } from 'astro:content';

export async function sortedGuides() {
  return (await getCollection('guides')).sort((a, b) => a.data.order - b.data.order);
}

export async function sortedUpdates() {
  return (await getCollection('updates')).sort((a, b) => b.data.published.getTime() - a.data.published.getTime());
}

/** Turn guide MDX into plain markdown for llms-full.txt and search: drop components, keep text. */
export function mdxToText(body: string): string {
  return body
    .replace(/<InArticleAd\s*\/>/g, '')
    .replace(/<Callout[^>]*title="([^"]*)"[^>]*>/g, '\n> $1: ')
    .replace(/<Callout[^>]*>/g, '\n> ')
    .replace(/<\/Callout>/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function headingsOf(body: string): string[] {
  return Array.from(body.matchAll(/^#{2,3}\s+(.+)$/gm)).map((m) => m[1].trim());
}

export type Guide = CollectionEntry<'guides'>;
export type Update = CollectionEntry<'updates'>;
