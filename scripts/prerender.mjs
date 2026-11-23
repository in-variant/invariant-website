#!/usr/bin/env node
// Render canonical public routes from the same pages and SEO data as the SPA.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createServer } from 'vite'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const DIST = join(ROOT, 'dist')
const SITE = 'https://invariant-ai.com'
const ROOT_TAG = '<div id="root"></div>'
const NOINDEX_TAG = '<meta name="robots" content="noindex" data-prerender-seo>'
const TEMPLATE_FILE = join(DIST, '.vite/prerender-template.html')
const CANONICAL_TAG = /<link rel="canonical"[^>]*>/
const OG_URL_TAG = /<meta property="og:url"[^>]*>/

function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function publicUrls(sitemap) {
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, value]) => new URL(value))
  const validPath = /^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/
  if (!urls.length || urls.some(url => url.origin !== SITE || !validPath.test(url.pathname) || url.search || url.hash || url.username || url.password)) {
    throw new Error('Invalid public URLs in sitemap.xml')
  }
  if (new Set(urls.map(url => url.href)).size !== urls.length) throw new Error('Duplicate canonical URL in sitemap.xml')
  return urls
}

function cssFor(manifest, source, seen = new Set()) {
  if (seen.has(source)) return []
  seen.add(source)
  const chunk = manifest[source]
  if (!chunk) return []
  return [...(chunk.css ?? []), ...(chunk.imports ?? []).flatMap(dep => cssFor(manifest, dep, seen))]
}

function documentHtml(template, { body, seo }, stylesheets, preloadModules = []) {
  const title = seo.title.includes('Invariant') ? seo.title : `${seo.title} | Invariant`
  const replacements = [
    [/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`],
    [/<meta name="description"[^>]*>/, `<meta name="description" content="${escapeHtml(seo.description)}">`],
    [CANONICAL_TAG, seo.noindex ? NOINDEX_TAG : `<link rel="canonical" href="${escapeHtml(seo.canonical)}">`],
    [/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${escapeHtml(title)}">`],
    [/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${escapeHtml(seo.description)}">`],
    [/<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${escapeHtml(seo.ogImage)}">`],
    [OG_URL_TAG, seo.noindex ? '' : `<meta property="og:url" content="${escapeHtml(seo.canonical)}">`],
    [/<meta property="og:type"[^>]*>/, `<meta property="og:type" content="${escapeHtml(seo.ogType)}">`],
    [/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${escapeHtml(title)}">`],
    [/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${escapeHtml(seo.description)}">`],
    [/<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${escapeHtml(seo.ogImage)}">`],
  ]
  let out = template
  for (const [pattern, tag] of replacements) out = out.replace(pattern, () => tag)

  const schemas = [seo.jsonLd ?? []].flat().map(schema =>
    `<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>`,
  )
  const alternate = seo.markdown ? [`<link rel="alternate" type="text/markdown" href="${escapeHtml(seo.markdown)}" title="Markdown for AI agents" data-prerender-seo>`] : []
  const css = [...new Set(stylesheets)]
    .filter(file => !template.includes(`href="/${escapeHtml(file)}"`))
    .map(file => `<link rel="stylesheet" href="/${escapeHtml(file)}">`)
  const preload = [...new Set(preloadModules)]
    .filter(file => file && !template.includes(`href="/${escapeHtml(file)}"`))
    .map(file => `<link rel="modulepreload" crossorigin href="/${escapeHtml(file)}">`)
  out = out.replace('</head>', () => `${[...preload, ...schemas, ...alternate, ...css].join('\n')}\n</head>`)
  const routeHeadTag = /<(?:title|meta (?:name="(?:description|twitter:[^"]+)"|property="og:[^"]+")|link rel="canonical"|script type="application\/ld\+json")(?=[\s>])/g
  out = out.replace(routeHeadTag, '$& data-prerender-seo')
  return out.replace(ROOT_TAG, () => `<div id="root">${body}</div>`)
}

async function main() {
  const index = readFileSync(join(DIST, 'index.html'), 'utf8')
  const template = index.includes(ROOT_TAG) ? index : readFileSync(TEMPLATE_FILE, 'utf8')
  if (!template.includes(ROOT_TAG)) throw new Error('Missing prerender root in dist/index.html')
  const manifest = JSON.parse(readFileSync(join(DIST, '.vite/manifest.json'), 'utf8'))
  const urls = publicUrls(readFileSync(join(DIST, 'sitemap.xml'), 'utf8'))
  const renderer = await createServer({
    root: ROOT,
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
    ssr: {
      noExternal: ['react-router-dom', 'react-router', 'react-helmet-async'],
      resolve: { conditions: ['module', 'module-sync', 'node', 'development'] },
    },
  })
  const pages = []
  try {
    const { renderPublicRoute, clientOnlyPaths } = await renderer.ssrLoadModule('/src/entry-prerender.tsx')
    const publicPaths = new Set(urls.map(url => url.pathname))
    if (clientOnlyPaths.some(path => publicPaths.has(path))) {
      throw new Error('A client-only route is listed in sitemap.xml')
    }
    for (const url of urls) {
      const page = await renderPublicRoute(url.pathname)
      if (page.seo.canonical !== url.href || page.seo.noindex) {
        throw new Error(`Sitemap and SEO disagree for ${url.pathname}: ${page.seo.canonical}`)
      }
      if (!/<h1\b[^>]*>[\s\S]*?<\/h1>/.test(page.body)) throw new Error(`Missing main heading for ${url.pathname}`)
      const modules = [manifest[page.source]?.file]
      for (const source of page.dataSources ?? []) {
        const dataChunk = manifest[source]?.file
        if (!dataChunk) throw new Error(`Missing content chunk for ${url.pathname}: ${source}`)
        modules.push(dataChunk)
      }
      const output = documentHtml(template, page, cssFor(manifest, page.source), modules)
      pages.push([join(DIST, url.pathname, 'index.html'), output])
    }
    const notFound = await renderPublicRoute('/404.html')
    pages.push([join(DIST, '404.html'), documentHtml(template, notFound, cssFor(manifest, notFound.source))])

    const shell = template.replace(CANONICAL_TAG, NOINDEX_TAG).replace(OG_URL_TAG, '')
    for (const path of clientOnlyPaths) pages.push([join(DIST, path, 'index.html'), shell])
  } finally {
    await renderer.close()
  }

  writeFileSync(TEMPLATE_FILE, template)
  for (const [path, html] of pages) {
    mkdirSync(dirname(path), { recursive: true })
    writeFileSync(path, html)
  }
  console.log(`prerender: wrote complete HTML for all ${urls.length} sitemap routes and the 404 page`)
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
