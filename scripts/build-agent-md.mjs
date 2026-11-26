#!/usr/bin/env node
// Agent-readable copies of the site, written into dist/ after prerender:
//   /blog/<slug>.md       one markdown file per industry article (site, due diligence, compliance guides)
//   /glossary/<slug>.md   one markdown file per glossary entry
//   /product.md          platform overview and agent setup
//   /resources.md        workflow guides, research, and planning links
//   /research.md         selected Invariant case studies, methods, and downloads
//   /datasets.md         catalog of published research datasets and their downloads
//   /datasets.json       dataset sources, coverage, downloads, and SHA-256 checksums
//   /datasets.csl.json   dataset citations for reference managers
//   /citations/*.csl.json one citation file per research dataset
//   /llms/topics/*.md    guide directories by industry and decision
//   /llms-full.txt        every industry article in full, due diligence and power studies first
// Agents and LLM crawlers fetch these instead of parsing HTML. Each HTML page links its .md
// with <link rel="alternate" type="text/markdown"> (scripts/prerender.mjs).

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { coverageFieldPath } from '../src/data/coverageFieldPath.mjs'
import { datasetCitationPath } from '../src/data/datasetCitationPath.mjs'
import { formatEarthRequest } from '../src/data/formatEarthRequest.mjs'
import { buildArticleCollectionLinks, guideGroupId } from '../src/data/collectionGuideLinks.mjs'
import { agentTopicGuides } from './agent-topic-guides.mjs'
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
const providerTrial = JSON.parse(readFileSync(join(ROOT, 'src/data/physical-world-data-api-trial.json'), 'utf8'))
const providerComparisons = JSON.parse(readFileSync(join(ROOT, 'src/data/physical-world-provider-comparisons.json'), 'utf8'))
const articleIndex = JSON.parse(readFileSync(join(ROOT, 'src/data/industry-article-index.json'), 'utf8'))
const featuredResearch = JSON.parse(readFileSync(join(ROOT, 'src/data/featured-research-datasets.json'), 'utf8'))
const datasetCatalog = JSON.parse(readFileSync(join(ROOT, 'src/data/research-dataset-catalog.json'), 'utf8'))
const workflowGroups = JSON.parse(readFileSync(join(ROOT, 'src/data/research-dataset-workflows.json'), 'utf8'))
const mcp = JSON.parse(readFileSync(join(ROOT, 'src/data/earth-mcp.json'), 'utf8'))
const product = JSON.parse(readFileSync(join(ROOT, 'src/data/earth-product.json'), 'utf8'))
const coverage = JSON.parse(readFileSync(join(ROOT, 'src/data/earth-coverage-summary.json'), 'utf8'))
const coverageTopics = JSON.parse(readFileSync(join(ROOT, 'src/data/earth-coverage-topics.json'), 'utf8'))
const coverageFields = JSON.parse(readFileSync(join(ROOT, 'public/data-coverage-fields.json'), 'utf8'))
const resourceHub = JSON.parse(readFileSync(join(ROOT, 'src/data/resource-hub.json'), 'utf8'))
const virginiaSites = JSON.parse(readFileSync(join(ROOT, 'src/data/virginia-industrial-sites-snapshot.json'), 'utf8'))
const resourceDirectory = JSON.parse(readFileSync(join(ROOT, 'src/data/.generated-blog-search/resource-directory.json'), 'utf8'))
const research = JSON.parse(readFileSync(join(ROOT, 'src/data/research-studies.json'), 'utf8'))
const researchArticles = JSON.parse(readFileSync(join(ROOT, 'src/data/.generated-blog-search/research-articles.json'), 'utf8'))
const glossary = JSON.parse(readFileSync(join(ROOT, 'src/pages/_data/glossary.json'), 'utf8')).entries ?? []
const glossaryBySlug = new Map(glossary.map(entry => [entry.slug, entry]))
const glossaryTopics = JSON.parse(readFileSync(join(ROOT, 'src/data/glossary-topics.json'), 'utf8'))
const glossaryDirectory = JSON.parse(readFileSync(join(ROOT, 'src/data/glossary-directory.json'), 'utf8'))
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
const datasetByFirstDownload = new Map(datasetEntries
  .map(entry => [`${entry.slug}:${entry.dataset.downloads[0].path}`, entry]))
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
const articleCollectionLinks = buildArticleCollectionLinks(blogCollections, articles)
const cell = s => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ')
const linkText = s => s.replace(/[\\[\]]/g, '\\$&')
const citationLink = (label, url) => `[${linkText(label)}](<${url}>)`
const sectionLink = (label, page, id) => citationLink(label, `${page}#${encodeURIComponent(id)}`)

