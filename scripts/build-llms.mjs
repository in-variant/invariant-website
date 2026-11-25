#!/usr/bin/env node
// Regenerate public/llms.txt from page-registry + glossary + a static header.
// Keeps the LLM citation surface in sync with the live site.

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SITE = 'https://invariant-ai.com'
const { links } = JSON.parse(readFileSync(join(ROOT, 'src/data/earth-product.json'), 'utf8'))

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
out.push('> Source-linked data for the physical world.')
out.push('')
out.push('Invariant Earth provides data for U.S. properties and infrastructure. Use the API to check parcels, buildings, terrain, environmental hazards, and utility context. Invariant also helps teams find data center sites and review the evidence behind power delivery.')
out.push('')
out.push(`Read the [full data and site diligence guides](${SITE}/llms-full.txt). Each guide and glossary entry has a Markdown copy at its URL plus .md.`)
out.push('')

out.push('## Invariant Earth API')
out.push('')
out.push('Use `POST /v1/fetch` to request fields for one U.S. coordinate and `POST /v1/enrich` for records and metrics tied to the containing parcel. Check the live field catalogs for coverage. Field-level source URLs, retrieval timestamps and data vintages let you verify the results.')
out.push('')
out.push(`- [Platform overview](${SITE}/product) and [Markdown setup guide](${SITE}/product.md).`)
out.push(`- [API data coverage](${SITE}${links.coverage}) and [field counts and workflows](${SITE}${links.coverage}.md).`)
out.push(`- [Get an API key](${links.keys}) and follow the [quickstart](${links.quickstart}). Find the full [API documentation](${links.docs}).`)
out.push(`- [Connect the MCP server to your AI agent](${links.mcp}). Server URL ${links.mcpEndpoint}.`)
out.push(`- [Live point fields](${links.pointFields}) for Fetch and [live parcel fields and presets](${links.parcelFields}) for Enrich. Read the [response reference](${links.responses}) for provenance and status.`)
out.push('- [Docs index for LLMs](https://docs.invariant-ai.com/llms.txt) and [full docs as Markdown](https://docs.invariant-ai.com/llms-full.txt).')
out.push(`- [Research case studies](${SITE}/research). Findings, methods and downloads for selected studies are also available [as Markdown](${SITE}/research.md).`)
out.push(`- [Research datasets](${SITE}/datasets). Read named source records and find downloads in the [Markdown catalog](${SITE}/datasets.md). The [JSON catalog](${SITE}/datasets.json) also includes SHA-256 checksums.`)
out.push(`- [Invariant blog feed](${SITE}/feed.xml) with article URLs, summaries and revision dates.`)
const blogCollections = JSON.parse(readFileSync(join(ROOT, 'src/data/blog-collections.json'), 'utf8'))
for (const collection of blogCollections) {
  out.push(`- [${collection.title}](${SITE}/blog/${collection.slug}.md): ${collection.description}`)
}
const industryArticles = JSON.parse(readFileSync(join(ROOT, 'src/data/industry-article-index.json'), 'utf8'))
const isIndiaArticle = article => /(^|, )India$/.test(article.region ?? '')
for (const article of industryArticles.filter(article => article.topic === 'Data & APIs')) {
  out.push(`- [${article.title}](${SITE}/blog/${article.slug}.md): ${article.summary}`)
}
out.push('')
out.push('## Data center site due diligence and power studies')
out.push('')
out.push('Invariant runs due diligence on US data center sites in two steps, for developers, investors, lenders, landowners and brokers (including white-label work for advisers).')
out.push('')
out.push('- **Step 1, site feasibility screen (within 24 hours):** from a coordinate or parcel and a target MW: serving utility and ISO, nearest substations and lines with a screening MW range for the next three study years and the binding constraint, FEMA flood zone, USGS and ASCE 7 seismic values, wetlands, listed species, FAA Part 77 airspace, zoning and data center moratoriums, water, fiber, gas and parcel. Ends in a go, no-go or conditional go.')
out.push('- **Step 2, utility-grade power study (usually within 48 hours):** the transmission network around the site rebuilt per study year and checked against ISO-reported flows; AC power flow at N-0 and N-1 (NERC TPL-001 P1, plus selected P2, P4, P5, P7 events) at every connection option, including new switching stations; thermal and voltage limits, short circuit ratio, upgrade search with MW unlocked, indicative cost ranges and an energization date range; utility tariff, fees and pre-application questions.')
out.push('- **Utility confirmation:** study results describe a modeled case. Check the serving utility’s written service terms, the committed MW by phase, and any upgrades or conditions required before energization.')
out.push('- **Pricing:** fixed fee per site, quoted before work starts, with portfolio rates; a small fraction of a utility study fee ($10,000 to $100,000 at AEP Ohio, $100,000 for large loads in ERCOT).')
out.push('- **Request a screen:** email pranav@invariant-ai.com or call (628) 220-8972 with the coordinate, MW and energize-by date, or book at https://cal.com/pranav-goswami/website-30min.')
out.push('')
const ddSlugs = JSON.parse(readFileSync(join(ROOT, 'src/data/industry-articles/site-due-diligence.json'), 'utf8'))
for (const a of ddSlugs) out.push(`- [${a.title}](${SITE}/blog/${a.slug}): ${a.description}`)
out.push('')

