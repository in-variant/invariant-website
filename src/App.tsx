import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Layout from './components/Layout'
import Home from './pages/Home'
import Blog from './pages/Blog'

// Lazy: every page below this line loads only when its route is hit.
// Drops main bundle (Core Web Vitals signal) and keeps the SEO-critical
// home + blog index fast.
const Contact = lazy(() => import('./pages/Contact'))
const Product = lazy(() => import('./pages/Product'))
const Pricing = lazy(() => import('./pages/Pricing'))
const Probe = lazy(() => import('./pages/Probe'))

const SpaceCompliance = lazy(() => import('./pages/SpaceCompliance'))
const NuclearCompliance = lazy(() => import('./pages/NuclearCompliance'))
const Part50vs52vs53 = lazy(() => import('./pages/clusters/Part50vs52vs53'))
const FaaPart450Timeline = lazy(() => import('./pages/clusters/FaaPart450Timeline'))
const HowToWriteAPsar = lazy(() => import('./pages/clusters/HowToWriteAPsar'))
const ItarVsEarForSpace = lazy(() => import('./pages/clusters/ItarVsEarForSpace'))
const NrcPreApplicationEngagement = lazy(() => import('./pages/clusters/NrcPreApplicationEngagement'))
const NuclearComplianceIndia = lazy(() => import('./pages/clusters/NuclearComplianceIndia'))
const Fcc5YearDeorbitRule = lazy(() => import('./pages/clusters/Fcc5YearDeorbitRule'))
const SpaceComplianceIndia = lazy(() => import('./pages/clusters/SpaceComplianceIndia'))
const FaaPart450MeansOfCompliance = lazy(() => import('./pages/clusters/FaaPart450MeansOfCompliance'))
const NoaaRemoteSensingTiers = lazy(() => import('./pages/clusters/NoaaRemoteSensingTiers'))
const AdvancedReactorLicensingEu = lazy(() => import('./pages/clusters/AdvancedReactorLicensingEu'))
const SpaceComplianceEu = lazy(() => import('./pages/clusters/SpaceComplianceEu'))
const HowToDraftItuCoordinationFiling = lazy(() => import('./pages/clusters/HowToDraftItuCoordinationFiling'))
const Part450VsLegacy = lazy(() => import('./pages/clusters/Part450VsLegacy'))
const EcssVsMilStd = lazy(() => import('./pages/clusters/EcssVsMilStd'))
const NrcLicenseTimeline = lazy(() => import('./pages/clusters/NrcLicenseTimeline'))
const NuclearComplianceJapan = lazy(() => import('./pages/clusters/NuclearComplianceJapan'))

const Glossary = lazy(() => import('./pages/Glossary'))
const GlossaryEntryPage = lazy(() => import('./pages/GlossaryEntryPage'))
const Research = lazy(() => import('./pages/Research'))
const Compliance = lazy(() => import('./pages/Compliance'))
const Trust = lazy(() => import('./pages/Trust'))
const About = lazy(() => import('./pages/About'))
const Regulators = lazy(() => import('./pages/Regulators'))
const FaaPart450Calculator = lazy(() => import('./pages/calculators/FaaPart450Calculator'))
const NrcLicenseCalculator = lazy(() => import('./pages/calculators/NrcLicenseCalculator'))
const CalculatorsIndex = lazy(() => import('./pages/calculators/Index'))
const FccDeorbitCalculator = lazy(() => import('./pages/calculators/FccDeorbitCalculator'))
const FaaAc450Series = lazy(() => import('./pages/clusters/FaaAc450Series'))
const Part53Subparts = lazy(() => import('./pages/clusters/Part53Subparts'))
const NrcRaiManagement = lazy(() => import('./pages/clusters/NrcRaiManagement'))
const ItarCommodityJurisdiction = lazy(() => import('./pages/clusters/ItarCommodityJurisdiction'))
const ItaacClosure = lazy(() => import('./pages/clusters/ItaacClosure'))
const FccScheduleS = lazy(() => import('./pages/clusters/FccScheduleS'))
const ItuBringingIntoUse = lazy(() => import('./pages/clusters/ItuBringingIntoUse'))
const FaaVehicleOperatorLicense = lazy(() => import('./pages/clusters/FaaVehicleOperatorLicense'))
const NrcPart73Security = lazy(() => import('./pages/clusters/NrcPart73Security'))
const WhichAgencyLicensesMySatellite = lazy(() => import('./pages/clusters/WhichAgencyLicensesMySatellite'))
const AiForNuclearCompliance = lazy(() => import('./pages/clusters/AiForNuclearCompliance'))
const DoeAdvancedReactorPilotProgram = lazy(() => import('./pages/clusters/DoeAdvancedReactorPilotProgram'))

const Part100vsPart53 = lazy(() => import('./pages/blog/Part100vsPart53'))
const SeismicDesignShift = lazy(() => import('./pages/blog/SeismicDesignShift'))
const FermiBenchSOTA = lazy(() => import('./pages/blog/FermiBenchSOTA'))
const NuclearComplianceTAM = lazy(() => import('./pages/blog/NuclearComplianceTAM'))
const SpaceComplianceTAM = lazy(() => import('./pages/blog/SpaceComplianceTAM'))

