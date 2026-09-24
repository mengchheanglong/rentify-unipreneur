from pathlib import Path
import json

root=Path(r'C:\Users\User\Downloads\rentify-national-challenge')
content=root/'build'/'pitch-content-v5.json'
data=json.loads(content.read_text(encoding='utf-8'))
for n,title in {4:'The storefront, marketplace and POS experience',5:'Target retailers sell online and in person',8:'Our launch plan: 10 retailers and their buyers'}.items():
    data[n-1]['title']=title
content.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
def clock(t):return f'{t//60}:{t%60:02d}'
lines=['# Rentify pitch script and slide guide','',
'Current deck: `output/Rentify_UniPreneur_Pitch_v5.pptx`. Present slides 1-9. Slides 10-13 support Q&A.',
'','The 559-word script targets **4:45**, leaving 15 seconds inside the five-minute limit. These are pacing targets, not a measured rehearsal. Use one lead presenter and time the complete delivery aloud.',
'','| Slide | Topic | Target | Finish by |','| --- | --- | --- | --- |']
elapsed=0
for row in data:
    elapsed+=row['seconds']
    lines.append(f"| {row['slide']} | {row['title']} | {row['seconds']} sec | {clock(elapsed)} |")
for row in data:
    lines+=['',f"## {row['slide']}. {row['title']}",'',f"**Say ({row['seconds']} seconds):**",'',row['script'],'','**Evidence and Q&A:**','',row['evidence']]
lines+=['','## Appendix navigation','',
'| Slide | Use when asked about | First sentence |','| --- | --- | --- |',
'| 10 | Market size | We will size annual platform revenue from eligible retailers and relevant marketplace orders. |',
'| 11 | Competitors and uniqueness | Khmum overlaps with our concept; our proposed advantage depends on merchant experience and execution. |',
'| 12 | Revenue and prices | This example explains the mechanics using unvalidated assumptions. |',
'| 13 | Product readiness | The development interfaces exist; the complete shared-stock transaction is the next proof. |',
'','## Rehearsal and delivery','',
'1. Finish slide 3 by 1:35, slide 6 by 3:10, and slide 8 by 4:20. Finish the close by 4:45.',
'2. Pause briefly after the stock-mismatch example, the three-channel diagram, and the final ask.',
'3. Keep slide 9 on screen when the pitch ends. Enter the appendix only for a relevant question.',
'4. This script assumes screenshots, not a video. A video must replace spoken time on slide 4 and be tested separately.',
'5. If running late, shorten slide 6 to name the three alternatives and Rentify\'s target merchant. Keep the business model and closing ask.',
'6. Open the actual deck on the event laptop, test Presenter View and the clicker, and verify that the last row of slide 11 can be read on the projector.',
'','See `pitch-readiness-review.md` for the remaining evidence gaps and `validation-and-qa.md` for judge answers.']
(root/'docs'/'slide-by-slide.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')

