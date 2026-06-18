import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/ai-for-nuclear-compliance.json'

export default function AiForNuclearCompliance() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Nuclear compliance · Vendor comparison"
      slug="ai-for-nuclear-compliance"
      breadcrumbLabel="AI for nuclear compliance"
      topic="nuclear"
      ogImage="https://invariant-ai.com/og/ai-for-nuclear-compliance.png"
      about={['fermi-bench', 'helion-512', 'adams', 'nrc']}
      spatialCoverage={['United States']}
      keywords={[
        'AI for nuclear compliance',
        'AI for NRC licensing',
        'Atomic Canyon vs Inductive',
        'Atomic Canyon Neutron',
        'Inductive nuclear licensing',
        'Everstar Gordian',
        'Invariant Helion-512',
        'FermiBench',
        'ADAMS search',
        'FERMI embedding',
        'OpenPRA',
        'NRC AI strategic plan',
        'NRIC HTGR',
        'regulatory framework gap assessment',
      ]}
    />
  )
}
