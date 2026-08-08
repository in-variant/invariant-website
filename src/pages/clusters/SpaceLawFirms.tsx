import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/space-law-firms.json'

export default function SpaceLawFirms() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Space compliance · Market guide"
      slug="space-law-firms"
      breadcrumbLabel="Space law firms"
      topic="space"
      updatedAt="2026-08-08"
      ogImage="https://invariant-ai.com/og/space-law-firms.png"
      spatialCoverage={['United States']}
      keywords={[
        'space law firm',
        'space law firms 2026',
        'best space law firm',
        'space lawyer cost',
        'Aegis Space Law pricing',
        'satellite licensing attorney',
        'do I need a lawyer for FCC satellite license',
        'FCC Part 100 overhaul',
        'commercial space law',
        'ITAR lawyer vs in-house',
        'space law firm vs compliance platform',
      ]}
    />
  )
}
