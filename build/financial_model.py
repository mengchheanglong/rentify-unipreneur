"""Rentify three-year financial model (bottom-up costs, two scenarios).

Writes docs/rentify-financial-model.xlsx with every input in its own cell (blue) and
every result as a formula. Recalculate afterwards so cached values exist:
    python <xlsx skill>/scripts/recalc.py docs/rentify-financial-model.xlsx
Run: python build/financial_model.py
"""
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "docs" / "rentify-financial-model.xlsx"

F = "Arial"
BLUE = Font(name=F, color="0000FF")
BLACK = Font(name=F)
BOLD = Font(name=F, bold=True)
HEAD = Font(name=F, bold=True, color="FFFFFF")
TITLE = Font(name=F, bold=True, size=14)
NAVY = PatternFill("solid", fgColor="111D35")
PALE = PatternFill("solid", fgColor="F1F5F9")
KEY = PatternFill("solid", fgColor="FFFF00")
THIN = Border(bottom=Side(style="thin", color="D7E1ED"))
USD = '$#,##0;($#,##0);"-"'
USD2 = '$#,##0.00;($#,##0.00);"-"'
NUM = '#,##0;(#,##0);"-"'
NUM1 = '#,##0.0;(#,##0.0);"-"'
PCT = '0.0%;(0.0%);"-"'

wb = Workbook()
ws = wb.active
ws.title = "Model"
ws.column_dimensions["A"].width = 46
for c in "BCD":
    ws.column_dimensions[c].width = 13
ws.column_dimensions["E"].width = 95

row = 1
ref = {}  # name -> row number


def title(text):
    global row
    ws.cell(row=row, column=1, value=text).font = TITLE
    row += 1


def section(text):
    global row
    row += 1
    for col, val in enumerate([text, "Year 1 (2027)", "Year 2 (2028)", "Year 3 (2029)", "Basis / source"], 1):
        c = ws.cell(row=row, column=col, value=val)
        c.font, c.fill = HEAD, NAVY
        c.alignment = Alignment(horizontal="left" if col in (1, 5) else "right")
    row += 1


def line(name, label, values, fmt=USD, note="", inp=False, bold=False, key=False):
    """values: 3 numbers (inputs) or 3 formula strings using {B}/{C}/{D} column and @name refs."""
    global row
    ws.cell(row=row, column=1, value=label).font = BOLD if bold else BLACK
    for i, col in enumerate("BCD"):
        v = values[i]
        if isinstance(v, str):
            v = v.replace("{c}", col)
            for n, r in sorted(ref.items(), key=lambda kv: -len(kv[0])):
                v = v.replace("@" + n + "!", f"$B${r}").replace("@" + n, f"{col}{r}")
        c = ws.cell(row=row, column=2 + i, value=v)
        c.number_format = fmt
        c.font = BLUE if inp else (BOLD if bold else BLACK)
        if key:
            c.fill = KEY
        if bold:
            c.fill = PALE
    n = ws.cell(row=row, column=5, value=note)
    n.font = Font(name=F, italic=True, color="52637A")
    n.alignment = Alignment(wrap_text=True, vertical="top")
    for col in range(1, 6):
        ws.cell(row=row, column=col).border = THIN
    ref[name] = row
    row += 1


title("Rentify - three-year financial model (bootstrapped, v4, Sept 2026)")
ws.cell(row=row, column=1, value="Blue = input you can change. Black = formula. Yellow = key assumption to test in the pilot. "
        "Years start with the public launch in 2027; the Q4 2026 pilot is covered by Year 1 costs.").font = Font(name=F, italic=True)
row += 1

# ---------------- Inputs ----------------
section("INPUTS - shops")
line("paying", "Average paying shops", [57.6, 418.85, 1129.07], NUM1, inp=True, key=True,
     note="Yearly average from the team's 36-month model (its subscription revenue / US$60). Unchanged, so the market slides stay consistent.")
line("price", "Average plan price ($/shop/month)", [5, 5, 5], USD2, inp=True, key=True,
     note="Starter $5 / Pro $10; $5 average is conservative. Proposed prices, to test in the pilot.")
line("freeratio", "Free-plan shops per paying shop", [1, 1, 1], "0.0", inp=True,
     note="Assumption: one marketplace-only Free shop for every paying shop. They pay no subscription but can pay commission.")

