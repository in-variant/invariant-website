#!/usr/bin/env node
// Notify IndexNow about published changes. Usage: node scripts/indexnow.mjs <url> [url ...]
const KEY = '3de3983f6ab32206923f68ca5025d6b6'
const ORIGIN = 'https://invariant-ai.com'
const urls = [...new Set(process.argv.slice(2))]
if (!urls.length || urls.some(value => URL.parse(value)?.origin !== ORIGIN)) {
  console.error('Pass the full invariant-ai.com HTTPS URLs that changed in this release.')
  process.exit(1)
}

const response = await fetch('https://yandex.com/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  signal: AbortSignal.timeout(20000),
  body: JSON.stringify({
    host: new URL(ORIGIN).host,
    key: KEY,
    keyLocation: `${ORIGIN}/${KEY}.txt`,
    urlList: urls,
  }),
})
console.log(response.status, response.statusText, urls.length, 'URLs')
if (response.status !== 200 && response.status !== 202) process.exitCode = 1
