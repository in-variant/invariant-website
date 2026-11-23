#!/usr/bin/env node
// Measures web-grounded API answers. Google Search and Search Console are
// separate measurements. Use --list to see the exact public inputs.
// target_cited is the HTML URL. target_content_cited also accepts its Markdown
// alternate. An unresolved source leaves a missing target unscored.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { loadEnvFile } from 'node:process'
import { parseArgs } from 'node:util'

const ROOT = fileURLToPath(new URL('../', import.meta.url))
const SITE = 'invariant-ai.com'
const buyerPrompts = JSON.parse(readFileSync(new URL('./geo-buyer-prompts.json', import.meta.url), 'utf8'))
const collectionPrompts = JSON.parse(readFileSync(new URL('./geo-collection-prompts.json', import.meta.url), 'utf8'))

const COMPLIANCE_PROMPTS = [
  // Head queries we are competing for
  'what is nuclear compliance',
  'what is space compliance',
  // Specific high-CTR commercial questions
  'how long does an FAA Part 450 launch license take',
  'how to write a PSAR for the NRC',
  'difference between 10 CFR Part 50 Part 52 Part 53',
  'how to file an ITAR commodity jurisdiction request',
  'FCC 5-year deorbit rule explained',
  // US regulator navigation
  'which agency licenses a commercial satellite',
  'NRC RAI response best practices',
  // India focus (per goal)
  'how does IN-SPACe authorisation work',
  'nuclear compliance India SHANTI Act',
  // Brand / proof
  'companies that do AI for nuclear compliance',
  'companies that do AI for space compliance',
  'Helion-512 FermiBench',
]

const PROVIDERS = ['openai', 'claude', 'gemini']
const BUYER_COMPARISONS = [
  'ageospatial.com', 'geoforge.ai', 'korzy.co', 'mireye.ai', 'mireye.com', 'paxiv.com',
  'realie.ai', 'regrid.com', 'scoutdata.com', 'westkite.com',
]

function comparisonDomains(domains) {
  const normalized = [...new Set(domains.map(domain => domain.trim().toLowerCase().replace(/^www\./, '')))]
  if (normalized.some(domain => !/^(?:[a-z0-9-]+\.)+[a-z]{2,}$/.test(domain) || matchesDomain(domain, SITE))) {
    throw new Error('Comparison domains must be third-party domains such as regrid.com')
  }
  return normalized
}

function options() {
  const { values } = parseArgs({ options: {
    suite: { type: 'string', default: 'compliance' },
    provider: { type: 'string', multiple: true },
    prompt: { type: 'string', multiple: true },
    'compare-domain': { type: 'string', multiple: true },
    repeat: { type: 'string', default: '1' },
    'env-file': { type: 'string' },
    list: { type: 'boolean' },
  } })
  const compliancePrompts = COMPLIANCE_PROMPTS.map((prompt, index) => ({
    id: `compliance-${index + 1}`, vertical: 'Compliance', prompt, target: null,
  }))
  const suites = new Map([['buyer', buyerPrompts], ['collections', collectionPrompts], ['compliance', compliancePrompts]])
  const prompts = suites.get(values.suite)
  if (!prompts) throw new Error(`Choose --suite ${[...suites.keys()].join(', ')}`)
  const selected = values.prompt ? prompts.filter(prompt => values.prompt.includes(prompt.id)) : prompts
  if (values.prompt?.some(id => !selected.some(prompt => prompt.id === id))) throw new Error('Unknown prompt ID. Run with --list to see this suite.')
  const providers = [...new Set(values.provider ?? PROVIDERS)]
  if (providers.some(name => !PROVIDERS.includes(name))) throw new Error('Choose --provider openai, claude, or gemini')
  const repeat = Number(values.repeat)
  if (!Number.isSafeInteger(repeat) || repeat < 1) throw new Error('--repeat must be a positive integer')
  const defaults = values.suite === 'buyer' ? BUYER_COMPARISONS : []
  const comparisons = new Map(selected.map(item => [
    item.id, comparisonDomains(values['compare-domain'] ?? item.compareDomains ?? defaults),
  ]))
  const compareDomains = [...new Set([...comparisons.values()].flat())]
  return { ...values, selected, providers, repeat, comparisons, compareDomains }
}

async function request(url, headers, payload) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(90_000),
  })
  if (!res.ok) {
    await res.body?.cancel()
    throw new Error(`HTTP ${res.status}`)
  }
  return res.json()
}

async function askOpenAI(prompt, key, model) {
  const result = await request('https://api.openai.com/v1/chat/completions', { Authorization: `Bearer ${key}` }, {
    model,
    messages: [{ role: 'user', content: prompt }],
    web_search_options: { user_location: { type: 'approximate', approximate: { country: 'US' } } },
  })
  const choice = result.choices?.[0]
  const message = choice?.message
  const citations = (message?.annotations ?? []).flatMap(({ type, url_citation: citation }) =>
    type === 'url_citation' && citation?.url ? [{ url: citation.url, title: citation.title }] : [],
  )
  return {
    answer: message?.content ?? '',
    citations,
    grounded: citations.length > 0,
    complete: choice?.finish_reason === 'stop' && !message?.refusal,
    model: result.model,
  }
}

