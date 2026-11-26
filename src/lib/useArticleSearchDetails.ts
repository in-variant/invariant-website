import { useEffect, useState } from 'react'
import { expandArticleSearchDetails, type ArticleSearchDetails } from '../data/blogSearch'

export function useArticleSearchDetails(searching: boolean) {
  const [details, setDetails] = useState<ArticleSearchDetails | null>()
  const pending = searching && details === undefined

  useEffect(() => {
    if (!pending) return
    let active = true
    import('../data/.generated-blog-search/details.json')
      .then(({ default: content }) => { if (active) setDetails(expandArticleSearchDetails(content)) })
      .catch(() => { if (active) setDetails(null) })
    return () => { active = false }
  }, [pending])

  return { details, pending }
}
