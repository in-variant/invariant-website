import { Link, useLocation } from 'react-router-dom'

const LINKS = [
  { to: '/about', label: 'About' },
  { to: '/partners', label: 'Partners' },
  { to: '/contact', label: 'Contact' },
]

export default function Nav() {
  const { pathname } = useLocation()

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-ink/10">
      <div className="flex items-center justify-between px-6 md:px-12 lg:px-24 xl:px-32 h-[60px]">
        <Link to="/" className="font-serif text-lg font-medium tracking-[-0.02em] text-ink hover:text-ink/80 transition-colors">
          Invariant
        </Link>
        <div className="flex items-center gap-8">
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
      </div>
    </nav>
  )
}
