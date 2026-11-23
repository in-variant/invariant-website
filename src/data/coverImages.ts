import versions from './cover-versions.json'

const coverVersions: Record<string, string> = versions

export function versionedCover(path: string) {
  const version = coverVersions[path]
  return version ? `${path}?v=${version}` : path
}
