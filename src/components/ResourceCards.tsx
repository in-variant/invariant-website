import { Link } from 'react-router-dom'
import type { ResourceArticle } from '../data/resources'

export function ResourceArrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg className="resource-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {diagonal ? <path d="M5 19 19 5M5 5h14v14" /> : <path d="M4 12h15m-6-6 6 6-6 6" />}
    </svg>
  )
}

export function ResourceArticleCard({ article }: { article: ResourceArticle }) {
  return (
    <article className="resource-article-card">
      <Link to={`/blog/${article.slug}`} className="resource-article-link">
        <div className="resource-article-image">
          <img src={article.image} alt="" loading="lazy" decoding="async" width="1600" height="900" />
          <span className="resource-image-corner" aria-hidden="true"><ResourceArrow diagonal /></span>
        </div>
        <div className="resource-article-copy">
          <div className="resource-meta"><span>{article.topic}</span><time dateTime={article.dateTime}>{article.date}</time></div>
          <h3>{article.title}</h3>
          <p>{article.summary}</p>
          <span className="resource-read-link">Read the article <ResourceArrow /></span>
        </div>
      </Link>
    </article>
  )
}
