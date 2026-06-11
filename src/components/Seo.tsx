import { Helmet } from 'react-helmet-async'

export const SITE_URL = 'https://invariant-ai.com'
const DEFAULT_OG = `${SITE_URL}/og-image.png`

type Props = {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  jsonLd?: object | object[]
  noindex?: boolean
  ogType?: 'website' | 'article'
}

export function Seo({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG,
  jsonLd,
  noindex,
  ogType = 'website',
}: Props) {
  const fullTitle = title.includes('Invariant') ? title : `${title} | Invariant`
  const url = canonical || SITE_URL
  const ld = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Invariant" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {ld.map((d, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(d)}</script>
      ))}
    </Helmet>
  )
}

// -------- JSON-LD schemas --------

export const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Invariant',
  alternateName: ['Invariant AI'],
  url: SITE_URL,
  logo: `${SITE_URL}/og-image.png`,
  image: `${SITE_URL}/og-image.png`,
  description:
    'Autonomous AI agents for compliance in mission-critical industries — space, aerospace, and nuclear.',
  foundingDate: '2025',
  email: 'founders@invariant-ai.com',
  sameAs: ['https://www.linkedin.com/company/invariant-ai', 'https://www.joinef.com'],
  knowsAbout: [
    'Space compliance',
    'Nuclear compliance',
    'Aerospace compliance',
    'FAA Part 450',
    'FCC Part 25',
    'NOAA CSLA',
    'IN-SPACe authorisation',
    'ECSS',
    'NASA GEVS',
    'NRC 10 CFR Part 53',
    'Safety Analysis Reports',
    'Environmental qualification',
  ],
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

export function articleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  image,
  authorName = 'Invariant',
}: {
  title: string
  description: string
  url: string
  datePublished: string
  dateModified?: string
  image?: string
  authorName?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: image || DEFAULT_OG,
    datePublished,
    dateModified: dateModified || datePublished,
    author: { '@type': 'Organization', name: authorName, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'Invariant',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/og-image.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }
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
