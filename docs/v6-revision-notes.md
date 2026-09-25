# v6 revision notes

Made 25 September 2026 from `output/Rentify_Uniprenuer v2.pdf`, the team's Canva draft. `output/Rentify_UniPreneur_Pitch_v6.pptx` is now the current deck. It is fully editable and imports into Canva.

## Story

v6 uses the "better, not first" framing the team asked for, but keeps a problem → solution spine:

1. The problem is not missing tools. It is that merchants have to stitch the tools together (slide 2).
2. Every existing option solves one piece. Khmum is shown fairly as the closest competitor (slide 3).
3. The innovation is one store behind every channel, with three specific differences (slides 4–5).
4. The proof is a real, reproducible cross-channel stock update (slide 6).

## Slide-by-slide changes from v2

| v2 page | Problem | v6 |
| --- | --- | --- |
| 1 Cover | Tagline described features, not the benefit | "Sell everywhere. Manage once." with real product screens |
| 2 Problem | Generic line about three records | Five-tool "stitching" problem plus the stock-mismatch moment; AI image labelled |
| 4–5 Screens / How it works | Old screenshots showed "Products will be available soon" and raw translation keys. The How-it-works mockups carry KhmerCraft branding | Replaced with fresh captures. Slide 6 is new: one POS sale takes stock from 40 to 39 on the storefront and the marketplace |
| 8 "$2.4B market" | No source; the figure had been removed earlier for that reason | Bottom-up TAM/SAM/SOM from the 2022 Economic Census (slide 8, appendix A2) |
| 9 Market sizing approach | Method only, no numbers | Merged into slide 8 |
| 10–12 Competition | Three overlapping competitor slides | One fair gap slide (slide 3) plus one evidence table (A1) |
| 13 Shopify checkmark table | Unverified claims ("more affordable", Khmer, native KHQR) | Removed |
| 14–16 Revenue / pricing / "How Rentify makes money" | Three models that contradicted each other; NBC partner claim; the pricing image offered POS only on Pro | One model: $3/$5/$10 subscriptions, POS in every tier, commission only on marketplace-sourced online orders from 2027 |
| 17 What's next | "Live today… native KHQR… already in sellers' hands" was false. "Q1–Q2 2026" is already past | Roadmap from Q4 2026 to 2028+, with built and planned items labelled |
| 18 Financials | Unreadable screenshot of a spreadsheet | Native chart, key figures and a full table (A3). Figures match v2 |
| 19 Team | — | Same people and roles; the ask (introductions, mentors, pilot support) is added |
| 21–22 Two canvases | Contradicted each other (Bakong/NBC partner, "KhmerCraft search") | One consistent canvas (A4) |
| 23 Delivery partners | — | Kept (A5) |
| — | "What's built?" had no answer | Build status slide (A6) |

## New sources

- **NIS, Economic Census of Cambodia 2022, final report, Table 2.10**
  - 410,623 retail establishments: ISIC division 47, excluding fuel stations (4730).
  - 65,433 specialized non-food retail stores: ISIC 4741–4774.
  - Phnom Penh has 149,888 establishments (20% of the total).
  - Link: https://nis.gov.kh/wp-content/uploads/2025/09/National-Report-on-Final-Census-Results-Economic-Census-of-Cambodia-2022.pdf
- **VTENH:** a marketplace with delivery across 25 provinces, card and ABA payments. https://www.vtenh.com/
- **Khmum eShop:** its app was still being updated in March 2026, with POS features. https://apps.apple.com/us/app/khmum-eshop/id1471320793
- **UniPreneur Awards 2025:** Emerging Innovator, Market Ready and Young Founder categories. https://cambodianess.com/article/khmer-enterprise-awards-2025-celebrates-innovation-entrepreneurship-and-sme-growth

## Product proof (slide 6)

Captured on 25 September 2026 from the local Rentify stack with `build/v6/capture.js` and `build/v6/possale.js`. The steps:

1. Aura Botanicals demo store, product "Deep Barrier Hydrating Cream", starting stock 40.
2. One POS cash sale was made. This created one POS order in the local development database.
3. The storefront on port 4700 then showed "Maximum: 39 units".
4. The marketplace on port 4500 then showed "39 items in stock".

The data is seeded demo data, not customer orders. For a live demo, repeat these steps.

## The team must confirm before presenting

1. **Pricing tiers.** v6 uses the $3/$5/$10 cards from v2 but puts POS in every tier, because it is the core promise. The financial model's "free / $3 / $8 / $19" tiers differ. Only the US$5 average plan is used in the numbers.
2. **Pilot pass targets** on slide 10 (7/10 active, ≥99% stock accuracy, 6/10 willing to pay). These are proposals. Agree them before the pilot starts.
3. **Roadmap dates** on slide 11 (KHQR in H1 2027, commission in H2 2027).
4. **Team roles** on slide 13, taken from v2.
5. **Persona photos** on slide 7 come from v2. They are labelled "illustrative".

## Highest-value work before the event

Talk to real merchants. Even 10–15 conversations with quotes would give slide 2 real evidence. Octo-Fin, the 2025 winner used as a reference, led with that kind of evidence. Add a validation slide after slide 2 once you have it.

## Speaker script

The spoken script (about 470 words) is in each slide's speaker notes, with time stamps that finish at 4:45. Rehearse it aloud; allow time for pauses and slide changes. `docs/slide-by-slide.md` still describes v5.
