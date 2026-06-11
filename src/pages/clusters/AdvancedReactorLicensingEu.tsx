import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/advanced-reactor-licensing-eu-pillar.json'

export default function AdvancedReactorLicensingEu() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Nuclear compliance · Region guide"
      slug="advanced-reactor-licensing-eu"
      breadcrumbLabel="Advanced reactor licensing in the EU"
      topic="nuclear"
      ogImage="https://invariant-ai.com/og/advanced-reactor-licensing-eu.png"
      about={['iaea-ssr-2-1', '10-cfr-part-53']}
      keywords={[
        'UK ONR GDA',
        'France ASNR',
        'STUK',
        'CNCAN',
        'SUJB',
        'SSM',
        'CSN',
        'HAEA',
        'EPR2 Penly',
        'Rolls-Royce SMR',
        'BWRX-300',
        'WENRA',
        'ENSREG',
        'advanced reactor licensing EU',
      ]}
    />
  )
}
