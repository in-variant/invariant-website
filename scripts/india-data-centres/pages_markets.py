"""Market pages for the India cluster: operators, city and country comparisons, AI capacity, investment.

Facts come from the research notes in the session scratchpad; Singapore and Malaysia facts were
checked against IMDA/EDB and law-firm summaries of DC-CFA2, and Malaysian press citing TNB and RHB.
"""
from common import *

L = {}


def S(id, title, url, publisher):
    L[id] = src(id, title, url, publisher)


def pick(*ids):
    return [L[i] for i in ids]


# Market reports
S('cw26', 'India Data Centre Market Overview H1 2026', 'https://content.cushmanwakefield.com/api/public/content/6b60db63971344f3a3f5392374471667?v=90a58a0b', 'Cushman & Wakefield')
S('cw25', 'India Data Center Market Overview H1 2025 (rental tables)', 'https://assets.cushmanwakefield.com/-/media/cw/apac/india/insights/indiadatacentreupdateh12025v4.pdf?rev=4a5dd53b2388421ea3935afb03302def', 'Cushman & Wakefield')
S('ii', "India's Data Centre Growth Story (October 2026)", 'https://static.investindia.gov.in/s3fs-public/2026-10/latest-news-India-Data-Centre-Growth-Story.pdf', 'Invest India and Cushman & Wakefield')
S('savills', "India's data centre capacity additions jump 59% in H1 2026 (Savills India)", 'https://www.communicationstoday.co.in/indias-data-centre-capacity-additions-jump-59-in-h1-2026/', 'Communications Today')
S('anarock', 'Data Centre: The Blueprint of the Digital Fortress in India (2026)', 'https://websitemedia.anarock.com/media/Data_centre_The_blueprint_of_the_digital_fortress_in_India_2026_b36407b0b2.pdf', 'Anarock')
S('crisil', "Crisil Ratings: India's data centre capacity set for 5x surge by 2030", 'https://www.equitybulls.com/news/378461/crisil-ratings-india-s-data-centre-capacity-set-for-5x-surge-by-2030', 'EquityBulls (Crisil Ratings release)')
S('cbre', 'India likely to add more than 200 MW of new data centre capacity in H2 2026 (CBRE)', 'https://www.ibef.org/news/india-likely-to-add-more-than-200-mw-of-new-data-centre-capacity-in-h2-2026-pushing-total-capacity-to-2-gw-cbre', 'IBEF')
S('sbi', 'Data Centres in India: sector report (April 2026)', 'https://sbi.bank.in/documents/57189647/58231607/Sector+Report+DataCentre.pdf/f1919592-ee66-b50b-ea20-75fbb27c9bb5?t=1779885206866', 'SBI CHAKRA Centre of Excellence')
S('structure', 'Mumbai and Pune data centre report 2026', 'https://www.structureresearch.net/product/mumbai-pune-dcai-report-2026-data-centre-colocation-hyperscale-cloud-ai-interconnection/', 'Structure Research')

# Operators
S('ntt', 'NTT DATA to double data centre capacity in India as MIST goes live', 'https://developingtelecoms.com/telecom-technology/data-centres-networks/18191-ntt-data-to-double-data-centre-capacity-in-india-as-mist-goes-live.html', 'Developing Telecoms')
S('nxtra', 'Airtel announces US$1 billion investment in Nxtra', 'https://www.airtel.in/press-release/03-2026/airtel-announces-us1-billion-investment-in-nxtra-led-by-alpha-wave-global-and-existing-investor-carlyle-bharti-airtel-will-also-participate/', 'Bharti Airtel')
S('sify-drhp', 'Sify Infinit IPO papers with SEBI: financials, strengths and risks', 'https://upstox.com/news/market-news/ipo/sify-infinit-ipo-papers-with-sebi-a-look-at-its-financials-strengths-and-risks/article-183664/', 'Upstox')
S('sify-ifc', 'IFC partners with Sify to support expansion of data centers', 'https://www.ifc.org/en/pressroom/2026/ifc-partners-with-sify-to-support-expansion-of-data-centers-and-strengthen-digital', 'International Finance Corporation')
S('ctrls-cpp', 'CtrlS secures Rs 7,000 crore commitment from CPP Investments', 'https://www.prnewswire.com/in/news-releases/ctrls-secures-7-000-crore-commitment-from-cpp-investments-to-scale-datacenter-infrastructure-in-india-302803024.html', 'CtrlS (PR Newswire)')
S('yotta-dc', 'Data centers in India', 'https://yotta.com/data-center-in-india/', 'Yotta')
S('yotta-b300', 'Yotta to deploy 20,000+ NVIDIA Blackwell Ultra GPUs', 'https://yotta.com/press-releases/yotta-to-deploy-20000-nvidia-blackwell-ultra-gpus/', 'Yotta')
S('adaniconnex', 'Data centers', 'https://www.adaniconnex.com/data-centers', 'AdaniConneX')
S('coreweave', 'CoreWeave enters India with AdaniConneX', 'https://www.coreweave.com/news/coreweave-enters-india-expanding-ai-cloud-platform-with-adaniconnex', 'CoreWeave')
S('pdg', 'Princeton Digital Group to invest $1 billion for AI-ready data centres in India', 'https://indianinfrastructure.com/2024/09/23/princeton-digital-group-to-invest-1-billion-for-ai-ready-data-centres-in-india/', 'Indian Infrastructure')
S('equinix-mb3', 'Equinix launches purpose-built IBX data center in Mumbai', 'https://newsroom.equinix.com/2026-04-08-Equinix-Launches-Purpose-Built-IBX-Data-Center-in-Mumbai-to-Accelerate-Indias-AI-and-Cloud-Growth', 'Equinix')
S('digitaledge', 'Navi Mumbai BOM2 topping out and BOM3 construction', 'https://www.digitaledgedc.com/resources/newsroom/digital-edge-navi-mumbai-bom2-topping-out-bom3-construction/', 'Digital Edge')
S('capitaland', 'CapitaLand to launch 53 MW data center in Chennai', 'https://www.datacenterdynamics.com/en/news/capitaland-to-launch-53mw-data-center-in-chennai-india-before-the-end-of-the-year/', 'DCD')
S('airtrunk-lumina', 'AirTrunk acquires Lumina CloudInfra', 'https://w.media/airtunk-acquires-lumina-cloudinfra-makes-foray-into-india/', 'W.Media')
S('colt-jv', 'Colt DCS and RMZ form US$1.7 billion joint venture in India', 'https://www.businesswire.com/news/home/20241119231049/en/', 'Business Wire')
S('tcs-hv', 'TCS secures investment from TPG to accelerate AI data center business HyperVault', 'https://www.tcs.com/who-we-are/newsroom/press-release/tcs-secures-1bn-investment-from-tpg-accelerate-ai-data-center-business-hypervault', 'Tata Consultancy Services')
S('openai-tcs', 'OpenAI taps Tata for 100 MW AI data center capacity in India, eyes 1 GW', 'https://techcrunch.com/2026/02/18/openai-taps-tata-for-100mw-ai-data-center-capacity-in-india-eyes-1gw/', 'TechCrunch')
S('dcx', 'Reliance, Brookfield, Digital Realty JV to invest $11 billion in Andhra Pradesh for 1 GW data centre', 'https://www.businesstoday.in/latest/corporate/story/reliance-brookfield-digital-realty-jv-to-invest-11-billion-in-andhra-pradesh-to-build-1-gw-data-centre-503905-2025-11-27', 'Business Today')
S('ironmountain', 'Iron Mountain takes over Indian data centre group Web Werks', 'https://www.mingtiandi.com/real-estate/data-centres/iron-mountain-takes-over-indian-data-centre-group-web-werks/', 'Mingtiandi')
S('stt-nm', 'STT GDC India buys Navi Mumbai land for Rs 282 crore', 'https://www.communicationstoday.co.in/stt-gdc-india-buys-navi-mumbai-land-for-%E2%82%B9282-crore-data-centre-project/', 'Communications Today')

