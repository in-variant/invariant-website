import { StrictMode, useEffect, useState, type ReactNode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App, { preloadInitialPage } from './App'
import { PrerenderSeo } from './components/Seo'

const root = document.getElementById('root')!
const hydrationMode = root.dataset.hydrate
const pathname = window.location.pathname
// Catalog parameters can change the rows before the first client render.
const shouldHydrate = hydrationMode === 'article' || hydrationMode === 'collection'
  || (hydrationMode === 'catalog' && !window.location.search)
const isReadingPage = /^\/(?:blog|glossary|research|resources)(?:\/|$)/.test(pathname)

const keepPrerenderedMetadata = () => {}

function PrerenderedPage({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return (
    <PrerenderSeo.Provider value={hydrated ? null : keepPrerenderedMetadata}>
      {children}
    </PrerenderSeo.Provider>
  )
}

function mount() {
  const app = (
    <StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StrictMode>
  )
  if (shouldHydrate) hydrateRoot(root, <PrerenderedPage>{app}</PrerenderedPage>)
  else createRoot(root).render(app)
}

function startAnalytics() {
  return import('./posthog').catch(error => console.error('Could not load analytics.', error))
}

function deferAnalytics() {
  const schedule = () => {
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(startAnalytics, { timeout: 1200 })
    } else {
      window.setTimeout(startAnalytics, 0)
    }
  }
  if (document.readyState === 'complete') schedule()
  else window.addEventListener('load', schedule, { once: true })
}

// Keep the prerendered page readable while its code loads.
const initialPage = root.hasChildNodes() ? preloadInitialPage(pathname) : undefined
// Let reading pages become interactive before loading the tracking SDK.
const analytics = isReadingPage ? undefined : startAnalytics()
if (isReadingPage) deferAnalytics()
if (initialPage || analytics) {
  void Promise.all([initialPage, analytics]).then(mount).catch(error => console.error('Could not load the interactive page.', error))
} else {
  mount()
}
