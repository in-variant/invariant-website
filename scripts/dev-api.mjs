/*
 * Local dev server for the Vercel function in api/research.ts.
 * Vite proxies /api/* here (see vite.config.ts). Not used in production.
 *
 *   node scripts/dev-api.mjs
 *
 * Loads ANTHROPIC_API_KEY from DEV_ENV_FILE (default: ../platform/.env)
 * without printing it. Requires Node 23.6+ for native TypeScript stripping.
 */
import http from 'node:http'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ENV_FILE = process.env.DEV_ENV_FILE || resolve(process.cwd(), '../platform/.env')
if (!process.env.ANTHROPIC_API_KEY) {
  try {
    const text = readFileSync(ENV_FILE, 'utf8')
    // The platform repo prefixes its env vars with LP_.
    const m = text.match(/^\s*(?:LP_)?ANTHROPIC_API_KEY\s*=\s*"?([^"\n#]+)"?\s*$/m)
    if (m) {
      process.env.ANTHROPIC_API_KEY = m[1].trim()
      console.log(`[dev-api] loaded ANTHROPIC_API_KEY from ${ENV_FILE}`)
    } else {
      console.warn(`[dev-api] no ANTHROPIC_API_KEY in ${ENV_FILE}; endpoint will 503`)
    }
  } catch {
    console.warn(`[dev-api] could not read ${ENV_FILE}; endpoint will 503`)
  }
}

const { default: handler } = await import('../api/research.ts')

const PORT = 8788
http
  .createServer(async (req, res) => {
    try {
      const chunks = []
      for await (const c of req) chunks.push(c)
      const request = new Request(`http://localhost:${PORT}${req.url}`, {
        method: req.method,
        headers: req.headers,
        body: chunks.length ? Buffer.concat(chunks) : undefined,
      })
      const response = await handler(request)
      res.writeHead(response.status, Object.fromEntries(response.headers.entries()))
      if (response.body) {
        for await (const chunk of response.body) res.write(chunk)
      }
      res.end()
    } catch (err) {
      console.error('[dev-api]', err)
      if (!res.headersSent) res.writeHead(500)
      res.end()
    }
  })
  .listen(PORT, () => console.log(`[dev-api] serving api/research.ts on http://localhost:${PORT}`))
