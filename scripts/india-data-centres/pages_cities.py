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
# Added in fact-check (cities1)
S('jewar-pti', 'Height restrictions put in place within 20 km radius of Noida airport', 'https://theprint.in/india/height-restrictions-put-in-place-within-20-km-radius-of-noida-airport/2687943/', 'ThePrint (PTI)')
S('hyd-2020-rain', 'At 324 mm, Greater Hyderabad scores one-day maximum after 20 years', 'https://timesofindia.indiatimes.com/city/hyderabad/at-324-mm-greater-hyd-scores-one-day-maximum-after-20-years/articleshow/78670445.cms', 'The Times of India')
S('hyd-2020-toll', 'Telangana rains: death toll goes up to 70', 'https://timesofindia.indiatimes.com/city/hyderabad/telangana-rains-death-toll-goes-up-to-70-government-on-alert-with-fresh-spell-forecast/articleshow/78749477.cms', 'The Times of India')
S('mh-green-nb', 'Maharashtra approves 20 green data centre parks (GR of 9 June 2026)', 'https://navbharatlive.com/maharashtra/mumbai/maharashtra-green-data-center-policy-mumbai-investment-boost-1789957.html/amp', 'Navbharat Live')
S('crisil-dh', 'India set for five times surge in its data centre capacity by 2030 (Crisil Ratings)', 'https://www.deccanherald.com/business/india-set-for-five-times-surge-in-its-data-centre-capacity-by-2030-4205631', 'Deccan Herald')

# Added by city fact-check (Pune, Visakhapatnam, Gujarat, Kolkata)
S('mh-ed', 'Notification No. CEI-2025/CR-158/Energy-1 of 22 June 2026 under the Maharashtra Electricity Duty Act, 2016', 'https://simpliance.in/download/file/dXBsb2Fkcy9nb3Z0bm90aWZpY2F0aW9uL05vdGlmaWNhdGlvbiByZWdhcmRpbmcgRXhlbXB0aW9uIGZyb20gUGF5bWVudCBvZiBFbGVjdHJpY2l0eSBEdXR5IHRvIElUIGFuZCBJVEVTIGFuZCBEYXRhIENlbnRyZSBVbml0cyB1bmRlciB0aGUgSW5mb3JtYXRpb24gVGVjaG5vbG9neSBhbmQgSW5mb3JtYXRpb24ucGRm', 'Government of Maharashtra (gazette copy via Simpliance)')
S('iba-green', 'Green data centres in India: policy meets practice', 'https://www.ibanet.org/green-data-centres-in-India-policy-meets-practice', 'International Bar Association')
S('sify-print', 'Andhra minister Nara Lokesh lays foundation for Sify’s Rs 1,500 cr AI edge data center in Vizag', 'https://theprint.in/india/andhra-minister-nara-lokesh-lays-foundation-for-sifys-rs-1500-cr-ai-edge-data-center-in-vizag/2762491/', 'ThePrint (PTI)')
S('aic-google', 'Announcing America-India Connect and new investments to advance global AI access', 'https://blog.google/intl/en-in/company-news/announcing-america-india-connect-and-new-investments-to-advance-global-ai-access/', 'Google')
S('crisil-dd', 'India’s data centre capacity set for 5x surge by 2030 (Crisil Ratings)', 'https://ddindia.co.in/2026/11/indias-data-centre-capacity-set-for-5x-surge-by-2030/', 'DD India')
S('gc-jam-tc', 'Billionaire Ambani taps Google, Meta to build India’s AI backbone', 'https://techcrunch.com/2025/08/29/billionaire-ambani-taps-google-meta-to-build-indias-ai-backbone/', 'TechCrunch')
S('dholera-air', 'Gujarat signs agreement with Larsen & Toubro Vyoma to build AI data center in Dholera', 'https://www.newsonair.gov.in/gujarat-signs-agreement-with-larsen-toubro-vyoma-to-build-ai-data-center-in-dholera/', 'All India Radio News')

RELATED_CITY = ['data-centres-in-india', 'mumbai-vs-chennai-vs-hyderabad-data-centres', 'power-for-data-centres-india']

SCREEN = ('Invariant checks the evidence behind a site’s power (the DISCOM or transmission connection, the open access route, '
          'the nearest substations and what else is queued on them), screens seismic zone, flood history, groundwater status and '
          'airport height limits, and lists the central and state approvals the project needs with the authority behind each one. ')

ARTICLES = []

# ─────────────────────────────── Mumbai ───────────────────────────────
ARTICLES.append(article(
    'data-centres-in-mumbai',
    'Data centres in Mumbai and Navi Mumbai: capacity, sub-markets and power (2026)',
    'Mumbai had 890 MW of operational data centre capacity in H1 2026, most of it on Thane-Belapur Road in Navi Mumbai, where grid allocation is now the constraint.',
    'Mumbai, Maharashtra, India',
    'Mumbai had 890 MW of operational data centre capacity in H1 2026, about 50% of India’s top seven cities, according to Cushman & Wakefield. That makes Mumbai India’s largest data centre market, and the same count shows 281 MW under construction and 1,445 MW planned. Thane-Belapur Road in Navi Mumbai holds 675 MW of it, and the city has 13 cable landing stations. Structure Research reports that MSEDCL has allocated about 6 GW of grid capacity to Navi Mumbai data centres, that committed and under-construction capacity is approaching that figure, and that new builds are moving to Panvel, Taloja and Rasayani.',
    [
        'Mumbai had 890 MW operational, 281 MW under construction and 1,445 MW planned in H1 2026, according to Cushman & Wakefield. Savills counts 846 MW of IT load, 46% of India.',
        'Thane-Belapur Road holds 675 MW of Mumbai’s capacity at 4.4% colocation vacancy, and Powai holds 176 MW (Cushman & Wakefield, H1 2026). Structure Research reports new builds moving to Panvel, Taloja and Rasayani.',
        'Structure Research reports that committed capacity is approaching the roughly 6 GW grid allocation for Navi Mumbai data centres, so power evidence is the first check on any Mumbai site.',
        'Navi Mumbai International Airport began commercial operations on 25 December 2025.',
    ],
    [
        sec('mumbai-key-facts', 'Mumbai data centre market: key facts (H1 2026)',
            table(['Item', 'Figure and period'], [
                ['Operational capacity', '890 MW, about 50% of the top seven cities (Cushman & Wakefield, H1 2026); 846 MW IT, 46% of India (Savills, H1 2026)'],
                ['Under construction and planned', '281 MW under construction; 1,445 MW planned (Cushman & Wakefield, H1 2026)'],
                ['Share of upcoming supply', '45% of 3,860 MW upcoming in the top seven cities, H2 2026 to 2030 (Cushman & Wakefield)'],
                ['Colocation vacancy', '7.9% city-wide; 4.4% on Thane-Belapur Road (Cushman & Wakefield, H1 2026)'],
                ['Facilities', '54 data centres (Cushman & Wakefield, H1 2026)'],
                ['Cable landing stations', '13, with 2 more scheduled for completion in 2026 (Cushman & Wakefield)'],
                ['State policy', 'Maharashtra IT/ITES Policy 2023 data centre incentives; Integrated Green Data Centre Parks, expanded from 3 to 20 parks by a June 2026 GR (Fox Mandal, via the International Bar Association)'],
                ['Grid note', 'About 6 GW allocated by MSEDCL to Navi Mumbai data centres, with committed capacity approaching it (Structure Research, 2026)'],
                ['Physical risk note', 'Seismic Zone III (IS 1893 Part 1:2002); 944 mm of rain on 26 July 2005, a 24-hour record for the city (NOAA)'],
            ], 'cw26', 'savills', 'structure', 'mh-it', 'iba-green', 'is1893', 'mum-2005'),
            p('Mumbai capacity estimates differ by method. Cushman & Wakefield counts colocation and hyperscale cloud capacity in the top seven cities. Savills counts IT load. Anarock gives 812 MW IT across 54 facilities for Mumbai-MMR. Use one publisher consistently when comparing periods.', 'cw26', 'savills', 'anarock'),
            p('Mumbai took about 83% of capacity added across the top seven cities in H1 2026 (148 MW), and Cushman & Wakefield expects the city to cross 1 GW of operational capacity by the end of 2026. According to Tele.net, the Mumbai Metropolitan Region handles around 95% of India’s international bandwidth.', 'cw26', 'tele-cable')),
        sec('mumbai-sub-markets', 'Mumbai data centre sub-markets: Thane-Belapur Road, Powai, Panvel, Taloja and Palava',
            table(['Sub-market', 'Operational', 'Vacancy', 'Pipeline'], [
                ['Thane-Belapur Road', '675 MW in 35 data centres', '4.4%', '241 MW under construction, 995 MW planned, 2,286 MW early stage'],
                ['Powai', '176 MW in 31 data centres', '13.1%', '40 MW under construction, 185 MW planned, 171 MW early stage'],
                ['Panvel', '22 MW in 2 data centres', '56.4%', '75 MW planned, 75 MW early stage'],
            ], 'cw26'),
            p('Anarock describes Navi Mumbai (Airoli, Ghansoli, Rabale, Mahape and Panvel) as the largest concentration of hyperscale and colocation data centres, and the Chandivali and Powai-Andheri (E) corridor as a major interconnection hub. Equinix opened MB3 in Chandivali, Powai, in April 2026 with an initial investment of over US$95 million. Anarock names Dombivali and Taloja as an emerging lower-cost hyperscale corridor.', 'anarock', 'equinix-mb3'),
            p('Yotta’s NM1 at Panvel has 52 MW of IT load in a park it says can scale to 1 GW. AdaniConneX lists 1,000 MW of potential capacity in Navi Mumbai, and CoreWeave plans a 240 MW deployment at AdaniConneX’s Taloja campus, with the first phase expected in mid-2028. Digital Edge plans a 400 MW Navi Mumbai campus. STT GDC broke ground at Palava with an initial 50 MW on 46 acres, designed to scale to about 400 MW.', 'yotta-dc', 'adaniconnex', 'coreweave', 'digitaledge', 'stt-palava')),
        sec('mumbai-power', 'Power for Mumbai data centres: the Navi Mumbai grid allocation',
            p('Structure Research reports that MSEDCL has allocated about 6 GW of grid capacity to data centres in Navi Mumbai and that committed and under-construction capacity is approaching that figure. New builds are moving to Panvel, Taloja and Rasayani, where separate substations can be commissioned. The same report notes a Maharashtra framework from October 2025 that lets data centre parks generate and distribute their own power.', 'structure'),
            p('Crisil Ratings estimates that by fiscal 2030 data centre capacity in Mumbai could equal about 60% of the city’s current peak power demand. That is the scale problem a new site has to answer: a firm date for a large load needs a named substation, a transmission plan and a connection agreement.', 'crisil-dh'),
            p('Under MERC’s Supply Code, 33 kV supply covers contract demand up to 10,000 kVA, or 20,000 kVA in a Metropolitan Area or on an express feeder; larger loads connect at extra high voltage. A connection that needs a new distribution substation has a one-year standard. Multiple sources of supply can be provided if the consumer asks and it is technically feasible, with the extra cost borne by the consumer.', 'merc-sop'),
            p('MERC’s March 2025 tariff order classified data centres in the industrial category, with the same rebates and incentives, and approved a 10% discount in wheeling charges for data centres on 100% green power. Construction World reported in October 2025 that the state industries department had notified 25 areas in Kurla, Chandivali, Marol, Thane, Navi Mumbai and Panvel as designated data centre parks and units with deemed distribution licences.', 'merc-myt', 'mh-dl'),
            p('Maharashtra’s IT/ITES Policy 2023 gives new data centre units outside Zone I a Rs 1 per unit tariff subsidy for 5 years, and a notification of 22 June 2026 exempts data centre units from electricity duty for 20 years. According to a Fox Mandal analysis published by the International Bar Association, a June 2026 government resolution amended the Integrated Green Data Centre Parks policy: at least 51% green power for core operations, and a Rs 1 per unit tariff subsidy for 10 or 20 years depending on investment size.', 'mh-it', 'mh-ed', 'iba-green')),
        sec('mumbai-land', 'Data centre land prices and approvals in Mumbai',
            p('Anarock benchmarks land at Rs 35 to 60 crore per acre for 5 to 10 MW facilities in Mumbai-MMR suburbs and Rs 3 to 10 crore per acre for 100 to 500 MW parks in locations such as Navi Mumbai. Recent deals show the spread. Communications Today reported that STT GDC paid Rs 282 crore for a 14,093 sq m plot (about 3.5 acres) with an existing building in the TTC Industrial Area in May 2026. DCD reported in 2024 that AWS bought 38.18 acres from Lodha at Palava for more than Rs 450 crore.', 'anarock', 'stt-nm', 'aws-lodha'),
            p('Building approvals include state environmental clearance. Nxtra’s Mahape expansion in the TTC Industrial Area, with two data centre buildings, two generator buildings and a substation building and 76,930 sq m of total built-up area, received its clearance from SEIAA Maharashtra on 21 November 2025.', 'nxtra-ec'),
            p('Maharashtra’s IT/ITES Policy 2023 gives a 100% stamp duty exemption on land or premises for new or expanded data centres and allows data centres in any zone.', 'mh-it')),
        sec('mumbai-risks', 'Data centre site risks in Mumbai: seismic zone, flooding and airport height limits',
            ul([
                'Seismic: Mumbai and Thane are Zone III (zone factor 0.16) in the IS 1893 (Part 1):2002 town list.',
                'Flood: 944 mm of rain fell on Mumbai on 26 July 2005, breaking the city’s 24-hour record and causing massive flooding (NOAA). Low-lying plots need a site-level drainage and flood check.',
                'Airports: AAI height NOCs apply up to 20 km from VFR airports and 56 km from IFR airports, measured from the aerodrome reference point; where a colour-coded zoning map exists, local bodies can approve heights below its limit. Navi Mumbai International Airport began commercial operations on 25 December 2025.',
            ], 'is1893', 'mum-2005', 'aai', 'nmia'),
            p(SCREEN + 'In Mumbai the first question is which substation serves the plot and how much of its allocation is already committed.')),
    ],
    [
        faq('How much data centre capacity does Mumbai have?', 'Mumbai had 890 MW of operational data centre capacity in H1 2026, about half of India’s top seven cities, according to Cushman & Wakefield. The same count shows 281 MW under construction and 1,445 MW planned. Savills counted 846 MW of IT load.', 'cw26', 'savills'),
        faq('Where are the data centres in Navi Mumbai?', 'Most Navi Mumbai data centre capacity is on Thane-Belapur Road, which holds 675 MW according to Cushman & Wakefield. Structure Research reports new builds moving to Panvel, Taloja and Rasayani, and STT GDC has broken ground at Palava, in the wider Mumbai region outside Navi Mumbai.', 'cw26', 'structure', 'stt-palava'),
        faq('Is power a constraint for data centres in Navi Mumbai?', 'Yes. Structure Research reports that committed and under-construction capacity is approaching the roughly 6 GW grid allocation for Navi Mumbai data centres, and new builds are moving to locations where separate substations can be commissioned.', 'structure'),
        faq('Why is Mumbai India’s biggest data center market?', 'Cushman & Wakefield attributes Mumbai’s lead to its 13 cable landing stations, with two more due in 2026, power availability and fibre connectivity. Tele.net reports that the region handles around 95% of India’s international bandwidth.', 'cw26', 'tele-cable'),
        faq('How much does data centre land cost in Mumbai?', 'Anarock puts land for 5 to 10 MW facilities in the Mumbai-MMR suburbs at Rs 35 to 60 crore per acre, and land for 100 to 500 MW parks in locations such as Navi Mumbai at Rs 3 to 10 crore per acre. Individual deals vary with the buildings and power on the plot.', 'anarock'),
        faq('Which companies are building data centres in Navi Mumbai?', 'Yotta, AdaniConneX, CoreWeave, Digital Edge and STT GDC have projects in Navi Mumbai and the wider Mumbai region. Yotta’s NM1 at Panvel has 52 MW of IT load; CoreWeave plans a 240 MW deployment at AdaniConneX’s Taloja campus, with the first phase expected in mid-2028; Digital Edge plans a 400 MW campus; and STT GDC broke ground at Palava with an initial 50 MW.', 'yotta-dc', 'adaniconnex', 'coreweave', 'digitaledge', 'stt-palava'),
    ],
    pick('cw26', 'savills', 'structure', 'mh-ed', 'iba-green', 'is1893', 'mum-2005', 'anarock', 'tele-cable', 'equinix-mb3', 'yotta-dc', 'adaniconnex', 'coreweave', 'digitaledge', 'stt-palava', 'crisil-dh', 'merc-sop', 'merc-myt', 'mh-dl', 'mh-it', 'stt-nm', 'aws-lodha', 'nxtra-ec', 'aai', 'nmia'),
    ['data-centres-in-india', 'maharashtra-data-centre-policy', 'mumbai-vs-chennai-vs-hyderabad-data-centres', 'power-for-data-centres-india', 'data-centres-in-pune'],
    minutes=8,
))

