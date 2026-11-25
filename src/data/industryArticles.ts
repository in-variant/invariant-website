import type { ResourceArticle } from './resources'

export type IndustryTopic = 'Data Centers' | 'Oil & Gas' | 'Data & APIs'
export type ArticleDataset = {
  name: string
  description: string
  sourceIds: string[]
  spatialCoverage?: string
  temporalCoverage?: string
  sourceReuse?: { note: string; policyLabel: string; policyUrl: string }
}
export type DatasetDownload = { label: string; path: string; format: 'CSV' | 'GeoJSON' | 'JSON' }
export type RelatedArticle = Pick<ResourceArticle, 'slug' | 'title' | 'topic' | 'image'> & { srcSet?: string }

export type ArticleBlock = (
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'shell'; command: string }
  | { type: 'table'; columns: string[]; rows: string[][]; worksheet?: boolean; stackOnMobile?: boolean; rowSourceIds?: string[][] }
  | ({ type: 'download'; datasetAnchor?: string | null } & DatasetDownload)
  | ({ type: 'download'; datasetAnchor: null; format: 'Python' } & Omit<DatasetDownload, 'format'>)
  | { type: 'links'; label?: string; items: ({ label: string } & ({ slug: string; path?: never } | { path: string; slug?: never }))[] }
) & { sourceIds?: string[] }
export type IndustryArticle = {
  slug: string
  topic: IndustryTopic
  title: string
  description: string
  date: string
  updatedDate?: string
  coverCaption?: string
  coverAlt?: string
  coverImage?: { width: number; height: number; srcSet: string }
  published: ResourceArticle
  readMinutes: number
  intro: string
  takeaways: string[]
  sections: { id: string; heading: string; blocks: ArticleBlock[] }[]
  faqs: { question: string; answer: string; sourceIds?: string[] }[]
  sources: { id: string; title: string; url: string; publisher: string; linkLabel?: string }[]
  relatedReading: RelatedArticle[]
  /** 'site-listing' pages carry the booking banner at the top and a listing CTA at the foot; 'site-guide' pages carry the booking banner at the foot; 'study-guide' pages (site due diligence) carry the power study request banner; 'compute-guide' pages (neoclouds and AI labs) carry the GPU capacity banner. */
  kind?: 'site-listing' | 'site-guide' | 'study-guide' | 'compute-guide' | 'india-guide'
  /** Emits schema.org Service for pages that describe a service Invariant sells. */
  service?: { name: string; serviceType: string; description: string }
  /** Emits schema.org HowTo for pages that walk through a process. */
  howTo?: { name: string; steps: { name: string; text: string }[] }
  /** Region shown in the byline and used as schema spatialCoverage, e.g. "Arizona, United States". */
  region?: string
}

const articleModules = import.meta.glob<IndustryArticle>('/src/data/.generated-articles/*.json', { import: 'default' })

export const articleModulePath = (slug: string) => `/src/data/.generated-articles/${slug}.json`
export const articleLoader = (slug: string) => articleModules[articleModulePath(slug)]

export const INDUSTRY_HUBS = {
  'Data Centers': { name: 'Data Centers compliance', path: '/data-center-compliance' },
  'Oil & Gas': { name: 'Oil & Gas compliance', path: '/oil-gas-compliance' },
  'Data & APIs': { name: 'Blog', path: '/blog' },
} satisfies Record<IndustryTopic, { name: string; path: string }>

/** Pillar for the site due diligence cluster (feasibility screen, then utility-grade power study). */
export const DILIGENCE_PILLAR = 'data-center-site-due-diligence'
/** Pillar for the neocloud and AI lab cluster (GPU capacity, colocation, power for clusters). */
export const COMPUTE_PILLAR = 'ai-compute-capacity-for-neoclouds'
export const isSiteKind = (kind?: string) => kind === 'site-listing' || kind === 'site-guide' || kind === 'study-guide' || kind === 'compute-guide'

export const INDIA_PILLAR = 'data-centres-in-india'
export const INDIA_HUB = '/data-centre-compliance-india'

export const BOOKING_URL = 'https://cal.com/pranav-goswami/website-30min'
export const SITES_PHONE = '+16282208972'
export const SITES_PHONE_DISPLAY = '(628) 220-8972'
/** Contact for site selection inbound (Pranav, 2026-11-14): site pages route here, not founders@. */
export { SITES_EMAIL } from './siteContact'
