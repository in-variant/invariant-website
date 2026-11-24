# Battery storage recharge calculator

[Open the interactive calculator](https://invariant-ai.com/calculators/battery-recharge-window).

Check whether a grid-scale battery can recharge from empty before its next dispatch. Enter the MW available to the battery in each of up to two nonoverlapping charging windows, usable export MWh, AC round-trip efficiency, target export MW and hours, and maximum export MW. Use power and energy measured at the grid connection.

## Calculation

1. Multiply the MW available to the battery by the hours in each charging window. Add those amounts to get the grid energy available for charging in MWh.
2. Multiply grid energy by AC round-trip efficiency as a decimal. Cap the result at the battery’s usable export energy.
3. Multiply target export MW by dispatch hours to get the target MWh. Divide the target MWh by efficiency to get the grid energy needed from empty.
4. Compare usable export energy with target MWh and maximum export MW with target MW. When the site can export at the target rate, divide available MWh by target MW to estimate runtime at that rate.

## Example with a 50 MW charging limit

A four-hour dispatch at 100 MW needs 400 MWh. Eight hours at 50 MW supplies 400 MWh of grid input. At 90% efficiency, the battery can export 360 MWh, sustaining 100 MW for 3.6 hours. The shortfall is 40 MWh.

The dispatch requires about 444.44 MWh of grid input, or 8 hours and 53 minutes at 50 MW. Add one more hour at 50 MW, or two hours at 25 MW, and the available energy reaches the 400 MWh usable limit. An export cap of 90 MW still rules out the 100 MW dispatch.

## Choose the inputs

Use the lower of the charging equipment limit and the import allowance after other site loads. Use the lower of the discharge equipment limit and permitted grid export. For example, PJM studied 3.6 MW of charging load and 3 MW of injection for Deka Road. Get the applicable charging hours and power limits from the study or agreement for your connection. [PJM Deka Road study](https://www.pjm.com/pjmfiles/pub/planning/project-queues/feas_docs/w3093_fea.pdf#page=2)

This screen uses constant power within each window, fixed AC round-trip losses, and one charge before one dispatch within 24 hours. Use usable energy at the applicable age and temperature. For repeated operation, model ramping, auxiliary loads, changing efficiency and state of charge across cycles. [EIA explanation of battery duration](https://www.eia.gov/todayinenergy/detail.php?id=51798)

[Compare battery interconnection studies and siting inputs](https://invariant-ai.com/blog/battery-storage-site-interconnection).
