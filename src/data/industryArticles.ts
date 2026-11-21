import dataCenters from './industry-articles/data-centers.json'
import oilGas from './industry-articles/oil-gas.json'
import dataCenterOperations from './industry-articles/data-center-operations.json'
import dataCenterFireSafety from './industry-articles/data-center-fire-safety.json'
import poweredLandSites from './industry-articles/powered-land-sites.json'
import siteSelectionGuides from './industry-articles/site-selection-guides.json'
import siteFinder from './industry-articles/data-center-site-finder.json'
import siteDueDiligence from './industry-articles/site-due-diligence.json'
import computeCapacity from './industry-articles/ai-compute-capacity.json'
import indiaDataCentres from './industry-articles/india-data-centres.json'

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
  /** 'site-listing' pages carry the booking banner at the top and a listing CTA at the foot; 'site-guide' pages carry the booking banner at the foot; 'study-guide' pages (site due diligence) carry the power study request banner; 'compute-guide' pages (neoclouds and AI labs) carry the GPU capacity banner; 'india-guide' pages (data centres in India) carry the India site and approvals banner. */
  kind?: 'site-listing' | 'site-guide' | 'study-guide' | 'compute-guide' | 'india-guide'
  /** Emits schema.org Service for pages that describe a service Invariant sells. */
  service?: { name: string; serviceType: string; description: string }
  /** Emits schema.org HowTo for pages that walk through a process. */
  howTo?: { name: string; steps: { name: string; text: string }[] }
  /** Region shown in the byline and used as schema spatialCoverage, e.g. "Arizona, United States". */
  region?: string
}

export const INDUSTRY_ARTICLES = [...computeCapacity, ...siteDueDiligence, ...siteFinder, ...poweredLandSites, ...siteSelectionGuides, ...dataCenters, ...dataCenterOperations, ...dataCenterFireSafety, ...indiaDataCentres, ...oilGas] as IndustryArticle[]
export const industryPath = (topic: IndustryTopic) => topic === 'Data Centers' ? '/data-center-compliance' : '/oil-gas-compliance'

/** India cluster: every page whose region ends in "India" belongs to it (pillar, cities, states, guides). */
export const INDIA_PILLAR = 'data-centres-in-india'
export const INDIA_HUB = '/data-centre-compliance-india'
export const isIndiaRegion = (region?: string) => /(^|, )India$/.test(region ?? '')
export const articleImage = (slug: string) => `/blog/industry/${slug}.webp`

/** Pillar for the site due diligence cluster (feasibility screen, then utility-grade power study). */
export const DILIGENCE_PILLAR = 'data-center-site-due-diligence'
/** Pillar for the neocloud and AI lab cluster (GPU capacity, colocation, power for clusters). */
export const COMPUTE_PILLAR = 'ai-compute-capacity-for-neoclouds'
export const isSiteKind = (kind?: string) => kind === 'site-listing' || kind === 'site-guide' || kind === 'study-guide' || kind === 'compute-guide' || kind === 'india-guide'

export const BOOKING_URL = 'https://cal.com/pranav-goswami/website-30min'
export const SITES_PHONE = '+16282208972'
export const SITES_PHONE_DISPLAY = '(628) 220-8972'
/** Contact for site selection inbound (Pranav, 2026-11-14): site pages route here, not founders@. */
export { SITES_EMAIL } from './siteContact'
