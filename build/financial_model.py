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


title("Rentify - three-year financial model (bottom-up, v2, Sept 2026)")
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

section("INPUTS - team")
line("founders", "Full-time founders", [3, 3, 3], NUM, inp=True, note="3 full-time founders; the other 2 team members are part-time and paid in equity only.")
line("allow", "Founder allowance ($/founder/month)", [100, 300, 500], USD, inp=True, key=True,
     note="Founders hold equity, so pay is low: transport and phone in Y1, then a small allowance. Cambodia's 2026 garment minimum wage is $210/month for reference.")
line("staff", "Onboarding/support staff (people)", [0, 0, 1], NUM, inp=True, note="Founders do onboarding and support until Year 3.")
line("salary", "Staff salary ($/month)", [500, 500, 500], USD, inp=True, note="Cambodian customer-support roles are reported at about $450-900/month.")

section("INPUTS - sales and marketing")
line("ads", "Facebook ads ($/month)", [100, 300, 600], USD, inp=True, note="Assumption: small targeted budget that grows with the business.")
line("print", "Printed QR stands and flyers ($/year)", [200, 500, 800], USD, inp=True, note="Assumption.")
line("events", "Festival and category campaigns ($/year)", [0, 500, 1000], USD, inp=True, note="Assumption, e.g. Khmer New Year campaigns.")
line("refcredit", "Referral credit per referred paying shop ($)", [5, 5, 5], USD, inp=True, note="One month free for the shop that refers another.")
line("refshare", "Share of new paying shops that come by referral", [0.2, 0.2, 0.2], PCT, inp=True, note="Assumption.")

section("INPUTS - software, office, legal and tax")
line("ai", "AI tools ($/founder/month)", [20, 20, 20], USD, inp=True, note="Claude Pro or ChatGPT Plus, about $20/month each. Code hosting (GitHub) and design tools use free plans.")
line("reg", "Company registration (one-off)", [840, 0, 0], USD, inp=True,
     note="Ministry of Commerce fee about KHR 2,155,000 (~$540) plus ~$300 notary/legal help. Year 1 only.")
line("books", "Bookkeeping and tax filing ($/month)", [0, 50, 100], USD, inp=True, note="Founders in Y1; outsourced accountant from Y2 (assumption).")
line("office", "Coworking desk ($/month)", [0, 0, 150], USD, inp=True, note="Remote/university space until Year 3 (assumption).")
line("ptax", "Tax on profit", [0.2, 0.2, 0.2], PCT, inp=True, note="Cambodia standard rate 20%. Losses carried forward.")
line("mintax", "Minimum tax (% of revenue)", [0.01, 0.01, 0.01], PCT, inp=True,
     note="Cambodia: 1% of turnover if higher than profit tax. Included to be conservative; startup exemptions may apply.")
line("mktsalary", "Market salary check ($/founder/month)", [1000, 1000, 1000], USD, inp=True,
     note="Used only in the sensitivity row: what if founders were paid a typical Phnom Penh developer salary (~$1,000-1,400/month)?")

# ---------------- Calculations ----------------
section("CALCULATIONS")
line("free", "Free-plan shops", ["=@paying*@freeratio"] * 3, NUM1)
line("newpaying", "New paying shops in the year", ["=@paying", "=@paying-B{p}".format(p=ref["paying"]), "=@paying-C{p}".format(p=ref["paying"])], NUM1,
     note="Increase in average paying shops (Year 1 starts from zero).")
line("gmv", "Marketplace sales through Rentify (GMV)", ["=(@paying+@free)*@share*@orders*@aov*@months"] * 3, USD,
     note="Sales value of marketplace orders, not Rentify revenue.")
line("infra", "Infrastructure cost ($/year)", ["=(@vps+@db+@storage+@backup+@email+@lb+@domain)*12"] * 3, USD)

