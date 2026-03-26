import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'

type Change = 'same' | 'reframed' | 'relaxed' | 'stricter' | 'new'

interface Row {
  topic: string
  refs: string
  change: Change
  changeLabel: string
  part100: string
  part53: string
  diff: string
}

interface Section {
  id: string
  heading: string
  rows: Row[]
}

const SECTIONS: Section[] = [
  {
    id: 'purpose',
    heading: 'Purpose & applicability',
    rows: [
      {
        topic: 'Purpose & scope',
        refs: '§100.1-100.2 vs §53.500',
        change: 'reframed',
        changeLabel: 'reframed',
        part100:
          'Establish approval requirements for sites for stationary power and testing reactors under Parts 50/52. Reactor design, construction and operation are "primary factors" for public health and safety.',
        part53:
          'Ensure siting assessments demonstrate design satisfies safety criteria in §§53.210/220. Siting must address what site environs do to the plant (external hazards) AND what the plant does to nearby populations (LBE consequences).',
        diff: 'Bidirectional framing. Part 100 is primarily site to plant. Part 53 explicitly requires both directions: site to plant (hazard characterization) and plant to site (consequence assessment). Siting and safety analysis are formally integrated.',
      },
    ],
  },
  {
    id: 'exclusion',
    heading: 'Exclusion area & population zones',
    rows: [
      {
        topic: 'Exclusion area requirement',
        refs: '§100.3, §100.21(a) vs §53.530, §53.020',
        change: 'same',
        changeLabel: 'same',
        part100:
          'Every site must have an exclusion area. Defined in §100.3: licensee has authority to determine all activities; residence normally prohibited; ready removal required.',
        part53:
          'Every site must have an exclusion area (§53.530). Defined in §53.020 with the same substantive criteria as §100.3.',
        diff: 'Requirement carried over. The exclusion area obligation is preserved verbatim. The practical flexibility lies in how its boundary is determined (see dose-based sizing row below).',
      },
      {
        topic: 'Exclusion area sizing basis',
        refs: '§100.11(a)(1) vs §53.530(a)(1)',
        change: 'reframed',
        changeLabel: 'reframed',
        part100:
          'Exclusion area sized so individual at boundary for 2 hours post-release does not exceed 25 rem whole body OR 300 rem thyroid. Based on assumed core melt + containment leak rate + site meteorology (TID-14844 method).',
        part53:
          '§53.530(a)(1): same 25 rem TEDE limit at exclusion area boundary. But dose is derived from §53.450(f) LBE analyses, i.e., the plant\'s actual design-specific DBA consequence calculation, not a standardized source term assumption.',
        diff: 'Site-specific vs. generic source term. Part 100 uses a conservative, standardized fission product release assumption. Part 53 uses the applicant\'s own LBE analysis. For passively safe SMRs with low source terms, this can dramatically shrink the required exclusion area, potentially to the site fence.',
      },
      {
        topic: 'Low population zone (LPZ)',
        refs: '§100.3, §100.11(a)(2) vs §53.530(a)(2)',
        change: 'same',
        changeLabel: 'same',
        part100:
          'LPZ sized so individual at outer boundary during entire cloud passage does not exceed 25 rem whole body or 300 rem thyroid. Definition: population total/density such that protective measures are reasonably possible.',
        part53:
          '§53.530(a)(2): same 25 rem TEDE limit at LPZ outer boundary, derived from §53.450(f) LBE analyses. LPZ defined in §53.020 with equivalent language to §100.3.',
        diff: 'Same limit, same logic. The LPZ dose criterion is identical. The difference again is how dose is calculated: LBE-specific in Part 53 vs. generic source term in Part 100.',
      },
      {
        topic: 'Population center distance',
        refs: '§100.3, §100.21(b) vs §53.530(b)',
        change: 'relaxed',
        changeLabel: 'more flexible',
        part100:
          'Population center distance must be at least 1.33x the distance to the LPZ outer boundary. Hard rule. Political boundaries not controlling. Greater distance may be needed for very large cities.',
        part53:
          '§53.530(b): same 1.33x rule as option (b)(1), OR site found acceptable via "assessments of societal risks in comparison to societal benefits" as option (b)(2). Either path is valid.',
        diff: 'Alternative pathway added. Part 100 has no societal risk/benefit alternative; 1.33x is mandatory. Part 53 adds an explicit waiver path. This is significant for SMRs proposed at industrial or urban sites.',
      },
      {
        topic: 'Dense population siting preference',
        refs: '§100.21(h) vs §53.530(c)',
        change: 'relaxed',
        changeLabel: 'more flexible',
        part100:
          '§100.21(h): sites should be away from very densely populated centers. Low population density preferred. Higher density acceptable if safety, environmental, economic, or other factors justify it. No population threshold stated in text; ~25,000 used in practice.',
        part53:
          '§53.530(c): same preference language, same factors for justifying denser siting. Adds explicit recognition that sites near or within centers with more than ~25,000 residents are assessable via societal risk/benefit analysis. Cites RG 4.7 Rev. 4 for guidance.',
        diff: '~25,000 threshold made explicit. Part 100 implies the 25,000-resident threshold but doesn\'t state it. Part 53 writes it into the regulation and explicitly provides a pathway for sites exceeding it. Grounded in SRM-SECY-20-0045.',
      },
    ],
  },
  {
    id: 'non-seismic',
    heading: 'Non-seismic site characteristics',
    rows: [
      {
        topic: 'Atmospheric dispersion',
        refs: '§100.21(c) vs §53.520, §53.450',
        change: 'reframed',
        changeLabel: 'reframed',
        part100:
          'Atmospheric dispersion characteristics must be evaluated; dispersion parameters established so (1) effluent release limits can be met for offsite individuals and (2) accident dose criteria of §50.34(a)(1) are met.',
        part53:
          '§53.520: meteorological site characteristics (including dispersion) must be "identified, assessed, and considered in the design and analyses required by subpart C." §53.450(f) requires offsite radiological consequence analysis for all LBEs, which incorporates dispersion.',
        diff: 'Absorbed into LBE analysis. Part 100 treats atmospheric dispersion as a standalone siting criterion with its own parameters. Part 53 folds it into the LBE consequence framework; dispersion is an input to §53.450, not a separate deliverable.',
      },
      {
        topic: 'Man-made / industrial hazards',
        refs: '§100.20(b), §100.21(e) vs §53.510(a)',
        change: 'reframed',
        changeLabel: 'reframed',
        part100:
          '§100.21(e): transportation routes, industrial and military facilities must be evaluated; site characteristics established such that hazards from such facilities pose "no undue risk." §100.20(b): airports, dams, military/chemical facilities must be evaluated.',
        part53:
          '§53.510(a): design-basis external hazard levels for "natural and constructed hazards with potential to adversely affect plant functions" must be identified from site-specific assessments. Man-made hazards are "constructed hazards," with no separate section or prescribed checklist.',
        diff: 'No checklist. Part 100 §100.20(b) explicitly lists airports, dams, transportation routes, military, chemical facilities. Part 53 uses "constructed hazards" as a catch-all; the applicant defines what\'s relevant. More flexible but places completeness burden on applicant.',
      },
      {
        topic: 'Physical site characteristics (met, geo, hydro)',
        refs: '§100.21(d) vs §53.520',
        change: 'reframed',
        changeLabel: 'reframed',
        part100:
          '§100.21(d): meteorology, geology, seismology, hydrology must be evaluated; site characteristics established so physical characteristics pose "no undue risk." §100.21(c)(2)/(c)(3): meteorological and hydrological parameters specifically identified.',
        part53:
          '§53.520: site characteristics that "might contribute to initiation, progression, or consequences of LBEs" must be identified, assessed, and considered in subpart C design and analyses. No enumerated list of topics; the applicant identifies what is relevant.',
        diff: 'LBE-linked vs. topic-listed. Part 100 names the topics (meteorology, geology, seismology, hydrology). Part 53 links the obligation to LBE relevance: if a characteristic could affect an LBE, it must be addressed. Scope is potentially broader but the trigger is functional, not categorical.',
      },
      {
        topic: 'Security & emergency planning',
        refs: '§100.21(f), §100.21(g) vs §53.540',
        change: 'same',
        changeLabel: 'same',
        part100:
          '§100.21(f): site characteristics must allow adequate security plans. §100.21(g): physical characteristics posing significant impediment to emergency plans must be identified.',
        part53:
          '§53.540: site characteristics must be such that "adequate emergency plans and security plans can be developed and maintained." Single combined requirement.',
        diff: 'Consolidated but substantively equivalent. Two separate Part 100 provisions merged into one Part 53 sentence. Same obligation: security and emergency planning feasibility must be demonstrated from site characteristics.',
      },
    ],
  },
  {
    id: 'seismic',
    heading: 'Seismic & geologic siting',
    rows: [
      {
        topic: 'Seismic hazard methodology',
        refs: '§100.23(d)(1), App. A §V(a) vs §53.510(c)',
        change: 'reframed',
        changeLabel: 'reframed',
        part100:
          '§100.23(d)(1): Safe Shutdown Earthquake Ground Motion (SSHEGM) determined considering investigation results; uncertainties addressed "through appropriate analysis, such as a probabilistic seismic hazard analysis or suitable sensitivity analyses." Appendix A §V(a): deterministic SSE procedure, worst historical earthquake at closest point to site, minimum 0.1g floor.',
        part53:
          '§53.510(c): Ground Motion Response Spectra (GMRS) determined from PSHA; uncertainties in data, models, and methods must be explicitly accounted for. RG 1.208 is acceptable for GMRS. ASCE/SEI 43-19 can be proposed application-by-application for SDC assignment.',
        diff: 'PSHA mandatory in Part 53; optional in Part 100. Part 100 Appendix A is fundamentally deterministic (SSE/OBE); PSHA is listed as one acceptable uncertainty method. Part 53 is built around PSHA as the primary method, with risk-informed seismic design categories (SDC-1 through SDC-5) tied to SSC risk significance. The 0.1g SSE floor in Appendix A has no direct equivalent in Part 53.',
      },
      {
        topic: 'Operating Basis Earthquake (OBE)',
        refs: 'App. A §III(d), §V(a)(2) vs Part 53',
        change: 'relaxed',
        changeLabel: 'removed in Part 53',
        part100:
          'Appendix A §III(d): OBE defined as earthquake reasonably expected during plant life; all SSCs for continued operation designed to remain functional. OBE must be at least half the SSE. If OBE exceeded, shutdown required until Commission verifies no functional damage.',
        part53: '',
        diff: 'Two-level seismic design eliminated. The SSE/OBE framework is an LWR-era construct. Part 53\'s SDC approach allows a graded, risk-informed assignment of seismic design requirements per SSC rather than a uniform two-tier plant-wide basis. This is a fundamental architectural change in how seismic design is organized.',
      },
      {
        topic: 'Geological investigations scope',
        refs: '§100.23(c), App. A §IV vs §53.510(c)(d)',
        change: 'reframed',
        changeLabel: 'reframed',
        part100:
          '§100.23(c): investigation scope and detail must be sufficient; region size determined by nature of surrounding region. Appendix A §IV: detailed prescribed steps including lithologic/stratigraphic conditions, tectonic structures, earthquake catalog, fault geometry, subsurface material properties, 200-mile survey region, fault length/distance table.',
        part53:
          '§53.510(c): GMRS determination requires investigations of geological, seismological, and engineering characteristics; data on vibratory ground motion, earthquake recurrence, fault geometry, slip rates, subsurface properties. Region size "based on nature of the region surrounding the site." No prescribed distance thresholds or fault length table.',
        diff: 'Prescriptive steps removed. Appendix A\'s 200-mile survey region, Table 1 minimum fault lengths by distance, and 8-step investigation checklist are all gone. Part 53 states what data must be collected but not how far out or by what specific procedure. This is flexibility for non-traditional sites but could create RAI risk if the scope is seen as insufficient by NRC staff.',
      },
      {
        topic: 'Capable fault criteria & surface faulting',
        refs: 'App. A §III(g), §IV(b), §V(b) vs §53.510(d)',
        change: 'reframed',
        changeLabel: 'reframed',
        part100:
          'Appendix A: "capable fault" defined by 35,000-year / 500,000-year movement criteria. Faults >1,000 ft within 5 miles investigated for surface faulting; zone requiring detailed faulting investigation determined by Table 2 (magnitude x control width). Reactor may not be sited within zone without detailed investigation.',
        part53:
          '§53.510(d): "potential for surface tectonic and nontectonic deformations" must be addressed as a geologic siting factor. No capable fault definition, no 1,000-ft threshold, no 5-mile radius, no mandatory Table 2 zone calculation.',
        diff: 'All specific thresholds removed. The capable fault definition (35,000/500,000 yr), the 1,000-ft fault length, the 5-mile radius, and the zone width table are Part 100 Appendix A constructs with no Part 53 equivalent. Part 53 requires the hazard to be characterized; the method and scope are applicant-defined.',
      },
      {
        topic: 'Seismically induced floods & water waves',
        refs: '§100.23(d)(3), App. A §IV(c), §V(c) vs §53.510(d)',
        change: 'reframed',
        changeLabel: 'reframed',
        part100:
          '§100.23(d)(3): size of seismically induced floods and water waves from local or distant seismic activity must be determined. App. A §IV(c): detailed investigation of tsunami history, coastal topography, offshore fault characteristics for coastal sites; lake/river sites treated separately.',
        part53:
          '§53.510(d): "size and character of seismically induced floods and water waves that could affect a site from either locally or distantly generated seismic activity" explicitly listed as a geologic/seismic siting factor. Same substantive scope, no prescribed investigation methodology.',
        diff: 'Same scope, no prescribed method. Both regulations require seismically-induced flood characterization. Part 100 Appendix A prescribes how (coastal vs. inland investigations, tsunami runup methods). Part 53 states the outcome required; the analytical method is applicant\'s choice.',
      },
      {
        topic: 'Soil stability, liquefaction, slope stability',
        refs: 'App. A §V(d)(1)(2) vs §53.510(d)',
        change: 'same',
        changeLabel: 'same',
        part100:
          'Appendix A §V(d): evaluate subsidence, uplift, collapse, deformational zones, altered weathering zones, residual stresses, liquefaction, thixotropy, differential consolidation, slope stability under SSE conditions.',
        part53:
          '§53.510(d): "soil and rock stability, liquefaction potential, and natural and artificial slope stability" explicitly listed as geologic/seismic siting factors to be addressed.',
        diff: 'Substantively the same topics. Part 53 consolidates Appendix A\'s detailed list into a single sentence. The hazards to characterize are identical: liquefaction, slope stability, soil/rock stability.',
      },
    ],
  },
  {
    id: 'integration',
    heading: 'Integration with design',
    rows: [
      {
        topic: 'Link between siting and design',
        refs: '§100.10(d), §100.20 vs §53.540',
        change: 'new',
        changeLabel: 'new in Part 53',
        part100:
          '§100.10(d): unfavorable site characteristics may be acceptable if compensating engineering safeguards are included. §100.20: population density/distribution, man-made hazards, and physical characteristics evaluated to determine individual and societal risk. No formal link to design basis.',
        part53:
          '§53.540: site characteristics must be addressed by "design features, programmatic controls, and supporting analyses" used to demonstrate §§53.210/220 criteria are met. Explicit closure requirement: siting outputs must feed into and be satisfied by the safety case.',
        diff: 'Formal integration mandate. Part 100 allows compensating engineering safeguards as a workaround for bad sites. Part 53 requires that design features and programmatic controls affirmatively close out every site characteristic against the LBE safety criteria. The siting analysis is not complete until the design case is complete; they are the same document conceptually.',
      },
      {
        topic: 'Quality assurance for siting activities',
        refs: '§100.23(c) [implied] vs §53.500(b)',
        change: 'new',
        changeLabel: 'explicit in Part 53',
        part100:
          'Part 100 does not explicitly address QA requirements for siting investigations. QA obligations for site characterization activities flow from Part 50 Appendix B, applied by cross-reference.',
        part53:
          '§53.500(b): activities performed to identify site characteristics must satisfy the special treatment requirements of §53.460, including, where applicable, Appendix B to Part 50 QA requirements.',
        diff: 'QA obligation written into siting subpart. Part 53 explicitly calls out that siting investigations are subject to §53.460 special treatment, including Appendix B QA where applicable. Part 100 leaves this implicit. This has direct implications for what documentation of siting investigations must look like.',
      },
    ],
  },
]

