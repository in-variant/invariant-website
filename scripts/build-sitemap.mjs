#!/usr/bin/env node
// Regenerate public/sitemap.xml from page-registry + glossary + blog index.
// Run via `npm run sitemap` or as a pre-build step.

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SITE = 'https://invariant-ai.com'

// ── Live core pages ──────────────────────────────────────────────────────────
const CORE = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/product', changefreq: 'monthly', priority: '0.8' },
  { loc: '/probe', changefreq: 'monthly', priority: '0.7' },
  { loc: '/blog', changefreq: 'weekly', priority: '0.8' },
  { loc: '/glossary', changefreq: 'weekly', priority: '0.8' },
  { loc: '/research', changefreq: 'monthly', priority: '0.85' },
  { loc: '/compliance', changefreq: 'weekly', priority: '0.9' },
  { loc: '/trust', changefreq: 'monthly', priority: '0.6' },
  { loc: '/about', changefreq: 'monthly', priority: '0.7' },
  { loc: '/regulators', changefreq: 'monthly', priority: '0.85' },
  { loc: '/calculators/faa-part-450-timeline', changefreq: 'monthly', priority: '0.85' },
  { loc: '/calculators/nrc-license-timeline', changefreq: 'monthly', priority: '0.85' },
  { loc: '/calculators/fcc-deorbit-feasibility', changefreq: 'monthly', priority: '0.85' },
  { loc: '/calculators/cfr-citation-formatter', changefreq: 'monthly', priority: '0.85' },
  { loc: '/calculators', changefreq: 'monthly', priority: '0.8' },
]

const BLOG = [
  { loc: '/blog/fermibench-sota', changefreq: 'monthly', priority: '0.75' },
  { loc: '/blog/part100-vs-part53-siting', changefreq: 'monthly', priority: '0.75' },
  { loc: '/blog/seismic-design-shift', changefreq: 'monthly', priority: '0.75' },
  { loc: '/blog/nuclear-compliance-tam', changefreq: 'monthly', priority: '0.7' },
  { loc: '/blog/space-compliance-tam', changefreq: 'monthly', priority: '0.7' },
]

// ── Page registry (pillars + clusters) ───────────────────────────────────────
// Parse src/data/page-registry.ts naively — extract slug + live + type.
// Accept single or double quotes on slug/type.
const registry = readFileSync(join(ROOT, 'src/data/page-registry.ts'), 'utf8')
const entries = []
const blockRe = /\{\s*slug:\s*['"]([^'"]+)['"][\s\S]*?type:\s*['"]([^'"]+)['"],\s*live:\s*(true|false)/g
let m
while ((m = blockRe.exec(registry))) {
  if (m[3] === 'true') {
    const priority = m[2] === 'pillar' ? '0.95' : '0.85'
    const changefreq = m[2] === 'pillar' ? 'weekly' : 'monthly'
    entries.push({ loc: `/${m[1]}`, changefreq, priority })
  }
}

// ── Glossary entries ─────────────────────────────────────────────────────────
const glossary = JSON.parse(readFileSync(join(ROOT, 'src/pages/_data/glossary.json'), 'utf8'))
const glossaryUrls = (glossary.entries || []).map((e) => ({
  loc: `/glossary/${e.slug}`,
  changefreq: 'monthly',
  priority: '0.7',
}))

// ── Compose ──────────────────────────────────────────────────────────────────
const all = [...CORE, ...entries, ...BLOG, ...glossaryUrls]

// Deduplicate by loc, last write wins.
const seen = new Map()
for (const u of all) seen.set(u.loc, u)
const unique = Array.from(seen.values())

const today = new Date().toISOString().slice(0, 10)
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${unique
  .map(
    (u) =>
      `  <url><loc>${SITE}${u.loc}</loc><lastmod>${today}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`,
  )
  .join('\n')}
</urlset>
`

writeFileSync(join(ROOT, 'public/sitemap.xml'), xml)
console.log(`sitemap.xml regenerated: ${unique.length} URLs`)