# ─────────────────────────────── Chennai ───────────────────────────────
ARTICLES.append(article(
    'data-centres-in-chennai',
    'Data centres in Chennai: capacity, Ambattur, Siruseri and flood risk (2026)',
    'Chennai had 214 MW of operational data centre capacity in H1 2026 (Cushman & Wakefield), mostly in Ambattur and Siruseri, with 26.7% vacancy and flood risk.',
    'Chennai, Tamil Nadu, India',
    'Chennai had 214 MW of operational data centre capacity in H1 2026 across 18 facilities, about 12% of India’s top seven cities, according to Cushman & Wakefield. Chennai is India’s second-largest data centre market by both Cushman & Wakefield’s and Savills’ counts; Savills puts it at 320 MW IT. Colocation vacancy was 26.7% after significant new supply. Most capacity is in Ambattur in the west and Siruseri on the OMR. The city has 7 cable landing stations with 2 under construction. Tamil Nadu’s Data Centre Policy 2021 applies to data centres incorporated from 1 April 2021 until 31 March 2026.',
    [
        'Chennai had 214 MW operational, 55 MW under construction and 313 MW planned in H1 2026 (Cushman & Wakefield). Savills counts 320 MW IT; Anarock 298 MW IT.',
        'Chennai’s colocation vacancy was 26.7% in H1 2026, against 7.9% in Mumbai, and Siruseri’s was 41.7% (Cushman & Wakefield).',
        'Tamil Nadu’s 2021 policy applies to data centres incorporated from 1 April 2021 to 31 March 2026. Check what applies to a later project before relying on any incentive.',
        'Chennai’s Meenambakkam station recorded 1,178.3 mm of rain in November 2015, its all-time record monthly total for November (India Meteorological Department).',
    ],
    [
        sec('chennai-key-facts', 'Chennai data centre market: key facts (H1 2026)',
            table(['Item', 'Figure and period'], [
                ['Operational capacity', '214 MW, about 12% of top seven cities (Cushman & Wakefield, H1 2026); 320 MW IT, 18% of India (Savills, H1 2026)'],
                ['Under construction and planned', '55 MW under construction; 313 MW planned (Cushman & Wakefield)'],
                ['Added in H1 2026', '8 MW (Cushman & Wakefield)'],
                ['Colocation vacancy', '26.7% (Cushman & Wakefield, H1 2026)'],
                ['Facilities', '18 data centres (Cushman & Wakefield)'],
                ['Cable landing stations', '7 existing, 2 under construction (Cushman & Wakefield)'],
                ['State policy', 'Tamil Nadu Data Centre Policy 2021, for data centres incorporated 1 April 2021 to 31 March 2026'],
                ['Physical risk note', 'Seismic Zone III (IS 1893 Part 1:2002); November 2015 record rainfall at Meenambakkam'],
            ], 'cw26', 'savills', 'tn-policy', 'is1893', 'imd-chn'),
            p('Chennai capacity counts differ by method: Cushman & Wakefield counts colocation and hyperscale cloud capacity; Savills counts IT load; Anarock gives 298 MW IT across 25 facilities and forecasts 900 MW by 2030. Tamil Nadu’s 2021 policy says the state has the second-highest number of submarine cable landing stations in India.', 'cw26', 'savills', 'anarock', 'tn-policy'),
            p('Cushman & Wakefield attributes Chennai’s high vacancy largely to significant supply entering the market in recent quarters, notes a large GPU deployment by a neocloud provider in H1 2026, and expects hyperscaler and neocloud deployments to raise occupancy. JLL says Chennai accounted for 50% of India’s H1 2026 supply additions in its count.', 'cw26', 'jll')),
        sec('chennai-sub-markets', 'Chennai data centre sub-markets: Ambattur, Siruseri and the Sriperumbudur corridor',
            table(['Sub-market', 'Operational', 'Vacancy', 'Pipeline'], [
                ['Ambattur', '92 MW in 6 data centres', '12.1%', '42 MW under construction, 124 MW planned, 548 MW early stage'],
                ['Siruseri', '104 MW in 9 data centres', '41.7%', '14 MW under construction, 171 MW planned, 141 MW early stage'],
            ], 'cw26'),
            p('Ambattur, in the city’s west, is where large new buildings are going. CapitaLand Data Centre Chennai 01 in Ambattur, with 34 MW of IT capacity, is due for completion by the end of 2026. Lumina CloudInfra, which AirTrunk has acquired, bought 16 acres in Ambattur for a campus with an initial 216 MW of IT load. Siruseri hosts Equinix CN1, opened in September 2025 with 800 cabinets of initial capacity, and campuses from STT GDC and Sify.', 'capitaland-chn', 'lumina-chn', 'cw26', 'equinix-cn1', 'stt-chn', 'sify-site'),
            p('Anarock identifies the Oragadam industrial belt and the Parandur-Sriperumbudur corridor as the emerging and long-term growth zone, with larger and cheaper land. Digital Connexion, the Reliance, Brookfield and Digital Realty joint venture, launched its first Chennai campus in January 2024 with capacity for up to 100 MW of critical IT load.', 'anarock', 'dcx')),
        sec('chennai-power', 'Power for Chennai data centres and the Tamil Nadu policy after March 2026',
            p('Tamil Nadu’s Data Centre Policy 2021 gave incentives to projects investing above Rs 500 crore that meet at least 30% of their energy use from renewable sources. It offered a 100% electricity tax subsidy for 5 years, open access charges at 50% of the conventional charge, a concessional cross subsidy surcharge, dual power from two grids for sanctioned loads of 50 MW or more, and an additional feeder above 100 MW.', 'tn-policy'),
            p('Under the Tamil Nadu supply rules, loads from 10 MVA up to 50 MVA are supplied at 110 kV and loads above 50 MVA at 230 kV. TNERC’s tariff order of June 2025 sets HT-I (industries, factories and IT services, which include data centres) at Rs 7.50 per kWh and Rs 608 per kVA per month from 1 July 2025; check for later revisions.', 'tn-supply', 'tnerc'),
            p('The Tamil Nadu policy applies to data centres incorporated from 1 April 2021 until 31 March 2026. Projects incorporated after that date should not assume these terms apply. ELCOT drafted the policy; confirm with the state what is available now, and get it in writing.', 'tn-policy')),
        sec('chennai-land', 'Data centre land prices in Chennai',
            p('Anarock’s national benchmarks put land for 10 to 30 MW facilities at Rs 5 to 20 crore per acre, varying by state and zone, and land for 100 to 500 MW parks, in locations including outer Chennai, at Rs 3 to 10 crore per acre. Lumina’s 16 acres in Ambattur were reported at over Rs 500 crore in January 2026.', 'anarock', 'lumina-chn'),
            p('SIPCOT and ELCOT industrial land and private land follow different routes. Whether a separate land-use conversion is needed depends on the parcel; confirm it with the allotting agency or district authority before signing.')),
        sec('chennai-risks', 'Data centre site risks in Chennai: flood, cyclone and water',
            ul([
                'Flood: Meenambakkam recorded 1,178.3 mm in November 2015, its all-time record monthly total for November. During Cyclone Michaung, Meenambakkam received 415 mm from 3 December to 1.30 pm on 4 December 2023, per The News Minute.',
                'Seismic: Chennai is Zone III (zone factor 0.16) in the IS 1893 (Part 1):2002 town list.',
                'Heat: the 1991 to 2020 mean daily maximum at Meenambakkam is 37.3 degrees C in May, which sets the cooling design point.',
                'Water: SBI names Bengaluru, Chennai and Gurugram as water-stressed metros where data centre water use is under scrutiny. Under CGWA guidelines, new industries other than MSMEs cannot get groundwater NOCs in over-exploited assessment units.',
            ], 'imd-chn', 'michaung', 'is1893', 'sbi', 'cgwa'),
            p(SCREEN + 'In Chennai, plot elevation and drainage relative to the 2015 and 2023 flood extents come before anything else.')),
    ],
    [
        faq('How much data centre capacity does Chennai have?', 'Chennai had 214 MW of operational data centre capacity in H1 2026, according to Cushman & Wakefield, with 55 MW under construction and 313 MW planned. Savills counted 320 MW IT and Anarock 298 MW IT.', 'cw26', 'savills', 'anarock'),
        faq('Where are the data centres in Chennai?', 'Chennai’s data centres are mainly in Siruseri (104 MW) and Ambattur (92 MW), per Cushman & Wakefield’s H1 2026 count. Anarock names the Oragadam and Parandur-Sriperumbudur corridors as the emerging zone for large campuses.', 'cw26', 'anarock'),
        faq('Is the Tamil Nadu data centre policy still in force?', 'Tamil Nadu’s Data Centre Policy 2021 applies to data centres incorporated from 1 April 2021 to 31 March 2026. For a project incorporated later, check current terms with the state before relying on them.', 'tn-policy'),
        faq('Why is Chennai good for a data center?', 'Chennai’s draw is its cable landing stations, according to Cushman & Wakefield: seven existing and two under construction, which have driven demand from colocation and hyperscale cloud providers. The trade-off is flood exposure, shown by the November 2015 record rainfall.', 'cw26', 'imd-chn'),
        faq('Why is data centre vacancy high in Chennai?', 'Cushman & Wakefield attributes Chennai’s high vacancy largely to significant recent supply. Vacancy was 26.7% in H1 2026, with Siruseri at 41.7%, and the firm expects hyperscaler and neocloud deployments to raise occupancy.', 'cw26'),
    ],
    pick('cw26', 'savills', 'tn-policy', 'tn-supply', 'tnerc', 'is1893', 'imd-chn', 'anarock', 'jll', 'capitaland-chn', 'lumina-chn', 'equinix-cn1', 'stt-chn', 'sify-site', 'dcx', 'michaung', 'sbi', 'cgwa'),
    ['data-centres-in-india', 'tamil-nadu-data-centre-policy', 'mumbai-vs-chennai-vs-hyderabad-data-centres', 'power-for-data-centres-india', 'data-centre-seismic-flood-risk-india'],
    minutes=7,
))

