#!/usr/bin/env node
// Build-time prerender — generates per-route static HTML files in dist/.
//
// Why: react-helmet-async sets <title>, OG, Twitter, canonical, and JSON-LD
// only after JS runs. Social crawlers (Twitter, LinkedIn, Slack, Discord,
// even some smaller search bots) often don't execute JS — they only see
// the meta tags in the initial HTML, which without prerendering means
// every page shares the generic homepage card.
//
// This script reads page-registry + cluster JSON + glossary.json and writes
// dist/{slug}/index.html for every live route, with the correct head content.
// Vercel serves these static files first, then falls back to the SPA rewrite.
//
// Industry guides and hubs also include their complete rendered page bodies.
// Existing routes retain the client-rendered body with prerendered metadata.

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createServer } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DIST = join(ROOT, 'dist')
const SITE = 'https://invariant-ai.com'
const SITE_METADATA = JSON.parse(readFileSync(join(ROOT, 'src/data/siteMetadata.json'), 'utf8'))

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;')
}

// ── Schemas (duplicated from Seo.tsx, kept in sync manually) ──────────────
const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE}/#organization`,
  name: 'Invariant',
  alternateName: ['Invariant AI'],
  url: SITE,
  logo: `${SITE}${SITE_METADATA.image}`,
  image: `${SITE}${SITE_METADATA.image}`,
  description:
    'Autonomous agents for mission-critical compliance across aerospace, energy, data centers, and oil and gas.',
  foundingDate: '2025',
  email: 'founders@invariant-ai.com',
  funder: { '@type': 'Organization', name: 'Entrepreneurs First', url: 'https://www.joinef.com' },
  sameAs: ['https://www.linkedin.com/company/invariant-ai', 'https://www.joinef.com'],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'business',
    email: 'founders@invariant-ai.com',
    url: `${SITE}/contact`,
    availableLanguage: ['English'],
  },
}

const EDITORIAL_TEAM = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE}/#editorial-team`,
  name: 'Invariant editorial team',
  parentOrganization: { '@id': `${SITE}/#organization` },
}

function articleSchema(args) {
  const about = (args.aboutSlugs || []).map((slug) => ({
    '@type': 'DefinedTerm',
    '@id': `${SITE}/glossary/${slug}`,
  }))
  const obj = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: args.title,
    description: args.description,
    image: args.image || `${SITE}${SITE_METADATA.image}`,
    datePublished: args.datePublished,
    dateModified: args.dateModified || args.datePublished,
    author: { '@id': `${SITE}/#editorial-team` },
    editor: { '@id': `${SITE}/#editorial-team` },
    reviewedBy: { '@id': `${SITE}/#editorial-team` },
    publisher: { '@id': `${SITE}/#organization` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': args.url },
    inLanguage: 'en',
  }
  if (args.articleSection) obj.articleSection = args.articleSection
  if (args.keywords?.length) obj.keywords = args.keywords.join(', ')
  if (about.length) obj.about = about
  if (args.spatialCoverage?.length)
    obj.spatialCoverage = args.spatialCoverage.map((name) => ({ '@type': 'Place', name }))
  return obj
}

function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  }
}

function definedTerm(entry) {
  const url = `${SITE}/glossary/${entry.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': url,
    name: entry.term,
    alternateName: entry.aliases,
    description: entry.short_definition,
    url,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      '@id': `${SITE}/glossary#defined-term-set`,
      name: 'Invariant compliance glossary',
      url: `${SITE}/glossary`,
    },
  }
}

function howToSchema(args) {
  const slugify = (s) =>
    String(s).toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 64)
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${args.url}#howto`,
    name: args.name,
    description: args.description,
    step: args.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      ...(s.text ? { text: s.text } : {}),
      url: `${args.url}#${slugify(s.name)}`,
    })),
  }
}

const HOW_TO_SLUGS = new Set([
  'how-to-write-a-psar',
  'how-to-write-faa-part-450-means-of-compliance',
  'how-to-draft-itu-coordination-filing',
  'fcc-schedule-s',
  'itar-commodity-jurisdiction',
])

