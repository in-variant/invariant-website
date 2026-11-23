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
S('ntt', 'NTT DATA accelerates India digital future with multi-billion AI and infrastructure investments', 'https://www.nttdata.com/en-us/news/2025/ntt-data-accelerates-india-digital-future-with-multi-billion-ai-and-infrastructure-investments', 'NTT DATA')
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

# Replacement sources found during fact-check (November 2026)
S('crisil-dh', 'India set for five times surge in its data centre capacity by 2030 (Crisil Ratings)', 'https://www.deccanherald.com/business/india-set-for-five-times-surge-in-its-data-centre-capacity-by-2030-4205631', 'Deccan Herald')
S('sify-drhp-nse', 'Sify Infinit Spaces Limited draft red herring prospectus (October 2025)', 'https://nsearchives.nseindia.com/corporate/Registration_17102025141743_DRHP_Fillingversion.pdf', 'Sify Infinit Spaces (filed with NSE)')
S('sify-pr', 'Sify Infinit Spaces files draft red herring prospectus in India', 'https://www.nasdaq.com/press-release/sify-infinit-spaces-files-draft-red-herring-prospectus-india-2025-10-17', 'Sify (GlobeNewswire via Nasdaq)')
S('pdg-bs', 'PDG plans infusing $1 bn for expansion in India amid AI data center boom', 'https://www.business-standard.com/companies/news/pdg-plans-infusing-1-bn-for-expansion-in-india-amid-ai-data-center-boom-124091900865_1.html', 'Business Standard')
S('colt-jv-pr', 'Colt Data Centre Services and RMZ announce a joint venture to invest $1.7 billion in the Indian data centre market', 'https://www.prnewswire.com/news-releases/colt-data-centre-services-and-rmz-announce-a-joint-venture-to-invest-1-7-billion-in-the-indian-data-centre-market-302309560.html', 'Colt DCS (PR Newswire)')
S('colt-vizag-dcd', 'Colt and RMZ look to develop gigawatt-scale data center campus in Vizag', 'https://www.datacenterdynamics.com/en/news/colt-rmz-look-to-develop-gigawatt-scale-data-center-campus-in-vizag-india/', 'DCD')
S('tnb-star', 'Data centre demand to energise TNB growth', 'https://www.thestar.com.my/business/business-news/2026/07/13/data-centre-demand-to-energise-tnb-growth', 'The Star')
S('iba-green', 'Green data centres in India: policy meets practice', 'https://www.ibanet.org/green-data-centres-in-India-policy-meets-practice', 'International Bar Association')
S('snr', 'Indian Budget 2026-27: tax incentives for data centres', 'https://www.snrlaw.in/indian-budget-2026-27-tax-incentives-for-data-centres/', 'S&R Associates')
S('hyd-aj', 'Many dead as record rains lash India’s Hyderabad and nearby areas', 'https://www.aljazeera.com/news/2020/10/14/several-dead-in-house-collapse-amid-record-rain-in-southern-india', 'Al Jazeera')

ARTICLES = []

