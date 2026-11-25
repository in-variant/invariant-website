# Data center water use calculator

[Open the interactive calculator](https://invariant-ai.com/calculators/data-center-water-use).

Estimate annual on-site water and average daily US gallons from IT load and site water usage effectiveness (WUE). You can also calculate WUE from measured annual water and IT energy. Use figures for the same facility and reporting period.

## Calculation

1. Multiply average IT load in MW by the hours in the reporting year and by 1,000 to get annual IT equipment energy in kWh. You can enter annual IT energy in GWh directly. One GWh equals one million kWh.
2. Multiply IT kWh by site WUE in liters per kWh to estimate annual on-site liters. For measured WUE, divide annual on-site liters by annual IT kWh.
3. Divide liters by 3.785411784 to convert to US gallons, then divide the annual gallons by the number of days in the reporting year to get the daily average.

## How much water does a 100 MW data center use?

In an illustrative 365-day year, 100 MW of average IT load uses 876 GWh. At a site WUE of 0.6 liters per kWh, that is 525.6 million liters or about 138.85 million US gallons for the year. The daily average is about 380,408 US gallons. If your 100 MW number describes utility service or rated capacity, get the annual IT equipment energy from the design or meters first.

## What to confirm with a water utility

Use the cooling design’s maximum-day and peak-hour flows for service planning. Break them out by source and project phase. Confirm pressure, usable storage, backup supply and the conditions for discharge. Separate delivered, consumed and discharged volumes so the WUE calculation follows the chosen water reporting basis. Site WUE covers on-site water. Use a separate calculation for water used to produce power off-site.

For the proposed Pittsburg Data Hub, California Energy Commission staff estimated 58,407 gallons per day of average recycled-water demand in October 2025. Domestic water and sewer demand were separate rows in the project’s water balance. [Pittsburg Initial Study, tables 3-2 through 3-4](https://efiling.energy.ca.gov/GetDocument.aspx?DocumentContentId=103633&tn=266581#page=30)

- [Review data center water and stormwater permits](https://invariant-ai.com/blog/data-center-water-stormwater-permits)
- [Verify water service at the parcel](https://invariant-ai.com/blog/water-sewer-data-apis-site-selection)
- [Department of Energy WUE formula](https://www.energy.gov/cmei/femp/cooling-water-efficiency-opportunities-federal-data-centers)
- [USGS water use definitions](https://water.usgs.gov/water-basics_glossary.html)
- [NIST unit conversion factors](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9)
