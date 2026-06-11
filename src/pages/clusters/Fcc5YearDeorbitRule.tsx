import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/fcc-5-year-deorbit-pillar.json'

export default function Fcc5YearDeorbitRule() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Space compliance · Guide"
      slug="fcc-5-year-deorbit-rule"
      breadcrumbLabel="FCC 5-year deorbit rule"
      topic="space"
      ogImage="https://invariant-ai.com/og/fcc-5-year-deorbit-rule.png"
      about={['fcc-part-25']}
      keywords={[
        'FCC 22-74',
        '5-year deorbit',
        'orbital debris',
        '47 CFR 25.283',
        'IB Docket 18-313',
        'post-mission disposal',
        'LEO',
        'space station licensing',
        'IADC guidelines',
        'ODMSP',
      ]}
    />
  )
}
