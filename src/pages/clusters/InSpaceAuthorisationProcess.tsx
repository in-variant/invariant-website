import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/in-space-authorisation-process.json'

export default function InSpaceAuthorisationProcess() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Space compliance · India · Procedure"
      slug="in-space-authorisation-process"
      breadcrumbLabel="IN-SPACe authorisation process"
      topic="space"
      ogImage="https://invariant-ai.com/og/in-space-authorisation-process.png"
      about={['in-space-ngp-2024']}
      spatialCoverage={['India']}
      keywords={[
        'IN-SPACe authorisation',
        'IN-SPACe authorisation process',
        'IN-SPACe NGP 2024',
        'Indian National Space Promotion and Authorisation Centre',
        'Indian Space Policy 2023',
        'IN-SPACe Digital Platform',
        'IDP IN-SPACe',
        'WPC spectrum India',
        'SACFA clearance',
        'Bharatkosh fees',
        'India space FDI 2024',
        'Press Note 1 of 2024',
        'GMPCS authorisation',
        'IN-SPACe Skyroot',
        'IN-SPACe Agnikul',
        'IN-SPACe Pixxel',
        'IN-SPACe Dhruva Space',
        'Indian remote sensing 30 cm GSD',
      ]}
    />
  )
}
