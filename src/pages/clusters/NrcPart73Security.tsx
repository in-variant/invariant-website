import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/nrc-part-73-security-pillar.json'

export default function NrcPart73Security() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Nuclear compliance · Guide"
      slug="nrc-part-73-security"
      breadcrumbLabel="10 CFR Part 73 security"
      topic="nuclear"
      ogImage="https://invariant-ai.com/og/nrc-part-73-security.png"
      about={['10-cfr-part-73']}
      keywords={[
        '10 CFR Part 73',
        'Design Basis Threat',
        'DBT',
        'Section 73.55',
        'Section 73.1',
        'Safeguards Information',
        'SGI',
        'force-on-force',
        'Composite Adversary Force',
        'Section 73.100',
        'Section 73.110',
        'Section 73.120',
        'Alternative Physical Security',
        'Holtec SMR-300',
        'Kairos Hermes security',
      ]}
    />
  )
}