function articleMd(a) {
  const page = `${SITE}/blog/${a.slug}`
  const src = new Map(a.sources.map(s => [s.id, s]))
  const workflow = researchWorkflows.get(a.slug)
  const datasetDownload = primaryDatasets.get(a.slug)?.dataset.downloads[0]?.path
  const cite = ids => ids?.length ? ' ' + ids.map(id => src.get(id)).filter(Boolean)
    .map(s => `(${citationLink(s.linkLabel ?? s.publisher, s.url)})`).join(' ') : ''
  const out = [`# ${a.title}`, '', `> ${a.description}`, '', `URL: ${SITE}/blog/${a.slug}  `, `Published: ${a.date}${a.updatedDate ? ` · Updated: ${a.updatedDate}` : ''} · Publisher: Invariant · Region: ${a.region ?? 'United States'}`, '', a.intro, '']
  if (a.listingSections) {
    out.push(...a.listingSections.map(({ id, label }) => `- [${linkText(label)}](${SITE}/blog/${a.slug}#${id})`),
      `- [Request a shortlist](${SITE}/contact?request=site-selection)`, '')
  }
  if (a.guideActions) {
    out.push(...a.guideActions.map(({ href, label }) => {
      const url = new URL(href, `${SITE}/blog/${a.slug}`)
      return `- ${citationLink(label, url.href)}`
    }), '')
  }
  const collectionLink = articleCollectionLinks.get(a.slug)
  if (collectionLink) out.push(`Browse [${linkText(collectionLink.label)}](${SITE}${collectionLink.path}) for related guides.`, '')
  if (a.takeaways?.length) out.push('## Key points', '', ...a.takeaways.map(t => `- ${t}`), '')
  for (const s of a.sections) {
    out.push(`## ${sectionLink(s.heading, page, s.id)}`, '')
    for (const b of s.blocks) {
      if (b.type === 'paragraph') out.push(b.text + cite(b.sourceIds), '')
      else if (b.type === 'list') out.push(...b.items.map(i => `- ${i}`), ...(b.sourceIds?.length ? ['', `Sources:${cite(b.sourceIds)}`] : []), '')
      else if (b.type === 'shell') out.push('```bash', b.command, '```', '')
      else if (b.type === 'site-comparison') out.push(citationLink('Run the site comparison with your own requirements', `${SITE}/blog/${a.slug}#${s.id}`), '')
      else if (b.type === 'trade-area-overlap') out.push(citationLink('Calculate trade area overlap with your household counts', `${SITE}/blog/${a.slug}#${s.id}`), '')
      else if (b.type === 'table') {
        if (b.worksheet) out.push(`[Download the worksheet (CSV)](${SITE}/blog/${a.slug}.csv)`, '')
        const rows = b.rows.map((row, rowIndex) => {
          const cells = row.map(cell)
          const rowSectionId = b.rowSectionIds?.[rowIndex]
          if (rowSectionId) cells[0] = cell(citationLink(row[0], `${SITE}/blog/${a.slug}#${rowSectionId}`))
          cells[cells.length - 1] += cell(cite(b.rowSourceIds?.[rowIndex]))
          return `| ${cells.join(' | ')} |`
        })
        out.push(`| ${b.columns.map(cell).join(' | ')} |`, `| ${b.columns.map(() => '---').join(' | ')} |`, ...rows, ...(b.sourceIds?.length ? ['', `Sources:${cite(b.sourceIds)}`] : []), '')
      } else if (b.type === 'download') {
        out.push(`[${b.label} (${b.format})](${SITE}${b.path})`, '')
        const record = datasetByFirstDownload.get(`${a.slug}:${b.path}`)
        if (record) out.push(`[Download citation (CSL JSON)](${SITE}${datasetCitationPath(record.url)})`, '')
        const archive = record?.dataset.archivedRelease
        if (archive) out.push(citationLink(`Archived release v${archive.version} · ${archive.datePublished}`, archive.url), '')
        const reuse = record?.dataset.sourceReuse
        if (reuse) out.push(`${reuse.note} ${citationLink(reuse.policyLabel, reuse.policyUrl)}`, '')
        if (workflow && b.path === datasetDownload) {
          out.push(`[${workflow.label}](${workflow.url})`, '')
        }
      } else if (b.type === 'links') out.push((b.label ? `**${b.label}:** ` : '') + b.items.map(i => `[${i.label}](${SITE}${i.path ?? `/blog/${i.slug}`})`).join(' · '), '')
    }
  }
  if (a.faqs?.length) {
    out.push(`## ${sectionLink('Questions', page, 'questions')}`, '')
    for (const f of a.faqs) out.push(`### ${f.question}`, '', f.answer + cite(f.sourceIds), '')
  }
  if (a.sources?.length) out.push(`## ${sectionLink('Sources', page, 'sources')}`, '', ...a.sources.map(s => `- ${s.publisher}: ${citationLink(s.title, s.url)}`), '')
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
  if (e.guide) out.push(`[${linkText(e.guide.label)}](${SITE}${e.guide.path})`, '')
  out.push(e.full_definition ?? '', '')
  if (e.citations?.length) out.push('## Sources', '', ...e.citations.map(c => `- ${citationLink(c.label, c.url)}`), '')
  const related = (e.related_to ?? []).map(slug => glossaryBySlug.get(slug)).filter(Boolean)
  if (related.length) out.push('Related: ' + related.map(({ slug, term }) =>
    `[${linkText(term)}](${SITE}/glossary/${slug})`).join(', '), '')
  return out.join('\n')
}

