# Presentation demo runbook

## Recommendation for the five-minute pitch

Use slide 4 as the guaranteed visual. A **30–35 second recorded walkthrough** can replace part of its spoken explanation if the contest permits video and the recording shows real behavior. Keep a live browser open for Q&A, but do not make the timed pitch depend on local servers, Wi-Fi, login, or payment callbacks. A screenshot is the fallback if video playback fails.

Record the current build only. A possible sequence is catalog → hosted storefront → marketplace listing → POS sale → resulting stock update. Include a step only after confirming it works end to end. If the stock update is simulated or incomplete, caption that plainly and keep it out of a claim about implemented synchronization.

## Verified local surfaces on 24 September 2026

| Surface | URL | What was observed | Use in presentation |
| --- | --- | --- | --- |
| Shared marketplace home | `http://localhost:4500/` | Rentify Marketplace buyer interface with search, categories and promotions, confirmed by the team's screenshot and a fresh local capture. | Source for the marketplace screenshot on slide 4. |
| Marketplace pilot catalog | `http://localhost:4500/rentify-preview` | Separate pilot catalog route with sample NexTech products. | Optional Q&A route if a catalog listing is needed. |
| Hosted storefront | `http://localhost:4600/` | NexTech hosted storefront template and hero were visible. Its products section stated that products would be available soon. | Source for the storefront screenshot; do not say it proves live shared catalog sales. |
| Merchant POS | `http://localhost:4400/pos` | POS route in the merchant dashboard. Signed in as the seeded NexTech merchant, viewed products, and added one sample product to its local cart without submitting a sale. Some localization keys and a hard-coded store description remain visible. | Working POS route for Q&A; demonstrate a sale only after verifying it end to end. |
| POS marketing preview | `http://localhost:4200/` | Team-provided close-up image of the POS mockup shown on the Rentify marketing page. | Source for the POS visual on slide 4. Label it as a preview, not a verified transaction. |
| Rentify marketing | `http://localhost:4200/` | Marketing home page. | Optional context only. |

The verified local ports are **4500 for the shared marketplace**, **4600 for the NexTech hosted storefront**, **4400 for the merchant dashboard containing POS**, and **4200 for the marketing site that displays the POS preview**. POS has no separate web port. Local URLs are for rehearsal; replace with event-accessible URLs only after verifying the deployed build.

## Recording checklist

1. Use a clean browser window at 16:9 with notifications hidden. Prepare one sample Store and product whose name is easy to read.
2. Capture the exact working screens in the sequence above. Zoom to readable UI rather than scrolling through tiny text.
3. Keep the video under 35 seconds. Add a brief caption for each surface and a visible “development build” label.
4. Export a common video format such as MP4 and embed it locally in the presentation computer's copy of the deck only after playback is tested. Also keep a separate MP4 file in the same folder.
5. Test with the actual projector, laptop, sound settings, and PowerPoint mode. Start the deck offline to confirm the slide 4 backup remains sufficient.
6. Before pitch day, confirm the pilot route, sample data, account access, and server state. Rehearse one full Q&A demonstration from a fresh browser tab.

## Suggested narration for the clip

“One merchant creates a product once. That product can appear on their own storefront and in the shared marketplace. When the merchant sells at the counter, the POS and online channels use the same Store records. This is the merchant workflow we are completing and testing with pilots.”

Adjust the wording to the exact actions shown. If the clip shows only navigation between surfaces, say “these are the three product surfaces” and do not imply a completed transaction or synchronized stock event.

## Presentation-day fallback

If the recording or live build fails, continue from slide 4's three screenshots and slide 3's operating model. Do not use pitch time troubleshooting. During Q&A, explain which interaction is implemented and which is the next integration milestone.

## v5 timing update

The current script allocates 35 seconds to slide 4 and 4:45 overall. Use the static screenshots for the rehearsed pitch. If adding a recording, it must replace that 35-second explanation rather than add to it. The deck omits local ports from projected slide copy; the route table above is for the team.
