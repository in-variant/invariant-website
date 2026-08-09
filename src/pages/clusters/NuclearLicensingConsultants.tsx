import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/nuclear-licensing-consultants.json'

export default function NuclearLicensingConsultants() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Nuclear compliance · Market guide"
      slug="nuclear-licensing-consultants"
      breadcrumbLabel="Nuclear licensing consultants"
      topic="nuclear"
      updatedAt="2026-08-08"
      ogImage="https://invariant-ai.com/og/nuclear-licensing-consultants.png"
      spatialCoverage={['United States']}
      keywords={[
        'nuclear licensing consultants',
        'NRC licensing support',
        'NRC licensing consultant',
        'nuclear regulatory consulting',
        'PSAR preparation support',
        'nuclear licensing cost',
        'Jensen Hughes nuclear licensing',
        'Certrec alternative',
        'nuclear compliance software',
        'AI for NRC licensing',
        'advanced reactor licensing support',
      ]}
    />
  )
}
