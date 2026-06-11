import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/space-compliance-eu-pillar.json'

export default function SpaceComplianceEu() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Space compliance · Region guide"
      slug="space-compliance-eu"
      breadcrumbLabel="Space compliance in the EU"
      topic="space"
      ogImage="https://invariant-ai.com/og/space-compliance-eu.png"
      about={['ecss']}
      keywords={[
        'EU Space Act',
        'COM(2025) 335',
        'Outer Space Treaty Article VI VII',
        'Loi 2008-518',
        'Space Industry Act 2018',
        'Luxembourg Space Resources Act 2017',
        'EUSPA',
        'ESA',
        'IRIS2',
        'EU SST',
        'space compliance EU',
      ]}
    />
  )
}
