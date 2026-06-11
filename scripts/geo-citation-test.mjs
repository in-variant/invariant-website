#!/usr/bin/env node
// GEO citation test loop
//
// Queries multiple LLM search providers for compliance-related prompts and
// records whether invariant-ai.com is cited and at what position.
//
// Required env (set in .env or shell):
//   PERPLEXITY_API_KEY   — for Perplexity (sonar models)
//   OPENAI_API_KEY        — for ChatGPT Search (gpt-4o-search-preview)
//   ANTHROPIC_API_KEY     — for Claude with web search
//   BRAVE_SEARCH_API_KEY  — optional; used for a baseline organic search check
//
// Outputs JSONL to drafts/geo-results/{YYYY-MM-DD}.jsonl with one row per
// (provider, prompt) pair.

import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const SITE = 'invariant-ai.com'

const PROMPTS = [
  'what is nuclear compliance',
  'what is space compliance',
  'how long does an FAA Part 450 launch license take',
  'how to write a PSAR for the NRC',
  'difference between 10 CFR Part 50 Part 52 Part 53',
  'what is FAA 14 CFR Part 450',
  'what is 10 CFR Part 53',
  'what is a PSAR FSAR',
  'IN-SPACe NGP 2024 authorisation',
  'ECSS standards for European space startups',
]

async function callPerplexity(prompt) {
  const key = process.env.PERPLEXITY_API_KEY
  if (!key) return { skipped: 'no PERPLEXITY_API_KEY' }
  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: 'sonar-pro',
      messages: [{ role: 'user', content: prompt }],
      return_citations: true,
    }),
  })
  if (!res.ok) return { error: `${res.status} ${res.statusText}` }
  const j = await res.json()
  const text = j.choices?.[0]?.message?.content || ''
  const citations = j.citations || j.search_results || []
  return { text, citations }
}

async function callChatGPTSearch(prompt) {
  const key = process.env.OPENAI_API_KEY
  if (!key) return { skipped: 'no OPENAI_API_KEY' }
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: 'gpt-4o-search-preview',
      messages: [{ role: 'user', content: prompt }],
      web_search_options: {},
    }),
  })
  if (!res.ok) return { error: `${res.status} ${res.statusText}` }
  const j = await res.json()
  const text = j.choices?.[0]?.message?.content || ''
  const annotations = j.choices?.[0]?.message?.annotations || []
  return { text, citations: annotations.map((a) => a.url_citation?.url).filter(Boolean) }
}

async function callClaude(prompt) {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return { skipped: 'no ANTHROPIC_API_KEY' }
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-7',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 5 }],
    }),
  })
  if (!res.ok) return { error: `${res.status} ${res.statusText}` }
  const j = await res.json()
  const texts = []
  const citations = new Set()
  for (const block of j.content || []) {
    if (block.type === 'text') texts.push(block.text)
    for (const c of block.citations || []) if (c.url) citations.add(c.url)
  }
  return { text: texts.join('\n'), citations: [...citations] }
}

const PROVIDERS = [
  { name: 'perplexity', fn: callPerplexity },
  { name: 'chatgpt_search', fn: callChatGPTSearch },
  { name: 'claude_web', fn: callClaude },
]

function citationPosition(citations, host) {
  for (let i = 0; i < citations.length; i++) {
    const c = citations[i]
    const url = typeof c === 'string' ? c : c?.url || c?.link || ''
    if (url.includes(host)) return { position: i + 1, url }
  }
  return null
}

function bodyMentions(text, host) {
  if (!text) return false
  return text.toLowerCase().includes(host.toLowerCase())
}

async function main() {
  const today = new Date().toISOString().slice(0, 10)
  const outDir = join(ROOT, 'drafts', 'geo-results')
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })
  const outFile = join(outDir, `${today}.jsonl`)
  const rows = []
  for (const prompt of PROMPTS) {
    for (const { name, fn } of PROVIDERS) {
      console.log(`[${name}] ${prompt}`)
      let result
      try {
        result = await fn(prompt)
      } catch (e) {
        result = { error: String(e) }
      }
      const row = {
        ts: new Date().toISOString(),
        provider: name,
        prompt,
        cited: result.citations ? citationPosition(result.citations, SITE) : null,
        mentioned_in_body: bodyMentions(result.text, SITE),
        n_citations: result.citations?.length ?? 0,
        skipped: result.skipped,
        error: result.error,
      }
      rows.push(row)
    }
  }
  writeFileSync(outFile, rows.map((r) => JSON.stringify(r)).join('\n') + '\n')
  console.log(`\nResults: ${outFile}`)
  const cited = rows.filter((r) => r.cited).length
  const mentioned = rows.filter((r) => r.mentioned_in_body).length
  const skipped = rows.filter((r) => r.skipped).length
  console.log(`Cited (citation list): ${cited} / ${rows.length}`)
  console.log(`Mentioned (body text): ${mentioned} / ${rows.length}`)
  console.log(`Skipped (no API key): ${skipped} / ${rows.length}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
