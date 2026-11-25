export function datasetCitationPath(url) {
  const { pathname, hash } = new URL(url)
  const slug = pathname.split('/').at(-1)
  return `/citations/${slug}.${hash.slice(1)}.csl.json`
}
