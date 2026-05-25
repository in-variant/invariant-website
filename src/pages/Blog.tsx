import { Link } from 'react-router-dom'

const POSTS = [
  {
    slug: 'fermibench-sota',
    image: '/blog/fermibench.jpg',
    date: 'April 1, 2026',
    title: 'Invariant Sets State-of-the-Art on FermiBench',
    summary:
      'Our domain-adapted retrieval model Helion-512 reaches 0.97 nDCG@10 on FermiBench — the only published retrieval benchmark for the nuclear domain — up from the previous best of 0.74.',
  },
  {
    slug: 'seismic-design-shift',
    image: '/blog/seismic.jpg',
    date: 'March 29, 2026',
    title: 'SSE/OBE → GMRS/SDC: The Seismic Design Shift to Part 53',
    summary:
      'The deterministic two-tier framework that governed nuclear seismic design for fifty years is replaced by risk-tiered ground motions and seismic design categories — a regulation-to-regulation comparison of every substantive change.',
  },
  {
    slug: 'part100-vs-part53-siting',
    image: '/blog/siting.jpg',
    date: 'March 27, 2026',
    title: '10 CFR Part 100 vs. Part 53 Subpart D: A Siting Comparison',
    summary:
      'A line-by-line comparison of the legacy siting criteria in Part 100 against the new technology-inclusive framework in Part 53 Subpart D — exclusion areas, seismic methodology, and the siting-design integration mandate.',
  },
]

export default function Blog() {
  return (
    <section className="px-6 pt-16 pb-24 md:px-12 md:pt-24 md:pb-32 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-sans text-4xl font-semibold tracking-[-0.03em] text-ink md:text-5xl">Blog</h1>
        <p className="mt-4 max-w-xl font-sans text-lg leading-relaxed text-ink/55">
          Deep dives into regulatory frameworks, licensing strategy, and the engineering
          certification landscape.
        </p>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group flex flex-col bg-white p-5 transition-colors hover:bg-ink/[0.02]"
            >
              <div
                className="mb-5 aspect-[16/10] w-full overflow-hidden rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${post.image}), linear-gradient(135deg, #F4E4C1, #F3D9CE 50%, #DCE6EC)` }}
              />
              <p className="font-sans text-xs text-ink/40">{post.date}</p>
              <h2 className="mt-2 font-sans text-lg font-semibold leading-snug tracking-[-0.01em] text-ink transition-colors group-hover:text-ink/70">
                {post.title}
              </h2>
              <p className="mt-2 line-clamp-3 font-sans text-sm leading-relaxed text-ink/55">{post.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
