import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/noaa-tiers-pillar.json'

export default function NoaaRemoteSensingTiers() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Space compliance · Guide"
      slug="noaa-remote-sensing-license-tiers"
      breadcrumbLabel="NOAA remote-sensing tiers"
      topic="space"
      ogImage="https://invariant-ai.com/og/noaa-remote-sensing-license-tiers.png"
      about={['noaa-csla', 'noaa-tier-1-2-3']}
      keywords={[
        'NOAA CRSRA',
        '15 CFR Part 960',
        'Tier 1',
        'Tier 2',
        'Tier 3',
        'remote sensing license',
        'Land Remote Sensing Policy Act',
        'NESDIS',
        '85 FR 30790',
        'foreign availability',
      ]}
    />
  )
}
