import { Link } from 'react-router-dom'
import { relatedPages, type Pillar } from '../data/page-registry'

type Props = {
  currentSlug: string
  pillar: Pillar
  limit?: number
}

export default function RelatedGuides({ currentSlug, pillar, limit = 4 }: Props) {
  const items = relatedPages(currentSlug, pillar, limit)
  if (items.length === 0) return null
  return (
    <section className="mt-16 rounded-[3px] border border-ink/10 bg-white p-6 md:p-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-copper">Related guides</p>
      <h2 className="mt-3 font-serif text-2xl font-normal tracking-[-0.01em] text-ink md:text-3xl">
        Continue reading
      </h2>
      <ul className="mt-6 divide-y divide-ink/10">
        {items.map((p) => (
          <li key={p.slug} className="py-4">
            <Link to={`/${p.slug}`} className="group block">
              <h3 className="font-serif text-lg font-normal text-ink transition-colors group-hover:text-copper md:text-xl">
                {p.shortTitle || p.title}
              </h3>
              <p className="mt-1 line-clamp-2 font-sans text-sm leading-relaxed text-ink/60">
                {p.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
