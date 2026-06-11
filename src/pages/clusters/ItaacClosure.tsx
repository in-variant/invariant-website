import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/itaac-closure-pillar.json'

export default function ItaacClosure() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Nuclear compliance · Guide"
      slug="itaac-closure"
      breadcrumbLabel="ITAAC closure"
      topic="nuclear"
      ogImage="https://invariant-ai.com/og/itaac-closure.png"
      about={['itaac', '10-cfr-part-52', 'combined-license']}
      keywords={[
        'ITAAC closure',
        '10 CFR 52.99',
        '10 CFR 52.103(g)',
        '10 CFR 52.103(b)',
        'ICN',
        'IPCN',
        'Vogtle Unit 3',
        'Vogtle Unit 4',
        'AP1000',
        'Construction Inspection Program',
        'NEI 08-01',
        'RG 1.215',
      ]}
    />
  )
}
