import { fetchVirginiaSites } from '../src/data/virginiaIndustrialSites'

const headers = { 'X-Robots-Tag': 'noindex' }

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'GET') {
    return new Response(null, { status: 405, headers: { ...headers, Allow: 'GET' } })
  }

  try {
    const signal = AbortSignal.any([request.signal, AbortSignal.timeout(12000)])
    const sites = await fetchVirginiaSites(signal)
    return Response.json({ sites, checkedAt: Date.now() }, {
      headers: { ...headers, 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=300' },
    })
  } catch {
    return Response.json({ error: 'The public site directory is temporarily unavailable.' }, {
      status: 502, headers: { ...headers, 'Cache-Control': 'no-store' },
    })
  }
}
