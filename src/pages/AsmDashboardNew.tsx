import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingDown } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Label,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// ---------- Palette (matches ASM Analytics components) ----------
const PALETTE = {
  green: { bar: "#1D9E75", bg: "#E1F5EE", text: "#085041" },
  orange: { bar: "#BA7517", bg: "#FAEEDA", text: "#412402" },
  red: { bar: "#E24B4A", bg: "#FCEBEB", text: "#501313" },
  blue: "#378ADD",
  amber: "#EF9F27",
  rust: "#D85A30",
};

// ---------- Data ----------
const engagementByMonth: { month: string; value: number; tier: "green" | "orange" | "red" }[] = [
  { month: "Feb", value: 80, tier: "green" },
  { month: "Mar", value: 85, tier: "green" },
  { month: "Apr", value: 70, tier: "orange" },
];

type Level = "HIGH" | "MODERATE" | "LOW";
const meDetail: {
  me: string;
  area: string;
  covered: string;
  eq: { label: string; level: Level };
  time: { label: string; level: Level };
  prep: Level;
  discussion: Level;
}[] = [
  { me: "Aditya Salve", area: "Pune City", covered: "120/200", eq: { label: "9/10", level: "HIGH" }, time: { label: "HIGH (15 minutes)", level: "HIGH" }, prep: "HIGH", discussion: "HIGH" },
  { me: "Shivam K", area: "Wakad", covered: "100/200", eq: { label: "4/10", level: "LOW" }, time: { label: "LOW (2 minutes)", level: "LOW" }, prep: "LOW", discussion: "LOW" },
  { me: "Dheeraj M", area: "Baner", covered: "150/200", eq: { label: "6.5/10", level: "MODERATE" }, time: { label: "MODERATE (8 minutes)", level: "MODERATE" }, prep: "LOW", discussion: "MODERATE" },
  { me: "Raj Kumar", area: "Kothrud", covered: "190/200", eq: { label: "9/10", level: "HIGH" }, time: { label: "HIGH (15 minutes)", level: "HIGH" }, prep: "HIGH", discussion: "HIGH" },
  { me: "Sagar", area: "Hinjewadi", covered: "180/200", eq: { label: "9.5/10", level: "HIGH" }, time: { label: "HIGH (15 minutes)", level: "HIGH" }, prep: "HIGH", discussion: "HIGH" },
];

const objections = [
  { name: "Competition Related", value: 45, color: PALETTE.green.bar },
  { name: "Product quality", value: 30, color: PALETTE.red.bar },
  { name: "Scheme related", value: 9, color: PALETTE.amber },
  { name: "SKU Space related", value: 7, color: PALETTE.blue },
  { name: "Working Capital related", value: 3, color: PALETTE.rust },
];

const leaderboard: {
  me: string;
  area: string;
  eq: Level;
  sales: Level;
  status: { label: string; tone: "green" | "orange" | "red" | "red-strong" };
}[] = [
  { me: "Aditya Salve", area: "Pune City", eq: "HIGH", sales: "HIGH", status: { label: "Top Performer", tone: "green" } },
  { me: "Shivam K", area: "Wakad", eq: "MODERATE", sales: "HIGH", status: { label: "Can Improve", tone: "orange" } },
  { me: "Dheeraj M", area: "Baner", eq: "LOW", sales: "MODERATE", status: { label: "Needs significant Improvement", tone: "red" } },
  { me: "Raj Kumar", area: "Kothrud", eq: "LOW", sales: "MODERATE", status: { label: "Needs significant Improvement", tone: "red" } },
  { me: "Sagar", area: "Hinjewadi", eq: "LOW", sales: "LOW", status: { label: "Needs immediate attention", tone: "red-strong" } },
];

// ---------- Helpers ----------
const tier = (l: Level) => (l === "HIGH" ? PALETTE.green : l === "MODERATE" ? PALETTE.orange : PALETTE.red);

const levelText = (l: Level) =>
  l === "HIGH" ? "text-[#1D9E75]" : l === "MODERATE" ? "text-[#BA7517]" : "text-[#E24B4A]";

const TierPill = ({ level, children }: { level: Level; children: React.ReactNode }) => {
  const t = tier(level);
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{ background: t.bg, color: t.text }}
    >
      {children}
    </span>
  );
};

