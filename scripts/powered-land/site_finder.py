"""Generate the data center site finder pages: one pillar, one page per MW size, one page per state.

Run: python3 site_finder.py ../../src/data/industry-articles/data-center-site-finder.json

House rules (same as teaser.py): partial coverage only. Inventory rows show region, an MW band,
rough land and timing. No towns, utilities, substations, prices or deal terms. US only. No em or en dashes.
"""
import json, sys

DATE = '2026-11-09'
PILLAR = 'find-data-center-site-us'
HUB = 'powered-land-for-sale-data-center-sites'

# Inventory rows exactly as already public on the hub page.
INV = {
    'az15': (['Arizona', '1.5 GW Phase 1', '15,000+ acres', 'Grid 2027'], 'arizona-1-5-gw-powered-land-ai-campus'),
    'pa350': (['Pennsylvania', '350 MW, signed utility service agreement', 'Former plant campus, lease', '50 MW end 2026, 300 MW end 2027'], 'pennsylvania-350-mw-contracted-power-ai-campus-for-lease'),
    'pa500': (['Pennsylvania', '200 MW BTM gas + 300 MW grid', '120 ready acres', 'Phased'], 'pennsylvania-500-mw-gas-and-grid-data-center-site'),
    'ia500': (['Iowa', '20 MW to 500 MW+ PPA site', 'Non-zoned', 'Phased'], 'iowa-20-to-500-mw-mining-site-long-term-ppa'),
    'nv375': (['Nevada', '375 MW', '~350 acres', '2027 to 2028'], 'nevada-375-mw-powered-land-230-kv-data-center-site'),
    'oh300': (['Ohio', '300 MW approved', '300+ acres', '1H 2027'], 'ohio-300-mw-powered-land-345-kv-data-center-site'),
    'ks250': (['Kansas', 'Path to 250 MW BTM gas', 'Mineral acreage', 'Now'], 'kansas-250-mw-behind-the-meter-gas-power-site'),
    'in200': (['Indiana', '200 MW, load study done', '~80 acres', 'Substation planned'], 'indianapolis-200-mw-greenfield-data-center-site'),
    'wi150': (['Wisconsin', '150 MW built, 80 MW now', '130 ready acres', 'Now'], 'wisconsin-150-mw-data-center-mining-site-for-sale'),
    'ny60': (['New York', '60 MW+ power plant', 'Plant site', 'Operating'], 'new-york-60-mw-gas-peaker-plant-nyiso-zone-e-for-sale'),
    'mw85': (['Midwest', '85 MW brownfield', '~20 acres', 'Now'], 'midwest-85-mw-brownfield-mining-site'),
    'okc55': (['Oklahoma', '55 MW contracted', '~80 acres', 'Now'], 'oklahoma-city-55-mw-powered-brownfield-84-acres-oge'),
    'tx17': (['Texas (Houston load zone)', '17 MW greenfield', '~2 acres', '4 to 6 months'], 'texas-17-mw-greenfield-mining-site-houston-load-zone'),
    'or10': (['Oregon', '10 MW hydro, to 100 MW+', 'Lease + land option', 'Now'], 'oregon-10-mw-hydro-mining-site-expandable-100-mw'),
    't3': (['US (3 facilities)', 'Tier III data centers, 3.5 to 10 MW', 'Built', 'Now'], 'turnkey-tier-iii-data-centers-for-sale-and-lease'),
    'tx44': (['Texas metro', '44 MW, +250 MW', '~50 acres, 1M sq ft', 'Now'], 'texas-44-mw-data-center-property-250-mw-expansion'),
    'ky30': (['Kentucky', '30 MW greenfield', '~16 acres, rezoned', 'Now'], 'kentucky-30-mw-greenfield-data-center-site'),
    'nc18': (['North Carolina', '18 MW live, path past 100 MW', '~200 acres', 'Now'], 'north-carolina-18-mw-ai-campus-207-acres-for-sale'),
    'nd15': (['North Dakota', '15 MW off-grid, managed containers', 'Various', 'Now'], 'north-dakota-mining-power-off-grid-and-managed-containers'),
    'ky8': (['Kentucky', 'Seven turnkey sites, 0.5 to 8 MW', 'Mostly owned', 'Now'], 'kentucky-turnkey-bitcoin-mining-sites-for-sale'),
    'pa5': (['Pennsylvania', '5 MW turnkey', 'Land available', 'Now'], 'pennsylvania-5-mw-turnkey-mining-site-for-sale'),
    'ok5': (['Oklahoma', 'Two 5 MW turnkey sites', 'Owned acres', 'Now'], 'oklahoma-5-mw-turnkey-mining-site-for-sale'),
    'ia2': (['Iowa', '2 MW turnkey, to 7 MW', 'Owned acre', 'Now'], 'iowa-2-mw-turnkey-mining-site-scalable-7-mw'),
    'hou3': (['Texas (Houston)', '3 MW ERCOT', 'Leased', 'Now'], 'houston-texas-3-mw-ercot-mining-site-for-sale'),
    'ia2e': (['Iowa', '2 MW+ edge site', 'Leased', 'Now'], 'iowa-2-mw-ai-edge-site-at-a-power-plant'),
    'host': (['US', '11 hosting sites', 'Hosted', 'Now'], 'bitcoin-mining-hosting-capacity-us'),
    'early': (['US', '20 earlier listings, 0.25 to 30 MW', 'Various', 'Status on a call'], 'earlier-powered-site-and-hosting-listings'),
}

S = {  # shared sources, all already cited elsewhere on the site
    'paces': ('Grid planning for data centers and transmission investment', 'https://www.paces.com/white-papers/grid-planning-data-centers-transmission-investment', 'Paces'),
    'uptime-pue': ('Large data centers are mostly more efficient, analysis confirms', 'https://journal.uptimeinstitute.com/large-data-centers-are-mostly-more-efficient-analysis-confirms/', 'Uptime Institute'),
    'nvl72': ('Nvidia offers 120 kW liquid-cooled Blackwell rack as industry standard', 'https://www.eenewseurope.com/en/nvidia-offers-120kw-liquid-cooled-blackwell-rack-as-industry-standard', 'eeNews Europe'),
    'comed': ('ComEd guidelines on land requirements for interconnection substations', 'https://www.pjm.com/-/media/DotCom/planning/plan-standards/private-ce/comed-guidelines-on-land-requirements-for-interconnection-substations.pdf', 'ComEd via PJM'),
    'pseg': ('Data centers: construction and renovation services', 'https://nj.pseg.com/businessandcontractorservices/constructionandrenovationservices/datacenters', 'PSE&G'),
    'aep-dct': ('Data center tariff', 'https://www.aepohio.com/company/about/rates/data-center-tariff', 'AEP Ohio'),
    'lbnl': ('Electricity rate designs for large loads (August 2026)', 'https://eta-publications.lbl.gov/sites/default/files/2026-08/rate_designs_large_loads_2026.08.10.pdf', 'Lawrence Berkeley National Laboratory and The Brattle Group'),
    'dominion': ('Data center requests', 'https://www.dominionenergy.com/virginia/large-business-services/data-center-requests', 'Dominion Energy'),
    'sb6': ('Senate Bill 6, 89th Legislature', 'https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00006F.htm', 'Texas Legislature Online'),
    'ercot-bz': ('Batch Zero update, September 2026', 'https://www.ercot.com/files/docs/2026/09/11/14-Batch-Zero-Update.pdf', 'ERCOT'),
    'gov-tceq': ('Governor Abbott directs TCEQ to halt data center permits', 'https://gov.texas.gov/news/post/governor-abbott-directs-tceq-to-halt-data-center-permits', 'Office of the Texas Governor'),
    'ud-texas': ('Texas PUC adopts data center interconnection rules', 'https://www.utilitydive.com/news/texas-puc-adopts-data-center-interconnection-rules/830899/', 'Utility Dive'),
    'pjm-fcst': ("PJM's updated 20-year forecast continues to see significant long-term load growth", 'https://insidelines.pjm.com/pjms-updated-20-year-forecast-continues-to-see-significant-long-term-load-growth/', 'PJM Inside Lines'),
    'homer-city': ('Major AI data center planned for former Pennsylvania coal power plant', 'https://www.datacenterknowledge.com/data-center-construction/major-ai-data-center-planned-for-former-pennsylvania-coal-power-plant', 'Data Center Knowledge'),
    'pjm-replacement': ('FERC approves streamlined process to replace retiring facilities', 'https://insidelines.pjm.com/ferc-approves-streamlined-process-to-replace-retiring-facilities/', 'PJM Inside Lines'),
    'eia-860m': ('Preliminary monthly electric generator inventory (EIA-860M)', 'https://www.eia.gov/electricity/data/eia860m/', 'U.S. Energy Information Administration'),
    'dcwatch': ('Data Center Watch Q1 2026 report', 'https://datacenterwatch.org/q1-2026', 'Data Center Watch'),
    'tucson': ('Tucson City Council votes to end Project Blue', 'https://www.azfamily.com/2025/08/06/tucson-city-council-votes-end-project-blue/', "Arizona's Family"),
    'pima-rules': ('Pima County planners advance changes to data center rules', 'https://www.kold.com/2026/10/29/pima-county-planners-advance-changes-data-center-rules/', 'KOLD'),
    'indy': ('Google withdraws Southside data center proposal in Franklin Township', 'https://mirrorindy.org/google-withdraws-southside-data-center-proposal-franklin-township/', 'Mirror Indy'),
    'fairwater': ("Inside the world's most powerful AI datacenter", 'https://blogs.microsoft.com/blog/2025/09/18/inside-the-worlds-most-powerful-ai-datacenter/', 'Microsoft'),
    'duke': ('Duke Energy earnings and the Anderson gas plant', 'https://www.utilitydive.com/news/duke-energy-earnings-anderson-gas-plant/819428/', 'Utility Dive'),
    'stcharles': ('St. Charles County approves half-year ban on data center projects', 'https://www.stlpr.org/government-politics-issues/2026-07-14/st-charles-county-officials-approve-half-year-ban-on-data-center-projects-alter-senior-tax-freeze', 'St. Louis Public Radio'),
    'ercot-dr': ('Load participation in ERCOT markets', 'https://www.ercot.com/services/programs/load', 'ERCOT'),
    'ferc-rto': ('Electric power markets', 'https://www.ferc.gov/electric-power-markets', 'Federal Energy Regulatory Commission'),
    'gev': ('GE Vernova gas turbine backlog climbs to 116 GW', 'https://www.utilitydive.com/news/ge-vernova-gas-turbine-backlog-climbs-to-116-gw/826039/', 'Utility Dive'),
    'epa-titlev': ('Who has to obtain a Title V permit', 'https://www.epa.gov/title-v-operating-permits/who-has-obtain-title-v-permit', 'US EPA'),
    'crusoe': ('Crusoe expands AI data center campus in Abilene to 1.2 gigawatts', 'https://crusoe.ai/newsroom/crusoe-expands-ai-data-center-campus-in-abilene-to-1-2-gigawatts', 'Crusoe'),
    'meta-hyperion': ('Meta expands Louisiana data center campus to 5 GW', 'https://baxtel.com/news/meta-expands-louisiana-data-center-campus-to-5gw', 'Baxtel'),
}
CITE = {
    'paces': ('Paces', '17%'), 'comed': ('ComEd',), 'pseg': ('PSE&G',), 'aep-dct': ('AEP Ohio',), 'lbnl': ('Berkeley Lab',),
    'uptime-pue': ('Uptime Institute',), 'pjm-fcst': ('20-year forecast', 'PJM’s'), 'ercot-bz': ('470 GW', 'Batch Zero', 'August 2026'),
    'sb6': ('SB 6',), 'ferc-rto': (), 'ud-texas': ('$100,000',), 'gev': ('GE Vernova',), 'epa-titlev': ('Title V',), 'crusoe': ('Crusoe',),
    'meta-hyperion': ('Hyperion',), 'pjm-replacement': ('replacement generation', 'retiring generation'), 'dcwatch': ('Data Center Watch',),
    'tucson': ('Tucson',), 'pima-rules': ('Pima',), 'indy': ('Franklin Township',), 'fairwater': ('Fairwater',), 'duke': ('generation for growing load',),
    'homer-city': ('Homer City',), 'eia-860m': ('EIA-860M',), 'ercot-dr': ('demand response',), 'gov-tceq': ('TCEQ',),
}
STATE_SRC = lambda code, name: ('eia-' + code.lower(), (f'{name} state energy profile', f'https://www.eia.gov/state/?sid={code}', 'U.S. Energy Information Administration'))

