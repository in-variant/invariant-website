import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/nrc-rai-management-pillar.json'

export default function NrcRaiManagement() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Nuclear compliance · Guide"
      slug="nrc-rai-management"
      breadcrumbLabel="NRC RAI management"
      topic="nuclear"
      ogImage="https://invariant-ai.com/og/nrc-rai-management.png"
      about={['rai-nrc', 'lic-500', 'psar-fsar']}
      keywords={[
        'NRC RAI',
        'Request for Additional Information',
        'LIC-115',
        'LIC-111',
        'LIC-117',
        'NRO-REG-108',
        '30-day response',
        'NuScale US600',
        'Kairos Hermes',
        'TerraPower Natrium',
        'RAI categories by SAR chapter',
        'NEI 21-04',
      ]}
    />
  )
}
