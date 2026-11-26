# Data center power capacity calculator

[Open the calculator](https://invariant-ai.com/calculators/data-center-power-capacity)

Convert IT load to facility MW. Compare on-site and utility power during normal operation, a generator trip, and loss of grid service. Estimate how long a battery can cover the selected shortfall.

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
| Net generation in normal conditions | 660 MW |
| Net generation after a trip and ramp | 550 MW |
| Constant outage shortfall | 50 MW |
| Battery discharge power required | 50 MW |
| Usable battery energy for 30 minutes | 25 MWh |

Use deliverable AC power and energy at the intake under the expected temperature and state of charge. The calculation assumes a constant shortfall. Check the initial trip, generator ramp, cooling load, reserves, and battery recharge separately. Identify what supplies the load when the battery is depleted.

- [Read the behind-the-meter power guide](https://invariant-ai.com/blog/behind-the-meter-power-for-data-centers#size-battery-for-islanded-campus)
- [PNNL report on power systems and transient modeling for large data centers](https://www.energy.gov/sites/default/files/2026-01/Data_Center_EMT_Models.pdf)
- [U.S. Department of Energy on grid-connected and islanded microgrids](https://www.energy.gov/oe/microgrid-systems)
