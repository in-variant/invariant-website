#!/usr/bin/env node
// Agent-readable copies of the site, written into dist/ after prerender:
//   /blog/<slug>.md       one markdown file per industry article (site, due diligence, compliance guides)
//   /glossary/<slug>.md   one markdown file per glossary entry
//   /product.md          platform overview and agent setup
//   /research.md         selected Invariant case studies, methods, and downloads
//   /datasets.md         catalog of published research datasets and their downloads
//   /datasets.json       dataset sources, coverage, downloads, and SHA-256 checksums
//   /datasets.csl.json   dataset citations for reference managers
//   /llms-full.txt        every industry article in full, due diligence and power studies first
// Agents and LLM crawlers fetch these instead of parsing HTML. Each HTML page links its .md
// with <link rel="alternate" type="text/markdown"> (scripts/prerender.mjs).

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DIST = join(ROOT, 'dist')
const SITE = 'https://invariant-ai.com'
const SITE_EMAIL = 'pranav@invariant-ai.com'
const SITE_BOOKING = 'https://cal.com/pranav-goswami/website-30min'
const CONTACT = `Site screens and power studies: ${SITE_EMAIL}, (628) 220-8972, ${SITE_BOOKING}`

const FILES = ['data-apis.json', 'ai-compute-capacity.json', 'site-due-diligence.json', 'data-center-site-finder.json', 'site-selection-guides.json', 'powered-land-sites.json', 'data-centers.json', 'data-center-operations.json', 'data-center-fire-safety.json', 'india-data-centres.json', 'oil-gas.json']
const articles = FILES.flatMap(f => JSON.parse(readFileSync(join(ROOT, 'src/data/industry-articles', f), 'utf8')))
const blogCollections = JSON.parse(readFileSync(join(ROOT, 'src/data/blog-collections.json'), 'utf8'))
const articleIndex = JSON.parse(readFileSync(join(ROOT, 'src/data/industry-article-index.json'), 'utf8'))
const featuredResearch = JSON.parse(readFileSync(join(ROOT, 'src/data/featured-research-datasets.json'), 'utf8'))
const datasetCatalog = JSON.parse(readFileSync(join(ROOT, 'src/data/research-dataset-catalog.json'), 'utf8'))
const workflowGroups = JSON.parse(readFileSync(join(ROOT, 'src/data/research-dataset-workflows.json'), 'utf8'))
const product = JSON.parse(readFileSync(join(ROOT, 'src/data/earth-product.json'), 'utf8'))
const coverage = JSON.parse(readFileSync(join(ROOT, 'src/data/earth-coverage-summary.json'), 'utf8'))
const coverageTopics = JSON.parse(readFileSync(join(ROOT, 'src/data/earth-coverage-topics.json'), 'utf8'))
const coverageFields = JSON.parse(readFileSync(join(ROOT, 'public/data-coverage-fields.json'), 'utf8'))
const research = JSON.parse(readFileSync(join(ROOT, 'src/data/research-studies.json'), 'utf8'))
const glossary = JSON.parse(readFileSync(join(ROOT, 'src/pages/_data/glossary.json'), 'utf8')).entries ?? []
const glossaryBySlug = new Map(glossary.map(entry => [entry.slug, entry]))
const datasetEntries = articleIndex.flatMap(article => {
  const { dataset, additionalDatasets = [] } = article
  const datasets = dataset ? [dataset, ...additionalDatasets] : additionalDatasets
  return datasets.map(dataset => ({
    ...article,
    dataset,
    url: `${SITE}/blog/${article.slug}#${dataset.anchor ?? 'dataset'}`,
  }))
})
const primaryDatasets = new Map(datasetEntries.filter(entry => !entry.dataset.anchor).map(entry => [entry.slug, entry]))
const sourceReuseByDownload = new Map(datasetEntries
  .filter(({ dataset }) => dataset.sourceReuse)
  .map(({ slug, dataset }) => [`${slug}:${dataset.downloads[0].path}`, dataset.sourceReuse]))