review='''# Pitch readiness review

Reviewed 24 September 2026. Current presentation: `output/Rentify_UniPreneur_Pitch_v5.pptx`.

## Assessment

The deck is ready for a timed team rehearsal as an honest pre-pilot venture pitch. It has nine main slides, four Q&A slides, a 559-word spoken script, source notes and clear product-stage labels. A deck review cannot certify delivery on the event laptop, prove merchant demand, or guarantee a judging result.

## Sources and decisions

| Source | Relevant lesson or constraint | Applied to this revision |
| --- | --- | --- |
| Latest user instructions | Unified storefront, marketplace and POS; subscription plus commission; English; 5-minute pitch and 5-minute Q&A; no verified traction | Drives the entire narrative. The current code's COD scope does not define the final business pitch. |
| Conversation.md | Historical payment discussion with unsettled rates and collection options | Two revenue streams only. No guessed commission collection process presented as decided. |
| Rentify_Uniprenuer.pdf | Merchant pain, team names/roles and early visual direction | Retained the merchant story and confirmed team. Excluded old interviews, signups, payment and partnership claims. |
| HuskPack-Uniprenuer.pdf | Show the prototype honestly, then economics; detailed evidence in appendix | Product visuals on slide 4; development stage stated; economics in Q&A. |
| Copy of B13-Uniprenuer Synergy.pdf | Explain customer, product, model, market and channel before backup detail | Added buyer acquisition to the launch plan. Its survey and traction numbers are not Rentify evidence. |
| Discuss..pdf | Customer validation, first 5-10 customers, four fits, market sizing, three-year finance, clear ask | Ten-retailer experiment, channel/model explanation and introductions ask. Precise TAM and a defensible three-year forecast remain evidence gaps. |
| Hackathon Idea Strategy and Execution.pdf | Local relevance, business logic, preparation | Retained these preparation principles; excluded its unverified predictions about sponsor/judge preferences. |
| Current README and migration plan | Optional storefront, common Store identity, developing commerce integration | Full-product diagram is a target workflow; product-status appendix describes present evidence. |
| User marketplace and POS screenshots | Required product visuals | Used both. Kept the entire interface visible. POS is identified as a product preview. |

The earlier source audit remains in `deep-slide-audit.md`. Its original findings describe earlier versions, not the final v5 layout.

## Slide-by-slide refinement

| Slide | What changed | Why |
| --- | --- | --- |
| 1 | Clear unified-selling descriptor; three channels have equal emphasis | Establishes the business in the first sentence. |
| 2 | Concrete last-item example and consequences; AI illustration labeled | Makes the problem understandable without invented interview evidence. |
| 3 | Connected shared-record diagram; merchant benefit under each channel | Explains the product rather than only naming three interfaces. |
| 4 | Full screenshots with consistent columns; removed localhost ports from audience copy | Fixes the old crops and keeps attention on merchant value. Ports stay in the runbook. |
| 5 | Explicit target-retailer heading; market value and 2024 date together | Avoids implying existing customers or treating national market value as Rentify TAM. |
| 6 | Alternatives alongside Rentify's proposed focus | Gives judges a fair comparison and a specific execution question. |
| 7 | Revenue streams match the two sources of merchant value | Clarifies why subscription and commission coexist. |
| 8 | Merchant recruitment, first buyer acquisition and repeat use | Addresses both sides of a marketplace. |
| 9 | Confirmed team with a specific introductions ask and product closing line | Keeps the last 25 seconds focused and memorable. |
| 10 | Consistent annual revenue basis for TAM, SAM and SOM | Avoids mixing merchant counts with transaction value. |
| 11 | Larger editable competitor table | Makes Q&A comparison easier to read. |
| 12 | Separately shows US$800 subscriptions and US$600 commission, totaling US$1,400 | Makes illustrative arithmetic easy to explain; assumptions stay visible. |
| 13 | Current interfaces versus next evidence | Provides an honest answer to product-readiness questions. |

## Verification performed

- Inspected all 13 rendered v5 slides individually for fit, clipping, spacing and narrative consistency.
- Checked the revised PPTX package, layout geometry, font policy, editable table and first-party import. No validator findings.
- Preserved the user's selected marketplace and POS images without claiming a completed transaction.
- Kept the same spoken script in PowerPoint notes and `slide-by-slide.md` through one shared content file.
- Confirmed script target is 285 seconds. Actual pace must be measured aloud.
- Rechecked the US$1.51B 2024 market context and main competitor descriptions against their cited public sources.
- Checked revenue example: 100 × 8 = 800; 20,000 × 0.03 = 600; total = 1,400 per month before costs.

PowerPoint native playback, projector legibility in the venue, and the live product transaction have not been certified by this artifact review.

## Remaining gaps that slide editing cannot resolve

1. **Demand evidence:** no verified interviews, pilots, active customers or paid revenue. Ten pilots is a plan.
2. **Defensible differentiation:** the unified concept overlaps with Khmum. Compare real merchant tasks before claiming better setup, cost or stock accuracy.
3. **Product proof:** full cross-channel stock and checkout behavior still needs a recorded, reproducible demonstration. Current screenshots alone cannot establish it.
4. **Financial evidence:** actual pricing, eligible merchant count, support/payment costs, retention and acquisition costs remain open. The workshop asks for three-year revenue, cost and profit projections; the current deck has illustrative revenue mechanics, not that validated forecast. Build an explicit assumptions model once the team can defend its inputs.
5. **Delivery:** run the complete pitch twice under five minutes on the presentation laptop, then run a five-minute mock Q&A. Confirm organizer submission format, deadline and video rules directly.

## Presentation-day sequence

Open the PPTX and PDF backup locally. Test slide 4 images and slide 11 text, Presenter View and the clicker. Keep one lead presenter. Finish at slide 9 and leave it visible for Q&A. Use slides 10-13 only when a question calls for them. If a live demo fails, continue from the screenshots.
'''
(root/'docs'/'pitch-readiness-review.md').write_text(review,encoding='utf-8')

qa=root/'docs'/'validation-and-qa.md'
q=qa.read_text(encoding='utf-8')
q+='''
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
'''
qa.write_text(q,encoding='utf-8')

readme=root/'README.md'
r=readme.read_text(encoding='utf-8').replace('Rentify_UniPreneur_Pitch_v4.pptx','Rentify_UniPreneur_Pitch_v5.pptx')
r=r.replace('with the storefront, marketplace and POS preview together on slide 4; supporting evidence follows the nine-slide pitch.','refined nine-slide pitch with a 4:45 script and four Q&A slides.')
r=r.replace('- `docs/slide-by-slide.md`','- `output/Rentify_UniPreneur_Pitch_v5.pdf` — offline visual backup.\n- `docs/pitch-readiness-review.md` — final refinement review, remaining evidence gaps and event-day checks.\n- `docs/slide-by-slide.md`')
readme.write_text(r,encoding='utf-8')

runbook=root/'docs'/'demo-runbook.md'
r=runbook.read_text(encoding='utf-8').replace('35–45 second recorded walkthrough','30–35 second recorded walkthrough').replace('under 45 seconds','under 35 seconds')
r+='\n## v5 timing update\n\nThe current script allocates 35 seconds to slide 4 and 4:45 overall. Use the static screenshots for the rehearsed pitch. If adding a recording, it must replace that 35-second explanation rather than add to it. The deck omits local ports from projected slide copy; the route table above is for the team.\n'
runbook.write_text(r,encoding='utf-8')
print('Wrote synchronized speaker guide, readiness review, Q&A updates and README.')
