import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/space-compliance-india-pillar.json'

export default function SpaceComplianceIndia() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Space compliance · Region guide"
      slug="space-compliance-india"
      breadcrumbLabel="Space compliance in India"
      topic="space"
      ogImage="https://invariant-ai.com/og/space-compliance-india.png"
      about={['in-space-ngp-2024']}
      keywords={[
        'IN-SPACe',
        'IN-SPACe authorisation',
        'NGP 2024',
        'Indian Space Policy 2023',
        'DOS',
        'ISRO',
        'WPC',
        'SACFA',
        'DPIIT Press Note 1 2024',
        'FDI space India',
        'India space compliance',
      ]}
    />
  )
}
