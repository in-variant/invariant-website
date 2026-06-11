import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/faa-part-450-timeline-pillar.json'

export default function FaaPart450Timeline() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Space compliance · Guide"
      slug="faa-part-450-license-timeline"
      breadcrumbLabel="FAA Part 450 timeline"
      topic="space"
      ogImage="https://invariant-ai.com/og/faa-part-450-license-timeline.png"
    />
  )
}