SIZES = ['1', '5', '10', '20', '30', '40', '50', '100', '200', '300', '500', '1000']
STATES = ['texas', 'pennsylvania', 'ohio', 'arizona', 'iowa', 'nevada', 'indiana', 'wisconsin', 'kentucky', 'oklahoma', 'kansas', 'north-dakota', 'new-york', 'oregon', 'north-carolina']

def size_slug(mw):
    return '1-gw-data-center-site' if mw == '1000' else f'{mw}-mw-data-center-site'

def size_label(mw):
    return '1 GW' if mw == '1000' else f'{mw} MW'

def state_slug(s):
    return f'data-center-sites-for-sale-{s}'

def links_block():
    """Crawlable cross-links to every size page and every state page."""
    return [
        {'type': 'links', 'label': 'Find a site by size', 'items': [{'label': f'{size_label(m)} data center site', 'slug': size_slug(m)} for m in SIZES]},
        {'type': 'links', 'label': 'Find a site by state', 'items': [{'label': f'Data center sites in {STATE[s]["name"]}', 'slug': state_slug(s)} for s in STATES]},
        {'type': 'links', 'label': 'Site selection guides', 'items': [
            {'label': 'How to find a data center site in the US', 'slug': PILLAR},
            {'label': 'All powered land for sale', 'slug': HUB},
            {'label': 'Five rungs of power evidence', 'slug': 'power-evidence-data-center-site-verification'},
            {'label': 'Will-serve letter vs load study vs ESA', 'slug': 'utility-will-serve-letter-load-study-esa'},
            {'label': 'Acres per MW', 'slug': 'data-center-land-acres-per-mw'},
            {'label': 'Moratorium screening', 'slug': 'data-center-moratorium-local-opposition-site-screening'},
            {'label': 'Behind-the-meter power', 'slug': 'behind-the-meter-power-for-data-centers'},
            {'label': 'Retired power plant sites', 'slug': 'retired-power-plant-sites-for-data-centers'},
        ]},
    ]

def inv_table(keys, intro):
    return [
        {'type': 'paragraph', 'text': intro},
        {'type': 'table', 'columns': ['Region', 'Power', 'Land', 'Timing'], 'rows': [INV[k][0] for k in keys]},
        {'type': 'paragraph', 'text': 'Exact locations, the utility documents behind each MW figure and pricing are shared on a call. We also hold sites that are not listed publicly; owners ask for discretion and a site that is shopped everywhere loses value.'},
    ]

def racks(facility_mw, pue=1.3, kw=120):
    it = facility_mw / pue
    n = it * 1000 / kw
    return it, n

def fmt(x):
    if x >= 100: return f'{round(x, -1):,.0f}'
    if x >= 10: return f'{x:,.0f}'
    return f'{x:.1f}'.rstrip('0').rstrip('.')

