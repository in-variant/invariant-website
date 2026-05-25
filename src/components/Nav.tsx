import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'

const LINKS = [
  { to: '/product', label: 'Product' },
  { to: '/probe', label: 'Probe' },
  { to: '/blog', label: 'Blog' },
]

export default function Nav() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isHome = pathname === '/'
  // Transparent only while sitting on the home hero at the top of the page.
  const solid = !isHome || scrolled || open

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
          solid ? 'bg-white/90 backdrop-blur-sm border-b border-ink/10' : 'bg-transparent'
        }`}
      >
        <div className="relative flex items-center justify-between h-[60px] px-6 lg:px-8">
          <Logo />

          {/* Desktop links — centered */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-sans text-sm font-medium transition-colors ${
                  pathname === link.to
                    ? 'text-ink'
                    : solid
                      ? 'text-ink/60 hover:text-ink'
                      : 'text-ink/70 hover:text-ink'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <Link
            to="/contact"
            className="hidden md:inline-flex items-center rounded-full bg-ink px-5 py-2.5 font-sans text-sm font-medium text-white transition-colors hover:bg-ink/85"
          >
            Get in touch
          </Link>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden relative z-[60] flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span className={`block h-[1.5px] w-5 bg-ink transition-all duration-300 origin-center ${open ? 'translate-y-[6.5px] rotate-45' : ''}`} />
            <span className={`block h-[1.5px] w-5 bg-ink transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-[1.5px] w-5 bg-ink transition-all duration-300 origin-center ${open ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay — outside nav to avoid sticky stacking issues */}
      <div
        className={`md:hidden fixed inset-0 z-[55] bg-white transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-6 w-10 h-10 flex items-center justify-center"
          aria-label="Close menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="2" y1="2" x2="18" y2="18" stroke="#0D0D0D" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="18" y1="2" x2="2" y2="18" stroke="#0D0D0D" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex flex-col items-center justify-center gap-8 h-full">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-sans text-lg font-medium transition-colors ${
                pathname === link.to ? 'text-ink' : 'text-ink/60 hover:text-ink'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="mt-2 inline-flex items-center rounded-full bg-ink px-6 py-3 font-sans text-base font-medium text-white"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </>
  )
}