// ── Override the index.html head with per-page metadata ───────────────────
function customizeHtml(template, opts) {
  const { title, description, canonical, ogImage, ogType = 'article', jsonLd = [] } = opts
  const fullTitle = title.includes('Invariant') ? title : `${title} | Invariant`
  let out = template

  out = out.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(fullTitle)}</title>`)
  out = out.replace(
    /<meta name="description"[^>]*\/?>/,
    `<meta name="description" content="${escapeAttr(description)}" />`,
  )
  out = out.replace(
    /<link rel="canonical"[^>]*\/?>/,
    `<link rel="canonical" href="${escapeAttr(canonical)}" />`,
  )
  out = out.replace(
    /<meta property="og:title"[^>]*\/?>/,
    `<meta property="og:title" content="${escapeAttr(fullTitle)}" />`,
  )
  out = out.replace(
    /<meta property="og:description"[^>]*\/?>/,
    `<meta property="og:description" content="${escapeAttr(description)}" />`,
  )
  out = out.replace(
    /<meta property="og:image"[^>]*\/?>/,
    `<meta property="og:image" content="${escapeAttr(ogImage)}" />`,
  )
  out = out.replace(
    /<meta property="og:url"[^>]*\/?>/,
    `<meta property="og:url" content="${escapeAttr(canonical)}" />`,
  )
  out = out.replace(
    /<meta property="og:type"[^>]*\/?>/,
    `<meta property="og:type" content="${ogType}" />`,
  )
  out = out.replace(
    /<meta name="twitter:title"[^>]*\/?>/,
    `<meta name="twitter:title" content="${escapeAttr(fullTitle)}" />`,
  )
  out = out.replace(
    /<meta name="twitter:description"[^>]*\/?>/,
    `<meta name="twitter:description" content="${escapeAttr(description)}" />`,
  )
  out = out.replace(
    /<meta name="twitter:image"[^>]*\/?>/,
    `<meta name="twitter:image" content="${escapeAttr(ogImage)}" />`,
  )

  // Inject JSON-LD scripts just before </head>
  const ldHtml = jsonLd
    .map((d) => `<script type="application/ld+json">${JSON.stringify(d)}</script>`)
    .join('\n    ')
  out = out.replace('</head>', `    ${ldHtml}\n  </head>`)

  return out
}

// ── Parse page-registry to get pillar + cluster meta ───────────────────────
function parseRegistry() {
  const text = readFileSync(join(ROOT, 'src/data/page-registry.ts'), 'utf8')
  const Q = `(?:'([^']+)'|"([^"]+)")`
  const re = new RegExp(
    `\\{\\s*slug:\\s*${Q},\\s*title:\\s*${Q},(?:\\s*shortTitle:\\s*${Q},)?\\s*description:\\s*\\n?\\s*${Q},\\s*pillar:\\s*${Q},\\s*type:\\s*${Q},\\s*live:\\s*(true|false)`,
    'g',
  )
  const pages = []
  let m
  while ((m = re.exec(text))) {
    const pick = (i) => m[i] ?? m[i + 1]
    if (m[13] !== 'true') continue
    pages.push({
      slug: pick(1),
      title: pick(3),
      shortTitle: pick(5),
      description: pick(7),
      pillar: pick(9),
      type: pick(11),
    })
  }
  return pages
}