# ─────────────────────────────── Companies ───────────────────────────────
ARTICLES.append(article(
    'data-centre-companies-india',
    'Data centre companies in India: the largest operators and recent deals (2026)',
    'NTT led India’s data centre companies with a 21% share in H1 2026 (Anarock), ahead of Sify, STT GDC, Nxtra and CtrlS. Capacity, plans and 2026 deals by operator.',
    'India',
    'NTT had the largest share of India’s data centre market in H1 2026, 21% according to Anarock, followed by Sify and STT GDC at 19% each, Nxtra (Airtel) and CtrlS at 15% each, and Yotta at 5%. Other operators include AdaniConneX, Princeton Digital, Iron Mountain, Equinix, Digital Edge and CapitaLand, and hyperscalers build their own campuses. Deals in 2026 included a US$1 billion investment in Nxtra, up to Rs 7,000 crore from CPP Investments for CtrlS, AirTrunk’s acquisition of Lumina CloudInfra, and a planned 240 MW CoreWeave deployment at AdaniConneX.',
    [
        'Anarock H1 2026 shares: NTT 21%, Sify 19%, STT GDC 19%, Nxtra 15%, CtrlS 15%, Yotta 5%, Princeton Digital 3%, Iron Mountain (Web Werks) 2%, AdaniConneX 1%. Anarock does not state the base.',
        'Company-stated capacity is not comparable across operators: Sify reported 188.04 MW of built IT capacity in its DRHP (30 June 2025) and IFC described a 129 MW operational portfolio (March 2026).',
        'Hyperscalers (AWS, Microsoft, Google) build their own campuses and are not in Anarock’s share table; they took more than 80% of absorption in H1 2026, according to Invest India and Cushman & Wakefield.',
        'New entrants since 2025: TCS HyperVault; AirTrunk, which gained about 600 MW of planned capacity by acquiring Lumina CloudInfra; and CoreWeave, a tenant planning 240 MW at AdaniConneX.',
    ],
    [
        sec('companies-share', 'Largest data centre companies in India by share (H1 2026)',
            table(['Operator', 'Share (Anarock, H1 2026)'], [
                ['NTT Global Data Centres', '21%'],
                ['Sify Technologies', '19%'],
                ['STT Global Data Centres', '19%'],
                ['Nxtra by Airtel', '15%'],
                ['CtrlS', '15%'],
                ['Yotta Infrastructure', '5%'],
                ['Princeton Digital Group', '3%'],
                ['Iron Mountain (Web Werks)', '2%'],
                ['AdaniConneX', '1%'],
            ], 'anarock'),
            p('Shares are of Anarock’s base, which it does not define. Treat them as a guide to relative size among these operators, not to total capacity.', 'anarock')),
        sec('companies-capacity', 'Capacity and expansion plans by operator',
            table(['Operator', 'Capacity as stated by the source', 'Plan or recent deal'], [
                ['NTT', 'Its largest India campus can hold over 500 MW when fully operational (NTT DATA, March 2025)', 'Aims to add 400 MW more in the coming years; US$3 billion invested in India over the last decade'],
                ['Sify', '188.04 MW built IT capacity (DRHP, 30 June 2025); 129 MW operational portfolio (IFC, March 2026)', 'IFC package of about US$371 million for two data centres of 103 MW combined in Navi Mumbai and Chennai (June 2026)'],
                ['Nxtra (Airtel)', 'About 300 MW; 14 large core data centres and 120+ edge facilities', 'US$1 billion from Alpha Wave Global, Carlyle, Anchorage Capital and Airtel, 30 March 2026; aims for 1 GW'],
                ['CtrlS', '19 data centres across nine markets, over 370 MW; 4.4 GW of projects at various stages', 'Up to Rs 7,000 crore from CPP Investments (June 2026)'],
                ['Yotta', 'NM1 Navi Mumbai 52 MW, D1 Greater Noida 30 MW, G1 GIFT City 1 MW (IT load)', '20,736 NVIDIA Blackwell Ultra GPUs for its 60 MW D2 Greater Noida data centre, with additional capacity from Navi Mumbai'],
                ['AdaniConneX', '3,033 MW of potential IT load across six sites', 'CoreWeave plans 240 MW at Taloja; first phase expected mid-2028'],
                ['Princeton Digital Group', 'MU1 Mumbai expanding to 150 MW; new 72 MW CH1 campus in Chennai; 230 MW in total', 'US$1 billion India plan (September 2024)'],
                ['Iron Mountain (Web Werks)', 'About 14 MW across six data centres; three new campuses with 152 MW potential', 'Full ownership of Web Werks from April 2025'],
            ], 'ntt', 'sify-drhp-nse', 'sify-ifc', 'nxtra', 'ctrls-cpp', 'yotta-dc', 'yotta-b300', 'adaniconnex', 'coreweave', 'pdg-bs', 'ironmountain'),
            p('Sify’s two figures show why operator numbers need care: the DRHP counts built IT capacity, while IFC counts the operational portfolio. Ask any provider which definition its MW figure uses before comparing.', 'sify-drhp-nse', 'sify-ifc')),
        sec('companies-new', 'New entrants and global data centre operators in India',
            ul([
                'Equinix opened MB3, its fourth Mumbai data centre, in April 2026 with an initial investment of over US$95 million, taking its cumulative investment in India to over US$365 million.',
                'Digital Edge is developing a planned 400 MW campus in Navi Mumbai; BOM2 topped out and BOM3 construction began in August 2026, which with BOM1 brings the campus to close to 120 MW.',
                'CapitaLand is building a facility with 53 MW of gross power capacity in Ambattur, Chennai, due by the end of 2026.',
                'AirTrunk, backed by Blackstone and CPPIB, acquired Lumina CloudInfra in April 2026, gaining about 600 MW of planned capacity; Lumina operates in Mumbai, Chennai and Hyderabad.',
                'Colt DCS and RMZ formed a 50:50 joint venture to invest US$1.7 billion in November 2024, starting with existing sites in Navi Mumbai and Ambattur, Chennai.',
                'TCS HyperVault, with up to Rs 18,000 crore committed by TCS and TPG, aims for capacity above 1 GW; OpenAI is its first customer, starting with 100 MW.',
                'Digital Connexion, the Reliance, Brookfield and Digital Realty joint venture, launched a Chennai campus built for up to 100 MW of IT load in January 2024 and plans 1 GW in Visakhapatnam.',
            ], 'equinix-mb3', 'digitaledge', 'capitaland', 'airtrunk-lumina', 'colt-jv-pr', 'tcs-hv', 'openai-tcs', 'dcx')),
        sec('companies-hyperscale', 'Hyperscalers building their own data centres',
            p('AWS, Microsoft and Google run or are building their own data centre campuses in India. AWS operates regions in Mumbai and Hyderabad, Microsoft runs four Indian regions including India South Central in Hyderabad, and Google is building its AI hub in Visakhapatnam with AdaniConneX and Airtel. Invest India and Cushman & Wakefield report that hyperscalers took more than 80% of absorption in H1 2026.', 'aws-127', 'ms-hyd', 'google-blog', 'ii'),
            p('A buyer of capacity should ask which operator has firm power for the MW and date it needs, and see the DISCOM sanction or connection agreement behind the hall it would occupy.')),
    ],
    [
        faq('Which is the largest data centre company in India?', 'NTT, with 21% of the market in H1 2026 according to Anarock. Sify and STT GDC follow at 19% each, then Nxtra and CtrlS at 15% each.', 'anarock'),
        faq('How many data centre operators are there in India?', 'India had 33 data centre operators running 147 data centres in its top seven cities in H1 2026, according to Cushman & Wakefield.', 'cw26'),
        faq('Which Indian data centre companies raised money in 2026?', 'Nxtra, CtrlS and Sify all raised money in 2026. Nxtra announced a US$1 billion investment (March 2026), CtrlS secured up to Rs 7,000 crore from CPP Investments (June 2026), and IFC announced a package of about US$371 million for Sify Infinit Spaces (June 2026).', 'nxtra', 'ctrls-cpp', 'sify-ifc'),
        faq('Who are the new data center operators entering India?', 'Recent entrants include AirTrunk, TCS HyperVault and CoreWeave. AirTrunk entered through its April 2026 acquisition of Lumina CloudInfra, and TPG agreed to invest in TCS’s HyperVault AI data centre business in November 2025. CoreWeave announced its entry as a tenant at AdaniConneX in October 2026.', 'airtrunk-lumina', 'tcs-hv', 'coreweave'),
        faq('Do hyperscalers run their own data centres in India?', 'Yes. AWS operates regions in Mumbai and Hyderabad, Microsoft runs four Indian regions including India South Central in Hyderabad, and Google is building its AI hub in Visakhapatnam. Hyperscalers took more than 80% of absorption in H1 2026, according to Invest India and Cushman & Wakefield.', 'aws-127', 'ms-hyd', 'google-blog', 'ii'),
    ],
    pick('anarock', 'ntt', 'sify-drhp-nse', 'sify-ifc', 'nxtra', 'ctrls-cpp', 'yotta-dc', 'yotta-b300', 'adaniconnex', 'coreweave', 'pdg-bs', 'ironmountain', 'equinix-mb3', 'digitaledge', 'capitaland', 'airtrunk-lumina', 'colt-jv-pr', 'tcs-hv', 'openai-tcs', 'dcx', 'aws-127', 'ms-hyd', 'google-blog', 'ii', 'cw26'),
    ['data-centres-in-india', 'data-centre-investment-india', 'ai-data-centres-india', 'data-centres-in-mumbai'],
    minutes=7,
))

