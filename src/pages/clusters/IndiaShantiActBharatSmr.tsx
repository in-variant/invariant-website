import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/india-shanti-act-bharat-smr.json'

export default function IndiaShantiActBharatSmr() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Nuclear compliance · India"
      slug="india-shanti-act-bharat-smr"
      breadcrumbLabel="India SHANTI Act and Bharat Small Reactor"
      topic="nuclear"
      ogImage="https://invariant-ai.com/og/india-shanti-act-bharat-smr.png"
      about={['aerb', 'shanti-act', 'bharat-small-reactor', 'npcil', 'dae']}
      spatialCoverage={['India']}
      keywords={[
        'SHANTI Act 2025',
        'SHANTI Act India',
        'Bharat Small Reactor',
        'BSR program',
        'India nuclear compliance',
        'AERB licensing',
        'NPCIL',
        'ASHVINI',
        'Anushakti Vidhyut Nigam',
        'India 49 percent FDI nuclear',
        'CLNDA 2010',
        'Atomic Energy Act 1962 repealed',
        'CSC India',
        'Convention on Supplementary Compensation',
        '10 CFR Part 810 Holtec India',
        'India 123 Agreement',
        'Mahi Banswara',
        'Kudankulam',
        'BSMR India',
      ]}
    />
  )
}
