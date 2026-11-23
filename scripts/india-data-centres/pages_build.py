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
    # Added in fact-check (primary or reputable replacements)
    src('crisil-dh', 'India set for five times surge in its data centre capacity by 2030 (Crisil Ratings, 3 November 2026)', 'https://www.deccanherald.com/business/india-set-for-five-times-surge-in-its-data-centre-capacity-by-2030-4205631', 'Deccan Herald'),
    src('gblog', 'Announcing America-India Connect and new investments to advance global AI access (18 February 2026)', 'https://blog.google/intl/en-in/company-news/announcing-america-india-connect-and-new-investments-to-advance-global-ai-access/', 'Google'),
    src('rs2136', 'Rajya Sabha unstarred question 2136 on water use in AI data centres, answered 6 August 2026', 'https://sansad.in/getFile/annex/271/AU2136_BdORz6.pdf?source=pqars', 'Ministry of Environment, Forest and Climate Change (Rajya Sabha)'),
    src('ngt-cpcb', 'Reply of CPCB in O.A. No. 478 of 2025 on genset emission standards', 'https://www.greentribunal.gov.in/sites/default/files/news_updates/Reply%20by%20CPCB%20in%20OA%20No.%20478%20of%202025%20(NEWS%20ITEM%20TITLED%20DG%20SETS%20CONTRIBUTING%20SIGNIFICANTLY%20TO%20PUNJAB,S%20POLLUTION.pdf', 'Central Pollution Control Board (filed before the National Green Tribunal)'),
    src('pib-pn3', 'Review of FDI policy for curbing opportunistic takeovers of Indian companies (Press Note 3, 2020)', 'https://pib.gov.in/PressReleasePage.aspx?PRID=1615711', 'PIB, Ministry of Commerce and Industry'),
    src('bb-pn2', 'Beyond Press Note 3: analysing Press Note 2 (2026) and the new FDI framework for land-bordering countries', 'https://www.barandbench.com/law-firms/view-point/beyond-press-note-3-analysing-press-note-2-2026-and-the-new-fdi-framework-for-land-bordering-countries', 'Bar & Bench'),
    src('tp-noida', 'Height restrictions put in place within 20 km radius of Noida airport (PTI, 12 July 2025)', 'https://theprint.in/india/height-restrictions-put-in-place-within-20-km-radius-of-noida-airport/2687943', 'ThePrint (PTI)'),
    src('bis-ced39', 'Programme of work, CED 39 Earthquake Engineering: published and withdrawn standards', 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/pow_new/Pow/download_pow_pdf_dept_commtt/63/210/', 'Bureau of Indian Standards'),
    src('noaa2005', 'Global hazards and significant events, July 2005 (archived copy)', 'https://web.archive.org/web/20210115170959/https://www.ncdc.noaa.gov/sotc/hazards/200507', 'NOAA National Centers for Environmental Information'),
    src('imd-hyd', 'A study of extreme rainfall events and urban flooding over Hyderabad, October 2020 (Mausam)', 'https://metnet.imd.gov.in/docs/mausamdocs/175212.pdf', 'India Meteorological Department'),
    src('crz19', 'CRZ Notification 2019, G.S.R. 37(E) of 18 January 2019 (copy hosted by the Government of Puducherry)', 'https://dste.py.gov.in/ppcc/pdf/publichearing/czmp-2019/CRZ-Notification-2019.pdf', 'Ministry of Environment, Forest and Climate Change'),
    src('snr-mh', 'Incentives and laws for data centers in Maharashtra (IT/ITeS Policy 2023)', 'https://www.snrlaw.in/incentives-and-laws-for-data-centers-in-maharashtra/', 'S&R Associates'),
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
    'How to find a data centre site in India: power, fibre, land and risk (2026)',
    'Finding a data centre site in India starts with written power evidence. Compare Mumbai (890 MW, 7.9% vacancy in H1 2026), Chennai, Hyderabad and others on risk.',
    'The best location for a data centre in India is a site that can show a dated power connection for its full load, not the one nearest a substation. Mumbai had 890 MW of operational capacity in H1 2026, half of India’s total, and 13 cable landing stations, according to Cushman & Wakefield, but Structure Research reports that the roughly 6 GW of grid capacity allocated to Navi Mumbai data centres is close to fully committed. Chennai and Hyderabad had colocation vacancy of 26.7% and 28.0% in H1 2026, and Invest India and Cushman & Wakefield count more than 4 GW announced in Visakhapatnam. After power, screen fibre, land, water, physical risk and state policy.',
    [
        'Rank sites by the document behind the MW (a connection offer, sanctioned load or signed agreement), not by distance to a line; NITI Aayog’s October 2026 framework asks states to verify power and water capacity before clearing data centre projects.',
        'Mumbai (13 cable landing stations) and Chennai (7) hold India’s cable landings, according to Cushman & Wakefield; Hyderabad, Noida and Pune are inland markets that depend on terrestrial fibre.',
        'Seismic zones in the IS 1893 (Part 1):2002 town list: Delhi IV; Mumbai, Chennai, Pune, Kolkata and Ahmedabad III; Bengaluru, Hyderabad and Visakhapatnam II.',
        'Tamil Nadu’s 2021 policy covered data centres incorporated until 31 March 2026 and Uttar Pradesh replaced its 2021 policy in July 2026, so check which incentives are open on the date you apply.',
    ],
    [
        sec('order', 'The order to screen a data centre site in India',
            p('Power is the first check on an Indian data centre site because it is the cheapest check that can rule a site out: a large load needs a dedicated connection from the discom or the state transmission utility, and the date on that connection usually sets the project schedule. Every later check in the table can also kill a site. NITI Aayog’s October 2026 framework now asks states to verify power and water capacity before clearing data centre projects.', 'theprint-niti'),
            table(['Step', 'What to establish', 'What counts as evidence'], [
                ['1. Power', 'Who serves the load, at what voltage, how many MW and by when', 'A connection offer or sanctioned load in writing, and the substation and line it depends on'],
                ['2. Fibre and cable landings', 'Route diversity to at least two carriers and distance to landing stations', 'Carrier route maps; landing station locations'],
                ['3. Land and zoning', 'Clean title, permitted use, FAR and ground coverage', 'Title chain, land use, allotment terms from the development authority'],
                ['4. Water', 'Source for cooling and whether groundwater is allowed', 'Groundwater assessment unit status; supplier or treated water commitment'],
                ['5. Physical risk', 'Seismic zone, flood and cyclone history, airport height limits', 'IS 1893 zone, IMD records, AAI height clearance map'],
                ['6. Policy', 'Which state incentives are open and what they require', 'The notified policy text and its validity date'],
            ]),
            links('Detail for each step', [(PAGES[s], s) for s in ['data-centre-grid-connection-india', 'data-centre-land-india', 'data-centre-water-india', 'data-centre-seismic-flood-risk-india', 'data-centre-policy-india-state-comparison', 'data-centre-site-due-diligence-india']])),
        sec('cities', 'Best cities for a data centre in India, compared',
            p('No Indian city leads on every measure a site buyer compares. Mumbai and Navi Mumbai have the most operational capacity and the lowest colocation vacancy (7.9%); Bengaluru and Hyderabad have the most spare colocation (28.0%) and sit in seismic zone II. Operational capacity and vacancy are Cushman & Wakefield’s H1 2026 figures; seismic zones are from IS 1893 (Part 1):2002, Annex E.', 'cw26', 'is1893'),
            table(['City', 'Operational MW (H1 2026)', 'Colocation vacancy', 'Seismic zone', 'Cable landings', 'Note for site selection'], [
                ['Mumbai and Navi Mumbai', '890', '7.9%', 'III', '13, two more due in 2026', 'Grid allocation for Navi Mumbai data centres reported close to fully committed'],
                ['Chennai', '214', '26.7%', 'III', '7, two under construction', 'East coast cyclone and monsoon flood exposure'],
                ['Delhi NCR', '183', '10.9%', 'IV (Delhi)', 'Inland', 'Noida airport height clearance zone of 20 km'],
                ['Bengaluru', '162', '28.0%', 'II', 'Inland', 'All 10 groundwater assessment units in Bengaluru Urban and Rural over-exploited, per CGWB data reported by Citizen Matters'],
                ['Hyderabad', '151', '28.0%', 'II', 'Inland', 'Second-largest pipeline after Mumbai (18% of upcoming)'],
                ['Pune', '133', '22.1%', 'III', 'Inland', 'Same state grid and policy as Mumbai'],
                ['Kolkata', '22', '19.4%', 'III', 'Tajpur station under construction', 'Small market, government and SME demand'],
                ['Visakhapatnam', 'Early stage, 4 GW+ announced', 'Not published', 'II', 'New gateway announced under Google’s America-India Connect', 'Hudhud (2014) made landfall over the city'],
            ], 'cw26', 'ii-cw', 'is1893', 'structure', 'tp-noida', 'blr-gw', 'gblog', 'imd-hudhud'),
            links('City guides', [(PAGES[s], s) for s in ['data-centres-in-mumbai', 'data-centres-in-chennai', 'data-centres-in-hyderabad', 'data-centres-in-noida', 'data-centres-in-bengaluru', 'data-centres-in-pune', 'data-centres-in-visakhapatnam', 'data-centres-in-gujarat', 'data-centres-in-kolkata', 'mumbai-vs-chennai-vs-hyderabad-data-centres']])),
        sec('power', 'Power: the check that sets the schedule',
            p('Structure Research reports that MSEDCL allocated about 6 GW of grid capacity to Navi Mumbai data centres and that committed and under-construction capacity is approaching it, which is pushing new builds to Panvel, Taloja and Rasayani where new substations can be built. Crisil estimates that by FY2030 data centre capacity could equal about 60% of Mumbai’s current peak demand and about 80% of Visakhapatnam’s.', 'structure', 'crisil-dh'),
            p('Some state policies write the connection terms down: Tamil Nadu’s 2021 policy offered dual grid supply for a sanctioned load of 50 MW or more and an additional feeder above 100 MW, and West Bengal’s 2021 policy said the government would establish dual power grid networks. Treat these as eligibility for a connection, not as capacity on a given date.', 'tn21', 'wb21'),
            links('Power guides', [(PAGES[s], s) for s in ['power-for-data-centres-india', 'data-centre-grid-connection-india', 'power-study-data-centre-india']] + [(US_LINKS['power-evidence-data-center-site-verification'], 'power-evidence-data-center-site-verification')])),
        sec('fibre', 'Fibre and cable landing stations in India',
            p('Tele.net reports that the Mumbai region handles about 95% of India’s international bandwidth. Mumbai has 13 cable landing stations with two more due in 2026, and Chennai has 7 with two under construction. Visakhapatnam is being built as an east coast gateway: Google’s America-India Connect, announced on 18 February 2026, includes a subsea path from Visakhapatnam and Chennai to South Africa and one from Visakhapatnam to Singapore.', 'telenet', 'cw26', 'gblog'),
            p('For an AI training campus, latency to a landing station matters less than power and land; for interconnection and cloud regions it matters more. Decide which you are building before weighting this step.')),
        sec('land-water-risk', 'Land, water and physical risk at Indian sites',
            p('Anarock prices land for 100 to 500 MW parks at ₹3 to 10 crore per acre and for small suburban Mumbai sites at ₹35 to 60 crore, and advises buying 30 to 50% more land than phase 1 needs. Groundwater cannot be assumed: under the CGWA guidelines of September 2020, new industries other than MSMEs get no groundwater NOC in over-exploited assessment units, and SBI names Bengaluru, Chennai and Gurugram as water-stressed data centre metros.', 'anarock', 'cgwa', 'sbi'),
            p('Physical risk at Indian sites is mostly on record in advance: 944 mm of rain fell on Mumbai on 26 July 2005, a 24-hour record for the city, Chennai’s Meenambakkam station recorded 1,178.3 mm in November 2015, and Cyclone Hudhud crossed the coast over Visakhapatnam in October 2014. AAI height clearance is needed within 20 km of an airport operating under visual flight rules and 56 km of one under instrument flight rules, and new airports began commercial flights at Navi Mumbai in December 2025 and at Noida in June 2026.', 'noaa2005', 'imd-chennai', 'imd-hudhud', 'aai', 'nmia', 'noida-ops')),
        HELP,
    ],
    [
        faq('What is the best location for a data centre in India?', 'The best location is whichever site can show a dated power connection for its full load; the right city depends on what you are building. Mumbai has the cable landings and half of operational capacity but a tight grid in Navi Mumbai; Chennai has landings and 26.7% colocation vacancy; Hyderabad has the second-largest pipeline and seismic zone II; Visakhapatnam has more than 4 GW announced.', 'cw26', 'structure', 'ii-cw', 'is1893'),
        faq('How do I choose a site for a data center in India?', 'Start with written power evidence for the full load, then check the rest in order: fibre and cable landings, land title and zoning, water, seismic, flood and airport height limits, and the state policy that applies on the date you apply.'),
        faq('Which Indian cities have cable landing stations for data centres?', 'Mumbai (13 stations, two more due in 2026) and Chennai (7, two under construction) are the main ones. Google has announced a new international subsea gateway at Visakhapatnam, and a station at Tajpur near Kolkata is under construction.', 'cw26', 'gblog'),
        faq('Is Navi Mumbai running out of power for data centres?', 'Structure Research reports that the roughly 6 GW of grid capacity MSEDCL allocated to Navi Mumbai data centres is close to fully committed. New builds are moving to Panvel, Taloja and Rasayani, where new substations can be built.', 'structure'),
        faq('Which seismic zone are India’s data centre cities in?', 'Under the IS 1893 (Part 1):2002 town list: Delhi is zone IV; Mumbai, Thane, Chennai, Pune, Kolkata and Ahmedabad are zone III; Bengaluru, Hyderabad and Visakhapatnam are zone II.', 'is1893'),
    ],
    ['data-centre-site-due-diligence-india', 'data-centres-in-india', 'mumbai-vs-chennai-vs-hyderabad-data-centres', 'data-centre-grid-connection-india', 'data-centre-land-india'],
    minutes=9,
)

