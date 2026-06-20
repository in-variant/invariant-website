import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import Logo from './Logo'

// At scrollY=0 the logo and CTA sit near the viewport edges (with a small
// BUFFER gap). As you scroll past 0 → SCROLL_RANGE px, they animate inward
// to their normal positions at the max-w-7xl container edges. Spring-damped
// so the motion is smooth and noticeable, reverses on scroll-up.
const CONTAINER_MAX_PX = 1280 // tailwind max-w-7xl = 80rem
const BUFFER_PX = 56          // gap to keep from the viewport edge
const SCROLL_RANGE = 320      // scrollY over which the animation completes

type NavLeaf = { title: string; href: string; description?: string }
type NavGroup = {
  title: string
  href: string
  items?: NavLeaf[]
  visual?: { src: string; alt: string }
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Product',
    href: '/product',
    items: [
      { title: 'Overview', href: '/product', description: 'The compliance platform for nuclear and space teams.' },
      { title: 'Probe', href: '/probe', description: 'Search and trace regulations, dockets, and topical reports.' },
      { title: 'Helion-512', href: '/blog/fermibench-sota', description: 'The retrieval model behind Invariant, state of the art on FermiBench.' },
      { title: 'Compliance Library', href: '/compliance', description: 'Every reference, guide, and glossary we maintain.' },
    ],
    visual: { src: '/platform/regulations.jpg', alt: 'The Invariant regulation library. Nuclear and space regulations indexed in one place.' },
  },
  {
    title: 'Industries',
    href: '/space-compliance',
    items: [
      { title: 'Space', href: '/space-compliance', description: 'FAA Part 450, FCC Part 25, NOAA Part 960, and IN-SPACe.' },
      { title: 'Nuclear', href: '/nuclear-compliance', description: 'NRC, AERB, IAEA. PSAR, RAI, ITAAC, and decommissioning.' },
    ],
    visual: { src: '/platform/document-editor.jpg', alt: 'The Invariant document editor. A PSAR section drafted with the agent on the right.' },
  },
  {
    title: 'Company',
    href: '/about',
    items: [
      { title: 'About', href: '/about', description: 'The team and the founding thesis.' },
      { title: 'Research', href: '/research', description: 'FermiBench, Helion-512, model cards.' },
      { title: 'Blog', href: '/blog', description: 'Field notes from the licensing front.' },
      { title: 'Trust', href: '/trust', description: 'Security, data handling, and deployment.' },
    ],
    visual: { src: '/cards/drafting.jpg', alt: 'A nuclear licensing engineer at a construction site.' },
  },
]

const CTA_DROPDOWN: NavLeaf[] = [
  { title: 'Talk to an expert', href: 'mailto:founders@invariant-ai.com?subject=Invariant%20conversation', description: 'Direct line to the founders.' },
  { title: 'Try Probe', href: '/probe', description: 'See the retrieval in action.' },
]

