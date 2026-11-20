"""Generate the AI compute capacity cluster for neoclouds and smaller AI labs: where to put GPUs, how much
power a cluster needs, colocation and liquid cooling, build vs lease vs colocate, and how to check a
provider's power date before signing.

Run: python3 compute_capacity.py ../../src/data/industry-articles/ai-compute-capacity.json

House rules (same as site_finder.py and due_diligence.py): inventory shown as teasers only (region, MW
band, rough land, timing), no em or en dashes, every number sourced or shown as our own arithmetic with
its assumptions, no client or counterparty names from our own deals. Never use the word "public" in copy.
"""
import ast, json, os, sys

DATE = '2026-11-20'
PILLAR = 'ai-compute-capacity-for-neoclouds'

# Inventory teaser rows, read from site_finder.py so the two never drift apart.
_src = open(os.path.join(os.path.dirname(__file__), 'site_finder.py')).read()
_a = _src.index('INV = {'); _b = _src.index('\n}\n', _a) + 2
INV = ast.literal_eval(_src[_a + 6:_b])

S = {
    'dgx-h100': ('Introduction to the NVIDIA DGX H100 system', 'https://docs.nvidia.com/dgx/dgxh100-user-guide/introduction-to-dgxh100.html', 'NVIDIA'),
    'dgx-b200': ('Introduction to the NVIDIA DGX B200 system', 'https://docs.nvidia.com/dgx/dgxb200-user-guide/introduction-to-dgxb200.html', 'NVIDIA'),
    'h100': ('NVIDIA H100 Tensor Core GPU', 'https://www.nvidia.com/en-us/data-center/h100/', 'NVIDIA'),
    'gb200': ('NVIDIA GB200 NVL72', 'https://www.nvidia.com/en-us/data-center/gb200-nvl72/', 'NVIDIA'),
    'nvl72': ('Nvidia offers 120 kW liquid-cooled Blackwell rack as industry standard', 'https://www.eenewseurope.com/en/nvidia-offers-120kw-liquid-cooled-blackwell-rack-as-industry-standard', 'eeNews Europe'),
    'uptime-pue': ('Large data centers are mostly more efficient, analysis confirms', 'https://journal.uptimeinstitute.com/large-data-centers-are-mostly-more-efficient-analysis-confirms/', 'Uptime Institute'),
    'longstop': ('Data center lease exhibit with a firm capacity longstop date (S-4/A exhibit 10.51)', 'https://www.sec.gov/Archives/edgar/data/0002097508/000118518526004213/bldcex10-51i.htm', 'U.S. Securities and Exchange Commission'),
    'poolside': ('Poolside pursues new partners for Texas data center following CoreWeave deal breakdown', 'https://baxtel.com/news/poolside-pursues-new-partners-for-texas-data-center-following-coreweave-deal-breakdown', 'Baxtel'),
    'bclp': ('How to price grid uncertainty in energy contracts', 'https://www.bclplaw.com/print/v2/content/1580518/how-to-price-grid-uncertainty-in-energy-contracts.pdf', 'Bryan Cave Leighton Paisner'),
    'davispolk': ('Elena Millerman discusses due diligence in data center financings with 9fin', 'https://www.davispolk.com/news/elena-millerman-discusses-due-diligence-data-center-financings-9fin', 'Davis Polk'),
    'iren': ('Microsoft signs $9.7 billion IREN deal for Nvidia GB300 capacity', 'https://techinformed.com/microsoft-signs-9-7-billion-iren-deal-for-nvidia-gb300-capacity/', 'TechInformed'),
    'cleanview': ('Behind-the-meter data centers: full report', 'https://cleanview.co/reports/behind-the-meter-data-centers/full-report', 'Cleanview'),
    'paces': ('Grid planning for data centers and transmission investment', 'https://www.paces.com/white-papers/grid-planning-data-centers-transmission-investment', 'Paces'),
    'lbnl': ('Electricity rate designs for large loads (August 2026)', 'https://eta-publications.lbl.gov/sites/default/files/2026-08/rate_designs_large_loads_2026.08.10.pdf', 'Lawrence Berkeley National Laboratory and The Brattle Group'),
    'batch0': ('ERCOT approves new Batch Zero process for large load interconnections', 'https://www.willkie.com/publications/2026/06/ercot-approves-implementing-new-batch-zero-process-for-large-load-interconnections', 'Willkie Farr & Gallagher'),
    'aep-dct': ('Data center tariff', 'https://www.aepohio.com/company/about/rates/data-center-tariff', 'AEP Ohio'),
    'epa-titlev': ('Who has to obtain a Title V permit', 'https://www.epa.gov/title-v-operating-permits/who-has-obtain-title-v-permit', 'US EPA'),
}

