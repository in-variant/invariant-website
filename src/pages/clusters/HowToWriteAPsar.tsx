import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/how-to-write-a-psar-pillar.json'

export default function HowToWriteAPsar() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Nuclear compliance · Guide"
      slug="how-to-write-a-psar"
      breadcrumbLabel="How to write a PSAR"
      topic="nuclear"
      ogImage="https://invariant-ai.com/og/how-to-write-a-psar.png"
    />
  )
}