async function askClaude(prompt, key, model) {
  const result = await request('https://api.anthropic.com/v1/messages', { 'x-api-key': key, 'anthropic-version': '2023-06-01' }, {
    model,
    max_tokens: 3500,
    messages: [{ role: 'user', content: prompt }],
    tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 4, user_location: { type: 'approximate', country: 'US' } }],
  })
  const blocks = result.content ?? []
  const text = blocks.filter(block => block.type === 'text')
  const citations = text.flatMap(block => (block.citations ?? []).flatMap(citation =>
    citation.type === 'web_search_result_location' && citation.url ? [{ url: citation.url, title: citation.title }] : [],
  ))
  const searches = blocks.filter(block => block.type === 'web_search_tool_result')
  return {
    answer: text.map(block => block.text).join('\n'),
    citations,
    grounded: citations.length > 0 || searches.some(block => Array.isArray(block.content) && block.content.length > 0),
    complete: result.stop_reason === 'end_turn',
    model: result.model,
  }
}

async function askGemini(prompt, key, model) {
  const result = await request(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, { 'x-goog-api-key': key }, {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    tools: [{ google_search: {} }],
    generationConfig: { maxOutputTokens: 4500 },
  })
  const candidate = result.candidates?.[0]
  const grounding = candidate?.groundingMetadata
  const indices = new Set((grounding?.groundingSupports ?? []).flatMap(support => support.groundingChunkIndices ?? []))
  const citations = [...indices].flatMap(index => {
    const source = grounding.groundingChunks?.[index]?.web
    return source?.uri ? [{ url: source.uri, title: source.title }] : []
  })
  return {
    answer: (candidate?.content?.parts ?? []).filter(part => !part.thought).map(part => part.text ?? '').join('\n'),
    citations,
    grounded: citations.length > 0,
    complete: candidate?.finishReason === 'STOP',
    model: result.modelVersion,
  }
}

function parseWebUrl(value) {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) ? url : null
  } catch {
    return null
  }
}

async function resolveCitation(citation) {
  const url = parseWebUrl(citation.url)
  if (!url) return { ...citation, destination: null }
  if (url.hostname !== 'vertexaisearch.cloud.google.com' || !url.pathname.startsWith('/grounding-api-redirect/')) {
    return { ...citation, destination: url.href }
  }
  try {
    const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(5000) })
    const destination = parseWebUrl(response.headers.get('location'))
    await response.body?.cancel()
    return { ...citation, destination: destination?.href ?? null }
  } catch {
    return { ...citation, destination: null }
  }
}

function distinctCitations(citations) {
  return [...new Map(citations.map(citation => [citation.url, citation])).values()]
}

function matchesDomain(host, domain) {
  return Boolean(host && (host === domain || host.endsWith('.' + domain)))
}

function firstDomainCitation(citations, domain) {
  const index = citations.findIndex(citation => matchesDomain(parseWebUrl(citation.destination)?.hostname, domain))
  return index < 0 ? null : { index: index + 1, url: citations[index].destination }
}

function destinationKey(destination) {
  const url = parseWebUrl(destination)
  return url ? url.hostname.replace(/^www\./, '') + url.pathname.replace(/\/$/, '') : null
}

function citationVerdict(checked, matched, unresolved) {
  return checked ? (matched ? true : unresolved ? null : false) : null
}

function providerConfig(options) {
  const isBuyer = options.suite !== 'compliance'
  const env = process.env
  return {
    openai: { key: env.OPENAI_API_KEY || env.LP_OPENAI_API_KEY, model: env.GEO_OPENAI_MODEL || 'gpt-5-search-api', search: 'OpenAI web search', location: 'US', run: askOpenAI },
    claude: { key: env.ANTHROPIC_API_KEY || env.LP_ANTHROPIC_API_KEY, model: env.GEO_CLAUDE_MODEL || (isBuyer ? 'claude-haiku-5-5' : 'claude-haiku-4-5-20251001'), search: 'Claude web search', location: 'US', run: askClaude },
    gemini: { key: env.GEMINI_API_KEY || env.LP_GEMINI_API_KEY || env.GOOGLE_API_KEY, model: env.GEO_GEMINI_MODEL || (isBuyer ? 'gemini-3.8-flash' : 'gemini-2.5-flash'), search: 'Google Search grounding', location: null, run: askGemini },
  }
}