section("P&L - BASE CASE (subscriptions only)")
line("sub", "Subscription revenue", ["=@paying*@price*12"] * 3, USD)
line("cos", "Cost of service (infrastructure)", ["=@infra"] * 3, USD)
line("gp", "Gross profit", ["=@sub-@cos"] * 3, USD, bold=True)
line("team", "Team", ["=@founders*@allow*12+@staff*@salary*12"] * 3, USD)
line("sm", "Sales & marketing", ["=@ads*12+@print+@events+@newpaying*@refshare*@refcredit"] * 3, USD)
line("sol", "Software, office, legal", ["=@ai*@founders*12+@reg+@books*12+@office*12"] * 3, USD)
line("ebit", "Result before tax", ["=@gp-@team-@sm-@sol"] * 3, USD, bold=True)
line("cumebit", "Cumulative result before tax", ["=@ebit", "=B{r}+@ebit", "=C{r}+@ebit"], USD)
ws.cell(row=ref["cumebit"], column=3).value = f"=B{ref['cumebit']}+C{ref['ebit']}"
ws.cell(row=ref["cumebit"], column=4).value = f"=C{ref['cumebit']}+D{ref['ebit']}"
line("tax", "Tax", ["=MAX(@mintax*@sub,@ptax*MAX(0,MIN(@ebit,@cumebit)))"] * 3, USD,
     note="Higher of minimum tax and profit tax; profit tax only on profit left after earlier losses.")
line("net", "Net result", ["=@ebit-@tax"] * 3, USD, bold=True, key=True)
line("cumnet", "Cumulative net result", ["=@net", "=@net", "=@net"], USD)
ws.cell(row=ref["cumnet"], column=3).value = f"=B{ref['cumnet']}+C{ref['net']}"
ws.cell(row=ref["cumnet"], column=4).value = f"=C{ref['cumnet']}+D{ref['net']}"

section("P&L - WITH 3% COMMISSION (upside scenario)")
line("csub", "Subscription revenue", ["=@sub"] * 3, USD)
line("ccom", "Commission revenue", ["=@gmv*@rate"] * 3, USD)
line("crev", "Total revenue", ["=@csub+@ccom"] * 3, USD)
line("ccos", "Cost of service (infrastructure + payment cost)", ["=@infra+@gmv*@payfee"] * 3, USD)
line("cgp", "Gross profit", ["=@crev-@ccos"] * 3, USD, bold=True)
line("copex", "Operating costs (same as base)", ["=@team+@sm+@sol"] * 3, USD)
line("cebit", "Result before tax", ["=@cgp-@copex"] * 3, USD, bold=True)
line("ccum", "Cumulative result before tax", ["=@cebit"] * 3, USD)
ws.cell(row=ref["ccum"], column=3).value = f"=B{ref['ccum']}+C{ref['cebit']}"
ws.cell(row=ref["ccum"], column=4).value = f"=C{ref['ccum']}+D{ref['cebit']}"
line("ctax", "Tax", ["=MAX(@mintax*@crev,@ptax*MAX(0,MIN(@cebit,@ccum)))"] * 3, USD)
line("cnet", "Net result", ["=@cebit-@ctax"] * 3, USD, bold=True, key=True)

section("KEY FIGURES")
line("be", "Break-even paying shops (base case, that year's costs)",
     ["=(@team+@sm+@sol+@cos)/(@price*12)"] * 3, NUM,
     note="Yearly fixed costs / yearly subscription per shop. Infrastructure is treated as fixed at this scale.")
line("besam", "Break-even as share of SAM (65,433 stores)", ["=@be/65433"] * 3, PCT, note="NIS Economic Census 2022, ISIC 4741-4774.")
line("funding", "Funding needed (largest cumulative loss, base case)",
     [f"=-MIN(0,MIN($B${ref['cumnet']}:B{ref['cumnet']}))", f"=-MIN(0,MIN($B${ref['cumnet']}:C{ref['cumnet']}))",
      f"=-MIN(0,MIN($B${ref['cumnet']}:D{ref['cumnet']}))"], USD, note="Cash the team must raise (prize money, grants, savings) before profits cover costs.")
line("sens", "Sensitivity: net result if founders earned market salary",
     ["=@net-@founders*(@mktsalary-@allow)*12*(1-IF(@ebit>0,@ptax,0))"] * 3, USD,
     note="Approximate: base-case net result with founder pay raised to the market-salary check. Shows the model does not depend on unpaid work forever.")

ws.freeze_panes = "B2"
OUT.parent.mkdir(parents=True, exist_ok=True)
wb.save(OUT)
print("wrote", OUT)
