# Validation plan and judge Q&A

This is a preparation sheet, not evidence of traction. As of 24 September 2026, the team has **no verified merchant interviews, pilots, active merchants, orders, signups, or paying customers** to cite. The current build and the proposed full product should be described separately.

## The claim to prove

Rentify aims to give a Cambodian retailer one operating place for a personal storefront, the shared marketplace, and counter sales through POS. One Store owns the product catalog, prices, stock, and orders. The business hypothesis is that this saves merchant work while opening another sales channel at an acceptable cost. A product feature diagram alone does not prove this outcome.

## First 10 pilot merchants

Recruit small retailers who already sell online and at a physical counter. Start with founder visits to shops and introductions from merchant networks; these are proposed channels to test, not established acquisition channels. Seek variety in product type, order volume, and technical comfort. Record the recruitment source and selection criteria so results are not presented as representative of all Cambodian businesses.

1. Observe each merchant's current process for adding a product, changing a price, selling at the counter, and handling an online order. Record the time spent and any stock mismatches without assuming they exist.
2. Help the merchant create a Store and use each available Rentify channel. Label any simulated or incomplete cross-channel step; do not count it as a completed feature.
3. Run a set of test sales across channels and compare product, price, stock, and order records against the expected state. Log failures and fixes.
4. Let merchants use the product during a defined pilot period. Track weekly active merchants, successful orders, support contacts, and repeat use. Distinguish test orders from customer orders.
5. Test willingness to pay for the storefront/POS subscription separately from willingness to accept a marketplace commission. Ask about actual trade-offs and alternatives, not just whether a proposed price sounds reasonable.
6. Compare at least a few tasks side by side against the closest available alternative, especially Khmum, using the same merchant and task definitions.

**Pilot decision gate:** publish the sample size, time period, task completion rate, stock accuracy, usage, and merchant feedback before claiming validation. Set numerical pass thresholds with the team before the pilot starts; otherwise results are easy to reinterpret after seeing them.

## Likely judge questions

| Question | Honest, concise answer | Evidence to bring next time |
| --- | --- | --- |
| What is unique if Khmum also has marketplace and POS? | Khmum is a real local benchmark. Our proposed advantage is a simpler, affordable flow across a branded storefront, shared discovery, and counter sales with one catalog. We will measure setup time, stock accuracy, merchant effort, and cost in pilots. | Same-task merchant comparison. |
| Why would a seller use Rentify instead of Khmer24 or social media? | They may continue using those channels. Rentify offers an owned storefront and a shared marketplace connected to operating tools. We need to show that this saves enough work or generates enough orders to justify adoption. | Merchant workflow interviews and acquisition results. |
| What is built today? | The development build contains Store-based merchant operations, catalog, hosted storefront templates, marketplace pilot UI, and POS modules. The full channel integration and production payment flow still need completion and validation. | A stable walkthrough of the exact working flow, plus a build-status checklist. |
| Do you have customers or revenue? | Not yet verified. Our next milestone is ten pilot retailers. | Signed pilot consent, dated usage and order records, paid invoices if earned. |
| How do you make money? | A subscription for a merchant's storefront/POS tools and a commission on orders sourced through the shared marketplace. Rates are hypotheses until merchant and cost testing. | Price interviews, payment and settlement design, cohort economics. |
| What is your market size? | The Ministry of Commerce reported US$1.51 billion in Cambodian e-commerce value in 2024; the 2022 Economic Census counted 753,670 establishments. These are context, not Rentify's TAM. We will size eligible retailers and their expected software spend and marketplace sales from the bottom up. | Eligible merchant count by launch geography, expected GMV, reachable adoption. |
| Can you keep stock synchronized? | That is the key product behavior to demonstrate and test. Existing code has shared Store-centered catalog and commerce modules; the end-to-end experience must be verified under real merchant tasks and failures. | Cross-channel sale logs, inventory reconciliation, failure tests. |
| Why subscription *and* commission? | The subscription pays for an operating tool the merchant controls. Commission applies when Rentify's shared marketplace creates a sale. We will test whether merchants see these as distinct sources of value. | Separate willingness-to-pay and take-rate acceptance results. |
| What about payments, returns, and settlement? | These are part of the final business and operational design. Payment partners, refunds, seller settlement, and compliance need validation before a production claim. | Partner terms, reconciliation process, legal and operational review. |
| What do you need from UniPreneur? | Introductions to ten suitable pilot retailers and mentors who can challenge our merchant workflow and business economics. | A list of targeted merchant profiles, outreach plan, and pilot calendar. |

## Four fit questions from the workshop

- **Market–product:** Does the retailer feel the stock/order fragmentation strongly enough to change workflow?
- **Product–channel:** Can the team reach and onboard these merchants through a repeatable channel at a reasonable cost?
- **Channel–model:** Do storefront/POS subscription and marketplace commission align with how merchants obtain value?
- **Model–market:** Can the addressable merchant base, adoption rate, transaction volume, and costs support a durable business?

These are test questions, not current achievements.

## Financial model inputs before presenting a three-year forecast

Build the forecast only after documenting merchant acquisition by channel, activation, churn, subscription price and collection rate, marketplace GMV per active merchant, take rate, refunds, payment fees, support cost, cloud cost, and staffing. Show a base case plus sensitivity to adoption and order volume. The appendix's US$1,400 monthly gross revenue calculation is **illustrative arithmetic**, not an approved price, forecast, or profit figure.

## Pitch claim checklist

- Can we show dated evidence for every traction number?
- Are screenshots labeled as development build where appropriate?
- Are market figures paired with source, year, and definition?
- Is the 2025 market figure labeled as a projection if used?
- Are pricing and take-rate examples labeled as hypotheses?
- Do we acknowledge Khmum's overlapping public offer?
- Is the requested support specific and feasible?

See [research.md](research.md) for source links and [demo-runbook.md](demo-runbook.md) for presentation-day steps.

## Additional questions for v5 rehearsal

| Question | Answer to rehearse |
| --- | --- |
| How do you start a marketplace without buyers? | Begin with ten merchants who already have customers. Test store links and social posts as the first acquisition routes, and measure marketplace orders separately from direct-store orders. Broader discovery must be earned after this first group uses the system. |
| Why would merchants bring customers and also pay commission? | Their subscription supports their own selling tools. Commission is tied to marketplace orders. We must make channel attribution clear and test which rates merchants accept for each source of value. |
| Will merchants bypass your marketplace? | That is a business risk. Direct selling is already part of our storefront proposition. Marketplace commission is sustainable only if buyers and sellers value the marketplace transaction enough to use it. Track repeat completed orders and reasons for off-platform contact. |
| Who handles fulfillment and disputes? | The proposed starting model is merchant fulfillment, with clearly defined order status, support, cancellation and refund responsibilities. We have no verified delivery partnership or production dispute process to announce. |
| When will you break even? | We do not have a defensible break-even date yet. The appendix shows revenue mechanics; break-even depends on measured support, payment, acquisition, hosting and staffing costs as well as retained paying merchants. |
| Is the POS image a live transaction? | It is the POS product preview from our marketing site. We also opened the development POS interface, but the screenshot does not prove a submitted sale or cross-channel stock update. |

Answer the question in the first sentence, give one supporting point, then stop. Keep most answers to 20-30 seconds. Use the product lead for implementation and business lead for economics if team handoffs are permitted. Never substitute a long feature tour for a direct answer.
