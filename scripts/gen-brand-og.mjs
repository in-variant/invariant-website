// Generate the brand preview from live type and the same geographic data as
// the homepage. Run with sharp available through NODE_PATH or locally.
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { geoContains, geoOrthographic } from 'd3-geo'
import { feature } from 'topojson-client'

const require = createRequire(import.meta.url)
const sharp = require('sharp')
const root = fileURLToPath(new URL('../', import.meta.url))
const metadata = JSON.parse(readFileSync(resolve(root, 'src/data/siteMetadata.json'), 'utf8'))
const topology = require('world-atlas/land-110m.json')
const land = feature(topology, topology.objects.land)
const projection = geoOrthographic().rotate([-20, -25]).scale(380).translate([1030, 468])
const previous = geoOrthographic().rotate([-24, -25]).scale(380).translate([1030, 468])
const dots = []
for (let y = 20; y < 614; y += 9) {
  for (let x = 624; x < 1184; x += 9) {
    if ((x - 1030) ** 2 + (y - 468) ** 2 > 380 ** 2) continue
    const solid = geoContains(land, projection.invert([x, y]))
    const trail = !solid && geoContains(land, previous.invert([x, y]))
    if (solid || trail) dots.push(`<circle cx="${x}" cy="${y}" r="3.65" fill="${solid ? '#ffffff' : '#809aee'}"/>`)
  }
}
const mark = readFileSync(resolve(root, 'public/figma/imgGroup113.svg'), 'utf8')
  .replace(/<svg[^>]*>|<\/svg>/g, '').replaceAll('#FCFCF8', '#303030')
const wordmark = readFileSync(resolve(root, 'public/figma/imgInvariant.svg'), 'utf8')
  .replace(/<svg[^>]*>/, '<svg x="106" y="57" width="151" height="31" viewBox="0 0 109 22">')
  .replaceAll('#FCFCF8', '#303030')
const artwork = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="white"/>
  <g transform="translate(56 54) scale(1.4)">${mark}<g transform="translate(0 25) scale(1 -1)">${mark}</g></g>
  ${wordmark}
  <defs><clipPath id="panel"><rect x="620" y="16" width="564" height="598" rx="20"/></clipPath></defs>
  <g clip-path="url(#panel)"><rect x="620" y="16" width="564" height="598" fill="#1939a6"/>${dots.join('')}</g>
</svg>`)

async function type(text, size, left, top, color = '#303030', mono = false) {
  const font = mono ? 'JetBrains Mono' : 'Geist'
  const fontfile = resolve(root, `public/fonts/${mono ? 'jetbrains-mono' : 'geist'}-latin.woff2`)
  const input = await sharp({ text: {
    text: `<span foreground="${color}">${text}</span>`, font: `${font} ${size}`, fontfile, rgba: true,
  } }).png().toBuffer()
  return { input, left, top }
}

const layers = await Promise.all([
  type('The compliance layer', 46, 56, 230),
  type('for the physical', 46, 56, 287),
  type('economy.', 46, 56, 344),
  type('Autonomous agents for regulatory work.', 20, 56, 431),
  type('invariant-ai.com', 13, 56, 559, '#707070', true),
])
const destination = resolve(root, `public${metadata.image}`)
await sharp(artwork).composite(layers).png().toFile(destination)
console.log(`Brand preview: ${destination}`)
