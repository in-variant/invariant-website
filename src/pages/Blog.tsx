import { Link } from 'react-router-dom'

const POSTS = [
  {
    slug: 'part100-vs-part53-siting',
    date: 'March 26, 2026',
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
