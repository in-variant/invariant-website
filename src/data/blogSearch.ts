import type { ResourceArticle } from './resources'

const FILLER_WORDS = new Set('a an and are as at be can do does for from how i in is it me near of on or should the to use was were what when where which who will with you'.split(' '))
const WATTS = { k: 1e3, m: 1e6, g: 1e9 } as const

export function articleSearchWords(value: string) {
  return value.toLowerCase()
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/(?<=\d),(?=\d{3}\b)/g, '')
    .replace(/['’]/g, '')
    .replace(/\b(\d+(?:\.\d+)?)\s*[-–—‐‑]?\s*(kw|mw|gw|kilowatts?|megawatts?|gigawatts?)\b/g, (_, amount: string, unit: string) => {
      const watts = Number(amount) * WATTS[unit[0] as keyof typeof WATTS]
      return ` ${Number(watts.toPrecision(15))}w `
    })
    .replace(/[^a-z0-9.]+/g, ' ')
    .replace(/(?<!\d)\.|\.(?!\d)/g, ' ')
    .replace(/\bdata\s*cent(?:er|re)s?\b/g, 'data center')
    .replace(/\bpowerflow\b/g, 'power flow')
    .replace(/\bpre\s+fill\b/g, 'prefill')
    .replace(/\bsemi\s*trucks?\b/g, 'truck')
    .replace(/\bcharg(?:e[dr]?s?|ing)\b/g, 'charge')
    .trim().split(/\s+/)
    .filter(word => word && !FILLER_WORDS.has(word))
    .map(word => word.length > 3 && /[^s]s$/.test(word) ? word.slice(0, -1) : word)
}

export function prepareArticleSearch(articles: ResourceArticle[], details: Record<string, string>) {
  return articles.map(article => ({
    article,
    title: articleSearchWords(article.title),
    metadata: new Set(articleSearchWords(`${article.summary} ${article.topic} ${article.region ?? ''} ${article.dataset?.name ?? ''}`)),
    details: new Set(articleSearchWords(details[article.slug] ?? '')),
  }))
}

export function searchArticles(index: ReturnType<typeof prepareArticleSearch>, queryWords: string[]) {
  const terms = [...new Set(queryWords)]
  const phrase = ` ${queryWords.join(' ')} `
  const lastWord = queryWords[queryWords.length - 1]
  return index.flatMap(({ article, title, metadata, details }) => {
    let score = ` ${title.join(' ')} `.includes(phrase) ? 6 : 0
    for (const term of terms) {
      if (title.includes(term)) score += 8
      else if (metadata.has(term)) score += 4
      else if (details.has(term)) score += 2
      else if (term === lastWord && /^[a-z]{3,}$/.test(term) &&
        [...title, ...metadata, ...details].some(word => word.startsWith(term))) score += 1
      else return []
    }
    return [{ article, score }]
  }).sort((a, b) => b.score - a.score).map(({ article }) => article)
}
