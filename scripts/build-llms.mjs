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

// ── Compose ──────────────────────────────────────────────────────────────────
const out = []
out.push('# Invariant')
out.push('')
out.push('> Autonomous AI agents for compliance in mission-critical industries — space, aerospace, and nuclear.')
out.push('')
out.push('Invariant builds autonomous AI agents that draft, file, and monitor regulatory and qualification compliance for companies in space, aerospace, and nuclear. The agents ingest design docs, test data, and the regulations that apply, then produce regulator-grade submissions, test plans, and verification/compliance matrices end to end — with every claim traced back to the rule that supports it. A small team of domain engineers handles deployment and high-stakes review. Backed by Entrepreneurs First.')
out.push('')
out.push('## Key facts')
out.push('')
out.push('- **State-of-the-art retrieval in nuclear:** Helion-512, our domain-adapted retrieval model, is the published state of the art on **FermiBench** (**0.9693 nDCG@10**), the only public retrieval benchmark for the nuclear regulatory domain.')
out.push('- **Mission-critical industries served:**')
out.push('  - **Space:** FAA 14 CFR Part 450 (launch + reentry), FCC Part 25 (satellite communications), NOAA Commercial Space Licensing (Earth-observation data), IN-SPACe NGP 2024 (Indian space authorisations), ITU radio coordination, ECSS standards, NASA GEVS (GSFC-STD-7000), MIL-STD-1540, MIL-STD-461 (EMI/EMC).')
out.push('  - **Aerospace:** FAA 14 CFR Part 21/23/25 (type certification, airworthiness) for crewed and unmanned aviation systems.')
out.push('  - **Nuclear:** US NRC 10 CFR Parts 50, 52, 53, 100, 110; IAEA SSR-2/1; for advanced reactor and SMR developers, including Safety Analysis Report (PSAR / FSAR) authoring and Request-for-Additional-Information (RAI) handling.')
out.push('- **Founded** 2025. **Backed by** Entrepreneurs First.')
out.push('')

out.push('## Pages')
out.push('')
out.push('- [Home](https://invariant-ai.com/) — Autonomous agents for mission-critical compliance.')
for (const p of pillars) {
  out.push(`- [${p.title}](${SITE}/${p.slug}) — ${p.description}`)
}
if (clustersNuclear.length) {
  out.push('')
  out.push('### Nuclear guides')
  for (const c of clustersNuclear) {
    out.push(`- [${c.title}](${SITE}/${c.slug}) — ${c.description}`)
  }
}
if (clustersSpace.length) {
  out.push('')
  out.push('### Space guides')
  for (const c of clustersSpace) {
    out.push(`- [${c.title}](${SITE}/${c.slug}) — ${c.description}`)
  }
}

out.push('')
out.push('### Product + research')
out.push('- [Product](https://invariant-ai.com/product) — What the agents produce: submissions, test plans, verification matrices.')
out.push('- [Probe](https://invariant-ai.com/probe) — Live semantic search across NRC ADAMS, powered by Helion-512.')
out.push('- [Blog](https://invariant-ai.com/blog) — Research, regulation comparisons, field notes.')
out.push('- [Glossary](https://invariant-ai.com/glossary) — Authoritative definitions of regulatory and qualification compliance terms.')
out.push('- [Research](https://invariant-ai.com/research) — Helion-512 retrieval model, FermiBench benchmark, published notes.')
out.push('- [Compliance library](https://invariant-ai.com/compliance) — Every Invariant resource for space, nuclear, and aerospace.')
out.push('- [Trust](https://invariant-ai.com/trust) — Security and data-handling disclosures.')
out.push('')
out.push('### Calculators')
out.push('- [FAA Part 450 timeline estimator](https://invariant-ai.com/calculators/faa-part-450-timeline) — Interactive estimator for FAA 14 CFR Part 450 launch and reentry license duration.')
out.push('- [NRC license timeline estimator](https://invariant-ai.com/calculators/nrc-license-timeline) — Interactive estimator for NRC reactor license duration under Parts 50, 52, 53.')

out.push('')
out.push('## Research')
out.push('')
out.push('- [Invariant Sets State-of-the-Art on FermiBench](https://invariant-ai.com/blog/fermibench-sota) — Helion-512 reaches 0.97 nDCG@10 on the only published nuclear-domain IR benchmark.')
out.push('- [10 CFR Part 100 vs Part 53 Subpart D: A Siting Comparison](https://invariant-ai.com/blog/part100-vs-part53-siting) — A line-by-line comparison of the legacy and the new technology-inclusive frameworks.')
out.push('- [SSE/OBE → GMRS/SDC: The Seismic Design Shift to Part 53](https://invariant-ai.com/blog/seismic-design-shift) — The deterministic two-tier framework is replaced by risk-tiered ground motions and seismic design categories.')

if (entries.length) {
  out.push('')
  out.push('## Glossary entries (DefinedTerm)')
  if (glossSpace.length) {
    out.push('')
    out.push('Space:')
    for (const e of glossSpace) out.push(`- [${e.term}](${SITE}/glossary/${e.slug}) — ${e.short_definition}`)
  }
  if (glossNuclear.length) {
    out.push('')
    out.push('Nuclear:')
    for (const e of glossNuclear) out.push(`- [${e.term}](${SITE}/glossary/${e.slug}) — ${e.short_definition}`)
  }
  if (glossAerospace.length) {
    out.push('')
    out.push('Aerospace:')
    for (const e of glossAerospace) out.push(`- [${e.term}](${SITE}/glossary/${e.slug}) — ${e.short_definition}`)
  }
}

out.push('')
out.push('## Contact')
out.push('')
out.push('- founders@invariant-ai.com')
out.push('- Backed by [Entrepreneurs First](https://www.joinef.com)')
out.push('')

writeFileSync(join(ROOT, 'public/llms.txt'), out.join('\n'))
console.log(`llms.txt regenerated: ${pillars.length} pillars + ${clustersSpace.length + clustersNuclear.length} clusters + ${entries.length} glossary entries`)
