import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/how-to-write-a-psar-pillar.json'

export default function HowToWriteAPsar() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Nuclear compliance · Guide"
      slug="how-to-write-a-psar"
      breadcrumbLabel="How to write a PSAR"
      topic="nuclear"
      ogImage="https://invariant-ai.com/og/how-to-write-a-psar.png"
      about={['psar-fsar', '10-cfr-part-50', '10-cfr-part-53', 'rai-nrc']}
      keywords={[
        'PSAR',
        'Preliminary Safety Analysis Report',
        'NRC',
        'Regulatory Guide 1.70',
        'Regulatory Guide 1.206',
        'NUREG-0800',
        'Standard Review Plan',
        '10 CFR 50.34',
        '10 CFR Part 53',
        'NEI 21-07 TICAP',
        'Kairos Hermes',
      ]}
    />
  )
}