# ---------------------------------------------------------------------------
# 2. Approvals
# ---------------------------------------------------------------------------
approvals = page(
    'data-centre-approvals-india',
    'Approvals needed for a data centre in India: permits, NOCs and who issues them',
    'Approvals for a data centre in India: no single licence, but EC at 20,000 sq m or more, CTE and CTO, groundwater, airport height and fire NOCs, diesel licence.',
    'India has no single data centre licence: a project collects separate approvals from several authorities, and environmental clearance under the EIA Notification 2006 applies only if built-up area is 20,000 sq m or more. The others are land allotment and building plan approval from the state or local authority, Consent to Establish and Consent to Operate from the state pollution control board, a groundwater NOC, an airport height clearance, a fire NOC, a licence to store diesel and an electrical inspector’s approval before energisation. Because these sit with so many offices, NITI Aayog’s October 2026 framework asks every state to publish a data centre approval matrix and run a single clearance portal.',
    [
        'Environmental clearance: the environment ministry told the Rajya Sabha on 6 August 2026 that AI data centres do not per se need it, only as building projects above 20,000 sq m (item 8(a)) or townships (item 8(b)).',
        'Pollution board category: CPCB’s January 2025 classification says data centres polluting only through gensets may be classified by genset capacity and fuel: 1 MVA or more on liquid fuel is Orange, on gas Green.',
        'Diesel: under the Petroleum Rules 2002, Class B petroleum (confirm your fuel’s class with PESO) below 2,500 litres needs no licence, 2,500 to 25,000 litres is licensed by the district authority and more needs a PESO licence.',
        'Fire: the National Building Code 2016 puts electronic data processing centres in occupancy E-3 and requires automatic fire detection and alarm.',
        'Single window: NITI Aayog’s October 2026 framework asks each state to publish a data centre approval matrix and run a single clearance portal.',
    ],
    [
        sec('table', 'Every approval for a data centre in India, in one table',
            p('A colocation or hyperscale campus in India needs the approvals below; each row gives the law behind the approval, who issues it, what triggers it and when it is needed. State rules vary, and the state approval matrix that NITI Aayog has asked for will be the authoritative list once each state publishes it.', 'niti'),
            table(['Approval', 'Law or rule', 'Issued by', 'Trigger or threshold', 'When'], [
                ['Foreign investment', 'FDI policy, Press Note 3 (2020)', 'Automatic route; government approval for investors from land-border countries', '100% under the automatic route for a company doing only data centre business, according to Khaitan & Co', 'Before land'],
                ['Land allotment or purchase', 'State industrial development authority rules', 'For example YEIDA’s Data Centre Park or MIDC data centre parks', 'Allotment terms set use, FAR and timelines', 'Before design'],
                ['Change of land use', 'State rules (vary by state)', 'State authority (varies by state)', 'Land not already zoned for industrial or IT use; Anarock says agricultural conversion adds 12 to 18 months in most states', 'Before building plan'],
                ['Building plan', 'State building bye-laws and policy relaxations', 'Development or local authority', 'Every building; UP 2026 and West Bengal 2021 policies allow FAR 3.0 plus 1.0 purchasable', 'Before construction'],
                ['Environmental clearance', 'EIA Notification 2006, item 8(a) or 8(b)', 'State Environment Impact Assessment Authority, through PARIVESH', 'Built-up area of 20,000 sq m or more (8(a)); 50 ha or 1,50,000 sq m (8(b))', 'Before construction'],
                ['Consent to Establish', 'Water Act 1974, Air Act 1981', 'State pollution control board', 'Category set by genset capacity and fuel and by built-up area', 'Before construction'],
                ['Groundwater NOC', 'CGWA guidelines, S.O. 3289(E), 24 September 2020', 'CGWA or the state groundwater authority', 'Any groundwater abstraction unless exempt', 'Before abstraction'],
                ['Height clearance', 'G.S.R. 751(E), 30 September 2015', 'Airports Authority of India, through NOCAS', 'Within 20 km of a VFR airport or 56 km of an IFR airport', 'Before construction'],
                ['Diesel storage licence', 'Petroleum Rules 2002', 'District authority or PESO', 'Class B fuel: 2,500 to 25,000 litres district; above that PESO', 'Before filling tanks'],
                ['Genset type approval', 'G.S.R. 804(E) of 3 November 2022', 'Regulated at the manufacturing stage under a CPCB procedure', 'Engines up to 800 kW; engines above 800 kW fall under G.S.R. 489(E) of 2002, regulated by state boards', 'At procurement'],
                ['Fire NOC', 'National Building Code 2016, Part 4', 'State fire department', 'Occupancy E-3', 'Before occupation'],
                ['Electrical inspection', 'CEA (Measures relating to Safety and Electric Supply) Regulations 2023', 'State electrical inspector', 'Installations above the state’s notified voltage; generating units', 'Before energisation'],
                ['Consent to Operate', 'Water Act 1974, Air Act 1981', 'State pollution control board', 'Same category as consent to establish', 'Before operation'],
            ], 'khaitan', 'pib-pn3', 'yeida', 'snr-mh', 'up26', 'wb21', 'eia', 'rs2136', 'stt-ec', 'cpcb', 'cgwa', 'aai', 'peso-faq', 'ngt-cpcb', 'nbc', 'anarock', 'cea-safety')),
        sec('ec', 'Environmental clearance for data centres in India',
            p('In a Rajya Sabha reply on 6 August 2026, the environment ministry said AI data centres do not per se require environmental clearance but do when proposed as part of a project under item 8(a) or 8(b) of the EIA Notification 2006, and that SEIAA grants clearance for such building projects. Item 8(a) covers building and construction projects of 20,000 sq m or more and below 1,50,000 sq m of built-up area; item 8(b) covers townships and area development projects of 50 ha or more or 1,50,000 sq m or more.', 'eia', 'rs2136'),
            p('SEIAA Maharashtra granted clearance under item 8(a) on 21 November 2025 for Nxtra’s expansion at Mahape, Navi Mumbai: two data centre buildings, two DG buildings and a substation building, 76,930 sq m built-up in total after expansion. STT GDC received an 8(a) clearance from SEIAA Maharashtra in April 2022. In August 2025 the Supreme Court struck down the part of a January 2025 notification that had exempted industrial sheds, schools, colleges and hostels from prior clearance under 8(a).', 'nxtra-ec', 'stt-ec', 'sc-eia')),
        sec('cte-cto', 'CTE, CTO and the pollution category of a data centre',
            p('Consent to Establish (CTE) is the state pollution control board’s permission to build; Consent to Operate (CTO) is its permission to run. Both are issued under the Water Act 1974 and the Air Act 1981, and the conditions follow the sector’s category.'),
            table(['CPCB entry (January 2025)', 'Category', 'Pollution index'], [
                ['Standalone gensets totalling less than 1,000 kVA', 'May not require additional classification', 'Not stated'],
                ['Gensets totalling 1 MVA or more on liquid fuel', 'Orange', '60.0'],
                ['Gensets totalling 1 MVA or more on cleaner or gaseous fuel', 'Green', '50.5'],
                ['Building construction, built-up area of 20,000 sq m or more', 'Orange', '61.3'],
            ], 'cpcb'),
            p('CPCB notes that data centres whose pollution potential comes only from gensets may be classified by genset capacity and fuel, so a campus with diesel gensets of 1 MVA or more falls in Orange, for which boards may grant CTO for up to 10 years, against 15 years for Green. Confirm the category with the state board for the specific site.', 'cpcb')),
        sec('fuel-gensets', 'Diesel storage licence and genset emission rules',
            p('Under the Petroleum Rules 2002, Class B petroleum stored below 2,500 litres needs no PESO licence, the district authority licenses more than 2,500 and up to 25,000 litres, and larger quantities need a PESO licence. The rules split fuels by flash point (Class B is 23°C to below 65°C), and PESO lists diesel (HSD) among products that need a licence; PESO’s FAQ says applicants register on the National Single Window System first. Confirm the class of the fuel you store with PESO; at data centre volumes it decides which licence you need.', 'peso-list', 'peso-faq', 'nsws'),
            p('CPCB told the National Green Tribunal that revised emission standards for genset engines up to 800 kW were notified by G.S.R. 804(E) of 3 November 2022 and are regulated at the manufacturing stage, while diesel engines above 800 kW fall under G.S.R. 489(E) of 9 July 2002 and are regulated by the state pollution control boards.', 'ngt-cpcb'),
            links('More on backup power', [(PAGES['data-centre-backup-power-dg-sets-india'], 'data-centre-backup-power-dg-sets-india')])),
        sec('fire-electrical', 'Fire NOC and electrical inspection',
            p('The National Building Code 2016, Part 4, puts electronic data processing centres and computer installations in occupancy E-3. For E-3 it requires an automatic fire detection and alarm system, allows clean agents, mist technologies or hypoxic air for protection, and allows CO2 or inert gas flooding for electrical panels. Anarock lists the fire NOC as issued by the state fire department.', 'nbc', 'anarock'),
            p('Under the CEA safety regulations of 2023, each state notifies the voltage up to which owners may self-certify. Andhra Pradesh’s order of 11 March 2026 sets 33 kV: installations above it are inspected by the electrical inspector, and generating units above 10 kW are inspected before commissioning. In Andhra Pradesh, then, a campus with a 66, 110 or 220 kV substation and diesel gensets needs the inspector before energisation.', 'cea-safety', 'ap-go17')),
        sec('operating', 'Obligations that start once the data centre runs',
            ul([
                'CERT-In directions of 28 April 2022: report listed cyber incidents within 6 hours, keep ICT logs for 180 days in India, and keep validated subscriber records for 5 years.',
                'Battery Waste Management Rules 2022: producers carry extended producer responsibility under the CPCB EPR system; confirm how waste UPS batteries must be handed over.',
                'Energy codes: BEE has notified ECBC 2017 and ECSBC 2024, which include provisions relevant to data centre infrastructure.',
                'Refrigerants: India’s HFC production and consumption freeze starts on 1 January 2028, with an 85% cut by 2047, which affects chiller refrigerant choice.',
            ], 'certin', 'battery', 'pib-explainer', 'kigali'),
            links('Related', [(PAGES[s], s) for s in ['how-to-set-up-data-centre-india', 'data-centre-water-india', 'dpdp-data-localisation-data-centres-india']])),
        help_sec('Invariant maps the central and state approvals for a specific site and load: which ones apply, who issues each, what triggers it and what evidence the application needs, alongside a check of how the site gets power and a screen of seismic, flood, groundwater and airport height risk. Send the state, the MW and the date you need power.'),
    ],
    [
        faq('What approvals are needed to set up a data centre in India?', 'A data centre in India needs land, building, environmental, pollution board, groundwater, airport height, diesel, fire and electrical approvals from separate authorities: land allotment or purchase and any change of land use, building plan approval, environmental clearance if built-up area is 20,000 sq m or more, Consent to Establish and Consent to Operate from the state pollution control board, a groundwater NOC, an AAI height clearance near airports, a diesel storage licence, a fire NOC and electrical inspection before energisation.', 'eia', 'cpcb', 'cgwa', 'aai', 'peso-faq', 'anarock', 'cea-safety'),
        faq('Is there a data center licence in India?', 'No. India has no single data centre licence; a project collects approvals from several authorities. NITI Aayog’s October 2026 framework asks each state to publish a data centre approval matrix and run a single clearance portal.', 'niti'),
        faq('Does a data centre need environmental clearance in India?', 'Not as a category of its own. The environment ministry told the Rajya Sabha on 6 August 2026 that AI data centres do not per se require it, but do when proposed as a building project above 20,000 sq m (item 8(a) of the EIA Notification 2006) or a township of 50 ha or 1,50,000 sq m or more (item 8(b)).', 'eia', 'rs2136'),
        faq('What is CTE and CTO for a data centre?', 'Consent to Establish and Consent to Operate are the state pollution control board’s permissions to build and to run, under the Water Act 1974 and the Air Act 1981. Under CPCB’s January 2025 classification a data centre polluting only through gensets may be classified by its gensets: 1 MVA or more on liquid fuel is Orange.', 'cpcb'),
        faq('Which pollution category is a data centre in India?', 'Under CPCB’s January 2025 classification, a data centre polluting only through gensets may be classified by genset capacity and fuel: Orange for 1 MVA or more on liquid fuel, Green on cleaner or gaseous fuel. A building construction project of 20,000 sq m or more is separately Orange.', 'cpcb'),
        faq('Do I need a licence to store diesel at a data centre?', 'Under the Petroleum Rules 2002, Class B fuel below 2,500 litres needs no licence, 2,500 to 25,000 litres needs a district licence and more needs a PESO licence. PESO lists diesel (HSD) as a product requiring a licence; confirm its class for your fuel with PESO.', 'peso-faq', 'peso-list'),
        faq('Do data centres in India need a fire NOC?', 'Yes. Anarock lists the fire NOC as issued by the state fire department, and the National Building Code 2016 puts electronic data processing centres in occupancy E-3, which requires automatic fire detection and alarm.', 'anarock', 'nbc'),
    ],
    ['how-to-set-up-data-centre-india', 'data-centre-site-due-diligence-india', 'data-centre-water-india', 'data-centre-backup-power-dg-sets-india', 'data-centre-policy-india-state-comparison'],
    minutes=11,
)

