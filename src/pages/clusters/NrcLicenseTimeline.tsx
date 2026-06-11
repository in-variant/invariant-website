import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/nrc-license-timeline-pillar.json'

export default function NrcLicenseTimeline() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Nuclear compliance · Guide"
      slug="how-long-does-nrc-license-take"
      breadcrumbLabel="NRC license timeline"
      topic="nuclear"
      ogImage="https://invariant-ai.com/og/how-long-does-nrc-license-take.png"
      about={['10-cfr-part-50', '10-cfr-part-52', '10-cfr-part-53', 'combined-license', 'early-site-permit']}
      keywords={[
        'NRC license timeline',
        'how long does an NRC license take',
        'Construction Permit timeline',
        'Combined License timeline',
        'Kairos Hermes',
        'TerraPower Natrium',
        'Long Mott Xe-100',
        'Vogtle Units 3 and 4',
        'V.C. Summer',
        'Executive Order 14300',
      ]}
    />
  )
}
