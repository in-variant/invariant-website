import { articleSearchWords } from '../src/data/articleSearchWords.mjs'

export function blockSearchText(block) {
  switch (block.type) {
    case 'paragraph': return [block.text]
    case 'list': return block.items
    case 'table': return [...block.columns, ...block.rows.flat()]
    case 'download': return [block.label]
    case 'links': return block.items.map(item => item.label)
    default: return []
  }
}

export function datasetSearchDocuments(article) {
  const datasets = [article.dataset, ...(article.additionalDatasets ?? [])].filter(Boolean)
  if (!datasets.length) return []

  const sectionsByAnchor = new Map()
  const ownersBySource = new Map()
  for (const dataset of datasets) {
    const anchor = dataset.anchor ?? 'dataset'
    sectionsByAnchor.set(anchor, [])
    for (const source of dataset.sourceIds) {
      ownersBySource.set(source, ownersBySource.has(source) ? null : anchor)
    }
  }

  for (const section of article.sections) {
    const downloads = new Set(section.blocks.flatMap(block =>
      block.type === 'download' && block.datasetAnchor !== null
        ? [block.datasetAnchor ?? 'dataset']
        : [],
    ))
    const owners = downloads.size ? downloads : new Set(section.blocks.flatMap(block => [
      ...(block.sourceIds ?? []), ...(block.rowSourceIds?.flat() ?? []),
    ]).map(source => ownersBySource.get(source)).filter(Boolean))
    // A shared section cannot establish which download contains a cited record.
    if (owners.size === 1) sectionsByAnchor.get([...owners][0])?.push(section)
  }

  return datasets.map(({ anchor }) => {
    const sections = sectionsByAnchor.get(anchor ?? 'dataset')
    const body = sections.flatMap(section => section.blocks.flatMap(blockSearchText)).join(' ')
    return {
      slug: anchor ? `${article.slug}-${anchor}` : article.slug,
      headings: sections.map(section => section.heading).join('\n'),
      bodyTerms: new Set(articleSearchWords(body)),
    }
  })
}