# ---------------------------------------------------------------------------
# 3. How to set up a data centre in India (HowTo)
# ---------------------------------------------------------------------------
STEPS = [
    ('Size the load and the tier', 'Fix the IT load in MW, the phasing, the target tier and the rack density. Anarock puts an Nvidia H100 GPU cluster at 30 to 60 kW per rack against 8 to 10 kW traditionally, which changes power, cooling and land.'),
    ('Set up the Indian entity', 'Khaitan & Co notes that 100% foreign investment is permitted under the automatic route in an Indian company engaged only in the data centre business. Investors from countries that share a land border with India, or whose beneficial owner is in one, need government approval under Press Note 3 (2020).'),
    ('Shortlist states and check which policies are open', 'Compare the state policies in force on the date you will apply. Tamil Nadu’s 2021 policy covered data centres incorporated up to 31 March 2026; Uttar Pradesh replaced its 2021 policy in July 2026.'),
    ('Confirm the power path before buying land', 'Get the serving discom or transmission utility, the voltage, the MW and the date in writing for each candidate site. In Navi Mumbai, Structure Research reports that the grid capacity allocated to data centres is close to fully committed.'),
    ('Secure land and run site due diligence', 'Take an allotment from a state development authority or buy private land, then check title, land use, flood and seismic exposure, groundwater status and airport height limits.'),
    ('Design to Indian codes', 'National Building Code 2016 Part 4 (occupancy E-3), IS 1893 (Part 1):2016 for seismic design, BEE’s ECBC 2017 or ECSBC 2024, and the BIS adoptions of ISO/IEC 22237 and 30134 where you want a recognised standard.'),
    ('Get the pre-construction approvals', 'Building plan, environmental clearance if built-up area is 20,000 sq m or more, Consent to Establish, groundwater NOC, airport height clearance and the diesel storage licence.'),
    ('Build, inspect and get the operating consents', 'Fire NOC, electrical inspector approval before energisation and Consent to Operate from the state pollution control board.'),
    ('Energise, claim incentives and start operating compliance', 'Register for state incentives through the single window, and set up CERT-In reporting and log retention, battery and e-waste handling, and energy and water reporting.'),
]

