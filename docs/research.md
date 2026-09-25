# Research and pitch evidence

Checked 24 September 2026. This note separates published facts from the team's product hypotheses. Use the linked primary sources when updating a slide.

## UniPreneur and pitch design

Khmer Enterprise's UniPreneur program develops student ventures from ideation toward investment readiness through camp, sprint, and national challenge stages. KIT reports that Octofin placed second at UniPreneurCamp 2025 and then advanced to the sprint. The supplied Octo-Fin PDF is useful for its problem, validation, product, business model, market, and appendix structure. Its numbers are not Rentify evidence. The supplied HuskPack PDF shows the same practical pattern: short story first, detailed calculations later.

The user's `Discuss..pdf` emphasizes customer discovery, the four fits (market-product, product-channel, channel-model, model-market), realistic bottom-up sizing, a three-year financial view, and a clear ask. Treat this as workshop guidance, not independently verified judging criteria. The supplied `Hackathon Idea Strategy and Execution.pdf` contains broader predictions about judges and sponsors that have not been independently confirmed, so those predictions are excluded from pitch claims.

YC's pitch guidance recommends a few memorable ideas, large readable text, and one clear point per slide. Sequoia's guide asks founders to explain purpose, problem, solution, market, competition, business model, team, and vision. This deck adapts that order to the user's five-minute limit.