# ─────────────────────────────── Hyderabad ───────────────────────────────
ARTICLES.append(article(
    'data-centres-in-hyderabad',
    'Data centres in Hyderabad: capacity, hyperscalers and power (2026)',
    'Hyderabad had 151 MW of operational data centre capacity in H1 2026 and India’s second-largest pipeline after Mumbai, with AWS and Microsoft cloud regions.',
    'Hyderabad, Telangana, India',
    'Hyderabad had 151 MW of operational data centre capacity in H1 2026, about 8% of India’s top seven cities, according to Cushman & Wakefield. The same count gives Hyderabad 668 MW planned and 18% of all upcoming supply to 2030, the second-largest pipeline after Mumbai. AWS launched its Hyderabad region in November 2022 and has started a greenfield campus at Bharat Future City, and Microsoft launched its India South Central region in Hyderabad on 21 September 2026. Telangana adopted a dedicated data centre policy in 2016, and officials have cited about 5 GW by 2029 or 2030.',
    [
        'Hyderabad had 151 MW operational, 42 MW under construction and 668 MW planned in H1 2026 (Cushman & Wakefield).',
        'South Hyderabad holds 92 MW at 0% colocation vacancy, with 1,758 MW at early stage; West Hyderabad holds 59 MW (Cushman & Wakefield, H1 2026).',
        'Knight Frank puts the committed and early-stage pipeline at about 1.9 GW and says AWS holds 46% of live IT capacity.',
        'Hyderabad is Seismic Zone II, the lowest zone in the IS 1893 (Part 1):2002 scheme. The main recent hazard event was the October 2020 flood, when Greater Hyderabad recorded 324 mm of rain in 24 hours (Times of India).',
    ],
    [
        sec('hyderabad-key-facts', 'Hyderabad data centre market: key facts (H1 2026)',
            table(['Item', 'Figure and period'], [
                ['Operational capacity', '151 MW, about 8% of top seven cities (Cushman & Wakefield, H1 2026); 151.4 MW at end 2025 (Knight Frank)'],
                ['Under construction and planned', '42 MW under construction; 668 MW planned (Cushman & Wakefield)'],
                ['Share of upcoming supply', '18% of 3,860 MW in the top seven cities to 2030, second to Mumbai (Cushman & Wakefield)'],
                ['Colocation vacancy', '28.0% (Cushman & Wakefield, H1 2026); 23% average in 2025 (Knight Frank)'],
                ['Hyperscale regions', 'AWS Asia Pacific (Hyderabad), launched 22 November 2022; Microsoft India South Central, launched 21 September 2026'],
                ['State policy', 'Dedicated data centre policy since 2016 (Cushman & Wakefield); about 5 GW by 2029 (Deccan Chronicle) or 2030 (Commissioner of Industries, ANI)'],
                ['Grid note', 'Crisil Ratings: data centre capacity could equal about 20% of Hyderabad’s current peak demand by fiscal 2030'],
                ['Physical risk note', 'Seismic Zone II (IS 1893 Part 1:2002); October 2020 floods'],
            ], 'cw26', 'kf-hyd', 'aws-hyd', 'ms-hyd', 'cw25', 'tg-5gw', 'tg-dc', 'crisil-dh', 'is1893', 'hyd-2020-rain'),
            p('Hyderabad capacity baselines differ. Cushman & Wakefield and Knight Frank both put the city at about 151 MW. Deccan Chronicle reported the state government citing 300 MW operating across its hyperscale and AI infrastructure ecosystem, a figure on a different basis.', 'cw26', 'kf-hyd', 'tg-dc')),
        sec('hyderabad-sub-markets', 'Hyderabad data centre sub-markets: the southern ORR belt, HITEC City and Bharat Future City',
            table(['Sub-market', 'Operational', 'Vacancy', 'Pipeline'], [
                ['South Hyderabad', '92 MW in 3 data centres', '0.0%', '39 MW under construction, 634 MW planned, 1,758 MW early stage'],
                ['West Hyderabad', '59 MW in 8 data centres', '28.0%', '3 MW under construction, 34 MW planned'],
            ], 'cw26'),
            p('Anarock calls the southern outer ring road belt through Maheshwaram, Shamshabad and Tukkuguda the primary hyperscale growth corridor, and HITEC City and Gachibowli the established enterprise and colocation hub, where land scarcity is driving multi-storey builds. CtrlS plans a 40-acre park at Chandanvelly Industrial Park with over 600 MW of potential IT load and 250 MW of sanctioned power for phase one.', 'anarock', 'ctrls-hyd'),
            p('Anarock names Kongara Kalan and Bharat Future City as the next-generation expansion zone. Cushman & Wakefield reports that AWS has started a greenfield data centre at Bharat Future City, expected live in 2028, and ThePrint reported that the state allocated 202 acres in Bharat Future City and 98 acres in Chandanvelly to Amazon.', 'anarock', 'cw26', 'amazon-tg')),
        sec('hyderabad-power', 'Power for Hyderabad data centres: Telangana supply rules and tariffs',
            p('Crisil Ratings estimates that by fiscal 2030 data centre capacity in Hyderabad could equal about 20% of the city’s current peak power demand, a third of the share it projects for Mumbai. CtrlS reports 250 MW of sanctioned power for the first phase of its Chandanvelly park, an example of the document a buyer should ask to see.', 'crisil-dh', 'ctrls-hyd'),
            p('Telangana’s supply rules put contracted demand above 10,000 kVA on a common feeder, or above 20,000 kVA on a dedicated feeder, at 132 kV or above. Supply at 132 kV or above is through a dedicated feeder or a loop-in loop-out arrangement decided by TS Transco, and a consumer on a dedicated feeder pays the full cost of the service line. HT industrial supply at 132 kV and above was Rs 6.65 per kVAh with a Rs 500 per kVA monthly demand charge in the FY 2024-25 order; The Hans India reported no tariff hike for 2026-27.', 'tg-gtcs', 'tg-rst', 'tg-hans'),
            p('Cushman & Wakefield notes that Telangana was the first state to implement a dedicated data centre policy, in 2016. ThePrint reported that the state’s land allocations to Amazon came with incentives worth Rs 125 crore.', 'cw25', 'amazon-tg')),
        sec('hyderabad-risks', 'Data centre site risks in Hyderabad',
            ul([
                'Seismic: Hyderabad is Zone II (zone factor 0.10) in the IS 1893 (Part 1):2002 town list, the lowest zone in that scheme.',
                'Flood: on 13 October 2020 Greater Hyderabad and its outskirts recorded 324 mm of rain in 24 hours, per the Times of India. A state minister said 33 people died in the GHMC and adjoining areas. Low-lying plots need a drainage check.',
                'Groundwater: under CGWA guidelines, new industries other than MSMEs cannot get groundwater NOCs in over-exploited assessment units. Check the specific unit before relying on borewells.',
                'Airport: Anarock cites airport proximity as an advantage of the southern corridor. AAI height NOCs apply up to 20 km from VFR airports and 56 km from IFR airports.',
            ], 'is1893', 'hyd-2020-rain', 'hyd-2020-toll', 'cgwa', 'anarock', 'aai'),
            p(SCREEN + 'In Hyderabad the questions are which substation serves the corridor, what is already allocated on it, and the height surface over the plot.')),
    ],
    [
        faq('How much data centre capacity does Hyderabad have?', 'Hyderabad had 151 MW of operational data centre capacity in H1 2026, according to Cushman & Wakefield, with 42 MW under construction and 668 MW planned. Knight Frank put the committed and early-stage pipeline at about 1.9 GW.', 'cw26', 'kf-hyd'),
        faq('Where are the data centres in Hyderabad?', 'Hyderabad’s data centres sit in two Cushman & Wakefield sub-markets, South Hyderabad (92 MW) and West Hyderabad (59 MW). Anarock names the southern ORR belt through Maheshwaram, Shamshabad and Tukkuguda as the main hyperscale corridor and HITEC City and Gachibowli as the established hub.', 'cw26', 'anarock'),
        faq('Which hyperscalers have data centres in Hyderabad?', 'AWS launched its Hyderabad region in November 2022, and Microsoft launched its India South Central region in Hyderabad on 21 September 2026. Knight Frank says AWS holds 46% of live IT capacity.', 'aws-hyd', 'ms-hyd', 'kf-hyd'),
        faq('Does Telangana have a data center policy?', 'Telangana was the first state to implement a dedicated data centre policy, in 2016, according to Cushman & Wakefield. Officials have cited about 5 GW of capacity by 2029 or 2030.', 'cw25', 'tg-5gw', 'tg-dc'),
        faq('What is the earthquake risk for a data centre in Hyderabad?', 'Hyderabad is Seismic Zone II in the IS 1893 (Part 1):2002 town list, the lowest zone in that scheme. Flood drainage is the more relevant site check, given the October 2020 floods.', 'is1893', 'hyd-2020-rain'),
    ],
    pick('cw26', 'cw25', 'kf-hyd', 'aws-hyd', 'ms-hyd', 'tg-5gw', 'tg-dc', 'crisil-dh', 'is1893', 'hyd-2020-rain', 'hyd-2020-toll', 'anarock', 'ctrls-hyd', 'tg-gtcs', 'tg-rst', 'tg-hans', 'amazon-tg', 'cgwa', 'aai'),
    ['data-centres-in-india', 'telangana-data-centre-policy', 'mumbai-vs-chennai-vs-hyderabad-data-centres', 'power-for-data-centres-india', 'data-centres-in-visakhapatnam'],
    minutes=7,
))

