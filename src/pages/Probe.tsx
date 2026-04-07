import { useState, useCallback, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const API_URL: string = 'https://rag-gcp-520296708682.asia-south1.run.app/search'
const USE_DEMO = API_URL === 'PLACEHOLDER_API_URL'

interface SearchResult {
  chunk_id: number
  doc_id: string
  title: string
  chunk_index: number
  score: number
  text: string
}

const DEMO_RESULTS: Record<string, SearchResult[]> = {
  'radiation shielding': [
    { chunk_id: 169074, doc_id: 'www.nrc.gov/docs/ML2214/ML22146A382.pdf', title: 'LaSalle County Station, Units 1 & 2, Revision 25 to Updated Final Safety Analysis Report, Appendices (ML22111A254 Redacted)', chunk_index: 89, score: 19.7453, text: 'REGULATORY GUIDE 1.69- - REV.O CONCRETE RADIATION SHIELDS FOR NUCLEAR POWER PLANTS ANSI 101.6-1972 basically deals with field practices. It also stresses quality assurance (QA) especially in the mixing and pouring of concrete. The parts of this document that coven shield design are more concerned with the protection and construction of shields than with the radiation protection aspects. The radiation protection is included in the station design criteria.' },
    { chunk_id: 25571, doc_id: 'www.nrc.gov/docs/ML0410/ML041040369.pdf', title: 'NAC-UMS, Final Safety Analysis Report for the UMS Universal Storage, Revision 3, Chapter 2, Table of Contents Through Chapter 4, Section 4.6, References.', chunk_index: 185, score: 15.681, text: 'Between the shell and the lead shield and enclosed within a welded steel shell where the shell seams are welded to top and bottom plates with full penetration or fillet welds, it will maintain its form over the expected lifetime of the transfer cask\'s radiation exposure. The material\'s placement between the lead shield and the outer shell does not allow the material to redistribute within the annulus.' },
    { chunk_id: 143148, doc_id: 'www.nrc.gov/docs/ML1905/ML19056A146.pdf', title: 'Turkey Point, SLRA RAIs 10, 12, 13 - Set 8 Rev. 0 Irradiated Concrete-Steel Responses.', chunk_index: 14, score: 15.6755, text: 'Loading in which the reduced strengths and modulus of the irradiated concrete were also considered. Comparing with the un-irradiated concrete (where the maximum interaction ratio (IR) is calculated as 0.74), the maximum IR for the irradiated concrete (including the cracking discussed above) was calculated as 0.82, which is increased but is still less than 1.0.' },
    { chunk_id: 115794, doc_id: 'www.nrc.gov/docs/ML1522/ML15223B361.pdf', title: 'IR 05200027/2015002, 05200028/2015002; Virgil C. Summer Nuclear Station Units 2 & 3, Routine Integrated Inspection Report.', chunk_index: 53, score: 15.4218, text: 'Walls met the radiation shielding requirements. No findings were identified. ITAAC Number 3.3.00.03d (780)/Family.01A — The inspectors performed a direct inspection of construction activities associated with ITAAC Number 3.3.00.03d (780).' },
    { chunk_id: 85803, doc_id: 'www.nrc.gov/docs/ML1132/ML11321A182.pdf', title: 'NUREG/CR-7116, SRNL-STI-2011-00005, "Materials Aging Issues and Aging Management for Extended Storage and Transportation of Spent Nuclear Fuel".', chunk_index: 228, score: 15.3186, text: 'High hydrogen contents. These materials are subject to degradation and possible relocation within the casks as a result of thermal and radiation exposures, as well as the passage of time. Chain scission can result in a reduction in molecular weight and an increased tendency of the polymer to creep. Polymeric materials and resins used for neutron shielding are subject to degradation and possible relocation.' },
    { chunk_id: 41834, doc_id: 'www.nrc.gov/docs/ML0714/ML071440224.pdf', title: 'Calvert Cliffs, Unit 1, Long-Term Coupon Surveillance Program for Spent Fuel Pool.', chunk_index: 14, score: 13.835, text: 'Summary weight changes in both materials were phase affect the strength of these. Two types of resin bonded boron carbide shielding materials have been developed by The Carborundum Company for in-pool shielding on densified spent fuel storage racks. One is a thick rigid plate, the other a thin flexible glass fabric reinforced composite.' },
    { chunk_id: 41890, doc_id: 'www.nrc.gov/docs/ML0714/ML071440224.pdf', title: 'Calvert Cliffs, Unit 1, Long-Term Coupon Surveillance Program for Spent Fuel Pool.', chunk_index: 70, score: 13.8322, text: 'Effects of Irradiation on Boron Carbide Sheet Shielding Material. The Carborundum Co. report — test program for two-ply sheet material and boron carbide metal cermet shielding material. The behavior of boron carbide material in spent fuel storage pools was presented at the 1979 Winter Meeting, American Nuclear Society.' },
    { chunk_id: 25314, doc_id: 'www.nrc.gov/docs/ML0407/ML040780974.pdf', title: 'Diablo Canyon Power Plant, Issuance of Materials License No. SNM-2511 for the Diablo Canyon ISFSI (72-26)', chunk_index: 15, score: 13.5469, text: 'With a sample input file in the HI-STORM 100 System FSAR Revision 1, provides reasonable assurance that the ISFSI shielding was adequately evaluated. The applicant\'s analysis demonstrates that no credible accident will cause a significant increase in public or personnel dose rates from direct radiation.' },
    { chunk_id: 85800, doc_id: 'www.nrc.gov/docs/ML1132/ML11321A182.pdf', title: 'NUREG/CR-7116, SRNL-STI-2011-00005, "Materials Aging Issues and Aging Management for Extended Storage and Transportation of Spent Nuclear Fuel".', chunk_index: 225, score: 13.4284, text: 'Slender aluminum containers. The array of resin filled containers is enclosed within a smooth outer steel shell. A disk of polypropylene is attached to the cask lid to provide neutron shielding during storage. Polyethylene shielding rods are used as a neutron shield in CASTOR-V/21 PWR spent fuel storage cask.' },
    { chunk_id: 169397, doc_id: 'www.nrc.gov/docs/ML2218/ML22188A174.pdf', title: 'River Bend Station, Unit 1 - Issuance of Amendment No. 211 Re: Add License Condition Concerning Receipt, Possession, and Use of Byproduct Materials', chunk_index: 7, score: 13.3524, text: '10 CFR Part 20, "Standards For Protection Against Radiation," establishes standards for protection against ionizing radiation resulting from activities conducted under licenses issued by the Nuclear Regulatory Commission. 10 CFR 20.1101, "Radiation protection programs," requires each licensee to develop, document, and implement a radiation protection program.' },
  ],
  'seismic design': [
    { chunk_id: 98407, doc_id: 'www.nrc.gov/docs/ML1313/ML13135A236.pdf', title: 'Beaver Valley, Unit 2 - Near-Term Task Force Recommendation 2.3 Seismic Walkdown Report.', chunk_index: 6, score: 17.8005, text: 'Which can be reasonably predicted from geologic and seismic evidence. Seismic Category I instrumentation and electrical equipment are designed to maintain the capability to: 1. Initiate a protective action during the safe shutdown earthquake (SSE), 2. Withstand seismic disturbances during post-accident operation without loss of safety function.' },
    { chunk_id: 110828, doc_id: 'www.nrc.gov/docs/ML1501/ML15013A132.pdf', title: 'LaSalle County Station, Units 1 and 2 - Staff Assessment of Information Provided Pursuant to 10 CFR 50.54(f), Seismic Hazard Reevaluations for Recommendation 2.1 of the Near-Term Task Force Review.', chunk_index: 8, score: 16.9808, text: 'Identify the specific functions that an SSC of a facility must perform, and the specific values or ranges of values chosen for controlling parameters as reference bounds for the design. The seismic design-basis for currently operating NPPs were either developed in accordance with, or meet the intent of GDC 2 and 10 CFR Part 100, Appendix A.' },
    { chunk_id: 102581, doc_id: 'www.nrc.gov/docs/ML1400/ML14007A670.pdf', title: 'Davis-Besse Nuclear Power Station, Unit 1, Interim Staff Evaluation Relating to Overall Integrated Plan in Response to Order EA-12-049 (Mitigation Strategies).', chunk_index: 36, score: 16.7955, text: 'Considerations in utilizing off-site resources. The licensee stated that there are two design earthquakes identified for DBNPS: the Maximum Possible Earthquake and the Maximum Probable Earthquake. The Maximum Possible Earthquake (larger) produces a vibratory ground motion for which structures, systems, and components important to safety are designed to remain functional.' },
    { chunk_id: 161372, doc_id: 'www.nrc.gov/docs/ML2108/ML21082A422.pdf', title: 'LaSalle County Station - Issuance of Amendment Nos. 249 and 235 to Adopt 10 CFR 50.69, "Risk-Informed Categorization and Treatment of Structures, Systems, and Components"', chunk_index: 64, score: 16.5299, text: 'Entire seismic hazard curve (i.e., all possible levels of earthquakes along with their frequencies of occurrence and consequences); Simultaneous damage to multiple redundant components (also known as correlated failures) which represents a major common-cause effect.' },
    { chunk_id: 129016, doc_id: 'www.nrc.gov/docs/ML1708/ML17083A602.pdf', title: 'Order establishing schedule for evidence & testimony — Pacific Gas and Electric Company (Diablo Canyon, Units 1 and 2) (SEISMIC)', chunk_index: 5, score: 16.4576, text: 'UNITED STATES OF AMERICA NUCLEAR REGULATORY COMMISSION — In the Matter of Docket No. 50-275OL 50-323OL (SEISMIC) PACIFIC GAS AND ELECTRIC COMPANY (Diablo Canyon, Units 1 and 2) CERTIFICATE OF SERVICE.' },
    { chunk_id: 98186, doc_id: 'www.nrc.gov/docs/ML1313/ML13133A132.pdf', title: 'Draft Report, Consequence Study of a Beyond-Design-Basis Earthquake Affecting the Spent Fuel Pool for a U.S. Mark I Boiling Water Reactor.', chunk_index: 120, score: 16.2425, text: 'This is ensured through a combination of assembly spacing and neutron poison material (e.g., Boraflex). If a seismic event did cause reconfiguration of the fissionable material by means of either (1) direct movement of the fuel, (2) direct degradation of the poison material, or (3) indirect effect on either the fuel or poison material because of high temperatures associated with an induced accident.' },
    { chunk_id: 20662, doc_id: 'www.nrc.gov/docs/ML0311/ML031150515.pdf', title: 'NRC Generic Letter 1984-001: NRC Use of the Terms, "Important to Safety" and "Safety Related".', chunk_index: 33, score: 16.2228, text: 'NUREG-0968 is the Safety Evaluation Report for the Clinch River Breeder Reactor (CRBR). In discussing seismic design requirements for CRBR, the Staff states: CRBR Principal Design Criterion (PDC) 2, in part, requires that structures, systems, and components important to safety be designed to withstand the effects of earthquakes without loss of capability to perform their safety functions.' },
    { chunk_id: 162800, doc_id: 'www.nrc.gov/docs/ML2116/ML21162A102.pdf', title: 'SECY-23-0021: Enclosure 1 - Proposed Rule Federal Register Notice', chunk_index: 65, score: 16.1796, text: 'Plant could show that SSCs are able to withstand the effects of earthquakes by adopting an approach similar to that in appendix S to part 50. Alternatively, an applicant could follow the more recent risk-informed alternatives afforded by standards development organizations (e.g., ASCE/SEI 43-19, "Seismic Design Criteria for Structures, Systems, and Components in Nuclear Facilities").' },
    { chunk_id: 111677, doc_id: 'www.nrc.gov/docs/ML1505/ML15055A543.pdf', title: 'Watts Bar, Unit 1 - Staff Assessment of Information Provided Pursuant to 10 CFR 50.54(f), Seismic Hazard Reevaluations Relating to Recommendation 2.1 of the NTTF Review.', chunk_index: 8, score: 16.0598, text: 'Of natural phenomena such as earthquakes, tornadoes, hurricanes, floods, tsunami, and seiches without loss of capability to perform their safety functions. The seismic design bases for currently operating nuclear power plants were either developed in accordance with, or meet the intent of, GDC 2 and 10 CFR Part 100, Appendix A.' },
    { chunk_id: 43832, doc_id: 'www.nrc.gov/docs/ML0728/ML072890489.pdf', title: 'Watts Bar - Final Draft Instrumentation Seismic Instrumentation Technical Specifications', chunk_index: 18, score: 16.0508, text: 'FINAL DRAFT INSTRUMENTATION SEISMIC INSTRUMENTATION — LIMITING CONDITION FOR OPERATION 3.3.3.3 The seismic monitoring instrumentation shown in Table 3.3-7 shall be OPERABLE. APPLICABILITY: At all times. Each of the above required seismic monitoring instruments shall be demonstrated OPERABLE by the performance of the CHANNEL CHECK, CHANNEL CALIBRATION and ANALOG CHANNEL OPERATIONAL TEST.' },
  ],
  'loss of coolant': [
    { chunk_id: 15562, doc_id: 'www.nrc.gov/docs/ML0217/ML021720594.pdf', title: 'NUREG/CR-6765, "Development of Technical Basis for Leak-Before-Break Evaluation Procedures."', chunk_index: 52, score: 19.6332, text: 'CURRENT REGULATORY REQUIREMENTS AND GUIDANCE RELATED TO LBB — "Loss of coolant accidents mean those postulated accidents that result from the loss of reactor coolant at a rate in excess of the capability of the reactor coolant makeup system from breaks in the reactor coolant pressure boundary, up to and including a break equivalent in size to the double-ended rupture of the largest pipe of the reactor coolant system."' },
    { chunk_id: 75819, doc_id: 'www.nrc.gov/docs/ML1021/ML102160314.pdf', title: 'Indian Point, Unit 2 - Draft Outlines (Facility Letter Dated 4/9/2010).', chunk_index: 10, score: 18.8012, text: 'Following responses as they apply to the Loss of Component Cooling Water: The automatic actions (alignments) within the CCWS resulting from the actuation of the ESFAS — Pressurizer Vapor Space Accident, Small Break LOCA, Large Break LOCA, RCP Malfunctions, Loss of RHR System, Loss of Component Cooling Water.' },
    { chunk_id: 20796, doc_id: 'www.nrc.gov/docs/ML0312/ML031260477.pdf', title: 'Indian Point Nuclear Generating Unit No. 3 - Issuance of Amendment Re: Best Estimate Large-Break Loss-of-Coolant Accident Evaluation Methodology.', chunk_index: 17, score: 18.0135, text: 'Acceptance for Referencing of the Topical Report WCAP-12945 (P), "Westinghouse Code Qualification Document for Best Estimate Loss of Coolant Analysis." Principal Contributor: F. Orr.' },
    { chunk_id: 80859, doc_id: 'www.nrc.gov/docs/ML1109/ML110980197.pdf', title: 'Arkansas Nuclear One, Unit No. 2 - Issuance of Amendment No. 293, Technical Specification Changes and Analyses Regarding Use of Alternate Source Term.', chunk_index: 85, score: 17.2453, text: 'Key Parameters Used in Radiological Consequence Analysis of Loss of Coolant Accident — Reactor Core Power 3087 MWth, Containment Volume 1.78E6 ft³, Gap Release Phase 30 sec - 0.5 hrs, Early In-Vessel Release Phase 0.5-1.8 hrs. Containment Leak Rates 0.1 percent/day ≤ 24 hrs, 0.05 percent/day > 24 hrs.' },
    { chunk_id: 27756, doc_id: 'www.nrc.gov/docs/ML0421/ML042160492.pdf', title: 'Watts Bar July 2004 Exam 50-390/2004-301 FINAL SRO Written Exam.', chunk_index: 13, score: 16.7673, text: 'REFERENCES: Lesson plan 3-OT-SYS062A AOI-15 Loss of Component Cooling Water 10CFR55 41.7, 45.5,6 Ability to operate and/or monitor the following as they apply to the Loss of Component Cooling Water: Control of flow rates to components cooled by the CCWS.' },
    { chunk_id: 41957, doc_id: 'www.nrc.gov/docs/ML0715/ML071560223.pdf', title: 'South Texas Project - 11-2005 - Final Written Exam.', chunk_index: 16, score: 16.4023, text: 'KA: 026 Loss of Component Cooling Water, AA1.06 — Ability to operate and/or monitor the following as they apply to the Loss of Component Cooling Water: Control of flow rates to components cooled by the CCWS.' },
    { chunk_id: 70571, doc_id: 'www.nrc.gov/docs/ML0927/ML092710463.pdf', title: 'Three Mile Island, Unit 1, Renewed Facility Operating License.', chunk_index: 67, score: 16.3799, text: 'Loss of reactor coolant through reactor coolant pump seals and system valves to connecting systems which vent to the gas vent header and from which coolant can be returned to the reactor coolant system shall not be considered as reactor coolant leakage and shall not be subject to the consideration of Specifications 3.1.6.1 through 3.1.6.7.' },
    { chunk_id: 87219, doc_id: 'www.nrc.gov/docs/ML1207/ML12073A209.pdf', title: 'Watts Bar Initial Exam 2011-302 Draft SRO Written Exam 1 of 3.', chunk_index: 48, score: 16.0836, text: 'Loss of Component Cooling Water AOI-15 Rev. 0032 (CCS) WBN Unit 1 — CHECK CCS pumps status, CHECK any CCS pump TRIPPED or running pump NOT pumping forward: ERCW/CCS Motor tripout alarm, Low header pressure (Train A or B), Multiple low flow alarms.' },
    { chunk_id: 87220, doc_id: 'www.nrc.gov/docs/ML1207/ML12073A209.pdf', title: 'Watts Bar Initial Exam 2011-302 Draft SRO Written Exam 1 of 3.', chunk_index: 49, score: 15.9821, text: 'Loss of CCS Flow/Out-leakage (continued) — CHECK TWO U-1 Train A header supply pumps RUNNING. ENSURE at least one of the following CLOSED to avoid excessive flow: RHR HX A, 1-FCV-70-156, or SFP HX A, 0-FCV-70-197. CHECK flows returned to NORMAL.' },
    { chunk_id: 46162, doc_id: 'www.nrc.gov/docs/ML0809/ML080950247.pdf', title: 'Vogtle, Units 1 & 2, License Amendment, Changes To Technical Specifications Sections TS 5.5.9, Steam Generator Program and TS 5.6.10.', chunk_index: 35, score: 15.6628, text: 'Constant value of loss coefficient, based on a lower bound of the data. This contrasts with the "nominal B*" approach which is not directly impacted by the assumed value of loss coefficient since this value is assumed to be constant with increasing contact pressure between the tube and tubesheet.' },
  ],
  'emergency planning': [
    { chunk_id: 173393, doc_id: 'www.nrc.gov/docs/ML2322/ML23226A036.pdf', title: 'Regulatory Guide 1.242, Revision 0 - Emergency Preparedness for Small Modular Reactors and Other New Technologies', chunk_index: 36, score: 25.6151, text: 'Local law enforcement, fire departments, emergency management agencies, and other emergency response organizations. The emergency plan should also document the relevant emergency planning and preparations and roles and responsibilities for each agency, including agency or organization name, responsibilities, capabilities to be planned and prepared, and periodic review of contacts and arrangements.' },
    { chunk_id: 175040, doc_id: 'www.nrc.gov/docs/ML2334/ML23348A082.pdf', title: 'RG 4.7 Rev 4 (DG-4034) General Site Suitability for NPP', chunk_index: 43, score: 25.2713, text: 'NRC requirements pertaining to emergency planning were first developed in 10 CFR Part 50 (§50.47 and Appendix E) with respect to construction permits and operating licenses. NRC reviews and approves emergency plans in consultation with the Federal Emergency Management Agency (FEMA), as described in NUREG-0654/FEMA-REP-1.' },
    { chunk_id: 170405, doc_id: 'www.nrc.gov/docs/ML2228/ML22287A155.pdf', title: 'SE For NuScale TR-0915-17772, "Methodology For Establishing The Technical Basis For Plume Exposure Emergency Planning Zones At NuScale Small Modular Reactor Plant Sites," Rev. 3', chunk_index: 1, score: 24.8466, text: 'Nuclear power plant emergency planning regulatory requirements were developed to provide reasonable assurance that adequate protective measures can and will be taken in the event of a radiological emergency. These are codified under "Emergency Plans," 10 CFR Section 50.47, and "Emergency Planning and Preparedness for Production and Utilization Facilities," 10 CFR Part 50, Appendix E.' },
    { chunk_id: 173397, doc_id: 'www.nrc.gov/docs/ML2322/ML23226A036.pdf', title: 'Regulatory Guide 1.242, Revision 0 - Emergency Preparedness for Small Modular Reactors and Other New Technologies', chunk_index: 40, score: 24.7914, text: 'The emergency plan should describe the drill and exercise program, with references to the process for testing and implementing major portions of the planning, preparations, capabilities, and coordination with offsite organizations to maintain the key skills of emergency responders; list the major drills and their specific frequencies.' },
    { chunk_id: 122090, doc_id: 'www.nrc.gov/docs/ML1614/ML16141A125.pdf', title: 'Joseph M. Farley, Unit Nos. 1 and 2 - Issuance of Amendments to Incorporate Southern Nuclear Operating Company Fleet Emergency Plan.', chunk_index: 6, score: 24.6797, text: 'As defined in 10 CFR 50.54(q)(1)(i), "emergency plan" means the documents prepared and maintained by the licensee that identify and describe the licensee\'s methods for maintaining emergency preparedness and responding to emergencies. Each licensee is required to follow and maintain the effectiveness of an emergency plan that meets the requirements in Appendix E to 10 CFR Part 50.' },
    { chunk_id: 44601, doc_id: 'www.nrc.gov/docs/ML0735/ML073521046.pdf', title: 'Regional workshops to discuss feasibility of proposed change to regulation on radiological emergency response plans.', chunk_index: 28, score: 24.462, text: '10 CFR Part 50, Appendix E — EMERGENCY PLANNING AND PREPAREDNESS FOR PRODUCTION AND UTILIZATION FACILITIES. Each applicant for a construction permit is required by §50.34(a) to include in its preliminary safety analysis report a discussion of preliminary plans for coping with emergencies. This appendix establishes minimum requirements for emergency plans.' },
    { chunk_id: 173385, doc_id: 'www.nrc.gov/docs/ML2322/ML23226A036.pdf', title: 'Regulatory Guide 1.242, Revision 0 - Emergency Preparedness for Small Modular Reactors and Other New Technologies', chunk_index: 28, score: 24.4061, text: 'The emergency plan should describe the capabilities to assess, monitor, and report to applicable response personnel the radiological conditions in and around the facility and onsite locations, such as abnormally high radiological area and process conditions.' },
    { chunk_id: 120508, doc_id: 'www.nrc.gov/docs/ML1608/ML16083A208.pdf', title: 'McGuire Nuclear Station, Units 1 and 2 - Issuance of License Amendments Regarding Emergency Action Level Scheme Change.', chunk_index: 7, score: 24.2103, text: '10 CFR Section 50.47, "Emergency plans," sets forth emergency plan requirements for nuclear power plant facilities. The regulations in Section 50.47(a)(1)(i) of 10 CFR Part 50 states, in part, that adequate protective measures can and will be taken in a radiological emergency.' },
    { chunk_id: 158357, doc_id: 'www.nrc.gov/docs/ML2024/ML20244A292.pdf', title: 'Three Mile Island Nuclear Station, Units 1 And 2 - Exemptions From Certain Emergency Planning Requirements And Related Safety Evaluation', chunk_index: 167, score: 23.9872, text: 'Basis for the Development of State and Local Government Radiological Emergency Response Plans in Support of Light Water Nuclear Power Plants. NRC Spent Fuel Project Office Interim Staff Guidance - 16, Emergency Planning. Regulatory Guide 1.174, Revision 2, "An Approach for Using Probabilistic Risk Assessment in Risk-Informed Decisions on Plant-Specific Changes to the Licensing Basis."' },
    { chunk_id: 170934, doc_id: 'www.nrc.gov/docs/ML2235/ML22357A100.pdf', title: 'Monticello Nuclear Generating Plant and Prairie Island Nuclear Generating Plant - Issuance of Amendments Re: Standard Emergency Plan and Consolidated Emergency Operations Facility', chunk_index: 12, score: 23.8948, text: 'NUREG-0654 provides specific acceptance criteria that the NRC has determined as an acceptable means of complying with the standards in 10 CFR 50.47. These criteria provide a basis for NRC licensees (and applicants), and State and local governments to develop acceptable radiological emergency preparedness plans.' },
  ],
  'spent fuel storage': [
    { chunk_id: 173723, doc_id: 'www.nrc.gov/docs/ML2326/ML23264A803.pdf', title: 'Updated NRC Staff Draft White Paper on Micro-Reactor Licensing and Deployment Considerations - Enclosure', chunk_index: 58, score: 15.6584, text: 'Storage of spent fuel in an ISFSI was not limited to water pool installations. The long-lived radionuclides present in spent fuel are proportional to burnup; but within the limits of expected burnups, this is not a significant factor for spent fuel aged more than one year. The one-year decay stipulation has been retained as this is a basis for the requirements of Part 72.' },
    { chunk_id: 4118, doc_id: 'www.nrc.gov/docs/ML0108/ML010820352.pdf', title: 'NUREG/CR-6716 "Recommendations on Fuel Parameters for Standard Technical Specifications for Spent Fuel Storage Casks"', chunk_index: 77, score: 14.3006, text: 'The U.S. Nuclear Regulatory Commission (NRC) is currently reviewing the technical specifications for spent fuel storage casks in an effort to develop standard technical specifications (STS) that define the allowable spent nuclear fuel (SNF) contents. One of the objectives of the review is to minimize the level of detail in the STS that define the acceptable fuel types.' },
    { chunk_id: 173722, doc_id: 'www.nrc.gov/docs/ML2326/ML23264A803.pdf', title: 'Updated NRC Staff Draft White Paper on Micro-Reactor Licensing and Deployment Considerations - Enclosure', chunk_index: 57, score: 13.825, text: 'ISFSIs licensed under 10 CFR Part 72 are limited to the receipt, transfer, packaging, and possession of power reactor spent fuel to be stored in a complex that is designed and constructed specifically for storage of power reactor spent fuel aged for at least one year, other radioactive materials associated with spent fuel storage.' },
    { chunk_id: 85642, doc_id: 'www.nrc.gov/docs/ML1132/ML11321A182.pdf', title: 'NUREG/CR-7116, SRNL-STI-2011-00005, "Materials Aging Issues and Aging Management for Extended Storage and Transportation of Spent Nuclear Fuel".', chunk_index: 67, score: 13.7664, text: 'Proceedings of the International High-Level Radioactive Waste Management conference. IAEA Nuclear Energy Series, Impact of High Burnup Uranium Oxide and Mixed Uranium-Plutonium Oxide Water Reactor Fuel on Spent Fuel Management. A Comparison of the Isotopic Characteristics of WG-MOX and UOx fuel in Extended Dry Storage.' },
    { chunk_id: 4045, doc_id: 'www.nrc.gov/docs/ML0108/ML010820352.pdf', title: 'NUREG/CR-6716 "Recommendations on Fuel Parameters for Standard Technical Specifications for Spent Fuel Storage Casks"', chunk_index: 4, score: 13.6843, text: 'Recommendations on Fuel Parameters for Standard Technical Specifications for Spent Fuel Storage Casks. This study has been performed to identify potential fuel specification parameters needed for criticality safety and radiation shielding analysis and rank their importance relative to a potential compromise of the margin of safety.' },
    { chunk_id: 25396, doc_id: 'www.nrc.gov/docs/ML0410/ML041040369.pdf', title: 'NAC-UMS, Final Safety Analysis Report for the UMS Universal Storage, Revision 3, Chapter 2.', chunk_index: 10, score: 13.5423, text: 'The Universal Storage System is designed to safely store up to 24 PWR spent fuel assemblies, or up to 56 BWR spent fuel assemblies, contained within a Transportable Storage Canister. On the basis of fuel assembly length and cross-section, the fuel assemblies are grouped into three classes of PWR fuel assemblies and two classes of BWR fuel assemblies.' },
    { chunk_id: 41844, doc_id: 'www.nrc.gov/docs/ML0714/ML071440224.pdf', title: 'Calvert Cliffs, Unit 1, Long-Term Coupon Surveillance Program for Spent Fuel Pool.', chunk_index: 24, score: 13.2321, text: 'Characteristics of the High Flux Isotope Reactor (HFIR) — Design Power: 100 megawatts, Operational Date: September 1966, Fuel Cycle: 23 days, Fuel Enrichment: 93% Uranium-235. Four temporary spent fuel storage pedestals arranged with internal cadmium shielding provide a working zone with a 360° exposure to a full spectrum gamma radiation.' },
    { chunk_id: 4051, doc_id: 'www.nrc.gov/docs/ML0108/ML010820352.pdf', title: 'NUREG/CR-6716 "Recommendations on Fuel Parameters for Standard Technical Specifications for Spent Fuel Storage Casks"', chunk_index: 10, score: 13.2111, text: 'Under the current licensing procedures for spent nuclear fuel (SNF) dry storage casks, vendors must identify all fuel assembly types that may potentially be stored in their casks. The acceptable cask contents are limited to the fuel specifications as detailed in the Technical Specifications. Each time a candidate fuel assembly type falls outside the range identified in the TS, a Part 72 license amendment request must be submitted.' },
    { chunk_id: 34154, doc_id: 'www.nrc.gov/docs/ML0529/ML052990150.pdf', title: 'Catawba, Unit 1, Current Facility Operating License NPF-35, Tech Specs.', chunk_index: 260, score: 12.9921, text: 'Spent Fuel Assembly Storage 3.7.16 — The combination of initial enrichment and burnup of each new or spent fuel assembly stored in the spent fuel pool storage racks shall be within the following configurations: Unrestricted storage (new or irradiated low enriched uranium fuel enriched up to an initial nominal 5.0 wt% U-235); or Restricted storage in accordance with Figure 3.7.16-1.' },
    { chunk_id: 85724, doc_id: 'www.nrc.gov/docs/ML1132/ML11321A182.pdf', title: 'NUREG/CR-7116, SRNL-STI-2011-00005, "Materials Aging Issues and Aging Management for Extended Storage and Transportation of Spent Nuclear Fuel".', chunk_index: 149, score: 12.9817, text: 'SCC of Fuel — Stress corrosion cracking of Zircaloy clad SNF due to the presence of fission product iodine was observed during the 1960s and continued through the early 1980s. This cracking followed reactor power transients, particularly in BWRs. The stress corrosion process was identified as Pellet Cladding Interaction (PCI).' },
  ],
}

const DEMO_FALLBACK: SearchResult[] = [
  { chunk_id: 123563, doc_id: 'www.nrc.gov/docs/ML1622/ML16221A564.pdf', title: 'Written Handouts — Regulatory Compliance Procedures.', chunk_index: 14, score: 20.8424, text: 'Regulatory Compliance personnel are responsible for submitting the completed change in medical status to the NRC in a timely manner. When the revised license is received from the NRC due to an individual\'s Permanent Medical Condition, the Medical Review Officer will notify Operations management.' },
  { chunk_id: 129733, doc_id: 'www.nrc.gov/docs/ML1710/ML17100A480.pdf', title: 'NUREG/BR-0058 DFC, Rev. 5, "Regulatory Analysis Guidelines of the U.S. Nuclear Regulatory Commission"', chunk_index: 207, score: 18.9037, text: 'How will the regulation affect productivity in the nuclear electric utility industries? How will this action affect facility licensing times? How will this action affect the regulatory process within the NRC and other regulatory agencies?' },
  { chunk_id: 9682, doc_id: 'www.nrc.gov/docs/ML0136/ML013620383.pdf', title: 'Browns Ferry Units 1, 2 & 3, License Amendments, Revising Environmental Technical Specifications.', chunk_index: 15, score: 18.4781, text: 'The Environmental Compliance Staff is responsible for independent review and audit of procedures for meeting environmental specifications and limits. The Office of Power Quality Assurance and Audit Staff shall ensure that a periodic audit of the environmental monitoring program is conducted at least once per calendar year.' },
  { chunk_id: 129747, doc_id: 'www.nrc.gov/docs/ML1710/ML17100A480.pdf', title: 'NUREG/BR-0058 DFC, Rev. 5, "Regulatory Analysis Guidelines of the U.S. Nuclear Regulatory Commission"', chunk_index: 221, score: 18.1119, text: '10 CFR Part 50. Code of Federal Regulations, Title 10, Energy, Part 50, "Domestic Licensing of Production and Utilization Facilities." U.S. Nuclear Regulatory Commission. Safety Goals for the Operations of Nuclear Power Plants; Policy Statement.' },
  { chunk_id: 174069, doc_id: 'www.nrc.gov/docs/ML2327/ML23277A139.pdf', title: 'Interim Staff Guidance - DANU-ISG-2022-01, Advanced Reactor Content of Application Project, "Review of Risk-Informed, Technology-Inclusive Advanced Reactor Applications"', chunk_index: 198, score: 17.4401, text: 'Examples Demonstrating Regulatory Compliance, Exemptions, and Rules of Particular Applicability — A regulation generically applicable to non-LWRs and applications will need to include information to demonstrate that the proposed design complies with the regulation in question.' },
  { chunk_id: 163130, doc_id: 'www.nrc.gov/docs/ML2116/ML21165A112.pdf', title: 'SECY-23-0021: Enclosure 3 - Draft Regulatory Analysis', chunk_index: 90, score: 17.1498, text: 'Regulatory Analysis, Circular A-4, Office of Management and Budget, Washington, DC, October 9, 2003.' },
  { chunk_id: 129562, doc_id: 'www.nrc.gov/docs/ML1710/ML17100A480.pdf', title: 'NUREG/BR-0058 DFC, Rev. 5, "Regulatory Analysis Guidelines of the U.S. Nuclear Regulatory Commission"', chunk_index: 36, score: 16.5493, text: 'The statutory mission of the NRC is to ensure that civilian use of nuclear materials in the United States is carried out with proper regard and provisions for protecting public health and safety, property, environmental quality, and the common defense and security.' },
  { chunk_id: 162999, doc_id: 'www.nrc.gov/docs/ML2116/ML21162A104.pdf', title: 'SECY-23-0021: Enclosure 2 - Draft Environmental Assessment', chunk_index: 44, score: 16.3778, text: '10 CFR Part 50 "Domestic Licensing of Production and Utilization Facilities." 10 CFR Part 52 "Licenses, Certifications, and Approvals for Nuclear Power Plants." 10 CFR Part 72 "Licensing Requirements for the Independent Storage of Spent Nuclear Fuel."' },
  { chunk_id: 163001, doc_id: 'www.nrc.gov/docs/ML2116/ML21162A104.pdf', title: 'SECY-23-0021: Enclosure 2 - Draft Environmental Assessment', chunk_index: 46, score: 16.3685, text: 'Risk-Informed, Technology-Inclusive Regulatory Framework for Advanced Reactors. Regulation of Advanced Nuclear Power Plants; Statement of Policy.' },
  { chunk_id: 162751, doc_id: 'www.nrc.gov/docs/ML2116/ML21162A102.pdf', title: 'SECY-23-0021: Enclosure 1 - Proposed Rule Federal Register Notice', chunk_index: 16, score: 16.3048, text: 'Technology-inclusive requirements for physical protection of licensed activities at commercial nuclear plants against radiological sabotage. The NRC has long recognized that the licensing and regulation of a variety of nuclear reactor technologies would present challenges because the existing regulatory framework has evolved primarily to address the LWR designs.' },
]

function getDemoResults(query: string): SearchResult[] {
  const q = query.toLowerCase()
  for (const [key, results] of Object.entries(DEMO_RESULTS)) {
    const keywords = key.split(' ')
    if (keywords.some((kw) => q.includes(kw))) return results
  }
  return DEMO_FALLBACK
}

export default function Probe() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSearch = useCallback(async () => {
    const trimmed = query.trim()
    if (!trimmed) return

    setLoading(true)
    setHasSearched(true)
    setError(null)

    if (USE_DEMO) {
      await new Promise((r) => setTimeout(r, 800))
      setResults(getDemoResults(trimmed))
      setLoading(false)
      return
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed, top_k: 10 }),
      })
      if (!res.ok) throw new Error(`API returned ${res.status}`)
      const data: SearchResult[] = await res.json()
      setResults(data)
    } catch (err) {
      console.error('Search API error:', err)
      setError(
        err instanceof TypeError
          ? 'Unable to reach the search API. This is likely a CORS issue — the API server may need to allow requests from this origin.'
          : `Search failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
      )
      setResults(getDemoResults(trimmed))
    } finally {
      setLoading(false)
    }
  }, [query])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSearch()
    },
    [handleSearch],
  )

  const centered = !hasSearched

  return (
    <section className="min-h-[calc(100vh-60px)] flex flex-col">
      {/* Search area */}
      <motion.div
        layout
        className={`w-full flex flex-col items-center px-6 md:px-12 lg:px-24 xl:px-32 ${
          centered ? 'flex-1 justify-center' : 'pt-16 pb-8'
        }`}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.p
          layout
          className={`font-serif tracking-[-0.02em] text-ink mb-8 text-center ${
            centered
              ? 'text-2xl md:text-3xl lg:text-4xl font-medium leading-[1.15]'
              : 'text-lg md:text-xl font-medium leading-[1.3]'
          }`}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          Every NRC document, one query away.
        </motion.p>

        <motion.div
          layout
          className="w-full max-w-2xl"
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative flex items-center">
            <div className="absolute left-4 text-ink/30">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search NRC documents..."
              className="w-full h-14 pl-12 pr-44 rounded-xl border border-ink/15 bg-white font-mono text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink/40 focus:ring-1 focus:ring-ink/10 transition-all shadow-sm"
            />
            <button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="absolute right-2 h-10 w-[8.5rem] flex items-center justify-center rounded-lg bg-ink text-white font-mono text-xs tracking-[0.15em] uppercase transition-all hover:bg-ink/85 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-20" />
                    <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Searching
                </span>
              ) : (
                'Search'
              )}
            </button>
          </div>
        </motion.div>

        {centered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex flex-col items-center gap-4"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-ink/35">Powered by</span>
              <span className="font-mono text-xs font-semibold text-ink/70">helion-512</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="font-mono text-xl font-semibold text-ink tabular-nums">0.97</p>
                <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/35">NDCG@10</p>
              </div>
              <div className="w-px h-8 bg-ink/10" />
              <div className="text-center">
                <p className="font-mono text-xl font-semibold text-ink tabular-nums">0.93</p>
                <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/35">Precision@1</p>
              </div>
            </div>

            <p className="font-mono text-[11px] text-ink/30 text-center max-w-md">
              State-of-the-art on{' '}
              <Link to="/blog/fermibench-sota" className="border-b border-ink/20 hover:text-ink/50 hover:border-ink/40 transition-colors">
                FermiBench
              </Link>
              , the only published IR benchmark for the nuclear domain
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Results area */}
      <AnimatePresence>
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex-1 px-6 md:px-12 lg:px-24 xl:px-32 pb-24"
          >
            {error && (
              <div className="max-w-3xl mx-auto mb-4 rounded-lg border border-amber-200 bg-amber-50/60 px-4 py-3 flex items-start gap-3">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 flex-shrink-0 text-amber-600">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M8 4.5v4M8 10.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                <div>
                  <p className="font-mono text-xs text-amber-800">{error}</p>
                  <p className="font-mono text-[11px] text-amber-600/70 mt-1">Showing demo results below.</p>
                </div>
              </div>
            )}
            {loading ? (
              <div className="max-w-3xl mx-auto space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="rounded-lg border border-ink/[0.08] p-5 animate-pulse">
                    <div className="h-3 w-1/3 bg-ink/[0.06] rounded mb-3" />
                    <div className="h-4 w-3/4 bg-ink/[0.06] rounded mb-4" />
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-ink/[0.04] rounded" />
                      <div className="h-3 w-5/6 bg-ink/[0.04] rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="max-w-3xl mx-auto">
                <p className="font-mono text-xs text-ink/40 mb-6">
                  {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
                </p>
                <div className="space-y-4">
                  {results.map((result, i) => (
                    <motion.div
                      key={result.chunk_id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: i * 0.06 }}
                    >
                      <ResultCard result={result} />
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto text-center py-16">
                <p className="font-mono text-sm text-ink/40">No results found.</p>
                <p className="font-mono text-xs text-ink/25 mt-1">Try a different query or broader terms.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function ResultCard({ result }: { result: SearchResult }) {
  const [expanded, setExpanded] = useState(false)
  const nrcUrl = `https://${result.doc_id}`
  const displayText = expanded ? result.text : result.text.slice(0, 280)
  const needsTruncation = result.text.length > 280

  return (
    <div className="group rounded-lg border border-ink/[0.08] bg-white p-5 md:p-6 transition-colors hover:border-ink/[0.14]">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/40">
            NRC Document
          </span>
          <span className="font-mono text-[10px] text-ink/25">·</span>
          <span className="font-mono text-[10px] text-ink/30">
            Relevance {result.score.toFixed(1)}
          </span>
        </div>
      </div>

      <h3 className="font-serif text-base md:text-lg font-medium leading-snug text-ink mb-3">
        {result.title}
      </h3>

      <p className="font-mono text-sm leading-relaxed text-ink/60 mb-4">
        {displayText}
        {needsTruncation && !expanded && '...'}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a
            href={nrcUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-ink/50 hover:text-ink transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M5 1H2.5A1.5 1.5 0 001 2.5v7A1.5 1.5 0 002.5 11h7A1.5 1.5 0 0011 9.5V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M7 1h4v4M11 1L5.5 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            View source
          </a>
          {needsTruncation && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="font-mono text-xs text-ink/40 hover:text-ink/70 transition-colors"
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
        <span className="font-mono text-[10px] text-ink/20">
          chunk {result.chunk_index}
        </span>
      </div>
    </div>
  )
}
