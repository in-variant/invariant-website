import { createContext, useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import siteMetadata from '../data/siteMetadata.json'
import type { ResourceDataset } from '../data/resources'

export const SITE_URL = 'https://invariant-ai.com'
export const DEFAULT_OG = `${SITE_URL}${siteMetadata.image}`

export type SeoProps = {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  ogImageAlt?: string
  allowLargeImagePreview?: boolean
  jsonLd?: object | object[]
  noindex?: boolean
  ogType?: 'website' | 'article'
  markdown?: string
  feed?: string
}

export const PrerenderSeo = createContext<((props: SeoProps) => void) | null>(null)

export function Seo({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG,
  ogImageAlt,
  allowLargeImagePreview,
  jsonLd,
  noindex,
  ogType = 'website',
  markdown,
  feed,
}: SeoProps) {
  const collectSeo = useContext(PrerenderSeo)
  useEffect(() => {
    document.head.querySelectorAll('[data-prerender-seo]').forEach(tag => tag.remove())
  }, [])
  if (collectSeo) {
    collectSeo({ title, description, canonical, ogImage, ogImageAlt, allowLargeImagePreview, jsonLd, noindex, ogType, markdown, feed })
    return null
  }
  const fullTitle = title.includes('Invariant') ? title : `${title} | Invariant`
  const url = canonical || SITE_URL
  const ld = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []
  const robots = noindex ? 'noindex,nofollow' : allowLargeImagePreview ? 'max-image-preview:large' : undefined
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      {markdown && <link rel="alternate" type="text/markdown" href={markdown} title="Markdown for AI agents" />}
      {feed && <link rel="alternate" type="application/atom+xml" href={feed} title="Invariant Blog" />}
      {robots && <meta name="robots" content={robots} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      {ogImageAlt && <meta property="og:image:alt" content={ogImageAlt} />}
      {!noindex && <meta property="og:url" content={url} />}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Invariant" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {ogImageAlt && <meta name="twitter:image:alt" content={ogImageAlt} />}
      {ld.map((d, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(d)}</script>
      ))}
    </Helmet>
  )
}

// -------- JSON-LD schemas --------

const orgIdentity = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Invariant',
  alternateName: ['Invariant AI'],
  url: SITE_URL,
  logo: `${SITE_URL}/og/home.png`,
  image: DEFAULT_OG,
  foundingDate: '2025',
  email: 'founders@invariant-ai.com',
  funder: {
    '@type': 'Organization',
    name: 'Entrepreneurs First',
    url: 'https://www.joinef.com',
  },
  sameAs: ['https://www.linkedin.com/company/invariant-ai'],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'business',
    email: 'founders@invariant-ai.com',
    url: `${SITE_URL}/contact`,
    availableLanguage: ['English'],
  },
}

export const ORG_SCHEMA = {
  ...orgIdentity,
  description:
    'Invariant Earth provides source-linked data for U.S. properties and infrastructure. Invariant helps teams evaluate sites, power availability, and property risk.',
}

// The live homepage retains its current positioning until the new homepage is released.
export const HOME_ORG_SCHEMA = {
  ...orgIdentity,
  description:
    'Autonomous agents for the physical economy, handling regulatory work across aerospace, energy, data centers, and oil and gas.',
  sameAs: [...orgIdentity.sameAs, 'https://www.joinef.com'],
  knowsAbout: [
    'Space compliance',
    'Nuclear compliance',
    'Aerospace compliance',
    'Data center compliance',
    'Oil and gas compliance',
    'FAA 14 CFR Part 450',
    'FCC 47 CFR Part 25',
    'NOAA Commercial Remote Sensing Licensing',
    'IN-SPACe NGP 2024',
    'IN-SPACe authorisation',
    'ECSS standards',
    'NASA GEVS (GSFC-STD-7000)',
    'MIL-STD-1540',
    'MIL-STD-461',
    'NRC 10 CFR Part 50',
    'NRC 10 CFR Part 52',
    'NRC 10 CFR Part 53',
    'NRC 10 CFR Part 100',
    'IAEA SSR-2/1',
    'Preliminary Safety Analysis Report',
    'Final Safety Analysis Report',
    'Request for Additional Information (RAI)',
    'Environmental qualification',
    'Information retrieval for nuclear regulatory documents',
  ],
  knowsLanguage: ['en'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Invariant compliance agents',
    itemListElement: [
      { '@type': 'Offer', name: 'Space regulatory submission automation' },
      { '@type': 'Offer', name: 'Nuclear safety analysis report drafting' },
      { '@type': 'Offer', name: 'Aerospace airworthiness compliance' },
    ],
  },
}

