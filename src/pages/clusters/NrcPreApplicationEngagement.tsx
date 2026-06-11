import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/nrc-pre-application-pillar.json'

export default function NrcPreApplicationEngagement() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Nuclear compliance · Guide"
      slug="nrc-pre-application-engagement-guide"
      breadcrumbLabel="NRC pre-application engagement"
      topic="nuclear"
      ogImage="https://invariant-ai.com/og/nrc-pre-application-engagement-guide.png"
      about={['10-cfr-part-50', '10-cfr-part-52', '10-cfr-part-53', 'psar-fsar']}
      keywords={[
        'NRC pre-application engagement',
        'regulatory engagement plan',
        'NEI 18-06',
        'topical report',
        'LIC-500',
        'ARCAP',
        'TICAP',
        'NEI 21-07',
        'DANU',
        'advanced reactor licensing',
        'Kairos Hermes',
        'X-energy',
        'TerraPower Natrium',
        'Holtec SMR-300',
      ]}
    />
  )
}
