import { StrictMode, useEffect, useState, type ReactNode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './posthog'
import './index.css'
import App, { preloadInitialPage } from './App'
import { PrerenderSeo } from './components/Seo'

const root = document.getElementById('root')!
const hydrateCatalog = root.hasAttribute('data-hydrate') && !window.location.search

const keepPrerenderedMetadata = () => {}

function CatalogHydration({ children }: { children: ReactNode }) {
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
  // The static catalog represents the unfiltered URL. Requests with query
  // parameters can change the rows and links before the first client render.
  if (hydrateCatalog) hydrateRoot(root, <CatalogHydration>{app}</CatalogHydration>)
  else createRoot(root).render(app)
}

// Keep the prerendered page readable while its code loads.
const initialPage = root.hasChildNodes() ? preloadInitialPage(window.location.pathname) : undefined
if (initialPage) {
  void initialPage.then(mount).catch(error => console.error('Could not load the interactive page.', error))
} else {
  mount()
}