# ─────────────────────────────── Noida / Delhi NCR ───────────────────────────────
ARTICLES.append(article(
    'data-centres-in-noida',
    'Data centres in Noida and Delhi NCR: Greater Noida, YEIDA and Gurugram (2026)',
    'Noida had 156 MW of the 183 MW of operational data centre capacity in Delhi NCR in H1 2026 (Cushman & Wakefield). UP’s 2026 policy and Jewar airport shape new sites.',
    'Delhi NCR, India',
    'Delhi NCR had 183 MW of operational data centre capacity in H1 2026, about 10% of India’s top seven cities, according to Cushman & Wakefield, and Noida held 156 MW of it in 12 facilities. NCR is India’s third data centre market on that count, with 360 MW planned; Gurugram has 18 MW. YEIDA lists a 100-acre Data Centre Park in Sector 28 on the Yamuna Expressway. The Uttar Pradesh Data Centre Policy 2026, notified on 9 July 2026, sets the incentives, and Noida International Airport, which began commercial operations on 15 June 2026, has advised that construction within 20 km needs an AAI height clearance.',
    [
        'Delhi NCR had 183 MW operational, 27 MW under construction and 360 MW planned in H1 2026; Noida had 156 MW and 1,247 MW at early stage (Cushman & Wakefield).',
        'UP Data Centre Policy 2026 (G.O. 536/78-2-2026, 9 July 2026): base FAR 3.0 plus 1.0 chargeable, 25% land subsidy in Paschimanchal including Gautam Buddha Nagar, 100% stamp duty exemption on land from government authorities.',
        'Delhi is Seismic Zone IV in IS 1893 (Part 1):2002, a higher design load than Mumbai or Chennai.',
        'Noida International Airport began commercial operations on 15 June 2026; its July 2025 advisory requires AAI height clearance for construction within 20 km.',
    ],
    [
        sec('noida-key-facts', 'Delhi NCR data centre market: key facts (H1 2026)',
            table(['Item', 'Figure and period'], [
                ['Operational capacity', '183 MW in 19 data centres, about 10% of top seven cities (Cushman & Wakefield, H1 2026); 191 MW IT (Savills)'],
                ['Noida', '156 MW in 12 data centres; 21 MW under construction; 223 MW planned; 1,247 MW early stage'],
                ['Gurugram', '18 MW in 2 data centres'],
                ['Colocation vacancy', '10.9% (Cushman & Wakefield, H1 2026)'],
                ['State policy', 'UP Data Centre Policy 2026, G.O. dated 9 July 2026'],
                ['Land', 'YEIDA Data Centre Park, Sector 28: 100 acres'],
                ['Physical risk note', 'Seismic Zone IV (Delhi, IS 1893 Part 1:2002); Noida International Airport height limits'],
            ], 'cw26', 'savills', 'up-go', 'yeida', 'is1893', 'noida-ap'),
            p('Anarock counts Delhi NCR at 179 MW IT across 18 facilities and forecasts 550 MW by 2030.', 'anarock')),
        sec('noida-sub-markets', 'Noida and NCR data centre sub-markets: Noida Expressway, Greater Noida, YEIDA and Gurugram',
            p('Anarock’s NCR data centre zones include the Noida Expressway corridor (Sectors 62, 132, 142, 143 and 150 to 167), the Greater Noida corridor (Knowledge Park, Tech Zone, Pari Chowk), the Yamuna Expressway and Jewar corridor under YEIDA, and the Gurugram-Manesar belt. Its project list includes Yotta’s Greater Noida campus, NTT in Sector 142, STT GDC in Sector 143, Sify in Sector 132 and AdaniConneX in Sectors 62 and 80. Yotta lists 30 MW of IT load at its D1 building in Greater Noida.', 'anarock', 'yotta-dc'),
            p('YEIDA lists a 100-acre Data Centre Park in Sector 28, the same sector as its Medical Devices Park. AdaniConneX lists 150 MW of potential capacity in Noida, and AM Green signed an MoU with Uttar Pradesh in January 2026 for a 1 GW AI data centre in the Greater Noida region, with first capacity targeted for 2028.', 'yeida', 'adaniconnex', 'amgreen')),
        sec('noida-policy', 'UP Data Centre Policy 2026: subsidies, FAR and power incentives',
            p('Uttar Pradesh notified its Data Centre Policy 2026 by G.O. 536/78-2-2026 dated 9 July 2026, repealing the 2021 policy. Parks are 40 MW or more; units are above 2 MW and below 40 MW. Parks get an interest subsidy with an overall ceiling of Rs 50 crore and a dual-grid subsidy; units get a capital subsidy with a ceiling of Rs 20 crore. Booster incentives can raise both ceilings.', 'up-go', 'up-page'),
            ul([
                'Land subsidy of 25% of prevailing sector rates on land from state agencies in Madhyanchal and Paschimanchal; Gautam Buddha Nagar is listed in Paschimanchal.',
                '100% stamp duty exemption on purchase or lease from a government authority, against a bank guarantee released at commencement of commercial operation.',
                'Base FAR 3.0 free plus 1.0 chargeable; basement parking, storage and DG set space sit outside FAR, rooftop chillers can be installed without counting in FAR, and ground coverage is up to 60% or as per byelaws.',
                'Units get a 100% electricity duty exemption for 10 years. Wheeling and transmission charges on intrastate purchase are 50% exempt (75% for renewable power from within the state), and 100% exempt on the intrastate system for interstate purchase, for 25 years, until the first eight parks or 2 GW.',
                'Data centres are classified as an essential service under ESMA, and the state agency assesses water availability before allotting land.',
            ], 'up-go'),
            p('Gurugram and Manesar are in Haryana, so Uttar Pradesh’s terms do not apply there. Compare both states’ terms for an NCR search; the right answer depends on load size and the power route.')),
        sec('noida-power-water', 'Power and water for data centres in Noida and NCR',
            p('Under the UP Supply Code, contracted loads above 10,000 kVA are supplied at 132 kV or 220 kV, and supply on an independent feeder depends on technical feasibility and bay or corridor availability at the substation. UPERC’s FY 2026-27 order prices HV-2 large and heavy power, which covers IT and ITeS units decided by the state through a policy notification, at Rs 6.10 per kVAh above 132 kV and Rs 6.40 above 66 kV up to 132 kV in urban areas, plus Rs 270 per kVA per month.', 'up-code', 'uperc'),
            p('The UP policy reimburses the cost of one grid in a dual-grid connection for parks and cuts wheeling and transmission charges, which matters for green open access contracts. Ask for the specific substation and the DISCOM’s sanction letter; sector-level claims of available power do not tell you what is left for a new load.', 'up-go'),
            p('Groundwater is a harder constraint. CGWA guidelines bar groundwater NOCs for new industries other than MSMEs in over-exploited assessment units, and SBI lists Gurugram among the water-stressed data centre metros. Plan for treated wastewater or air and closed-loop cooling.', 'cgwa', 'sbi')),
        sec('noida-risks', 'Data centre site risks in Noida and NCR',
            ul([
                'Seismic: Delhi is Zone IV (zone factor 0.24) in the IS 1893 (Part 1):2002 town list, a higher design load than Mumbai, Chennai or Hyderabad. Confirm the zone for the specific YEIDA sector.',
                'Airport: Noida International Airport at Jewar began commercial operations on 15 June 2026. In July 2025 the airport advised that no construction or tree planting proceed within 20 km without a height clearance or NOC from AAI.',
            ], 'is1893', 'noida-ap', 'jewar-pti'),
            p(SCREEN + 'In NCR the groundwater unit and the Jewar height surface are checked alongside the power route.')),
    ],
    [
        faq('How much data centre capacity does Noida have?', 'Noida had 156 MW of operational data centre capacity in H1 2026, out of 183 MW across Delhi NCR, according to Cushman & Wakefield. Another 1,247 MW was at early stage in Noida.', 'cw26'),
        faq('What is the YEIDA data centre park?', 'The YEIDA Data Centre Park is a 100-acre site in Sector 28 on the Yamuna Expressway. YEIDA lists it in its available land bank alongside its Medical Devices Park in the same sector.', 'yeida'),
        faq('What incentives does the UP Data Centre Policy 2026 offer?', 'The UP Data Centre Policy 2026 offers capital and interest subsidies, land and stamp duty concessions, and electricity duty and wheeling and transmission charge exemptions. Parks get an interest subsidy with a Rs 50 crore ceiling and units a capital subsidy with a Rs 20 crore ceiling. Land from state agencies in Madhyanchal and Paschimanchal gets a 25% subsidy, land from government authorities a 100% stamp duty exemption, and units 10 years of electricity duty exemption.', 'up-go', 'up-page'),
        faq('Is Noida a good location for a data center?', 'Noida offers proximity to the national capital, extensive fibre connectivity and access to large development land, according to Anarock, and the UP policy adds incentives. The site checks are groundwater, Seismic Zone IV design and height limits near the new Jewar airport.', 'anarock', 'up-go', 'is1893', 'jewar-pti'),
        faq('Which companies run data centres in Noida?', 'Anarock lists Yotta, NTT, STT GDC, Sify and AdaniConneX projects in Noida and Greater Noida. AM Green has an MoU for a 1 GW AI data centre in the Greater Noida region.', 'anarock', 'amgreen'),
        faq('Do I need an AAI height clearance near Noida International Airport?', 'Yes, within 20 km of the airport. In July 2025 Noida International Airport advised that no construction or tree planting proceed within 20 km without a height clearance or NOC from AAI. The airport began commercial operations on 15 June 2026.', 'jewar-pti', 'noida-ap'),
    ],
    pick('cw26', 'savills', 'up-go', 'yeida', 'is1893', 'noida-ap', 'anarock', 'yotta-dc', 'adaniconnex', 'amgreen', 'up-page', 'up-code', 'uperc', 'cgwa', 'sbi', 'jewar-pti'),
    ['data-centres-in-india', 'uttar-pradesh-data-centre-policy', 'haryana-data-centre-policy', 'power-for-data-centres-india', 'data-centre-water-india'],
    minutes=7,
))