const datasetTopics = new Map(datasetEntries.map(({ slug }) => [slug, []]))
for (const [label, slugs] of Object.entries(datasetCatalog.topics)) {
  for (const slug of slugs) {
    const topics = datasetTopics.get(slug)
    if (!topics || topics.includes(label)) throw new Error(`Invalid or duplicate dataset topic "${label}" for ${slug}`)
    topics.push(label)
  }
}
for (const [slug, topics] of datasetTopics) {
  if (topics.length === 0) throw new Error(`Missing research dataset topic for ${slug}`)
}
const researchWorkflows = new Map()
for (const { label, url, articles } of workflowGroups) {
  for (const slug of articles) {
    if (!primaryDatasets.has(slug) || researchWorkflows.has(slug)) throw new Error(`Invalid or duplicate research workflow for ${slug}`)
    if (new URL(url).pathname === `/blog/${slug}`) throw new Error(`Research workflow links to itself for ${slug}`)
    researchWorkflows.set(slug, { label, url })
  }
}
const titles = new Map(articles.map(a => [a.slug, a.title]))
const cell = s => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ')
const linkText = s => s.replace(/[\\[\]]/g, '\\$&')

function articleMd(a) {
  const src = new Map(a.sources.map(s => [s.id, s]))
  const workflow = researchWorkflows.get(a.slug)
  const datasetDownload = primaryDatasets.get(a.slug)?.dataset.downloads[0]?.path
  const cite = ids => ids?.length ? ' ' + ids.map(id => src.get(id)).filter(Boolean).map(s => `([${s.linkLabel ?? s.publisher}](${s.url}))`).join(' ') : ''
  const out = [`# ${a.title}`, '', `> ${a.description}`, '', `URL: ${SITE}/blog/${a.slug}  `, `Published: ${a.date}${a.updatedDate ? ` · Updated: ${a.updatedDate}` : ''} · Publisher: Invariant · Region: ${a.region ?? 'United States'}`, '', a.intro, '']
  if (a.takeaways?.length) out.push('## Key points', '', ...a.takeaways.map(t => `- ${t}`), '')
  for (const s of a.sections) {
    out.push(`## ${s.heading}`, '')
    for (const b of s.blocks) {
      if (b.type === 'paragraph') out.push(b.text + cite(b.sourceIds), '')
      else if (b.type === 'list') out.push(...b.items.map(i => `- ${i}`), ...(b.sourceIds?.length ? ['', `Sources:${cite(b.sourceIds)}`] : []), '')
      else if (b.type === 'table') {
        if (b.worksheet) out.push(`[Download the worksheet (CSV)](${SITE}/blog/${a.slug}.csv)`, '')
        const rows = b.rows.map((row, rowIndex) => {
          const cells = row.map(cell)
          cells[cells.length - 1] += cite(b.rowSourceIds?.[rowIndex])
          return `| ${cells.join(' | ')} |`
        })
        out.push(`| ${b.columns.map(cell).join(' | ')} |`, `| ${b.columns.map(() => '---').join(' | ')} |`, ...rows, ...(b.sourceIds?.length ? ['', `Sources:${cite(b.sourceIds)}`] : []), '')
      } else if (b.type === 'download') {
        out.push(`[${b.label} (${b.format})](${SITE}${b.path})`, '')
        const reuse = sourceReuseByDownload.get(`${a.slug}:${b.path}`)
        if (reuse) out.push(`${reuse.note} [${linkText(reuse.policyLabel)}](<${reuse.policyUrl}>)`, '')
        if (workflow && b.path === datasetDownload) {
          out.push(`[${workflow.label}](${workflow.url})`, '')
        }
      } else if (b.type === 'links') out.push((b.label ? `**${b.label}:** ` : '') + b.items.map(i => `[${i.label}](${SITE}${i.path ?? `/blog/${i.slug}`})`).join(' · '), '')
    }
  }
  if (a.faqs?.length) {
    out.push('## Questions', '')
    for (const f of a.faqs) out.push(`### ${f.question}`, '', f.answer + cite(f.sourceIds), '')
  }
  if (a.sources?.length) out.push('## Sources', '', ...a.sources.map(s => `- ${s.publisher}: [${s.title}](${s.url})`), '')
  if (a.relatedSlugs?.length) out.push('## Related', '', ...a.relatedSlugs.map(s => `- [${titles.get(s) ?? s}](${SITE}/blog/${s})`), '')
  if (a.kind === 'site-guide' && a.service) {
    out.push('---', '', `[Prepare a site request](${SITE}/contact?request=site-selection) · [Book a site selection call](${SITE_BOOKING})`, '')
  } else if (a.kind === 'india-guide') {
    out.push('---', '', `[Email your India data centre project requirements](mailto:${SITE_EMAIL}) · [Book a call](${SITE_BOOKING})`, '')
  } else if (a.kind) out.push('---', '', CONTACT, '')
  return out.join('\n')
}

