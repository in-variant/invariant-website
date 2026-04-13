import { useState } from 'react'
import { Link } from 'react-router-dom'

type Segment = 'platform' | 'india-space-tech'

const TIERS = [
  {
    name: 'Starter',
    price: '$99',
    unit: '/month/seat',
    popular: false,
    features: [
      'One workspace',
      'No integrations',
      'IN-SPACe application generation',
      'Regulatory Q&A',
      'Version history',
      'Community support',
      '48-hour response SLA',
    ],
    ownership:
      'Client owns compliance entirely — Invariant provides the tool only.',
    cta: 'Get started',
    href: '/contact',
  },
  {
    name: 'Professional',
    price: '$249',
    unit: '/month/seat',
    popular: true,
    features: [
      'Unlimited workspaces',
      'Two integrations of choice',
      'Full application generation',
      'Revision cycles',
      'Regulatory change alerts',
      'Read-only audit trail',
      'Priority support',
      '24-hour response SLA',
    ],
    ownership:
      'Invariant owns document quality — reviews and signs off every submission package before it reaches you.',
    integrationNote: 'CAD, Ansys, SharePoint, Notion, and more',
    cta: 'Get started',
    href: '/contact',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    unit: '/month/seat · min 3 seats',
    popular: false,
    features: [
      'Unlimited workspaces',
      'Unlimited integrations',
      'Azure & AWS GovCloud deployment',
      'Full audit trail with data export',
      'SSO / SAML',
      'Custom data residency',
      'Sub-six-hour SLA',
      'Dedicated compliance success manager',
    ],
    ownership:
      'Invariant owns end-to-end compliance including IN-SPACe liaison, formal correspondence, and submission management. Client is applicant on paper only.',
    cta: 'Talk to sales',
    href: '/contact',
  },
]

const LIAISON = {
  name: 'Liaison Add-on',
  price: '$2,000',
  unit: '/month · on top of any tier',
  description:
    'Invariant takes full ownership of the regulatory relationship. Designed for founder-led companies with no in-house regulatory hire.',
  features: [
    'IN-SPACe liaison',
    'Formal correspondence management',
    'Query response handling',
    'Representation through to authorization grant',
  ],
}

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 text-ink/40 shrink-0 mt-0.5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default function Pricing() {
  const [segment, setSegment] = useState<Segment>('india-space-tech')

  return (
    <section className="min-h-screen py-24 px-6 md:px-12 lg:px-24 xl:px-32">
      <p className="section-label mb-4">Pricing</p>
      <div className="section-rule mb-10" />

      <h1 className="heading-editorial text-4xl md:text-5xl lg:text-6xl mb-6">
        Simple, transparent pricing
      </h1>
      <p className="body-technical max-w-2xl mb-12">
        From self-serve tooling to fully managed compliance — choose the level
        of ownership that fits your team.
      </p>

      {/* Segment toggle */}
      <div className="flex items-center gap-1 p-1 border border-ink/10 rounded-md w-fit mb-16">
        <button
          onClick={() => setSegment('india-space-tech')}
          className={`font-mono text-sm tracking-[0.1em] uppercase px-4 py-2 rounded transition-all ${
            segment === 'india-space-tech'
              ? 'bg-ink text-white'
              : 'text-ink/50 hover:text-ink'
          }`}
        >
          India Space Tech
        </button>
        <button
          onClick={() => setSegment('platform')}
          className={`relative font-mono text-sm tracking-[0.1em] uppercase px-4 py-2 rounded transition-all ${
            segment === 'platform'
              ? 'bg-ink text-white'
              : 'text-ink/50 hover:text-ink'
          }`}
        >
          Platform
        </button>
      </div>

      {segment === 'india-space-tech' ? (
        <>
          {/* Tier cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-24">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col border rounded-lg p-8 transition-colors ${
                  tier.popular
                    ? 'border-ink/30 bg-ink/[0.02]'
                    : 'border-ink/10 hover:border-ink/20'
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-6 font-mono text-xs tracking-[0.15em] uppercase bg-ink text-white px-3 py-1 rounded-sm">
                    Most popular
                  </span>
                )}

                <h3 className="font-serif text-2xl font-medium tracking-[-0.02em] text-ink mb-2">
                  {tier.name}
                </h3>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-serif text-4xl font-medium tracking-[-0.02em] text-ink">
                    {tier.price}
                  </span>
                </div>
                <p className="font-mono text-sm text-ink/40 mb-8">
                  {tier.unit}
                </p>

                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckIcon />
                      <span className="font-mono text-sm text-ink/70 leading-snug">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                {'integrationNote' in tier && tier.integrationNote && (
                  <p className="font-mono text-xs text-ink/40 mb-6 -mt-4">
                    Integrations: {tier.integrationNote}
                  </p>
                )}

                <div className="border-t border-ink/10 pt-6 mb-8">
                  <p className="font-mono text-xs text-ink/50 leading-relaxed">
                    {tier.ownership}
                  </p>
                </div>

                <Link
                  to={tier.href}
                  className={`block text-center font-mono text-sm tracking-[0.1em] uppercase py-3 rounded transition-all ${
                    tier.popular
                      ? 'bg-ink text-white hover:bg-ink/90'
                      : 'border border-ink/20 text-ink hover:border-ink/40'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Liaison Add-on */}
          <div className="section-rule mb-10" />
          <div className="border border-dashed border-ink/20 rounded-lg p-8 md:p-12 bg-ink/[0.015]">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
              <div className="max-w-xl">
                <p className="font-mono text-xs tracking-[0.2em] uppercase text-ink/40 mb-4">
                  Add-on · Available on any tier
                </p>
                <h3 className="font-serif text-3xl md:text-4xl font-medium tracking-[-0.02em] text-ink mb-2">
                  {LIAISON.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-serif text-3xl font-medium tracking-[-0.02em] text-ink">
                    {LIAISON.price}
                  </span>
                </div>
                <p className="font-mono text-sm text-ink/40 mb-6">
                  {LIAISON.unit}
                </p>
                <p className="font-mono text-base text-ink/60 leading-relaxed mb-8">
                  {LIAISON.description}
                </p>
                <Link
                  to="/contact"
                  className="inline-block font-mono text-sm tracking-[0.1em] uppercase border border-ink/20 text-ink hover:border-ink/40 px-6 py-3 rounded transition-all"
                >
                  Learn more
                </Link>
              </div>

              <ul className="flex flex-col gap-3 lg:min-w-[280px]">
                {LIAISON.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <CheckIcon />
                    <span className="font-mono text-sm text-ink/70 leading-snug">
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 border border-ink/10 rounded-lg">
          <p className="font-serif text-3xl md:text-4xl font-medium tracking-[-0.02em] text-ink mb-4">
            Coming soon
          </p>
          <p className="font-mono text-base text-ink/50 max-w-md text-center leading-relaxed">
            Platform pricing for nuclear, drone, and other regulated industries
            is on the way. Get in touch to learn more.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-block font-mono text-sm tracking-[0.1em] uppercase border border-ink/20 text-ink hover:border-ink/40 px-6 py-3 rounded transition-all"
          >
            Contact us
          </Link>
        </div>
      )}
    </section>
  )
}