# ─────────────────────────────── Bengaluru ───────────────────────────────
ARTICLES.append(article(
    'data-centres-in-bengaluru',
    'Data centres in Bengaluru: capacity, Whitefield, Hoskote and water (2026)',
    'Bengaluru had 162 MW of operational data centre capacity in H1 2026 (Cushman & Wakefield), mostly in Whitefield, with 28% vacancy. Water is the binding constraint.',
    'Bengaluru, Karnataka, India',
    'Bengaluru had 162 MW of operational data centre capacity in H1 2026, about 9% of India’s top seven cities, according to Cushman & Wakefield. That makes it a mid-sized market, with only 8 MW under construction and 28% colocation vacancy, in a city Anarock describes as having a large concentration of IT firms, global capability centres and startups. Most capacity is in Whitefield in the east. Karnataka’s Sustainable Data Centre Policy 2026-31 targets 1 GW of IT load by 2031 and pays for low PUE and water efficiency. Water is the constraint: Newslaundry reports that most of the city’s data centres sit in its worst water-stressed areas.',
    [
        'Bengaluru had 162 MW operational, 8 MW under construction and 92 MW planned in H1 2026 (Cushman & Wakefield). Anarock counts 137 MW IT.',
        'Peripheral East (Whitefield) holds 128 MW of Bengaluru’s capacity and Peripheral South (Electronic City) 22 MW, per Cushman & Wakefield. Anarock names Devanahalli in the north as the primary hyperscale growth corridor.',
        'Karnataka’s 2026-31 policy pays Rs 20 crore for PUE between 1.00 and 1.20 sustained for three years and plans parks at Hoskote, Mysuru and Mangaluru.',
        'Newslaundry, citing the CGWB, reports that Bengaluru extracts almost 10 times the groundwater it recharges each year.',
    ],
    [
        sec('bengaluru-key-facts', 'Bengaluru data centre market: key facts (H1 2026)',
            table(['Item', 'Figure and period'], [
                ['Operational capacity', '162 MW, about 9% of top seven cities (Cushman & Wakefield, H1 2026); 137 MW IT (Anarock)'],
                ['Under construction and planned', '8 MW under construction; 92 MW planned (Cushman & Wakefield)'],
                ['Colocation vacancy', '28.0% (Cushman & Wakefield, H1 2026)'],
                ['Sub-markets', 'Peripheral East (Whitefield) 128 MW; Peripheral South (Electronic City) 22 MW'],
                ['State policy', 'Karnataka Sustainable Data Centre Policy 2026-31, issued by the state IT department (reported 30 September 2026)'],
                ['Physical risk note', 'Seismic Zone II (IS 1893 Part 1:2002); groundwater extraction far above recharge (CGWB, via Newslaundry)'],
            ], 'cw26', 'anarock', 'ka-2026', 'is1893', 'newslaundry'),
            p('Cushman & Wakefield attributes Bengaluru’s high colocation vacancy to relatively muted enterprise demand and low hyperscaler activity. Anarock forecasts 400 MW IT by 2030.', 'cw26', 'anarock')),
        sec('bengaluru-sub-markets', 'Bengaluru data centre sub-markets: Whitefield, Electronic City, Devanahalli and Hoskote',
            p('Whitefield and Bengaluru’s eastern periphery hold most of the city’s live capacity, 128 of 162 MW, per Cushman & Wakefield. Anarock lists NTT’s Bengaluru 4 in Electronic City, about 67 MW of IT load, among upcoming supply, and names Devanahalli and North Bengaluru as the primary hyperscale growth corridor.', 'cw26', 'anarock'),
            p('Cushman & Wakefield reports a planned 500 MW data centre park near Hoskote, with the government committing solar power and treated water, and 500 MW planned at Mysuru and Mangaluru. The 2026-31 policy offers park land on 30 plus 30 year leases with dual-grid power connectivity.', 'cw26', 'ka-2026')),
        sec('bengaluru-policy', 'Karnataka’s Sustainable Data Centre Policy 2026-31',
            p('Karnataka’s Sustainable Data Centre Policy 2026-31, issued by the state IT department, sets an IT load target and pays for low PUE and water efficiency. Its main terms:', 'ka-2026'),
            ul([
                'A target of 1 GW of cumulative data centre IT load by 2031.',
                'A one-time PUE incentive of Rs 20 crore for PUE between 1.00 and 1.20, paid in the fourth year after the PUE is shown for three consecutive years.',
                'WUE reimbursement up to Rs 30 lakh a year for two years at 0.7 to 1.3 litres per kWh, and treated water reimbursement up to Rs 8 lakh a year for five years.',
                'Customised packages for strategically important projects above Rs 3,000 crore, including cable landing stations and desalination plants.',
            ], 'ka-2026'),
            p('Anarock notes the earlier Karnataka Data Centre Policy 2022-27. Check which policy a project falls under before relying on its terms.', 'anarock')),
        sec('bengaluru-water', 'Water: the binding constraint for Bengaluru data centres',
            p('Newslaundry reported in April 2026 that most of Bengaluru’s data centres are in the eastern and south-eastern tech corridors around Whitefield and Electronic City, running through the city’s worst water-stressed areas in summer, and quoted a hydrologist saying data centres mostly consume groundwater. Citing the CGWB, it reported that Bengaluru extracts almost 10 times the water it recharges each year.', 'newslaundry'),
            p('Under CGWA guidelines, new industries other than MSMEs cannot get groundwater NOCs in over-exploited assessment units, and expansion that increases abstraction there is not allowed. Anarock estimates about 25.5 million litres per MW per year for cooling towers, so a new Bengaluru site needs a water plan, such as treated water or air-cooled or closed-loop systems, from day one.', 'cgwa', 'anarock')),
        sec('bengaluru-risks', 'Other data centre site risks in Bengaluru',
            ul([
                'Seismic: Bengaluru is Zone II (zone factor 0.10) in the IS 1893 (Part 1):2002 town list.',
                'Airport: Anarock cites airport connectivity as an advantage of Devanahalli and North Bengaluru. AAI height NOCs apply up to 20 km from VFR airports and 56 km from IFR airports.',
            ], 'is1893', 'anarock', 'aai'),
            p(SCREEN + 'In Bengaluru the groundwater unit and the water plan decide the site before power does.')),
    ],
    [
        faq('How much data centre capacity does Bengaluru have?', 'Bengaluru had 162 MW of operational data centre capacity in H1 2026, according to Cushman & Wakefield, with 8 MW under construction and 92 MW planned. Anarock counted 137 MW IT.', 'cw26', 'anarock'),
        faq('Where are the data centres in Bengaluru?', 'Most of Bengaluru’s data centre capacity is in Whitefield and the eastern periphery (128 MW), followed by Electronic City (22 MW), per Cushman & Wakefield. Anarock names Devanahalli as the hyperscale growth corridor, and a 500 MW park is planned near Hoskote.', 'cw26', 'anarock'),
        faq('What does Karnataka’s new data centre policy offer?', 'Karnataka’s Sustainable Data Centre Policy 2026-31 offers Rs 20 crore for a PUE of 1.00 to 1.20, water efficiency and treated water reimbursements, and parks at Hoskote, Mysuru and Mangaluru. It targets 1 GW by 2031.', 'ka-2026'),
        faq('Is water a problem for data centres in Bengaluru?', 'Yes. Newslaundry reports that most of the city’s data centres are in its worst water-stressed areas and that Bengaluru extracts almost 10 times the groundwater it recharges. CGWA guidelines restrict new industrial abstraction in over-exploited units.', 'newslaundry', 'cgwa'),
        faq('Why is data centre vacancy high in Bengaluru?', 'Cushman & Wakefield attributes Bengaluru’s high vacancy to relatively muted enterprise demand and low hyperscaler activity. Vacancy was 28.0% in H1 2026.', 'cw26'),
    ],
    pick('cw26', 'anarock', 'ka-2026', 'is1893', 'newslaundry', 'cgwa', 'aai'),
    ['data-centres-in-india', 'karnataka-data-centre-policy', 'data-centre-water-india', 'power-for-data-centres-india'],
    minutes=6,
))

