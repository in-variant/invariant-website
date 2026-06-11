import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/faa-vehicle-operator-license-pillar.json'

export default function FaaVehicleOperatorLicense() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Space compliance · Guide"
      slug="faa-vehicle-operator-license"
      breadcrumbLabel="FAA vehicle operator license"
      topic="space"
      ogImage="https://invariant-ai.com/og/faa-vehicle-operator-license.png"
      about={['faa-part-450', 'faa-ast']}
      keywords={[
        'FAA VOL',
        'vehicle operator license',
        '14 CFR 450.3',
        '14 CFR 450.5',
        '14 CFR 450.7',
        'launch-specific license',
        'launch operator license',
        'Part 415',
        'Part 417',
        'Part 431',
        'Part 435',
        'SpaceX Starship VOL 23-129',
        'Blue Origin LRLO',
        'Rocket Lab LLO',
      ]}
    />
  )
}
