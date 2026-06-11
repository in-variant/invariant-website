import Hero from '../components/Hero'
import BuiltFor from '../components/BuiltFor'
import Verticals from '../components/Verticals'
import Platform from '../components/Platform'
import Metrics from '../components/Metrics'
import Process from '../components/Process'
import Advisors from '../components/Advisors'
import { Seo, ORG_SCHEMA, WEBSITE_SCHEMA, EDITORIAL_TEAM, faqSchema, SITE_URL } from '../components/Seo'

const HOME_FAQS = [
  {
    question: 'What does Invariant do?',
    answer:
      'Invariant builds autonomous AI agents that draft, file, and monitor regulatory and qualification compliance for companies in space, aerospace, and nuclear. The agents handle the documentation grind end to end with explicit citation back to source rules; a small team of forward-deployed domain engineers handles deployment and high-stakes review.',
  },
  {
    question: 'Which industries does Invariant serve?',
    answer:
      'Mission-critical industries: space (FAA Part 450, FCC, NOAA, IN-SPACe, ECSS, NASA GEVS, MIL-STD-1540/461), aerospace (FAA Part 21/23/25), and nuclear (NRC 10 CFR Parts 50/52/53/100/110, IAEA safety standards).',
  },
  {
    question: 'How is Invariant different from a compliance consultancy?',
    answer:
      "Consultancies hand you a deck and bill by the hour. Invariant deploys autonomous agents plus a small team that ships the actual filings: verification matrices, test plans, regulator submissions, RAI responses, and the launch-provider compliance package. The agents do the drafting, citation, and continuous regulation monitoring; engineers approve the high-stakes outputs.",
  },
  {
    question: 'Who is Invariant for?',
    answer:
      'Satellite manufacturers, launch vehicle operators, Earth-observation companies, in-orbit services, advanced nuclear reactor developers (SMRs and microreactors), aerospace OEMs, and unmanned aviation systems.',
  },
  {
    question: 'Does Invariant have proof of capability?',
    answer:
      "Invariant's domain-adapted retrieval model, Helion-512, is the published state of the art on FermiBench (0.9693 nDCG@10), the only public retrieval benchmark for the nuclear regulatory domain. The previous best was 0.74.",
  },
  {
    question: 'Who backs Invariant?',
    answer:
      'Invariant is backed by Entrepreneurs First. Founded 2025.',
  },
]

const PRIMARY_PAGES = [
  { name: 'Space compliance', url: `${SITE_URL}/space-compliance` },
  { name: 'Nuclear compliance', url: `${SITE_URL}/nuclear-compliance` },
  { name: 'Glossary', url: `${SITE_URL}/glossary` },
  { name: 'Product', url: `${SITE_URL}/product` },
  { name: 'Probe', url: `${SITE_URL}/probe` },
  { name: 'Blog', url: `${SITE_URL}/blog` },
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
        title="Invariant — Autonomous agents for mission-critical compliance"
        description="Autonomous AI agents that draft, file, and monitor regulatory compliance for space, aerospace, and nuclear companies. Backed by Entrepreneurs First."
        canonical="https://invariant-ai.com/"
        jsonLd={[ORG_SCHEMA, EDITORIAL_TEAM, WEBSITE_SCHEMA, SITE_NAVIGATION, faqSchema(HOME_FAQS)]}
      />
      <Hero />
      <BuiltFor />
      <Verticals />
      <Platform />
      <Metrics />
      <Process />
      <Advisors />
    </>
  )
}
