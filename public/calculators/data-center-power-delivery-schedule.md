# Data center power delivery schedule calculator

[Open the calculator](https://invariant-ai.com/calculators/data-center-power-delivery-schedule)

Work back from your opening date to the latest date you need power. Compare the proposed service date and facility megawatts for each phase.

## Method

1. Subtract the calendar days for commissioning and schedule buffer from the target opening date. The result is the latest date you need power.
2. Add the same days to the reported service date to estimate opening. Compare that date with the target.
3. Compare reported service MW with required facility MW at the meter. Record the total for each phase.

## Illustrative example

| Phase | Facility demand | Target opening | Commissioning and buffer | Reported service | Latest date power is needed | Estimated opening |
| --- | ---: | --- | ---: | --- | --- | --- |
| First phase | 40 MW | June 30, 2028 | 45 calendar days | 50 MW on June 15, 2028 | May 16, 2028 | July 30, 2028 |
| Full buildout | 80 MW | June 30, 2030 | 60 calendar days | Unknown | May 1, 2030 | Unknown |

In the first phase, reported power exceeds demand by 10 MW and the estimated opening is 30 days late. The full buildout still needs a reported service date and MW.

Use the service date and MW from the same documented milestone. Check what the serving utility can provide and when. Check customer construction, permits, and commissioning against their own schedules as well.

- [Download the data center site selection checklist](https://invariant-ai.com/blog/data-center-site-selection-checklist)
- [Review utility letters, studies, and agreements](https://invariant-ai.com/blog/utility-will-serve-letter-load-study-esa)
- [DOE guidance on commissioning](https://betterbuildingssolutioncenter.energy.gov/sites/default/files/Acheiving%20Data%20Center%20Cost%20Savings%20Through%20Renewable%20Energy.pdf)