function glossaryDirectoryMd() {
  return [
    `# ${glossaryDirectory.title}`, '', glossaryDirectory.description, '',
    citationLink('Explore the glossary', SITE + '/glossary'), '',
    '## Definitions in practice', '',
    ...glossaryDirectory.examples.map(({ label, definition, guide, detail }) =>
      `- ${citationLink(glossaryBySlug.get(definition).term, `${SITE}/glossary/${definition}.md`)}. ${detail} ${citationLink(label, SITE + guide)}.`),
    '',
    ...Object.entries(glossaryTopics).flatMap(([topic, label]) => {
      const entries = glossary.filter(entry => entry.topic === topic).sort((a, b) => a.term.localeCompare(b.term))
      return entries.length ? [
        `## ${label}`, '',
        ...entries.map(entry => `- ${citationLink(entry.term, SITE + '/glossary/' + entry.slug + '.md')} · ${entry.short_definition}`), '',
      ] : []
    }),
  ].join('\n')
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
    `- [Request a data field](${links.fieldRequests})`,
    `- [Download the versioned Python parcel and flood trial](${links.gisTrial})`,
    `- [Live point fields](${links.pointFields}) and [live parcel fields and presets](${links.parcelFields})`, '',
    '## Choose what to query', '',
    ...product.operations.map(({ title, method, description, docs }) => `- [${title}](${docs}) (${method}). ${description}`), '',
    `## Documented API example for ${sample.location}`, '',
    `Endpoint: ${sample.endpoint}. See the [response reference](${links.responses}).`, '',
    'Request body', '', '```json', JSON.stringify(sample.request, null, 2), '```', '',
    'Elevation field excerpt', '', '```json', JSON.stringify({ elevation: sample.field }, null, 2), '```', '',
    '## Use Earth in your coding agent', '',
    `[MCP setup instructions](${links.mcp}) for the server at ${links.mcpEndpoint}.`, `[MCP server overview](${SITE}/mcp)`, '',
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
  ].join('\n')
}

