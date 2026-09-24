# Rentify pitch script and slide guide

Current deck: `output/Rentify_UniPreneur_Pitch_v5.pptx`. Present slides 1-9. Slides 10-13 support Q&A.

The 559-word script targets **4:45**, leaving 15 seconds inside the five-minute limit. These are pacing targets, not a measured rehearsal. Use one lead presenter and time the complete delivery aloud.

| Slide | Topic | Target | Finish by |
| --- | --- | --- | --- |
| 1 | Rentify | 20 sec | 0:20 |
| 2 | One sale can leave three records out of step | 35 sec | 0:55 |
| 3 | One catalog connects every sale | 40 sec | 1:35 |
| 4 | The storefront, marketplace and POS experience | 35 sec | 2:10 |
| 5 | Target retailers sell online and in person | 25 sec | 2:35 |
| 6 | Where Rentify competes | 35 sec | 3:10 |
| 7 | Two ways Rentify earns revenue | 30 sec | 3:40 |
| 8 | Our launch plan: 10 retailers and their buyers | 40 sec | 4:20 |
| 9 | The team behind Rentify | 25 sec | 4:45 |

## 1. Rentify

**Say (20 seconds):**

Rentify gives Cambodian merchants one place to manage their selling, with three ways to reach customers: their own storefront, our shared marketplace, and a point of sale at the counter. One catalog connects the business behind all three.

**Evidence and Q&A:**

Full product direction confirmed by the user. Do not imply that all shared transaction behavior is production ready.

## 2. One sale can leave three records out of step

**Say (35 seconds):**

Imagine a small shop that also sells online. The last item sells at the counter, but the online listing still says it is available. Now the owner has to update stock, find the order, and explain the mistake to a customer. This is the problem we want to solve: selling in more places should not mean maintaining more separate records. We will test how often this happens with our first merchant pilots.

**Evidence and Q&A:**

Illustrative scenario. The shopkeeper image is AI-generated, not an interviewed merchant. No interviews or measured problem frequency are verified.

## 3. One catalog connects every sale

**Say (40 seconds):**

Our full product puts the merchant at the center. They manage products, prices, stock, and orders once. Their personal storefront carries their brand. The shared marketplace gives buyers a place to discover different stores. The POS handles sales in the physical shop. The intended result is simple: when an item sells in one channel, its availability changes across the others. A merchant can begin with the marketplace and add a storefront as their business grows.

**Evidence and Q&A:**

Target product workflow. Marketplace-only stores and optional storefronts follow docs/platform-architecture.md. Cross-channel stock behavior remains a release validation task. Sources: C:/Users/User/rentify/README.md; C:/Users/User/rentify/docs/migration-plan.md.

## 4. The storefront, marketplace and POS experience

**Say (35 seconds):**

Here are the three interfaces. On the left is a merchant storefront. In the middle is Rentify Marketplace, where buyers can browse across sellers. On the right is our POS product preview, showing products, a cart, and a customer display. We have development interfaces running today. The next product milestone is to demonstrate a complete sale with consistent stock across all three channels.

**Evidence and Q&A:**

Storefront: local NexTech template at http://localhost:4600/. Marketplace: user-provided screenshot of http://localhost:4500/. POS: user-selected image from marketing site http://localhost:4200/; this is a product preview. Actual POS route is http://localhost:4400/pos. Prior browser review added a seeded product to a temporary POS cart; no sale was submitted. The hosted storefront product section was empty during that review. Do not claim that these images prove stock synchronization.

## 5. Target retailers sell online and in person

**Say (25 seconds):**

We will start with small Cambodian retailers who sell both online and at a physical counter. They already have customers and a stock management task we can observe. Cambodia's e-commerce market was reported at 1.51 billion US dollars in 2024. That gives us market context; our first practical target is ten suitable retailers.

**Evidence and Q&A:**

US$1.51B is reported 2024 Cambodian e-commerce market value, not Rentify revenue or TAM. Source: https://s2.moc.gov.kh/mocspace/mocspace_1744030861626.pdf ; corroborated 24 September 2026 at https://www.trade.gov/country-commercial-guides/cambodia-ecommerce . First 10 retailers is a proposed pilot target.