# ─────────────────────────────── Mumbai vs Chennai vs Hyderabad ───────────────────────────────
ARTICLES.append(article(
    'mumbai-vs-chennai-vs-hyderabad-data-centres',
    'Mumbai vs Chennai vs Hyderabad for data centres: power, policy and risk (2026)',
    'Mumbai had 890 MW of live data centre capacity in H1 2026, Chennai 214 MW and Hyderabad 151 MW. Power, policy, rents, flood and seismic risk compared.',
    'India',
    'Mumbai had 890 MW of operational data centre capacity in H1 2026, against 214 MW in Chennai and 151 MW in Hyderabad, according to Cushman & Wakefield, and each city wins on a different test. Mumbai has 13 cable landing stations and the lowest vacancy of the three, but Structure Research reports that committed capacity is approaching its Navi Mumbai grid allocation. Chennai has seven landing stations and 26.7% colocation vacancy, but carries flood risk, and its 2021 state policy covers data centres incorporated by 31 March 2026. Hyderabad has the second largest pipeline, Microsoft and AWS regions and Seismic Zone II, but no cable landings, as it is inland.',
    [
        'Mumbai suits interconnection, with 13 cable landing stations and 7.9% colocation vacancy (Cushman & Wakefield, H1 2026); power evidence is the hardest part, as committed capacity approaches MSEDCL’s Navi Mumbai allocation (Structure Research).',
        'Chennai suits buyers who need a hall now, with 26.7% colocation vacancy (Cushman & Wakefield, H1 2026) and east-coast cables; check flood exposure at plot level.',
        'Hyderabad holds 18% of India’s upcoming supply (Cushman & Wakefield), and Crisil’s ratio of data centre capacity to city peak demand by FY2030 is about 20% there against about 60% in Mumbai, suggesting more power headroom relative to city demand; it has no local cable landing.',
        'Colocation rents for 5 MW+ deals ran from Rs 6,000 to 7,500 per kW per month across the three cities in H1 2025 (Cushman & Wakefield); land and power date differ far more.',
    ],
    [
        sec('compare-table', 'Mumbai, Chennai and Hyderabad compared (H1 2026 unless stated)',
            p('Mumbai has more operational capacity and cable landings than Chennai and Hyderabad and the lowest colocation vacancy of the three, while Hyderabad has more planned capacity than Chennai, 668 MW against 313 MW, on Cushman & Wakefield’s H1 2026 figures.', 'cw26'),
            table(['Measure', 'Mumbai', 'Chennai', 'Hyderabad'], [
                ['Operational capacity (Cushman & Wakefield)', '890 MW', '214 MW', '151 MW'],
                ['Under construction', '281 MW', '55 MW', '42 MW'],
                ['Planned', '1,445 MW', '313 MW', '668 MW'],
                ['Share of India upcoming supply to 2030', '45%', '9%', '18%'],
                ['Colocation vacancy', '7.9%', '26.7%', '28.0%'],
                ['Cable landing stations', '13, plus 2 due in 2026', '7, plus 2 under construction', 'None (inland city)'],
                ['Data centres as share of current city peak demand by FY2030 (Crisil)', 'About 60%', 'Not published', 'About 20%'],
                ['Seismic zone (IS 1893 (Part 1):2002 town list)', 'III', 'III', 'II'],
                ['Signature hazard event', '944 mm of rain on 26 July 2005 (NOAA)', '1,178.3 mm in November 2015 at Meenambakkam, the highest November total on record (IMD)', 'Record rains and deadly flooding, October 2020'],
            ], 'cw26', 'crisil-dh', 'is1893', 'mum-2005', 'imd-chn', 'hyd-aj')),
        sec('compare-power-policy', 'Power supply and state data centre policy in each city',
            table(['Measure', 'Mumbai (Maharashtra)', 'Chennai (Tamil Nadu)', 'Hyderabad (Telangana)'], [
                ['Grid note', 'About 6 GW allocated by MSEDCL to Navi Mumbai data centres, with committed capacity approaching it (Structure Research)', 'Dual power from two grids for data centres with sanctioned load of 50 MW or more (2021 policy)', 'Not found in sources reviewed'],
                ['State policy', 'IT/ITES Policy 2023; Integrated Green Data Centre Parks, up to 20 parks statewide after a June 2026 amendment', 'Data Centre Policy 2021, for data centres incorporated from 1 April 2021 to 31 March 2026', 'Dedicated data centre policy since 2016, the first in India (Cushman & Wakefield)'],
                ['Power incentive', 'Re 1 per unit for 10 years (Rs 30,000 crore investment) or 20 years (Rs 60,000 crore or more) in green parks, which must use at least 51% green power for core operations', 'Open access charges at 50% of conventional charges; concessional cross subsidy surcharge (2021 policy)', 'Not found in sources reviewed'],
                ['Voltage for large loads', 'Extra high voltage above 10,000 kVA contract demand (20,000 kVA in a Metropolitan Area or on an express feeder)', '110 kV for 10 to 50 MVA; 230 kV above 50 MVA', '132 kV or above for contracted demand above 10,000 kVA on a common feeder or above 20,000 kVA on a dedicated feeder, through a dedicated feeder or LILO'],
                ['HT industrial tariff', 'MERC classifies data centres under the Industrial category (Case 217 of 2024)', 'Data centres buy at industrial tariff (2021 policy); HT-I Industries, Factories, IT services: Rs 7.50 per kWh plus Rs 608 per kVA per month from 1 July 2025', 'HT-I(A) Industry General at 132 kV and above: Rs 6.65 per kVAh plus Rs 500 per kVA per month (FY 2024-25; reported unchanged for 2026-27)'],
            ], 'structure', 'iba-green', 'tn-policy', 'cw25', 'merc-sop', 'merc-myt', 'tn-supply', 'tnerc', 'tg-gtcs', 'tg-rst', 'tg-hans'),
            p('Structure Research describes Mumbai’s constraint as grid allocation: new campuses are going to Panvel, Taloja and Rasayani, where separate substation infrastructure can be commissioned. Crisil’s ratio of data centre capacity to current peak demand by FY2030 is about 20% for Hyderabad against about 60% for Mumbai. In Chennai, check whether any incentive applies to a project incorporated after March 2026.', 'structure', 'crisil-dh', 'tn-policy')),
        sec('compare-cost', 'Colocation rents and land prices in Mumbai, Chennai and Hyderabad',
            table(['Measure', 'Mumbai', 'Chennai', 'Hyderabad'], [
                ['Colocation rent, 5 MW+ deals (Rs per kW per month, H1 2025)', '6,000 to 7,500', '6,000 to 7,000', '6,000 to 7,000'],
                ['Colocation rent, under 250 kW (Rs per kW per month, H1 2025)', '8,000 to 12,000', '8,000 to 9,000', '7,500 to 9,500'],
            ], 'cw25'),
            p('Colocation rents in the three cities are close; Cushman & Wakefield’s latest rent table is from H1 2025, as its H1 2026 report has none. Land prices vary more. Anarock puts small suburban Mumbai parcels at Rs 35 to 60 crore per acre and large park land, including Navi Mumbai and outer Chennai, at Rs 3 to 10 crore per acre.', 'cw25', 'anarock')),
        sec('compare-verdict', 'Which city suits which data centre project',
            ul([
                'Interconnection, cloud on-ramps and financial services: Mumbai, where Cushman & Wakefield’s main clusters are Thane-Belapur Road and Powai.',
                'A hall in 2026 or 2027 at a few MW: Chennai or Hyderabad, where colocation vacancy is highest of the three.',
                'A 100 MW+ hyperscale or AI campus: South Hyderabad (634 MW planned), Mumbai’s outer belt (Panvel, Taloja) if a substation date is firm, or Visakhapatnam.',
                'Lowest seismic zone of the three: Hyderabad (Zone II).',
            ], 'cw26', 'structure', 'is1893'),
            p('Invariant runs the same screen on candidate sites in all three cities, so the comparison is on evidence: the power route and its date, the hazard profile at the plot, groundwater, airport height limits, and the approvals each state requires.')),
    ],
    [
        faq('Is Mumbai or Chennai better for a data centre?', 'It depends on the project: Mumbai has more capacity, more cable landing stations and lower vacancy, while Chennai has more vacant colocation space. Chennai also has a record of extreme rainfall, with 1,178.3 mm at Meenambakkam in November 2015, and power availability in Navi Mumbai is the main Mumbai check.', 'cw26', 'structure', 'imd-chn'),
        faq('Why is Hyderabad growing as a data center market?', 'Hyderabad is growing on hyperscale demand: AWS and Microsoft run cloud regions there. It holds 18% of India’s upcoming supply on Cushman & Wakefield’s count and sits in Seismic Zone II, the lowest of the three cities.', 'cw26', 'aws-127', 'ms-hyd', 'is1893'),
        faq('Which city has the most data centres in India?', 'Mumbai has the most, with 890 MW operational in H1 2026, about half of the top seven cities, per Cushman & Wakefield.', 'cw26'),
        faq('How do colocation rents compare in Mumbai, Chennai and Hyderabad?', 'For deals above 5 MW, Cushman & Wakefield’s H1 2025 table shows Rs 6,000 to 7,500 per kW per month in Mumbai and Rs 6,000 to 7,000 in Chennai and Hyderabad.', 'cw25'),
        faq('Is there enough grid power for new data centres in Mumbai?', 'Grid allocation is the main constraint in Navi Mumbai. Structure Research reports that MSEDCL has allocated about 6 GW to data centres there and that committed capacity is approaching it, pushing new campuses to Panvel, Taloja and Rasayani.', 'structure'),
    ],
    pick('cw26', 'crisil-dh', 'is1893', 'mum-2005', 'imd-chn', 'hyd-aj', 'structure', 'iba-green', 'tn-policy', 'merc-sop', 'merc-myt', 'tn-supply', 'tnerc', 'tg-gtcs', 'tg-rst', 'tg-hans', 'cw25', 'anarock', 'aws-127', 'ms-hyd'),
    ['data-centres-in-mumbai', 'data-centres-in-chennai', 'data-centres-in-hyderabad', 'find-data-centre-site-india', 'data-centres-in-india'],
    minutes=6,
))

