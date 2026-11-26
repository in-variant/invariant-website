import { readFileSync, writeFileSync } from 'node:fs'

const site = 'https://invariant-ai.com'
const blogUrl = `${site}/blog`
const feedUrl = `${site}/feed.xml`
const articles = JSON.parse(readFileSync(new URL('../src/data/industry-article-index.json', import.meta.url), 'utf8'))
const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }
const escapeXml = value => value.replace(/[&<>"']/g, char => entities[char])
const revisionDate = article => article.updatedDate ?? article.dateTime
const timestamp = date => `${date}T00:00:00Z`

articles.sort((a, b) => revisionDate(b).localeCompare(revisionDate(a))
  || b.dateTime.localeCompare(a.dateTime) || a.slug.localeCompare(b.slug))

const entries = articles.map(article => {
  const url = `${blogUrl}/${article.slug}`
  return [
    '  <entry>',
    `    <id>${url}</id>`,
    `    <title>${escapeXml(article.title)}</title>`,
    `    <link rel="alternate" href="${url}" type="text/html" />`,
    `    <published>${timestamp(article.dateTime)}</published>`,
    `    <updated>${timestamp(revisionDate(article))}</updated>`,
    `    <category term="${escapeXml(article.topic)}" />`,
    `    <summary>${escapeXml(article.summary)}</summary>`,
    '  </entry>',
  ].join('\n')
})

const feed = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">',
  `  <id>${feedUrl}</id>`,
  '  <title>Invariant Blog</title>',
  `  <link rel="self" href="${feedUrl}" type="application/atom+xml" />`,
  `  <link rel="alternate" href="${blogUrl}" type="text/html" />`,
  '  <author><name>Invariant</name></author>',
  `  <updated>${timestamp(revisionDate(articles[0]))}</updated>`,
  ...entries,
  '</feed>',
  '',
].join('\n')

writeFileSync(new URL('../dist/feed.xml', import.meta.url), feed)
console.log(`Atom feed: ${entries.length} articles`)
