// Prefer a workflow collection when the broad data directory also includes the guide.
const collectionPriority = [
  'property-underwriting',
  'commercial-real-estate-lending',
  'physical-world-data-api-evaluation',
  'site-selection-due-diligence',
  'physical-world-data-by-use-case',
]

export function guideGroupId(heading) {
  return heading.toLowerCase().match(/[a-z0-9]+/g)?.join('-') ?? 'other-guides'
}

export function buildArticleCollectionLinks(collections, articles) {
  const eligible = new Set(articles.filter(article => article.topic === 'Data & APIs' && !article.kind).map(article => article.slug))
  const bySlug = new Map(collections.map(collection => [collection.slug, collection]))
  const links = new Map()

  for (const collectionSlug of collectionPriority) {
    const collection = bySlug.get(collectionSlug)
    if (!collection) continue

    for (const { slug, group } of collection.guides) {
      if (!eligible.has(slug) || links.has(slug)) continue

      links.set(slug, {
        label: group ?? collection.navLabel,
        path: `/blog/${collection.slug}${group ? `#${guideGroupId(group)}` : ''}`,
      })
    }
  }
  return links
}
