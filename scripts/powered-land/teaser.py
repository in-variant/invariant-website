"""Partial-coverage site pages: enough to rank and to qualify, the rest is held for the call."""
import json, sys
from common import DATE, SRC, sources, p, ul, table, sec, faq

SRC.update({
    'hq': ('Hydro-Quebec', 'https://www.hydroquebec.com/', 'Hydro-Quebec'),
    'statnett': ('Statnett', 'https://www.statnett.no/en/', 'Statnett'),
    'eia-nd': ('EIA North Dakota electricity profile', 'https://www.eia.gov/electricity/state/northdakota/', 'U.S. Energy Information Administration'),
    'eia-sc': ('EIA South Carolina electricity profile', 'https://www.eia.gov/electricity/state/southcarolina/', 'U.S. Energy Information Administration'),
})

UTILITY = {'aps', 'oge', 'centerpoint', 'kypower', 'im', 'nvenergy', 'mpw', 'ku'}
HUB = 'powered-land-for-sale-data-center-sites'
GUIDE = 'data-center-site-selection-permitting'

HELD = [
    'Exact location, parcel and site plan',
    'Utility, substation and interconnection documents',
    'Power price and contract terms',
    'Asking price and deal structure',
    'Seller data room and diligence reports',
]


def site(slug, title, desc, region, stats, intro, angle, fit, extra_faqs, srcs, related, held=None, minutes=3, units=None):
    """stats: list of [item, public value] rows. angle: one paragraph on why the site is interesting, no specifics held back."""
    held = held or HELD
    srcs = [x for x in srcs if x not in UTILITY]
    extra_faqs = [dict(f, sourceIds=[i for i in f.get("sourceIds", []) if i not in UTILITY]) if f.get("sourceIds") else f for f in extra_faqs]
    extra_faqs = [{k: v for k, v in f.items() if not (k == "sourceIds" and not v)} for f in extra_faqs]
    sections = [
        sec('what-we-can-share', 'What we can share publicly', table(['Item', 'Summary'], stats + [['Price and terms', 'Shared on a call']], *srcs[:2])),
        *([sec('sites-on-this-page', 'Every site on this page', table(['Site', 'Power', 'Setup', 'Listed'], units))] if units else []),
        sec('why-this-site', 'Why this site is worth a call', p(angle, *srcs[:1])),
        sec('who-it-fits', 'Who this site fits', p(fit)),
        sec('full-package', 'What you get on the call',
            p('We keep the specifics off the public page because owners ask us to, and because a site that is shopped everywhere loses value. On a 30 minute call we confirm your load, timeline and budget, then share:'),
            ul(*held),
            p('If this one is not right, we bring others that are. Most of what we place is never posted.')),
    ]
    faqs = extra_faqs + [
        faq('How do I get the full details and price?', 'Book a call with Invariant using the link at the top of this page, or call or text (628) 220-8972. We share the location, utility documents and terms after a short fit check.'),
        faq('Is this site still available?', 'Availability changes weekly. We confirm current status on the call and bring comparable options if it has moved.'),
    ]
    return {'slug': slug, 'topic': 'Data Centers', 'kind': 'site-listing', 'region': region, 'title': title,
            'description': desc, 'date': DATE, 'readMinutes': minutes, 'intro': intro,
            'takeaways': [f'{a}: {b}.' for a, b in stats[:4]] + ['Location, utility documents and price are shared on a call.'],
            'sections': sections, 'faqs': faqs, 'sources': sources(*srcs), 'relatedSlugs': related}


S = []

S.append(site('arizona-1-5-gw-powered-land-ai-campus',
    'Arizona powered land for sale: 1.5 GW AI campus with utility-studied grid power',
    'A multi-GW Arizona AI campus with 1.5 GW of utility-studied Phase 1 capacity, onsite high-voltage switchyard, rail and interstate access. Available to buy or lease. Details on a call.',
    'Arizona, United States',
    [['Power', '1.5 GW Phase 1, studied by the utility, several GW more in the queue'], ['Land', 'Over 15,000 acres, thousands already zoned for data centers'], ['Timing', 'Grid power 2027, onsite generation inside a year'], ['Use', 'Hyperscale and large AI training campuses'], ['Access', 'Interstate and Class I rail']],
    'We have a 1.5 GW powered land campus in Arizona available to buy or lease. Phase 1 grid capacity has been studied by the serving utility, a high-voltage switchyard is already on the land, and onsite generation can energize in under a year while the grid build finishes. The land position runs past 15,000 acres.',
    'Very few US sites can credibly say gigawatt. This one has a utility study behind Phase 1, an existing switchyard for the first block of load and a bridge-power plan, so a buyer is not betting the schedule on a single interconnection date. Incentive designations on the land also improve the after-tax math.',
    'Hyperscalers, neoclouds and developers that need hundreds of MW on one campus and want to phase toward multiple GW. Too large for a 20 MW colocation build.',
    [faq('How much power is available at the Arizona campus?', '1.5 GW in Phase 1, studied by the serving utility, with grid power targeted for 2027 and onsite generation available sooner.', 'aps')],
    ['aps', 'eia-az', 'oz', 'ec'], [HUB, GUIDE]))

S.append(site('north-carolina-18-mw-ai-campus-207-acres-for-sale',
    'North Carolina AI campus for sale: 18 MW live on 200+ acres, path past 100 MW',
    'An energized North Carolina AI campus with 18 MW live today, more committed by the utility, 200+ acres and a route past 100 MW. Phase I done. Details on a call.',
    'North Carolina, United States',
    [['Power', '18 MW live today, more committed for 2028'], ['Land', 'About 200 acres core, more available'], ['Timing', 'Energized now'], ['Use', 'AI inference, neocloud, HPC conversion'], ['Diligence', 'Phase I and environmental work completed']],
    'We have an energized AI campus in North Carolina with 18 MW live and billed today, additional capacity committed by the utility for 2028 and a path past 100 MW. It sits on roughly 200 acres in a Tier 1 county with an onsite substation, carrier fiber on the property and GPU racks already running.',
    'Most powered land pitches stop at a capacity number. This one has well over a year of reconciled utility bills behind it, so the operating cost is proven rather than modelled. Environmental diligence is already done, which removes months from a buyer\'s schedule.',
    'AI and neocloud operators who need 10 to 30 MW now and a credible route to 100 MW, plus miners converting to HPC.',
    [faq('How much power is live at the North Carolina campus?', '18 MW is live and billed today, with further capacity committed by the utility for 2028.', 'eia-nc')],
    ['eia-nc'], [HUB, GUIDE]))

