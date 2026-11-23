import { Link } from 'react-router-dom'
import '../pages/blog/BlogArticle.css'

type ArticleHeaderProps = {
  article: { dateTime: string; date: string; topic: string; image: string }
  title: string
  subtitle: string
  coverCaption?: string
  coverAlt?: string
  siteDetailsId?: string
}

export default function BlogArticleHeader({ article, title, subtitle, coverCaption, coverAlt = '', siteDetailsId }: ArticleHeaderProps) {
  return (
    <header className={`blog-article-header${siteDetailsId ? ' blog-article-header--site-listing' : ''}`}>
      <nav className="blog-article-breadcrumbs" aria-label="Breadcrumb">
        <Link to="/resources">Resources</Link><span aria-hidden="true">/</span><Link to="/blog">Articles</Link>
      </nav>
      <div className="blog-article-heading">
        <div className="blog-article-meta"><span>{article.topic} / Field notes</span><time dateTime={article.dateTime}>{article.date}</time></div>
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
        <img src={article.image} alt={coverAlt} width="1600" height="900" fetchPriority="high" decoding="async" />
        <span aria-hidden="true" className="blog-article-cover-mark">Invariant / {article.topic}</span>
      </div>
      {coverCaption && <p className="blog-article-image-caption">{coverCaption}</p>}
    </header>
  )
}

type RelatedArticle = { slug: string; title: string; topic: string; image: string }

export function BlogRelatedReading({ articles }: { articles: RelatedArticle[] }) {
  return (
    <aside className="blog-related-reading" aria-label="Related articles">
      <div className="blog-related-heading"><h2>Keep reading.</h2><Link to="/blog">All articles <span aria-hidden="true">↗</span></Link></div>
      <div className="blog-related-grid">
        {articles.map((article) => <Link key={article.slug} className="blog-related-card" to={`/blog/${article.slug}`}>
          <div><span>{article.topic}</span><h3>{article.title}</h3><span className="blog-related-read">Read the article <span aria-hidden="true">↗</span></span></div>
          <img src={article.image} alt="" width="160" height="180" loading="lazy" decoding="async" />
        </Link>)}
      </div>
    </aside>
  )
}
