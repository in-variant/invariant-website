import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/satellite-licensing-services.json'

export default function SatelliteLicensingServices() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Space compliance · Market guide"
      slug="satellite-licensing-services"
      breadcrumbLabel="Satellite licensing services"
      topic="space"
      updatedAt="2026-08-08"
      ogImage="https://invariant-ai.com/og/satellite-licensing-services.png"
      spatialCoverage={['United States']}
      keywords={[
        'satellite licensing services',
        'satellite licensing consultant',
        'FCC licensing services',
        'ITU filing consultant',
        'space regulatory consulting',
        'FAA Part 450 consultant',
        'Astrolytics alternative',
        'SpaceNexus alternative',
        'satellite licensing help',
        'spectrum coordination services',
        'earth station licensing services',
      ]}
    />
  )
}