function ChevronDown({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`size-3.5 ${className}`}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export default function Nav() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isHome = pathname === '/'
  const solid = !isHome || scrolled || open || openMenu !== null

  useEffect(() => { setOpen(false); setOpenMenu(null) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // On the home page (transparent nav over the hero video) the solid
  // background should only kick in after we're past most of the hero.
  // Everywhere else: any scroll triggers solid immediately.
  useEffect(() => {
    const onScroll = () => {
      const threshold = isHome ? window.innerHeight * 0.65 : 24
      setScrolled(window.scrollY > threshold)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [isHome])

  // Track viewport width so we can compute how far the logo + CTA need to
  // travel to reach the viewport edges from their container positions.
  const [vw, setVw] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : CONTAINER_MAX_PX,
  )
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  const edgeShift = Math.max(0, (vw - CONTAINER_MAX_PX - BUFFER_PX) / 2)

  const { scrollY } = useScroll()
  // Spring-smooth the scroll position so the edge animation reads as a
  // glide rather than a jitter, and the eye can catch it happening.
  const scrollSmoothed = useSpring(scrollY, { stiffness: 90, damping: 28, mass: 0.6 })
  const logoX = useTransform(scrollSmoothed, [0, SCROLL_RANGE], [-edgeShift, 0], { clamp: true })
  const ctaX = useTransform(scrollSmoothed, [0, SCROLL_RANGE], [edgeShift, 0], { clamp: true })

  const requestOpen = (title: string) => {
    if (closeTimeout.current) { clearTimeout(closeTimeout.current); closeTimeout.current = null }
    setOpenMenu(title)
  }
  const requestClose = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current)
    closeTimeout.current = setTimeout(() => setOpenMenu(null), 120)
  }

  const linkColor = (active: boolean) => {
    if (solid) return active ? 'text-ink' : 'text-ink/65'
    return active ? 'text-cloud' : 'text-cloud/85'
  }

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-200 ${
          solid ? 'border-b border-ink/10 bg-paper/95 backdrop-blur-sm' : 'border-b border-transparent bg-transparent'
        }`}
        onMouseLeave={requestClose}
      >
        {!solid && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-0 h-28 bg-gradient-to-b from-ink/55 via-ink/25 to-transparent" />
        )}

        <div className="relative z-10 mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
          <motion.div style={{ x: logoX }} className="will-change-transform">
            <Link to="/" aria-label="Invariant home" className="flex items-center">
              <Logo className={solid ? 'text-ink' : 'text-cloud'} />
            </Link>
          </motion.div>

          <nav aria-label="Primary" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex">
            {NAV_GROUPS.map((group) => {
              const isActive = pathname === group.href || (group.items?.some((d) => pathname === d.href) ?? false)
              if (!group.items) {
                return (
                  <Link key={group.title} to={group.href} className={`text-sm font-normal transition-colors hover:text-copper ${linkColor(isActive)}`}>
                    {group.title}
                  </Link>
                )
              }
              const isOpen = openMenu === group.title
              return (
                <button
                  key={group.title}
                  type="button"
                  onMouseEnter={() => requestOpen(group.title)}
                  onFocus={() => requestOpen(group.title)}
                  className={`inline-flex items-center gap-1 text-sm font-normal transition-colors hover:text-copper ${linkColor(isActive)}`}
                  aria-expanded={isOpen}
                >
                  {group.title}
                  <ChevronDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
              )
            })}
          </nav>

          <motion.div style={{ x: ctaX }} className="hidden items-center gap-3 will-change-transform md:flex">
            <div className="group relative">
              <button type="button" className={`inline-flex h-9 items-center justify-center gap-1 rounded-full px-4 text-sm font-medium transition-colors ${
                solid ? 'bg-ink text-cloud hover:bg-copper' : 'border border-cloud/30 bg-cloud/10 text-cloud backdrop-blur-sm hover:border-cloud/55 hover:bg-cloud hover:text-ink'
              }`}>
                Get started
                <ChevronDown className="transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div className="pointer-events-none absolute right-0 top-full pt-2 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                <div className="w-72 rounded-2xl border border-ink/10 bg-paper p-2 shadow-[0_30px_80px_-20px_rgba(27,36,54,0.25)]">
                  {CTA_DROPDOWN.map((item) => {
                    const isExternal = item.href.startsWith('mailto:') || item.href.startsWith('http')
                    const className = 'block rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-ink/[0.04]'
                    const inner = (
                      <>
                        <span className="block font-medium text-ink">{item.title}</span>
                        {item.description && <span className="mt-0.5 block text-xs leading-5 text-ink/60">{item.description}</span>}
                      </>
                    )
                    return isExternal
                      ? <a key={item.href} href={item.href} className={className}>{inner}</a>
                      : <Link key={item.href} to={item.href} className={className}>{inner}</Link>
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          <button onClick={() => setOpen(!open)} className="relative z-[60] flex h-11 w-11 flex-col items-center justify-center gap-[5px] md:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
            {[0, 1, 2].map((i) => (
              <span key={i} className={`block h-[1.5px] w-5 transition-all duration-300 ${solid || open ? 'bg-ink' : 'bg-cloud'} ${open && i === 0 ? 'translate-y-[6.5px] rotate-45' : ''} ${open && i === 1 ? 'opacity-0' : ''} ${open && i === 2 ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
            ))}
          </button>
        </div>

        {/* Full-width mega-menu panel under nav. Dark bg, two-col items + visual on right. */}
        {NAV_GROUPS.filter((g) => g.items).map((group) => {
          const isOpen = openMenu === group.title
          return (
            <div
              key={group.title}
              onMouseEnter={() => requestOpen(group.title)}
              onMouseLeave={requestClose}
              className={`absolute inset-x-0 top-full hidden border-b border-ink/10 bg-ink text-cloud transition-opacity duration-150 md:block ${
                isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-6 py-6 lg:grid-cols-[1.4fr_1fr] lg:gap-12 lg:px-8 lg:py-7">
                <div className="grid grid-cols-2 gap-x-10 gap-y-4">
                  {group.items!.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setOpenMenu(null)}
                      className="group/item block"
                    >
                      <span className="block font-sans text-[15px] font-medium text-cloud transition-colors group-hover/item:text-copper">{item.title}</span>
                      {item.description && (
                        <span className="mt-1 block max-w-md font-sans text-[13px] leading-snug text-cloud/55">
                          {item.description}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
                {group.visual && (
                  <div className="relative hidden aspect-[16/9] w-full overflow-hidden rounded-xl lg:block">
                    <img src={group.visual.src} alt={group.visual.alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ink/30 via-transparent to-transparent" />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </header>

      {/* Mobile overlay */}
      <div className={`fixed inset-0 z-[55] overflow-y-auto bg-paper transition-opacity duration-300 md:hidden ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
        <div className="flex min-h-full flex-col px-8 pb-12 pt-24">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="border-b border-ink/10 py-5">
              <Link to={group.href} className="block font-display text-2xl font-normal tracking-[-0.015em] text-ink">{group.title}</Link>
              {group.items && (
                <ul className="mt-3 space-y-2">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link to={item.href} className="block py-2.5 font-sans text-sm text-ink/65 hover:text-copper">{item.title}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <div className="mt-8">
            <a href="mailto:founders@invariant-ai.com?subject=Invariant%20conversation" onClick={() => setOpen(false)} className="inline-flex h-11 items-center justify-center rounded-full bg-ink px-6 font-sans text-[15px] font-medium leading-6 text-cloud transition-colors hover:bg-copper">Talk to an expert</a>
          </div>
        </div>
      </div>
    </>
  )
}