# ─────────────────────────────── Pune ───────────────────────────────
ARTICLES.append(article(
    'data-centres-in-pune',
    'Data centres in Pune: capacity, Hinjewadi, PBD North and power (2026)',
    'Pune had 133 MW of operational data centre capacity in H1 2026, per Cushman & Wakefield, mostly in PBD North and Hinjewadi. Sub-markets, power, policy and risks.',
    'Pune, Maharashtra, India',
    'Pune had 133 MW of operational data centre capacity across 12 facilities in H1 2026, about 7% of India’s operational capacity, according to Cushman & Wakefield. The same count shows 31 MW under construction and 227 MW planned; Savills puts Pune at 182 MW IT, about 10% of the national total. Most capacity sits in PBD North and Hinjewadi. Cushman & Wakefield reports that Microsoft Azure has a cloud region in Pune and has acquired land for captive cloud developments, and Structure Research describes Pune as a core cloud region for one major hyperscaler because it is close to Mumbai. Maharashtra’s data centre policies apply in Pune as in Mumbai.',
    [
        'Pune had 133 MW operational, 31 MW under construction and 227 MW planned in H1 2026, according to Cushman & Wakefield; Savills counts 182 MW IT.',
        'In Pune, PBD North holds 92 MW in 2 facilities at 16.5% vacancy and Hinjewadi 37 MW in 5 at 32.5% vacancy (Cushman & Wakefield, H1 2026).',
        'Maharashtra’s IT/ITES Policy 2023 and the Integrated Green Data Centre Parks framework, extended statewide in June 2026, apply in Pune.',
        'Pune is in Seismic Zone III in the IS 1893 (Part 1):2002 town list.',
    ],
    [
        sec('pune-key-facts', 'Pune data centre market: key facts (H1 2026)',
            table(['Item', 'Figure and period'], [
                ['Operational capacity', '133 MW in 12 data centres, about 7% of India’s operational capacity (Cushman & Wakefield, H1 2026); 182 MW IT, about 10% (Savills)'],
                ['Under construction and planned', '31 MW under construction; 227 MW planned (Cushman & Wakefield)'],
                ['Colocation vacancy', '22.1% (Cushman & Wakefield, H1 2026)'],
                ['Sub-markets', 'PBD North 92 MW; Hinjewadi 37 MW'],
                ['Hyperscale', 'Microsoft Azure cloud region; land acquired for captive cloud developments'],
                ['State policy', 'Maharashtra IT/ITES Policy 2023; Integrated Green Data Centre Parks (up to 20 parks statewide since June 2026)'],
                ['Physical risk note', 'Seismic Zone III'],
            ], 'cw26', 'savills', 'mh-it', 'iba-green', 'is1893'),
            p('Cushman & Wakefield’s figures include colocation and hyperscale cloud service providers; Savills reports operational stock in MW of IT load.', 'cw26', 'savills')),
        sec('pune-sub-markets', 'Pune data centre sub-markets: PBD North and Hinjewadi',
            p('In Pune, the PBD North cluster holds 92 MW in two facilities, with 19 MW under construction and 169 MW planned, according to Cushman & Wakefield. Hinjewadi holds 37 MW across five facilities, with 12 MW under construction, 58 MW planned and 160 MW at early stage. AdaniConneX lists 250 MW of potential IT load in Pune, with phase one live from October 2025.', 'cw26', 'adaniconnex')),
        sec('pune-power-policy', 'Power and policy for Pune data centres',
            p('Maharashtra’s IT/ITES Policy 2023, which applies in Pune, gives a 100% stamp duty exemption on land or premises for a new data centre and a Rs 1 per unit tariff subsidy for 5 years for new units outside Zone I. A notification of 22 June 2026 exempts data centre units from electricity duty for 20 years. A June 2026 government resolution extended the Integrated Green Data Centre Parks framework to the whole state, raised the number of eligible parks from 3 to 20, and cut the green power requirement for core operations from 100% to 51%.', 'mh-it', 'mh-ed', 'iba-green'),
            p('For grid supply in Pune, the MERC Supply Code sets 33 kV supply up to 10,000 kVA of contract demand (20,000 kVA in a Metropolitan Area or on an express feeder elsewhere), extra high voltage above that, and a one-year standard where a new distribution substation is needed. MERC classifies data centres under the industrial category.', 'merc-sop', 'merc-myt'),
            p('Structure Research reports that MSEDCL has allocated about 6 GW of grid power to data centres in Navi Mumbai and that committed and under-construction capacity there is approaching that level. Confirm the serving substation and sanction for the specific Pune plot.', 'structure')),
        sec('pune-risks', 'Site risks for data centres in Pune',
            ul([
                'Seismic: Pune is Zone III (zone factor 0.16) in the IS 1893 (Part 1):2002 town list.',
                'Airport: AAI height clearance under GSR 751(E) applies within 20 km of the aerodrome reference point for visual flight rules airports, or 56 km for instrument flight rules airports.',
                'Water: check the groundwater assessment unit and the municipal or MIDC supply before planning evaporative cooling.',
            ], 'is1893', 'aai'),
            p(SCREEN + 'For a Pune site, we lay out the comparison with a Navi Mumbai plot on power date and latency.')),
    ],
    [
        faq('How much data centre capacity does Pune have?', 'Pune had 133 MW of operational data centre capacity in H1 2026, according to Cushman & Wakefield, with 31 MW under construction and 227 MW planned. Savills counts 182 MW IT.', 'cw26', 'savills'),
        faq('Where are the data centres in Pune?', 'Most of Pune’s data centre capacity is in the PBD North cluster (92 MW) and Hinjewadi (37 MW), according to Cushman & Wakefield.', 'cw26'),
        faq('What is the data centre vacancy rate in Pune?', 'Colocation vacancy in Pune was 22.1% in H1 2026, according to Cushman & Wakefield. PBD North was at 16.5% and Hinjewadi at 32.5%.', 'cw26'),
        faq('Does Microsoft have a data center in Pune?', 'Microsoft Azure has a cloud region in Pune, according to Cushman & Wakefield, which also reports that Microsoft has added availability zones and acquired land for captive cloud developments.', 'cw26'),
        faq('Do Maharashtra data centre incentives apply in Pune?', 'Yes. The IT/ITES Policy 2023 is a state policy, and a June 2026 government resolution extended the Integrated Green Data Centre Parks framework beyond the Mumbai Metropolitan Region to the rest of the state.', 'mh-it', 'iba-green'),
    ],
    pick('cw26', 'savills', 'mh-it', 'mh-ed', 'iba-green', 'is1893', 'adaniconnex', 'merc-sop', 'merc-myt', 'structure', 'aai'),
    ['data-centres-in-india', 'data-centres-in-mumbai', 'maharashtra-data-centre-policy', 'power-for-data-centres-india'],
    minutes=6,
))

