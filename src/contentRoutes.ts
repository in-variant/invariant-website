import { createElement, type ComponentType } from 'react'
import type { BlogCollectionData } from './data/blogCollections'

// Shared by the browser router and the build-time renderer.
export const contentRouteSources = {
  '/': './pages/Home.tsx',
  '/contact': './pages/Contact.tsx',
  '/charter': './pages/Charter.tsx',
  '/resources': './pages/Resources.tsx',
  '/virginia-industrial-land-for-sale': './pages/VirginiaIndustrialSites.tsx',
  '/datasets': './pages/Datasets.tsx',
  '/blog': './pages/Blog.tsx',
  '/blog/site-selection-due-diligence': './pages/blog/BlogCollection.tsx',
  '/blog/property-underwriting': './pages/blog/BlogCollection.tsx',
  '/blog/commercial-real-estate-lending': './pages/blog/BlogCollection.tsx',
  '/blog/physical-world-data-api-evaluation': './pages/blog/ProviderEvaluation.tsx',
  '/blog/physical-world-data-by-use-case': './pages/blog/BlogCollection.tsx',
  '/blog/part100-vs-part53-siting': './pages/blog/Part100vsPart53.tsx',
  '/blog/seismic-design-shift': './pages/blog/SeismicDesignShift.tsx',
  '/pricing': './pages/Pricing.tsx',
  '/product': './pages/Product.tsx',
  '/mcp': './pages/EarthMcp.tsx',
  '/data-coverage': './pages/DataCoverage.tsx',
  '/probe': './pages/Probe.tsx',
  '/timeline': './pages/Timeline.tsx',
  '/space-compliance': './pages/SpaceCompliance.tsx',
  '/nuclear-compliance': './pages/NuclearCompliance.tsx',
  '/part-50-vs-52-vs-53': './pages/clusters/Part50vs52vs53.tsx',
  '/faa-part-450-license-timeline': './pages/clusters/FaaPart450Timeline.tsx',
  '/how-to-write-a-psar': './pages/clusters/HowToWriteAPsar.tsx',
  '/itar-vs-ear-for-space-companies': './pages/clusters/ItarVsEarForSpace.tsx',
  '/nrc-pre-application-engagement-guide': './pages/clusters/NrcPreApplicationEngagement.tsx',
  '/nuclear-compliance-india': './pages/clusters/NuclearComplianceIndia.tsx',
  '/fcc-5-year-deorbit-rule': './pages/clusters/Fcc5YearDeorbitRule.tsx',
  '/space-compliance-india': './pages/clusters/SpaceComplianceIndia.tsx',
  '/how-to-write-faa-part-450-means-of-compliance': './pages/clusters/FaaPart450MeansOfCompliance.tsx',
  '/noaa-remote-sensing-license-tiers': './pages/clusters/NoaaRemoteSensingTiers.tsx',
  '/advanced-reactor-licensing-eu': './pages/clusters/AdvancedReactorLicensingEu.tsx',
  '/space-compliance-eu': './pages/clusters/SpaceComplianceEu.tsx',
  '/how-to-draft-itu-coordination-filing': './pages/clusters/HowToDraftItuCoordinationFiling.tsx',
  '/faa-part-450-vs-legacy': './pages/clusters/Part450VsLegacy.tsx',
  '/ecss-vs-mil-std': './pages/clusters/EcssVsMilStd.tsx',
  '/how-long-does-nrc-license-take': './pages/clusters/NrcLicenseTimeline.tsx',
  '/nuclear-compliance-japan': './pages/clusters/NuclearComplianceJapan.tsx',
  '/glossary': './pages/Glossary.tsx',
  '/research': './pages/Research.tsx',
  '/compliance': './pages/Compliance.tsx',
  '/trust': './pages/Trust.tsx',
  '/about': './pages/About.tsx',
  '/regulators': './pages/Regulators.tsx',
  '/calculators/faa-part-450-timeline': './pages/calculators/FaaPart450Calculator.tsx',
  '/calculators/nrc-license-timeline': './pages/calculators/NrcLicenseCalculator.tsx',
  '/calculators': './pages/calculators/Index.tsx',
  '/calculators/fcc-deorbit-feasibility': './pages/calculators/FccDeorbitCalculator.tsx',
  '/calculators/data-center-power-capacity': './pages/calculators/DataCenterPowerCapacity.tsx',
  '/calculators/generator-run-hours': './pages/calculators/GeneratorRunHours.tsx',
  '/calculators/data-center-water-use': './pages/calculators/DataCenterWaterUse.tsx',
  '/calculators/aep-ohio-data-center-demand-charge': './pages/calculators/AepOhioDemandCharge.tsx',
  '/calculators/data-center-power-delivery-schedule': './pages/calculators/DataCenterPowerSchedule.tsx',
  '/calculators/net-effective-rent': './pages/calculators/LeaseRent.tsx',
  '/calculators/commercial-refinance-gap': './pages/calculators/CommercialRefinanceGap.tsx',
  '/calculators/dscr-debt-yield': './pages/calculators/CommercialDebtCoverage.tsx',
  '/calculators/battery-recharge-window': './pages/calculators/BatteryRecharge.tsx',
  '/faa-ac-450-series': './pages/clusters/FaaAc450Series.tsx',
  '/part-53-subparts': './pages/clusters/Part53Subparts.tsx',
  '/nrc-rai-management': './pages/clusters/NrcRaiManagement.tsx',
  '/itar-commodity-jurisdiction': './pages/clusters/ItarCommodityJurisdiction.tsx',
  '/itaac-closure': './pages/clusters/ItaacClosure.tsx',
  '/fcc-schedule-s': './pages/clusters/FccScheduleS.tsx',
  '/itu-bringing-into-use': './pages/clusters/ItuBringingIntoUse.tsx',
  '/faa-vehicle-operator-license': './pages/clusters/FaaVehicleOperatorLicense.tsx',
  '/nrc-part-73-security': './pages/clusters/NrcPart73Security.tsx',
  '/which-agency-licenses-my-satellite': './pages/clusters/WhichAgencyLicensesMySatellite.tsx',
  '/space-law-firms': './pages/clusters/SpaceLawFirms.tsx',
  '/fcc-satellite-licensing': './pages/clusters/FccSatelliteLicensing.tsx',
  '/aegis-space-law-alternative': './pages/clusters/AegisSpaceLawAlternative.tsx',
  '/satellite-licensing-services': './pages/clusters/SatelliteLicensingServices.tsx',
  '/nuclear-licensing-consultants': './pages/clusters/NuclearLicensingConsultants.tsx',
  '/doe-advanced-reactor-pilot-program': './pages/clusters/DoeAdvancedReactorPilotProgram.tsx',
  '/india-shanti-act-bharat-smr': './pages/clusters/IndiaShantiActBharatSmr.tsx',
} as const

