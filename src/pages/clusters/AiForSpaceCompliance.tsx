import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/ai-for-space-compliance.json'

export default function AiForSpaceCompliance() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Space compliance · Vendor map"
      slug="ai-for-space-compliance"
      breadcrumbLabel="AI for space compliance"
      topic="space"
      ogImage="https://invariant-ai.com/og/ai-for-space-compliance.png"
      about={['faa-ast', 'fcc-part-25', 'noaa-crsra', 'ddtc', 'bis', 'fermi-bench', 'helion-512']}
      spatialCoverage={['United States']}
      keywords={[
        'AI for space compliance',
        'AI for FAA Part 450',
        'AI for FCC Part 25',
        'AI for NOAA Part 960',
        'AI for ITAR USML Category XV',
        'AI for space licensing',
        'Invariant Helion-512',
        'FermiBench',
        'HyperSigma',
        'Lockheed Astris AI',
        'AI space compliance vendor comparison',
        'CMMC for space',
        'ITAR Technology Control Plan AI',
        'space licensing backlog',
        'EO 14335 commercial space',
      ]}
    />
  )
}
