"""India data centre glossary terms. Adds or replaces entries (by slug) in src/pages/_data/glossary.json.

Run from this folder:  python3 glossary.py ../../src/pages/_data/glossary.json
Every entry cites primary sources where one was found; topic 'data-centers' so the entries sit
with the US data center terms on /glossary and in llms.txt.
"""
import json, sys
from common import DATE

def g(slug, term, aliases, short, full, related, citations, guide_slug, guide_label):
    return {
        'slug': slug, 'term': term, 'topic': 'data-centers', 'aliases': aliases,
        'short_definition': short, 'full_definition': full, 'related_to': related,
        'citations': [{'label': l, 'url': u} for l, u in citations],
        'last_updated': DATE,
        'guide': {'label': guide_label, 'path': guide_slug if guide_slug.startswith('/') else f'/blog/{guide_slug}'},
    }

CPCB = ('CPCB, Classification of sectors into Red, Orange, Green, White and Blue categories (January 2025)', 'https://jspcb.org.in/wp-content/uploads/2025/11/CPCB-directions-Classification.pdf')
EIA = ('MoEF, EIA Notification 2006', 'https://environmentclearance.nic.in/writereaddata/EIA_notifications/2006_09_14_EIA.pdf')
CGWA = ('Ministry of Jal Shakti, CGWA guidelines for ground water extraction, S.O. 3289(E), 24 September 2020', 'https://neer.co.in/wp-content/uploads/2022/07/ANNEXURE-2-CGWA-GUIDELINES-FOR-WEBSITE-1.pdf')
NBC = ('BIS, National Building Code 2016, Part 4 Fire and Life Safety', 'https://nmcnagpur.gov.in/assets/300/2025/03/mediafiles/NBC2016-Part-IV.pdf')
DPDP = ('Digital Personal Data Protection Act 2023, Gazette of India', 'https://egazette.gov.in/WriteReadData/2023/248045.pdf')
DPDPR = ('PIB, DPDP Rules 2025 notified (14 November 2025)', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2190014')
RBI = ('RBI, Storage of payment system data (6 April 2018)', 'https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11244&Mode=0')
SEBI = ('SEBI, Framework for adoption of cloud services by SEBI regulated entities (6 March 2023)', 'https://www.sebi.gov.in/legal/circulars/mar-2023/framework-for-adoption-of-cloud-services-by-sebi-regulated-entities-res-_68740.html')
CERTIN = ('CERT-In, Directions under section 70B(6) of the IT Act (28 April 2022)', 'https://www.cert-in.org.in/PDF/CERT-In_Directions_70B_28.04.2022.pdf')
HML = ('Ministry of Finance, Harmonised Master List of Infrastructure Sub-sectors (11 October 2022)', 'https://www.pppinindia.gov.in/report/Harmonised%20Master%20list%20of%20Infrastruture%20sub%20sectors%202022_1685079764.pdf')
UP26 = ('Government of Uttar Pradesh, Data Center Policy 2026 (G.O. dated 9 July 2026)', 'https://uplc.up.gov.in/downloadmedia/siteContent/202608230935077722DC-policy-2026-English_230826.pdf')
WB21 = ('West Bengal Data Centre Policy 2021 (notification of 6 September 2021)', 'https://wbxpress.com/west-bengal-data-centre-policy-2021/')
GJ26 = ('Cyril Amarchand Mangaldas, Gujarat Data Center Policy 2026-2029', 'https://corporate.cyrilamarchandblogs.com/2026/07/gujarat-data-center-policy-2026-2029-a-push-for-large-scale-data-center-infrastructure/')
NITI = ('MediaNama, NITI Aayog and MeitY data centre evaluation framework (October 2026)', 'https://www.medianama.com/2026/10/223-niti-aayog-meity-data-centre-evaluation/')
SNR = ('S&R Associates, Indian Budget 2026-27: tax incentives for data centres', 'https://www.snrlaw.in/indian-budget-2026-27-tax-incentives-for-data-centres/')
PPD = ('PowerPeak Digest, Maharashtra green data center policy expansion (June 2026)', 'https://powerpeakdigest.com/maharashtra-green-data-center-policy-expansion/')
BWL = ('BW Legal World, MeitY resumes national data centre policy talks (August 2025)', 'https://www.bwlegalworld.com/article/meity-resumes-national-data-centre-policy-talks-experts-seek-global-alignment-567223')
PIBCAP = ('PIB, data centre capacity and policy (Rajya Sabha reply, 7 August 2026)', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2298108')
YEIDA = ('YEIDA, industrial land bank (Data Centre Park, Sector 28)', 'https://www.yamunaexpresswayauthority.com/property/industrial')
AAI = ('AAI NOCAS, frequently asked questions (G.S.R. 751(E))', 'https://nocas2.aai.aero/nocas/FAQ.html')

EA = ('Electricity Act 2003 (with amendments), hosted by CERC', 'https://cercind.gov.in/Act-with-amendment.pdf')
GEOA = ('Ministry of Power, Green Energy Open Access Rules 2022, G.S.R. 418(E), 6 June 2022', 'https://www.acma.in/uploads/ciculer-attachement/Electricity%20(Promoting%20Renewable%20Energy%20through%20Green%20Energy%20Open%20Access)%20Rules,2022.pdf')
GNA = ('CERC, Connectivity and General Network Access to the inter-State Transmission System Regulations 2022', 'https://cercind.gov.in/Regulations/175-Notification.pdf')
GNA4 = ('CERC, explanatory memorandum to the draft fourth amendment of the GNA Regulations (16 June 2026)', 'https://www.cercind.gov.in/2026/draft_reg/EM_GNA-fourth-Amnd.pdf')
CAPT = ('PIB, Electricity (Amendment) Rules 2026 on captive generation (14 March 2026)', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2240205')
MERCSOP = ('MERC, Electricity Supply Code and Standards of Performance Regulations 2021', 'https://www.mahadiscom.in/consumer/wp-content/uploads/2025/08/MERC-SOP-including-PQ-Reg-2021.pdf')
MERCMYT = ('MERC, MSEDCL multi-year tariff order, Case 217 of 2024 (28 March 2025)', 'https://www.mahadiscom.in/consumer/wp-content/uploads/2025/08/MSEDCL-MYT-Order_Case_no_217-of-2024.pdf')
TGGTCS = ('TGERC, amendment to the General Terms and Conditions of Supply (19 October 2022)', 'https://tgerc.telangana.gov.in/file_upload/uploads/Clarifications/GTCS%20Amendment_19102022.pdf')
TNSC = ('TNPDCL, categories of supply under the Tamil Nadu Electricity Supply Code', 'https://app1.tangedco.org/nsconline/tcateg.xhtml')

POWER_ENTRIES = [
    g('open-access-india', 'Open access (electricity, India)',
      ['open access', 'open access power', 'electricity open access India', 'open access for data centres'],
      'Open access lets an eligible consumer in India buy electricity from a generator or trader other than its local discom, paying to use the transmission and distribution networks plus surcharges set by the state commission.',
      'Section 42(2) of the Electricity Act 2003 requires each state commission to introduce open access in phases, allowed on payment of a cross subsidy surcharge in addition to wheeling charges. Section 42(4) lets the commission add an additional surcharge to cover the discom’s fixed costs from its obligation to supply. The consumer remains connected to the discom network and pays for its use.\n\nThe Green Energy Open Access Rules 2022 lowered the threshold for renewable open access to 100 kW of contracted demand, with no limit for captive consumers, and capped the charges that can be levied. For data centres, open access and captive renewable supply are the two main routes to a lower or greener tariff than the discom’s industrial rate.',
      ['green-energy-open-access', 'cross-subsidy-surcharge', 'additional-surcharge', 'wheeling-charges', 'group-captive'],
      [EA, GEOA], 'green-energy-open-access-data-centres-india', 'Green energy open access for data centres in India'),
    g('green-energy-open-access', 'Green Energy Open Access Rules 2022 (GEOA)',
      ['green energy open access', 'GEOA rules 2022', 'green open access', 'green energy open access rules'],
      'The Green Energy Open Access Rules 2022 let consumers with 100 kW or more of contracted demand buy renewable power through open access, with approval deemed after 15 days and limits on the surcharges states can charge.',
      'The Electricity (Promoting Renewable Energy Through Green Energy Open Access) Rules 2022, G.S.R. 418(E) of 6 June 2022, make consumers with contracted demand or sanctioned load of 100 kW or more eligible, with no limit for captive consumers. Applications go through a central nodal agency portal and are deemed approved if not decided within 15 days. Banking is allowed at least monthly for at least 30% of monthly consumption.\n\nThe Rules limit charges to transmission, wheeling, cross subsidy surcharge and standby charges (banking charges were added in 2023). The cross subsidy surcharge may not rise by more than 50% over 12 years from the plant’s commissioning, and the additional surcharge does not apply to a consumer who is paying fixed charges.',
      ['open-access-india', 'cross-subsidy-surcharge', 'additional-surcharge', 'group-captive'],
      [GEOA], 'green-energy-open-access-data-centres-india', 'Green energy open access for data centres in India'),
    g('cross-subsidy-surcharge', 'Cross subsidy surcharge (CSS)',
      ['cross subsidy surcharge', 'CSS open access', 'cross-subsidy surcharge'],
      'Cross subsidy surcharge is the charge an open access consumer pays its discom to make up the cross subsidy that consumer’s tariff would otherwise have contributed to cheaper tariffs for other consumers.',
      'Section 42(2) of the Electricity Act 2003 allows open access on payment of a surcharge, in addition to wheeling charges, to meet the cross subsidy that the consumer’s regular tariff carries. Each state commission sets the figure, usually per kWh, in its tariff order.\n\nThe Green Energy Open Access Rules 2022 cap its growth for renewable open access: it may not rise by more than 50% of the level fixed in the year open access is granted, over 12 years from the plant’s commissioning. Captive consumers that meet the 26% ownership and 51% consumption tests do not pay it, which is one reason data centres use group captive structures.',
      ['open-access-india', 'additional-surcharge', 'wheeling-charges', 'group-captive'],
      [EA, GEOA], 'open-access-charges-by-state-india', 'Open access charges by state'),
    g('additional-surcharge', 'Additional surcharge (open access)',
      ['additional surcharge', 'AS open access', 'additional surcharge electricity'],
      'Additional surcharge is a charge on open access consumers, set by the state commission under Section 42(4) of the Electricity Act 2003, to cover the discom’s fixed costs of standing ready to supply them.',
      'Section 42(4) of the Electricity Act 2003 makes a consumer that buys from someone other than its discom liable to pay an additional surcharge on wheeling charges, as specified by the state commission, to meet the fixed cost the discom carries from its obligation to supply.\n\nUnder the Green Energy Open Access Rules 2022 the additional surcharge does not apply to a green open access consumer that is paying fixed charges to the discom. Captive consumers meeting the ownership and consumption tests are also outside it.',
      ['open-access-india', 'cross-subsidy-surcharge', 'green-energy-open-access'],
      [EA, GEOA], 'open-access-charges-by-state-india', 'Open access charges by state'),
    g('wheeling-charges', 'Wheeling charges',
      ['wheeling charges', 'wheeling charge open access', 'distribution wheeling'],
      'Wheeling charges are what a consumer or generator pays a discom for carrying electricity over its distribution network, set per unit by the state commission.',
      'When power bought through open access or from a captive plant is delivered over a discom’s wires, the state commission’s tariff order sets a wheeling charge for that use. Discom customers on HT supply also see it as a component of their bill in some states: MERC’s March 2025 order for MSEDCL set an HT wheeling component of ₹0.62 per kVAh for FY 2025-26 on top of the EHV energy charge; MERC review orders have since revised MSEDCL’s rates, and the figure in force should be checked.\n\nThe same MERC order gives data centres that consume 100% green energy through open access or the green tariff a 10% discount on wheeling charges. Consumers connected directly at transmission voltage pay transmission charges instead of distribution wheeling.',
      ['open-access-india', 'cross-subsidy-surcharge'],
      [MERCMYT], 'open-access-charges-by-state-india', 'Open access charges by state'),
    g('group-captive', 'Group captive power (26% ownership, 51% consumption)',
      ['group captive', 'captive power plant', 'captive generation rules', 'group captive solar'],
      'Group captive is an arrangement in which several consumers jointly own a generating plant and qualify as captive users if together they hold at least 26% of its ownership and consume at least 51% of its annual generation, which exempts them from cross subsidy and additional surcharges.',
      'Rule 3 of the Electricity Rules 2005, substituted by the Electricity (Amendment) Rules 2026 notified in March 2026, keeps the two tests: captive users must hold at least 26% of the ownership and consume at least 51% of the annual electricity generated. The 2026 Rules count subsidiaries, holding companies and fellow subsidiaries as the same owner, and give verification of inter-state captive status to the National Load Despatch Centre.\n\nFor a data centre group, a renewable plant held through a special purpose vehicle with the data centre entities as captive users avoids the two largest open access adders, the cross subsidy surcharge and the additional surcharge.',
      ['open-access-india', 'cross-subsidy-surcharge', 'additional-surcharge'],
      [CAPT], 'green-energy-open-access-data-centres-india', 'Green energy open access for data centres in India'),
    g('general-network-access', 'General Network Access (GNA)',
      ['GNA', 'general network access', 'ISTS connectivity', 'GNA regulations 2022'],
      'General Network Access is the right, granted under CERC’s 2022 regulations, to inject into or draw from India’s inter-state transmission system. A bulk consumer with 50 MW or more of load can apply to connect to it directly.',
      'CERC’s Connectivity and General Network Access Regulations 2022, notified on 7 June 2022, replaced the older long-term and medium-term access regime. Regulation 17.1(iii) lets a distribution licensee or a bulk consumer seeking to connect directly to the inter-state transmission system with a load of 50 MW and above apply for GNA.\n\nA draft fourth amendment of 16 June 2026 proposes letting a drawee entity already connected to a state network also connect to the inter-state network for the same capacity, naming data centres among the users that may need dual connectivity for round-the-clock power. CTUIL supported the proposal; Grid-India and CEA opposed it. No final notification had been found as of November 2026.',
      ['ctu-stu', 'open-access-india', 'dual-grid-supply'],
      [GNA, GNA4], 'data-centre-grid-connection-india', 'How a data centre gets a grid connection in India'),
    g('ctu-stu', 'CTU and STU (central and state transmission utilities)',
      ['CTU', 'STU', 'CTUIL', 'state transmission utility', 'central transmission utility'],
      'The Central Transmission Utility (CTUIL) plans the inter-state transmission system and grants connectivity to it; each state transmission utility (STU) plans and runs the state’s intra-state network, where most large data centres connect.',
      'CTUIL is the nodal agency for connectivity and General Network Access to the inter-state transmission system under CERC’s 2022 regulations, and plans new inter-state lines and substations. State transmission utilities such as MSETCL in Maharashtra and the Telangana and Tamil Nadu transmission corporations own the 66 kV to 400 kV state networks that serve most loads above about 10 to 20 MVA.\n\nData centres now appear in CTU planning. In CERC’s June 2026 explanatory memorandum, CTUIL cited uncertainty in bulk loads such as green hydrogen and data centres as one reason it could not finalise transmission for about 33 GW of in-principle renewable connectivity.',
      ['general-network-access', 'discom', 'dual-grid-supply'],
      [GNA, GNA4], 'data-centre-grid-connection-india', 'How a data centre gets a grid connection in India'),
    g('discom', 'Discom (distribution company) and HT/EHV supply',
      ['discom', 'distribution licensee', 'HT connection', 'EHV supply', 'EHT connection'],
      'A discom is the state distribution licensee that supplies electricity to consumers in its area. A data centre is a discom consumer, and the state supply code sets the voltage it is supplied at from its contract demand.',
      'Each state commission’s supply code sets voltage by contract demand. Maharashtra’s 2021 code puts supply at 33 kV up to 10 MVA (20 MVA in metropolitan areas) and at extra high voltage above that. Tamil Nadu supplies 10 to 50 MVA at 110 kV and above 50 MVA at 230 kV. Telangana requires 132 kV or above for more than 20 MVA, and makes a consumer on a dedicated feeder pay the full cost of the line including the substation take-off.\n\nAbove these thresholds the connection is at a state transmission utility substation, so the load sanction and the bay and line both have to be secured.',
      ['ctu-stu', 'dual-grid-supply', 'open-access-india'],
      [MERCSOP, TNSC, TGGTCS], 'data-centre-grid-connection-india', 'How a data centre gets a grid connection in India'),
    g('dual-grid-supply', 'Dual grid supply (two-source supply)',
      ['dual grid', 'dual feed', 'two source supply', 'dual power from grid', 'second source supply'],
      'Dual grid supply is a data centre connection fed from two independent grid sources, usually two substations or two transmission circuits, so the site keeps power if one fails. Discoms provide it on request at the consumer’s cost; some state data centre policies subsidise it.',
      'Maharashtra’s 2021 Supply Code lets the discom provide a special system of supply, including multiple sources, if the consumer asks and it is technically feasible; the cost above the normal system is borne by the consumer, and consumers with multiple sources may pay additional fixed charges set by the commission.\n\nSeveral state data centre policies offer it as an incentive. Uttar Pradesh’s Data Center Policy 2026 gives data centre parks of 40 MW or more a dual-grid subsidy. A second source is also what makes a site resilient to a single transmission outage, which a power study tests as an N-1 contingency.',
      ['discom', 'n-1-contingency', 'ctu-stu'],
      [MERCSOP, UP26], 'data-centre-grid-connection-india', 'How a data centre gets a grid connection in India'),
    g('green-tariff-india', 'Green tariff (India)',
      ['green tariff', 'green power tariff', 'MSEDCL green tariff', 'green energy tariff'],
      'A green tariff is an optional premium a discom customer pays over its normal tariff to have its consumption met from renewable power bought by the discom, without arranging open access itself.',
      'State commissions set green tariffs in their tariff orders. MERC’s March 2025 multi-year order for MSEDCL set the green tariff at ₹0.25 per kWh over the category tariff for FY 2025-26 to FY 2029-30. MERC rejected a proposal for a zero green tariff for round-the-clock green power to data centres, citing storage costs and non-discrimination between consumers, but gave data centres consuming 100% green energy a 10% discount on wheeling charges.\n\nFor a data centre, a green tariff is the simplest route to renewable supply; open access or group captive usually costs less at scale but takes longer to arrange.',
      ['open-access-india', 'green-energy-open-access', 'group-captive'],
      [MERCMYT], 'green-energy-open-access-data-centres-india', 'Green energy open access for data centres in India'),
]

ENTRIES = POWER_ENTRIES + [
    g('cte-cto', 'Consent to Establish and Consent to Operate (CTE and CTO)',
      ['CTE and CTO', 'consent to establish', 'consent to operate', 'pollution board consent', 'CTE CTO data centre'],
      'Consent to Establish (CTE) and Consent to Operate (CTO) are the two permissions a state pollution control board grants under the Water Act 1974 and the Air Act 1981: CTE before construction starts, CTO before operation begins.',
      'A project in India applies to the state pollution control board for Consent to Establish before it builds and for Consent to Operate before it starts operating. The board decides the conditions, and the validity of the CTO, from the project’s pollution category.\n\nCPCB’s January 2025 classification lets boards grant CTO for up to 5 years to Red, 10 years to Orange and 15 years to Green category units. For a data centre, the category usually follows its generator sets: CPCB says projects such as data centres whose pollution comes only from gensets may be classified by genset capacity and fuel, with 1 MVA or more on diesel in Orange and on gas in Green. A building of 20,000 sq m or more is separately Orange, and its consents are taken as per its environmental clearance conditions. State lists can differ, so confirm the category with the board for the site.',
      ['cpcb-industry-category', 'environmental-clearance-eia', 'cgwa-noc'],
      [CPCB], 'data-centre-approvals-india', 'Approvals needed for a data centre in India'),
    g('cpcb-industry-category', 'CPCB pollution category (Red, Orange, Green, White, Blue)',
      ['CPCB category', 'red orange green white category', 'pollution index', 'data centre pollution category'],
      'The Central Pollution Control Board sorts activities into Red, Orange, Green and White categories by a pollution index score, plus a Blue category for essential environmental services; the category sets consent requirements and inspection frequency.',
      'CPCB’s January 2025 classification covers 419 sectors: 125 Red, 137 Orange, 94 Green, 54 White and 9 Blue. Pollution index bands are 80 and above for Red, 55 to under 80 for Orange, 25 to under 55 for Green and under 25 for White. Boards inspect Red units at least every six months, Orange every year and Green every two years.\n\nData centres are not a named sector. Annexure III says projects such as data centres with pollution potential from gensets only may be classified by genset capacity and fuel: under 1,000 kVA in total may not need an additional classification; 1 MVA or more on liquid fuel is Orange (pollution index 60.0); 1 MVA or more on gaseous fuel is Green (50.5). Building construction of 20,000 sq m or more of built-up area is Orange (61.3). State boards can adopt different lists.',
      ['cte-cto', 'environmental-clearance-eia'],
      [CPCB], 'data-centre-approvals-india', 'Approvals needed for a data centre in India'),
    g('environmental-clearance-eia', 'Environmental clearance (EIA Notification 2006)',
      ['environmental clearance', 'EC for data centre', 'EIA 2006 item 8(a)', 'SEIAA clearance'],
      'Environmental clearance is the prior approval required under the EIA Notification 2006 for listed project types. A data centre needs it not as a data centre but as a building project of 20,000 sq m or more built-up area, or as a township or area development.',
      'Item 8(a) of the EIA Notification 2006 covers building and construction projects of 20,000 sq m to under 1,50,000 sq m of built-up area; item 8(b) covers townships and area development projects of 50 ha or more or 1,50,000 sq m or more. Category B projects are appraised by the State Environment Impact Assessment Authority (SEIAA) through the PARIVESH portal.\n\nThe government told the Rajya Sabha in August 2026, as quoted by Countercurrents, that data centres do not, as such, require environmental clearance; large campuses still need it under 8(a) or 8(b) because of their built-up area. In Maharashtra, data centre clearances have been issued under 8(a): one 2025 clearance covered two data centre buildings, two generator buildings and a substation with 76,930 sq m of total built-up area.',
      ['cte-cto', 'cpcb-industry-category'],
      [EIA, ('Countercurrents, quoting the Rajya Sabha reply of 6 August 2026 on environmental clearance for data centres', 'https://countercurrents.org/2026/08/to-tell-the-parliament-that-ai-data-centres-do-not-require-environment-clearance-is-laughable/'), ('SEIAA Maharashtra, environmental clearance for a Navi Mumbai data centre (21 November 2025)', 'https://assets.airtel.in/nxtra/pdf/EC_Environmental_Clearance_Certificate_Nxtra%20Mahape_DC-02_25.11.25.pdf')],
      'data-centre-approvals-india', 'Approvals needed for a data centre in India'),
    g('cgwa-noc', 'CGWA groundwater NOC',
      ['groundwater NOC', 'CGWA NOC', 'ground water abstraction NOC', 'CGWA NOC for data centre'],
      'A CGWA NOC is the no objection certificate a project needs from the Central Ground Water Authority, or from the state groundwater authority where the state regulates, before it draws groundwater for industrial, infrastructure or mining use.',
      'The CGWA guidelines of 24 September 2020 (S.O. 3289(E), amended in March 2023) require new, existing and expanding industries, infrastructure projects and mining projects that abstract groundwater to hold a NOC, applied for online. NOC holders must fit digital flow meters with telemetry, harvest rooftop rainwater, install piezometers scaled to the volume drawn and pay abstraction charges.\n\nIn over-exploited assessment units the guidelines bar NOCs for new industry other than MSMEs, while infrastructure projects are treated as location specific. Whether a data centre is assessed as industry or infrastructure is a question to settle with the authority for each site, which makes the assessment unit status of the parcel an early due diligence item.',
      ['cte-cto', 'environmental-clearance-eia'],
      [CGWA],
      'data-centre-water-india', 'Water and groundwater NOC for data centres in India'),
    g('fire-noc-data-centre', 'Fire NOC for a data centre',
      ['fire NOC', 'fire no objection certificate', 'data centre fire NOC', 'NBC E-3 occupancy'],
      'A fire NOC is the certificate the state fire service issues confirming a building’s fire and life safety design and installations meet the applicable code; for data centres the base code is the National Building Code 2016, Part 4, occupancy E-3.',
      'The National Building Code 2016 Part 4 places electronic data processing centres and computer installations in occupancy subdivision E-3. For E-3 buildings it requires an automatic fire detection and alarm system and allows protection by clean agents, water mist or hypoxic air, with CO2 or inert gas flooding for electrical panels, and at least two exits on each floor.\n\nThe certificate itself is issued by the state fire service under the state fire act and building bye-laws, so the process and fees vary by state. State data centre policies can add conditions: Uttar Pradesh’s 2026 policy allows generator sets to be stacked on several levels subject to a fire NOC.',
      ['cte-cto', 'environmental-clearance-eia'],
      [NBC, UP26], 'data-centre-approvals-india', 'Approvals needed for a data centre in India'),
    g('aai-height-noc', 'AAI height NOC (airport height clearance)',
      ['height NOC', 'AAI NOC', 'NOCAS', 'airport height clearance', 'GSR 751(E)'],
      'An AAI height NOC is the clearance from the Airports Authority of India that a structure’s top elevation will not endanger aircraft, required for sites within 20 km of visual-approach and 56 km of instrument-approach airports.',
      'The Ministry of Civil Aviation’s 2015 height restriction rules (G.S.R. 751(E)) require an AAI no objection certificate, applied for on NOCAS, for structures near aerodromes: up to 20 km from the aerodrome reference point for VFR airports and 56 km for IFR airports. Beyond those distances, structures below 150 m above ground do not need one. The NOC is valid for eight years and is free. Where a colour coded zoning map exists, local bodies can approve buildings below the mapped elevation without referring to AAI.\n\nFor data centres the elevation that matters includes stacks, rooftop plant and construction cranes. New airports at Navi Mumbai and Noida (Jewar) put height surfaces over established data centre clusters.',
      ['data-center-site-selection'],
      [AAI], 'data-centre-site-due-diligence-india', 'Data centre site due diligence in India'),
    g('dpdp-act', 'Digital Personal Data Protection Act 2023 (DPDP Act)',
      ['DPDP Act', 'DPDPA', 'DPDP Rules 2025', 'India data protection law'],
      'The Digital Personal Data Protection Act 2023 is India’s general data protection law. Its Rules were notified in November 2025, with most duties applying from May 2027.',
      'The DPDP Act (Act 22 of 2023) received assent on 11 August 2023. Section 16 lets the central government restrict transfers of personal data to countries it notifies, a negative list rather than a general localisation rule, and keeps sector rules that impose stricter limits, such as RBI’s. Section 10 lets the government designate significant data fiduciaries, which must appoint a data protection officer based in India and an independent auditor. The maximum penalty is ₹250 crore.\n\nThe DPDP Rules 2025 were announced on 14 November 2025 with an 18-month phased timeline. PIB said significant data fiduciaries must also comply with government-specified restrictions on certain categories of data, including localisation where required. For data centres, that is the provision that could move demand onshore once categories are specified.',
      ['data-localisation-india', 'meity-empanelment'],
      [DPDP, DPDPR], 'dpdp-data-localisation-data-centres-india', 'DPDP Act and data localisation for data centres'),
    g('data-localisation-india', 'Data localisation (India)',
      ['data localisation', 'data localization India', 'RBI data localisation', 'data residency India'],
      'Data localisation is a legal requirement to store or process data within India. India has no single localisation law; requirements come from RBI, SEBI, IRDAI, CERT-In, telecom licences and, for specified categories, the DPDP Rules 2025.',
      'The main localisation rules that drive data centre demand in India:\n\nRBI’s circular of 6 April 2018 requires payment system providers to store the entire data relating to payment systems only in India. SEBI’s cloud framework of 6 March 2023 requires regulated entities’ data to reside and be processed within India, in MeitY-empanelled data centres with a valid STQC audit for PaaS and SaaS. CERT-In’s directions of 28 April 2022 require logs to be kept for 180 days within Indian jurisdiction. The Unified Licence bars telecom licensees from transferring subscriber accounting and user information outside India. The DPDP Act takes a negative-list approach to cross-border transfers, while its Rules allow localisation of specified data held by significant data fiduciaries.',
      ['dpdp-act', 'meity-empanelment'],
      [RBI, SEBI, CERTIN, DPDP], 'dpdp-data-localisation-data-centres-india', 'DPDP Act and data localisation for data centres'),
    g('meity-empanelment', 'MeitY cloud empanelment and STQC audit',
      ['MeitY empanelment', 'MeitY empanelled cloud', 'STQC audit', 'MeghRaj', 'GI Cloud'],
      'MeitY empanelment is the Ministry of Electronics and IT’s listing of cloud service offerings, after an STQC audit, that government departments and some regulated entities may use. SEBI requires regulated entities’ cloud data to sit in MeitY-empanelled data centres in India.',
      'Cloud service providers apply to MeitY to have specific offerings empanelled; an STQC audit, with surveillance audits afterwards, checks them against MeitY’s requirements, and empanelled offerings are listed under the MeghRaj (GI Cloud) initiative.\n\nEmpanelment matters to data centre operators because regulators reference it. SEBI’s 2023 cloud framework requires PaaS and SaaS providers serving regulated entities to use MeitY-empanelled cloud infrastructure and to keep data only in data centres empanelled by MeitY with a valid STQC audit status.',
      ['data-localisation-india', 'dpdp-act'],
      [SEBI, ('STQC, requirements for empanelment of cloud audit organisations', 'https://stqc.gov.in/sites/default/files/CSP-02-03%20Requirements%20for%20Empanelment%20of%20Cloud%20Audit%20Organisation.pdf')],
      'dpdp-data-localisation-data-centres-india', 'DPDP Act and data localisation for data centres'),
    g('harmonised-master-list', 'Harmonised Master List of Infrastructure (data centre infrastructure status)',
      ['infrastructure status for data centres', 'harmonised master list', 'HML infrastructure', 'data centre infra status'],
      'The Harmonised Master List is the Finance Ministry’s list of infrastructure sub-sectors. Data centres of at least 5 MW IT load were added under Communication on 11 October 2022, giving them infrastructure status.',
      'The Department of Economic Affairs notification F. No. 13/1/2017-INF of 11 October 2022 added data centres to the Harmonised Master List of Infrastructure Sub-sectors under the Communication category. The footnote defines the item as a data centre housed in a dedicated or centralised building for storage and processing of digital data applications with a minimum capacity of 5 MW of IT load.\n\nInfrastructure status matters mainly for financing: lenders can treat qualifying data centres as infrastructure lending, which eases access to long-tenor institutional credit.',
      ['national-data-centre-policy', 'data-centre-park-india'],
      [HML], 'data-centre-incentives-india-central', 'Central incentives for data centres in India'),
    g('national-data-centre-policy', 'National Data Centre Policy (India)',
      ['national data centre policy', 'draft data centre policy 2020', 'national data centre policy 2025', 'MeitY data centre policy'],
      'India’s National Data Centre Policy exists only as a draft: MeitY published one in November 2020 that was never notified, and reopened consultations in August 2025. No final national policy had been notified as of November 2026.',
      'MeitY published a Draft Data Centre Policy in November 2020 that was never notified and never came into force, according to S&R Associates; infrastructure status for data centres was granted separately in 2022. MeitY resumed consultations in August 2025; reported proposals include four data centre economic zones, single-window clearance and growth in tier-2 and tier-3 cities.\n\nIn October 2026 NITI Aayog published a non-binding data centre evaluation framework asking each state for a data centre approval matrix, a single digital clearance portal and measured PUE, WUE and CUE. Until a national policy is notified, incentives come from state policies and the central measures in force: infrastructure status (2022) and the Budget 2026-27 tax holiday for foreign cloud firms using Indian data centres.',
      ['harmonised-master-list', 'data-centre-park-india'],
      [SNR, BWL, NITI, PIBCAP], 'national-data-centre-policy-india', 'National data centre policy: status in 2026'),
    g('essential-service-status-data-centre', 'Essential service status (data centres)',
      ['essential service', 'ESMA data centre', 'essential services maintenance act data centre', 'mission critical infrastructure'],
      'Essential service status lets a state apply its essential services maintenance law to data centres, protecting continuity of operation during strikes or shutdowns. West Bengal’s 2021 policy granted it (that policy’s term has since ended), Uttar Pradesh’s 2026 policy grants it, and Gujarat’s 2026 policy does too according to a law-firm summary.',
      'West Bengal’s Data Centre Policy 2021 classified data centres as essential services; its five-year term ended around September 2026. Uttar Pradesh’s Data Center Policy 2026 notifies data centres under ESMA as essential services. Gujarat’s Data Centre Policy 2026-29, as summarised by Cyril Amarchand Mangaldas, declares them an essential service under the Gujarat Essential Services Maintenance Act 1972; we have not seen the notified government resolution.\n\nNITI Aayog’s October 2026 evaluation framework reportedly recommends essential-services coverage for data centres more widely. The practical effect is continuity of operations and staff access during disruptions such as strikes or lockdowns.',
      ['national-data-centre-policy', 'data-centre-park-india'],
      [WB21, UP26, GJ26], 'data-centre-policy-india-state-comparison', 'State data centre policies compared'),
    g('data-centre-park-india', 'Data centre park (India)',
      ['data centre park', 'data center park India', 'green data centre park', 'DC park'],
      'A data centre park is a zone a state sets aside or certifies for several data centres sharing land, power and approvals. States define it in their policies; Uttar Pradesh’s 2026 policy sets a minimum of 40 MW of total load.',
      'Uttar Pradesh’s Data Center Policy 2026 defines a data centre park as 40 MW or more of total load and a data centre unit as more than 2 MW and under 40 MW, and gives parks interest and dual-grid subsidies. YEIDA lists a 100-acre data centre park in Sector 28 on the Yamuna Expressway. Maharashtra’s integrated green data centre park policy, under its 2023 IT policy, was reportedly expanded in June 2026 from three parks to twenty statewide (PowerPeak Digest).\n\nFor a buyer, a park usually means land allotted by a state agency with use already permitted and a planned substation; it does not by itself guarantee the MW or the date, which still depend on the utility connection.',
      ['harmonised-master-list', 'powered-land'],
      [UP26, YEIDA, PPD], 'data-centre-land-india', 'Data centre land and powered land in India'),
]


def main(path):
    data = json.load(open(path))
    by = {e['slug']: i for i, e in enumerate(data['entries'])}
    added = 0
    for e in ENTRIES:
        assert '—' not in json.dumps(e, ensure_ascii=False) and '–' not in json.dumps(e, ensure_ascii=False), e['slug']
        if e['slug'] in by:
            data['entries'][by[e['slug']]] = e
        else:
            data['entries'].append(e)
            added += 1
    slugs = {e['slug'] for e in data['entries']}
    for e in ENTRIES:
        for r in e['related_to']:
            assert r in slugs, (e['slug'], r)
    json.dump(data, open(path, 'w'), ensure_ascii=False, indent=2)
    print('glossary: %d India entries (%d new)' % (len(ENTRIES), added))


if __name__ == '__main__':
    main(sys.argv[1])
