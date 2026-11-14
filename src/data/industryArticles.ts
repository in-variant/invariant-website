import dataCenters from './industry-articles/data-centers.json'
import oilGas from './industry-articles/oil-gas.json'
import dataCenterOperations from './industry-articles/data-center-operations.json'
import dataCenterFireSafety from './industry-articles/data-center-fire-safety.json'
import poweredLandSites from './industry-articles/powered-land-sites.json'
import siteSelectionGuides from './industry-articles/site-selection-guides.json'
import siteFinder from './industry-articles/data-center-site-finder.json'

export type IndustryTopic = 'Data Centers' | 'Oil & Gas'
export type ArticleBlock = (
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'table'; columns: string[]; rows: string[][] }
  | { type: 'links'; label: string; items: { label: string; slug: string }[] }
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
  /** 'site-listing' pages carry the booking banner at the top and a listing CTA at the foot; 'site-guide' pages carry the booking banner at the foot. */
  kind?: 'site-listing' | 'site-guide'
  /** Region shown in the byline and used as schema spatialCoverage, e.g. "Arizona, United States". */
  region?: string
}

export const INDUSTRY_ARTICLES = [...siteFinder, ...poweredLandSites, ...siteSelectionGuides, ...dataCenters, ...dataCenterOperations, ...dataCenterFireSafety, ...oilGas] as IndustryArticle[]
export const industryPath = (topic: IndustryTopic) => topic === 'Data Centers' ? '/data-center-compliance' : '/oil-gas-compliance'
export const articleImage = (slug: string) => `/blog/industry/${slug}.webp`

export const BOOKING_URL = 'https://calendar.app.google/ACLzeFhzNF9szwry8'
export const SITES_PHONE = '+16282208972'
export const SITES_PHONE_DISPLAY = '(628) 220-8972'
/** Contact for site selection inbound (Pranav, 2026-11-14): site pages route here, not founders@. */
export { SITES_EMAIL } from './siteContact'