function glossaryMd(e) {
  const out = [`# ${e.term}`, '', `> ${e.short_definition}`, '', `URL: ${SITE}/glossary/${e.slug}  `, `Updated: ${e.last_updated ?? ''} · Publisher: Invariant`, '']
  if (e.aliases?.length) out.push(`Also called: ${e.aliases.join(', ')}`, '')
  out.push(e.full_definition ?? '', '')
  if (e.citations?.length) out.push('## Sources', '', ...e.citations.map(c => `- [${c.label}](${c.url})`), '')
  if (e.guide) out.push(`Guide: [${e.guide.label}](${SITE}${e.guide.path})`, '')
  const related = (e.related_to ?? []).map(slug => glossaryBySlug.get(slug)).filter(Boolean)
  if (related.length) out.push('Related: ' + related.map(({ slug, term }) =>
    `[${linkText(term)}](${SITE}/glossary/${slug})`).join(', '), '')
  return out.join('\n')
}

function productMd() {
  const { links, sample } = product
  return [
    `# ${product.title}`, '', product.lede, '',
    `URL: ${SITE}/product`,
    `Updated: ${product.updatedDate}`, '',
    `- [Get an API key](${links.keys})`,
    `- [Quickstart](${links.quickstart})`,
    `- [Look up a parcel by address](${links.parcelLookup})`,
    `- [Check API data coverage](${SITE}${links.coverage})`,
    `- [Browse API fields](${links.fields})`,
    `- [Live point fields](${links.pointFields}) and [live parcel fields and presets](${links.parcelFields})`, '',
    '## Choose what to query', '',
    ...product.operations.map(({ title, method, description, docs }) => `- [${title}](${docs}) (${method}). ${description}`), '',
    `## Documented API example for ${sample.location}`, '',
    `Endpoint: ${sample.endpoint}. See the [response reference](${links.responses}).`, '',
    'Request body', '', '```json', JSON.stringify(sample.request, null, 2), '```', '',
    'Elevation field excerpt', '', '```json', JSON.stringify({ elevation: sample.field }, null, 2), '```', '',
    '## Use Earth in your coding agent', '',
    `[MCP setup instructions](${links.mcp}) for the server at ${links.mcpEndpoint}.`, '',
    'Copy this setup prompt into your coding agent.', '', `> ${product.setupPrompt}`, '',
    `## ${product.examplesHeading}`, '', product.examplesDescription, '',
    ...product.examples.flatMap(({ audience, title, description, href, workflow }) => [
      `- ${audience}. [${title}](${SITE}${href}). ${description}`,
      `  - [${workflow.label}](${workflow.href})`,
    ]), '',
    `- [Research datasets](${SITE}${links.datasets})`,
    `- [Research case studies](${SITE}${links.research})`,
    `- [All data guides](${SITE}${links.guides})`, '',
    '## Verify a site or power plan', '',
    `- [Site due diligence](${SITE}${links.diligence})`,
    `- [Power-flow studies](${SITE}${links.power})`, '',
    `[Earlier regulatory workspace walkthrough](${SITE}/product#platform-demo)`, '',
  ].join('\n')
}