async function observe(item, provider, config, repeat, compareDomains) {
  const base = {
    ts: new Date().toISOString(), provider, model: config.model, search: config.search, search_location: config.location,
    prompt_id: item.id, vertical: item.vertical, prompt: item.prompt, target_url: item.target ? `https://${SITE}${item.target}` : null, repeat,
    comparison_domains: compareDomains,
  }
  if (!config.key) return { ...base, status: 'skipped', reason: 'No provider API key' }
  let result
  try {
    result = await config.run(item.prompt, config.key, config.model)
  } catch (error) {
    const safeReason = /^HTTP \d{3}$/.test(error.message) ? error.message : error.name
    return { ...base, status: 'error', reason: safeReason }
  }
  const citations = await Promise.all(distinctCitations(result.citations).map(resolveCitation))
  const firstOwned = firstDomainCitation(citations, SITE)
  const anyUnresolved = citations.some(citation => !citation.destination)
  const complete = result.complete && result.grounded && Boolean(result.answer.trim())
  const status = complete ? 'grounded' : 'no_complete_grounded_answer'
  const targetKey = destinationKey(base.target_url)
  const targets = new Set(citations.map(citation => destinationKey(citation.destination)))
  const htmlMatch = Boolean(targetKey && targets.has(targetKey))
  const markdownMatch = Boolean(targetKey && targets.has(`${targetKey}.md`))
  const checkedTarget = complete && Boolean(targetKey)
  return {
    ...base, model: result.model || config.model, status,
    owned_cited: citationVerdict(complete, Boolean(firstOwned), anyUnresolved),
    target_cited: citationVerdict(checkedTarget, htmlMatch, anyUnresolved),
    target_markdown_cited: citationVerdict(checkedTarget, markdownMatch, anyUnresolved),
    target_content_cited: citationVerdict(checkedTarget, htmlMatch || markdownMatch, anyUnresolved),
    first_owned_citation: firstOwned,
    unresolved_citations: citations.filter(citation => !citation.destination).length,
    comparisons: Object.fromEntries(compareDomains.map(domain => {
      const first = firstDomainCitation(citations, domain)
      return [domain, {
        cited: citationVerdict(complete, Boolean(first), anyUnresolved),
        first_citation: first,
      }]
    })),
    brand_text: /\b(?:Invariant Earth|Invariant AI|FermiBench|Helion-?512)\b|(?:^|[^\w.-])invariant-ai\.com(?![\w.-])/i.test(result.answer),
    citations, answer: result.answer,
  }
}

async function main() {
  const settings = options()
  if (settings.list) {
    console.log(JSON.stringify(settings.selected.map(item => ({
      ...item, compareDomains: settings.comparisons.get(item.id),
    })), null, 2))
    return
  }
  const localEnv = resolve(ROOT, '.env')
  if (settings['env-file']) loadEnvFile(resolve(settings['env-file']))
  else if (existsSync(localEnv)) loadEnvFile(localEnv)
  const configs = providerConfig(settings)
  const timestamp = new Date().toISOString().replaceAll(':', '-')
  const output = resolve(process.env.GEO_RESULTS_DIR || resolve(ROOT, 'drafts/geo-results'))
  const rows = []
  for (const item of settings.selected) {
    for (const provider of settings.providers) {
      for (let repeat = 1; repeat <= settings.repeat; repeat++) {
        const row = await observe(item, provider, configs[provider], repeat, settings.comparisons.get(item.id))
        rows.push(row)
        console.log(`${provider} ${item.id} #${repeat} ${row.status} ${row.reason ?? ''}`.trim())
      }
    }
  }
  const tally = (sample, field) => {
    const measured = sample.filter(row => typeof row[field] === 'boolean')
    return `${measured.filter(row => row[field]).length}/${measured.length}`
  }
  console.table(settings.providers.map(provider => {
    const sample = rows.filter(row => row.provider === provider)
    return {
      provider,
      owned: tally(sample, 'owned_cited'),
      target_html: tally(sample, 'target_cited'),
      target_markdown: tally(sample, 'target_markdown_cited'),
      target_content: tally(sample, 'target_content_cited'),
      errors: sample.filter(row => row.status === 'error').length,
      skipped: sample.filter(row => row.status === 'skipped').length,
      total: sample.length,
    }
  }))
  if (settings.compareDomains.length) {
    console.table(settings.providers.flatMap(provider => settings.compareDomains.map(domain => {
      const tracked = rows.filter(row => row.provider === provider && row.comparison_domains.includes(domain))
      const measured = tracked
        .filter(row => typeof row.comparisons?.[domain]?.cited === 'boolean')
        .map(row => row.comparisons[domain])
      return { provider, domain, cited: `${measured.filter(match => match.cited).length}/${measured.length}`, tracked: tracked.length }
    })))
  }
  mkdirSync(output, { recursive: true })
  const file = resolve(output, `${timestamp}-${settings.suite}.jsonl`)
  writeFileSync(file, rows.map(row => JSON.stringify(row)).join('\n') + '\n', { flag: 'wx' })
  console.log(`Wrote ${file}`)
}

main().catch(error => {
  console.error(error.message)
  process.exitCode = 1
})
