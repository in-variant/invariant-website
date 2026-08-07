import posthog from 'posthog-js'

// The PostHog project token is a public client-side identifier — it ships in
// the JS bundle for every visitor regardless, so it lives here rather than in
// deploy-time env vars. VITE_POSTHOG_* still override when set (e.g. to point
// a fork or staging build at a different PostHog project).
const projectToken = import.meta.env.VITE_POSTHOG_KEY || 'phc_ziumejoQLN2y4bXekfHeMDqwuStcFSfDLoGnJJknmgv7'
const host = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com'

posthog.init(projectToken, {
  api_host: host,
  defaults: '2025-05-24',
  capture_exceptions: {
    capture_unhandled_errors: true,
    capture_unhandled_rejections: true,
    capture_console_errors: false,
  },
})

export default posthog
