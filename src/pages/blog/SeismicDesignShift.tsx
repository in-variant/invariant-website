import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'

type Change = 'same' | 'reframed' | 'relaxed' | 'stricter' | 'new' | 'removed'

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
    id: 'design-earthquake',
    heading: 'Design earthquake framework',
    rows: [
      {
        topic: 'Design earthquake(s)',
        refs: 'App. A §V(a)(1) / §53.480(b)-(c)',
        change: 'reframed',
        changeLabel: 'performance-based',
        part100:
          'Safe Shutdown Earthquake (SSE): a single deterministic maximum event. Identified by correlating historic earthquakes with tectonic structures within 200 miles, then assuming worst-case epicenter at the closest point to the site. Defined by response spectra at foundation level.',
        part53:
          'Design-Basis Ground Motions (DBGMs): plural, risk-tiered. Derived from site-specific GMRS and calibrated to SSC risk significance via Seismic Design Categories (SDCs). The horizontal component of the DBGM must be "an appropriate response spectrum that is determined based on the risk-significance of SSCs and their safety functions" (§53.480(c)(1)(i)).',
        diff: 'Part 100 anchors the design earthquake to a single worst-case historical event: one SSE for the entire plant. Part 53 replaces this with a family of DBGMs scaled to risk. A low-risk SSC gets a lower DBGM; a high-risk SR SSC gets the full GMRS-derived motion. This enables graded seismic design instead of one-size-fits-all.',
      },
      {
        topic: 'Minimum ground acceleration floor',
        refs: 'App. A §V(a)(1)(v) / §53.480',
        change: 'removed',
        changeLabel: 'removed',
        part100:
          'If the deterministic SSE procedure yields a maximum vibratory acceleration less than 0.1g at the foundations, the SSE must be assumed to be at least 0.1g. This floor was established because of limited data on strong ground motion when Appendix A was written in 1973.',
        part53:
          'No minimum acceleration floor. The DBGM is derived from site-specific PSHA results; if the GMRS for a site is genuinely low, the DBGM reflects that. The risk-informed framework relies on the quality of the PSHA rather than a prescriptive floor.',
        diff: 'The 0.1g floor was a pragmatic backstop for a deterministic era with sparse seismological data. Part 53 eliminates it because PSHA, with its formal uncertainty quantification, provides a more defensible basis. For sites in stable continental regions (e.g., much of the eastern U.S.), this could yield design accelerations below 0.1g for lower SDC categories.',
      },
    ],
  },
  {
    id: 'hazard-methodology',
    heading: 'Seismic hazard methodology',
    rows: [
      {
        topic: 'Hazard analysis approach',
        refs: 'App. A §IV(a), §V(a) / §53.510(c)',
        change: 'reframed',
        changeLabel: 'probabilistic',
        part100:
          'Deterministic: trace historic earthquakes to tectonic structures, assume worst epicenter at nearest point to site. Appendix A §V(a)(1)(i)-(iv) prescribes a four-step procedure for correlating earthquakes with structures and provinces. §100.23(d)(1) mentions PSHA as one acceptable uncertainty method but does not require it.',
        part53:
          'Probabilistic Seismic Hazard Analysis (PSHA) explicitly endorsed as the standard approach. §53.510(c): "The site assessment must reflect these uncertainties through an appropriate analysis, such as a probabilistic seismic hazard analysis." GMRS must be characterized by both horizontal and vertical free-field response spectra. RG 1.208 is an acceptable method for developing GMRS.',
        diff: 'Part 100 Appendix A was written before PSHA was mature (1973). It uses a deterministic framework: find the worst historical earthquake on each nearby fault, move it to the closest point to the site, calculate the resulting motion. Part 53 normalizes PSHA (the same approach already used under Appendix S to Part 50 for post-1997 licenses), making probabilistic hazard analysis the standard for advanced reactors. The deterministic four-step procedure is gone.',
      },
      {
        topic: 'Uncertainty treatment',
        refs: 'App. A §V(a)(1)(iv) / §53.510(a),(c)',
        change: 'new',
        changeLabel: 'explicit requirement',
        part100:
          'Appendix A does not formally require uncertainty quantification. The deterministic approach uses conservatism (worst-case epicenter placement, 0.1g floor) as an implicit uncertainty buffer. §100.23(d)(1) mentions "uncertainties are inherent" and suggests PSHA or "suitable sensitivity analyses" but leaves the method open.',
        part53:
          '§53.510(a): external hazard frequencies and magnitudes "must take into account uncertainties and variabilities in data, models, and methods." §53.510(c): "Uncertainties are inherent in the parameters and models used to estimate the GMRS for the site. The site assessment must reflect these uncertainties." This is a mandatory, explicit requirement, not a suggestion.',
        diff: 'Part 53 makes uncertainty quantification a regulatory requirement, not a best practice. The shift from deterministic conservatism to formal uncertainty treatment is fundamental: it means the seismic hazard chapter of a Part 53 application must include epistemic and aleatory uncertainty characterization, logic trees, and sensitivity analyses. This is standard PSHA practice but was never explicitly mandated in Appendix A.',
      },
    ],
  },
  {
    id: 'obe-sse',
    heading: 'SSE/OBE vs. DBGM/OBE',
    rows: [
      {
        topic: 'Operating Basis Earthquake (OBE)',
        refs: 'App. A §III(d), §V(a)(2), §VI(a)(2) / §53.480(c)(2)',
        change: 'stricter',
        changeLabel: 'tighter ratio',
        part100:
          'OBE defined as the earthquake "reasonably expected to affect the plant site during the operating life." OBE must be at least ½ the SSE (i.e., OBE ≥ 0.5 × SSE). All SSCs for continued operation must remain functional within applicable stress and deformation limits. If OBE is exceeded, shutdown required; licensee must demonstrate no functional damage before restart.',
        part53:
          'OBE Ground Motion retained but redefined: must be "set to one-third or less of the DBGMs response spectra" (§53.480(c)(2)). Used as a shutdown trigger in §53.720. The OBE is characterized by response spectra, same as Part 100.',
        diff: 'The ratio changes direction. Part 100 sets OBE ≥ ½ SSE (OBE is at least half the design basis). Part 53 sets OBE ≤ ⅓ DBGM (OBE is at most one-third of the design basis). The Part 53 OBE is proportionally lower relative to the design basis, meaning the gap between operating-level and design-basis ground motion is larger. This means fewer spurious shutdowns from moderate earthquakes, but the plant must still shut down and evaluate if the OBE is exceeded.',
      },
      {
        topic: 'Two-tier vs. multi-tier seismic design',
        refs: 'App. A §VI(a)(1)-(2) / §53.480(a),(c)',
        change: 'reframed',
        changeLabel: 'multi-tier SDC',
        part100:
          'Binary two-tier structure: SSE (design basis for safety-related SSCs) and OBE (design basis for continued operation). Every safety-related SSC is designed to the same SSE demand. The OBE is a single plant-wide operating-level earthquake. No gradation within either tier.',
        part53:
          'Multi-tier framework. SSCs classified by risk significance (SR, NSRSS, non-safety-significant) under §53.460, then assigned to Seismic Design Categories. Each SDC gets a different DBGM derived from the site GMRS. ASCE/SEI 43-19 SDC-1 through SDC-5 is an acceptable graded framework (preamble). The OBE is retained as a single operational trigger.',
        diff: 'This is the architectural heart of the seismic framework change. Under Part 100, a safety-related SSC is designed to the full SSE. A fire damper in a safety-related building gets the same seismic demand as the reactor pressure boundary. Under Part 53, the DBGM is calibrated to the SSC\'s risk significance. SDC-5 (highest) aligns with the traditional SSE/Appendix S approach; SDC-1 through SDC-4 allow progressively lower design demands for less risk-significant SSCs. This enables substantially more efficient design while maintaining safety margins where they matter.',
      },
      {
        topic: 'SSE design scope',
        refs: 'App. A §VI(a)(1) / §53.480(c)(1)(ii)',
        change: 'reframed',
        changeLabel: 'risk-graded',
        part100:
          'SSE design applies to SSCs "necessary to assure (i) the integrity of the reactor coolant pressure boundary, (ii) the capability to shut down the reactor and maintain it in a safe shutdown condition, or (iii) the capability to prevent or mitigate the consequences of accidents which could result in potential offsite exposures comparable to the guideline exposures." All such SSCs get the full SSE.',
        part53:
          '§53.480(c)(1)(ii): the plant must be designed so that if the DBGMs occur, SSCs "for which functional design criteria are established in accordance with §53.410 or §53.420" and SSCs "classified as SR or NSRSS commensurate with safety significance" remain functional. The DBGM level varies by SSC classification.',
        diff: 'Part 100 uses a functional definition (reactor coolant boundary, shutdown capability, accident mitigation) that maps to a single seismic demand. Part 53 uses a classification-based approach (SR, NSRSS) with graded seismic demands. The practical effect: NSRSS SSCs in Part 53 may be designed to a lower DBGM than SR SSCs, whereas under Part 100 there was no such distinction. If it was safety-related, it got the full SSE.',
      },
    ],
  },
  {
    id: 'fault-investigation',
    heading: 'Fault investigation & capable fault criteria',
    rows: [
      {
        topic: 'Capable fault definition',
        refs: 'App. A §III(g) / §53.510(d)',
        change: 'removed',
        changeLabel: 'removed',
        part100:
          'Prescriptive "capable fault" definition with three criteria: (1) movement at or near ground surface within past 35,000 years OR recurring movement within 500,000 years; (2) macro-seismicity instrumentally determined with records demonstrating direct relationship to the fault; (3) structural relationship to a capable fault such that movement on one could reasonably be expected to accompany movement on the other.',
        part53:
          'No "capable fault" definition. §53.510(d) requires evaluation of "the potential for surface tectonic and nontectonic deformations" as a geologic siting factor. The applicant defines the investigation scope based on site characteristics. No fixed recency thresholds.',
        diff: 'The capable fault criteria in Appendix A are among the most specific requirements in Part 100: 35,000-year and 500,000-year recency windows with precise triggers. Part 53 replaces all of this with a principles-based requirement to evaluate whether surface deformation is possible. The elimination of the capable fault definition is a significant departure. It gives applicants flexibility but creates RAI exposure if the NRC staff disagrees with the investigation scope.',
      },
      {
        topic: 'Fault distance/length thresholds (Table 1)',
        refs: 'App. A §IV(a)(7) Table 1 / §53.510(c)',
        change: 'removed',
        changeLabel: 'removed',
        part100:
          'Prescriptive Table 1: minimum fault length to investigate by distance band. 0-20 miles: ≥1-mile faults. 20-50 miles: ≥5-mile faults. 50-100 miles: ≥10-mile faults. 100-150 miles: ≥20-mile faults. 150-200 miles: ≥40-mile faults. Also: 1,000-ft fault length threshold within 5 miles for surface faulting investigation.',
        part53:
          'No distance-band tables. §53.510(c): "The size of the region to be investigated and the type of data pertinent to the investigations must be determined based on the nature of the region surrounding the site." Investigation scope is applicant-defined with NRC review.',
        diff: 'Table 1 has driven thousands of geologic investigations by specifying exactly which faults need evaluation at each distance band. Its removal does not mean smaller investigations are acceptable. It means the applicant must justify the scope based on regional geology. In seismically active areas, the NRC may effectively require an investigation that equals or exceeds Table 1 scope. The justification burden shifts to the applicant.',
      },
      {
        topic: 'Zone requiring detailed faulting investigation (Table 2)',
        refs: 'App. A §V(b)(1) Table 2 / §53.510(d)',
        change: 'removed',
        changeLabel: 'removed',
        part100:
          'Table 2: zone width = 1-4× control width based on earthquake magnitude. M<5.5: 1× control width. M 5.5-6.4: 2×. M 6.5-7.5: 3×. M>7.5: 4×. Minimum zone width ½ mile. Reactor may not be located within the zone without detailed investigation demonstrating surface faulting need not be considered in design.',
        part53:
          'No zone requiring detailed faulting investigation concept. Surface deformation potential evaluated through §53.480(d): "The potential for surface deformation must be taken into account in the design of the commercial nuclear plant by providing reasonable assurance that in the event of deformation, SSCs classified as SR or NSRSS... will remain functional."',
        diff: 'The zone requiring detailed faulting investigation (and Figure 1 of Appendix A) is a procedural safety net that has historically prevented reactors from being sited near capable faults without detailed study. Its removal does not mean fault proximity is ignored. The same concern is addressed through design (§53.480(d)) rather than a standalone siting gate. For applications near active fault zones, expect the NRC to require equivalent demonstration.',
      },
    ],
  },
  {
    id: 'ssc-classification',
    heading: 'SSC classification for seismic design',
    rows: [
      {
        topic: 'Seismic Design Categories (SDCs)',
        refs: 'App. A §VI(a) / §53.460, §53.480',
        change: 'new',
        changeLabel: 'new framework',
        part100:
          'Single-tier: all safety-related SSCs must withstand the SSE. No risk-graduated tiers within the seismic design requirement. Binary classification: an SSC is either safety-related (gets the SSE) or it is not.',
        part53:
          'Multi-tier SDC framework aligned with ASCE/SEI 43-19 (SDC-1 through SDC-5). Higher-risk SSCs get higher DBGMs. The preamble states: "The NRC is developing a graded approach for seismic design by grouping SSCs into different seismic design categories based on their risk significance." SDC-5 corresponds to the traditional Appendix S approach (i.e., equivalent to the old SSE for the most safety-significant SSCs).',
        diff: 'Under Part 100, every safety-related SSC gets the same seismic demand. Under Part 53, SSCs are first classified by risk significance (SR vs NSRSS, and tier within each), then the DBGM is calibrated to that tier. A fire damper in a low-risk building doesn\'t get designed to the same seismic demand as the reactor pressure boundary. SDC-5 preserves the traditional conservatism for the most critical SSCs; SDC-1 through SDC-4 enable proportionally reduced demands.',
      },
      {
        topic: 'NSRSS SSCs in seismic design',
        refs: 'App. A §VI(a)(1) / §53.480(a),(c)(1)(ii)',
        change: 'new',
        changeLabel: 'new in Part 53',
        part100:
          'Appendix A addresses only safety-related SSCs for seismic design. Non-safety-related SSCs have no explicit seismic design requirement in Part 100, even if they are safety-significant. The concept of "non-safety-related but safety-significant" does not exist in the Part 100 framework.',
        part53:
          '§53.480(a): "Structures, systems, and components classified as SR or NSRSS must be able to withstand the effects of earthquakes, commensurate with the safety significance of the SSC." NSRSS SSCs are explicitly included in the seismic design scope, at a demand level proportional to their safety significance.',
        diff: 'Part 53 creates a new category of SSCs that must be seismically designed but at a lower demand than SR SSCs. This fills a gap in Part 100 where an SSC could be important to risk but not formally safety-related, and therefore had no regulatory seismic design requirement. The "commensurate with safety significance" language is the key enabler for graded seismic design.',
      },
    ],
  },
  {
    id: 'instrumentation',
    heading: 'Seismic instrumentation & other requirements',
    rows: [
      {
        topic: 'Required seismic instrumentation',
        refs: 'App. A §VI(a)(3) / §53.480(c)(4)',
        change: 'same',
        changeLabel: 'substantially retained',
        part100:
          'Required: "Suitable instrumentation shall be provided so that the seismic response of nuclear power plant features important to safety can be determined promptly to permit comparison of such response with that used as the design basis." Explicit note that automatic shutdown instrumentation was "under consideration."',
        part53:
          '§53.480(c)(4): "Suitable instrumentation must be provided so that the seismic response of commercial nuclear plant SR SSCs or NSRSS SSCs can be evaluated promptly after an earthquake." Language is performance-based; specific types not prescribed. Shutdown trigger addressed in §53.720.',
        diff: 'The instrumentation requirement is one of the few areas of genuine continuity. Both regulations require prompt post-earthquake evaluation of SSC response. The main difference: Part 53 includes NSRSS SSCs in the instrumentation requirement (not just safety-related), reflecting the broader SSC classification framework. The old note about automatic shutdown instrumentation being "under consideration" is gone. §53.720 now handles the operational seismic shutdown trigger directly.',
      },
      {
        topic: 'Surface deformation design provisions',
        refs: 'App. A §VI(b)(3) / §53.480(d)',
        change: 'reframed',
        changeLabel: 'performance-based',
        part100:
          'App. A §VI(b)(3): design basis for surface faulting must be taken into account to ensure safety-related SSCs "will remain functional." Design provisions must assume surface faulting "can occur in any direction and azimuth and under any part of the nuclear power plant unless evidence indicates this assumption is not appropriate."',
        part53:
          '§53.480(d)(1)-(3): surface deformation must be taken into account to ensure SR and NSRSS SSCs "will remain functional." Design provisions must be based on "postulated occurrence in any direction and azimuth and under any part of the commercial nuclear plant, unless evidence indicates this assumption is not appropriate." Must take into account estimated rate of deformation.',
        diff: 'Nearly identical substantive requirement. The main differences: Part 53 extends the scope to NSRSS SSCs (not just safety-related), and uses "surface deformation" rather than "surface faulting," a broader term that includes non-tectonic deformation. The directional assumption (any direction, any azimuth, under any part of the plant) is preserved verbatim.',
      },
      {
        topic: 'Soil stability, liquefaction, slope stability',
        refs: 'App. A §V(d) / §53.510(d)',
        change: 'relaxed',
        changeLabel: 'principles-based',
        part100:
          'Detailed prescriptive list: fissuring, differential consolidation, liquefaction, cratering, subsidence, uplift, collapse, deformational zones (shears, joints, fractures, folds), alteration zones, residual stresses in bedrock, mineralogically unstable soils, slope stability (natural and artificial), cooling water supply, distant safety-related structures.',
        part53:
          '§53.510(d): "soil and rock stability, liquefaction potential, and natural and artificial slope stability" explicitly listed. Volcanic activity and seismically induced flooding added. Framed as factors "included, but not limited to"; applicant must evaluate all relevant hazards.',
        diff: 'Same hazards, different framing. Part 100 Appendix A enumerates specific failure modes with sub-bullets. Part 53 uses a non-exhaustive list. For most sites this will not change the investigation scope, but the open-ended language means applicants in unusual geologic settings cannot rely on the checklist as a ceiling. Conversely, applicants at benign sites are not forced through irrelevant checklist items.',
      },
      {
        topic: 'Seismically induced floods and water waves',
        refs: 'App. A §IV(c), §V(c) / §53.480(e), §53.510(d)',
        change: 'same',
        changeLabel: 'substantially same',
        part100:
          'App. A §IV(c): detailed investigation of tsunami history, coastal topography, offshore fault characteristics for coastal sites. §V(c): size of seismically induced floods and water waves must be determined considering local topographic characteristics and adverse tide conditions.',
        part53:
          '§53.480(e): "Seismically induced floods and water waves from either locally or distantly generated seismic activity and other design conditions determined pursuant to subpart D of this part must be taken into account in the design." §53.510(d) lists "size and character of seismically induced floods and water waves" as a geologic siting factor.',
        diff: 'Same scope, no prescribed method. Both regulations require seismically-induced flood characterization. Part 100 Appendix A prescribes how (coastal vs. inland investigations, tsunami runup methods). Part 53 states the outcome required; the analytical method is the applicant\'s choice.',
      },
    ],
  },
  {
    id: 'analysis-integration',
    heading: 'Analysis integration & design linkage',
    rows: [
      {
        topic: 'Seismic PRA integration',
        refs: 'App. A §VI(a)(1) / §53.480(f)',
        change: 'new',
        changeLabel: 'new in Part 53',
        part100:
          'No requirement for probabilistic risk assessment of seismic events. The deterministic SSE/OBE framework is self-contained: if the SSC withstands the SSE, it is adequate. Seismic margins analysis or seismic PRA was used in practice (post-Fukushima NTTF) but not required by Appendix A.',
        part53:
          '§53.480(f): "The analyses required by §53.450 must address seismic hazards and related SSC responses in determining that the safety criteria defined in §53.220 will be met." This explicitly requires seismic events to be included in the PRA/SRE framework of §53.450, including fragility modeling and risk quantification.',
        diff: 'Part 53 formally integrates seismic risk into the licensing basis. The preamble states that SSC responses to seismic hazards "could be addressed in the analyses using a fragility model (conditional probability of its failure at a given hazard input level), a high confidence of low probability of failure value, or other method." This means seismic PRA or equivalent is not optional. It is a regulatory requirement for demonstrating compliance with §53.220.',
      },
      {
        topic: 'Engineering method for seismic qualification',
        refs: 'App. A §VI(a)(1) / §53.480(c)(1)(v)-(vi)',
        change: 'same',
        changeLabel: 'substantially same',
        part100:
          'App. A §VI(a)(1): "The engineering method used to insure that the required safety functions are maintained... shall involve the use of either a suitable dynamic analysis or a suitable qualification test... except where it can be demonstrated that the use of an equivalent static load method provides adequate conservatism." Soil-structure interaction and duration must be considered. Inelastic behavior permitted if safety functions maintained.',
        part53:
          '§53.480(c)(1)(v): SSCs must be "demonstrated through design, testing, or qualification methods" to fulfill safety functions during and after DBGMs. §53.480(c)(1)(vi): evaluation "should consider, if applicable, soil-structure interaction effects and the expected duration of vibratory motion. It is permissible to design for inelastic behavior... provided the necessary safety functions are maintained."',
        diff: 'The engineering methods are substantively the same: dynamic analysis, testing, or qualification; soil-structure interaction; inelastic behavior permitted. Part 53 uses slightly broader language ("design, testing, or qualification methods") but the practical requirements are equivalent. The key difference is that Part 53 applies these methods to graded DBGMs rather than a single SSE.',
      },
    ],
  },
]

