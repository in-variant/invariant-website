import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'

const base = new URL('../src/data/', import.meta.url)
const files = ['data-apis.json', 'ai-compute-capacity.json', 'site-due-diligence.json', 'data-center-site-finder.json', 'powered-land-sites.json', 'site-selection-guides.json', 'data-centers.json', 'data-center-operations.json', 'data-center-fire-safety.json', 'india-data-centres.json', 'oil-gas.json']
const articles = files.flatMap(file => JSON.parse(readFileSync(new URL(`industry-articles/${file}`, base), 'utf8')))
const legacyArticles = JSON.parse(readFileSync(new URL('legacy-blog-articles.json', base), 'utf8'))
const blogCollections = JSON.parse(readFileSync(new URL('blog-collections.json', base), 'utf8'))
const writeIfChanged = (file, content) => {
  if (!existsSync(file) || readFileSync(file, 'utf8') !== content) writeFileSync(file, content)
}
function writeEntryModules(directory, entries) {
  const filenames = new Set(entries.map(entry => `${entry.slug}.json`))
  mkdirSync(directory, { recursive: true })
  for (const file of readdirSync(directory)) {
    if (/^[a-z0-9-]+\.json$/.test(file) && !filenames.has(file)) unlinkSync(new URL(file, directory))
  }
  for (const entry of entries) {
    writeIfChanged(new URL(`${entry.slug}.json`, directory), JSON.stringify(entry))
  }
}
const worksheets = new Map()
const datasets = new Map()
const dataFormats = { CSV: 'csv', GeoJSON: 'geojson', JSON: 'json' }
const worksheetColumns = [
  'Candidate or parcel', 'Status', 'Source or link', 'Evidence date', 'Assigned to', 'Follow-up due', 'Notes',
  'Facility phase', 'Required facility MW at meter', 'Required utility service date',
  'MW supported by cited record', 'Service date or range in cited record', 'Power evidence stage',
]
const csvCell = value => {
  const safe = /^[\s]*[=+@-]/.test(value) ? "'" + value : value
  return '"' + safe.replaceAll('"', '""') + '"'
}
const allArticles = [...articles, ...legacyArticles]
const slugs = new Set(allArticles.map(article => article.slug))
if (slugs.size !== allArticles.length) throw new Error('Duplicate article slug')
for (const article of allArticles) {
  if (!/^[a-z0-9-]+$/.test(article.slug)) throw new Error(`Invalid slug: ${article.slug}`)
}
const publicBlogSlugs = new Set(slugs)
const publicCalculatorPaths = new Set([...readFileSync(new URL('../contentRoutes.ts', base), 'utf8')
  .matchAll(/^\s*'(\/calculators\/[a-z0-9-]+)':/gm)].map(([, path]) => path))