const Deck = lazy(() => import('./pages/Deck'))
const DroneDeck = lazy(() => import('./pages/DroneDeck'))
const SpantrikDeck = lazy(() => import('./pages/SpantrikDeck'))
const IntomesDeck = lazy(() => import('./pages/IntomesDeck'))
const CustomerDeck = lazy(() => import('./pages/CustomerDeck'))
const InsuranceDeck = lazy(() => import('./pages/InsuranceDeck'))

function PageFallback() {
  return <div className="min-h-screen bg-paper" />
}

export default function App() {
  return (
    <BrowserRouter basename="/">
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/deck" element={<Deck />} />
          <Route path="/drone-deck" element={<DroneDeck />} />
          <Route path="/spantrik" element={<SpantrikDeck />} />
          <Route path="/intomes" element={<IntomesDeck />} />
          <Route path="/customer-deck" element={<CustomerDeck />} />
          <Route path="/insurance-deck" element={<InsuranceDeck />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/part100-vs-part53-siting" element={<Part100vsPart53 />} />
            <Route path="/blog/seismic-design-shift" element={<SeismicDesignShift />} />
            <Route path="/blog/fermibench-sota" element={<FermiBenchSOTA />} />
            <Route path="/blog/nuclear-compliance-tam" element={<NuclearComplianceTAM />} />
            <Route path="/blog/space-compliance-tam" element={<SpaceComplianceTAM />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/product" element={<Product />} />
            <Route path="/probe" element={<Probe />} />
            <Route path="/space-compliance" element={<SpaceCompliance />} />
            <Route path="/nuclear-compliance" element={<NuclearCompliance />} />
            <Route path="/part-50-vs-52-vs-53" element={<Part50vs52vs53 />} />
            <Route path="/faa-part-450-license-timeline" element={<FaaPart450Timeline />} />
            <Route path="/how-to-write-a-psar" element={<HowToWriteAPsar />} />
            <Route path="/itar-vs-ear-for-space-companies" element={<ItarVsEarForSpace />} />
            <Route path="/nrc-pre-application-engagement-guide" element={<NrcPreApplicationEngagement />} />
            <Route path="/nuclear-compliance-india" element={<NuclearComplianceIndia />} />
            <Route path="/fcc-5-year-deorbit-rule" element={<Fcc5YearDeorbitRule />} />
            <Route path="/space-compliance-india" element={<SpaceComplianceIndia />} />
            <Route path="/how-to-write-faa-part-450-means-of-compliance" element={<FaaPart450MeansOfCompliance />} />
            <Route path="/noaa-remote-sensing-license-tiers" element={<NoaaRemoteSensingTiers />} />
            <Route path="/advanced-reactor-licensing-eu" element={<AdvancedReactorLicensingEu />} />
            <Route path="/space-compliance-eu" element={<SpaceComplianceEu />} />
            <Route path="/how-to-draft-itu-coordination-filing" element={<HowToDraftItuCoordinationFiling />} />
            <Route path="/faa-part-450-vs-legacy" element={<Part450VsLegacy />} />
            <Route path="/ecss-vs-mil-std" element={<EcssVsMilStd />} />
            <Route path="/how-long-does-nrc-license-take" element={<NrcLicenseTimeline />} />
            <Route path="/nuclear-compliance-japan" element={<NuclearComplianceJapan />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/glossary/:slug" element={<GlossaryEntryPage />} />
            <Route path="/research" element={<Research />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/trust" element={<Trust />} />
            <Route path="/about" element={<About />} />
            <Route path="/regulators" element={<Regulators />} />
            <Route path="/calculators/faa-part-450-timeline" element={<FaaPart450Calculator />} />
            <Route path="/calculators/nrc-license-timeline" element={<NrcLicenseCalculator />} />
            <Route path="/calculators" element={<CalculatorsIndex />} />
            <Route path="/calculators/fcc-deorbit-feasibility" element={<FccDeorbitCalculator />} />
            <Route path="/faa-ac-450-series" element={<FaaAc450Series />} />
            <Route path="/part-53-subparts" element={<Part53Subparts />} />
            <Route path="/nrc-rai-management" element={<NrcRaiManagement />} />
            <Route path="/itar-commodity-jurisdiction" element={<ItarCommodityJurisdiction />} />
            <Route path="/itaac-closure" element={<ItaacClosure />} />
            <Route path="/fcc-schedule-s" element={<FccScheduleS />} />
            <Route path="/itu-bringing-into-use" element={<ItuBringingIntoUse />} />
            <Route path="/faa-vehicle-operator-license" element={<FaaVehicleOperatorLicense />} />
            <Route path="/nrc-part-73-security" element={<NrcPart73Security />} />
            <Route path="/which-agency-licenses-my-satellite" element={<WhichAgencyLicensesMySatellite />} />
            <Route path="/ai-for-nuclear-compliance" element={<AiForNuclearCompliance />} />
            <Route path="/doe-advanced-reactor-pilot-program" element={<DoeAdvancedReactorPilotProgram />} />
          </Route>
        </Routes>
      </Suspense>
      <Analytics />
    </BrowserRouter>
  )
}
