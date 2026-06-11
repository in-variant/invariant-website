import Pillar, { type PillarData } from '../components/Pillar'
import data from './_data/space-pillar.json'

export default function SpaceCompliance() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Space compliance"
      slug="space-compliance"
      breadcrumbLabel="Space compliance"
      topic="space"
      ogImage="https://invariant-ai.com/og/space-compliance.png"
      about={[
        'faa-part-450',
        'fcc-part-25',
        'noaa-csla',
        'in-space-ngp-2024',
        'ecss',
        'nasa-gevs',
        'mil-std-461',
        'thermal-vacuum-tvac',
        'usml-category-xv',
      ]}
      keywords={[
        'space compliance',
        'FAA Part 450',
        'FCC Part 25',
        'NOAA commercial remote sensing',
        'IN-SPACe',
        'ECSS',
        'NASA GEVS',
        'satellite licensing',
        'launch licensing',
        'orbital debris mitigation',
      ]}
    />
  )
}