# ─────────────────────────────── Visakhapatnam ───────────────────────────────
ARTICLES.append(article(
    'data-centres-in-visakhapatnam',
    'Data centres in Visakhapatnam: Google’s AI hub, gigawatt campuses and risks (2026)',
    'Visakhapatnam has more than 4 GW of early-stage or announced data centre capacity, led by Google’s US$15 billion AI hub. Power, cyclone, water and cable checks.',
    'Visakhapatnam, Andhra Pradesh, India',
    'Visakhapatnam has more than 4 GW of early-stage or announced data centre capacity, according to Invest India and Cushman & Wakefield (October 2026). Google committed about US$15 billion over 2026 to 2030 for its first India AI hub in the city, with AdaniConneX and Nxtra by Airtel, and broke ground at Tarluvada on 28 April 2026. Digital Connexion (1 GW), Colt DCS with RMZ (1.25 GW) and AirTrunk (up to 1.8 GW across two proposed campuses) have announced or proposed large developments. Crisil estimates that by FY2030 data centre capacity in Visakhapatnam could equal about 80% of the city’s current peak power demand.',
    [
        'Announced in and around Visakhapatnam: Google (about US$15 billion, about 1 GW), Digital Connexion (about US$11 billion, 1 GW), Colt DCS and RMZ (1.25 GW, about US$21 billion), AirTrunk (up to 1.8 GW in Anakapalli, proposed).',
        'Crisil estimates that by FY2030 data centre capacity in Visakhapatnam could equal about 80% of the city’s current peak power demand.',
        'Andhra Pradesh Data Center Policy 4.0 (2024-29) gives large projects project-specific packages through government orders; the state issued orders for specific projects in 2026.',
        'Cyclone Hudhud crossed the coast over Visakhapatnam on 12 October 2014 with winds of about 180 km/h and a 1.4 m storm surge.',
        'New subsea routes into Visakhapatnam: Google’s America-India Connect gateway (announced February 2026) and Sify’s open cable landing station.',
    ],
    [
        sec('vizag-key-facts', 'Visakhapatnam data centre market: key facts (2026)',
            table(['Item', 'Figure and period'], [
                ['Announced capacity', 'More than 4 GW at early or announced stage (Invest India and Cushman & Wakefield, October 2026)'],
                ['Largest project', 'Google AI hub, about US$15 billion over 2026 to 2030, groundbreaking 28 April 2026'],
                ['Grid note', 'Data centre capacity could equal about 80% of the city’s current peak demand by FY2030 (Crisil)'],
                ['State policy', 'Andhra Pradesh Data Center Policy 4.0 (2024-29), notified 14 November 2024 according to TeamLease RegTech'],
                ['Cables', 'Google America-India Connect gateway (announced February 2026); Sify open cable landing station (foundation stone October 2025); Airtel cites a next-generation cable landing station as part of its role in the Google hub'],
                ['Physical risk note', 'Seismic Zone II; Cyclone Hudhud landfall on 12 October 2014'],
            ], 'ii', 'google-blog', 'adani-gb', 'crisil-dd', 'ap-policy', 'aic-google', 'sify-print', 'is1893', 'hudhud')),
        sec('vizag-projects', 'Data centre projects announced in and around Visakhapatnam',
            table(['Developer', 'Scale', 'Where', 'Status and date'], [
                ['Google with AdaniConneX and Nxtra by Airtel', 'Gigawatt-scale, three data centre campuses; about US$15 billion over 2026 to 2030', 'Groundbreaking at Tarluvada', 'Announced 14 October 2025; groundbreaking 28 April 2026'],
                ['Digital Connexion (Reliance, Brookfield, Digital Realty)', '1 GW; about US$11 billion by 2030', '400-acre campus', 'MoU with the AP Economic Development Board, announced November 2025'],
                ['Colt DCS and RMZ', '1.25 GW; about US$21 billion over the next decade', 'Visakhapatnam', 'Announced (Cushman & Wakefield, H1 2026)'],
                ['AirTrunk', 'Up to 1.8 GW; about US$11 billion', 'Two campuses in Anakapalli district', 'Project reports submitted, reported November 2026 (IREI, citing Bloomberg); subject to government approval'],
                ['Sify', '50 MW AI edge data centre and open cable landing station; Rs 1,500 crore', '3.6 acres', 'Foundation stone 12 October 2025'],
            ], 'google-blog', 'adani-gb', 'dcx', 'cw26', 'airtrunk-ap', 'sify-print'),
            p('Andhra Pradesh also issued government orders under Policy 4.0 for specific projects in 2026, including ReNew’s 1,000 MW at Makavaripalem in Anakapalli district and AM AI Factory’s 512 MW at Amanam village. ETV Bharat reported that incentives for Google’s subsidiary Raiden Infotech are capped at Rs 22,000 crore against Rs 87,520 crore of investment, including a 25% discount on 480 acres of land.', 'ap-aug26', 'ap-raiden')),
        sec('vizag-power', 'Grid power for Visakhapatnam data centres',
            p('Crisil estimates that data centre capacity could equal about 80% of Visakhapatnam’s current peak demand by FY2030, and says this makes timely grid connectivity and transmission augmentation critical. A site in Vizag therefore needs evidence of which transmission scheme serves it and when, not only a state MoU.', 'crisil-dd'),
            p('Andhra Pradesh grants incentives for large data centre projects one by one, through government orders. Read the project order; the policy text alone does not tell you what a given site gets.', 'ap-aug26')),
        sec('vizag-risks', 'Disadvantages and risks of a data centre in Vizag',
            ul([
                'Cyclone: Hudhud crossed the coast over Visakhapatnam on 12 October 2014 with maximum sustained winds of about 180 km/h, central pressure of 950 hPa and a 1.4 m storm surge at the Visakhapatnam tide gauge. Design for wind loads and plan for grid outages after landfall.',
                'Water: check the groundwater category of the assessment unit before planning evaporative cooling; nationally, 10.8% of assessment units were over-exploited in the 2025 assessment.',
                'Market depth: Invest India and Cushman & Wakefield map Visakhapatnam’s capacity as early-stage or announced, so early tenants depend on the hyperscale anchors.',
                'Seismic: Visakhapatnam is Zone II (zone factor 0.10), a low design load.',
            ], 'hudhud', 'cgwb25', 'ii', 'is1893'),
            p(SCREEN + 'In Vizag the questions are which transmission scheme and substation serve the plot, the cyclone design basis, and the water source.')),
        sec('vizag-cables', 'Subsea cable landings in Visakhapatnam',
            p('Google’s America-India Connect, announced on 18 February 2026, includes a new international subsea gateway in Visakhapatnam, a direct path from Vizag and Chennai to South Africa, and a direct path between Vizag and Singapore. At the Google groundbreaking, Airtel cited a next-generation cable landing station as part of what it brings to the Vizag hub, and Sify is building an open cable landing station alongside its 50 MW AI edge data centre.', 'aic-google', 'adani-gb', 'sify-print')),
    ],
    [
        faq('Which companies are building data centres in Visakhapatnam?', 'Google (with AdaniConneX and Nxtra by Airtel), Digital Connexion, Colt DCS with RMZ, Sify and AirTrunk have announced or proposed data centres in and around Visakhapatnam. Digital Connexion is backed by Reliance, Brookfield and Digital Realty; AirTrunk has submitted project reports for Anakapalli, according to IREI.', 'google-blog', 'adani-gb', 'dcx', 'cw26', 'sify-print', 'airtrunk-ap'),
        faq('How much data centre capacity is planned in Visakhapatnam?', 'More than 4 GW of data centre capacity in Visakhapatnam is at early or announced stage, according to Invest India and Cushman & Wakefield (October 2026).', 'ii'),
        faq('How big is Google’s data centre in Vizag?', 'Google committed about US$15 billion over 2026 to 2030 for its India AI hub in Visakhapatnam, which comprises three data centre campuses. The Adani Group described nearly 1 GW in a single location at the groundbreaking on 28 April 2026.', 'google-blog', 'adani-gb'),
        faq('What are the disadvantages of a data center in Vizag?', 'The disadvantages are cyclone exposure (Hudhud in 2014), power build-out relative to the city’s demand, water for cooling, and a market still at early or announced stage.', 'hudhud', 'crisil-dd', 'ii'),
        faq('Does Andhra Pradesh have a data centre policy?', 'Yes. Andhra Pradesh Data Center Policy 4.0 (2024-29), notified on 14 November 2024 according to TeamLease RegTech. Large projects receive project-specific incentives through government orders.', 'ap-policy', 'ap-aug26'),
    ],
    pick('ii', 'google-blog', 'adani-gb', 'crisil-dd', 'ap-policy', 'aic-google', 'sify-print', 'is1893', 'hudhud', 'dcx', 'cw26', 'airtrunk-ap', 'ap-aug26', 'ap-raiden', 'cgwb25'),
    ['data-centres-in-india', 'andhra-pradesh-data-centre-policy', 'ai-data-centres-india', 'power-for-data-centres-india', 'data-centre-seismic-flood-risk-india'],
    minutes=7,
))

# ─────────────────────────────── Gujarat ───────────────────────────────
ARTICLES.append(article(
    'data-centres-in-gujarat',
    'Data centres in Gujarat: Jamnagar, GIFT City, Ahmedabad and Dholera (2026)',
    'Data centres in Gujarat: Reliance’s Jamnagar AI campus, Yotta at GIFT City and a planned 250 MW Dholera campus, under a 2026-29 policy for 150 MW or larger projects.',
    'Gujarat, India',
    'Gujarat’s data centre activity centres on Jamnagar, where Mukesh Ambani said in February 2026 that Reliance had begun building multi-gigawatt data centres, with more than 120 MW expected online in the second half of 2026. Meta agreed in June 2026 to lease capacity at a 168 MW Reliance facility there. GIFT City hosts Yotta’s 1 MW G1 facility, and L&T Vyoma signed an MoU for a 250 MW green data centre at Dholera. The Viksit Gujarat Data Centre Policy 2026-29, launched on 9 July 2026, supports only projects of 150 MW or more, with incentives available until 7.5 GW of capacity is reached statewide.',
    [
        'Jamnagar: Reliance AI campus; Meta leasing capacity at a 168 MW facility (June 2026); Google and Reliance dedicated AI cloud region announced (August 2025). Invest India and Cushman & Wakefield map Jamnagar at 1 GW+ early stage; Anarock lists a 3 GW campus.',
        'Gujarat’s 2026-29 policy requires at least 150 MW of approved IT load and 51% green power for core operations, and, according to Cyril Amarchand Mangaldas, treats data centre operations as an essential service under the Gujarat ESMA 1972.',
        'GIFT City: Yotta’s G1 facility lists 350 racks and 1 MW of IT load. The Union Budget 2023-24 announced that the government would facilitate data embassies in GIFT IFSC.',
        'Dholera: L&T Vyoma signed an MoU with Gujarat for a 250 MW green data centre, Rs 25,000 crore, with operations expected by 2028.',
    ],
    [
        sec('gujarat-key-facts', 'Gujarat data centres: key facts (2026)',
            table(['Item', 'Figure and period'], [
                ['Jamnagar', 'Reliance multi-gigawatt AI data centres under construction; more than 120 MW expected online in H2 2026 (Reliance, February 2026); Meta leasing capacity at a 168 MW facility (June 2026)'],
                ['Jamnagar scale estimates', '1 GW+ early stage (Invest India and Cushman & Wakefield map); 3 GW campus (Anarock)'],
                ['GIFT City', 'Yotta G1: 1 MW IT load, 350 racks'],
                ['Dholera', 'L&T Vyoma 250 MW green data centre MoU, Rs 25,000 crore (February 2026)'],
                ['State policy', 'Viksit Gujarat Data Centre Policy 2026-29, launched 9 July 2026; incentives until 7.5 GW statewide'],
                ['Cables', 'Two cable landing stations planned in Gujarat (announced at the policy launch, July 2026)'],
                ['Physical risk note', 'Ahmedabad Seismic Zone III; Bhuj (Kutch) Zone V'],
            ], 'reliance-ai', 'meta-jam', 'ii', 'anarock', 'yotta-dc', 'dholera-air', 'gj-dd', 'gj-cam', 'is1893')),
        sec('gujarat-jamnagar', 'Jamnagar: Reliance’s AI data centre campus',
            p('Reliance said on 19 February 2026 that construction of multi-gigawatt data centres at Jamnagar had begun, with more than 120 MW expected online in the second half of 2026, supported by 10 GW of surplus solar power in Gujarat and Andhra Pradesh. The announcement came with a Rs 10 trillion (about US$110 billion) plan to build AI computing infrastructure over seven years. Reliance and Google announced a dedicated AI cloud region, starting with a data centre in Jamnagar, in August 2025.', 'reliance-ai', 'gc-jam-tc'),
            p('Meta announced its first Indian AI data centre partnership with Reliance on 10 June 2026: Meta is leasing capacity at a 168 MW facility at Jamnagar that Reliance said will be ready within two years, powered by renewable energy and cooled with desalinated seawater.', 'meta-jam')),
        sec('gujarat-gift-dholera', 'GIFT City, Ahmedabad and Dholera',
            p('GIFT City, India’s first international financial services centre, at Gandhinagar, hosts Yotta’s G1 facility with 1 MW of IT load. In the Union Budget 2023-24 the Finance Minister said the government would facilitate data embassies in GIFT IFSC for countries looking for digital continuity solutions.', 'yotta-dc', 'gift-emb'),
            p('At the India AI Impact Summit in February 2026, Gujarat signed an MoU with L&T Vyoma for a 250 MW green data centre at the Dholera Special Investment Region, with Rs 25,000 crore of investment and operations expected by 2028. The state policy document highlights Dholera and GIFT City among Gujarat’s industrial hubs.', 'dholera-air', 'gj-dd')),
        sec('gujarat-policy', 'Gujarat data centre policy 2026-29: eligibility and incentives',
            ul([
                'Projects eligible under the Viksit Gujarat Data Centre Policy 2026-29 need at least 150 MW of approved installed IT load, and at least 51% of electricity for core operations must come from green and renewable energy.',
                'Power tariff subsidy of Rs 1 per unit for 20 years; 100% electricity duty reimbursement for 20 years; 100% stamp duty and registration fee exemption on lease or purchase of land.',
                'Interest subsidy up to 4% a year for 10 years (capped at Rs 25 crore a year); capital subsidy of 2.5% of eligible fixed capital investment for projects solely in Dholera SIR; total incentives capped at 75% of eligible fixed capital investment.',
                'Open access permitted and dual power supply through two independent feeders; data centre operations treated as an essential service under the Gujarat Essential Services Maintenance Act, 1972, according to Cyril Amarchand Mangaldas.',
                'Operative for three years from notification (extendable), with incentives available only until 7.5 GW of installed capacity is reached statewide.',
            ], 'gj-cam'),
            p('Cyril Amarchand Mangaldas describes the policy as designed for hyperscale and large data centre developments, in contrast to the previous framework for smaller projects.', 'gj-cam')),
        sec('gujarat-risks', 'Site risks for data centres in Gujarat',
            ul([
                'Seismic: Ahmedabad is Zone III (zone factor 0.16) in the IS 1893 (Part 1):2002 town list, while Bhuj in Kutch is Zone V (zone factor 0.36). Check the zone for the specific site.',
                'Water: Reliance’s 168 MW Jamnagar facility for Meta will be cooled with desalinated seawater, and the state policy offers a capital subsidy for captive desalination plants.',
            ], 'is1893', 'meta-jam', 'gj-cam'),
            p(SCREEN + 'In Gujarat, we check the 150 MW policy floor and the water source alongside the power route.')),
    ],
    [
        faq('Where is the largest data centre project in Gujarat?', 'Jamnagar is the largest of the Gujarat locations that Invest India and Cushman & Wakefield map, at 1 GW+ early stage. Meta is leasing capacity at a 168 MW Reliance facility there, and Reliance said more than 120 MW was expected online in H2 2026.', 'ii', 'meta-jam', 'reliance-ai'),
        faq('Is Meta building a data centre in Gujarat?', 'Meta announced on 10 June 2026 that it is leasing capacity at a 168 MW Reliance facility at Jamnagar, its first Indian AI data centre partnership. Reliance said the facility will be ready within two years, powered by renewable energy and cooled with desalinated seawater.', 'meta-jam'),
        faq('Is there a data center in GIFT City?', 'Yes. Yotta’s G1 facility in GIFT City lists 1 MW of IT load and 350 racks.', 'yotta-dc'),
        faq('What is the Gujarat data centre policy 2026-29?', 'The Viksit Gujarat Data Centre Policy 2026-29, launched 9 July 2026, supports projects of at least 150 MW using at least 51% green power for core operations. It offers a power tariff subsidy of Rs 1 per unit for 20 years, electricity duty reimbursement, stamp duty exemption and, according to Cyril Amarchand Mangaldas, essential-service status. Incentives run until 7.5 GW is reached statewide.', 'gj-dd', 'gj-cam'),
        faq('What data centre is planned at Dholera?', 'L&T Vyoma signed an MoU with Gujarat for a 250 MW green data centre at Dholera, worth about Rs 25,000 crore. Operations are expected to start by 2028.', 'dholera-air'),
    ],
    pick('reliance-ai', 'meta-jam', 'ii', 'anarock', 'yotta-dc', 'dholera-air', 'gj-dd', 'is1893', 'gc-jam-tc', 'gift-emb', 'gj-cam'),
    ['data-centres-in-india', 'gujarat-data-centre-policy', 'ai-data-centres-india', 'power-for-data-centres-india'],
    minutes=6,
))

