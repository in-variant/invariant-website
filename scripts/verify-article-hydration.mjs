#!/usr/bin/env node
// Run against a built preview or deployed site with Chrome installed.
// Usage: node scripts/verify-article-hydration.mjs http://127.0.0.1:5358
import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'

const origin = new URL(process.argv[2] ?? 'http://127.0.0.1:5358').origin
const canonicalOrigin = 'https://invariant-ai.com'
const comparisonPath = '/blog/physical-world-data-api-evaluation'
const paths = [
  '/blog/data-center-site-selection-checklist',
  '/blog/electric-utility-lookup-by-address?utm_source=article-check',
  '/blog/data-center-for-sale',
  comparisonPath,
]

const browser = await chromium.launch({ channel: 'chrome' })
try {
  for (const path of paths) {
    const page = await browser.newPage({ viewport: { width: 390, height: 852 } })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))

    // Let the published article render before its entry module can run.
    let releaseEntry
    const entryReady = new Promise(resolve => { releaseEntry = resolve })
    await page.route(/\/assets\/index-[^/]+\.js$/, async route => {
      await entryReady
      await route.continue()
    })
    // The article should be interactive while the analytics bundle is unavailable.
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
    const disclosure = page.locator(path === comparisonPath
      ? '#compare-contractor-permit-history'
      : '.industry-faq details').first()
    const summary = disclosure.locator('summary')
    await summary.press('Enter')
    const details = await disclosure.elementHandle()
    await page.evaluate(() => document.fonts.ready)
    assert.ok(await details.evaluate(node => node.open), path + ' disclosure did not open before hydration')
    const scrollBefore = await page.evaluate(() => scrollY)
    assert.ok(scrollBefore > 0)
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
    assert.ok(await details.evaluate(node => node.isConnected && node.open), path + ' lost the original open disclosure')
    assert.ok(await details.evaluate(node => node.querySelector('summary') === document.activeElement), path + ' lost keyboard focus')
    assert.equal(await page.evaluate(() => scrollY), scrollBefore, path + ' lost the scroll position')
    assert.equal(await page.locator('main').count(), 1)
    assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), canonicalOrigin + new URL(path, origin).pathname)
    assert.equal(await page.evaluate(() => window.duplicateCanonical), false, path + ' produced duplicate canonical links')
    await page.getByRole('button', { name: 'Open navigation' }).click()
    await page.getByRole('button', { name: 'Close navigation' }).waitFor()
    const analyticsResponse = page.waitForResponse(analyticsBundle)
    releaseAnalytics()
    assert.ok((await analyticsResponse).ok(), path + ' did not load analytics after the article was interactive')
    assert.deepEqual(errors, [])
    console.log(`Preserved disclosure, focus, scroll and canonical metadata for ${path}`)
    await page.close()
  }
} finally {
  await browser.close()
}
