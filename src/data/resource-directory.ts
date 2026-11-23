import { PAGES } from './page-registry'
import industryArticles from './industry-article-index.json'
import type { ResourceTopic } from './resources'

export type ResourceReference = {
  path: string
  title: string
  summary: string
  topic: ResourceTopic
  kind: 'Guide' | 'Tool'
}

const TOPICS: Record<string, ResourceTopic> = {
  space: 'Space',
  nuclear: 'Nuclear',
  aerospace: 'Aerospace',
}

export const RESOURCE_REFERENCES: ResourceReference[] = [
  { path: '/data-centre-compliance-india', title: 'Data centre approvals in India: the full project map', summary: 'Connect land, power, environment, water, fire, electrical safety and data law approvals for a data centre in India.', topic: 'Data Centers', kind: 'Guide' },
  { path: '/data-center-compliance', title: 'Data-center compliance: the full project map', summary: 'Connect siting, power, air, water and operating obligations in one U.S. compliance plan.', topic: 'Data Centers', kind: 'Guide' },
  { path: '/oil-gas-compliance', title: 'Oil-and-gas compliance: from permits to field records', summary: 'Understand U.S. onshore permitting, methane requirements and the evidence behind operating obligations.', topic: 'Oil & Gas', kind: 'Guide' },
  ...industryArticles.map(article => ({ path: `/blog/${article.slug}`, title: article.title, summary: article.summary, topic: article.topic as ResourceTopic, kind: 'Guide' as const })),
  ...PAGES.filter((page) => page.live)
    .sort((a, b) => (a.weight ?? 9) - (b.weight ?? 9))
    .map((page) => ({
      path: `/${page.slug}`,
      title: page.shortTitle ?? page.title,
      summary: page.description,
      topic: TOPICS[page.pillar],
      kind: 'Guide' as const,
    })),
  {
    path: '/calculators/faa-part-450-timeline',
    title: 'FAA Part 450 timeline estimator',
    summary: 'Estimate the path from kickoff to a launch or reentry license using vehicle, design, and environmental review inputs.',
    topic: 'Space',
    kind: 'Tool',
  },
  {
    path: '/calculators/nrc-license-timeline',
    title: 'NRC license timeline estimator',
    summary: 'Explore reactor licensing timelines under Parts 50, 52, and 53, including design novelty and pre-application work.',
    topic: 'Nuclear',
    kind: 'Tool',
  },
  {
    path: '/calculators/fcc-deorbit-feasibility',
    title: 'FCC deorbit feasibility checker',
    summary: 'Explore post-mission disposal using altitude, ballistic coefficient, and disposal strategy.',
    topic: 'Space',
    kind: 'Tool',
  },
  {
    path: '/probe',
    title: 'Probe: search NRC documents',
    summary: 'Search the NRC ADAMS document corpus with Invariant’s nuclear-domain retrieval model.',
    topic: 'Nuclear',
    kind: 'Tool',
  },
  {
    path: '/glossary',
    title: 'The compliance glossary',
    summary: 'The terms, acronyms, and regulatory concepts that come up throughout a mission.',
    topic: 'Cross-industry',
    kind: 'Guide',
  },
  {
    path: '/regulators',
    title: 'Regulatory agencies',
    summary: 'A reference to the regulators involved in space, aerospace, and nuclear programs.',
    topic: 'Cross-industry',
    kind: 'Guide',
  },
]
