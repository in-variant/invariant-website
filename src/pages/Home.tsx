import Hero from '../components/Hero'
import SpaceFilingPitch from '../components/SpaceFilingPitch'
import IntroducingInvariant from '../components/IntroducingInvariant'
import PlatformShowcase from '../components/PlatformShowcase'
import CustomerStories from '../components/CustomerStories'
import HowItWorks from '../components/HowItWorks'
import Advisors from '../components/Advisors'
import { Seo, ORG_SCHEMA, WEBSITE_SCHEMA, EDITORIAL_TEAM, faqSchema, SITE_URL } from '../components/Seo'

const HOME_FAQS = [
  {
    question: 'What does Invariant do?',
    answer:
      'Invariant prepares and ships regulatory filings for space and nuclear companies. Forward-deployed licensing engineers and autonomous agents handle FAA launch licensing, FCC spectrum, ITU coordination, NOAA remote sensing, DDTC export filings, and NRC licensing work with explicit citation back to source rules.',
  },
  {
    question: 'Which industries does Invariant serve?',
    answer:
      'Invariant serves space and nuclear: FAA Part 450, FCC, NOAA, ITU, DDTC, IN-SPACe, ECSS, and NASA GEVS for space programs; NRC 10 CFR Parts 50, 52, 53, 100, and 110 for advanced nuclear.',
  },
  {
    question: 'How is Invariant different from a compliance consultancy?',
    answer:
      "Consultancies hand you a deck and bill by the hour. Invariant deploys autonomous agents plus a small team that ships the actual filings: verification matrices, test plans, regulator submissions, RAI responses, and the launch-provider compliance package. The agents do the drafting, citation, and continuous regulation monitoring; engineers approve the high-stakes outputs.",
  },
  {
    question: 'Who is Invariant for?',
    answer:
      'Launch vehicle operators, satellite manufacturers and operators, Earth-observation companies, in-orbit services, aerospace OEMs, unmanned aviation systems, and advanced reactor developers.',
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
        title="Invariant: Regulatory Filings for Space Companies"
        description="Invariant prepares FAA, FCC, ITU, NOAA, and DDTC filings for launch providers, satellite operators, remote-sensing teams, and aerospace manufacturers."
        canonical="https://invariant-ai.com/"
        jsonLd={[ORG_SCHEMA, EDITORIAL_TEAM, WEBSITE_SCHEMA, SITE_NAVIGATION, faqSchema(HOME_FAQS)]}
      />
      <Hero />
      <SpaceFilingPitch />
      <IntroducingInvariant />
      <PlatformShowcase />
      <CustomerStories />
      <HowItWorks />
      <Advisors />
    </>
  )
}