how_to = page(
    'how-to-set-up-data-centre-india',
    'How to set up a data centre in India: from entity to energisation (2026)',
    'How to set up a data centre in India in nine steps: size the load, form the entity, pick a state, confirm power before land, get approvals, inspect and energise.',
    'Setting up a data centre in India takes nine steps, from sizing the load to taking Consent to Operate, and the step to get right first is a dated power connection, confirmed before you buy land. Khaitan & Co notes that 100% foreign investment is permitted under the automatic route for an Indian company doing only data centre business. Then pick a state whose policy is still open, secure land, design to the National Building Code and IS 1893, collect the pre-construction approvals, and pass fire and electrical inspection. Data centres of 5 MW IT load or more in a dedicated building have infrastructure status, which Anarock says has improved access to long-tenor financing.',
    [
        'Power before land: get the voltage, MW and date in writing for each candidate site; in Navi Mumbai, Structure Research reports the grid capacity allocated to data centres is close to fully committed.',
        'Foreign investors: 100% under the automatic route according to Khaitan & Co, except investors from land-border countries, who need government approval under Press Note 3 (2020).',
        'Data centres in a dedicated building with 5 MW of IT load or more are infrastructure (Harmonised Master List, 11 October 2022).',
        'Environmental clearance is needed before construction if built-up area is 20,000 sq m or more; the fire NOC, electrical inspection and Consent to Operate come after construction.',
        'State policy: Tamil Nadu’s 2021 policy covered data centres incorporated up to 31 March 2026, and Uttar Pradesh notified a new policy on 9 July 2026, so check which incentives are open when you apply.',
    ],
    [
        sec('steps', 'The nine steps to set up a data centre in India',
            table(['Step', 'What happens'], [[f'{i + 1}. {n}', t] for i, (n, t) in enumerate(STEPS)], 'anarock', 'khaitan', 'pib-pn3', 'tn21', 'up26', 'structure', 'nbc', 'bis-ced39', 'pib-explainer', 'bis-std', 'eia', 'cea-safety'),
            links('Permit detail', [(PAGES['data-centre-approvals-india'], 'data-centre-approvals-india')])),
        sec('entity', 'Indian entity, foreign investment and finance',
            p('Khaitan & Co notes that 100% FDI is permitted under the automatic route in Indian companies engaged only in the data centre business, and that if the company also owns fibre assets, the conditions for that sector apply. Under Press Note 3 (2020), an entity of a country that shares a land border with India, or whose beneficial owner is situated in or is a citizen of such a country, can invest only under the government route; Bar & Bench notes that Press Note 2 (2026) kept that requirement.', 'khaitan', 'pib-pn3', 'bb-pn2'),
            p('Data centres housed in a dedicated building with at least 5 MW of IT load were added to the Harmonised Master List of Infrastructure on 11 October 2022. Anarock reports long-tenor debt for data centres at about 9.5 to 10.5% for up to 12 years, helped by that status.', 'hml', 'anarock')),
        sec('state', 'Choosing a state and its data centre policy',
            p('Indian state data centre policies decide capital subsidy, stamp duty, electricity duty and power terms, and two of them changed in 2026: Uttar Pradesh notified a new policy on 9 July 2026 that repeals the 2021 one, and Tamil Nadu’s 2021 policy applied to data centres incorporated from 1 April 2021 to 31 March 2026. Read the notified text and its validity date, not a summary.', 'up26', 'tn21'),
            links('State policies', [(PAGES[s], s) for s in ['data-centre-policy-india-state-comparison', 'national-data-centre-policy-india', 'data-centre-incentives-india-central']])),
        sec('power-land', 'Power and land, in that order',
            p('A large data centre in India needs a dedicated connection from the discom or the state transmission utility. Structure Research reports that the roughly 6 GW of grid capacity MSEDCL allocated to Navi Mumbai data centres is close to fully committed, which is why new campuses there are moving to sites where new substations can be built. NITI Aayog has asked states to verify power and water capacity before clearing projects.', 'structure', 'theprint-niti'),
            p('Allotment from a state development authority usually comes with defined use and building norms. Uttar Pradesh’s 2026 policy, for example, gives data centres FAR 3.0 free plus 1.0 chargeable, ground coverage of up to 60% or as per byelaws, and a 100% stamp duty exemption on land bought or leased from a government authority.', 'up26'),
            links('Guides', [(PAGES[s], s) for s in ['data-centre-grid-connection-india', 'find-data-centre-site-india', 'data-centre-land-india', 'data-centre-site-due-diligence-india']])),
        sec('design', 'Design codes and standards for data centres in India',
            p('The National Building Code 2016 puts electronic data processing centres in occupancy E-3. For seismic design, BIS lists IS 1893 (Part 1):2016 among its published standards and the 2025 edition of Part 1 as withdrawn. BIS has adopted the ISO/IEC 22237 facility series and the ISO/IEC 30134 metrics (including PUE, WUE and CUE), and Business Standard reports that these standards are voluntary.', 'nbc', 'bis-ced39', 'bis-std', 'bs-bis'),
            p('Uttar Pradesh’s 2026 policy offers a one-time reimbursement of 25% of Tier III and 50% of Tier IV certification charges by Uptime, TIA or an equivalent approved agency.', 'up26')),
        sec('operate', 'Compliance after energisation',
            p('A data centre’s operating obligations in India start on day one. CERT-In’s 2022 directions require incident reports within 6 hours, 180 days of logs kept in India and 5 years of subscriber records from data centres. Producers carry extended producer responsibility for UPS batteries under the Battery Waste Management Rules 2022, so confirm the hand-over route for waste batteries.', 'certin', 'battery')),
        help_sec('Invariant works on the steps that decide whether a site is real: it checks how the site gets power and the evidence behind the MW, screens seismic, flood, groundwater and airport height risk, and maps the central and state approvals with the authority behind each one. Send the state, the MW and the date you need power.'),
    ],
    [
        faq('How do I set up a data centre in India?', 'Follow nine steps, and confirm a dated power connection before buying land. In order: size the load and tier, form an Indian company, choose a state whose policy is open, confirm a dated power connection, secure and diligence the land, design to the National Building Code and IS 1893, get the pre-construction approvals, pass fire and electrical inspection, then take Consent to Operate and energise.', 'nbc', 'bis-ced39', 'eia', 'cea-safety'),
        faq('Can a foreign company set up a data centre in India?', 'Yes. Khaitan & Co notes that 100% FDI is permitted under the automatic route for an Indian company engaged only in the data centre business. Investors from countries sharing a land border with India, or whose beneficial owner is in one, need government approval under Press Note 3 (2020).', 'khaitan', 'pib-pn3'),
        faq('How do I start a data center business in India?', 'You can build and lease capacity (colocation or build-to-suit for hyperscalers) or buy capacity from an operator. Either way the first questions are power, land and the state policy; the approvals list follows from the site and the size.'),
        faq('Do data centres get infrastructure status in India?', 'Yes, data centres in a dedicated building with at least 5 MW of IT load were added to the Harmonised Master List of Infrastructure on 11 October 2022. Anarock says the status has improved access to long-tenor financing at about 9.5 to 10.5% for up to 12 years.', 'hml', 'anarock'),
        faq('What standards should an Indian data centre be designed to?', 'The National Building Code 2016 (occupancy E-3), IS 1893 (Part 1):2016 for seismic design, BEE’s ECBC 2017 or ECSBC 2024, and voluntarily the BIS adoptions of ISO/IEC 22237 and ISO/IEC 30134.', 'nbc', 'bis-ced39', 'pib-explainer', 'bis-std', 'bs-bis'),
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
    'Data centre cost per MW in India: ₹35 to 75 crore to build, plus land (2026)',
    'Data centre cost per MW in India: ₹35 to 75 crore to build on SBI’s April 2026 figures, US$7.4 million on Cushman & Wakefield’s. Land, rents and financing.',
    'Building a data centre in India costs ₹35 crore to ₹75 crore per MW of IT load according to SBI’s April 2026 sector report, which gives ₹35 to 45 crore for large facilities, ₹50 to 55 crore for an air-cooled Tier III build and up to ₹75 crore for AI with immersion cooling or Tier IV. Cushman & Wakefield benchmarks US$7.4 million per MW, about 23% below Malaysia and 26% below Australia, and assumes US$9.0 million per MW for incremental AI capacity in its projections. Anarock prices land separately, at ₹3 crore to ₹60 crore per acre across its size bands, and reports long-tenor debt at about 9.5 to 10.5%.',
    [
        'Cushman & Wakefield: US$7.4 million per MW, about 23% below Malaysia and 26% below Australia; it assumes US$9.0 million per MW for incremental AI capacity.',
        'SBI (April 2026): ₹50 to 55 crore per MW for air-cooled Tier III, up to ₹75 crore for AI with immersion cooling or Tier IV, ₹35 to 45 crore for large facilities.',
        'Anarock: ₹40 to 45 crore per MW (low) to ₹65 to 70 crore per MW (high) for a greenfield Tier III N+1 build.',
        'In Mumbai, wholesale colocation of 5 MW and above rented at about ₹6,000 to 7,500 per kW per month in H1 2025, according to Cushman & Wakefield.',
    ],
    [
        sec('benchmarks', 'Data centre construction cost per MW in India: published benchmarks',
            table(['Publisher', 'Benchmark', 'Scope stated'], [
                ['Cushman & Wakefield, in Invest India’s October 2026 report', 'US$7.4 million per MW; US$9.0 million per MW assumed for incremental AI capacity', 'Construction cost benchmark; AI figure is a projection assumption'],
                ['SBI (April 2026)', '₹50 to 55 crore per MW', 'Standard Tier III, non-AI, air-cooled'],
                ['SBI (April 2026)', 'Up to ₹75 crore per MW', 'AI workloads with immersion cooling, or Tier IV'],
                ['SBI (April 2026)', '₹35 to 45 crore per MW', 'Larger data centres'],
                ['Anarock (2026)', '₹40 to 45 crore per MW to ₹65 to 70 crore per MW (US$4.8 to 8.4 million)', 'Total greenfield Tier III N+1'],
            ], 'ii-cw', 'sbi', 'anarock'),
            p('Anarock prices land separately, per acre. Crisil puts Indian development costs about one fifth below several competing Asia Pacific markets.', 'anarock', 'crisil-dh'),
            p('A cross-check from the sector level: ICRA expected third-party capacity to grow from 1,250 MW in FY2025 to 2,400 to 2,500 MW by FY2028 with an investment pipeline of ₹90,000 crore, which works out (our calculation) to roughly ₹72 to 78 crore per MW added.', 'icra')),
        sec('drivers', 'What drives data centre cost per MW in India',
            ul([
                'Cooling and density: Anarock maps precision air conditioning (CRAC/CRAH, the most common in India) to 3 to 10 kW per rack, in-row cooling to 15 to 25 kW, rear-door heat exchangers to 20 to 40 kW and direct liquid cooling to 40 to 100 kW or more; it puts an Nvidia H100 GPU cluster at 30 to 60 kW per rack.',
                'Tier and cooling: SBI puts an air-cooled Tier III build at ₹50 to 55 crore per MW and AI with immersion cooling or Tier IV at up to ₹75 crore.',
                'Efficiency targets: SBI reports leading Indian operators at PUE 1.4 to 1.5 and MeitY AI cloud tenders since 2024 requiring below 1.35, which pushes design toward more efficient cooling.',
                'Power infrastructure: Anarock puts DG, UPS, HT supply and switchgear at ₹14 to 22 crore per MW, its largest single line. Ask the discom or transmission utility who pays for the dedicated line, bay and substation.',
            ], 'anarock', 'sbi'),
            links('Power cost and connection', [(PAGES[s], s) for s in ['data-centre-grid-connection-india', 'open-access-charges-by-state-india', 'power-for-data-centres-india']])),
        sec('land', 'Data centre land cost in India',
            table(['Facility size', 'Typical land', 'Land price per acre'], [
                ['5 to 10 MW', '2 to 5 acres', '₹35 to 60 crore (Mumbai suburbs); ₹4 to 10 crore (secondary cities)'],
                ['10 to 30 MW', '5 to 15 acres', '₹5 to 20 crore'],
                ['30 to 100 MW', '15 to 50 acres', '₹4 to 12 crore'],
                ['100 to 500 MW', '50 to 200 acres', '₹3 to 10 crore'],
            ], 'anarock'),
            p('Recent transactions sit inside these bands: Zee Business reported in June 2026 that Amazon Data Services bought 10.6 acres from Lodha for ₹125.13 crore, about ₹11.8 crore per acre (our calculation).', 'ads-lodha'),
            links('Land', [(PAGES['data-centre-land-india'], 'data-centre-land-india')])),
        sec('rents', 'Colocation rents in India by city',
            p('Cushman & Wakefield’s H1 2025 report publishes rents in ₹ per kW per month, assuming standard 5 to 7 kVA racks; its H1 2026 report does not include a rent table.', 'cw25', 'cw26'),
            table(['City', 'Under 250 kW', '250 kW to 1 MW', '1 to 5 MW', '5 MW and above'], [
                ['Mumbai', '8,000 to 12,000', '7,000 to 10,000', '6,500 to 8,000', '6,000 to 7,500'],
                ['Chennai', '8,000 to 9,000', '7,500 to 8,500', '7,000 to 8,000', '6,000 to 7,000'],
                ['Hyderabad', '7,500 to 9,500', '7,000 to 8,500', '6,500 to 7,500', '6,000 to 7,000'],
                ['Delhi NCR', '7,500 to 9,500', '7,000 to 8,500', '6,500 to 7,500', '6,000 to 7,000'],
                ['Bengaluru', '7,500 to 9,000', '7,000 to 8,500', '7,000 to 8,000', '6,500 to 7,000'],
                ['Pune', '7,000 to 8,500', '6,500 to 8,000', '6,000 to 7,000', '6,000 to 6,500'],
            ], 'cw25'),
            p('Crisil says Indian rents are 30 to 35% below peer markets and that contract tenors have lengthened to 15 to 20 years from 10 to 12 years.', 'crisil-dh')),
        sec('finance', 'Financing and state incentives',
            p('Data centres in India with at least 5 MW of IT load have had infrastructure status since 11 October 2022, which eases access to long-term credit; Anarock reports debt at about 9.5 to 10.5% for up to 12 years. State policies cut the effective cost further through capital subsidy, stamp duty exemption and electricity duty exemption: Uttar Pradesh’s 2026 policy, for example, exempts 100% of stamp duty on land bought or leased from a government authority and gives a 25% land subsidy on sector rates in the Paschimanchal region, which includes Gautam Buddha Nagar (Noida).', 'hml', 'anarock', 'up26'),
            links('Incentives', [(PAGES[s], s) for s in ['data-centre-incentives-india-central', 'data-centre-policy-india-state-comparison']])),
        help_sec('Cost estimates move most with the power connection and the site. Invariant checks how a site gets power and what the connection depends on, screens seismic, flood, groundwater and airport height risk, and maps the approvals, so the capex model starts from the actual site. Send the state, the MW and the date you need power.'),
    ],
    [
        faq('How much does it cost to build a data center in India per MW?', 'Building a data centre in India costs about US$7.4 million per MW on Cushman & Wakefield’s benchmark. SBI’s April 2026 sector report puts air-cooled Tier III at ₹50 to 55 crore per MW and AI with immersion cooling or Tier IV at up to ₹75 crore. Anarock prices land separately.', 'ii-cw', 'sbi', 'anarock'),
        faq('What is the cost of setting up a data centre in India?', 'SBI’s figures run from ₹35 to 45 crore per MW for large facilities to up to ₹75 crore for AI or Tier IV, and Anarock’s greenfield Tier III N+1 total runs from ₹40 to 45 crore to ₹65 to 70 crore per MW. Anarock prices land separately at ₹3 to 60 crore per acre across its size bands.', 'anarock', 'sbi'),
        faq('How much does it cost to build a small data centre in India?', 'The published benchmarks are per MW and assume purpose-built facilities. Anarock’s smallest land band is 5 to 10 MW on 2 to 5 acres; at Tier III build costs of ₹50 to 55 crore per MW, even a 5 MW facility is a ₹250 crore plus project before land (our calculation).', 'anarock', 'sbi'),
        faq('Is it cheaper to build a data centre in India than in Malaysia?', 'Cushman & Wakefield’s 2026 benchmark of US$7.4 million per MW is about 23% below Malaysia and 26% below Australia for a comparable specification.', 'ii-cw'),
        faq('What is the colocation price per kW in India?', 'In H1 2025 Cushman & Wakefield quoted Mumbai colocation at ₹6,000 to 7,500 per kW per month for 5 MW and above, and ₹8,000 to 12,000 for deals under 250 kW.', 'cw25'),
    ],
    ['data-centre-land-india', 'how-to-set-up-data-centre-india', 'data-centre-investment-india', 'data-centre-incentives-india-central', 'india-vs-singapore-vs-johor-data-centres'],
    minutes=8,
)

# ---------------------------------------------------------------------------
# 5. Site due diligence
# ---------------------------------------------------------------------------
dd = page(
    'data-centre-site-due-diligence-india',
    'Data centre site due diligence in India: the feasibility checklist (2026)',
    'Data centre site due diligence in India: power evidence, title, groundwater (730 of 6,762 units over-exploited), seismic zone, flood history and AAI height limits.',
    'Data centre site due diligence in India starts with power: whether the parcel can get the full load, at the voltage needed, on a date you can underwrite. After power come title and land use, groundwater (under the 2020 CGWA guidelines no new industry other than MSMEs gets a groundwater permit in an over-exploited unit), seismic zone under IS 1893, flood and cyclone history from IMD records, AAI height limits within 20 or 56 km of an airport, and the approvals path. NITI Aayog’s October 2026 framework now asks states to verify power and water capacity before clearing data centre projects, so the state will ask the same questions.',
    [
        'Power evidence is graded by the document: a written connection offer or sanctioned load beats proximity to a substation.',
        'Groundwater: check the site’s assessment unit category; 730 of 6,762 units (10.8%) were over-exploited in the 2025 Dynamic Ground Water Resources Assessment.',
        'Seismic: design to IS 1893 (Part 1):2016; BIS lists the 2025 edition of Part 1 as withdrawn.',
        'Airports: under G.S.R. 751(E) of 2015, AAI height clearance is needed within 20 km of VFR and 56 km of IFR airports; it is valid 8 years and has no fee.',
    ],
    [
        sec('checklist', 'Data centre site due diligence checklist for India',
            table(['Check', 'What to obtain', 'Where it comes from', 'Why it matters'], [
                ['Power', 'Serving utility, voltage, MW, date, and the substation and line it depends on', 'Discom or state transmission utility, in writing', 'Sets the schedule; Navi Mumbai’s data centre allocation is reported close to fully committed'],
                ['Title and encumbrances', 'Clear title chain and encumbrance search', 'State land records and sub-registrar', 'A defect blocks financing and allotment transfers'],
                ['Land use and building norms', 'Permitted use, FAR, ground coverage, height', 'Development authority, allotment terms, state data centre policy', 'Decides how many MW fit; UP 2026 allows FAR 3.0 plus 1.0'],
                ['Groundwater', 'Assessment unit category and whether a NOC is possible', 'CGWB assessment; CGWA or state groundwater authority', 'Over-exploited units bar new industries other than MSMEs'],
                ['Seismic', 'Zone and zone factor', 'IS 1893 (Part 1)', 'Structural cost; zone IV in Delhi, III in Mumbai and Chennai'],
                ['Flood and cyclone', 'Record rainfall, flood events, cyclone tracks near the site', 'IMD records; BMTPC Vulnerability Atlas', 'Plinth level, drainage, generator and fuel siting'],
                ['Coastal zone', 'Distance from the high tide line', 'CRZ Notification 2019 and the approved coastal zone management plan', 'No Development Zones of 50 m or 200 m in CRZ-III'],
                ['Airport height', 'Permissible top elevation', 'AAI NOCAS and colour coded zoning maps', 'Caps building and stack height near Navi Mumbai and Noida'],
                ['Environmental clearance', 'Whether built-up area crosses 20,000 sq m', 'EIA Notification 2006 item 8(a)', 'Adds a state appraisal before construction'],
                ['Policy eligibility', 'Which incentives are open and their conditions', 'Notified state policy text', 'Tamil Nadu’s 2021 policy lapsed and Uttar Pradesh’s was replaced in 2026'],
            ], 'structure', 'up26', 'cgwa', 'is1893', 'imd-chennai', 'bmtpc', 'crz19', 'aai', 'eia', 'tn21'),
            links('Detail', [(PAGES[s], s) for s in ['data-centre-approvals-india', 'data-centre-seismic-flood-risk-india', 'data-centre-water-india', 'data-centre-land-india']])),
        sec('power', 'Power evidence for a data centre site in India',
            p('Power due diligence on an Indian site tests the document behind the MW, not the distance to a substation: a parcel near a 220 kV substation is not a 100 MW site until the utility has said, in writing, how much it can supply and when, and what upgrades that depends on. Crisil estimates that by FY2030 data centre capacity could equal about 60% of Mumbai’s current peak demand and about 80% of Visakhapatnam’s.', 'crisil-dh'),
            links('Power guides', [(PAGES[s], s) for s in ['data-centre-grid-connection-india', 'power-study-data-centre-india']] + [(US_LINKS['power-evidence-data-center-site-verification'], 'power-evidence-data-center-site-verification'), (US_LINKS['data-center-substation-capacity-check'], 'data-center-substation-capacity-check')])),
        sec('water', 'Groundwater rules for a data centre site',
            p('Under the CGWA guidelines of 24 September 2020, any new or expanding industry or infrastructure project that abstracts groundwater needs a NOC unless exempt, and no new industry other than MSMEs gets one in an over-exploited unit. Infrastructure projects are treated as location specific and are not barred outright. Whether a data centre is treated as industry or infrastructure is not settled in the guidelines’ text, so confirm it with the authority for the specific site.', 'cgwa'),
            p('The 2025 national assessment classed 730 of 6,762 units (10.8%) as over-exploited. Citizen Matters, citing CGWB’s assessment, reports that all 10 assessment units in Bengaluru Urban and Rural districts are over-exploited.', 'pib-gw', 'blr-gw')),
        sec('physical', 'Seismic zone, flood, cyclone and coastal zone checks',
            p('The IS 1893 (Part 1):2002 town list puts Delhi in zone IV, Mumbai, Chennai, Pune, Kolkata and Ahmedabad in zone III, and Bengaluru, Hyderabad and Visakhapatnam in zone II. Flood records to check against include 944 mm on 26 July 2005 in Mumbai, a 24-hour record for the city, and 1,178.3 mm in November 2015 at Chennai’s Meenambakkam. Cyclone Hudhud crossed the coast over Visakhapatnam on 12 October 2014 with maximum sustained winds of about 180 km/h and a 1.4 m storm surge.', 'is1893', 'noaa2005', 'imd-chennai', 'imd-hudhud'),
            p('Near the coast, the CRZ Notification 2019 sets a No Development Zone of 200 m from the high tide line in CRZ-IIIB, and of 50 m in CRZ-IIIA (rural areas with more than 2,161 people per sq km) once the coastal zone management plan under the 2019 notification is approved; until then 200 m continues to apply.', 'crz19')),
        sec('airport', 'AAI airport height clearance for data centres',
            p('Under G.S.R. 751(E) of 2015, a data centre needs a height clearance from AAI within 20 km of an airport operating under visual flight rules and 56 km of one under instrument flight rules. The clearance is valid for 8 years and has no fee. Navi Mumbai International Airport began commercial flights on 25 December 2025 and Noida International Airport on 15 June 2026; Noida International Airport issued an advisory in July 2025 that no construction should take place within 20 km of it without an AAI height clearance.', 'aai', 'nmia', 'noida-ops', 'tp-noida')),
        help_sec('Invariant runs this checklist on Indian sites: it checks how the site gets power and the evidence behind the MW, screens seismic zone, flood and cyclone history, groundwater status and airport height limits, and maps the central and state approvals with the authority behind each. Send the coordinates or the state, the MW and the date you need power.'),
    ],
    [
        faq('What does data centre site due diligence cover in India?', 'It is a structured check of whether a parcel can become a data centre on your timeline: power evidence, title and land use, water, seismic, flood and cyclone risk, airport height limits and the approvals path.', 'aai', 'cgwa', 'is1893'),
        faq('What should a data centre site selection checklist in India include?', 'Power (utility, voltage, MW, date, in writing), title and encumbrances, land use and FAR, groundwater unit status, seismic zone, flood and cyclone records, coastal zone limits, airport height clearance, environmental clearance threshold and state policy eligibility.', 'cgwa', 'is1893', 'crz19', 'aai', 'eia'),
        faq('How do I check if groundwater can be used at a site in India?', 'Find the category of the site’s assessment unit in CGWB’s latest assessment. In over-exploited units the 2020 CGWA guidelines bar new industries other than MSMEs from getting a groundwater NOC, while infrastructure projects, being location specific, are not barred.', 'cgwa'),
        faq('Do I need AAI height clearance for a data centre?', 'Yes, if the site is within 20 km of a VFR airport or 56 km of an IFR airport. In cities with a colour coded zoning map, local bodies can approve buildings below the permissible top elevation without referring to AAI. Clearance is valid for 8 years and has no fee.', 'aai'),
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
    'Data centre land in India: acres per MW, land prices and powered land (2026)',
    'Data centre land in India costs ₹3 to 60 crore per acre and about half an acre per MW on Anarock’s 2026 bands. Recent deals, parks, FAR rules and powered land.',
    'Data centre land in India costs from about ₹3 crore per acre for 100 to 500 MW parks to ₹35 to 60 crore per acre for small sites in Mumbai’s suburbs, on Anarock’s 2026 benchmarks. Its size bands imply roughly half an acre per MW of IT load (our calculation). Savills counted more than 120 acres of data centre land transacted in H1 2026, as reported by Communications Today. Land counts as powered land only when the utility has committed MW and a date in writing. State authorities such as YEIDA in Uttar Pradesh and MIDC in Maharashtra have dedicated data centre parks or plans for them.',
    [
        'Anarock size bands: 5 to 10 MW on 2 to 5 acres, up to 100 to 500 MW on 50 to 200 acres (midpoints about 0.4 to 0.5 acre per MW, our calculation).',
        'Recent deals: STT GDC paid ₹282 crore for 3.48 acres with a building in Navi Mumbai (our conversion from 14,093 sq m); Amazon Data Services paid ₹125.13 crore for 10.6 acres from Lodha.',
        'Parks: YEIDA lists a 100-acre Data Centre Park in Sector 28; MIDC will take up data centre parks under Maharashtra’s IT/ITeS Policy 2023 (S&R Associates); Cushman & Wakefield reports a planned 500 MW park near Hoskote in Karnataka.',
        'Building norms help: Uttar Pradesh (2026) and West Bengal (2021) allow FAR 3.0 plus 1.0 purchasable for data centres.',
    ],
    [
        sec('acres-per-mw', 'Land needed per MW for a data centre in India',
            table(['Facility size', 'Typical land (Anarock)', 'Acres per MW at the midpoint (our calculation)'], [
                ['5 to 10 MW', '2 to 5 acres', 'About 0.47'],
                ['10 to 30 MW', '5 to 15 acres', 'About 0.5'],
                ['30 to 100 MW', '15 to 50 acres', 'About 0.5'],
                ['100 to 500 MW', '50 to 200 acres', 'About 0.42'],
            ], 'anarock'),
            p('Land per MW is not fixed. The ratio depends on how many storeys the building has, the FAR the state allows, and how much of the site goes to the substation, generators and fuel. Anarock advises buying 30 to 50% more land than phase 1 needs.', 'anarock'),
            links('Method', [(US_LINKS['data-center-land-acres-per-mw'], 'data-center-land-acres-per-mw')])),
        sec('prices', 'Data centre land prices in India',
            table(['Facility size', 'Land price per acre (Anarock, 2026)'], [
                ['5 to 10 MW', '₹35 to 60 crore in Mumbai suburbs; ₹4 to 10 crore in secondary cities'],
                ['10 to 30 MW', '₹5 to 20 crore'],
                ['30 to 100 MW', '₹4 to 12 crore'],
                ['100 to 500 MW (Navi Mumbai, outer Chennai, Noida parks)', '₹3 to 10 crore'],
            ], 'anarock'),
            table(['Buyer', 'Land', 'Price', 'Date'], [
                ['STT GDC India', '14,093 sq m (about 3.48 acres) with a building, TTC Industrial Area, Navi Mumbai', '₹282 crore', 'Registered 22 May 2026'],
                ['Amazon Data Services', '10.6 acres from Lodha, Thane district', '₹125.13 crore', 'Reported June 2026'],
                ['Amazon Data Services (AWS)', '38.18 acres from Lodha, Palava', 'More than ₹450 crore', '2024'],
                ['Lumina CloudInfra (since acquired by AirTrunk)', '16 acres, Ambattur, Chennai', 'More than ₹500 crore', 'Reported January 2026'],
                ['Brookfield', '30 acres, Ghansoli, Navi Mumbai', '₹600 crore', 'Reported as agreed, August 2021'],
            ], 'stt-land', 'ads-lodha', 'aws-lodha', 'lumina', 'cw26', 'brookfield'),
            p('Savills counted more than 120 acres of data centre land transacted in H1 2026, as reported by Communications Today.', 'savills')),
        sec('parks', 'Data centre parks in India',
            ul([
                'Uttar Pradesh: YEIDA lists a 100-acre Data Centre Park in Sector 28. UP’s 2026 policy defines a Data Center Park as a data centre with at least 40 MW of total load capacity.',
                'Maharashtra: according to S&R Associates, the IT/ITeS Policy 2023 says MIDC will take up data centre parks with all prior clearances for land allotted to data centres.',
                'Karnataka: Cushman & Wakefield reports a planned 500 MW data centre park near Hoskote, with the government committing solar power and treated water, and 500 MW planned at Mysuru and Mangaluru.',
                'Andhra Pradesh: ETV Bharat reported in October 2025 that the state offered Google’s subsidiary Raiden Infotech a 25% discount on 480 acres across Rambilli, Adavivaram and Mudasarlova, and Tarluvada.',
                'Private parks: Lodha has earmarked 400 acres at Palava for a data centre park, as reported by Business Standard in April 2026.',
            ], 'yeida', 'up26', 'snr-mh', 'cw26', 'etv-google', 'lodha')),
        sec('norms', 'FAR, ground coverage and stamp duty rules for data centres',
            p('Uttar Pradesh’s 2026 policy gives data centres base FAR 3.0 free plus 1.0 chargeable, keeps basement parking, storage and DG space out of FAR, extends service FAR to 40% for DG sets, allows ground coverage of up to 60% or as per byelaws, whichever is higher, and places no restriction on floor-to-ceiling height subject to overall height rules. It exempts 100% of stamp duty on land bought or leased from a government authority and gives a land subsidy of 25% of sector rates in the Madhyanchal and Paschimanchal regions (Paschimanchal includes Gautam Buddha Nagar) and 50% in Bundelkhand and Purvanchal.', 'up26'),
            p('West Bengal’s 2021 policy also allows FAR 3.0 plus 1.0 purchasable and 60% ground coverage.', 'wb21'),
            links('Policy', [(PAGES[s], s) for s in ['uttar-pradesh-data-centre-policy', 'west-bengal-data-centre-policy', 'data-centre-policy-india-state-comparison']])),
        sec('powered-land', 'What powered land means in India',
            p('In India, powered land means land with deliverable electricity for the load, documented by the utility, not land near a substation. In Navi Mumbai, Structure Research reports that the roughly 6 GW MSEDCL allocated to data centres is close to fully committed and that new builds are moving to Panvel, Taloja and Rasayani, where separate substations can be commissioned.', 'structure'),
            links('Power evidence', [(PAGES[s], s) for s in ['data-centre-grid-connection-india', 'power-for-data-centres-india']] + [(US_LINKS['power-evidence-data-center-site-verification'], 'power-evidence-data-center-site-verification')])),
        help_sec('Invariant does not list Indian land. For a parcel you are looking at, it checks how the site gets power and the evidence behind the MW, screens seismic, flood, groundwater and airport height risk, and maps the approvals. Send the coordinates or the state, the MW and the date you need power.'),
    ],
    [
        faq('How much land is needed for a 1 MW data centre?', 'Anarock’s size bands work out to about 0.4 to 0.5 acre per MW at their midpoints (our calculation), but land per MW is not fixed. The bands start at 2 to 5 acres for 5 to 10 MW. A small facility’s land need depends mostly on how many storeys the state’s FAR allows.', 'anarock'),
        faq('What does data center land cost in India?', 'Data centre land in India costs about ₹3 to 10 crore per acre for 100 to 500 MW parks, rising to ₹35 to 60 crore per acre for small sites in Mumbai’s suburbs (Anarock, 2026).', 'anarock'),
        faq('Where are the data centre parks in India?', 'India’s data centre parks include YEIDA’s 100-acre Data Centre Park in Sector 28 (Uttar Pradesh), MIDC data centre parks in Maharashtra, and Karnataka’s planned 500 MW park near Hoskote. Lodha has earmarked 400 acres at Palava for a data centre park.', 'yeida', 'snr-mh', 'cw26', 'lodha'),
        faq('What does data centre land cost per acre near Mumbai?', 'Anarock prices small sites of 5 to 10 MW in Mumbai’s suburbs at ₹35 to 60 crore per acre. Zee Business reported in June 2026 that Amazon Data Services paid ₹125.13 crore for 10.6 acres from Lodha in Thane district, about ₹11.8 crore per acre (our calculation).', 'anarock', 'ads-lodha'),
        faq('What FAR do data centres get in India?', 'Uttar Pradesh’s 2026 policy and West Bengal’s 2021 policy both allow FAR 3.0 plus 1.0 purchasable and up to 60% ground coverage for data centres; both keep basement parking, storage and DG space out of FAR.', 'up26', 'wb21'),
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
    'Seismic zones of Indian data centre cities under IS 1893 (Delhi IV; Mumbai and Chennai III), the withdrawn Zone VI map, record floods, cyclones and CRZ limits.',
    'About 71% of India’s operational data centre capacity sits in seismic zone III, in Mumbai, Chennai, Pune and Kolkata, on Cushman & Wakefield’s H1 2026 split (our calculation) and the IS 1893 (Part 1):2002 town list. Delhi is in zone IV; Bengaluru, Hyderabad and Visakhapatnam are in zone II. A 2025 edition of the code added a Zone VI, but BIS now lists IS 1893 (Part 1):2025 as withdrawn and the 2016 edition as published. Flood risk is the more frequent problem: 944 mm of rain fell on Mumbai on 26 July 2005 and Chennai’s Meenambakkam recorded 1,178.3 mm in November 2015. Cyclone Hudhud crossed Visakhapatnam in 2014 with maximum sustained winds of about 180 km/h.',
    [
        'Zone factors in the IS 1893 (Part 1):2002 town list: 0.10 (II), 0.16 (III), 0.24 (IV), 0.36 (V).',
        'Design to IS 1893 (Part 1):2016; BIS lists the 2025 edition of Part 1, which added Zone VI, as withdrawn.',
        'Record rainfall: 944 mm in Mumbai on 26 July 2005 and 1,178.3 mm at Chennai’s Meenambakkam in November 2015; cyclones Hudhud (Visakhapatnam, 2014) and Michaung (Chennai, 2023) mark the east coast exposure.',
        'Near the coast, the CRZ Notification 2019 No Development Zone in CRZ-III is 50 m or 200 m from the high tide line.',
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
            p('City zones and zone factors are from Annex E of IS 1893 (Part 1):2002. Noida and the YEIDA sectors are not listed by name; confirm the zone for a specific site against the edition in force.', 'is1893')),
        sec('zone-vi', 'The 2025 seismic map and Zone VI',
            p('EastMojo reported in November 2025 that the revised code, IS 1893:2025, added a new highest-risk Zone VI and placed the entire Northeast in it. BIS’s programme of work for its earthquake engineering committee now lists IS 1893 (Part 1):2025 among withdrawn or superseded standards and IS 1893 (Part 1):2016 among published standards.', 'zone6', 'bis-ced39'),
            p('For a data centre project that means designing to the 2016 edition today and watching for a re-issued revision, which could change the zone for sites near zone boundaries.')),
        sec('floods', 'Flood and rainfall records in Indian data centre cities',
            table(['City', 'Event', 'Recorded figure'], [
                ['Mumbai', '26 July 2005', '944 mm, breaking the city’s 24-hour rainfall record'],
                ['Chennai', 'November 2015', '1,178.3 mm in the month at Meenambakkam, the all-time November record'],
                ['Chennai', 'Cyclone Michaung, December 2023', '415 mm at Meenambakkam from 3 December to 1.30 pm on 4 December, per IMD figures reported by The News Minute'],
                ['Hyderabad', '13 October 2020', 'More than 300 mm within 24 hours in many parts of Hyderabad and Cyberabad'],
            ], 'noaa2005', 'imd-chennai', 'michaung', 'imd-hyd'),
            p('The BMTPC Vulnerability Atlas of India (third edition, 2019) maps flood, cyclone, wind and earthquake hazard by state and district and is a reasonable first screen before site-specific drainage and plinth studies.', 'bmtpc')),
        sec('cyclones', 'Cyclone risk on India’s east coast',
            p('Very severe cyclonic storm Hudhud crossed the coast over Visakhapatnam between 12:00 and 13:00 IST on 12 October 2014, with maximum sustained winds of about 180 km/h, an estimated central pressure of 950 hPa and a storm surge of 1.4 m above the astronomical tide at the Visakhapatnam tide gauge. With more than 4 GW announced in Visakhapatnam, according to Invest India and Cushman & Wakefield, wind loads, surge level and access after landfall belong in the design basis there.', 'imd-hudhud', 'ii-cw'),
            links('Visakhapatnam and Chennai', [(PAGES[s], s) for s in ['data-centres-in-visakhapatnam', 'data-centres-in-chennai']])),
        sec('heat-coast', 'Heat and coastal zone limits',
            p('Chennai’s Meenambakkam station records a mean daily maximum of 37.3°C in May and 37.2°C in June (1991 to 2020 normals), which sets the cooling design point for the city.', 'imd-chennai'),
            p('The CRZ Notification 2019 sets a No Development Zone of 200 m from the high tide line in CRZ-IIIB and of 50 m in CRZ-IIIA (rural areas with more than 2,161 people per sq km), the 50 m applying only once the coastal zone management plan under the 2019 notification is approved. Coastal sites near Mumbai, Chennai and Visakhapatnam need the CRZ map checked before layout.', 'crz19')),
        help_sec('Invariant screens Indian sites for seismic zone, flood and cyclone history, groundwater status and airport height limits, checks how the site gets power, and maps the approvals. Send the coordinates or the state, the MW and the date you need power.'),
    ],
    [
        faq('Which seismic zone is Mumbai in?', 'Mumbai is in seismic zone III, with a zone factor of 0.16, under the IS 1893 (Part 1):2002 town list.', 'is1893'),
        faq('Is Chennai at risk of flooding for data centres?', 'Yes. Chennai’s Meenambakkam station recorded 1,178.3 mm in November 2015, the all-time November record, and Cyclone Michaung brought heavy rain in December 2023. Sites need plinth, drainage and generator siting designed for it.', 'imd-chennai', 'michaung'),
        faq('Was Zone VI added to India’s seismic map?', 'The 2025 edition of IS 1893 added a Zone VI, but BIS now lists it as withdrawn. EastMojo reported the new zone in November 2025; BIS’s programme of work for its earthquake engineering committee lists IS 1893 (Part 1):2025 as withdrawn and IS 1893 (Part 1):2016 as published.', 'zone6', 'bis-ced39'),
        faq('Which Indian data center cities are in the lowest seismic zone?', 'Bengaluru, Hyderabad and Visakhapatnam are in zone II, the lowest zone in the IS 1893 (Part 1):2002 town list.', 'is1893'),
        faq('Is Visakhapatnam at risk from cyclones?', 'Yes. Cyclone Hudhud crossed the coast over Visakhapatnam in October 2014 with maximum sustained winds of about 180 km/h and a storm surge of 1.4 m above the astronomical tide.', 'imd-hudhud'),
    ],
    ['data-centre-site-due-diligence-india', 'find-data-centre-site-india', 'data-centres-in-chennai', 'data-centres-in-visakhapatnam'],
    minutes=7,
)

# ---------------------------------------------------------------------------
# 8. Water
# ---------------------------------------------------------------------------
water = page(
    'data-centre-water-india',
    'Water for data centres in India: groundwater NOC, water stress and state rules',
    'Data centres in India need a CGWA or state NOC to draw groundwater. Anarock puts use at about 25.5 million litres per MW a year. Water-stressed cities, state rules.',
    'A data centre in India that draws groundwater needs a NOC from the Central Ground Water Authority or the state groundwater authority under the guidelines of 24 September 2020, and no new industry other than an MSME gets one in an over-exploited unit. Whether a data centre counts as industry or as infrastructure, which is not barred in over-exploited units, has to be confirmed for each site. Anarock puts water use for cooling-tower data centres at about 25.5 million litres per MW per year. SBI names Bengaluru, Chennai and Gurugram as water-stressed data centre metros, and Uttar Pradesh’s 2026 policy directs data centres to adopt closed-loop systems and treated wastewater reuse.',
    [
        'CGWA 2020 guidelines: NOC needed for groundwater abstraction by industry and infrastructure, with telemetry flow meters, rooftop rainwater harvesting and, above 100 m3 a day for industries, annual water audits.',
        'Over-exploited units: no NOC for new industries except MSMEs under the CGWA guidelines; 730 of 6,762 units (10.8%) were over-exploited in the 2025 Dynamic Ground Water Resources Assessment.',
        'Water use: about 25.5 million litres per MW per year for cooling-tower designs (Anarock).',
        'Karnataka’s 2026-31 policy, as reported by The News Minute, reimburses treated water costs; Uttar Pradesh’s 2026 policy requires a water availability assessment before land allocation in state agency areas.',
    ],
    [
        sec('cgwa', 'Groundwater NOC rules for data centres in India',
            p('The CGWA guidelines (S.O. 3289(E), 24 September 2020) require all new and existing industries, industries seeking expansion, infrastructure projects and mining projects that abstract groundwater to seek a NOC from CGWA or the state or UT groundwater authority, unless exempt. Exemptions cover domestic users, rural drinking water, the armed forces, agriculture and micro and small enterprises drawing less than 10 m3 a day.', 'cgwa'),
            table(['Rule', 'What the guidelines say'], [
                ['Over-exploited units', 'No NOC for any new industry except MSMEs; expansion that increases abstraction is not permitted'],
                ['Infrastructure projects', 'Location specific; not barred in over-exploited units, but groundwater for construction only if no treated sewage is available within 10 km'],
                ['Sewage treatment', 'An STP is mandatory for new projects where groundwater need exceeds 20 m3 a day'],
                ['Metering', 'Digital water flow meter with telemetry, mandatory for all NOC holders'],
                ['Piezometers', 'One for 11 to 50 m3 a day; one with a data logger for 51 to 500; two (one with telemetry) above 500'],
                ['Environmental compensation', '₹20 to ₹200 per m3 for industrial units, depending on the assessment unit category and volume'],
            ], 'cgwa'),
            p('Whether a data centre is an industry or an infrastructure project under these guidelines is not settled in the text we reviewed. In an over-exploited unit it decides whether a NOC is possible at all, so put the question to the authority before committing to the site.', 'cgwa')),
        sec('stress', 'Water stress in Indian data centre cities',
            p('The 2025 Dynamic Ground Water Resources Assessment found 730 of 6,762 assessment units (10.8%) over-exploited. Citizen Matters, citing CGWB’s assessment, reports that all 10 assessment units in Bengaluru Urban and Rural districts are over-exploited, and Newslaundry reported in April 2026 that most of Bengaluru’s data centres sit in its water-stressed areas. Check the category of the unit for a specific site.', 'pib-gw', 'blr-gw', 'newslaundry'),
            p('SBI names Bengaluru, Chennai and Gurugram as water-stressed data centre metros and notes that newer rules require water management plans.', 'sbi')),
        sec('use', 'Water use by data centres in India',
            p('Anarock puts water use at about 25.5 million litres per MW per year for Indian data centres with cooling towers.', 'anarock'),
            p('The design choice drives the number. The government’s September 2026 explainer says AI infrastructure is driving adoption of direct-to-chip liquid cooling, adiabatic cooling and immersion cooling, and that closed-loop liquid cooling systems are emerging as resource-efficient solutions.', 'pib-explainer')),
        sec('policy', 'State water rules and incentives for data centres',
            ul([
                'Uttar Pradesh (2026): in state agency areas, water availability must be assessed before land is allocated, prior permission or a NOC is needed before using water, and data centres shall adopt water-efficient cooling, closed-loop systems and treated wastewater reuse.',
                'Karnataka (2026 to 2031): reimburses 100% of treated water charges up to ₹8 lakh a year for 5 years and offers a water usage effectiveness incentive of up to ₹30 lakh a year for 2 years at a WUE of 0.7 to 1.3 litres per kWh, as reported by The News Minute.',
                'NITI Aayog (October 2026): asks states to verify water capacity before clearing data centre projects.',
            ], 'up26', 'ka26', 'theprint-niti'),
            p('Operators are moving the same way: Digital Edge announced in February 2026 an 83 MW solar PPA and liquid cooling using 10 million litres of recycled water a day at its BOM campus in Navi Mumbai.', 'de-water')),
        help_sec('Invariant checks groundwater unit status and the water path for an Indian site along with how it gets power, seismic, flood and airport height risk, and maps the approvals. Send the coordinates or the state, the MW and the date you need power.'),
    ],
    [
        faq('Do data centres in India need a CGWA NOC?', 'Yes, if they draw groundwater. The CGWA guidelines of 24 September 2020 require a NOC from CGWA or the state groundwater authority for industries and infrastructure projects that abstract groundwater, unless exempt.', 'cgwa'),
        faq('Can a data centre use groundwater in an over-exploited area?', 'Possibly not. The guidelines bar new industries other than MSMEs from getting a NOC in over-exploited units, while infrastructure projects, being location specific, are not barred. Confirm with the authority how a data centre is treated for the specific site.', 'cgwa'),
        faq('How much water does a data center use in India?', 'A data centre in India with cooling towers uses about 25.5 million litres per MW per year, according to Anarock.', 'anarock'),
        faq('Which Indian cities have water stress for data centres?', 'SBI names Bengaluru, Chennai and Gurugram as water-stressed data centre metros. Citizen Matters, citing CGWB, reports that all 10 assessment units in Bengaluru Urban and Rural districts are over-exploited.', 'sbi', 'blr-gw'),
        faq('Do Indian states give incentives for treated water in data centres?', 'Karnataka’s 2026 policy reimburses treated water charges up to ₹8 lakh a year for 5 years, as reported by The News Minute; Uttar Pradesh’s 2026 policy directs data centres to adopt treated wastewater reuse and requires a water assessment before land allocation in state agency areas.', 'ka26', 'up26'),
    ],
    ['data-centre-site-due-diligence-india', 'data-centres-in-bengaluru', 'data-centre-approvals-india', 'karnataka-data-centre-policy'],
    minutes=7,
)

ARTICLES = [find_site, approvals, how_to, cost, dd, land, risk, water]
