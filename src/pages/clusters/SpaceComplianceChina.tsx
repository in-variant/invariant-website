import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/space-compliance-china-pillar.json'

export default function SpaceComplianceChina() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Space compliance · Region guide"
      slug="space-compliance-china"
      breadcrumbLabel="Space compliance in China"
      topic="space"
      ogImage="https://invariant-ai.com/og/space-compliance-china.png"
      keywords={[
        'CNSA',
        'CMSA',
        'SASTIND',
        'MIIT space licensing',
        'COSTIND Order No. 12',
        '2024 Negative List',
        'LandSpace',
        'Galactic Energy',
        'iSpace',
        'CAS Space',
        'Chinese commercial launch',
      ]}
      spatialCoverage={["China"]}
    />
  )
}