# Hyperscalers and AI
S('google-blog', 'Our first AI hub in India, powered by a $15 billion investment', 'https://blog.google/intl/en-in/company-news/our-first-ai-hub-in-india-powered-by-a-15-billion-investment/', 'Google')
S('adani-gb', 'Google breaks ground on India AI hub', 'https://www.adani.com/newsroom/media-releases/google-breaks-ground-on-india-ai-hub-launching-a-national-industrial-ecosystem', 'Adani Group')
S('ms-175', 'Microsoft invests US$17.5 billion in India to drive AI diffusion at population scale', 'https://news.microsoft.com/source/asia/2025/12/09/microsoft-invests-us17-5-billion-in-india-to-drive-ai-diffusion-at-population-scale/', 'Microsoft')
S('ms-hyd', 'Microsoft establishes India South Central region as a strategic hub', 'https://news.microsoft.com/source/asia/2026/09/21/ai-ambition-into-action-microsoft-brings-ai-ready-capabilities-across-its-india-cloud-infrastructure-establishes-india-south-central-region-as-a-strategic-hub-for-asia-and-global-south/', 'Microsoft')
S('aws-127', 'AWS to invest INR 1,05,600 crore (US$12.7 billion) into cloud infrastructure in India', 'https://press.aboutamazon.com/in/2023/5/aws-to-invest-inr-1-05-600-crores-us-12-7-billion-into-cloud-infrastructure-in-india', 'Amazon')
S('aws-mh', 'AWS invests US$8.3 billion in Maharashtra', 'https://www.aboutamazon.in/news/aws/aws-invests-8-billion-in-maharashtra', 'Amazon')
S('amazon-35', 'Amazon to invest additional $35B in India by 2030', 'https://techcrunch.com/2025/12/10/amazon-to-invest-additional-35b-in-india-by-2030-taking-total-planned-spending-to-75b', 'TechCrunch')
S('amazon-48', 'Amazon’s investment in India', 'https://www.aboutamazon.com/news/company-news/amazon-india-investment', 'Amazon')
S('meta-jam', 'Meta signs first AI data center deal in India with Reliance', 'https://techcrunch.com/2026/06/10/meta-signs-first-ai-data-center-deal-in-india-with-reliance/', 'TechCrunch')
S('reliance-ai', 'Reliance unveils $110B AI investment plan', 'https://techcrunch.com/2026/02/19/reliance-unveils-110b-ai-investment-plan-as-india-ramps-up-tech-ambitions/', 'TechCrunch')
S('oracle', 'Oracle to launch new data centres in Mumbai, Hyderabad', 'https://analyticsindiamag.com/ai-news/oracle-to-launch-new-data-centres-in-mumbai-hyderabad', 'Analytics India Magazine')
S('nvidia-ril', 'Nvidia and Reliance on Blackwell chips for a Jamnagar AI build', 'https://fortune.com/2024/10/24/nvidias-jensen-huang-blackwell-mukesh-ambani-ai-chips-tech/', 'Fortune')
S('colt-vizag', 'Andhra Pradesh approves Rs 1.77 lakh crore investment by RMZ and Colt for 1.25 GW campus', 'https://tradebrains.in/money/andhra-pradesh-approves-1-77-lakh-crore-investment-by-rmz-group-and-colt-data-centre-check-the-location-of-1-25-gw-digital-mega-campus/', 'Trade Brains')
S('airtrunk-ap', 'Blackstone-backed AirTrunk advances $11B India data center development plans', 'https://irei.com/news/blackstone-backed-airtrunk-advances-11b-india-data-center-development-plans', 'IREI')
S('amgreen', 'Uttar Pradesh signs MoU with AM Green Group for 1 GW AI data centre', 'https://www.communicationstoday.co.in/uttar-pradesh-signs-mou-with-am-green-group-for-1-gw-ai-data-centre/', 'Communications Today')
S('ap-aug26', 'Andhra Pradesh clears AI data centre projects under Policy 4.0', 'https://www.medianama.com/2026/08/223-andhra-pradesh-ai-data-centres/', 'MediaNama')
S('pib-gpu25', 'India’s common compute capacity crosses 34,000 GPUs', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2132817', 'Press Information Bureau (MeitY)')
S('pib-ai26', 'Democratising AI in India', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2225781', 'Press Information Bureau')
S('psa-gpu', 'India all set to launch its own AI model; 18,693 GPUs offered (January 2025)', 'https://psa.gov.in/CMS/web/sites/default/files/publication/India%20all%20set%20to%20launch%20its%20own%20safe%20%26%20secure%20indigenous%20AI%20model%20at%20affordable%20cost%20soon%20Shri%20Ashwini%20Vaishnaw.pdf', 'Office of the Principal Scientific Adviser (PIB release)')
S('cdac-rfe', 'MeitY seeks AI compute providers for up to 10,000 GPUs under IndiaAI Mission', 'https://www.medianama.com/2026/10/223-meity-ai-compute-providers-gpus-indiaai-mission/', 'MediaNama')
S('ct-gpu', 'IndiaAI Mission faces gap between capacity and deployed GPUs', 'https://www.communicationstoday.co.in/indiaai-mission-faces-gap-between-capacity-and-deployed-gpus/', 'Communications Today')

# Policy, tax, physical risk
S('pib-budget', 'Union Budget 2026-27: cloud and data centre measures', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2221894', 'Press Information Bureau (MeitY)')
S('pib-bg', 'Backgrounder: tax holiday for foreign cloud companies using Indian data centres', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2227953', 'Press Information Bureau')
S('mh-green', 'Maharashtra expands green data centre park policy', 'https://powerpeakdigest.com/maharashtra-green-data-center-policy-expansion/', 'Power Peak Digest')
S('tn-policy', 'Tamil Nadu Data Centre Policy 2021', 'https://www.nsws.gov.in/s3fs/2021-12/Data%20Centre%20Policy%202021.pdf', 'Government of Tamil Nadu (via National Single Window System)')
S('tg-5gw', 'Hyderabad emerging as major AI data centre hub: Telangana official', 'https://www.aninews.in/news/business/hyderabad-emerging-as-major-ai-data-centre-hub-with-usd-10-20-billion-investments-in-pipeline-telangana-govt-official20260528202824/', 'ANI')
S('is1893', 'IS 1893 (Part 1):2002, Annex E zone factors', 'https://law.resource.org/pub/in/bis/S03/is.1893.1.2002.pdf', 'Bureau of Indian Standards')
S('mum-2005', 'Global hazards, July 2005', 'https://www.ncei.noaa.gov/sotc/hazards/200507', 'NOAA National Centers for Environmental Information')
S('imd-chn', 'Meenambakkam climate extremes', 'https://mausam.imd.gov.in/chennai/mcdata/extreme_meenambakkam.pdf', 'India Meteorological Department, RMC Chennai')
S('hyd-2020', '2020 Hyderabad floods', 'https://en.wikipedia.org/wiki/2020_Hyderabad_floods', 'Wikipedia (citing The Times of India, The Indian Express, The Hindu)')
S('hml', 'Harmonised Master List of Infrastructure sub-sectors (notification of 11 October 2022)', 'https://www.pppinindia.gov.in/report/Harmonised%20Master%20list%20of%20Infrastruture%20sub%20sectors%202022_1685079764.pdf', 'Ministry of Finance, Department of Economic Affairs')
S('cgwa', 'Guidelines to regulate and control ground water extraction in India (24 September 2020)', 'https://neer.co.in/wp-content/uploads/2022/07/ANNEXURE-2-CGWA-GUIDELINES-FOR-WEBSITE-1.pdf', 'Central Ground Water Authority, Ministry of Jal Shakti')

# Power
S('merc-sop', 'MERC Electricity Supply Code and Standards of Performance Regulations 2021', 'https://www.mahadiscom.in/consumer/wp-content/uploads/2025/08/MERC-SOP-including-PQ-Reg-2021.pdf', 'Maharashtra Electricity Regulatory Commission (via MSEDCL)')
S('merc-myt', 'MERC MYT Order for MSEDCL, Case 217 of 2024 (28 March 2025)', 'https://www.mahadiscom.in/consumer/wp-content/uploads/2025/08/MSEDCL-MYT-Order_Case_no_217-of-2024.pdf', 'Maharashtra Electricity Regulatory Commission')
S('tn-supply', 'New service connection: categories of supply (Tamil Nadu Electricity Supply Code)', 'https://app1.tangedco.org/nsconline/tcateg.xhtml', 'TNPDCL')
S('tnerc', 'TNERC Suo-motu Tariff Order 6 of 2025 (30 June 2025)', 'https://www.tnpdcl.org/static/tnpdcl/assets/files/tariff/2025/TO062025/TO62025.pdf', 'Tamil Nadu Electricity Regulatory Commission')
S('tg-gtcs', 'GTCS amendment: voltage of supply by contracted demand (19 October 2022)', 'https://tgerc.telangana.gov.in/file_upload/uploads/Clarifications/GTCS%20Amendment_19102022.pdf', 'Telangana Electricity Regulatory Commission')
S('tg-rst', 'Retail supply tariff order FY 2024-25 (28 October 2024)', 'https://tgerc.telangana.gov.in/file_upload/uploads/Tariff%20Orders/Current%20Year%20Orders/2024/FY24-25%20RST%20Order.pdf', 'Telangana Electricity Regulatory Commission')
S('tg-hans', 'No power tariff hike for 2026-27: TGERC', 'https://www.thehansindia.com/telangana/no-power-tariff-hike-for-202627-tgerc-1061820', 'The Hans India')

# Singapore and Malaysia
S('edb-roadmap', 'Singapore to expand data centre capacity by at least one third, pushes for green energy use', 'https://www.edb.gov.sg/en/business-insights/insights/singapore-to-expand-data-centre-capacity-by-at-least-one-third-pushes-for-green-energy-use.html', 'Singapore Economic Development Board')
S('nrf-cfa2', 'Singapore’s Green Data Centre Roadmap and DC-CFA2', 'https://www.nortonrosefulbright.com/en/knowledge/publications/3b294288/singapore-s-green-data-centre-roadmap-and-dc-cfa2-driving-sustainable-ai-ready-infrastructure', 'Norton Rose Fulbright')
S('ml-cfa2', 'Singapore announces data center capacity allocation call', 'https://www.morganlewis.com/pubs/2026/03/singapore-announces-data-center-capacity-allocation-call', 'Morgan Lewis')
S('tnb-esa', 'Data centre demand to energise TNB growth (RHB Research)', 'https://www.klsescreener.com/v2/news/view/1753783/Data_centre_demand_to_energise_TNB_growth', 'The Star via KLSE Screener')
S('johor-comm', 'Johor govt sets up special committee to vet data centres’ impact on water demand', 'https://www.malaymail.com/news/malaysia/2025/08/19/amid-fears-of-water-crisis-by-2030-johor-govt-sets-up-special-committee-to-vet-data-centres-impact-on-demand/188139', 'Malay Mail')
S('johor-tariff', 'Johor’s water tariff adjustment: data centres would have to pay more', 'https://www.thestar.com.my/news/nation/2025/08/02/johor039s-water-tariff-adjustment-data-centres-would-have-to-pay-more', 'The Star')

ARTICLES = []

# ─────────────────────────────── Companies ───────────────────────────────
ARTICLES.append(article(
    'data-centre-companies-india',
    'Data centre companies in India (2026): the largest operators, their capacity and recent deals',
    'The largest data centre companies in India by colocation share are NTT, Sify, STT GDC, Nxtra and CtrlS (Anarock, H1 2026), with Yotta, AdaniConneX and new entrants such as AirTrunk, TCS HyperVault and CoreWeave.',
    'India',
    'India’s data centre market is led by five operators. Anarock’s H1 2026 share table puts NTT at 21%, Sify and STT GDC at 19% each, and Nxtra (Airtel) and CtrlS at 15% each, followed by Yotta at 5%. Behind them sit AdaniConneX, Princeton Digital, Iron Mountain, Equinix, Digital Edge and CapitaLand, plus hyperscalers building their own campuses. In 2026 the capital came in fast: Nxtra raised US$1 billion, CPP Investments committed up to Rs 7,000 crore to CtrlS, AirTrunk bought Lumina CloudInfra, and CoreWeave agreed to take 240 MW from AdaniConneX.',
    [
        'Anarock H1 2026 shares: NTT 21%, Sify 19%, STT GDC 19%, Nxtra 15%, CtrlS 15%, Yotta 5%, Princeton Digital 3%, Iron Mountain (Web Werks) 2%, AdaniConneX 1%. Anarock does not state the base; it appears to be third-party colocation capacity.',
        'Company-stated capacity is not comparable across operators: some report built IT load, some operational capacity, some capacity “in operation and development”.',
        'Hyperscalers (AWS, Microsoft, Google) build their own campuses and are not in the colocation share table.',
        'New entrants since 2025: AirTrunk (Lumina), TCS HyperVault, Digital Connexion, Colt DCS with RMZ, CoreWeave as a tenant.',
    ],
    [
        sec('companies-share', 'Largest data centre companies in India by share (H1 2026)',
            table(['Operator', 'Share (Anarock, H1 2026)', 'Parent'], [
                ['NTT DATA (NTT GDC India)', '21%', 'NTT DATA, Japan'],
                ['Sify Infinit Spaces', '19%', 'Sify Technologies'],
                ['STT GDC India', '19%', 'STT GDC, Singapore'],
                ['Nxtra', '15%', 'Bharti Airtel'],
                ['CtrlS', '15%', 'CtrlS Datacenters'],
                ['Yotta', '5%', 'Hiranandani Group'],
                ['Princeton Digital Group', '3%', 'Princeton Digital Group, Singapore'],
                ['Iron Mountain (Web Werks)', '2%', 'Iron Mountain, US'],
                ['AdaniConneX', '1%', 'Adani Enterprises and EdgeConneX'],
            ], 'anarock'),
            p('Shares are of Anarock’s base, which it does not define. They are a guide to relative size in colocation, not to total capacity, and they exclude hyperscale self-builds.', 'anarock')),
        sec('companies-capacity', 'What each operator says it runs and plans',
            table(['Operator', 'Capacity as stated by the source', 'Plan or recent deal'], [
                ['NTT', '21 data centres, 290 MW IT (March 2025)', '30 data centres and 700 MW by 2027; about US$1.5 billion over three years'],
                ['Sify', '188.04 MW built IT across 14 colocation data centres (DRHP, 30 June 2025); 129 MW operational (IFC, March 2026)', 'IFC package of about US$371 million for 103 MW in Navi Mumbai and Chennai (June 2026)'],
                ['Nxtra (Airtel)', 'About 300 MW; 14 core data centres and 120+ edge sites', 'US$1 billion raise led by Alpha Wave and Carlyle, 30 March 2026; target 1 GW'],
                ['CtrlS', '19 data centres, over 370 MW across 9 markets; 4.4 GW of projects at various stages', 'Up to Rs 7,000 crore from CPP Investments (June 2026)'],
                ['Yotta', 'NM1 Panvel 52 MW, D1 Greater Noida 30 MW, G1 GIFT City 1 MW', '20,736 NVIDIA B300 GPUs at the 60 MW D2 Greater Noida campus'],
                ['AdaniConneX', '3,033 MW of potential IT load across six sites', 'CoreWeave to take 240 MW at Taloja from mid-2028'],
                ['Princeton Digital Group', 'MU1 Mumbai 150 MW across five buildings; MU2 Navi Mumbai 120 MW; CH1 Chennai', 'US$1 billion India plan (September 2024)'],
                ['Iron Mountain (Web Werks)', 'About 14 MW live across six sites; about 152 MW potential', 'Full acquisition of Web Werks in April 2025'],
            ], 'ntt', 'sify-drhp', 'sify-ifc', 'nxtra', 'ctrls-cpp', 'yotta-dc', 'yotta-b300', 'adaniconnex', 'coreweave', 'pdg', 'ironmountain'),
            p('Sify’s two figures show why operator numbers need care: the DRHP counts built IT capacity, IFC counts the operational portfolio. Ask any provider which definition its MW figure uses before comparing.', 'sify-drhp', 'sify-ifc')),
        sec('companies-new', 'New entrants and global operators',
            ul([
                'Equinix opened MB3 in Mumbai in April 2026 with over US$95 million of initial investment and has committed over US$365 million across Mumbai and Chennai.',
                'Digital Edge is building a planned 400 MW campus in Navi Mumbai with NIIF and Stonepeak; BOM2 (48.4 MW) topped out in August 2026, fully committed.',
                'CapitaLand is building a 53 MW gross facility in Ambattur, Chennai, due by the end of 2026.',
                'AirTrunk, owned by Blackstone, acquired Lumina CloudInfra in April 2026, with about 600 MW planned across Mumbai, Chennai and Hyderabad.',
                'Colt DCS and RMZ formed a US$1.7 billion joint venture in November 2024 for Navi Mumbai and Chennai.',
                'TCS HyperVault, with up to Rs 18,000 crore including TPG, targets 1 GW or more; OpenAI is its first customer at 100 MW.',
                'Digital Connexion, the Reliance, Brookfield and Digital Realty joint venture, runs a 100 MW Chennai campus and plans 1 GW in Visakhapatnam.',
            ], 'equinix-mb3', 'digitaledge', 'capitaland', 'airtrunk-lumina', 'colt-jv', 'tcs-hv', 'openai-tcs', 'dcx')),
        sec('companies-hyperscale', 'Hyperscalers building their own data centres',
            p('AWS, Microsoft and Google run or are building their own campuses. AWS operates regions in Mumbai and Hyderabad, Microsoft runs four Indian regions including India South Central in Hyderabad, and Google is building its AI hub in Visakhapatnam with AdaniConneX and Airtel. Invest India and Cushman & Wakefield report that hyperscalers took more than 80% of absorption in H1 2026.', 'aws-127', 'ms-hyd', 'google-blog', 'ii'),
            p('For a buyer of capacity, the useful question is not which company is largest but which one has firm power for the MW and date you need. Ask for the DISCOM sanction or connection agreement behind the hall you would occupy.')),
    ],
    [
        faq('Which is the largest data centre company in India?', 'By Anarock’s H1 2026 colocation share, NTT DATA at 21%, followed by Sify and STT GDC at 19% each and Nxtra and CtrlS at 15% each.', 'anarock'),
        faq('How many data centre operators are there in India?', 'Cushman & Wakefield counted 33 operators across 147 data centres in the top seven cities in H1 2026.', 'cw26'),
        faq('Which Indian data centre companies raised money in 2026?', 'Nxtra raised US$1 billion (March 2026), CtrlS secured up to Rs 7,000 crore from CPP Investments (June 2026), and IFC put together about US$371 million for Sify (June 2026).', 'nxtra', 'ctrls-cpp', 'sify-ifc'),
        faq('Who are the new data center operators entering India?', 'AirTrunk (through Lumina CloudInfra), TCS HyperVault, Digital Connexion, Colt DCS with RMZ, Digital Edge and CapitaLand. CoreWeave entered as a tenant at AdaniConneX.', 'airtrunk-lumina', 'tcs-hv', 'dcx', 'colt-jv', 'digitaledge', 'capitaland', 'coreweave'),
    ],
    pick('anarock', 'ntt', 'sify-drhp', 'sify-ifc', 'nxtra', 'ctrls-cpp', 'yotta-dc', 'yotta-b300', 'adaniconnex', 'coreweave', 'pdg', 'ironmountain', 'equinix-mb3', 'digitaledge', 'capitaland', 'airtrunk-lumina', 'colt-jv', 'tcs-hv', 'openai-tcs', 'dcx', 'aws-127', 'ms-hyd', 'google-blog', 'ii', 'cw26'),
    ['data-centres-in-india', 'data-centre-investment-india', 'ai-data-centres-india', 'data-centres-in-mumbai'],
    minutes=7,
))

# ─────────────────────────────── Mumbai vs Chennai vs Hyderabad ───────────────────────────────
ARTICLES.append(article(
    'mumbai-vs-chennai-vs-hyderabad-data-centres',
    'Mumbai vs Chennai vs Hyderabad for data centres (2026): capacity, power, policy, land and risk',
    'Mumbai has the scale and cables but a nearly committed grid allocation; Chennai has cables and spare halls but flood risk and a lapsed policy; Hyderabad has the biggest hyperscale pipeline and the lowest seismic zone.',
    'India',
    'Mumbai, Chennai and Hyderabad are India’s three main choices for a large data centre, and each wins on a different test. Mumbai has about half of top-seven-city live capacity (Cushman & Wakefield), 13 cable landing stations and the lowest vacancy, but Structure Research reports its Navi Mumbai grid allocation is close to committed. Chennai has seven landing stations and the most spare colocation, but carries flood and cyclone risk and its state policy window closed on 31 March 2026. Hyderabad has the second largest pipeline, Microsoft and AWS regions and Seismic Zone II, but no cable landings.',
    [
        'Pick Mumbai for interconnection and latency to cables; plan for power evidence to be the hardest part.',
        'Pick Chennai for available halls today and east-coast cables; check flood exposure at plot level.',
        'Pick Hyderabad for hyperscale-scale land and power headroom relative to demand; accept no local cable landing.',
        'Rents are within a narrow band across the three; land and power date differ far more.',
    ],
    [
        sec('compare-table', 'Side by side (H1 2026 unless stated)',
            table(['Measure', 'Mumbai', 'Chennai', 'Hyderabad'], [
                ['Operational capacity (Cushman & Wakefield)', '890 MW', '214 MW', '151 MW'],
                ['Under construction', '281 MW', '55 MW', '42 MW'],
                ['Planned', '1,445 MW', '313 MW', '668 MW'],
                ['Share of India upcoming supply to 2030', '45%', '9%', '18%'],
                ['Colocation vacancy', '7.9%', '26.7%', '28.0%'],
                ['Cable landing stations', '13, plus 2 due in 2026', '7, plus 2 under construction', 'None (inland city)'],
                ['Data centres as share of current city peak demand by FY2030 (Crisil)', 'About 60%', 'Not published', 'About 20%'],
                ['Seismic zone (IS 1893)', 'III', 'III', 'II'],
                ['Signature hazard event', '944 mm in 24 hours, July 2005', '1,178.3 mm in November 2015', 'October 2020 floods'],
            ], 'cw26', 'crisil', 'is1893', 'mum-2005', 'imd-chn', 'hyd-2020')),
        sec('compare-power-policy', 'Power and policy',
            table(['Measure', 'Mumbai (Maharashtra)', 'Chennai (Tamil Nadu)', 'Hyderabad (Telangana)'], [
                ['Grid note', 'About 6 GW allocated to Navi Mumbai data centres, close to committed (Structure Research)', 'Two-grid supply for 50 MW+ under the 2021 policy', 'State target of about 5 GW by 2030'],
                ['State policy', 'IT/ITES Policy 2023; Green Data Centre Parks, 20 parks since June 2026', 'Data Centre Policy 2021, for data centres incorporated to 31 March 2026', 'Data Centres Policy 2016'],
                ['Power incentive', 'Rs 1 per unit for 10 or 20 years in green parks, with 51% green power', '50% open access charges and concessional cross subsidy surcharge (2021 policy)', '2016 policy; no current incentive schedule found'],
                ['Voltage for large loads', 'Extra high voltage above 10,000 kVA (20,000 kVA in a Metropolitan Area or on an express feeder)', '110 kV for 10 to 50 MVA; 230 kV above 50 MVA', '132 kV or above above 20,000 kVA, dedicated feeder or LILO'],
                ['HT tariff category for data centres', 'HT industrial (MERC, March 2025)', 'HT-I IT services: Rs 7.50 per kWh plus Rs 608 per kVA per month from 1 July 2025', 'HT-I(A) at 132 kV and above: Rs 6.65 per kVAh plus Rs 500 per kVA per month (FY 2024-25; reportedly unchanged for 2026-27)'],
            ], 'structure', 'mh-green', 'tn-policy', 'tg-5gw', 'merc-sop', 'merc-myt', 'tn-supply', 'tnerc', 'tg-gtcs', 'tg-rst', 'tg-hans'),
            p('Mumbai’s problem is allocation, not generation: new campuses are going to Panvel, Taloja and Rasayani where new substations can be built. Hyderabad’s smaller base means each new campus is a larger share of the local grid, but Crisil’s ratio suggests more room than Mumbai. In Chennai, check whether any incentive still applies to a project incorporated after March 2026.', 'structure', 'crisil', 'tn-policy')),
        sec('compare-cost', 'Rents and land',
            table(['Measure', 'Mumbai', 'Chennai', 'Hyderabad'], [
                ['Colocation rent, 5 MW+ deals (Rs per kW per month, H1 2025)', '6,000 to 7,500', '6,000 to 7,000', '6,000 to 7,000'],
                ['Colocation rent, under 250 kW (Rs per kW per month, H1 2025)', '8,000 to 12,000', '8,000 to 9,000', '7,500 to 9,500'],
            ], 'cw25'),
            p('Rents are close; the latest published table is Cushman & Wakefield’s H1 2025, as its H1 2026 report has none. Land varies more. Anarock puts small suburban Mumbai parcels at Rs 35 to 60 crore per acre and large park land, including Navi Mumbai and outer Chennai, at Rs 3 to 10 crore per acre.', 'cw25', 'anarock')),
        sec('compare-verdict', 'Which city fits which project',
            ul([
                'Interconnection, cloud on-ramps and financial services: Mumbai, usually Powai, Chandivali or Thane-Belapur Road.',
                'A hall in 2026 or 2027 at a few MW: Chennai or Hyderabad, where vacancy is highest.',
                'A 100 MW+ hyperscale or AI campus: Hyderabad’s southern corridor, Mumbai’s outer belt (Panvel, Taloja) if a substation date is firm, or Visakhapatnam.',
                'Lowest natural hazard: Hyderabad (Seismic Zone II, inland).',
            ], 'cw26', 'is1893'),
            p('Invariant runs the same screen on candidate sites in all three cities, so the comparison is on evidence: the power route and its date, the hazard profile at the plot, groundwater, airport height limits, and the approvals each state requires.')),
    ],
    [
        faq('Is Mumbai or Chennai better for a data centre?', 'Mumbai has more capacity, more cables and lower vacancy; Chennai has spare halls and cheaper large land but more flood and cyclone exposure. Power availability in Navi Mumbai is the main Mumbai check.', 'cw26', 'structure', 'imd-chn'),
        faq('Why is Hyderabad growing as a data center market?', 'Hyperscale demand: AWS and Microsoft run regions there, it holds 18% of India’s upcoming supply, and it is Seismic Zone II with land on the southern ring road.', 'cw26', 'ms-hyd', 'is1893'),
        faq('Which city has the most data centres in India?', 'Mumbai, with 890 MW operational in H1 2026, about half of the top seven cities, per Cushman & Wakefield.', 'cw26'),
        faq('How do colocation rents compare in Mumbai, Chennai and Hyderabad?', 'For deals above 5 MW, Cushman & Wakefield’s H1 2025 table shows Rs 6,000 to 7,500 per kW per month in Mumbai and Rs 6,000 to 7,000 in Chennai and Hyderabad.', 'cw25'),
    ],
    pick('cw26', 'crisil', 'is1893', 'mum-2005', 'imd-chn', 'hyd-2020', 'structure', 'mh-green', 'tn-policy', 'tg-5gw', 'merc-sop', 'merc-myt', 'tn-supply', 'tnerc', 'tg-gtcs', 'tg-rst', 'tg-hans', 'cw25', 'anarock', 'ms-hyd'),
    ['data-centres-in-mumbai', 'data-centres-in-chennai', 'data-centres-in-hyderabad', 'find-data-centre-site-india', 'data-centres-in-india'],
    minutes=6,
))

# ─────────────────────────────── India vs Singapore vs Johor ───────────────────────────────
ARTICLES.append(article(
    'india-vs-singapore-vs-johor-data-centres',
    'India vs Singapore vs Johor for data centres (2026): capacity, power, policy, water and cost',
    'Singapore rations new capacity through allocation calls, Johor has signed GW-scale power deals but is tightening water, and India offers lower build cost, rents 30 to 35% below peers and a tax holiday to 2047.',
    'India',
    'India, Singapore and Johor in Malaysia compete for the same Asian cloud and AI capacity, under very different constraints. Singapore had about 1.4 GW across more than 70 data centres in 2024 and now releases new capacity through allocation calls; its second call in December 2025 offered at least 200 MW with a PUE of 1.25 at full load. Malaysia’s utility TNB had signed supply agreements for 59 data centre projects totalling 8.3 GW by mid-2026, while Johor, the main Malaysian cluster, tightened water rules. India had roughly 1.8 GW live in H1 2026, build costs that Cushman & Wakefield puts about 23% below Malaysia, and a tax holiday to 2047 for foreign cloud companies using Indian data centres.',
    [
        'Singapore: capacity is allocated, not open. DC-CFA2 (launched 1 December 2025) offered at least 200 MW with PUE 1.25 at full load, Green Mark Platinum and 50% green energy pathways.',
        'Johor: TNB had 59 data centre projects and 8.3 GW under supply agreements by July 2026. Johor set up a committee to vet data centres’ water demand in August 2025 and raised the data centre water tariff.',
        'India: no national cap; state policies compete with incentives. Build cost about US$7.4 million per MW (Cushman & Wakefield), rents 30 to 35% below peer markets (Crisil).',
        'The figures are not like for like: Singapore’s is a 2024 government capacity figure, Malaysia’s is maximum demand under power contracts, India’s is operational capacity from market reports.',
    ],
    [
        sec('sg-my-in-table', 'Side by side',
            table(['Measure', 'India', 'Singapore', 'Johor (Malaysia)'], [
                ['Capacity figure', 'About 1.8 GW operational, H1 2026 (Cushman & Wakefield 1,789 MW, top seven cities; Savills 1,819 MW IT)', 'About 1.4 GW across more than 70 data centres (EDB, May 2024)', 'TNB supply agreements: 59 projects, 8.3 GW; 36 completed with 4.5 GW maximum capacity (RHB via The Star, July 2026). Malaysia-wide'],
                ['How new capacity is released', 'Market-led; state policies compete with incentives', 'Allocation calls: 80 MW pilot in 2023, DC-CFA2 for at least 200 MW (December 2025)', 'Utility supply agreements; Johor vets projects for water impact'],
                ['Efficiency condition', 'SBI’s sector report says MeitY AI cloud tenders have sought PUE below 1.35', 'DC-CFA2: PUE 1.25 at full IT load; Green Mark for Data Centres 2024 Platinum', 'State committee reviews water usage efficiency per project'],
                ['Green power condition', 'State-specific, for example 51% in Maharashtra green parks and Gujarat', 'At least 50% of new capacity via eligible green pathways (DC-CFA2)', 'Not covered here'],
                ['Water', 'CGWA restricts new industrial groundwater abstraction in over-exploited units', 'Not a stated allocation criterion in sources reviewed', 'Data centre water tariff of RM5.33 per cubic metre from 1 August 2025; committee set up August 2025'],
                ['Build cost', 'About US$7.4 million per MW, about 23% below Malaysia (Cushman & Wakefield)', 'Not compared here', 'India is about 23% below Malaysia (Cushman & Wakefield, country level; no Johor figure)'],
                ['Tax', 'Tax holiday to tax year 2046-47 for foreign cloud companies serving global customers from Indian data centres (Budget 2026-27)', 'Not compared here', 'Not compared here'],
            ], 'cw26', 'savills', 'edb-roadmap', 'ml-cfa2', 'nrf-cfa2', 'tnb-esa', 'johor-comm', 'johor-tariff', 'sbi', 'mh-green', 'cgwa', 'ii', 'pib-bg')),
        sec('sg-detail', 'Singapore: scarce capacity, strict conditions',
            p('Singapore paused new data centres in 2019, ran an 80 MW pilot allocation in 2023, and launched its Green Data Centre Roadmap on 30 May 2024, with at least 300 MW of additional capacity in the near term and more for operators using green energy. The second Data Centre Call for Application opened on 1 December 2025 for at least 200 MW and closed to proposals on 31 March 2026.', 'ml-cfa2', 'edb-roadmap', 'nrf-cfa2'),
            p('Selected applicants must reach PUE of 1.25 or better at full design load, obtain Green Mark for Data Centres 2024 Platinum, and power at least half of the new capacity through eligible green pathways such as biomethane, hydrogen, ammonia or solar. The result is high cost and limited supply, which pushes overflow demand to Johor and, increasingly, India.', 'nrf-cfa2')),
        sec('my-detail', 'Johor: fast power, tightening water',
            p('RHB Research, reported by The Star in July 2026, counted TNB electricity supply agreements for 59 data centre projects with a combined 8.3 GW, of which 36 projects with a maximum capacity of 4.5 GW were completed. These are contracted maximum demands, not IT load in use.', 'tnb-esa'),
            p('Water is Johor’s constraint. The state set up a special technical committee in August 2025 to vet each data centre’s impact on water demand, and a data centre water tariff of RM5.33 per cubic metre took effect on 1 August 2025.', 'johor-comm', 'johor-tariff')),
        sec('in-detail', 'India: lower cost, slower power, state-by-state rules',
            p('India’s advantages are cost and domestic demand. Cushman & Wakefield puts construction at about US$7.4 million per MW, about 23% below Malaysia and 26% below Australia, and Crisil reports Indian rents 30 to 35% below peer markets. The Budget 2026-27 tax holiday to 2047 targets exactly the export use case that Singapore and Johor serve today.', 'ii', 'crisil', 'pib-bg'),
            p('The trade-offs are power timelines and fragmentation. There is no national data centre law; each state sets its own incentives, and grid connection runs through state utilities. Structure Research reports Navi Mumbai’s grid allocation for data centres is close to committed, pushing new Mumbai builds to Panvel, Taloja and Rasayani. Beyond Mumbai, Hyderabad holds 18% of upcoming supply and Visakhapatnam more than 4 GW announced or early-stage.', 'structure', 'cw26', 'ii')),
    ],
    [
        faq('Is India cheaper than Singapore for data centres?', 'Build cost and rents are lower in India: Cushman & Wakefield puts construction at about US$7.4 million per MW and Crisil reports rents 30 to 35% below peer markets. Singapore capacity is limited to allocation calls with strict efficiency and green power conditions.', 'ii', 'crisil', 'nrf-cfa2'),
        faq('How much data centre capacity does Singapore have?', 'About 1.4 GW across more than 70 data centres, per the Singapore Economic Development Board in May 2024, with at least 300 MW more planned in the near term.', 'edb-roadmap'),
        faq('Why is Johor restricting data centres?', 'Mainly water. Johor set up a committee in August 2025 to vet each data centre’s water demand and introduced a data centre water tariff of RM5.33 per cubic metre.', 'johor-comm', 'johor-tariff'),
        faq('What is Singapore’s DC-CFA2?', 'The second Data Centre Call for Application, launched 1 December 2025, allocating at least 200 MW to applicants meeting PUE 1.25 at full load, Green Mark Platinum and 50% green energy pathways.', 'nrf-cfa2', 'ml-cfa2'),
        faq('Does India have a data center tax incentive for foreign cloud companies?', 'Yes. Budget 2026-27 introduced a tax holiday from tax year 2026-27 to 2046-47 for foreign companies providing cloud services globally using data centre services from India, with sales to Indian users through an Indian reseller.', 'pib-budget', 'pib-bg'),
    ],
    pick('cw26', 'savills', 'edb-roadmap', 'ml-cfa2', 'nrf-cfa2', 'tnb-esa', 'johor-comm', 'johor-tariff', 'sbi', 'mh-green', 'cgwa', 'ii', 'pib-bg', 'crisil', 'structure', 'pib-budget'),
    ['data-centres-in-india', 'data-centre-incentives-india-central', 'data-centre-cost-per-mw-india', 'mumbai-vs-chennai-vs-hyderabad-data-centres'],
    minutes=7,
))

# ─────────────────────────────── AI data centres ───────────────────────────────
ARTICLES.append(article(
    'ai-data-centres-india',
    'AI data centres in India (2026): gigawatt campuses, IndiaAI GPUs and power needs',
    'India’s AI data centre build-out is led by gigawatt campuses in Visakhapatnam, Jamnagar and Navi Mumbai, and IndiaAI Mission compute that passed 45,000 GPUs in June 2026 at around Rs 65 per GPU-hour.',
    'India',
    'AI demand is reshaping India’s data centre market from colocation halls into gigawatt campuses. Google is building an AI hub of about 1 GW in Visakhapatnam, Reliance is building a multi-gigawatt AI campus at Jamnagar where Meta is leasing 168 MW, OpenAI has taken 100 MW from TCS HyperVault with an option to reach 1 GW, and CoreWeave will take 240 MW at AdaniConneX in Navi Mumbai. The government’s IndiaAI Mission had more than 45,000 GPUs in its shared compute pool by June 2026, priced around Rs 65 per GPU-hour. Cushman & Wakefield’s AI scenario puts India at about 8 GW by 2030.',
    [
        'Announced gigawatt-scale AI campuses: Google in Visakhapatnam, Reliance at Jamnagar, Digital Connexion and Colt DCS with RMZ in Vizag, AirTrunk in Anakapalli (proposed), TCS HyperVault, AM Green in Greater Noida (MoU).',
        'IndiaAI GPU pool: 18,693 offered (January 2025), 34,333 (May 2025), 38,000+ at Rs 65 per hour (February 2026), 45,000+ (June 2026).',
        'AI racks run 30 to 60 kW against 8 to 10 kW for traditional racks (Anarock). Power per GPU, not floor area, sizes the site.',
        'SBI’s sector report says MeitY AI cloud tenders have sought PUE below 1.35.',
    ],
    [
        sec('ai-campuses', 'AI data centre campuses announced in India',
            table(['Project', 'Scale', 'Location', 'Status and date'], [
                ['Google AI hub (with AdaniConneX, Airtel)', 'About 1 GW; about US$15 billion over 2026 to 2030', 'Visakhapatnam', 'Groundbreaking 28 April 2026'],
                ['Reliance AI campus', 'Multi-gigawatt; more than 120 MW expected online in H2 2026', 'Jamnagar, Gujarat', 'Under construction (February 2026); Meta leasing 168 MW (June 2026)'],
                ['TCS HyperVault', '1 GW+ target; OpenAI 100 MW, option to 1 GW', 'Not disclosed', 'OpenAI deal February 2026'],
                ['Digital Connexion', '1 GW; US$11 billion by 2030', 'Visakhapatnam', 'MoU November 2025'],
                ['Colt DCS and RMZ', '1.25 GW', 'Visakhapatnam', 'Cleared by SIPC July 2026; SIPB approval pending'],
                ['AirTrunk', 'Up to 1.8 GW', 'Anakapalli, Andhra Pradesh', 'Plans submitted November 2026'],
                ['ReNew', '1,000 MW', 'Anakapalli', 'Cleared under AP Policy 4.0, August 2026'],
                ['AM Green', '1 GW', 'Greater Noida', 'MoU; first capacity targeted 2028'],
                ['CoreWeave at AdaniConneX', '240 MW (3 x 80 MW)', 'Taloja, Navi Mumbai', 'First phase mid-2028'],
                ['Yotta D2', '60 MW, scalable to 250 MW; 20,736 NVIDIA B300 GPUs', 'Greater Noida', 'Go-live target August 2026'],
            ], 'google-blog', 'adani-gb', 'reliance-ai', 'meta-jam', 'tcs-hv', 'openai-tcs', 'dcx', 'colt-vizag', 'airtrunk-ap', 'ap-aug26', 'amgreen', 'coreweave', 'yotta-b300'),
            p('Announcements are not capacity. Treat MoUs and approvals as intent until there is a power connection agreement and a construction start. Invest India and Cushman & Wakefield’s AI scenario assumes only 15% of a 15 GW early-stage pipeline converts, which still yields about 8 GW by 2030.', 'ii')),
        sec('ai-gpus', 'IndiaAI Mission compute: GPU counts over time',
            table(['Date', 'GPUs in the pool', 'Price note', 'Source'], [
                ['January 2025', '18,693 offered by qualified bidders (12,896 H100)', 'Average L1 Rs 115.85 per GPU-hour; under Rs 100 after subsidy', 'PIB release via Principal Scientific Adviser'],
                ['May 2025', '34,333 (18,417 existing plus 15,916 added)', 'Second round, seven bidders', 'PIB'],
                ['February 2026', '38,000+ GPUs and 1,050 TPUs', 'Around Rs 65 per GPU-hour', 'PIB'],
                ['June 2026', '45,000+', '15 compute providers empanelled across four rounds (August 2026)', 'Invest India citing PIB; Communications Today'],
                ['October 2026', 'New request for empanelment for up to 10,000 compute units', 'Clusters of 4,000, 1,000 and 512 at a single Indian data centre', 'MediaNama'],
            ], 'psa-gpu', 'pib-gpu25', 'pib-ai26', 'ii', 'ct-gpu', 'cdac-rfe'),
            p('Yotta committed over 10,000 B300 GPUs to IndiaAI. Second-round bidders named by PIB in May 2025 included Cyfuture, Ishan Infotech, Locuz, Netmagic (NTT), Sify Digital, Vensysco and Yotta.', 'yotta-b300', 'pib-gpu25')),
        sec('ai-power', 'Power for AI data centres in India',
            p('An AI campus is sized by power per GPU. Anarock puts AI racks at 30 to 60 kW against 8 to 10 kW for traditional racks, and SBI notes direct-to-chip and immersion cooling start beyond about 15 kW per rack. A 100 MW AI hall therefore needs a high-voltage grid connection with a firm energisation date, not a distribution feeder.', 'anarock', 'sbi'),
            p('That is why the gigawatt projects cluster where new transmission can be built: Visakhapatnam, Jamnagar with captive solar, and the outer Mumbai belt. Crisil estimates Vizag’s data centre capacity could equal about 80% of the city’s current peak demand by FY2030.', 'reliance-ai', 'crisil'),
            links('Sizing a GPU cluster', [('How much power a GPU cluster needs', 'gpu-cluster-power-requirements'), ('Power for data centres in India', 'power-for-data-centres-india'), ('Grid connection: DISCOM, STU and CTU paths', 'data-centre-grid-connection-india')])),
    ],
    [
        faq('How many AI data centres are being built in India?', 'At least nine projects of 240 MW or more were announced or approved between 2025 and November 2026, including Google in Visakhapatnam, Reliance at Jamnagar, TCS HyperVault, Digital Connexion, Colt DCS with RMZ and AirTrunk.', 'google-blog', 'reliance-ai', 'tcs-hv', 'dcx', 'colt-vizag', 'airtrunk-ap'),
        faq('How many GPUs does the IndiaAI Mission have?', 'More than 38,000 GPUs at around Rs 65 per GPU-hour in February 2026 (PIB), and more than 45,000 by June 2026 per Invest India citing PIB.', 'pib-ai26', 'ii'),
        faq('Where is the largest AI data center in India?', 'The largest announced are Google’s AI hub in Visakhapatnam (about 1 GW) and Reliance’s multi-gigawatt campus at Jamnagar. Both are under construction.', 'adani-gb', 'reliance-ai'),
        faq('How much power does an AI data centre need in India?', 'AI racks draw 30 to 60 kW each per Anarock. A 100 MW AI hall needs a high-voltage grid connection with a firm energisation date.', 'anarock'),
    ],
    pick('google-blog', 'adani-gb', 'reliance-ai', 'meta-jam', 'tcs-hv', 'openai-tcs', 'dcx', 'colt-vizag', 'airtrunk-ap', 'ap-aug26', 'amgreen', 'coreweave', 'yotta-b300', 'ii', 'psa-gpu', 'pib-gpu25', 'pib-ai26', 'ct-gpu', 'cdac-rfe', 'anarock', 'sbi', 'crisil'),
    ['data-centres-in-india', 'data-centres-in-visakhapatnam', 'power-for-data-centres-india', 'gpu-cluster-power-requirements', 'data-centre-investment-india'],
    minutes=7,
))

# ─────────────────────────────── Investment ───────────────────────────────
ARTICLES.append(article(
    'data-centre-investment-india',
    'Data centre investment in India (2026): hyperscaler commitments, deals and what to diligence',
    'Announced data centre investment in India passed US$180 billion by September 2026, led by Amazon, Microsoft, Google, Reliance and Adani. The commitments are large; the power behind each campus is what to check.',
    'India',
    'Data centre investment in India has grown faster than the capacity it will build. Invest India and Cushman & Wakefield count disclosed commitments of US$27 billion in 2023, US$29.6 billion in 2024, US$56.4 billion in 2025 and US$184 billion in January to September 2026. Amazon has committed US$48 billion for 2026 to 2030, Microsoft US$17.5 billion for 2026 to 2029, and Google about US$15 billion for its Visakhapatnam AI hub. Reliance announced a US$110 billion AI compute plan and Adani US$100 billion through 2035. The Budget 2026-27 added a tax holiday to 2047 for foreign cloud companies using Indian data centres.',
    [
        'Disclosed commitments: US$184 billion in January to September 2026 alone (Invest India and Cushman & Wakefield). CBRE counts Rs 15.29 lakh crore (US$173 billion) cumulative since 2021.',
        'Equity mix of current investments: 61% foreign, 39% domestic.',
        'Long-tenor debt costs about 9.5 to 10.5% for up to 12 years, helped by infrastructure status (Anarock).',
        'A commitment is not capacity. The diligence question is whether the campus has a firm power connection and date.',
    ],
    [
        sec('invest-hyperscalers', 'Hyperscaler and AI commitments',
            table(['Company', 'Amount', 'Period and where', 'Announced', 'Status'], [
                ['Amazon (all businesses)', 'US$35 billion more; total US$48 billion for 2026 to 2030 after a further US$13 billion for AWS', 'AWS capacity in Mumbai and Hyderabad', '10 December 2025; 25 June 2026', 'Confirmed by company'],
                ['AWS', 'Rs 1,05,600 crore (US$12.7 billion) by 2030, including US$8.3 billion in Maharashtra', 'Mumbai and Hyderabad regions', 'May 2023; January 2025', 'Confirmed by company'],
                ['Microsoft', 'US$17.5 billion', 'CY2026 to 2029; India South Central (Hyderabad) and other regions', '9 December 2025', 'Confirmed by company'],
                ['Google', 'About US$15 billion', '2026 to 2030; AI hub in Visakhapatnam', '14 October 2025', 'Confirmed; groundbreaking 28 April 2026'],
                ['Reliance', 'Rs 10 trillion (about US$110 billion)', 'Seven years; AI compute including Jamnagar', '19 February 2026', 'Announced plan'],
                ['Adani', 'US$100 billion', 'Through 2035; AI-ready data centres and related infrastructure', 'Reported by Cushman & Wakefield, H1 2026', 'Announced plan'],
                ['Meta', '168 MW lease', 'Reliance Jamnagar', '10 June 2026', 'Confirmed lease'],
                ['OpenAI', '100 MW, option to 1 GW', 'TCS HyperVault', '18 February 2026', '100 MW firm; 1 GW an option'],
                ['Oracle', 'Not disclosed', 'New data centres in Mumbai and Hyderabad', 'February 2026', 'Reported by Analytics India Magazine'],
            ], 'amazon-35', 'amazon-48', 'aws-127', 'aws-mh', 'ms-175', 'google-blog', 'adani-gb', 'reliance-ai', 'cw26', 'meta-jam', 'openai-tcs', 'oracle')),
        sec('invest-deals', 'Operator deals in 2025 and 2026',
            table(['Date', 'Deal', 'Size'], [
                ['November 2025', 'TPG into TCS HyperVault', 'Up to Rs 8,820 crore for 27.5 to 49%; up to Rs 18,000 crore in total'],
                ['November 2025', 'Digital Connexion 1 GW Visakhapatnam campus', 'US$11 billion by 2030'],
                ['30 March 2026', 'Nxtra raise led by Alpha Wave and Carlyle', 'US$1 billion; post-money about US$3.1 billion'],
                ['20 April 2026', 'AirTrunk acquires Lumina CloudInfra', 'Terms undisclosed; about 600 MW planned'],
                ['May 2026', 'STT GDC buys 3.48 acres in Navi Mumbai', 'Rs 282 crore'],
                ['17 June 2026', 'CPP Investments into CtrlS', 'Up to Rs 7,000 crore (Rs 4,000 crore for 8.2% plus up to Rs 3,000 crore in a hyperscale JV)'],
                ['18 June 2026', 'IFC package for Sify', 'About US$371 million'],
                ['July 2026', 'Colt DCS and RMZ 1.25 GW Visakhapatnam campus cleared by SIPC (SIPB approval pending)', 'Rs 1.77 lakh crore'],
                ['6 October 2026', 'CoreWeave lease at AdaniConneX Taloja', '240 MW'],
                ['November 2026', 'AirTrunk Anakapalli plans', 'About US$11 billion for up to 1.8 GW, subject to approval'],
            ], 'tcs-hv', 'dcx', 'nxtra', 'airtrunk-lumina', 'stt-nm', 'ctrls-cpp', 'sify-ifc', 'colt-vizag', 'coreweave', 'airtrunk-ap')),
        sec('invest-totals', 'How much has been committed, and why the totals differ',
            p('Invest India and Cushman & Wakefield count announced investment above US$180 billion as of September 2026, with US$184 billion disclosed in January to September 2026 alone and an equity mix of 61% foreign and 39% domestic. CBRE counts Rs 3.34 lakh crore (US$38 billion) in H1 2026 and Rs 15.29 lakh crore (US$173 billion) since 2021. Anarock cites more than US$300 billion of commitments.', 'ii', 'cbre', 'anarock'),
            p('The totals differ because they mix multi-year plans, group-wide AI programmes that include more than data centres, and MoUs that may not proceed. For underwriting, count only projects with land, a power connection agreement and a construction start.')),
        sec('invest-diligence', 'What to diligence before investing in an Indian data centre',
            ul([
                'Power: the DISCOM sanction letter or transmission connection agreement, the substation and voltage, the energisation date, and what else is queued on the same substation.',
                'Policy: which state policy applies, whether its window is still open (Tamil Nadu’s closed on 31 March 2026), and whether incentives are in a project-specific order.',
                'Site: seismic zone, flood history, groundwater unit status, airport height limits and coastal rules.',
                'Contracts: tenor (Crisil reports 15 to 20 years is now common), tenant concentration and power pass-through.',
            ], 'crisil'),
            p('Infrastructure status for data centres of 5 MW or more of IT load, notified on 11 October 2022, gives access to long-tenor infrastructure lending. Anarock puts long-tenor debt at about 9.5 to 10.5% for up to 12 years.', 'hml', 'anarock'),
            links('Power diligence', [('Five rungs of power evidence', 'power-evidence-data-center-site-verification'), ('Power studies for Indian data centre sites', 'power-study-data-centre-india'), ('Site due diligence in India', 'data-centre-site-due-diligence-india')])),
    ],
    [
        faq('How much is being invested in data centres in India?', 'Invest India and Cushman & Wakefield count more than US$180 billion of announced investment as of September 2026, including US$184 billion disclosed in January to September 2026.', 'ii'),
        faq('Which companies are investing the most in Indian data centres?', 'Amazon (US$48 billion for 2026 to 2030), Microsoft (US$17.5 billion for 2026 to 2029), Google (about US$15 billion in Visakhapatnam), Reliance (US$110 billion AI plan) and Adani (US$100 billion through 2035).', 'amazon-48', 'ms-175', 'google-blog', 'reliance-ai', 'cw26'),
        faq('Is there a data centre REIT or listed data center company in India?', 'Sify Technologies is listed on Nasdaq and filed to list its data centre arm, Sify Infinit Spaces, in India. We found no Indian data centre REIT as of November 2026.', 'sify-drhp'),
        faq('What should an investor check before buying into an Indian data centre?', 'The power connection agreement and date, the applicable state policy and its validity, site hazards and groundwater, and tenant contract terms.', 'crisil'),
    ],
    pick('amazon-35', 'amazon-48', 'aws-127', 'aws-mh', 'ms-175', 'google-blog', 'adani-gb', 'reliance-ai', 'cw26', 'meta-jam', 'openai-tcs', 'oracle', 'tcs-hv', 'dcx', 'nxtra', 'airtrunk-lumina', 'stt-nm', 'ctrls-cpp', 'sify-ifc', 'colt-vizag', 'coreweave', 'airtrunk-ap', 'ii', 'cbre', 'anarock', 'crisil', 'sify-drhp', 'hml'),
    ['data-centres-in-india', 'data-centre-companies-india', 'data-centre-incentives-india-central', 'data-centre-site-due-diligence-india', 'power-study-data-centre-india'],
    minutes=7,
))
