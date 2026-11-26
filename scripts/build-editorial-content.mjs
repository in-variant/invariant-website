import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { coverageFieldPath } from '../src/data/coverageFieldPath.mjs'
import { articleSearchWords } from '../src/data/articleSearchWords.mjs'
import { buildArticleCollectionLinks } from '../src/data/collectionGuideLinks.mjs'

const base = new URL('../src/data/', import.meta.url)
const files = ['data-apis.json', 'ai-compute-capacity.json', 'site-due-diligence.json', 'data-center-site-finder.json', 'powered-land-sites.json', 'site-selection-guides.json', 'data-centers.json', 'data-center-operations.json', 'data-center-fire-safety.json', 'india-data-centres.json', 'oil-gas.json']
const articles = files.flatMap(file => JSON.parse(readFileSync(new URL(`industry-articles/${file}`, base), 'utf8')))
const legacyArticles = JSON.parse(readFileSync(new URL('legacy-blog-articles.json', base), 'utf8'))
const blogCollections = JSON.parse(readFileSync(new URL('blog-collections.json', base), 'utf8'))
const providerTrial = JSON.parse(readFileSync(new URL('physical-world-data-api-trial.json', base), 'utf8'))
const providerComparisons = JSON.parse(readFileSync(new URL('physical-world-provider-comparisons.json', base), 'utf8'))
const coverageTopics = JSON.parse(readFileSync(new URL('earth-coverage-topics.json', base), 'utf8'))
const coverageSnapshot = JSON.parse(readFileSync(new URL('../public/data-coverage-fields.json', import.meta.url), 'utf8'))
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
const csvCell = (value, quoteAll = true) => {
  const safe = /^[\s]*[=+@-]/.test(value) ? "'" + value : value
  return quoteAll || /[",\r\n]/.test(safe) ? '"' + safe.replaceAll('"', '""') + '"' : safe
}
const allArticles = [...articles, ...legacyArticles]
const slugs = new Set(allArticles.map(article => article.slug))
if (slugs.size !== allArticles.length) throw new Error('Duplicate article slug')
for (const article of allArticles) {
  if (!/^[a-z0-9-]+$/.test(article.slug)) throw new Error(`Invalid slug: ${article.slug}`)
}
const publicBlogSlugs = new Set(slugs)
const linkablePaths = new Set([...readFileSync(new URL('../contentRoutes.ts', base), 'utf8')
  .matchAll(/^\s*'(\/product|\/calculators\/[a-z0-9-]+)':/gm)].map(([, path]) => path))
linkablePaths.add('/data-coverage')
linkablePaths.add('/mcp')
linkablePaths.add('/contact?request=site-selection')
linkablePaths.add('/contact?request=site-submission')
const glossary = JSON.parse(readFileSync(new URL('../pages/_data/glossary.json', base), 'utf8')).entries ?? []
for (const { slug } of glossary) {
  const path = `/glossary/${slug}`
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error(`Invalid glossary slug: ${slug}`)
  if (linkablePaths.has(path)) throw new Error(`Duplicate glossary entry slug: ${slug}`)
  linkablePaths.add(path)
}
const coverageByName = new Map(coverageSnapshot.map(field => [field.name, field]))
for (const { name, definitions } of coverageSnapshot) {
  linkablePaths.add(coverageFieldPath(name))
  for (const operation of Object.keys(definitions)) linkablePaths.add(coverageFieldPath(name, operation))
}
const coverageExamples = {}
for (const { id, fields } of coverageTopics) {
  const path = `/data-coverage#${id}`
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id ?? '') || linkablePaths.has(path)) {
    throw new Error(`Invalid or duplicate API coverage anchor: ${id}`)
  }
  linkablePaths.add(path)
  for (const name of fields) {
    const field = coverageByName.get(name)
    if (!field) throw new Error(`Unknown API coverage field "${name}" in ${id}`)
    coverageExamples[name] = field
  }
}
const trialGuide = blogCollections.find(({ slug }) => `https://invariant-ai.com/blog/${slug}` === providerTrial.url)
if (trialGuide?.worksheet?.path !== providerTrial.csv_path
  || trialGuide.worksheet.jsonPath !== providerTrial.json_path
  || ![providerTrial.csv_path, providerTrial.json_path].every(path => /^\/blog\/[a-z0-9-]+\.(csv|json)$/.test(path))) {
  throw new Error('Data provider trial download paths do not match the collection')
}
const trialIds = new Set(providerTrial.cases.map(row => row.test_id))
if (!trialIds.size || trialIds.size !== providerTrial.cases.length) throw new Error('Missing or duplicate provider trial cases')
const trialInputColumns = ['test_id', 'workflow', 'case_input', 'request', 'acceptance_criteria', 'source_case_url']
const trialReferenceColumns = ['reference_fixture_url', 'primary_source_url', 'second_source_url', 'reference_result', 'reference_as_of']
const trialReviewColumns = [
  'provider', 'request_date', 'returned_entity_id', 'returned_effective_date',
  'source_url', 'data_vintage', 'result_status', 'reviewer_notes',
]
const trialColumns = [...trialInputColumns, ...trialReviewColumns, ...trialReferenceColumns]
const trialOrigin = new URL(providerTrial.url).origin
const workflowIds = new Set()
for (const { id, title, guide, test, providers } of providerComparisons.workflows) {
  if (!/^[a-z0-9-]+$/.test(id) || workflowIds.has(id) || !slugs.has(guide) || !title?.trim() || !test?.trim()) {
    throw new Error(`Invalid provider comparison workflow: ${id}`)
  }
  workflowIds.add(id)
  if (providers.length < 2 || new Set(providers.map(({ name }) => name)).size !== providers.length
    || providers.some(({ name, url }) => {
      const source = new URL(url)
      return !name?.trim() || source.protocol !== 'https:' || source.username || source.password || source.origin === trialOrigin
    })) {
    throw new Error(`Invalid source links in provider workflow: ${id}`)
  }
}
for (const row of providerTrial.cases) {
  if (!/^[a-z0-9-]+$/.test(row.test_id) || !row.title?.trim()
    || ![...trialInputColumns, ...trialReferenceColumns].every(column => row[column]?.trim())) {
    throw new Error(`Incomplete provider trial case: ${row.test_id}`)
  }
  const guide = new URL(row.source_case_url)
  const fixture = new URL(row.reference_fixture_url)
  const article = allArticles.find(item => guide.pathname === `/blog/${item.slug}`)
  if (!article || guide.origin !== trialOrigin
    || (guide.hash && !article.sections?.some(section => section.id === guide.hash.slice(1)))
    || fixture.origin !== trialOrigin || !existsSync(new URL(`../public${fixture.pathname}`, import.meta.url))
    || [row.primary_source_url, row.second_source_url].some(url => new URL(url).protocol !== 'https:')) {
    throw new Error(`Invalid provider trial references: ${row.test_id}`)
  }
}
const trialCsv = [trialColumns, ...providerTrial.cases.map(row => trialColumns.map(column => row[column] ?? ''))]
  .map(row => row.map(value => csvCell(value, false)).join(','))
  .join('\n') + '\n'
