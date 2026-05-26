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
  // Transparent (over the dark hero) only while at the top of the home page.
  const solid = !isHome || scrolled || open

  useEffect(() => { setOpen(false) }, [pathname])

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
          solid ? 'border-b border-ink/10 bg-paper/90 backdrop-blur-sm' : 'bg-transparent'
        }`}
      >
        <div className="relative flex h-[64px] items-center justify-between px-6 lg:px-8">
          <Logo className="text-ink" />

          {/* Desktop links, centered */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 md:flex">
            {LINKS.map((link) => {
              const active = pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`font-sans text-sm transition-colors hover:text-copper ${
                    active ? 'text-ink' : 'text-ink/55'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Desktop CTA */}
          <a
            href="mailto:founders@invariant-ai.com"
            className="hidden items-center rounded-[3px] bg-midnight px-5 py-2.5 font-sans text-sm font-medium text-cloud transition-colors hover:bg-copper md:inline-flex"
          >
            Get in touch
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="relative z-[60] flex h-8 w-8 flex-col items-center justify-center gap-[5px] md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`block h-[1.5px] w-5 bg-ink transition-all duration-300 ${
                  open && i === 0 ? 'translate-y-[6.5px] rotate-45' : ''
                } ${open && i === 1 ? 'opacity-0' : ''} ${open && i === 2 ? '-translate-y-[6.5px] -rotate-45' : ''}`}
              />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-[55] bg-paper transition-opacity duration-300 md:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="flex h-full flex-col items-center justify-center gap-8">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-serif text-3xl font-normal tracking-[-0.015em] transition-colors hover:text-copper ${
                pathname === link.to ? 'text-ink' : 'text-ink/55'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="mailto:founders@invariant-ai.com"
            onClick={() => setOpen(false)}
            className="mt-3 inline-flex items-center rounded-[3px] bg-midnight px-6 py-3 font-sans text-base font-medium text-cloud transition-colors hover:bg-copper"
          >
            Get in touch
          </a>
        </div>
      </div>
    </>
  )
}
