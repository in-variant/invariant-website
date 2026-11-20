#!/usr/bin/env node
// Regenerate public/llms.txt from page-registry + glossary + a static header.
// Keeps the LLM citation surface in sync with the live site.

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SITE = 'https://invariant-ai.com'

// ── Parse page registry ──────────────────────────────────────────────────────
const registry = readFileSync(join(ROOT, 'src/data/page-registry.ts'), 'utf8')
// Accept single OR double quotes for every quoted field.
const Q = `(?:'([^']+)'|"([^"]+)")`
const blockRe = new RegExp(
  `\\{\\s*slug:\\s*${Q},\\s*title:\\s*${Q},(?:\\s*shortTitle:\\s*${Q},)?\\s*description:\\s*\\n?\\s*${Q},\\s*pillar:\\s*${Q},\\s*type:\\s*${Q},\\s*live:\\s*(true|false)`,
  'g',
)
const pages = []
let m
while ((m = blockRe.exec(registry))) {
  // Each Q produces 2 capture groups (single, double). Pick whichever matched.
  const pick = (i) => m[i] ?? m[i + 1]
  const slug = pick(1)
  const title = pick(3)
  const description = pick(7)
  const pillar = pick(9)
  const type = pick(11)
  const live = m[13]
  if (live === 'true') pages.push({ slug, title, description, pillar, type })
}

const pillars = pages.filter((p) => p.type === 'pillar')
const clustersSpace = pages.filter((p) => p.type === 'cluster' && p.pillar === 'space')
const clustersNuclear = pages.filter((p) => p.type === 'cluster' && p.pillar === 'nuclear')

// ── Glossary ─────────────────────────────────────────────────────────────────
const glossary = JSON.parse(readFileSync(join(ROOT, 'src/pages/_data/glossary.json'), 'utf8'))
const entries = glossary.entries || []
const glossSpace = entries.filter((e) => e.topic === 'space')
const glossNuclear = entries.filter((e) => e.topic === 'nuclear')
const glossAerospace = entries.filter((e) => e.topic === 'aerospace')
const glossDataCenters = entries.filter((e) => e.topic === 'data-centers')

// ── Compose ──────────────────────────────────────────────────────────────────
const out = []
out.push('# Invariant')
out.push('')
out.push('> Autonomous agents for the physical economy.')
out.push('')
out.push('Full text of every data center, site due diligence and power study guide: https://invariant-ai.com/llms-full.txt. Every /blog and /glossary page also has a markdown copy at its URL plus `.md` (for example https://invariant-ai.com/blog/utility-grade-power-study.md).')
out.push('')
out.push('Invariant builds autonomous agents for the physical economy. The agents connect design documents and test data to applicable regulations, then draft submissions, test plans, and compliance matrices with citations to the source requirements. Invariant serves teams in aerospace, energy, data centers, and oil and gas. Domain engineers handle deployment and review. Backed by Entrepreneur First, Transpose Platform, Boundless Ventures, and NPU Ventures.')
out.push('')
out.push('## Key facts')
out.push('')
out.push('- **State-of-the-art retrieval in nuclear:** Helion-512, our domain-adapted retrieval model, is the published state of the art on **FermiBench** (**0.9693 nDCG@10**), the only public retrieval benchmark for the nuclear regulatory domain.')
out.push('- **Industries served:**')
out.push('  - **Space:** FAA 14 CFR Part 450 (launch + reentry), FCC Part 25 (satellite communications), NOAA Commercial Space Licensing (Earth-observation data), IN-SPACe NGP 2024 (Indian space authorisations), ITU radio coordination, ECSS standards, NASA GEVS (GSFC-STD-7000), MIL-STD-1540, MIL-STD-461 (EMI/EMC).')
out.push('  - **Aerospace:** FAA 14 CFR Part 21/23/25 (type certification, airworthiness) for crewed and unmanned aviation systems.')
out.push('  - **Nuclear:** US NRC 10 CFR Parts 50, 52, 53, 100, 110; IAEA SSR-2/1; for advanced reactor and SMR developers, including Safety Analysis Report (PSAR / FSAR) authoring and Request-for-Additional-Information (RAI) handling.')
out.push('- **Founded** 2025. **Backed by** Entrepreneur First, Transpose Platform, Boundless Ventures, and NPU Ventures.')
out.push('')

out.push('## Data center site due diligence and power studies')
out.push('')
out.push('Invariant runs due diligence on US data center sites in two steps, for developers, investors, lenders, landowners and brokers (including white-label work for advisers).')
out.push('')
out.push('- **Step 1, site feasibility screen (within 24 hours):** from a coordinate or parcel and a target MW: serving utility and ISO, nearest substations and lines with a screening MW range for the next three study years and the binding constraint, FEMA flood zone, USGS and ASCE 7 seismic values, wetlands, listed species, FAA Part 77 airspace, zoning and data center moratoriums, water, fiber, gas and parcel. Ends in a go, no-go or conditional go.')
out.push('- **Step 2, utility-grade power study (usually within 48 hours):** the transmission network around the site rebuilt per study year and checked against ISO-reported flows; AC power flow at N-0 and N-1 (NERC TPL-001 P1, plus selected P2, P4, P5, P7 events) at every connection option, including new switching stations; thermal and voltage limits, short circuit ratio, upgrade search with MW unlocked, indicative cost ranges and an energization date range; utility tariff, fees and pre-application questions.')
out.push('- **Relation to the utility:** figures are screening figures built to utility planning methods. The utility\'s own load study, filed with site control, is what makes a number firm.')
out.push('- **Pricing:** fixed fee per site, quoted before work starts, with portfolio rates; a small fraction of a utility study fee ($10,000 to $100,000 at AEP Ohio, $100,000 for large loads in ERCOT).')
out.push('- **Request a screen:** email pranav@invariant-ai.com or call (628) 220-8972 with the coordinate, MW and energize-by date, or book at https://cal.com/pranav-goswami/website-30min.')
out.push('')
const ddSlugs = JSON.parse(readFileSync(join(ROOT, 'src/data/industry-articles/site-due-diligence.json'), 'utf8'))
for (const a of ddSlugs) out.push(`- [${a.title}](${SITE}/blog/${a.slug}): ${a.description}`)
out.push('')