CLUSTER = [
    (PILLAR, 'Capacity for neoclouds and AI labs'),
    ('gpu-cluster-power-requirements', 'How much power a GPU cluster needs'),
    ('gpu-colocation-for-ai-labs', 'GPU colocation: what to ask a provider'),
    ('liquid-cooling-gpu-data-center', 'Liquid cooling for 40 to 130 kW racks'),
    ('small-gpu-cluster-1-to-10-mw', 'Where to put 1 to 10 MW of GPUs'),
    ('neocloud-build-lease-or-colocate', 'Build, lease or colocate'),
    ('gpu-lease-power-longstop-diligence', 'Power longstop dates in GPU leases'),
    ('provider-power-check-for-ai-tenants', 'Power check on a provider or site'),
]
MORE = [
    ('ai-data-center-site', 'AI data center sites'),
    ('energized-data-center-sites-available-now', 'Energized sites available now'),
    ('data-center-for-sale', 'Built data centers for sale and lease'),
    ('10-mw-data-center-site', '10 MW data center site'),
    ('100-mw-data-center-site', '100 MW data center site'),
    ('convert-bitcoin-mining-site-to-ai-hpc-data-center', 'Converting a mining site to AI'),
    ('behind-the-meter-power-for-data-centers', 'Behind-the-meter power'),
    ('utility-grade-power-study', 'Utility-grade power study'),
    ('data-center-site-due-diligence', 'Site due diligence'),
]

