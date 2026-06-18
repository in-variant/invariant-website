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
  /** Inverse priority, lower number = more important / more central. Used to rank related-guides. */
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
      'A side-by-side comparison of 10 CFR Part 50, Part 52, and Part 53, history, structure, timelines, and which advanced reactor developers use each in 2026.',
    pillar: 'nuclear',
    type: 'cluster',
    live: true,
    weight: 2,
  },
  {
    slug: 'nrc-part-73-security',
    title: '10 CFR Part 73 physical security and the Design Basis Threat',
    shortTitle: '10 CFR Part 73 security',
    description:
      'A reference on 10 CFR Part 73 physical security at US nuclear plants: the Design Basis Threat under Section 73.1, the Section 73.55 reactor rule, Safeguards Information, force-on-force exercises, and the proposed Alternative Physical Security rule for advanced reactors.',
    pillar: 'nuclear',
    type: 'cluster',
    live: true,
    weight: 2,
  },
  {
    slug: 'itaac-closure',
    title: 'ITAAC closure under 10 CFR 52.99 and 52.103(g): the path to fuel load',
    shortTitle: 'ITAAC closure',
    description:
      'How ITAAC closure works for a Part 52 combined license: ICN submission under 52.99(c)(1), Commission finding under 52.103(g), the 52.103(b) public hearing right, and Vogtle 3 and 4 precedent.',
    pillar: 'nuclear',
    type: 'cluster',
    live: true,
    weight: 2,
  },
  {
    slug: 'nrc-rai-management',
    title: 'NRC RAI management: how to respond to Requests for Additional Information',
    shortTitle: 'NRC RAI management',
    description:
      'A complete guide to NRC RAI process and response: LIC-115 Revision 1, 30-day window, RAI categories by SAR chapter, real-docket examples (NuScale, Kairos Hermes, Natrium), and the audit pivot under LIC-111.',
    pillar: 'nuclear',
    type: 'cluster',
    live: true,
    weight: 2,
  },
  {
    slug: 'part-53-subparts',
    title: '10 CFR Part 53 subparts: a deep dive for advanced reactor builders',
    shortTitle: 'Part 53 subparts',
    description:
      'Subpart-by-subpart reference for 10 CFR Part 53 covering Subparts A through H. 25 rem TEDE criterion, PRA scope, LBE selection, siting, FSAR, decommissioning, and the rule history.',
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
    live: true,
    weight: 2,
  },
  {
    slug: 'advanced-reactor-licensing-eu',
    title: 'Advanced reactor licensing in the EU: ASNR, ONR GDA, and the SMR pre-licensing maze',
    shortTitle: 'Advanced reactor licensing in the EU',
    description:
      "A regional explainer comparing the UK GDA under ONR, France's ASNR review, and the patchwork of EU member-state regimes.",
    pillar: 'nuclear',
    type: 'cluster',
    live: true,
    weight: 2,
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

  {
    slug: 'nuclear-compliance-japan',
    title: 'Nuclear compliance in Japan: NRA, New Regulatory Requirements, restart',
    shortTitle: 'Nuclear compliance in Japan',
    description:
      "Japan's post-Fukushima nuclear regulatory architecture: the NRA as an Article 3 commission, the 2013 New Regulatory Requirements, restart status, and the advanced reactor program.",
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
    slug: 'faa-vehicle-operator-license',
    title: 'FAA Vehicle Operator License (VOL): the Part 450 single-license model',
    shortTitle: 'FAA vehicle operator license',
    description:
      'How a Part 450 VOL works: Section 450.3 scope, Section 450.5 issuance, Section 450.7 five-year term, the consolidation of legacy launch-specific and launch operator licenses, real VOLs issued since 2021.',
    pillar: 'space',
    type: 'cluster',
    live: true,
    weight: 2,
  },
  {
    slug: 'itu-bringing-into-use',
    title: 'ITU Bringing Into Use: the 7-year clock and the 90-day rule',
    shortTitle: 'ITU Bringing Into Use',
    description:
      'A guide to the ITU Bringing Into Use mechanism under Article 11: the 7-year clock, the 90-day continuous transmission requirement, Resolution 35 NGSO milestones, and how the FCC mirrors the rule for US operators.',
    pillar: 'space',
    type: 'cluster',
    live: true,
    weight: 2,
  },
  {
    slug: 'fcc-schedule-s',
    title: 'FCC Form 312 Schedule S: How to draft, file, and avoid rejection',
    shortTitle: 'FCC Schedule S',
    description:
      'A drafting guide to FCC Form 312 Schedule S for satellite applications under 47 CFR 25.114: data blocks, GSO vs NGSO logic, antenna beams, orbital debris exhibits, the 2023 expedited rule, and rejection patterns.',
    pillar: 'space',
    type: 'cluster',
    live: true,
    weight: 2,
  },
  {
    slug: 'itar-commodity-jurisdiction',
    title: 'How to file an ITAR Commodity Jurisdiction (CJ) request',
    shortTitle: 'ITAR Commodity Jurisdiction',
    description:
      'A drafting guide for the ITAR Commodity Jurisdiction (CJ) procedure under 22 CFR 120.12: Form DS-4076 content, the inter-agency State/Defense/Commerce review, typical timelines, and CJ Final Determination precedent for space hardware.',
    pillar: 'space',
    type: 'cluster',
    live: true,
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
    live: true,
    weight: 2,
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
    live: true,
    weight: 2,
  },
  {
    slug: 'ecss-vs-mil-std',
    title: 'ECSS vs MIL-STD: qualification testing standards for space',
    shortTitle: 'ECSS vs MIL-STD',
    description:
      'A comparison of ECSS and MIL-STD families for space qualification testing, ECSS-E-ST-10-03C, MIL-STD-1540, SMC-S-016, MIL-STD-461G, NASA GEVS, and when to use each.',
    pillar: 'space',
    type: 'cluster',
    live: true,
    weight: 2,
  },
  {
    slug: 'faa-part-450-vs-legacy',
    title: 'FAA Part 450 vs legacy launch licensing: the complete reference',
    shortTitle: 'Part 450 vs legacy',
    description:
      'How 14 CFR Part 450 replaced legacy Parts 415, 417, 431, and 435 on March 10, 2021, the consolidation, the philosophical shift to performance-based regulation, and the transition.',
    pillar: 'space',
    type: 'cluster',
    live: true,
    weight: 2,
  },
  {
    slug: 'faa-ac-450-series',
    title: 'FAA AC 450 series: complete advisory circular catalog for Part 450',
    shortTitle: 'FAA AC 450 series',
    description:
      'Every FAA Advisory Circular issued for 14 CFR Part 450, with section mapping, issue dates, and primary faa.gov sources. AC 413.13-1, 450.103-1, 450.115-1B, 450.139-1, 450.169-1A, and the rest.',
    pillar: 'space',
    type: 'cluster',
    live: true,
    weight: 2,
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
  {
    slug: 'which-agency-licenses-my-satellite',
    title: 'Which agency licenses my satellite: the US space regulator map',
    shortTitle: 'Which agency licenses my satellite',
    description:
      'A decision matrix across FAA, FCC, NOAA, NRC, DDTC, and BIS for US commercial space activity, with the typical smallsat license stack.',
    pillar: 'space',
    type: 'cluster',
    live: true,
    weight: 2,
  },
  {
    slug: 'ai-for-nuclear-compliance',
    title: 'AI for nuclear compliance: Atomic Canyon vs Inductive vs Everstar vs Invariant',
    shortTitle: 'AI for nuclear compliance',
    description:
      'A side-by-side comparison of the four AI vendors competing on NRC licensing work: Atomic Canyon Neutron, Inductive, Everstar Gordian, and Invariant Helion-512.',
    pillar: 'nuclear',
    type: 'cluster',
    live: true,
    weight: 2,
  },
  {
    slug: 'doe-advanced-reactor-pilot-program',
    title: 'DOE Advanced Reactor Pilot Program: the 11 projects and the July 4, 2026 criticality target',
    shortTitle: 'DOE Reactor Pilot Program',
    description:
      'EO 14301 set up the DOE pilot for 11 advanced reactors to reach criticality by July 4, 2026 under DOE authority, not the NRC. Projects, authority, NRC interface, status.',
    pillar: 'nuclear',
    type: 'cluster',
    live: true,
    weight: 2,
  },
  {
    slug: 'india-shanti-act-bharat-smr',
    title: 'India nuclear compliance after the SHANTI Act 2025 and the Bharat Small Reactor program',
    shortTitle: 'India SHANTI Act and Bharat SMR',
    description:
      "India's SHANTI Act 2025 repealed the AEA 1962 and CLNDA 2010, opened private reactor build with 49% FDI, set graded operator liability, and gave AERB statutory powers. NPCIL leads the Bharat Small Reactor program of 220 MWe PHWRs.",
    pillar: 'nuclear',
    type: 'cluster',
    live: true,
    weight: 2,
  },
  {
    slug: 'ai-for-space-compliance',
    title: 'AI for space compliance: the commercial licensing vendor map',
    shortTitle: 'AI for space compliance',
    description:
      'Honest vendor map for AI in commercial space licensing across FAA Part 450, FCC Part 25, NOAA Part 960, ITAR Category XV, and EAR 9x515. Includes Invariant, HyperSigma, and adjacent tools.',
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
