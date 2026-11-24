# Data center power capacity calculator

[Open the calculator](https://invariant-ai.com/calculators/data-center-power-capacity)

Convert IT load to facility MW, check net power during an outage, and estimate how long a battery can cover a constant shortfall.

## Method

1. Multiply IT load by the facility-to-IT power ratio at the design condition. This estimates the facility load at the intake, including cooling and electrical losses.
2. Subtract facility demand from the net power at the intake in each case. A negative margin is a shortfall.
3. The battery must deliver at least the shortfall in MW at that intake. Multiply the shortfall by the number of hours it must cover to find the usable MWh required. Divide usable MWh by the shortfall in MW to estimate runtime in hours.

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
