#!/usr/bin/env node
// Run against a built preview or deployed site with Chrome installed.
// Usage: node scripts/verify-article-hydration.mjs http://127.0.0.1:5358
import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'

const origin = new URL(process.argv[2] ?? 'http://127.0.0.1:5358').origin
const canonicalOrigin = 'https://invariant-ai.com'
const faq = '.industry-faq details'
const pages = [
  { path: '/blog/data-center-site-selection-checklist', details: faq },
  { path: '/blog/electric-utility-lookup-by-address?utm_source=article-check', details: faq },
  { path: '/blog/data-center-for-sale', details: faq },
  { path: '/blog/physical-world-data-api-evaluation', details: '#compare-contractor-permit-history' },
  { path: '/blog', details: '.blog-index-archive' },
  { path: '/research', details: 'main details' },
  { path: '/glossary', focus: '[aria-labelledby="property-infrastructure"] a' },
  { path: '/resources', focus: '.resources-library nav a' },
]

const browser = await chromium.launch({ channel: 'chrome' })
try {
  for (const { path, details: detailsSelector, focus: focusSelector } of pages) {
    const page = await browser.newPage({ viewport: { width: 390, height: 852 } })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))

    // Let the static page render before its entry module can run.
    let releaseEntry
    const entryReady = new Promise(resolve => { releaseEntry = resolve })
    await page.route(/\/assets\/index-[^/]+\.js$/, async route => {
      await entryReady
      await route.continue()
    })
    // The page should be interactive while the analytics bundle is unavailable.
    const analyticsBundle = /\/assets\/posthog-[^/]+\.js$/
    let releaseAnalytics
    const analyticsReady = new Promise(resolve => { releaseAnalytics = resolve })
    await page.route(analyticsBundle, async route => {
      await analyticsReady
      await route.continue()
    })
    await page.route(url => url.origin !== origin, route => route.abort())
    await page.goto(origin + path, { waitUntil: 'commit' })

    const prerenderedMetadata = page.locator('head [data-prerender-seo]').first()
    await prerenderedMetadata.waitFor({ state: 'attached' })
    const heading = await page.locator('main h1').elementHandle()
    assert.ok(heading, path + ' missing its initial heading')
    const disclosure = detailsSelector ? page.locator(detailsSelector).first() : undefined
    const focus = disclosure?.locator('summary') ?? page.locator(focusSelector).first()
    await page.evaluate(() => document.fonts.ready)
    await focus.scrollIntoViewIfNeeded()
    if (disclosure) await focus.press('Enter')
    else await focus.focus()
    const focused = await focus.elementHandle()
    const details = await disclosure?.elementHandle()
    if (details) assert.ok(await details.evaluate(node => node.open), path + ' disclosure did not open before hydration')
    const scrollBefore = await page.evaluate(() => scrollY)
    assert.ok(scrollBefore > 0, path + ' scroll probe must be below the first viewport')
    await page.evaluate(() => {
      window.duplicateCanonical = false
      new MutationObserver(() => {
        if (document.head.querySelectorAll('link[rel="canonical"]').length > 1) {
          window.duplicateCanonical = true
        }
      }).observe(document.head, { childList: true })
    })

    releaseEntry()
    await prerenderedMetadata.waitFor({ state: 'detached' })
    assert.ok(await heading.evaluate(node => node.isConnected), path + ' replaced the original page content')
    if (details) assert.ok(await details.evaluate(node => node.isConnected && node.open), path + ' lost the original open disclosure')
    assert.ok(await focused.evaluate(node => node === document.activeElement), path + ' lost keyboard focus')
    assert.equal(await page.evaluate(() => scrollY), scrollBefore, path + ' lost the scroll position')
    assert.equal(await page.locator('main').count(), 1)
    assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), canonicalOrigin + new URL(path, origin).pathname)
    assert.equal(await page.evaluate(() => window.duplicateCanonical), false, path + ' produced duplicate canonical links')
    await page.getByRole('button', { name: 'Open navigation' }).click()
    await page.getByRole('button', { name: 'Close navigation' }).waitFor()
    const analyticsResponse = page.waitForResponse(analyticsBundle)
    releaseAnalytics()
    assert.ok((await analyticsResponse).ok(), path + ' did not load analytics after the page was interactive')
    assert.deepEqual(errors, [])
    console.log(`Preserved content, focus, scroll and canonical metadata for ${path}`)
    await page.close()
  }
} finally {
  await browser.close()
}
