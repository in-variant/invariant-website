#!/usr/bin/env node
// Regenerate public/sitemap.xml from page-registry + glossary + blog index.
// Run via `npm run sitemap` or as a pre-build step.

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SITE = 'https://invariant-ai.com'
const industryArticles = JSON.parse(readFileSync(join(ROOT, 'src/data/industry-article-index.json'), 'utf8'))
const blogCollections = JSON.parse(readFileSync(join(ROOT, 'src/data/blog-collections.json'), 'utf8'))
const product = JSON.parse(readFileSync(join(ROOT, 'src/data/earth-product.json'), 'utf8'))
const coverage = JSON.parse(readFileSync(join(ROOT, 'src/data/earth-coverage-summary.json'), 'utf8'))
const research = JSON.parse(readFileSync(join(ROOT, 'src/data/research-studies.json'), 'utf8'))
const datasetCatalog = JSON.parse(readFileSync(join(ROOT, 'src/data/research-dataset-catalog.json'), 'utf8'))
const blogLastmod = [...industryArticles, ...blogCollections].map(entry => entry.updatedDate ?? entry.dateTime).sort().at(-1)

const datasetPublicationDates = industryArticles.flatMap(({ dataset, additionalDatasets = [], dateTime }) =>
  (dataset ? [dataset, ...additionalDatasets] : additionalDatasets).map(sample => sample.datePublished ?? dateTime),
)
const datasetLastmod = [datasetCatalog.updatedDate, ...datasetPublicationDates].sort().at(-1)

// ── Live core pages ──────────────────────────────────────────────────────────
const CORE = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/product', lastmod: product.updatedDate, changefreq: 'monthly', priority: '0.8' },
  { loc: '/data-coverage', lastmod: coverage.checkedDate, changefreq: 'monthly', priority: '0.8' },
  { loc: '/contact', lastmod: '2026-11-24', changefreq: 'monthly', priority: '0.7' },
  { loc: '/probe', changefreq: 'monthly', priority: '0.7' },
  { loc: '/blog', lastmod: blogLastmod, changefreq: 'weekly', priority: '0.8' },
  { loc: '/glossary', changefreq: 'weekly', priority: '0.8' },
  { loc: '/research', lastmod: research.updatedDate, changefreq: 'monthly', priority: '0.85' },
  { loc: '/resources', changefreq: 'weekly', priority: '0.85' },
  { loc: '/datasets', lastmod: datasetLastmod, changefreq: 'monthly', priority: '0.7' },
  { loc: '/compliance', changefreq: 'weekly', priority: '0.9' },
  { loc: '/trust', changefreq: 'monthly', priority: '0.6' },
  { loc: '/about', lastmod: '2026-11-24', changefreq: 'monthly', priority: '0.7' },
  { loc: '/charter', lastmod: '2026-11-24', changefreq: 'monthly', priority: '0.7' },
  { loc: '/regulators', changefreq: 'monthly', priority: '0.85' },
  { loc: '/timeline', changefreq: 'monthly', priority: '0.9' },
  { loc: '/calculators/faa-part-450-timeline', changefreq: 'monthly', priority: '0.85' },
  { loc: '/calculators/nrc-license-timeline', changefreq: 'monthly', priority: '0.85' },
  { loc: '/calculators/fcc-deorbit-feasibility', changefreq: 'monthly', priority: '0.85' },
  { loc: '/calculators/data-center-power-capacity', lastmod: '2026-11-23', changefreq: 'monthly', priority: '0.85' },
  { loc: '/calculators/data-center-water-use', lastmod: '2026-11-24', changefreq: 'monthly', priority: '0.85' },
  { loc: '/calculators/aep-ohio-data-center-demand-charge', lastmod: '2026-11-24', changefreq: 'monthly', priority: '0.85' },
  { loc: '/calculators/data-center-power-delivery-schedule', lastmod: '2026-11-23', changefreq: 'monthly', priority: '0.85' },
  { loc: '/calculators/net-effective-rent', lastmod: '2026-11-24', changefreq: 'monthly', priority: '0.85' },
  { loc: '/calculators/commercial-refinance-gap', lastmod: '2026-11-24', changefreq: 'monthly', priority: '0.85' },
  { loc: '/calculators/battery-recharge-window', lastmod: '2026-11-24', changefreq: 'monthly', priority: '0.85' },
  { loc: '/calculators', changefreq: 'monthly', priority: '0.8' },
]

const BLOG = [
  ...blogCollections.map(collection => ({ loc: `/blog/${collection.slug}`, lastmod: collection.updatedDate, changefreq: 'monthly', priority: '0.8' })),
  { loc: '/blog/part100-vs-part53-siting', changefreq: 'monthly', priority: '0.75' },
  { loc: '/blog/seismic-design-shift', changefreq: 'monthly', priority: '0.75' },
]
const industryUrls = [
  ...['data-center-compliance', 'oil-gas-compliance'].map(slug => ({ loc: `/${slug}`, changefreq: 'monthly', priority: '0.85', lastmod: '2026-09-15' })),
  { loc: '/data-centre-compliance-india', changefreq: 'monthly', priority: '0.85', lastmod: '2026-11-21' },
  ...industryArticles.map(article => ({ loc: `/blog/${article.slug}`, changefreq: 'monthly', priority: '0.8', lastmod: article.updatedDate ?? article.dateTime })),
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
  lastmod: e.last_updated,
  changefreq: 'monthly',
  priority: '0.7',
}))

// ── Compose ──────────────────────────────────────────────────────────────────
const all = [...CORE, ...entries, ...BLOG, ...industryUrls, ...glossaryUrls]

// Deduplicate by loc, last write wins.
const seen = new Map()
for (const u of all) seen.set(u.loc, u)
const unique = Array.from(seen.values())

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${unique
  .map(
    (u) =>
      `  <url><loc>${SITE}${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}<changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`,
  )
  .join('\n')}
</urlset>
`

writeFileSync(join(ROOT, 'public/sitemap.xml'), xml)
console.log(`sitemap.xml regenerated: ${unique.length} URLs`)
