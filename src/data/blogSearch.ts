import type { ArticleListEntry } from './articleList'
import { articleSearchWords } from './articleSearchWords.mjs'

export { articleSearchWords }

export type ArticleSearchDetails = Record<string, { headings: string; bodyTerms: string[] }>

export function prepareSearch<T>(
  entries: readonly T[],
  textFor: (entry: T) => { title: string; relatedTitle?: string; metadata: string; details?: string; bodyTerms?: string[] },
) {
  return entries.map(entry => {
    const { title, relatedTitle = '', metadata, details = '', bodyTerms } = textFor(entry)
    return {
      entry,
      title: articleSearchWords(title),
      relatedTitle: articleSearchWords(relatedTitle),
      metadata: new Set(articleSearchWords(metadata)),
      details: new Set(articleSearchWords(details)),
      bodyTerms: bodyTerms ? new Set(bodyTerms) : undefined,
    }
  })
}

export function prepareArticleSearch(articles: ArticleListEntry[], details: ArticleSearchDetails) {
  return prepareSearch(articles, article => ({
    title: article.title,
    relatedTitle: article.slug,
    metadata: `${article.summary} ${article.topic} ${article.region ?? ''} ${article.datasetNames}`,
    details: details[article.slug]?.headings,
    bodyTerms: details[article.slug]?.bodyTerms,
  }))
}

export function rankSearch<T>(
  index: ReturnType<typeof prepareSearch<T>>,
  queryWords: string[],
  { numericPrefixes = false } = {},
) {
  const terms = [...new Set(queryWords)]
  const phrase = ` ${queryWords.join(' ')} `
  const lastWord = queryWords[queryWords.length - 1]
  const canMatchPrefix = numericPrefixes ? lastWord?.length >= 3 : /^[a-z]{3,}$/.test(lastWord)
  return index.flatMap(({ entry, title, relatedTitle, metadata, details, bodyTerms }) => {
    let score = ` ${title.join(' ')} `.includes(phrase) || ` ${relatedTitle.join(' ')} `.includes(phrase) ? 6 : 0
    let bodyMatches = 0
    for (const term of terms) {
      if (title.includes(term)) score += 8
      else if (relatedTitle.includes(term)) score += 6
      else if (metadata.has(term)) score += 4
      else if (details.has(term)) score += 2
      else if (term === lastWord && canMatchPrefix &&
        [...title, ...relatedTitle, ...metadata, ...details].some(word => word.startsWith(term))) score += 1
      else if (bodyTerms?.has(term)) bodyMatches += 1
      else return []
    }
    return [{ entry, score, bodyMatches }]
  }).sort((a, b) => a.bodyMatches - b.bodyMatches || b.score - a.score).map(({ entry }) => entry)
}
