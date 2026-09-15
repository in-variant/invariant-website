import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FigmaScrambleLabel from './FigmaScrambleLabel'
import '../styles/figma-fonts.css'
import './SiteChrome.css'

export const SITE_NAVIGATION = [
  { label: 'Platform', href: '/product' },
  { label: 'Why we exist', href: '/charter' },
  { label: 'Resources', href: '/resources' },
]

export function SiteBrand() {
  return <Link className="site-brand" to="/" aria-label="Invariant home">
    <span className="site-brand-mark" aria-hidden="true"><img src="/figma/imgGroup113.svg" alt="" /><img src="/figma/imgGroup113.svg" alt="" /></span>
    <img className="site-brand-name" src="/figma/imgInvariant.svg" alt="Invariant" width="109" height="22" />
  </Link>
}

export default function Nav({ hero = false }: { hero?: boolean }) {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(!hero)
  const header = useRef<HTMLElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)

  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    const update = () => setSolid(!hero || window.scrollY > Math.min(window.innerHeight * .65, 650))
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [hero])
  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus() }
    }
    const closeOutside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('pointerdown', closeOutside)
    return () => { document.removeEventListener('keydown', closeOnEscape); document.removeEventListener('pointerdown', closeOutside) }
  }, [open])

  const active = (href: string) => pathname === href || (href === '/resources' && ['/blog', '/research', '/glossary', '/compliance', '/calculators', '/regulators', '/data-center-compliance', '/oil-gas-compliance'].some(path => pathname === path || pathname.startsWith(`${path}/`)))
  return <header ref={header} className={`site-nav ${hero ? 'site-nav--in-hero' : ''} ${solid || open ? 'site-nav--solid' : 'site-nav--hero'} ${open ? 'is-open' : ''}`}>
    <div className="site-nav-inner">
      <SiteBrand />
      <nav id="site-primary-navigation" className="site-nav-links" aria-label="Primary navigation">
        {SITE_NAVIGATION.map(item => <Link key={item.href} to={item.href} onClick={() => setOpen(false)} aria-current={active(item.href) ? 'page' : undefined}>
          <FigmaScrambleLabel>{item.label}</FigmaScrambleLabel>
        </Link>)}
        <Link to="/contact" className="site-nav-cta" onClick={() => setOpen(false)} aria-current={pathname === '/contact' ? 'page' : undefined}><FigmaScrambleLabel>Talk to an expert</FigmaScrambleLabel><span aria-hidden="true">↗</span></Link>
      </nav>
      <button ref={toggle} type="button" className="site-nav-toggle" aria-controls="site-primary-navigation" aria-expanded={open} aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(value => !value)}>
        {open ? 'Close' : 'Menu'}<span aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
    </div>
  </header>
}
