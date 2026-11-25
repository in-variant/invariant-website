#!/usr/bin/env node
// Build a short agent entry point and a complete link directory.

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SITE = 'https://invariant-ai.com'
const product = JSON.parse(readFileSync(join(ROOT, 'src/data/earth-product.json'), 'utf8'))
const { links } = product
const blogCollections = JSON.parse(readFileSync(join(ROOT, 'src/data/blog-collections.json'), 'utf8'))

const sections = [
  ['Connect to Invariant Earth', [
    ['API quickstart and first query', `${links.quickstart}.md`],
    ['Get an API key', links.keys],
    ['MCP installation for coding agents', `${links.mcp}.md`],
    ...product.operations.map(({ method, title, docs }) => [`${method} to ${title.toLowerCase()}`, `${docs}.md`]),
    ['Response statuses, source URLs and data vintages', `${links.responses}.md`],
    ['Coverage and workflow examples', `${SITE}${links.coverage}.md`],
    ['Live point field catalog', links.pointFields],
    ['Live parcel fields and presets', links.parcelFields],
    ['Request a data field', `${links.fieldRequests}.md`],
    ['Download the versioned Python parcel and flood trial', links.gisTrial],
    ['Full API documentation index', `${links.docs}llms.txt`],
  ]],
  ['Datasets and research', [
    ['Research findings, methods and source records', `${SITE}${links.research}.md`],
    ['Research datasets and citations', `${SITE}${links.datasets}.md`],
    ['Research dataset manifest with source URLs and file checksums', `${SITE}${links.datasets}.json`],
    ...blogCollections.map(({ title, slug }) => [title, `${SITE}/blog/${slug}.md`]),
  ]],
  ['Examples by industry', product.examples.map(({ audience, title, href }) => [
    `${audience} | ${title}`, `${SITE}${href}.md`,
  ])],
  ['Commercial lending', [
    ['Calculate a commercial refinance gap and break-even thresholds', `${SITE}/calculators/commercial-refinance-gap.md`],
    ['Find dated CMBS property financials', `${SITE}/blog/cmbs-dscr-noi-by-property.md`],
    ['Verify a commercial mortgage maturity date', `${SITE}/blog/commercial-mortgage-maturity-data-apis.md`],
  ]],
  ['Data centers, land and power', [
    ['Find a U.S. data center site', `${SITE}/blog/find-data-center-site-us.md`],
    ['Compare data centers for sale and lease', `${SITE}/blog/data-center-for-sale.md`],
    ['Site selection criteria and worksheet', `${SITE}/blog/data-center-site-selection-checklist.md`],
    ['Verify what a utility letter, study or service agreement establishes', `${SITE}/blog/utility-will-serve-letter-load-study-esa.md`],
    ['Power-flow studies, limits and contingency cases', `${SITE}${links.power}.md`],
    ['Calculate facility demand and power margin', `${SITE}/calculators/data-center-power-capacity.md`],
    ['Calculate on-site water use and water usage effectiveness', `${SITE}/calculators/data-center-water-use.md`],
    ['Calculate monthly AEP Ohio data center demand charges', `${SITE}/calculators/aep-ohio-data-center-demand-charge.md`],
    ['Find space and power for GPU clusters', `${SITE}/blog/ai-compute-capacity-for-neoclouds.md`],
  ]],
  ['Optional', [
    ['Complete link directory, including glossary, calculators and regulatory references', `${SITE}/llms-index.txt`],
    ['Full text of data, site selection and power guides', `${SITE}/llms-full.txt`],
    ['Article feed with revision dates', `${SITE}/feed.xml`],
    ['Security and data handling', `${SITE}/trust`],
    ['Contact Invariant', `${SITE}/contact`],
  ]],
]

