export function guideGroupId(heading: string): string

export function buildArticleCollectionLinks(
  collections: { slug: string; navLabel: string; guides: { slug: string; group?: string }[] }[],
  articles: { slug: string; topic: string; kind?: string }[],
): Map<string, { label: string; path: string }>