S.append(site('oklahoma-city-55-mw-powered-brownfield-84-acres-oge',
    'Oklahoma City powered land: 55 MW contracted on an industrial-zoned brownfield',
    'An industrial-zoned Oklahoma City brownfield with 55 MW under executed utility service agreements, a prior data center permit and an onsite transformer. Details on a call.',
    'Oklahoma, United States',
    [['Power', '55 MW under executed utility agreements'], ['Land', 'About 80 acres, industrial zoning'], ['Timing', 'Energized, feeder upgrade quoted'], ['Use', 'Mining, hosting or phased AI and HPC'], ['Permits', 'Prior city data center permit and full design set']],
    'We have a powered brownfield in Oklahoma City with 55 MW contracted under executed utility service agreements. The roughly 80-acre site is zoned industrial, carries a prior city-approved data center permit and a full civil and electrical design set, and has a large transformer already on site.',
    'Plenty of Oklahoma land sits near transmission. Far less of it has signed service agreements and a permit. Here the utility paperwork is done and the next feeder upgrade already has a quote and a schedule.',
    'Miners wanting low-cost SPP power, and HPC developers who want a phased build on land that already carries a data center permit.',
    [faq('How much power does the Oklahoma City site have?', '55 MW under executed utility service agreements, on an industrial-zoned brownfield of about 80 acres.', 'oge')],
    ['oge', 'spp', 'eia-ok'], [HUB, 'oklahoma-5-mw-turnkey-mining-site-for-sale']))

S.append(site('oklahoma-5-mw-turnkey-mining-site-for-sale',
    'Oklahoma mining sites for sale: two 5 MW turnkey sites with utility service',
    'A turnkey 5 MW Oklahoma bitcoin mining site on owned acreage with mineral and water rights, transformers, containers and a utility agreement in place. Fast close. Details on a call.',
    'Oklahoma, United States',
    [['Power', '5 MW installed, utility agreement in place'], ['Land', 'A few owned acres with mineral and water rights'], ['Timing', 'Operating, closes in weeks'], ['Use', 'Bitcoin mining'], ['Included', 'Transformers, containers, building']],
    'We have two turnkey 5 MW mining sites in Oklahoma. The first sits on owned land, sold with its mineral and water rights. Transformers, mining containers, a brick building and the utility agreement all come with the sale, and the seller can close within weeks of a signed agreement. The second is an operating 5 MW farm in eastern Oklahoma with low-cost power.',
    'Small owned sites with transferable utility deposits are hard to find. Curtailed power on this site lands well below the US industrial average, and Oklahoma tax treatment helps qualifying miners.',
    'A miner who wants a small, owned, energized site and a fast close. Not an AI campus.',
    [faq('What comes with the Oklahoma 5 MW site?', 'The land with mineral and water rights, transformers, containers, a building and the utility agreement.', 'oge')],
    ['oge', 'eia-ok'], [HUB, 'oklahoma-city-55-mw-powered-brownfield-84-acres-oge'],
    units=[
        ['Oklahoma site A (central OK)', '5 MW installed, 3 MW utility agreement', 'Owned acres with mineral and water rights', 'November 2026'],
        ['Oklahoma site B (eastern OK)', '5 MW', 'Operating farm', 'April 2025'],
    ]))

S.append(site('kentucky-turnkey-bitcoin-mining-sites-for-sale',
    'Kentucky bitcoin mining sites for sale: seven turnkey sites from 0.5 MW to 8 MW',
    'Seven energized Kentucky mining sites for sale, 0.5 MW to 8 MW, most with owned land or real estate and two with room past 20 MW. Power, prices and locations on a call.',
    'Kentucky, United States',
    [['Power', 'Seven sites from 0.5 MW to 8 MW, two expandable past 20 MW'], ['Land', 'Owned land or buildings on most sites'], ['Timing', 'All energized and operating'], ['Use', 'Bitcoin mining, small HPC'], ['Grids', 'PJM, MISO and regional utilities']],
    'We have seven turnkey bitcoin mining sites in Kentucky, from 0.5 MW to 8 MW, all energized and selling with infrastructure in place. Most include owned land or real estate (two come with warehouses and office space), two can grow past 20 MW at existing substations, and several qualify for Kentucky tax incentives.',
    'Kentucky combines low industrial power prices with miner-friendly tax treatment, and these sites already have the utility accounts, transformers and containers. One carries demand response income on top. Another sits in a county with no zoning or noise rules.',
    'Miners adding 2 to 8 MW quickly, and buyers who want a small site today with expansion headroom.',
    [faq('What Kentucky mining sites are for sale?', 'Seven energized sites from 0.5 MW to 8 MW, most with owned land or buildings, two expandable past 20 MW.', 'eia-ky')],
    ['eia-ky', 'pjm', 'miso'], [HUB, 'kentucky-30-mw-greenfield-data-center-site'],
    units=[
        ['Kentucky site A (western KY)', '3.8 MW substation, 2 MW live', 'Owned land, entity sale, demand response income', 'October 2026'],
        ['Kentucky site B (western KY)', '5 MW grid-connected', 'Leased pad, containers and ASIC fleet included', 'October 2026'],
        ['Kentucky site C (eastern KY, PJM)', '5 MW, expandable to 20 MW', 'Owned land, containers', 'October 2026'],
        ['Kentucky site D', '2 MW', 'Building, transformers, plug-in ready', 'October 2026'],
        ['Kentucky site E (southeastern KY)', '8 MW, scalable to 22 MW', 'About 6 titled acres, no zoning', 'October 2025'],
        ['Kentucky site F', '1.75 MW', 'Warehouse and two-story office', 'September 2025'],
        ['Kentucky site G (central KY)', '0.5 MW, expandable to 1 MW+', 'Industrial lot with warehouse and rental unit', 'September 2025'],
    ]))

S.append(site('iowa-2-mw-ai-edge-site-at-a-power-plant',
    'Iowa AI edge site for sale: 2 MW+ behind the fence of a utility power plant',
    'A small energized AI and HPC edge site in eastern Iowa inside the fence of a utility generating station, with lit fiber and no shutdowns to date. Details on a call.',
    'Iowa, United States',
    [['Power', 'Just over 2 MW, available now'], ['Land', 'Industrial-zoned lease'], ['Timing', 'Energized'], ['Use', 'AI inference and edge compute'], ['Fiber', 'Multi-gig lit, dark fiber available']],
    'We have an energized edge site in eastern Iowa with just over 2 MW available now. It sits behind the fence of a municipal utility\'s own generating station, has lit multi-gig fiber with dark fiber available, and has not had a shutdown to date.',
    'Inference wants low latency and steady power. This site gets both from the same utility, which owns its own generation and sells fiber.',
    'Inference and edge operators who need a few MW energized now rather than in 2028.',
    [faq('How much power is at the Iowa edge site?', 'Just over 2 MW, available now, from a municipal utility with its own generation.', 'miso')],
    ['miso', 'eia-ia'], [HUB, 'north-carolina-18-mw-ai-campus-207-acres-for-sale']))

S.append(site('houston-texas-3-mw-ercot-mining-site-for-sale',
    'Houston mining site for sale: 3 MW energized on ERCOT with fixed power to 2030',
    'An energized 3 MW ERCOT site in the Houston metro with a fixed power contract through 2030 and a warehouse on site. Details on a call.',
    'Texas, United States',
    [['Power', '3 MW live on ERCOT'], ['Contract', 'Fixed energy price through 2030'], ['Timing', 'Energized and inspected'], ['Use', 'Bitcoin mining, small compute'], ['Building', 'Warehouse on site']],
    'We have an energized 3 MW site in the Houston metro on ERCOT, with a fixed energy contract through 2030, the utility transformer installed and inspection passed, and a warehouse on site about 20 minutes from downtown.',
    'ERCOT prices swing hard in summer. A fixed energy price through 2030 takes most of that risk away, and peak-period curtailment lowers the transmission part of the bill.',
    'Miners who want a metro site that is easy to staff and service.',
    [faq('What grid is the Houston site on?', 'ERCOT, inside the Houston metro.', 'ercot')],
    ['ercot', 'centerpoint', 'eia-tx'], [HUB, 'texas-44-mw-data-center-property-250-mw-expansion']))

