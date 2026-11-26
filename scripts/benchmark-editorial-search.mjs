#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { editorialSearchWords, prepareArticleSearch, rankSearch } from '../src/data/blogSearch.ts'

const read = path => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'))
const { articles } = read('../src/data/.generated-blog-search/article-list.json')
const details = read('../src/data/.generated-blog-search/details.json')
const available = new Set(articles.map(({ slug }) => '/blog/' + slug))
const cases = [...read('./geo-buyer-prompts.json'), ...read('./geo-collection-prompts.json')]
  .map(example => ({ ...example, article: example.target?.split('#')[0] }))
  .filter(({ article }) => available.has(article))
const index = prepareArticleSearch(articles.sort((a, b) => b.dateTime.localeCompare(a.dateTime)), details)

function measure(field, longQuestionRanking) {
  const metrics = { cases: 0, first: 0, topThree: 0, firstPage: 0, empty: 0 }
  for (const example of cases) {
    if (!example[field]) continue
    const results = rankSearch(index, editorialSearchWords(example[field]), {
      allowPartialMatches: true,
      longQuestionRanking,
    })
    const position = results.findIndex(({ slug }) => '/blog/' + slug === example.article) + 1
    metrics.cases += 1
    metrics.first += Number(position === 1)
    metrics.topThree += Number(position > 0 && position <= 3)
    metrics.firstPage += Number(position > 0 && position <= 12)
    metrics.empty += Number(results.length === 0)
  }
  return metrics
}

// This measures the site's own search over known buyer questions, not external rankings.
console.table([
  { input: 'Keywords', mode: 'Existing ranking', ...measure('googleQuery', false) },
  { input: 'Keywords', mode: 'Question-aware ranking', ...measure('googleQuery', true) },
  { input: 'Full questions', mode: 'Existing ranking', ...measure('prompt', false) },
  { input: 'Full questions', mode: 'Question-aware ranking', ...measure('prompt', true) },
])