section("INPUTS - marketplace commission (commission scenario only)")
line("months", "Months with online payments", [6, 12, 12], NUM, inp=True, note="Online (KHQR) payments and commission start mid-2027 (roadmap). Cash-on-delivery orders earn no commission.")
line("share", "Share of shops getting marketplace orders", [0.5, 0.5, 0.5], PCT, inp=True, key=True, note="Assumption: half of all shops receive at least some marketplace-sourced orders.")
line("orders", "Marketplace orders per such shop per month", [2, 3, 4], NUM, inp=True, key=True, note="Assumption: grows as buyers discover more shops. Measure in the pilot.")
line("aov", "Average marketplace order value ($)", [15, 15, 15], USD2, inp=True, key=True, note="Assumption for fashion/beauty/home goods. Measure in the pilot.")
line("rate", "Commission rate", [0.03, 0.03, 0.03], PCT, inp=True, key=True, note="Proposed 3% on marketplace-sourced orders only; 0% on the shop's own storefront and counter sales.")
line("payfee", "Payment cost (% of marketplace sales)", [0.005, 0.005, 0.005], PCT, inp=True,
     note="Blended estimate: ABA-to-ABA KHQR reportedly free; interbank and card payments cost more. Confirm with ABA PayWay.")

section("INPUTS - infrastructure ($/month)")
line("vps", "App servers (DigitalOcean droplets, Singapore)", [24, 48, 96], USD2, inp=True,
     note="Y1: 1 x 2 vCPU/4 GB ($24). Y2: 2 x 4 GB. Y3: 2 x 4 vCPU/8 GB ($48 each). Docker runs on these; Docker itself is free. digitalocean.com/pricing/droplets")
line("db", "Managed PostgreSQL database", [15, 30.45, 61], USD2, inp=True,
     note="Y1: 1 GB plan ($15). Y2: 1 vCPU/2 GB ($30.45). Y3: ~4 GB plan (estimate, about double). digitalocean.com/pricing/managed-databases")
line("storage", "Product photo storage (Spaces)", [5, 5, 10], USD2, inp=True,
     note="$5/month includes 250 GiB; extra $0.02/GiB. docs.digitalocean.com/products/spaces/details/pricing")
line("backup", "Server backups", [5, 10, 20], USD2, inp=True, note="Estimate: about 20% of droplet cost for weekly backups.")
line("email", "Transactional email (Resend)", [0, 20, 20], USD2, inp=True, note="Free up to 3,000 emails/month; Pro $20 for 50,000. resend.com/pricing")
line("lb", "Load balancer", [0, 0, 12], USD2, inp=True, note="Estimate for a small DigitalOcean load balancer once two app servers share traffic.")
line("domain", "Domain and DNS", [1.25, 1.25, 1.25], USD2, inp=True, note="About $15/year. SSL is free (Let's Encrypt). Merchants buy their own custom domains.")

section("INPUTS - team (paid from profit)")
line("founders", "Founders (whole team)", [5, 5, 5], NUM, inp=True, note="All 5 team members hold equity and do everything themselves: product, sales, onboarding, support. No hires in Years 1-3.")
line("payshare", "Share of profit paid to the team", [0, 0.5, 0.5], PCT, inp=True, key=True,
     note="Bootstrapped rule: the team works unpaid until there is profit, then takes half of each year's profit (before team pay) and keeps the other half as reserve. Many bootstrapped founders start at $0 and stay under ~$1,000/month for years (Pilot founder salary report; Practical Founders).")
line("paycap", "Maximum pay per founder ($/month)", [500, 500, 500], USD, inp=True,
     note="Cap, so extra profit is reinvested. Up to KHR 1.5M (~$375)/month is free of salary tax; above that the employee pays 5% (withheld, not a company cost).")
line("nssf", "Employer social security (NSSF, % of pay)", [0.06, 0.06, 0.07], PCT, inp=True, note="Occupational risk, health care and pension contributions paid by the employer on team pay; the pension share rises from 2027. Approximate.")

section("INPUTS - sales and marketing (limited budget)")
line("mkt", "Marketing budget (% of revenue)", [0.1, 0.1, 0.1], PCT, inp=True, key=True,
     note="Spend only what revenue allows: ads, printed QR stands, festival campaigns. Growth is founder-led (shop visits, Facebook groups, referrals), so this sits below the 20-40% that early bootstrapped SaaS firms often spend on marketing.")
line("print", "Minimum launch materials ($/year)", [100, 0, 0], USD, inp=True, note="Printed QR stands and flyers for the first pilot shops, before revenue exists.")
line("refcredit", "Referral credit per referred paying shop ($)", [5, 5, 5], USD, inp=True, note="One month free for the shop that refers another.")
line("refshare", "Share of new paying shops that come by referral", [0.2, 0.2, 0.2], PCT, inp=True, note="Assumption.")

