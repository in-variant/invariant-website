import Pillar, { type PillarData } from '../components/Pillar'
import data from './_data/nuclear-pillar.json'

export default function NuclearCompliance() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Nuclear compliance"
      slug="nuclear-compliance"
      breadcrumbLabel="Nuclear compliance"
      topic="nuclear"
      ogImage="https://invariant-ai.com/og/nuclear-compliance.png"
    />
  )
}
