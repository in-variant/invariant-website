#!/usr/bin/env node
// Sweep all pillar/cluster/glossary content for AI-tell or unbrand characters.
// Run automatically via `npm run build`.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DATA = join(ROOT, 'src/pages/_data')

const EM = '—'
const EN = '–'
const SECTION = '§'

// Convert one string. Rules:
//   "X — Y"  → "X, Y"          (em dash with surrounding spaces)
//   "X—Y"    → "X,Y"           (em dash without spaces)
//   "X – Y"  → "X, Y"          (en dash with spaces; same rule as em)
//   "§§ N"   → "Sections N"    (double section sign)
//   "§ N"    → "Section N"     (section sign followed by digit/letter)
function cleanString(s) {
  if (typeof s !== 'string') return s
  let out = s
  for (const dash of [EM, EN]) {
    out = out.replace(new RegExp(' ' + dash + ' ', 'g'), ', ')
    out = out.replace(new RegExp(' ' + dash, 'g'), ',')
    out = out.replace(new RegExp(dash + ' ', 'g'), ', ')
    out = out.replace(new RegExp(dash, 'g'), ',')
  }
  out = out.replace(/§§\s*/g, 'Sections ')
  out = out.replace(/§\s*(\d)/g, 'Section $1')
  out = out.replace(/§\s*([IVXLCDM]+|[a-z])/g, 'Section $1')
  return out
}

function walk(o) {
  if (typeof o === 'string') return cleanString(o)
  if (Array.isArray(o)) return o.map(walk)
  if (o && typeof o === 'object') {
    const out = {}
    for (const k of Object.keys(o)) out[k] = walk(o[k])
    return out
  }
  return o
}

let touchedFiles = 0
let touchedStrings = 0
for (const f of readdirSync(DATA)) {
  if (!f.endsWith('.json')) continue
  const path = join(DATA, f)
  const before = readFileSync(path, 'utf8')
  const parsed = JSON.parse(before)

  // Count before/after to report what we did.
  function tally(o, t = { count: 0 }) {
    if (typeof o === 'string') {
      if (o.includes(EM) || o.includes(EN) || o.includes(SECTION)) t.count++
    } else if (Array.isArray(o)) {
      for (const x of o) tally(x, t)
    } else if (o && typeof o === 'object') {
      for (const v of Object.values(o)) tally(v, t)
    }
    return t.count
  }
  const dirty = tally(parsed)
  if (dirty === 0) continue

  const cleaned = walk(parsed)
  writeFileSync(path, JSON.stringify(cleaned, null, 2))
  touchedFiles++
  touchedStrings += dirty
}

if (touchedFiles > 0) console.log(`clean-content: stripped em/en dashes + section signs from ${touchedStrings} strings across ${touchedFiles} files`)
else console.log('clean-content: nothing to clean')
