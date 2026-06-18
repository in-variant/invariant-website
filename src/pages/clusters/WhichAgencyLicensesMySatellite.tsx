import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/which-agency-licenses-my-satellite.json'

export default function WhichAgencyLicensesMySatellite() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Space compliance · Decision matrix"
      slug="which-agency-licenses-my-satellite"
      breadcrumbLabel="Which agency licenses my satellite"
      topic="space"
      ogImage="https://invariant-ai.com/og/which-agency-licenses-my-satellite.png"
      about={['faa-ast', 'fcc-part-25', 'noaa-crsra', 'ddtc', 'bis', 'nrc']}
      spatialCoverage={['United States']}
      keywords={[
        'which agency licenses a satellite',
        'FAA vs FCC vs NOAA',
        'US space regulator map',
        '14 CFR Part 450',
        '47 CFR Part 25',
        '15 CFR Part 960',
        'DDTC ITAR',
        'BIS EAR',
        'commercial smallsat licensing stack',
        'orbital debris mitigation',
        'remote sensing license',
        'launch license',
        'US satellite licensing',
      ]}
    />
  )
}
