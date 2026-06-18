#!/usr/bin/env node
// GEO citation test loop.
//
// Queries multiple LLM providers for compliance prompts that our ICP would
// actually type, and records whether invariant-ai.com is cited and where.
//
// Providers (all three required):
//   OpenAI   (gpt-4o-search-preview, with built-in web search)
//   Anthropic Claude (claude-opus-4-7 / claude-haiku-4-5 with web_search tool)
//   Google Gemini (gemini-2.5-flash with google_search grounding)
//
// Auth (priority order, falls back per provider):
//   OPENAI_API_KEY    or LP_OPENAI_API_KEY
//   ANTHROPIC_API_KEY or LP_ANTHROPIC_API_KEY
//   GEMINI_API_KEY    or LP_GEMINI_API_KEY  or GOOGLE_API_KEY
//
// Writes JSONL to drafts/geo-results/{YYYY-MM-DD}.jsonl, one row per (provider,
// prompt). Prints a summary table at the end.

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SITE = 'invariant-ai.com'

// Load .env from licensing-platform if our own env isn't populated.
// Strips LP_ prefix so the rest of the script can use canonical names.
;(function loadEnv() {
  const candidates = [
    join(ROOT, '..', 'licensing-platform', '.env'),
    join(ROOT, '.env'),
  ]
  for (const path of candidates) {
    if (!existsSync(path)) continue
    const raw = readFileSync(path, 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*?)\s*$/)
      if (!m) continue
      let [, k, v] = m
      // strip surrounding quotes
      v = v.replace(/^['"]|['"]$/g, '')
      // strip LP_ prefix; do not overwrite if a canonical key is already set
      const canonical = k.replace(/^LP_/, '')
      if (!process.env[canonical]) process.env[canonical] = v
      if (!process.env[k]) process.env[k] = v
    }
  }
})()

const PROMPTS = [
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

// ──────────────────────────── OpenAI (with web search) ────────────────────
async function askOpenAI(prompt) {
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
  if (!res.ok) return { error: `${res.status} ${(await res.text()).slice(0, 200)}` }
  const j = await res.json()
  const msg = j.choices?.[0]?.message
  const text = msg?.content || ''
  const citations = (msg?.annotations || [])
    .map((a) => a.url_citation?.url)
    .filter(Boolean)
  return { text, citations }
}

// ─────────────────────────── Anthropic Claude (web search) ────────────────
async function askClaude(prompt) {
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
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 5 }],
    }),
  })
  if (!res.ok) return { error: `${res.status} ${(await res.text()).slice(0, 200)}` }
  const j = await res.json()
  const texts = []
  const citations = new Set()
  for (const block of j.content || []) {
    if (block.type === 'text') texts.push(block.text)
    for (const c of block.citations || []) if (c.url) citations.add(c.url)
  }
  return { text: texts.join('\n'), citations: [...citations] }
}

// ──────────────────────────────── Google Gemini ───────────────────────────
async function askGemini(prompt) {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (!key) return { skipped: 'no GEMINI_API_KEY' }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      tools: [{ google_search: {} }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 2000 },
    }),
  })
  if (!res.ok) return { error: `${res.status} ${(await res.text()).slice(0, 200)}` }
  const j = await res.json()
  const cand = j.candidates?.[0]
  const text = (cand?.content?.parts || []).map((p) => p.text || '').join('\n')
  const citations = new Set()
  const grounding = cand?.groundingMetadata
  for (const chunk of grounding?.groundingChunks || []) {
    const u = chunk.web?.uri
    if (u) citations.add(u)
  }
  for (const att of grounding?.groundingAttributions || []) {
    const u = att.web?.uri
    if (u) citations.add(u)
  }
  return { text, citations: [...citations] }
}

const PROVIDERS = [
  { name: 'openai_gpt4o_search', fn: askOpenAI },
  { name: 'claude_haiku_web', fn: askClaude },
  { name: 'gemini_2_flash_search', fn: askGemini },
]

// ─────────────────────────────── analysis helpers ─────────────────────────
function citationPosition(citations, host) {
  if (!citations) return null
  for (let i = 0; i < citations.length; i++) {
    const url = String(citations[i] || '')
    if (url.includes(host)) return { position: i + 1, url }
  }
  return null
}

function bodyMentions(text, host) {
  if (!text) return false
  return text.toLowerCase().includes(host.toLowerCase())
}

// Match brand mentions even without the URL (e.g. "according to Invariant").
function brandMentioned(text) {
  if (!text) return false
  return /\b(Invariant|Helion-?512|FermiBench)\b/i.test(text)
}

async function main() {
  const today = new Date().toISOString().slice(0, 10)
  const outDir = join(ROOT, 'drafts', 'geo-results')
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })
  const outFile = join(outDir, `${today}.jsonl`)
  const rows = []
  const summary = {}
  for (const prompt of PROMPTS) {
    for (const { name, fn } of PROVIDERS) {
      process.stdout.write(`[${name}] ${prompt} ... `)
      let result
      try {
        result = await fn(prompt)
      } catch (e) {
        result = { error: String(e) }
      }
      const cited = result.citations ? citationPosition(result.citations, SITE) : null
      const mention = bodyMentions(result.text, SITE) || brandMentioned(result.text)
      const row = {
        ts: new Date().toISOString(),
        provider: name,
        prompt,
        cited,
        mention,
        n_citations: result.citations?.length ?? 0,
        skipped: result.skipped,
        error: result.error,
        text_excerpt: result.text?.slice(0, 280),
      }
      rows.push(row)
      if (result.skipped) process.stdout.write('skip\n')
      else if (result.error) process.stdout.write(`err: ${result.error.slice(0, 80)}\n`)
      else process.stdout.write(`cited=${cited ? `#${cited.position}` : 'no'} mention=${mention} cites=${row.n_citations}\n`)
      summary[name] ||= { cited: 0, mentioned: 0, skipped: 0, err: 0, total: 0 }
      summary[name].total++
      if (result.skipped) summary[name].skipped++
      else if (result.error) summary[name].err++
      else {
        if (cited) summary[name].cited++
        if (mention) summary[name].mentioned++
      }
    }
  }
  writeFileSync(outFile, rows.map((r) => JSON.stringify(r)).join('\n') + '\n')
  console.log(`\nWrote ${outFile} (${rows.length} rows)\n`)
  console.log('Provider          cited  mention  skip  err   total')
  for (const [k, v] of Object.entries(summary)) {
    console.log(
      `  ${k.padEnd(28)}${String(v.cited).padStart(3)}  ${String(v.mentioned).padStart(7)}  ${String(v.skipped).padStart(4)}  ${String(v.err).padStart(3)}  ${String(v.total).padStart(5)}`,
    )
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
