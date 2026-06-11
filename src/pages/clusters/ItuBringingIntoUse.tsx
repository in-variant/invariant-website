import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/itu-bringing-into-use-pillar.json'

export default function ItuBringingIntoUse() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Space compliance · Guide"
      slug="itu-bringing-into-use"
      breadcrumbLabel="ITU Bringing Into Use"
      topic="space"
      ogImage="https://invariant-ai.com/og/itu-bringing-into-use.png"
      about={['itu-api-crc', 'resolution-49']}
      keywords={[
        'ITU Bringing Into Use',
        'BIU',
        'ITU Article 11',
        'Number 11.44',
        'Number 11.44B',
        'Resolution 35 WRC-19',
        'NGSO milestones',
        '7-year clock',
        '90-day continuous',
        'WRC-12',
        'MIFR',
      ]}
    />
  )
}
