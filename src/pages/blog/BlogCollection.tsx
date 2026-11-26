import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ORG_SCHEMA, Seo, SITE_URL, breadcrumbSchema } from '../../components/Seo'
import { DATA_USE_CASES_SLUG, groupCollectionGuides, type BlogCollectionData } from '../../data/blogCollections'
import { editorialSearchWords, prepareSearch, rankSearch } from '../../data/blogSearch'
import '../../styles/invariant-brand.css'
import '../Blog.css'
import './BlogCollection.css'

const collectionWidth = 'calc(min(100vw, 1336px) - 2 * clamp(24px, 5vw, 70px))'
const coverSizes = `(max-width: 740px) ${collectionWidth}, calc((${collectionWidth} - clamp(32px, 5vw, 76px)) * .535)`

export default function BlogCollection({ collection, trialLinks, children }: {
  collection: BlogCollectionData
  trialLinks?: ReactNode
  children?: ReactNode
}) {
  const canonical = `${SITE_URL}/blog/${collection.slug}`
  const { image, imageSrcSet } = collection
  const collectionGuides = collection.guides
  const canSearch = collection.slug === DATA_USE_CASES_SLUG
  const [query, setQuery] = useState('')
  const [searchReady, setSearchReady] = useState(false)
  const searchInput = useRef<HTMLInputElement>(null)
  useEffect(() => { if (canSearch) setSearchReady(true) }, [canSearch])
  const queryWords = canSearch ? editorialSearchWords(query) : []
  const guideIndex = useMemo(() => canSearch ? prepareSearch(collectionGuides, guide => ({
    title: guide.label,
    relatedTitle: guide.slug,
    metadata: guide.detail,
    details: 'group' in guide && typeof guide.group === 'string' ? guide.group : undefined,
  })) : [], [canSearch, collectionGuides])
  const directMatches = queryWords.length ? rankSearch(guideIndex, queryWords) : collectionGuides
  const matchingGuides = queryWords.length && !directMatches.length
    ? rankSearch(guideIndex, queryWords, { allowPartialMatches: true, longQuestionRanking: true })
    : directMatches
  const guideGroups = groupCollectionGuides(matchingGuides)
  const namedGuideGroups = groupCollectionGuides(collectionGuides).filter(group => group.heading)
  const crumbs = breadcrumbSchema([
    { name: 'Invariant', url: SITE_URL },
    { name: 'Blog', url: `${SITE_URL}/blog` },
    { name: collection.navLabel, url: canonical },
  ])

  return (
    <div className="blog-index blog-collection">
      <Seo
        title={collection.title}
        description={collection.description}
        canonical={canonical}
        ogImage={SITE_URL + image}
        markdown={`/blog/${collection.slug}.md`}
        jsonLd={[ORG_SCHEMA, crumbs, {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: collection.title,
          description: collection.description,
          url: canonical,
          publisher: { '@id': `${SITE_URL}/#organization` },
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: collectionGuides.map((guide, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: guide.label,
              url: `${SITE_URL}/blog/${guide.slug}`,
            })),
          },
        }]}
      />
      <div className="blog-index-inner">
        <nav className="blog-collection-breadcrumb" aria-label="Breadcrumb">
          <Link to="/blog">Blog</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{collection.navLabel}</span>
        </nav>
        <header className="blog-collection-hero">
          <div>
            <h1>{collection.heading}</h1>
            <p>{collection.description}</p>
            {collection.resourceLinks && (
              <div className="blog-collection-resource-links">
                {collection.resourceLinks.map(({ label, href }) => (
                  <Link key={href} to={href}>{label} <span aria-hidden="true">↗</span></Link>
                ))}
              </div>
            )}
            {collection.worksheet && (
              <div className="blog-collection-worksheet">
                <div className="blog-collection-worksheet-links">
                  <a href={collection.worksheet.path} download>
                    {collection.worksheet.label} <span aria-hidden="true">↓</span>
                  </a>
                  {trialLinks}
                </div>
                <p>{collection.worksheet.detail}</p>
              </div>
            )}
          </div>
          <figure>
            <img
              src={image}
              srcSet={imageSrcSet}
              sizes={imageSrcSet ? coverSizes : undefined}
              alt={collection.imageAlt}
              width="1600"
              height="900"
              fetchPriority="high"
              decoding="async"
            />
            {collection.imageCaption && <figcaption>{collection.imageCaption}</figcaption>}
          </figure>
        </header>

        {(namedGuideGroups.length > 1 || children) && (
          <nav className="blog-collection-jump" aria-label="Jump to a guide topic">
            {canSearch && <a href="#collection-guides">Find a guide</a>}
            {children && <a href="#provider-comparisons">Compare providers</a>}
            {children && <a href="#reference-cases">Reference cases</a>}
            {namedGuideGroups.map(group => <a href={`#${group.id}`} key={group.id} onClick={() => {
              if (!queryWords.length) return
              setQuery('')
              requestAnimationFrame(() => document.getElementById(group.id)?.scrollIntoView())
            }}>{group.heading}</a>)}
          </nav>
        )}

        <section className="blog-collection-checks" aria-labelledby="collection-checks">
          <h2 id="collection-checks">{collection.checklistTitle}</h2>
          <dl>
            {collection.checks.map(check => (
              <div key={check.title}>
                <dt>{check.title}</dt>
                <dd>{check.detail}</dd>
              </div>
            ))}
          </dl>
        </section>

        {children}
        <section className="blog-collection-guides" aria-labelledby="collection-guides">
          <h2 id="collection-guides">{collection.guidesTitle}</h2>
          {canSearch && (
            <div className="blog-collection-guide-search" role="search" aria-label="Use-case guides">
              <label className="blog-index-search">
                <span className="sr-only">Search guides</span>
                <input ref={searchInput} type="search" value={query} disabled={!searchReady}
                  placeholder="Try crop history or mortgage filings"
                  onChange={event => setQuery(event.target.value)} />
              </label>
              <p role="status">{matchingGuides.length} {matchingGuides.length === 1 ? 'guide' : 'guides'}</p>
              {matchingGuides.length === 0 && <div className="blog-index-empty">
                <button type="button" onClick={() => { setQuery(''); searchInput.current?.focus() }}>Clear search</button>
              </div>}
            </div>
          )}
          {guideGroups.map(group => (
            <div className="blog-collection-guide-group" key={group.id}>
              {group.heading && <h3 id={group.id}>{group.heading}</h3>}
              <ul>
                {group.guides.map(guide => (
                  <li key={guide.slug}>
                    <Link to={`/blog/${guide.slug}`} aria-describedby={`guide-detail-${guide.slug}`}>
                      {guide.label}<span aria-hidden="true">↗</span>
                    </Link>
                    <p id={`guide-detail-${guide.slug}`}>{guide.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
