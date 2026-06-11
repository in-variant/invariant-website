import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/part-50-52-53-pillar.json'

export default function Part50vs52vs53() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Nuclear compliance · Guide"
      slug="part-50-vs-52-vs-53"
      breadcrumbLabel="Part 50 vs Part 52 vs Part 53"
      topic="nuclear"
      ogImage="https://invariant-ai.com/og/part-50-vs-52-vs-53.png"
      about={['10-cfr-part-50', '10-cfr-part-52', '10-cfr-part-53']}
      keywords={[
        '10 CFR Part 50',
        '10 CFR Part 52',
        '10 CFR Part 53',
        'NRC reactor licensing',
        'Combined Licence',
        'Construction Permit',
        'advanced reactor',
        'NEIMA',
      ]}
    />
  )
}
