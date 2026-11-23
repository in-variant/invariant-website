import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'

export default function NotFound() {
  const description = 'Check the address, or browse our articles and glossary.'
  return (
    <section className="bg-paper px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-24">
      <Seo title="Page not found" description={description} noindex />
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-4xl font-normal leading-tight text-ink md:text-5xl">Page not found</h1>
        <p className="mt-4 text-lg text-ink/75">{description}</p>
        <nav aria-label="Find another page" className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <Link className="underline underline-offset-4 hover:text-copper" to="/">Home</Link>
          <Link className="underline underline-offset-4 hover:text-copper" to="/blog">Blog</Link>
          <Link className="underline underline-offset-4 hover:text-copper" to="/glossary">Glossary</Link>
        </nav>
      </div>
    </section>
  )
}