S.append(site('ohio-300-mw-powered-land-345-kv-data-center-site',
    'Ohio powered land for data centers: 300 MW approved on transmission voltage',
    'An Ohio data center site with 300 MW of approved capacity at transmission voltage, 300+ acres, backbone fiber and gas, energizing 2027. Details on a call.',
    'Ohio, United States',
    [['Power', '300 MW approved, transmission voltage'], ['Land', 'Over 300 acres'], ['Timing', 'First half of 2027'], ['Use', 'Hyperscale, AI training'], ['Extras', 'Backbone fiber, municipal water, natural gas']],
    'We have an Ohio site with 300 MW of approved capacity at transmission voltage on more than 300 acres, scheduled to energize in the first half of 2027. Backbone fiber, municipal water and natural gas are all at the site.',
    'In PJM, land is not the scarce input. A utility commitment on a date is. This site has the approval, and the gas supply gives a bridge-power option if the grid date slips.',
    'Hyperscale and AI training buyers who need a 2027 date in PJM.',
    [faq('How much power does the Ohio site have?', '300 MW of approved capacity at transmission voltage, energizing in the first half of 2027.', 'pjm')],
    ['pjm', 'eia-oh'], [HUB, 'indianapolis-200-mw-greenfield-data-center-site']))

S.append(site('nevada-375-mw-powered-land-230-kv-data-center-site',
    'Nevada powered land for data centers: 375 MW with water and gas on 350 acres',
    'A 350-acre Nevada data center site with 375 MW, a dual-circuit high-voltage substation, an approved water reservoir and large gas supply, energizing 2027 to 2028. Details on a call.',
    'Nevada, United States',
    [['Power', '375 MW, dual-circuit high-voltage substation'], ['Land', 'About 350 buildable acres'], ['Timing', '2027 to 2028'], ['Use', 'Hyperscale, AI training'], ['Water', 'Approved reservoir with expansion approvals']],
    'We have a Nevada site with 375 MW on about 350 buildable acres, served by a dual-circuit high-voltage substation and scheduled to energize in 2027 or 2028. It has an approved water reservoir, backbone fiber and gas supply large enough for over 100 MW of onsite generation.',
    'In Nevada, power is hard and water is harder. An approved reservoir removes the question that kills most desert sites late in diligence.',
    'Hyperscale and AI buyers looking west of the Rockies.',
    [faq('Does the Nevada site have water?', 'Yes, an approved reservoir with expansion approvals in place.', 'eia-nv')],
    ['nvenergy', 'eia-nv'], [HUB, 'arizona-1-5-gw-powered-land-ai-campus']))

S.append(site('indianapolis-200-mw-greenfield-data-center-site',
    'Indianapolis data center land: 200 MW greenfield with a completed utility load study',
    'An Indianapolis-area greenfield with a completed 200 MW utility load study, strong water and six long-haul fiber carriers, plus Indiana data center tax incentives. Details on a call.',
    'Indiana, United States',
    [['Power', '200 MW, utility load study completed'], ['Land', 'About 80 acres'], ['Timing', 'Utility substation planned'], ['Use', 'AI and enterprise data centers'], ['Fiber', 'Six long-haul carriers']],
    'We have a greenfield near Indianapolis with a completed 200 MW load study from the serving utility. The roughly 80-acre site has strong water capacity, six long-haul fiber carriers and a dual-circuit utility substation planned, and it can qualify for Indiana\'s long-term data center sales tax exemption.',
    'A load study is the utility\'s own engineering answer to whether it can serve the load, with upgrades and a schedule. Most sites marketed as powered have not reached this step. This one has.',
    'AI and enterprise builders who want Midwest power with a utility study already done.',
    [faq('Has the utility studied the Indianapolis site?', 'Yes. A 200 MW load study has been completed.', 'im')],
    ['im', 'eia-in'], [HUB, 'ohio-300-mw-powered-land-345-kv-data-center-site']))

S.append(site('kentucky-30-mw-greenfield-data-center-site',
    'Kentucky data center site: 30 MW available now on rezoned land',
    'A rezoned eastern Kentucky greenfield with 30 MW available immediately on dual-circuit lines at the property, a large building pad and utilities at the line. Details on a call.',
    'Kentucky, United States',
    [['Power', '30 MW available immediately'], ['Land', 'About 16 acres, more available'], ['Timing', 'Now'], ['Use', 'Neocloud and AI inference'], ['Zoning', 'Rezoning completed']],
    'We have a rezoned greenfield in eastern Kentucky with 30 MW available immediately on dual-circuit lines already at the property. It has a 100,000 sq ft building pad, water, sewer, fiber and gas at the line, and more land next door.',
    'Thirty MW you can use this year, with zoning done. That leaves design and procurement on the critical path, which the buyer controls.',
    'Neocloud and inference operators who need power this year.',
    [faq('How much power is available at the Kentucky greenfield?', '30 MW, available immediately on dual-circuit lines at the property.', 'kypower')],
    ['kypower', 'eia-ky'], [HUB, 'kentucky-turnkey-bitcoin-mining-sites-for-sale']))

S.append(site('wisconsin-150-mw-data-center-mining-site-for-sale',
    'Wisconsin site for sale: 150 MW substation built, 80 MW available now',
    'A Wisconsin data center or mining site with a built 150 MW substation, 80 MW available now, 130 ready acres, abundant water and a gas terminal. Details on a call.',
    'Wisconsin, United States',
    [['Power', '150 MW substation built, 80 MW now'], ['Land', '130 ready acres of 300+'], ['Timing', 'Now, rest after utility upgrades'], ['Use', 'AI, HPC or bitcoin mining'], ['Extras', 'Large water supply, gas terminal']],
    'We have a Wisconsin property with a 150 MW substation already built and 80 MW available now, with the rest after utility upgrades. It offers 130 ready-to-build acres of a 300+ acre property, millions of gallons a day of water and a gas terminal ready for onsite generation.',
    'Large transformer lead times still run well over a year. A substation that is already standing gives 80 MW without waiting in that line, and the cold climate cuts cooling energy.',
    'Buyers who need tens of MW now with room to grow.',
    [faq('How much power is available now in Wisconsin?', '80 MW now from a built 150 MW substation.', 'eia-wi')],
    ['miso', 'eia-wi'], [HUB, 'indianapolis-200-mw-greenfield-data-center-site']))

