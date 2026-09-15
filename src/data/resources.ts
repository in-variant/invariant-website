import { PAGES } from './page-registry'
import industryArticles from './industry-article-index.json'

export type ResourceTopic = 'Space' | 'Nuclear' | 'Aerospace' | 'Cross-industry' | 'Data Centers' | 'Oil & Gas'

export type ResourceArticle = {
  slug: string
  image: string
  date: string
  dateTime: string
  topic: ResourceTopic
  title: string
  summary: string
}

// The published article titles, dates and assets are shared by both indexes.
export const RESOURCE_ARTICLES: ResourceArticle[] = [
  ...industryArticles as ResourceArticle[],
  {
    slug: 'space-compliance-tam',
    image: '/blog/space-tam.png',
    date: 'June 3, 2026',
    dateTime: '2026-06-03',
    topic: 'Space',
    title: 'The $1.8 Trillion Space Industry Has a $52 Billion Toll Gate',
    summary: 'A breakdown of the space compliance market, from launch licensing to satellite operations, and the cost of getting to orbit.',
  },
  {
    slug: 'nuclear-compliance-tam',
    image: '/blog/nuclear-tam.png',
    date: 'June 2, 2026',
    dateTime: '2026-06-02',
    topic: 'Nuclear',
    title: 'The $35 Billion Problem Nobody Is Talking About in Nuclear',
    summary: 'The market for nuclear compliance work, broken down by regulator, design phase, and the next generation of reactors.',
  },
  {
    slug: 'fermibench-sota',
    image: '/blog/fermibench.jpg',
    date: 'April 1, 2026',
    dateTime: '2026-04-01',
    topic: 'Nuclear',
    title: 'Invariant Sets State-of-the-Art on FermiBench',
    summary: 'How our domain-adapted retrieval model, Helion-512, reaches 0.97 nDCG@10 on the nuclear regulatory benchmark.',
  },
  {
    slug: 'seismic-design-shift',
    image: '/blog/seismic.jpg',
    date: 'March 29, 2026',
    dateTime: '2026-03-29',
    topic: 'Nuclear',
    title: 'SSE/OBE → GMRS/SDC: The Seismic Design Shift to Part 53',
    summary: 'A regulation-to-regulation comparison of the shift from the deterministic two-tier framework to risk-tiered ground motions.',
  },
  {
    slug: 'part100-vs-part53-siting',
    image: '/blog/siting.jpg',
    date: 'March 27, 2026',
    dateTime: '2026-03-27',
    topic: 'Nuclear',
    title: '10 CFR Part 100 vs. Part 53 Subpart D: A Siting Comparison',
    summary: 'A line-by-line comparison of exclusion areas, seismic methodology, and the integration of siting and design.',
  },
]

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
