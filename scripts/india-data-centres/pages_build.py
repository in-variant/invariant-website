"""Build and approvals pages of the India cluster: site selection, approvals, set-up sequence,
cost per MW, site due diligence, land, seismic and flood risk, water.

Intent split (no duplicate keyword targeting):
  find-data-centre-site-india          site selection / best location
  data-centre-approvals-india          approvals, permissions, licence (master approvals table)
  how-to-set-up-data-centre-india      sequence from entity to energisation (HowTo schema)
  data-centre-cost-per-mw-india        capex per MW, rents, financing
  data-centre-site-due-diligence-india due diligence / feasibility checklist
  data-centre-land-india               land, powered land, acres per MW, parks
  data-centre-seismic-flood-risk-india IS 1893 zones, floods, cyclones, CRZ
  data-centre-water-india              CGWA NOC, water stress, water use
"""
from common import *

CW26 = 'https://content.cushmanwakefield.com/api/public/content/6b60db63971344f3a3f5392374471667?v=90a58a0b'

# One master list; each page carries only the sources it cites (see page()).
M = {s['id']: s for s in [
    # Market
    src('cw26', 'India Data Centre Market Overview H1 2026', CW26, 'Cushman & Wakefield'),
    src('cw25', 'India Data Centre Market Overview H1 2025 (rent tables)', 'https://assets.cushmanwakefield.com/-/media/cw/apac/india/insights/indiadatacentreupdateh12025v4.pdf?rev=4a5dd53b2388421ea3935afb03302def', 'Cushman & Wakefield'),
    src('ii-cw', "India's Data Centre Growth Story (October 2026)", 'https://static.investindia.gov.in/s3fs-public/2026-10/latest-news-India-Data-Centre-Growth-Story.pdf', 'Invest India and Cushman & Wakefield'),
    src('anarock', 'Data Centre: The Blueprint of the Digital Fortress in India (2026)', 'https://websitemedia.anarock.com/media/Data_centre_The_blueprint_of_the_digital_fortress_in_India_2026_b36407b0b2.pdf', 'Anarock'),
    src('sbi', 'Data Centres in India, sector report (April 2026)', 'https://sbi.bank.in/documents/57189647/58231607/Sector+Report+DataCentre.pdf/f1919592-ee66-b50b-ea20-75fbb27c9bb5?t=1779885206866', 'SBI CHAKRA'),
    src('crisil', "India's data centre capacity set for 5x surge by 2030 (Crisil Ratings)", 'https://www.equitybulls.com/news/378461/crisil-ratings-india-s-data-centre-capacity-set-for-5x-surge-by-2030', 'EquityBulls'),
    src('icra', 'Third-party data centre capacity to double by FY2028', 'https://www.icra.in/CommonService/OpenMediaS3?Key=540ab708-7459-44fd-9680-82d127a4906a', 'ICRA'),
    src('savills', "India's data centre capacity additions jump 59% in H1 2026 (Savills)", 'https://www.communicationstoday.co.in/indias-data-centre-capacity-additions-jump-59-in-h1-2026/', 'Communications Today'),
    src('structure', 'Mumbai and Pune data centre report 2026', 'https://www.structureresearch.net/product/mumbai-pune-dcai-report-2026-data-centre-colocation-hyperscale-cloud-ai-interconnection/', 'Structure Research'),
    src('telenet', "India's subsea cable expansion outpaces its supporting infrastructure", 'https://tele.net.in/telefocus/growing-gap-indias-subsea-cable-expansion-outpaces-its-supporting-infrastructure-12490632', 'Tele.net'),
    src('aic', 'Google unveils America-India Connect initiative', 'https://www.submarinenetworks.com/en/nv/insights/google-unveils-america-india-connect-initiative', 'Submarine Networks'),
    src('stt-land', 'STT GDC India buys Navi Mumbai land for ₹282 crore', 'https://www.communicationstoday.co.in/stt-gdc-india-buys-navi-mumbai-land-for-%E2%82%B9282-crore-data-centre-project/', 'Communications Today'),
    src('ads-lodha', 'Amazon Data Services India acquires land from Lodha Developers', 'https://www.zeebiz.com/hindi/real-estate/amazon-data-services-india-has-acquired-approximately-42955-sq-meters-of-non-agricultural-land-from-lodha-developers-256535', 'Zee Business'),
    src('aws-lodha', 'AWS acquires 38 acres near Mumbai for potential data center build', 'https://datacenterdynamics.com/en/news/aws-acquires-38-acres-near-mumbai-india-for-potential-data-center-build', 'DatacenterDynamics'),
    src('lumina', 'Blackstone plans 216 MW data centre hub in Chennai', 'https://india.entrepreneur.com/news-and-trends/blackstone-plans-216-mw-data-centre-hub-in-chennai/502233', 'Entrepreneur India'),
    src('brookfield', "Canada's Brookfield to buy 30-acre land in Navi Mumbai for ₹600 crore", 'https://www.business-standard.com/article/companies/canada-s-brookfield-to-buy-30-acre-land-in-navi-mumbai-for-rs-600-crore-121081101870_1.html', 'Business Standard'),
    src('lodha', 'Lodha to develop 1 GW data centre capacity in MMR', 'https://www.business-standard.com/industry/news/lodha-to-develop-1-gw-data-centre-capacity-in-mmr-invest-11-000-cr-126042700807_1.html', 'Business Standard'),
    src('de-water', 'Digital Edge India: 83 MW solar PPA and recycled water at its Navi Mumbai campus', 'https://www.digitaledgedc.com/resources/newsroom/digital-edge-india-83mw-solar-ppa-recycled-water-data-center/', 'Digital Edge'),
    src('newslaundry', "In Bengaluru's water-stressed areas sit most of its data centres", 'https://www.newslaundry.com/2026/04/16/in-bengalurus-water-stressed-areas-sit-most-of-its-data-centres', 'Newslaundry'),
    src('dte', 'India is using water to build the machines that tell us we are running out of it', 'https://www.downtoearth.org.in/water/india-is-using-water-to-build-the-machines-that-tell-us-we-are-running-out-of-it', 'Down To Earth'),
    src('pib-cap', 'Installed data centre capacity and CEA demand estimate (Rajya Sabha reply, 7 August 2026)', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2298108', 'PIB, Ministry of Electronics and IT'),
    # Policy and finance
    src('hml', 'Harmonised Master List of Infrastructure Sub-sectors, notification of 11 October 2022', 'https://www.pppinindia.gov.in/report/Harmonised%20Master%20list%20of%20Infrastruture%20sub%20sectors%202022_1685079764.pdf', 'Ministry of Finance, Department of Economic Affairs'),
    src('khaitan', 'Data centres in India: a legal outlook for an emerging asset', 'https://www.khaitanco.com/sites/default/files/2024-08/Data%20Centres%20in%20India_%20A%20Legal%20Outlook%20for%20Emerging%20Asset%20-%20Lexology.pdf', 'Khaitan & Co'),
    src('niti', 'NITI Aayog and MeitY data centre evaluation framework', 'https://www.medianama.com/2026/10/223-niti-aayog-meity-data-centre-evaluation/', 'MediaNama'),
    src('theprint-niti', 'NITI Aayog asks states to verify power, water capacity before clearing data centre projects', 'https://theprint.in/tech/niti-aayog-asks-states-to-verify-power-water-capacity-before-clearing-data-centre-projects/3072365/', 'ThePrint'),
    src('up26', 'Uttar Pradesh Data Center Policy 2026 (G.O. dated 9 July 2026)', 'https://uplc.up.gov.in/downloadmedia/siteContent/202608230935077722DC-policy-2026-English_230826.pdf', 'Government of Uttar Pradesh'),
    src('wb21', 'West Bengal Data Centre Policy 2021 (notification of 6 September 2021)', 'https://wbxpress.com/west-bengal-data-centre-policy-2021/', 'Government of West Bengal (via wbxpress)'),
    src('tn21', 'Tamil Nadu Data Centre Policy 2021', 'https://www.nsws.gov.in/s3fs/2021-12/Data%20Centre%20Policy%202021.pdf', 'Government of Tamil Nadu (via National Single Window System)'),
    src('maha-it', 'Maharashtra IT/ITeS Policy 2023: data centre provisions', 'https://www.lexology.com/library/detail.aspx?g=7f5cfa24-e088-4a27-93b3-14f1730a93bc', 'Lexology'),
    src('ka26', "Karnataka's new data centre policy puts water and energy in focus", 'https://www.thenewsminute.com/karnataka/karnatakas-new-data-centre-policy-puts-water-energy-in-focus-what-does-it-say', 'The News Minute'),
    src('etv-google', 'Andhra Pradesh offers ₹22,000 crore incentives to Google’s Raiden Infotech for data centres', 'https://www.etvbharat.com/en/technology/andhra-pradesh-offers-rs-22000-crore-incentives-to-googles-raiden-infotech-for-data-centres-enn25101501804', 'ETV Bharat'),
    src('yeida', 'Industrial property and Data Centre Park, Sector 28', 'https://www.yamunaexpresswayauthority.com/property/industrial', 'Yamuna Expressway Industrial Development Authority'),
    src('certin', 'Directions under section 70B(6) of the IT Act (28 April 2022)', 'https://www.cert-in.org.in/PDF/CERT-In_Directions_70B_28.04.2022.pdf', 'CERT-In'),
    # Environment and permits
    src('eia', 'EIA Notification 2006', 'https://environmentclearance.nic.in/writereaddata/EIA_notifications/2006_09_14_EIA.pdf', 'Ministry of Environment and Forests'),
    src('rs-ec', 'Rajya Sabha reply of 6 August 2026 on environmental clearance for data centres, as quoted', 'https://countercurrents.org/2026/08/to-tell-the-parliament-that-ai-data-centres-do-not-require-environment-clearance-is-laughable/', 'Countercurrents'),
    src('nxtra-ec', 'Environmental clearance, Nxtra Mahape data centre (21 November 2025)', 'https://assets.airtel.in/nxtra/pdf/EC_Environmental_Clearance_Certificate_Nxtra%20Mahape_DC-02_25.11.25.pdf', 'SEIAA Maharashtra'),
    src('stt-ec', 'Environmental clearance, STT GDC Mumbai data centre', 'https://ik.imagekit.io/n16yxpm26c/sttgdc/global_en/public/2023-08/EC-Clearance-Report.pdf', 'SEIAA Maharashtra'),
    src('sc-eia', 'Supreme Court strikes down EIA exemption notification for educational buildings and industrial sheds', 'https://www.business-standard.com/india-news/sc-strikes-down-educational-buildings-eia-exemption-notification-125080501664_1.html', 'Business Standard'),
    src('cpcb', 'Classification of sectors into Red, Orange, Green, White and Blue categories (January 2025)', 'https://jspcb.org.in/wp-content/uploads/2025/11/CPCB-directions-Classification.pdf', 'Central Pollution Control Board'),
    src('parivesh', 'PARIVESH environmental clearance portal', 'https://parivesh.nic.in/', 'Ministry of Environment, Forest and Climate Change'),
    src('caqm', 'Direction citing genset emission norms under G.S.R. 804(E)', 'https://caqm.nic.in/WriteReadData/LINKS/29092023b6667cfe-be7c-4cb3-832f-c24c5bb20236.pdf', 'Commission for Air Quality Management'),
    src('dieselnet', 'India: emission standards for diesel generator sets', 'https://dieselnet.com/standards/in/genset.php', 'DieselNet'),
    src('peso-faq', 'Revised FAQs on the Petroleum Rules 2002', 'https://peso.gov.in/web/sites/default/files/2024-08/Revised%20FAQs%20on%20PR%202002%20PDF.pdf', 'Petroleum and Explosives Safety Organisation'),
    src('peso-list', 'List of petroleum products requiring a licence', 'https://peso.gov.in/web/sites/default/files/2024-12/List%20of%20Petroleum%20Requiring%20License.pdf', 'Petroleum and Explosives Safety Organisation'),
    src('nsws', 'National Single Window System', 'https://www.nsws.gov.in/', 'Government of India'),
    src('niveshmitra', 'Nivesh Mitra single window', 'https://niveshmitra.up.nic.in/', 'Government of Uttar Pradesh'),
    src('nbc', 'National Building Code 2016, Part 4: Fire and Life Safety', 'https://nmcnagpur.gov.in/assets/300/2025/03/mediafiles/NBC2016-Part-IV.pdf', 'Bureau of Indian Standards (copy hosted by Nagpur Municipal Corporation)'),
    src('cea-safety', 'CEA (Measures relating to Safety and Electric Supply) Regulations 2023 (gazette text, copy hosted by KSEB)', 'https://kseb.in/uploads/Downloadtemsuppy/Central%20Electricity%20Authority%20(Measures%20relating%20to%20Safety%20and%20Electric%20Supply)%20Regulations,%202023-1699594973944568556.pdf', 'Central Electricity Authority'),
    src('ap-go17', 'G.O.Ms.No.17 (Energy), implementation of the CEA safety regulations 2023 (11 March 2026)', 'https://www.simpliance.in/download/file/dXBsb2Fkcy9nb3Z0bm90aWZpY2F0aW9uL09yZGVyIG9uIEltcGxlbWVudGF0aW9uIG9mIENlbnRyYWwgRWxlY3RyaWNpdHkgQXV0aG9yaXR5IChNZWFzdXJlcyBSZWxhdGluZyB0byBTYWZldHkgYW5kIEVsZWN0cmljIFN1cHBseSkgUmVndWxhdGlvbnMsIDIwMjMucGRm', 'Government of Andhra Pradesh'),
    src('pib-explainer', 'Data centres in India (explainer, 14 September 2026)', 'https://www.pib.gov.in/PressNoteDetails.aspx?NoteId=159969&ModuleId=3&reg=3&lang=1', 'PIB'),
    src('bis-std', 'India’s BIS standards for data centres', 'https://www.india-briefing.com/news/india-bis-standards-data-centres-46991.html/', 'India Briefing'),
    src('bs-bis', 'BIS standards for data centres, cloud and AI to bring uniformity', 'https://www.business-standard.com/industry/news/bis-standards-for-data-centres-cloud-and-ai-to-bring-uniformity-govt-says-126030501040_1.html', 'Business Standard'),
    src('battery', 'EPR portal, Battery Waste Management Rules 2022', 'https://eprbattery.cpcb.gov.in/', 'Central Pollution Control Board'),
    src('kigali', 'Office memorandum on HFC phase-down under the Kigali Amendment (1 April 2026)', 'https://parivesh.nic.in/publicdocument/UPLOAD_OM_NOTIFICATION/IA_DOCS/1002_07042026062522.pdf', 'Ministry of Environment, Forest and Climate Change'),
    # Aviation
    src('aai', 'NOCAS frequently asked questions (height clearance)', 'https://nocas2.aai.aero/nocas/FAQ.html', 'Airports Authority of India'),
    src('noida-adv', 'Advisory on construction within 20 km of Noida International Airport', 'https://www.theweek.in/wire-updates/national/2025/07/12/des126-ncr-noida-airport-advisory.html', 'The Week (PTI)'),
    src('noida-ops', 'Commercial operations begin at Noida International Airport', 'https://www.business-standard.com/industry/aviation/commercial-operations-begin-at-noida-int-l-airport-with-bengaluru-flight-126061500112_1.html', 'Business Standard'),
    src('nmia', 'Navi Mumbai airport begins commercial flight operations (25 December 2025)', 'https://www.business-standard.com/industry/aviation/navi-mumbai-airport-adani-flight-operations-indigo-aviation-125122500119_1.html', 'Business Standard'),
    # Water
    src('cgwa', 'Guidelines to regulate and control ground water extraction, S.O. 3289(E) of 24 September 2020', 'https://neer.co.in/wp-content/uploads/2022/07/ANNEXURE-2-CGWA-GUIDELINES-FOR-WEBSITE-1.pdf', 'Ministry of Jal Shakti, Central Ground Water Authority'),
    src('pib-gw', 'Dynamic Ground Water Resources Assessment 2025', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2220203&reg=48&lang=2', 'PIB, Ministry of Jal Shakti'),
    src('blr-gw', 'Why Bengaluru needs effective groundwater monitoring', 'https://citizenmatters.in/making-the-invisible-visible-why-bengaluru-needs-effective-groundwater-monitoring/', 'Citizen Matters'),
    src('ingres', 'INGRES groundwater assessment information system', 'https://ingres.iith.ac.in', 'Central Ground Water Board and IIT Hyderabad'),
    # Physical risk
    src('is1893', 'IS 1893 (Part 1):2002, criteria for earthquake resistant design, Annex E', 'https://law.resource.org/pub/in/bis/S03/is.1893.1.2002.pdf', 'Bureau of Indian Standards'),
    src('seismic-et', 'BIS revokes new seismic map with high-risk Zone VI (summary of The Economic Times)', 'https://visionias.in/current-affairs/upsc-daily-news-summary/article/2026-03-07/the-economic-times/environment/bis-revokes-new-seismic-map-with-high-risk-zone-vi', 'Vision IAS'),
    src('seismic-drishti', 'Rollback of the seismic code of 2025', 'https://www.drishtiias.com/daily-updates/daily-news-analysis/rollback-of-seismic-code-of-2025', 'Drishti IAS'),
    src('zone6', 'Northeast designated Zone VI as BIS releases new seismic hazard map', 'https://eastmojo.com/free-digest/2025/11/30/northeast-designated-zone-vi-as-bis-releases-new-seismic-hazard-map/', 'EastMojo'),
    src('imd-chennai', 'Meenambakkam extremes and normals', 'https://mausam.imd.gov.in/chennai/mcdata/extreme_meenambakkam.pdf', 'India Meteorological Department, RMC Chennai'),
    src('michaung', 'Chennai records highest rainfall since the 2015 floods', 'https://www.thenewsminute.com/tamil-nadu/chennai-records-highest-amount-of-rainfall-since-2015-floods', 'The News Minute'),
    src('imd-hudhud', 'Very severe cyclonic storm Hudhud: a report', 'https://rsmcnewdelhi.imd.gov.in/uploads/report/26/26_fac6af_hud.pdf', 'India Meteorological Department'),
    src('ncei', 'Global hazards, July 2005 (Mumbai rainfall)', 'https://www.ncei.noaa.gov/sotc/hazards/200507', 'NOAA National Centers for Environmental Information'),
    src('hyd2020', '2020 Hyderabad floods (citing The Times of India, The Indian Express and The Hindu)', 'https://en.wikipedia.org/wiki/2020_Hyderabad_floods', 'Wikipedia'),
    src('bmtpc', 'Vulnerability Atlas of India, third edition (2019)', 'https://www.bmtpc.org/topics.aspx?mid=56&Mid1=180', 'Building Materials and Technology Promotion Council'),
    src('crz', 'Coastal Regulation Zone (summary of the CRZ Notification 2019)', 'https://en.wikipedia.org/wiki/Coastal_Regulation_Zone', 'Wikipedia'),
]}


def _used(sections, faqs):
    ids = []
    for s in sections:
        for b in s['blocks']:
            ids += b.get('sourceIds', [])
    for f in faqs:
        ids += f.get('sourceIds', [])
    return list(dict.fromkeys(ids))


def page(slug, title, description, intro, takeaways, sections, faqs, related, minutes=8, region='India', howTo=None):
    return article(slug, title, description, region, intro, takeaways, sections, faqs,
                   [M[i] for i in _used(sections, faqs)], related, minutes=minutes, howTo=howTo)


HELP = sec('invariant', 'How Invariant helps',
           p('For a site or a shortlist in India, Invariant checks how the site gets power (the discom or transmission connection, the open access route and the nearest substations), screens seismic zone, flood history, groundwater status and airport height limits, and maps the central and state approvals the project needs with the authority behind each one. Send the state, the MW and the date you need power.'))


def help_sec(text):
    return sec('invariant', 'How Invariant helps', p(text))


# ---------------------------------------------------------------------------
# 1. Site selection
# ---------------------------------------------------------------------------
find_site = page(
    'find-data-centre-site-india',
    'How to find a data centre site in India (2026): power first, then fibre, land, water and risk',
    'Pick an Indian data centre site in this order: written power evidence, fibre and cable landings, land and zoning, water, physical risk, then state policy. City by city comparison with sources.',
    'The best location for a data centre in India is the one that can show a dated power connection for the full load, not the one nearest a substation. Mumbai has half of India’s operational capacity because of its 13 cable landing stations, but the roughly 6 GW of grid capacity allocated to Navi Mumbai data centres is close to fully committed. Chennai and Hyderabad have spare colocation (vacancy of 26.7% and 28.0% in H1 2026), and Visakhapatnam has more than 4 GW announced. Screen power evidence first, then fibre, land and zoning, water, seismic and flood risk, and the state policy that applies.',
    [
        'Rank sites by the document behind the MW (connection offer, sanctioned load, signed agreement), not by distance to a line.',
        'Mumbai and Chennai have the cable landings; Hyderabad, Noida and Pune are inland markets that depend on terrestrial fibre.',
        'Seismic zones in the IS 1893 (Part 1) town list (2002 edition, zones retained in 2016): Delhi IV; Mumbai, Chennai, Pune, Kolkata and Ahmedabad III; Bengaluru, Hyderabad and Visakhapatnam II.',
        'Several state policies lapsed or were replaced in 2026, so check which incentives are actually open on the date you apply.',
    ],
    [
        sec('order', 'The order to screen a site in',
            p('Each check can kill a site, so run the cheapest decisive check first. In India that is power: a large load needs a dedicated connection from the discom or the state transmission utility, and the date on that connection usually sets the project schedule. NITI Aayog’s October 2026 framework now asks states to verify power and water capacity before clearing data centre projects.', 'theprint-niti'),
            table(['Step', 'What to establish', 'What counts as evidence'], [
                ['1. Power', 'Who serves the load, at what voltage, how many MW and by when', 'A connection offer or sanctioned load in writing, and the substation and line it depends on'],
                ['2. Fibre and cable landings', 'Route diversity to at least two carriers and distance to landing stations', 'Carrier route maps; landing station locations'],
                ['3. Land and zoning', 'Clean title, permitted use, FAR and ground coverage', 'Title chain, land use, allotment terms from the development authority'],
                ['4. Water', 'Source for cooling and whether groundwater is allowed', 'Groundwater assessment unit status; supplier or treated water commitment'],
                ['5. Physical risk', 'Seismic zone, flood and cyclone history, airport height limits', 'IS 1893 zone, IMD records, AAI height clearance map'],
                ['6. Policy', 'Which state incentives are open and what they require', 'The notified policy text and its validity date'],
            ]),
            links('Detail for each step', [(PAGES[s], s) for s in ['data-centre-grid-connection-india', 'data-centre-land-india', 'data-centre-water-india', 'data-centre-seismic-flood-risk-india', 'data-centre-policy-india-state-comparison', 'data-centre-site-due-diligence-india']])),
        sec('cities', 'Which city is best for a data centre in India?',
            p('No city wins on every axis. The table puts the facts a site buyer compares side by side. Operational capacity and vacancy are Cushman & Wakefield’s H1 2026 figures; seismic zones are from IS 1893 (Part 1), Annex E.', 'cw26', 'is1893'),
            table(['City', 'Operational MW (H1 2026)', 'Colocation vacancy', 'Seismic zone', 'Cable landings', 'Note for site selection'], [
                ['Mumbai and Navi Mumbai', '890', '7.9%', 'III', '13, two more due in 2026', 'Grid allocation for Navi Mumbai data centres reported close to fully committed'],
                ['Chennai', '214', '26.7%', 'III', '7, two under construction', 'East coast cyclone and monsoon flood exposure'],
                ['Delhi NCR', '183', '10.9%', 'IV (Delhi)', 'Inland', 'Noida airport height clearance zone of 20 km'],
                ['Bengaluru', '162', '28.0%', 'II', 'Inland', 'Groundwater over-exploited across Bengaluru Urban, per CGWB-based reporting'],
                ['Hyderabad', '151', '28.0%', 'II', 'Inland', 'Second-largest pipeline after Mumbai (18% of upcoming)'],
                ['Pune', '133', '22.1%', 'III', 'Inland', 'Same state grid and policy as Mumbai'],
                ['Kolkata', '22', '19.4%', 'III', 'Tajpur station under construction', 'Small market, government and SME demand'],
                ['Visakhapatnam', 'Early stage, 4 GW+ announced', 'Not published', 'II', 'New gateway announced under Google’s America-India Connect', 'Hudhud (2014) made landfall over the city'],
            ], 'cw26', 'ii-cw', 'is1893', 'structure', 'noida-adv', 'blr-gw', 'aic', 'imd-hudhud'),
            links('City guides', [(PAGES[s], s) for s in ['data-centres-in-mumbai', 'data-centres-in-chennai', 'data-centres-in-hyderabad', 'data-centres-in-noida', 'data-centres-in-bengaluru', 'data-centres-in-pune', 'data-centres-in-visakhapatnam', 'data-centres-in-gujarat', 'data-centres-in-kolkata', 'mumbai-vs-chennai-vs-hyderabad-data-centres']])),
        sec('power', 'Power: the check that decides the schedule',
            p('Structure Research reports that MSEDCL allocated about 6 GW of grid capacity to Navi Mumbai data centres and that committed and under-construction capacity is approaching it, which is pushing new builds to Panvel, Taloja and Rasayani where new substations can be built. Crisil estimates that by FY2030 data centre capacity could equal about 60% of Mumbai’s current peak demand and about 80% of Visakhapatnam’s.', 'structure', 'crisil'),
            p('Some state policies write the connection terms down: Tamil Nadu’s 2021 policy offered dual grid supply for loads of 50 MW and above and an extra feeder above 100 MW, and West Bengal’s 2021 policy offered dual grid supply. Treat these as eligibility for a connection, not as capacity on a given date.', 'tn21', 'wb21'),
            links('Power guides', [(PAGES[s], s) for s in ['power-for-data-centres-india', 'data-centre-grid-connection-india', 'power-study-data-centre-india']] + [(US_LINKS['power-evidence-data-center-site-verification'], 'power-evidence-data-center-site-verification')])),
        sec('fibre', 'Fibre and cable landings',
            p('About 95% of India’s international bandwidth is handled in the Mumbai region. Mumbai has 13 cable landing stations and Chennai 7, with more under construction in both. Visakhapatnam is being built as an east coast gateway: Google’s America-India Connect, announced in February 2026, includes routes from Visakhapatnam to South Africa and to Malaysia.', 'telenet', 'cw26', 'aic'),
            p('For an AI training campus, latency to a landing station matters less than power and land; for interconnection and cloud regions it matters more. Decide which you are building before weighting this step.')),
        sec('land-water-risk', 'Land, water and physical risk',
            p('Anarock prices land for 100 to 500 MW parks at ₹3 to 10 crore per acre and for small suburban Mumbai sites at ₹35 to 60 crore, and advises buying 30 to 50% more land than phase 1 needs. Groundwater cannot be assumed: under the CGWA guidelines of September 2020, new industries other than MSMEs get no groundwater permit in over-exploited assessment units, and SBI names Bengaluru, Chennai and Gurugram as water-stressed data centre metros.', 'anarock', 'cgwa', 'sbi'),
            p('Physical risk is mostly known in advance: Mumbai recorded 944 mm of rain in 24 hours on 26 July 2005, Chennai’s Meenambakkam station recorded 1,178.3 mm in November 2015, and Cyclone Hudhud crossed the coast over Visakhapatnam in October 2014. Airport height limits apply within 20 km of visual and 56 km of instrument approach airports, and both Navi Mumbai and Noida now have new airports close to data centre clusters.', 'ncei', 'imd-chennai', 'imd-hudhud', 'aai', 'nmia', 'noida-ops')),
        HELP,
    ],
    [
        faq('What is the best location for a data centre in India?', 'It depends on what you are building. Mumbai has the cable landings and half of operational capacity but a tight grid in Navi Mumbai; Chennai has landings and spare capacity; Hyderabad has the second-largest pipeline and seismic zone II; Visakhapatnam has more than 4 GW announced. The deciding factor is a dated power connection for the full load.', 'cw26', 'structure', 'ii-cw'),
        faq('How do I choose a site for a data center in India?', 'Screen in this order: written power evidence, fibre and cable landings, land title and zoning, water, seismic, flood and airport height limits, then the state policy that applies on the date you apply.', 'theprint-niti'),
        faq('Which Indian cities have cable landing stations for data centres?', 'Mumbai (13 stations, two more due in 2026) and Chennai (7, two under construction) are the main ones. Visakhapatnam is being developed as an east coast gateway, and a station at Tajpur near Kolkata is under construction.', 'cw26', 'aic'),
        faq('Is Navi Mumbai running out of power for data centres?', 'Structure Research reports that the roughly 6 GW of grid capacity MSEDCL allocated to Navi Mumbai data centres is close to fully committed, and that new builds are moving to Panvel, Taloja and Rasayani where new substations can be built.', 'structure'),
        faq('Which seismic zone are India’s data centre cities in?', 'Under IS 1893 (Part 1): Delhi is zone IV; Mumbai, Thane, Chennai, Pune, Kolkata and Ahmedabad are zone III; Bengaluru, Hyderabad and Visakhapatnam are zone II.', 'is1893'),
    ],
    ['data-centre-site-due-diligence-india', 'data-centres-in-india', 'mumbai-vs-chennai-vs-hyderabad-data-centres', 'data-centre-grid-connection-india', 'data-centre-land-india'],
    minutes=9,
)

# ---------------------------------------------------------------------------
# 2. Approvals
# ---------------------------------------------------------------------------
approvals = page(
    'data-centre-approvals-india',
    'Approvals needed for a data centre in India (2026): permits, NOCs and who issues them',
    'A data centre in India needs land and building approvals, environmental clearance above 20,000 sq m, pollution board consents, groundwater, airport height and fire NOCs, a diesel licence and electrical inspection.',
    'There is no single data centre licence in India. A project collects approvals from several authorities: land allotment and building plan approval from the state or local authority, environmental clearance under the EIA Notification 2006 if the built-up area is 20,000 sq m or more, Consent to Establish and Consent to Operate from the state pollution control board, a groundwater NOC, an airport height clearance, a fire NOC, a licence to store diesel and an electrical inspector’s approval before energisation. NITI Aayog’s October 2026 framework asks every state to publish a data centre approval matrix and run a single clearance portal because these sit with so many offices.',
    [
        'Environmental clearance: the government told the Rajya Sabha in August 2026, as quoted by Countercurrents, that data centres do not need it as such, only as building projects of 20,000 sq m or more (item 8(a)) or townships (item 8(b)).',
        'Pollution board category: CPCB’s January 2025 classification puts data centres by their gensets: 1 MVA or more on liquid fuel is Orange, on gas Green, under 1,000 kVA needs no added category.',
        'Diesel: if it is Class B fuel (usual; confirm with PESO), below 2,500 litres needs no licence, 2,500 to 25,000 litres is licensed by the district authority and more needs a PESO licence.',
        'Fire: the National Building Code 2016 classes data centres as occupancy E-3 and requires automatic fire detection.',
    ],
    [
        sec('table', 'Every approval for a data centre in India, in one table',
            p('The table lists the approvals a typical colocation or hyperscale campus needs, the law behind each, who issues it and what triggers it. State rules vary; the state approval matrix that NITI Aayog has asked for will be the authoritative list once each state publishes it.', 'niti'),
            table(['Approval', 'Law or rule', 'Issued by', 'Trigger or threshold', 'When'], [
                ['Foreign investment', 'FDI policy, Press Note 3 (2020)', 'Automatic route; government approval for investors from land-border countries', '100% under the automatic route for a company doing only data centre business, as Khaitan & Co reads the FDI policy (data centres are not a named sector)', 'Before land'],
                ['Land allotment or purchase', 'State industrial development authority rules', 'For example YEIDA (via Nivesh Mitra) or MIDC data centre parks', 'Allotment terms set use, FAR and timelines', 'Before design'],
                ['Change of land use', 'State land revenue law', 'State revenue department', 'Private land not already zoned for the use; confirm whether an industrial allotment already carries it', 'Before building plan'],
                ['Building plan', 'State building bye-laws and policy relaxations', 'Development or local authority', 'Every building; UP 2026 and West Bengal 2021 policies allow FAR 3.0 plus 1.0 purchasable', 'Before construction'],
                ['Environmental clearance', 'EIA Notification 2006, item 8(a) or 8(b)', 'State Environment Impact Assessment Authority, through PARIVESH', 'Built-up area of 20,000 sq m or more (8(a)); 50 ha or 1,50,000 sq m (8(b))', 'Before construction'],
                ['Consent to Establish', 'Water Act 1974, Air Act 1981', 'State pollution control board', 'Category set by genset capacity and fuel and by built-up area', 'Before construction'],
                ['Groundwater NOC', 'CGWA guidelines, S.O. 3289(E), 24 September 2020', 'CGWA or the state groundwater authority', 'Any groundwater abstraction unless exempt', 'Before abstraction'],
                ['Height clearance', 'G.S.R. 751(E), 30 September 2015', 'Airports Authority of India, through NOCAS', 'Within 20 km of a visual or 56 km of an instrument approach airport', 'Before building plan'],
                ['Diesel storage licence', 'Petroleum Rules 2002', 'District authority or PESO', 'Class B fuel: 2,500 to 25,000 litres district; above that PESO', 'Before filling tanks'],
                ['Genset type approval', 'G.S.R. 804(E), as cited by CAQM', 'CPCB system at manufacture', 'Engines up to 800 kW from 1 July 2023; larger engines under older standards', 'At procurement'],
                ['Fire NOC', 'National Building Code 2016, Part 4; state fire law', 'State fire service', 'Occupancy E-3', 'Before occupation'],
                ['Electrical inspection', 'CEA (Measures relating to Safety and Electric Supply) Regulations 2023', 'State electrical inspector', 'Installations above the state’s notified voltage; generating units', 'Before energisation'],
                ['Consent to Operate', 'Water Act 1974, Air Act 1981', 'State pollution control board', 'Same category as consent to establish', 'Before operation'],
            ], 'khaitan', 'yeida', 'niveshmitra', 'maha-it', 'up26', 'wb21', 'eia', 'rs-ec', 'parivesh', 'cpcb', 'cgwa', 'aai', 'peso-faq', 'caqm', 'nbc', 'cea-safety')),
        sec('ec', 'Does a data centre need environmental clearance in India?',
            p('Item 8(a) of the EIA Notification 2006 covers building and construction projects of 20,000 sq m or more and below 1,50,000 sq m of built-up area; item 8(b) covers townships and area development projects of 50 ha or more or 1,50,000 sq m or more. In a Rajya Sabha reply on 6 August 2026, as quoted by Countercurrents, the government said data centres do not per se require clearance but do when they fall under 8(a) or 8(b).', 'eia', 'rs-ec'),
            p('Large campuses commonly exceed 20,000 sq m of built-up area. SEIAA Maharashtra granted clearance on 21 November 2025 for Nxtra’s expansion at Mahape, Navi Mumbai: two data centre buildings, two DG buildings and a substation, 76,930 sq m built-up in total. STT GDC’s Mumbai campus was cleared the same way. There is no data centre exemption: in August 2025 the Supreme Court quashed the January 2025 note that had exempted industrial sheds from 8(a).', 'nxtra-ec', 'stt-ec', 'sc-eia')),
        sec('cte-cto', 'What are CTE and CTO, and which category is a data centre?',
            p('Consent to Establish (CTE) is the state pollution control board’s permission to build; Consent to Operate (CTO) is its permission to run. Both are issued under the Water Act 1974 and the Air Act 1981, and the conditions follow the sector’s category.'),
            table(['CPCB entry (January 2025)', 'Category', 'Pollution index'], [
                ['Data centres whose only pollution source is gensets, total under 1,000 kVA', 'No additional classification', 'Not stated'],
                ['Gensets totalling 1 MVA or more on liquid fuel', 'Orange', '60.0'],
                ['Gensets totalling 1 MVA or more on cleaner or gaseous fuel', 'Green', '50.5'],
                ['Building construction, built-up area of 20,000 sq m or more', 'Orange', '61.3'],
            ], 'cpcb'),
            p('A campus with diesel gensets above 1 MVA is therefore Orange, for which boards may grant CTO for up to 10 years, against 15 years for Green. State boards can keep their own lists, and none was found that names data centres, so confirm the category with the state board for the specific site.', 'cpcb')),
        sec('fuel-gensets', 'Diesel storage and genset rules',
            p('The Petroleum Rules 2002 split fuels by flash point: Class B is 23°C to below 65°C. PESO lists diesel (HSD) among products that need a licence. Class B storage below 2,500 litres needs no licence, the district authority licenses 2,500 to 25,000 litres, and larger quantities need a PESO licence, applied for through the National Single Window System. Confirm the class of the fuel you store with PESO; at data centre volumes it decides which licence you need.', 'peso-list', 'peso-faq', 'nsws'),
            p('Genset emission limits for engines up to 800 kW (CPCB IV+) were notified by G.S.R. 804(E), as cited by CAQM, and apply from 1 July 2023. The 2 to 3 MW sets typical in data centres are above 800 kW and remain under the older concentration standards.', 'caqm', 'dieselnet'),
            links('More on backup power', [(PAGES['data-centre-backup-power-dg-sets-india'], 'data-centre-backup-power-dg-sets-india')])),
        sec('fire-electrical', 'Fire NOC and electrical inspection',
            p('The National Building Code 2016, Part 4, puts electronic data processing centres and computer installations in occupancy E-3. For E-3 it requires an automatic fire detection and alarm system, allows clean agents, water mist or hypoxic air for protection, and allows CO2 or inert gas flooding for electrical panels. The fire NOC itself is issued by the state fire service under state law.', 'nbc'),
            p('Under the CEA safety regulations of 2023, each state notifies the voltage up to which owners may self-certify. Andhra Pradesh’s order of 11 March 2026 sets 33 kV: installations above it are inspected by the electrical inspector, and generating units above 10 kW are inspected before commissioning. A campus with a 66, 110 or 220 kV substation and diesel gensets therefore needs the inspector before energisation.', 'cea-safety', 'ap-go17')),
        sec('operating', 'Obligations that start once the data centre runs',
            ul([
                'CERT-In directions of 28 April 2022: report listed cyber incidents within 6 hours, keep ICT logs for 180 days in India, and keep validated subscriber records for 5 years.',
                'Battery Waste Management Rules 2022: producers carry extended producer responsibility under the CPCB EPR system; confirm how waste UPS batteries must be handed over.',
                'Energy codes: BEE’s ECBC 2017 and ECSBC 2024 include provisions relevant to data centres and apply where the state has adopted them.',
                'Refrigerants: India’s HFC freeze starts on 1 January 2028, with an 85% cut by 2047, which affects chiller refrigerant choice.',
            ], 'certin', 'battery', 'pib-explainer', 'kigali'),
            links('Related', [(PAGES[s], s) for s in ['how-to-set-up-data-centre-india', 'data-centre-water-india', 'dpdp-data-localisation-data-centres-india']])),
        help_sec('Invariant maps the central and state approvals for a specific site and load: which ones apply, who issues each, what triggers it and what evidence the application needs, alongside a check of how the site gets power and a screen of seismic, flood, groundwater and airport height risk. Send the state, the MW and the date you need power.'),
    ],
    [
        faq('What approvals are needed to set up a data centre in India?', 'Typically: land allotment or purchase and any change of land use, building plan approval, environmental clearance if built-up area is 20,000 sq m or more, Consent to Establish and Consent to Operate from the state pollution control board, a groundwater NOC, an AAI height clearance near airports, a diesel storage licence, a fire NOC and electrical inspection before energisation.', 'eia', 'cpcb', 'cgwa', 'aai', 'peso-faq', 'nbc', 'cea-safety'),
        faq('Is there a data center licence in India?', 'No single licence. A data centre collects approvals from several authorities. NITI Aayog’s October 2026 framework asks each state to publish a data centre approval matrix and run a single clearance portal.', 'niti'),
        faq('Does a data centre need environmental clearance?', 'Not as a category. It needs clearance as a building project when built-up area is 20,000 sq m or more (item 8(a) of the EIA Notification 2006) or as a township of 50 ha or 1,50,000 sq m or more (item 8(b)), according to the government’s Rajya Sabha reply of 6 August 2026 as quoted.', 'eia', 'rs-ec'),
        faq('What is CTE and CTO for a data centre?', 'Consent to Establish and Consent to Operate are the state pollution control board’s permissions to build and to run, under the Water Act 1974 and the Air Act 1981. For a data centre the category follows the gensets: 1 MVA or more on diesel is Orange under CPCB’s January 2025 classification.', 'cpcb'),
        faq('Which pollution category is a data centre in India?', 'CPCB’s January 2025 classification says data centres whose only pollution source is gensets are classified by genset capacity and fuel: Orange for 1 MVA or more on liquid fuel, Green on gaseous fuel, no added category below 1,000 kVA. A built-up area of 20,000 sq m or more is separately Orange.', 'cpcb'),
        faq('Do I need a licence to store diesel at a data centre?', 'Under the Petroleum Rules 2002, Class B fuel below 2,500 litres needs no licence, 2,500 to 25,000 litres needs a district licence and more needs a PESO licence. PESO lists diesel (HSD) as a product requiring a licence; confirm its class for your fuel with PESO.', 'peso-faq', 'peso-list'),
        faq('Do data centres need a fire NOC?', 'Yes. The state fire service issues it under state law, and the National Building Code 2016 classes data centres as occupancy E-3, which requires automatic fire detection and alarm.', 'nbc'),
    ],
    ['how-to-set-up-data-centre-india', 'data-centre-site-due-diligence-india', 'data-centre-water-india', 'data-centre-backup-power-dg-sets-india', 'data-centre-policy-india-state-comparison'],
    minutes=11,
)

# ---------------------------------------------------------------------------
# 3. How to set up a data centre in India (HowTo)
# ---------------------------------------------------------------------------
STEPS = [
    ('Size the load and the tier', 'Fix the IT load in MW, the phasing, the target tier and the rack density. AI halls run 30 to 60 kW per rack against 8 to 10 kW in conventional ones, which changes power, cooling and land.'),
    ('Set up the Indian entity', 'Khaitan & Co reads the FDI policy as allowing 100% foreign investment under the automatic route for a company doing only data centre business (data centres are not a named sector). Investors from countries that share a land border with India need government approval under Press Note 3 (2020).'),
    ('Shortlist states and check which policies are open', 'Compare the state policies that are in force on the date you will apply. Tamil Nadu’s 2021 policy covered projects up to 31 March 2026; Uttar Pradesh replaced its 2021 policy in July 2026.'),
    ('Confirm the power path before buying land', 'Get the serving discom or transmission utility, the voltage, the MW and the date in writing for each candidate site. In Navi Mumbai the grid capacity allocated to data centres is reported close to fully committed.'),
    ('Secure land and run site due diligence', 'Take an allotment from a state development authority or buy private land, then check title, land use, flood and seismic exposure, groundwater status and airport height limits.'),
    ('Design to Indian codes', 'National Building Code 2016 Part 4 (occupancy E-3), IS 1893 (Part 1):2016 for seismic design, the state’s adopted energy code, and the BIS adoptions of ISO/IEC 22237 and 30134 where you want a recognised standard.'),
    ('Get the pre-construction approvals', 'Building plan, environmental clearance if built-up area is 20,000 sq m or more, Consent to Establish, groundwater NOC, airport height clearance and the diesel storage licence.'),
    ('Build, inspect and get the operating consents', 'Fire NOC, electrical inspector approval before energisation and Consent to Operate from the state pollution control board.'),
    ('Energise, claim incentives and start operating compliance', 'Register for state incentives through the single window, and set up CERT-In reporting and log retention, battery and e-waste handling, and energy and water reporting.'),
]

how_to = page(
    'how-to-set-up-data-centre-india',
    'How to set up a data centre in India (2026): the sequence from entity to energisation',
    'Setting up a data centre in India runs in nine steps: size the load, form the entity, pick a state, confirm power, secure land, design to Indian codes, get approvals, inspect and energise.',
    'To set up a data centre in India, fix the load and tier, form an Indian company (Khaitan & Co reads the FDI policy as allowing 100% foreign investment under the automatic route for a company doing only data centre business), choose a state whose policy is actually open, and confirm a dated power connection before you buy land. Then secure the land, design to the National Building Code and IS 1893, collect the pre-construction approvals, build, pass fire and electrical inspection, and take Consent to Operate. Data centres of 5 MW IT load or more have infrastructure status, which helps on debt. The order matters more than any single permit: a site without a dated power connection is not a site.',
    [
        'Power before land: get the voltage, MW and date in writing for each candidate site.',
        'Foreign investors: 100% under the automatic route according to Khaitan & Co’s reading of the FDI policy, except investors from land-border countries, who need approval under Press Note 3.',
        'Data centres of 5 MW IT load or more are infrastructure (Harmonised Master List, 11 October 2022).',
        'The detailed permit list, with authorities and thresholds, is on the approvals page.',
    ],
    [
        sec('steps', 'The nine steps',
            table(['Step', 'What happens'], [[f'{i + 1}. {n}', t] for i, (n, t) in enumerate(STEPS)], 'anarock', 'khaitan', 'tn21', 'up26', 'structure', 'nbc', 'is1893', 'bis-std', 'eia', 'cea-safety'),
            links('Permit detail', [(PAGES['data-centre-approvals-india'], 'data-centre-approvals-india')])),
        sec('entity', 'Entity, foreign investment and finance',
            p('Khaitan & Co notes that 100% FDI is allowed under the automatic route for Indian companies engaged only in the data centre business; if the company also owns fibre or other telecom assets, the conditions for those sectors apply, and investors from countries sharing a land border with India need government approval under Press Note 3 (2020).', 'khaitan'),
            p('Data centres housed in a dedicated building with at least 5 MW of IT load were added to the Harmonised Master List of Infrastructure on 11 October 2022. Anarock reports long-tenor debt for data centres at about 9.5 to 10.5% for up to 12 years, helped by that status.', 'hml', 'anarock')),
        sec('state', 'Choosing the state',
            p('State policies decide capital subsidy, stamp duty, electricity duty and power terms. Several changed in 2026: Uttar Pradesh notified a new policy on 9 July 2026 that repeals the 2021 one, and Tamil Nadu’s 2021 policy applied to data centres set up from 1 April 2021 to 31 March 2026. Read the notified text and its validity date, not a summary.', 'up26', 'tn21'),
            links('State policies', [(PAGES[s], s) for s in ['data-centre-policy-india-state-comparison', 'national-data-centre-policy-india', 'data-centre-incentives-india-central']])),
        sec('power-land', 'Power and land, in that order',
            p('A large data centre needs a dedicated connection from the discom or the state transmission utility. Structure Research reports that the roughly 6 GW of grid capacity MSEDCL allocated to Navi Mumbai data centres is close to fully committed, which is why new campuses there are moving to sites where new substations can be built. NITI Aayog has asked states to verify power and water capacity before clearing projects.', 'structure', 'theprint-niti'),
            p('Allotment from a state development authority usually comes with defined use and building norms. Uttar Pradesh’s 2026 policy, for example, gives data centres FAR 3.0 free plus 1.0 chargeable, 60% ground coverage and a 100% stamp duty exemption on land bought or leased from a government authority.', 'up26'),
            links('Guides', [(PAGES[s], s) for s in ['data-centre-grid-connection-india', 'find-data-centre-site-india', 'data-centre-land-india', 'data-centre-site-due-diligence-india']])),
        sec('design', 'Design standards to plan around',
            p('The National Building Code 2016 classes data centres as occupancy E-3. Seismic design follows IS 1893 (Part 1):2016; the 2025 revision that added a Zone VI was reported withdrawn in March 2026. BIS has adopted the ISO/IEC 22237 facility series and the ISO/IEC 30134 metrics (PUE, WUE, CUE); they are voluntary unless made mandatory by a quality control order.', 'nbc', 'seismic-et', 'bis-std', 'bs-bis'),
            p('Uttar Pradesh reimburses 25% of Tier III and 50% of Tier IV certification charges by Uptime, TIA or an equivalent agency, one of the few places a certification cost is offset.', 'up26')),
        sec('operate', 'After energisation',
            p('Operating obligations start on day one: CERT-In’s 2022 directions require incident reports within 6 hours, 180 days of logs kept in India and 5 years of subscriber records from data centres; and producers carry extended producer responsibility for UPS batteries under the Battery Waste Management Rules 2022, so confirm the hand-over route for waste batteries.', 'certin', 'battery')),
        help_sec('Invariant works on the steps that decide whether a site is real: it checks how the site gets power and the evidence behind the MW, screens seismic, flood, groundwater and airport height risk, and maps the central and state approvals with the authority behind each one. Send the state, the MW and the date you need power.'),
    ],
    [
        faq('How do I set up a data centre in India?', 'Size the load and tier, form an Indian company, choose a state whose policy is open, confirm a dated power connection, secure and diligence the land, design to the National Building Code and IS 1893, get the pre-construction approvals, pass fire and electrical inspection, then take Consent to Operate and energise.', 'nbc', 'is1893', 'eia', 'cea-safety'),
        faq('Can a foreign company set up a data centre in India?', 'Yes. Khaitan & Co reads the FDI policy as allowing 100% FDI under the automatic route for an Indian company engaged only in data centre business; data centres are not a named sector. Investors from countries sharing a land border with India need government approval under Press Note 3 (2020).', 'khaitan'),
        faq('How do I start a data center business in India?', 'Most new entrants either build and lease capacity (colocation or build-to-suit for hyperscalers) or buy capacity from an operator. Either way the first questions are power, land and the state policy; the approvals list follows from the site and the size.', 'cw26'),
        faq('Do data centres get infrastructure status in India?', 'Yes, data centres in a dedicated building with at least 5 MW of IT load were added to the Harmonised Master List of Infrastructure on 11 October 2022, which eases access to long-term credit.', 'hml'),
        faq('What standards should an Indian data centre be designed to?', 'The National Building Code 2016 (occupancy E-3), IS 1893 (Part 1):2016 for seismic design, the energy code your state has adopted, and voluntarily the BIS adoptions of ISO/IEC 22237 and ISO/IEC 30134.', 'nbc', 'is1893', 'bis-std'),
    ],
    ['data-centre-approvals-india', 'data-centre-cost-per-mw-india', 'find-data-centre-site-india', 'data-centre-incentives-india-central', 'data-centre-grid-connection-india'],
    minutes=9,
    howTo={'name': 'How to set up a data centre in India', 'steps': [{'name': n, 'text': t} for n, t in STEPS]},
)

# ---------------------------------------------------------------------------
# 4. Cost per MW
# ---------------------------------------------------------------------------
cost = page(
    'data-centre-cost-per-mw-india',
    'Data centre cost per MW in India (2026): ₹35 to 75 crore to build, plus land',
    'Building a data centre in India costs about US$7.4 million per MW (Cushman & Wakefield) or ₹35 to 75 crore per MW depending on scale, tier and cooling. Benchmarks, land, rents and financing.',
    'A data centre in India costs roughly ₹35 crore to ₹75 crore per MW of IT load to build, before land, depending on scale, tier and cooling. Cushman & Wakefield benchmarks US$7.4 million per MW, about 23% below Malaysia and 26% below Australia, and US$9.0 million per MW for AI capacity. JM Financial, cited by SBI, puts an air-cooled Tier III build at ₹50 to 55 crore per MW and AI or Tier IV at up to ₹75 crore. Land adds ₹3 crore to ₹60 crore per acre depending on size and city, and long-tenor debt costs about 9.5 to 10.5%.',
    [
        'Cushman & Wakefield: US$7.4 million per MW; US$9.0 million per MW for AI capacity.',
        'JM Financial via SBI: ₹50 to 55 crore per MW for air-cooled Tier III, up to ₹75 crore for AI or Tier IV, ₹35 to 45 crore at large scale.',
        'Anarock: ₹40 to 45 crore per MW (low) to ₹65 to 70 crore per MW (high) for a greenfield Tier III N+1 build.',
        'Wholesale colocation for 5 MW and above rented at about ₹6,000 to 7,500 per kW per month in H1 2025.',
    ],
    [
        sec('benchmarks', 'How much does it cost to build a data centre in India per MW?',
            table(['Publisher', 'Benchmark', 'Scope stated'], [
                ['Cushman & Wakefield (October 2026)', 'US$7.4 million per MW; US$9.0 million per MW for AI capacity', 'Construction benchmark'],
                ['JM Financial, cited by SBI (April 2026)', '₹50 to 55 crore per MW', 'Air-cooled Tier III'],
                ['JM Financial, cited by SBI', 'Up to ₹75 crore per MW', 'AI, immersion or Tier IV'],
                ['JM Financial, cited by SBI', '₹35 to 45 crore per MW', 'Large-scale builds'],
                ['Anarock (2026)', '₹40 to 45 crore per MW to ₹65 to 70 crore per MW (US$4.8 to 8.4 million)', 'Total greenfield Tier III N+1'],
            ], 'ii-cw', 'sbi', 'anarock'),
            p('None of these benchmarks says it includes land, and Anarock prices land separately. Crisil puts Indian development costs about one fifth below several Asia Pacific peers.', 'anarock', 'crisil'),
            p('A cross-check from the sector level: ICRA expected third-party capacity to grow from 1,250 MW in FY2025 to 2,400 to 2,500 MW by FY2028 with about ₹90,000 crore of capex, which works out (our calculation) to roughly ₹72 to 78 crore per MW added.', 'icra')),
        sec('drivers', 'What moves the number',
            ul([
                'Cooling and density: Anarock maps in-row cooling to 3 to 10 kW per rack (the most common in India), rear-door to 10 to 20 kW and direct liquid cooling to 40 to 100 kW or more; AI racks run 30 to 60 kW.',
                'Tier: the jump from Tier III to Tier IV is the difference between the ₹50 to 55 crore and the ₹75 crore bands above.',
                'Efficiency targets: SBI reports leading Indian operators at PUE 1.4 to 1.5 and MeitY AI cloud tenders asking for below 1.35, which pushes design toward more efficient cooling.',
                'Grid connection: who pays for the dedicated line, bay and substation is set by the discom or transmission utility for each site, and can be a large line item on a greenfield campus.',
            ], 'anarock', 'sbi'),
            links('Power cost and connection', [(PAGES[s], s) for s in ['data-centre-grid-connection-india', 'open-access-charges-by-state-india', 'power-for-data-centres-india']])),
        sec('land', 'Land cost',
            table(['Facility size', 'Typical land', 'Land price per acre'], [
                ['5 to 10 MW', '2 to 5 acres', '₹35 to 60 crore (Mumbai suburbs); ₹4 to 10 crore (secondary cities)'],
                ['10 to 30 MW', '5 to 15 acres', '₹5 to 20 crore'],
                ['30 to 100 MW', '15 to 50 acres', '₹4 to 12 crore'],
                ['100 to 500 MW', '50 to 200 acres', '₹3 to 10 crore'],
            ], 'anarock'),
            p('Recent transactions sit inside these bands: Amazon Data Services bought 10.6 acres from Lodha for ₹125.13 crore in June 2026, about ₹11.8 crore per acre (our calculation).', 'ads-lodha'),
            links('Land', [(PAGES['data-centre-land-india'], 'data-centre-land-india')])),
        sec('rents', 'What does colocation rent for in India?',
            p('Cushman & Wakefield’s H1 2025 report is the latest with a published rent table, in ₹ per kW per month for standard 5 to 7 kVA racks.', 'cw25'),
            table(['City', 'Under 250 kW', '250 kW to 1 MW', '1 to 5 MW', '5 MW and above'], [
                ['Mumbai', '8,000 to 12,000', '7,000 to 10,000', '6,500 to 8,000', '6,000 to 7,500'],
                ['Chennai', '8,000 to 9,000', '7,500 to 8,500', '7,000 to 8,000', '6,000 to 7,000'],
                ['Hyderabad', '7,500 to 9,500', '7,000 to 8,500', '6,500 to 7,500', '6,000 to 7,000'],
                ['Delhi NCR', '7,500 to 9,500', '7,000 to 8,500', '6,500 to 7,500', '6,000 to 7,000'],
                ['Bengaluru', '7,500 to 9,000', '7,000 to 8,500', '7,000 to 8,000', '6,500 to 7,000'],
                ['Pune', '7,000 to 8,500', '6,500 to 8,000', '6,000 to 7,000', '6,000 to 6,500'],
            ], 'cw25'),
            p('Crisil says Indian rents are 30 to 35% below peer markets and that contract tenors are now 15 to 20 years.', 'crisil')),
        sec('finance', 'Financing and incentives',
            p('Infrastructure status for data centres of at least 5 MW IT load (11 October 2022) eases access to long-term credit; Anarock reports debt at about 9.5 to 10.5% for up to 12 years. State policies cut the effective cost further through capital subsidy, stamp duty exemption and electricity duty exemption: Uttar Pradesh’s 2026 policy, for example, exempts 100% of stamp duty on government land and gives a 25% land subsidy in the Noida region.', 'hml', 'anarock', 'up26'),
            links('Incentives', [(PAGES[s], s) for s in ['data-centre-incentives-india-central', 'data-centre-policy-india-state-comparison']])),
        help_sec('Cost estimates move most with the power connection and the site. Invariant checks how a site gets power and what the connection depends on, screens seismic, flood, groundwater and airport height risk, and maps the approvals, so the capex model starts from the actual site. Send the state, the MW and the date you need power.'),
    ],
    [
        faq('How much does it cost to build a data center in India per MW?', 'About US$7.4 million per MW on Cushman & Wakefield’s benchmark (US$9.0 million for AI capacity), or ₹50 to 55 crore per MW for air-cooled Tier III and up to ₹75 crore for AI or Tier IV according to JM Financial cited by SBI. Land is extra.', 'ii-cw', 'sbi'),
        faq('What is the cost of setting up a data centre in India?', 'For the building and plant, roughly ₹35 to 75 crore per MW of IT load depending on tier and cooling (Anarock and JM Financial benchmarks), plus land at ₹3 to 60 crore per acre and the grid connection.', 'anarock', 'sbi'),
        faq('How much does it cost to build a small data centre in India?', 'The published benchmarks are per MW and assume purpose-built facilities. Anarock’s smallest land band is 5 to 10 MW on 2 to 5 acres; at Tier III build costs of ₹50 to 55 crore per MW, even a 5 MW facility is a ₹250 crore plus project before land (our calculation).', 'anarock', 'sbi'),
        faq('Is it cheaper to build a data centre in India than in Malaysia?', 'Cushman & Wakefield’s benchmark of US$7.4 million per MW is about 23% below Malaysia and 26% below Australia.', 'ii-cw'),
        faq('What is the colocation price per kW in India?', 'In H1 2025 Cushman & Wakefield quoted ₹6,000 to 7,500 per kW per month for 5 MW and above in Mumbai and up to ₹8,000 to 12,000 for deals under 250 kW.', 'cw25'),
    ],
    ['data-centre-land-india', 'how-to-set-up-data-centre-india', 'data-centre-investment-india', 'data-centre-incentives-india-central', 'india-vs-singapore-vs-johor-data-centres'],
    minutes=8,
)

# ---------------------------------------------------------------------------
# 5. Site due diligence
# ---------------------------------------------------------------------------
dd = page(
    'data-centre-site-due-diligence-india',
    'Data centre site due diligence in India (2026): the feasibility checklist',
    'Due diligence on an Indian data centre site checks title and land use, power evidence, seismic zone, flood and cyclone history, groundwater status, airport height limits and the approvals path.',
    'Due diligence on a data centre site in India answers one question first: can this parcel get the full load, at the voltage needed, on a date you can underwrite? After power come title and land use, groundwater (no new industry other than MSMEs gets a groundwater permit in an over-exploited unit under the 2020 CGWA guidelines), seismic zone under IS 1893, flood and cyclone history from IMD records, airport height limits within 20 or 56 km of an airport, and the approvals the project will need. NITI Aayog’s October 2026 framework now asks states to verify power and water capacity before clearing data centre projects, so the same questions will come from the state.',
    [
        'Power evidence is graded by the document: a written connection offer or sanctioned load beats proximity to a substation.',
        'Groundwater: check the assessment unit on CGWB’s INGRES; 730 of 6,762 units (10.8%) were over-exploited in the 2025 assessment.',
        'Seismic: design to IS 1893 (Part 1):2016; the 2025 map with a Zone VI was reported withdrawn in March 2026.',
        'Airports: height clearance is needed within 20 km of visual and 56 km of instrument approach airports; it is valid 8 years and free.',
    ],
    [
        sec('checklist', 'The India site due diligence checklist',
            table(['Check', 'What to obtain', 'Where it comes from', 'Why it matters'], [
                ['Power', 'Serving utility, voltage, MW, date, and the substation and line it depends on', 'Discom or state transmission utility, in writing', 'Sets the schedule; Navi Mumbai’s data centre allocation is reported close to fully committed'],
                ['Title and encumbrances', 'Clear title chain and encumbrance search', 'State land records and sub-registrar', 'A defect blocks financing and allotment transfers'],
                ['Land use and building norms', 'Permitted use, FAR, ground coverage, height', 'Development authority, allotment terms, state data centre policy', 'Decides how many MW fit; UP 2026 allows FAR 3.0 plus 1.0'],
                ['Groundwater', 'Assessment unit category and whether a NOC is possible', 'CGWB INGRES; CGWA or state groundwater authority', 'Over-exploited units bar new industries other than MSMEs'],
                ['Seismic', 'Zone and zone factor', 'IS 1893 (Part 1)', 'Structural cost; zone IV in Delhi, III in Mumbai and Chennai'],
                ['Flood and cyclone', 'Record rainfall, flood events, cyclone tracks near the site', 'IMD records; BMTPC Vulnerability Atlas', 'Plinth level, drainage, generator and fuel siting'],
                ['Coastal zone', 'Distance from the high tide line', 'CRZ Notification 2019 maps', 'No Development Zones of 50 m or 200 m near the coast'],
                ['Airport height', 'Permissible top elevation', 'AAI NOCAS and colour coded zoning maps', 'Caps building and stack height near Navi Mumbai and Noida'],
                ['Environmental clearance', 'Whether built-up area crosses 20,000 sq m', 'EIA Notification 2006 item 8(a)', 'Adds a state appraisal before construction'],
                ['Policy eligibility', 'Which incentives are open and their conditions', 'Notified state policy text', 'Several policies lapsed or changed in 2026'],
            ], 'structure', 'up26', 'cgwa', 'ingres', 'is1893', 'imd-chennai', 'bmtpc', 'crz', 'aai', 'eia', 'tn21'),
            links('Detail', [(PAGES[s], s) for s in ['data-centre-approvals-india', 'data-centre-seismic-flood-risk-india', 'data-centre-water-india', 'data-centre-land-india']])),
        sec('power', 'Power evidence: the first and most decisive check',
            p('The test is the document behind the MW. A parcel near a 220 kV substation is not a 100 MW site until the utility has said, in writing, how much it can supply and when, and what upgrades that depends on. Crisil estimates that by FY2030 data centre capacity could equal about 60% of Mumbai’s current peak demand and about 80% of Visakhapatnam’s, so headroom near today’s clusters is being used quickly.', 'crisil'),
            links('Power guides', [(PAGES[s], s) for s in ['data-centre-grid-connection-india', 'power-study-data-centre-india']] + [(US_LINKS['power-evidence-data-center-site-verification'], 'power-evidence-data-center-site-verification'), (US_LINKS['data-center-substation-capacity-check'], 'data-center-substation-capacity-check')])),
        sec('water', 'Water and groundwater',
            p('Under the CGWA guidelines of 24 September 2020, any new or expanding industry or infrastructure project that abstracts groundwater needs a NOC unless exempt, and no new industry other than MSMEs gets one in an over-exploited unit. Infrastructure projects are treated as location specific and are not barred outright. Whether a data centre is treated as industry or infrastructure is not settled in the guidelines’ text, so confirm it with the authority for the specific site.', 'cgwa'),
            p('The 2025 national assessment classed 730 of 6,762 units (10.8%) as over-exploited, concentrated in the north-west, west and south. CGWB-based reporting says every assessment unit in Bengaluru Urban is over-exploited.', 'pib-gw', 'blr-gw')),
        sec('physical', 'Seismic, flood, cyclone and coast',
            p('IS 1893 (Part 1) puts Delhi in zone IV, Mumbai, Chennai, Pune, Kolkata and Ahmedabad in zone III, and Bengaluru, Hyderabad and Visakhapatnam in zone II. Flood records to check against include 944 mm in 24 hours at Mumbai’s Santacruz on 26 July 2005 and 1,178.3 mm in November 2015 at Chennai’s Meenambakkam. Cyclone Hudhud crossed the coast over Visakhapatnam on 12 October 2014 with winds of about 180 km/h and a 1.4 m storm surge.', 'is1893', 'ncei', 'imd-chennai', 'imd-hudhud'),
            p('Near the coast, the CRZ Notification 2019 sets No Development Zones of 50 m from the high tide line in densely populated rural areas (CRZ-IIIA) and 200 m elsewhere in CRZ-III.', 'crz')),
        sec('airport', 'Airport height limits',
            p('Under G.S.R. 751(E) of 2015, a height clearance from AAI is needed within 20 km of a visual approach airport and 56 km of an instrument approach airport. It is valid for 8 years and has no fee. Navi Mumbai International Airport began commercial flights on 25 December 2025 and Noida International Airport on 15 June 2026; AAI advised in July 2025 that no construction should take place within 20 km of the Noida airport without height clearance.', 'aai', 'nmia', 'noida-ops', 'noida-adv')),
        help_sec('Invariant runs this checklist on Indian sites: it checks how the site gets power and the evidence behind the MW, screens seismic zone, flood and cyclone history, groundwater status and airport height limits, and maps the central and state approvals with the authority behind each. Send the coordinates or the state, the MW and the date you need power.'),
    ],
    [
        faq('What is data centre site due diligence?', 'A structured check of whether a parcel can become a data centre on your timeline: power evidence, title and land use, water, seismic, flood and cyclone risk, airport height limits and the approvals path.', 'aai', 'cgwa', 'is1893'),
        faq('What should a data centre site selection checklist in India include?', 'Power (utility, voltage, MW, date, in writing), title and encumbrances, land use and FAR, groundwater unit status, seismic zone, flood and cyclone records, coastal zone limits, airport height clearance, environmental clearance threshold and state policy eligibility.', 'cgwa', 'is1893', 'crz', 'aai', 'eia'),
        faq('How do I check if groundwater can be used at a site in India?', 'Find the site’s assessment unit on CGWB’s INGRES system. In over-exploited units the 2020 CGWA guidelines bar new industries other than MSMEs from getting a groundwater NOC; infrastructure projects are assessed case by case.', 'ingres', 'cgwa'),
        faq('Do I need AAI height clearance for a data centre?', 'Yes, if the site is within 20 km of a visual approach airport or 56 km of an instrument approach airport, unless a colour coded zoning map shows the building is below the permissible height. Clearance is valid for 8 years and has no fee.', 'aai'),
        faq('What is a data center feasibility study in India?', 'A first pass over the same checklist, run before land is bought: whether power can be had at the needed MW and date, whether the land and water work, and which physical risks and approvals apply. It ends in a go, no-go or conditional go.'),
    ],
    ['find-data-centre-site-india', 'data-centre-approvals-india', 'data-centre-seismic-flood-risk-india', 'data-centre-water-india', 'power-study-data-centre-india'],
    minutes=9,
)

# ---------------------------------------------------------------------------
# 6. Land
# ---------------------------------------------------------------------------
land = page(
    'data-centre-land-india',
    'Data centre land in India (2026): acres per MW, land prices, parks and powered land',
    'Data centre land in India runs ₹3 to 60 crore per acre and about half an acre per MW on Anarock’s bands. Prices, recent deals, data centre parks, FAR rules and what makes land powered.',
    'Data centre land in India costs from about ₹3 crore per acre for 100 to 500 MW parks to ₹35 to 60 crore per acre for small sites in Mumbai’s suburbs, on Anarock’s 2026 benchmarks. Its size bands imply roughly half an acre per MW of IT load. Savills counted more than 120 acres of data centre land transacted in H1 2026. Land becomes powered land only when the utility has committed MW and a date in writing; in India most large sites are allotted by state development authorities, several of which now run dedicated data centre parks.',
    [
        'Anarock size bands: 5 to 10 MW on 2 to 5 acres, up to 100 to 500 MW on 50 to 200 acres (midpoints about 0.4 to 0.5 acre per MW, our calculation).',
        'Recent deals: STT GDC paid ₹282 crore for 3.48 acres with a building in Navi Mumbai; Amazon Data Services paid ₹125.13 crore for 10.6 acres from Lodha.',
        'Parks: YEIDA’s 100-acre Data Centre Park in Sector 28; Maharashtra’s green data centre parks; Karnataka’s planned 500 MW park near Hoskote.',
        'Building norms help: Uttar Pradesh (2026) and West Bengal (2021) allow FAR 3.0 plus 1.0 purchasable for data centres.',
    ],
    [
        sec('acres-per-mw', 'How much land does a data centre need in India?',
            table(['Facility size', 'Typical land (Anarock)', 'Acres per MW at the midpoint (our calculation)'], [
                ['5 to 10 MW', '2 to 5 acres', 'About 0.47'],
                ['10 to 30 MW', '5 to 15 acres', 'About 0.5'],
                ['30 to 100 MW', '15 to 50 acres', 'About 0.5'],
                ['100 to 500 MW', '50 to 200 acres', 'About 0.42'],
            ], 'anarock'),
            p('No Indian authority publishes a standard. The ratio depends on how many storeys the building has, the FAR the state allows, and how much of the site goes to the substation, generators and fuel. Anarock advises buying 30 to 50% more land than phase 1 needs.', 'anarock'),
            links('Method', [(US_LINKS['data-center-land-acres-per-mw'], 'data-center-land-acres-per-mw')])),
        sec('prices', 'Data centre land prices in India',
            table(['Facility size', 'Land price per acre (Anarock, 2026)'], [
                ['5 to 10 MW', '₹35 to 60 crore in Mumbai suburbs; ₹4 to 10 crore in secondary cities'],
                ['10 to 30 MW', '₹5 to 20 crore'],
                ['30 to 100 MW', '₹4 to 12 crore'],
                ['100 to 500 MW (Navi Mumbai, outer Chennai, Noida parks)', '₹3 to 10 crore'],
            ], 'anarock'),
            table(['Buyer', 'Land', 'Price', 'Date'], [
                ['STT GDC India', '3.48 acres with a building, TTC Industrial Area, Navi Mumbai', '₹282 crore', 'Registered 22 May 2026'],
                ['Amazon Data Services', '10.6 acres from Lodha', '₹125.13 crore', 'June 2026'],
                ['AWS', '38.18 acres from Lodha, near Mumbai', 'About ₹450 crore', 'November 2024'],
                ['Lumina CloudInfra (now AirTrunk)', '16 acres, Ambattur, Chennai', 'More than ₹500 crore', 'January 2026'],
                ['Brookfield', '30 acres, Navi Mumbai', '₹600 crore', '2021'],
            ], 'stt-land', 'ads-lodha', 'aws-lodha', 'lumina', 'brookfield'),
            p('Savills counted more than 120 acres of data centre land transacted in H1 2026.', 'savills')),
        sec('parks', 'Data centre parks in India',
            ul([
                'Uttar Pradesh: YEIDA lists a 100-acre Data Centre Park in Sector 28, applied for through Nivesh Mitra. UP’s 2026 policy defines a park as at least 40 MW of load.',
                'Maharashtra: the IT/ITeS Policy 2023 says MIDC will take up data centre parks with prior clearances for land allotted to data centres.',
                'Karnataka: a 500 MW data centre park near Hoskote by 2031, with solar power and treated water committed, and 500 MW at Mysuru and Mangaluru.',
                'Andhra Pradesh: Google’s subsidiary was reported to receive about 480 acres across three locations in the Visakhapatnam region at a 25% discount to market price as part of its incentive package.',
                'Private parks: Lodha has earmarked about 400 acres at Palava for data centres, as reported by Business Standard in April 2026.',
            ], 'yeida', 'niveshmitra', 'up26', 'maha-it', 'cw26', 'etv-google', 'lodha')),
        sec('norms', 'FAR, ground coverage and stamp duty',
            p('Uttar Pradesh’s 2026 policy gives data centres base FAR 3.0 free plus 1.0 chargeable, keeps basement parking, storage and DG space out of FAR, extends service FAR to 40% for DG sets, allows 60% ground coverage and unrestricted floor-to-ceiling height subject to overall height rules. It exempts 100% of stamp duty on land bought or leased from a government authority and gives a land subsidy of 25% of sector rates in the Noida and YEIDA region and 50% in Bundelkhand and Purvanchal.', 'up26'),
            p('West Bengal’s 2021 policy also allows FAR 3.0 plus 1.0 purchasable and 60% ground coverage.', 'wb21'),
            links('Policy', [(PAGES[s], s) for s in ['uttar-pradesh-data-centre-policy', 'west-bengal-data-centre-policy', 'data-centre-policy-india-state-comparison']])),
        sec('powered-land', 'Powered land in India',
            p('Powered land means land with deliverable electricity for the load, documented by the utility, not land near a substation. India has no public listing market for it the way the US does; most large campuses are assembled through state allotments and private purchases and then connected through the discom or the state transmission utility. In Navi Mumbai, where Structure Research reports the data centre grid allocation is close to fully committed, a site with a connection already in place is worth much more than one without.', 'structure'),
            links('Power evidence', [(PAGES[s], s) for s in ['data-centre-grid-connection-india', 'power-for-data-centres-india']] + [(US_LINKS['power-evidence-data-center-site-verification'], 'power-evidence-data-center-site-verification')])),
        help_sec('Invariant does not list Indian land. For a parcel you are looking at, it checks how the site gets power and the evidence behind the MW, screens seismic, flood, groundwater and airport height risk, and maps the approvals. Send the coordinates or the state, the MW and the date you need power.'),
    ],
    [
        faq('How much land is needed for a 1 MW data centre?', 'There is no Indian standard. Anarock’s bands start at 2 to 5 acres for 5 to 10 MW, and their midpoints work out to about 0.4 to 0.5 acre per MW (our calculation). A small facility’s land need depends mostly on how many storeys the state’s FAR allows.', 'anarock'),
        faq('What does data center land cost in India?', 'About ₹3 to 10 crore per acre for 100 to 500 MW parks, rising to ₹35 to 60 crore per acre for small sites in Mumbai’s suburbs (Anarock, 2026).', 'anarock'),
        faq('Where are the data centre parks in India?', 'YEIDA’s 100-acre Data Centre Park in Sector 28 (Uttar Pradesh), MIDC data centre parks in Maharashtra, and Karnataka’s planned 500 MW park near Hoskote are examples. Private developers such as Lodha at Palava also sell land to data centre buyers.', 'yeida', 'maha-it', 'cw26', 'lodha'),
        faq('Can I buy powered land for a data centre in India?', 'There is no public listing market for powered land in India. Most sites are allotted by state development authorities or bought privately and then connected by the utility, so the power evidence has to be checked for each parcel.'),
        faq('What FAR do data centres get in India?', 'Uttar Pradesh’s 2026 policy and West Bengal’s 2021 policy both allow FAR 3.0 plus 1.0 purchasable and 60% ground coverage for data centres; UP keeps DG and storage space out of FAR.', 'up26', 'wb21'),
    ],
    ['data-centre-cost-per-mw-india', 'find-data-centre-site-india', 'data-centre-site-due-diligence-india', 'data-center-land-acres-per-mw', 'uttar-pradesh-data-centre-policy'],
    minutes=8,
)

# ---------------------------------------------------------------------------
# 7. Seismic, flood and cyclone risk
# ---------------------------------------------------------------------------
risk = page(
    'data-centre-seismic-flood-risk-india',
    'Seismic zones, flood and cyclone risk for data centres in India (2026)',
    'Indian data centre cities by IS 1893 seismic zone, with the 2025 Zone VI map and its reported 2026 withdrawal, record floods in Mumbai, Chennai and Hyderabad, east coast cyclones and CRZ limits.',
    'Most of India’s data centre capacity sits in seismic zone III: Mumbai, Chennai, Pune and Kolkata, with Delhi in zone IV and Bengaluru, Hyderabad and Visakhapatnam in zone II under the IS 1893 (Part 1) town list (2002 edition, zones retained in 2016). A 2025 revision of the code added a Zone VI for the Himalayan arc, but it was reported withdrawn in March 2026, so the 2016 four-zone map applies. Flood risk is the more frequent problem: Mumbai recorded 944 mm of rain in 24 hours in July 2005 and Chennai 1,178.3 mm in November 2015. On the east coast, Cyclone Hudhud crossed Visakhapatnam in 2014 with winds of about 180 km/h.',
    [
        'Zone factors: 0.10 (II), 0.16 (III), 0.24 (IV), 0.36 (V).',
        'Design to IS 1893 (Part 1):2016; the 2025 edition with Zone VI was reported withdrawn by BIS in March 2026.',
        'Chennai and Visakhapatnam carry cyclone exposure; Mumbai and Chennai carry the record rainfall events.',
        'Near the coast, CRZ 2019 No Development Zones are 50 m or 200 m from the high tide line.',
    ],
    [
        sec('seismic', 'Seismic zones of India’s data centre cities',
            table(['City', 'Seismic zone (IS 1893 Part 1)', 'Zone factor'], [
                ['Delhi', 'IV', '0.24'],
                ['Mumbai', 'III', '0.16'],
                ['Thane', 'III', '0.16'],
                ['Chennai', 'III', '0.16'],
                ['Pune', 'III', '0.16'],
                ['Kolkata', 'III', '0.16'],
                ['Ahmedabad', 'III', '0.16'],
                ['Bengaluru', 'II', '0.10'],
                ['Hyderabad', 'II', '0.10'],
                ['Visakhapatnam', 'II', '0.10'],
            ], 'is1893'),
            p('City zones are from Annex E of IS 1893 (Part 1):2002, and the 2016 edition keeps the four-zone map. Noida and the YEIDA sectors are not listed by name; confirm the zone for a specific site.', 'is1893')),
        sec('zone-vi', 'The 2025 seismic map and Zone VI',
            p('BIS issued IS 1893 (Part 1):2025 around November 2025 with a new Zone VI covering the Himalayan arc. News reports in March 2026 said BIS withdrew it by a gazette notification dated 3 March 2026 after the housing ministry raised cost and consultation concerns, and that the 2016 edition is back in force. We have not seen the gazette notice itself; the withdrawal is as reported.', 'zone6', 'seismic-et', 'seismic-drishti'),
            p('For a data centre project that means designing to the 2016 edition today and watching for a re-issued revision, which could change the zone for sites near zone boundaries.')),
        sec('floods', 'Flood history in data centre cities',
            table(['City', 'Event', 'Recorded figure'], [
                ['Mumbai', '26 July 2005', '944 mm in 24 hours at Santacruz, a city record'],
                ['Chennai', 'November 2015', '1,178.3 mm in the month at Meenambakkam, the all-time November record'],
                ['Chennai', 'Cyclone Michaung, December 2023', 'About 415 mm widely reported at Meenambakkam; figures for the window differ'],
                ['Hyderabad', '13 to 18 October 2020', '324 mm at Ghatkesar; 33 deaths in the city'],
            ], 'ncei', 'imd-chennai', 'michaung', 'hyd2020'),
            p('The BMTPC Vulnerability Atlas of India (third edition, 2019) maps flood, cyclone, wind and earthquake hazard by state and district and is a reasonable first screen before site-specific drainage and plinth studies.', 'bmtpc')),
        sec('cyclones', 'Cyclones on the east coast',
            p('Very severe cyclonic storm Hudhud crossed the coast over Visakhapatnam between 12:00 and 13:00 IST on 12 October 2014, with maximum sustained winds of about 180 km/h, a central pressure of 950 hPa and a 1.4 m storm surge at the Visakhapatnam tide gauge. With several gigawatt campuses announced in and around Visakhapatnam, wind loads, surge level and access after landfall belong in the design basis there.', 'imd-hudhud'),
            links('Visakhapatnam and Chennai', [(PAGES[s], s) for s in ['data-centres-in-visakhapatnam', 'data-centres-in-chennai']])),
        sec('heat-coast', 'Heat and coastal limits',
            p('Chennai’s Meenambakkam station records a mean daily maximum of 37.3°C in May and 37.2°C in June (1991 to 2020 normals), which sets the cooling design point for the city.', 'imd-chennai'),
            p('The CRZ Notification 2019 sets a No Development Zone of 50 m from the high tide line in densely populated rural coastal areas (CRZ-IIIA) and 200 m in CRZ-IIIB. Coastal sites near Mumbai, Chennai and Visakhapatnam need the CRZ map checked before layout.', 'crz')),
        help_sec('Invariant screens Indian sites for seismic zone, flood and cyclone history, groundwater status and airport height limits, checks how the site gets power, and maps the approvals. Send the coordinates or the state, the MW and the date you need power.'),
    ],
    [
        faq('Which seismic zone is Mumbai in?', 'Zone III, with a zone factor of 0.16, under the IS 1893 (Part 1) town list (2002 edition, zones retained in 2016).', 'is1893'),
        faq('Is Chennai safe for a data centre from floods?', 'Chennai has significant flood exposure: Meenambakkam recorded 1,178.3 mm in November 2015, the all-time November record, and Cyclone Michaung brought heavy rain in December 2023. Sites need plinth, drainage and generator siting designed for it.', 'imd-chennai', 'michaung'),
        faq('Was Zone VI added to India’s seismic map?', 'A 2025 revision of IS 1893 added a Zone VI for the Himalayan arc, but news reports say BIS withdrew it in March 2026 and the 2016 four-zone map is back in force.', 'zone6', 'seismic-et'),
        faq('Which Indian data center cities are in the lowest seismic zone?', 'Bengaluru, Hyderabad and Visakhapatnam are in zone II, the lowest, under the IS 1893 (Part 1) town list (2002 edition, zones retained in 2016).', 'is1893'),
        faq('Is Visakhapatnam at risk from cyclones?', 'Yes. Cyclone Hudhud crossed the coast over Visakhapatnam in October 2014 with winds of about 180 km/h and a 1.4 m storm surge.', 'imd-hudhud'),
    ],
    ['data-centre-site-due-diligence-india', 'find-data-centre-site-india', 'data-centres-in-chennai', 'data-centres-in-visakhapatnam'],
    minutes=7,
)

# ---------------------------------------------------------------------------
# 8. Water
# ---------------------------------------------------------------------------
water = page(
    'data-centre-water-india',
    'Water for data centres in India (2026): groundwater NOC, water stress and state rules',
    'Indian data centres need a CGWA or state groundwater NOC to draw groundwater, and new industries are barred in over-exploited units. Water use per MW, water-stressed cities and state incentives.',
    'A data centre in India that draws groundwater needs a NOC from the Central Ground Water Authority or the state groundwater authority under the guidelines of 24 September 2020, and no new industry other than an MSME gets one in an over-exploited unit. Whether a data centre counts as industry or as infrastructure, which is treated case by case, has to be confirmed for each site. Anarock puts water use for cooling-tower data centres at about 25.5 million litres per MW per year. SBI names Bengaluru, Chennai and Gurugram as water-stressed data centre metros, and newer state policies push treated wastewater and closed-loop cooling.',
    [
        'CGWA 2020 guidelines: NOC needed for groundwater abstraction by industry and infrastructure, with meters, rainwater harvesting and annual audits.',
        'Over-exploited units: no NOC for new industries except MSMEs; 730 of 6,762 units (10.8%) were over-exploited in 2025.',
        'Water use: about 25.5 million litres per MW per year for cooling-tower designs (Anarock).',
        'Karnataka’s Cabinet-approved 2026-31 policy, not yet confirmed as notified, would reimburse treated water costs; Uttar Pradesh’s 2026 policy requires a water assessment before land allocation.',
    ],
    [
        sec('cgwa', 'Do data centres need a groundwater NOC in India?',
            p('The CGWA guidelines (S.O. 3289(E), 24 September 2020, amended 29 March 2023) require all new, existing and expanding industries, infrastructure projects and mining projects that abstract groundwater to hold a NOC from CGWA or the state or UT groundwater authority, unless exempt. Exemptions cover domestic users, rural drinking water, the armed forces, agriculture and micro and small enterprises drawing less than 10 m3 a day.', 'cgwa'),
            table(['Rule', 'What the guidelines say'], [
                ['Over-exploited units', 'No NOC for any new industry except MSMEs; expansion that increases abstraction is not permitted'],
                ['Infrastructure projects', 'Location specific; not barred in over-exploited units, but groundwater for construction only if no treated sewage is available within 10 km'],
                ['Sewage treatment', 'An STP is mandatory where groundwater need exceeds 20 m3 a day'],
                ['Metering', 'Digital flow meter with telemetry and annual calibration'],
                ['Piezometers', 'One for 11 to 50 m3 a day; one with a data logger for 51 to 500; two (one with telemetry) above 500'],
                ['Penalties', 'Environmental compensation of ₹20 to ₹200 per m3 for illegal extraction, depending on category and volume'],
            ], 'cgwa'),
            p('Whether a data centre is an industry or an infrastructure project under these guidelines is not settled in the text we reviewed. In an over-exploited unit it decides whether a NOC is possible at all, so put the question to the authority before committing to the site.', 'cgwa')),
        sec('stress', 'Water stress in data centre cities',
            p('The 2025 Dynamic Ground Water Resources Assessment found 730 of 6,762 assessment units (10.8%) over-exploited, concentrated in the north-west, west and south, including Karnataka, Tamil Nadu, Telangana and Andhra Pradesh. CGWB-based reporting says every assessment unit in Bengaluru Urban is over-exploited, and Newslaundry reported in April 2026 that most of Bengaluru’s data centres sit in its most water-stressed areas. Check the unit for a specific site on INGRES.', 'pib-gw', 'blr-gw', 'newslaundry', 'ingres'),
            p('SBI names Bengaluru, Chennai and Gurugram as water-stressed data centre metros and notes that newer rules require water management plans.', 'sbi')),
        sec('use', 'How much water does a data centre use in India?',
            p('Anarock puts water use at about 25.5 million litres per MW per year for data centres with cooling towers. Down To Earth, an environmental publication, projects India’s data centre water use rising from 150 billion litres in 2025 to 358 billion litres in 2030.', 'anarock', 'dte'),
            p('The design choice drives the number. Closed-loop and liquid cooling use far less water than evaporative cooling towers; the government’s September 2026 explainer notes that liquid, adiabatic and immersion cooling are being adopted.', 'pib-explainer')),
        sec('policy', 'State water rules and incentives',
            ul([
                'Uttar Pradesh (2026): the state agency must assess water availability before allocating land, the developer must get the required permission before using water, and closed-loop cooling and treated wastewater reuse are encouraged.',
                'Karnataka (2026 to 2031): reimburses 100% of treated water costs up to ₹8 lakh a year for 5 years and offers a water usage effectiveness incentive of up to ₹30 lakh a year for 2 years at a WUE of 0.7 to 1.3 litres per kWh, as reported by The News Minute.',
                'NITI Aayog (October 2026): asks states to verify water capacity before clearing data centre projects.',
            ], 'up26', 'ka26', 'theprint-niti'),
            p('Operators are moving the same way: Digital Edge published a release in February 2026 on an 83 MW solar PPA and recycled water at its Navi Mumbai campus.', 'de-water')),
        help_sec('Invariant checks groundwater unit status and the water path for an Indian site along with how it gets power, seismic, flood and airport height risk, and maps the approvals. Send the coordinates or the state, the MW and the date you need power.'),
    ],
    [
        faq('Do data centres need a CGWA NOC?', 'Yes, if they draw groundwater. The CGWA guidelines of 24 September 2020 require a NOC from CGWA or the state groundwater authority for industries and infrastructure projects that abstract groundwater, unless exempt.', 'cgwa'),
        faq('Can a data centre use groundwater in an over-exploited area?', 'Possibly not. The guidelines bar new industries other than MSMEs from getting a NOC in over-exploited units, while infrastructure projects are assessed case by case. Confirm with the authority how a data centre is treated for the specific site.', 'cgwa'),
        faq('How much water does a data center use in India?', 'About 25.5 million litres per MW per year for cooling-tower designs, according to Anarock. Closed-loop and liquid cooling use much less.', 'anarock'),
        faq('Which Indian cities have water stress for data centres?', 'SBI names Bengaluru, Chennai and Gurugram. CGWB-based reporting says all assessment units in Bengaluru Urban are over-exploited.', 'sbi', 'blr-gw'),
        faq('Do Indian states give incentives for treated water in data centres?', 'Karnataka’s 2026 policy reimburses treated water costs up to ₹8 lakh a year for 5 years, as reported; Uttar Pradesh’s 2026 policy encourages treated wastewater reuse and requires a water assessment before land allocation.', 'ka26', 'up26'),
    ],
    ['data-centre-site-due-diligence-india', 'data-centres-in-bengaluru', 'data-centre-approvals-india', 'karnataka-data-centre-policy'],
    minutes=7,
)

ARTICLES = [find_site, approvals, how_to, cost, dd, land, risk, water]