for (const collection of blogCollections) {
  if (!/^[a-z0-9-]+$/.test(collection.slug) || publicBlogSlugs.has(collection.slug)) {
    throw new Error(`Invalid or duplicate blog collection slug: ${collection.slug}`)
  }
  if (!/^\/blog\/industry\/[a-z0-9-]+\.webp$/.test(collection.image) ||
      !existsSync(new URL(`../public${collection.image}`, import.meta.url))) {
    throw new Error(`Invalid cover for blog collection: ${collection.slug}`)
  }
  if (collection.worksheet && (
    !/^\/blog\/[a-z0-9-]+\.csv$/.test(collection.worksheet.path) ||
    !existsSync(new URL(`../public${collection.worksheet.path}`, import.meta.url))
  )) {
    throw new Error(`Invalid worksheet for blog collection: ${collection.slug}`)
  }
  const guides = collection.guides.map(guide => guide.slug)
  if (!guides.length || new Set(guides).size !== guides.length || guides.some(slug => !slugs.has(slug))) {
    throw new Error(`Missing or duplicate guide in blog collection: ${collection.slug}`)
  }
  if (collection.guides.some(guide => guide.group) && collection.guides.some(guide => !guide.group?.trim())) {
    throw new Error(`Missing topic for a guide in grouped blog collection: ${collection.slug}`)
  }
  publicBlogSlugs.add(collection.slug)
}
for (const article of articles) {
  if (!['Data Centers', 'Oil & Gas', 'Data & APIs'].includes(article.topic)) throw new Error(`Invalid topic: ${article.slug}`)
  if (JSON.stringify(article).includes('\u2014')) throw new Error(`Em dash in ${article.slug}`)
  for (const field of ['title', 'description', 'intro', 'date']) if (!article[field]?.trim()) throw new Error(`Missing ${field}: ${article.slug}`)
  if (article.updatedDate && (!/^\d{4}-\d{2}-\d{2}$/.test(article.updatedDate) || article.updatedDate < article.date)) {
    throw new Error(`Invalid revision date: ${article.slug}`)
  }
  const ids = new Set(article.sources.map(source => source.id))
  if (ids.size !== article.sources.length) throw new Error(`Duplicate source: ${article.slug}`)
  for (const source of article.sources) if (new URL(source.url).protocol !== 'https:') throw new Error(`Invalid source URL: ${source.url}`)
  if (new Set(article.sections.map(section => section.id)).size !== article.sections.length) throw new Error(`Duplicate heading: ${article.slug}`)
  const blocks = article.sections.flatMap(section => section.blocks)
  for (const block of [...blocks, ...article.faqs]) {
    for (const id of [...(block.sourceIds ?? []), ...(block.rowSourceIds?.flat() ?? [])]) if (!ids.has(id)) throw new Error(`Unknown source ${id}: ${article.slug}`)
    if (block.type === 'links') for (const item of block.items) {
      const valid = item.path === undefined ? publicBlogSlugs.has(item.slug)
        : item.slug === undefined && publicCalculatorPaths.has(item.path)
      if (!valid) throw new Error(`Invalid or missing linked page ${item.path ?? item.slug}: ${article.slug}`)
    }
    if (block.type === 'download' && (!/^\/blog\/[a-z0-9-]+\.[a-z0-9]+$/.test(block.path) || !existsSync(new URL(`../public${block.path}`, import.meta.url)))) throw new Error(`Invalid download ${block.path}: ${article.slug}`)
    if (block.type === 'table' && block.rows.some(row => row.length !== block.columns.length)) throw new Error(`Uneven table: ${article.slug}`)
    if (block.rowSourceIds && block.rowSourceIds.length !== block.rows.length) throw new Error(`Uneven table citations: ${article.slug}`)
    if (block.type === 'table' && block.worksheet) {
      if (worksheets.has(article.slug)) throw new Error(`Multiple worksheets for ${article.slug}`)
      const columns = [...block.columns, ...worksheetColumns]
      const rows = block.rows.map(row => [...row, ...worksheetColumns.map(() => '')])
      worksheets.set(article.slug, [columns, ...rows].map(row => row.map(csvCell).join(',')).join('\n') + '\n')
    }
  }
  if (new Set(article.relatedSlugs).size !== article.relatedSlugs.length) {
    throw new Error(`Duplicate related article in ${article.slug}`)
  }
  for (const slug of article.relatedSlugs) {
    if (!slugs.has(slug) || slug === article.slug) {
      throw new Error(`Invalid related article ${slug} in ${article.slug}`)
    }
  }
  const additionalDatasets = article.additionalDatasets ?? []
  const datasetAnchors = new Set(article.dataset ? ['dataset'] : [])
  for (const { anchor, datePublished } of additionalDatasets) {
    if (!/^dataset-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(anchor) || datasetAnchors.has(anchor) ||
        article.sections.some(section => section.id === anchor) || !/^\d{4}-\d{2}-\d{2}$/.test(datePublished)) {
      throw new Error(`Invalid dataset anchor or publication date: ${article.slug} (${anchor})`)
    }
    datasetAnchors.add(anchor)
  }
  // A null anchor marks a standalone worksheet. Omitted anchors use the primary dataset.
  const downloadBlocks = blocks.filter(block => block.type === 'download' && block.datasetAnchor !== null)
  if (downloadBlocks.some(block => block.datasetAnchor && !datasetAnchors.has(block.datasetAnchor))) {
    throw new Error(`Download refers to an unknown dataset: ${article.slug}`)
  }
  const registered = new Set()
  function registerDataset({ sourceIds, ...details }) {
    const referencedSources = sourceIds?.map(id => article.sources.find(source => source.id === id))
    const downloads = downloadBlocks
      .filter(block => (block.datasetAnchor ?? 'dataset') === (details.anchor ?? 'dataset'))
      .map(({ label, path, format }) => ({ label, path, format }))
    const descriptionLength = details.description?.trim().length ?? 0
    if (!details.name?.trim() || descriptionLength < 50 || descriptionLength > 5000 || !referencedSources?.length ||
        referencedSources.some(source => !source?.title?.trim() || !source.publisher?.trim())) {
      throw new Error(`Invalid dataset metadata: ${article.slug}`)
    }
    const reuse = details.sourceReuse
    if (reuse && (!reuse.note?.trim() || !reuse.policyLabel?.trim() ||
        new URL(reuse.policyUrl).protocol !== 'https:')) {
      throw new Error(`Invalid dataset source reuse note: ${article.slug}`)
    }
    if (!downloads.length) throw new Error(`Missing dataset downloads: ${article.slug}`)
    for (const { path, format } of downloads) {
      if (registered.has(path) || !Object.hasOwn(dataFormats, format) || !path.endsWith(`.${dataFormats[format]}`)) {
        throw new Error(`Invalid dataset download ${path}: ${article.slug}`)
      }
      registered.add(path)
    }
    const sourceDetails = referencedSources.map(({ title, publisher, url }) => ({ title, publisher, url }))
    return { ...details, sources: sourceDetails.map(({ url }) => url), sourceDetails, downloads }
  }
  datasets.set(article.slug, {
    ...(article.dataset && { dataset: registerDataset(article.dataset) }),
    ...(additionalDatasets.length && { additionalDatasets: additionalDatasets.map(registerDataset) }),
  })
}
// Immutable image URLs change when the cover bytes change.
const coverDir = new URL('../public/blog/industry/', import.meta.url)
const coverVersions = Object.fromEntries(readdirSync(coverDir).filter(file => file.endsWith('.webp')).sort()
  .map(file => [`/blog/industry/${file}`, createHash('md5').update(readFileSync(new URL(file, coverDir))).digest('hex').slice(0, 8)]))
