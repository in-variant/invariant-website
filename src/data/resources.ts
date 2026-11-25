import industryArticles from './industry-article-index.json'
import legacyArticles from './legacy-blog-articles.json'
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

// The published article titles, dates and assets are shared by both indexes.
export const RESOURCE_ARTICLES: ResourceArticle[] = [
  ...industryArticles as ResourceArticle[],
  ...legacyArticles as ResourceArticle[],
]

export const RESEARCH_DATASETS = RESOURCE_ARTICLES.flatMap(publishedDatasets)