# ---------------------------------------------------------------- size pages
SIZE = {
 '1': dict(
   title='1 MW data center site: where to find powered space for a 1 MW load in the US',
   desc='Find a 1 MW data center site in the US: energized edge, inference and mining sites, what 1 MW really fits, the service you need and how fast it can be live.',
   buyer='edge inference, a small GPU pod, enterprise compute or a bitcoin mining deployment',
   intro='A 1 MW data center site is the easiest size to find and the easiest to get wrong. At this scale you are almost always on the utility distribution system, so the fastest sites are buildings or yards that already have the service in place. A new 1 MW service can take longer than people expect because of transformer lead times and feeder upgrades. Invariant keeps a running list of energized small sites across the US, from 0.5 MW turnkey mining yards to Tier III rooms, and shares the ones that fit on a call.',
   take=['1 MW at the meter is about 0.75 MW of IT at a PUE of 1.3. That is roughly six 120 kW AI racks, or a few hundred air-cooled mining machines.', 'At this size the question is the existing service: voltage, transformer rating and whether the feeder has room. A site that already has it can be live in weeks.', 'Land is rarely the issue. A containerized 1 MW deployment fits on well under an acre.', 'Ask for a recent utility bill or a service letter showing the transformer and the contracted capacity, not a map of nearby lines.'],
   voltage='Utility distribution service. Usually a pad-mounted transformer stepping a 12 to 35 kV feeder down to 480 V, sometimes primary service at the feeder voltage.',
   land='Under 1 acre for containers; a small warehouse or retrofit room for a built facility.',
   timing='Weeks if the service exists. New service can run from a few months to more than a year where transformers or feeder work are on order.',
   docs='Recent utility bills, the service agreement or contract demand, the transformer nameplate, and a note from the utility on any headroom above the current load.',
   sec=[('Where 1 MW sites come from', [
       'Most 1 MW sites we see are one of four things: a light industrial building with a large existing service, a small mining yard with containers already wired, a room inside a colocation facility, or a spot inside the fence of a power plant or industrial user that has spare capacity on its own transformers.',
       'Each has a different catch. Industrial buildings often have the amps but not the cooling. Mining yards have power and airflow but no redundancy. Colocation rooms are fast and expensive per kW. Plant sites can be the cheapest power you will ever see, with the least flexibility on hours and terms.']),
     ('What to check before you sign', [
       'Confirm the contracted capacity on the bill, not the panel rating. A building with a 4,000 A switchboard at 480 V can in theory carry more than 3 MW, yet its utility contract and transformer may cap it far lower.',
       'Ask whether the power is firm or interruptible. Many small mining sites run on curtailable rates. That suits miners and does not suit an inference customer with an uptime promise.'])],
   faq=[('How much power is 1 MW for a data center?', '1 MW at the meter supports about 0.7 to 0.8 MW of IT load at a PUE between 1.25 and 1.4. That is roughly six GB200 NVL72 racks at about 120 kW each, around 430 GPUs, or 20 to 40 standard enterprise racks at 20 to 30 kW.'),
        ('How fast can I get a 1 MW data center site?', 'If the building or yard already has a 1 MW service and the utility confirms headroom, you can be live in weeks. New service depends on the utility and transformer supply and can take several months to more than a year.'),
        ('How much land does a 1 MW data center need?', 'Very little. Containerized deployments fit on well under an acre. A built facility can sit in an existing industrial building. Setbacks, generator space and noise rules matter more than raw acreage.')],
   inv=['ky8', 'ia2', 'ia2e', 'hou3', 'host', 'early'], src=['nvl72', 'uptime-pue']),
 '5': dict(
   title='5 MW data center site: finding energized power for a 5 MW load in the US',
   desc='Find a 5 MW data center site in the US: turnkey energized sites, how many racks 5 MW fits, the feeder and transformer you need and how long new service takes.',
   buyer='an inference cluster, a regional colocation room, an enterprise build or a mining expansion',
   intro='5 MW is where a data center site stops being a building with a big service and starts needing its own utility plan. A 5 MW load is usually still on a distribution feeder, often a dedicated one, and that feeder decides the timeline. Turnkey 5 MW sites with transformers already energized come up regularly in mining markets, and they convert well to inference and edge use if the power is firm. Invariant tracks several of them across the US right now.',
   take=['5 MW at the meter is about 3.8 MW of IT at a PUE of 1.3, roughly 32 AI racks at 120 kW, or 2,300 GPUs.', 'Expect medium-voltage distribution service, often a dedicated 12 to 35 kV feeder and several pad-mounted transformers.', 'Turnkey mining sites at 5 MW can be live immediately. Check whether the rate is interruptible before you plan an uptime promise around it.', 'Land: 1 to 5 acres covers most layouts, more if you add generators and cooling yards.'],
   voltage='Medium-voltage distribution, typically 12.47 to 34.5 kV, often a dedicated feeder or a large share of one, with several transformers on site.',
   land='About 1 to 5 acres depending on containers versus a built hall and whether backup generation sits on site.',
   timing='Immediate for energized turnkey sites. New service commonly runs 9 to 24 months where a feeder extension or substation bay is needed.',
   docs='Contract demand on the bill, the utility one-line diagram, transformer ratings, a written statement of feeder headroom, and the rate schedule (firm or curtailable).',
   sec=[('Why 5 MW sites move fast or not at all', [
       'A single 12.47 kV distribution feeder carries roughly 8 to 12 MW in normal operation, and utilities rarely give one customer most of it. So a new 5 MW load often means a dedicated feeder from the substation, a new breaker position or a new circuit, and each of those has its own queue and equipment lead time.',
       'That is why energized 5 MW sites trade at a premium. The value is in the transformers and the feeder that are already there, with the utility already billing the account.']),
     ('Converting a 5 MW mining site to AI or inference', [
       'Mining sites at this size have the power and usually the airflow. What they lack is redundancy, backup generation and a building that meets an enterprise tenant’s checklist. Budget for UPS, generators, fire protection and either liquid cooling or a new hall. Keep the utility service and the land; plan to rebuild most of the rest. Our guide on converting mining sites covers this in more detail.'])],
   faq=[('How many GPUs fit in a 5 MW data center?', 'At a PUE of 1.3, 5 MW at the meter leaves about 3.8 MW for IT. At about 120 kW per GB200 NVL72 rack, that is roughly 32 racks and 2,300 GPUs. Air-cooled H100-class deployments at 40 to 50 kW per rack would fit 75 to 95 racks.'),
        ('Is a 5 MW data center on transmission or distribution power?', 'Usually distribution, at 12.47 to 34.5 kV, often on a dedicated feeder. Some utilities serve 5 MW from a small customer substation tapped off a 69 kV line.'),
        ('Where can I find a 5 MW data center site for sale?', 'Invariant currently lists energized 5 MW turnkey sites in Pennsylvania and Oklahoma, plus smaller expandable sites in Kentucky and Iowa and three built Tier III facilities between 3.5 and 10 MW. Locations and terms are shared on a call.')],
   inv=['pa5', 'ok5', 'ky8', 'ia2', 't3', 'early'], src=['nvl72', 'uptime-pue']),
 '10': dict(
   title='10 MW data center site: how to find powered land for a 10 MW AI or colocation build',
   desc='Find a 10 MW data center site in the US: the utility service a 10 MW load needs, land and rack math, timelines for new service, and 10 MW sites available now.',
   buyer='a GPU inference cluster, a regional colocation facility, a neocloud pod or a mining operation',
   intro='10 MW is the most common first ask we hear from AI inference companies and neoclouds, and it sits on an awkward line. It is too big for most existing commercial services and too small for most utilities to prioritize like a hyperscale load. The sites that work at 10 MW are ones where the substation capacity already exists: built Tier III rooms, energized mining sites, hydro and plant-adjacent sites, and industrial brownfields. Invariant lists several now and finds others off-market.',
   take=['10 MW at the meter is about 7.7 MW of IT at a PUE of 1.3, roughly 64 AI racks at 120 kW, about 4,600 GPUs.', 'Expect either two or more dedicated distribution feeders or a small customer substation on a 69 to 138 kV line.', 'The fastest 10 MW is a built facility or an energized site. New service often takes 12 to 24 months and longer where a substation is needed.', 'Land: 3 to 15 acres for most builds.'],
   voltage='Dedicated 12.47 to 34.5 kV feeders, or a customer substation on a 69 to 138 kV line.',
   land='About 3 to 15 acres, depending on stories, cooling type and generator yards.',
   timing='Now for built or energized sites. 12 to 24 months is common for new service where the substation has room, more where it does not.',
   docs='A will-serve letter naming MW and a point of service at minimum; a load study or service agreement for anything you plan to finance.',
   sec=[('What a 10 MW buyer should screen for', [
       'Start with the substation. Ask the utility, or ask us, whether the station that would serve the site has 10 MW of withdrawal headroom today and under contingency. In a 2025 analysis of ERCOT, Paces found only about 17% of substations near suitable land had positive withdrawal headroom. Proximity alone means little.',
       'Then check redundancy. Many 10 MW sites have one feeder. That is fine for mining and risky for a customer contract with a service level. A second feeder from a different substation bus can cost more than the land.']),
     ('Built facilities versus greenfield at 10 MW', [
       'Buying or leasing a built 10 MW facility skips the utility queue and most permitting. You pay for it in price per MW and in being stuck with the cooling design. Greenfield at 10 MW rarely pencils unless the power is already there. That is why most 10 MW deals we close start from an energized site or an existing building.'])],
   faq=[('How much land does a 10 MW data center need?', 'Roughly 3 to 15 gross acres. Multi-story builds and liquid-cooled AI halls sit at the low end; single-story campuses with generator yards and buffers sit at the high end. A containerized mining site of 10 MW can fit on 2 to 5 acres.'),
        ('How long does it take to get 10 MW of power for a data center?', 'If the site is energized or a built facility, immediately. For new service with substation headroom, 12 to 24 months is common. If the substation needs a new transformer or the line needs upgrades, expect longer.'),
        ('How many GPUs can a 10 MW data center run?', 'About 4,600 Blackwell-class GPUs in GB200 NVL72 racks at a PUE of 1.3, or roughly 64 racks at 120 kW. Lower-density air-cooled designs fit fewer GPUs per MW.')],
   inv=['or10', 't3', 'ky8', 'nd15', 'tx17', 'early'], src=['paces', 'nvl72', 'uptime-pue']),
 '20': dict(
   title='20 MW data center site: finding power and land for a 20 MW load in the US',
   desc='Find a 20 MW data center site in the US: substation and voltage needs for 20 MW, land and GPU math, timelines, and 15 to 20 MW sites live or near-ready now.',
   buyer='a neocloud cluster, an AI inference build, a colocation hall or a mid-size mining facility',
   intro='At 20 MW most sites need their own substation, and that changes the search. You are no longer looking for a building with a big service; you are looking for a transmission or sub-transmission line with room, land next to it, and a utility willing to study the load. Energized sites in the 15 to 20 MW range exist, mostly from mining and industrial users, and they are the fastest path. Invariant lists several and tracks more that are not public.',
   take=['20 MW at the meter is about 15 MW of IT at a PUE of 1.3, roughly 128 AI racks at 120 kW, or 9,200 GPUs.', 'Plan for a customer substation on a 69 to 138 kV line. About 2.5 to 3 acres for the substation alone is a useful starting figure.', 'Energized 15 to 20 MW sites are live now in Texas, North Carolina and North Dakota in our inventory.', 'Ask for a load study for 20 MW at the named point of service. A will-serve letter alone does not reserve capacity.'],
   voltage='Customer substation fed at 69 to 138 kV, or several dedicated 34.5 kV feeders in some service territories.',
   land='About 8 to 30 acres, including roughly 2.5 to 3 acres for the substation.',
   timing='Now for energized sites. 18 to 36 months for new service with a substation, depending on utility queue and transformer delivery.',
   docs='A load study or facilities study for 20 MW, a cost estimate for the substation, and any construction or service agreement with the energization date.',
   sec=[('Substation land and the 20 MW threshold', [
       'PSE&G’s data center guidance lists about 2.5 acres of equipment space for a customer substation at 69, 138 or 230 kV. ComEd’s 2026 guidelines put a 138 kV interconnection substation at about 3.1 acres, before stormwater detention. At 20 MW those acres are a real share of the site, and the substation has to sit near the line, reachable for future circuits.',
       'Studies start to cost money at this size too. AEP Ohio, for example, routes data center requests of 25 MW and up through a formal process with study fees. Utilities ask for site control first, which is why a completed study is worth more than any map.']),
     ('Energized 15 to 20 MW sites', [
       'The fastest 20 MW sites are ones already drawing power. A former mining yard or a closed industrial plant with an active service can often take an AI or HPC tenant in months, subject to a utility review of the new use. Check whether the existing contract allows the new load profile, and whether the service is firm.'])],
   faq=[('Does a 20 MW data center need its own substation?', 'Usually yes. Most utilities serve 20 MW from a dedicated customer substation on a 69 to 138 kV line. Some territories serve it from several 34.5 kV feeders instead.'),
        ('How long does it take to get 20 MW for a data center?', 'Energized sites can be live in months. New service with a substation commonly takes 18 to 36 months, longer where the transmission line or transformer supply is constrained.'),
        ('Where can I find a 20 MW data center site?', 'Invariant lists a 17 MW greenfield in the Houston load zone, an 18 MW live campus in North Carolina with a path past 100 MW, a 15 MW off-grid site in North Dakota and an Iowa site that starts at 20 MW. Details are shared on a call.')],
   inv=['tx17', 'nc18', 'nd15', 'ia500', 'or10'], src=['pseg', 'comed', 'aep-dct', 'nvl72']),
 '30': dict(
   title='30 MW data center site: where to find 30 MW of power for an AI or HPC build',
   desc='Find a 30 MW data center site in the US: what 30 MW of IT really needs at the meter, substation and land sizing, study fees and 30 MW sites available now.',
   buyer='an AI training or inference cluster, a neocloud expansion, an enterprise campus or a mining build',
   intro='30 MW is a popular target for AI companies building their first owned site. It is large enough to need a customer substation and a utility study, and small enough that many utilities can still serve it without major transmission upgrades. That makes the right 30 MW site findable in months, if you search from substation headroom first. Invariant has a rezoned 30 MW greenfield in Kentucky and several expandable sites that cover the range.',
   take=['A 30 MW facility at a PUE of 1.3 carries about 23 MW of IT, roughly 190 AI racks at 120 kW, about 13,800 GPUs.', 'If someone says 30 MW, ask whether they mean IT load or facility load. The difference at 30 MW is 7 to 12 MW.', 'Plan for a 69 to 138 kV customer substation and 10 to 45 acres all in.', 'Study fees and site-control rules apply in many territories at 25 MW and above.'],
   voltage='Customer substation at 69 to 138 kV, occasionally 230 kV.',
   land='About 10 to 45 gross acres.',
   timing='Now for energized sites; 18 to 36 months for new service where a substation and line tap are needed.',
   docs='A load study for the full 30 MW with a ramp schedule, a facilities cost estimate and the large-load tariff terms (minimum bill, contract term).',
   sec=[('IT MW versus facility MW at 30 MW', [
       'Uptime Institute put the average PUE in its survey at 1.58 for 2023, and 1.47 weighted by IT capacity, with new hyperscale builds designed at 1.4 or below. A buyer who needs 30 MW of IT at a PUE of 1.3 needs 39 MW at the meter. A site marketed as 30 MW may deliver 23 MW of IT. Settle which number you mean before you compare listings.']),
     ('Large-load tariffs start to bite', [
       'Many utilities now apply special terms to data centers above about 25 MW. AEP Ohio’s data center tariff and study process are a public example. The Berkeley Lab and Brattle review of large-load tariffs found minimum bills near 80 to 85% of contract demand and terms of 12 to 15 years are common. Model those terms in the deal; they can matter more than the energy rate.'])],
   faq=[('How many acres does a 30 MW data center need?', 'Roughly 10 to 45 gross acres, depending on cooling, stories, generator yards and substation layout. A 138 kV substation alone needs about 3 acres before stormwater detention.'),
        ('Is 30 MW the IT load or the total load?', 'It depends on who is quoting. Utilities sell facility load. Tenants usually ask for IT load. At a PUE of 1.3, 30 MW of IT needs 39 MW at the meter.'),
        ('Where can I find a 30 MW data center site?', 'Invariant lists a 30 MW rezoned greenfield in Kentucky, a 44 MW Texas metro property with expansion, an 18 MW North Carolina campus with a path past 100 MW and an Iowa site from 20 MW. More are available off-market on a call.')],
   inv=['ky30', 'tx44', 'nc18', 'ia500', 'early'], src=['uptime-pue', 'aep-dct', 'lbnl', 'comed']),
 '40': dict(
   title='40 MW data center site: finding a powered site for a 40 MW AI or colocation campus',
   desc='Find a 40 MW data center site in the US: substation, land and GPU math for 40 MW, the documents that prove the power, and 40 to 55 MW sites available now.',
   buyer='an AI cloud provider, a colocation developer, an HPC tenant or a mining operator',
   intro='A 40 MW data center site sits in the range where buyers have the most choice and the most risk of overpaying for paper. Plenty of listings claim 40 MW. Fewer can show a utility study for it. The ones worth a call usually have an existing energized service, a former industrial load, or a signed study at a named substation. Invariant has energized options in Texas and Oklahoma around this size.',
   take=['40 MW at the meter is about 31 MW of IT at a PUE of 1.3, roughly 255 AI racks or 18,400 GPUs.', 'A 40 MW claim with no utility document behind it is a lead, not a site. Grade it on the five-rung evidence ladder.', 'Customer substation at 69 to 230 kV, 15 to 60 acres all in.', 'Energized sites at 44 MW (Texas) and 55 MW (Oklahoma) are available through Invariant now.'],
   voltage='Customer substation at 69 to 230 kV; two lines or a ring bus if the tenant needs redundancy.',
   land='About 15 to 60 gross acres.',
   timing='Now to 12 months for energized brownfields; 2 to 4 years for new service in a constrained territory.',
   docs='A load study or service agreement for 40 MW, the ramp schedule, and evidence the substation has headroom under contingency.',
   sec=[('Grade the 40 MW claim', [
       'We sort power claims into rungs. A map with a line on it is rung 0. Proximity to a station of the right voltage is rung 1. A named MW figure at a named station is rung 2. A utility study for this load is rung 3. A signed agreement with a date, or service already energized and metered, is rung 4. Most 40 MW listings sit at rung 1 or 2. A buyer should pay for rung 3 and up.']),
     ('Brownfields are the fast path', [
       'Former factories, closed mills and older data centers often hold a 40 MW service that was built decades ago. The utility relationship and the substation already exist. The work is a new load study for the changed use, an environmental check and a building plan. That usually beats a greenfield on time by a year or more.'])],
   faq=[('How many GPUs fit in 40 MW?', 'At a PUE of 1.3, 40 MW at the meter supports about 31 MW of IT, roughly 255 GB200 NVL72 racks at 120 kW, which is about 18,400 GPUs.'),
        ('What voltage does a 40 MW data center need?', 'Typically a customer substation fed at 69 to 230 kV. The utility picks the voltage based on the nearby system and the load ramp.'),
        ('Where can I find a 40 MW data center site?', 'Invariant lists a 44 MW Texas metro property with a path to 250 MW more, a 55 MW contracted brownfield in Oklahoma and a 30 MW Kentucky greenfield. Details and documents are shared on a call.')],
   inv=['tx44', 'okc55', 'ky30', 'ia500'], src=['paces', 'nvl72', 'uptime-pue']),
 '50': dict(
   title='50 MW data center site: how to find 50 MW of power for an AI data center',
   desc='Find a 50 MW data center site in the US: what 50 MW needs from the utility, land and rack math, large-load tariff terms and 50 to 85 MW sites available now.',
   buyer='an AI training or inference campus, a colocation developer, a hyperscale edge build or a large mining operation',
   intro='50 MW is the line where many utilities start treating a data center as a large load with its own tariff, study fees and collateral. It is also the smallest size many AI tenants will consider for a training build. A good 50 MW site has a study or contract for the power, room for a substation and enough land for a second phase. Invariant has contracted and energized sites from 55 to 85 MW and expandable sites that cover 50 MW in phase one.',
   take=['50 MW at the meter is about 38 MW of IT at a PUE of 1.3, roughly 320 AI racks at 120 kW, about 23,000 GPUs.', 'AEP Ohio charges $50,000 to study a data center load of 50 to under 100 MW. Expect fees, site-control proof and collateral in most territories.', 'Large-load tariffs commonly set minimum bills near 80 to 85% of contract demand for 12 to 15 years.', 'Energized or contracted options at 55, 60, 80 and 85 MW are in our inventory now.'],
   voltage='Customer substation at 115 to 230 kV, sometimes 345 kV; redundancy usually needs two lines.',
   land='About 25 to 100 gross acres.',
   timing='Now for contracted or energized sites. 2 to 4 years for new service in most US markets.',
   docs='A completed load or facilities study, the large-load tariff schedule, a construction or service agreement and any collateral requirement.',
   sec=[('What changes at 50 MW', [
       'Utilities have moved fast to set terms for large loads. The Berkeley Lab and Brattle review of 55 large-load tariffs found study requirements, minimum bills and long contract terms spreading through 2025 and 2026. AEP Ohio’s process for loads of 25 MW and above, with study fees stepping up at 50 and 100 MW, is a public example. Read the tariff before you value the site.',
       'In Texas, SB 6 rules start at 75 MW, so a 50 MW load in ERCOT sits below the new large-load threshold. That can be a reason to size phase one under 75 MW.']),
     ('Fast 50 MW', [
       'Existing plants and brownfields are the quickest. A former peaker, an industrial plant or a mining campus with a contracted service can move in under a year. A 60 MW gas plant site in New York and a 55 MW contracted brownfield in Oklahoma are examples from our list.'])],
   faq=[('How much does it cost to study a 50 MW data center load?', 'It varies by utility. AEP Ohio charges $50,000 for data center loads of 50 MW to under 100 MW and $10,000 for loads above 25 MW and under 50 MW. Texas set a flat $100,000 study fee for large loads of 75 MW and up under SB 6 rules.'),
        ('How many acres does a 50 MW data center need?', 'Roughly 25 to 100 gross acres, including the substation, cooling yards, generators, stormwater and buffers. Multi-story or liquid-cooled designs use less.'),
        ('Where can I find a 50 MW data center site?', 'Invariant lists a 55 MW contracted brownfield in Oklahoma, a 60 MW+ power plant site in New York, an 85 MW Midwest brownfield and a Wisconsin site with 80 MW available now. Locations and documents are shared on a call.')],
   inv=['okc55', 'ny60', 'mw85', 'wi150', 'tx44'], src=['aep-dct', 'lbnl', 'ud-texas', 'nvl72']),
 '100': dict(
   title='100 MW data center site: finding powered land for a 100 MW AI campus in the US',
   desc='Find a 100 MW data center site in the US: transmission service, 50 to 150 acres, study and tariff terms, how long 100 MW takes and 85 to 150 MW sites available now.',
   buyer='an AI training campus, a hyperscale or colocation developer, or a large HPC tenant',
   intro='A 100 MW data center site is a transmission project. The load connects at 138 kV or higher, the utility runs a formal study, and in many markets the grid operator weighs in. In 2026 the hard part is finding a site where 100 MW can actually be delivered on a known date. Land is usually easy. Invariant screens 100 MW candidates from power evidence first, and has energized and studied sites from 85 to 150 MW plus larger campuses that start with a 100 MW phase.',
   take=['100 MW at the meter is about 77 MW of IT at a PUE of 1.3, roughly 640 AI racks at 120 kW, about 46,000 GPUs.', 'Expect 138 to 345 kV service. A 345 kV interconnection substation needs about 8.5 to 16.5 acres by ComEd’s 2026 guidelines.', 'Land: 50 to 150 gross acres for a hyperscale or AI campus.', 'In Texas a 100 MW load falls under SB 6 and ERCOT Batch Zero. In PJM, expect long studies and large-load tariff terms.'],
   voltage='138 to 345 kV transmission service with a dedicated substation; two lines for redundancy.',
   land='About 50 to 150 gross acres.',
   timing='Now to 18 months for energized or contracted sites; 3 to 5 years is common for new 100 MW service in constrained markets.',
   docs='A system impact or load study for 100 MW, a facilities study with cost and schedule, and a signed service or construction agreement for anything you underwrite.',
   sec=[('Why 100 MW is hard in 2026', [
       'Queues filled up. ERCOT’s large-load queue passed 470 GW in 2026, far above what it could study. PJM’s 20-year forecast shows steep load growth driven largely by data centers. Utilities responded with study fees, collateral and minimum bills. A 100 MW site with a study and an agreement is worth far more than one with only land and a nearby line.',
       'Paces found in ERCOT that only about 17% of substations near suitable land had any withdrawal headroom. A 100 MW buyer should screen substations first and parcels second.']),
     ('Where 100 MW sites come from', [
       'The best 100 MW sites we see come from four places: retired or retiring power plants with switchyards and land, energized mining campuses with large services, brownfield industrial plants, and utility or economic development marketed sites with a completed study. Each has its own diligence list, covered in our guides on retired plants, mining conversions and power evidence.'])],
   faq=[('How long does it take to get 100 MW of power for a data center?', 'Energized or contracted sites can be ready within 18 months. New 100 MW service commonly takes 3 to 5 years in constrained markets, driven by studies, transmission upgrades and transformer supply.'),
        ('How many acres does a 100 MW data center need?', 'Roughly 50 to 150 gross acres for a hyperscale or AI campus, including substation, cooling, generators, stormwater and buffers. A mining site of the same size can fit on 20 to 50 acres.'),
        ('Where can I find a 100 MW data center site for sale?', 'Invariant lists an 85 MW Midwest brownfield, a Wisconsin site with 150 MW built and 80 MW available now, a North Carolina campus with a path past 100 MW and larger campuses with 100 MW first phases. Documents and locations are shared on a call.')],
   inv=['mw85', 'wi150', 'nc18', 'or10', 'pa350', 'ia500'], src=['paces', 'comed', 'pjm-fcst', 'ercot-bz', 'nvl72']),
 '200': dict(
   title='200 MW data center site: where to find 200 MW of power for an AI campus',
   desc='Find a 200 MW data center site in the US: 230 to 345 kV service, land and GPU math, load studies, behind-the-meter options and 150 to 250 MW sites available now.',
   buyer='a hyperscaler, an AI lab, a large colocation developer or a sovereign or neocloud buyer',
   intro='200 MW sites are rare and getting rarer. A load this size needs a transmission interconnection, often new lines, and a utility that will commit to a ramp. Buyers at 200 MW increasingly look at three shortcuts: a site with a completed load study, a former plant that keeps its switchyard, or on-site gas that bridges until the grid arrives. Invariant has a 200 MW greenfield with a completed load study and several sites in the 150 to 250 MW band.',
   take=['200 MW at the meter is about 154 MW of IT at a PUE of 1.3, roughly 1,280 AI racks at 120 kW, about 92,000 GPUs.', 'Expect 230 to 345 kV service, a 10 to 20 acre substation footprint and 100 to 300 acres all in.', 'A completed load study for 200 MW is the first document worth paying for. Our Indiana site has one.', 'Behind-the-meter gas can bridge the gap. Check turbine supply, air permits and the grid end state.'],
   voltage='230 to 345 kV, often a new switching station and two transmission lines.',
   land='About 100 to 300 gross acres.',
   timing='Under 2 years for sites with studies done or power on site; 4 to 6 years for new 200 MW service in many markets.',
   docs='System impact and facilities studies, a construction agreement with collateral, and the energy service agreement or ramp schedule.',
   sec=[('The substation alone is a project', [
       'ComEd’s 2026 guidelines call for about 8.5 acres for a 345 kV interconnection substation on one line, expandable to about 16.5 acres. PSE&G lists up to 5 acres of customer equipment space at 345 kV. Add the tie-line, access road and stormwater. A 200 MW plan that does not show those acres near the line is a sketch.']),
     ('Behind-the-meter as a bridge', [
       'On-site gas can deliver 200 MW years before the grid in some markets. It brings its own clocks: firm pipeline capacity, an air permit that may trigger Title V, and turbine or engine supply. GE Vernova reported a gas turbine backlog of about 116 GW. Our Pennsylvania site pairs 200 MW of behind-the-meter gas with a 300 MW grid path, and our Kansas site has a path to 250 MW on gas.'])],
   faq=[('How much land does a 200 MW data center need?', 'Roughly 100 to 300 gross acres, including the 345 kV substation, cooling yards, generators, stormwater and buffers. On-site generation adds more.'),
        ('How long does it take to get 200 MW for a data center?', 'With a completed study or power on site, under two years. New service at 200 MW commonly takes 4 to 6 years, driven by transmission work and equipment supply.'),
        ('Where can I find a 200 MW data center site?', 'Invariant lists a 200 MW Indiana greenfield with a completed load study, a Pennsylvania site with 200 MW of behind-the-meter gas plus 300 MW grid, a Kansas gas site with a path to 250 MW and a Wisconsin site with 150 MW built. Details are shared on a call.')],
   inv=['in200', 'pa500', 'ks250', 'wi150', 'tx44'], src=['comed', 'pseg', 'gev', 'epa-titlev', 'nvl72']),
 '300': dict(
   title='300 MW data center site: finding approved power for a 300 MW AI campus',
   desc='Find a 300 MW data center site in the US: 345 kV service, 150 to 450 acres, what an approved or contracted 300 MW looks like and 300 to 375 MW sites available now.',
   buyer='a hyperscaler, a frontier AI lab, a large developer or an infrastructure fund',
   intro='A 300 MW data center site with approved or contracted power is one of the scarcest assets in US real estate right now. Utilities ask for site control, collateral and long minimum-bill contracts before they commit, and grid operators are rationing studies. When a 300 MW site has a signed agreement, buyers move quickly. Invariant lists a 300 MW approved Ohio site, a 350 MW Pennsylvania campus with a signed utility service agreement and a 375 MW Nevada site, and tracks more.',
   take=['300 MW at the meter is about 230 MW of IT at a PUE of 1.3, roughly 1,920 AI racks at 120 kW, about 138,000 GPUs.', 'Expect 345 kV service, often two or more lines and a new switching station.', 'A signed energy service agreement with a ramp is the document to hold out for. Approved is good. Proposed is a lead.', 'Land: 150 to 450 gross acres. Plan the substation corner before the halls.'],
   voltage='345 kV, sometimes 500 kV, with a switching station and two or more lines.',
   land='About 150 to 450 gross acres.',
   timing='1 to 2 years for contracted sites with phased ramps; 5 years or more for new 300 MW service in constrained markets.',
   docs='A signed energy service agreement or construction agreement with the ramp schedule, collateral terms and the large-load tariff schedule.',
   sec=[('Read the ramp, not the headline', [
       'A 300 MW agreement rarely means 300 MW on day one. Our Pennsylvania campus, for example, has 50 MW at end of 2026 and 300 MW at end of 2027 under a signed agreement. Model the ramp against your hardware delivery. A site that can take 50 MW now and 300 MW in a year may beat one that promises 300 MW in three years.']),
     ('PJM and Texas at 300 MW', [
       'In PJM, large data center loads face long studies and capacity-market exposure, and FERC has set rules for co-locating load with generation. In ERCOT, a 300 MW load falls under SB 6, the PUCT’s large-load rules and Batch Zero. Since August 2026 ERCOT has not approved energization of new data centers of 75 MW or more. Outside both, utilities set their own terms. Each path changes what approved means.'])],
   faq=[('How much land does a 300 MW data center need?', 'Roughly 150 to 450 gross acres, including a 345 kV substation, cooling, generators, stormwater and buffers.'),
        ('What does approved power mean for a 300 MW site?', 'It ranges from a completed utility study to a signed energy service or construction agreement with a ramp and collateral. Ask for the document. Only a signed agreement with a date commits the utility.'),
        ('Where can I find a 300 MW data center site?', 'Invariant lists a 300 MW approved site in Ohio, a 350 MW Pennsylvania campus with a signed utility service agreement, a 375 MW Nevada site and a Texas property with 250 MW of expansion. Locations and documents are shared on a call.')],
   inv=['oh300', 'pa350', 'nv375', 'tx44', 'ks250', 'pa500'], src=['lbnl', 'pjm-fcst', 'sb6', 'ercot-bz', 'nvl72']),
 '500': dict(
   title='500 MW data center site: where to find 500 MW of power for a hyperscale AI campus',
   desc='Find a 500 MW data center site in the US: 345 to 500 kV transmission, 250 to 750 acres, gas plus grid strategies, and 375 to 500 MW+ sites available now.',
   buyer='a hyperscaler, a frontier AI lab or a large infrastructure developer',
   intro='At 500 MW the site is a grid project first and a real estate deal second. Few US substations can take 500 MW without new transmission, so most 500 MW sites combine a large grid commitment with on-site generation or a retired plant’s infrastructure. Invariant tracks 500 MW candidates across PJM, MISO, SPP and the West, and currently lists a Pennsylvania site with 200 MW of gas plus 300 MW of grid, an Iowa site scaling past 500 MW and a 375 MW Nevada site.',
   take=['500 MW at the meter is about 385 MW of IT at a PUE of 1.3, roughly 3,200 AI racks at 120 kW, about 230,000 GPUs.', 'Expect 345 or 500 kV service, multiple lines, and transmission upgrades paid for or secured by the customer.', 'Gas plus grid is the common structure: on-site generation for the first phases, grid for the rest.', 'Land: 250 to 750 gross acres, more if solar or generation sits on site.'],
   voltage='345 to 500 kV, a new switching station and multiple transmission lines; sometimes a new generator interconnection too.',
   land='About 250 to 750 gross acres.',
   timing='Phased over 2 to 5 years even on the best sites.',
   docs='Studies for the full load and each phase, transmission upgrade cost allocation, gas supply agreements if on-site generation is used, and the air permit path.',
   sec=[('How 500 MW campuses get built', [
       'Look at the public AI campuses. Crusoe’s Abilene campus reached 1.2 GW with a grid interconnection plus on-site batteries, solar and backup gas turbines. Meta’s Hyperion campus in Louisiana started as a 2 GW plan and expanded to 5 GW. Both paired land with dedicated generation. A 500 MW buyer should expect a similar mix.']),
     ('Retired plants at 500 MW', [
       'A retired coal or gas plant can hold a switchyard, transmission rights of way and hundreds of acres. In PJM and MISO, replacement generation can reuse a retiring unit’s interconnection rights on set terms. The load side still needs its own study. Check coal ash, groundwater and recorded covenants before counting acres.'])],
   faq=[('How many acres does a 500 MW data center need?', 'Roughly 250 to 750 gross acres for the campus. On-site generation and solar can push that much higher.'),
        ('Can a 500 MW data center run on behind-the-meter power?', 'Partly. Many large campuses use on-site gas or batteries for early phases while the grid connection is built. Turbine supply, pipeline capacity and air permits set the pace.'),
        ('Where can I find a 500 MW data center site?', 'Invariant lists a Pennsylvania site with 200 MW of behind-the-meter gas and 300 MW of grid, an Iowa site scaling to 500 MW and beyond, a 375 MW Nevada site and a 350 MW Pennsylvania campus with a signed service agreement. Details on a call.')],
   inv=['pa500', 'ia500', 'nv375', 'pa350', 'az15'], src=['crusoe', 'meta-hyperion', 'pjm-replacement', 'gev', 'nvl72']),
 '1000': dict(
   title='1 GW data center site: finding gigawatt-scale powered land in the US',
   desc='Find a 1 GW or larger data center site in the US: 345 to 765 kV transmission, 500 to 2,000+ acres, phased gas and grid power, and gigawatt sites available now.',
   buyer='a hyperscaler, a frontier AI lab, a sovereign buyer or a gigawatt-scale developer',
   intro='Gigawatt data center sites are the hardest search in the market. A 1 GW load is the size of a large power plant. It needs multiple high-voltage lines, usually new generation, thousands of acres and political support at the county and state level. Every site worth considering has a phased plan where the first few hundred MW come fast and the rest follows the grid. Invariant lists a 1.5 GW first-phase campus in Arizona and tracks gigawatt candidates across the US.',
   take=['1 GW at the meter is about 770 MW of IT at a PUE of 1.3, roughly 6,400 AI racks at 120 kW, about 460,000 GPUs.', 'Expect 345 to 765 kV service, several lines, a new switching station and often dedicated generation.', 'Public gigawatt campuses sit around 0.9 to 1.4 MW per acre. Plan for 500 to 2,000+ acres.', 'County support, water and permitting matter as much as power at this size. Screen for moratoriums before optioning land.'],
   voltage='345 to 765 kV, several transmission lines and a new switching station; often a co-located generation interconnection.',
   land='About 500 to 2,000+ gross acres.',
   timing='Phased over 3 to 7 years. First phases of 100 to 300 MW can come sooner where power is on site.',
   docs='Grid operator and utility studies for each phase, generation interconnection agreements if co-located, gas supply, water supply, air permits and local land-use approvals.',
   sec=[('What gigawatt campuses look like', [
       'Crusoe’s Abilene campus reached 1.2 GW on about 1,100 acres of a wider clean campus, about 1.1 MW per acre. Meta’s Hyperion campus in Louisiana began as a 2 GW plan on 2,250 acres and grew to 5 GW after Meta added roughly 1,400 acres. These are the reference points buyers use.']),
     ('Local approval is half the work', [
       'Data Center Watch tracks billions of dollars in projects blocked or delayed by local opposition. Tucson ended Project Blue in 2025; Pima County is rewriting its rules. A gigawatt site needs a county that wants it, a water plan and a tax structure. Screen those before power, or alongside it.'])],
   faq=[('How many acres does a 1 GW data center need?', 'Public AI campuses sit around 0.9 to 1.4 MW per gross acre, so 1 GW needs roughly 700 to 1,100 acres for the campus, and more if generation or solar sits on site.'),
        ('How long does it take to power a 1 GW data center?', 'Gigawatt campuses phase in over 3 to 7 years. The first 100 to 300 MW can come sooner where a plant, switchyard or on-site generation is already in place.'),
        ('Where can I find a gigawatt data center site in the US?', 'Invariant lists a 1.5 GW first-phase AI campus in Arizona and sites in Iowa and Pennsylvania that scale past 500 MW. Gigawatt-scale options are shared on a call.')],
   inv=['az15', 'ia500', 'pa500', 'nv375'], src=['crusoe', 'meta-hyperion', 'dcwatch', 'tucson', 'pima-rules', 'nvl72']),
}

