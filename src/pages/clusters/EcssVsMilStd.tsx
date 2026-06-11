import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/ecss-vs-mil-std-pillar.json'

export default function EcssVsMilStd() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Space compliance · Guide"
      slug="ecss-vs-mil-std"
      breadcrumbLabel="ECSS vs MIL-STD"
      topic="space"
      ogImage="https://invariant-ai.com/og/ecss-vs-mil-std.png"
      about={['ecss', 'ecss-e-st-10-03', 'mil-std-461', 'nasa-gevs']}
      keywords={[
        'ECSS-E-ST-10-03C',
        'MIL-STD-1540',
        'SMC-S-016',
        'MIL-STD-461G',
        'NASA GSFC-STD-7000',
        'qualification testing',
        'acceptance testing',
        'protoflight',
        'ECSS-Q-ST-70',
        'TML CVCM',
      ]}
    />
  )
}
