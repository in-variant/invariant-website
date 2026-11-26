export type IndustryHub = {
  slug: string
  topic: 'Data Centers' | 'Oil & Gas'
  title: string
  description: string
  heading: string
  intro: string
  scope: string
  image: string
  updatedDate: string
  region?: 'India'
  register?: { label: string; path: string }
  gates: { title: string; question: string; evidence: string; authority: string; source: string; guide?: string }[]
}

type HubArticle = { topic: string; region?: string }

export function hubIncludes(hub: IndustryHub, article: HubArticle): boolean
export function hubUpdatedDate(hub: IndustryHub, articles: (HubArticle & { dateTime: string; updatedDate?: string })[]): string

export const INDUSTRY_HUBS: IndustryHub[]
