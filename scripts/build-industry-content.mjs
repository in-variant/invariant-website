import { readFileSync, writeFileSync } from 'node:fs'

const base = new URL('../src/data/', import.meta.url)
const files = ['data-centers.json', 'data-center-operations.json', 'data-center-fire-safety.json', 'oil-gas.json']
const articles = files.flatMap(file => JSON.parse(readFileSync(new URL(`industry-articles/${file}`, base), 'utf8')))
const slugs = new Set(articles.map(article => article.slug))
if (slugs.size !== articles.length) throw new Error('Duplicate industry article slug')
for (const article of articles) {
  if (!/^[a-z0-9-]+$/.test(article.slug)) throw new Error(`Invalid slug: ${article.slug}`)
  if (!['Data Centers', 'Oil & Gas'].includes(article.topic)) throw new Error(`Invalid topic: ${article.slug}`)
  if (JSON.stringify(article).includes('\u2014')) throw new Error(`Em dash in ${article.slug}`)
  for (const field of ['title', 'description', 'intro', 'date']) if (!article[field]?.trim()) throw new Error(`Missing ${field}: ${article.slug}`)
  const ids = new Set(article.sources.map(source => source.id))
  if (ids.size !== article.sources.length) throw new Error(`Duplicate source: ${article.slug}`)
  for (const source of article.sources) if (new URL(source.url).protocol !== 'https:') throw new Error(`Invalid source URL: ${source.url}`)
  if (new Set(article.sections.map(section => section.id)).size !== article.sections.length) throw new Error(`Duplicate heading: ${article.slug}`)
  for (const block of [...article.sections.flatMap(section => section.blocks), ...article.faqs]) {
    for (const id of block.sourceIds ?? []) if (!ids.has(id)) throw new Error(`Unknown source ${id}: ${article.slug}`)
    if (block.type === 'table' && block.rows.some(row => row.length !== block.columns.length)) throw new Error(`Uneven table: ${article.slug}`)
  }
  for (const slug of article.relatedSlugs) if (!slugs.has(slug)) throw new Error(`Missing related article ${slug}`)
}
const index = articles.map(article => ({
  slug: article.slug, topic: article.topic, title: article.title, summary: article.description,
  date: new Date(`${article.date}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
  dateTime: article.date, image: `/blog/industry/${article.slug}.webp`,
}))
writeFileSync(new URL('industry-article-index.json', base), `${JSON.stringify(index, null, 2)}\n`)
console.log(`Validated and indexed ${articles.length} industry guides`)
