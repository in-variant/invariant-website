import type { ResourceDataset } from './resources'
import workflowGroups from './research-dataset-workflows.json'

const researchWorkflows = new Map(workflowGroups.flatMap(({ articles, label, url }) =>
  articles.map(slug => [slug, { label, url }] as const),
))

export function publishedDatasets<Dataset extends Pick<ResourceDataset, 'anchor' | 'datePublished'>, Article extends { slug: string; dateTime: string }>(
  article: Article & { dataset?: Dataset; additionalDatasets?: Dataset[] },
) {
  const { dataset, additionalDatasets = [] } = article
  const datasets = dataset ? [dataset, ...additionalDatasets] : additionalDatasets
  return datasets.map(dataset => ({
    ...article,
    dataset,
    anchor: dataset.anchor ?? 'dataset',
    id: dataset.anchor ? `${article.slug}-${dataset.anchor}` : article.slug,
    notesPath: `/blog/${article.slug}#${dataset.anchor ?? 'dataset'}`,
    datePublished: dataset.datePublished ?? article.dateTime,
    workflow: researchWorkflows.get(article.slug),
  }))
}
