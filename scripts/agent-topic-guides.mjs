import { guideGroupId } from '../src/data/collectionGuideLinks.mjs'

export function agentTopicGuides(collections) {
  return collections.flatMap(collection => {
    const collectionPath = `/blog/${collection.slug}`
    if (collection.slug !== 'physical-world-data-by-use-case') {
      return [{
        path: `/llms/topics/${collection.slug}.md`,
        heading: collection.heading,
        description: collection.description,
        collectionPath,
        guides: collection.guides,
      }]
    }

    const groups = new Map()
    for (const guide of collection.guides) {
      const group = guide.group ?? collection.guidesTitle
      if (!groups.has(group)) groups.set(group, [])
      groups.get(group).push(guide)
    }
    return [...groups].map(([heading, guides]) => {
      const groupId = guideGroupId(heading)
      return {
        path: `/llms/topics/${groupId}.md`,
        heading,
        collectionPath: `${collectionPath}#${groupId}`,
        guides,
      }
    })
  })
}
