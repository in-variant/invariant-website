import { useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import FigmaSmoothScroll from './FigmaSmoothScroll'
import SiteCrosshair from './SiteCrosshair'
import '../styles/SiteTheme.css'

export default function Layout() {
  const { pathname, hash } = useLocation()
  const isHome = pathname === '/'
  const bespoke = ['/product', '/resources', '/blog', '/contact', '/careers', '/charter', '/about', '/trust', '/data-center-compliance', '/oil-gas-compliance'].includes(pathname) || pathname.startsWith('/blog/')
  useLayoutEffect(() => {
    if (hash) {
      const frame = requestAnimationFrame(() => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ behavior: 'instant' }))
      return () => cancelAnimationFrame(frame)
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  return (
    <div className={`site-shell min-h-screen flex flex-col ${isHome ? 'site-shell--home' : ''}`}>
      <SiteCrosshair />
      {!isHome && <Nav />}
      {!isHome && <FigmaSmoothScroll key={pathname} />}
      <main id="main-content" className={`site-main flex-1 ${isHome ? 'site-main--home' : bespoke ? 'site-main--bespoke' : 'site-legacy'}`}>
        <Outlet />
      </main>
      {!isHome && <Footer />}
    </div>
  )
}
