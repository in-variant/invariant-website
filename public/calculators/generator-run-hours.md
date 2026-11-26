# Backup generator run-hour calculator

Estimate how a planned generator run changes rolling 12-month engine-hours for a permit group and an individual engine.

[Open the calculator](https://invariant-ai.com/calculators/generator-run-hours) · [Download a blank generator run log (CSV)](https://invariant-ai.com/blog/generator-run-hours-log.csv)

## Calculate a rolling 12-month total

1. Check the permit condition for the named group and the condition for the selected engine. Count the hours specified by each condition.
2. Choose the reporting month of the proposed run. Sum the 11 full months before it and the hours already logged in the reporting month. Use zero only when the records support it.
3. When all scheduled engines belong to that group and run for the same duration within one month, multiply the number of engines by the duration in hours to get the added group engine-hours. Each scheduled engine adds its own duration in hours.
4. Add the proposed hours to each ledger. The difference between the entered limit and the projected total shows the hours below the limit, at the limit or above the limit. Repeat the individual check for every affected engine.

Allocate metered hours to each reporting month if a run crosses a month boundary. Evaluate applicable use restrictions, calendar-year allowances and other permit conditions separately.

## Worked example from a Virginia permit

Conditions 7 and 8 of Virginia DEQ's March 14, 2025 Digital Loudoun Title V permit NRO-73670 cap a group of 21 listed generators at 1,100 combined engine-hours and any one engine at 500 hours. Both windows are 12 consecutive months, calculated monthly. [Issued permit, printed pages 16–17](https://www.deq.virginia.gov/home/showpublisheddocument/25746/638778906125130000#page=16)

In an illustrative November scenario, all 21 engines run for two hours each and add 42 group engine-hours.

| Ledger | Prior 11 months | November to date | Added by run | Projected total | Entered limit | Difference |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Permit group (engine-hours) | 1,050 | 30 | 42 | 1,122 | 1,100 | 22 above |
| One engine (hours) | 38 | 1 | 2 | 41 | 500 | 459 below |

Pre-run totals are illustrative. The Virginia permit supplies the example limits.

## Keep the run record

Use one row per engine per run. Record the meter readings, purpose, time with UTC offset, equipment and group IDs, and the hours counted under the relevant conditions and federal category. For a run that crosses a reporting boundary, use the same run ID on one row per month and record only the hours allocated to that month. Keep the underlying run record and the permit revision used for the review.

[Read the backup generator permit guide](https://invariant-ai.com/blog/data-center-backup-generator-air-permits) · [EPA air permitting resources for data centers](https://www.epa.gov/stationary-sources-air-pollution/clean-air-act-resources-data-centers)
