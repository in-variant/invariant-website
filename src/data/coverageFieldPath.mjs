export function coverageFieldPath(name, operation = '') {
  const params = new URLSearchParams({ field: name })
  if (operation) params.set('operation', operation)
  return `/data-coverage?${params}#coverage-search`
}
