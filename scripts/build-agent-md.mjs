#!/usr/bin/env node
// Agent-readable copies of the site, written into dist/ after prerender:
//   /blog/<slug>.md       one markdown file per industry article (site, due diligence, compliance guides)
//   /glossary/<slug>.md   one markdown file per glossary entry
//   /llms-full.txt        every industry article in full, due diligence and power studies first
// Agents and LLM crawlers fetch these instead of parsing HTML. Each HTML page links its .md
// with <link rel="alternate" type="text/markdown"> (scripts/prerender.mjs).

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DIST = join(ROOT, 'dist')
const SITE = 'https://invariant-ai.com'
const CONTACT = 'Site screens and power studies: pranav@invariant-ai.com, (628) 220-8972, https://cal.com/pranav-goswami/website-30min'

const FILES = ['ai-compute-capacity.json', 'site-due-diligence.json', 'data-center-site-finder.json', 'site-selection-guides.json', 'powered-land-sites.json', 'data-centers.json', 'data-center-operations.json', 'data-center-fire-safety.json', 'oil-gas.json']
const articles = FILES.flatMap(f => JSON.parse(readFileSync(join(ROOT, 'src/data/industry-articles', f), 'utf8')))
const titles = new Map(articles.map(a => [a.slug, a.title]))
const cell = s => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ')

function articleMd(a) {
  const src = new Map(a.sources.map(s => [s.id, s]))
  const cite = ids => ids?.length ? ' ' + ids.map(id => src.get(id)).filter(Boolean).map(s => `([${s.publisher}](${s.url}))`).join(' ') : ''
  const out = [`# ${a.title}`, '', `> ${a.description}`, '', `URL: ${SITE}/blog/${a.slug}  `, `Published: ${a.date} · Publisher: Invariant · Region: ${a.region ?? 'United States'}`, '', a.intro, '']
  if (a.takeaways?.length) out.push('## Key points', '', ...a.takeaways.map(t => `- ${t}`), '')
  for (const s of a.sections) {
    out.push(`## ${s.heading}`, '')
    for (const b of s.blocks) {
      if (b.type === 'paragraph') out.push(b.text + cite(b.sourceIds), '')
      else if (b.type === 'list') out.push(...b.items.map(i => `- ${i}`), ...(b.sourceIds?.length ? ['', `Sources:${cite(b.sourceIds)}`] : []), '')
      else if (b.type === 'table') out.push(`| ${b.columns.map(cell).join(' | ')} |`, `| ${b.columns.map(() => '---').join(' | ')} |`, ...b.rows.map(r => `| ${r.map(cell).join(' | ')} |`), ...(b.sourceIds?.length ? ['', `Sources:${cite(b.sourceIds)}`] : []), '')
      else if (b.type === 'links') out.push(`**${b.label}:** ` + b.items.map(i => `[${i.label}](${SITE}/blog/${i.slug})`).join(' · '), '')
    }
  }
  if (a.faqs?.length) {
    out.push('## Questions', '')
    for (const f of a.faqs) out.push(`### ${f.question}`, '', f.answer + cite(f.sourceIds), '')
  }
  if (a.sources?.length) out.push('## Sources', '', ...a.sources.map(s => `- ${s.publisher}: [${s.title}](${s.url})`), '')
  if (a.relatedSlugs?.length) out.push('## Related', '', ...a.relatedSlugs.map(s => `- [${titles.get(s) ?? s}](${SITE}/blog/${s})`), '')
  if (a.kind) out.push('---', '', CONTACT, '')
  return out.join('\n')
}

function glossaryMd(e) {
  const out = [`# ${e.term}`, '', `> ${e.short_definition}`, '', `URL: ${SITE}/glossary/${e.slug}  `, `Updated: ${e.last_updated ?? ''} · Publisher: Invariant`, '']
  if (e.aliases?.length) out.push(`Also called: ${e.aliases.join(', ')}`, '')
  out.push(e.full_definition ?? '', '')
  if (e.citations?.length) out.push('## Sources', '', ...e.citations.map(c => `- [${c.label}](${c.url})`), '')
  if (e.guide) out.push(`Guide: [${e.guide.label}](${SITE}${e.guide.path})`, '')
  if (e.related_to?.length) out.push('Related: ' + e.related_to.map(s => `[${s}](${SITE}/glossary/${s})`).join(', '), '')
  return out.join('\n')
}

mkdirSync(join(DIST, 'blog'), { recursive: true })
mkdirSync(join(DIST, 'glossary'), { recursive: true })
const full = ['# Invariant: full text of data center and oil and gas guides', '', '> Autonomous agents to accelerate compliance for the physical economy. This file holds the full text of every data center site, site due diligence, power study and compliance guide on invariant-ai.com, for AI agents and LLMs. The index is at https://invariant-ai.com/llms.txt; each page also has a markdown copy at its URL plus `.md`.', '', CONTACT, '']
for (const a of articles) {
  const md = articleMd(a)
  writeFileSync(join(DIST, 'blog', `${a.slug}.md`), md)
  full.push('', '---', '', md)
}
writeFileSync(join(DIST, 'llms-full.txt'), full.join('\n'))

const glossary = JSON.parse(readFileSync(join(ROOT, 'src/pages/_data/glossary.json'), 'utf8')).entries ?? []
for (const e of glossary) writeFileSync(join(DIST, 'glossary', `${e.slug}.md`), glossaryMd(e))
console.log(`agent markdown: ${articles.length} articles, ${glossary.length} glossary entries, llms-full.txt`)