writeIfChanged(new URL('cover-versions.json', base), `${JSON.stringify(coverVersions, null, 2)}\n`)
const index = articles.map(article => {
  const cover = article.coverFile ?? `${article.slug}.webp`
  const imagePath = `/blog/industry/${cover}`
  const version = coverVersions[imagePath]
  if (!/^[a-z0-9-]+\.webp$/.test(cover) || !version) {
    throw new Error(`Invalid cover ${cover}: ${article.slug}`)
  }
  const image = `${imagePath}?v=${version}`
  return {
    slug: article.slug, topic: article.topic, title: article.title, summary: article.description,
    date: new Date(`${article.date}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
    dateTime: article.date, ...(article.region && { region: article.region }), ...(article.updatedDate && { updatedDate: article.updatedDate }), image,
    ...datasets.get(article.slug),
  }
})
writeIfChanged(new URL('industry-article-index.json', base), `${JSON.stringify(index, null, 2)}\n`)
const responsiveCovers = process.argv.includes('--responsive-covers')
  ? await (await import('./build-cover-variants.mjs')).buildCoverVariants([...new Set(index.map(article => article.image))])
  : new Map()
const searchDir = new URL('.generated-blog-search/', base)
mkdirSync(searchDir, { recursive: true })
const articleList = [...index, ...legacyArticles].map(({ slug, title, topic, summary, date, dateTime, updatedDate, region, image, dataset, additionalDatasets = [] }) => ({
  slug, title, topic, summary, date, dateTime, updatedDate, region, image,
  datasetNames: [dataset?.name, ...additionalDatasets.map(item => item.name)].filter(Boolean).join(' '),
}))
const collectionList = blogCollections.map(({ slug, title, navLabel }) => ({ slug, title, navLabel }))
writeIfChanged(new URL('article-list.json', searchDir), JSON.stringify({ articles: articleList, collections: collectionList }))
const articleSearch = Object.fromEntries(articles.map(article => [
  article.slug,
  [
    ...article.sections.map(section => section.heading),
    ...article.faqs.map(faq => faq.question),
  ].join(' '),
]))
writeIfChanged(new URL('details.json', searchDir), JSON.stringify(articleSearch))
const siteSlugs = articles.filter(article => ['site-listing', 'site-guide', 'study-guide', 'compute-guide', 'india-guide'].includes(article.kind)).map(article => article.slug)
writeIfChanged(new URL('site-article-slugs.json', base), `${JSON.stringify(siteSlugs, null, 2)}\n`)
for (const [slug, csv] of worksheets) {
  writeIfChanged(new URL(`../public/blog/${slug}.csv`, import.meta.url), csv)
}
const catalog = new Map([...index, ...legacyArticles].map(article => [article.slug, article]))
writeEntryModules(new URL('.generated-articles/', base), articles.map(({ relatedSlugs, dataset, coverFile, ...article }, i) => ({
  ...article,
  published: index[i],
  coverImage: responsiveCovers.get(index[i].image),
  relatedReading: relatedSlugs.map(slug => {
    const { title, topic, image } = catalog.get(slug)
    return { slug, title, topic, image }
  }),
})))
writeEntryModules(new URL('.generated-legacy-articles/', base), legacyArticles.map(article => ({
  ...article,
  relatedReading: [],
})))

const glossary = JSON.parse(readFileSync(new URL('../pages/_data/glossary.json', base), 'utf8')).entries ?? []
if (new Set(glossary.map(entry => entry.slug)).size !== glossary.length) throw new Error('Duplicate glossary entry slug')
for (const entry of glossary) {
  if (!/^[a-z0-9-]+$/.test(entry.slug)) throw new Error(`Invalid glossary slug: ${entry.slug}`)
}
writeEntryModules(new URL('.generated-glossary/entries/', base), glossary)
const summaries = glossary.map(({ slug, term, aliases, short_definition, topic }) => ({
  slug, term, aliases, short_definition, topic,
}))
writeIfChanged(new URL('.generated-glossary/index.json', base), JSON.stringify(summaries))
console.log(`Validated and indexed ${articles.length} industry guides and ${glossary.length} glossary entries`)
