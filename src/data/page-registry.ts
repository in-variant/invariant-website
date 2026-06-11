// Canonical registry of every guide / pillar / cluster page on the site.
// RelatedGuides + sitemap automation + internal-linking work all read from here.
// Flip `live: true` as each page ships.

export type Pillar = 'space' | 'nuclear' | 'aerospace'
export type PageType = 'pillar' | 'cluster' | 'guide' | 'glossary'

export type PageRef = {
  slug: string
  title: string
  shortTitle?: string
  description: string
  pillar: Pillar
  type: PageType
  live: boolean
  /** Inverse priority — lower number = more important / more central. Used to rank related-guides. */
  weight?: number
}

export const PAGES: PageRef[] = [
  // ── Pillars ──────────────────────────────────────────────────────────────
  {
    slug: 'space-compliance',
    title: 'Space compliance: a complete guide to global regulation, standards, and licensing',
    shortTitle: 'Space compliance',
    description:
      'A complete reference to space compliance: FAA Part 450, FCC Part 25, NOAA, IN-SPACe, ECSS, GEVS, ITU, qualification testing, and licensing timelines.',
    pillar: 'space',
    type: 'pillar',
    live: true,
    weight: 1,
  },
  {
    slug: 'nuclear-compliance',
    title: 'Nuclear compliance: the licensing pathways, what the regulator reads, and how AI changes the work',
    shortTitle: 'Nuclear compliance',
    description:
      'A complete guide to nuclear compliance for advanced reactor, SMR, and microreactor developers. Regulators, 10 CFR Parts 50/52/53, PSAR/FSAR drafting, and where AI agents help.',
    pillar: 'nuclear',
    type: 'pillar',
    live: true,
    weight: 1,
  },

  // ── Clusters: nuclear ────────────────────────────────────────────────────
  {
    slug: 'part-50-vs-52-vs-53',
    title: 'Part 50 vs Part 52 vs Part 53: the three NRC reactor licensing pathways, explained',
    shortTitle: 'Part 50 vs Part 52 vs Part 53',
    description:
      'A side-by-side comparison of 10 CFR Part 50, Part 52, and Part 53 — history, structure, timelines, and which advanced reactor developers use each in 2026.',
    pillar: 'nuclear',
    type: 'cluster',
    live: true,
    weight: 2,
  },
  {
    slug: 'how-to-write-a-psar',
    title: 'How to write a Preliminary Safety Analysis Report (PSAR) for the NRC',
    shortTitle: 'How to write a PSAR',
    description:
      'A chapter-by-chapter drafting guide to the Preliminary Safety Analysis Report required for an NRC Construction Permit or Part 53 application.',
    pillar: 'nuclear',
    type: 'cluster',
    live: true,
    weight: 2,
  },
  {
    slug: 'how-long-does-nrc-license-take',
    title: 'How long does an NRC license application take?',
    shortTitle: 'NRC license timeline',
    description:
      'Realistic timelines for NRC license applications under Parts 50, 52, and 53, based on recent advanced-reactor dockets.',
    pillar: 'nuclear',
    type: 'cluster',
    live: false,
    weight: 3,
  },
  {
    slug: 'advanced-reactor-licensing-eu',
    title: 'Advanced reactor licensing in the EU: ASNR, ONR GDA, and the SMR pre-licensing maze',
    shortTitle: 'Advanced reactor licensing in the EU',
    description:
      "A regional explainer comparing the UK GDA under ONR, France's ASNR review, and the patchwork of EU member-state regimes.",
    pillar: 'nuclear',
    type: 'cluster',
    live: false,
    weight: 3,
  },
  {
    slug: 'nrc-pre-application-engagement-guide',
    title: 'NRC pre-application engagement: the months that decide your application',
    shortTitle: 'NRC pre-application engagement',
    description:
      'How pre-application engagement with the NRC actually works, and how it shapes the review timeline of a full application.',
    pillar: 'nuclear',
    type: 'cluster',
    live: true,
    weight: 2,
  },
  {
    slug: 'nuclear-compliance-india',
    title: 'Nuclear compliance in India: AERB, the Atomic Energy Act, and private-sector access',
    shortTitle: 'Nuclear compliance in India',
    description:
      "India's nuclear regulatory architecture: AERB, DAE, and what is and is not open to private-sector participation in 2026.",
    pillar: 'nuclear',
    type: 'cluster',
    live: true,
    weight: 2,
  },

  // ── Clusters: space ─────────────────────────────────────────────────────
  {
    slug: 'faa-part-450-license-timeline',
    title: 'How long does an FAA Part 450 launch license take?',
    shortTitle: 'FAA Part 450 timeline',
    description:
      'A timeline-focused explainer that walks through the FAA Part 450 launch and reentry license process and the realistic wall-clock duration.',
    pillar: 'space',
    type: 'cluster',
    live: true,
    weight: 2,
  },
  {
    slug: 'in-space-authorization-india',
    title: 'IN-SPACe authorisation: the complete guide for non-government space entities in India',
    shortTitle: 'IN-SPACe authorisation',
    description:
      "An end-to-end walkthrough of the IN-SPACe authorisation regime under India's NGP 2024.",
    pillar: 'space',
    type: 'cluster',
    live: false,
    weight: 2,
  },
  {
    slug: 'itar-vs-ear-for-space-companies',
    title: 'ITAR vs EAR for space companies: how to classify your hardware',
    shortTitle: 'ITAR vs EAR for space',
    description:
      'How USML Category XV (ITAR) and ECCN 9x515 (EAR) split jurisdiction over space hardware after the 2014 reform.',
    pillar: 'space',
    type: 'cluster',
    live: true,
    weight: 2,
  },
  {
    slug: 'space-compliance-india',
    title: 'Space compliance in India: authorisations, licences, and foreign investment rules',
    shortTitle: 'Space compliance in India',
    description:
      'Everything a commercial space operator needs to clear before flying from or operating in India.',
    pillar: 'space',
    type: 'cluster',
    live: true,
    weight: 2,
  },
  {
    slug: 'space-compliance-eu',
    title: 'Space compliance in the EU: national licensing, ESA standards, and the cross-border stack',
    shortTitle: 'Space compliance in the EU',
    description:
      'Why there is no single EU space regulator and how operators navigate the member-state patchwork.',
    pillar: 'space',
    type: 'cluster',
    live: false,
    weight: 3,
  },
  {
    slug: 'fcc-5-year-deorbit-rule',
    title: 'The FCC 5-year deorbit rule explained',
    shortTitle: 'FCC 5-year deorbit rule',
    description:
      'FCC 22-74 compressed post-mission disposal for LEO satellites from 25 years to 5. Who is captured, what the order requires, and the design implications.',
    pillar: 'space',
    type: 'cluster',
    live: true,
    weight: 2,
  },
  {
    slug: 'noaa-remote-sensing-license-tiers',
    title: 'NOAA remote-sensing license tiers, explained',
    shortTitle: 'NOAA remote-sensing tiers',
    description:
      "NOAA's three-tier commercial remote-sensing licensing framework and which tier your sensor falls into.",
    pillar: 'space',
    type: 'cluster',
    live: true,
    weight: 2,
  },
  {
    slug: 'how-to-draft-itu-coordination-filing',
    title: 'How to draft an ITU frequency-coordination filing',
    shortTitle: 'ITU coordination filing',
    description:
      'The ITU filing flow, the API and CR/C documents, and the interference-analysis content national administrations want.',
    pillar: 'space',
    type: 'cluster',
    live: false,
    weight: 3,
  },
  {
    slug: 'how-to-write-faa-part-450-means-of-compliance',
    title: 'How to write a Means of Compliance for FAA Part 450',
    shortTitle: 'Part 450 Means of Compliance',
    description:
      'The Means of Compliance is the single most important artefact in a Part 450 application. Here is how to write one.',
    pillar: 'space',
    type: 'cluster',
    live: true,
    weight: 2,
  },
]

export const LIVE_PAGES = PAGES.filter((p) => p.live)

export function getPage(slug: string): PageRef | undefined {
  return PAGES.find((p) => p.slug === slug)
}

/** Rank candidates for "Related guides" on a given page. Same pillar > different pillar, then by weight. */
export function relatedPages(currentSlug: string, currentPillar: Pillar, limit = 4): PageRef[] {
  return LIVE_PAGES.filter((p) => p.slug !== currentSlug)
    .sort((a, b) => {
      const aSame = a.pillar === currentPillar ? 0 : 1
      const bSame = b.pillar === currentPillar ? 0 : 1
      if (aSame !== bSame) return aSame - bSame
      return (a.weight ?? 99) - (b.weight ?? 99)
    })
    .slice(0, limit)
}