def size_page(mw):
    d = SIZE[mw]; lab = size_label(mw); fac = float(mw)
    it, n = racks(fac)
    sections = [
        {'id': 'what-fits', 'heading': f'What {lab} actually fits', 'blocks': [
            {'type': 'paragraph', 'text': f'Utilities sell facility load. Tenants buy IT load. At a PUE of 1.3, a {lab} site leaves about {fmt(it)} MW for IT. At about 120 kW per NVIDIA GB200 NVL72 rack, that is roughly {fmt(n)} racks, or about {fmt(n * 72)} GPUs. Air-cooled designs at 30 to 50 kW per rack fit more racks and fewer GPUs per MW. Typical buyers at this size are {d["buyer"]}.', 'sourceIds': ['nvl72', 'uptime-pue'] if 'uptime-pue' in d['src'] else ['nvl72']},
            {'type': 'table', 'columns': [f'{lab} site', 'What to expect'], 'rows': [
                ['IT load at PUE 1.3', f'About {fmt(it)} MW'],
                ['AI racks at 120 kW', f'About {fmt(n)}'],
                ['Utility service', d['voltage']],
                ['Land', d['land']],
                ['Time to power', d['timing']],
                ['Documents to ask for', d['docs']],
            ]},
            {'type': 'paragraph', 'text': 'These ranges are Invariant’s working figures from sites we have screened. They are not published standards, and individual utilities and designs land outside them.'},
        ]},
    ]
    for i, (h, paras) in enumerate(d['sec']):
        blocks = []
        for p in paras:
            text = p
            ids = [k for k, (title, url, pub) in S.items() if k in d['src'] and any(w in p for w in CITE.get(k, ()))]
            b = {'type': 'paragraph', 'text': text}
            if ids: b['sourceIds'] = ids
            blocks.append(b)
        sections.append({'id': f's{i}-' + h.lower().replace(' ', '-').replace('’', '').replace("'", '')[:40].strip('-'), 'heading': h, 'blocks': blocks})
    sections.append({'id': 'sites-available', 'heading': f'{lab} data center sites available now', 'blocks': inv_table(d['inv'], f'These sites from Invariant’s current inventory fit a {lab} requirement, either at that size today or with a phase that covers it. Specs are as marketed by the owner and are checked against utility documents before any introduction.')})
    sections.append({'id': 'how-we-search', 'heading': f'How Invariant finds {lab} sites', 'blocks': [
        {'type': 'paragraph', 'text': f'We search from power evidence first and land second. For a {lab} request we start with stations and services that can carry the load, kill anything already claimed, operating for someone else, contaminated or under a moratorium, and only then look at parcels. Each surviving site is graded A (documented power), B (a named power path with a date) or C (land near capacity), with the one document that would move it up a tier.'},
        {'type': 'paragraph', 'text': f'Tell us the MW, the states you would consider and the date you need power. We send the {lab} sites that fit, including ones that are not on this page.'},
    ]})
    sections.append({'id': 'browse', 'heading': 'Browse data center sites by size and state', 'blocks': links_block()})
    srcs = sorted(set(d['src']) | {'nvl72'})
    faqs = [{'question': q, 'answer': a} for q, a in d['faq']]
    faqs.append({'question': f'How does Invariant help find a {lab} data center site?', 'answer': f'Invariant keeps a live inventory of US powered sites, screens each one against utility documents, and matches buyers to sites by MW, state and energization date. Book a call or call (628) 220-8972 with your {lab} requirement and we send matching sites, including off-market ones.'})
    return {
        'slug': size_slug(mw), 'topic': 'Data Centers', 'kind': 'site-listing', 'region': 'United States',
        'title': d['title'], 'description': d['desc'], 'date': DATE, 'readMinutes': 6,
        'intro': d['intro'], 'takeaways': d['take'], 'sections': sections, 'faqs': faqs,
        'sources': [{'id': s, 'title': S[s][0], 'url': S[s][1], 'publisher': S[s][2]} for s in srcs],
        'relatedSlugs': [INV[d['inv'][0]][1], PILLAR],
    }

