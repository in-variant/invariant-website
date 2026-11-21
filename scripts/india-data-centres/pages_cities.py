"""City and market pages for the India cluster: one page per data centre market, sub-markets as H2s.

The pillar (data-centres-in-india) owns national capacity questions. Each page here carries only
its own city's numbers. Facts come from the research notes in the session scratchpad; every
figure carries a source id below.
"""
from common import *

L = {}


def S(id, title, url, publisher):
    L[id] = src(id, title, url, publisher)


def pick(*ids):
    return [L[i] for i in ids]


# Market reports
S('cw26', 'India Data Centre Market Overview H1 2026', 'https://content.cushmanwakefield.com/api/public/content/6b60db63971344f3a3f5392374471667?v=90a58a0b', 'Cushman & Wakefield')
S('cw25', 'India Data Center Market Overview H1 2025', 'https://assets.cushmanwakefield.com/-/media/cw/apac/india/insights/indiadatacentreupdateh12025v4.pdf?rev=4a5dd53b2388421ea3935afb03302def', 'Cushman & Wakefield')
S('ii', "India's Data Centre Growth Story (October 2026)", 'https://static.investindia.gov.in/s3fs-public/2026-10/latest-news-India-Data-Centre-Growth-Story.pdf', 'Invest India and Cushman & Wakefield')
S('savills', "India's data centre capacity additions jump 59% in H1 2026 (Savills India)", 'https://www.communicationstoday.co.in/indias-data-centre-capacity-additions-jump-59-in-h1-2026/', 'Communications Today')
S('anarock', 'Data Centre: The Blueprint of the Digital Fortress in India (2026)', 'https://websitemedia.anarock.com/media/Data_centre_The_blueprint_of_the_digital_fortress_in_India_2026_b36407b0b2.pdf', 'Anarock')
S('crisil', "Crisil Ratings: India's data centre capacity set for 5x surge by 2030", 'https://www.equitybulls.com/news/378461/crisil-ratings-india-s-data-centre-capacity-set-for-5x-surge-by-2030', 'EquityBulls (Crisil Ratings release)')
S('sbi', 'Data Centres in India: sector report (April 2026)', 'https://sbi.bank.in/documents/57189647/58231607/Sector+Report+DataCentre.pdf/f1919592-ee66-b50b-ea20-75fbb27c9bb5?t=1779885206866', 'SBI CHAKRA Centre of Excellence')
S('jll', 'India data centers: 2026 mid-year report', 'https://www.jll.com/en-in/insights/market-dynamics/india-data-centers', 'JLL')
S('structure', 'Mumbai and Pune data centre report 2026', 'https://www.structureresearch.net/product/mumbai-pune-dcai-report-2026-data-centre-colocation-hyperscale-cloud-ai-interconnection/', 'Structure Research')
S('kf-hyd', 'Hyderabad emerges as India’s fast-growing hyperscale data centre hub (Knight Frank)', 'https://telanganatoday.com/hyderabad-emerges-as-indias-fast-growing-hyperscale-data-centre-hub', 'Telangana Today')
S('tele-cable', 'Growing gap: India’s subsea cable expansion outpaces its supporting infrastructure', 'https://tele.net.in/telefocus/growing-gap-indias-subsea-cable-expansion-outpaces-its-supporting-infrastructure-12490632', 'Tele.net')
S('pib-cap', 'Data centre capacity and power demand: reply in the Rajya Sabha', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2298108', 'Press Information Bureau (MeitY)')

# State policy
S('mh-it', 'Key highlights of Maharashtra IT/ITES Policy 2023: data centers', 'https://corporate.cyrilamarchandblogs.com/2023/07/key-highlights-of-maharashtra-it-ites-policy-2023-it-ites-units-iitts-and-data-centers/', 'Cyril Amarchand Mangaldas')
S('mh-green', 'Maharashtra expands green data centre park policy', 'https://powerpeakdigest.com/maharashtra-green-data-center-policy-expansion/', 'Power Peak Digest')
S('tn-policy', 'Tamil Nadu Data Centre Policy 2021', 'https://www.nsws.gov.in/s3fs/2021-12/Data%20Centre%20Policy%202021.pdf', 'Government of Tamil Nadu (via National Single Window System)')
S('tg-5gw', 'Hyderabad emerging as major AI data centre hub: Telangana official', 'https://www.aninews.in/news/business/hyderabad-emerging-as-major-ai-data-centre-hub-with-usd-10-20-billion-investments-in-pipeline-telangana-govt-official20260528202824/', 'ANI')
S('tg-dc', 'Telangana targets 5 GW data centre capacity by 2029 as Microsoft opens Hyderabad region', 'https://www.deccanchronicle.com/amp/southern-states/telangana/telangana-targets-5gw-data-centre-capacity-by-2029-as-microsoft-opens-hyderabad-region-1990282', 'Deccan Chronicle')
S('amazon-tg', 'Telangana secures Amazon’s biggest India data centre project', 'https://theprint.in/india/governance/telangana-secures-amazons-biggest-india-data-centre-project-months-after-google-announced-ai-hub-in-ap/2987492/', 'ThePrint')
S('up-go', 'Uttar Pradesh Data Centre Policy 2026 (G.O. 536/78-2-2026, 9 July 2026)', 'https://uplc.up.gov.in/downloadmedia/siteContent/202608230935077722DC-policy-2026-English_230826.pdf', 'Government of Uttar Pradesh')
S('up-page', 'Uttar Pradesh Data Centre Policy 2026', 'https://invest.up.gov.in/uttar-pradesh-data-centre-policy-2026/', 'Invest UP')
S('yeida', 'Industrial property and Data Centre Park, Sector 28', 'https://www.yamunaexpresswayauthority.com/property/industrial', 'Yamuna Expressway Industrial Development Authority')
S('ka-2026', 'Karnataka’s new data centre policy puts water, energy in focus', 'https://www.thenewsminute.com/karnataka/karnatakas-new-data-centre-policy-puts-water-energy-in-focus-what-does-it-say', 'The News Minute')
S('ap-policy', 'Andhra Pradesh Data Center Policy (4.0) 2024-29', 'https://teamleaseregtech.com/updates/article/38147/andhra-pradesh-data-center-policy-40-2024-29', 'TeamLease RegTech')
S('ap-aug26', 'Andhra Pradesh clears AI data centre projects under Policy 4.0', 'https://www.medianama.com/2026/08/223-andhra-pradesh-ai-data-centres/', 'MediaNama')
S('ap-raiden', 'Andhra Pradesh offers Rs 22,000 crore incentives to Google’s Raiden Infotech for data centres', 'https://www.etvbharat.com/en/technology/andhra-pradesh-offers-rs-22000-crore-incentives-to-googles-raiden-infotech-for-data-centres-enn25101501804', 'ETV Bharat')
S('gj-cam', 'Gujarat Data Center Policy 2026-2029: a push for large-scale data center infrastructure', 'https://corporate.cyrilamarchandblogs.com/2026/07/gujarat-data-center-policy-2026-2029-a-push-for-large-scale-data-center-infrastructure/', 'Cyril Amarchand Mangaldas')
S('gj-dd', 'Gujarat launches Data Centre Policy 2026-29', 'https://ddindia.co.in/2026/07/gujarat-launches-data-centre-policy-2026-29-to-attract-investment-build-digital-infrastructure-hub/', 'DD India')
S('gift-emb', 'Union Budget 2023-24: govt to facilitate data embassies in GIFT City', 'https://inc42.com/buzz/union-budget-2023-24-govt-to-facilitate-setting-up-data-embassies-in-ifsc-gift-city/', 'Inc42')
S('wb-policy', 'West Bengal Data Centre Policy 2021 (Notification 490-Estt/ITE-18011/2/2021)', 'https://wbxpress.com/west-bengal-data-centre-policy-2021/', 'Government of West Bengal (via wbxpress)')
S('wb-new', 'Bengal govt working on land, data centre policies', 'https://www.business-standard.com/politics/bengal-govt-working-on-land-data-centre-policies-bengal-bjp-president-126052501625_1.html', 'Business Standard')
S('od-policy', 'Odisha State Data Centre Policy 2022', 'https://investodisha.gov.in/datacentre-policy', 'Invest Odisha')

# Operators and projects
S('yotta-dc', 'Data centers in India', 'https://yotta.com/data-center-in-india/', 'Yotta')
S('adaniconnex', 'Data centers', 'https://www.adaniconnex.com/data-centers', 'AdaniConneX')
S('coreweave', 'CoreWeave enters India with AdaniConneX', 'https://www.coreweave.com/news/coreweave-enters-india-expanding-ai-cloud-platform-with-adaniconnex', 'CoreWeave')
S('digitaledge', 'Navi Mumbai BOM2 topping out and BOM3 construction', 'https://www.digitaledgedc.com/resources/newsroom/digital-edge-navi-mumbai-bom2-topping-out-bom3-construction/', 'Digital Edge')
S('equinix-mb3', 'Equinix launches purpose-built IBX data center in Mumbai', 'https://newsroom.equinix.com/2026-04-08-Equinix-Launches-Purpose-Built-IBX-Data-Center-in-Mumbai-to-Accelerate-Indias-AI-and-Cloud-Growth', 'Equinix')
S('equinix-cn1', 'Equinix opens first AI-ready data center in Chennai', 'https://newsroom.equinix.com/2025-09-19-Equinix-Opens-First-AI-Ready-Data-Center-in-Chennai,1', 'Equinix')
S('stt-palava', 'STT GDC India breaks ground for data center campus in Palava', 'https://w.media/stt-gdc-india-breaks-ground-for-data-center-campus-in-palava/', 'W.Media')
S('stt-nm', 'STT GDC India buys Navi Mumbai land for Rs 282 crore', 'https://www.communicationstoday.co.in/stt-gdc-india-buys-navi-mumbai-land-for-%E2%82%B9282-crore-data-centre-project/', 'Communications Today')
S('aws-lodha', 'AWS acquires 38 acres near Mumbai for potential data center build', 'https://datacenterdynamics.com/en/news/aws-acquires-38-acres-near-mumbai-india-for-potential-data-center-build', 'DCD')
S('nxtra-ec', 'Environmental clearance, Nxtra data centre, TTC Industrial Area, Mahape', 'https://assets.airtel.in/nxtra/pdf/EC_Environmental_Clearance_Certificate_Nxtra%20Mahape_DC-02_25.11.25.pdf', 'SEIAA Maharashtra')
S('capitaland-chn', 'CapitaLand to launch 53 MW data center in Chennai', 'https://www.datacenterdynamics.com/en/news/capitaland-to-launch-53mw-data-center-in-chennai-india-before-the-end-of-the-year/', 'DCD')
S('lumina-chn', 'Blackstone plans 216 MW data centre hub in Chennai', 'https://india.entrepreneur.com/news-and-trends/blackstone-plans-216-mw-data-centre-hub-in-chennai/502233', 'Entrepreneur India')
S('dcx', 'Reliance, Brookfield, Digital Realty JV to invest $11 billion in Andhra Pradesh for 1 GW data centre', 'https://www.businesstoday.in/latest/corporate/story/reliance-brookfield-digital-realty-jv-to-invest-11-billion-in-andhra-pradesh-to-build-1-gw-data-centre-503905-2025-11-27', 'Business Today')
S('ctrls-hyd', 'CtrlS unveils plans for new data center park on 40-acre land parcel near Hyderabad', 'https://www.ctrls.com/press-release-ctrls-unveils-plans-for-new-datacenter-park-on-a-40-acre-land-parcel-near-hyderabad/', 'CtrlS')
S('aws-hyd', 'AWS launches second infrastructure region in India', 'https://press.aboutamazon.com/in/2022/11/aws-launches-second-infrastructure-region-in-india', 'Amazon')
S('stt-chn', 'STT GDC India expands Chennai footprint', 'https://analyticsindiamag.com/ai-news/stt-gdc-india-expands-chennai-footprint-as-part-of-4200-cr-commitment', 'Analytics India Magazine')
S('sify-site', 'Sify Infinit Spaces data centres', 'https://sifyinfinitspaces.com/', 'Sify Infinit Spaces')
S('ms-hyd', 'Microsoft establishes India South Central region as a strategic hub', 'https://news.microsoft.com/source/asia/2026/09/21/ai-ambition-into-action-microsoft-brings-ai-ready-capabilities-across-its-india-cloud-infrastructure-establishes-india-south-central-region-as-a-strategic-hub-for-asia-and-global-south/', 'Microsoft')
S('amazon-48', 'Amazon’s investment in India', 'https://www.aboutamazon.com/news/company-news/amazon-india-investment', 'Amazon')
S('amgreen', 'Uttar Pradesh signs MoU with AM Green Group for 1 GW AI data centre', 'https://www.communicationstoday.co.in/uttar-pradesh-signs-mou-with-am-green-group-for-1-gw-ai-data-centre/', 'Communications Today')
S('newslaundry', 'In Bengaluru’s water-stressed areas sit most of its data centres', 'https://www.newslaundry.com/2026/04/16/in-bengalurus-water-stressed-areas-sit-most-of-its-data-centres', 'Newslaundry')
S('blr-gw', 'Why Bengaluru needs effective groundwater monitoring', 'https://citizenmatters.in/making-the-invisible-visible-why-bengaluru-needs-effective-groundwater-monitoring/', 'Citizen Matters')
S('google-blog', 'Our first AI hub in India, powered by a $15 billion investment', 'https://blog.google/intl/en-in/company-news/our-first-ai-hub-in-india-powered-by-a-15-billion-investment/', 'Google')
S('adani-gb', 'Google breaks ground on India AI hub', 'https://www.adani.com/newsroom/media-releases/google-breaks-ground-on-india-ai-hub-launching-a-national-industrial-ecosystem', 'Adani Group')
S('colt-vizag', 'Andhra Pradesh approves Rs 1.77 lakh crore investment by RMZ and Colt for 1.25 GW campus', 'https://tradebrains.in/money/andhra-pradesh-approves-1-77-lakh-crore-investment-by-rmz-group-and-colt-data-centre-check-the-location-of-1-25-gw-digital-mega-campus/', 'Trade Brains')
S('airtrunk-ap', 'Blackstone-backed AirTrunk advances $11B India data center development plans', 'https://irei.com/news/blackstone-backed-airtrunk-advances-11b-india-data-center-development-plans', 'IREI')
S('sify-vizag', 'Sify builds 50 MW AI data center and open cable landing station in Vizag', 'https://www.submarinenetworks.com/en/nv/news/sify-builds-50mw-ai-data-center-and-open-cable-landing-station-in-vizag', 'Submarine Networks')
S('aic', 'Google unveils America-India Connect initiative', 'https://www.submarinenetworks.com/en/nv/insights/google-unveils-america-india-connect-initiative', 'Submarine Networks')
S('reliance-ai', 'Reliance unveils $110B AI investment plan', 'https://techcrunch.com/2026/02/19/reliance-unveils-110b-ai-investment-plan-as-india-ramps-up-tech-ambitions/', 'TechCrunch')
S('meta-jam', 'Meta signs first AI data center deal in India with Reliance', 'https://techcrunch.com/2026/06/10/meta-signs-first-ai-data-center-deal-in-india-with-reliance/', 'TechCrunch')
S('gc-jam', 'Google Cloud and Reliance Industries to set up dedicated AI cloud region in Jamnagar', 'https://yourstory.com/2025/08/google-cloud-reliance-industries-dedicated-ai-cloud-region-jamnagar-plant', 'YourStory')
S('dholera', 'Gujarat to set up 250 MW green AI-ready data centre at Dholera SIR', 'https://egov.eletsonline.com/2026/02/gujarat-to-set-up-250-mw-green-ai-ready-data-centre-at-dholera-sir-with-%E2%82%B925000-crore-investment/', 'Elets eGov')
S('ntt-kol', 'NTT Global Data Centers inaugurates Kolkata data center', 'https://w.media/ntt-global-data-centers-inaugurates-kolkata-dc/', 'W.Media')

# Power
S('merc-sop', 'MERC Electricity Supply Code and Standards of Performance Regulations 2021', 'https://www.mahadiscom.in/consumer/wp-content/uploads/2025/08/MERC-SOP-including-PQ-Reg-2021.pdf', 'Maharashtra Electricity Regulatory Commission (via MSEDCL)')
S('merc-myt', 'MERC MYT Order for MSEDCL, Case 217 of 2024 (28 March 2025)', 'https://www.mahadiscom.in/consumer/wp-content/uploads/2025/08/MSEDCL-MYT-Order_Case_no_217-of-2024.pdf', 'Maharashtra Electricity Regulatory Commission')
S('mh-dl', 'Maharashtra allows data centres to generate green power', 'https://www.constructionworld.in/energy-infrastructure/power-and-renewable-energy/maharashtra-allows-data-centres-to-generate-green-power/79992', 'Construction World')
S('tn-supply', 'New service connection: categories of supply (Tamil Nadu Electricity Supply Code)', 'https://app1.tangedco.org/nsconline/tcateg.xhtml', 'TNPDCL')
S('tnerc', 'TNERC Suo-motu Tariff Order 6 of 2025 (30 June 2025)', 'https://www.tnpdcl.org/static/tnpdcl/assets/files/tariff/2025/TO062025/TO62025.pdf', 'Tamil Nadu Electricity Regulatory Commission')
S('tg-gtcs', 'GTCS amendment: voltage of supply by contracted demand (19 October 2022)', 'https://tgerc.telangana.gov.in/file_upload/uploads/Clarifications/GTCS%20Amendment_19102022.pdf', 'Telangana Electricity Regulatory Commission')
S('tg-rst', 'Retail supply tariff order FY 2024-25 (28 October 2024)', 'https://tgerc.telangana.gov.in/file_upload/uploads/Tariff%20Orders/Current%20Year%20Orders/2024/FY24-25%20RST%20Order.pdf', 'Telangana Electricity Regulatory Commission')
S('tg-hans', 'No power tariff hike for 2026-27: TGERC', 'https://www.thehansindia.com/telangana/no-power-tariff-hike-for-202627-tgerc-1061820', 'The Hans India')
S('up-code', 'UP Electricity Supply Code 2005: salient features', 'https://www.dvvnl.org/UploadFiles/electricityAct/The-Electricity-Act-2005.pdf', 'DVVNL')
S('uperc', 'UPPCL tariff order FY 2026-27 (2 July 2026)', 'https://www.uperc.org/App_File/UPPCLTariffOrder-pdf72202630517PM.pdf', 'Uttar Pradesh Electricity Regulatory Commission')

# Site risk and permits
S('is1893', 'IS 1893 (Part 1):2002, criteria for earthquake resistant design, Annex E zone factors', 'https://law.resource.org/pub/in/bis/S03/is.1893.1.2002.pdf', 'Bureau of Indian Standards')
S('is1893-wd', 'BIS revokes new seismic map with high-risk Zone VI', 'https://visionias.in/current-affairs/upsc-daily-news-summary/article/2026-03-07/the-economic-times/environment/bis-revokes-new-seismic-map-with-high-risk-zone-vi', 'Vision IAS (summarising The Economic Times)')
S('mum-2005', 'Global hazards, July 2005', 'https://www.ncei.noaa.gov/sotc/hazards/200507', 'NOAA National Centers for Environmental Information')
S('imd-chn', 'Meenambakkam climate extremes', 'https://mausam.imd.gov.in/chennai/mcdata/extreme_meenambakkam.pdf', 'India Meteorological Department, RMC Chennai')
S('michaung', 'Chennai records highest rainfall since 2015 floods', 'https://www.thenewsminute.com/tamil-nadu/chennai-records-highest-amount-of-rainfall-since-2015-floods', 'The News Minute')
S('hyd-2020', '2020 Hyderabad floods', 'https://en.wikipedia.org/wiki/2020_Hyderabad_floods', 'Wikipedia (citing The Times of India, The Indian Express, The Hindu)')
S('hudhud', 'Very Severe Cyclonic Storm Hudhud: a report', 'https://rsmcnewdelhi.imd.gov.in/uploads/report/26/26_fac6af_hud.pdf', 'India Meteorological Department')
S('cgwa', 'Guidelines to regulate and control ground water extraction in India (24 September 2020)', 'https://neer.co.in/wp-content/uploads/2022/07/ANNEXURE-2-CGWA-GUIDELINES-FOR-WEBSITE-1.pdf', 'Central Ground Water Authority, Ministry of Jal Shakti')
S('cgwb25', 'Dynamic Ground Water Resources Assessment 2025', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2220203&reg=48&lang=2', 'Press Information Bureau (Ministry of Jal Shakti)')
S('aai', 'NOCAS frequently asked questions (height clearance under GSR 751(E))', 'https://nocas2.aai.aero/nocas/FAQ.html', 'Airports Authority of India')
S('nmia', 'Navi Mumbai airport begins commercial flight operations (25 December 2025)', 'https://www.business-standard.com/industry/aviation/navi-mumbai-airport-adani-flight-operations-indigo-aviation-125122500119_1.html', 'Business Standard')
S('noida-ap', 'Commercial operations begin at Noida International Airport', 'https://www.business-standard.com/industry/aviation/commercial-operations-begin-at-noida-int-l-airport-with-bengaluru-flight-126061500112_1.html', 'Business Standard')
S('jewar-aai', 'AAI advisory on construction near Noida airport', 'https://www.theweek.in/wire-updates/national/2025/07/12/des126-ncr-noida-airport-advisory.html', 'The Week (PTI)')

RELATED_CITY = ['data-centres-in-india', 'mumbai-vs-chennai-vs-hyderabad-data-centres', 'power-for-data-centres-india']

SCREEN = ('Invariant checks the evidence behind a site’s power (the DISCOM or transmission connection, the open access route, '
          'the nearest substations and what else is queued on them), screens seismic zone, flood history, groundwater status and '
          'airport height limits, and lists the central and state approvals the project needs with the authority behind each one. ')

ARTICLES = []

# ─────────────────────────────── Mumbai ───────────────────────────────
ARTICLES.append(article(
    'data-centres-in-mumbai',
    'Data centres in Mumbai and Navi Mumbai (2026): capacity, sub-markets, power and land',
    'Mumbai holds about half of India’s live data centre capacity: 890 MW in H1 2026, most of it on Thane-Belapur Road in Navi Mumbai, where grid allocation and land are now the binding limits.',
    'Mumbai, Maharashtra, India',
    'Mumbai is India’s largest data centre market. Cushman & Wakefield counted 890 MW of operational capacity in the Mumbai Metropolitan Region in H1 2026, about 50% of the top seven cities, with 281 MW under construction and 1,445 MW planned. Most of it sits on Thane-Belapur Road in Navi Mumbai; the city has 13 cable landing stations. The constraint has moved from demand to power: about 6 GW of grid capacity allocated to Navi Mumbai data centres is close to fully committed, and new builds are moving to Panvel, Taloja and Rasayani.',
    [
        'Mumbai had 890 MW operational, 281 MW under construction and 1,445 MW planned in H1 2026 (Cushman & Wakefield). Savills counts 846 MW IT. Both put Mumbai at roughly half of India.',
        'Thane-Belapur Road alone holds 675 MW at 4.4% vacancy. Powai and Chandivali serve interconnection; Panvel, Taloja and Palava are where large new campuses go.',
        'Structure Research reports that the roughly 6 GW grid allocation for Navi Mumbai data centres is close to committed. Power evidence is the first check on any Mumbai site.',
        'Navi Mumbai International Airport opened to commercial flights on 25 December 2025, which adds a second set of height limits over Navi Mumbai clusters.',
    ],
    [
        sec('mumbai-key-facts', 'Mumbai data centre market: key facts (H1 2026)',
            table(['Item', 'Figure and period'], [
                ['Operational capacity', '890 MW, about 50% of the top seven cities (Cushman & Wakefield, H1 2026); 846 MW IT, 46% (Savills, H1 2026)'],
                ['Under construction and planned', '281 MW under construction; 1,445 MW planned (Cushman & Wakefield, H1 2026)'],
                ['Share of upcoming India supply', '45% of 3,860 MW upcoming to 2030 (Cushman & Wakefield)'],
                ['Colocation vacancy', '7.9% city-wide; 4.4% on Thane-Belapur Road (Cushman & Wakefield, H1 2026)'],
                ['Facilities', '54 data centres (Cushman & Wakefield, H1 2026)'],
                ['Cable landing stations', '13, with 2 more scheduled for 2026 (Cushman & Wakefield)'],
                ['State policy', 'Maharashtra IT/ITES Policy 2023 data centre chapter; Integrated Green Data Centre Parks, expanded to 20 parks by GR of 9 June 2026'],
                ['Grid note', 'About 6 GW allocated to Navi Mumbai data centres, close to committed (Structure Research, 2026)'],
                ['Physical risk note', 'Seismic Zone III; 944 mm of rain in 24 hours at Santacruz on 26 July 2005'],
            ], 'cw26', 'savills', 'structure', 'mh-green', 'is1893', 'mum-2005'),
            p('Estimates differ by method. Cushman & Wakefield counts colocation and hyperscale cloud in the top seven cities and leaves out captive facilities. Savills counts IT load across segments. Anarock gives 812 MW IT across 54 facilities for the region. Use one publisher consistently when comparing periods.', 'cw26', 'savills', 'anarock'),
            p('Mumbai took about 83% of top-seven additions in H1 2026 (148 MW) and Cushman & Wakefield expects the city to pass 1 GW of operational capacity by the end of 2026. About 95% of India’s international bandwidth is handled in the region.', 'cw26', 'tele-cable')),
        sec('mumbai-sub-markets', 'Sub-markets: Thane-Belapur Road, Powai, Panvel, Taloja and Palava',
            table(['Sub-market', 'Operational', 'Vacancy', 'Pipeline'], [
                ['Thane-Belapur Road (Airoli, Rabale, Mahape, Ghansoli)', '675 MW in 35 data centres', '4.4%', '241 MW under construction, 995 MW planned, 2,286 MW early stage'],
                ['Powai and Chandivali', '176 MW', '13.1%', '40 MW under construction, 185 MW planned'],
                ['Panvel', '22 MW in 2 data centres', '56.4%', '75 MW planned'],
            ], 'cw26'),
            p('Thane-Belapur Road is the hyperscale core, built on MIDC’s TTC industrial area plots close to the city’s landing stations. Powai and Chandivali, in the city, carry interconnection and enterprise demand; Equinix opened MB3 there in April 2026 with over US$95 million of initial investment. Anarock names Dombivali and Taloja as the emerging lower-cost hyperscale corridor.', 'cw26', 'equinix-mb3', 'anarock'),
            p('Large campuses now go further out. Yotta’s NM1 at Panvel runs 52 MW in a park it says can scale to 1 GW. AdaniConneX lists 1,000 MW of potential in Navi Mumbai, and CoreWeave has agreed to take 240 MW at its Taloja campus from mid-2028. Digital Edge plans 400 MW across its Navi Mumbai campus. STT GDC broke ground at Palava with 50 MW on 46 acres, scalable to about 400 MW.', 'yotta-dc', 'adaniconnex', 'coreweave', 'digitaledge', 'stt-palava')),
        sec('mumbai-power', 'Power: the Navi Mumbai allocation and what comes next',
            p('Structure Research reports that MSEDCL has allocated about 6 GW of grid capacity to Navi Mumbai data centres and that committed and under-construction capacity is approaching that figure. New builds are moving to Panvel, Taloja and Rasayani, where separate substations can be built. The same report notes a Maharashtra framework from October 2025 that lets data centre parks generate and distribute their own power.', 'structure'),
            p('Crisil estimates that by FY2030 data centre capacity could equal about 60% of Mumbai’s current peak power demand. That is the scale problem a new site has to answer: a will-serve letter for a few MW is easy, a firm date for 100 MW or more needs a named substation, a transmission plan and a connection agreement.', 'crisil'),
            p('Under MERC’s Supply Code, 33 kV supply covers contract demand up to 10,000 kVA, or 20,000 kVA in a Metropolitan Area or on an express feeder; larger loads connect at extra high voltage. A connection that needs a new distribution substation has a one-year standard, and a second independent source is available only if technically feasible and at the consumer’s cost.', 'merc-sop'),
            p('MERC’s March 2025 tariff order put data centres in the HT industrial category, with industrial rebates, and a 10% wheeling discount for data centres on 100% green power. Construction World reports that Maharashtra notified 25 areas, including Navi Mumbai and Panvel, for deemed distribution licences for data centre parks in May 2025.', 'merc-myt', 'mh-dl'),
            p('Maharashtra’s IT/ITES Policy 2023 gives registered data centres a permanent electricity duty exemption and a Rs 1 per unit tariff subsidy for 5 years outside Zone I. According to trade reports of the 9 June 2026 government resolution, the Integrated Green Data Centre Parks policy now requires parks to source at least 51% green power, and the Rs 1 per unit subsidy runs 10 years at Rs 30,000 crore of investment or 20 years at Rs 60,000 crore or more.', 'mh-it', 'mh-green')),
        sec('mumbai-land', 'Land: prices, parcels and approvals',
            p('Anarock benchmarks land at Rs 35 to 60 crore per acre for 5 to 10 MW parcels in Mumbai’s suburbs and Rs 3 to 10 crore per acre for 100 to 500 MW parks such as Navi Mumbai. Recent deals show the spread. STT GDC paid Rs 282 crore for 3.48 acres with a building in the TTC industrial area in May 2026. AWS bought 38.18 acres from Lodha near Mumbai for about Rs 450 crore in 2024.', 'anarock', 'stt-nm', 'aws-lodha'),
            p('A typical Navi Mumbai route is a plot in a MIDC industrial area followed by state environmental clearance for the building. Nxtra’s Mahape expansion, two data centre buildings, two generator buildings and a substation with 76,930 sq m of built-up area, received its clearance from SEIAA Maharashtra on 21 November 2025.', 'nxtra-ec'),
            p('Maharashtra’s IT/ITES Policy 2023 exempts stamp duty on land for new or expanded data centres and lets data centres locate in any zone.', 'mh-it')),
        sec('mumbai-risks', 'Site risks in Mumbai',
            ul([
                'Seismic: Mumbai and Thane are Zone III (zone factor 0.16) under the IS 1893 (Part 1) town list (2002 edition, zones retained in 2016). The 2025 revision that added a Zone VI was withdrawn in March 2026, so design follows the 2016 edition.',
                'Flood: Santacruz recorded 944 mm of rain in 24 hours on 26 July 2005. Low-lying plots near creeks and nullahs need a site-level drainage and flood check.',
                'Airports: sites within 20 km of an aerodrome reference point (56 km for instrument airports) need an AAI height NOC above the colour-coded zoning map. Navi Mumbai International Airport began commercial flights on 25 December 2025.',
            ], 'is1893', 'is1893-wd', 'mum-2005', 'aai', 'nmia'),
            p(SCREEN + 'In Mumbai the first question is which substation serves the plot and how much of its allocation is already committed.')),
    ],
    [
        faq('How much data centre capacity is in Mumbai?', 'Cushman & Wakefield counted 890 MW operational in the Mumbai region in H1 2026, about half of India’s top seven cities, with 281 MW under construction and 1,445 MW planned. Savills counted 846 MW IT.', 'cw26', 'savills'),
        faq('Where are the data centres in Navi Mumbai?', 'Mostly on Thane-Belapur Road (Airoli, Rabale, Mahape, Ghansoli), which holds 675 MW. Newer campuses are in Panvel, Taloja, Rasayani and Palava.', 'cw26', 'structure'),
        faq('Is power a constraint for data centres in Navi Mumbai?', 'Yes. Structure Research reports that the roughly 6 GW grid allocation for Navi Mumbai data centres is close to committed, and new builds are moving to locations where separate substations can be built.', 'structure'),
        faq('Why is Mumbai India’s biggest data center market?', 'Cable landings, fibre and an established power base. Mumbai has 13 cable landing stations with two more due in 2026, and the region handles about 95% of India’s international bandwidth.', 'cw26', 'tele-cable'),
        faq('What does land for a data centre cost in Mumbai?', 'Anarock puts small suburban parcels at Rs 35 to 60 crore per acre and large park land at Rs 3 to 10 crore per acre. Individual deals vary widely with buildings and power on the plot.', 'anarock'),
    ],
    pick('cw26', 'savills', 'structure', 'mh-green', 'is1893', 'mum-2005', 'anarock', 'tele-cable', 'equinix-mb3', 'yotta-dc', 'adaniconnex', 'coreweave', 'digitaledge', 'stt-palava', 'crisil', 'merc-sop', 'merc-myt', 'mh-dl', 'mh-it', 'stt-nm', 'aws-lodha', 'nxtra-ec', 'is1893-wd', 'aai', 'nmia'),
    ['data-centres-in-india', 'maharashtra-data-centre-policy', 'mumbai-vs-chennai-vs-hyderabad-data-centres', 'power-for-data-centres-india', 'data-centres-in-pune'],
    minutes=8,
))

# ─────────────────────────────── Chennai ───────────────────────────────
ARTICLES.append(article(
    'data-centres-in-chennai',
    'Data centres in Chennai (2026): capacity, Ambattur and Siruseri, policy status and flood risk',
    'Chennai had 214 MW of operational data centre capacity in H1 2026 (Cushman & Wakefield), mostly in Ambattur and Siruseri, with cable landings, high vacancy and a state policy whose window closed on 31 March 2026.',
    'Chennai, Tamil Nadu, India',
    'Chennai is India’s second cable-landing city and its second or third data centre market depending on the count. Cushman & Wakefield counted 214 MW operational in H1 2026 across 18 facilities, about 12% of the top seven cities, with 26.7% colocation vacancy after a run of new supply. Savills counts 320 MW IT. Most capacity is in Ambattur in the west and Siruseri on the OMR corridor. Tamil Nadu’s Data Centre Policy 2021 covered projects incorporated up to 31 March 2026, and we found no successor policy as of November 2026.',
    [
        'Chennai had 214 MW operational, 55 MW under construction and 313 MW planned in H1 2026 (Cushman & Wakefield). Savills counts 320 MW IT; Anarock 298 MW IT.',
        'Colocation vacancy was 26.7% in H1 2026, against 7.9% in Mumbai. Siruseri vacancy was 41.7%.',
        'Tamil Nadu’s 2021 policy applied to data centres incorporated from 1 April 2021 to 31 March 2026. Check the status of any incentive before relying on it.',
        'Flood risk is a site-level question: Meenambakkam recorded 1,178.3 mm in November 2015, its all-time November record.',
    ],
    [
        sec('chennai-key-facts', 'Chennai data centre market: key facts (H1 2026)',
            table(['Item', 'Figure and period'], [
                ['Operational capacity', '214 MW, about 12% of top seven cities (Cushman & Wakefield, H1 2026); 320 MW IT, 18% (Savills, H1 2026)'],
                ['Under construction and planned', '55 MW under construction; 313 MW planned (Cushman & Wakefield)'],
                ['Added in H1 2026', '8 MW (Cushman & Wakefield)'],
                ['Colocation vacancy', '26.7% (Cushman & Wakefield, H1 2026)'],
                ['Facilities', '18 data centres (Cushman & Wakefield)'],
                ['Cable landing stations', '7 existing, 2 under construction (Cushman & Wakefield)'],
                ['State policy', 'Tamil Nadu Data Centre Policy 2021, for data centres incorporated 1 April 2021 to 31 March 2026'],
                ['Physical risk note', 'Seismic Zone III; November 2015 record rainfall; Cyclone Michaung in December 2023'],
            ], 'cw26', 'savills', 'tn-policy', 'is1893', 'imd-chn'),
            p('Counts differ by method: Cushman & Wakefield counts colocation and hyperscale cloud and excludes captive sites; Savills counts IT load across segments; Anarock gives 298 MW IT across 25 facilities and forecasts 900 MW by 2030.', 'cw26', 'savills', 'anarock'),
            p('High vacancy reflects recent supply, not weak fundamentals. Cushman & Wakefield notes a large neocloud GPU deployment in the city in H1 2026, and JLL says Chennai accounted for 50% of India’s H1 2026 additions in its count.', 'cw26', 'jll')),
        sec('chennai-sub-markets', 'Sub-markets: Ambattur, Siruseri and the Sriperumbudur corridor',
            table(['Sub-market', 'Operational', 'Vacancy', 'Pipeline'], [
                ['Ambattur', '92 MW in 6 data centres', '12.1%', '42 MW under construction, 124 MW planned, 548 MW early stage'],
                ['Siruseri (OMR, SIPCOT IT park)', '104 MW in 9 data centres', '41.7%', '14 MW under construction, 171 MW planned'],
            ], 'cw26'),
            p('Ambattur, in the city’s west, is where the next wave of large buildings is going. CapitaLand’s Ambattur facility, about 34 MW IT, is due by the end of 2026. Lumina CloudInfra, now owned by AirTrunk, planned a 216 MW hub on 16 acres there. Siruseri hosts Equinix CN1, opened in September 2025 with 800 cabinets in phase one, and facilities from STT GDC and Sify.', 'capitaland-chn', 'lumina-chn', 'equinix-cn1', 'stt-chn', 'sify-site'),
            p('Anarock identifies the Oragadam industrial belt and the Parandur-Sriperumbudur corridor as the emerging zone, with larger and cheaper land. Digital Connexion, the Reliance, Brookfield and Digital Realty joint venture, runs a 100 MW campus in Chennai.', 'anarock', 'dcx')),
        sec('chennai-power', 'Power and the Tamil Nadu policy after March 2026',
            p('The 2021 policy set a minimum investment of Rs 500 crore and required at least 30% renewable power for incentives. It offered a 100% electricity tax subsidy for 5 years, open access charges at 50% of the conventional rate, a concessional cross subsidy surcharge, and supply from two grids for loads of 50 MW or more with an additional feeder above 100 MW.', 'tn-policy'),
            p('Under the Tamil Nadu Supply Code, loads above 10 MVA up to 50 MVA connect at 110 kV and loads above 50 MVA at 230 kV. TNERC’s tariff order of June 2025 places data centres in HT-I as IT services, at Rs 7.50 per kWh and Rs 608 per kVA per month from 1 July 2025; check for later inflation-linked revisions.', 'tn-supply', 'tnerc'),
            p('The policy applied to data centres incorporated from 1 April 2021 until 31 March 2026. Projects incorporated after that date should not assume these terms apply. Confirm with ELCOT and the Guidance Tamil Nadu single window what is available now, and get it in writing.', 'tn-policy')),
        sec('chennai-land', 'Land in Chennai',
            p('Anarock’s benchmarks put land for 10 to 30 MW facilities at Rs 5 to 20 crore per acre and large park parcels, including outer Chennai, at Rs 3 to 10 crore per acre. Lumina’s 16 acres in Ambattur were reported at over Rs 500 crore in January 2026.', 'anarock', 'lumina-chn'),
            p('SIPCOT and ELCOT industrial land and private land follow different routes. Whether a separate land-use conversion is needed depends on the parcel; confirm it with the allotting agency or district authority before signing.')),
        sec('chennai-risks', 'Site risks in Chennai: flood, cyclone and water',
            ul([
                'Flood: Meenambakkam recorded 1,178.3 mm in November 2015, the all-time November record. Cyclone Michaung brought very heavy rain on 3 and 4 December 2023; reported totals vary by station and window.',
                'Seismic: Chennai is Zone III (zone factor 0.16) under the IS 1893 (Part 1) town list (2002 edition, zones retained in 2016).',
                'Heat: the 1991 to 2020 mean daily maximum at Meenambakkam is 37.3 degrees C in May, which sets the cooling design point.',
                'Water: SBI flags Chennai, Bengaluru and Gurugram as water-stressed data centre metros. Groundwater abstraction needs a CGWA or state NOC, and over-exploited units restrict new industrial abstraction.',
            ], 'imd-chn', 'michaung', 'is1893', 'sbi', 'cgwa'),
            p(SCREEN + 'In Chennai, plot elevation and drainage relative to the 2015 and 2023 flood extents come before anything else.')),
    ],
    [
        faq('How much data centre capacity is in Chennai?', 'Cushman & Wakefield counted 214 MW operational in H1 2026 with 55 MW under construction and 313 MW planned. Savills counted 320 MW IT and Anarock 298 MW IT.', 'cw26', 'savills', 'anarock'),
        faq('Where are the data centres in Chennai?', 'Mainly Ambattur (92 MW) and Siruseri on the OMR (104 MW), per Cushman & Wakefield. The Oragadam and Sriperumbudur corridor is the emerging zone for large campuses.', 'cw26', 'anarock'),
        faq('Is the Tamil Nadu data centre policy still in force?', 'The 2021 policy applied to data centres incorporated from 1 April 2021 to 31 March 2026. We found no successor as of November 2026, so check current terms with ELCOT before relying on them.', 'tn-policy'),
        faq('Why is Chennai good for a data center?', 'Cable landings (seven existing and two under construction), a large industrial power base and available land in the west and south of the city. The trade-off is flood and cyclone exposure.', 'cw26', 'imd-chn'),
        faq('Why is data centre vacancy high in Chennai?', 'Recent supply ran ahead of enterprise demand. Vacancy was 26.7% in H1 2026, with Siruseri at 41.7%. Hyperscaler and GPU demand is expected to absorb it.', 'cw26'),
    ],
    pick('cw26', 'savills', 'tn-policy', 'tn-supply', 'tnerc', 'is1893', 'imd-chn', 'anarock', 'jll', 'capitaland-chn', 'lumina-chn', 'equinix-cn1', 'stt-chn', 'sify-site', 'dcx', 'michaung', 'sbi', 'cgwa'),
    ['data-centres-in-india', 'tamil-nadu-data-centre-policy', 'mumbai-vs-chennai-vs-hyderabad-data-centres', 'power-for-data-centres-india', 'data-centre-seismic-flood-risk-india'],
    minutes=7,
))

# ─────────────────────────────── Hyderabad ───────────────────────────────
ARTICLES.append(article(
    'data-centres-in-hyderabad',
    'Data centres in Hyderabad (2026): capacity, the southern ORR corridor, hyperscalers and power',
    'Hyderabad had 151 MW of operational data centre capacity in H1 2026 and the second largest pipeline in India, led by AWS and Microsoft campuses south of the city around Chandanvelly and Shamshabad.',
    'Hyderabad, Telangana, India',
    'Hyderabad has India’s second-largest data centre pipeline after Mumbai. Cushman & Wakefield counted 151 MW operational in H1 2026, about 8% of the top seven cities, but 668 MW planned and 18% of all upcoming supply to 2030, second only to Mumbai. AWS has run a region here since 2022, and Microsoft formally launched its India South Central region on 21 September 2026 (trade press reported general availability in August). Growth is concentrated south of the city along the outer ring road. The latest dedicated Telangana policy we found is the Data Centres Policy 2016; officials have cited about 5 GW by 2029 or 2030.',
    [
        'Hyderabad had 151 MW operational, 42 MW under construction and 668 MW planned in H1 2026 (Cushman & Wakefield).',
        'South Hyderabad holds 92 MW at 0% vacancy, with 1,758 MW at early stage. West Hyderabad (HITEC City, Gachibowli) holds 59 MW.',
        'Knight Frank puts the committed and early-stage pipeline at about 1.9 GW and says AWS holds 46% of live IT capacity.',
        'Hyderabad is Seismic Zone II, the lowest of India’s major data centre cities. The October 2020 floods are the main recent hazard event.',
    ],
    [
        sec('hyderabad-key-facts', 'Hyderabad data centre market: key facts (H1 2026)',
            table(['Item', 'Figure and period'], [
                ['Operational capacity', '151 MW, about 8% of top seven cities (Cushman & Wakefield, H1 2026); 151.4 MW at end 2025 (Knight Frank)'],
                ['Under construction and planned', '42 MW under construction; 668 MW planned (Cushman & Wakefield)'],
                ['Share of upcoming India supply', '18% of 3,860 MW to 2030, second to Mumbai (Cushman & Wakefield)'],
                ['Colocation vacancy', '28.0% (Cushman & Wakefield, H1 2026); 23% average in 2025 (Knight Frank)'],
                ['Hyperscale regions', 'AWS Hyderabad region, launched November 2022; Microsoft India South Central, formally launched 21 September 2026 (general availability reported in August)'],
                ['State policy', 'Telangana Data Centres Policy 2016 (latest found); about 5 GW by 2029 (Deccan Chronicle) or 2030 (Commissioner of Industries, ANI)'],
                ['Grid note', 'Crisil: data centre capacity could equal about 20% of Hyderabad’s current peak demand by FY2030'],
                ['Physical risk note', 'Seismic Zone II; October 2020 floods'],
            ], 'cw26', 'kf-hyd', 'aws-hyd', 'ms-hyd', 'tg-5gw', 'tg-dc', 'crisil', 'is1893', 'hyd-2020'),
            p('Baselines conflict. City figures from Cushman & Wakefield and Knight Frank are about 151 MW; figures quoted by Telangana officials are higher, and their basis is not stated.', 'cw26', 'kf-hyd', 'tg-5gw')),
        sec('hyderabad-sub-markets', 'Sub-markets: the southern ORR belt, HITEC City and Bharat Future City',
            table(['Sub-market', 'Operational', 'Vacancy', 'Pipeline'], [
                ['South Hyderabad (Shamshabad, Maheshwaram, Tukkuguda, Chandanvelly)', '92 MW in 3 data centres', '0%', '39 MW under construction, 634 MW planned, 1,758 MW early stage'],
                ['West Hyderabad (HITEC City, Gachibowli)', '59 MW in 8 data centres', 'n/a', 'Land scarce; multi-storey builds'],
            ], 'cw26', 'anarock'),
            p('The southern outer ring road belt from Maheshwaram through Shamshabad and Tukkuguda is the primary hyperscale corridor, per Anarock. Microsoft announced sites at Chandanvelly, Ellikatta and Kottur in 2022. CtrlS plans a 40-acre park at Chandanvelly with 600 MW or more of potential and 250 MW of sanctioned power for phase one.', 'anarock', 'ms-hyd', 'ctrls-hyd'),
            p('Bharat Future City, the planned new town south-east of the airport, is the next frontier. Cushman & Wakefield reports that AWS has started a greenfield campus there, expected live in 2028, and ThePrint reported allotments of 202 acres in Bharat Future City and 98 acres in Chandanvelly to Amazon.', 'cw26', 'amazon-tg')),
        sec('hyderabad-power', 'Power in Telangana',
            p('Crisil estimates that by FY2030 data centre capacity in Hyderabad could equal about 20% of the city’s current peak power demand, a third of the share it projects for Mumbai. CtrlS reports 250 MW of sanctioned power for the first phase of its Chandanvelly park, an example of the document a buyer should ask to see.', 'crisil', 'ctrls-hyd'),
            p('Telangana’s supply rules put contracted demand above 20,000 kVA at 132 kV or above, through a dedicated feeder or a loop-in loop-out arrangement decided by TS Transco, and the consumer pays the full cost of a dedicated service line. HT industrial supply at 132 kV and above was Rs 6.65 per kVAh with a Rs 500 per kVA monthly demand charge in the FY 2024-25 order; TGERC reportedly kept rates unchanged for 2026-27.', 'tg-gtcs', 'tg-rst', 'tg-hans'),
            p('The Telangana Data Centres Policy 2016 is the latest dedicated policy we found (Cushman & Wakefield, H1 2025). Large projects in 2025 and 2026 have been handled through project-specific packages; Amazon’s allotments came with reported incentives of Rs 125 crore.', 'cw25', 'amazon-tg')),
        sec('hyderabad-risks', 'Site risks in Hyderabad',
            ul([
                'Seismic: Hyderabad is Zone II (zone factor 0.10), the lowest of the major data centre cities.',
                'Flood: in October 2020 Ghatkesar recorded 324 mm of rain; 33 people died in the city and losses were estimated at about Rs 9,000 crore. Low-lying plots near lakes and the Musi need a drainage check.',
                'Groundwater: Telangana is among the states where over-exploited assessment units cluster, per the 2025 national assessment. Check the specific unit before relying on borewells.',
                'Airport: Rajiv Gandhi International Airport at Shamshabad sits beside the southern corridor; height NOCs apply within 20 km, or 56 km for instrument airports.',
            ], 'is1893', 'hyd-2020', 'cgwb25', 'aai'),
            p(SCREEN + 'In Hyderabad the questions are which 220 kV or 400 kV substation serves the corridor, what is already allocated on it, and the height surface over the plot.')),
    ],
    [
        faq('How much data centre capacity is in Hyderabad?', 'Cushman & Wakefield counted 151 MW operational in H1 2026, with 42 MW under construction and 668 MW planned. Knight Frank put the committed and early-stage pipeline at about 1.9 GW.', 'cw26', 'kf-hyd'),
        faq('Where are the data centres in Hyderabad?', 'Most new capacity is south of the city on the outer ring road: Shamshabad, Maheshwaram, Tukkuguda and Chandanvelly. Older facilities are in HITEC City and Gachibowli.', 'cw26', 'anarock'),
        faq('Which hyperscalers have data centres in Hyderabad?', 'AWS has run its Hyderabad region since 2022, and Microsoft formally launched its India South Central region on 21 September 2026 after general availability was reported in August. Knight Frank says AWS holds 46% of live IT capacity.', 'ms-hyd', 'kf-hyd'),
        faq('Does Telangana have a data center policy?', 'The latest dedicated policy we found is the Telangana Data Centres Policy 2016. Officials have cited about 5 GW by 2029 or 2030, and recent large projects have received project-specific packages.', 'cw25', 'tg-5gw', 'tg-dc', 'amazon-tg'),
        faq('Is Hyderabad safe from earthquakes for a data centre?', 'Hyderabad is Seismic Zone II under the IS 1893 (Part 1) town list (2002 edition, zones retained in 2016), the lowest zone among India’s major data centre cities. Flood drainage is the more relevant site check.', 'is1893', 'hyd-2020'),
    ],
    pick('cw26', 'cw25', 'kf-hyd', 'aws-hyd', 'ms-hyd', 'tg-5gw', 'tg-dc', 'crisil', 'is1893', 'hyd-2020', 'anarock', 'ctrls-hyd', 'tg-gtcs', 'tg-rst', 'tg-hans', 'amazon-tg', 'cgwb25', 'aai'),
    ['data-centres-in-india', 'telangana-data-centre-policy', 'mumbai-vs-chennai-vs-hyderabad-data-centres', 'power-for-data-centres-india', 'data-centres-in-visakhapatnam'],
    minutes=7,
))

# ─────────────────────────────── Noida / Delhi NCR ───────────────────────────────
ARTICLES.append(article(
    'data-centres-in-noida',
    'Data centres in Noida and Delhi NCR (2026): Noida, Greater Noida, YEIDA and Gurugram',
    'Delhi NCR had 183 MW of operational data centre capacity in H1 2026, 156 MW of it in Noida. The UP Data Centre Policy 2026, the YEIDA data centre park and Noida airport height limits shape new sites.',
    'Delhi NCR, India',
    'Delhi NCR is India’s third data centre market by Cushman & Wakefield’s count: 183 MW operational in H1 2026, about 10% of the top seven cities, with 360 MW planned. Noida carries almost all of it, 156 MW in 12 facilities, while Gurugram has 18 MW. New campuses are going to Greater Noida and the Yamuna Expressway, where YEIDA has a 100-acre data centre park in Sector 28. The Uttar Pradesh Data Centre Policy 2026, notified on 9 July 2026, sets the incentives, and Noida International Airport, open since June 2026, sets height limits within 20 km.',
    [
        'Delhi NCR had 183 MW operational, 27 MW under construction and 360 MW planned in H1 2026; Noida had 156 MW and 1,247 MW at early stage (Cushman & Wakefield).',
        'UP Data Centre Policy 2026 (G.O. 536/78-2-2026, 9 July 2026): base FAR 3.0 plus 1.0 chargeable, 25% land subsidy in western UP including Noida, 100% stamp duty exemption on land from government authorities.',
        'Delhi is Seismic Zone IV, a higher design load than Mumbai or Chennai.',
        'Noida International Airport began commercial flights on 15 June 2026; AAI requires height clearance for construction within 20 km.',
    ],
    [
        sec('noida-key-facts', 'Delhi NCR data centre market: key facts (H1 2026)',
            table(['Item', 'Figure and period'], [
                ['Operational capacity', '183 MW in 19 data centres, about 10% of top seven cities (Cushman & Wakefield, H1 2026); 191 MW IT (Savills)'],
                ['Noida', '156 MW in 12 data centres; 21 MW under construction; 223 MW planned; 1,247 MW early stage'],
                ['Gurugram', '18 MW in 2 data centres'],
                ['Colocation vacancy', '10.9% (Cushman & Wakefield, H1 2026)'],
                ['State policy', 'UP Data Centre Policy 2026, G.O. dated 9 July 2026; Haryana Data Centre Policy 2026 for Gurugram (reported notified May 2026; gazette to be confirmed)'],
                ['Land', 'YEIDA Data Centre Park, Sector 28: 100 acres'],
                ['Physical risk note', 'Seismic Zone IV (Delhi); Noida International Airport height surfaces'],
            ], 'cw26', 'savills', 'up-go', 'yeida', 'is1893', 'noida-ap'),
            p('Anarock counts 179 MW IT across 18 facilities and forecasts 550 MW by 2030.', 'anarock')),
        sec('noida-sub-markets', 'Sub-markets: Noida Expressway, Greater Noida, YEIDA and Gurugram',
            p('Anarock maps four zones: the Noida Expressway sectors (62, 132, 142, 143 and 150 to 167), Greater Noida around Knowledge Park and Pari Chowk, the Yamuna Expressway towards Jewar under YEIDA, and Gurugram-Manesar on the Haryana side. Campuses include Yotta’s Greater Noida D1 (30 MW live) and D2, NTT in Sector 142, STT GDC in Sector 143, Sify Noida-2 in Sector 132 and AdaniConneX in Sector 62.', 'anarock', 'yotta-dc'),
            p('YEIDA lists a 100-acre Data Centre Park in Sector 28, next to its medical devices park. Plots under 4,000 sq m are allotted by draw and larger plots by interview, through the Nivesh Mitra portal. AdaniConneX lists 150 MW of potential in Noida, and AM Green signed an MoU with Uttar Pradesh for a 1 GW AI data centre in Greater Noida, with first capacity targeted for 2028.', 'yeida', 'adaniconnex', 'amgreen')),
        sec('noida-policy', 'The UP Data Centre Policy 2026',
            p('Uttar Pradesh notified its Data Centre Policy 2026 by G.O. 536/78-2-2026 dated 9 July 2026, repealing the 2021 policy. Parks are 40 MW or more; units are above 2 MW and below 40 MW. Parks get interest subsidy up to Rs 50 crore and a dual-grid subsidy; units get capital subsidy up to Rs 20 crore.', 'up-go', 'up-page'),
            ul([
                'Land subsidy of 25% of sector rates in Madhyanchal and Paschimanchal, which include Noida and YEIDA, on land from state agencies.',
                '100% stamp duty exemption on purchase or lease from a government authority, against a bank guarantee released at commercial operation.',
                'Base FAR 3.0 free plus 1.0 chargeable; DG set space, basement storage and rooftop chillers sit outside FAR; ground coverage up to 60%.',
                '100% electricity duty exemption for 10 years and up to 100% transmission and wheeling exemption depending on the renewable source.',
                'Data centres are notified as essential services, and the state assesses water availability before allotting land.',
            ], 'up-go', 'up-page'),
            p('Gurugram and Manesar fall under Haryana, which has its own data centre policy. Compare both states’ terms for an NCR search; the right answer depends on load size and the power route.')),
        sec('noida-power-water', 'Power and water in NCR',
            p('Under the UP Supply Code, loads above 10,000 kVA are supplied at 132 kV or 220 kV, and an independent feeder depends on bay and corridor availability at the substation. UPERC’s FY 2026-27 order prices HV-2 large and heavy power, which covers IT and ITeS units notified by the state, at Rs 6.10 per kVAh above 132 kV and Rs 6.40 between 66 and 132 kV in urban areas, plus Rs 270 per kVA per month.', 'up-code', 'uperc'),
            p('The UP policy supports dual-grid supply for parks and waives transmission and wheeling charges by up to 100%, depending on the renewable source, which matters for green open access contracts. Ask for the specific substation and the DISCOM’s sanction letter; sector-level claims of available power do not tell you what is left for a new load.', 'up-go'),
            p('Groundwater is the harder constraint. The 2025 national assessment shows over-exploited units clustering in north-west India, and CGWA guidelines bar new industrial abstraction in over-exploited units. SBI lists Gurugram among the water-stressed data centre metros. Plan for treated wastewater or air and closed-loop cooling.', 'cgwb25', 'cgwa', 'sbi')),
        sec('noida-risks', 'Site risks in Noida and NCR',
            ul([
                'Seismic: Delhi is Zone IV (zone factor 0.24) under the IS 1893 (Part 1) town list (2002 edition, zones retained in 2016), a higher design load than Mumbai, Chennai or Hyderabad. Confirm the zone for the specific YEIDA sector.',
                'Airport: Noida International Airport at Jewar began commercial flights on 15 June 2026. In July 2025 AAI advised that no construction proceed within 20 km without height clearance.',
                'Heat: NCR summers set a high cooling design point, which affects PUE and water use.',
            ], 'is1893', 'noida-ap', 'jewar-aai'),
            p(SCREEN + 'In NCR the groundwater unit and the Jewar height surface are checked alongside the power route.')),
    ],
    [
        faq('How much data centre capacity is in Noida?', 'Cushman & Wakefield counted 156 MW operational in Noida in H1 2026, out of 183 MW across Delhi NCR, with 1,247 MW at early stage in Noida.', 'cw26'),
        faq('What is the YEIDA data centre park?', 'A 100-acre park in Sector 28 on the Yamuna Expressway, listed by YEIDA. Plots are allotted through the Nivesh Mitra portal.', 'yeida'),
        faq('What incentives does the UP Data Centre Policy 2026 offer?', 'Interest subsidy up to Rs 50 crore for parks, capital subsidy up to Rs 20 crore for units, 25% land subsidy in western UP, 100% stamp duty on government land, 100% electricity duty exemption for 10 years and up to 100% transmission and wheeling exemption on renewable power.', 'up-go', 'up-page'),
        faq('Is Noida a good location for a data center?', 'It has policy support, park land and fibre to Delhi. The checks are groundwater, Seismic Zone IV design and height limits near the new Jewar airport.', 'up-go', 'is1893', 'jewar-aai'),
        faq('Which companies run data centres in Noida?', 'Yotta, NTT, STT GDC, Sify and AdaniConneX, among others, per Anarock. AM Green has an MoU for a 1 GW AI data centre in Greater Noida.', 'anarock', 'amgreen'),
    ],
    pick('cw26', 'savills', 'up-go', 'yeida', 'is1893', 'noida-ap', 'anarock', 'yotta-dc', 'adaniconnex', 'amgreen', 'up-page', 'up-code', 'uperc', 'cgwb25', 'cgwa', 'sbi', 'jewar-aai'),
    ['data-centres-in-india', 'uttar-pradesh-data-centre-policy', 'haryana-data-centre-policy', 'power-for-data-centres-india', 'data-centre-water-india'],
    minutes=7,
))

# ─────────────────────────────── Bengaluru ───────────────────────────────
ARTICLES.append(article(
    'data-centres-in-bengaluru',
    'Data centres in Bengaluru (2026): capacity, Whitefield, Hoskote and the water question',
    'Bengaluru had 162 MW of operational data centre capacity in H1 2026, mostly in Whitefield, with 28% vacancy. Karnataka’s 2026-31 policy plans parks at Hoskote, Mysuru and Mangaluru; groundwater is the binding issue.',
    'Bengaluru, Karnataka, India',
    'Bengaluru is a mid-sized data centre market with a large technology economy around it. Cushman & Wakefield counted 162 MW operational in H1 2026, about 9% of the top seven cities, with only 8 MW under construction and 28% colocation vacancy. Most capacity is in Whitefield in the east. Karnataka’s Sustainable Data Centre Policy 2026-31, approved by the Cabinet in September 2026, targets 1 GW by 2031 and pays for low PUE and water efficiency. Water is the constraint: most of the city’s data centres sit in its most water-stressed areas.',
    [
        'Bengaluru had 162 MW operational, 8 MW under construction and 92 MW planned in H1 2026 (Cushman & Wakefield). Anarock counts 137 MW IT.',
        'Peripheral East (Whitefield) holds 128 MW; Electronic City 22 MW. Devanahalli in the north is the hyperscale growth corridor.',
        'Karnataka’s 2026-31 policy pays up to Rs 20 crore for PUE between 1.00 and 1.20 and plans parks at Hoskote, Mysuru and Mangaluru.',
        'All Bengaluru Urban groundwater assessment units are reported as over-exploited.',
    ],
    [
        sec('bengaluru-key-facts', 'Bengaluru data centre market: key facts (H1 2026)',
            table(['Item', 'Figure and period'], [
                ['Operational capacity', '162 MW, about 9% of top seven cities (Cushman & Wakefield, H1 2026); 137 MW IT (Anarock)'],
                ['Under construction and planned', '8 MW under construction; 92 MW planned (Cushman & Wakefield)'],
                ['Colocation vacancy', '28.0% (Cushman & Wakefield, H1 2026)'],
                ['Sub-markets', 'Peripheral East (Whitefield) 128 MW; Peripheral South (Electronic City) 22 MW'],
                ['State policy', 'Karnataka Sustainable Data Centre Policy 2026-31, Cabinet approval September 2026; formal notification status to be confirmed'],
                ['Physical risk note', 'Seismic Zone II; groundwater over-exploited across Bengaluru Urban'],
            ], 'cw26', 'anarock', 'ka-2026', 'is1893', 'blr-gw'),
            p('Cushman & Wakefield attributes the slow growth to muted enterprise demand and low hyperscaler activity compared with Mumbai, Chennai and Hyderabad. Anarock forecasts 400 MW by 2030.', 'cw26', 'anarock')),
        sec('bengaluru-sub-markets', 'Sub-markets: Whitefield, Electronic City, Devanahalli and Hoskote',
            p('Whitefield and the eastern periphery hold most live capacity. Electronic City in the south hosts NTT Bengaluru 4, about 67 MW IT. Anarock names Devanahalli and North Bengaluru, near the airport, as the hyperscale growth corridor.', 'cw26', 'anarock'),
            p('Karnataka plans a 500 MW data centre park near Hoskote by 2031, with solar power and treated water committed, and 500 MW across Mysuru and Mangaluru. The 2026-31 policy offers park land on 30 plus 30 year leases with dual-grid power.', 'cw26', 'ka-2026')),
        sec('bengaluru-policy', 'Karnataka’s Sustainable Data Centre Policy 2026-31',
            ul([
                'Outlay of Rs 1,300.45 crore and a target of 1 GW by 2031.',
                'PUE incentive up to Rs 20 crore for PUE between 1.00 and 1.20 sustained for three years.',
                'WUE reimbursement up to Rs 30 lakh a year for two years at 0.7 to 1.3 litres per kWh, and treated water reimbursement up to Rs 8 lakh a year for five years.',
                'Custom packages above Rs 3,000 crore, including cable landing stations and desalination.',
            ], 'ka-2026'),
            p('The earlier Karnataka Data Centre Policy 2022-27 favoured locations outside Bengaluru Urban with capital and land subsidies. Check which policy a project falls under and whether the 2026-31 policy has been formally notified before relying on its terms.')),
        sec('bengaluru-water', 'Water: the binding constraint',
            p('Newslaundry reported in April 2026 that most of Bengaluru’s data centres are in its most water-stressed eastern and south-eastern areas, with reliance on groundwater. CGWB-based reporting says all Bengaluru Urban assessment units are over-exploited.', 'newslaundry', 'blr-gw'),
            p('Under CGWA guidelines, new industries cannot get groundwater NOCs in over-exploited units, and expansion that increases abstraction is not allowed. A cooling-tower data centre uses about 25.5 million litres per MW per year by Anarock’s estimate, so a new Bengaluru site needs treated water, air-cooled or closed-loop systems from day one.', 'cgwa', 'anarock')),
        sec('bengaluru-risks', 'Other site risks in Bengaluru',
            ul([
                'Seismic: Bengaluru is Zone II (zone factor 0.10) under the IS 1893 (Part 1) town list (2002 edition, zones retained in 2016).',
                'Flood: lake-bed and drain-adjacent plots need a drainage check; several tech corridors sit near the city’s lake chains.',
                'Airport: Kempegowda International Airport at Devanahalli places height surfaces over the northern corridor.',
            ], 'is1893', 'aai'),
            p(SCREEN + 'In Bengaluru the groundwater unit and the water plan decide the site before power does.')),
    ],
    [
        faq('How much data centre capacity is in Bengaluru?', 'Cushman & Wakefield counted 162 MW operational in H1 2026, with 8 MW under construction and 92 MW planned. Anarock counted 137 MW IT.', 'cw26', 'anarock'),
        faq('Where are the data centres in Bengaluru?', 'Mostly Whitefield and the eastern periphery (128 MW), then Electronic City (22 MW). Devanahalli near the airport and a planned park at Hoskote are the growth areas.', 'cw26', 'anarock'),
        faq('What does Karnataka’s new data centre policy offer?', 'The Sustainable Data Centre Policy 2026-31 targets 1 GW by 2031 and offers up to Rs 20 crore for PUE of 1.00 to 1.20, water efficiency and treated water reimbursements, and parks at Hoskote, Mysuru and Mangaluru.', 'ka-2026'),
        faq('Is water a problem for data centres in Bengaluru?', 'Yes. Most of the city’s data centres are in water-stressed areas, and Bengaluru Urban groundwater units are reported as over-exploited, where CGWA guidelines restrict new industrial abstraction.', 'newslaundry', 'blr-gw', 'cgwa'),
        faq('Why is Bengaluru smaller than Mumbai as a data center market?', 'Muted enterprise colocation demand and less hyperscaler activity, according to Cushman & Wakefield.', 'cw26'),
    ],
    pick('cw26', 'anarock', 'ka-2026', 'is1893', 'blr-gw', 'newslaundry', 'cgwa', 'aai'),
    ['data-centres-in-india', 'karnataka-data-centre-policy', 'data-centre-water-india', 'power-for-data-centres-india'],
    minutes=6,
))

# ─────────────────────────────── Pune ───────────────────────────────
ARTICLES.append(article(
    'data-centres-in-pune',
    'Data centres in Pune (2026): capacity, Hinjewadi, Pimpri-Chinchwad and the Mumbai overflow',
    'Pune had 133 MW of operational data centre capacity in H1 2026 (Cushman & Wakefield), concentrated in Pimpri-Chinchwad and Hinjewadi, with Microsoft’s Central India region and Maharashtra’s data centre incentives.',
    'Pune, Maharashtra, India',
    'Pune is Maharashtra’s second data centre market and an overflow for Mumbai. Cushman & Wakefield counted 133 MW operational in H1 2026 across 12 facilities, about 7% of the top seven cities, with 31 MW under construction and 227 MW planned. Savills counts 182 MW IT. Capacity is concentrated in the Pimpri-Chinchwad belt and Hinjewadi. Microsoft runs its Central India cloud region here and has bought sites for its own builds. Pune falls under the same Maharashtra policies as Mumbai.',
    [
        'Pune had 133 MW operational, 31 MW under construction and 227 MW planned in H1 2026 (Cushman & Wakefield). Savills counts 182 MW IT.',
        'Pimpri-Chinchwad (PBD North) holds 92 MW in 2 facilities; Hinjewadi 37 MW in 5, at 32.5% vacancy.',
        'Maharashtra’s IT/ITES Policy 2023 and the Green Data Centre Parks policy apply in Pune as in Mumbai.',
        'Pune is Seismic Zone III.',
    ],
    [
        sec('pune-key-facts', 'Pune data centre market: key facts (H1 2026)',
            table(['Item', 'Figure and period'], [
                ['Operational capacity', '133 MW in 12 data centres, about 7% of top seven cities (Cushman & Wakefield, H1 2026); 182 MW IT, about 10% (Savills)'],
                ['Under construction and planned', '31 MW under construction; 227 MW planned (Cushman & Wakefield)'],
                ['Colocation vacancy', '22.1% (Cushman & Wakefield, H1 2026)'],
                ['Sub-markets', 'PBD North (Pimpri-Chinchwad) 92 MW; Hinjewadi 37 MW'],
                ['Hyperscale', 'Microsoft Azure Central India region; sites bought for captive builds'],
                ['State policy', 'Maharashtra IT/ITES Policy 2023; Integrated Green Data Centre Parks (20 parks statewide since June 2026)'],
                ['Physical risk note', 'Seismic Zone III'],
            ], 'cw26', 'savills', 'mh-it', 'mh-green', 'is1893'),
            p('The gap between 133 MW and 182 MW is method: Cushman & Wakefield counts colocation and hyperscale cloud and excludes captive facilities, while Savills counts IT load across segments.', 'cw26', 'savills')),
        sec('pune-sub-markets', 'Sub-markets: Pimpri-Chinchwad, Hinjewadi, Chakan and Talegaon',
            p('The Pimpri-Chinchwad belt north of the city holds 92 MW in two large facilities. Hinjewadi, the IT park to the west, holds 37 MW across five smaller facilities. AdaniConneX lists 250 MW of potential in Pune, with phase one live from October 2025.', 'cw26', 'adaniconnex'),
            p('Chakan and Talegaon, the industrial corridors on the Mumbai-Pune axis, have only small planned data centre projects in public so far; treat them as early-stage.')),
        sec('pune-power-policy', 'Power and policy in Pune',
            p('Maharashtra’s IT/ITES Policy 2023 gives registered data centres a permanent electricity duty exemption, 100% stamp duty exemption on land, and a Rs 1 per unit tariff subsidy for 5 years outside Zone I. Since 9 June 2026 the Integrated Green Data Centre Parks policy covers 20 parks statewide, with a 51% green power requirement and Rs 1 per unit for 10 or 20 years depending on investment.', 'mh-it', 'mh-green'),
            p('The same MERC Supply Code applies as in Mumbai: 33 kV up to 10,000 kVA of contract demand (20,000 kVA on an express feeder), extra high voltage above that, and a one-year standard where a new distribution substation is needed. MERC classifies data centres as HT industrial consumers.', 'merc-sop', 'merc-myt'),
            p('Pune’s appeal is partly that it sits outside the Navi Mumbai grid allocation that Structure Research describes as close to committed. Confirm the serving substation and sanction for the specific plot.', 'structure')),
        sec('pune-risks', 'Site risks in Pune',
            ul([
                'Seismic: Pune is Zone III (zone factor 0.16) under the IS 1893 (Part 1) town list (2002 edition, zones retained in 2016).',
                'Airport: height clearance under GSR 751(E) covers sites within 20 km of the aerodrome reference point, or 56 km for instrument airports.',
                'Water: check the groundwater assessment unit and the municipal or MIDC supply before planning evaporative cooling.',
            ], 'is1893', 'aai', 'cgwa'),
            p(SCREEN + 'For a Pune site, the comparison with a Navi Mumbai plot is usually about power date and latency, and we lay both out.')),
    ],
    [
        faq('How much data centre capacity is in Pune?', 'Cushman & Wakefield counted 133 MW operational in H1 2026, with 31 MW under construction and 227 MW planned. Savills counted 182 MW IT.', 'cw26', 'savills'),
        faq('Where are the data centres in Pune?', 'Mainly the Pimpri-Chinchwad belt (92 MW) and Hinjewadi (37 MW), per Cushman & Wakefield.', 'cw26'),
        faq('Does Microsoft have a data center in Pune?', 'Microsoft’s Azure Central India region is in Pune, and Cushman & Wakefield reports it has bought sites for its own builds.', 'cw26'),
        faq('Do Maharashtra data centre incentives apply in Pune?', 'Yes. The IT/ITES Policy 2023 data centre chapter and the Integrated Green Data Centre Parks policy apply statewide.', 'mh-it', 'mh-green'),
    ],
    pick('cw26', 'savills', 'mh-it', 'mh-green', 'is1893', 'adaniconnex', 'merc-sop', 'merc-myt', 'structure', 'aai', 'cgwa'),
    ['data-centres-in-india', 'data-centres-in-mumbai', 'maharashtra-data-centre-policy', 'power-for-data-centres-india'],
    minutes=6,
))

# ─────────────────────────────── Visakhapatnam ───────────────────────────────
ARTICLES.append(article(
    'data-centres-in-visakhapatnam',
    'Data centres in Visakhapatnam (2026): Google’s AI hub, gigawatt campuses, cables and the risks',
    'Visakhapatnam has more than 4 GW of announced data centre capacity, led by Google’s US$15 billion AI hub. The checks are power relative to the city’s demand, cyclone exposure, water and new cable landings.',
    'Visakhapatnam, Andhra Pradesh, India',
    'Visakhapatnam has gone from no data centre market to more than 4 GW of announced or early-stage campuses in about a year. Google committed about US$15 billion over 2026 to 2030 for its first India AI hub here, with AdaniConneX and Airtel, and broke ground at Tarluvada on 28 April 2026. Digital Connexion, Colt DCS with RMZ, and AirTrunk have announced campuses of 1 GW or more. Cushman & Wakefield maps more than 4 GW at early or announced stage. Crisil estimates Vizag’s data centre capacity could equal about 80% of the city’s current peak power demand by FY2030.',
    [
        'Announced: Google (about US$15 billion, about 1 GW), Digital Connexion (US$11 billion, 1 GW), Colt DCS and RMZ (1.25 GW, Rs 1.77 lakh crore), AirTrunk (up to 1.8 GW in Anakapalli, proposed).',
        'Andhra Pradesh Data Center Policy 4.0 (2024-29) uses project-specific packages for large projects; four projects totalling 3,498 MW were cleared in August 2026.',
        'Cyclone Hudhud crossed the coast over Visakhapatnam on 12 October 2014 with winds of about 180 km/h and a 1.4 m surge.',
        'New subsea routes: Google’s America-India Connect and Sify’s open cable landing station at Rushikonda.',
    ],
    [
        sec('vizag-key-facts', 'Visakhapatnam data centre market: key facts (2026)',
            table(['Item', 'Figure and period'], [
                ['Announced capacity', 'More than 4 GW at early or announced stage (Invest India and Cushman & Wakefield, October 2026)'],
                ['Largest project', 'Google AI hub, about US$15 billion over 2026 to 2030, groundbreaking 28 April 2026'],
                ['Grid note', 'Data centre capacity could equal about 80% of the city’s current peak demand by FY2030 (Crisil)'],
                ['State policy', 'Andhra Pradesh Data Center Policy 4.0 (2024-29), reported notified in late 2024'],
                ['Cables', 'Google America-India Connect gateway (February 2026); Sify open cable landing station at Rushikonda; Airtel building a new landing station'],
                ['Physical risk note', 'Seismic Zone II; Cyclone Hudhud landfall on 12 October 2014'],
            ], 'ii', 'google-blog', 'adani-gb', 'crisil', 'ap-policy', 'aic', 'sify-vizag', 'is1893', 'hudhud')),
        sec('vizag-projects', 'Projects announced in and around Visakhapatnam',
            table(['Developer', 'Scale', 'Where', 'Status and date'], [
                ['Google with AdaniConneX and Airtel', 'About 1 GW; about US$15 billion over 2026 to 2030', 'Tarluvada and other sites', 'Announced 14 October 2025; groundbreaking 28 April 2026'],
                ['Digital Connexion (Reliance, Brookfield, Digital Realty)', '1 GW; US$11 billion by 2030', 'About 400 acres', 'MoU November 2025'],
                ['Colt DCS and RMZ', '1.25 GW; Rs 1.77 lakh crore', 'About 200 acres, Anandapuram', 'Cleared by SIPC in July 2026, SIPB approval pending; five phases 2027 to 2036'],
                ['AirTrunk', 'Up to 1.8 GW; about US$11 billion', 'Two campuses in Anakapalli', 'Plans submitted November 2026, subject to approval'],
                ['Sify', '50 MW AI edge data centre and open cable landing station', 'Rushikonda, 3.6 acres', 'Foundation stone 12 October 2025'],
            ], 'google-blog', 'adani-gb', 'dcx', 'colt-vizag', 'airtrunk-ap', 'sify-vizag'),
            p('Andhra Pradesh also cleared four projects totalling 3,498 MW in August 2026 under Policy 4.0, including ReNew’s 1,000 MW in Anakapalli and AM AI Factory’s 512 MW at Amanam. Reported incentives for Google’s subsidiary Raiden Infotech total about Rs 22,000 crore against Rs 87,520 crore of investment, including a 25% discount on about 480 acres.', 'ap-aug26', 'ap-raiden')),
        sec('vizag-power', 'Power: the scale problem',
            p('Crisil’s estimate that data centres could equal about 80% of Visakhapatnam’s current peak demand by FY2030 is the central fact for any site here. Gigawatt campuses need new transmission capacity, and each announced project competes for the same build-out. A site in Vizag needs evidence of which transmission scheme serves it and when, not only a state MoU.', 'crisil'),
            p('Andhra Pradesh issues incentives for large projects project by project through government orders. Read the project order; the policy text alone does not tell you what a given site gets.', 'ap-aug26')),
        sec('vizag-risks', 'Disadvantages and risks of a data centre in Vizag',
            ul([
                'Cyclone: Hudhud crossed the coast over Visakhapatnam on 12 October 2014 with maximum sustained winds of about 180 km/h, central pressure of 950 hPa and a 1.4 m storm surge at the tide gauge. Design for wind loads and plan for grid outages after landfall.',
                'Coastal rules: sites near the shore fall under the Coastal Regulation Zone Notification 2019, with no-development setbacks from the high tide line.',
                'Water: Andhra Pradesh is among the states with clusters of over-exploited groundwater units in the 2025 national assessment. Large evaporative cooling loads need a non-groundwater source.',
                'Market depth: Vizag has little operating colocation today, so early tenants depend on the hyperscale anchors.',
                'Seismic: Visakhapatnam is Zone II (zone factor 0.10), a low design load.',
            ], 'hudhud', 'cgwb25', 'is1893'),
            p(SCREEN + 'In Vizag the questions are which transmission scheme and substation serve the plot, the cyclone design basis, and the water source.')),
        sec('vizag-cables', 'Cable landings on the east coast',
            p('Google’s America-India Connect, announced on 19 February 2026, includes routes from Visakhapatnam and Chennai to South Africa and from Visakhapatnam to Malaysia. Airtel is building a new landing station in Vizag, Sify is building an open landing station at Rushikonda, and Meta’s Waterworth cable is expected to land at Sify’s station.', 'aic', 'sify-vizag')),
    ],
    [
        faq('Which companies are building data centres in Visakhapatnam?', 'Google (with AdaniConneX and Airtel), Digital Connexion (Reliance, Brookfield and Digital Realty), Colt DCS with RMZ, Sify, and AirTrunk, which has submitted plans for Anakapalli.', 'google-blog', 'dcx', 'colt-vizag', 'sify-vizag', 'airtrunk-ap'),
        faq('How big is Google’s data centre in Vizag?', 'Google committed about US$15 billion over 2026 to 2030 for its India AI hub. The Adani Group described nearly 1 GW at a single location at the groundbreaking on 28 April 2026.', 'google-blog', 'adani-gb'),
        faq('What are the disadvantages of a data center in Vizag?', 'Cyclone exposure (Hudhud in 2014), power build-out relative to the city’s demand, water for cooling, coastal regulation near the shore, and a thin local colocation market.', 'hudhud', 'crisil', 'cgwb25'),
        faq('Does Andhra Pradesh have a data centre policy?', 'Yes. Andhra Pradesh Data Center Policy 4.0 (2024-29), reported as notified in late 2024. Large projects receive tailor-made packages through project-specific orders.', 'ap-policy', 'ap-aug26'),
    ],
    pick('ii', 'google-blog', 'adani-gb', 'crisil', 'ap-policy', 'aic', 'sify-vizag', 'is1893', 'hudhud', 'dcx', 'colt-vizag', 'airtrunk-ap', 'ap-aug26', 'ap-raiden', 'cgwb25'),
    ['data-centres-in-india', 'andhra-pradesh-data-centre-policy', 'ai-data-centres-india', 'power-for-data-centres-india', 'data-centre-seismic-flood-risk-india'],
    minutes=7,
))

# ─────────────────────────────── Gujarat ───────────────────────────────
ARTICLES.append(article(
    'data-centres-in-gujarat',
    'Data centres in Gujarat (2026): Jamnagar, GIFT City, Ahmedabad and Dholera',
    'Gujarat’s data centre market is led by Reliance’s AI campus at Jamnagar, where Meta is leasing 168 MW, plus GIFT City and a planned 250 MW Dholera campus. The 2026-29 state policy targets 7.5 GW.',
    'Gujarat, India',
    'Gujarat is a new data centre state built around a few very large projects rather than a colocation cluster. Reliance is building a multi-gigawatt AI data centre at Jamnagar, said in February 2026 to have more than 120 MW expected online in the second half of 2026; Meta agreed in June 2026 to lease 168 MW there. GIFT City hosts Yotta’s 1 MW G1 facility, and L&T Vyoma signed an MoU for a 250 MW green AI data centre at Dholera. The Viksit Gujarat Data Centre Policy 2026-29, launched on 9 July 2026, targets 7.5 GW and only supports projects of 150 MW or more.',
    [
        'Jamnagar: Reliance AI campus; Meta 168 MW lease (June 2026); Google Cloud dedicated AI region announced (August 2025). Estimates of the campus range from 1 GW (Cushman & Wakefield map) to 3 GW (Anarock).',
        'Gujarat’s 2026-29 policy requires at least 150 MW of approved IT load and 51% renewable power, and, according to Cyril Amarchand Mangaldas, makes data centre operations an essential service under the Gujarat ESMA 1972.',
        'GIFT City: Yotta G1, 1 MW live. The 2023-24 Budget proposed data embassies in GIFT IFSC; we found no final notification.',
        'Dholera: L&T Vyoma MoU for 250 MW, Rs 25,000 crore, operations from 2028 subject to feasibility.',
    ],
    [
        sec('gujarat-key-facts', 'Gujarat data centres: key facts (2026)',
            table(['Item', 'Figure and period'], [
                ['Jamnagar', 'Reliance multi-gigawatt AI data centre; more than 120 MW expected online in H2 2026 (Reliance, February 2026); Meta leasing 168 MW (June 2026)'],
                ['Jamnagar scale estimates', '1 GW+ early stage (Invest India and Cushman & Wakefield map); 3 GW plan (Anarock)'],
                ['GIFT City', 'Yotta G1: 1 MW, 350 racks, live'],
                ['Dholera', 'L&T Vyoma 250 MW green AI data centre MoU, Rs 25,000 crore (February 2026)'],
                ['State policy', 'Viksit Gujarat Data Centre Policy 2026-29, launched 9 July 2026; target 7.5 GW and Rs 6 lakh crore'],
                ['Cables', 'Two cable landing stations planned in Gujarat (state, July 2026)'],
                ['Physical risk note', 'Ahmedabad Seismic Zone III; parts of Kutch are high-hazard'],
            ], 'reliance-ai', 'meta-jam', 'ii', 'anarock', 'yotta-dc', 'dholera', 'gj-dd', 'is1893')),
        sec('gujarat-jamnagar', 'Jamnagar: Reliance’s AI campus',
            p('Reliance announced a Rs 10 trillion (about US$110 billion) AI compute plan over seven years on 19 February 2026 and said construction of a multi-gigawatt AI data centre at Jamnagar was under way, with more than 120 MW expected online in the second half of 2026, backed by 10 GW of surplus solar. Google Cloud and Reliance announced a dedicated AI cloud region at Jamnagar in August 2025.', 'reliance-ai', 'gc-jam'),
            p('Meta signed its first Indian AI data centre deal with Reliance on 10 June 2026: a 168 MW lease at Jamnagar, expected ready within about two years and cooled with desalinated seawater.', 'meta-jam')),
        sec('gujarat-gift-dholera', 'GIFT City, Ahmedabad and Dholera',
            p('GIFT City, the international financial services centre near Gandhinagar, hosts Yotta’s G1 facility at 1 MW. The Union Budget 2023-24 proposed facilitating data embassies in GIFT IFSC for countries seeking digital continuity; we found no final notification or bilateral agreement as of 2026.', 'yotta-dc', 'gift-emb'),
            p('At the India AI Impact Summit in February 2026, Gujarat signed an MoU with L&T Vyoma for a 250 MW green AI data centre at the Dholera Special Investment Region, about Rs 25,000 crore, with operations from 2028 subject to feasibility. The state policy names GIFT City and Dholera as hubs.', 'dholera', 'gj-dd')),
        sec('gujarat-policy', 'The Viksit Gujarat Data Centre Policy 2026-29',
            ul([
                'Eligible projects need at least 150 MW of approved IT load and at least 51% renewable power.',
                'Power tariff subsidy of Rs 1 per unit for 20 years; electricity duty reimbursement of 100% for 20 years; stamp duty and registration 100%.',
                'Interest subsidy up to 4% for 10 years; capital subsidy of 2.5% of eligible fixed capital investment at Dholera; total support capped at 75% of eligible investment.',
                'Open access allowed and dual feeders facilitated; data centre operations treated as an essential service under the Gujarat Essential Services Maintenance Act, 1972, according to Cyril Amarchand Mangaldas.',
                'In force for three years from notification or until 7.5 GW is reached.',
            ], 'gj-cam'),
            p('The 150 MW floor means the policy targets hyperscale and AI campuses. Smaller facilities fall back on general industrial and IT incentives.', 'gj-cam')),
        sec('gujarat-risks', 'Site risks in Gujarat',
            ul([
                'Seismic: Ahmedabad is Zone III under the IS 1893 (Part 1) town list (2002 edition, zones retained in 2016). Parts of Kutch are high-hazard; check the zone for the specific site. The 2025 seismic map revision was withdrawn in March 2026.',
                'Water: north-west and western India hold a large share of over-exploited groundwater units. Jamnagar’s use of desalinated seawater shows the likely route for large loads, and the state policy supports desalination.',
                'Coast: sites near the shore fall under the Coastal Regulation Zone Notification 2019.',
            ], 'is1893', 'is1893-wd', 'cgwb25', 'meta-jam'),
            p(SCREEN + 'In Gujarat, the 150 MW policy floor and the water source are usually settled before the power route.')),
    ],
    [
        faq('Where is the largest data centre in Gujarat?', 'Reliance’s AI data centre at Jamnagar, which Meta is leasing 168 MW in. Reliance said more than 120 MW was expected online in H2 2026; estimates of the full campus range from 1 GW to 3 GW.', 'reliance-ai', 'meta-jam', 'ii', 'anarock'),
        faq('Is there a data center in GIFT City?', 'Yes. Yotta’s G1 facility in GIFT City runs 1 MW with 350 racks.', 'yotta-dc'),
        faq('What is the Gujarat data centre policy 2026-29?', 'The Viksit Gujarat Data Centre Policy 2026-29, launched 9 July 2026, supports projects of at least 150 MW with 51% renewable power, offering Rs 1 per unit for 20 years, electricity duty and stamp duty reimbursement and, as reported by Cyril Amarchand Mangaldas, essential-service status, up to 7.5 GW.', 'gj-dd', 'gj-cam'),
        faq('What is planned at Dholera?', 'L&T Vyoma signed an MoU for a 250 MW green AI data centre worth about Rs 25,000 crore, with operations from 2028 subject to feasibility.', 'dholera'),
    ],
    pick('reliance-ai', 'meta-jam', 'ii', 'anarock', 'yotta-dc', 'dholera', 'gj-dd', 'is1893', 'gc-jam', 'gift-emb', 'gj-cam', 'is1893-wd', 'cgwb25'),
    ['data-centres-in-india', 'gujarat-data-centre-policy', 'ai-data-centres-india', 'power-for-data-centres-india'],
    minutes=6,
))

# ─────────────────────────────── Kolkata ───────────────────────────────
ARTICLES.append(article(
    'data-centres-in-kolkata',
    'Data centres in Kolkata and East India (2026): New Town, Salt Lake, Bhubaneswar and policy',
    'Kolkata had 22 MW of operational data centre capacity in H1 2026, mostly in New Town. West Bengal’s 2021 policy classed data centres as essential services; its term ended around September 2026.',
    'Kolkata, West Bengal, India',
    'Kolkata is the largest data centre market in East India and one of the smallest of the top seven. Cushman & Wakefield counted 22 MW operational in H1 2026 across six facilities, 18 MW in New Town and 4 MW in Salt Lake, with 13 MW under construction and 71 MW planned. Demand comes from government and smaller enterprises. West Bengal’s Data Centre Policy 2021 classed data centre organisations as essential services and treated their power as industrial; its five-year term ended around September 2026 and the state has said a new policy is coming. Odisha’s 2022 policy is the other incentive regime in the region.',
    [
        'Kolkata had 22 MW operational, 13 MW under construction and 71 MW planned in H1 2026, with 19.4% vacancy (Cushman & Wakefield).',
        'New Town holds 18 MW and Salt Lake 4 MW. NTT has inaugurated a 40 MW facility in the city.',
        'West Bengal Data Centre Policy 2021 (notified 6 September 2021): essential services classification, 100% stamp duty exemption, 5-year electricity duty waiver, FAR 3.0 plus 1.0 purchasable.',
        'The government lists West Bengal, Andhra Pradesh, Madhya Pradesh and Chhattisgarh as emerging data centre states.',
    ],
    [
        sec('kolkata-key-facts', 'Kolkata data centre market: key facts (H1 2026)',
            table(['Item', 'Figure and period'], [
                ['Operational capacity', '22 MW in 6 data centres, about 2% of top seven cities (Cushman & Wakefield, H1 2026)'],
                ['Under construction and planned', '13 MW under construction; 71 MW planned'],
                ['Colocation vacancy', '19.4%'],
                ['Sub-markets', 'New Town 18 MW; Salt Lake 4 MW'],
                ['Cables', 'Cushman & Wakefield reports a cable landing station under construction at Tajpur'],
                ['State policy', 'West Bengal Data Centre Policy 2021, five-year term to about September 2026; new policy announced as in preparation'],
                ['Physical risk note', 'Seismic Zone III; Bay of Bengal cyclone exposure'],
            ], 'cw26', 'wb-policy', 'wb-new', 'is1893'),
            p('Cushman & Wakefield attributes Kolkata’s demand to government and small and medium enterprises. Status reports on the Tajpur and Digha landing stations conflict, so treat east-coast cable capacity from Bengal as future rather than current.', 'cw26')),
        sec('kolkata-sub-markets', 'Sub-markets and operators',
            p('New Town (Rajarhat) holds most of the city’s capacity, with Salt Lake Sector V the older IT district. NTT has inaugurated a 40 MW facility in Kolkata. The government told the Rajya Sabha in August 2026 that West Bengal is one of four emerging data centre states.', 'cw26', 'ntt-kol', 'pib-cap')),
        sec('kolkata-policy', 'West Bengal Data Centre Policy 2021 and what follows',
            ul([
                'Notification No. 490-Estt/ITE-18011/2/2021 dated 6 September 2021, operative for five years or until replaced.',
                '100% stamp duty and registration fee exemption; electricity duty waiver for five years from commercial operation; data centre power treated as industrial.',
                'Dual power grid networks; FAR of 3.0 plus 1.0 purchasable and up to 60% ground coverage; self-certification under notified Acts.',
                'Clause 5.3: data centre organisations classified as essential services.',
            ], 'wb-policy'),
            p('The five-year term ended around September 2026. In May 2026 the state’s new leadership said a new data centre policy was being prepared. Until it is notified, check with the IT and Electronics Department and Webel which terms apply to a new project.', 'wb-new')),
        sec('kolkata-east-india', 'East India beyond Kolkata: Odisha and Bhubaneswar',
            p('Odisha’s State Data Centre Policy 2022, run by OCAC, offers a capital subsidy of 20% of fixed capital investment (excluding land) up to Rs 25 crore per unit, stamp duty exemption, electricity duty and inspection fee exemption for 10 years up to 5 MVA, a 30% power bill subsidy for 5 years up to Rs 2 crore, net SGST reimbursement for 7 years, and reimbursement of transmission and wheeling charges on captive renewable power. Yotta lists Bhubaneswar as a planned edge location.', 'od-policy', 'yotta-dc')),
        sec('kolkata-risks', 'Site risks in Kolkata',
            ul([
                'Seismic: Kolkata is Zone III (zone factor 0.16) under the IS 1893 (Part 1) town list (2002 edition, zones retained in 2016).',
                'Cyclone and flood: the Bay of Bengal coast is cyclone-exposed, and low-lying plots need a drainage and elevation check.',
                'Airport: Netaji Subhas Chandra Bose International Airport is close to New Town; height NOCs apply within 20 km, or 56 km for instrument airports.',
            ], 'is1893', 'aai'),
            p(SCREEN + 'In Kolkata the policy status and the substation serving New Town are the first two checks.')),
    ],
    [
        faq('How much data centre capacity is in Kolkata?', 'Cushman & Wakefield counted 22 MW operational in H1 2026 across six facilities, with 13 MW under construction and 71 MW planned.', 'cw26'),
        faq('Where are the data centres in Kolkata?', 'New Town (18 MW) and Salt Lake (4 MW), per Cushman & Wakefield. NTT has inaugurated a 40 MW facility in the city.', 'cw26', 'ntt-kol'),
        faq('Is the West Bengal data centre policy still valid?', 'The 2021 policy was operative for five years from 6 September 2021. The state said in May 2026 that a new policy was in preparation; confirm current terms before relying on them.', 'wb-policy', 'wb-new'),
        faq('Is Kolkata a good place for a data center?', 'For government and East India workloads, yes, with a small market (22 MW in H1 2026). Large loads will want confirmed policy terms and a named substation first.', 'cw26'),
        faq('Are data centres essential services in West Bengal?', 'Clause 5.3 of the West Bengal Data Centre Policy 2021 classifies data centre organisations under essential services.', 'wb-policy'),
    ],
    pick('cw26', 'wb-policy', 'wb-new', 'is1893', 'ntt-kol', 'pib-cap', 'od-policy', 'yotta-dc', 'aai'),
    ['data-centres-in-india', 'west-bengal-data-centre-policy', 'odisha-data-centre-policy', 'power-for-data-centres-india'],
    minutes=6,
))