function mcpMd() {
  const { links } = product
  return [
    `# ${mcp.heading}`, '', mcp.description, '',
    `URL: ${SITE}/mcp`, `Updated: ${mcp.updatedDate}`, '',
    '## Connect your agent', '',
    `Server URL: ${links.mcpEndpoint}`, `Transport: ${mcp.transport}`, '', mcp.signIn, '',
    `- [Setup instructions for your client](${links.mcp})`,
    `- [Official MCP Registry entry](${mcp.registryUrl})`, '',
    'Copy the setup prompt into your coding agent.', '', `> ${product.setupPrompt}`, '',
    '## What your agent can query', '',
    ...mcp.tools.map(({ name, title, description }) => `- ${title} (${name}). ${description}`), '',
    `[Read the tool reference](${mcp.toolsUrl}) · [Check data coverage](${SITE}${links.coverage})`, '',
    `## ${mcp.trial.heading}`, '', `> ${mcp.trial.question}`, '', mcp.trial.evidence, '',
    `- [Read the case](${SITE}${mcp.trial.guide})`,
    `- [Download reference data](${SITE}${mcp.trial.download})`,
    `- [Compare GIS MCP servers](${SITE}${mcp.comparison})`, '',
  ].join('\n')
}

function coverageMd() {
  const fieldsByName = new Map(coverageFields.map(field => [field.name, field]))
  const endpoints = { point: '/v1/fetch', parcel: '/v1/enrich' }
  const shared = coverageFields.filter(({ definitions }) => definitions.point && definitions.parcel).length
  const operatorFields = coverageFields.filter(({ definitions }) => Object.values(definitions).some(definition => definition.operatorOnly))
  if (fieldsByName.size !== coverage.distinct || fieldsByName.size !== coverageFields.length || shared !== coverage.shared ||
      operatorFields.length !== coverage.operatorOnly ||
      coverageFields.filter(({ definitions }) => definitions.point).length !== coverage.point ||
      coverageFields.filter(({ definitions }) => definitions.parcel).length !== coverage.parcel ||
      coverageTopics.some(({ fields }) => fields.some(name => !fieldsByName.has(name)))) {
    throw new Error('Earth field coverage summary or highlighted fields do not match the snapshot')
  }
  for (const { researchTopic } of coverageTopics) {
    if (!Object.hasOwn(datasetCatalog.topics, researchTopic) || !datasetCatalog.topics[researchTopic].length) {
      throw new Error(`Missing research samples for coverage topic: ${researchTopic}`)
    }
  }
  const { links } = product
  const { lat, lng } = product.sample.request
  const requestExamples = [
    ['point', 'electric_utility_service_territory', 'Find the candidate utility at a coordinate'],
    ['parcel', 'fema_flood_zone', 'Check the mapped flood zone for the parcel'],
  ].flatMap(([operation, name, heading]) => {
    if (!fieldsByName.get(name)?.definitions[operation]) throw new Error(`Missing ${operation} request example field: ${name}`)
    const endpoint = new URL(endpoints[operation], product.sample.endpoint).href
    return [
      `### ${heading}`, '',
      `[Field definition and request](${SITE}${coverageFieldPath(name, operation)})`, '',
      '```bash', formatEarthRequest(endpoint, { lat, lng, fields: [name] }), '```', '',
    ]
  })
  return [
    '# Invariant Earth API data coverage', '',
    `${sectionLink('Search the coverage catalog', `${SITE}${links.coverage}`, 'coverage-search')}. Snapshot checked ${coverage.checkedDate}.`, '',
    `The public manifests list ${coverage.distinct} distinct field names. ${coverage.point} are listed for point lookup and ${coverage.parcel} for parcel enrichment, with ${coverage.shared} names appearing in both.`, '',
    'Check the definition for the operation you plan to call. A listed field can be unavailable at a given location.', '',
    ...(operatorFields.length ? ['## Fields marked as requiring an operator key', '',
      ...operatorFields.map(({ name, definitions }) =>
        '- `' + name + '`. ' + Object.entries(definitions).filter(([, definition]) => definition.operatorOnly)
          .map(([operation]) => `\`POST ${endpoints[operation]}\``).join(' and ') + '.'),
      '',
    ] : []),
    `- [Live point lookup manifest](${links.pointFields}) for \`POST /v1/fetch\`.`,
    `- [Live parcel enrichment manifest](${links.parcelFields}) for \`POST /v1/enrich\`.`,
    `- [Point lookup field reference](${links.fields}) with units, sources, and explanations for missing results.`,
    `- [Parcel enrichment field reference](${links.parcelFieldReference}) with parcel fields, point fields, and presets.`,
    `- [Download the dated field snapshot](${SITE}/data-coverage-fields.json).`,
    `- [Request a field with example locations](${links.fieldRequests}).`,
    `- [Check response status and provenance](${links.responses}).`, '',
    '## Try a field request', '',
    'Set `INVARIANT_API_KEY` in your shell and use the coordinates you want to check. Fetch returns a status for each field. Enrich also reports the parcel match and explains unavailable fields in `field_omissions`.', '',
    ...requestExamples,
    '## Workflows and field examples', '',
    ...coverageTopics.flatMap(({ title, description, fields, guide, guideLabel, researchTopic }) => [
      `### ${title}`, '', description, '',
      ...fields.flatMap(name => Object.entries(fieldsByName.get(name).definitions).map(([operation, definition]) => {
        const unit = definition.unit ? ` Unit ${definition.unit}.` : ''
        const access = definition.operatorOnly ? ' Operator key required.' : ''
        return `- [\`${name}\`](${SITE}${coverageFieldPath(name, operation)}) (\`POST ${endpoints[operation]}\`). ${definition.description.trim()}${unit}${access} ${citationLink(definition.sourceLabel ?? definition.source, definition.sourceUrl)}.`
      })), '',
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
    `Updated: ${researchArticles.updatedDate}`, '',
    `- [Browse research datasets](${SITE}/datasets)`,
    `- [Explore data guides](${SITE}/blog/physical-world-data-by-use-case)`,
    `- [Check API data coverage](${SITE}${product.links.coverage})`,
    `- [Versioned downloads](${SITE}/research#versioned-downloads)`, '',
    '## Recent datasets by topic', '',
    ...researchArticles.recentDatasets.map(({ topic, title, datePublished, notesPath, download }) =>
      `- ${topic} · ${datePublished} · [${linkText(title)}](${SITE}${notesPath}) · [Download ${download.format}](${SITE}${download.path})`),
    '', `## ${heading}`, '', description, '',
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
      `- [Download this study’s citation (CSL JSON)](${SITE}${datasetCitationPath(url)})`,
      '',
    )
  }
  out.push('## Versioned downloads', '',
    ...research.versionedDownloads.map(({ title, topic, datePublished, version, methodPath, releaseUrl }) =>
      `- ${topic} · ${datePublished} · ${citationLink(title, SITE + methodPath)} · ${citationLink(version + ' on GitHub', releaseUrl)}`),
    '', `[Download citations for a reference manager (CSL JSON)](${SITE}/datasets.csl.json)`, '')
  return out.join('\n')
}

function virginiaSitesMd() {
  const directory = 'https://sites.vedp.org/'
  const snapshotDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(virginiaSites.checkedAt))
  return [
    '# Virginia industrial land for sale by acreage', '',
    `[Check current listings](${SITE}/virginia-industrial-land-for-sale) in the interactive screener.`, '',
    `Snapshot checked ${snapshotDate} UTC. The Virginia Economic Development Partnership (VEDP) Available Sites layer returned ${virginiaSites.saleListings} listing records marked for sale.`, '',
    '## How many listings meet 50, 100, or 200 acres?', '',
    '| Minimum in each field | Gross acres meet the minimum | Also meets contiguous acreage | Also meets construction acreage |',
    '| ---: | ---: | ---: | ---: |',
    ...virginiaSites.screens.map(({ minimum, gross, contiguous, construction }) => `| ${minimum} | ${gross} | ${contiguous} | ${construction} |`),
    '', 'The screen requires each field independently. The interactive tool flags records when an acreage field exceeds the stated gross acreage. Ask for the offered boundary and a plan showing where the contiguous and construction-suitable land overlaps. Confirm the proposed use, zoning and availability with the listing contact and local authority.', '',
    '## Example listings and reported acreage', '',
    '| Official listing | Locality | Gross acres | Contiguous acres | Construction acres | Listed zoning | Source update date |',
    '| --- | --- | ---: | ---: | ---: | --- | --- |',
    ...virginiaSites.examples.map(({ propertyId, name, locality, gross, contiguous, construction, zoning, sourceUpdated }) =>
      `| ${citationLink(name, directory + 'PropertyByID/' + propertyId)} | ${locality} | ${gross} | ${contiguous} | ${construction} | ${zoning ?? 'Unreported'} | ${sourceUpdated ?? 'Unreported'} |`),
    '', '## Sources and follow-up', '',
    `- ${citationLink('VEDP sites and buildings directory', directory)}.`,
    `- ${citationLink('Replay the VEDP Available Sites query', virginiaSites.sourceQuery)}. The source query returns current rows.`,
    `- ${citationLink('Screen industrial land by acreage and zoning', SITE + '/blog/industrial-land-for-sale-acreage-zoning.md')}.`,
    `- ${citationLink('Verify rail, water and power requirements for a manufacturing site', SITE + '/blog/manufacturing-site-selection-100-buildable-acres.md')}.`, '',
  ].join('\n')
}

