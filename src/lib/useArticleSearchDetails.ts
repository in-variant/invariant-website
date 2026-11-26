import { useEffect, useState } from 'react'
import { expandArticleSearchDetails, type ArticleSearchDetails, type PackedArticleSearchDetails } from '../data/blogSearch'

const loadArticleDetails = () => import('../data/.generated-blog-search/details.json')
const loadDatasetDetails = () => import('../data/.generated-blog-search/dataset-search-details.json')

function useSearchDetails(searching: boolean, load: () => Promise<{ default: PackedArticleSearchDetails }>) {
  const [details, setDetails] = useState<ArticleSearchDetails | null>()
  const pending = searching && details === undefined

  useEffect(() => {
    if (!pending) return
    let active = true
    load()
      .then(({ default: content }) => { if (active) setDetails(expandArticleSearchDetails(content)) })
      .catch(() => { if (active) setDetails(null) })
    return () => { active = false }
  }, [pending, load])

  return { details, pending }
}

export function useArticleSearchDetails(searching: boolean) {
  return useSearchDetails(searching, loadArticleDetails)
}

export function useDatasetSearchDetails(searching: boolean) {
  return useSearchDetails(searching, loadDatasetDetails)
}