out.push('## Data center capacity for neoclouds and AI labs')
out.push('')
out.push('Invariant finds US data center capacity for GPU clusters (colocation that can cool dense racks, built and energized sites, powered land) sized from GPU count, rack density and date, and checks the power behind each option against utility documents. It also runs an independent power check on a provider or site before an AI tenant signs: the document behind the MW, the point of interconnection, upgrades, competing loads and on-site generation permits, usually within 48 hours.')
out.push('')
out.push('- **Sizing rule used on our pages:** NVIDIA system power (DGX H100 10.2 kW and DGX B200 14.3 kW per 8 GPUs; GB200 NVL72 about 120 kW per 72-GPU rack), plus about 10% for networking and storage, times PUE 1.3. About 1.8 kW (H100), 2.6 kW (B200) and 2.4 kW (GB200) per GPU at the meter.')
out.push('- **Request capacity:** email pranav@invariant-ai.com or call (628) 220-8972 with GPU type and count, rack density, date and regions.')
out.push('')
const computeArticles = JSON.parse(readFileSync(join(ROOT, 'src/data/industry-articles/ai-compute-capacity.json'), 'utf8'))
for (const a of computeArticles) out.push(`- [${a.title}](${SITE}/blog/${a.slug}): ${a.description}`)
out.push('')

out.push('## Data centres in India')
out.push('')
out.push('Guides to data centre locations, state and national policy, approvals, power and grid connection, open access charges, land, water, and physical risks in India.')
out.push('- [Data centre approvals in India](' + SITE + '/data-centre-compliance-india): authorities and primary sources for project approvals.')
for (const article of industryArticles.filter(isIndiaArticle)) {
  out.push(`- [${article.title}](${SITE}/blog/${article.slug}.md): ${article.summary}`)
}
out.push('')

out.push('## Earlier regulatory references')
out.push('')
out.push('- [Regulatory workspace walkthrough](https://invariant-ai.com/product#platform-demo).')
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
out.push('### Regulatory tools and resources')
out.push('- [Mission timeline](https://invariant-ai.com/timeline), Enter a space company website and get the full US and India regulatory filing plan, FCC, NOAA, ITAR and EAR, FAA, IN-SPACe, with real review clocks and fees.')
out.push('- [Blog](https://invariant-ai.com/blog), field notes and data guides.')
out.push('- [Glossary](https://invariant-ai.com/glossary), Authoritative definitions of regulatory and qualification compliance terms.')
out.push('- [Compliance library](https://invariant-ai.com/compliance), Every Invariant resource for space, nuclear, and aerospace.')
out.push('- [Trust](https://invariant-ai.com/trust), Security and data-handling disclosures.')
out.push('')
out.push('### Calculators')
out.push('- [FAA Part 450 timeline estimator](https://invariant-ai.com/calculators/faa-part-450-timeline), Interactive estimator for FAA 14 CFR Part 450 launch and reentry license duration.')
out.push('- [NRC license timeline estimator](https://invariant-ai.com/calculators/nrc-license-timeline), Interactive estimator for NRC reactor license duration under Parts 50, 52, 53.')
out.push('- [Data center power capacity calculator](https://invariant-ai.com/calculators/data-center-power-capacity.md), Estimate facility demand, check on-site generation in an outage, and calculate battery runtime for a constant shortfall.')
out.push('- [Data center power delivery schedule calculator](https://invariant-ai.com/calculators/data-center-power-delivery-schedule.md), Work back from each opening date to the power service deadline and compare reported service MW with facility demand.')
out.push('- [Net effective rent calculator](https://invariant-ai.com/calculators/net-effective-rent.md), Compare commercial lease offers with annual increases, free months and build-out allowances.')
out.push('- [Battery storage recharge calculator](https://invariant-ai.com/calculators/battery-recharge-window.md), Check whether a grid-scale battery can recharge for a planned dispatch under import and export limits.')

out.push('')
out.push('## Earlier nuclear references')
out.push('')
out.push('- [10 CFR Part 100 vs Part 53 Subpart D: A Siting Comparison](https://invariant-ai.com/blog/part100-vs-part53-siting), A line-by-line comparison of the legacy and the new technology-inclusive frameworks.')
out.push('- [SSE/OBE → GMRS/SDC: The Seismic Design Shift to Part 53](https://invariant-ai.com/blog/seismic-design-shift), The deterministic two-tier framework is replaced by risk-tiered ground motions and seismic design categories.')
out.push('')
out.push('## Data centers and oil and gas')
out.push('- [Data-center compliance](https://invariant-ai.com/data-center-compliance): U.S. siting, power, air, water, construction and operating requirements.')
out.push('- [Oil-and-gas compliance](https://invariant-ai.com/oil-gas-compliance): U.S. onshore permitting, methane requirements and operating evidence.')
for (const article of industryArticles.filter(article => article.topic !== 'Data & APIs' && !isIndiaArticle(article))) out.push(`- [${article.title}](${SITE}/blog/${article.slug}): ${article.summary}`)

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