function resourcesMd() {
  const { heading, intro, workflows, planningLinks } = resourceHub
  const { links } = product
  const out = [
    `# ${heading}`, '', intro, '',
    `[Resources on the website](${SITE}/resources)`, '',
    '## Find guides by workflow', '',
    `[Browse all data guides](${SITE}${links.guides})`, '',
  ]
  for (const { label, path, guide, slug } of workflows) {
    if (!titles.has(slug)) throw new Error(`Missing resources workflow guide for ${slug}`)
    out.push(`- [${linkText(label)}](${SITE}${path}) · [${linkText(guide)}](${SITE}/blog/${slug})`)
  }
  out.push(
    '', '## Downloads and API coverage', '',
    `- [Browse data samples](${SITE}${links.datasets})`,
    `- [Read the dataset catalog and citations](${SITE}${links.datasets}.md)`,
    `- [Get source URLs and download checksums](${SITE}${links.datasets}.json)`,
    `- [Check API data coverage](${SITE}${links.coverage})`,
    `- [Property, power, and infrastructure glossary](${SITE}/glossary.md)`,
    `- [Invariant Earth API quickstart](${links.quickstart})`, '',
    '## Featured research', '',
    `[Explore research](${SITE}${links.research})`, '',
    ...resourceDirectory.featured.map(({ title, slug, summary }) =>
      `- [${linkText(title)}](${SITE}/blog/${slug}). ${summary}`),
    '', '## Planning resources', '',
    ...planningLinks.map(({ label, path }) => `- [${linkText(label)}](${SITE}${path})`),
    '', `[Talk to an expert](${SITE}/contact)`, '',
  )
  return out.join('\n')
}

