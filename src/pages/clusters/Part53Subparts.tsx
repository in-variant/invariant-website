import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/part-53-subparts-pillar.json'

export default function Part53Subparts() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Nuclear compliance · Reference"
      slug="part-53-subparts"
      breadcrumbLabel="Part 53 subparts"
      topic="nuclear"
      ogImage="https://invariant-ai.com/og/part-53-subparts.png"
      about={['10-cfr-part-53', 'psar-fsar', 'nei-21-07-ticap', 'nepa']}
      keywords={[
        '10 CFR Part 53',
        'Subpart A',
        'Subpart B',
        'Subpart C',
        'Subpart D',
        'Subpart E',
        'Subpart F',
        'Subpart G',
        'Subpart H',
        'LBE',
        'DBA',
        '25 rem TEDE',
        'PRA Section 53.450',
        'NEIMA Section 103',
        'NRC-2019-0062',
      ]}
    />
  )
}
