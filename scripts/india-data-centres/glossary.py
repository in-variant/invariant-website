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
KHAITAN = ('Khaitan & Co, ERGO note on the Electricity (Amendment) Rules 2026 (20 March 2026)', 'https://www.khaitanco.com/sites/default/files/2026-03/ERGO_Electricity%20Amendment%20Rules%202026_20%20March%202026.pdf')
WATERACT = ('Water (Prevention and Control of Pollution) Act 1974, copy hosted by the Delhi Pollution Control Committee', 'https://dpcc.delhi.gov.in/sites/default/files/DPCC/generic_multiple_files/wateract.pdf')
AIRACT = ('Air (Prevention and Control of Pollution) Act 1981, copy hosted by the Punjab Pollution Control Board', 'https://ppcb.punjab.gov.in/media/documents/No-14-1981.pdf')
BSEC = ('Business Standard, AI data centres do not need standalone environmental clearance, says govt (6 August 2026)', 'https://www.business-standard.com/technology/artificial-intelligence/ai-data-centres-do-not-need-standalone-environmental-clearance-126080601373_1.html')
NXTRA = ('SEIAA Maharashtra, environmental clearance for a Navi Mumbai data centre (21 November 2025)', 'https://assets.airtel.in/nxtra/pdf/EC_Environmental_Clearance_Certificate_Nxtra%20Mahape_DC-02_25.11.25.pdf')
UL = ('Department of Telecommunications, Unified Licence Agreement', 'https://eservices.dot.gov.in/sites/default/files/2024-11/Unified%20Licence_Agreement.pdf')
STQC = ('STQC, requirements for empanelment of cloud audit organisations', 'https://stqc.gov.in/sites/default/files/CSP-02-03%20Requirements%20for%20Empanelment%20of%20Cloud%20Audit%20Organisation.pdf')

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
      'Section 42(2) of the Electricity Act 2003 requires each state commission to introduce open access in phases, allowed on payment of a surcharge, in addition to wheeling charges, that is used to meet the current level of cross subsidy. Section 42(4) lets the commission add an additional surcharge to cover the discom’s fixed costs from its obligation to supply.\n\nThe Green Energy Open Access Rules 2022 set the threshold for renewable open access at 100 kW of contracted demand or sanctioned load, with no limit for captive consumers, and list the only charges that can be levied on green open access consumers.',
      ['green-energy-open-access', 'cross-subsidy-surcharge', 'additional-surcharge', 'wheeling-charges', 'group-captive'],
      [EA, GEOA], 'green-energy-open-access-data-centres-india', 'Green energy open access for data centres in India'),
    g('green-energy-open-access', 'Green Energy Open Access Rules 2022 (GEOA)',
      ['green energy open access', 'GEOA rules 2022', 'green open access', 'green energy open access rules'],
      'The Green Energy Open Access Rules 2022 let consumers with 100 kW or more of contracted demand buy renewable power through open access, with approval deemed after 15 days and limits on the surcharges states can charge.',
      'The Electricity (Promoting Renewable Energy Through Green Energy Open Access) Rules 2022, G.S.R. 418(E) of 6 June 2022, make consumers with contracted demand or sanctioned load of 100 kW or more eligible, with no limit for captive consumers. Applications go through a central nodal agency portal and are deemed approved if not decided within 15 days. Banking is allowed at least monthly for at least 30% of the consumer’s monthly consumption from the discom.\n\nThe Rules limit charges to transmission, wheeling, cross subsidy surcharge and standby charges. The cross subsidy surcharge may not rise by more than 50% of the level fixed for the year open access is granted, during 12 years from the date the plant began operating, and the additional surcharge does not apply to a consumer who is paying fixed charges.',
      ['open-access-india', 'cross-subsidy-surcharge', 'additional-surcharge', 'group-captive'],
      [GEOA], 'green-energy-open-access-data-centres-india', 'Green energy open access for data centres in India'),
    g('cross-subsidy-surcharge', 'Cross subsidy surcharge (CSS)',
      ['cross subsidy surcharge', 'CSS open access', 'cross-subsidy surcharge'],
      'Cross subsidy surcharge is the charge an open access consumer pays its discom to make up the cross subsidy that consumer’s tariff would otherwise have contributed to cheaper tariffs for other consumers.',
      'Section 42(2) of the Electricity Act 2003 allows open access on payment of a surcharge, in addition to wheeling charges, used to meet the current level of cross subsidy within the discom’s area of supply. The state commission determines it.\n\nThe Green Energy Open Access Rules 2022 cap its growth for renewable open access: it may not rise by more than 50% of the level fixed for the year open access is granted, during 12 years from the date the plant began operating. Under the Act it is not leviable where open access is provided to a person who has set up a captive generating plant for its own use; captive status requires the 26% ownership and 51% consumption tests.',
      ['open-access-india', 'additional-surcharge', 'wheeling-charges', 'group-captive'],
      [EA, GEOA, KHAITAN], 'open-access-charges-by-state-india', 'Open access charges by state'),
    g('additional-surcharge', 'Additional surcharge (open access)',
      ['additional surcharge', 'AS open access', 'additional surcharge electricity'],
      'Additional surcharge is a charge on open access consumers, set by the state commission under Section 42(4) of the Electricity Act 2003, to cover the discom’s fixed costs of standing ready to supply them.',
      'Section 42(4) of the Electricity Act 2003 makes a consumer that buys from someone other than its discom liable to pay an additional surcharge on wheeling charges, as specified by the state commission, to meet the fixed cost the discom carries from its obligation to supply.\n\nUnder the Green Energy Open Access Rules 2022 the additional surcharge does not apply to a green open access consumer that is paying fixed charges to the discom. Captive users that meet the ownership and consumption tests are also outside it.',
      ['open-access-india', 'cross-subsidy-surcharge', 'green-energy-open-access'],
      [EA, GEOA, KHAITAN], 'open-access-charges-by-state-india', 'Open access charges by state'),
    g('wheeling-charges', 'Wheeling charges',
      ['wheeling charges', 'wheeling charge open access', 'distribution wheeling'],
      'Wheeling charges are what a consumer or generator pays a discom for carrying electricity over its distribution network, set by the state commission.',
      'When power bought through open access or from a captive plant is delivered over a discom’s wires, the state commission sets a wheeling charge for that use. In Maharashtra, MERC’s March 2025 multi-year tariff order for MSEDCL shows the wheeling charge as a separate component of category tariffs and set the HT wheeling charge (excluding EHV) at ₹0.62 per kVAh for FY 2025-26. Later orders can revise it, so check the figure in force.\n\nThe same MERC order gives data centres that consume 100% green energy through open access, the green tariff or a combination of the two a 10% discount on wheeling charges.',
      ['open-access-india', 'cross-subsidy-surcharge'],
      [MERCMYT, EA], 'open-access-charges-by-state-india', 'Open access charges by state'),
    g('group-captive', 'Group captive power (26% ownership, 51% consumption)',
      ['group captive', 'captive power plant', 'captive generation rules', 'group captive solar'],
      'Group captive is an arrangement in which several consumers jointly own a generating plant and qualify as captive users if together they hold at least 26% of its ownership and consume at least 51% of its annual generation; captive users do not pay the cross subsidy surcharge or the additional surcharge.',
      'Rule 3 of the Electricity Rules 2005 sets the two tests: captive users must together hold at least 26% of the ownership and consume at least 51% of the electricity generated in a year. The Electricity (Amendment) Rules 2026, notified in March 2026, amended Rule 3 and kept both tests, according to Khaitan & Co. The 2026 Rules count subsidiaries, holding companies and other subsidiaries of the holding company as part of the owner, and give verification of inter-state captive status to the National Load Despatch Centre.\n\nFor a data centre group, a renewable plant held through a special purpose vehicle with the data centre entities as captive users avoids the cross subsidy surcharge and the additional surcharge, provided the tests are met.',
      ['open-access-india', 'cross-subsidy-surcharge', 'additional-surcharge'],
      [CAPT, KHAITAN], 'green-energy-open-access-data-centres-india', 'Green energy open access for data centres in India'),
    g('general-network-access', 'General Network Access (GNA)',
      ['GNA', 'general network access', 'ISTS connectivity', 'GNA regulations 2022'],
      'General Network Access is the right, granted under CERC’s 2022 regulations, to inject into or draw from India’s inter-state transmission system. A bulk consumer with 50 MW or more of load can apply to connect to it directly.',
      'CERC’s Connectivity and General Network Access Regulations 2022, dated 7 June 2022, repealed the 2009 Connectivity Regulations; long-term access that had become effective under them is deemed to be GNA. Regulation 17.1(iii) lets a distribution licensee or a bulk consumer seeking to connect directly to the inter-state transmission system with a load of 50 MW and above apply for GNA.\n\nA draft fourth amendment of 16 June 2026 proposes letting a drawee entity connected to a state transmission or distribution system also connect directly to the inter-state network, after technical studies. CERC’s explanatory memorandum names data centres among the entities that may need such dual connectivity for round-the-clock power. CTUIL supported dual connectivity for bulk consumers; Grid-India and CEA opposed it.',
      ['ctu-stu', 'open-access-india', 'dual-grid-supply'],
      [GNA, GNA4], 'data-centre-grid-connection-india', 'How a data centre gets a grid connection in India'),
    g('ctu-stu', 'CTU and STU (central and state transmission utilities)',
      ['CTU', 'STU', 'CTUIL', 'state transmission utility', 'central transmission utility'],
      'The Central Transmission Utility (CTUIL) plans and coordinates the inter-state transmission system and is the nodal agency for connectivity to it; each state transmission utility (STU) plans and coordinates the state’s intra-state transmission system.',
      'Under sections 38 and 39 of the Electricity Act 2003, the Central Transmission Utility undertakes transmission through the inter-state system and plans and coordinates it, and each State Transmission Utility does the same for the intra-state system. Under CERC’s 2022 regulations the CTU is the nodal agency for connectivity and General Network Access to the inter-state system.\n\nData centres now appear in CTU planning. In CERC’s June 2026 explanatory memorandum, CTUIL cited uncertainty in bulk loads such as green hydrogen and data centres as one reason it could not finalise transmission for the remaining 33 GW of about 53 GW of in-principle connectivity granted in Rajasthan, Gujarat and Maharashtra.',
      ['general-network-access', 'discom', 'dual-grid-supply'],
      [EA, GNA, GNA4], 'data-centre-grid-connection-india', 'How a data centre gets a grid connection in India'),
    g('discom', 'Discom (distribution company) and HT/EHV supply',
      ['discom', 'distribution licensee', 'HT connection', 'EHV supply', 'EHT connection'],
      'A discom is the state distribution licensee that supplies electricity to consumers in its area. A data centre is a discom consumer, and the state supply code sets the voltage it is supplied at from its contract demand.',
      'Supply codes set the supply voltage by contract demand. Maharashtra’s 2021 code puts supply at 33 kV up to 10 MVA (20 MVA in metropolitan areas or on an express feeder) and at extra high voltage above that. In Tamil Nadu, TNPDCL supplies demand above 10 MVA and up to 50 MVA at 110 kV, and above 50 MVA at 230 kV. Telangana requires 132 kV or above for more than 10 MVA on a common feeder and more than 20 MVA on a dedicated feeder, and makes a consumer on a dedicated feeder pay the full cost of the service line including the take-off arrangements at the substation.',
      ['ctu-stu', 'dual-grid-supply', 'open-access-india'],
      [MERCSOP, TNSC, TGGTCS], 'data-centre-grid-connection-india', 'How a data centre gets a grid connection in India'),
    g('dual-grid-supply', 'Dual grid supply (two-source supply)',
      ['dual grid', 'dual feed', 'two source supply', 'dual power from grid', 'second source supply'],
      'Dual grid supply is a data centre connection fed from two independent grid sources, so the site keeps power if one fails. Maharashtra’s supply code lets the discom provide multiple sources on request at the consumer’s cost; Uttar Pradesh’s 2026 data centre policy subsidises it for data centre parks.',
      'Maharashtra’s 2021 Supply Code lets the discom adopt a special system of supply, including multiple sources of supply, if the consumer asks and it is technically feasible; the additional cost over the normal system is borne by the consumer, and consumers with multiple sources may pay additional fixed charges set by the commission.\n\nUttar Pradesh’s Data Center Policy 2026 provides a dual power grid network to data centre parks (40 MW or more) and reimburses the cost of the cheaper of the two grids, up to a limit.',
      ['discom', 'n-1-contingency', 'ctu-stu'],
      [MERCSOP, UP26], 'data-centre-grid-connection-india', 'How a data centre gets a grid connection in India'),
    g('green-tariff-india', 'Green tariff (India)',
      ['green tariff', 'green power tariff', 'MSEDCL green tariff', 'green energy tariff'],
      'A green tariff is an optional premium a discom customer pays over its normal tariff to have its consumption met from renewable power bought by the discom, without arranging open access itself.',
      'Under the Green Energy Open Access Rules 2022 the tariff for green energy supplied by a discom is determined separately by the state commission. MERC’s March 2025 multi-year order for MSEDCL set the green tariff at ₹0.25 per kWh over the category tariff for FY 2025-26 to FY 2029-30. MERC rejected MSEDCL’s proposal to charge no green tariff for round-the-clock green power to data centres and semiconductor units, citing storage and balancing costs and non-discrimination between consumers, but gave data centres consuming 100% green energy a 10% discount on wheeling charges.',
      ['open-access-india', 'green-energy-open-access', 'group-captive'],
      [MERCMYT, GEOA], 'green-energy-open-access-data-centres-india', 'Green energy open access for data centres in India'),
]

