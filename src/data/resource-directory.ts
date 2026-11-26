import directory from './.generated-blog-search/resource-directory.json'
import type { ResourceArticle, ResourceTopic } from './resources'
import { POWER_SCHEDULE_DESCRIPTION, POWER_SCHEDULE_PATH, POWER_SCHEDULE_TITLE } from './dataCenterPowerSchedule'
import { LEASE_RENT_DESCRIPTION, LEASE_RENT_PATH, LEASE_RENT_TITLE } from './leaseRent'
import { BATTERY_RECHARGE_DESCRIPTION, BATTERY_RECHARGE_PATH, BATTERY_RECHARGE_TITLE } from './batteryRecharge'
import { WATER_USE_DESCRIPTION, WATER_USE_PATH, WATER_USE_TITLE } from './dataCenterWaterUse'
import { AEP_DEMAND_DESCRIPTION, AEP_DEMAND_PATH, AEP_DEMAND_TITLE } from './aepOhioDemandCharge'
import { REFINANCE_DESCRIPTION, REFINANCE_PATH, REFINANCE_TITLE } from './commercialRefinance'

export type ResourceReference = {
  path: string
  title: string
  summary: string
  topic: ResourceTopic
  kind: 'Guide' | 'Tool' | 'Dataset'
  articleSlug?: string
  searchContext?: string
}

export const FEATURED_RESOURCE_ARTICLES = directory.featured as ResourceArticle[]

export const RESOURCE_REFERENCES: ResourceReference[] = [
  { path: '/data-centre-compliance-india', title: 'Data centre approvals in India: the full project map', summary: 'Connect land, power, environment, water, fire, electrical safety and data law approvals for a data centre in India.', topic: 'Data Centers', kind: 'Guide' },
  { path: '/data-center-compliance', title: 'Data-center compliance: the full project map', summary: 'Connect siting, power, air, water and operating obligations in one U.S. compliance plan.', topic: 'Data Centers', kind: 'Guide' },
  { path: '/oil-gas-compliance', title: 'Oil-and-gas compliance: from permits to field records', summary: 'Understand U.S. onshore permitting, methane requirements and the evidence behind operating obligations.', topic: 'Oil & Gas', kind: 'Guide' },
  { path: '/calculators/data-center-power-capacity', title: 'Data center power capacity calculator', summary: 'Convert IT load to facility MW, compare utility and on-site power during outages, and check battery runtime.', topic: 'Data Centers', kind: 'Tool' },
  { path: POWER_SCHEDULE_PATH, title: POWER_SCHEDULE_TITLE, summary: POWER_SCHEDULE_DESCRIPTION, topic: 'Data Centers', kind: 'Tool' },
  { path: WATER_USE_PATH, title: WATER_USE_TITLE, summary: WATER_USE_DESCRIPTION, topic: 'Data Centers', kind: 'Tool', searchContext: 'cooling demand gallons per day water consumption water usage effectiveness WUE' },
  { path: AEP_DEMAND_PATH, title: AEP_DEMAND_TITLE, summary: AEP_DEMAND_DESCRIPTION, topic: 'Data Centers', kind: 'Tool', searchContext: 'utility bill distribution rate kilowatt minimum capacity ramp 11-month ratchet load lookback' },
  { path: LEASE_RENT_PATH, title: LEASE_RENT_TITLE, summary: LEASE_RENT_DESCRIPTION, topic: 'Data & APIs', kind: 'Tool' },
  { path: REFINANCE_PATH, title: REFINANCE_TITLE, summary: REFINANCE_DESCRIPTION, topic: 'Data & APIs', kind: 'Tool', searchContext: 'maximum loan size DSCR debt service coverage loan to value debt yield income payoff maturity CMBS cash needed' },
  { path: BATTERY_RECHARGE_PATH, title: BATTERY_RECHARGE_TITLE, summary: BATTERY_RECHARGE_DESCRIPTION, topic: 'Data & APIs', kind: 'Tool', searchContext: 'BESS charging duration grid import headroom utility-scale interconnection' },
  ...directory.guides as ResourceReference[],
  ...directory.datasets as ResourceReference[],
]
