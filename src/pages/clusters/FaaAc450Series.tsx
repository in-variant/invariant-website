import Pillar, { type PillarData } from '../../components/Pillar'
import data from '../_data/faa-ac-450-series-pillar.json'

export default function FaaAc450Series() {
  return (
    <Pillar
      data={data as PillarData}
      eyebrow="Space compliance · Reference"
      slug="faa-ac-450-series"
      breadcrumbLabel="FAA AC 450 series"
      topic="space"
      ogImage="https://invariant-ai.com/og/faa-ac-450-series.png"
      about={['faa-part-450', 'ac-450-41-1']}
      keywords={[
        'FAA AC 450',
        'FAA Advisory Circulars',
        'AC 413.13-1',
        'AC 450.103-1',
        'AC 450.108-1',
        'AC 450.115-1B',
        'AC 450.115-2',
        'AC 450.117-1',
        'AC 450.123-1',
        'AC 450.137-1',
        'AC 450.139-1',
        'AC 450.143-1',
        'AC 450.169-1A',
        'AC 450.173-1',
        'AC 450.179-1',
        'commercial space advisory circulars',
      ]}
    />
  )
}
