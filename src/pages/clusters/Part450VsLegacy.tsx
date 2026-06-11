import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/part-450-vs-legacy-pillar.json'

export default function Part450VsLegacy() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Space compliance · Guide"
      slug="faa-part-450-vs-legacy"
      breadcrumbLabel="Part 450 vs legacy"
      topic="space"
      ogImage="https://invariant-ai.com/og/faa-part-450-vs-legacy.png"
      about={['faa-part-450']}
      keywords={[
        'FAA Part 450',
        '14 CFR Part 415',
        '14 CFR Part 417',
        '14 CFR Part 431',
        '14 CFR Part 435',
        'Streamlined Launch and Reentry',
        '85 FR 79566',
        'transition window',
        'AC 450 series',
        'commercial launch licensing',
      ]}
    />
  )
}
