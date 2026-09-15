import { Link } from 'react-router-dom'
import { RESOURCE_ARTICLES } from '../data/resources'
import '../pages/blog/BlogArticle.css'

export default function BlogArticleHeader({ slug, title, subtitle }: { slug: string; title: string; subtitle: string }) {
  const article = RESOURCE_ARTICLES.find((entry) => entry.slug === slug)!
  return (
    <header className="blog-article-header">
      <nav className="blog-article-breadcrumbs" aria-label="Breadcrumb">
        <Link to="/resources">Resources</Link><span aria-hidden="true">/</span><Link to="/blog">Articles</Link>
      </nav>
      <div className="blog-article-heading">
        <div className="blog-article-meta"><span>{article.topic} / Field notes</span><time dateTime={article.dateTime}>{article.date}</time></div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="blog-article-cover">
        <img src={article.image} alt="" width="1600" height="900" fetchPriority="high" decoding="async" />
        <span aria-hidden="true" className="blog-article-cover-mark">Invariant / {article.topic}</span>
      </div>
    </header>
  )
}

export function BlogRelatedReading({ slug }: { slug: string }) {
  const current = RESOURCE_ARTICLES.find((article) => article.slug === slug)!
  const related = RESOURCE_ARTICLES.filter((article) => article.slug !== slug).sort((a, b) => Number(b.topic === current.topic) - Number(a.topic === current.topic)).slice(0, 2)
  return (
    <aside className="blog-related-reading" aria-label="Related articles">
      <div className="blog-related-heading"><h2>Keep reading.</h2><Link to="/blog">All articles <span aria-hidden="true">↗</span></Link></div>
      <div className="blog-related-grid">
        {related.map((article) => <Link key={article.slug} className="blog-related-card" to={`/blog/${article.slug}`}>
          <div><span>{article.topic}</span><h3>{article.title}</h3><span className="blog-related-read">Read the article <span aria-hidden="true">↗</span></span></div>
          <img src={article.image} alt="" width="160" height="180" loading="lazy" decoding="async" />
        </Link>)}
      </div>
    </aside>
  )
}
