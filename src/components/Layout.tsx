import { useLayoutEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import FigmaSmoothScroll from './FigmaSmoothScroll'
import SiteCrosshair from './SiteCrosshair'
import { contentRouteSources, isBlogCollectionSource } from '../contentRoutes'
import '../styles/SiteTheme.css'

export default function Layout() {
  const { pathname, hash } = useLocation()
  const initialLocation = useRef<{ pathname: string; hash: string } | null>({ pathname, hash })
  const isHome = pathname === '/'
  const routeSource = contentRouteSources[pathname as keyof typeof contentRouteSources]
  const isReadingIndex = pathname === '/blog' || pathname === '/datasets' || pathname === '/data-coverage'
    || isBlogCollectionSource(routeSource)
  const bespoke = ['/product', '/mcp', '/resources', '/datasets', '/data-coverage', '/blog', '/contact', '/careers', '/charter', '/about', '/trust', '/data-center-compliance', '/data-centre-compliance-india', '/oil-gas-compliance'].includes(pathname) || pathname.startsWith('/blog/')
  useLayoutEffect(() => {
    const hydrationMode = document.getElementById('root')?.dataset.hydrate
    if (initialLocation.current?.pathname === pathname && initialLocation.current.hash === hash
      && (hydrationMode === 'article' || hydrationMode === 'collection')) return
    initialLocation.current = null

    if (hash) {
      const frame = requestAnimationFrame(() => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ behavior: 'instant' }))
      return () => cancelAnimationFrame(frame)
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  return (
    <div className={`site-shell min-h-screen flex flex-col ${isHome ? 'site-shell--home' : ''}`}>
      {!isReadingIndex && <SiteCrosshair />}
      {!isHome && <Nav />}
      {!isHome && !isReadingIndex && <FigmaSmoothScroll key={pathname} />}
      <main id="main-content" className={`site-main flex-1 ${isHome ? 'site-main--home' : bespoke ? 'site-main--bespoke' : 'site-legacy'}`}>
        <Outlet />
      </main>
      {!isHome && <Footer />}
    </div>
  )
}