S.append(site('texas-44-mw-data-center-property-250-mw-expansion',
    'Texas data center property: 44 MW now, 250 MW more within 30 months',
    'An urban Texas data center property with 44 MW available now, 250 MW more within 30 months and about 1M sq ft of existing buildings. Details on a call.',
    'Texas, United States',
    [['Power', '44 MW now, +250 MW within 30 months'], ['Buildings', 'About 1M sq ft existing'], ['Land', 'About 50 acres'], ['Use', 'AI halls, colocation'], ['Setting', 'Inside a major Texas metro']],
    'We have a Texas data center property inside one of the state\'s largest metros with 44 MW available now and another 250 MW within 30 months. About a million square feet of buildings already stand on roughly 50 acres, with a dual-circuit substation, water and fiber.',
    'Most Texas powered land is out in the country and needs a new shell. Here the structure already stands inside the metro, which can save a year of construction.',
    'AI and colocation operators who want metro fiber and existing buildings.',
    [faq('How much power is available at the Texas property?', '44 MW now, with 250 MW more within 30 months.', 'ercot')],
    ['ercot', 'eia-tx'], [HUB, 'houston-texas-3-mw-ercot-mining-site-for-sale']))

S.append(site('kansas-250-mw-behind-the-meter-gas-power-site',
    'Kansas behind-the-meter power: gas, land and minerals with a path to 250 MW',
    'A Kansas gas, land and mineral asset with tens of MW of behind-the-meter generation running from owned wells and a path to 250 MW. Details on a call.',
    'Kansas, United States',
    [['Power', 'Tens of MW live behind the meter, path to 250 MW'], ['Fuel', 'Owned gas wells and gathering system'], ['Land', 'Large mineral acreage'], ['Use', 'AI or mining with own fuel'], ['Fiber', 'High-capacity geo-redundant']],
    'We have a Kansas asset that combines land, owned gas wells and onsite generation. Tens of MW are running behind the meter today, with a path to 250 MW, a large gathering pipeline system and high-capacity fiber.',
    'Most behind-the-meter projects buy gas from someone else. This one owns the wells, which is the strongest fuel hedge a long-life load can have.',
    'Buyers who want power independent of a grid queue.',
    [faq('How far can the Kansas asset scale?', 'To about 250 MW of behind-the-meter generation.', 'eia-ks')],
    ['eia-ks'], [HUB, 'north-dakota-mining-power-off-grid-and-managed-containers']))

S.append(site('finland-20-mw-data-center-site-heat-offtake-for-sale',
    'Finland data center for sale: 20 MW-ready site with signed district heat offtake',
    'A freehold Finnish data center site with 10 MW guaranteed, upgradeable to 20 MW, data center permits and a signed district heating offtake. Details on a call.',
    'Finland',
    [['Power', '10 MW now, upgradeable to 20 MW'], ['Heat', 'Signed district heating offtake'], ['Property', 'Freehold hall plus adjacent plot'], ['Use', 'AI, HPC, mining with heat reuse'], ['Permits', 'Data center permits and fiber in place']],
    'We have a freehold data center site in Finland with 10 MW guaranteed and a short, low-cost upgrade path to 20 MW. Data center permits and multi-carrier fiber are in place, heat pumps are installed, and a signed district heating contract buys the waste heat.',
    'Most data centers pay to get rid of heat. This one is paid for it.',
    'European compute buyers who want permits done and a second revenue line.',
    [faq('How much power does the Finland site have?', '10 MW guaranteed, upgradeable to 20 MW.', 'fingrid')],
    ['fingrid'], [HUB, 'kansas-250-mw-behind-the-meter-gas-power-site']))

S.append(site('new-york-60-mw-gas-peaker-plant-nyiso-zone-e-for-sale',
    'Upstate New York power plant for sale: 60 MW gas peaker in NYISO',
    'A revenue-generating 60 MW+ dual-fuel peaker plant in upstate New York with an existing interconnection and water. Details on a call.',
    'New York, United States',
    [['Power', '60 MW+ dual-fuel turbines'], ['Market', 'NYISO, upstate'], ['Status', 'Operating and profitable'], ['Use', 'Generation asset or co-located data center'], ['Water', 'River access']],
    'We have an operating 60 MW+ dual-fuel peaker plant in upstate New York for sale. It is profitable today, interconnected to the grid and has river water access.',
    'An operating plant already holds what a new campus spends years chasing: an interconnection, a generation permit and water.',
    'Power investors, and data center developers who want a generation anchor in New York.',
    [faq('Is the New York plant operating?', 'Yes, it is operating and profitable.', 'nyiso')],
    ['nyiso', 'eia-ny'], [HUB, 'kansas-250-mw-behind-the-meter-gas-power-site']))

# New in batch 2
S.append(site('bolivia-300-mw-greenfield-mining-site',
    'Bolivia bitcoin mining site: 300 MW greenfield in a serviced industrial park',
    'A government-supported 300 MW greenfield inside a serviced Bolivian industrial park on a gas and hydro grid, expandable to 1 GW, phased from 2026. Details on a call.',
    'Bolivia',
    [['Power', '300 MW, expandable to 1 GW+'], ['Grid', 'Gas and hydro mix'], ['Timing', 'Phase 1 in 2026, 300 MW by 2027'], ['Use', 'Bitcoin mining, large compute'], ['Structure', 'Joint venture available']],
    'We have a 300 MW greenfield inside a serviced, protected industrial park in Bolivia with national government support. It runs on a gas and hydro grid, phases from a first 25 to 50 MW block in 2026 up to 300 MW by 2027, and can expand past 1 GW.',
    'Very low-cost power, a lot of it, and a government that wants the load, inside an industrial park that already has security and services.',
    'Large miners and compute buyers open to a JV in an emerging market.',
    [faq('How much power is available in Bolivia?', '300 MW, phased from 2026, expandable past 1 GW.')],
    [], [HUB, 'wisconsin-150-mw-data-center-mining-site-for-sale']))

S.append(site('caucasus-hydro-power-mining-site-for-sale',
    'Hydro power site for sale in the Caucasus: 20 MW now, 60 MW potential',
    'A hydro-powered site next to a hydroelectric plant in the Caucasus with 20 MW now, room to 60 MW, a direct PPA and operating licenses in place. Details on a call.',
    'Caucasus, Eurasia',
    [['Power', '20 MW now, up to 60 MW'], ['Supply', 'Direct PPA with an adjacent hydro plant'], ['Grid', 'High-voltage substation access'], ['Use', 'Bitcoin mining, compute'], ['Included', 'Transformers, licenses, warehouse']],
    'We have a hydro-powered site in the Caucasus next to a hydroelectric plant, with 20 MW available now and room to grow to 60 MW. Power comes under a direct PPA with the plant at a fixed multi-year rate, with no curtailment obligations, and operating licenses are already issued.',
    'A fixed, low renewable rate with the lease folded in and licenses already granted. Most European sites pay roughly double.',
    'Miners and compute buyers who want cheap fixed-price renewable power.',
    [faq('How much power is at the Caucasus site?', '20 MW now, expandable to 60 MW.')],
    [], [HUB, 'kansas-250-mw-behind-the-meter-gas-power-site']))

