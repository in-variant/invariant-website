import Pillar, { type PillarData } from '../components/Pillar'
import data from './_data/space-pillar.json'

export default function SpaceCompliance() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Space compliance"
      slug="space-compliance"
      breadcrumbLabel="Space compliance"
    />
  )
}
