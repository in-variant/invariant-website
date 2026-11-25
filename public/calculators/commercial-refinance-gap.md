# Commercial real estate refinance gap calculator

[Open the interactive calculator](https://invariant-ai.com/calculators/commercial-refinance-gap).

Use one proposed fixed-rate loan, a dated payoff amount, and the same collateral for annual underwritten net operating income (NOI) and property value. The refinance gap is the cash needed after applying modeled new loan proceeds to the payoff and closing costs.

## Calculate the loan limits

- Loan-to-value (LTV) limit = property value × maximum LTV.
- Debt-service coverage ratio (DSCR) limit = annual NOI ÷ minimum DSCR ÷ annual debt service per dollar of principal.
- Debt yield limit = annual NOI ÷ minimum debt yield. Omit this limit when the lender does not impose it.
- For an amortizing loan, annual debt service per dollar equals 12 times the monthly payment per dollar. With monthly rate r and n monthly payments, that monthly payment is r ÷ [1 − (1 + r) to the power of −n]. At zero interest, it is 1 ÷ n. For interest-only debt service, use the annual interest rate as the annual debt service per dollar.
- Use the lowest applicable limit. Multiply it by one minus the new-loan fee rate, then subtract other costs and the payoff. A negative result gives the cash needed at closing.

## Calculate the income and value that would cover closing

Divide the payoff plus other costs by one minus the new-loan fee rate to find the gross loan required. Divide that amount by maximum LTV for the minimum property value. For the minimum annual NOI, multiply the gross loan by the larger of the minimum debt yield and the minimum DSCR times the annual debt service per dollar.

## Worked example

Assume a $6 million payoff, $600,000 annual NOI, a $9 million property value, a 7% rate, and a 25-year amortization. Set maximum LTV to 65%, minimum DSCR to 1.25×, minimum debt yield to 10%, the new-loan fee to 1%, and other costs to $25,000.

The maximum loan is $5,659,476 using the DSCR constraint. LTV supports $5,850,000 and debt yield supports $6,000,000. Estimated closing costs of $81,595 leave $5,577,881 for the payoff, so about $422,119 in cash is needed. At 8% with the same other inputs, the gap is about $894,245.

At 7%, the gross loan needed is $6,085,859, which requires both about $645,204 of annual NOI and a $9,362,859 property value at the example terms. These are illustrative figures, rounded to the nearest dollar.

## Check the underlying records

Use a dated closing payoff that accounts for accrued interest and applicable exit costs. Allow for lender-required reserves and use the payment basis the lender underwrites. A reported CMBS balance can describe one note or a whole loan, and an NOI observation may describe multiple properties. Confirm the loan and property scope before using them in the same calculation.

- [OCC Commercial Real Estate Lending handbook, printed pages 43–44](https://www.occ.gov/publications-and-resources/publications/comptrollers-handbook/files/commercial-real-estate-lending/pub-ch-commercial-real-estate.pdf#page=47)
- [OCC guidance on commercial refinance risk](https://www.occ.gov/news-issuances/bulletins/2024/bulletin-2024-29.html)
- [Verify property and loan financials in SEC filings](https://invariant-ai.com/blog/cmbs-dscr-noi-by-property)
- [Check the last signed change to mortgage maturity](https://invariant-ai.com/blog/commercial-mortgage-maturity-data-apis)