# ─────────────────────────────── India vs Singapore vs Johor ───────────────────────────────
ARTICLES.append(article(
    'india-vs-singapore-vs-johor-data-centres',
    'India vs Singapore vs Johor for data centres: power, policy and cost (2026)',
    'India had about 1.8 GW of live data centre capacity in H1 2026 and Singapore about 1.4 GW (2024). How allocation, power, water, cost and tax compare with Johor.',
    'India',
    'India had roughly 1.8 GW of operational data centre capacity in H1 2026 (Cushman & Wakefield and Savills) and Singapore about 1.4 GW in 2024 (EDB). Malaysia’s utility TNB had signed supply agreements for 8.3 GW of data centre projects by July 2026 (RHB Research), though the three figures are not like for like. Singapore releases new capacity through allocation calls; its second call, in December 2025, offered at least 200 MW. Johor introduced a higher water tariff for data centres in August 2025. India offers build costs that Cushman & Wakefield puts about 23% below Malaysia, and a tax holiday to 2047 for foreign cloud companies using Indian data centres.',
    [
        'Singapore: capacity is allocated, not open. DC-CFA2 (launched 1 December 2025) offered at least 200 MW with PUE 1.25 at full load, Green Mark Platinum and at least 50% green energy pathways.',
        'Malaysia: TNB had 59 data centre projects and 8.3 GW under electricity supply agreements by July 2026 (RHB Research). Johor has a state technical committee that evaluates data centre projects for water impact, and set a data centre water tariff from 1 August 2025.',
        'India: build cost about US$7.4 million per MW (Cushman & Wakefield), rents 30 to 35% below peer markets (Crisil), and 11 states with dedicated data centre policies.',
        'The capacity figures are not like for like: Singapore’s 1.4 GW is a 2024 figure published by EDB, Malaysia’s 8.3 GW is capacity under TNB supply agreements, and India’s 1.8 GW is operational capacity from market reports.',
    ],
    [
        sec('sg-my-in-table', 'India, Singapore and Johor data centre markets side by side',
            table(['Measure', 'India', 'Singapore', 'Johor (Malaysia)'], [
                ['Capacity figure', 'About 1.8 GW operational, H1 2026 (Cushman & Wakefield 1,789 MW, top seven cities; Savills 1,819 MW IT)', 'About 1.4 GW across more than 70 data centres (EDB, May 2024)', 'TNB supply agreements: 59 projects, 8.3 GW; 36 completed with 4.5 GW maximum capacity (RHB via The Star, July 2026). Malaysia-wide'],
                ['How new capacity is released', 'No national allocation; 11 states have dedicated data centre policies', 'Allocation calls: 80 MW secured through a pilot call in 2023; DC-CFA2 for at least 200 MW (December 2025)', 'TNB electricity supply agreements; a Johor state technical committee evaluates and approves data centre projects'],
                ['Efficiency condition', 'SBI’s sector report says MeitY AI cloud tenders have required PUE below 1.35', 'DC-CFA2: PUE 1.25 or better at full IT load; Green Mark for Data Centres 2024 Platinum', 'Johor committee considers water efficiency and recommends water-saving cooling'],
                ['Green power condition', 'State-specific, for example at least 51% green power in Maharashtra’s green data centre parks and under Gujarat’s 2026-29 policy', 'At least 50% of new capacity via eligible green pathways (DC-CFA2)', 'Not covered here'],
                ['Water', 'CGWA guidelines bar groundwater NOCs for new industries (other than MSMEs) in over-exploited units', 'Not covered here', 'Data centre water tariff of RM5.33 per cubic metre from 1 August 2025'],
                ['Build cost', 'About US$7.4 million per MW, about 23% below Malaysia (Cushman & Wakefield)', 'Not compared here', 'India is about 23% below Malaysia (Cushman & Wakefield, country level; no Johor figure)'],
                ['Tax', 'Tax holiday from tax year 2026-27 to 2046-47 for foreign cloud companies serving global customers using Indian data centre services (Budget 2026-27)', 'Not compared here', 'Not compared here'],
            ], 'cw26', 'savills', 'edb-roadmap', 'ml-cfa2', 'nrf-cfa2', 'tnb-star', 'johor-comm', 'johor-tariff', 'sbi', 'iba-green', 'cgwa', 'ii', 'pib-bg')),
        sec('sg-detail', 'Singapore: data centre capacity by allocation call, with strict conditions',
            p('Singapore releases new data centre capacity through allocation calls. It imposed a moratorium on new data centres in 2019 and relaxed it through a pilot call for applications launched in July 2022, under which operators secured 80 MW in 2023. Its Green Data Centre Roadmap, launched on 30 May 2024, set out at least 300 MW of additional capacity in the next few years and another 200 MW for operators using green energy. The second Data Centre Call for Application opened on 1 December 2025 for at least 200 MW and its application window closed on 31 March 2026.', 'ml-cfa2', 'edb-roadmap', 'nrf-cfa2'),
            p('Selected applicants must reach PUE of 1.25 or better at full design load, obtain Green Mark for Data Centres 2024 Platinum, and power at least half of the new capacity through eligible green pathways such as biomethane, low-carbon hydrogen or ammonia, or building-integrated solar. Morgan Lewis notes that land scarcity and strict controls have led global tech firms to look to alternatives such as Johor.', 'nrf-cfa2', 'ml-cfa2')),
        sec('my-detail', 'Malaysia and Johor: TNB power agreements and water rules',
            p('Malaysia’s utility TNB had electricity supply agreements for 59 data centre projects with a combined 8.3 GW, of which 36 projects with a maximum capacity of 4.5 GW were completed, according to RHB Research as reported by The Star in July 2026. These are Malaysia-wide figures under supply agreements, not a measure of IT load in use.', 'tnb-star'),
            p('Water is a stated concern in Johor. In August 2025 the state said it was the only state with a technical committee dedicated to evaluating and approving data centre projects, particularly their impact on water resources, amid concerns about a possible treated water shortfall by 2030. A data centre water tariff of RM5.33 per cubic metre took effect on 1 August 2025.', 'johor-comm', 'johor-tariff')),
        sec('in-detail', 'India: lower build cost, state-by-state rules',
            p('Building a data centre in India costs about US$7.4 million per MW, about 23% below Malaysia and 26% below Australia, according to Cushman & Wakefield, and Crisil reports Indian rents 30 to 35% below peer markets. The Budget 2026-27 tax holiday to 2047 applies to foreign companies serving global customers using data centre services in India.', 'ii', 'crisil-dh', 'pib-bg'),
            p('The trade-offs include grid allocation and state-by-state rules. There is no notified national data centre policy, and states set their own incentives. Structure Research reports that committed capacity is approaching MSEDCL’s data centre grid allocation in Navi Mumbai, pushing new Mumbai builds to Panvel, Taloja and Rasayani. Beyond Mumbai, Hyderabad holds 18% of upcoming supply and Cushman & Wakefield maps more than 4 GW of early-stage or announced capacity at Visakhapatnam.', 'snr', 'structure', 'cw26', 'ii')),
    ],
    [
        faq('Is India cheaper than Singapore for data centres?', 'The sources here give no direct Singapore cost figure, but India’s costs are low against regional peers. Cushman & Wakefield puts construction at about US$7.4 million per MW, about 23% below Malaysia, and Crisil reports Indian rents 30 to 35% below peer markets. New Singapore capacity is released through allocation calls with strict efficiency and green power conditions.', 'ii', 'crisil-dh', 'nrf-cfa2'),
        faq('How much data centre capacity does India have compared with Singapore?', 'India had roughly 1.8 GW of operational capacity in H1 2026, on Cushman & Wakefield’s 1,789 MW for the top seven cities and Savills’ 1,819 MW of IT load. Singapore had about 1.4 GW in May 2024, according to EDB.', 'cw26', 'savills', 'edb-roadmap'),
        faq('How much data centre capacity does Singapore have?', 'Singapore had about 1.4 GW across more than 70 data centres, according to the Singapore Economic Development Board in May 2024. Its Green Data Centre Roadmap sets out at least 300 MW more in the next few years.', 'edb-roadmap'),
        faq('What water rules apply to data centres in Johor?', 'Johor has charged data centres a water tariff of RM5.33 per cubic metre since 1 August 2025. A state technical committee also evaluates and approves data centre projects, particularly their impact on water resources.', 'johor-comm', 'johor-tariff'),
        faq('What is Singapore’s DC-CFA2?', 'DC-CFA2 is Singapore’s second Data Centre Call for Application, launched on 1 December 2025 to allocate at least 200 MW. Applicants must meet PUE 1.25 at full load, Green Mark for Data Centres 2024 Platinum and at least 50% green energy pathways.', 'nrf-cfa2', 'ml-cfa2'),
        faq('Does India have a data center tax incentive for foreign cloud companies?', 'Yes. Budget 2026-27 introduced a tax holiday from tax year 2026-27 to 2046-47 for foreign companies providing cloud services globally using data centre services from India, with sales to Indian users through an Indian reseller.', 'pib-budget', 'pib-bg'),
    ],
    pick('cw26', 'savills', 'edb-roadmap', 'ml-cfa2', 'nrf-cfa2', 'tnb-star', 'johor-comm', 'johor-tariff', 'sbi', 'iba-green', 'cgwa', 'ii', 'pib-bg', 'crisil-dh', 'structure', 'pib-budget', 'snr'),
    ['data-centres-in-india', 'data-centre-incentives-india-central', 'data-centre-cost-per-mw-india', 'mumbai-vs-chennai-vs-hyderabad-data-centres'],
    minutes=7,
))

