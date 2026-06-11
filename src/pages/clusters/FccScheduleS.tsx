import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/fcc-schedule-s-pillar.json'

export default function FccScheduleS() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Space compliance · Guide"
      slug="fcc-schedule-s"
      breadcrumbLabel="FCC Schedule S"
      topic="space"
      ogImage="https://invariant-ai.com/og/fcc-schedule-s.png"
      howTo
      about={['fcc-schedule-s', 'fcc-part-25', 'fcc-22-74']}
      keywords={[
        'FCC Schedule S',
        'FCC Form 312',
        'Schedule S drafting',
        '47 CFR 25.114',
        '47 CFR 25.208',
        'ICFS',
        'IBFS',
        'GSO',
        'NGSO',
        'GIMS',
        'satellite engineering data',
        'orbital debris mitigation plan',
        'FCC 23-73',
        'power flux density',
      ]}
    />
  )
}