writeIfChanged(new URL(`../public${providerTrial.csv_path}`, import.meta.url), trialCsv)
writeIfChanged(new URL(`../public${providerTrial.json_path}`, import.meta.url), `${JSON.stringify(providerTrial, null, 2)}\n`)

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
for (const { slug, guide } of glossary) {
  if (!guide) continue
  const blogLink = /^\/blog\/([a-z0-9-]+)(?:#([^#]+))?$/.exec(guide.path)
  const linkedArticle = blogLink && articles.find(article => article.slug === blogLink[1])
  const validBlogLink = blogLink && publicBlogSlugs.has(blogLink[1])
    && (!blogLink[2] || linkedArticle?.sections.some(section => section.id === blogLink[2]))
  if (!guide.label?.trim() || (!validBlogLink && !linkablePaths.has(guide.path))) {
    throw new Error(`Invalid glossary guide: ${slug} (${guide.path})`)
  }
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
  for (const source of article.sources) {
    if (new URL(source.url).protocol !== 'https:') throw new Error(`Invalid source URL: ${source.url}`)
    if (source.license !== undefined && new URL(source.license).protocol !== 'https:') {
      throw new Error(`Invalid source license URL: ${article.slug} (${source.id})`)
    }
  }
  const sectionIds = new Set(article.sections.map(section => section.id))
  if (sectionIds.size !== article.sections.length) throw new Error(`Duplicate heading: ${article.slug}`)
  if (article.listingSections) {
    const destinations = new Set(article.listingSections.map(({ id }) => id))
    if (article.kind !== 'site-listing' || destinations.size === 0 || destinations.size !== article.listingSections.length ||
        article.listingSections.some(({ id, label }) => !label?.trim() || !article.sections.some(section => section.id === id))) {
      throw new Error(`Invalid listing sections: ${article.slug}`)
    }
  }
  const blocks = article.sections.flatMap(section => section.blocks)
  for (const { href, label, download } of article.guideActions ?? []) {
    const valid = download
      ? blocks.some(block => block.type === 'download' && block.path === href)
      : href?.startsWith('#')
        ? sectionIds.has(href.slice(1))
        : article.sources.some(source => source.url === href)
    if (!label?.trim() || !valid) throw new Error(`Invalid guide action: ${article.slug} (${href})`)
  }
  for (const block of [...blocks, ...article.faqs]) {
    for (const id of [...(block.sourceIds ?? []), ...(block.rowSourceIds?.flat() ?? [])]) if (!ids.has(id)) throw new Error(`Unknown source ${id}: ${article.slug}`)
    if (block.type === 'links') for (const item of block.items) {
      const valid = item.path === undefined ? publicBlogSlugs.has(item.slug)
        : item.slug === undefined && linkablePaths.has(item.path)
      if (!valid) throw new Error(`Invalid or missing linked page ${item.path ?? item.slug}: ${article.slug}`)
    }
    if (block.type === 'download' && (!/^\/blog\/[a-z0-9-]+\.[a-z0-9]+$/.test(block.path) || !existsSync(new URL(`../public${block.path}`, import.meta.url)))) throw new Error(`Invalid download ${block.path}: ${article.slug}`)
    if (block.type === 'table' && block.rows.some(row => row.length !== block.columns.length)) throw new Error(`Uneven table: ${article.slug}`)
    if (block.rowSourceIds && block.rowSourceIds.length !== block.rows.length) throw new Error(`Uneven table citations: ${article.slug}`)
    if (block.type === 'table' && block.rowSectionIds && (
      block.rowSectionIds.length !== block.rows.length || block.rowSectionIds.some(id => !sectionIds.has(id))
    )) throw new Error(`Invalid table section links: ${article.slug}`)
    if (block.type === 'table' && block.worksheet) {
      if (worksheets.has(article.slug)) throw new Error(`Multiple worksheets for ${article.slug}`)
      const columns = [...block.columns, ...worksheetColumns]
      const rows = block.rows.map(row => [...row, ...worksheetColumns.map(() => '')])
      worksheets.set(article.slug, [columns, ...rows].map(row => row.map(value => csvCell(value)).join(',')).join('\n') + '\n')
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
    const sourceDetails = referencedSources.map(({ title, publisher, url, license }) => ({
      title, publisher, url, ...(license && { license }),
    }))
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
  ? await (await import('./build-cover-variants.mjs')).buildCoverVariants(
    Object.entries(coverVersions).map(([path, version]) => `${path}?v=${version}`),
  )
  : new Map()
const coverSrcSets = Object.fromEntries([...responsiveCovers].map(([image, { srcSet }]) => [image, srcSet]))
const coverVariants = Object.fromEntries([...responsiveCovers].map(([image, { width, variants }]) => [image, { width, variants }]))
writeIfChanged(new URL('.generated-cover-srcsets.json', base), JSON.stringify(coverVariants))
const collectionCoverSrcSets = Object.fromEntries(blogCollections.map(({ slug, image }) => [
  slug, coverSrcSets[`${image}?v=${coverVersions[image]}`],
]))
writeIfChanged(new URL('.generated-collection-cover-srcsets.json', base), JSON.stringify(collectionCoverSrcSets))
const searchDir = new URL('.generated-blog-search/', base)
mkdirSync(searchDir, { recursive: true })
const publishedArticles = [...index, ...legacyArticles]
const featuredDatasetSlugs = new Set(JSON.parse(readFileSync(new URL('featured-research-datasets.json', base), 'utf8')).map(({ slug }) => slug))
const catalogDataset = ({ sources, ...dataset }) => dataset
const catalogArticles = publishedArticles
  .filter(({ dataset, additionalDatasets }) => dataset || additionalDatasets?.length)
  .map(({ slug, title, topic, region, dateTime, image, dataset, additionalDatasets }) => ({
    slug, title, topic, region, dateTime, image,
    ...(featuredDatasetSlugs.has(slug) && { srcSet: coverSrcSets[image] }),
    ...(dataset && { dataset: catalogDataset(dataset) }),
    ...(additionalDatasets?.length && { additionalDatasets: additionalDatasets.map(catalogDataset) }),
  }))
writeIfChanged(new URL('dataset-articles.json', searchDir), JSON.stringify(catalogArticles))
const articleList = publishedArticles.map(({ slug, title, topic, summary, date, dateTime, updatedDate, region, image, dataset, additionalDatasets = [] }) => ({
  slug, title, topic, summary, date, dateTime, updatedDate, region, image,
  datasetNames: [dataset?.name, ...additionalDatasets.map(item => item.name)].filter(Boolean).join(' '),
}))
const collectionList = blogCollections.map(({ slug, title, navLabel }) => ({ slug, title, navLabel }))
writeIfChanged(new URL('article-list.json', searchDir), JSON.stringify({ articles: articleList, collections: collectionList }))
const directoryGuides = index.map(({ slug, title, summary, topic, region, dataset }) => ({
  path: `/blog/${slug}`, title, summary, topic, kind: 'Guide', articleSlug: slug,
  searchContext: `${region ?? ''} ${dataset?.name ?? ''}`,
}))
const directoryDatasets = publishedArticles.flatMap(({ slug, topic, region, dataset, additionalDatasets = [] }) =>
  (dataset ? [dataset, ...additionalDatasets] : additionalDatasets).map(sample => ({
    path: `/datasets#${sample.anchor ? `${slug}-${sample.anchor}` : slug}`,
    title: sample.name,
    summary: sample.description,
    kind: 'Dataset',
    topic,
    searchContext: [sample.spatialCoverage, sample.temporalCoverage, region,
      ...sample.downloads.map(file => `${file.label} ${file.format}`),
      ...sample.sourceDetails.map(({ title, publisher }) => `${title} ${publisher}`),
    ].join(' '),
  })),
)
const featuredResourceSlugs = ['data-center-for-sale', 'commercial-property-insurance-data-apis', 'warehouse-site-selection-rail-truck-access']
const featuredResources = featuredResourceSlugs.flatMap(slug => articleList.filter(article => article.slug === slug))
const directorySummary = ({ searchContext, ...reference }) => reference
writeIfChanged(new URL('resource-directory.json', searchDir), JSON.stringify({
  guides: directoryGuides.map(directorySummary), datasets: directoryDatasets.map(directorySummary), featured: featuredResources,
}))
const directorySearch = Object.fromEntries(
  [...directoryGuides, ...directoryDatasets].map(({ path, searchContext }) => [path, searchContext]),
)
writeIfChanged(new URL('resource-directory-search.json', searchDir), JSON.stringify(directorySearch))
const research = JSON.parse(readFileSync(new URL('research-studies.json', base), 'utf8'))
const researchSlugs = new Set(research.studies.map(({ slug }) => slug))
writeIfChanged(new URL('research-articles.json', searchDir), JSON.stringify(publishedArticles.filter(({ slug }) => researchSlugs.has(slug))))
const articleSearch = Object.fromEntries(articles.map(article => {
  const headings = [
    ...article.sections.map(section => section.heading),
    ...article.faqs.map(faq => faq.question),
  ].join(' ')
  const body = [
    article.intro, ...article.takeaways,
    ...article.sections.flatMap(section => section.blocks.flatMap(block => {
      switch (block.type) {
        case 'paragraph': return [block.text]
        case 'list': return block.items
        case 'table': return [...block.columns, ...block.rows.flat()]
        case 'download': return [block.label]
        case 'links': return block.items.map(item => item.label)
        default: return []
      }
    })),
    ...article.faqs.map(faq => faq.answer),
    ...article.sources.flatMap(source => [source.publisher, source.title]),
  ].join('\n')
  const bodyTerms = [...new Set(articleSearchWords(body))].sort()
  return [article.slug, { headings, bodyTerms }]
}))
writeIfChanged(new URL('details.json', searchDir), JSON.stringify(articleSearch))
const siteSlugs = articles.filter(article => ['site-listing', 'site-guide', 'study-guide', 'compute-guide', 'india-guide'].includes(article.kind)).map(article => article.slug)
writeIfChanged(new URL('site-article-slugs.json', base), `${JSON.stringify(siteSlugs, null, 2)}\n`)
writeIfChanged(new URL('earth-coverage-examples.json', base), `${JSON.stringify(coverageExamples, null, 2)}\n`)
for (const [slug, csv] of worksheets) {
  writeIfChanged(new URL(`../public/blog/${slug}.csv`, import.meta.url), csv)
}
const catalog = new Map([...index, ...legacyArticles].map(article => [article.slug, article]))
const articleCovers = new Map([...responsiveCovers].map(([image, { width, height, srcSet }]) => [image, { width, height, srcSet }]))
const articleCollectionLinks = buildArticleCollectionLinks(blogCollections, articles)
writeEntryModules(new URL('.generated-articles/', base), articles.map(({ relatedSlugs, dataset, coverFile, ...article }, i) => ({
  ...article,
  published: index[i],
  coverImage: articleCovers.get(index[i].image),
  collectionLink: articleCollectionLinks.get(article.slug),
  relatedReading: relatedSlugs.map((slug, position) => {
    const { title, topic, image } = catalog.get(slug)
    const srcSet = position < 2 ? responsiveCovers.get(image)?.srcSet : undefined
    return { slug, title, topic, image, srcSet }
  }),
})))
writeEntryModules(new URL('.generated-legacy-articles/', base), legacyArticles.map(article => ({
  ...article,
  relatedReading: [],
})))

writeEntryModules(new URL('.generated-glossary/entries/', base), glossary)
const summaries = glossary.map(({ slug, term, aliases, short_definition, topic }) => ({
  slug, term, aliases, short_definition, topic,
}))
writeIfChanged(new URL('.generated-glossary/index.json', base), JSON.stringify(summaries))
console.log(`Validated and indexed ${articles.length} industry guides and ${glossary.length} glossary entries`)