# ─────────────────────────────── AI data centres ───────────────────────────────
ARTICLES.append(article(
    'ai-data-centres-india',
    'AI data centres in India: gigawatt campuses, IndiaAI GPUs and power (2026)',
    'AI data centres in India include gigawatt-scale campuses at Visakhapatnam and Jamnagar; IndiaAI Mission compute passed 45,000 GPUs by June 2026. Projects and power.',
    'India',
    'India’s largest AI data centre projects are gigawatt-scale campuses, led by Google’s AI hub in Visakhapatnam, where ground was broken in April 2026, and the multi-gigawatt data centres Reliance has begun building at Jamnagar. Reliance is also to build a 168 MW AI-ready data centre to be leased by Meta. OpenAI is TCS HyperVault’s first customer with 100 MW and plans to scale to 1 GW, and CoreWeave plans 240 MW at AdaniConneX in Navi Mumbai. The IndiaAI Mission had more than 38,000 GPUs onboarded at Rs 65 per hour by February 2026 and more than 45,000 in its shared compute capacity by June 2026.',
    [
        'Announced gigawatt-scale AI campuses include Google’s AI hub in Visakhapatnam (about US$15 billion over 2026 to 2030), Reliance at Jamnagar, Digital Connexion in Visakhapatnam, TCS HyperVault and AM Green in Greater Noida (MoU).',
        'The IndiaAI Mission GPU pool grew from 18,693 (January 2025) to 34,333 (May 2025), 38,000+ at Rs 65 per hour (February 2026) and 45,000+ (June 2026), according to PIB and to Invest India and Cushman & Wakefield.',
        'Anarock puts an Nvidia H100 GPU cluster at 30 to 60 kW per rack against 8 to 10 kW traditionally. Power per GPU, not floor area, sizes the site.',
        'SBI’s sector report says MeitY AI cloud tenders have required PUE below 1.35.',
    ],
    [
        sec('ai-campuses', 'AI data centre campuses announced in India',
            table(['Project', 'Scale', 'Location', 'Status and date'], [
                ['Google AI hub (with AdaniConneX and Nxtra by Airtel)', 'Gigawatt-scale; about US$15 billion over 2026 to 2030', 'Visakhapatnam', 'Groundbreaking 28 April 2026'],
                ['Reliance AI data centres', 'Multi-gigawatt; more than 120 MW expected online in H2 2026', 'Jamnagar, Gujarat', 'Under construction (February 2026); 168 MW AI-ready data centre to be leased by Meta (June 2026)'],
                ['TCS HyperVault', 'Above 1 GW targeted; OpenAI starting with 100 MW, plans to scale to 1 GW', 'Not disclosed', 'OpenAI deal February 2026'],
                ['Digital Connexion', '1 GW; about US$11 billion by 2030', 'Visakhapatnam', 'MoU November 2025'],
                ['AM Green', '1 GW', 'Greater Noida', 'MoU January 2026; first capacity targeted 2028'],
                ['CoreWeave at AdaniConneX', '240 MW (3 x 80 MW buildings)', 'Taloja, Navi Mumbai', 'First phase expected mid-2028'],
                ['Yotta D2', '60 MW, scalable to 250 MW; supercluster of 20,736 NVIDIA Blackwell Ultra GPUs, with added capacity from Navi Mumbai', 'Greater Noida', 'Go-live expected by August 2026'],
            ], 'google-blog', 'adani-gb', 'reliance-ai', 'meta-jam', 'cw26', 'tcs-hv', 'openai-tcs', 'dcx', 'amgreen', 'coreweave', 'yotta-b300'),
            p('Announcements are not capacity. Treat MoUs and approvals as intent until there is a power connection agreement and a construction start. Invest India and Cushman & Wakefield’s AI scenario assumes 15% of a 15 GW early-stage pipeline converts, which still yields about 8 GW by 2030.', 'ii')),
        sec('ai-gpus', 'IndiaAI Mission GPU count, 2025 to 2026',
            table(['Date', 'GPUs in the pool', 'Price note', 'Source'], [
                ['January 2025', '18,693 (including 12,896 H100)', 'Under Rs 100 per hour after a 40% government subsidy', 'PIB release via Principal Scientific Adviser'],
                ['May 2025', '34,333 (18,417 existing plus 15,916 added)', 'Seven bidders offered commercials', 'PIB'],
                ['February 2026', '38,000+ GPUs and 1,050 TPUs', 'Rs 65 per hour', 'PIB'],
                ['June 2026', '45,000+', '15 compute service providers empanelled (Lok Sabha figures, August 2026)', 'Invest India and Cushman & Wakefield citing PIB; Communications Today'],
                ['October 2026', 'C-DAC request for empanelment for up to 10,000 AI compute units', 'Clusters of 4,000, 1,000 or 512 units; each cluster at least 512 units at a single data centre in India', 'MediaNama'],
            ], 'psa-gpu', 'pib-gpu25', 'pib-ai26', 'ii', 'ct-gpu', 'cdac-rfe'),
            p('Yotta committed over 10,000 B300 GPUs to the IndiaAI Mission. The seven bidders named by PIB in May 2025 were Cyfuture India, Ishan Infotech, Locuz Enterprise Solutions, Netmagic IT Services, Sify Digital Services, Vensysco Technologies and Yotta Data Services.', 'yotta-b300', 'pib-gpu25')),
        sec('ai-power', 'Power for AI data centres in India',
            p('Power per GPU, not floor area, sizes an AI data centre in India. Anarock puts an Nvidia H100 GPU cluster at 30 to 60 kW per rack against 8 to 10 kW traditionally, and SBI notes that air cooling approaches its limits beyond about 15 kW per rack, leading to early adoption of direct-to-chip and immersion cooling. A 100 MW AI hall therefore needs a high-voltage grid connection with a firm energisation date.', 'anarock', 'sbi'),
            p('Crisil estimates Visakhapatnam’s data centre capacity could equal about 80% of the city’s current peak demand by FY2030. Reliance says its build-out will be supported by its green energy capacity, including surplus solar power in Gujarat and Andhra Pradesh.', 'crisil-dh', 'reliance-ai'),
            links('Sizing a GPU cluster', [('How much power a GPU cluster needs', 'gpu-cluster-power-requirements'), ('Power for data centres in India', 'power-for-data-centres-india'), ('Grid connection: DISCOM, STU and CTU paths', 'data-centre-grid-connection-india')])),
    ],
    [
        faq('How many AI data centres are being built in India?', 'AI projects of 240 MW or more announced since 2025 include Google and Digital Connexion in Visakhapatnam, Reliance at Jamnagar and CoreWeave at AdaniConneX in Navi Mumbai. TCS HyperVault aims for capacity above 1 GW, and AM Green signed an MoU with Uttar Pradesh for a 1 GW AI data centre in Greater Noida.', 'google-blog', 'reliance-ai', 'tcs-hv', 'dcx', 'amgreen', 'coreweave'),
        faq('How many GPUs does the IndiaAI Mission have?', 'More than 45,000 GPUs in shared compute capacity by June 2026, according to Invest India and Cushman & Wakefield citing PIB. PIB reported more than 38,000 GPUs at Rs 65 per hour in February 2026.', 'pib-ai26', 'ii'),
        faq('How much does IndiaAI Mission GPU compute cost per hour?', 'Rs 65 per hour in February 2026, according to PIB. In January 2025 the price was under Rs 100 per hour after a 40% government subsidy.', 'pib-ai26', 'psa-gpu'),
        faq('Which gigawatt-scale AI data centres are under construction in India?', 'Google broke ground on its gigawatt-scale AI hub in Visakhapatnam on 28 April 2026, and Reliance says it has begun building multi-gigawatt data centres at Jamnagar.', 'adani-gb', 'reliance-ai'),
        faq('How much power does an AI data centre need in India?', 'Far more per rack than a conventional data centre: Anarock puts an Nvidia H100 GPU cluster at 30 to 60 kW per rack against 8 to 10 kW traditionally. A 100 MW AI hall needs a high-voltage grid connection with a firm energisation date.', 'anarock'),
    ],
    pick('google-blog', 'adani-gb', 'reliance-ai', 'meta-jam', 'cw26', 'tcs-hv', 'openai-tcs', 'dcx', 'amgreen', 'coreweave', 'yotta-b300', 'ii', 'psa-gpu', 'pib-gpu25', 'pib-ai26', 'ct-gpu', 'cdac-rfe', 'anarock', 'sbi', 'crisil-dh'),
    ['data-centres-in-india', 'data-centres-in-visakhapatnam', 'power-for-data-centres-india', 'gpu-cluster-power-requirements', 'data-centre-investment-india'],
    minutes=7,
))

