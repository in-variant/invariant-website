import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/doe-advanced-reactor-pilot-program.json'

export default function DoeAdvancedReactorPilotProgram() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Nuclear compliance · Live program"
      slug="doe-advanced-reactor-pilot-program"
      breadcrumbLabel="DOE Reactor Pilot Program"
      topic="nuclear"
      ogImage="https://invariant-ai.com/og/doe-advanced-reactor-pilot-program.png"
      about={['doe', 'nrc', 'eo-14301', 'atomic-energy-act']}
      spatialCoverage={['United States']}
      keywords={[
        'DOE Advanced Reactor Pilot Program',
        'Executive Order 14301',
        'EO 14301',
        'reactor pilot program 11 projects',
        'July 4 2026 criticality',
        '10 CFR Part 830',
        'Atomic Energy Act Section 31',
        'Aalo-X',
        'Antares Nuclear Mark-0',
        'Atomic Alchemy VIPR',
        'Deep Fission Borehole Reactor',
        'Last Energy PWR-5',
        'Natura Resources MSR-1',
        'Oklo Aurora-INL',
        'Radiant Industries Kaleidos',
        'Terrestrial Energy TETRA',
        'Valar Atomics NOVA',
        'Westinghouse eVinci',
      ]}
    />
  )
}
