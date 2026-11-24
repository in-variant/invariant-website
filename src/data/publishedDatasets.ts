import type { ResourceArticle } from './resources'

export function publishedDatasets(article: ResourceArticle) {
  const { dataset, additionalDatasets = [] } = article
  const datasets = dataset ? [dataset, ...additionalDatasets] : additionalDatasets
  return datasets.map(dataset => ({
    ...article,
    dataset,
    anchor: dataset.anchor ?? 'dataset',
    id: dataset.anchor ? `${article.slug}-${dataset.anchor}` : article.slug,
    notesPath: `/blog/${article.slug}#${dataset.anchor ?? 'dataset'}`,
    datePublished: dataset.datePublished ?? article.dateTime,
  }))
}
