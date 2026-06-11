import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/nuclear-compliance-japan-pillar.json'

export default function NuclearComplianceJapan() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Nuclear compliance · Region guide"
      slug="nuclear-compliance-japan"
      breadcrumbLabel="Nuclear compliance in Japan"
      topic="nuclear"
      ogImage="https://invariant-ai.com/og/nuclear-compliance-japan.png"
      about={['nra-japan', 'iaea-ssr-2-1']}
      keywords={[
        'NRA Japan',
        'Nuclear Regulation Authority',
        'New Regulatory Requirements',
        'post-Fukushima',
        'Kashiwazaki-Kariwa',
        'Sendai',
        'Genkai',
        'Specified Safety Facility',
        'Article 3 commission',
        'Safety Goal Japan',
        'JAEA HTTR',
        'Mitsubishi SRZ-1200',
      ]}
      spatialCoverage={['Japan']}
    />
  )
}
