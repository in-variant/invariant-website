import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/part-50-52-53-pillar.json'

export default function Part50vs52vs53() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Nuclear compliance · Guide"
      slug="part-50-vs-52-vs-53"
      breadcrumbLabel="Part 50 vs Part 52 vs Part 53"
      topic="nuclear"
      ogImage="https://invariant-ai.com/og/part-50-vs-52-vs-53.png"
    />
  )
}