S.append(site('north-dakota-mining-power-off-grid-and-managed-containers',
    'North Dakota mining power: off-grid gas MW and managed containers on MISO',
    'North Dakota options for miners: double-digit MW of off-grid gas power deployable now, and fully managed containers on MISO at a fixed rate. Details on a call.',
    'North Dakota, United States',
    [['Off-grid', '15 MW of gas-fired power, deployable now'], ['Managed', '1 MW containers on MISO, fixed long-term rate'], ['Development', '180 owned acres with grid power and a path to 50 MW, investor or JV'], ['Timing', 'Now'], ['Use', 'Bitcoin mining'], ['Model', 'Own the hardware, operator runs the site']],
    'We have three North Dakota options: 15 MW of off-grid, gas-fired power ready to deploy now, fully managed 1 MW containers on the MISO grid where you own the hardware and hold a long-term fixed-rate operating right, and a 180-acre owned development site with grid power and a path to 50 MW, open to investors or a JV partner.',
    'Off-grid generation turns stranded gas into power and skips the interconnection queue entirely.',
    'Miners who want fast deployment without a grid queue.',
    [faq('Is there off-grid power for mining in North Dakota?', 'Yes, 15 MW of off-grid gas power is deployable now.', 'eia-nd')],
    ['eia-nd', 'miso'], [HUB, 'kansas-250-mw-behind-the-meter-gas-power-site'],
    units=[
        ['Off-grid gas', '15 MW', 'Deployable now', 'September 2026'],
        ['Managed container', '1 MW on MISO', 'You own container and ASICs, operator runs site', 'December 2025'],
        ['Development site', '20 MW now, path to 50 MW', '180 owned acres, investor or JV', 'September 2024'],
    ]))

S.append(site('norway-hydro-mining-sites-for-sale',
    'Norway hydro mining sites: a 1 MW build-to-suit and a titled site with room to grow',
    'Two northern Norway hydro options: a liquid-cooled 1 MW build-to-suit with contracted heat reuse, and a titled site with a warehouse and room to expand. Details on a call.',
    'Norway',
    [['Build-to-suit', 'About 1 MW liquid-cooled, power in place'], ['Titled site', 'Small today, expandable toward 20 MW'], ['Supply', '100% hydro and wind'], ['Use', 'Bitcoin mining with heat reuse'], ['Model', 'Cost-plus operation, client owns the hardware']],
    'We have two hydro options in northern Norway: a 1 MW liquid-cooled build-to-suit where power is already in place and all waste heat has a contracted taker, and a small titled site with a large warehouse that can expand toward 20 MW.',
    'No grid application, no connection fee and renewable supply with no utility curtailment rights.',
    'Miners who want low-cost European hydro at small scale.',
    [faq('Can I mine with hydro power in Norway?', 'Yes. Both options run on hydro and wind supply in northern Norway.', 'statnett')],
    ['statnett'], [HUB, 'iowa-2-mw-ai-edge-site-at-a-power-plant'],
    units=[
        ['NO4 build-to-suit', 'About 1 MW liquid-cooled', 'Power in place, heat reuse contracted', 'October 2026'],
        ['Titled site (northern Norway)', '0.2 MW, expandable toward 20 MW', 'Real estate title, large warehouse', 'August 2025'],
    ]))

S.append(site('bitcoin-mining-hosting-capacity-us',
    'Bitcoin mining hosting available now: 11 sites across the US',
    'Open bitcoin mining hosting capacity in Texas, Oklahoma, Pennsylvania, the Rocky Mountains, Idaho, Iowa, Washington and South Carolina, from small fleets to 40 MW blocks. Rates on a call.',
    'United States',
    [['Sites', 'Eleven hosting sites with open capacity'], ['Capacity', 'From a few hundred slots to 40 MW blocks'], ['Regions', 'TX, OK, PA, Rocky Mountains, ID, IA, WA and SC'], ['Minimums', 'From no minimum to 10 MW'], ['Cooling', 'Air-cooled, hydro and immersion']],
    'We have eleven hosting sites with open capacity across the US, from a few hundred slots in Washington State to 30 MW in Pennsylvania and 40 MW blocks in Texas and South Carolina. Air-cooled, hydro and immersion options are available, with minimums ranging from no minimum to 10 MW.',
    'All-in rates are not comparable until you see curtailment history and the uptime definition. We put them side by side for your fleet on the call.',
    'Miners placing anything from 50 units to tens of MW.',
    [faq('Where can I host bitcoin miners right now?', 'Texas, Oklahoma, Pennsylvania, the Rocky Mountains, Idaho, Iowa, Washington and South Carolina all have open capacity.', 'ercot')],
    ['ercot', 'eia-sc'], [HUB, 'houston-texas-3-mw-ercot-mining-site-for-sale'],
    units=[
        ['South Carolina co-location', '40 MW', '10 MW minimum', 'July 2026'],
        ['Texas hydro-cooled', '40 MW', '1 MW minimum', 'June 2026'],
        ['Pennsylvania', '30 MW', '5 MW minimum, direct to substation', 'September 2025'],
        ['Rocky Mountain region', '30 MW', 'Turnkey, 1 year minimum term', '2025'],
        ['Texas hydro', '20 MW', '2.4 MW container', 'November 2026'],
        ['Texas immersion', '20 MW', '1 MW minimum, profit share at 5 MW+', 'January 2025'],
        ['Texas (ERCOT)', '17 MW', '50 units minimum', 'January 2026'],
        ['Oklahoma', '16.5 MW', '5 MW minimum', 'April 2026'],
        ['Idaho', '8 MW', '50 units minimum', 'November 2026'],
        ['Iowa co-op site', '6 MW, 600 slots', '50 units minimum', 'October 2026'],
        ['Washington State', '3.5 MW', 'No minimum', 'October 2026'],
    ],
    held=['Site-by-site all-in rates', 'Curtailment history and uptime terms', 'Minimums, deposits and contract terms', 'Exact locations', 'Operator references']))


NEW = []

NEW.append(site('texas-17-mw-greenfield-mining-site-houston-load-zone',
    'Texas greenfield mining site: 17 MW in the Houston load zone, energize in months',
    'A 17 MW greenfield site in the ERCOT Houston load zone with a signed power agreement, a substation tap on the property and pre-development permits, energizing in 4 to 6 months. Details on a call.',
    'Texas, United States',
    [['Power', '17 MW grid, signed power agreement'], ['Land', 'About 2 acres, light industrial, no noise ordinance'], ['Timing', 'Energize in 4 to 6 months'], ['Use', 'Bitcoin mining, flexible load'], ['Permits', 'Pre-development permits in place']],
    'We have a 17 MW greenfield site in the ERCOT Houston load zone with an executed power agreement, a power tap directly at the substation on the property and pre-development permits already done. It can energize in 4 to 6 months, and an optional full EPC build-out is available.',
    'In ERCOT, the signed agreement and the substation tap are the slow parts. Both are done here, so the remaining work is construction, which a buyer can schedule.',
    'Miners and flexible-load operators who want ERCOT exposure on a short build.',
    [faq('When can the Texas 17 MW site energize?', 'In 4 to 6 months, with the power agreement signed and pre-development permits in place.', 'ercot')],
    ['ercot', 'eia-tx'], [HUB, 'houston-texas-3-mw-ercot-mining-site-for-sale']))

