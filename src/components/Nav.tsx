import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const LINKS = [
  { to: '/about', label: 'About' },
  { to: '/prototype', label: 'Prototype' },
  { to: '/probe', label: 'Probe' },
  { to: '/partners', label: 'Partners' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
]

export default function Nav() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-ink/10">
      <div className="flex items-center justify-between px-6 md:px-12 lg:px-24 xl:px-32 h-[60px]">
        <Link to="/" className="font-serif text-lg font-medium tracking-[-0.02em] text-ink hover:text-ink/80 transition-colors">
          Invariant
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-mono text-sm tracking-[0.15em] uppercase transition-colors ${
                pathname === link.to ? 'text-ink' : 'text-ink/50 hover:text-ink'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span className={`block h-[1.5px] w-5 bg-ink transition-all duration-300 origin-center ${open ? 'translate-y-[6.5px] rotate-45' : ''}`} />
          <span className={`block h-[1.5px] w-5 bg-ink transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-[1.5px] w-5 bg-ink transition-all duration-300 origin-center ${open ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`md:hidden fixed inset-0 top-[60px] bg-white/95 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-8 pt-16">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-mono text-base tracking-[0.15em] uppercase transition-colors ${
                pathname === link.to ? 'text-ink' : 'text-ink/50 hover:text-ink'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