function coverageMd() {
  const names = new Set(coverageFields.map(field => field.name))
  const shared = coverageFields.filter(({ definitions }) => definitions.point && definitions.parcel).length
  const operatorFields = coverageFields.filter(({ definitions }) => Object.values(definitions).some(definition => definition.operatorOnly))
  if (names.size !== coverage.distinct || names.size !== coverageFields.length || shared !== coverage.shared ||
      operatorFields.length !== coverage.operatorOnly ||
      coverageFields.filter(({ definitions }) => definitions.point).length !== coverage.point ||
      coverageFields.filter(({ definitions }) => definitions.parcel).length !== coverage.parcel ||
      coverageTopics.some(({ fields }) => fields.some(name => !names.has(name)))) {
    throw new Error('Earth field coverage summary or highlighted fields do not match the snapshot')
  }
  for (const { researchTopic } of coverageTopics) {
    if (!Object.hasOwn(datasetCatalog.topics, researchTopic) || !datasetCatalog.topics[researchTopic].length) {
      throw new Error(`Missing research samples for coverage topic: ${researchTopic}`)
    }
  }
  const { links } = product
  return [
    '# Invariant Earth API data coverage', '',
    `[Search the coverage catalog](${SITE}${links.coverage}). Snapshot checked ${coverage.checkedDate}.`, '',
    `The public manifests list ${coverage.distinct} distinct field names. ${coverage.point} are listed for point lookup and ${coverage.parcel} for parcel enrichment, with ${coverage.shared} names appearing in both.`, '',
    'Check the definition for the operation you plan to call. A listed field can be unavailable at a given location.', '',
    ...(operatorFields.length ? ['## Fields marked as requiring an operator key', '',
      ...operatorFields.map(({ name, definitions }) =>
        '- `' + name + '`. ' + Object.entries(definitions).filter(([, definition]) => definition.operatorOnly)
          .map(([operation]) => operation === 'point' ? '`POST /v1/fetch`' : '`POST /v1/enrich`').join(' and ') + '.'),
      '',
    ] : []),
    `- [Live point lookup manifest](${links.pointFields}) for \`POST /v1/fetch\`.`,
    `- [Live parcel enrichment manifest](${links.parcelFields}) for \`POST /v1/enrich\`.`,
    `- [Download the dated field snapshot](${SITE}/data-coverage-fields.json).`,
    `- [Check response status and provenance](${links.responses}).`, '',
    '## Workflows and field examples', '',
    ...coverageTopics.flatMap(({ title, description, fields, guide, guideLabel, researchTopic }) => [
      `### ${title}`, '', description, '',
      `Fields: ${fields.map(name => `\`${name}\``).join(', ')}.`, '',
      `- [${guideLabel}](${SITE}${guide})`,
      `- [View research samples](${SITE}/datasets?${new URLSearchParams({ topic: researchTopic })}#dataset-search)`, '',
    ]),
  ].join('\n')
}

function researchMd() {
  if (!research.studies.length) throw new Error('Research must include at least one study')
  const { heading, description, examples } = research.recordHistory
  const out = [
    `# ${research.title}`, '', research.description, '',
    `URL: ${SITE}/research`,
    `Updated: ${research.updatedDate}`, '',
    `- [Browse research datasets](${SITE}/datasets)`,
    `- [Explore data guides](${SITE}/blog/physical-world-data-by-use-case)`, '',
    `## ${heading}`, '', description, '',
  ]
  for (const { slug, anchor = 'dataset', topic, title, linkLabel, observations } of examples) {
    const url = `${SITE}/blog/${slug}#${anchor}`
    if (!datasetEntries.some(entry => entry.url === url)) throw new Error(`Missing record history dataset at ${url}`)
    out.push(
      `### ${title}`, '', topic, '',
      ...observations.map(({ date, text }) => `- ${date}. ${text}`), '',
      `[${linkLabel}](${url})`, '',
    )
  }
  out.push('## Selected studies', '')
  for (const { slug, anchor = 'dataset', topic, title, summary } of research.studies) {
    const url = `${SITE}/blog/${slug}#${anchor}`
    const matches = datasetEntries.filter(entry => entry.url === url)
    if (matches.length !== 1) throw new Error(`Expected one research dataset at ${url}, found ${matches.length}`)
    const { dataset } = matches[0]
    out.push(
      `### ${title}`, '', topic, '', summary, '',
      `- [Sources and methods](${url})`,
      ...dataset.downloads.map(file => `- [${linkText(file.label)} (${file.format})](${SITE}${file.path})`),
      '',
    )
  }
  out.push(`[Download citations for a reference manager (CSL JSON)](${SITE}/datasets.csl.json)`, '')
  return out.join('\n')
}