section("INPUTS - software, office, legal and tax")
line("aisubs", "Shared AI tool subscriptions (number)", [2, 2, 3], NUM, inp=True, note="The team shares a few accounts instead of one each.")
line("ai", "AI tool price ($/subscription/month)", [20, 20, 20], USD, inp=True, note="Claude Pro or ChatGPT Plus, about $20/month. Code hosting (GitHub) and design tools use free plans.")
line("reg", "Company registration (one-off)", [840, 0, 0], USD, inp=True,
     note="Ministry of Commerce fee about KHR 2,155,000 (~$540) plus ~$300 notary/legal help. Needed before online payments (2027).")
line("books", "Bookkeeping and tax filing ($/month)", [0, 0, 50], USD, inp=True, note="Founders keep the books in Years 1-2; a part-time accountant from Year 3 (proper records also avoid the 1% minimum tax).")
line("office", "Office ($/month)", [0, 0, 0], USD, inp=True, note="No rent: home, university, or free startup space such as Techo Startup Center in Phnom Penh.")
line("vatreg", "VAT-registered (1 = yes)", [1, 1, 1], NUM, inp=True, key=True, note="VAT is compulsory above KHR 250M (~$62,500) turnover a year; Rentify passes that in Year 3. A company holding customer payments will likely register from the start, so this is on from Year 1 (conservative).")
line("vat", "VAT rate (included in our prices)", [0.1, 0.1, 0.1], PCT, inp=True, note="10% VAT is charged on sales and passed to the government; it is not a tax on profit. Prices stay $5 incl. VAT, so Rentify keeps $5 / 1.1 = $4.55. VAT we pay on costs can be reclaimed, so costs are shown without VAT.")
line("ptax", "Tax on profit", [0.2, 0.2, 0.2], PCT, inp=True, note="20% for companies (medium/large taxpayers). Losses carried forward. IT startups may get a 2-5 year exemption (SME Sub-decree 124, MSME incentives); not assumed here.")
line("mintax", "Prepayment of profit tax (% of revenue)", [0.01, 0.01, 0.01], PCT, inp=True,
     note="1% of monthly turnover, credited against profit tax. In loss years it is treated as a cost (conservative). The separate 1% minimum tax does not apply to companies that keep proper accounts.")
line("patent", "Patent tax (annual business tax, $)", [300, 300, 300], USD, inp=True, note="KHR 1.2M (~$300) a year for a medium taxpayer. Small enterprises can be exempt for 2 years.")
line("wht", "Withholding tax on foreign services", [0.14, 0.14, 0.14], PCT, inp=True, note="14% on payments to non-resident suppliers (servers, AI tools), assumed paid by Rentify on top (conservative).")

# ---------------- Calculations ----------------
section("CALCULATIONS")
line("free", "Free-plan shops", ["=@paying*@freeratio"] * 3, NUM1)
line("newpaying", "New paying shops in the year", ["=@paying", "=@paying-B{p}".format(p=ref["paying"]), "=@paying-C{p}".format(p=ref["paying"])], NUM1,
     note="Increase in average paying shops (Year 1 starts from zero).")
line("gmv", "Marketplace sales through Rentify (GMV)", ["=(@paying+@free)*@share*@orders*@aov*@months"] * 3, USD,
     note="Sales value of marketplace orders, not Rentify revenue.")
line("infra", "Infrastructure cost incl. withholding tax ($/year)", ["=(@vps+@db+@storage+@backup+@email+@lb+@domain)*12*(1+@wht)"] * 3, USD)
line("netprice", "Subscription Rentify keeps per shop ($/year, excl. VAT)", ["=@price*12/(1+@vat*@vatreg)"] * 3, USD2)
line("solc", "Software, office, legal, patent tax ($/year)", ["=@aisubs*@ai*12*(1+@wht)+@reg+@books*12+@office*12+@patent"] * 3, USD)
line("capyr", "Team pay cap ($/year)", ["=@founders*@paycap*12"] * 3, USD)