const ALL_CHANGES: Change[] = ['same', 'reframed', 'relaxed', 'stricter', 'new', 'removed']

const CHANGE_META: Record<Change, { label: string; dot: string; activeBg: string; activeText: string }> = {
  same: { label: 'Substantially same', dot: 'bg-emerald-500', activeBg: 'bg-emerald-100', activeText: 'text-emerald-800' },
  reframed: { label: 'Reframed / performance-based', dot: 'bg-violet-500', activeBg: 'bg-violet-100', activeText: 'text-violet-800' },
  relaxed: { label: 'More flexible in Part 53', dot: 'bg-amber-500', activeBg: 'bg-amber-100', activeText: 'text-amber-800' },
  stricter: { label: 'Stricter / more explicit', dot: 'bg-red-500', activeBg: 'bg-red-100', activeText: 'text-red-800' },
  new: { label: 'New in Part 53', dot: 'bg-blue-500', activeBg: 'bg-blue-100', activeText: 'text-blue-800' },
  removed: { label: 'Removed from Part 53', dot: 'bg-gray-500', activeBg: 'bg-gray-100', activeText: 'text-gray-800' },
}

const BADGE_STYLES: Record<Change, { bg: string; text: string }> = {
  same: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  reframed: { bg: 'bg-violet-100', text: 'text-violet-800' },
  relaxed: { bg: 'bg-amber-100', text: 'text-amber-800' },
  stricter: { bg: 'bg-red-100', text: 'text-red-800' },
  new: { bg: 'bg-blue-100', text: 'text-blue-800' },
  removed: { bg: 'bg-gray-100', text: 'text-gray-800' },
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
            Part 100 Appendix A
          </p>
          <p className="font-sans text-sm text-ink/70 leading-relaxed">
            {row.part100}
          </p>
        </div>
        <div className="bg-ink/[0.02] border border-ink/[0.06] rounded-md p-4">
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/40 mb-2">
            Part 53 §53.480 / §53.510
          </p>
          {row.part53 ? (
            <p className="font-sans text-sm text-ink/70 leading-relaxed">
              {row.part53}
            </p>
          ) : (
            <p className="font-sans text-sm text-ink/40 italic leading-relaxed">
              No equivalent provision in Part 53.
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

export default function SeismicDesignShift() {
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
          <p className="font-mono text-sm text-ink/40 mb-4">March 29, 2026</p>
          <h1 className="heading-editorial text-3xl md:text-4xl lg:text-5xl mb-6">
            SSE/OBE → GMRS/SDC
          </h1>
          <p className="font-serif text-xl md:text-2xl text-ink/60 leading-relaxed tracking-[-0.01em] max-w-3xl mx-auto">
            The seismic design shift from Part 100 Appendix A to Part 53 §53.480
          </p>
        </header>

        {/* Introduction */}
        <div className="max-w-3xl mx-auto mb-16 space-y-6">
          <div className="section-rule" />
          <div className="space-y-4">
            <p className="font-sans text-base text-ink/75 leading-relaxed">
              For fifty years, every commercial nuclear power plant in the United States has been
              seismically designed around two numbers: the Safe Shutdown Earthquake (SSE) and the
              Operating Basis Earthquake (OBE). Appendix A to 10 CFR Part 100, finalized in 1973,
              established a deterministic framework where the SSE is derived from the worst historical
              earthquake on the nearest tectonic structure, and every safety-related SSC in the plant
              is designed to that single demand. The OBE, set at no less than half the SSE, defines
              the threshold for continued operation.
            </p>
            <p className="font-sans text-base text-ink/75 leading-relaxed">
              With the finalization of 10 CFR Part 53 on March 25, 2026, that framework is replaced.
              Section 53.480 introduces Design-Basis Ground Motions (DBGMs), plural and risk-tiered,
              derived from a site-specific Ground Motion Response Spectra (GMRS) through Probabilistic
              Seismic Hazard Analysis (PSHA). SSCs are assigned to Seismic Design Categories (SDCs)
              based on their risk significance, and each SDC gets a different DBGM. The deterministic
              SSE is gone. The prescriptive capable fault criteria are gone. Table 1 and Table 2 of
              Appendix A are gone.
            </p>
            <p className="font-sans text-base text-ink/75 leading-relaxed">
              This is not a cosmetic rewrite. It is a fundamental change in how seismic design is
              organized for nuclear facilities. The comparison below works from the actual regulatory
              text (Appendix A to Part 100, current as of 3/24/2026, and Part 53 §53.480 and §53.510,
              final rule published 3/30/2026) to map every substantive change.
            </p>
          </div>

          <div className="space-y-4 pl-4 border-l-2 border-ink/10">
            <p className="font-sans text-base text-ink/75 leading-relaxed">
              <strong className="text-ink">Deterministic → Probabilistic.</strong> Part 100
              Appendix A's four-step deterministic procedure for deriving the SSE (correlate
              historic earthquakes with tectonic structures, move worst-case epicenter to
              nearest point, calculate resulting motion) is replaced by PSHA as the standard
              method. The 0.1g minimum acceleration floor, a 1973-era backstop for sparse
              seismological data, has no Part 53 equivalent.
            </p>
            <p className="font-sans text-base text-ink/75 leading-relaxed">
              <strong className="text-ink">Single-tier → Multi-tier.</strong> Under Appendix A,
              every safety-related SSC gets the same SSE demand. Under Part 53, SSCs are
              classified by risk significance (SR, NSRSS) and assigned to Seismic Design
              Categories (SDC-1 through SDC-5, aligned with ASCE/SEI 43-19). A fire damper
              in a low-risk building no longer gets the same seismic demand as the reactor
              pressure boundary.
            </p>
            <p className="font-sans text-base text-ink/75 leading-relaxed">
              <strong className="text-ink">OBE ratio inverted.</strong> Part 100 sets OBE ≥ ½ SSE.
              Part 53 sets OBE ≤ ⅓ DBGM. The gap between operating-level and design-basis
              ground motion is larger under Part 53, reducing spurious shutdown triggers from
              moderate earthquakes while maintaining the shutdown evaluation requirement.
            </p>
            <p className="font-sans text-base text-ink/75 leading-relaxed">
              <strong className="text-ink">Prescriptive criteria erased.</strong> The capable fault
              definition (35,000/500,000-year recency), Table 1 (fault length by distance band),
              Table 2 (zone width by magnitude), and the 200-mile investigation radius are all
              gone. Part 53 requires the hazard to be characterized; the method and scope are
              applicant-defined.
            </p>
            <p className="font-sans text-base text-ink/75 leading-relaxed">
              <strong className="text-ink">Seismic PRA mandatory.</strong> §53.480(f) requires
              seismic hazards to be addressed in the §53.450 PRA/SRE framework. Fragility
              modeling and risk quantification for seismic events are no longer optional; they
              are a regulatory requirement for demonstrating compliance with §53.220.
            </p>
          </div>
        </div>

        {/* Regulation header bar */}
        <div className="bg-ink/[0.03] border border-ink/[0.08] rounded-md px-5 py-3 mb-8 text-center">
          <p className="font-mono text-xs text-ink/60 leading-relaxed">
            <strong className="text-ink font-medium">10 CFR Part 100 Appendix A</strong>{' '}
            (Seismic and Geologic Siting Criteria, current as of 3/24/2026)
            <br />
            vs.{' '}
            <strong className="text-ink font-medium">
              10 CFR Part 53 §53.480 &amp; §53.510
            </strong>{' '}
            (Earthquake Engineering &amp; External Hazards, final rule 3/25/2026)
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

        {/* What this means in practice */}
        <div className="mt-20 max-w-3xl mx-auto space-y-8">
          <div className="section-rule" />
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-ink tracking-[-0.01em]">
            What this means in practice
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-ink/50 mb-3">
                For applicants writing a seismic chapter
              </h3>
              <p className="font-sans text-base text-ink/75 leading-relaxed">
                A Part 53 seismic chapter looks fundamentally different from a Part 100/Appendix A-based
                chapter. The deterministic SSE narrative ("we identified the worst historical earthquake
                on each tectonic structure within 200 miles and moved it to the closest point") is replaced
                by a PSHA-based GMRS derivation with formal uncertainty quantification. The capable fault
                criteria disappear in favor of applicant-defined investigation scope. The single SSE design
                demand is replaced by tiered DBGMs calibrated to SDC. And the seismic PRA, which was a
                post-Fukushima add-on under Part 50, becomes a first-class regulatory requirement.
              </p>
            </div>

            <div>
              <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-ink/50 mb-3">
                For structural engineers
              </h3>
              <p className="font-sans text-base text-ink/75 leading-relaxed">
                The multi-tier SDC framework means different seismic demands for different SSCs within
                the same plant. SDC-5 (the highest category, aligned with ASCE/SEI 43-19) corresponds
                to the traditional Appendix S approach and will look familiar. SDC-1 through SDC-4 allow
                progressively lower design demands. This requires a more nuanced SSC classification
                process up front but enables substantial design efficiency, particularly for balance-of-plant
                structures that are safety-significant but not safety-related.
              </p>
            </div>

            <div>
              <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-ink/50 mb-3">
                For site characterization teams
              </h3>
              <p className="font-sans text-base text-ink/75 leading-relaxed">
                The removal of Table 1, Table 2, the 200-mile investigation radius, and the capable fault
                definition does not mean less work. It means the applicant must justify the investigation
                scope rather than following a prescriptive checklist. For sites in seismically active regions
                or areas with complex geology, the NRC will likely require investigations that equal or
                exceed the old Appendix A scope. The difference is the burden of justification: under
                Appendix A, the regulation told you what to do; under Part 53, you tell the NRC what you
                did and why it was sufficient.
              </p>
            </div>

            <div>
              <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-ink/50 mb-3">
                The OBE ratio question
              </h3>
              <p className="font-sans text-base text-ink/75 leading-relaxed">
                The shift from OBE ≥ ½ SSE to OBE ≤ ⅓ DBGM is often misread. Under Part 100, the OBE
                had to be at least half the SSE; it set a floor. Under Part 53, the OBE must be at most
                one-third of the DBGM; it sets a ceiling. The practical effect: the OBE is proportionally
                lower relative to the design basis, which means the gap between "keep operating" and
                "design basis" is larger. This reduces the frequency of shutdown triggers from moderate
                seismic events while maintaining the requirement to shut down and evaluate if the OBE
                is exceeded (§53.720).
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-10 border-t border-ink/10">
          <div className="max-w-3xl mx-auto space-y-4">
            <p className="font-mono text-xs text-ink/35 text-center">
              AI-assisted analysis. May contain errors; verify against original regulatory text.
            </p>
            <p className="font-sans text-sm text-ink/50 leading-relaxed text-center">
              Prepared from 10 CFR Part 100 Appendix A (current as of March 24, 2026) and Part 53
              §53.480 and §53.510 (final rule published March 30, 2026, effective April 29, 2026).
              Preamble discussion at 91 FR pp. 45-48. Not legal advice.
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