function datasetCatalogMd() {
  const { siteSearch, underwriting, powerStudy } = datasetCatalog
  const out = [
    '# Data samples for the physical economy', '',
    `Catalog page: ${SITE}/datasets`, '',
    datasetCatalog.description, '',
    datasetCatalog.access, '',
    `${datasetEntries.length} published research examples.`, '',
    `[Download citations for a reference manager (CSL JSON)](${SITE}/datasets.csl.json)`, '',
    `[See what you can query in the live Earth API](${SITE}${product.links.coverage}), [try the Earth API](${product.links.quickstart}), or [screen a site](${product.links.siteScreen}).`, '',
    `[Browse data guides by industry and use case](${SITE}/blog/physical-world-data-by-use-case)`, '',
    `## ${siteSearch.title}`, '',
    siteSearch.description, '',
    `- [${siteSearch.listingsLabel}](${SITE}${siteSearch.listingsPath})`,
    `- [${siteSearch.requestLabel}](${SITE}${siteSearch.requestPath})`, '',
    `## ${underwriting.title}`, '',
    underwriting.description, '',
    `- [${underwriting.floodLabel}](${underwriting.floodUrl})`,
    `- [${underwriting.portfolioLabel}](${SITE}${underwriting.portfolioPath})`, '',
    `## ${powerStudy.title}`, '',
    powerStudy.description, '',
    `- [${powerStudy.label}](${SITE}${powerStudy.path})`, '',
    '## See what the data can answer', '',
    ...featuredResearch.flatMap(({ slug, title, summary, scope, evidence, workflowLabel, workflowType }) => {
      const study = primaryDatasets.get(slug)
      const workflow = researchWorkflows.get(slug)
      if (!study || !workflow || !workflowLabel || !workflowType) throw new Error(`Missing featured research dataset or workflow for ${slug}`)
      const sample = study.dataset.downloads[0]
      return [
        `- [${title}](${study.url}). ${summary}`,
        `  - ${scope}`,
        `  - Research inputs: ${evidence}`,
        `  - ${workflowType} · [${workflowLabel}](${workflow.url})`,
        `  - [Download the ${sample.format} sample](${SITE}${sample.path})`,
      ]
    }), '',
    '## Browse data samples', '',
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
      `- [Dataset notes](${url}) · [Markdown guide](${SITE}/blog/${slug}.md) · [Download citation (CSL JSON)](${SITE}${datasetCitationPath(url)})`,
      ...(workflow ? [`- [${workflow.label}](${workflow.url})`] : []),
      `- Published: ${dataset.datePublished ?? dateTime}`,
      ...(dataset.archivedRelease ? [
        `- ${citationLink(`Archived release v${dataset.archivedRelease.version} · ${dataset.archivedRelease.datePublished}`, dataset.archivedRelease.url)}`,
      ] : []),
      ...(dataset.spatialCoverage ? [`- Spatial coverage: ${dataset.spatialCoverage}`] : []),
      ...(dataset.temporalCoverage ? [`- Temporal coverage: ${dataset.temporalCoverage}`] : []),
      ...(dataset.sourceReuse ? [`- ${dataset.sourceReuse.note} ${citationLink(dataset.sourceReuse.policyLabel, dataset.sourceReuse.policyUrl)}`] : []),
      ...dataset.downloads.map(file => `- [${file.label} (${file.format})](${SITE}${file.path})`),
      '', 'Source records', '',
      ...dataset.sourceDetails.map(({ publisher, title, url, license }) =>
        `- ${publisher} · ${citationLink(title, url)}${license ? ` · ${citationLink('Source license', license)}` : ''}`),
      '',
    )
  }
  return out.join('\n')
}

