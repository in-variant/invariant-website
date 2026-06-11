import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/itar-commodity-jurisdiction-pillar.json'

export default function ItarCommodityJurisdiction() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Space compliance · Guide"
      slug="itar-commodity-jurisdiction"
      breadcrumbLabel="ITAR Commodity Jurisdiction"
      topic="space"
      ogImage="https://invariant-ai.com/og/itar-commodity-jurisdiction.png"
      howTo
      about={['usml-category-xv']}
      keywords={[
        'commodity jurisdiction',
        'CJ',
        'Form DS-4076',
        '22 CFR 120.12',
        'DDTC',
        'DECCS',
        'USML Category XV',
        'ECCN 9x515',
        'interagency review',
        'CJ Final Determinations',
      ]}
    />
  )
}
