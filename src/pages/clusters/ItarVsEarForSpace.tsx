import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/itar-vs-ear-pillar.json'

export default function ItarVsEarForSpace() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Space compliance · Guide"
      slug="itar-vs-ear-for-space-companies"
      breadcrumbLabel="ITAR vs EAR for space"
      topic="space"
      ogImage="https://invariant-ai.com/og/itar-vs-ear-for-space-companies.png"
      about={['usml-category-xv']}
      keywords={[
        'ITAR',
        'EAR',
        'USML Category XV',
        'ECCN 9A515',
        'ECCN 9B515',
        'ECCN 9x515',
        'export control',
        'DDTC',
        'BIS',
        'commodity jurisdiction',
        '22 CFR 121.1',
        '15 CFR Part 774',
      ]}
    />
  )
}
