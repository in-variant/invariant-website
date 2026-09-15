import FigmaHomepage from '../components/FigmaHomepage'
import siteMetadata from '../data/siteMetadata.json'
import { Seo, ORG_SCHEMA, WEBSITE_SCHEMA, EDITORIAL_TEAM, faqSchema, SITE_URL } from '../components/Seo'

const HOME_FAQS = [
  {
    question: 'What does Invariant do?',
    answer:
      'Invariant builds autonomous AI agents that draft, file, and monitor mission-critical compliance across aerospace, nuclear, data centers, and oil and gas. The agents handle the documentation grind end to end with explicit citation back to source rules; a small team of forward-deployed domain engineers handles deployment and high-stakes review.',
  },
  {
    question: 'Which industries does Invariant serve?',
    answer:
      'Space, aerospace, nuclear, data centers, and oil and gas. The applicable requirements depend on the project, jurisdiction, equipment and operating plan.',
  },
  {
    question: 'How is Invariant different from a compliance consultancy?',
    answer:
      "Consultancies hand you a deck and bill by the hour. Invariant deploys autonomous agents plus a small team that ships the actual filings: verification matrices, test plans, regulator submissions, RAI responses, and the launch-provider compliance package. The agents do the drafting, citation, and continuous regulation monitoring; engineers approve the high-stakes outputs.",
  },
  {
    question: 'Who is Invariant for?',
    answer:
      'Satellite manufacturers, launch vehicle operators, Earth-observation companies, in-orbit services, advanced nuclear reactor developers (SMRs and microreactors), aerospace OEMs, unmanned aviation systems, data-center developers and operators, and oil-and-gas teams.',
  },
  {
    question: 'Does Invariant have proof of capability?',
    answer:
      "Invariant's domain-adapted retrieval model, Helion-512, is the published state of the art on FermiBench (0.9693 nDCG@10), the only public retrieval benchmark for the nuclear regulatory domain. The previous best was 0.74.",
  },
  {
    question: 'Who backs Invariant?',
    answer:
      'Invariant is backed by Entrepreneur First, Transpose Platform, Boundless Ventures, and NPU Ventures. Founded 2025.',
  },
]

const PRIMARY_PAGES = [
  { name: 'Platform', url: `${SITE_URL}/product` },
  { name: 'Why we exist', url: `${SITE_URL}/charter` },
  { name: 'Resources', url: `${SITE_URL}/resources` },
  { name: 'Talk to an expert', url: `${SITE_URL}/contact` },
]

const SITE_NAVIGATION = {
  '@context': 'https://schema.org',
  '@type': 'SiteNavigationElement',
  '@id': `${SITE_URL}/#site-navigation`,
  name: 'Invariant main navigation',
  hasPart: PRIMARY_PAGES.map((p) => ({
    '@type': 'SiteNavigationElement',
    name: p.name,
    url: p.url,
  })),
}

export default function Home() {
  return (
    <>
      <Seo
        title={siteMetadata.title}
        description={siteMetadata.description}
        canonical="https://invariant-ai.com/"
        jsonLd={[ORG_SCHEMA, EDITORIAL_TEAM, WEBSITE_SCHEMA, SITE_NAVIGATION, faqSchema(HOME_FAQS)]}
      />
      <FigmaHomepage />
    </>
  )
}
