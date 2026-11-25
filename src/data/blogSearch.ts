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
  { numericPrefixes = false, allowPartialMatches = false } = {},
) {
  const terms = [...new Set(queryWords)]
  const phrase = ` ${queryWords.join(' ')} `
  const lastWord = queryWords[queryWords.length - 1]
  const canMatchPrefix = numericPrefixes ? lastWord?.length >= 3 : /^[a-z]{3,}$/.test(lastWord)
  const missingAllowance = allowPartialMatches && terms.length >= 4
    ? Math.min(2, Math.floor(terms.length / 4))
    : 0
  return index.flatMap(({ entry, title, relatedTitle, metadata, details, bodyTerms }) => {
    const matchesPhrase = ` ${title.join(' ')} `.includes(phrase) || ` ${relatedTitle.join(' ')} `.includes(phrase)
    let score = matchesPhrase ? (allowPartialMatches ? 8 : 6) : 0
    let bodyMatches = 0
    let strongMatches = 0
    let missing = 0

    for (const term of terms) {
      let weight = 0
      if (title.includes(term)) weight = 8
      else if (relatedTitle.includes(term)) weight = 6
      else if (metadata.has(term)) weight = 4
      else if (details.has(term)) weight = 2
      else if (term === lastWord && canMatchPrefix &&
        [...title, ...relatedTitle, ...metadata, ...details].some(word => word.startsWith(term))) weight = 1
      else if (bodyTerms?.has(term)) bodyMatches += 1
      else {
        missing += 1
        if (/^\d/.test(term) || missing > missingAllowance) return []
      }

      score += weight
      if (weight >= 4) strongMatches += 1
    }

    if (missing && strongMatches < 2) return []
    // Favor a guide whose title or summary answers the question over a passing mention in its body.
    if (allowPartialMatches) score -= 6 * bodyMatches + 12 * missing
    return [{ entry, score, bodyMatches, missing }]
  }).sort((a, b) => allowPartialMatches
    ? b.score - a.score || a.missing - b.missing
    : a.bodyMatches - b.bodyMatches || b.score - a.score,
  ).map(({ entry }) => entry)
}
