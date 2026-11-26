export function parseWebUrl(value) {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) ? url : null
  } catch {
    return null
  }
}

function pageKey(url) {
  return url.hostname.replace(/^www\./, '') + url.pathname.replace(/\/$/, '')
}

function sectionId(url) {
  try {
    return decodeURIComponent(url.hash.slice(1).split(':~:', 1)[0])
  } catch {
    return ''
  }
}

export function matchTargetCitations(target, citations) {
  const url = parseWebUrl(target)
  if (!url) return { html: false, markdown: false, section: null }

  const expectedPage = pageKey(url)
  const expectedSection = sectionId(url)
  let html = false
  let markdown = false
  let section = expectedSection ? false : null
  for (const citation of citations) {
    const destination = parseWebUrl(citation.destination)
    if (!destination) continue
    const page = pageKey(destination)
    if (page === expectedPage) {
      html = true
      if (expectedSection && sectionId(destination) === expectedSection) section = true
    }
    if (page === `${expectedPage}.md`) markdown = true
  }
  return { html, markdown, section }
}