// ── Load pillar/cluster JSON data for a slug, if it exists ─────────────────
const PILLAR_DATA_MAP = {
  'space-compliance': 'space-pillar.json',
  'nuclear-compliance': 'nuclear-pillar.json',
  'part-50-vs-52-vs-53': 'part-50-52-53-pillar.json',
  'faa-part-450-license-timeline': 'faa-part-450-timeline-pillar.json',
  'nrc-part-73-security': 'nrc-part-73-security-pillar.json',
  'itaac-closure': 'itaac-closure-pillar.json',
  'nrc-rai-management': 'nrc-rai-management-pillar.json',
  'part-53-subparts': 'part-53-subparts-pillar.json',
  'how-to-write-a-psar': 'how-to-write-a-psar-pillar.json',
  'faa-vehicle-operator-license': 'faa-vehicle-operator-license-pillar.json',
  'itu-bringing-into-use': 'itu-bringing-into-use-pillar.json',
  'fcc-schedule-s': 'fcc-schedule-s-pillar.json',
  'itar-commodity-jurisdiction': 'itar-commodity-jurisdiction-pillar.json',
  'itar-vs-ear-for-space-companies': 'itar-vs-ear-pillar.json',
  'nrc-pre-application-engagement-guide': 'nrc-pre-application-pillar.json',
  'nuclear-compliance-india': 'nuclear-compliance-india-pillar.json',
  'fcc-5-year-deorbit-rule': 'fcc-5-year-deorbit-pillar.json',
  'space-compliance-india': 'space-compliance-india-pillar.json',
  'nuclear-compliance-japan': 'nuclear-compliance-japan-pillar.json',
  'how-long-does-nrc-license-take': 'nrc-license-timeline-pillar.json',
  'ecss-vs-mil-std': 'ecss-vs-mil-std-pillar.json',
  'faa-part-450-vs-legacy': 'part-450-vs-legacy-pillar.json',
  'faa-ac-450-series': 'faa-ac-450-series-pillar.json',
  'how-to-write-faa-part-450-means-of-compliance': 'faa-part-450-means-of-compliance-pillar.json',
  'noaa-remote-sensing-license-tiers': 'noaa-tiers-pillar.json',
  'advanced-reactor-licensing-eu': 'advanced-reactor-licensing-eu-pillar.json',
  'space-compliance-eu': 'space-compliance-eu-pillar.json',
  'how-to-draft-itu-coordination-filing': 'how-to-draft-itu-coordination-filing-pillar.json',
  'space-law-firms': 'space-law-firms.json',
  'fcc-satellite-licensing': 'fcc-satellite-licensing.json',
  'aegis-space-law-alternative': 'aegis-space-law-alternative.json',
  'satellite-licensing-services': 'satellite-licensing-services.json',
  'nuclear-licensing-consultants': 'nuclear-licensing-consultants.json',
}

function readPillarData(slug) {
  const file = PILLAR_DATA_MAP[slug]
  if (!file) return null
  const path = join(ROOT, 'src/pages/_data', file)
  if (!existsSync(path)) return null
  return JSON.parse(readFileSync(path, 'utf8'))
}