const shortIndex = [
  '# Invariant', '',
  '> Source-linked U.S. data for properties, infrastructure, energy and the physical economy.', '',
  'Use Invariant Earth to query data at a coordinate or for the parcel that contains it. Check the field catalog for coverage and cite source URLs and data vintages when available.', '',
  'Research downloads cover dated examples. For a site decision, review the current property and utility records. Power-flow studies describe modeled scenarios. Confirm service terms and available MW for the proposed phase with the serving utility.', '',
  ...sections.flatMap(([heading, entries]) => [
    `## ${heading}`, '',
    ...entries.map(([title, href]) => `- [${title}](${href})`),
    '',
  ]),
]

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
out.push('# Invariant complete link directory')
out.push('')
out.push('> Source-linked data for the physical world.')
out.push('')
out.push('Invariant Earth provides data for U.S. properties and infrastructure. Use the API to check parcels, buildings, terrain, environmental hazards, and utility context. Invariant also helps teams find data center sites and review the evidence behind power delivery.')
out.push('')
out.push(`Start with the [short directory](${SITE}/llms.txt) or read the [full data and site diligence guides](${SITE}/llms-full.txt). The industry guides and glossary entries have Markdown copies at their URLs plus .md.`)
out.push('')

out.push('## Invariant Earth API')
out.push('')
out.push('Check the live field catalogs for coverage. Field-level source URLs, retrieval timestamps and data vintages let you verify point and parcel results.')
out.push('')
for (const { method, description, docs } of product.operations) {
  out.push(`- [${method}](${docs}.md). ${description}`)
}
out.push('')
out.push(`- [Platform overview](${SITE}/product) and [Markdown setup guide](${SITE}/product.md).`)
out.push(`- [API data coverage](${SITE}${links.coverage}) and [field counts and workflows](${SITE}${links.coverage}.md).`)
out.push(`- [Get an API key](${links.keys}) and follow the [quickstart](${links.quickstart}). Find the full [API documentation](${links.docs}).`)
out.push(`- [Connect the MCP server to your AI agent](${links.mcp}). Server URL ${links.mcpEndpoint}.`)
out.push(`- [Live point fields](${links.pointFields}) for Fetch and [live parcel fields and presets](${links.parcelFields}) for Enrich. Read the [response reference](${links.responses}) for provenance and status.`)
out.push(`- [Request a data field](${links.fieldRequests}.md) and [download the versioned Python parcel and flood trial](${links.gisTrial}).`)
out.push('- [Docs index for LLMs](https://docs.invariant-ai.com/llms.txt) and [full docs as Markdown](https://docs.invariant-ai.com/llms-full.txt).')
out.push(`- [Research case studies](${SITE}/research). Findings, methods and downloads for selected studies are also available [as Markdown](${SITE}/research.md).`)
out.push(`- [Research datasets](${SITE}/datasets). Read named source records and find downloads in the [Markdown catalog](${SITE}/datasets.md). The [JSON catalog](${SITE}/datasets.json) also includes SHA-256 checksums.`)
out.push(`- [Invariant blog feed](${SITE}/feed.xml) with article URLs, summaries and revision dates.`)
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
out.push(`- [GPU cluster power estimates](${SITE}/blog/gpu-cluster-power-requirements.md) use the stated system ratings and an assumed facility-to-IT demand ratio of 1.30. Check the peak demand for your design condition before using an estimate for service planning.`)
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
out.push('- [Data center water use calculator](https://invariant-ai.com/calculators/data-center-water-use.md), Estimate annual on-site water and average daily gallons or calculate site WUE from annual records.')
out.push('- [AEP Ohio data center demand charge calculator](https://invariant-ai.com/calculators/aep-ohio-data-center-demand-charge.md), Compare the meter, minimum demand and 11-month lookback for one Schedule DCT new-load contract.')
out.push('- [Data center power delivery schedule calculator](https://invariant-ai.com/calculators/data-center-power-delivery-schedule.md), Work back from each opening date to the power service deadline and compare reported service MW with facility demand.')
out.push('- [Net effective rent calculator](https://invariant-ai.com/calculators/net-effective-rent.md), Compare commercial lease offers with annual increases, free months and build-out allowances.')
out.push('- [Commercial real estate refinance gap calculator](https://invariant-ai.com/calculators/commercial-refinance-gap.md), Check DSCR, LTV and debt yield and find the income and property value required to cover payoff and costs.')
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

writeFileSync(join(ROOT, 'public/llms.txt'), shortIndex.join('\n'))
writeFileSync(join(ROOT, 'public/llms-index.txt'), out.join('\n'))
console.log(`Regenerated llms.txt and llms-index.txt with ${industryArticles.length} guide links in the full directory`)
