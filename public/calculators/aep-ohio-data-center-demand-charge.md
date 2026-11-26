# AEP Ohio data center demand charge calculator

[Open the interactive calculator](https://invariant-ai.com/calculators/aep-ohio-data-center-demand-charge).

Estimate billing demand and the base distribution and customer subtotal for one energized Ohio Power Schedule DCT New Load contract at primary or secondary service voltage.

## How to calculate monthly billing demand

- During the load ramp, use the greater of the metered peak and 85% of the ramp capacity agreed for that billing month.
- After the ramp, use the greatest of the metered peak, 85% of the highest billed demand from the prior 11 months, and the contract-tier minimum.
- From 25,001 through 75,000 kW of contract capacity, the contract-tier minimum is 15,000 kW plus 85% of capacity above 25,000 kW. Above 75,000 kW, use 57,500 kW plus capacity above 75,000 kW, capped at 85% of total contract capacity.
- At primary voltage, multiply billing demand in kW by $8.08 and add the $186.30 monthly customer charge. At secondary voltage, use $9.05 per kW and a $21.00 customer charge.

## Worked 100 MW examples

A primary-voltage customer with a 100 MW contract, a 65 MW metered peak after ramp-up and a 100 MW prior billed peak is billed at 85 MW. The 11-month lookback produces 85 MW and the contract-tier floor produces 82.5 MW. The base subtotal is $686,986.30, including the customer charge. The distribution charge is $161,600 above what the 65 MW meter reading alone would produce.

During the ramp, a 50 MW agreed monthly capacity and a 35 MW peak produce 42.5 MW of billed demand. At primary voltage, that is a base subtotal of $343,586.30.

Budget energy supply, transmission and other riders, applicable reactive demand charges, and taxes separately. Confirm the contract and service voltage with Ohio Power. Affiliated loads and contracts that have yet to energize have separate rules.

- [Ohio Power November 2026 tariff book, Sheet 223-3 rates](https://www.aepohio.com/lib/docs/ratesandtariffs/Ohio/November_2026_Ohio_Power_Tariff_Book.pdf#page=115)
- [Ohio Power November 2026 tariff book, Sheet 223-4 demand floors](https://www.aepohio.com/lib/docs/ratesandtariffs/Ohio/November_2026_Ohio_Power_Tariff_Book.pdf#page=116)
- [Worked AEP Ohio tariff example across 13 months](https://invariant-ai.com/blog/aep-ohio-data-center-tariff-minimum-demand)
- [Download the offline replay, editable inputs, CSV, and checksums](https://github.com/in-variant/invariant-website/releases/tag/aep-ohio-dct-replay-v1.0.0)
- [Compare the Dominion Virginia GS-5 billing components](https://invariant-ai.com/blog/dominion-virginia-gs5-data-center-tariff)