ENTRIES = POWER_ENTRIES + [
    g('cte-cto', 'Consent to Establish and Consent to Operate (CTE and CTO)',
      ['CTE and CTO', 'consent to establish', 'consent to operate', 'pollution board consent', 'CTE CTO data centre'],
      'Consent to Establish (CTE) and Consent to Operate (CTO) are the permissions a state pollution control board grants under the Water Act 1974 and the Air Act 1981: CTE before a project is set up, CTO before it starts operating.',
      'Section 25 of the Water Act 1974 requires the state board’s previous consent to establish an industry, operation or process likely to discharge sewage or trade effluent, and section 21 of the Air Act 1981 requires it to establish or operate an industrial plant in an air pollution control area. CPCB’s January 2025 classification lets boards grant CTO for up to 5 years to Red, 10 years to Orange and 15 years to Green category units.\n\nFor a data centre, CPCB says projects such as data centres whose pollution potential comes from gensets only may be classified by genset capacity and fuel, with 1 MVA or more on liquid fuel in Orange and on gaseous fuel in Green. Building construction of 20,000 sq m or more of built-up area is separately Orange, and its consents are to be taken as per its environmental clearance conditions. State boards must adopt the CPCB classification and may categorise new or left-out sectors themselves, so confirm the category with the board for the site.',
      ['cpcb-industry-category', 'environmental-clearance-eia', 'cgwa-noc'],
      [CPCB, WATERACT, AIRACT], 'data-centre-approvals-india', 'Approvals needed for a data centre in India'),
    g('cpcb-industry-category', 'CPCB pollution category (Red, Orange, Green, White, Blue)',
      ['CPCB category', 'red orange green white category', 'pollution index', 'data centre pollution category'],
      'The Central Pollution Control Board sorts activities into Red, Orange, Green and White categories by a pollution index score, plus a Blue category for essential environmental services; the category sets consent requirements and inspection frequency.',
      'CPCB’s January 2025 classification covers 419 sectors: 125 Red, 137 Orange, 94 Green, 54 White and 9 Blue. Pollution index bands are 80 and above for Red, 55 to under 80 for Orange, 25 to under 55 for Green and under 25 for White. Boards inspect Red units at least every six months, Orange every year and Green every two years.\n\nAnnexure III says projects such as data centres with pollution potential from gensets only may be classified by genset capacity and fuel. Standalone gensets under 1,000 kVA in total may not require additional classification; 1 MVA or more on liquid fuel is Orange (pollution index 60.0); 1 MVA or more on gaseous fuel is Green (50.5). Building construction of 20,000 sq m or more of built-up area is Orange (61.3). State boards must adopt the CPCB classification and may categorise new or left-out sectors themselves.',
      ['cte-cto', 'environmental-clearance-eia'],
      [CPCB], 'data-centre-approvals-india', 'Approvals needed for a data centre in India'),
    g('environmental-clearance-eia', 'Environmental clearance (EIA Notification 2006)',
      ['environmental clearance', 'EC for data centre', 'EIA 2006 item 8(a)', 'SEIAA clearance'],
      'Environmental clearance is the prior approval required under the EIA Notification 2006 for listed project types. A data centre needs it as a building and construction project of 20,000 sq m or more of built-up area, or as a township or area development project.',
      'Item 8(a) of the EIA Notification 2006 covers building and construction projects of 20,000 sq m to under 1,50,000 sq m of built-up area; item 8(b) covers townships and area development projects of 50 ha or more or 1,50,000 sq m or more. Category B projects are appraised by the State Environment Impact Assessment Authority (SEIAA), with applications and documents on the PARIVESH portal.\n\nIn a written Rajya Sabha reply of 6 August 2026, reported by Business Standard, the environment ministry said AI data centres do not, per se, require environmental clearance under the EIA Notification; clearance is needed when one is proposed as a building and construction project above 20,000 sq m of built-up area or as a township or area development project. In Maharashtra, SEIAA issued a clearance under item 8(a) in November 2025 for a data centre expansion covering two data centre buildings, two generator buildings and a substation, with 76,930 sq m of total built-up area.',
      ['cte-cto', 'cpcb-industry-category'],
      [EIA, BSEC, NXTRA],
      'data-centre-approvals-india', 'Approvals needed for a data centre in India'),
    g('cgwa-noc', 'CGWA groundwater NOC',
      ['groundwater NOC', 'CGWA NOC', 'ground water abstraction NOC', 'CGWA NOC for data centre'],
      'A CGWA NOC is the no objection certificate a project needs from the Central Ground Water Authority, or from the state groundwater authority where the state regulates, before it draws groundwater for industrial, infrastructure or mining use.',
      'The CGWA guidelines of 24 September 2020 (S.O. 3289(E)) require new, existing and expanding industries, infrastructure projects and mining projects that abstract groundwater, unless specifically exempted, to hold a NOC, applied for online. NOC holders must fit digital flow meters with telemetry, harvest rooftop rainwater, install piezometers scaled to the volume drawn and pay abstraction charges.\n\nIn over-exploited assessment units the guidelines bar NOCs for new industry other than MSMEs, while infrastructure projects, being location specific, are not barred. Whether a data centre is assessed as industry or infrastructure is a question to settle with the authority for each site, which makes the assessment unit status of the parcel an early due diligence item.',
      ['cte-cto', 'environmental-clearance-eia'],
      [CGWA],
      'data-centre-water-india', 'Water and groundwater NOC for data centres in India'),
    g('fire-noc-data-centre', 'Fire NOC for a data centre',
      ['fire NOC', 'fire no objection certificate', 'data centre fire NOC', 'NBC E-3 occupancy'],
      'A fire NOC is the no objection certificate from the fire service confirming a building’s fire and life safety design and installations meet the applicable code; for data centres the base code is the National Building Code 2016, Part 4, occupancy E-3.',
      'The National Building Code 2016 Part 4 places electronic data processing centres and computer installations in occupancy subdivision E-3. For E-3 buildings it requires an automatic fire detection and alarm system and allows protection by clean agents, mist technologies or hypoxic air, with CO2 or inert gas flooding for electrical panels; business buildings must have at least two exits on every floor.\n\nState data centre policies can add conditions: Uttar Pradesh’s 2026 policy allows multi-level stacking of generator sets subject to a NOC from the fire safety department.',
      ['cte-cto', 'environmental-clearance-eia'],
      [NBC, UP26], 'data-centre-approvals-india', 'Approvals needed for a data centre in India'),
    g('aai-height-noc', 'AAI height NOC (airport height clearance)',
      ['height NOC', 'AAI NOC', 'NOCAS', 'airport height clearance', 'GSR 751(E)'],
      'An AAI height NOC is the clearance from the Airports Authority of India that a structure’s top elevation will not endanger aircraft, required for sites within 20 km of visual-approach and 56 km of instrument-approach airports.',
      'The Government of India’s 2015 aerodrome safeguarding notification (G.S.R. 751(E)) makes a height clearance NOC mandatory before construction starts. AAI issues it for civil aerodromes through its online system, NOCAS; defence authorities issue it for defence aerodromes. It is needed up to 20 km from the aerodrome reference point for VFR airports and 56 km for IFR airports; beyond those distances, structures below 150 m above ground do not need one. The NOC is valid for eight years and is free. Where a colour coded zoning map exists, local bodies can approve buildings below the permissible top elevation without referring to AAI.',
      ['data-center-site-selection'],
      [AAI], 'data-centre-site-due-diligence-india', 'Data centre site due diligence in India'),
    g('dpdp-act', 'Digital Personal Data Protection Act 2023 (DPDP Act)',
      ['DPDP Act', 'DPDPA', 'DPDP Rules 2025', 'India data protection law'],
      'The Digital Personal Data Protection Act 2023 is India’s law on the protection of digital personal data. Its Rules were notified in November 2025 with an 18-month phased compliance timeline.',
      'The DPDP Act (Act 22 of 2023) is dated 11 August 2023. Section 16 lets the central government restrict transfers of personal data to countries it notifies, and keeps in force any other law that provides a higher degree of restriction on transfers outside India. Section 10 lets the government notify significant data fiduciaries, which must appoint a data protection officer based in India and an independent data auditor. The highest penalty in the Schedule is up to ₹250 crore.\n\nPIB announced the DPDP Rules 2025 on 14 November 2025, with an 18-month phased compliance timeline. PIB said significant data fiduciaries must also comply with government-specified restrictions on certain categories of data, including localisation where required.',
      ['data-localisation-india', 'meity-empanelment'],
      [DPDP, DPDPR], 'dpdp-data-localisation-data-centres-india', 'DPDP Act and data localisation for data centres'),
    g('data-localisation-india', 'Data localisation (India)',
      ['data localisation', 'data localization India', 'RBI data localisation', 'data residency India'],
      'Data localisation is a legal requirement to store or process data within India. The requirements come from sector rules, including those of RBI, SEBI, CERT-In and the telecom Unified Licence, and, for specified data held by significant data fiduciaries, the DPDP Rules 2025.',
      'Sector rules that require data to stay in India include:\n\nRBI’s circular of 6 April 2018 requires payment system providers to store the entire data relating to payment systems only in India. SEBI’s cloud framework of 6 March 2023 requires regulated entities’ data in the cloud to reside and be processed within India, and PaaS and SaaS providers to host and process it only in MeitY-empanelled data centres with a valid STQC audit status. CERT-In’s directions of 28 April 2022 require service providers, data centres and others to keep logs of their ICT systems for 180 days within Indian jurisdiction. The Unified Licence bars telecom licensees from transferring subscriber accounting information and user information outside India, with roaming and billing exceptions. The DPDP Act lets the government restrict transfers to notified countries, while PIB says the DPDP Rules allow localisation of specified data held by significant data fiduciaries.',
      ['dpdp-act', 'meity-empanelment'],
      [RBI, SEBI, CERTIN, UL, DPDP, DPDPR], 'dpdp-data-localisation-data-centres-india', 'DPDP Act and data localisation for data centres'),
    g('meity-empanelment', 'MeitY cloud empanelment and STQC audit',
      ['MeitY empanelment', 'MeitY empanelled cloud', 'STQC audit'],
      'MeitY empanelment is the Ministry of Electronics and IT’s empanelment of cloud service providers, assessed under an STQC audit scheme. SEBI requires its regulated entities to take cloud services only from MeitY-empanelled providers whose data centres hold a valid STQC audit status.',
      'STQC, a directorate of MeitY, runs a certification scheme for the empanelment of cloud service providers; third-party audit organisations empanelled by STQC carry out the initial and surveillance audits.\n\nEmpanelment matters to data centre operators because regulators reference it. SEBI’s 2023 cloud framework requires regulated entities to use MeitY-empanelled cloud service providers, and PaaS and SaaS providers serving them to keep their data only in data centres empanelled by MeitY with a valid STQC audit status.',
      ['data-localisation-india', 'dpdp-act'],
      [SEBI, STQC],
      'dpdp-data-localisation-data-centres-india', 'DPDP Act and data localisation for data centres'),
    g('harmonised-master-list', 'Harmonised Master List of Infrastructure (data centre infrastructure status)',
      ['infrastructure status for data centres', 'harmonised master list', 'HML infrastructure', 'data centre infra status'],
      'The Harmonised Master List is the Finance Ministry’s list of infrastructure sub-sectors. Data centres of at least 5 MW IT load were added under Communication on 11 October 2022, giving them infrastructure status.',
      'The Department of Economic Affairs notification F. No. 13/1/2017-INF of 11 October 2022 added data centres to the Harmonised Master List of Infrastructure Sub-sectors under the Communication category. The footnote defines the item as a data centre housed in a dedicated or centralised building for storage and processing of digital data applications with a minimum capacity of 5 MW of IT load.',
      ['national-data-centre-policy', 'data-centre-park-india'],
      [HML], 'data-centre-incentives-india-central', 'Central incentives for data centres in India'),
    g('national-data-centre-policy', 'National Data Centre Policy (India)',
      ['national data centre policy', 'draft data centre policy 2020', 'national data centre policy 2025', 'MeitY data centre policy'],
      'India’s national data centre policy exists only as a draft: MeitY issued one in November 2020 that was never notified, and resumed consultations in August 2025. In October 2026 MediaNama, citing the Indian Express, reported that the draft and timeline of a dedicated policy were not yet public.',
      'MeitY issued a Draft Data Centre Policy in November 2020 that was not notified and never came into effect, according to S&R Associates; infrastructure status for data centres was granted separately in October 2022 through the Harmonised Master List. MeitY resumed consultations in August 2025; proposals reported by BW Legal World include four data centre economic zones, single-window clearance and growth in tier-2 and tier-3 cities.\n\nOn 14 October 2026 NITI Aayog released a Data Centre Evaluation Framework that describes itself as guidance rather than regulation. As reported by MediaNama, it asks each state to publish a data centre approval matrix, to bring clearances onto one digital interface and to require post-commissioning measurement of PUE, WUE and CUE. Central measures in force include infrastructure status (2022) and, under the Finance Act 2026, a tax holiday to 2047 for notified foreign companies that procure data centre services from specified Indian data centres, according to S&R Associates.',
      ['harmonised-master-list', 'data-centre-park-india'],
      [SNR, BWL, NITI, HML], 'national-data-centre-policy-india', 'National data centre policy: status in 2026'),
    g('essential-service-status-data-centre', 'Essential service status (data centres)',
      ['essential service', 'ESMA data centre', 'essential services maintenance act data centre', 'mission critical infrastructure'],
      'Essential service status brings data centres under a state’s essential services maintenance law. Uttar Pradesh’s 2026 policy classifies the data centre industry under ESMA as an essential service provider, and Gujarat’s 2026 policy treats data centre operations as an essential service according to a law-firm summary.',
      'Uttar Pradesh’s Data Center Policy 2026 classifies the data centre industry under the Essential Services Maintenance Act (ESMA) as an essential service provider. Gujarat’s Data Center Policy 2026-2029, as summarised by Cyril Amarchand Mangaldas, treats the operation, management, maintenance and support of data centres as an essential service under the Gujarat Essential Services Maintenance Act 1972, which the firm says provides operational continuity protections; we have not seen the notified government resolution.\n\nNITI Aayog’s October 2026 evaluation framework, as reported by MediaNama, asks the Centre to provide a model state notification or central advisory for ESMA or equivalent continuity treatment, covering 24x7 operations, priority utilities and emergency access.',
      ['national-data-centre-policy', 'data-centre-park-india'],
      [UP26, GJ26, NITI], 'data-centre-policy-india-state-comparison', 'State data centre policies compared'),
    g('data-centre-park-india', 'Data centre park (India)',
      ['data centre park', 'data center park India', 'green data centre park', 'DC park'],
      'A data centre park is a category that state data centre policies define for incentives. Uttar Pradesh’s 2026 policy treats a data centre of at least 40 MW of total load as a data centre park.',
      'Uttar Pradesh’s Data Center Policy 2026 defines a data centre park as a data centre with at least 40 MW of total load and a data centre unit as more than 2 MW and under 40 MW, and gives parks interest and dual-grid subsidies. Land is also offered as data centre parks: YEIDA lists a 100-acre Data Centre Park in Sector 28 in its industrial land bank.',
      ['harmonised-master-list', 'powered-land'],
      [UP26, YEIDA], 'data-centre-land-india', 'Data centre land and powered land in India'),
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