export const deckRouteSources = {
  '/deck': './pages/Deck.tsx',
  '/drone-deck': './pages/DroneDeck.tsx',
  '/spantrik': './pages/SpantrikDeck.tsx',
  '/intomes': './pages/IntomesDeck.tsx',
  '/customer-deck': './pages/CustomerDeck.tsx',
  '/insurance-deck': './pages/InsuranceDeck.tsx',
} as const

export const clientOnlyPaths = ['/pricing', ...Object.keys(deckRouteSources)]

type RouteSources = typeof contentRouteSources & typeof deckRouteSources
type PageSource = RouteSources[keyof RouteSources]

const pageModules = import.meta.glob<{ default: ComponentType }>([
  './pages/*.tsx',
  './pages/blog/*.tsx',
  './pages/calculators/*.tsx',
  './pages/clusters/*.tsx',
  '!./pages/NotFound.tsx',
  '!./pages/Datasets.tsx',
  '!./pages/blog/BlogCollection.tsx',
  '!./pages/blog/ProviderEvaluation.tsx',
  '!./pages/{Careers,Partners,Prototype}.tsx',
])

const collectionContent = import.meta.glob<{ default: BlogCollectionData }>('./data/.generated-blog-search/collections/*.json')

export function blogCollectionDataSource(path: string) {
  return `./data/.generated-blog-search/collections/${path.slice('/blog/'.length)}.json`
}

export function isBlogCollectionSource(source: string) {
  return source === './pages/blog/BlogCollection.tsx' || source === './pages/blog/ProviderEvaluation.tsx'
}

export function loadContentPage(source: PageSource, path: string): Promise<{ default: ComponentType }> {
  if (isBlogCollectionSource(source)) {
    const loadCollection = collectionContent[blogCollectionDataSource(path)]
    if (!loadCollection) throw new Error(`Missing collection data for ${path}`)
    const view = source === './pages/blog/ProviderEvaluation.tsx'
      ? import('./pages/blog/ProviderEvaluation')
      : import('./pages/blog/BlogCollection')
    return Promise.all([view, loadCollection()]).then(([{ default: Collection }, { default: collection }]) => ({
      default: () => createElement(Collection, { collection }),
    }))
  }
  if (source === contentRouteSources['/datasets']) {
    return import('./pages/Datasets').then(({ loadDatasetsPage }) => loadDatasetsPage())
  }
  const load = pageModules[source]
  if (!load) throw new Error(`Missing page module ${source}`)
  return load()
}