const ALL_CHANGES: Change[] = ['same', 'reframed', 'relaxed', 'stricter', 'new']

const CHANGE_META: Record<Change, { label: string; dot: string; activeBg: string; activeText: string }> = {
  same: { label: 'Substantially same', dot: 'bg-emerald-500', activeBg: 'bg-emerald-100', activeText: 'text-emerald-800' },
  reframed: { label: 'Reframed / performance-based', dot: 'bg-violet-500', activeBg: 'bg-violet-100', activeText: 'text-violet-800' },
  relaxed: { label: 'More flexible in Part 53', dot: 'bg-amber-500', activeBg: 'bg-amber-100', activeText: 'text-amber-800' },
  stricter: { label: 'Stricter / more explicit', dot: 'bg-red-500', activeBg: 'bg-red-100', activeText: 'text-red-800' },
  new: { label: 'New in Part 53', dot: 'bg-blue-500', activeBg: 'bg-blue-100', activeText: 'text-blue-800' },
}

const BADGE_STYLES: Record<Change, { bg: string; text: string }> = {
  same: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  reframed: { bg: 'bg-violet-100', text: 'text-violet-800' },
  relaxed: { bg: 'bg-amber-100', text: 'text-amber-800' },
  stricter: { bg: 'bg-red-100', text: 'text-red-800' },
  new: { bg: 'bg-blue-100', text: 'text-blue-800' },
}

