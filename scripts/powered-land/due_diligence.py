"""Generate the data center site due diligence cluster: the two-step offer (feasibility screen, then
utility-grade power study), the pillar that explains both, and the guides that answer the questions
buyers search for (flood, seismic, wetlands, FAA, distance to transmission, N-1, power flow, study cost).

Run: python3 due_diligence.py ../../src/data/industry-articles/site-due-diligence.json

House rules: no em or en dashes, no client names or locations, every number carries a source or is our own
method. Our power figures are screening figures. Confirm capacity and delivery through the utility's
written service terms and milestones. Never describe our study as the utility's own case.
"""
import json, sys
from pathlib import Path

DATE = '2026-11-20'
PILLAR = 'data-center-site-due-diligence'
SCREEN = 'data-center-site-feasibility-study'
STUDY = 'utility-grade-power-study'

S = {
    'fema-zones': ('Flood zones', 'https://www.fema.gov/glossary/flood-zones', 'FEMA'),
    'fema-nfhl': ('National Flood Hazard Layer', 'https://www.fema.gov/flood-maps/national-flood-hazard-layer', 'FEMA'),
    'fema-msc': ('Flood Map Service Center', 'https://msc.fema.gov/portal/home', 'FEMA'),
    'noaa-slr': ('Sea Level Rise Viewer', 'https://coast.noaa.gov/slr/', 'NOAA Office for Coastal Management'),
    'usgs-nshm': ('National Seismic Hazard Model', 'https://www.usgs.gov/programs/earthquake-hazards/science/national-seismic-hazard-model', 'USGS'),
    'usgs-2023': ('New USGS map shows where damaging earthquakes are most likely to occur in US', 'https://www.usgs.gov/news/national-news-release/new-usgs-map-shows-where-damaging-earthquakes-are-most-likely-occur-us', 'USGS'),
    'usgs-faults': ('Quaternary faults', 'https://www.usgs.gov/programs/earthquake-hazards/faults', 'USGS'),
    'asce-tool': ('ASCE Hazard Tool', 'https://ascehazardtool.org/', 'American Society of Civil Engineers'),
    'nwi': ('National Wetlands Inventory: Wetlands Mapper', 'https://www.fws.gov/program/national-wetlands-inventory/wetlands-mapper', 'U.S. Fish and Wildlife Service'),
    'ipac': ('IPaC: Information for Planning and Consultation', 'https://ipac.ecosphere.fws.gov/', 'U.S. Fish and Wildlife Service'),
    'faa-nct': ('Notice Criteria Tool', 'https://oeaaa.faa.gov/oeaaa/external/gisTools/gisAction.jsp', 'FAA Obstruction Evaluation / Airport Airspace Analysis'),
    'part77': ('14 CFR Part 77: Safe, efficient use, and preservation of the navigable airspace', 'https://www.ecfr.gov/current/title-14/chapter-I/subchapter-E/part-77', 'Electronic Code of Federal Regulations'),
    'astm': ('ASTM E1527-21: Standard practice for environmental site assessments, Phase I', 'https://www.astm.org/e1527-21.html', 'ASTM International'),
    'epa-aai': ('Brownfields All Appropriate Inquiries', 'https://www.epa.gov/brownfields/brownfields-all-appropriate-inquiries', 'US EPA'),
    'epa-cimc': ('Cleanups in My Community', 'https://www.epa.gov/cleanups/cleanups-my-community', 'US EPA'),
    'soil': ('Web Soil Survey', 'https://websoilsurvey.nrcs.usda.gov/', 'USDA Natural Resources Conservation Service'),
    'tpl001': ('TPL-001-5.1: Transmission system planning performance requirements', 'https://www.nerc.com/pa/Stand/Reliability%20Standards/TPL-001-5.1.pdf', 'NERC'),
    'nerc-alert': ('Level 2 alert: large loads', 'https://www.nerc.com/pa/rrm/bpsa/Alerts%20DL/NERC%20Alert%20Level%202%20%20Large%20Loads.pdf', 'NERC'),
    'miso-cost': ('Transmission cost estimation guide for MTEP24', 'https://cdn.misoenergy.org/20240501%20PSC%20Item%2004%20MISO%20Transmission%20Cost%20Estimation%20Guide%20for%20MTEP24632680.pdf', 'MISO'),
    'ercot-lli': ('Large load integration', 'https://www.ercot.com/services/rq/large-load-integration', 'ERCOT'),
    'ercot-grit': ('Large load modeling', 'https://www.ercot.com/about/grit/large-load-modeling', 'ERCOT'),
    'pjm-cases': ('Power flow cases', 'https://www.pjm.com/planning/rtep-development/powerflow-cases', 'PJM'),
    'ceii': ('18 CFR 388.113: Critical energy and electric infrastructure information', 'https://www.law.cornell.edu/cfr/text/18/388.113', 'Legal Information Institute, Cornell Law School'),
    'hosting': ('U.S. atlas of electric distribution system hosting capacity maps', 'https://www.energy.gov/eere/us-atlas-electric-distribution-system-hosting-capacity-maps', 'U.S. Department of Energy'),
    'eia861': ('Annual electric power industry report (EIA-861)', 'https://www.eia.gov/electricity/data/eia861/', 'U.S. Energy Information Administration'),
    'eia-860m': ('Preliminary monthly electric generator inventory (EIA-860M)', 'https://www.eia.gov/electricity/data/eia860m/', 'U.S. Energy Information Administration'),
    'ankura': ('Brownfield to data center: technical due diligence to de-risk 300 MW of capacity', 'https://ankura.com/insights/case-study-brownfield-to-data-center-technical-due-diligence-to-de-risk-300-mw-of-capacity/', 'Ankura'),
    'batch0': ('ERCOT approves new Batch Zero process for large load interconnections', 'https://www.willkie.com/publications/2026/06/ercot-approves-implementing-new-batch-zero-process-for-large-load-interconnections', 'Willkie Farr & Gallagher'),
    'psse': ('PSS/E transmission planning software', 'https://www.siemens.com/global/en/products/energy/grid-software/planning/pss-software/pss-e.html', 'Siemens'),
    'paces': ('Grid planning for data centers and transmission investment', 'https://www.paces.com/white-papers/grid-planning-data-centers-transmission-investment', 'Paces'),
    'aep-dct': ('Data center tariff', 'https://www.aepohio.com/company/about/rates/data-center-tariff', 'AEP Ohio'),
    'dominion': ('Data center requests', 'https://www.dominionenergy.com/virginia/large-business-services/data-center-requests', 'Dominion Energy'),
    'ud-texas': ('Texas PUC adopts data center interconnection rules', 'https://www.utilitydive.com/news/texas-puc-adopts-data-center-interconnection-rules/830899/', 'Utility Dive'),
    'lbnl': ('Electricity rate designs for large loads (August 2026)', 'https://eta-publications.lbl.gov/sites/default/files/2026-08/rate_designs_large_loads_2026.08.10.pdf', 'Lawrence Berkeley National Laboratory and The Brattle Group'),
    'dcwatch': ('Data Center Watch Q1 2026 report', 'https://datacenterwatch.org/q1-2026', 'Data Center Watch'),
    'sb6': ('Senate Bill 6, 89th Legislature', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00006F.htm', 'Texas Legislature Online'),
    'pjm-fcst': ("PJM's updated 20-year forecast continues to see significant long-term load growth", 'https://insidelines.pjm.com/pjms-updated-20-year-forecast-continues-to-see-significant-long-term-load-growth/', 'PJM Inside Lines'),
}

# ------------------------------------------------------------------ cluster navigation
CLUSTER = [
    (PILLAR, 'Site due diligence: the two-step process'),
    (SCREEN, 'Step 1: site feasibility screen'),
    (STUDY, 'Step 2: utility-grade power study'),
    ('data-center-power-flow-study', 'What a power flow study is'),
    ('n-1-contingency-analysis-data-center', 'N-1 contingency analysis'),
    ('data-center-substation-capacity-check', 'How to check substation capacity'),
    ('utility-load-study-cost-and-timeline', 'Utility load study cost and timeline'),
    ('distance-to-transmission-line-data-center', 'Distance to substation and transmission'),
    ('data-center-flood-zone-screening', 'Flood zone screening'),
    ('data-center-seismic-risk-screening', 'Seismic risk screening'),
    ('data-center-environmental-site-screening', 'Wetlands, species and Phase I ESA'),
    ('faa-height-limits-data-center-site', 'FAA height limits near airports'),
    ('data-center-power-due-diligence-investors', 'Power due diligence for investors and lenders'),
    ('power-study-before-selling-land-to-data-center', 'For landowners: a power study before you sell'),
]
MORE = [
    ('power-evidence-data-center-site-verification', 'Five rungs of power evidence'),
    ('utility-will-serve-letter-load-study-esa', 'Will-serve letter vs load study vs ESA'),
    ('data-center-moratorium-local-opposition-site-screening', 'Moratorium screening'),
    ('data-center-site-selection-checklist', 'Site selection checklist'),
    ('texas-data-center-large-load-interconnection-2026', 'Texas: SB 6 and Batch Zero'),
    ('find-data-center-site-us', 'Find a data center site in the US'),
    ('data-center-site-selection-services', 'Site selection services'),
    ('ai-compute-capacity-for-neoclouds', 'Capacity for neoclouds and AI labs'),
    ('provider-power-check-for-ai-tenants', 'Power check for AI tenants'),
]

def links(exclude):
    return [
        {'type': 'links', 'label': 'Site due diligence guides', 'items': [{'label': l, 'slug': s} for s, l in CLUSTER if s != exclude]},
        {'type': 'links', 'label': 'More on site selection', 'items': [{'label': l, 'slug': s} for s, l in MORE]},
    ]

def P(text, *src):
    b = {'type': 'paragraph', 'text': text}
    if src: b['sourceIds'] = list(src)
    return b

def L(items, *src):
    b = {'type': 'list', 'items': items}
    if src: b['sourceIds'] = list(src)
    return b

def T(cols, rows, *src):
    b = {'type': 'table', 'columns': cols, 'rows': rows}
    if src: b['sourceIds'] = list(src)
    return b

def sec(heading, *blocks, id=None):
    sid = id or ''.join(c if c.isalnum() else '-' for c in heading.lower()).strip('-')
    while '--' in sid: sid = sid.replace('--', '-')
    return {'id': sid[:60].strip('-'), 'heading': heading, 'blocks': list(blocks)}

def faq(q, a, *src):
    f = {'question': q, 'answer': a}
    if src: f['sourceIds'] = list(src)
    return f

SCREEN_ROWS = [
    ['Power', 'Serving utility and ISO, nearest substations and lines with voltage and distance, a screening MW range at each for the next three study years, the constraint that sets it'],
    ['Flood', 'FEMA flood zone on the pad and the access road, base flood elevation where mapped, coastal surge and sea level exposure'],
    ['Seismic and ground', 'USGS ground motion, ASCE 7 site values, mapped faults, soils and slope'],
    ['Environment', 'Wetlands, listed species, contamination records nearby, and whether a Phase I ESA is the next step'],
    ['Airspace', 'Airports and heliports nearby and whether FAA notice is likely for the buildings, stacks or cranes'],
    ['Land and local', 'Parcel, owner and acreage, zoning, data center moratoriums and county sentiment'],
    ['Utilities', 'Water and wastewater, fiber routes, gas for on-site generation'],
    ['Verdict', 'Go, no-go or go with conditions, with the kill reason or the one question that decides it'],
]

STUDY_ROWS = [
    ['Network model', 'The transmission system around the site rebuilt for each study year, checked against flows the ISO publishes'],
    ['Cases', 'Summer peak, winter peak and light load, near-term and later study years, with competing loads in and out'],
    ['Load injection', 'Your MW, ramp and power factor at each candidate point of interconnection, including new switching stations on nearby lines'],
    ['Contingencies', 'AC power flow at N-0 and N-1 for every element in the study area (NERC TPL-001 P1), plus selected breaker and common-tower events'],
    ['Limits', 'Thermal limits against normal and emergency ratings, voltage limits, the element that binds first and at what MW'],
    ['Grid strength', 'Short circuit level and short circuit ratio at the point of interconnection, with a flag where dynamic studies are likely'],
    ['Upgrades', 'The fix for each violation and the MW it unlocks: reconductoring, a second transformer, a new bay, a new line'],
    ['Cost and date', 'Indicative cost ranges from unit costs and a dated energization range from the utility process and lead times'],
    ['Utility path', 'Tariff, study fees, security, minimum bills and the questions to bring to the pre-application meeting'],
]

def page(slug, title, desc, intro, take, sections, faqs, related, read=9, service=None, howto=None):
    used = set()
    for s in sections:
        for b in s['blocks']: used.update(b.get('sourceIds', []))
    for f in faqs: used.update(f.get('sourceIds', []))
    p = {'slug': slug, 'topic': 'Data Centers', 'kind': 'study-guide', 'region': 'United States', 'title': title,
         'description': desc, 'date': DATE, 'readMinutes': read, 'intro': intro, 'takeaways': take,
         'sections': sections + [sec('More due diligence guides', *links(slug), id='browse')],
         'faqs': faqs,
         'sources': [{'id': k, 'title': S[k][0], 'url': S[k][1], 'publisher': S[k][2]} for k in S if k in used],
         'relatedSlugs': related}
    if service: p['service'] = service
    if howto: p['howTo'] = howto
    return p

PAGES = []

# ================================================================== pillar
PAGES.append(page(PILLAR,
 'Data center site due diligence: feasibility screen first, then a utility-grade power study',
 'How data center site due diligence works in two steps: a feasibility screen (power, flood, seismic, wetlands, FAA, zoning) and a utility-grade power study with N-1 tests.',
 'Data center site due diligence answers two questions in order. Is this site worth more money and time? And how much power can it get, by when, and at what cost? Invariant splits the work the same way. Step one is a feasibility screen: from a coordinate and a MW figure we check power at the nearest substations, flood zone, seismic hazard, wetlands, airports, zoning and the parcel, and end in a go or no-go. Step two is a utility-grade power study for the sites that pass: an AC power flow with N-1 contingency tests at each connection option, the upgrades that lift the limit, an indicative cost and an energization date.',
 ['Screen many sites cheaply, then study the few that survive. Most sites fail on something you can check in a day.',
  'Distance to a line is not capacity. Paces found only about 17% of ERCOT substations near suitable land had any withdrawal headroom.',
  'A utility load study costs $10,000 to $100,000 or more and needs site control. Run your own study first so you file at the right point with the right MW.',
  'Our MW figures are screening figures built to utility planning methods. The utility’s own study is what makes a number firm.'],
 [sec('The two steps and what each one decides',
    P('Most site deals die for boring reasons: a floodway across the pad, a county moratorium, a substation that is already spoken for. None of those need a power flow to find. So the first pass is wide and fast, and the expensive work only goes to sites that have earned it.'),
    T(['', 'Step 1: feasibility screen', 'Step 2: utility-grade power study'], [
      ['Question', 'Should we keep going on this site?', 'How many MW, at which point, by when, for how much?'],
      ['Input', 'Coordinate or parcel, target MW, energize-by date', 'The same, plus phasing, power factor and any utility letters you hold'],
      ['Power work', 'Nearest substations and lines, screening MW range by year, binding constraint', 'Full AC power flow, N-0 and N-1 contingencies, short circuit, upgrade search'],
      ['Site work', 'Flood, seismic, wetlands, species, FAA, zoning, moratoriums, parcel, water, fiber', 'Zoning and permitting path, environmental and flood, airspace, county sentiment, ownership file'],
      ['Output', 'Go, no-go or conditional go, with the reason', 'A report you can take into an LOI: MW by connection point and year, upgrades, cost range, date range, utility path'],
      ['Turnaround', 'Within 24 hours', 'Usually within 48 hours'],
    ]),
    P('Who buys this? Developers deciding which options to exercise, investors and lenders underwriting powered land, AI companies and neoclouds choosing between shortlisted sites, landowners who want to know what their land is worth to a data center, and brokers and advisers who want the work done behind their own name.')),
  sec('Step 1: the feasibility screen',
    P('The screen is a set of kill checks run in a fixed order, cheapest first. The power check comes first because it kills the most sites. A site 20 miles from any 138 kV or higher station rarely makes sense above a few MW, whatever else it has going for it.'),
    T(['Check', 'What we look at'], SCREEN_ROWS),
    P('Every finding carries its source. Where we cannot settle something from records, the report says so and names the document or call that would settle it.')),
  sec('Step 2: the utility-grade power study',
    P('A utility decides how much load a site can take by running a power flow on its planning model and testing what happens when a line or transformer trips. We run the same kind of study, on a model of the network we rebuild around your site, before you spend a study deposit or post security.', 'tpl001'),
    T(['Part', 'What it covers'], STUDY_ROWS),
    P('The answer comes out as a MW figure per connection point per study year, the line or transformer that sets each figure, and what it would take to lift it. That is the information you need to pick a point of interconnection, size a first phase and judge a seller’s claims.')),
  sec('Why proximity to a line misleads',
    P('The most common mistake in powered land is reading a transmission map as a capacity map. A 345 kV line beside the parcel tells you a tap is physically possible. It says nothing about whether the line, the next substation or the transformers upstream can carry another 200 MW when one element is out of service.'),
    P('In a 2025 analysis of ERCOT, Paces found only about 17% of substations near suitable land had any withdrawal headroom.', 'paces'),
    P('We see the same pattern in our own studies. In one recent Gulf Coast study, the two nearest 138 kV substations could take only a few MW in the first study year, while a new 345 kV switching station on circuits running past the site could take about 200 MW. Same parcel. Very different answer depending on where you connect.')),
  sec('Where our study sits next to the utility’s',
    P('Utilities run their own studies once you apply with site control, and those are the only studies that commit them. AEP Ohio charges $10,000 to $100,000 for a data center study depending on size. Texas set a $100,000 study fee for large loads in ERCOT.', 'aep-dct', 'ud-texas'),
    P('Our study does not replace that step. It makes it count: you file at the connection point most likely to work, at a MW figure the network can carry, with a list of questions that gets real answers in the pre-application meeting. Every report states that its figures are screening figures and that the utility’s study makes them firm.'),
    P('Equity investors buy this kind of diligence too. Ankura’s case study of a 300 MW brownfield for an institutional investor covered 230 kV line and substation feasibility, ISO timing, zoning, gas supply, cooling water and a risk matrix.', 'ankura')),
 ],
 [faq('What is data center site due diligence?', 'It is the work that tells a buyer whether a site can be built on and powered, by when and at what cost. It covers power and interconnection, flood, seismic and ground conditions, wetlands and species, airspace, zoning and local approval, water, fiber and the parcel. Invariant runs it in two steps: a feasibility screen, then a utility-grade power study.'),
  faq('What is the difference between a feasibility study and a power study for a data center?', 'A feasibility screen checks whether a site has a fatal flaw and gives a first range of MW at nearby substations. A power study runs an AC power flow with N-1 contingency tests at each connection option and returns MW by year, the binding element, the upgrades needed, an indicative cost and an energization date.'),
  faq('How long does data center site due diligence take?', 'Invariant returns a feasibility screen within 24 hours of receiving a coordinate and a MW figure, and a utility-grade power study usually within 48 hours. A utility’s own load study takes months; AEP Ohio, for example, quotes 45 to 60 days for its data center study after an application is complete.', 'aep-dct'),
  faq('Can a site be judged by its distance to a transmission line?', 'No. Distance shows a connection is physically possible, not that the network can carry the load. Paces found only about 17% of ERCOT substations near suitable land had withdrawal headroom.', 'paces'),
  faq('How do I request a site screen from Invariant?', 'Email pranav@invariant-ai.com or call (628) 220-8972 with the coordinate or parcel, the target MW and the date you need power. You can also book a 30 minute call from any of these pages.')],
 [SCREEN, STUDY, 'data-center-power-flow-study'], read=10,
 service={'name': 'Data center site due diligence', 'serviceType': 'Data center site feasibility screening and utility-grade power studies', 'description': 'Two-step due diligence for data center sites in the US: a feasibility screen covering power, flood, seismic, wetlands, airspace, zoning and parcel, then a utility-grade power study with AC power flow and N-1 contingency tests, upgrade paths, indicative cost and energization date.'},
 howto={'name': 'How to run due diligence on a data center site', 'steps': [
   {'name': 'Send the site', 'text': 'Share a coordinate or parcel, the target MW, phasing and the energize-by date.'},
   {'name': 'Feasibility screen', 'text': 'Check power at nearby substations, flood, seismic, wetlands, airspace, zoning and the parcel, and decide go or no-go.'},
   {'name': 'Utility-grade power study', 'text': 'Run AC power flow with N-1 contingencies at each connection option and find the MW by year, upgrades, cost and date.'},
   {'name': 'Take it to the utility', 'text': 'File at the best connection point with the right MW and a list of questions for the pre-application meeting.'}]}))

# ================================================================== step 1
PAGES.append(page(SCREEN,
 'Data center site feasibility study: power, flood, seismic and zoning screen in 24 hours',
 'A data center site feasibility study from Invariant: power at nearby substations, flood zone, seismic, wetlands, FAA, zoning and parcel checks, with a go or no-go in 24 hours.',
 'A data center site feasibility study tells you whether a site deserves real money before you option it. Send Invariant a coordinate or parcel and a target MW. Within 24 hours you get the serving utility and ISO, the nearest substations and lines with a screening MW range for each of the next three study years, and checks on flood zone, seismic hazard, wetlands and species, airports, zoning, moratoriums, water, fiber and the parcel. It ends in a plain go, no-go or conditional go, with the reason.',
 ['The screen is built to kill sites fast. Power and flood remove more sites than anything else.',
  'Every check names its source, so you can show your investment committee where a finding came from.',
  'A screening MW range is not a utility commitment. It tells you whether a full power study is worth running.',
  'Sites that pass go to step two, the utility-grade power study, with the same team and the same model.'],
 [sec('What the screen covers',
    T(['Check', 'What we look at'], SCREEN_ROWS),
    P('The order matters. We run power first, then flood, then the rest, and stop writing when a site fails a hard check. You still get the full record, but the verdict is on page one.')),
  sec('The power check in the screen',
    P('We identify the serving utility and balancing area, then every substation and line within reach of the site at a voltage that can carry the load. As a rough guide, 69 kV serves loads up to about 60 MW, 138 kV up to about 200 MW, 230 kV up to about 400 MW and 345 kV up to about 1,000 MW. A radial station fails any load that needs N-1 service.'),
    P('For each candidate point we estimate headroom from the line and transformer ratings around it, minus the load already announced or filed nearby, for each of the next three study years. The output is a low, mid and high MW figure and the element that sets it.'),
    P('Hosting capacity maps rarely help here. Nearly all of them cover distribution feeders and generation, not large loads on the transmission system.', 'hosting')),
  sec('The physical and land checks',
    P('Flood comes from FEMA’s National Flood Hazard Layer: we check the zone under the pad, the access road and the substation route, and flag anything in a 1% annual chance zone.', 'fema-nfhl', 'fema-zones'),
    P('Seismic comes from the USGS National Seismic Hazard Model and the ASCE Hazard Tool, which give the ground motion values a structural engineer will design to. Wetlands come from the National Wetlands Inventory and listed species from IPaC. Airspace comes from the FAA’s notice criteria under Part 77.', 'usgs-nshm', 'asce-tool', 'nwi', 'ipac', 'part77'),
    P('Then the local layer: zoning, data center moratoriums and recent votes in the county, parcel ownership and size, water and wastewater, fiber routes and gas for on-site generation. Data Center Watch tracks projects blocked or delayed by local opposition; we check the county against it and against local news.', 'dcwatch')),
  sec('What you get and how fast',
    L(['A one-page verdict: go, no-go or conditional go, with the reason or the one question that decides it.',
       'A power table: candidate connection points, voltage, distance, screening MW range by year and binding constraint.',
       'A site table: flood, seismic, wetlands, species, airspace, zoning, moratorium, water, fiber, parcel, each with its source.',
       'Maps of the parcel, the substations and lines, and the flood and wetland layers.',
       'Editable Word and Excel files with the PDF, so your team or your client can reuse them.']),
    P('Turnaround is within 24 hours of receiving a coordinate and a MW figure. Many sites at once? Send a list. We screen portfolios for brokers and funds, and we work behind an adviser’s name when asked.')),
 ],
 [faq('What is included in a data center site feasibility study?', 'Invariant’s feasibility screen covers power at the nearest substations and lines (a screening MW range for three study years and the binding constraint), FEMA flood zone, USGS and ASCE seismic values, wetlands, listed species, FAA airspace, zoning and moratoriums, water, fiber, gas and the parcel. It ends in a go, no-go or conditional go.'),
  faq('How much does a data center feasibility study cost?', 'Invariant charges a fixed fee per site, quoted before we start, with lower rates for portfolios. It costs a small fraction of a utility study deposit, which runs from $10,000 to $100,000 at AEP Ohio and $100,000 for large loads in ERCOT.', 'aep-dct', 'ud-texas'),
  faq('How fast can I get a site feasibility screen?', 'Within 24 hours of sending a coordinate or parcel and a target MW to pranav@invariant-ai.com.'),
  faq('Does a feasibility screen tell me how many MW a site can get?', 'It gives a screening range at each nearby connection point and names what limits it. A firm number needs a power flow with contingency tests, which is step two, and in the end the utility’s own study.'),
  faq('Can you screen many sites at once?', 'Yes. Brokers, funds and developers send lists of sites and we return a ranked table with a verdict per site, then run full power studies on the ones they pick.')],
 [STUDY, PILLAR, 'data-center-flood-zone-screening'], read=7,
 service={'name': 'Data center site feasibility screen', 'serviceType': 'Data center site feasibility study', 'description': 'A 24 hour screen of a US data center site from a coordinate and a MW figure: power at nearby substations, flood, seismic, wetlands, species, FAA airspace, zoning, moratoriums, water, fiber and parcel, ending in a go or no-go.'}))

# ================================================================== step 2
PAGES.append(page(STUDY,
 'Utility-grade power study for data centers: N-1 power flow before you file with the utility',
 'A utility-grade power study for a data center site: AC power flow and N-1 contingency tests at each connection point, MW by year, upgrades, indicative cost and energization date.',
 'A utility-grade power study tells you how many MW a site can take at each possible connection point, in each study year, and what limits it. Invariant rebuilds the transmission network around your site, checks the model against flows the ISO publishes, injects your load and runs AC power flow with N-1 contingency tests in the way a utility planner would under NERC TPL-001. You get MW by connection point and year, the line or transformer that binds, the upgrade that lifts it, an indicative cost and an energization date range. Usually within 48 hours.',
 ['Built to utility planning methods: seasonal cases, study years, N-0 and N-1, thermal and voltage limits.',
  'Every connection option is tested, including a new switching station on lines that pass the site.',
  'Upgrades come with the MW they unlock, so you can see what a bigger first phase would cost.',
  'It is a screening study. The utility’s own study makes a number firm, and the report says so.'],
 [sec('What the study contains',
    T(['Part', 'What it covers'], STUDY_ROWS, 'tpl001'),
    P('The report reads answer first: the MW you can plan on, where, and from when. The method, the cases and the full contingency results follow for your engineers.')),
  sec('How we run it',
    P('We start by building the network: substations, lines, transformers and generation around the site, with the ratings and the planned changes that will be in service by each study year, including generator retirements from EIA-860M and announced large loads nearby.', 'eia-860m'),
    P('Then we check the base case. Area totals and flows on major paths must line up with what the ISO reports before any load goes in. A model that cannot reproduce today’s grid cannot tell you about 2029.'),
    P('Then we add your load at each candidate point and push it up until something breaks. A linear transfer screen ranks the elements most exposed to the new load. A full AC solve at N-0 and N-1, over every element in the study area, finds the MW at which the first thermal or voltage limit is crossed. NERC calls the single-element outages P1 events; we add selected P2, P4, P5 and P7 events for the elements that bind.', 'tpl001'),
    P('For each violation we try the fix a utility would likely propose, re-solve, and record the MW it unlocks. That gives three numbers per connection point: MW with no upgrades, MW with only the facilities to connect you, and MW with network upgrades.')),
  sec('Why grid strength now matters for AI loads',
    P('Large AI training loads swing fast and ride through faults differently from older loads. NERC issued a Level 2 alert on large loads asking planners how they model and study them, and ERCOT has published work on modeling large data center loads.', 'nerc-alert', 'ercot-grit'),
    P('We report short circuit level and short circuit ratio at each connection point and flag where a utility is likely to ask for dynamic or electromagnetic transient studies. That flag can move a schedule by months.')),
  sec('Cost and time to power',
    P('Indicative costs come from unit cost tables for lines and substation work. MISO’s MTEP24 guide, for example, gives about $1.9 to $2.3 million a mile for a new single-circuit 138 kV line and $3.2 to $4.1 million a mile at 345 kV, and about $15.8 million for a new four-position 345 kV ring bus. We carry ranges, never point figures.', 'miso-cost'),
    P('The date range adds up the utility’s intake and study clock, the agreement, and the longer of the network build or long-lead equipment such as large transformers. In Texas that clock now runs through ERCOT’s batch process for large loads.', 'batch0', 'ercot-lli')),
  sec('How it relates to the utility’s study',
    P('Our study is not the utility’s case and does not commit the utility to anything. The utility’s study, run on its own planning model once you apply with site control, is what makes a number firm. What ours does is tell you where to apply, how much to ask for, which upgrades to expect and which questions to bring to the pre-application meeting.'),
    P('That matters because applying is expensive. AEP Ohio charges up to $100,000 for a data center study; Texas charges $100,000 for large loads in ERCOT, with security on top. A wrong point of interconnection or an oversized request costs months.', 'aep-dct', 'ud-texas')),
 ],
 [faq('What is a utility-grade power study?', 'It is a power flow study of a site’s connection options built to the methods utilities use: seasonal cases, study years, AC power flow at N-0 and N-1 under NERC TPL-001, thermal and voltage limits, short circuit, and an upgrade search. Invariant’s version returns MW by connection point and year, the binding element, the upgrades and their cost, and an energization date range.', 'tpl001'),
  faq('Is Invariant’s power study the same as the utility’s load study?', 'No. The utility’s study runs on its own planning model after you apply with site control, and it is the only study that commits the utility. Ours runs before that, so you apply at the right point with the right MW.'),
  faq('How long does a power study take?', 'Invariant usually returns a utility-grade power study within 48 hours of receiving the site and the load. Utility load studies take months; AEP Ohio quotes 45 to 60 days after a complete application.', 'aep-dct'),
  faq('What do you need from me to run a power study?', 'A coordinate or parcel, the target MW and phasing, the energize-by date and, if you have them, any utility letters, power factor or on-site generation plans.'),
  faq('Do you work for brokers and advisers?', 'Yes. We run studies behind a broker’s or adviser’s name, deliver editable Word and Excel files, and do not contact their clients.')],
 [SCREEN, 'n-1-contingency-analysis-data-center', 'utility-load-study-cost-and-timeline'], read=9,
 service={'name': 'Utility-grade power study', 'serviceType': 'Power flow and N-1 contingency study for data center interconnection', 'description': 'A power study for a US data center site built to utility planning methods: network model per study year, AC power flow at N-0 and N-1, thermal and voltage limits, short circuit ratio, upgrade search, indicative cost and energization date.'},
 howto={'name': 'How a utility-grade power study is run', 'steps': [
   {'name': 'Build the network model', 'text': 'Model the transmission system around the site for each study year, with planned changes and nearby large loads.'},
   {'name': 'Check the base case', 'text': 'Match area totals and major path flows to what the ISO reports.'},
   {'name': 'Inject the load', 'text': 'Add the MW at each candidate connection point, including new switching stations.'},
   {'name': 'Run contingencies', 'text': 'Solve AC power flow at N-0 and N-1 and find the MW where the first limit is crossed.'},
   {'name': 'Search for upgrades', 'text': 'Apply the likely fix for each violation and record the MW it unlocks, with cost and date ranges.'}]}))

# ================================================================== guides
PAGES.append(page('data-center-power-flow-study',
 'Power flow study for a data center: what it tests and how to read the results',
 'What a power flow (load flow) study is for a data center interconnection, what it tests, what inputs it needs, and how to read the MW, the binding element and the upgrades.',
 'A power flow study, also called a load flow study, solves the voltages and the flow on every line and transformer in a network for a given pattern of load and generation. For a data center it answers one question: if this much load connects here, does any element go over its rating or any voltage go out of range, with everything in service and with any one element out? The MW at which the first limit is crossed is the site’s headroom at that point.',
 ['A power flow is a snapshot. Planners run several: summer and winter peak, light load, and more than one study year.',
  'The answer depends on the connection point. Two substations a mile apart can differ by hundreds of MW.',
  'The binding element is often not the nearest one. It can be a transformer two stations away.',
  'Utilities study in tools such as Siemens PSS/E on their planning cases, which are protected as CEII.'],
 [sec('What a power flow solves',
    P('Give the solver the network (buses, lines, transformers, their impedances and ratings), the generation dispatch and the loads, and it finds a consistent set of voltages and flows. An AC power flow includes reactive power and voltage. A DC power flow is a fast linear version used to screen many cases.'),
    P('Utility planners run these on base cases built for each season and study year. The cases are protected as critical energy infrastructure information, so access needs an agreement with the ISO or FERC.', 'pjm-cases', 'ceii')),
  sec('Inputs for a data center study',
    L(['The site location and each candidate point of interconnection, including a new switching station on a passing line.',
       'The load in MW for each phase and year, and its power factor.',
       'The study years that match your ramp.',
       'Planned grid changes in service by each year: new lines, upgrades, generator retirements.',
       'Other large loads likely to connect nearby, because they use the same headroom.'], 'eia-860m')),
  sec('What the results look like',
    T(['Connection point', 'Year', 'MW, no upgrades', 'Binding element', 'Fix', 'MW after fix'], [
      ['Substation A, 345 kV', 'Year 1', 'Example: 300', '345/138 kV transformer at a neighbouring station, N-1', 'Second transformer', 'Example: 520'],
      ['Substation B, 138 kV', 'Year 1', 'Example: 40', '138 kV line out of B, N-1', 'Reconductor 6 miles', 'Example: 110'],
      ['New switching station on line C, 345 kV', 'Year 3', 'Example: 600', 'Voltage at the new bus after loss of the parallel circuit', 'Capacitor bank', 'Example: 740'],
    ]),
    P('The table above shows the format, not a real site. Read it by connection point and year. A high number in year three with a low number in year one tells you to phase the load or wait for a planned upgrade.')),
  sec('Common mistakes in reading a power flow',
    P('Taking one season as the answer is the usual one. A site can be fine at summer peak and fail at light load when local generation is off. Another: ignoring the load queue. If two other data centers are filing at the same substation, the headroom you found is shared.'),
    P('And a study that does not name its binding element is not worth much. You need the element to judge the fix and to ask the utility the right question.')),
 ],
 [faq('What is the difference between a power flow study and a load flow study?', 'They are the same thing. Both solve voltages and flows in a network for a given load and generation pattern.'),
  faq('What software is used for power flow studies?', 'Utilities and ISOs mostly use Siemens PSS/E and PowerWorld on their planning cases. Facility design tools such as ETAP are used inside the fence, not for transmission planning.', 'psse'),
  faq('Does a power flow study include contingencies?', 'A planning study does. It solves the base case and then each single-element outage (N-1) and selected multi-element events under NERC TPL-001.', 'tpl001'),
  faq('Who can run a power flow study for my data center site?', 'Invariant runs utility-grade power studies on US sites, usually within 48 hours. Email pranav@invariant-ai.com with the coordinate and MW.')],
 [STUDY, 'n-1-contingency-analysis-data-center', 'data-center-substation-capacity-check'], read=7))

PAGES.append(page('n-1-contingency-analysis-data-center',
 'N-1 contingency analysis for data centers: why a site’s MW depends on the outage, not the line',
 'N-1 contingency analysis explained for data center sites: what NERC TPL-001 P1 events are, why the limit is set with one element out, and how N-1 changes the MW you can get.',
 'N-1 contingency analysis tests whether the grid still works when any single element (one line, one transformer, one generator) is out of service. Utilities size a new data center connection so that no line or transformer goes over its emergency rating and no voltage leaves its range after any such outage. That is why the MW a site can get is usually set by an outage case, not by the normal-day flow, and why a line with spare capacity on a normal day can still say no.',
 ['N-1 means every single element in the study area, not only the largest one.',
  'NERC TPL-001 calls these P1 events and also defines harder ones: breaker failures, common towers and overlapping outages.',
  'The emergency rating applies after the outage; the normal rating applies before it.',
  'A radial connection with one line in fails N-1 for any load that needs firm service.'],
 [sec('What N-1 means in practice',
    P('NERC’s planning standard, TPL-001, sets the events a planner must test. P0 is everything in service. P1 is the loss of any single generator, line, transformer or shunt device. P2 to P7 cover a bus or breaker failure, a stuck breaker, a common tower and two overlapping outages (P6, often called N-1-1).', 'tpl001'),
    P('For each event the planner checks every monitored element for thermal overloads against its emergency rating and every bus for voltage limits. The new load passes at a given MW only if every event passes.')),
  sec('Why it sets the MW for a data center',
    P('Picture a substation fed by two lines. On a normal day each carries half the load. Trip one, and the other carries all of it. The site’s headroom is how much load the surviving line can carry at its emergency rating, minus what it already carries. That is often half or less of what the normal-day picture suggests.'),
    P('The binding outage is rarely the obvious one. In our studies it is often a transformer one or two stations away, or a parallel path that picks up flow when a distant line trips.')),
  sec('What N-1 analysis can and cannot tell you',
    P('It tells you the MW at which the first limit is crossed and which element crosses it. It does not tell you whether the utility will accept that the load be curtailed after an outage instead of building an upgrade. Some utilities now offer flexible or interruptible service for large loads, which changes the answer.'),
    P('NERC has also asked planners to look harder at how large loads behave during faults, which can add dynamic studies on top of N-1.', 'nerc-alert')),
 ],
 [faq('What is N-1 in power systems?', 'N-1 is the condition with one element of the grid out of service. A system meets N-1 if it stays within thermal and voltage limits after the loss of any single line, transformer or generator.', 'tpl001'),
  faq('What is the difference between N-1 and N-1-1?', 'N-1 is a single outage. N-1-1 is a second outage after the system has been adjusted for the first one. NERC TPL-001 lists it as a P6 event.', 'tpl001'),
  faq('Does a data center need N-1 service?', 'Most large data centers ask for firm service, which means the connection must survive any single outage. Some accept curtailable service for part of the load to connect sooner.'),
  faq('Can you run an N-1 analysis on my site?', 'Yes. Invariant’s utility-grade power study runs AC N-1 at every connection option around the site, usually within 48 hours.')],
 [STUDY, 'data-center-power-flow-study', 'data-center-substation-capacity-check'], read=6))

PAGES.append(page('data-center-substation-capacity-check',
 'How to check if a substation has capacity for a data center',
 'How to check substation capacity for a data center: what you can learn from records, why hosting capacity maps miss large loads, and when you need a power flow study.',
 'You cannot read a substation’s spare capacity off a map, and most utilities will not tell you without a paid, site-controlled study. What you can do before that is narrow it down: find the stations within reach, check their voltage and how many lines feed them, estimate headroom from the ratings around them, subtract the load already filed nearby, and then run a power flow with N-1 tests on the ones that survive. That is what Invariant’s two-step due diligence does.',
 ['Voltage sets the ceiling. As a rough guide, 138 kV supports up to about 200 MW and 345 kV up to about 1,000 MW.',
  'A station fed by one line is radial and fails any load that needs firm service.',
  'Hosting capacity maps are almost all about distribution and generation, not large loads.',
  'The load already queued at a station is mostly not disclosed, so it has to be estimated from filings.'],
 [sec('What you can find without the utility',
    L(['The serving utility for the parcel, from EIA-861 service territory data.',
       'Substations and lines within reach, their voltage and how many lines connect at each.',
       'Generator retirements and additions nearby from EIA-860M, which free up or take up capacity.',
       'Announced data centers, industrial loads and rezoning filings near each station.',
       'The utility’s large-load tariff, study fees and minimum bills.'], 'eia861', 'eia-860m')),
  sec('Why hosting capacity maps do not answer it',
    P('Many utilities publish hosting capacity maps, and the Department of Energy keeps an atlas of them. Nearly all show how much generation or load a distribution feeder can take. A 50 MW or 500 MW data center connects to the transmission system, which those maps do not cover.', 'hosting')),
  sec('What the utility will and will not say',
    P('Utilities usually confirm territory and will talk through a project informally. Dominion, for example, runs a data center request process with an early feasibility look before paid engineering. Specific spare capacity at a named station almost always waits for a paid, site-controlled study.', 'dominion'),
    P('That is why a pre-study matters. If you walk into the pre-application meeting knowing which station binds and why, you can ask a question the utility can answer: is the spare transformer capacity at station X already committed?')),
  sec('When to run a full study',
    P('Run a power flow with contingency tests once a site passes the screen and you are about to spend real money on it: an option payment, a study deposit, or an LOI. Paces found only about 17% of ERCOT substations near suitable land had withdrawal headroom, so the screen will remove most candidates before then.', 'paces')),
 ],
 [faq('How do I find out how much capacity a substation has?', 'Narrow it down from records (voltage, line count, ratings, nearby loads and retirements), then run a power flow with N-1 tests. The utility confirms capacity only through its own study after you apply with site control.'),
  faq('Do utilities publish substation capacity?', 'Mostly no, for large loads. Hosting capacity maps cover distribution feeders and generation. Transmission planning cases are protected as CEII.', 'hosting', 'ceii'),
  faq('What voltage does a data center need?', 'As a rough guide, 69 kV serves up to about 60 MW, 138 kV up to about 200 MW, 230 kV up to about 400 MW and 345 kV or higher beyond that. The real limit depends on the network around the station.'),
  faq('Can Invariant check a substation for me?', 'Yes. Send the coordinate and target MW; the feasibility screen returns a screening MW range at each nearby station within 24 hours.')],
 [SCREEN, STUDY, 'distance-to-transmission-line-data-center'], read=6))

PAGES.append(page('utility-load-study-cost-and-timeline',
 'How much does a utility load study cost for a data center, and how long does it take?',
 'Utility load study cost and timeline for data centers in 2026: AEP Ohio, ERCOT and Dominion fees, security, study clocks, and how to avoid paying for the wrong study.',
 'A utility load study for a data center costs from $10,000 to $100,000 or more in study fees, before any security, and takes from about two months to a year. AEP Ohio charges $10,000 to $100,000 by load size and quotes 45 to 60 days. Texas charges $100,000 for large loads in ERCOT, with security on top and a batch process for timing. The money and months are spent on one connection point and one MW figure, so it pays to know both are right before you file.',
 ['Fees rise with the load size and usually need site control first.',
  'Security and deposits can be far larger than the study fee.',
  'New large-load tariffs bring minimum bills near 80 to 85% of contract demand for 12 years or more.',
  'A pre-study tells you where to file and how much to ask for.'],
 [sec('Study fees by utility',
    T(['Utility or market', 'Threshold', 'Study fee', 'Clock'], [
      ['AEP Ohio', '25 MW and up, data center tariff', '$10,000 (25 to 50 MW), $50,000 (50 to 100 MW), $100,000 (100 MW and up)', 'Study 45 to 60 days after a complete application'],
      ['Texas (ERCOT)', 'Large loads 75 MW and up', '$100,000, plus financial security', 'ERCOT batch process for large loads'],
      ['Dominion Virginia', 'Data center requests', 'Early feasibility look, then paid engineering agreements', 'Engineering often runs most of a year'],
    ], 'aep-dct', 'ud-texas', 'batch0', 'dominion'),
    P('These change often. Texas rewrote its large-load rules after SB 6 in 2025, and ERCOT moved large loads into batches in 2026.', 'sb6', 'batch0')),
  sec('The costs after the study',
    P('Study fees are the small part. Once a study is done, construction agreements and security commit real money, and the electric service agreement sets a minimum bill. Berkeley Lab and Brattle found a median minimum billing demand of 80% of contract demand across new large-load tariffs; AEP Ohio sets up to 85% for up to 12 years.', 'lbnl', 'aep-dct')),
  sec('How to avoid paying for the wrong study',
    P('The expensive mistakes are filing at a station that cannot take the load, or asking for more MW than the network can carry in your first year, which pushes you into network upgrades and a later date. Both show up in a pre-study.'),
    P('Invariant’s utility-grade power study runs before you file. It tests each connection option with N-1, shows the MW per year and the upgrades behind any bigger number, and turns that into questions for the pre-application meeting. It costs a small fraction of a single utility study fee.')),
 ],
 [faq('How much does a data center load study cost?', 'Utility study fees run from $10,000 to $100,000 at AEP Ohio depending on size, and $100,000 for large loads in ERCOT, with security on top. Larger utilities and deposit tariffs can go higher.', 'aep-dct', 'ud-texas'),
  faq('How long does a utility load study take?', 'AEP Ohio quotes 45 to 60 days after a complete application. Elsewhere it can take most of a year, and ERCOT now processes large loads in batches.', 'aep-dct', 'batch0'),
  faq('Do I need site control to request a load study?', 'Most utilities require it for a formal study. Informal conversations and territory confirmation usually do not.'),
  faq('Can I get a power study before applying to the utility?', 'Yes. Invariant runs a utility-grade power study, usually within 48 hours, so you file at the right point with the right MW.')],
 [STUDY, 'utility-will-serve-letter-load-study-esa', 'texas-data-center-large-load-interconnection-2026'], read=6))

PAGES.append(page('distance-to-transmission-line-data-center',
 'Distance to substation and transmission for a data center site: what it costs and what it doesn’t tell you',
 'How distance to a substation or transmission line affects a data center site: cost per mile by voltage, switching station costs, right-of-way time, and why distance is not capacity.',
 'Distance to the nearest substation or transmission line is the first number everyone asks about a data center site, and it matters for cost and time. A new 345 kV line costs about $3.2 to $4.1 million a mile in MISO’s cost guide, and long lines can take years to permit. But distance is not capacity. A line beside the parcel needs a new switching station to tap, and the network behind it still has to carry the load with one element out.',
 ['Every mile adds cost and right-of-way risk. Short taps take about two years at best; long new lines take far longer.',
  'Tapping a passing line means building a switching station, about $15.8 million for a four-position 345 kV ring bus in MISO’s guide.',
  'Screen on substations and their networks, not on lines alone.',
  'The best site is often the one a bit further away from a stronger station.'],
 [sec('What distance costs',
    T(['Item (MISO MTEP24 guide)', '138 kV', '230 kV', '345 kV', '500 kV'], [
      ['New single circuit line, $ million per mile', '1.9 to 2.3', '2.0 to 2.6', '3.2 to 4.1', '4.1 to 5.1'],
      ['New double circuit line, $ million per mile', '2.8 to 3.3', '3.3 to 4.0', '5.5 to 6.4', 'n/a'],
      ['Add a breaker-and-a-half position, $ million', '2.3', '3.0', '4.9', '7.3'],
      ['New four-position ring bus substation, $ million', '9.1', '11.1', '15.8', '22.9'],
    ], 'miso-cost'),
    P('Costs vary by region and terrain, and they escalate each year. We carry them as ranges in every study.')),
  sec('How we measure it',
    P('Straight-line distance understates a real route. We multiply by about 1.3 to allow for roads, parcels and terrain, and check the route for floodplain, wetlands and crossings. We measure to substations at a voltage that can carry the load, not to the nearest line on a map.', 'nwi', 'fema-nfhl')),
  sec('Why distance is not capacity',
    P('In a 2025 analysis of ERCOT, Paces found only about 17% of substations near suitable land had any withdrawal headroom. A 345 kV line next to a parcel is the start of the question.', 'paces'),
    P('That is why step one of our due diligence screens on stations and their headroom, and step two runs a power flow with N-1 on each connection option.')),
 ],
 [faq('How close does a data center need to be to a substation?', 'There is no fixed number, but every mile of new line adds roughly $2 to $5 million depending on voltage, plus right-of-way time. Many large sites sit within a few miles of a 230 kV or 345 kV station.', 'miso-cost'),
  faq('How much does it cost to build a transmission line to a data center?', 'MISO’s MTEP24 guide gives about $1.9 to $2.3 million a mile for a new single-circuit 138 kV line and $3.2 to $4.1 million a mile at 345 kV, before substation work.', 'miso-cost'),
  faq('Is a site next to a transmission line a powered site?', 'No. It needs a switching station to tap the line, and the network behind it must carry the load under N-1. Only a study shows whether it can.'),
  faq('Can Invariant tell me the distance and cost for my site?', 'Yes. The feasibility screen gives distances to each candidate station and line; the power study adds cost and date ranges for each connection option.')],
 [SCREEN, 'data-center-substation-capacity-check', STUDY], read=6))

PAGES.append(page('data-center-flood-zone-screening',
 'Data center flood zone screening: FEMA zones, base flood elevation and what to check',
 'How to screen a data center site for flood risk: FEMA flood zones (A, AE, V, X), the National Flood Hazard Layer, access roads, substations and sea level exposure.',
 'Screen a data center site for flood risk by checking the FEMA flood zone under the building pad, the substation, the access roads and the line route, not just the parcel centroid. Zones A and AE (and V on the coast) are the 1% annual chance flood, often called the 100-year flood. Shaded Zone X is the 0.2% annual chance flood. Most data center buyers treat any building footprint in a 1% zone as a kill or a costly fill-and-permit problem, and many avoid the 0.2% zone for critical equipment.',
 ['Check the pad, the substation site and the access road. A dry building on a flooded road is still offline.',
  'FEMA maps show the regulatory flood, not every flood. Look at flood history and local drainage too.',
  'On the coast, add storm surge and sea level rise over the life of the asset.',
  'A floodway designation can block fill entirely, which is different from a flood zone.'],
 [sec('FEMA flood zones in plain terms',
    T(['Zone', 'What it means', 'Typical treatment for a data center'], [
      ['A, AE, AH, AO', '1% annual chance flood (Special Flood Hazard Area)', 'Avoid for buildings and electrical gear, or plan fill, elevation and a floodplain permit'],
      ['V, VE', 'Coastal 1% flood with wave action', 'Avoid'],
      ['X (shaded)', '0.2% annual chance flood, or 1% with shallow depths', 'Allowed with care; raise critical equipment'],
      ['X (unshaded)', 'Outside the 0.2% flood', 'Normal design'],
      ['D', 'Not studied', 'Get local data before relying on it'],
    ], 'fema-zones'),
    P('A 1% annual chance sounds small. Over a 30-year life it works out to about a one in four chance of at least one such flood.')),
  sec('Where to look',
    P('FEMA’s National Flood Hazard Layer and Flood Map Service Center hold the effective maps and base flood elevations. We overlay the parcel, the likely pad, the substation site and the access routes.', 'fema-nfhl', 'fema-msc'),
    P('Near the coast we add NOAA’s sea level rise viewer, and inland we check soils for drainage and hydric soils, which often line up with wetlands.', 'noaa-slr', 'soil')),
  sec('How flood fits the rest of the screen',
    P('Flood is the second check in our feasibility screen, after power, because it removes the next largest share of sites. A site that passes both goes on to seismic, wetlands, airspace and zoning.')),
 ],
 [faq('Can you build a data center in a flood zone?', 'It is possible with fill, elevation and a floodplain permit, but most buyers avoid putting buildings or electrical equipment in a 1% annual chance zone, and floodways can block fill entirely.', 'fema-zones'),
  faq('What flood zone is acceptable for a data center?', 'Unshaded Zone X is the norm. Shaded Zone X (0.2% annual chance) is often accepted with critical equipment raised. Zones A, AE and V are usually avoided.', 'fema-zones'),
  faq('Where can I find the flood zone for a site?', 'In FEMA’s Flood Map Service Center or the National Flood Hazard Layer.', 'fema-msc', 'fema-nfhl'),
  faq('Does Invariant check flood risk?', 'Yes. Flood zone, base flood elevation, access roads and coastal exposure are part of the 24 hour feasibility screen.')],
 [SCREEN, 'data-center-seismic-risk-screening', 'data-center-environmental-site-screening'], read=5))

PAGES.append(page('data-center-seismic-risk-screening',
 'Data center seismic risk screening: USGS hazard maps, ASCE 7 values and faults',
 'How to screen a data center site for seismic risk: the USGS National Seismic Hazard Model, ASCE 7 seismic design category, site soils and mapped faults.',
 'Screen a data center site for seismic risk with three sources: the USGS National Seismic Hazard Model for how hard the ground is likely to shake, the ASCE Hazard Tool for the design values a structural engineer will use, and USGS fault maps for any active fault near the pad. The result is a seismic design category from A (low) to F (highest) that drives structural cost, equipment anchoring and sometimes insurance. USGS’s 2023 model found nearly three quarters of the US could see damaging shaking.',
 ['Seismic design category depends on both the hazard and the soil. Soft soils amplify shaking.',
  'Higher categories add structural steel, bracing and anchoring for racks, chillers and generators.',
  'Mapped active faults through the pad are usually a kill.',
  'Liquefaction-prone soils near rivers and coasts deserve a geotechnical look early.'],
 [sec('The sources',
    P('The USGS National Seismic Hazard Model estimates ground shaking across the US. Its 2023 update found nearly 75% of the country could experience damaging shaking.', 'usgs-nshm', 'usgs-2023'),
    P('The ASCE Hazard Tool turns a coordinate into the ASCE 7 design values (spectral accelerations) along with wind, snow, ice and flood loads. USGS keeps a database of faults active in the Quaternary period.', 'asce-tool', 'usgs-faults')),
  sec('What changes with the category',
    T(['Seismic design category', 'What it usually means for a data center'], [
      ['A or B', 'Low hazard; normal design'],
      ['C', 'Moderate; more detailing and anchoring'],
      ['D', 'High; added structural cost, anchored and braced equipment, closer review'],
      ['E or F', 'Very high or near an active fault; specialist design, often avoided'],
    ], 'asce-tool'),
    P('The category also depends on the building’s risk category and the site soil class, which a geotechnical report confirms. The screen gives the expected range; the geotech settles it.')),
  sec('How we use it in the screen',
    P('We pull the hazard values and fault distances for the coordinate, check soils for liquefaction risk, and flag the expected design category. In most of the central US this is a quick pass. In the West, around New Madrid and in parts of the Southeast it can move cost and schedule.', 'soil')),
 ],
 [faq('How do I check seismic risk for a data center site?', 'Use the USGS National Seismic Hazard Model for shaking, the ASCE Hazard Tool for ASCE 7 design values, and USGS fault maps for nearby active faults.', 'usgs-nshm', 'asce-tool', 'usgs-faults'),
  faq('What is a seismic design category?', 'It is the ASCE 7 rating from A to F that combines ground motion, soil and the building’s risk category. It sets how much seismic detailing the structure and equipment need.', 'asce-tool'),
  faq('Is Invariant’s seismic check a geotechnical report?', 'No. It is a screen from mapped data. A geotechnical investigation confirms soil class and liquefaction risk before design.'),
  faq('Is seismic part of the feasibility screen?', 'Yes, along with power, flood, wetlands, airspace, zoning and the parcel, returned within 24 hours.')],
 [SCREEN, 'data-center-flood-zone-screening', PILLAR], read=5))

PAGES.append(page('data-center-environmental-site-screening',
 'Data center environmental screening: wetlands, endangered species and Phase I ESA',
 'How to screen a data center site for wetlands, listed species and contamination before you buy: National Wetlands Inventory, IPaC, EPA cleanup records and the Phase I ESA.',
 'An environmental screen for a data center site checks three things before you buy: wetlands and streams that would need a Clean Water Act permit to fill, federally listed species that could need consultation or seasonal limits, and contamination that could make you liable for cleanup. Start with the National Wetlands Inventory, the Fish and Wildlife Service’s IPaC tool and EPA cleanup records. Then commission a Phase I Environmental Site Assessment under ASTM E1527-21 before closing.',
 ['National Wetlands Inventory maps are a screen, not a jurisdictional determination. The Army Corps decides that.',
  'IPaC lists species that may be present; a federal nexus such as a Corps permit triggers consultation.',
  'A Phase I ESA to ASTM E1527-21 supports the All Appropriate Inquiries defence against cleanup liability.',
  'Brownfields and retired plants carry the most contamination risk and often the best power.'],
 [sec('Wetlands and water',
    P('The Wetlands Mapper shows mapped wetlands and deepwater habitat. On a large campus even a few acres of wetland in the wrong place can force a redesign or a permit that takes months. We overlay it with the pad, the substation and the line route.', 'nwi'),
    P('Hydric soils from the Web Soil Survey often flag unmapped wetlands, so we check those too.', 'soil')),
  sec('Listed species',
    P('IPaC returns the federally listed species and critical habitat that may be near a site. It is common for a site to list a bat or a bird species; what matters is whether there is habitat on the parcel and whether the project has a federal permit that triggers consultation. Tree clearing windows are the usual practical result.', 'ipac')),
  sec('Contamination and the Phase I ESA',
    P('EPA’s Cleanups in My Community shows Superfund, brownfield and RCRA sites nearby. Retired plants and industrial sites often have coal ash, fuel or solvent history.', 'epa-cimc'),
    P('Before closing, a Phase I ESA to ASTM E1527-21 is the standard way to meet EPA’s All Appropriate Inquiries rule and protect a buyer from cleanup liability. Parts of it must be done within 180 days of acquisition.', 'astm', 'epa-aai')),
 ],
 [faq('Do I need a Phase I environmental site assessment for a data center site?', 'If you are buying the land, yes in practice. A Phase I ESA to ASTM E1527-21 supports the All Appropriate Inquiries defence against cleanup liability, and lenders usually require one.', 'astm', 'epa-aai'),
  faq('How do I check a site for wetlands?', 'Start with the National Wetlands Inventory Wetlands Mapper and hydric soils in the Web Soil Survey. A wetland delineation and Army Corps determination confirm it.', 'nwi', 'soil'),
  faq('How do I check for endangered species on a site?', 'Run the location through the Fish and Wildlife Service’s IPaC tool, then check whether there is habitat on the parcel.', 'ipac'),
  faq('Does Invariant’s screen include environmental checks?', 'Yes. Wetlands, listed species and nearby contamination records are part of the 24 hour feasibility screen, with a recommendation on whether a Phase I is the next step.')],
 [SCREEN, 'data-center-flood-zone-screening', 'retired-power-plant-sites-for-data-centers'], read=5))

PAGES.append(page('faa-height-limits-data-center-site',
 'FAA height limits near airports: what a data center site needs to check',
 'FAA Part 77 for data center sites: when notice is required for buildings, stacks and cranes near airports, the 200 ft and 100:1 tests, and how to check a site.',
 'A data center near an airport may need to file FAA Form 7460-1 before construction. Under 14 CFR Part 77, notice is required for any structure over 200 feet above ground, and for lower structures that would break an imaginary slope from a nearby public-use airport, for example 100 to 1 for 20,000 feet from a runway longer than 3,200 feet. Cranes count. Generator stacks and cooling equipment can count. The FAA’s Notice Criteria Tool tells you from a coordinate and a height.',
 ['Most data center buildings are well under 200 feet, so the slope tests near airports are what usually apply.',
  'Construction cranes often need their own filing.',
  'File at least 45 days before construction; a determination of hazard can stop or change the design.',
  'Heliports and private airstrips can matter too.'],
 [sec('The Part 77 tests',
    T(['Test', 'Applies to'], [
      ['Over 200 ft above ground level', 'Any structure anywhere'],
      ['100:1 slope for 20,000 ft', 'Public-use airports with a runway over 3,200 ft'],
      ['50:1 slope for 10,000 ft', 'Public-use airports with shorter runways'],
      ['25:1 slope for 5,000 ft', 'Public-use heliports'],
    ], 'part77'),
    P('If a test is met, notice goes to the FAA on Form 7460-1 at least 45 days before construction starts. The FAA then issues a determination of no hazard, sometimes with marking and lighting conditions.', 'part77')),
  sec('How to check a site',
    P('Enter the coordinate, ground elevation and the tallest point (roof, stack, crane) into the FAA’s Notice Criteria Tool. It returns whether notice is required.', 'faa-nct'),
    P('In our feasibility screen we list airports and heliports nearby, run the tool at a typical building and crane height for the campus size, and flag any site where height will shape the design.')),
 ],
 [faq('Does a data center need FAA approval?', 'Only if it meets a Part 77 notice test: over 200 feet above ground, or breaking an airport slope surface. Then it files Form 7460-1 and needs a determination of no hazard.', 'part77'),
  faq('Do construction cranes need FAA notice?', 'Yes, if the crane meets a Part 77 notice test. Cranes are often taller than the finished building.', 'part77'),
  faq('How far from an airport does Part 77 apply?', 'Up to 20,000 feet from a runway longer than 3,200 feet at a public-use airport, on a 100 to 1 slope, plus the 200 foot test anywhere.', 'part77'),
  faq('Is airspace part of Invariant’s screen?', 'Yes, alongside power, flood, seismic, wetlands, zoning and the parcel.')],
 [SCREEN, 'data-center-environmental-site-screening', PILLAR], read=4))

PAGES.append(page('data-center-power-due-diligence-investors',
 'Power due diligence for data center investors and lenders: what to ask before you underwrite',
 'Data center power due diligence for investors and lenders: which utility documents count, what a power study should show, and the red flags in a powered land deal.',
 'For an investor or lender, power due diligence on a data center site comes down to one question: what document stands behind the MW figure in the model, and what would it take to make it firm? A seller’s will-serve letter is a lead. A utility load study for the marketed load at a named point is the first thing worth underwriting. Between the two, an independent power study tells you whether the number is plausible, which upgrades it assumes, and what date is realistic.',
 ['Underwrite the document, not the headline MW.',
  'Ask which element limits the MW and which upgrades the date assumes.',
  'Model the minimum bill and term in the service agreement, not just the energy price.',
  'Check the county for moratoriums and recent votes before you fund an option.'],
 [sec('What to ask the seller',
    L(['Which utility document supports the MW figure: indication, will-serve, load study, construction agreement or service agreement?',
       'At which point of interconnection, at what voltage, and from which year?',
       'Which upgrades does the date depend on, and who pays for them?',
       'Is security posted, and in whose name?',
       'What are the minimum bill and the term?',
       'Are other large loads filing at the same station?'], 'lbnl'),
    P('Our guide to the five rungs of power evidence explains how much each document is worth.')),
  sec('What an independent power study adds',
    P('A seller’s study, if there is one, was run for the seller. An independent study tests every connection option, shows the MW by year with and without upgrades, and names the binding element. Where it agrees with the seller, you underwrite with more confidence. Where it does not, you know which question to ask.'),
    P('Equity buyers already commission this. Ankura’s 300 MW brownfield case for an institutional investor covered line and substation feasibility, ISO timing, zoning, gas, water and a risk matrix.', 'ankura')),
  sec('Red flags',
    L(['A MW figure with no named point of interconnection.',
       'A date that ignores a planned upgrade or a batch study cycle.',
       'Proximity to a line offered as proof of power.',
       'A county with a moratorium or a recent failed rezoning.',
       'No mention of a minimum bill.'], 'dcwatch')),
 ],
 [faq('What power documents should a lender require for a data center site?', 'At minimum a utility load study for the marketed load at a named point, and ideally a signed construction agreement with security or an electric service agreement. A will-serve letter alone does not reserve capacity.'),
  faq('Should an investor commission an independent power study?', 'Yes, before funding an option or LOI. It shows whether the seller’s MW is plausible, which upgrades it depends on, and what date is realistic. Invariant usually returns one within 48 hours.'),
  faq('What is a minimum bill in a data center service agreement?', 'The amount owed each month regardless of use, tied to contract demand. Berkeley Lab and Brattle found a median of 80% across new large-load tariffs.', 'lbnl'),
  faq('Can Invariant review a seller’s power claims?', 'Yes. Send the site and the seller’s documents; we screen it in 24 hours and run a full power study if it passes.')],
 [STUDY, 'power-evidence-data-center-site-verification', 'utility-will-serve-letter-load-study-esa'], read=6))

PAGES.append(page('power-study-before-selling-land-to-data-center',
 'Selling land to a data center developer? Get a power study first',
 'For landowners and brokers: why a power study changes what data center developers pay for land, what it should show, and how to get one before you market the site.',
 'Data center developers buy power, not acres. Land near a substation with a documented path to tens or hundreds of MW sells at a very different price from the same land with no power answer, and developers will discount for every unknown. A power study before you market the site tells you, and buyers, how many MW the site can likely take, where, and by when. It also tells you early if the answer is no, before you spend months with brokers.',
 ['A buyer’s first question is how many MW and by when. Have the answer.',
  'Our study is a screening study; the utility’s own study comes later, usually funded by the buyer.',
  'A study that names the connection point and the binding element is far more credible than a map.',
  'Brokers can run studies on their listings and present them under their own name.'],
 [sec('Why power sets the price',
    P('Developers screen hundreds of sites and drop any without a credible power path. Paces found only about 17% of ERCOT substations near suitable land had withdrawal headroom, so buyers have learned not to trust proximity.', 'paces'),
    P('A site with a study showing, say, 150 MW at a named 345 kV station from a given year moves to the top of the pile. One without goes to the bottom, whatever the acreage.')),
  sec('What the study should show',
    L(['The serving utility and ISO.',
       'Each realistic connection point, its voltage and distance.',
       'MW by year at each point, with and without upgrades.',
       'The element that limits each figure and the likely fix.',
       'An indicative cost and date range.',
       'Flood, wetlands, zoning and other site checks a buyer will run anyway.'])),
  sec('How to get one',
    P('Send Invariant the parcel or a coordinate. We screen it within 24 hours and tell you whether a full power study is worth doing. If it is, the full study usually follows within 48 hours, in editable form so you or your broker can use it in marketing.'),
    P('If you would rather sell to a buyer we know, we also keep a catalogue of powered sites and work with developers looking for them.')),
 ],
 [faq('Does a power study increase land value for a data center sale?', 'It removes the biggest unknown a buyer prices in. Sites with a credible, documented power path are the ones developers shortlist.'),
  faq('Who pays for the utility’s load study when selling land?', 'Usually the buyer, after taking site control, because utilities need site control and a defined load. A pre-study by the seller shows the site is worth that step.'),
  faq('Can a broker get a power study on a listing?', 'Yes. Invariant runs studies for brokers and advisers and can deliver them under the broker’s name.'),
  faq('How do I start?', 'Email pranav@invariant-ai.com or call (628) 220-8972 with the parcel or coordinate and the acreage.')],
 [SCREEN, STUDY, 'data-center-land-for-sale'], read=5))

output = Path(sys.argv[1])
# Retain dated editorial revisions when refreshing the generated cluster.
if output.exists():
    revisions = {page['slug']: page for page in json.loads(output.read_text()) if page.get('updatedDate')}
    PAGES = [revisions.get(page['slug'], page) for page in PAGES]
out = json.dumps(PAGES, indent=1, ensure_ascii=False)
assert '—' not in out and '–' not in out, 'em or en dash'
output.write_text(out + '\n', encoding='utf-8')
print(f'wrote {len(PAGES)} pages')
