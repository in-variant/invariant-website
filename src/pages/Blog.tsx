import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, breadcrumbSchema } from '../components/Seo'

const POSTS = [
  {
    slug: 'space-compliance-tam',
    image: '/blog/space-tam.png',
    date: 'June 3, 2026',
    title: 'The $1.8 Trillion Space Industry Has a $52 Billion Toll Gate',
    summary:
      'By 2035, 66,000 satellites will be in orbit and the space industry will spend $52B annually on compliance, up from $4.4B in 2024, a 22% CAGR that outpaces the industry growing at 10%.',
  },
  {
    slug: 'nuclear-compliance-tam',
    image: '/blog/nuclear-tam.png',
    date: 'June 2, 2026',
    title: 'The $35 Billion Problem Nobody Is Talking About in Nuclear',
    summary:
      'By 2040 the US nuclear compliance market reaches an estimated $35.8B annually, up from $9.5B in 2024, a near-4x climb driven by a doubling fleet and three SMR licensing milestones.',
  },
  {
    slug: 'fermibench-sota',
    image: '/blog/fermibench.jpg',
    date: 'April 1, 2026',
    title: 'Invariant Sets State-of-the-Art on FermiBench',
    summary:
      'Our domain-adapted retrieval model Helion-512 reaches 0.97 nDCG@10 on FermiBench, the only published retrieval benchmark for the nuclear domain, up from the previous best of 0.74.',
  },
  {
    slug: 'seismic-design-shift',
    image: '/blog/seismic.jpg',
    date: 'March 29, 2026',
    title: 'SSE/OBE → GMRS/SDC: The Seismic Design Shift to Part 53',
    summary:
      'The deterministic two-tier framework that governed nuclear seismic design for fifty years is replaced by risk-tiered ground motions and seismic design categories, a regulation-to-regulation comparison of every substantive change.',
  },
  {
    slug: 'part100-vs-part53-siting',
    image: '/blog/siting.jpg',
    date: 'March 27, 2026',
    title: '10 CFR Part 100 vs. Part 53 Subpart D: A Siting Comparison',
    summary:
      'A line-by-line comparison of the legacy siting criteria in Part 100 against the new technology-inclusive framework in Part 53 Subpart D: exclusion areas, seismic methodology, and the siting-design integration mandate.',
  },
]

export default function Blog() {
  return (
    <>
      <Seo
        title="Blog — Research on space, aerospace, and nuclear compliance"
        description="Research notes, regulation comparisons, and field reports on space, aerospace, and nuclear compliance. From the team building autonomous AI agents at Invariant."
        canonical="https://invariant-ai.com/blog"
        jsonLd={[
          ORG_SCHEMA,
          breadcrumbSchema([
            { name: 'Invariant', url: 'https://invariant-ai.com/' },
            { name: 'Blog', url: 'https://invariant-ai.com/blog' },
          ]),
        ]}
      />
    <section className="px-6 pt-16 pb-24 md:px-12 md:pt-24 md:pb-32 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-serif text-4xl font-normal tracking-[-0.02em] text-ink md:text-5xl">Blog</h1>
        <p className="mt-4 max-w-xl font-sans text-lg leading-relaxed text-ink/55">
          Deep dives into regulatory frameworks, licensing strategy, and the engineering
          certification landscape.
        </p>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group flex flex-col bg-paper p-5 transition-colors hover:bg-ink/[0.02]"
            >
              <div
                className="mb-5 aspect-[16/10] w-full overflow-hidden rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${post.image}), linear-gradient(135deg, #F4E4C1, #F3D9CE 50%, #DCE6EC)` }}
              />
              <p className="font-sans text-xs text-ink/40">{post.date}</p>
              <h2 className="mt-2 font-sans text-lg font-medium leading-snug tracking-[-0.01em] text-ink transition-colors group-hover:text-copper">
                {post.title}
              </h2>
              <p className="mt-2 line-clamp-3 font-sans text-sm leading-relaxed text-ink/55">{post.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
    </>
  )
}