def links(exclude):
    return [
        {'type': 'links', 'label': 'For neoclouds and AI labs', 'items': [{'label': l, 'slug': s} for s, l in CLUSTER if s != exclude]},
        {'type': 'links', 'label': 'Sites and power', 'items': [{'label': l, 'slug': s} for s, l in MORE if s != exclude]},
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

def inv(keys, intro):
    return [P(intro), T(['Region', 'Power', 'Land or building', 'Timing'], [INV[k][0] for k in keys]),
            P('Exact locations, the utility documents behind each MW figure and terms are shared on a call. Some capacity we know of is not listed anywhere; owners ask for discretion.')]

def page(slug, title, desc, intro, take, sections, faqs, related, read=8, service=None, howto=None):
    used = set()
    for s in sections:
        for b in s['blocks']: used.update(b.get('sourceIds', []))
    for f in faqs: used.update(f.get('sourceIds', []))
    p = {'slug': slug, 'topic': 'Data Centers', 'kind': 'compute-guide', 'region': 'United States', 'title': title,
         'description': desc, 'date': DATE, 'readMinutes': read, 'intro': intro, 'takeaways': take,
         'sections': sections + [sec('More for neoclouds and AI labs', *links(slug), id='browse')],
         'faqs': faqs,
         'sources': [{'id': k, 'title': S[k][0], 'url': S[k][1], 'publisher': S[k][2]} for k in S if k in used],
         'relatedSlugs': related}
    if service: p['service'] = service
    if howto: p['howTo'] = howto
    return p

# ------------------------------------------------------------------ power arithmetic
# kW per GPU at the system level from NVIDIA's own figures; networking and storage add about 10% (our
# assumption); facility power = IT x PUE 1.3 (our planning figure for a new liquid-cooled build).
SYSTEMS = [
    ('H100 (DGX H100, 8 GPUs, 10.2 kW max)', 10.2 / 8),
    ('B200 (DGX B200, 8 GPUs, 14.3 kW max)', 14.3 / 8),
    ('GB200 NVL72 (72 GPUs, about 120 kW a rack)', 120 / 72),
]
NET, PUE = 1.10, 1.3
COUNTS = [256, 1024, 4096, 16384, 32768, 100000]

def fmt_mw(x):
    if x >= 100: return f'{round(x):,}'
    if x >= 10: return f'{x:.0f}'
    return f'{x:.1f}'

def power_rows():
    rows = []
    for n in COUNTS:
        row = [f'{n:,}']
        for _, kw in SYSTEMS:
            row.append(fmt_mw(n * kw * NET * PUE / 1000) + ' MW')
        rows.append(row)
    return rows

PER_GPU = [[name, f'{kw:.2f}', f'{kw * NET:.2f}', f'{kw * NET * PUE:.2f}'] for name, kw in SYSTEMS]

PAGES = []

# ================================================================== pillar
PAGES.append(page(PILLAR,
 'Data center capacity for neoclouds and AI labs: power, space and cooling for your GPUs (2026)',
 'Where neoclouds and smaller AI labs find data center capacity in 2026: MW per GPU count, colocation vs powered shell vs land, liquid cooling, and how to check a power date.',
 'Neoclouds and smaller AI labs find capacity in three places: colocation halls that can take dense liquid-cooled racks, built or energized sites they can lease whole, and powered land they build on. The right one depends on cluster size and how soon you need it. A 1,024-GPU B200 cluster draws about 2.6 MW at the meter; 16,384 GB200 GPUs need about 39 MW. Below roughly 5 MW, colocation is usually fastest. From 5 to 50 MW, energized sites and built halls win. Above that, you are buying a power date, and the date is what you should check first. Invariant finds capacity that fits and checks the power behind it.',
 ['Start from MW and date, not square feet. Power is the binding constraint for every option.',
  'Dense racks change the shortlist. GB200 NVL72 racks run near 120 kW and need liquid cooling.',
  'A provider’s power date is a risk you inherit. Leases now carry longstop dates for exactly this reason.',
  'Send the GPU count, rack density and date. We send capacity that fits, with the evidence behind each MW figure.'],
 [sec('How much power your cluster needs',
    P('System power comes from NVIDIA’s own figures: 10.2 kW for an eight-GPU DGX H100, 14.3 kW for an eight-GPU DGX B200, and about 120 kW for a 72-GPU GB200 NVL72 rack. We add about 10% for networking and storage and a PUE of 1.3 for the building.', 'dgx-h100', 'dgx-b200', 'nvl72'),
    T(['GPUs', SYSTEMS[0][0].split(' (')[0] + ', facility MW', SYSTEMS[1][0].split(' (')[0] + ', facility MW', 'GB200 NVL72, facility MW'], power_rows(), 'dgx-h100', 'dgx-b200', 'nvl72'),
    P('These are planning figures for sizing a search, not a substitute for your own bill of materials. The full method is in our GPU power guide.')),
  sec('The three ways to get capacity',
    T(['Option', 'Typical size', 'Time to power', 'What decides it'], [
      ['Colocation in a built hall', 'A few racks to about 10 MW', 'Weeks to a few months if the hall has liquid cooling and spare power', 'Rack density the hall can cool, power per cabinet, contract term'],
      ['Lease a built or energized site whole', 'About 5 to 100 MW', 'Months; fit-out and cooling retrofit set the date', 'Whether the MW is energized or only contracted, cooling, fiber'],
      ['Build on powered land', '50 MW to 1 GW+', 'Usually 18 months or more, set by the utility date and long-lead equipment', 'The document behind the power date, large-load tariff terms, permits'],
    ]),
    P('Most smaller labs start in colocation and move as they grow. Neoclouds selling capacity on to labs tend to lease or build, because their margin depends on owning the power.')),
  sec('What to check before you commit',
    L(['The power evidence: an energized service, a signed service agreement, a load study, or just a map near a line?',
       'Power per cabinet and the cooling plan for your density: rear-door, direct-to-chip, or immersion?',
       'The date power is available and what it depends on: upgrades, transformer deliveries, a utility study cycle.',
       'Minimum bills and terms in the utility agreement, which you may inherit through the lease.',
       'Fiber routes and latency to where your users or your training data sit.',
       'Local approvals: zoning, moratoriums, and air permits for any on-site generation.'], 'lbnl', 'epa-titlev')),
  sec('Capacity we can talk about now',
    *inv(['t3', 'ia2e', 'hou3', 'okc55', 'wi150', 'tx44', 'nc18', 'in200', 'oh300', 'pa350'],
         'A sample of US capacity in our inventory, from built Tier III rooms to powered campuses. Every row has been checked against utility documents.')),
  sec('How we work with neoclouds and labs',
    P('You send the cluster: GPU type and count (or MW), rack density, the date and the regions you would consider. We send options that fit, each graded by the document behind its power. If you already have a provider or site in mind, we run a power check on it instead, so the date in your contract holds.'),
    P('We are paid on the work, and we say which capacity is listed and which is off-market.')),
 ],
 [faq('Where can a neocloud find data center capacity for GPUs?', 'In colocation halls that can cool dense racks, in built or energized sites leased whole, or on powered land. Invariant tracks all three across the US and checks the power behind each before introducing it.'),
  faq('How much power does a 1,000 GPU cluster need?', 'About 1.8 MW for H100, 2.6 MW for B200 and 2.4 MW for GB200 NVL72 at the meter, using NVIDIA system power, about 10% for networking and storage, and a PUE of 1.3.', 'dgx-h100', 'dgx-b200', 'nvl72'),
  faq('What is a neocloud?', 'A cloud provider built mainly to rent GPU compute for AI training and inference, as distinct from the general-purpose hyperscalers. Neoclouds lease or build data center capacity and sell it on to AI labs and enterprises.'),
  faq('How fast can I get capacity for a GPU cluster?', 'Colocation with spare power and liquid cooling can take weeks to a few months. Energized sites take months, set by fit-out. New builds usually take 18 months or more, set by the utility date.'),
  faq('How do I request capacity from Invariant?', 'Email pranav@invariant-ai.com or call (628) 220-8972 with the GPU count and type, rack density, date and regions. You can also book a 30 minute call from this page.')],
 ['gpu-cluster-power-requirements', 'gpu-colocation-for-ai-labs', 'small-gpu-cluster-1-to-10-mw'], read=9,
 service={'name': 'Data center capacity sourcing for neoclouds and AI labs', 'serviceType': 'GPU data center capacity sourcing and power verification', 'description': 'Invariant finds US colocation, energized sites, built data centers and powered land for GPU clusters, sized from the GPU count and date, and checks the power behind each option against utility documents.'},
 howto={'name': 'How to find data center capacity for a GPU cluster', 'steps': [
   {'name': 'Size the load', 'text': 'Turn GPU type and count into facility MW and rack density.'},
   {'name': 'Pick the route', 'text': 'Colocation below about 5 MW, an energized or built site from about 5 to 50 MW, powered land above that.'},
   {'name': 'Check the power date', 'text': 'Ask for the document behind the MW and what the date depends on.'},
   {'name': 'Check cooling and terms', 'text': 'Confirm power per cabinet, liquid cooling, minimum bills and fiber before signing.'}]}))

# ================================================================== GPU power
PAGES.append(page('gpu-cluster-power-requirements',
 'How much power does a GPU cluster need? H100, B200 and GB200 NVL72 in MW',
 'GPU cluster power requirements in MW: H100, B200 and GB200 NVL72 from 256 to 100,000 GPUs, kW per GPU, rack density, PUE and what to ask a data center for.',
 'A GPU cluster needs about 1.8 kW per H100, 2.6 kW per B200 and 2.4 kW per GB200 GPU at the meter, once you count the server, networking, storage and cooling. That puts 1,024 B200 GPUs at about 2.6 MW, 16,384 GB200 GPUs at about 39 MW and 100,000 GB200 GPUs at about 238 MW. The figures come from NVIDIA’s published system power, plus about 10% for networking and storage and a PUE of 1.3.',
 ['Size from the system, not the GPU. An H100 is rated up to 700 W, but an eight-GPU DGX H100 draws up to 10.2 kW.',
  'Rack density decides cooling: four DGX H100s is about 41 kW a rack; a GB200 NVL72 is about 120 kW.',
  'PUE turns IT load into what the utility sees. 1.3 is a reasonable planning figure for a new liquid-cooled build.',
  'Ask a data center for MW at the meter and kW per cabinet, both with dates.'],
 [sec('Power per GPU',
    T(['System', 'kW per GPU, system', 'kW per GPU, with networking and storage', 'kW per GPU at the meter (PUE 1.3)'], PER_GPU, 'dgx-h100', 'dgx-b200', 'nvl72'),
    P('NVIDIA rates the H100 SXM at up to 700 W, but the GPU is only part of the server. CPUs, memory, NICs and fans take the eight-GPU DGX H100 to 10.2 kW at maximum, and the DGX B200 to 14.3 kW.', 'h100', 'dgx-h100', 'dgx-b200'),
    P('The GB200 NVL72 packs 36 Grace CPUs and 72 Blackwell GPUs into one liquid-cooled rack drawing about 120 kW.', 'gb200', 'nvl72')),
  sec('Cluster size to MW',
    T(['GPUs', 'H100, facility MW', 'B200, facility MW', 'GB200 NVL72, facility MW'], power_rows(), 'dgx-h100', 'dgx-b200', 'nvl72'),
    P('Our arithmetic: system kW per GPU, times 1.10 for networking and storage, times 1.3 for PUE. Max-rated system power is a sensible sizing basis because training runs keep GPUs near full load for weeks.')),
  sec('Rack density and what it means for the building',
    T(['Configuration', 'Approximate kW per rack', 'Cooling'], [
      ['2 DGX H100 per rack', 'About 20', 'Air, in most modern halls'],
      ['4 DGX H100 per rack', 'About 41', 'Air with rear-door heat exchangers, or liquid'],
      ['4 DGX B200 per rack', 'About 57', 'Rear-door or direct-to-chip liquid'],
      ['GB200 NVL72', 'About 120', 'Direct-to-chip liquid, required'],
    ], 'dgx-h100', 'dgx-b200', 'nvl72'),
    P('Most colocation built before 2023 was designed for 5 to 15 kW a cabinet. So the binding question for a dense cluster is often cooling, not floor space or even total MW.')),
  sec('Where PUE comes in',
    P('PUE is total facility power divided by IT power. Uptime Institute’s data shows large, newer facilities run more efficiently than the industry average. We use 1.3 for a new liquid-cooled build; an older air-cooled colo hall may run higher, and you pay for that in the power bill or the price per kW.', 'uptime-pue')),
 ],
 [faq('How much power does an H100 cluster use?', 'About 1.8 kW per GPU at the meter, so roughly 1.8 MW per 1,000 H100s, based on DGX H100 at 10.2 kW per eight GPUs, about 10% for networking and storage and a PUE of 1.3.', 'dgx-h100'),
  faq('How much power does a GB200 NVL72 rack use?', 'About 120 kW per rack, liquid cooled. With networking, storage and a PUE of 1.3, that is about 170 kW per rack at the meter.', 'nvl72'),
  faq('How many MW for 100,000 GPUs?', 'About 182 MW for H100, 256 MW for B200 and 238 MW for GB200 NVL72 at the meter, using the method on this page.'),
  faq('What is the power draw of a DGX B200?', 'NVIDIA lists 14.3 kW maximum for the eight-GPU DGX B200 system.', 'dgx-b200'),
  faq('Can Invariant find capacity for my cluster size?', 'Yes. Send the GPU count, type and date to pranav@invariant-ai.com and we send powered options that fit.')],
 [PILLAR, 'liquid-cooling-gpu-data-center', 'gpu-colocation-for-ai-labs'], read=6))

# ================================================================== colocation
PAGES.append(page('gpu-colocation-for-ai-labs',
 'GPU colocation for AI labs and neoclouds: what to ask a provider before you sign',
 'GPU colocation checklist for AI labs and neoclouds: power per cabinet, liquid cooling, energized vs contracted MW, delivery dates, minimum terms, fiber and SLAs.',
 'GPU colocation works when a provider can deliver the power per cabinet your racks need, cool it, and do both by your date. Ask for four things in writing: kW per cabinet and the cooling method for your density, total MW energized today versus contracted for later, the delivery date and what it depends on, and the remedy if that date slips. Most halls built before 2023 were designed for 5 to 15 kW a cabinet; a GB200 NVL72 rack runs near 120 kW.',
 ['Energized MW and contracted MW are different. Ask which one your racks sit on.',
  'Get the cooling method for your exact density, not a general "liquid ready" claim.',
  'A delivery date with no remedy is a hope. Leases with longstop dates exist for this reason.',
  'Check fiber routes and cross-connect pricing early; they shape both latency and cost.'],
 [sec('The questions that matter',
    T(['Question', 'Why it matters', 'Good answer'], [
      ['How many kW per cabinet, and how is it cooled?', 'Density sets cooling; cooling sets whether your racks fit', 'A number for your configuration, with rear-door, direct-to-chip or immersion named'],
      ['How much of the hall’s MW is energized today?', 'Contracted power can slip; energized power is there', 'MW energized, MW contracted, with the utility document for each'],
      ['When can my racks be live, and what does that date depend on?', 'Fit-out, cooling plant and transformers drive most delays', 'A date with its dependencies listed'],
      ['What happens if the date slips?', 'You may be paying for GPUs you cannot run', 'Rent abatement, credits or a termination right'],
      ['What is the minimum term and commit?', 'Power-heavy deals carry long commitments', 'Term and ramp that match your contracts'],
      ['Which carriers and routes are in the building?', 'Latency, redundancy and cross-connect cost', 'Named carriers, diverse paths'],
    ], 'longstop', 'nvl72')),
  sec('Why the power date is the real risk',
    P('Capacity deals fail on dates. Poolside’s planned 2 GW campus deal with CoreWeave broke down over whether the first cluster could be ready in time. Large compute contracts, such as Microsoft’s $9.7 billion deal with IREN, pay against delivery milestones.', 'poolside', 'iren'),
    P('Tenants now write power into leases. One data center lease filed with the SEC lets the tenant terminate if firm capacity is not delivered by a longstop date, and gives the tenant approval rights over the power plan.', 'longstop'),
    P('If you are taking colocation or a lease, you inherit the provider’s power risk. A power check on the provider’s site tells you whether the date is backed by an energized service, a signed agreement, or only a request in a queue.')),
  sec('Where we fit',
    P('We find colocation and built capacity that can take your density by your date, and we run a power check on any provider you are already talking to. You get the document behind their MW and what the date depends on, before you sign.')),
 ],
 [faq('What is GPU colocation?', 'Renting space, power and cooling in a data center for your own GPU servers, rather than renting GPU instances from a cloud. You own or lease the hardware; the provider runs the building.'),
  faq('How many kW per rack do I need for GPUs?', 'About 20 to 41 kW for two to four DGX H100 systems, about 57 kW for four DGX B200 systems, and about 120 kW for a GB200 NVL72 rack.', 'nvl72'),
  faq('What should be in a GPU colocation contract?', 'kW per cabinet, cooling method, energized versus contracted MW, a delivery date with dependencies, a remedy if it slips, term and commit, and named carriers.'),
  faq('Can Invariant check a colocation provider’s power?', 'Yes. We check the document behind the provider’s MW and what the date depends on, and report back before you sign.')],
 ['gpu-lease-power-longstop-diligence', 'liquid-cooling-gpu-data-center', 'provider-power-check-for-ai-tenants'], read=6))

# ================================================================== liquid cooling
PAGES.append(page('liquid-cooling-gpu-data-center',
 'Liquid cooling for GPU racks: what a data center needs for 40 to 130 kW racks',
 'What a data center needs for liquid-cooled GPU racks: rear-door heat exchangers, direct-to-chip, CDUs, facility water, and how to tell a liquid-ready hall from a real one.',
 'Racks above about 40 kW need liquid somewhere in the cooling path, and racks near 120 kW, like the GB200 NVL72, need direct-to-chip liquid cooling. That means coolant distribution units, a facility water loop sized for the heat, and floor and piping that can carry it. When a provider says "liquid ready", ask what is installed today, at what kW per rack, and what is only planned.',
 ['Up to about 20 kW a rack, air works in most halls.',
  'About 20 to 50 kW: rear-door heat exchangers or partial liquid.',
  'Above about 50 kW, and for GB200 NVL72 at about 120 kW: direct-to-chip liquid, with CDUs.',
  '"Liquid ready" often means pipes are planned, not installed. Ask for the installed capacity in kW.'],
 [sec('Cooling by rack density',
    T(['kW per rack', 'Usual approach', 'What the building needs'], [
      ['Up to about 20', 'Air, hot and cold aisle containment', 'Standard air handling'],
      ['About 20 to 50', 'Rear-door heat exchangers, in-row cooling', 'Chilled or facility water to the rack'],
      ['About 50 to 130+', 'Direct-to-chip liquid cooling', 'CDUs, a facility water loop, leak detection, and air for the remaining heat'],
      ['Specialist', 'Immersion', 'Tanks, fluid handling, floor loading'],
    ], 'nvl72', 'gb200'),
    P('NVIDIA designed the GB200 NVL72 as a liquid-cooled rack. There is no air-cooled version to fall back on.', 'gb200')),
  sec('What to ask a provider',
    L(['How many kW per rack can you cool today, installed, and how many after planned work?',
       'Direct-to-chip or rear-door? Who supplies and maintains the CDUs?',
       'What is the facility water temperature and capacity, and is there redundancy?',
       'How is the remaining air-side heat handled at full density?',
       'Floor loading for a fully populated liquid-cooled rack.',
       'Who owns the risk of a leak, and how is it detected?'])),
  sec('Why this narrows the map',
    P('Liquid cooling at scale is easier in a new build than a retrofit. That is one reason energized mining sites and new powered shells are attractive for dense clusters: the power is there and the cooling can be built for the racks. Our guide on converting mining sites covers what carries over.')),
 ],
 [faq('Do GPU racks need liquid cooling?', 'Above about 40 to 50 kW per rack, in practice yes. GB200 NVL72 racks at about 120 kW are liquid cooled by design.', 'nvl72', 'gb200'),
  faq('What is direct-to-chip liquid cooling?', 'Coolant runs through cold plates on the GPUs and CPUs and carries heat to a coolant distribution unit, which hands it to the facility water loop.'),
  faq('What does liquid-ready mean in a data center?', 'Usually that the building is designed to add liquid cooling. Ask what is installed today, in kW per rack, versus what is planned.'),
  faq('Can Invariant find liquid-cooled capacity?', 'Yes. Tell us the rack density and date and we send capacity that can cool it, or sites where it can be built.')],
 ['gpu-cluster-power-requirements', 'gpu-colocation-for-ai-labs', 'convert-bitcoin-mining-site-to-ai-hpc-data-center'], read=5))

# ================================================================== small clusters
PAGES.append(page('small-gpu-cluster-1-to-10-mw',
 'Where a small AI lab can put 1 to 10 MW of GPUs in the US',
 'Options for a small AI lab or neocloud needing 1 to 10 MW for GPUs: colocation, Tier III rooms, energized edge and mining sites, with timing and what to check.',
 'A small AI lab or early neocloud needing 1 to 10 MW, roughly 500 to 5,000 GPUs, has more options than it might think. Colocation in a hall with liquid cooling is the fastest if one has room. Small built Tier III facilities can be leased whole. Energized mining and edge sites already have the utility service and can be live in months once cooling and fiber are added. Invariant tracks all three and checks the power behind each.',
 ['1 MW at the meter fits about 400 to 550 GPUs, depending on the generation.',
  'At this size you are usually on the utility distribution system, so existing service is everything.',
  'Mining sites have power but rarely the fiber, redundancy or cooling a training cluster needs. Budget for all three.',
  'Ask for a recent utility bill or service letter showing the transformer and contracted capacity.'],
 [sec('What 1 to 10 MW holds',
    T(['Facility MW', 'H100 GPUs', 'B200 GPUs', 'GB200 GPUs'], [
      [f'{mw} MW'] + [f'about {int(mw * 1000 / (kw * NET * PUE)):,}' for _, kw in SYSTEMS] for mw in (1, 2, 5, 10)
    ], 'dgx-h100', 'dgx-b200', 'nvl72'),
    P('Rounded down from the method in our GPU power guide: NVIDIA system power, about 10% for networking and storage, PUE 1.3.')),
  sec('The options',
    T(['Option', 'Speed', 'Watch for'], [
      ['Colocation, liquid-capable hall', 'Fastest when space exists', 'kW per cabinet, delivery date, term'],
      ['Built Tier III facility, leased whole', 'Months', 'Cooling density, age of the plant'],
      ['Energized mining or edge site', 'Months, after cooling and fiber', 'Redundancy, fiber, interruptible power terms'],
      ['New small build on existing service', 'About a year', 'Transformer lead times, permits'],
    ])),
  sec('Capacity in this range',
    *inv(['t3', 'ia2e', 'hou3', 'pa5', 'ok5', 'or10', 'nc18', 'ky30'],
         'Sites in our inventory between a few hundred kW and the low tens of MW, as teasers.')),
 ],
 [faq('How many GPUs fit in 1 MW?', 'About 550 H100s, 390 B200s or 420 GB200 GPUs at the meter, using NVIDIA system power, about 10% for networking and storage and a PUE of 1.3.', 'dgx-h100', 'dgx-b200', 'nvl72'),
  faq('Can a bitcoin mining site host AI GPUs?', 'Often, for the power. Most need added fiber, redundancy and liquid cooling, and their power contracts may be interruptible.'),
  faq('Where can a small AI lab get 5 MW of GPU capacity?', 'Colocation halls with liquid cooling, small built Tier III facilities and energized mining or edge sites. Invariant can send options that fit your date.'),
  faq('How do I start?', 'Email pranav@invariant-ai.com with the GPU count and type, density and date.')],
 [PILLAR, 'gpu-cluster-power-requirements', 'energized-data-center-sites-available-now'], read=5))

# ================================================================== build vs lease vs colo
PAGES.append(page('neocloud-build-lease-or-colocate',
 'Build, lease or colocate: how neoclouds and AI labs get to power fastest',
 'Build vs lease vs colocate for neoclouds and AI labs: time to power, capital, control and risk at 5, 50 and 500 MW, and when to move from one to the next.',
 'For a neocloud or AI lab, colocation gets you running fastest with the least capital, leasing a whole building or site gives you control at medium scale, and building on powered land gives the lowest long-run cost per MW but the longest wait and the most risk. The deciding variable is the date power is available, which is why the right choice changes with size: colocation below about 5 MW, a lease from about 5 to 50 MW, and building above that.',
 ['Time to power usually beats price per kW. Idle GPUs cost far more than rent.',
  'Building means owning the utility relationship, the large-load tariff and its minimum bill.',
  'Leasing moves the power risk to the landlord, but only if the lease says so.',
  'Many neoclouds do all three at once: colo for today, a lease for next year, land for 2028.'],
 [sec('The trade-offs',
    T(['', 'Colocate', 'Lease a building or site', 'Build on powered land'], [
      ['Typical size', 'Up to about 10 MW', 'About 5 to 100 MW', '50 MW to 1 GW+'],
      ['Time to power', 'Weeks to months', 'Months', 'Usually 18 months or more'],
      ['Capital', 'Lowest', 'Fit-out and equipment', 'Highest'],
      ['Control over design', 'Low', 'Medium', 'Full'],
      ['Who holds the power risk', 'Provider', 'Landlord, if the lease says so', 'You'],
      ['Utility commitments', 'None directly', 'Often passed through', 'Minimum bill, term, security'],
    ], 'lbnl')),
  sec('When building makes sense',
    P('Owning the power pays off once the cluster is big and long-lived enough to absorb a long utility term. New large-load tariffs set minimum bills near 80 to 85% of contract demand for 12 years or more, so you need the demand to fill it.', 'lbnl', 'aep-dct'),
    P('Building also means a utility study cycle. In Texas, large loads now go through ERCOT’s batch process; elsewhere, a load study can take months before construction starts.', 'batch0')),
  sec('On-site generation as a shortcut',
    P('Some neoclouds bridge to grid power with on-site gas. It can work, but it has its own clock: turbines, air permits and gas supply. Cleanview counted only about 2 GW running out of some 90 GW of identified behind-the-meter projects.', 'cleanview', 'epa-titlev')),
 ],
 [faq('Should a neocloud build its own data center?', 'Usually only once it needs tens of MW or more for many years. Below that, colocation or leasing gets to power faster with less capital and less utility risk.'),
  faq('Is it faster to lease or build data center capacity?', 'Leasing an energized building or site is usually months; building on powered land is usually 18 months or more, set by the utility date and long-lead equipment.'),
  faq('What does it cost to commit to utility power for a data center?', 'Beyond construction, large-load tariffs set minimum bills near 80 to 85% of contract demand for 12 years or more.', 'lbnl', 'aep-dct'),
  faq('Can Invariant help us decide?', 'Yes. Send the cluster plan and dates and we lay out the options we can source in each route.')],
 [PILLAR, 'gpu-lease-power-longstop-diligence', 'behind-the-meter-power-for-data-centers'], read=6))

# ================================================================== longstop diligence
PAGES.append(page('gpu-lease-power-longstop-diligence',
 'Power longstop dates in GPU and data center leases: check the provider’s power before you sign',
 'How AI tenants and neoclouds protect a GPU deployment date: power longstop clauses, what document backs a provider’s MW, and the power check to run before signing.',
 'A power longstop date lets a tenant walk away, or get paid, if the landlord or provider does not deliver firm power by a fixed date. Tenants added these clauses because compute deals keep failing on power dates. Before you rely on one, check the power yourself: which document backs the provider’s MW, which upgrades the date depends on, and whether anyone else is filing for the same capacity. A clause gives you a remedy; only the power check tells you whether you will need it.',
 ['Longstop clauses are now common in AI data center leases.',
  'Lenders release cash against energization milestones, so a slipped date hits the provider’s financing too.',
  'The document behind the MW is the first thing to check: energized service, signed agreement, load study or nothing.',
  'An independent power study names what the date depends on.'],
 [sec('What longstop clauses look like',
    P('One AI data center lease filed with the SEC lets the tenant terminate if firm capacity is not delivered by a "Firm Capacity Longstop Date", and requires the tenant’s written approval of the power plan: sources, interconnection path, substation and switchgear.', 'longstop'),
    P('Lenders work the same way. Davis Polk describes power as the risk to settle first in data center financings, and BCLP describes lenders asking for a firm connection date and releasing loan tranches against energization milestones.', 'davispolk', 'bclp')),
  sec('Why dates slip',
    P('Poolside’s planned campus with CoreWeave fell apart over the first cluster’s readiness date. Behind-the-meter plans slip on turbines and air permits; Cleanview counted about 2 GW running out of some 90 GW identified.', 'poolside', 'cleanview'),
    P('Grid dates slip on upgrades, transformer deliveries and utility study cycles. Paces found only about 17% of ERCOT substations near suitable land had any withdrawal headroom, so many dates depend on network upgrades that are not built yet.', 'paces')),
  sec('The power check to run before signing',
    L(['Get the document behind the MW: energized service, construction agreement, load study, will-serve letter, or a map.',
       'Find the point of interconnection and the utility, and whether the date depends on network upgrades.',
       'Check for other large loads filing at the same substation.',
       'For on-site generation: turbine delivery, air permit status and gas supply.',
       'Run an independent power study on the connection if the date matters to your financing.'], 'epa-titlev'),
    P('Invariant runs this check, usually within 48 hours, and reports what the date depends on in plain terms your counsel and lenders can use.')),
 ],
 [faq('What is a power longstop date in a data center lease?', 'A date by which the landlord must deliver firm power. If it is missed, the tenant can terminate or receive a remedy set in the lease.', 'longstop'),
  faq('How do I check a data center provider’s power?', 'Ask for the document behind the MW, find the point of interconnection and its dependencies, check for competing loads, and run an independent power study if the date matters.'),
  faq('Why do AI data center deals fail?', 'Most often on the power date: upgrades, equipment, permits or study cycles slip, and the cluster cannot be ready when the customer needs it.', 'poolside'),
  faq('Can Invariant check a provider before we sign?', 'Yes, usually within 48 hours. Email pranav@invariant-ai.com with the site or provider.')],
 ['provider-power-check-for-ai-tenants', 'gpu-colocation-for-ai-labs', 'utility-grade-power-study'], read=6))

# ================================================================== service: provider power check
PAGES.append(page('provider-power-check-for-ai-tenants',
 'Power check on a data center provider or site for AI tenants and neoclouds',
 'An independent power check for AI tenants and neoclouds: the document behind a provider’s MW, the connection, competing loads, upgrades and a realistic power date, in 48 hours.',
 'Before a neocloud or AI lab signs for capacity, Invariant checks the power behind it. We find the document that backs the provider’s MW, the utility and point of interconnection, the upgrades the date depends on, other large loads filing for the same capacity, and the permit path for any on-site generation. Where it matters, we run a utility-grade power study with N-1 tests. You get a plain answer on whether the date holds, usually within 48 hours.',
 ['Built for the tenant’s side of the table: you see what the provider’s date depends on.',
  'Every finding cites its source, so counsel and lenders can use it.',
  'Works for colocation providers, landlords, miners turned AI hosts and your own sites.',
  'Our figures are screening figures; the utility’s own study makes a number firm.'],
 [sec('What the check covers',
    T(['Item', 'What we look at'], [
      ['Power evidence', 'Energized service, signed agreement, load study, will-serve letter or none, and what each proves'],
      ['Connection', 'Utility, ISO, point of interconnection, voltage, and whether the date needs network upgrades'],
      ['Competing loads', 'Other large loads announced or filed nearby that share the headroom'],
      ['On-site generation', 'Turbine supply, air permit status, gas supply'],
      ['Local risk', 'Zoning, moratoriums, community opposition'],
      ['Power study (when needed)', 'AC power flow with N-1 tests at the connection, MW by year, upgrades, cost and date range'],
      ['Verdict', 'Whether the date holds, what would move it, and the questions to put to the provider'],
    ], 'epa-titlev')),
  sec('Who uses it',
    P('Neoclouds signing capacity with a host, AI labs signing with a neocloud or a landlord, and the lenders and investors behind either. Lenders already release cash against energization milestones; this check tells you how likely each milestone is.', 'bclp')),
  sec('How to request one',
    P('Send the site address or coordinates, or the provider and campus, plus the MW and the date in the contract. We come back within 48 hours, or sooner for a first read.')),
 ],
 [faq('Can I get an independent check of a data center provider’s power?', 'Yes. Invariant checks the document behind the MW, the connection, competing loads, upgrades and on-site generation permits, and runs an N-1 power study where needed, usually within 48 hours.'),
  faq('Who pays for a provider power check?', 'Usually the tenant or its lender, before signing or before a draw.'),
  faq('Is this the same as the utility’s study?', 'No. The utility’s study commits the utility; ours tells you whether the provider’s date is realistic and what it depends on.'),
  faq('How do I request a power check?', 'Email pranav@invariant-ai.com or call (628) 220-8972 with the site or provider, MW and contract date.')],
 ['gpu-lease-power-longstop-diligence', 'utility-grade-power-study', PILLAR], read=4,
 service={'name': 'Provider and site power check for AI tenants', 'serviceType': 'Independent power due diligence for AI data center capacity', 'description': 'An independent check of the power behind a data center provider or site for neoclouds, AI labs and their lenders: power evidence, point of interconnection, upgrades, competing loads, on-site generation permits and an N-1 power study where needed.'}))

out = json.dumps(PAGES, indent=1, ensure_ascii=False)
assert '—' not in out and '–' not in out, 'em or en dash'
open(sys.argv[1], 'w').write(out + '\n')
print(f'wrote {len(PAGES)} pages')
