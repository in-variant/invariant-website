import catalogArticles from './.generated-blog-search/dataset-articles.json'
import { publishedDatasets } from './publishedDatasets'
import type { ArticleDataset, ArticleSource, DatasetDownload } from './industryArticles'

export type ResourceTopic = 'Space' | 'Nuclear' | 'Aerospace' | 'Cross-industry' | 'Data Centers' | 'Oil & Gas' | 'Data & APIs'

export type ResourceDataset = Omit<ArticleDataset, 'sourceIds'> & {
  anchor?: string
  datePublished?: string
  sources: string[]
  sourceDetails: Omit<ArticleSource, 'id' | 'linkLabel'>[]
  downloads: DatasetDownload[]
}

export type ResourceArticle = {
  slug: string
  image: string
  date: string
  dateTime: string
  updatedDate?: string
  region?: string
  topic: ResourceTopic
  title: string
  summary: string
  dataset?: ResourceDataset
  additionalDatasets?: ResourceDataset[]
}

export type CatalogDataset = Omit<ResourceDataset, 'sources' | 'sourceDetails'> & {
  sourceIndex: number
  sourceCount: number
  sourceLicenses: { title: string; license: string }[]
}
type CatalogArticle = Pick<ResourceArticle, 'slug' | 'title' | 'topic' | 'region' | 'dateTime' | 'image'> & {
  srcSet?: string
  dataset?: CatalogDataset
  additionalDatasets?: CatalogDataset[]
}

export function getResearchDatasets() {
  return (catalogArticles as CatalogArticle[]).flatMap(article => publishedDatasets(article))
}

export async function loadDatasetSources(index: number): Promise<ResourceDataset['sourceDetails']> {
  const { default: records } = await import('./.generated-blog-search/dataset-sources.json')
  return records[index]
}
