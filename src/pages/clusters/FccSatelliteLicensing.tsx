import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/fcc-satellite-licensing.json'

export default function FccSatelliteLicensing() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Space compliance · FCC"
      slug="fcc-satellite-licensing"
      breadcrumbLabel="FCC satellite licensing"
      topic="space"
      updatedAt="2026-08-08"
      ogImage="https://invariant-ai.com/og/fcc-satellite-licensing.png"
      spatialCoverage={['United States']}
      keywords={[
        'FCC satellite licensing',
        'FCC satellite license',
        'how to get a satellite license',
        'FCC Part 25',
        '47 CFR 25.122 small satellite',
        'FCC Form 312 Schedule S',
        'FCC Part 100',
        'FCC satellite license cost',
        'FCC satellite license timeline',
        'NGSO processing round',
        'FCC surety bond satellite',
        'FCC 5-year deorbit rule',
        'satellite market access 25.137',
        'ICFS filing',
      ]}
    />
  )
}
