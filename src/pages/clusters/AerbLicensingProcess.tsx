import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/aerb-licensing-process.json'

export default function AerbLicensingProcess() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Nuclear compliance · India · Procedure"
      slug="aerb-licensing-process"
      breadcrumbLabel="AERB licensing process"
      topic="nuclear"
      ogImage="https://invariant-ai.com/og/aerb-licensing-process.png"
      about={['aerb', 'shanti-act', 'npcil', 'bharat-small-reactor', 'ashvini']}
      spatialCoverage={['India']}
      keywords={[
        'AERB licensing process',
        'AERB consent chain',
        'AERB siting consent',
        'AERB construction consent',
        'AERB commissioning authorisation',
        'AERB operating licence',
        'AERB Safety Code',
        'AERB SC G',
        'AERB NPP PHWR SC D',
        'AERB NPP LWR SC D',
        'AERB NPP SC O',
        'Indian nuclear reactor licensing',
        'BSMR Tarapur',
        'Kudankulam licensing',
        'Mahi Banswara licensing',
        'PSAR India',
        'FSAR India',
        'AERB Periodic Safety Review',
      ]}
    />
  )
}