NEW.append(site('oregon-10-mw-hydro-mining-site-expandable-100-mw',
    'Oregon mining site: 10 MW on green hydro, expandable past 100 MW',
    'A turnkey 10 MW Oregon site on 100% hydro power with very low curtailment, an onsite substation lease and a path to 100 MW+, with adjacent land available. Details on a call.',
    'Oregon, United States',
    [['Power', '10 MW now, expandable to 100 MW+'], ['Supply', '100% hydro, tariff-based'], ['Uptime', 'About 12 hours of curtailment a year'], ['Use', 'Bitcoin mining, green compute'], ['Land', 'Leased pad, large adjacent acreage for sale']],
    'We have a turnkey 10 MW site in Oregon on 100% hydro power with only about 12 hours of curtailment a year. It leases directly from an onsite substation, can add capacity every year toward 100 MW and more, and has a large tract of adjacent land available to buy.',
    'Green power with almost no curtailment is rare at any price. The expansion path is defined in MW per year with a known substation contribution, so growth is a budgeting exercise rather than a study.',
    'Miners and compute buyers who need clean power and a long runway.',
    [faq('How far can the Oregon site expand?', 'From 10 MW to 100 MW or more, adding capacity each year.')],
    [], [HUB, 'nevada-375-mw-powered-land-230-kv-data-center-site']))

NEW.append(site('iowa-20-to-500-mw-mining-site-long-term-ppa',
    'Iowa large-scale power site: 20 MW to 500 MW+ with a long-term PPA',
    'An Iowa site scalable from 20 MW to 500 MW+ with long-term PPAs, no zoning requirement, gas and ammonia pipelines on site and highway, port and airport access. Details on a call.',
    'Iowa, United States',
    [['Power', '20 MW to 500 MW+'], ['Contract', 'Long-term PPA, 5 to 25 years'], ['Zoning', 'Non-zoned area'], ['Use', 'Large mining or AI'], ['Extras', 'Gas and ammonia pipelines, fiber, highway, port, airport']],
    'We have an Iowa site that scales from 20 MW to more than 500 MW under long-term PPAs of 5 to 25 years. It sits in a non-zoned area, has natural gas and ammonia pipelines on site, high-speed fiber and highway, port and airport access.',
    'Power pricing falls as the load grows, and a non-zoned area removes the local approval step that slows most large Midwest builds.',
    'Buyers planning a phased campus from tens to hundreds of MW.',
    [faq('How large can the Iowa PPA site get?', 'From 20 MW up to more than 500 MW, under PPAs of 5 to 25 years.', 'miso')],
    ['miso', 'eia-ia'], [HUB, 'iowa-2-mw-ai-edge-site-at-a-power-plant']))

NEW.append(site('iowa-2-mw-turnkey-mining-site-scalable-7-mw',
    'Iowa turnkey mining site: 2 MW live on owned land, scalable to 7 MW',
    'A grid-tied 2 MW Iowa mining site on owned, specially zoned land with a warehouse, new switchgear, 100G fiber and a path to 7 MW. Details on a call.',
    'Iowa, United States',
    [['Power', '2 MW live, scalable to 7 MW'], ['Land', 'About 1 owned acre, special zoning'], ['Building', 'Warehouse with switchgear and racks'], ['Use', 'Bitcoin mining, small compute'], ['Uptime', 'Near 99.9% history']],
    'We have a turnkey 2 MW mining site in Iowa on owned, specially zoned land with a warehouse, new switchgear, racks and wiring for hundreds of ASICs, 100G fiber and a path to 7 MW.',
    'Owned real estate under a working site, with power getting cheaper as it expands.',
    'Miners who want a small owned site with room to more than triple.',
    [faq('Can the Iowa turnkey site expand?', 'Yes, from 2 MW to 7 MW.')],
    ['miso', 'eia-ia'], [HUB, 'iowa-20-to-500-mw-mining-site-long-term-ppa']))

NEW.append(site('pennsylvania-5-mw-turnkey-mining-site-for-sale',
    'Pennsylvania mining site for sale: 5 MW turnkey in a deregulated market',
    'A turnkey 5 MW Pennsylvania bitcoin mining site in PJM with transformers, containers, variable power pricing with curtailment upside and land available. Details on a call.',
    'Pennsylvania, United States',
    [['Power', '5 MW, transformers installed'], ['Market', 'Deregulated, PJM'], ['Timing', 'Turnkey'], ['Use', 'Bitcoin mining'], ['Land', 'Small parcel available to buy']],
    'We have a turnkey 5 MW mining site in Pennsylvania in the deregulated PJM market, with transformers and underground conduit installed, mining containers on site and a small parcel of land available to buy. Full diligence documents are ready.',
    'A deregulated market lets a smart curtailment strategy push the average rate well below the headline price.',
    'Miners who want a PJM site with diligence already packaged.',
    [faq('Is the Pennsylvania site in PJM?', 'Yes, it is in the deregulated PJM market.', 'pjm')],
    ['pjm'], [HUB, 'pennsylvania-500-mw-gas-and-grid-data-center-site']))

NEW.append(site('pennsylvania-500-mw-gas-and-grid-data-center-site',
    'Pennsylvania data center site: 200 MW behind-the-meter gas plus 300 MW grid',
    'A Pennsylvania data center site combining 200 MW of behind-the-meter natural gas and 300 MW of grid access on 120 ready acres, with 400 more acres adjacent. Details on a call.',
    'Pennsylvania, United States',
    [['Power', '200 MW behind-the-meter gas plus 300 MW grid'], ['Land', '120 ready acres, 400 more adjacent'], ['Timing', 'Gas first, grid in a later phase'], ['Use', 'AI training, hyperscale'], ['Extras', 'Large municipal water, multiple fiber backbones']],
    'We have a Pennsylvania data center site that pairs 200 MW of behind-the-meter natural gas generation with 300 MW of grid access, on 120 ready-to-build acres with 400 more acres next door. Municipal water and multiple backbone fiber providers are on site.',
    'Gas first, grid second is how the fastest AI campuses are being built. This site has both paths on the same land, in the middle of the Marcellus gas region.',
    'AI and hyperscale buyers who want power now and grid redundancy later.',
    [faq('How much power can the Pennsylvania site supply?', 'Up to 500 MW: 200 MW of behind-the-meter gas and 300 MW of grid.', 'pjm')],
    ['pjm'], [HUB, 'ohio-300-mw-powered-land-345-kv-data-center-site']))

NEW.append(site('midwest-85-mw-brownfield-mining-site',
    'Midwest power site: 85 MW on a brownfield with a PPA and land lease in hand',
    'An 85 MW Midwest brownfield mining site with a PPA and long-term land lease in hand and distribution-voltage delivery. Built for air-cooled loads. Details on a call.',
    'Midwest, United States',
    [['Power', '85 MW'], ['Land', 'About 20 acres of brownfield, long-term lease'], ['Contract', 'PPA and land lease in hand'], ['Use', 'Air-cooled bitcoin mining'], ['Cooling', 'Air-cooled only (no water at site)']],
    'We have an 85 MW brownfield site in the Midwest with a PPA and a cheap long-term land lease already in hand. Power is delivered at distribution voltage, and the site suits air-cooled builds.',
    'Eighty-five MW with paper already signed is a lot of capacity for a small land footprint.',
    'Miners deploying air-cooled fleets at scale.',
    [faq('How much power is at the Midwest brownfield?', '85 MW, with a PPA and land lease in hand.')],
    [], [HUB, 'wisconsin-150-mw-data-center-mining-site-for-sale']))