export const EDITORIAL_TEAM = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#editorial-team`,
  name: 'Invariant editorial team',
  parentOrganization: { '@id': `${SITE_URL}/#organization` },
  description:
    'Regulatory research and practical compliance guides from the Invariant team.',
}

export const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'Invariant',
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/probe?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

export const DATA_CATALOG = {
  '@type': 'DataCatalog',
  '@id': SITE_URL + '/datasets#catalog',
  name: 'Research datasets',
  url: SITE_URL + '/datasets',
}

const DATA_ENCODING = { CSV: 'text/csv', GeoJSON: 'application/geo+json', JSON: 'application/json' } as const

export function datasetSchema(dataset: ResourceDataset, articleUrl: string, datePublished: string) {
  const url = `${articleUrl}#${dataset.anchor ?? 'dataset'}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': url,
    url,
    identifier: url,
    name: dataset.name,
    description: dataset.description,
    datePublished: dataset.datePublished ?? datePublished,
    creator: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: 'Invariant' },
    publisher: { '@id': `${SITE_URL}/#organization` },
    includedInDataCatalog: DATA_CATALOG,
    isAccessibleForFree: true,
    isBasedOn: dataset.sources,
    ...(dataset.sourceReuse && { usageInfo: `${url}-reuse` }),
    ...(dataset.spatialCoverage && { spatialCoverage: { '@type': 'Place', name: dataset.spatialCoverage } }),
    ...(dataset.temporalCoverage && { temporalCoverage: dataset.temporalCoverage }),
    distribution: dataset.downloads.map(file => ({
      '@type': 'DataDownload',
      name: file.label,
      encodingFormat: DATA_ENCODING[file.format],
      contentUrl: `${SITE_URL}${file.path}`,
    })),
  }
}

export function articleSchema({
  title,
  description,
  abstract,
  url,
  datePublished,
  dateModified,
  image,
  authorName = 'Invariant',
  articleSection,
  keywords,
  aboutSlugs,
  spatialCoverage,
}: {
  title: string
  description: string
  /** Optional long-form TL;DR that LLMs use as the citation snippet. */
  abstract?: string
  url: string
  datePublished: string
  dateModified?: string
  image?: string
  authorName?: string
  articleSection?: string
  keywords?: string[]
  /** Glossary slugs this article is canonically about, links Article to DefinedTerm entities for GEO. */
  aboutSlugs?: string[]
  /** Place name(s) the article specifically covers (e.g. ['India'] or ['European Union','France','Germany']). */
  spatialCoverage?: string[]
}) {
  const about = (aboutSlugs || []).map((slug) => ({
    '@type': 'DefinedTerm',
    '@id': `${SITE_URL}/glossary/${slug}`,
  }))
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    ...(abstract ? { abstract } : {}),
    image: image || DEFAULT_OG,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#editorial-team`,
      name: authorName === 'Invariant' ? 'Invariant editorial team' : authorName,
      url: SITE_URL,
    },
    editor: { '@id': `${SITE_URL}/#editorial-team` },
    reviewedBy: { '@id': `${SITE_URL}/#editorial-team` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    inLanguage: 'en',
    ...(articleSection ? { articleSection } : {}),
    ...(keywords && keywords.length ? { keywords: keywords.join(', ') } : {}),
    ...(about.length ? { about } : {}),
    ...(spatialCoverage && spatialCoverage.length
      ? { spatialCoverage: spatialCoverage.map((name) => ({ '@type': 'Place', name })) }
      : {}),
  }
}

export function howToSchema({
  name,
  description,
  totalTime,
  steps,
  url,
}: {
  name: string
  description: string
  totalTime?: string
  steps: { name: string; text?: string; url?: string }[]
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${url}#howto`,
    name,
    description,
    ...(totalTime ? { totalTime } : {}),
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      ...(s.text ? { text: s.text } : {}),
      ...(s.url ? { url: s.url } : { url: `${url}#${slugify(s.name)}` }),
    })),
  }
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64)
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
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

export function breadcrumbSchema(items: { name: string; url: string }[]) {
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
