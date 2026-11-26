import type { ArticleListEntry } from './articleList'
import { articleSearchWords } from './articleSearchWords.mjs'

export { articleSearchWords }

const EDITORIAL_ALIASES = new Map([
  ['employment', ['job']],
  ['own', ['owner', 'ownership']],
  ['serve', ['service', 'served']],
])

const WORKSHEET_TERMS = new Set(['checklist', 'worksheet'])
const POWER_SIZE = /^\d+(?:\.\d+)?w$/
const RECORD_ID = /^[a-z]*\d{6,}[a-z]*$/
const GUIDANCE_TERMS = new Set(['checklist', 'commission', 'confirm', 'evidence', 'study', 'verify', 'worksheet'])

export function editorialSearchWords(value: string) {
  const question = value.trim()
    .replace(/^please\s+/i, '')
    .replace(/\b(?:get|be)\s+notified\b/gi, 'alert')
    .replace(/^(?:(?:can|could|would)\s+you\s+)?(?:show|tell|give)\s+me\s+/i, '')
    .replace(/^(?:where|how)\s+(?:can|could|do|should)\s+i\s+(?:find|get|see)\s+/i, '')
    .replace(/^i\s+(?:want|need)\s+to\s+/i, '')
    .replace(/\b(?:could|much|my|please|that|these|this|those|would|your)\b/gi, ' ')
  return articleSearchWords(question)
}

export type ArticleSearchDetails = Record<string, { headings: string; bodyTerms: string[] }>

export type PackedArticleSearchDetails = {
  documents: { slug: string; headings: string }[]
  bodyPostings: Record<string, number[]>
}

export function expandArticleSearchDetails({ documents, bodyPostings }: PackedArticleSearchDetails): ArticleSearchDetails {
  const details = documents.map(({ headings }) => ({ headings, bodyTerms: [] as string[] }))
  for (const [term, gaps] of Object.entries(bodyPostings)) {
    let position = -1
    for (const gap of gaps) {
      position += gap
      details[position].bodyTerms.push(term)
    }
  }
  return Object.fromEntries(documents.map(({ slug }, position) => [slug, details[position]]))
}

export function prepareSearch<T>(
  entries: readonly T[],
  textFor: (entry: T) => { title: string; relatedTitle?: string; metadata: string; details?: string; bodyTerms?: string[] },
) {
  return entries.map(entry => {
    const { title, relatedTitle = '', metadata, details = '', bodyTerms } = textFor(entry)
    const headings = details.split('\n').map(articleSearchWords)
    return {
      entry,
      title: articleSearchWords(title),
      relatedTitle: articleSearchWords(relatedTitle),
      metadata: new Set(articleSearchWords(metadata)),
      details: new Set(headings.flat()),
      headingText: headings.map(words => ` ${words.join(' ')} `).join('\n'),
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

function rankLongQuestion<T>(index: SearchItem<T>[], terms: string[], query: string[]) {
  const hasTerm = (item: SearchItem<T>, term: string) => editorialWeight(item, term) > 0 || item.bodyTerms?.has(term)
  const capacities = terms.filter(term => POWER_SIZE.test(term))
  const guidance = terms.filter(term => GUIDANCE_TERMS.has(term))
  const buying = terms.some(term => term === 'sale' || term === 'lease' || term === 'listing' || term === 'buy')
  const phrases = new Set(query.slice(1).map((word, i) => ` ${query[i]} ${word} `))
  // Keep subject terms distinctive when other guides only mention them in passing.
  const frequencies = terms.flatMap(term => {
    let matches = 0
    let directMatches = 0
    for (const item of index) {
      if (editorialWeight(item, term)) directMatches += 1
      else if (item.bodyTerms?.has(term)) matches += 1
    }
    const count = matches + directMatches
    if (!count) return []
    return [{
      term,
      importance: 1 + Math.log(index.length / count),
      distinctive: directMatches <= Math.max(1, index.length / 3),
    }]
  })
  const minimumMatches = Math.max(4, Math.ceil(frequencies.length * .4))

  return index.flatMap(item => {
    // Sizing is part of the question for a study or checklist. For an offer, keep the requested size.
    const guidanceMatch = !buying && guidance.some(term => editorialWeight(item, term) >= 6)
    if (!guidanceMatch && !capacities.every(term => hasTerm(item, term))) return []
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
      if (direct >= 6 && WORKSHEET_TERMS.has(term)) score += importance * 3
      if (POWER_SIZE.test(term) && direct >= 6 && !guidanceMatch) score += importance * 3
    }
    if (matches < minimumMatches || directMatches < 2 || !hasDistinctiveMatch) return []
    const title = ` ${item.title.join(' ')} `
    const related = ` ${item.relatedTitle.join(' ')} `
    for (const phrase of phrases) {
      if (title.includes(phrase)) score += 5
      else if (related.includes(phrase) || item.headingText.includes(phrase)) score += 3
    }
    return [{ entry: item.entry, score }]
  }).sort((a, b) => b.score - a.score).map(({ entry }) => entry)
}

export function rankSearch<T>(
  index: ReturnType<typeof prepareSearch<T>>,
  queryWords: string[],
  { numericPrefixes = false, allowPartialMatches = false, longQuestionRanking = false, requireRecordIds = false } = {},
) {
  const terms = [...new Set(queryWords)]
  const phrase = ` ${queryWords.join(' ')} `
  const lastWord = queryWords[queryWords.length - 1]
  const canMatchPrefix = numericPrefixes ? lastWord?.length >= 3 : /^[a-z]{3,}$/.test(lastWord)
  const missingAllowance = allowPartialMatches && terms.length >= 4
    ? Math.min(2, Math.floor(terms.length / 4))
    : 0
  // A question about a specific record must keep that identifier in the results.
  const recordIds = requireRecordIds ? terms.filter(term => RECORD_ID.test(term) && !POWER_SIZE.test(term)) : []
  const candidates = recordIds.length ? index.filter(item =>
    recordIds.every(term => editorialWeight(item, term) > 0 || item.bodyTerms?.has(term)),
  ) : index
  const strictResults = candidates.flatMap(item => {
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
  const requestsWorksheet = terms.length >= 8 && terms.some(term => WORKSHEET_TERMS.has(term))
  const isLongQuestion = terms.length >= 12 || requestsWorksheet
  const needsFallback = terms.length >= 6 && strictResults.length === 0
  if (longQuestionRanking && (isLongQuestion || needsFallback)) {
    const questionResults = rankLongQuestion(candidates, terms, queryWords)
    if (questionResults.length) return questionResults
  }
  return strictResults
}
