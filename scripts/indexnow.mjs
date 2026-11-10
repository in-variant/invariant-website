#!/usr/bin/env node
// Ping IndexNow (Bing, Yandex, Seznam, Naver) with URLs. Usage: node scripts/indexnow.mjs [url ...]
// With no args, submits every URL in public/sitemap.xml. Run after a deploy is live.
import { readFileSync } from 'node:fs'
const KEY = '3de3983f6ab32206923f68ca5025d6b6'
const HOST = 'invariant-ai.com'
let urls = process.argv.slice(2)
if (!urls.length) urls = [...readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])
const res = await fetch('https://www.bing.com/indexnow', { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }) })
console.log(res.status, res.statusText, urls.length, 'urls')