// ── Write one route ────────────────────────────────────────────────────────
function writeRoute(template, slug, opts) {
  let out = customizeHtml(template, opts)
  if (opts.bodyHtml) out = out.replace('<div id="root"></div>', () => `<div id="root">${opts.bodyHtml}</div>`)
  const stylesheets = (opts.stylesheets ?? []).filter(file => !out.includes(`href="/${escapeAttr(file)}"`))
  if (stylesheets.length) out = out.replace('</head>', `${stylesheets.map(file => `<link rel="stylesheet" href="/${escapeAttr(file)}">`).join('\n')}\n</head>`)
  const dir = join(DIST, slug)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), out)
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  const template = readFileSync(join(DIST, 'index.html'), 'utf8')
  const today = new Date().toISOString().slice(0, 10)
  let written = 0

  // Core pages (Home is dist/index.html; we customize its head too)
  const HOME_JSONLD = [
    ORG_SCHEMA,
    EDITORIAL_TEAM,
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: SITE,
      name: 'Invariant',
      publisher: { '@id': `${SITE}/#organization` },
      inLanguage: 'en',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE}/probe?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    breadcrumbSchema([{ name: 'Invariant', url: `${SITE}/` }]),
  ]
  writeFileSync(
    join(DIST, 'index.html'),
    customizeHtml(template, {
      title: SITE_METADATA.title,
      description:
        SITE_METADATA.description,
      canonical: `${SITE}/`,
      ogImage: `${SITE}${SITE_METADATA.image}`,
      ogType: 'website',
      jsonLd: HOME_JSONLD,
    }),
  )
  written++

  const SIMPLE_PAGES = [
    {
      slug: 'product',
      title: 'Platform | Invariant',
      description:
        'See Invariant draft, cite, and review regulatory work against your project corpus. Autonomous agents for mission-critical compliance.',
      ogImage: `${SITE}${SITE_METADATA.image}`,
    },
    {
      slug: 'timeline',
      title: 'Mission timeline: every filing between you and launch',
      description:
        'Enter your company website. An agent reads the public record and derives your full US and India regulatory filing plan: FCC, NOAA, ITAR and EAR, FAA, IN-SPACe, with the real review clocks, fees, and failure modes for each filing.',
      ogImage: `${SITE}${SITE_METADATA.image}`,
    },
    {
      slug: 'probe',
      title: 'Probe: Live semantic search over NRC ADAMS, powered by Helion-512',
      description:
        'Try Probe, the public semantic search interface over NRC ADAMS powered by Helion-512, the published state of the art on the FermiBench retrieval benchmark.',
      ogImage: `${SITE}${SITE_METADATA.image}`,
    },
    {
      slug: 'blog',
      title: 'Articles | Research on mission-critical compliance',
      description:
        'Practical research on data-center, oil and gas, space, and nuclear compliance. Explore siting, permitting, operating records, and the evidence behind approvals.',
      ogImage: `${SITE}${SITE_METADATA.image}`,
    },
    {
      slug: 'resources',
      title: 'Resources | Research, guides, and tools for mission-critical compliance',
      description:
        'Research, regulatory guides, and planning tools for data centers, oil and gas, space, and nuclear programs. Explore the work behind the path to approval.',
      ogImage: `${SITE}${SITE_METADATA.image}`,
    },
    {
      slug: 'contact',
      title: 'Talk to an expert | Invariant',
      description: 'Tell us about your mission and the regulatory work ahead. Talk with the Invariant team about autonomous agents for mission-critical compliance.',
      ogImage: `${SITE}${SITE_METADATA.image}`,
    },
    {
      slug: 'research',
      title: 'Research: Helion-512, FermiBench, published notes',
      description:
        "Invariant's research: Helion-512 retrieval model at 0.97 nDCG@10 on FermiBench, siting comparisons, seismic design analyses, and field notes from regulator dockets.",
      ogImage: `${SITE}${SITE_METADATA.image}`,
    },
    {
      slug: 'compliance',
      title: 'Compliance library: every Invariant resource for space, nuclear, and aerospace',
      description:
        'The complete Invariant library: pillar guides, cluster explainers, and 90+ glossary definitions for space, nuclear, and aerospace regulatory and qualification compliance.',
      ogImage: `${SITE}${SITE_METADATA.image}`,
    },
    {
      slug: 'trust',
      title: 'Trust: Security, data handling, and compliance disclosures',
      description:
        'How Invariant handles your data, hosts your regulatory submissions, and meets the security expectations of space, aerospace, and nuclear operators.',
      ogImage: `${SITE}${SITE_METADATA.image}`,
    },
    {
      slug: 'about',
      title: 'About Invariant: Autonomous AI agents for compliance in mission-critical industries',
      description:
        'Invariant builds autonomous AI agents for regulatory and qualification compliance in space, aerospace, and nuclear. Backed by Entrepreneur First, Transpose Platform, Boundless Ventures, and NPU Ventures. Founded 2025.',
      ogImage: `${SITE}${SITE_METADATA.image}`,
    },
    {
      slug: 'charter',
      title: 'Why We Exist | Invariant',
      description:
        'Why we are building Invariant: a clear path from engineering breakthroughs to approved missions. A letter from Parthiv and Pranav.',
      ogImage: `${SITE}${SITE_METADATA.image}`,
    },
    {
      slug: 'regulators',
      title: 'Regulators directory: every US agency for space, nuclear, and aerospace compliance',
      description:
        'A concise directory of every US regulator a space, nuclear, or aerospace operator may need to engage with, including NRC, FAA AST, FCC Space Bureau, NOAA CRSRA, DDTC, and BIS.',
      ogImage: `${SITE}${SITE_METADATA.image}`,
    },
  ]
  for (const sp of SIMPLE_PAGES) {
    const canonical = `${SITE}/${sp.slug}`
    writeRoute(template, sp.slug, {
      title: sp.title,
      description: sp.description,
      canonical,
      ogImage: sp.ogImage,
      ogType: sp.slug === 'charter' ? 'article' : 'website',
      jsonLd: [
        ORG_SCHEMA,
        EDITORIAL_TEAM,
        breadcrumbSchema([
          { name: 'Invariant', url: `${SITE}/` },
          { name: sp.slug.charAt(0).toUpperCase() + sp.slug.slice(1), url: canonical },
        ]),
      ],
    })
    written++
  }

  // Article heads mirror each page's Seo values. The existing SPA renders
  // the body; these files also expose article metadata without JavaScript.
  const BLOG_ARTICLES = [
    {
      slug: 'space-compliance-tam',
      title: 'The $1.8 Trillion Space Industry Has a $52 Billion Toll Gate',
      description: 'A breakdown of the space compliance market, from launch licensing to satellite operations, and the cost of getting to orbit.',
      image: 'space-tam.png',
      datePublished: '2026-06-03',
    },
    {
      slug: 'nuclear-compliance-tam',
      title: 'The $35 Billion Problem Nobody Is Talking About in Nuclear',
      description: 'The market for nuclear compliance work, broken down by regulator, design phase, and the next generation of reactors.',
      image: 'nuclear-tam.png',
      datePublished: '2026-06-02',
    },
    {
      slug: 'fermibench-sota',
      title: 'Invariant Sets State-of-the-Art on FermiBench',
      description: 'Our domain-adapted retrieval model Helion-512 reaches 0.97 nDCG@10 on FermiBench, the only published retrieval benchmark for the nuclear regulatory domain, up from the previous best of 0.74.',
      image: 'fermibench.jpg',
      datePublished: '2026-04-01',
    },
    {
      slug: 'seismic-design-shift',
      title: 'SSE/OBE to GMRS/SDC: the seismic design shift to Part 53',
      description: 'The deterministic two-tier framework that governed nuclear seismic design for fifty years is replaced by risk-tiered ground motions and seismic design categories. A regulation-to-regulation comparison of every substantive change.',
      image: 'seismic.jpg',
      datePublished: '2026-03-29',
    },
    {
      slug: 'part100-vs-part53-siting',
      title: '10 CFR Part 100 vs Part 53 Subpart D: a siting comparison',
      description: 'A line-by-line comparison of the legacy siting criteria in 10 CFR Part 100 against the new technology-inclusive framework in 10 CFR Part 53 Subpart D: exclusion areas, seismic methodology, and the siting-design integration mandate.',
      image: 'siting.jpg',
      datePublished: '2026-03-27',
    },
  ]
  for (const post of BLOG_ARTICLES) {
    const canonical = `${SITE}/blog/${post.slug}`
    const ogImage = `${SITE}/blog/${post.image}`
    writeRoute(template, `blog/${post.slug}`, {
      title: post.title,
      description: post.description,
      canonical,
      ogImage,
      ogType: 'article',
      jsonLd: [
        ORG_SCHEMA,
        EDITORIAL_TEAM,
        articleSchema({ title: post.title, description: post.description, url: canonical, image: ogImage, datePublished: post.datePublished }),
        breadcrumbSchema([
          { name: 'Invariant', url: `${SITE}/` },
          { name: 'Articles', url: `${SITE}/blog` },
          { name: post.title, url: canonical },
        ]),
      ],
    })
    written++
  }

  // Pillars + clusters
  const pages = parseRegistry()
  for (const p of pages) {
    if (p.type !== 'pillar' && p.type !== 'cluster') continue
    const data = readPillarData(p.slug)
    const title = data?.meta_title || data?.h1 || p.title
    const description = data?.meta_description || p.description
    const canonical = `${SITE}/${p.slug}`
    const ogImage = `${SITE}/og/${p.slug}.png`
    const jsonLd = [
      ORG_SCHEMA,
      EDITORIAL_TEAM,
      articleSchema({
        title: data?.h1 || p.title,
        description,
        url: canonical,
        datePublished: today,
        articleSection:
          p.pillar === 'nuclear'
            ? 'Nuclear compliance'
            : p.pillar === 'space'
              ? 'Space compliance'
              : 'Aerospace compliance',
      }),
      breadcrumbSchema([
        { name: 'Invariant', url: `${SITE}/` },
        { name: p.shortTitle || p.title, url: canonical },
      ]),
    ]
    if (data?.faqs?.length) jsonLd.push(faqSchema(data.faqs))
    if (HOW_TO_SLUGS.has(p.slug) && data?.sections?.length) {
      jsonLd.push(
        howToSchema({
          name: data.h1 || p.title,
          description: data.meta_description || p.description,
          url: canonical,
          steps: data.sections.map((s) => ({
            name: s.heading,
            text: s.paragraphs && s.paragraphs[0] ? s.paragraphs[0].slice(0, 280) : undefined,
          })),
        }),
      )
    }
    writeRoute(template, p.slug, {
      title,
      description,
      canonical,
      ogImage,
      ogType: 'article',
      jsonLd,
    })
    written++
  }

  // Glossary index
  const glossary = JSON.parse(readFileSync(join(ROOT, 'src/pages/_data/glossary.json'), 'utf8'))
  const entries = glossary.entries || []
  const definedTermSet = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': `${SITE}/glossary#defined-term-set`,
    name: 'Invariant compliance glossary',
    url: `${SITE}/glossary`,
    hasDefinedTerm: entries.map((e) => ({
      '@type': 'DefinedTerm',
      '@id': `${SITE}/glossary/${e.slug}`,
      name: e.term,
      alternateName: e.aliases,
      description: e.short_definition,
      url: `${SITE}/glossary/${e.slug}`,
    })),
  }
  writeRoute(template, 'glossary', {
    title: 'Glossary of space, aerospace, and nuclear compliance terms',
    description:
      'Authoritative, citation-backed definitions of every regulatory, standards, and qualification term in space, aerospace, and nuclear.',
    canonical: `${SITE}/glossary`,
    ogImage: `${SITE}/og/glossary.png`,
    ogType: 'website',
    jsonLd: [
      ORG_SCHEMA,
      definedTermSet,
      breadcrumbSchema([
        { name: 'Invariant', url: `${SITE}/` },
        { name: 'Glossary', url: `${SITE}/glossary` },
      ]),
    ],
  })
  written++

  // Glossary entries
  for (const e of entries) {
    const slug = `glossary/${e.slug}`
    const canonical = `${SITE}/${slug}`
    writeRoute(template, slug, {
      title: `${e.term} | Definition`,
      description: e.short_definition,
      canonical,
      ogImage: `${SITE}/og/glossary/${e.slug}.png`,
      ogType: 'article',
      jsonLd: [
        ORG_SCHEMA,
        definedTerm(e),
        breadcrumbSchema([
          { name: 'Invariant', url: `${SITE}/` },
          { name: 'Glossary', url: `${SITE}/glossary` },
          { name: e.term, url: canonical },
        ]),
      ],
    })
    written++
  }

  // Render the new guides and hubs from their actual React components.
  // Every visitor receives the same complete article HTML, including sources.
  const renderer = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
    ssr: {
      noExternal: ['react-router-dom', 'react-router', 'react-helmet-async'],
      resolve: { conditions: ['module', 'module-sync', 'node', 'development'] },
    },
  })
  try {
    const { industryPages } = await renderer.ssrLoadModule('/src/entry-industry-prerender.tsx')
    const manifest = JSON.parse(readFileSync(join(DIST, '.vite/manifest.json'), 'utf8'))
    const cssFor = (key, seen = new Set()) => {
      if (seen.has(key)) return []
      seen.add(key)
      const chunk = manifest[key]
      return chunk ? [...chunk.css ?? [], ...(chunk.imports ?? []).flatMap(dep => cssFor(dep, seen))] : []
    }
    for (const page of industryPages()) {
      writeRoute(template, page.slug, { ...page, stylesheets: [...new Set(cssFor(page.source))] })
      written++
    }
  } finally { await renderer.close() }

  console.log(`prerender: wrote ${written} per-route HTML files in dist/`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
