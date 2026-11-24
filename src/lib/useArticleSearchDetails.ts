import { useEffect, useState } from 'react'

export function useArticleSearchDetails(searching: boolean) {
  const [details, setDetails] = useState<Record<string, string> | null>()
  const pending = searching && details === undefined

  useEffect(() => {
    if (!pending) return
    let active = true
    import('../data/.generated-blog-search/details.json').then(
      ({ default: content }) => { if (active) setDetails(content) },
      () => { if (active) setDetails(null) },
    )
    return () => { active = false }
  }, [pending])

  return { details, pending }
}