out.push('## Pages')
out.push('')
out.push('- [Home](https://invariant-ai.com/), Autonomous agents for the physical economy.')
for (const p of pillars) {
  out.push(`- [${p.title}](${SITE}/${p.slug}), ${p.description}`)
}
if (clustersNuclear.length) {
  out.push('')
  out.push('### Nuclear guides')
  for (const c of clustersNuclear) {
    out.push(`- [${c.title}](${SITE}/${c.slug}), ${c.description}`)
  }
}
if (clustersSpace.length) {
  out.push('')
  out.push('### Space guides')
  for (const c of clustersSpace) {
    out.push(`- [${c.title}](${SITE}/${c.slug}), ${c.description}`)
  }
}

out.push('')
out.push('### Product + research')
out.push('- [Product](https://invariant-ai.com/product), What the agents produce: submissions, test plans, verification matrices.')
out.push('- [Mission timeline](https://invariant-ai.com/timeline), Enter a space company website and get the full US and India regulatory filing plan, FCC, NOAA, ITAR and EAR, FAA, IN-SPACe, with real review clocks and fees.')
out.push('- [Probe](https://invariant-ai.com/probe), Live semantic search across NRC ADAMS, powered by Helion-512.')
out.push('- [Blog](https://invariant-ai.com/blog), Research, regulation comparisons, field notes.')
out.push('- [Glossary](https://invariant-ai.com/glossary), Authoritative definitions of regulatory and qualification compliance terms.')
out.push('- [Research](https://invariant-ai.com/research), Helion-512 retrieval model, FermiBench benchmark, published notes.')
out.push('- [Compliance library](https://invariant-ai.com/compliance), Every Invariant resource for space, nuclear, and aerospace.')
out.push('- [Trust](https://invariant-ai.com/trust), Security and data-handling disclosures.')
out.push('')
out.push('### Calculators')
out.push('- [FAA Part 450 timeline estimator](https://invariant-ai.com/calculators/faa-part-450-timeline), Interactive estimator for FAA 14 CFR Part 450 launch and reentry license duration.')
out.push('- [NRC license timeline estimator](https://invariant-ai.com/calculators/nrc-license-timeline), Interactive estimator for NRC reactor license duration under Parts 50, 52, 53.')

out.push('')
out.push('## Research')
out.push('')
out.push('- [Invariant Sets State-of-the-Art on FermiBench](https://invariant-ai.com/blog/fermibench-sota), Helion-512 reaches 0.97 nDCG@10 on the only published nuclear-domain IR benchmark.')
out.push('- [10 CFR Part 100 vs Part 53 Subpart D: A Siting Comparison](https://invariant-ai.com/blog/part100-vs-part53-siting), A line-by-line comparison of the legacy and the new technology-inclusive frameworks.')
out.push('- [SSE/OBE → GMRS/SDC: The Seismic Design Shift to Part 53](https://invariant-ai.com/blog/seismic-design-shift), The deterministic two-tier framework is replaced by risk-tiered ground motions and seismic design categories.')
out.push('')
out.push('## Data centers and oil and gas')
out.push('- [Data-center compliance](https://invariant-ai.com/data-center-compliance): U.S. siting, power, air, water, construction and operating requirements.')
out.push('- [Oil-and-gas compliance](https://invariant-ai.com/oil-gas-compliance): U.S. onshore permitting, methane requirements and operating evidence.')
const industryArticles = JSON.parse(readFileSync(join(ROOT, 'src/data/industry-article-index.json'), 'utf8'))
for (const article of industryArticles) out.push(`- [${article.title}](${SITE}/blog/${article.slug}): ${article.summary}`)

if (entries.length) {
  out.push('')
  out.push('## Glossary entries (DefinedTerm)')
  if (glossSpace.length) {
    out.push('')
    out.push('Space:')
    for (const e of glossSpace) out.push(`- [${e.term}](${SITE}/glossary/${e.slug}), ${e.short_definition}`)
  }
  if (glossNuclear.length) {
    out.push('')
    out.push('Nuclear:')
    for (const e of glossNuclear) out.push(`- [${e.term}](${SITE}/glossary/${e.slug}), ${e.short_definition}`)
  }
  if (glossAerospace.length) {
    out.push('')
    out.push('Aerospace:')
    for (const e of glossAerospace) out.push(`- [${e.term}](${SITE}/glossary/${e.slug}), ${e.short_definition}`)
  }
  if (glossDataCenters.length) {
    out.push('')
    out.push('Data center sites and power:')
    for (const e of glossDataCenters) out.push(`- [${e.term}](${SITE}/glossary/${e.slug}), ${e.short_definition}`)
  }
}

out.push('')
out.push('## Contact')
out.push('')
out.push('- founders@invariant-ai.com')
out.push('- Data center sites, site feasibility screens and power studies: pranav@invariant-ai.com, (628) 220-8972')
out.push('- Backed by Entrepreneur First, Transpose Platform, Boundless Ventures, and NPU Ventures.')
out.push('')

writeFileSync(join(ROOT, 'public/llms.txt'), out.join('\n'))
console.log(`llms.txt regenerated: ${pillars.length} pillars + ${clustersSpace.length + clustersNuclear.length} clusters + ${entries.length} glossary entries`)