function datasetCatalogJson() {
  return {
    url: `${SITE}/datasets`,
    publisher: 'Invariant',
    description: datasetCatalog.description,
    access: datasetCatalog.access,
    datasets: datasetEntries.map(({ slug, title, dateTime, updatedDate, dataset, url }) => {
      const { anchor, downloads, ...metadata } = dataset
      return {
        url,
        ...metadata,
        citationUrl: `${SITE}${datasetCitationPath(url)}`,
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
writeFileSync(join(DIST, 'mcp.md'), mcpMd())
writeFileSync(join(DIST, 'data-coverage.md'), coverageMd())
writeFileSync(join(DIST, 'resources.md'), resourcesMd())
writeFileSync(join(DIST, 'virginia-industrial-land-for-sale.md'), virginiaSitesMd())
writeFileSync(join(DIST, 'research.md'), researchMd())
writeFileSync(join(DIST, 'glossary.md'), glossaryDirectoryMd())
writeFileSync(join(DIST, 'datasets.md'), datasetCatalogMd())
writeFileSync(join(DIST, 'datasets.json'), `${JSON.stringify(datasetCatalogJson(), null, 2)}\n`)
const topicGuides = agentTopicGuides(blogCollections)
mkdirSync(join(DIST, 'llms', 'topics'), { recursive: true })
for (const { path, heading, description, collectionPath, guides } of topicGuides) {
  const contents = [
    `# ${heading}`, '',
    ...(description ? [description, ''] : []),
    `[Browse this topic on the website](${SITE}${collectionPath}) · [All agent directories](${SITE}/llms.txt)`, '',
    ...guides.map(({ slug, label, detail }) =>
      `- ${citationLink(label, `${SITE}/blog/${slug}.md`)}: ${detail}`),
    '',
  ].join('\n')
  writeFileSync(join(DIST, path.slice(1)), contents)
}
const datasetCitations = datasetEntries.map(({ dataset, dateTime, url }) => ({
  id: url,
  type: 'dataset',
  title: dataset.name,
  author: [{ literal: 'Invariant' }],
  issued: { 'date-parts': [(dataset.datePublished ?? dateTime).split('-').map(Number)] },
  URL: url,
}))
writeFileSync(join(DIST, 'datasets.csl.json'), `${JSON.stringify(datasetCitations, null, 2)}\n`)
mkdirSync(join(DIST, 'citations'), { recursive: true })
for (const citation of datasetCitations) {
  writeFileSync(join(DIST, datasetCitationPath(citation.URL).slice(1)), `${JSON.stringify([citation], null, 2)}\n`)
}
const full = [
  '# Invariant data, site selection, power and compliance guides', '',
  '> Full text of the industry guides and buyer workflows. Each article has a Markdown copy at its URL plus `.md`.', '',
  `[Start with the short directory](${SITE}/llms.txt) · [Browse the complete link directory](${SITE}/llms-index.txt)`, '',
  `[Invariant Earth product](${SITE}/product.md) · [MCP server and agent setup](${SITE}/mcp.md)`, '', CONTACT, '',
]
for (const collection of blogCollections) {
  const page = `${SITE}/blog/${collection.slug}`
  const trial = providerTrial.url === page ? providerTrial : undefined
  const md = [
    `# ${collection.heading}`, '', collection.description, '',
    `URL: ${SITE}/blog/${collection.slug}  `, `Updated: ${collection.updatedDate} · Publisher: Invariant`, '',
    ...(collection.resourceLinks ? [
      ...collection.resourceLinks.map(({ label, href }) => `- [${label}](${new URL(href, SITE).href})`), '',
    ] : []),
    `## ${sectionLink(collection.checklistTitle, page, 'collection-checks')}`, '',
    ...collection.checks.map(check => `- **${check.title}.** ${check.detail}`), '',
    ...(collection.worksheet ? [
      `[${collection.worksheet.label}](${SITE}${collection.worksheet.path}). ${collection.worksheet.detail}`, '',
    ] : []),
    ...(trial ? [
      citationLink('Download case inputs and expected results (JSON)', SITE + trial.json_path), '',
      citationLink('Versioned reference pack', trial.release_url), '',
      `## ${sectionLink(providerComparisons.heading, page, 'provider-comparisons')}`, '', providerComparisons.description, '',
      ...providerComparisons.workflows.flatMap(({ id, title, guide, guideAnchor, test, providers }) => [
        `### ${citationLink(title, `${trial.url}#compare-${id}`)}`, '', test, '',
        citationLink('Read the test and sources', `${SITE}/blog/${guide}${guideAnchor ? `#${guideAnchor}` : ''}`), '',
        providers.map(({ name, url }) => citationLink(name, url)).join(' · '), '',
      ]),
      `## ${sectionLink('Reference cases', page, 'reference-cases')}`, '',
      ...trial.cases.flatMap(item => [
        `### ${citationLink(item.title, `${trial.url}#${item.test_id}`)}`, '',
        `- **Input** ${item.case_input}`,
        `- **Request** ${item.request}`,
        `- **Acceptance criteria** ${item.acceptance_criteria}`,
        `- **Reference result** ${item.reference_result}`,
        `- **Reference date** ${item.reference_as_of}`,
        [citationLink('Walkthrough', item.source_case_url), citationLink('Reference file', item.reference_fixture_url),
          citationLink('Primary source', item.primary_source_url), citationLink('Second source', item.second_source_url)].join(' · '), '',
      ]),
    ] : []),
    `## ${sectionLink(collection.guidesTitle, page, 'collection-guides')}`, '',
    ...collection.guides.flatMap((guide, index) => [
      ...(guide.group && guide.group !== collection.guides[index - 1]?.group ? ['', `### ${sectionLink(guide.group, page, guideGroupId(guide.group))}`, ''] : []),
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
console.log(`agent markdown: ${articles.length} articles, ${blogCollections.length} collections, ${topicGuides.length} topic directories, ${glossary.length} glossary entries, llms-full.txt`)