section("P&L - BASE CASE (subscriptions only)")
line("sub", "Subscription revenue (excl. VAT)", ["=@paying*@netprice"] * 3, USD, note="Customers pay $5 incl. VAT; the VAT part goes to the government.")
line("cos", "Cost of service (infrastructure)", ["=@infra"] * 3, USD)
line("gp", "Gross profit", ["=@sub-@cos"] * 3, USD, bold=True)
line("sm", "Sales & marketing", ["=@mkt*@sub+@print+@newpaying*@refshare*@refcredit"] * 3, USD)
line("sol", "Software, office, legal, patent tax", ["=@solc"] * 3, USD)
line("pbt", "Profit before team pay", ["=@gp-@sm-@sol"] * 3, USD, bold=True, note="What the business earns while the team works for equity.")
line("pay", "Team pay (from profit)", ["=MIN(@capyr,@payshare*MAX(0,@pbt))"] * 3, USD)
line("team", "Team cost incl. NSSF", ["=@pay*(1+@nssf)"] * 3, USD)
line("ebit", "Result before tax", ["=@pbt-@team"] * 3, USD, bold=True)
line("cumebit", "Cumulative result before tax", ["=@ebit"] * 3, USD)
ws.cell(row=ref["cumebit"], column=3).value = f"=B{ref['cumebit']}+C{ref['ebit']}"
ws.cell(row=ref["cumebit"], column=4).value = f"=C{ref['cumebit']}+D{ref['ebit']}"
line("tax", "Tax on profit", ["=MAX(@mintax*@sub,@ptax*MAX(0,MIN(@ebit,@cumebit)))"] * 3, USD,
     note="Higher of the 1% prepayment and 20% profit tax; profit tax only on profit left after earlier losses.")
line("net", "Net result (kept in the company)", ["=@ebit-@tax"] * 3, USD, bold=True, key=True)
line("cumnet", "Cumulative net result", ["=@net"] * 3, USD)
ws.cell(row=ref["cumnet"], column=3).value = f"=B{ref['cumnet']}+C{ref['net']}"
ws.cell(row=ref["cumnet"], column=4).value = f"=C{ref['cumnet']}+D{ref['net']}"
line("permonth", "Pay per founder ($/month)", ["=@pay/@founders/12"] * 3, USD, bold=True)

section("P&L - WITH 3% COMMISSION (upside scenario)")
line("csub", "Subscription revenue", ["=@sub"] * 3, USD)
line("ccom", "Commission revenue (excl. VAT)", ["=@gmv*@rate/(1+@vat*@vatreg)"] * 3, USD)
line("crev", "Total revenue", ["=@csub+@ccom"] * 3, USD)
line("ccos", "Cost of service (infrastructure + payment cost)", ["=@infra+@gmv*@payfee"] * 3, USD)
line("cgp", "Gross profit", ["=@crev-@ccos"] * 3, USD, bold=True)
line("csm", "Sales & marketing", ["=@mkt*@crev+@print+@newpaying*@refshare*@refcredit"] * 3, USD)
line("cpbt", "Profit before team pay", ["=@cgp-@csm-@solc"] * 3, USD, bold=True)
line("cpay", "Team pay (from profit)", ["=MIN(@capyr,@payshare*MAX(0,@cpbt))"] * 3, USD)
line("cebit", "Result before tax", ["=@cpbt-@cpay*(1+@nssf)"] * 3, USD, bold=True)
line("ccum", "Cumulative result before tax", ["=@cebit"] * 3, USD)
ws.cell(row=ref["ccum"], column=3).value = f"=B{ref['ccum']}+C{ref['cebit']}"
ws.cell(row=ref["ccum"], column=4).value = f"=C{ref['ccum']}+D{ref['cebit']}"
line("ctax", "Tax on profit", ["=MAX(@mintax*@crev,@ptax*MAX(0,MIN(@cebit,@ccum)))"] * 3, USD)
line("cnet", "Net result (kept in the company)", ["=@cebit-@ctax"] * 3, USD, bold=True, key=True)
line("cpermonth", "Pay per founder ($/month)", ["=@cpay/@founders/12"] * 3, USD, bold=True)

section("KEY FIGURES")
line("be", "Paying shops needed to cover running costs",
     ["=(@cos+@solc+@print+@newpaying*@refshare*@refcredit)/(@netprice*(1-@mkt))"] * 3, NUM,
     note="Costs excluding team pay / what each paying shop leaves after marketing.")
line("befull", "Paying shops needed to also pay every founder the cap",
     ["=(@cos+@solc+@print+@newpaying*@refshare*@refcredit+@capyr*(1+@nssf))/(@netprice*(1-@mkt))"] * 3, NUM,
     note="Shows when all 5 founders could take the full monthly cap.")
line("besam", "...as share of SAM (65,433 stores)", ["=@befull/65433"] * 3, PCT, note="NIS Economic Census 2022, ISIC 4741-4774.")
line("upfront", "Cash needed before first revenue", ["=@reg+@print+@infra/4", "=0", "=0"], USD,
     note="Registration, launch materials and about 3 months of servers during the pilot; from savings or prize money.")
ws.freeze_panes = "B2"
OUT.parent.mkdir(parents=True, exist_ok=True)
wb.save(OUT)
print("wrote", OUT)
