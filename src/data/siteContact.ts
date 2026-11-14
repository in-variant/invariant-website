import siteArticleSlugs from './site-article-slugs.json'

/** Site selection inbound goes to Pranav, not founders@ (Pranav, 2026-11-14). */
export const SITES_EMAIL = 'pranav@invariant-ai.com'
export const DEFAULT_EMAIL = 'founders@invariant-ai.com'

const SITE_PATHS = new Set((siteArticleSlugs as string[]).map(slug => `/blog/${slug}`))

/** True on every powered-land listing, site finder and site selection guide page. */
export function isSitePage(pathname: string) {
  return SITE_PATHS.has(pathname.replace(/\/+$/, ''))
}
