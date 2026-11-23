import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './posthog'
import './index.css'
import App, { preloadInitialPage } from './App'

const root = document.getElementById('root')!
function mount() {
  createRoot(root).render(
    <StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StrictMode>,
  )
}

// Keep the prerendered page readable while its code loads.
const initialPage = root.hasChildNodes() ? preloadInitialPage(window.location.pathname) : undefined
if (initialPage) {
  void initialPage.then(mount).catch(error => console.error('Could not load the interactive page.', error))
} else {
  mount()
}
