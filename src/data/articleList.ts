import { articles, collections } from './.generated-blog-search/article-list.json'
import type { ResourceArticle } from './resources'

export type ArticleListEntry = Omit<ResourceArticle, 'dataset' | 'additionalDatasets'> & {
  datasetNames: string
}

export const ARTICLE_LIST = articles as ArticleListEntry[]
export const ARTICLE_COLLECTIONS = collections