NEW.append(site('turnkey-tier-iii-data-centers-for-sale-and-lease',
    'Turnkey Tier III data centers for sale or lease: 4 MW to 10 MW, move-in ready',
    'Three turnkey Tier III and Tier III/IV data centers in the US: a 10 MW facility with liquid cooling underway, 3.5 to 4 MW of move-in floor space and a new Silicon Valley build. Details on a call.',
    'United States',
    [['Facilities', 'Three Tier III or Tier III/IV data centers'], ['Power', '3.5 MW to 10 MW critical IT'], ['Status', 'Built and operating, or ready for a tenant'], ['Use', 'Enterprise, AI inference, colocation'], ['Deal', 'Purchase or long-term lease']],
    'We have three move-in ready data centers: a Tier III facility with 4 MW built and a second phase to 10 MW with direct liquid cooling conversion underway, 3.5 to 4 MW of Tier III/IV floor space with generators and UPS in place, and a brand new Tier III building in Silicon Valley available to buy or lease.',
    'Building a Tier III hall takes two years. These are already built, carrier-connected and redundant, so a tenant can be live in months.',
    'Enterprises and AI inference operators who need certified capacity now.',
    [faq('Do you have Tier III data centers for sale?', 'Yes, three, from 3.5 MW to 10 MW of critical IT load, for purchase or lease.')],
    [], [HUB, 'texas-44-mw-data-center-property-250-mw-expansion']))

NEW.append(site('pennsylvania-350-mw-contracted-power-ai-campus-for-lease',
    'Pennsylvania AI campus for lease: 350 MW under a signed utility service agreement',
    'A Pennsylvania former power plant campus with 350 MW under a signed utility service agreement, 50 MW by end 2026 and 300 MW by end 2027, industrial zoning and room past 500 MW. Offered on a long-term lease. Details on a call.',
    'Pennsylvania, United States',
    [['Power', '350 MW under a signed utility electric service agreement, PJM'], ['Timing', 'First 50 MW by end 2026, 300 MW by end 2027'], ['Land', 'Industrial-zoned former power plant campus, flat, outside the floodplain'], ['On site', 'About 60 MW of energized legacy generation and an existing grid connection'], ['Deal', 'Long-term lease to a creditworthy tenant'], ['Path to scale', 'Expansion toward 500 MW+ under discussion with the utility']],
    'We have a Pennsylvania AI campus with 350 MW under a signed utility service agreement. The first 50 MW is scheduled for the end of 2026 and the bulk of the load for the end of 2027. The site is a former power plant on industrial-zoned land, already grid-connected, and the owner wants a long-term lease with an investment-grade tenant.',
    'Most powered land offered in 2026 has a load study or a queue position. This site has an executed service agreement with the utility for the full 350 MW and a dated delivery schedule, on a brownfield that has carried large power for decades. For a 100 MW to 350 MW AI deployment in PJM energizing in 2027, few sites are further along.',
    'AI labs, neoclouds and modular AI infrastructure providers that need 100 MW to 350 MW in PJM in 2027 and want to lease rather than buy. Not suited to buyers who need all 350 MW energized before 2027.',
    [faq('How much power is available at the Pennsylvania campus?', '350 MW under a signed electric service agreement: about 50 MW by the end of 2026 and 300 MW by the end of 2027, with expansion toward 500 MW being discussed.', 'pjm'),
     faq('Can the site be bought?', 'The owner is offering it on a long-term lease. We confirm structure and terms on the call.')],
    ['pjm'], [HUB, 'pennsylvania-500-mw-gas-and-grid-data-center-site', 'utility-will-serve-letter-load-study-esa']))
NEW[-1]['date'] = '2026-11-09'

S += NEW

S.append(site('earlier-powered-site-and-hosting-listings',
    'Earlier US mining site and hosting listings (2023 to 2025): ask us for current status',
    'Smaller US bitcoin mining sites, hosting offers and build partnerships listed from 2023 to 2025. Some may have traded. We confirm status on a call.',
    'United States',
    [['Listings', '20 earlier site, hosting and partnership offers'], ['Size', '0.25 MW to 30 MW'], ['Regions', 'Twelve US states'], ['Status', 'Listed 2023 to 2025, confirmed on a call'], ['Types', 'Sites for sale, hosting, JV and build partners']],
    'These are the smaller and older listings we have seen from 2023 to 2025: turnkey mining farms, hosting offers, small-site PPAs and build partnerships, from 0.25 MW to 30 MW. Some have probably traded. Others are still open or have a similar site behind them. We confirm current status on a call before sharing details.',
    'Owners of small sites relist often, and a site that sold once can come back. If one of these matches what you need, a call is the fastest way to find out whether it, or something like it, is open now.',
    'Miners and small compute buyers looking for 0.25 MW to 30 MW, and investors open to a build partnership.',
    [faq('Are these older listings still available?', 'Some may have traded. We check current status with the owner before we share details or make an introduction.')],
    ['eia-tx', 'pjm', 'miso'], [HUB, 'kentucky-turnkey-bitcoin-mining-sites-for-sale'],
    units=[
        ['West Texas', '5 MW flare-gas site', 'Operating partner in place', 'March 2023'],
        ['Washington State', 'Hydro hosting, about 4 MW', 'No minimum, no curtailment', 'March 2023'],
        ['Kentucky', 'Container hosting, 1.5 MW site', 'Hosting slots', 'September 2023'],
        ['Georgia', '1 MW mining farm', 'Warehouse, lease to 2028', 'November 2023'],
        ['Idaho', '1 MW mining farm', 'Land and building included', 'December 2023'],
        ['United States', '10 MW hosting', 'Transformers and agreements in place', 'January 2024'],
        ['Missouri', '6 MW build', 'Investor partner sought, lease and power contract signed', 'March 2024'],
        ['Pennsylvania (Pittsburgh area)', '4 MW hosting', 'Operating site', 'April 2024'],
        ['Pennsylvania', '5 MW hosting site', 'Managed, containers in place', 'May to October 2024'],
        ['Pennsylvania', '1 MW+ revenue-share hosting', 'Containers on site', 'June 2024'],
        ['Missouri', '5 MW hosting', 'Repair center on site', 'August 2024'],
        ['Tennessee', 'Revenue-share hosting', 'Containerized', 'September 2024'],
        ['Pennsylvania', '5 MW site for sale (4 MW installed)', 'Managed grid, containers', 'October 2024'],
        ['Oregon', '10 MW turnkey site', 'Containers running', 'November 2024'],
        ['North Carolina', '5 MW, scaling to 30 MW', 'Immersion tanks and transformer', 'January 2025'],
        ['Oregon', '10 MW hydro greenfield', 'Land ownership included', 'January 2025'],
        ['Illinois and Missouri', 'Eight sites, 0.25 to 0.5 MW each', 'Transformers in place, PPA based', 'March 2025'],
        ['Kentucky', '1.5 MW operating site', 'Seeking hosting clients or buyer', 'April 2025'],
        ['Oklahoma', '1 to 3 MW turnkey JV', 'Fully managed, investor owns equipment', 'May 2025'],
        ['Texas (Dallas area, ERCOT)', '1.5 MW immersion, expandable to 4 MW+', 'Turnkey, warehouse lease', 'July 2025'],
    ],
    held=['Current status from the owner', 'Exact location and utility', 'Power price and terms', 'Asking price', 'Comparable sites that are open now']))

