# Commercial real estate DSCR and debt yield calculator

[Open the interactive calculator](https://invariant-ai.com/calculators/dscr-debt-yield).

Compare two annual debt payment schedules on the same commercial property or pool of properties. Use the same annual net operating income (NOI) and loan principal in both cases. Enter your lender’s minimum debt-service coverage ratio (DSCR) and debt yield to see the income that would meet both targets.

## Formulas

| Result | Calculation |
| --- | --- |
| Debt-service coverage ratio | Annual NOI ÷ annual debt service |
| Debt yield | Annual NOI ÷ loan principal × 100% |
| Minimum annual NOI for both targets | The greater of annual debt service × minimum DSCR and loan principal × minimum debt yield as a decimal |
| Annual debt service supported by DSCR | Annual NOI ÷ minimum DSCR, with zero supported when NOI is zero or negative |
| Loan principal supported by debt yield | Annual NOI ÷ minimum debt yield as a decimal, with zero supported when NOI is zero or negative |

Keep annual payments and annual income on the same basis. Verify lender adjustments to income, whether the payment includes principal, and which properties and loan notes the figures represent.

## What happens when interest-only payments end?

In this illustrative case, annual NOI is $600,000 and the loan principal is $6 million. The minimum DSCR is 1.25× and the minimum debt yield is 9%.

| Result | $420,000 interest-only schedule | $540,000 schedule with principal |
| --- | ---: | ---: |
| DSCR | 1.429× | 1.111× |
| Debt yield | 10.0% | 10.0% |
| Minimum annual NOI for both targets | $540,000 | $675,000 |
| Annual NOI shortfall | $0 | $75,000 |

The target DSCR supports $480,000 in annual debt service at the entered income. The debt-yield test supports about $6.67 million of principal. Loan-to-value, payment structure, and other lender requirements can constrain loan proceeds separately.

## Where to verify the inputs

- [OCC Commercial Real Estate Lending handbook, printed page 43](https://www.occ.treas.gov/publications-and-resources/publications/comptrollers-handbook/files/commercial-real-estate-lending/pub-ch-commercial-real-estate.pdf#page=47)
- [Compare NOI and net cash flow reported against the same debt service in a CMBS filing](https://invariant-ai.com/blog/cmbs-dscr-noi-by-property#compare-noi-and-ncf)
- [Calculate a commercial refinance gap and compare DSCR, debt yield, and LTV](https://invariant-ai.com/calculators/commercial-refinance-gap)
