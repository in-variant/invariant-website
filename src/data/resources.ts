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

type CatalogDataset = Omit<ResourceDataset, 'sources'>
type CatalogArticle = Pick<ResourceArticle, 'slug' | 'title' | 'topic' | 'region' | 'dateTime' | 'image'> & {
  srcSet?: string
  dataset?: CatalogDataset
  additionalDatasets?: CatalogDataset[]
}

export const RESEARCH_DATASETS = (catalogArticles as CatalogArticle[]).flatMap(article => publishedDatasets(article))
