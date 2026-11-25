export function formatEarthRequest(endpoint, request) {
  return [
    `curl ${endpoint} \\`,
    '  -H "X-API-Key: $INVARIANT_API_KEY" \\',
    '  -H "Content-Type: application/json" \\',
    "  -d '" + JSON.stringify(request) + "'",
  ].join('\n')
}