Sources: [Khmer Enterprise UniPreneur program listing](https://startupcambodia.gov.kh/program?email=&id=338), [KIT's Octofin result](https://www.kit.edu.kh/post/kit-s-octofin-wins-second-place-at-unipreneurcamp-2025), [Y Combinator slide advice](https://www.ycombinator.com/blog/how-to-design-a-better-pitch-deck), [Sequoia's business plan guide](https://sequoiacap.com/article/writing-a-business-plan).

## Cambodian market context

- Cambodia's Ministry of Commerce reported **US$1.51 billion in e-commerce market value in 2024** and projected **US$1.78 billion for 2025**. The 2025 figure is a projection, not a confirmed result. The report identifies Facebook, TikTok, Telegram, and Khmer24 among prominent shopping channels. This describes the wider market's transaction value, not Rentify's addressable revenue.
- Cambodia's 2022 Economic Census counted **753,670 establishments**. The National Institute of Statistics reports that wholesale and retail trade plus motor vehicle repair represented about **66%** of establishments. This category is broader than Rentify's target customers. The revised main pitch does not use this count as a headline; the market-sizing appendix mentions it only to explain why it is not a precise TAM.
- The first customer segment to test is a Cambodian small retailer already selling in social channels and at a physical counter. Its exact population, software spend, and reachable share need interviews and a bottom-up estimate.

Sources: [Ministry of Commerce 2024 e-commerce infographic and bulletin](https://s2.moc.gov.kh/mocspace/mocspace_1744030861626.pdf), [U.S. International Trade Administration Cambodia e-commerce guide](https://www.trade.gov/country-commercial-guides/cambodia-ecommerce) (corroborates the 2024 value), [National Institute of Statistics 2022 census leaflet](https://nis.gov.kh/nis/EC2022/Leaflet.pdf), [NIS final census summary](https://www.nis.gov.kh/nis/EC2022/National%20Report%20on%20Final%20Census%20Results%20Economic%20Census%20of%20Cambodia%202022.pdf).

## Competitor and alternative landscape

| Alternative | Publicly described offer | Implication for Rentify |
| --- | --- | --- |
| [Khmer24](https://www.khmer24.com/en) | Broad Cambodian listing marketplace across goods, property, jobs, and services. | Competes for product discovery. Compare seller workflow and buying experience in actual tests before claiming a gap. |
| [Smile Shop](https://h5.khsmileshop.com/) | Cambodian multi-merchant e-commerce marketplace with delivery, payment, and return services. | Competes for buyer traffic and merchant marketplace supply. |
| [Shopify](https://www.shopify.com/pos) | Branded online store and POS with synced orders and inventory across channels. | Proves that unified retail is established globally. Rentify's local proposition must be more specific than “storefront plus POS.” |
| [Khmum eShop](https://www.khmersme.gov.kh/service_provider/khmum-technology-co-ltd/) | Cambodian marketplace, merchant inventory/staff/sales tools, KHQR-described payments, hybrid POS, and white-label offering. | Closest direct benchmark. The combination itself is not unique to Rentify. Demonstrate setup simplicity, storefront flexibility, transparent stock accuracy, and merchant economics in pilots. |
| [Polymer POS](https://polymerpos.com/features) | Cambodian online-shop operations with orders, inventory, reporting, and delivery partners. | Competes for operational tools and social sellers. |

This is a public-source comparison, not a feature audit or pricing test. Avoid checkmark tables that mark a competitor feature absent because a website did not mention it. The main competitive statement is a **hypothesis to prove**: Rentify can make branded storefront, marketplace discovery, and POS feel like one affordable merchant workflow with one catalog and stock balance.

## Product and business claims

Confirmed product direction from the user and repository: one merchant Store; optional personal storefront; shared marketplace; POS; one catalog, price, stock, and order authority. Current code includes Core Store identity, Commerce Store-keyed catalog and checkout paths, React storefront templates and merchant UI, Angular marketplace UI, and POS functionality. Migration and release gates remain open. The deck can pitch the final product while labeling current screens as a development build.

The user chose a two-part final business model: **subscription for merchant storefront/POS plus a commission on marketplace orders**. No rate or price has been approved. The old Rentify PDF's US$3–10/month and the prior chat's 3% example are unvalidated hypotheses. Commission collection and payment settlement need partner, legal, and operational validation. The deck's illustrative revenue scenario is a sensitivity example, not a forecast or a pricing commitment.

Sources: [Rentify README](C:/Users/User/rentify/README.md), [platform architecture](C:/Users/User/rentify/docs/platform-architecture.md), [migration plan](C:/Users/User/rentify/docs/migration-plan.md), user-provided `Conversation.md` and latest instruction.

## Claims removed from the old Rentify deck

- “50+ seller interviews,” “12 early access signups,” “validated willingness to pay,” and “already in sellers' hands”: the user says there is no verified traction yet.
- US$2.4 billion Cambodian market: no supplied calculation or reliable source supports it. Use the Ministry of Commerce figure with date and definition instead.
- Automatic KHQR verification and live bank payment claims: the current product and bank arrangements do not substantiate a production-ready flow.
- A claim that Shopify lacks online and offline POS, or that Rentify is the only local integrated platform: Shopify and Khmum publicly describe those capabilities.
- Any implied partnership with the National Bank of Cambodia, Meta, or financial institutions: no agreement has been supplied.

## Remaining evidence to collect

1. Ten pilot merchants from the target segment, with consented before-and-after workflow observations.
2. Setup time, cross-channel stock accuracy, order completion, weekly active sellers, and repeat use.
3. Subscription willingness to pay and commission acceptance tested separately.
4. Merchant acquisition cost, support cost, payment costs, marketplace order volume, average order value, and returns, before a financial forecast is presented as expected performance.
5. Direct side-by-side pilot of Rentify and Khmum for merchant onboarding and stock updates.

## Cost inputs for the financial model

Checked 25 September 2026 for `docs/rentify-financial-model.xlsx` (v3: all 5 team members, Cambodian taxes) (generated by `build/financial_model.py`). Paying-shop numbers are unchanged from the team's 36-month model. Costs are rebuilt bottom-up. Prices come from search-result summaries of the pages below, because the pages could not be opened from the build environment. Re-check them before quoting exact figures.

- **Servers:** a DigitalOcean Basic droplet with 2 vCPU and 4 GiB costs US$24/month. [Droplet pricing](https://www.digitalocean.com/pricing/droplets)
- **Database:** DigitalOcean managed PostgreSQL starts at US$15/month; the 1 vCPU/2 GiB plan is US$30.45/month. The Year 3 figure of about US$61 is an estimate. [PostgreSQL pricing](https://docs.digitalocean.com/products/databases/postgresql/details/pricing/)
- **Photo storage:** DigitalOcean Spaces costs US$5/month with 250 GiB included, then US$0.02/GiB. [Spaces pricing](https://docs.digitalocean.com/products/spaces/details/pricing/)
- **Email:** Resend is free for 3,000 emails/month; Pro costs US$20/month for 50,000. [Resend pricing](https://resend.com/pricing)
- **AI tools:** Claude Pro and ChatGPT Plus each cost about US$20/month. [Pricing comparison](https://www.aipricing.guru/compare/claude-pro-vs-chatgpt-plus/)
- **Company registration:** the Ministry of Commerce fee is about KHR 2,155,000 (~US$540). The model adds ~US$300 for notary and legal help. [Registration guide](https://www.usemultiplier.com/cambodia/company-registration)
- **Pay context:** Cambodia's 2026 garment minimum wage is US$210/month. [Khmer Times](https://www.khmertimeskh.com/501758512/cambodia-raises-2026-minimum-wage-to-210-per-month/) Customer-support roles are reported at about US$450–900/month. [Paylab](https://www.paylab.com/kh/salaryinfo/customer-support) Phnom Penh software engineers average about US$1,400/month. [Glassdoor](https://www.glassdoor.com/Salaries/phnom-penh-software-developer-salary-SRCH_IL.0,10_IC3610836_KO11,29.htm)
- **Team assumptions (not external facts):** founder allowances, ad budgets, the ratio of Free to paying shops, marketplace order volume and order value, and the 0.5% blended payment cost. All are to be tested in the pilot.

## How Cambodian tax applies to Rentify

Checked 25 September 2026 from search-result summaries of the sources linked below; the pages themselves could not be opened from the build environment. This is planning research, not tax advice. Confirm the details with a Cambodian accountant before registering the company.

**The 10% is VAT, not a tax on profit.** VAT is 10% of sales. The business collects it from customers and passes it to the General Department of Taxation (GDT), and it can reclaim the VAT it pays on its own costs. Registration is compulsory once turnover passes KHR 250 million a year (about US$62,500). Rentify's Year 3 revenue passes that, and a company that holds customer payments is likely to register from the start. The model therefore treats the $5 price as VAT-inclusive from Year 1: Rentify keeps $4.55 and $0.45 goes to the government. Sources: [Acclime VAT guide](https://cambodia.acclime.com/guides/value-added-tax/), [Quaderno VAT guide](https://www.quaderno.io/guides/cambodia-vat-guide/).

**Tax on profit is 20% for companies.** Small taxpayers, mainly sole proprietors, pay progressive rates from 0% to 20%. Individual profit brackets start with 0% up to KHR 18 million a year. Companies are classed as medium or large taxpayers by turnover, assets and legal form, so Rentify Co., Ltd. should plan for the flat 20%. Losses can be carried forward, so profit tax starts only after earlier losses are used up. Sources: [PwC corporate tax summary](https://taxsummaries.pwc.com/cambodia/corporate/taxes-on-corporate-income), [DFDL on taxpayer classes](https://www.dfdl.com/insights/legal-and-tax-updates/cambodia-revision-of-taxpayer-classification/), [Acclime tax thresholds](https://cambodia.acclime.com/news/thresholds-annual-taxable-profit-monthly-taxable-salary-to-increase/).

**Prepayment of profit tax: 1% of monthly turnover.** It is paid monthly and credited against the year's profit tax. The model treats it as a cost in loss years (conservative). The separate 1% minimum tax does not apply to companies that keep proper accounting records, which is one reason the model pays for an accountant from Year 2. Sources: [Acclime corporate income tax](https://cambodia.acclime.com/guides/corporate-income-tax/), [PwC tax administration](https://taxsummaries.pwc.com/cambodia/corporate/tax-administration).

**Other taxes and contributions in the model:**
- **Patent tax** (annual business tax): KHR 1.2 million (~US$300) a year for a medium taxpayer, due by 31 March. [Emerhub](https://emerhub.com/cambodia/guide-to-patent-tax-in-cambodia/)
- **Withholding tax:** 14% on payments to non-resident suppliers such as foreign cloud, AI and ad services; 15% on some payments to unregistered local service providers. The model adds 14% on top of foreign services (conservative). [PwC withholding taxes](https://taxsummaries.pwc.com/cambodia/corporate/withholding-taxes)
- **VAT on foreign digital services:** DigitalOcean charges 10% Cambodian VAT, and a VAT-registered company can reclaim it. [DigitalOcean Cambodia tax](https://docs.digitalocean.com/platform/billing/taxes/khm/)
- **Salary tax:** the employee pays it, withheld by the employer, at 0% on the first KHR 1.5 million (~US$375) a month, then 5–20%. The founder allowances of $100–500 a month fall at or just above the tax-free band. [Acclime personal income tax](https://cambodia.acclime.com/guides/personal-income-tax/)
- **NSSF:** employer contributions for occupational risk, health care and pension; the pension share rises in the 2027–2031 phase. The model uses about 6–7% of pay. [Rivermate](https://rivermate.com/guides/cambodia/taxes)

**Possible incentives, not counted in the model:**
- Sub-decree 124 gives newly registered SMEs in priority sectors, including information-technology R&D, a 3–5 year exemption from tax on income. [Tilleke & Gibbins](https://www.tilleke.com/insights/cambodia-grants-tax-incentives-for-investment-project-expansion-and-msmes/4/), [Phnom Penh Post](https://phnompenhpost.com/business/pm-signs-sub-decree-sme-tax-incentives/)
- MSME incentives give qualifying startups two years without profit tax, prepayment and minimum tax, and small enterprises can be exempt from patent tax for two years. Their eligibility windows and sectors need checking. [Acclime tax incentives](https://cambodia.acclime.com/guides/tax-incentives/)
- If Rentify qualifies for one of these, the 20% profit tax and 1% prepayment in Years 1–3 fall to zero.