const TOTAL_ITEMS = SECTIONS.reduce((sum, s) => sum + s.rows.length, 0)

function Badge({ change, label }: { change: Change; label: string }) {
  const s = BADGE_STYLES[change]
  return (
    <span className={`inline-block font-mono text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${s.bg} ${s.text}`}>
      {label}
    </span>
  )
}

function ComparisonCard({ row }: { row: Row }) {
  return (
    <div className="blog-comparison-card">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h4 className="font-serif text-lg font-medium text-ink tracking-[-0.01em]">
            {row.topic}
          </h4>
          <p className="font-mono text-[11px] text-ink/40 mt-1 leading-relaxed">
            {row.refs}
          </p>
        </div>
        <Badge change={row.change} label={row.changeLabel} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-ink/[0.02] border border-ink/[0.06] rounded-md p-4">
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/40 mb-2">
            Part 100
          </p>
          <p className="font-sans text-sm text-ink/70 leading-relaxed">
            {row.part100}
          </p>
        </div>
        <div className="bg-ink/[0.02] border border-ink/[0.06] rounded-md p-4">
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/40 mb-2">
            Part 53 Subpart D
          </p>
          {row.part53 ? (
            <p className="font-sans text-sm text-ink/70 leading-relaxed">
              {row.part53}
            </p>
          ) : (
            <p className="font-sans text-sm text-ink/40 italic leading-relaxed">
              No OBE equivalent in Part 53. Risk-informed seismic design
              categories (SDCs) replace the SSE/OBE two-tier structure.
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-ink/[0.06] pt-3">
        <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/40 mb-1.5">
          Key difference
        </p>
        <p className="font-sans text-sm text-ink/80 leading-relaxed">
          {row.diff}
        </p>
      </div>
    </div>
  )
}

function useScrollSpy(sectionIds: string[]) {
  const [activeId, setActiveId] = useState(sectionIds[0])

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sectionIds])

  return activeId
}

