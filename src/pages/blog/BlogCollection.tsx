import { Link, useLocation } from 'react-router-dom'
import { ORG_SCHEMA, Seo, SITE_URL, breadcrumbSchema } from '../../components/Seo'
import collections from '../../data/blog-collections.json'
import collectionCoverSrcSets from '../../data/.generated-collection-cover-srcsets.json'
import { groupCollectionGuides } from '../../data/blogCollections'
import { versionedCover } from '../../data/coverImages'
import NotFound from '../NotFound'
import '../Blog.css'
import './BlogCollection.css'

const collectionWidth = 'calc(min(100vw, 1336px) - 2 * clamp(24px, 5vw, 70px))'
const coverSizes = `(max-width: 740px) ${collectionWidth}, calc((${collectionWidth} - clamp(32px, 5vw, 76px)) * .535)`
const coverSrcSets: Partial<Record<string, string>> = collectionCoverSrcSets

export default function BlogCollection() {
  const { pathname } = useLocation()
  const collection = collections.find(item => `/blog/${item.slug}` === pathname.replace(/\/$/, ''))
  if (!collection) return <NotFound />

  const canonical = `${SITE_URL}/blog/${collection.slug}`
  const image = versionedCover(collection.image)
  const srcSet = coverSrcSets[collection.slug]
  const collectionGuides = collection.guides
  const guideGroups = groupCollectionGuides(collectionGuides)
  const namedGuideGroups = guideGroups.filter(group => group.heading)
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
                <a href={collection.worksheet.path} download>
                  {collection.worksheet.label} <span aria-hidden="true">↓</span>
                </a>
                <p>{collection.worksheet.detail}</p>
              </div>
            )}
          </div>
          <figure>
            <img
              src={image}
              srcSet={srcSet}
              sizes={srcSet ? coverSizes : undefined}
              alt={collection.imageAlt}
              width="1600"
              height="900"
              fetchPriority="high"
              decoding="async"
            />
            {collection.imageCaption && <figcaption>{collection.imageCaption}</figcaption>}
          </figure>
        </header>

        {namedGuideGroups.length > 1 && (
          <nav className="blog-collection-jump" aria-label="Jump to a guide topic">
            {namedGuideGroups.map(group => <a href={`#${group.id}`} key={group.id}>{group.heading}</a>)}
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

        <section className="blog-collection-guides" aria-labelledby="collection-guides">
          <h2 id="collection-guides">{collection.guidesTitle}</h2>
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
