import dataCenters from './industry-articles/data-centers.json'
import oilGas from './industry-articles/oil-gas.json'
import dataCenterOperations from './industry-articles/data-center-operations.json'
import dataCenterFireSafety from './industry-articles/data-center-fire-safety.json'

export type IndustryTopic = 'Data Centers' | 'Oil & Gas'
export type ArticleBlock = (
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'table'; columns: string[]; rows: string[][] }
) & { sourceIds?: string[] }
export type IndustryArticle = {
  slug: string
  topic: IndustryTopic
  title: string
  description: string
  date: string
  readMinutes: number
  intro: string
  takeaways: string[]
  sections: { id: string; heading: string; blocks: ArticleBlock[] }[]
  faqs: { question: string; answer: string; sourceIds?: string[] }[]
  sources: { id: string; title: string; url: string; publisher: string }[]
  relatedSlugs: string[]
}

export const INDUSTRY_ARTICLES = [...dataCenters, ...dataCenterOperations, ...dataCenterFireSafety, ...oilGas] as IndustryArticle[]
export const industryPath = (topic: IndustryTopic) => topic === 'Data Centers' ? '/data-center-compliance' : '/oil-gas-compliance'
export const articleImage = (slug: string) => `/blog/industry/${slug}.webp`
