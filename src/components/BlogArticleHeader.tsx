import { Link } from 'react-router-dom'
import type { RelatedArticle } from '../data/industryArticles'
import '../pages/blog/BlogArticle.css'

type ArticleHeaderProps = {
  article: { dateTime: string; date: string; updatedDate?: string; topic: string; image: string }
  title: string
  subtitle: string
  coverCaption?: string
  coverAlt?: string
  coverImage?: { width: number; height: number; srcSet: string }
  siteDetailsId?: string
}

const articleWidth = 'min(1280px, calc(100vw - clamp(48px, 10.42vw, 200px)))'
const listingSizes = `(min-width: 950px) calc((${articleWidth} - clamp(36px, 4vw, 64px)) / 2), ${articleWidth}`
// The tall object-fit crop needs enough pixels for the card height on a landscape cover.
const relatedSizes = '(max-width: 600px) 365px, 420px'
const bylineDate = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

export default function BlogArticleHeader({ article, title, subtitle, coverCaption, coverAlt = '', coverImage, siteDetailsId }: ArticleHeaderProps) {
  const revisionDate = article.updatedDate && article.updatedDate > article.dateTime ? article.updatedDate : undefined
  return (
    <header className={`blog-article-header${siteDetailsId ? ' blog-article-header--site-listing' : ''}`}>
      <nav className="blog-article-breadcrumbs" aria-label="Breadcrumb">
        <Link to="/resources">Resources</Link><span aria-hidden="true">/</span><Link to="/blog">Articles</Link>
      </nav>
      <div className="blog-article-heading">
        <div className="blog-article-meta">
          <span>{article.topic} / Field notes</span>
          <div className="blog-article-dates">
            <span>Published <time dateTime={article.dateTime}>{article.date}</time></span>
            {revisionDate && (
              <span>Updated <time dateTime={revisionDate}>{bylineDate.format(new Date(revisionDate))}</time></span>
            )}
          </div>
        </div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {siteDetailsId && (
          <nav className="blog-site-actions" aria-label="Site listing actions">
            <a href={`#${siteDetailsId}`}>Read site details <span aria-hidden="true">↓</span></a>
            <a href="#site-enquiry">Request a shortlist</a>
          </nav>
        )}
      </div>
      <div className="blog-article-cover">
        <img
          src={article.image}
          srcSet={coverImage?.srcSet}
          sizes={coverImage ? (siteDetailsId ? listingSizes : articleWidth) : undefined}
          alt={coverAlt}
          width={coverImage?.width ?? 1600}
          height={coverImage?.height ?? 900}
          fetchPriority="high"
          decoding="async"
        />
        <span aria-hidden="true" className="blog-article-cover-mark">Invariant / {article.topic}</span>
      </div>
      {coverCaption && <p className="blog-article-image-caption">{coverCaption}</p>}
    </header>
  )
}

export function BlogRelatedReading({ articles }: { articles: RelatedArticle[] }) {
  if (!articles.length) return null

  const featured = articles.slice(0, 2)
  const more = articles.slice(2)
  return (
    <aside className="blog-related-reading" aria-label="Related articles">
      <div className="blog-related-heading"><h2>Keep reading.</h2><Link to="/blog">All articles <span aria-hidden="true">↗</span></Link></div>
      <div className="blog-related-grid">
        {featured.map((article) => <Link key={article.slug} className="blog-related-card" to={`/blog/${article.slug}`}>
          <div><span>{article.topic}</span><h3>{article.title}</h3><span className="blog-related-read">Read the article <span aria-hidden="true">↗</span></span></div>
          <img src={article.image} srcSet={article.srcSet} sizes={article.srcSet ? relatedSizes : undefined}
            alt="" width="160" height="180" loading="lazy" decoding="async" />
        </Link>)}
      </div>
      {more.length > 0 && (
        <ul className="blog-related-list" role="list">
          {more.map(({ slug, title }) => <li key={slug}>
            <Link to={`/blog/${slug}`}>{title} <span aria-hidden="true">↗</span></Link>
          </li>)}
        </ul>
      )}
    </aside>
  )
}
