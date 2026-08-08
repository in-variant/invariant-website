// Regenerate public/og/{slug}.png cards for every live pillar/cluster page.
// Reads slug + shortTitle + description from src/data/page-registry.ts and
// renders the house paper card with auto-fitted type, so long titles shrink
// instead of overflowing the 1200x630 canvas (the failure mode of the old
// hand-cut cards).
//
// Requires playwright (not a repo dependency): npx -y playwright@latest must
// be able to resolve a chromium. Run: node scripts/gen-og.mjs [slug ...]
import { readFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(join(ROOT, 'scripts', 'gen-og.mjs'))

// Resolve playwright from wherever it is installed (repo, global, or a
// sibling scratch install passed via PLAYWRIGHT_DIR).
let chromium
try {
  ;({ chromium } = require('playwright'))
} catch {
  const alt = process.env.PLAYWRIGHT_DIR
  if (!alt) throw new Error('playwright not found; set PLAYWRIGHT_DIR to a dir with node_modules/playwright')
  ;({ chromium } = createRequire(join(alt, 'package.json'))('playwright'))
}

// ── Parse page registry ─────────────────────────────────────────────────────
// Split into per-entry blocks first, then read fields independently, so one
// entry with an unexpected field order can never swallow its neighbours.
const registry = readFileSync(join(ROOT, 'src/data/page-registry.ts'), 'utf8')
const field = (block, name) => {
  const f = block.match(new RegExp(`${name}:\\s*\\n?\\s*'((?:[^'\\\\]|\\\\.)*)'`))
  return f ? f[1].replace(/\\'/g, "'") : null
}

const pages = []
for (const block of registry.split(/\n  \},/)) {
  const slug = field(block, 'slug')
  if (!slug || !/live:\s*true/.test(block)) continue
  const title = field(block, 'shortTitle') ?? field(block, 'title')
  const description = field(block, 'description') ?? ''
  const pillar = field(block, 'pillar') ?? 'space'
  if (!title) continue
  pages.push({
    slug,
    headline: title,
    // Subline: first sentence of the description, trimmed to fit.
    subline: description.split(/(?<=\.)\s/)[0],
    pillar,
  })
}

const only = process.argv.slice(2)
const targets = only.length ? pages.filter((p) => only.includes(p.slug)) : pages
if (!targets.length) {
  console.error('no matching live pages')
  process.exit(1)
}

const EYEBROW = { space: 'SPACE COMPLIANCE', nuclear: 'NUCLEAR COMPLIANCE', aerospace: 'AEROSPACE COMPLIANCE' }

const html = (p) => `<!doctype html><html><head><style>
  * { margin:0; padding:0; box-sizing:border-box }
  body { width:1200px; height:630px; background:linear-gradient(180deg,#faf8f4 0%,#f1ede4 100%);
         font-kerning:normal; display:flex; align-items:center }
  .inner { width:100%; margin:0 96px; border-top:1px solid rgba(27,36,54,0.15);
           border-bottom:1px solid rgba(27,36,54,0.15); padding:44px 8px 40px }
  .eyebrow { font:600 21px/1 -apple-system,'Helvetica Neue',Arial,sans-serif;
             letter-spacing:0.22em; color:#C47D3A; margin-bottom:34px }
  h1 { font-family:Georgia,'Times New Roman',serif; font-weight:600; color:#1B2436;
       letter-spacing:-0.01em; line-height:1.08; font-size:84px; max-width:1000px }
  .sub { font-family:Georgia,serif; font-style:italic; color:#6b7280; font-size:34px;
         line-height:1.3; margin-top:26px; max-width:960px }
  .url { font:400 24px/1 -apple-system,'Helvetica Neue',Arial,sans-serif;
         color:#6b7280; margin-top:30px; letter-spacing:0.01em }
</style></head><body><div class="inner">
  <div class="eyebrow">INVARIANT &nbsp;&middot;&nbsp; ${EYEBROW[p.pillar] ?? 'COMPLIANCE'}</div>
  <h1 id="h">${p.headline}</h1>
  <div class="sub" id="s">${p.subline}</div>
  <div class="url">invariant-ai.com/${p.slug}</div>
</div>
<script>
  // Shrink headline then subline until the card fits the canvas.
  const fits = () => document.body.scrollHeight <= 630 && document.querySelector('.inner').getBoundingClientRect().height <= 560
  const h = document.getElementById('h'); const s = document.getElementById('s')
  let hs = 84
  while (!fits() && hs > 40) { hs -= 4; h.style.fontSize = hs + 'px' }
  let ss = 34
  while (!fits() && ss > 22) { ss -= 2; s.style.fontSize = ss + 'px' }
  if (!fits()) s.remove()
</script></body></html>`

mkdirSync(join(ROOT, 'public/og'), { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
for (const p of targets) {
  await page.setContent(html(p), { waitUntil: 'load' })
  await page.waitForTimeout(60)
  await page.screenshot({ path: join(ROOT, 'public/og', `${p.slug}.png`) })
  console.log('og:', p.slug)
}
await browser.close()
