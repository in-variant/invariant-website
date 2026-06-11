import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/faa-part-450-means-of-compliance-pillar.json'

export default function FaaPart450MeansOfCompliance() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Space compliance · Guide"
      slug="how-to-write-faa-part-450-means-of-compliance"
      breadcrumbLabel="Part 450 Means of Compliance"
      topic="space"
      ogImage="https://invariant-ai.com/og/how-to-write-faa-part-450-means-of-compliance.png"
      howTo
      about={['faa-part-450']}
      keywords={[
        'Means of Compliance',
        'MoC',
        'FAA Part 450',
        '14 CFR 450.35',
        'AC 450.115-1B',
        'AC 450.139-1',
        'flight safety analysis',
        'NASA-STD 4010',
        'lightning commit criteria',
        'AEGL-2',
      ]}
    />
  )
}
