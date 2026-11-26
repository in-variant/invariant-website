import type { ArticleListEntry } from './articleList'
import { articleSearchWords } from './articleSearchWords.mjs'

export { articleSearchWords }

const EDITORIAL_ALIASES = new Map([
  ['employment', ['job']],
  ['own', ['owner', 'ownership']],
  ['serve', ['service', 'served']],
])

export function editorialSearchWords(value: string) {
  const question = value.trim()
    .replace(/^please\s+/i, '')
    .replace(/^(?:(?:can|could|would)\s+you\s+)?(?:show|tell|give)\s+me\s+/i, '')
    .replace(/^(?:where|how)\s+(?:can|could|do|should)\s+i\s+(?:find|get|see)\s+/i, '')
    .replace(/^i\s+(?:want|need)\s+to\s+/i, '')
    .replace(/\b(?:could|much|my|please|that|these|this|those|would|your)\b/gi, ' ')
  return articleSearchWords(question)
}

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

type SearchItem<T> = ReturnType<typeof prepareSearch<T>>[number]

function editorialWeight<T>(item: SearchItem<T>, term: string) {
  if (item.title.includes(term)) return 8
  if (item.relatedTitle.includes(term)) return 6
  if (item.metadata.has(term)) return 4
  if (item.details.has(term)) return 2
  return 0
}

function rankLongQuestion<T>(index: SearchItem<T>[], terms: string[]) {
  const hasTerm = (item: SearchItem<T>, term: string) => editorialWeight(item, term) > 0 || item.bodyTerms?.has(term)
  const capacities = terms.filter(term => /^\d+(?:\.\d+)?w$/.test(term))
  const frequencies = terms.flatMap(term => {
    const count = index.filter(item => hasTerm(item, term)).length
    return count ? [{ term, importance: 1 + Math.log(index.length / count), distinctive: count <= Math.max(1, index.length / 3) }] : []
  })
  const minimumMatches = Math.max(4, Math.ceil(frequencies.length * .4))

  return index.flatMap(item => {
    if (!capacities.every(term => hasTerm(item, term))) return []
    let matches = 0
    let directMatches = 0
    let hasDistinctiveMatch = false
    let score = 0
    for (const { term, importance, distinctive } of frequencies) {
      const direct = editorialWeight(item, term)
      if (!direct && !item.bodyTerms?.has(term)) continue
      matches += 1
      if (direct) {
        directMatches += 1
        hasDistinctiveMatch ||= distinctive
      }
      score += importance * (direct || 1)
    }
    if (matches < minimumMatches || directMatches < 2 || !hasDistinctiveMatch) return []
    return [{ entry: item.entry, score }]
  }).sort((a, b) => b.score - a.score).map(({ entry }) => entry)
}

export function rankSearch<T>(
  index: ReturnType<typeof prepareSearch<T>>,
  queryWords: string[],
  { numericPrefixes = false, allowPartialMatches = false, longQuestionRanking = false } = {},
) {
  const terms = [...new Set(queryWords)]
  const phrase = ` ${queryWords.join(' ')} `
  const lastWord = queryWords[queryWords.length - 1]
  const canMatchPrefix = numericPrefixes ? lastWord?.length >= 3 : /^[a-z]{3,}$/.test(lastWord)
  const missingAllowance = allowPartialMatches && terms.length >= 4
    ? Math.min(2, Math.floor(terms.length / 4))
    : 0
  const strictResults = index.flatMap(item => {
    const { entry, title, relatedTitle, metadata, details, bodyTerms } = item
    const matchesPhrase = ` ${title.join(' ')} `.includes(phrase) || ` ${relatedTitle.join(' ')} `.includes(phrase)
    let score = matchesPhrase ? (allowPartialMatches ? 8 : 6) : 0
    let bodyMatches = 0
    let strongMatches = 0
    let missing = 0

    for (const term of terms) {
      const aliases = allowPartialMatches ? EDITORIAL_ALIASES.get(term) : undefined
      let weight = editorialWeight(item, term)
      if (aliases) weight = aliases.reduce((best, alias) => Math.max(best, editorialWeight(item, alias) - 1), weight)
      if (!weight && term === lastWord && canMatchPrefix &&
        [...title, ...relatedTitle, ...metadata, ...details].some(word => word.startsWith(term))) weight = 1
      if (!weight && bodyTerms?.has(term)) bodyMatches += 1
      else if (!weight) {
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

  // A passing mention can cover a long question without addressing its main subject.
  // Keep the existing ranking for shorter queries that already have matches.
  const isLongQuestion = terms.length >= 12
  const needsFallback = terms.length >= 7 && strictResults.length === 0
  if (longQuestionRanking && (isLongQuestion || needsFallback)) {
    const questionResults = rankLongQuestion(index, terms)
    if (questionResults.length) return questionResults
  }
  return strictResults
}
