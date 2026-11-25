import { guideGroupId } from './collectionGuideLinks.mjs'

type CollectionGuide = {
  slug: string
  label: string
  detail: string
  group?: string
}

export const DATA_USE_CASES_SLUG = 'physical-world-data-by-use-case'
export const DATA_USE_CASES_PATH = `/blog/${DATA_USE_CASES_SLUG}`

export function groupCollectionGuides(collectionGuides: CollectionGuide[]) {
  const guidesByGroup = new Map<string, CollectionGuide[]>()
  for (const guide of collectionGuides) {
    const heading = guide.group ?? ''
    const guides = guidesByGroup.get(heading) ?? []
    guides.push(guide)
    guidesByGroup.set(heading, guides)
  }
  return [...guidesByGroup].map(([heading, guides]) => ({
    heading,
    guides,
    id: guideGroupId(heading),
  }))
}