# ---------------------------------------------------------------- state pages
STATE = {
 'texas': dict(name='Texas', code='TX', inv=['tx44', 'tx17', 'hou3', 'early'], src=['sb6', 'ercot-bz', 'gov-tceq', 'ud-texas', 'ercot-dr'],
   intro='Texas has more data center sites on offer than any other state and, in late 2026, more rules about who gets power and when. Most of the state runs on ERCOT, where SB 6 and the PUCT’s large-load rules now govern any new load of 75 MW or more. Sites under 75 MW, energized sites, and sites outside ERCOT are where most deals close fastest. Invariant lists energized Texas sites from 3 MW to 44 MW with expansion to 250 MW.',
   take=['SB 6 applies to new or expanded ERCOT loads of 75 MW and up, with a $100,000 study fee and financial security.', 'Since August 3, 2026, ERCOT has not approved energization of new data centers or crypto loads of 75 MW or more, and TCEQ has paused data center permits statewide.', 'El Paso, the Panhandle and parts of East Texas sit outside ERCOT, on their own utility tariffs.', 'Energized sites under 75 MW are the fastest path in Texas right now.'],
   grid=[('ERCOT and large loads', ['SB 6, passed in 2025, set new rules for loads of 75 MW and above in ERCOT: study fees, disclosure of on-site generation, curtailment during emergencies and terms for co-located generation. The PUCT adopted rules under it in 2026. ERCOT replaced one-by-one studies with Batch Zero, a combined study of the large-load queue.', 'For a buyer, that splits Texas in two. Loads under 75 MW, or already energized, move on normal utility timelines. Larger new loads wait for the batch process and the end of the pause.']),
          ('Where Texas sites come from', ['Mining campuses in West and Central Texas, industrial brownfields around Houston and Dallas, and energized sites in the Houston load zone are the bulk of what we see. ERCOT’s demand response programs, where flexible loads earn revenue for curtailing, are part of the value of many mining sites. AI tenants usually want firm service instead.'])],
   faq=[('Can I still get a large data center site in Texas in 2026?', 'Yes, with limits. New ERCOT loads of 75 MW and above face SB 6 rules, Batch Zero studies and a pause on energization approvals since August 2026. Energized sites, sites under 75 MW and sites outside ERCOT can move faster.'),
        ('What is the 75 MW threshold in Texas?', 'SB 6 and the PUCT rules apply to new or expanded large loads of 75 MW or more in ERCOT. They require a study fee, financial security, disclosure of backup generation and curtailment terms.')]),
 'pennsylvania': dict(name='Pennsylvania', code='PA', inv=['pa350', 'pa500', 'pa5'], src=['pjm-fcst', 'homer-city', 'pjm-replacement', 'eia-860m'],
   intro='Pennsylvania has become one of the busiest states for AI data center sites because of its retired and retiring power plants, its gas supply and its place in PJM. The best Pennsylvania sites reuse a plant’s switchyard and land, add on-site gas, or both. Invariant lists a 350 MW Pennsylvania campus with a signed utility service agreement, a 500 MW gas-plus-grid site and an energized 5 MW site.',
   take=['Pennsylvania is in PJM, where long-term load forecasts are rising sharply on data center demand.', 'Retired coal and gas plants offer switchyards, transmission rights and large acreage. The Homer City plant redevelopment is the best-known example.', 'Gas from the Marcellus makes behind-the-meter power a real option.', 'Signed utility agreements are scarce. Ours is 350 MW with a phased ramp starting in 2026.'],
   grid=[('PJM and plant reuse', ['PJM’s 20-year forecast shows load growing steeply, much of it data centers. That has made studies longer and capacity more valuable. FERC approved a streamlined PJM process for replacing retiring generation at the same interconnection point, which helps plant sites add new generation. The data center load still needs its own utility study.', 'Homer City, a former coal plant, is being redeveloped as a gas-powered AI campus. It is the template many Pennsylvania plant sites now follow.']),
          ('What to check in Pennsylvania', ['For plant sites: coal ash units, groundwater monitoring, deed restrictions and who holds the environmental liability. For gas sites: firm pipeline capacity and the air permit path. For grid sites: the load study date and whether the ramp fits your hardware schedule.'])],
   faq=[('Why are data centers going to Pennsylvania?', 'Retired power plants with switchyards and land, Marcellus gas for on-site power, and access to the PJM grid. Several large AI campuses are planned on former plant sites.'),
        ('Is there a Pennsylvania data center site with signed power?', 'Yes. Invariant lists a 350 MW campus with a signed utility service agreement, 50 MW at end of 2026 and 300 MW at end of 2027, available for lease. Details are shared on a call.')]),
 'ohio': dict(name='Ohio', code='OH', inv=['oh300', 'mw85'], src=['aep-dct', 'pjm-fcst', 'lbnl'],
   intro='Ohio was one of the first states where a utility wrote a tariff just for data centers. AEP Ohio’s data center tariff and study process now shape every large site in its territory, and other Ohio utilities face similar demand. The upside is clarity: a buyer knows the fees, the minimum bill and the process. Invariant lists a 300 MW approved site in Ohio on 345 kV and tracks other Midwest brownfields.',
   take=['AEP Ohio routes data center requests of 25 MW and up through a formal process, with study fees of $10,000, $50,000 or $100,000 depending on size.', 'Its data center tariff sets minimum demand charges and long terms. Model them before price.', 'Ohio is in PJM, where long-term load forecasts are rising on data center demand.', 'Approved capacity is the scarce asset. Our Ohio site has 300 MW approved for 1H 2027.'],
   grid=[('AEP Ohio’s data center process', ['AEP Ohio requires site control and a stated load ramp before it studies a data center request of 25 MW or more. Fees step up at 50 MW and 100 MW. It runs studies in tranches and targets completion in 45 to 60 days. The tariff itself sets minimum billing and contract terms for new data center loads.', 'The Berkeley Lab and Brattle review of large-load tariffs found terms like these spreading nationally. Ohio was early, so its sites already carry the costs that other states are still adding.']),
          ('Where Ohio sites come from', ['Farmland near 345 kV corridors, former industrial plants and retired generation sites make up most of what we see. The constraint is not land. It is getting an approved study and a ramp that fits.'])],
   faq=[('What is the AEP Ohio data center tariff?', 'A tariff for new data center loads in AEP Ohio’s territory that sets minimum demand charges and long contract terms, paired with a formal study process for requests of 25 MW and up.'),
        ('Is there an Ohio data center site with approved power?', 'Yes. Invariant lists a 300 MW approved site on 345 kV with power in 1H 2027 and 300+ acres. Details are shared on a call.')]),
 'arizona': dict(name='Arizona', code='AZ', inv=['az15'], src=['tucson', 'pima-rules', 'dcwatch'],
   intro='Arizona offers huge tracts of flat land, strong fiber routes and fast-growing utilities, which makes it a natural place to look for gigawatt AI campuses. Water and local politics are the constraints. Phoenix-area utilities have large data center queues, and Tucson rejected a high-profile project in 2025. Invariant lists a 1.5 GW first-phase AI campus in Arizona on more than 15,000 acres.',
   take=['Arizona is outside any RTO. Utilities set their own large-load terms.', 'Water supply and local approval are the first screens, ahead of power.', 'Tucson ended Project Blue in 2025, and Pima County is rewriting its data center rules.', 'Our Arizona campus has a 1.5 GW first phase on 15,000+ acres with grid targeted for 2027.'],
   grid=[('Power and water in Arizona', ['Arizona’s utilities are vertically integrated and outside an RTO, so each one sets its own process for large loads. Demand around Phoenix has filled queues. For a gigawatt site, expect a mix of new transmission, new generation and phased service.', 'Water matters for cooling and for public approval. Closed-loop and air-cooled designs ease both.']),
          ('Local approval', ['In 2025 Tucson’s city council voted to end Project Blue after public opposition, and in 2026 Pima County planners advanced changes to data center rules. Data Center Watch tracks similar fights nationally. Screen the county and any annexing city before optioning land.'])],
   faq=[('Is Arizona good for data centers?', 'For large campuses, often yes: land, fiber and growing utilities. Water and local approval are the main risks, so screen those first.'),
        ('Is there a gigawatt data center site in Arizona?', 'Yes. Invariant lists a 1.5 GW first-phase AI campus on more than 15,000 acres with grid service targeted for 2027. Details are shared on a call.')]),
 'iowa': dict(name='Iowa', code='IA', inv=['ia500', 'ia2', 'ia2e'], src=['ferc-rto'],
   intro='Iowa has long hosted hyperscale data centers because of its wind power, low land costs and utilities that court large loads. Most of the state is in MISO. Iowa sites range from small energized edge sites at power plants to large PPA-backed campuses. Invariant lists a site that scales from 20 MW to 500 MW and beyond under a long-term PPA, plus two energized 2 MW sites.',
   take=['Most of Iowa is in MISO, with high wind generation.', 'Several hyperscalers already run large Iowa campuses.', 'Our Iowa inventory runs from 2 MW energized edge sites to a 20 to 500 MW+ PPA site.', 'Check whether the PPA is firm or tied to wind output before planning an uptime promise.'],
   grid=[('Power in Iowa', ['Iowa generates a large share of its electricity from wind, and most of the state sits in MISO. That makes long-term PPAs a common structure for large loads. A PPA prices energy; it does not on its own guarantee delivery. Ask for the utility service arrangement alongside it.']),
          ('Small and large Iowa sites', ['At the small end, energized sites inside or next to power plants can host 2 MW of compute quickly. At the large end, rural non-zoned land with transmission access can carry hundreds of MW in phases. Both need a utility document for the MW they claim.'])],
   faq=[('Why do data centers go to Iowa?', 'Wind power, low land costs, utilities that court large loads and a history of hyperscale campuses.'),
        ('Is there a large data center site in Iowa?', 'Yes. Invariant lists an Iowa site from 20 MW to 500 MW+ under a long-term PPA, phased, plus smaller energized sites. Details are shared on a call.')]),
 'nevada': dict(name='Nevada', code='NV', inv=['nv375'], src=['ferc-rto'],
   intro='Nevada combines open desert land, a fast-growing data center cluster near Reno and Las Vegas, and a single dominant utility. It is outside any RTO, so large loads deal with the utility directly. Water is the main local constraint. Invariant lists a 375 MW Nevada site on about 350 acres, served at 230 kV, with power in 2027 to 2028.',
   take=['Nevada is outside any RTO; large-load terms are set by the utility.', 'Water rights and supply are the first local screen.', 'Our Nevada site is 375 MW on about 350 acres, with power in 2027 to 2028.', 'Ask for the utility study and the water plan together.'],
   grid=[('Power in Nevada', ['Nevada’s main utility serves most of the state’s load and handles large data center requests directly, outside an RTO. That can make the process simpler to follow, though the utility still needs studies and new transmission for large campuses.']),
          ('Water and land', ['Desert basins offer flat land at scale. Water rights, cooling design and the local water authority’s view decide whether a large campus works. Air-cooled and closed-loop designs reduce the ask.'])],
   faq=[('Is Nevada good for data centers?', 'For large campuses with low-water cooling, often yes. Land is plentiful and the utility process is direct. Water is the main local constraint.'),
        ('Is there a large data center site in Nevada?', 'Yes. Invariant lists a 375 MW site on about 350 acres with 230 kV service and power in 2027 to 2028. Details are shared on a call.')]),
 'indiana': dict(name='Indiana', code='IN', inv=['in200'], src=['indy', 'ferc-rto', 'dcwatch'],
   intro='Indiana has drawn several hyperscale campuses with available land, tax incentives and utilities in both MISO and PJM. Local approval is the swing factor; Google withdrew a proposal in Franklin Township after local opposition. Invariant lists a 200 MW greenfield near Indianapolis with a completed load study on about 80 acres.',
   take=['Most of Indiana is in MISO; the northeast corner is in PJM.', 'Local approval varies by township. Screen hearings and recent withdrawals first.', 'Our Indiana site is 200 MW with a completed load study and a planned substation.', 'A completed load study is the first document a buyer can underwrite.'],
   grid=[('Grid and utilities', ['Indiana is split between MISO and PJM, with several investor-owned utilities and many municipal and cooperative systems. The study process and tariff depend on which one serves the parcel. Confirm the serving utility before anything else.']),
          ('Local approval', ['Google withdrew a data center proposal in Franklin Township on Indianapolis’s south side after local opposition. Rezoning hearings decide many Indiana sites. Check the township and county record before optioning land.'])],
   faq=[('Is Indiana good for data centers?', 'Often, yes: land, incentives and access to MISO and PJM. Local approval varies by township and is the main risk.'),
        ('Is there a 200 MW data center site in Indiana?', 'Yes. Invariant lists a 200 MW greenfield near Indianapolis with a completed load study on about 80 acres. Details are shared on a call.')]),
 'wisconsin': dict(name='Wisconsin', code='WI', inv=['wi150'], src=['fairwater', 'ferc-rto'],
   intro='Wisconsin got national attention when Microsoft built its Fairwater AI campus in Mount Pleasant. The state sits in MISO, has a cool climate and has utilities planning new generation for data center load. Invariant lists a Wisconsin site with 150 MW of substation capacity built, 80 MW available now and 130 ready acres.',
   take=['Wisconsin is in MISO with a cool climate that helps cooling efficiency.', 'Microsoft’s Fairwater campus puts about 1.2 million square feet on a 315-acre site.', 'Our Wisconsin site has 150 MW built and 80 MW available now on 130 ready acres.', 'Built substation capacity is worth more than any map.'],
   grid=[('Power in Wisconsin', ['Wisconsin is in MISO. Its utilities are adding generation for data center demand, and large campuses negotiate service directly. A site with a built substation skips the slowest step.']),
          ('Reference campus', ['Microsoft’s Fairwater campus in Mount Pleasant has three buildings with about 1.2 million square feet on 315 acres and a closed-loop cooling system. It shows the land and cooling plan a large AI campus needs in the state.'])],
   faq=[('Is Wisconsin good for data centers?', 'For AI campuses, increasingly yes: MISO grid access, cool climate and utilities planning for large loads.'),
        ('Is there a powered data center site in Wisconsin?', 'Yes. Invariant lists a site with 150 MW of substation capacity built, 80 MW available now and 130 ready acres. Details are shared on a call.')]),
 'kentucky': dict(name='Kentucky', code='KY', inv=['ky30', 'ky8'], src=['ferc-rto', 'eia-860m'],
   intro='Kentucky has a deep supply of small energized sites from its mining boom and a growing number of larger greenfield and plant sites. It is split between PJM, TVA and utilities outside any RTO. Invariant lists a 30 MW rezoned greenfield and seven turnkey sites from 0.5 to 8 MW.',
   take=['Kentucky’s grid is split between PJM, TVA and utilities outside an RTO. The serving utility sets the process.', 'Small energized mining sites are common and fast.', 'Our 30 MW Kentucky greenfield is already rezoned.', 'Retired coal plants offer larger options; check coal ash and liability first.'],
   grid=[('Grid and utilities', ['Eastern Kentucky has utilities in PJM, the west and south touch TVA, and the largest investor-owned utilities sit outside an RTO. Each has its own large-load terms. That makes the serving utility the first thing to confirm.']),
          ('Kentucky site types', ['Turnkey mining sites from 0.5 to 8 MW are the fastest option and suit inference or edge use if the power is firm. Larger sites come from graded industrial pads, rezoned greenfields and retired coal plants listed in EIA-860M.'])],
   faq=[('Are there energized data center sites in Kentucky?', 'Yes. Invariant lists seven turnkey sites from 0.5 to 8 MW, mostly on owned land, available now.'),
        ('Is there a 30 MW data center site in Kentucky?', 'Yes. Invariant lists a 30 MW rezoned greenfield on about 16 acres, available now. Details are shared on a call.')]),
 'oklahoma': dict(name='Oklahoma', code='OK', inv=['okc55', 'ok5'], src=['ferc-rto'],
   intro='Oklahoma sits in the Southwest Power Pool, has abundant gas and wind, and has drawn hyperscale and mining load for years. Its sites tend to be faster and cheaper than coastal markets. Invariant lists a 55 MW contracted brownfield near Oklahoma City on about 80 acres and two energized 5 MW turnkey sites.',
   take=['Oklahoma is in SPP, with large wind and gas resources.', 'Brownfields with contracted service are the fastest path to 50 MW+.', 'Our Oklahoma City site has 55 MW contracted on about 80 acres, available now.', 'Two 5 MW turnkey sites suit inference, edge or mining.'],
   grid=[('Power in Oklahoma', ['Oklahoma is in SPP. Its main utilities have served large industrial and data center loads for years and run their own study processes. Contracted capacity at an existing brownfield avoids most of the wait.']),
          ('Small and mid-size sites', ['Energized 5 MW sites come mostly from mining. Check whether the service is firm or interruptible before signing an AI tenant.'])],
   faq=[('Is there a 50 MW data center site in Oklahoma?', 'Yes. Invariant lists a 55 MW contracted brownfield near Oklahoma City on about 80 acres, available now.'),
        ('Are there small energized sites in Oklahoma?', 'Yes. Invariant lists two 5 MW turnkey sites on owned land. Details are shared on a call.')]),
 'kansas': dict(name='Kansas', code='KS', inv=['ks250'], src=['ferc-rto', 'gev', 'epa-titlev'],
   intro='Kansas offers SPP grid access, wind, and gas fields where on-site generation can power a data center before the grid arrives. Invariant lists a Kansas site with a path to 250 MW of behind-the-meter gas on mineral acreage, available now for buyers ready to build generation.',
   take=['Kansas is in SPP.', 'Behind-the-meter gas can deliver hundreds of MW faster than new grid service.', 'Check firm gas supply, air permits and turbine or engine lead times.', 'Our Kansas site has a path to 250 MW on gas.'],
   grid=[('Behind-the-meter in Kansas', ['On-site gas generation runs on four clocks: gas supply, the air permit, equipment delivery and utility or regulatory approval. A large plant can trigger Title V permitting. Turbine backlogs are long; GE Vernova reported about 116 GW. Reciprocating engines often arrive faster.']),
          ('Grid end state', ['Plan the grid connection from day one so that on-site generation has an exit or a backup role. SPP studies take time.'])],
   faq=[('Can a data center run on natural gas in Kansas?', 'Yes, with on-site generation. Firm gas, an air permit and equipment supply set the pace.'),
        ('Is there a 250 MW site in Kansas?', 'Invariant lists a Kansas site with a path to 250 MW of behind-the-meter gas. Details are shared on a call.')]),
 'north-dakota': dict(name='North Dakota', code='ND', inv=['nd15'], src=['ferc-rto'],
   intro='North Dakota has cheap power, cold air and stranded gas in the Bakken, which made it a mining hub. It is moving into AI and HPC as well. Invariant lists a 15 MW off-grid site with managed containers and a 180-acre joint venture site.',
   take=['North Dakota is split between MISO and SPP.', 'Stranded and flared gas supports off-grid power.', 'Cold climate cuts cooling costs.', 'Our North Dakota listing is 15 MW off-grid with managed containers.'],
   grid=[('Power in North Dakota', ['The eastern part of the state is in MISO and the west largely in SPP. Off-grid gas sites in the Bakken use gas that would otherwise be flared. They suit flexible compute like mining; AI tenants need a firm plan.'])],
   faq=[('Is North Dakota good for data centers?', 'For flexible loads and cold-climate builds, yes. Cheap power and stranded gas are the draw.'),
        ('Is there a data center site in North Dakota?', 'Invariant lists a 15 MW off-grid site with managed containers and a 180-acre JV site. Details are shared on a call.')]),
 'new-york': dict(name='New York', code='NY', inv=['ny60'], src=['ferc-rto', 'eia-860m'],
   intro='New York has its own grid operator, NYISO, and upstate sites with hydro, existing plants and transmission built for heavy industry. Invariant lists a 60 MW+ operating gas peaker plant site upstate.',
   take=['New York runs on NYISO.', 'Upstate plant sites offer transmission and land.', 'Our listing is a 60 MW+ operating peaker plant site.', 'Check state climate law and local permits for any fossil generation use.'],
   grid=[('Power in New York', ['NYISO runs the state grid. Upstate zones have more headroom and lower prices than New York City. Existing plants hold switchyards and interconnection rights that a data center may be able to use, subject to studies.'])],
   faq=[('Is there a data center site at a New York power plant?', 'Yes. Invariant lists a 60 MW+ operating gas peaker plant site upstate. Details are shared on a call.'),
        ('Is upstate New York good for data centers?', 'For some buyers, yes: transmission, hydro and lower prices than downstate. State climate law shapes any on-site fossil generation.')]),
 'oregon': dict(name='Oregon', code='OR', inv=['or10'], src=['ferc-rto'],
   intro='Oregon has hosted hyperscale data centers for years on hydro power and a cool climate. It is outside any RTO. Invariant lists a 10 MW hydro-powered site with a path past 100 MW.',
   take=['Oregon runs on hydro-heavy power outside an RTO.', 'Several hyperscalers operate large Oregon campuses.', 'Our Oregon site has 10 MW now on hydro with a path to 100 MW+.', 'Check the utility’s large-load terms; Oregon has moved to set them.'],
   grid=[('Power in Oregon', ['Oregon draws heavily on Columbia River hydro, and its utilities negotiate large loads directly. Demand from data centers has pushed the state toward specific terms for large loads.'])],
   faq=[('Is there a hydro-powered data center site in Oregon?', 'Yes. Invariant lists a 10 MW hydro site with a path past 100 MW, available now.'),
        ('Why do data centers go to Oregon?', 'Hydro power, a cool climate and an established hyperscale cluster.')]),
 'north-carolina': dict(name='North Carolina', code='NC', inv=['nc18'], src=['duke', 'ferc-rto'],
   intro='North Carolina has hyperscale campuses, a large utility building new generation for data center demand and plenty of Piedmont land. It is outside any RTO. Invariant lists an 18 MW live campus on about 200 acres with a path past 100 MW.',
   take=['North Carolina is outside an RTO; the main utility handles large loads directly.', 'The utility is adding gas generation partly for data center demand.', 'Our North Carolina site has 18 MW live on about 200 acres with a path past 100 MW.', 'Energized acreage with expansion room is the scarce asset.'],
   grid=[('Power in North Carolina', ['North Carolina is served mainly by one large investor-owned utility outside any RTO, which is building new gas generation for growing load including data centers. Large requests go through its own study process.'])],
   faq=[('Is there a powered data center site in North Carolina?', 'Yes. Invariant lists an 18 MW live campus on about 200 acres with a path past 100 MW.'),
        ('Is North Carolina good for data centers?', 'Yes for many buyers: land, an established hyperscale cluster and a utility planning for large loads.')]),
}