function datasetCatalogMd() {
  const out = [
    '# Invariant research datasets', '',
    `Catalog page: ${SITE}/datasets`, '',
    datasetCatalog.description, '',
    datasetCatalog.access, '',
    `${datasetEntries.length} published research examples.`, '',
    `[Download citations for a reference manager (CSL JSON)](${SITE}/datasets.csl.json)`, '',
    `[Explore the Invariant Earth API](${SITE}/product), [browse API fields](${product.links.fields}), or [screen a site](${product.links.siteScreen}).`, '',
    `[Browse data guides by industry and use case](${SITE}/blog/physical-world-data-by-use-case)`, '',
    '## Start with your workflow', '',
    ...featuredResearch.flatMap(({ slug, title, summary, evidence, workflowLabel }) => {
      const study = primaryDatasets.get(slug)
      const workflow = researchWorkflows.get(slug)
      if (!study || !workflow) throw new Error(`Missing featured research dataset or workflow for ${slug}`)
      const sample = study.dataset.downloads[0]
      return [
        `- [${title}](${study.url}). ${summary}`,
        `  - Research inputs: ${evidence}`,
        `  - [${workflowLabel}](${workflow.url})`,
        `  - [Download the ${sample.format} sample](${SITE}${sample.path})`,
      ]
    }), '',
    '## All research datasets', '',
    ...Object.keys(datasetCatalog.topics).map(label => {
      const params = new URLSearchParams({ topic: label })
      const count = datasetEntries.filter(({ slug }) => datasetTopics.get(slug).includes(label)).length
      return `- [${label}](${SITE}/datasets?${params}#dataset-search) · ${count} research examples`
    }), '',
  ]
  for (const { slug, dateTime, dataset, url } of datasetEntries) {
    const workflow = researchWorkflows.get(slug)
    out.push(
      `### ${dataset.name}`, '', dataset.description, '',
      ...(datasetTopics.get(slug).length ? [`- Topics: ${datasetTopics.get(slug).join(' · ')}`] : []),
      `- [Dataset notes](${url}) · [Markdown guide](${SITE}/blog/${slug}.md)`,
      ...(workflow ? [`- [${workflow.label}](${workflow.url})`] : []),
      `- Published: ${dataset.datePublished ?? dateTime}`,
      ...(dataset.spatialCoverage ? [`- Spatial coverage: ${dataset.spatialCoverage}`] : []),
      ...(dataset.temporalCoverage ? [`- Temporal coverage: ${dataset.temporalCoverage}`] : []),
      ...(dataset.sourceReuse ? [`- ${dataset.sourceReuse.note} [${linkText(dataset.sourceReuse.policyLabel)}](<${dataset.sourceReuse.policyUrl}>)`] : []),
      ...dataset.downloads.map(file => `- [${file.label} (${file.format})](${SITE}${file.path})`),
      '', 'Source records', '',
      ...dataset.sourceDetails.map(({ publisher, title, url }) => `- ${publisher} · [${linkText(title)}](<${url}>)`),
      '',
    )
  }
  return out.join('\n')
}

