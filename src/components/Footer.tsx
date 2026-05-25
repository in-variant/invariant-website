import { Link } from 'react-router-dom'
import { KeystoneMark } from './Logo'

const COLUMNS = [
  {
    title: 'Explore',
    links: [
      { label: 'Product', to: '/product' },
      { label: 'Probe', to: '/probe' },
      { label: 'Blog', to: '/blog' },
      { label: 'Contact', to: '/contact' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#1a2230] text-white">
      {/* Painterly landscape backdrop — generate /footer-dawn.png (see prompt).
          Until it exists, the dark #1a2230 fallback keeps the footer readable. */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/footer-dawn.png)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/55" />

      <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-24 md:px-12 lg:px-20">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2">
              <KeystoneMark className="h-[18px] w-auto" />
              <span className="font-grotesk text-lg font-semibold tracking-[-0.02em]">Invariant</span>
            </div>
            <p className="mt-4 font-sans text-sm leading-relaxed text-white/70">
              AI-native services for regulated compliance.
            </p>
            <a
              href="mailto:founders@invariant-ai.com"
              className="mt-4 inline-block font-sans text-sm text-white/80 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white"
            >
              founders@invariant-ai.com
            </a>
          </div>

          <div className="flex gap-16">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="font-grotesk text-sm font-semibold text-white">{col.title}</p>
                <ul className="mt-4 space-y-3">
                  {col.links.map((lnk) => (
                    <li key={lnk.to}>
                      <Link
                        to={lnk.to}
                        className="font-sans text-sm text-white/65 transition-colors hover:text-white"
                      >
                        {lnk.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 flex flex-col gap-3 border-t border-white/15 pt-6 text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-xs">
            © {new Date().getFullYear()} Invariant · Backed by Entrepreneurs First
          </p>
          <div className="flex gap-6 font-sans text-xs">
            <a href="mailto:founders@invariant-ai.com" className="transition-colors hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
