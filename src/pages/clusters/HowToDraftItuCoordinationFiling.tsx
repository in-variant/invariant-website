import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/how-to-draft-itu-coordination-filing-pillar.json'

export default function HowToDraftItuCoordinationFiling() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Space compliance · Guide"
      slug="how-to-draft-itu-coordination-filing"
      breadcrumbLabel="ITU coordination filing"
      topic="space"
      ogImage="https://invariant-ai.com/og/how-to-draft-itu-coordination-filing.png"
      about={['itu-api-crc']}
      keywords={[
        'ITU Article 9',
        'ITU Article 11',
        'Appendix 4',
        'API',
        'CR/C',
        'BIU',
        'No. 11.44',
        'SpaceCap',
        'SpaceVal',
        'BR IFIC',
        'Resolution 49 WRC-19',
        'ITU coordination filing',
      ]}
    />
  )
}
