import Pillar, { type PillarData } from '../components/Pillar'
import data from './_data/nuclear-pillar.json'

export default function NuclearCompliance() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Nuclear compliance"
      slug="nuclear-compliance"
      breadcrumbLabel="Nuclear compliance"
      topic="nuclear"
      ogImage="https://invariant-ai.com/og/nuclear-compliance.png"
      about={[
        '10-cfr-part-50',
        '10-cfr-part-52',
        '10-cfr-part-53',
        'psar-fsar',
        'rai-nrc',
        'iaea-ssr-2-1',
      ]}
      keywords={[
        'nuclear compliance',
        'NRC',
        '10 CFR Part 50',
        '10 CFR Part 52',
        '10 CFR Part 53',
        'IAEA SSR-2/1',
        'PSAR',
        'FSAR',
        'advanced reactor licensing',
        'small modular reactor',
        'microreactor',
      ]}
    />
  )
}