function datasetCatalogJson() {
  return {
    url: `${SITE}/datasets`,
    publisher: 'Invariant',
    datasets: datasetEntries.map(({ slug, title, dateTime, updatedDate, dataset, url }) => {
      const { anchor, downloads, ...metadata } = dataset
      return {
        url,
        ...metadata,
        topics: datasetTopics.get(slug),
        ...(researchWorkflows.has(slug) && { workflow: researchWorkflows.get(slug) }),
        guide: {
          title,
          published: dateTime,
          ...(updatedDate && { updated: updatedDate }),
          markdown: `${SITE}/blog/${slug}.md`,
        },
        downloads: downloads.map(({ path, label, format }) => {
          const contents = readFileSync(join(DIST, path.slice(1)))
          return {
            url: `${SITE}${path}`,
            label,
            format,
            bytes: contents.length,
            sha256: createHash('sha256').update(contents).digest('hex'),
          }
        }),
      }
    }),
  }
}

mkdirSync(join(DIST, 'blog'), { recursive: true })
mkdirSync(join(DIST, 'glossary'), { recursive: true })
writeFileSync(join(DIST, 'product.md'), productMd())
writeFileSync(join(DIST, 'data-coverage.md'), coverageMd())
writeFileSync(join(DIST, 'research.md'), researchMd())
writeFileSync(join(DIST, 'datasets.md'), datasetCatalogMd())
writeFileSync(join(DIST, 'datasets.json'), `${JSON.stringify(datasetCatalogJson(), null, 2)}\n`)
const datasetCitations = datasetEntries.map(({ dataset, dateTime, url }) => ({
  id: url,
  type: 'dataset',
  title: dataset.name,
  author: [{ literal: 'Invariant' }],
  issued: { 'date-parts': [(dataset.datePublished ?? dateTime).split('-').map(Number)] },
  URL: url,
}))
writeFileSync(join(DIST, 'datasets.csl.json'), `${JSON.stringify(datasetCitations, null, 2)}\n`)
const full = ['# Invariant: data, site selection, power and compliance guides', '', '> Full text of Invariant’s data and API guides, data center site and power diligence articles, and industry compliance guides. Find topics at https://invariant-ai.com/llms.txt. Each included article has a Markdown copy at its URL plus `.md`.', '', `[Invariant Earth product and agent setup](${SITE}/product.md)`, '', CONTACT, '']
for (const collection of blogCollections) {
  const md = [
    `# ${collection.heading}`, '', collection.description, '',
    `URL: ${SITE}/blog/${collection.slug}  `, `Updated: ${collection.updatedDate} · Publisher: Invariant`, '',
    ...(collection.resourceLinks ? [
      ...collection.resourceLinks.map(({ label, href }) => `- [${label}](${new URL(href, SITE).href})`), '',
    ] : []),
    `## ${collection.checklistTitle}`, '',
    ...collection.checks.map(check => `- **${check.title}.** ${check.detail}`), '',
    ...(collection.worksheet ? [
      `[${collection.worksheet.label}](${SITE}${collection.worksheet.path}). ${collection.worksheet.detail}`, '',
    ] : []),
    `## ${collection.guidesTitle}`, '',
    ...collection.guides.flatMap((guide, index) => [
      ...(guide.group && guide.group !== collection.guides[index - 1]?.group ? ['', `### ${guide.group}`, ''] : []),
      `- [${guide.label}](${SITE}/blog/${guide.slug}). ${guide.detail}`,
    ]), '',
  ].join('\n')
  writeFileSync(join(DIST, 'blog', `${collection.slug}.md`), md)
  full.push('', '---', '', md)
}
for (const a of articles) {
  const md = articleMd(a)
  writeFileSync(join(DIST, 'blog', `${a.slug}.md`), md)
  full.push('', '---', '', md)
}
writeFileSync(join(DIST, 'llms-full.txt'), full.join('\n'))

for (const e of glossary) writeFileSync(join(DIST, 'glossary', `${e.slug}.md`), glossaryMd(e))
console.log(`agent markdown: ${articles.length} articles, ${blogCollections.length} collections, ${glossary.length} glossary entries, llms-full.txt`)