ROWS = [
    ['Arizona', '1.5 GW Phase 1', '15,000+ acres', 'Grid 2027'],
    ['Pennsylvania', '350 MW, signed utility service agreement', 'Former plant campus, lease', '50 MW end 2026, 300 MW end 2027'],
    ['Pennsylvania', '200 MW BTM gas + 300 MW grid', '120 ready acres', 'Phased'],
    ['Iowa', '20 MW to 500 MW+ PPA site', 'Non-zoned', 'Phased'],
    ['Nevada', '375 MW', '~350 acres', '2027 to 2028'],
    ['Ohio', '300 MW approved', '300+ acres', '1H 2027'],
    ['Kansas', 'Path to 250 MW BTM gas', 'Mineral acreage', 'Now'],
    ['Indiana', '200 MW, load study done', '~80 acres', 'Substation planned'],
    ['Wisconsin', '150 MW built, 80 MW now', '130 ready acres', 'Now'],
    ['New York', '60 MW+ power plant', 'Plant site', 'Operating'],
    ['Midwest', '85 MW brownfield', '~20 acres', 'Now'],
    ['Oklahoma City', '55 MW contracted', '~80 acres', 'Now'],
    ['Texas (Houston load zone)', '17 MW greenfield', '~2 acres', '4 to 6 months'],
    ['Oregon', '10 MW hydro, to 100 MW+', 'Lease + land option', 'Now'],
    ['US (3 facilities)', 'Tier III data centers, 3.5 to 10 MW', 'Built', 'Now'],
    ['Texas metro', '44 MW, +250 MW', '~50 acres, 1M sq ft', 'Now'],
    ['Kentucky', '30 MW greenfield', '~16 acres, rezoned', 'Now'],
    ['North Carolina', '18 MW live, path past 100 MW', '~200 acres', 'Now'],
    ['North Dakota', '15 MW off-grid, managed containers, 180-acre JV site', 'Various', 'Now'],
    ['Kentucky', 'Seven turnkey sites, 0.5 to 8 MW', 'Mostly owned', 'Now'],
    ['Pennsylvania', '5 MW turnkey', 'Land available', 'Now'],
    ['Oklahoma', 'Two 5 MW turnkey sites', 'Owned acres', 'Now'],
    ['Iowa', '2 MW turnkey, to 7 MW', 'Owned acre', 'Now'],
    ['Houston', '3 MW ERCOT', 'Leased', 'Now'],
    ['Iowa', '2 MW+ edge site', 'Leased', 'Now'],
    ['US', '11 hosting sites', 'Hosted', 'Now'],
    ['US', '20 earlier listings, 0.25 to 30 MW', 'Various', 'Status on a call'],
]

hub = {
    'slug': HUB, 'topic': 'Data Centers', 'kind': 'site-listing', 'region': 'United States',
    'title': 'Powered land for sale: data center, AI and bitcoin mining sites available now (November 2026)',
    'description': '36 US powered sites and 11 hosting options available through Invariant in November 2026, from a 1.5 GW Arizona AI campus to energized mining sites and hosting. Details on a call.',
    'date': DATE, 'readMinutes': 4,
    'intro': 'Invariant has 36 US powered sites and 11 hosting options available as of November 2026, from a 1.5 GW AI campus in Arizona to energized 2 MW mining sites and open hosting capacity. Sixteen are in the 17 MW to 1.5 GW range that AI, HPC and hyperscale buyers ask for, and most can take load today. Below is what we can share publicly. Locations, utility documents and prices are shared on a call.',
    'takeaways': [
        'Large campuses: Arizona 1.5 GW, Pennsylvania 500 MW and 350 MW (signed utility agreement), Iowa 500 MW, Nevada 375 MW, Ohio 300 MW, Indianapolis 200 MW, Wisconsin 150 MW.',
        'Energized now: North Carolina 18 MW, Kentucky 30 MW, Texas 44 MW, Oklahoma City 55 MW.',
        'Small and fast: turnkey mining and edge sites in Kentucky, Oklahoma, Texas and Iowa.',
        'Tell us your MW, region and energize-by date. We share matching sites, including ones not listed here.',
    ],
    'sections': [
        sec('available-sites', 'Sites available right now', table(['Region', 'Power', 'Land', 'Timing'], ROWS)),
        sec('how-we-work', 'How Invariant works with buyers',
            p('We start from power evidence, not land. Before we introduce a buyer, we check the utility paperwork (studies, service agreements, will-serve letters), the zoning and the title, and we tell you which items we could not confirm.'),
            p('We keep locations and prices off this page on purpose. Owners ask for discretion, and a site that is shopped everywhere loses value. Book a call and we will walk you through the sites that fit your load, timeline and budget.')),
        # Cross-links to the size and state pages (see site_finder.py).
        sec('find-by-size-or-state', 'Find a data center site by size or state',
            p('Looking for a specific size or state? Each page below shows what that requirement needs from the utility, the land it takes and the sites from our inventory that fit.'),
            *__import__('json').load(open(__import__('os').path.join(__import__('os').path.dirname(__file__), 'browse_links.json')))),
    ],
    'faqs': [
        faq('Where can I find powered land for a data center in the US?', 'Invariant has powered sites in Arizona (1.5 GW), Pennsylvania (350 MW contracted), Nevada (375 MW), Ohio (300 MW), Indiana (200 MW), Wisconsin (150 MW), North Carolina (18 MW live) and more. Book a call or text (628) 220-8972 for details.'),
        faq('Which sites have power available today?', 'North Carolina, Kentucky (30 MW), a Texas metro property (44 MW), Oklahoma City (55 MW), Wisconsin (80 MW) and several turnkey mining sites.'),
        faq('Do you have off-market sites?', 'Yes. The sites on this page are a subset of what we work on. Tell us your requirements on a call.'),
        faq('How do you verify a powered site?', 'Utility documents first, then zoning and title, before any introduction. We flag anything we could not confirm.'),
    ],
    'sources': sources('pjm', 'ercot', 'miso'),
    'relatedSlugs': ['arizona-1-5-gw-powered-land-ai-campus', 'north-carolina-18-mw-ai-campus-207-acres-for-sale', 'power-evidence-data-center-site-verification', 'utility-will-serve-letter-load-study-esa', 'texas-data-center-large-load-interconnection-2026', 'retired-power-plant-sites-for-data-centers'],
}

S = [x for x in S if x['slug'] not in ['finland-20-mw-data-center-site-heat-offtake-for-sale', 'norway-hydro-mining-sites-for-sale', 'bolivia-300-mw-greenfield-mining-site', 'caucasus-hydro-power-mining-site-for-sale']]
out = [hub] + S
json.dump(out, open(sys.argv[1], 'w'), indent=1, ensure_ascii=False)
print(len(out))
