# Data center power capacity calculator

[Open the calculator](https://invariant-ai.com/calculators/data-center-power-capacity)

Convert IT load to facility MW. Compare on-site and utility power during normal operation, a generator trip, and loss of grid service. Estimate battery runtime at a steady shortfall or size the battery for generator recovery.

## Method

1. Multiply IT load by the facility-to-IT power ratio at the design condition. This estimates the facility load at the intake, including cooling and electrical losses.
2. Subtract facility demand from the net power at the intake in each case. A negative margin is a shortfall.
3. The battery must deliver at least the shortfall in MW at that intake. Multiply the shortfall by the number of hours it must cover to find the usable MWh required. Divide usable MWh by the shortfall in MW to estimate runtime in hours.

## Illustrative 50 MW IT case with on-site generation and utility imports

At a 1.25 design ratio, a 50 MW IT phase needs 62.5 MW at the facility intake. Use net on-site power and utility imports measured at that same point. During a generator trip, count only imports available under the utility's written terms. During loss of grid service, count only power the site can deliver in island mode and set utility imports to zero.

| Case | Net on-site MW | Usable utility MW | Margin at the intake |
| --- | ---: | ---: | ---: |
| Normal operation | 50 | 20 | 7.5 MW spare |
| Generator trip | 40 | 20 | 2.5 MW short |
| Loss of grid service | 50 | 0 | 12.5 MW short |

The generator-trip case needs at least 22.5 MW of imports after the trip to cover the full load without a battery. A 15-minute bridge in that case needs at least 2.5 MW and 0.625 usable MWh. The same 15 minutes during the grid outage needs at least 12.5 MW and 3.125 usable MWh. Enter zero islanded output when the site has no island-capable generation and leave it unknown when the design has yet to establish a value.

## Illustrative 500 MW IT case

| Input or result | Amount |
| --- | ---: |
| IT load | 500 MW |
| Facility-to-IT design ratio | 1.20 |
| Facility demand | 600 MW |
| Normal net generation available | 660 MW |
| Net generation immediately after the trip | 500 MW |
| Net generation after a five-minute linear recovery | 550 MW |
| Initial and settled shortfall | 100 MW and 50 MW |
| Usable energy during the five-minute recovery | 6.25 MWh |
| Usable energy during the next 30 minutes | 25 MWh |
| Peak discharge power and total usable energy | 100 MW and 31.25 MWh |

Six units deliver 100 MW each before the trip. When one trips, five remain. In the example, the five ramp from a combined 500 MW to 550 MW. During that period, the average deficit is (100 MW + 50 MW) ÷ 2, or 75 MW. At five minutes, that is 75 × 5 ÷ 60 = 6.25 MWh. Add 50 × 30 ÷ 60 = 25 MWh for the remaining 30 minutes. The controls take the total outage duration of 35 minutes.

Use deliverable AC power and energy at the intake under the expected temperature and state of charge. Use supplier response curves and load profiles for engineering. Check the initial trip, switching, cooling, reserves and recharge. Identify what supplies the load when the battery is depleted.

- [Read the behind-the-meter power guide](https://invariant-ai.com/blog/behind-the-meter-power-for-data-centers#size-battery-for-islanded-campus)
- [PNNL report on power systems and transient modeling for large data centers](https://www.energy.gov/sites/default/files/2026-01/Data_Center_EMT_Models.pdf)
- [U.S. Department of Energy on grid-connected and islanded microgrids](https://www.energy.gov/oe/microgrid-systems)