def state_page(s):
    d = STATE[s]; name = d['name']
    eid, esrc = STATE_SRC(d['code'], name)
    rows = [INV[k][0] for k in d['inv']]
    mws = ', '.join(r[1] for r in rows)
    sections = []
    for i, (h, paras) in enumerate(d['grid']):
        blocks = []
        for p in paras:
            b = {'type': 'paragraph', 'text': p}
            ids = [k for k in d['src'] if any(w in p for w in CITE.get(k, ()))]
            if 'RTO' in p or 'MISO' in p or 'SPP' in p or 'NYISO' in p: ids.append('ferc-rto') if 'ferc-rto' in d['src'] else None
            ids = list(dict.fromkeys(ids)) or [eid]
            b['sourceIds'] = ids
            blocks.append(b)
        sections.append({'id': f'g{i}-' + h.lower().replace(' ', '-').replace('’', '').replace("'", '')[:40].strip('-'), 'heading': h, 'blocks': blocks})
    sections.insert(0, {'id': 'sites-available', 'heading': f'Data center sites available in {name}', 'blocks': inv_table(d['inv'], f'These {name} sites are in Invariant’s current inventory. Specs are as marketed by the owner and are checked against utility documents before any introduction.')})
    sections.append({'id': 'screen', 'heading': f'How to screen a {name} data center site', 'blocks': [
        {'type': 'list', 'items': [
            'Confirm the serving utility and the grid operator, then ask which document backs the MW: a will-serve letter, a load study or a signed agreement.',
            'Check that the substation has headroom for your load under contingency. Distance to a line is not capacity.',
            f'Screen the county and any city that could annex the site for moratoriums, recent denials and the zoning path.',
            'Work out usable acres after wetlands, floodplain, slope, easements and setbacks, and reserve room for the substation.',
            'Kill sites that are already claimed, operating for someone else, contaminated or owned by an environmental liability buyer before spending on parcels.',
        ], 'sourceIds': ['paces', eid]},
        {'type': 'paragraph', 'text': f'Invariant runs this screen on every {name} site before an introduction and grades the result A, B or C by power evidence. Tell us your MW and date and we will send the {name} sites that fit, including off-market ones.'},
    ]})
    sections.append({'id': 'browse', 'heading': 'Browse data center sites by size and state', 'blocks': links_block()})
    srcs = list(dict.fromkeys(d['src'] + ['paces']))
    sources = [{'id': x, 'title': S[x][0], 'url': S[x][1], 'publisher': S[x][2]} for x in srcs] + [{'id': eid, 'title': esrc[0], 'url': esrc[1], 'publisher': esrc[2]}]
    faqs = [{'question': q, 'answer': a} for q, a in d['faq']]
    faqs.append({'question': f'How do I find a data center site in {name}?', 'answer': f'Start from power evidence, not land: confirm the serving utility, the document behind the MW and substation headroom, then screen local approval and usable acres. Invariant does this for buyers and currently lists {name} sites at {mws}. Book a call or call (628) 220-8972.'})
    return {
        'slug': state_slug(s), 'topic': 'Data Centers', 'kind': 'site-listing', 'region': f'{name}, United States',
        'title': f'Data center sites for sale in {name}: powered land and energized sites (2026)',
        'description': f'{name} data center sites and powered land for sale or lease through Invariant: {mws}. How power, grid rules and local approval work in {name}.',
        'date': DATE, 'readMinutes': 5, 'intro': d['intro'], 'takeaways': d['take'], 'sections': sections, 'faqs': faqs,
        'sources': sources, 'relatedSlugs': [INV[d['inv'][0]][1], PILLAR],
    }

