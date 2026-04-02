import { Link } from 'react-router-dom'

const POSTS = [
  {
    slug: 'fermibench-sota',
    date: 'April 2, 2026',
    title: 'Invariant Sets State-of-the-Art on FermiBench Nuclear Retrieval Benchmark',
    summary:
      'Our domain-adapted retrieval model helion-512 achieves 0.97 NDCG@10 and 0.93 Precision@1 on FermiBench, the only published information retrieval benchmark for the nuclear domain, up from the previous state-of-the-art of 0.74.',
    tags: ['Announcement', 'Retrieval', 'NRC ADAMS', 'Machine Learning'],
  },
  {
    slug: 'seismic-design-shift',
    date: 'March 29, 2026',
    title: 'SSE/OBE → GMRS/SDC: The Seismic Design Shift from Part 100 Appendix A to Part 53 §53.480',
    summary:
      'The deterministic SSE/OBE two-tier framework that governed nuclear seismic design for fifty years is replaced by risk-tiered Design-Basis Ground Motions and Seismic Design Categories. A regulation-to-regulation comparison of every substantive change, from the 0.1g floor to the capable fault criteria erasure.',
    tags: ['Nuclear', 'Part 53', 'Seismic', 'Earthquake Engineering'],
  },
  {
    slug: 'part100-vs-part53-siting',
    date: 'March 27, 2026',
    title: '10 CFR Part 100 vs. Part 53 Subpart D: A Regulation-to-Regulation Siting Comparison',
    summary:
      'A line-by-line comparison of the legacy siting criteria in Part 100 against the new technology-inclusive framework in Part 53 Subpart D. Covers exclusion area sizing, seismic methodology, capable fault criteria, and the new siting-design integration mandate.',
    tags: ['Nuclear', 'Part 53', 'Siting'],
  },
]

export default function Blog() {
  return (
    <section className="min-h-screen py-24 px-6 md:px-12 lg:px-24 xl:px-32">
      <p className="section-label mb-4">Research</p>
      <div className="section-rule mb-10" />

      <h1 className="heading-editorial text-4xl md:text-5xl lg:text-6xl mb-6">
        Blog
      </h1>
      <p className="body-technical max-w-2xl mb-16">
        Deep dives into regulatory frameworks, licensing strategy, and the
        engineering certification landscape.
      </p>

      <div className="flex flex-col gap-12">
        {POSTS.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="group block border-b border-ink/10 pb-10 last:border-b-0"
          >
            <p className="font-mono text-sm text-ink/40 mb-3">{post.date}</p>
            <h2 className="font-serif text-2xl md:text-3xl font-medium tracking-[-0.02em] text-ink group-hover:text-ink/70 transition-colors mb-4 max-w-3xl">
              {post.title}
            </h2>
            <p className="font-mono text-base text-ink/60 leading-relaxed max-w-2xl mb-4">
              {post.summary}
            </p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-xs tracking-wide uppercase px-2.5 py-1 rounded-sm border border-ink/10 text-ink/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
