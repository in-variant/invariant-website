import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/nuclear-compliance-india-pillar.json'

export default function NuclearComplianceIndia() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Nuclear compliance · Region guide"
      slug="nuclear-compliance-india"
      breadcrumbLabel="Nuclear compliance in India"
      topic="nuclear"
      ogImage="https://invariant-ai.com/og/nuclear-compliance-india.png"
      about={['iaea-ssr-2-1']}
      spatialCoverage={['India']}
      keywords={[
        'AERB',
        'Atomic Energy Act 1962',
        'CLNDA 2010',
        'Section 17(b)',
        'SHANTI Act 2025',
        'NPCIL',
        'DAE',
        'Bharat Small Reactor',
        'nuclear compliance India',
        'private sector nuclear India',
      ]}
    />
  )
}