# ---------------------------------------------------------------- pillar
def pillar():
    size_rows = [[size_label(m), SIZE[m]['voltage'].split(';')[0].split(',')[0], SIZE[m]['land'], SIZE[m]['timing'].split('.')[0]] for m in SIZES]
    sections = [
        {'id': 'start-from-power', 'heading': 'Start from power, not land', 'blocks': [
            {'type': 'paragraph', 'text': 'Most data center site searches start with a parcel and a line on a map. That is backwards. Land is plentiful almost everywhere in the US. Deliverable power on a known date is not. In a 2025 analysis of ERCOT, Paces found only about 17% of substations near suitable land had any withdrawal headroom. The rest of the land was stranded.', 'sourceIds': ['paces']},
            {'type': 'paragraph', 'text': 'So the search runs in this order. Pick the MW and the date. Find stations, plants and energized loads that can carry it. Kill anything claimed, contaminated or under a moratorium. Then look at parcels around what survives. Finally, grade each site by the document behind its MW.'},
        ]},
        {'id': 'by-size', 'heading': 'What each size of data center site needs', 'blocks': [
            {'type': 'table', 'columns': ['Size', 'Typical utility service', 'Land', 'Time to power'], 'rows': size_rows},
            {'type': 'paragraph', 'text': 'These are Invariant’s working ranges from sites we have screened, not published standards. Each size has its own page with rack and GPU math, the documents to ask for, and sites available now.'},
        ]},
        {'id': 'evidence-ladder', 'heading': 'Grade every site by its power evidence', 'blocks': [
            {'type': 'list', 'items': ['Rung 0: a map showing nearby lines.', 'Rung 1: proximity to a substation or line of the right voltage.', 'Rung 2: a named MW figure at a named station, or an existing large connection such as a retired plant or energized load.', 'Rung 3: a utility study or approval for this load.', 'Rung 4: a signed service or interconnection agreement with a date, or service already energized and metered.']},
            {'type': 'paragraph', 'text': 'Sites are then tiered A (documented power, rung 3 or 4), B (a named power path with a date) or C (land near capacity). A will-serve letter is usually rung 2: useful for screening, not a reservation of MW.', 'sourceIds': ['dominion']},
        ]},
        {'id': 'rules-2026', 'heading': 'Grid rules that change the search in 2026', 'blocks': [
            {'type': 'paragraph', 'text': 'In Texas, SB 6 rules apply to new ERCOT loads of 75 MW and up, and since August 3, 2026 ERCOT has not approved energization of new data centers of that size while Batch Zero studies run. TCEQ has also paused data center permits statewide.', 'sourceIds': ['sb6', 'ercot-bz', 'gov-tceq']},
            {'type': 'paragraph', 'text': 'Elsewhere, utilities are adding large-load tariffs with study fees, collateral, minimum bills near 80 to 85% of contract demand and terms of 12 to 15 years. AEP Ohio’s data center tariff is an early public example. PJM’s long-term forecast keeps rising on data center demand.', 'sourceIds': ['lbnl', 'aep-dct', 'pjm-fcst']},
            {'type': 'paragraph', 'text': 'Local approval is the other filter. Data Center Watch tracks projects blocked or delayed by local opposition, and counties from Missouri to Arizona have passed temporary bans or new rules.', 'sourceIds': ['dcwatch', 'stcharles']},
        ]},
        {'id': 'sites-available', 'heading': 'Data center sites available through Invariant now', 'blocks': inv_table(['az15', 'pa350', 'pa500', 'ia500', 'nv375', 'oh300', 'in200', 'wi150', 'mw85', 'okc55', 'tx44', 'ky30', 'nc18', 'tx17', 'or10', 't3', 'pa5', 'ok5', 'ky8', 'host'], 'A selection of Invariant’s current US inventory, from energized 1 MW sites to a 1.5 GW campus. The full list is on the powered land page.')},
        {'id': 'browse', 'heading': 'Find a data center site by size or state', 'blocks': links_block()},
    ]
    faqs = [
        {'question': 'How do I find a data center site in the US?', 'answer': 'Start from power. Decide the MW and energization date, find substations, plants and energized loads that can carry it, screen out sites that are claimed, contaminated or under a moratorium, then look at parcels. Grade each site by the utility document behind its MW. Invariant does this for buyers and lists sites from 1 MW to 1.5 GW.'},
        {'question': 'Who helps companies find data center sites?', 'answer': 'Site selection consultants, brokers, utilities and economic development groups all market sites. Invariant specializes in powered sites: it keeps a live US inventory from 1 MW to 1.5 GW, checks each against utility documents and matches buyers by MW, state and date. Book a call or call (628) 220-8972.'},
        {'question': 'What is powered land?', 'answer': 'Land where electric service for a large load exists or is documented: an energized connection, a signed utility agreement, a completed load study or the infrastructure of a former plant. Land near a line without a utility document is not powered land.'},
        {'question': 'How long does it take to get power for a new data center?', 'answer': 'From weeks for small energized sites to 3 to 7 years for new 100 MW to 1 GW service in constrained markets. Energized and contracted sites cut that time, which is why they trade at a premium.'},
        {'question': 'What size data center sites does Invariant have?', 'answer': 'Sites from energized 0.5 MW turnkey yards to a 1.5 GW AI campus, across Arizona, Pennsylvania, Ohio, Iowa, Nevada, Indiana, Wisconsin, Texas, Kentucky, Oklahoma, Kansas, North Carolina, North Dakota, New York and Oregon, plus US hosting.'},
    ]
    srcs = ['paces', 'dominion', 'sb6', 'ercot-bz', 'gov-tceq', 'lbnl', 'aep-dct', 'pjm-fcst', 'dcwatch', 'stcharles']
    return {
        'slug': PILLAR, 'topic': 'Data Centers', 'kind': 'site-listing', 'region': 'United States',
        'title': 'How to find a data center site in the US: powered land from 1 MW to 1 GW (2026)',
        'description': 'Find a data center site in the US by MW, state and energization date. Invariant lists powered sites from 1 MW to 1.5 GW and shows how to verify the power behind each one.',
        'date': DATE, 'readMinutes': 8,
        'intro': 'Invariant finds data center sites for buyers across the US, from energized 1 MW edge and mining sites to a 1.5 GW AI campus. The method is the same at every size: start from power evidence, rule out sites that cannot close, then match land. This page sets out what each size needs, how to grade a site’s power, the 2026 rules that change the search, and the sites we have now. Tell us your MW, states and date, and we send the ones that fit.',
        'takeaways': ['Search from power first. Land is rarely the constraint; deliverable MW on a date is.', 'Grade each site by the document behind its MW: map, proximity, named MW, utility study, signed agreement.', 'Size changes everything: 1 to 10 MW sits on distribution, 20 to 100 MW needs a substation, 200 MW and up is a transmission project.', 'Invariant lists US sites from 1 MW to 1.5 GW and finds off-market ones on request.'],
        'sections': sections, 'faqs': faqs,
        'sources': [{'id': s, 'title': S[s][0], 'url': S[s][1], 'publisher': S[s][2]} for s in srcs],
        'relatedSlugs': [HUB, 'power-evidence-data-center-site-verification'],
    }

def cite_faqs(page):
    have = {x['id'] for x in page['sources']}
    for f in page['faqs']:
        ids = [k for k in have if any(w in f['answer'] for w in CITE.get(k, ()))]
        if ids: f['sourceIds'] = sorted(ids)
    return page

pages = [cite_faqs(p) for p in [pillar()] + [size_page(m) for m in SIZES] + [state_page(s) for s in STATES]]
out = json.dumps(pages, indent=1, ensure_ascii=False)
assert '—' not in out and '–' not in out, 'dash'
open(sys.argv[1], 'w').write(out + '\n')
print(len(pages), 'pages')