const StatusText = ({ tone, label }: { tone: "green" | "orange" | "red" | "red-strong"; label: string }) => {
  const dot =
    tone === "green" ? PALETTE.green.bar
      : tone === "orange" ? PALETTE.orange.bar
      : PALETTE.red.bar;
  const cls =
    tone === "green" ? "text-[#1D9E75]"
      : tone === "orange" ? "text-[#BA7517]"
      : "text-[#E24B4A]";
  return (
    <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium ${cls} ${tone === "red-strong" ? "font-semibold" : ""}`}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dot }} />
      {label}
    </span>
  );
};

const RedCta = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="text-[11px] font-medium text-destructive hover:underline underline-offset-2"
  >
    {children}
  </button>
);

const SectionHead = ({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) => (
  <div className="mb-3">
    <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">{eyebrow}</p>
    <h2 className="text-[15px] font-medium text-foreground leading-snug">{title}</h2>
    {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
  </div>
);

// ---------- Page ----------
const AsmDashboardNew = () => {
  const navigate = useNavigate();
  const [openEq, setOpenEq] = useState(false);
  const [openInsights, setOpenInsights] = useState(false);
  const [openObjections, setOpenObjections] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-xl mx-auto px-5 py-3">
        {/* Header */}
        <header className="flex items-center gap-2 mb-1">
          <button
            onClick={() => navigate("/")}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-[20px] font-bold text-foreground">ASM Reports</h1>
        </header>
        <p className="text-sm font-semibold text-foreground mb-4 ml-8">
          Ravi Kumar, ASM, Pune
          <span className="mx-2 text-muted-foreground/40 font-normal">|</span>
          Team of 6 MEs
          <span className="mx-2 text-muted-foreground/40 font-normal">|</span>
          6 markets
        </p>

        {/* 2x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ height: "calc(100vh - 120px)" }}>
          {/* SECTION 1 — Engagement Quality bar chart */}
          <div className="bg-card border rounded-lg p-4 flex flex-col overflow-hidden">
            <SectionHead
              eyebrow="01 · Engagement Quality"
              title="Quality of retailer engagement by MEs in Pune"
              sub="Monthly trend vs company benchmark"
            />
            <div className="flex-1 min-h-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementByMonth} margin={{ top: 24, right: 100, left: 0, bottom: 5 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                    width={36}
                  />
                  <ReferenceLine y={80} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4">
                    <Label
                      value="Company Benchmark"
                      position="right"
                      style={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    />
                  </ReferenceLine>
                  <Bar
                    dataKey="value"
                    radius={[4, 4, 0, 0]}
                    label={{ position: "top", fontSize: 11, fill: "hsl(var(--foreground))", formatter: (v: number) => `${v}%` }}
                    barSize={48}
                  >
                    {engagementByMonth.map((d) => (
                      <Cell key={d.month} fill={PALETTE[d.tier].bar} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div
                className="pointer-events-none absolute flex items-center gap-1 px-1.5 py-0.5 rounded"
                style={{ right: 110, top: 8, background: PALETTE.red.bg, color: PALETTE.red.text }}
              >
                <TrendingDown className="w-3 h-3" />
                <span className="text-[10px] font-semibold">Decline</span>
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <RedCta onClick={() => setOpenEq(true)}>Click to view detailed list →</RedCta>
            </div>
          </div>

          {/* SECTION 2 — Collated insights */}
          <div className="bg-card border rounded-lg p-4 flex flex-col overflow-hidden">
            <SectionHead
              eyebrow="02 · Market Insights"
              title="Collated insights from across markets in Pune"
              sub="3 of 10 shown · click below to view all"
            />
            <div className="flex-1 overflow-auto pr-1">
              {[
                { dot: PALETTE.green.bar, cat: "Competition", catBg: PALETTE.green.bg, catText: PALETTE.green.text,
                  h: "Local sales reps from Chetak Paints (new local competitor) are visiting our top contractor-focused dealers.",
                  p: "Three of our retailers report being approached in the last 2 weeks." },
                { dot: PALETTE.orange.bar, cat: "Packaging", catBg: PALETTE.orange.bg, catText: PALETTE.orange.text,
                  h: "Retailers pull back on our Primer orders over packaging concerns.",
                  p: "Our Primer's single-layer packaging fails to withstand high moisture levels during the monsoon, leading to rapid deterioration in quality." },
                { dot: PALETTE.blue, cat: "Scheme", catBg: "#E6F1FB", catText: "#042C53",
                  h: "Mid-tier retailers want better schemes.",
                  p: "Majority (i.e. mid-tier) retailers want a points-based scheme with quarterly redemption. Current scheme is volume-locked and discourages mid-tier retailers." },
              ].map((it, i) => (
                <div key={i} className="flex gap-2.5 py-2.5 border-t first:border-t-0">
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: it.dot }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <p className="text-[12px] font-medium text-foreground leading-snug">{it.h}</p>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0"
                        style={{ background: it.catBg, color: it.catText }}
                      >
                        {it.cat}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">{it.p}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <RedCta onClick={() => setOpenInsights(true)}>See all 10 insights →</RedCta>
            </div>
          </div>

          {/* SECTION 3 — Objections donut + legend */}
          <div className="bg-card border rounded-lg p-4 flex flex-col overflow-hidden">
            <SectionHead
              eyebrow="03 · Retailer Objections"
              title="Top retailer objections in the area"
              sub="Share of objections raised by category"
            />
            <div className="flex-1 min-h-0 grid grid-cols-[140px_1fr] gap-3 items-center">
              <div className="h-full max-h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={objections}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius="55%"
                      outerRadius="95%"
                      paddingAngle={1}
                      stroke="none"
                    >
                      {objections.map((o) => (
                        <Cell key={o.name} fill={o.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="overflow-auto">
                {objections.map((o) => (
                  <div key={o.name} className="flex justify-between items-center text-[12px] border-t first:border-t-0 py-1.5">
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: o.color }} />
                      <span className="text-foreground truncate">{o.name}</span>
                    </span>
                    <span className="font-medium text-foreground ml-2">{o.value}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <RedCta onClick={() => setOpenObjections(true)}>See top 5 objections in the area →</RedCta>
            </div>
          </div>

          {/* SECTION 4 — ME Leaderboard */}
          <div className="bg-card border rounded-lg p-4 flex flex-col overflow-hidden">
            <SectionHead
              eyebrow="04 · ME Leaderboard"
              title="ME leaderboard w.r.t. sales & engagement levels"
            />
            <div className="flex-1 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium py-2 h-8 w-8">#</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium py-2 h-8">ME</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium py-2 h-8">Area</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium py-2 h-8">Engagement Quality</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium py-2 h-8">Sales Growth</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium py-2 h-8">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard.map((r, i) => (
                    <TableRow key={r.me} className="hover:bg-muted/40">
                      <TableCell className="py-2 text-[12px] text-muted-foreground">{i + 1}</TableCell>
                      <TableCell className="py-2 text-[12px] font-medium text-foreground">{r.me}</TableCell>
                      <TableCell className="py-2 text-[12px] text-muted-foreground">{r.area}</TableCell>
                      <TableCell className={`py-2 text-[12px] font-semibold ${levelText(r.eq)}`}>{r.eq}</TableCell>
                      <TableCell className={`py-2 text-[12px] font-semibold ${levelText(r.sales)}`}>{r.sales}</TableCell>
                      <TableCell className="py-2"><StatusText tone={r.status.tone} label={r.status.label} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Section 1 popup ===== */}
      <Dialog open={openEq} onOpenChange={setOpenEq}>
        <DialogContent className="max-w-5xl bg-card text-foreground border-border p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">
              Detailed list of MEs &amp; Engagement Quality
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Pune region · April performance
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-auto mt-2">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {["ME", "Area", "Retailers covered", "Overall EQ", "Avg. time spent", "Preparation", "Discussion points"].map((h) => (
                    <TableHead key={h} className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {meDetail.map((r, idx) => (
                  <TableRow key={r.me} className={idx % 2 === 1 ? "bg-muted/30 hover:bg-muted/40" : "hover:bg-muted/40"}>
                    <TableCell className="text-[12px] font-medium text-foreground">{r.me}</TableCell>
                    <TableCell className="text-[12px] text-muted-foreground">{r.area}</TableCell>
                    <TableCell className="text-[12px] text-foreground">{r.covered}</TableCell>
                    <TableCell className="text-[12px]"><TierPill level={r.eq.level}>{r.eq.label}</TierPill></TableCell>
                    <TableCell className={`text-[12px] font-medium ${levelText(r.time.level)}`}>{r.time.label}</TableCell>
                    <TableCell className={`text-[12px] font-semibold ${levelText(r.prep)}`}>{r.prep}</TableCell>
                    <TableCell className={`text-[12px] font-semibold ${levelText(r.discussion)}`}>{r.discussion}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== Section 2 popup ===== */}
      <Dialog open={openInsights} onOpenChange={setOpenInsights}>
        <DialogContent className="max-w-3xl bg-card text-foreground border-border p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">Insights from the Market</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Aggregated signals across Pune retailer visits
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[72vh] overflow-auto pr-1 mt-2 space-y-7">
            {[
              {
                num: 1, title: "Competition Related",
                items: [
                  { h: "Chetak Paints aggressively entering Panvel", p: "Local sales reps from Chetak are visiting our top contractor-focused dealers. Three of our retailers report being approached in the last 2 weeks." },
                  { h: "Birla Opus piloting EMI payments for retailers", p: "Birla offering 30/60/90 day EMI on bulk orders. Two retailers have already signed up. Particularly attractive to declining retailers with working-capital pressure." },
                  { h: "Asian Paints is locking-in retailers with Primer SKUs by bundling with Paints", p: "Sudden spike in Asian Paints Primer SKUs in Pimpri Chinchwad. Retailers are getting attractive schemes on Paints only if they buy bundled Primer purchases above 50 units. Our retailers report this is changing their decision on monthly primer orders." },
                ],
              },
              {
                num: 2, title: "Product Quality",
                items: [
                  { h: "Retailers pull back on our Primer orders over packaging concerns", p: "Ahead of the monsoon season, retailers are signaling reluctance to stock our Primer due to ongoing packaging issues. They report that the product's single-layer packaging fails to withstand high moisture levels during the monsoon, leading to rapid deterioration in quality and rendering the product unusable." },
                  { h: "[Positive Feedback] Our Paint Users Happy with Shade Consistencies – This can be part of core value proposition / campaigns", p: "Painters are highlighting consistent coverage and zero shade variation in our paint products. This is leading to optimal material consumption & even finish, especially on larger surfaces. This can be part of our core value proposition – or ad campaigns." },
                ],
              },
              {
                num: 3, title: "Schemes Related",
                items: [
                  { h: "Retailers are asking for simpler retailer scheme structures (instead of multi-tier incentive mechanisms)", p: "Retailers are preferring schemes that are simple with less complex tier-structures (instead of complex-schemes with which run into multiple pages — for e.g. Retailers say our 4-tier slab + bonus SKU structure is hard to explain to contractors." },
                  { h: "Mid-tier retailers want better schemes", p: "Majority (i.e. mid-tier) retailers want a points-based scheme with quarterly redemption. Current scheme is volume-locked and discourages mid-tier retailers." },
                ],
              },
              {
                num: 4, title: "Contractor Related",
                items: [
                  { h: "Many Contractors in Pune are switching to our Primer for 'premium interior repaint jobs' — (other locations can also leverage this insight)", p: "Contractors report choosing our Primer more often in repainting of premium flats and bungalows where homeowners are sensitive to wall feel and lighting appearance. Helps them achieve a cleaner final paint finish with fewer visible surface marks." },
                  { h: "Contractor buying behaviour: smaller, more frequent orders", p: "Contractors are placing 2–3 smaller orders per month instead of one large one. Driven by cash-flow caution. Affects our minimum-order incentives." },
                ],
              },
              {
                num: 5, title: "Demand Related",
                items: [{ h: "No change – already reflected.", p: "" }],
              },
            ].map((sec) => (
              <section key={sec.num} className="grid md:grid-cols-[180px_1fr] gap-4 pb-5 border-b last:border-b-0">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Section {sec.num}</p>
                  <h3 className="text-[14px] font-semibold text-foreground mt-0.5">{sec.title}</h3>
                </div>
                <ol className="space-y-4">
                  {sec.items.map((it, idx) => (
                    <li key={idx}>
                      <p className="text-[13px] font-medium text-foreground leading-snug">{it.h}</p>
                      {it.p && <p className="text-[12px] text-muted-foreground leading-relaxed mt-1">{it.p}</p>}
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== Section 3 popup ===== */}
      <Dialog open={openObjections} onOpenChange={setOpenObjections}>
        <DialogContent className="max-w-2xl bg-card text-foreground border-border p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">Top 5 objections in Pune</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Most frequently raised retailer concerns this period
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[72vh] overflow-auto pr-1 mt-2 space-y-6">
            {[
              {
                cat: "Competition-related", color: PALETTE.green.bar,
                items: [
                  { q: "Competitor schemes are more visible and frequent.", e: "Retailers feel other brands are more active with scratch cards, gifts, or painter rewards." },
                  { q: "Customers recognize competitor paint shades faster.", e: "Strong tinting/touchpoint presence from larger paint brands." },
                  { q: "Competitors are doing more painter meets and site activities.", e: "Retailers feel our activation has become weak compared to others." },
                ],
              },
              {
                cat: "Product-quality related", color: PALETTE.red.bar,
                items: [
                  { q: "Retailers feel product consistency changes batch-to-batch.", e: "Especially around workability, smoothness, or drying behavior in the primer." },
                ],
              },
              {
                cat: "Scheme-related", color: PALETTE.amber,
                items: [
                  { q: "Schemes are either unclear or not exciting enough.", e: "Retailers want simpler, faster, and more visible benefits tied to movement." },
                ],
              },
            ].map((sec) => (
              <section key={sec.cat}>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium mb-2">{sec.cat}</p>
                <ul className="space-y-3">
                  {sec.items.map((it, idx) => (
                    <li key={idx} className="pl-3 border-l-2" style={{ borderColor: sec.color }}>
                      <p className="text-[13px] font-medium text-foreground leading-snug">"{it.q}"</p>
                      <p className="text-[12px] text-muted-foreground leading-relaxed mt-0.5">{it.e}</p>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AsmDashboardNew;