# ─────────────────────────────── Kolkata ───────────────────────────────
ARTICLES.append(article(
    'data-centres-in-kolkata',
    'Data centres in Kolkata and East India: New Town, Salt Lake and Bhubaneswar (2026)',
    'Kolkata had 22 MW of operational data centre capacity in H1 2026, mostly in New Town, per Cushman & Wakefield. West Bengal’s 2021 policy term ran to September 2026.',
    'Kolkata, West Bengal, India',
    'Kolkata had 22 MW of operational data centre capacity across six facilities in H1 2026, the smallest of the seven city markets in Cushman & Wakefield’s count. New Town holds 18 MW and Salt Lake 4 MW, with 13 MW under construction and 71 MW planned; demand comes mainly from government and small and medium enterprises. West Bengal’s Data Centre Policy 2021 classed data centre organisations as essential services and treated their electricity as industrial. It was valid for five years from September 2021, and in May 2026 the state BJP president said the new government was formulating a new data centre policy. Odisha’s 2022 policy is another incentive regime in the region.',
    [
        'Kolkata had 22 MW operational, 13 MW under construction and 71 MW planned in H1 2026, with 19.4% colocation vacancy, according to Cushman & Wakefield.',
        'In Kolkata, New Town holds 18 MW and Salt Lake 4 MW. Cushman & Wakefield reports a cable landing station under construction at Tajpur.',
        'West Bengal Data Centre Policy 2021 (notified 6 September 2021): essential services classification, 100% stamp duty exemption, 5-year electricity duty waiver, FAR 3.0 plus 1.0 purchasable.',
        'The central government named West Bengal, with Andhra Pradesh, Madhya Pradesh and Chhattisgarh, among states coming up as new data centre investment destinations.',
    ],
    [
        sec('kolkata-key-facts', 'Kolkata data centre market: key facts (H1 2026)',
            table(['Item', 'Figure and period'], [
                ['Operational capacity', '22 MW in 6 data centres, about 2% of India’s operational capacity (Cushman & Wakefield, H1 2026)'],
                ['Under construction and planned', '13 MW under construction; 71 MW planned'],
                ['Colocation vacancy', '19.4%'],
                ['Sub-markets', 'New Town 18 MW; Salt Lake 4 MW'],
                ['Cables', 'Cushman & Wakefield reports a cable landing station under construction at Tajpur'],
                ['State policy', 'West Bengal Data Centre Policy 2021, valid five years from 6 September 2021 or until replaced; new policy being formulated (May 2026 statement)'],
                ['Physical risk note', 'Seismic Zone III'],
            ], 'cw26', 'wb-policy', 'wb-new', 'is1893'),
            p('Cushman & Wakefield attributes Kolkata’s demand primarily to government and small and medium enterprises, and says the under-construction Tajpur cable landing station is attracting large operators.', 'cw26')),
        sec('kolkata-sub-markets', 'Kolkata data centre sub-markets and operators',
            p('New Town holds most of Kolkata’s data centre capacity (18 MW of 22 MW), with Salt Lake at 4 MW, according to Cushman & Wakefield. W.Media reported in February 2025 that NTT Global Data Centers had inaugurated its Kolkata data centre. In August 2026 the government told the Rajya Sabha that the data centre industry is expanding in states including West Bengal, Andhra Pradesh, Madhya Pradesh and Chhattisgarh.', 'cw26', 'ntt-kol', 'pib-cap')),
        sec('kolkata-policy', 'West Bengal Data Centre Policy 2021 and its replacement',
            ul([
                'The West Bengal Data Centre Policy 2021 was issued under Notification No. 490-Estt/ITE-18011/2/2021 dated 6 September 2021, operative for five years or until replaced.',
                '100% stamp duty and registration fee exemption; electricity duty waiver for five years from commercial operation; data centre electricity treated as industrial.',
                'Dual power grid networks; FAR of 3.0 plus 1.0 purchasable and up to 60% ground coverage; self-certification under notified Acts.',
                'Clause 5.3: data centre organisations classified as essential services.',
            ], 'wb-policy'),
            p('The 2021 policy’s five-year term ran to September 2026. In May 2026 the West Bengal BJP president, Samik Bhattacharya, said the new government was formulating a new data centre policy, as reported by Business Standard. Until it is notified, check with the IT and Electronics Department and Webel which terms apply to a new project.', 'wb-policy', 'wb-new')),
        sec('kolkata-east-india', 'East India beyond Kolkata: Odisha and Bhubaneswar',
            p('Odisha’s State Data Centre Policy 2022, with OCAC as nodal agency, offers a capital subsidy of 20% of fixed capital investment (excluding land) up to Rs 25 crore per unit. It also gives a 100% stamp duty exemption on the first transaction, electricity duty and inspection fee exemption for 10 years up to 5 MVA, a 30% power bill subsidy for 5 years up to Rs 2 crore, net SGST reimbursement for 7 years, and reimbursement of transmission and wheeling charges on captive renewable power. Yotta lists Bhubaneswar among its planned edge data centre cities.', 'od-policy', 'yotta-dc')),
        sec('kolkata-risks', 'Site risks for data centres in Kolkata',
            ul([
                'Seismic: Kolkata is Zone III (zone factor 0.16) under IS 1893 (Part 1):2002 as amended in 2005.',
                'Flood: check drainage and plot elevation on low-lying land.',
                'Airport: AAI height clearance applies within 20 km of the aerodrome reference point for visual flight rules airports, or 56 km for instrument flight rules airports.',
            ], 'is1893', 'aai'),
            p(SCREEN + 'In Kolkata the policy status and the substation serving New Town are the first two checks.')),
    ],
    [
        faq('How much data centre capacity does Kolkata have?', 'Kolkata had 22 MW of operational data centre capacity in H1 2026 across six facilities, according to Cushman & Wakefield, with 13 MW under construction and 71 MW planned.', 'cw26'),
        faq('Where are the data centres in Kolkata?', 'Kolkata’s data centres are in New Town (18 MW) and Salt Lake (4 MW), according to Cushman & Wakefield.', 'cw26'),
        faq('Is the West Bengal data centre policy still valid?', 'The West Bengal Data Centre Policy 2021 was valid for five years from 6 September 2021 or until replaced, so its term ran to September 2026. In May 2026 the state BJP president said the new government was formulating a new policy; confirm current terms before relying on them.', 'wb-policy', 'wb-new'),
        faq('Is Kolkata a good place for a data center?', 'Kolkata is a small market, with 22 MW operational in H1 2026 and demand driven mainly by government and small and medium enterprises, according to Cushman & Wakefield. Large loads will want confirmed policy terms and a named substation first.', 'cw26'),
        faq('Are data centres essential services in West Bengal?', 'Under the West Bengal Data Centre Policy 2021, yes: Clause 5.3 classifies data centre organisations under essential services. The policy’s five-year term ran to September 2026, so check whether any replacement policy keeps this.', 'wb-policy'),
    ],
    pick('cw26', 'wb-policy', 'wb-new', 'is1893', 'ntt-kol', 'pib-cap', 'od-policy', 'yotta-dc', 'aai'),
    ['data-centres-in-india', 'west-bengal-data-centre-policy', 'odisha-data-centre-policy', 'power-for-data-centres-india'],
    minutes=6,
))