## 6. Where Rentify competes

**Say (35 seconds):**

Merchants already have alternatives. Khmer24 offers broad product discovery. Shopify connects online stores with POS. Khmum combines a local marketplace with merchant tools and POS. Rentify's focus is the small Cambodian retailer who wants their own brand, shared buyer discovery, and counter sales in one workflow. We will compare how much work it takes to set up and operate, how reliably stock updates, and what the merchant pays.

**Evidence and Q&A:**

Public descriptions checked 24 September 2026. Sources: https://www.khmer24.com/en ; https://www.shopify.com/pos ; https://www.khmersme.gov.kh/service_provider/khmum-technology-co-ltd/ . Khmum has overlapping capabilities. No first/only/cheapest/best claim or measured advantage is supported.

## 7. Two ways Rentify earns revenue

**Say (30 seconds):**

Our business model follows the value we provide. Merchants subscribe to their personal storefront and POS tools. Rentify also earns a commission on completed orders through the shared marketplace. One stream supports daily operations; the other grows with marketplace sales. We will test prices and commission rates with merchants and against our support and payment costs before setting them.

**Evidence and Q&A:**

User's final business model is storefront/POS subscription plus marketplace commission. Pricing, rates, settlement, refund treatment and marketplace-only entitlements remain open. The repository's initial COD policy is not the intended final business model. Conversation.md is historical context, not a source of approved numerical prices.

## 8. Our launch plan: 10 retailers and their buyers

**Say (40 seconds):**

We will recruit the first ten retailers through shop visits and merchant referrals. We will help them set up their catalog and invite their existing customers through store links and social posts. This gives us a way to test both merchant adoption and buyer orders before spending heavily on advertising. We will measure setup time, stock accuracy, completed orders, repeat use, and willingness to pay. These are our planned pilots; we have no verified customer traction yet.

**Evidence and Q&A:**

Proposed acquisition experiment, not traction. No paid customers, merchant interviews, pilots, or revenue are verified. Merchant-shared links and social posts are suggested first buyer channels. Workshop source: Discuss..pdf, pages 2-3. Measure direct-store and marketplace orders separately.

## 9. The team behind Rentify

**Say (25 seconds):**

Our five-person team covers product development, business outreach, presenting, and operations. Through UniPreneur, we are asking for introductions to ten retailers who sell online and in person. We want to help them keep their brand, reach more buyers, and run their sales from one place. That is Rentify: one catalog, three ways to sell.

**Evidence and Q&A:**

Five team names and roles confirmed by the user. Long Mengchheng is Team Lead with product responsibilities; Hong Thanbrathna is Idea Founder with R&D support; Khemrak Pasey is Business Lead; Mom Sothireak is Pitch Lead; Vy Seoul supports R&D and team operations. Source: Rentify_Uniprenuer.pdf page 13. The introductions ask is a recommendation, not a funding request or existing partnership. Stop the timed pitch here.

## Appendix navigation

| Slide | Use when asked about | First sentence |
| --- | --- | --- |
| 10 | Market size | We will size annual platform revenue from eligible retailers and relevant marketplace orders. |
| 11 | Competitors and uniqueness | Khmum overlaps with our concept; our proposed advantage depends on merchant experience and execution. |
| 12 | Revenue and prices | This example explains the mechanics using unvalidated assumptions. |
| 13 | Product readiness | The development interfaces exist; the complete shared-stock transaction is the next proof. |

## Rehearsal and delivery

1. Finish slide 3 by 1:35, slide 6 by 3:10, and slide 8 by 4:20. Finish the close by 4:45.
2. Pause briefly after the stock-mismatch example, the three-channel diagram, and the final ask.
3. Keep slide 9 on screen when the pitch ends. Enter the appendix only for a relevant question.
4. This script assumes screenshots, not a video. A video must replace spoken time on slide 4 and be tested separately.
5. If running late, shorten slide 6 to name the three alternatives and Rentify's target merchant. Keep the business model and closing ask.
6. Open the actual deck on the event laptop, test Presenter View and the clicker, and verify that the last row of slide 11 can be read on the projector.

See `pitch-readiness-review.md` for the remaining evidence gaps and `validation-and-qa.md` for judge answers.