# ─────────────────────────────── Investment ───────────────────────────────
ARTICLES.append(article(
    'data-centre-investment-india',
    'Data centre investment in India: hyperscaler commitments and deals (2026)',
    'Data centre investment commitments in India reached US$184 billion in January to September 2026, according to Invest India and Cushman & Wakefield. By company.',
    'India',
    'Invest India and Cushman & Wakefield count US$184 billion of disclosed data centre investment commitments in India in January to September 2026, up from US$56.4 billion in 2025, US$29.6 billion in 2024 and US$27 billion in 2023. Amazon has committed US$48 billion for 2026 to 2030, Microsoft US$17.5 billion for 2026 to 2029, and Google about US$15 billion for its Visakhapatnam AI hub. Reliance announced a plan of about US$110 billion for AI computing infrastructure, and Cushman & Wakefield reports an Adani commitment of US$100 billion through 2035 for AI-ready data centres and associated infrastructure. The Budget 2026-27 added a tax holiday to 2047 for foreign cloud companies using Indian data centres.',
    [
        'Disclosed commitments: US$184 billion in January to September 2026 alone (Invest India and Cushman & Wakefield). CBRE counts Rs 15.29 lakh crore (US$173 billion) cumulative since 2021.',
        'Equity mix of current investments: about 61% foreign, 39% domestic (Invest India and Cushman & Wakefield).',
        'Long-tenor debt costs about 9.5 to 10.5% for up to 12 years, helped by infrastructure status (Anarock).',
        'Company-confirmed hyperscaler commitments: Amazon US$48 billion (2026 to 2030), Microsoft US$17.5 billion (2026 to 2029) and Google about US$15 billion for its Visakhapatnam AI hub (2026 to 2030).',
    ],
    [
        sec('invest-hyperscalers', 'Hyperscaler and AI data centre investment commitments in India',
            table(['Company', 'Amount', 'Period and where', 'Announced', 'Status'], [
                ['Amazon (all businesses)', 'US$35 billion more; total US$48 billion for 2026 to 2030 after a further US$13 billion for AWS', 'AWS capacity in Mumbai and Hyderabad', '10 December 2025; 25 June 2026', 'Confirmed by company'],
                ['AWS', 'Rs 1,05,600 crore (US$12.7 billion) by 2030, including US$8.3 billion in Maharashtra', 'Mumbai and Hyderabad regions', 'May 2023; January 2025', 'Confirmed by company'],
                ['Microsoft', 'US$17.5 billion', 'CY2026 to 2029; India South Central (Hyderabad) and other regions', '9 December 2025', 'Confirmed by company'],
                ['Google', 'About US$15 billion', '2026 to 2030; AI hub in Visakhapatnam', '14 October 2025', 'Confirmed; groundbreaking 28 April 2026'],
                ['Reliance', 'Rs 10 trillion (about US$110 billion)', 'Seven years; AI compute including Jamnagar', '19 February 2026', 'Announced plan'],
                ['Adani', 'US$100 billion', 'Through 2035; AI-ready data centres and associated infrastructure', 'Reported by Cushman & Wakefield, H1 2026', 'Announced plan'],
                ['Meta', '168 MW AI-ready data centre to be built by Reliance and leased by Meta', 'Jamnagar, Gujarat', '10 June 2026', 'Announced partnership'],
                ['OpenAI', '100 MW initially, plans to scale to 1 GW', 'TCS HyperVault', '18 February 2026', 'First customer of HyperVault'],
                ['Oracle', 'Not disclosed', 'New data centres in Mumbai and Hyderabad', 'February 2026', 'Reported by Analytics India Magazine'],
            ], 'amazon-35', 'amazon-48', 'aws-127', 'aws-mh', 'ms-175', 'google-blog', 'adani-gb', 'reliance-ai', 'cw26', 'meta-jam', 'openai-tcs', 'oracle')),
        sec('invest-deals', 'Data centre operator deals in India, 2025 and 2026',
            table(['Date', 'Deal', 'Size'], [
                ['November 2025', 'TPG into TCS HyperVault', 'Up to Rs 8,820 crore for 27.5 to 49%; up to Rs 18,000 crore in total'],
                ['November 2025', 'Digital Connexion 1 GW Visakhapatnam campus', 'US$11 billion by 2030'],
                ['30 March 2026', 'Nxtra raise led by Alpha Wave and Carlyle', 'US$1 billion; post-money about US$3.1 billion'],
                ['April 2026', 'AirTrunk acquires Lumina CloudInfra', 'About 600 MW of planned capacity, up to US$5 billion of development potential'],
                ['May 2026', 'STT GDC buys 3.48 acres in Navi Mumbai', 'Rs 282 crore'],
                ['17 June 2026', 'CPP Investments into CtrlS', 'Up to Rs 7,000 crore (Rs 4,000 crore for 8.2% plus up to Rs 3,000 crore in a hyperscale JV)'],
                ['18 June 2026', 'IFC package for Sify', 'About US$371 million'],
                ['July 2026', 'Colt DCS and RMZ Visakhapatnam campus approved by Andhra Pradesh’s State Investment Promotion Committee (1.25 GW reported)', 'About US$21 billion proposed over a decade (Cushman & Wakefield)'],
                ['6 October 2026', 'CoreWeave deployment at AdaniConneX Taloja, as sole tenant', '240 MW'],
                ['November 2026', 'AirTrunk Anakapalli plans', 'About US$11 billion for up to 1.8 GW, subject to approval'],
            ], 'tcs-hv', 'dcx', 'nxtra', 'airtrunk-lumina', 'stt-nm', 'ctrls-cpp', 'sify-ifc', 'colt-vizag-dcd', 'cw26', 'coreweave', 'airtrunk-ap')),
        sec('invest-totals', 'Total data centre investment in India, and why the totals differ',
            p('Invest India and Cushman & Wakefield count announced investment above US$180 billion as of September 2026, with US$184 billion disclosed in January to September 2026 alone and an equity mix of about 61% foreign and 39% domestic. CBRE, as reported by IBEF, counts Rs 3.34 lakh crore (US$38 billion) in H1 2026 and Rs 15.29 lakh crore (US$173 billion) since 2021. Anarock cites more than US$300 billion of commitments.', 'ii', 'cbre', 'anarock'),
            p('The totals are not comparable: they can mix multi-year plans, group-wide AI programmes that include more than data centres, and MoUs that may not proceed. For underwriting, count only projects with land, a power connection agreement and a construction start.')),
        sec('invest-diligence', 'What to check before investing in an Indian data centre',
            ul([
                'Power: the DISCOM sanction letter or transmission connection agreement, the substation and voltage, the energisation date, and what else is queued on the same substation.',
                'Policy: which state policy applies, whether its window is still open (Tamil Nadu’s 2021 policy covers data centres incorporated by 31 March 2026), and whether incentives are in a project-specific order.',
                'Site: seismic zone, flood history, groundwater unit status, airport height limits and coastal rules.',
                'Contracts: tenor (Crisil reports tenors have lengthened to 15 to 20 years), tenant concentration and power pass-through.',
            ], 'tn-policy', 'crisil-dh'),
            p('Data centres of 5 MW or more of IT load were added to the infrastructure list on 11 October 2022. Anarock says infrastructure status has improved access to long-tenor financing, at about 9.5 to 10.5% for tenors of up to 12 years.', 'hml', 'anarock'),
            links('Power diligence', [('Five rungs of power evidence', 'power-evidence-data-center-site-verification'), ('Power studies for Indian data centre sites', 'power-study-data-centre-india'), ('Site due diligence in India', 'data-centre-site-due-diligence-india')])),
    ],
    [
        faq('How much is being invested in data centres in India?', 'More than US$180 billion of announced investment as of September 2026, according to Invest India and Cushman & Wakefield, including US$184 billion disclosed in January to September 2026.', 'ii'),
        faq('Which companies have announced large data centre commitments in India?', 'Amazon (US$48 billion for 2026 to 2030), Microsoft (US$17.5 billion for 2026 to 2029), Google (about US$15 billion in Visakhapatnam), Reliance (US$110 billion AI plan) and Adani (US$100 billion through 2035).', 'amazon-48', 'ms-175', 'google-blog', 'reliance-ai', 'cw26'),
        faq('Is any Indian data centre operator planning to list in India?', 'Sify Infinit Spaces, the data centre subsidiary of Sify Technologies, filed a draft red herring prospectus for a proposed IPO on 17 October 2025. The filing, with SEBI, BSE and NSE, covers a fresh issue of up to Rs 2,500 crore and an offer for sale of up to Rs 1,200 crore.', 'sify-pr'),
        faq('What should an investor check before buying into an Indian data centre?', 'Check the power connection agreement and its date, the applicable state policy and its validity, site hazards and groundwater, and tenant contract terms. Crisil reports tenors have lengthened to 15 to 20 years.', 'crisil-dh'),
        faq('How much does debt cost for a data centre in India?', 'About 9.5 to 10.5% for tenors of up to 12 years, according to Anarock, which says infrastructure status has improved access to long-tenor financing.', 'anarock'),
    ],
    pick('amazon-35', 'amazon-48', 'aws-127', 'aws-mh', 'ms-175', 'google-blog', 'adani-gb', 'reliance-ai', 'cw26', 'meta-jam', 'openai-tcs', 'oracle', 'tcs-hv', 'dcx', 'nxtra', 'airtrunk-lumina', 'stt-nm', 'ctrls-cpp', 'sify-ifc', 'colt-vizag-dcd', 'coreweave', 'airtrunk-ap', 'ii', 'cbre', 'anarock', 'crisil-dh', 'sify-pr', 'hml', 'tn-policy'),
    ['data-centres-in-india', 'data-centre-companies-india', 'data-centre-incentives-india-central', 'data-centre-site-due-diligence-india', 'power-study-data-centre-india'],
    minutes=7,
))