export default function Part100vsPart53() {
  const [activeFilters, setActiveFilters] = useState<Set<Change>>(
    () => new Set(ALL_CHANGES)
  )

  const sectionIds = useMemo(() => SECTIONS.map((s) => s.id), [])
  const activeSection = useScrollSpy(sectionIds)

  const toggleFilter = useCallback((change: Change) => {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      if (next.has(change)) {
        if (next.size === 1) return prev
        next.delete(change)
      } else {
        next.add(change)
      }
      return next
    })
  }, [])

  const allActive = activeFilters.size === ALL_CHANGES.length

  const resetFilters = useCallback(() => {
    setActiveFilters(new Set(ALL_CHANGES))
  }, [])

  const filteredSections = useMemo(() => {
    return SECTIONS.map((section) => ({
      ...section,
      visibleRows: section.rows.filter((r) => activeFilters.has(r.change)),
    }))
  }, [activeFilters])

  const visibleCount = filteredSections.reduce(
    (sum, s) => sum + s.visibleRows.length,
    0
  )

  const visibleSectionCount = filteredSections.filter(
    (s) => s.visibleRows.length > 0
  ).length

  const sectionVisibleCounts = useMemo(() => {
    const map: Record<string, number> = {}
    filteredSections.forEach((s) => {
      map[s.id] = s.visibleRows.length
    })
    return map
  }, [filteredSections])

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  return (
    <article className="min-h-screen py-24 px-6 md:px-12 lg:px-24 xl:px-32">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-10">
          <Link
            to="/blog"
            className="font-mono text-sm text-ink/40 hover:text-ink/70 transition-colors"
          >
            &larr; Back to Blog
          </Link>
        </div>

        {/* Header */}
        <header className="mb-16 text-center">
          <p className="font-mono text-sm text-ink/40 mb-4">March 26, 2026</p>
          <h1 className="heading-editorial text-3xl md:text-4xl lg:text-5xl mb-6">
            10 CFR Part 100 vs. Part 53 Subpart D
          </h1>
          <p className="font-serif text-xl md:text-2xl text-ink/60 leading-relaxed tracking-[-0.01em] max-w-3xl mx-auto">
            A regulation-to-regulation comparison of nuclear siting criteria
          </p>
        </header>

        {/* Introduction */}
        <div className="max-w-3xl mx-auto mb-16 space-y-6">
          <div className="section-rule" />
          <div className="space-y-4">
            <p className="font-sans text-base text-ink/75 leading-relaxed">
              With the finalization of 10 CFR Part 53 on March 25, 2026, the NRC
              has established a technology-inclusive licensing framework for
              advanced reactors. Subpart D of Part 53 replaces the siting criteria
              that have governed reactor site evaluation under Part 100 for
              decades.
            </p>
            <p className="font-sans text-base text-ink/75 leading-relaxed">
              This comparison works from the actual regulatory text: <strong className="text-ink">Part 100</strong> (current
              as of 3/24/2026, covering §§100.20, 100.21, 100.23, and Appendix A)
              and <strong className="text-ink">Part 53 Subpart D</strong> (§§53.500-53.540, extracted from
              ML26084A489). Three findings stand out:
            </p>
          </div>

          <div className="space-y-4 pl-4 border-l-2 border-ink/10">
            <p className="font-sans text-base text-ink/75 leading-relaxed">
              <strong className="text-ink">Exclusion area sizing basis.</strong> Both
              regulations require the same 25 rem TEDE limit, but Part 100 uses a
              standardized, conservative fission product source term (TID-14844),
              while Part 53 uses the applicant's own LBE analysis. For an SMR with
              passive safety features and a small source term, this single
              difference could mean the exclusion area shrinks from kilometers to
              the site fence line.
            </p>
            <p className="font-sans text-base text-ink/75 leading-relaxed">
              <strong className="text-ink">OBE removal.</strong> The SSE/OBE two-tier
              structure that every LWR is designed around simply doesn't exist in
              Part 53. It's replaced by seismic design categories tied to SSC risk
              significance. The seismic chapter of a Part 53 application looks
              fundamentally different from a Part 50 PSAR.
            </p>
            <p className="font-sans text-base text-ink/75 leading-relaxed">
              <strong className="text-ink">Capable fault criteria erasure.</strong> The
              35,000-year recency criterion, 1,000-ft fault length, 5-mile radius,
              Table 2 zone width calculation: all gone. The applicant now defines
              the investigation scope, which is flexible but creates real RAI
              exposure if NRC staff disagrees with the scope chosen.
            </p>
          </div>
        </div>

        {/* Regulation header bar */}
        <div className="bg-ink/[0.03] border border-ink/[0.08] rounded-md px-5 py-3 mb-8 text-center">
          <p className="font-mono text-xs text-ink/60 leading-relaxed">
            <strong className="text-ink font-medium">10 CFR Part 100</strong>{' '}
            (§§100.20, 100.21, 100.23, Appendix A, current as of 3/24/2026)
            <br />
            vs.{' '}
            <strong className="text-ink font-medium">
              10 CFR Part 53 Subpart D
            </strong>{' '}
            (§§53.500-53.540, final rule 3/25/2026)
          </p>
        </div>

        {/* Filter chips */}
        <div className="mb-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {ALL_CHANGES.map((change) => {
              const meta = CHANGE_META[change]
              const isActive = activeFilters.has(change)
              return (
                <button
                  key={change}
                  onClick={() => toggleFilter(change)}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs
                    transition-all duration-150 cursor-pointer border
                    ${isActive
                      ? `${meta.activeBg} ${meta.activeText} border-transparent`
                      : 'bg-transparent text-ink/30 border-ink/10 hover:border-ink/20'
                    }
                  `}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? meta.dot : 'bg-ink/20'}`} />
                  {meta.label}
                </button>
              )
            })}
            {!allActive && (
              <button
                onClick={resetFilters}
                className="font-mono text-xs text-ink/40 hover:text-ink/70 transition-colors underline underline-offset-2 ml-2 cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <p className="font-mono text-xs text-ink/40 text-center mb-10">
          Showing {visibleCount} of {TOTAL_ITEMS} items across {visibleSectionCount} section{visibleSectionCount !== 1 ? 's' : ''}
        </p>

        {/* Mobile section nav */}
        <div className="lg:hidden mb-8 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max px-1 pb-2">
            {SECTIONS.map((section) => {
              const count = sectionVisibleCounts[section.id]
              const isActive = activeSection === section.id
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`
                    flex items-center gap-1.5 px-3 py-2 rounded-md font-mono text-xs whitespace-nowrap
                    transition-all duration-150 cursor-pointer border
                    ${count === 0
                      ? 'text-ink/20 border-ink/5'
                      : isActive
                        ? 'text-ink border-ink/20 bg-ink/[0.04]'
                        : 'text-ink/50 border-ink/10 hover:border-ink/20'
                    }
                  `}
                >
                  {section.heading}
                  <span className={`text-[10px] ${count === 0 ? 'text-ink/15' : isActive ? 'text-ink/60' : 'text-ink/30'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Main content: sidebar + cards */}
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-10">
          {/* Sidebar TOC - desktop only */}
          <nav className="hidden lg:block">
            <div className="sticky top-[80px]">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/40 mb-3">
                Sections
              </p>
              <div className="flex flex-col gap-1">
                {SECTIONS.map((section) => {
                  const count = sectionVisibleCounts[section.id]
                  const isActive = activeSection === section.id
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`
                        text-left px-3 py-2 rounded-md font-sans text-sm leading-snug
                        transition-all duration-150 cursor-pointer flex items-center justify-between gap-2
                        ${count === 0
                          ? 'text-ink/20'
                          : isActive
                            ? 'text-ink font-medium bg-ink/[0.04]'
                            : 'text-ink/50 hover:text-ink/70 hover:bg-ink/[0.02]'
                        }
                      `}
                    >
                      <span>{section.heading}</span>
                      <span
                        className={`
                          font-mono text-[10px] min-w-[18px] text-center rounded-full px-1.5 py-0.5
                          ${count === 0
                            ? 'text-ink/15'
                            : isActive
                              ? 'text-ink/60 bg-ink/[0.06]'
                              : 'text-ink/30'
                          }
                        `}
                      >
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </nav>

          {/* Comparison cards */}
          <div className="space-y-12 min-w-0">
            {filteredSections.map((section) => {
              if (section.visibleRows.length === 0) return null
              return (
                <div
                  key={section.id}
                  id={section.id}
                  ref={(el) => { sectionRefs.current[section.id] = el }}
                  style={{ scrollMarginTop: '80px' }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-px flex-1 bg-ink/10" />
                    <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-ink/50 whitespace-nowrap">
                      {section.heading}
                    </h3>
                    <div className="h-px flex-1 bg-ink/10" />
                  </div>
                  <div className="space-y-6">
                    {section.visibleRows.map((row) => (
                      <ComparisonCard key={row.topic} row={row} />
                    ))}
                  </div>
                </div>
              )
            })}

            {visibleCount === 0 && (
              <div className="text-center py-20">
                <p className="font-mono text-sm text-ink/40 mb-3">
                  No items match the current filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="font-mono text-sm text-ink/60 hover:text-ink transition-colors underline underline-offset-2 cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-10 border-t border-ink/10">
          <div className="max-w-3xl mx-auto space-y-4">
            <p className="font-mono text-xs text-ink/35 text-center">
              AI-assisted analysis. May contain errors; verify against original regulatory text.
            </p>
            <p className="font-sans text-sm text-ink/50 leading-relaxed text-center">
              This analysis was prepared using the actual text of 10 CFR Part 100
              (current as of March 24, 2026) and 10 CFR Part 53 Subpart D
              (§§53.500-53.540) as published in the final rule (ADAMS Accession No.
              ML26084A489, effective March 25, 2026). It is intended as a technical
              reference for licensing professionals and does not constitute legal
              advice.
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
