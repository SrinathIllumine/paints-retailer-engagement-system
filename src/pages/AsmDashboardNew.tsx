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
} from "@/components/ui/dialog";

// ---------- Data ----------
const engagementByMonth = [
  { month: "Feb", value: 80 },
  { month: "Mar", value: 85 },
  { month: "Apr", value: 70 },
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
  { name: "Competition Related", value: 45, color: "hsl(var(--primary))" },
  { name: "Product quality", value: 30, color: "hsl(var(--warning))" },
  { name: "Scheme related", value: 9, color: "hsl(217 70% 55%)" },
  { name: "SKU Space related", value: 7, color: "hsl(160 50% 45%)" },
  { name: "Working Capital related", value: 3, color: "hsl(280 40% 55%)" },
];

const leaderboard: {
  me: string;
  area: string;
  eq: Level;
  sales: Level;
  status: { label: string; tone: "success" | "warning" | "destructive" | "destructive-strong" };
}[] = [
  { me: "Aditya Salve", area: "Pune City", eq: "HIGH", sales: "HIGH", status: { label: "Top Performer", tone: "success" } },
  { me: "Shivam K", area: "Wakad", eq: "MODERATE", sales: "HIGH", status: { label: "Can Improve", tone: "warning" } },
  { me: "Dheeraj M", area: "Baner", eq: "LOW", sales: "MODERATE", status: { label: "Needs significant Improvement", tone: "destructive" } },
  { me: "Raj Kumar", area: "Kothrud", eq: "LOW", sales: "MODERATE", status: { label: "Needs significant Improvement", tone: "destructive" } },
  { me: "Sagar", area: "Hinjewadi", eq: "LOW", sales: "LOW", status: { label: "Needs immediate attention", tone: "destructive-strong" } },
];

// ---------- Helpers ----------
const levelClasses = (l: Level) => {
  if (l === "HIGH") return "bg-success/15 text-success";
  if (l === "MODERATE") return "bg-warning/15 text-warning";
  return "bg-destructive/15 text-destructive";
};

const Pill = ({ level, children }: { level: Level; children: React.ReactNode }) => (
  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${levelClasses(level)}`}>
    {children}
  </span>
);

const StatusPill = ({ tone, label }: { tone: "success" | "warning" | "destructive" | "destructive-strong"; label: string }) => {
  const cls =
    tone === "success"
      ? "bg-success/15 text-success"
      : tone === "warning"
        ? "bg-warning/15 text-warning"
        : tone === "destructive"
          ? "bg-destructive/15 text-destructive"
          : "bg-destructive text-destructive-foreground";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cls}`}>
      {label}
    </span>
  );
};

const RedCta = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="text-[12px] font-semibold text-destructive hover:underline underline-offset-2"
  >
    {children}
  </button>
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
        <p className="text-[12px] text-muted-foreground mb-3 ml-8">
          Ravi Kumar, ASM, Pune <span className="mx-1.5 text-border">|</span> Team of 6 MEs{" "}
          <span className="mx-1.5 text-border">|</span> 6 markets
        </p>

        {/* 2x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ height: "calc(100vh - 110px)" }}>
          {/* SECTION 1 — Engagement Quality bar chart */}
          <div className="bg-card border rounded-lg p-3 flex flex-col overflow-hidden">
            <h2 className="text-[14px] font-bold text-foreground leading-snug">
              1. What is the quality of retailer engagement by MEs in Pune?
            </h2>
            <div className="flex-1 min-h-0 mt-2 relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementByMonth} margin={{ top: 20, right: 90, left: 10, bottom: 5 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                  >
                    <Label
                      value="Engagement Quality"
                      angle={-90}
                      position="insideLeft"
                      style={{ textAnchor: "middle", fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    />
                  </YAxis>
                  <ReferenceLine
                    y={80}
                    stroke="hsl(var(--muted-foreground))"
                    strokeDasharray="4 4"
                  >
                    <Label
                      value="Company Benchmark"
                      position="right"
                      style={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    />
                  </ReferenceLine>
                  <Bar
                    dataKey="value"
                    fill="hsl(210 75% 70%)"
                    radius={[4, 4, 0, 0]}
                    label={{ position: "top", fontSize: 11, fill: "hsl(var(--foreground))", formatter: (v: number) => `${v}%` }}
                    barSize={55}
                  />
                </BarChart>
              </ResponsiveContainer>
              {/* Arrow annotation Mar -> Apr */}
              <div className="pointer-events-none absolute right-[24%] top-[20%] flex items-center gap-1 text-destructive">
                <TrendingDown className="w-4 h-4" />
                <span className="text-[10px] font-semibold">Decline</span>
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <RedCta onClick={() => setOpenEq(true)}>Click to view →</RedCta>
            </div>
          </div>

          {/* SECTION 2 — Collated insights */}
          <div className="bg-card border rounded-lg p-3 flex flex-col overflow-hidden">
            <h2 className="text-[14px] font-bold text-foreground leading-snug mb-2">
              2. Collated insights from across markets in Pune
            </h2>
            <div className="flex-1 overflow-auto space-y-2.5 pr-1 text-[12px]">
              <div className="border-l-2 border-primary pl-2.5">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-0.5">
                  Competition-related
                </p>
                <p className="font-semibold text-foreground leading-snug">
                  Local sales representatives from Chetak Paints (new local competitor) are visiting our top contractor-focused dealers.
                </p>
                <p className="text-muted-foreground leading-snug mt-0.5">
                  Three of our retailers report being approached in the last 2 weeks.
                </p>
              </div>
              <div className="border-l-2 border-warning pl-2.5">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-0.5">
                  Packaging-related
                </p>
                <p className="font-semibold text-foreground leading-snug">
                  Retailers pull back on JK Putty orders over packaging concerns.
                </p>
                <p className="text-muted-foreground leading-snug mt-0.5">
                  JK Putty's single-layer packaging fails to withstand high moisture levels during the monsoon, leading to rapid deterioration in quality.
                </p>
              </div>
              <div className="border-l-2 border-success pl-2.5">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-0.5">
                  Scheme-related
                </p>
                <p className="font-semibold text-foreground leading-snug">
                  Mid-tier retailers want better schemes.
                </p>
                <p className="text-muted-foreground leading-snug mt-0.5">
                  Majority (i.e. mid-tier) retailers want a points-based scheme with quarterly redemption. Current scheme is volume-locked and discourages mid-tier retailers.
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <RedCta onClick={() => setOpenInsights(true)}>See All 10 Insights →</RedCta>
            </div>
          </div>

          {/* SECTION 3 — Objections pie */}
          <div className="bg-card border rounded-lg p-3 flex flex-col overflow-hidden">
            <h2 className="text-[14px] font-bold text-foreground leading-snug">
              3. Top Retailer Objections{" "}
              <span className="text-[12px] font-normal text-muted-foreground">(in the area)</span>
            </h2>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 10, right: 80, left: 80, bottom: 10 }}>
                  <Pie
                    data={objections}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    label={({ name, value }) => `${name} ${value}%`}
                    labelLine
                  >
                    {objections.map((o) => (
                      <Cell key={o.name} fill={o.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-end pt-1">
              <RedCta onClick={() => setOpenObjections(true)}>See top 5 objections in the area →</RedCta>
            </div>
          </div>

          {/* SECTION 4 — ME Leaderboard */}
          <div className="bg-card border rounded-lg p-3 flex flex-col overflow-hidden">
            <h2 className="text-[14px] font-bold text-foreground leading-snug mb-2">
              4. ME Leaderboard w.r.t Sales & Engagement Levels
            </h2>
            <div className="flex-1 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[11px] font-semibold py-2 h-8 w-8">#</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 h-8">ME</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 h-8">Area</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 h-8">Engagement Quality</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 h-8">Sales Growth</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 h-8">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard.map((r, i) => (
                    <TableRow key={r.me}>
                      <TableCell className="py-2 text-[12px] text-muted-foreground">{i + 1}</TableCell>
                      <TableCell className="py-2 text-[12px] font-medium">{r.me}</TableCell>
                      <TableCell className="py-2 text-[12px]">{r.area}</TableCell>
                      <TableCell className="py-2 text-[12px]"><Pill level={r.eq}>{r.eq}</Pill></TableCell>
                      <TableCell className="py-2 text-[12px]"><Pill level={r.sales}>{r.sales}</Pill></TableCell>
                      <TableCell className="py-2 text-[12px]"><StatusPill tone={r.status.tone} label={r.status.label} /></TableCell>
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
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Detailed list of MEs &amp; Engagement Quality</DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[12px] font-semibold">ME</TableHead>
                  <TableHead className="text-[12px] font-semibold">Area</TableHead>
                  <TableHead className="text-[12px] font-semibold">No. of retailers covered</TableHead>
                  <TableHead className="text-[12px] font-semibold">Overall Engagement Quality</TableHead>
                  <TableHead className="text-[12px] font-semibold">Avg. Time Spent</TableHead>
                  <TableHead className="text-[12px] font-semibold">Preparation levels</TableHead>
                  <TableHead className="text-[12px] font-semibold">Discussion Points Covered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meDetail.map((r) => (
                  <TableRow key={r.me}>
                    <TableCell className="text-[12px] font-medium">{r.me}</TableCell>
                    <TableCell className="text-[12px]">{r.area}</TableCell>
                    <TableCell className="text-[12px]">{r.covered}</TableCell>
                    <TableCell className="text-[12px]"><Pill level={r.eq.level}>{r.eq.label}</Pill></TableCell>
                    <TableCell className="text-[12px]"><Pill level={r.time.level}>{r.time.label}</Pill></TableCell>
                    <TableCell className="text-[12px]"><Pill level={r.prep}>{r.prep}</Pill></TableCell>
                    <TableCell className="text-[12px]"><Pill level={r.discussion}>{r.discussion}</Pill></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== Section 2 popup ===== */}
      <Dialog open={openInsights} onOpenChange={setOpenInsights}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Insights from the Market</DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-auto space-y-5 text-[13px] pr-1">
            {[
              {
                num: 1,
                title: "Competition Related",
                items: [
                  {
                    h: "Chetak Paints aggressively entering Panvel",
                    p: "Local sales reps from Chetak are visiting our top contractor-focused dealers. Three of our retailers report being approached in the last 2 weeks.",
                  },
                  {
                    h: "Birla Opus piloting EMI payments for retailers",
                    p: "Birla offering 30/60/90 day EMI on bulk orders. Two retailers have already signed up. Particularly attractive to declining retailers with working-capital pressure.",
                  },
                  {
                    h: "Asian Paints is locking-in retailers with Putty SKUs by bundling with Paints",
                    p: "Sudden spike in Asian Paints Putty SKUs in Pimpri Chinchwad. Retailers are getting attractive schemes on Paints only if they buy bundled Putty purchases above 50 bags. Our retailers report this is changing their decision on monthly putty orders.",
                  },
                ],
              },
              {
                num: 2,
                title: "Product Quality",
                items: [
                  {
                    h: "Retailers pull back on JK Putty orders over packaging concerns",
                    p: "Ahead of the monsoon season, retailers are signaling reluctance to stock JK Putty due to ongoing packaging issues. They report that the product's single-layer packaging fails to withstand high moisture levels during the monsoon, leading to rapid deterioration in quality and rendering the product unusable.",
                  },
                  {
                    h: "[Positive Feedback] JK Paint Users Happy with Shade Consistencies – This can be part of core value proposition / campaigns",
                    p: "Painters are highlighting consistent coverage and zero shade variation in JK Paint products. This is leading to optimal material consumption & even finish, especially on larger surfaces. This can be part of our core value proposition – or ad campaigns.",
                  },
                ],
              },
              {
                num: 3,
                title: "Schemes Related",
                items: [
                  {
                    h: "Retailers are asking for simpler retailer scheme structures (instead of multi-tier incentive mechanisms)",
                    p: "Retailers are preferring schemes that are simple with less complex tier-structures (instead of complex-schemes with which run into multiple pages — for e.g. Retailers say JK's 4-tier slab + bonus SKU structure is hard to explain to contractors.",
                  },
                  {
                    h: "Mid-tier retailers want better schemes",
                    p: "Majority (i.e. mid-tier) retailers want a points-based scheme with quarterly redemption. Current scheme is volume-locked and discourages mid-tier retailers.",
                  },
                ],
              },
              {
                num: 4,
                title: "Contractor Related",
                items: [
                  {
                    h: "Many Contractors in Pune are using JK Putty finish for 'premium interior repaint jobs' — (other locations can also leverage this insight)",
                    p: "Contractors report choosing JK Putty more often in repainting of premium flats and bungalows where homeowners are sensitive to wall feel and lighting appearance. Helps them achieve a cleaner final paint finish with fewer visible surface marks.",
                  },
                  {
                    h: "Contractor buying behaviour: smaller, more frequent orders",
                    p: "Contractors are placing 2–3 smaller orders per month instead of one large one. Driven by cash-flow caution. Affects our minimum-order incentives.",
                  },
                ],
              },
              {
                num: 5,
                title: "Demand Related",
                items: [{ h: "No change – already reflected.", p: "" }],
              },
            ].map((sec) => (
              <section key={sec.num}>
                <h3 className="text-[14px] font-bold text-foreground mb-2">
                  {sec.num}. {sec.title}:
                </h3>
                <ol className="list-[lower-alpha] pl-5 space-y-2.5">
                  {sec.items.map((it, idx) => (
                    <li key={idx}>
                      <p className="font-semibold text-foreground leading-snug">{it.h}</p>
                      {it.p && <p className="text-muted-foreground leading-snug mt-0.5">{it.p}</p>}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Top 5 objections in Pune</DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-auto space-y-5 text-[13px] pr-1">
            {[
              {
                cat: "COMPETITION-RELATED",
                items: [
                  { q: "Competitor schemes are more visible and frequent.", e: "Retailers feel other brands are more active with scratch cards, gifts, or painter rewards." },
                  { q: "Customers recognize competitor paint shades faster.", e: "Strong tinting/touchpoint presence from larger paint brands." },
                  { q: "Competitors are doing more painter meets and site activities.", e: "Retailers feel JK's activation has become weak compared to others." },
                ],
              },
              {
                cat: "PRODUCT-QUALITY RELATED",
                items: [
                  { q: "Retailers feel product consistency changes batch-to-batch.", e: "Especially around workability, smoothness, or drying behavior in putty." },
                ],
              },
              {
                cat: "SCHEME-RELATED",
                items: [
                  { q: "Schemes are either unclear or not exciting enough.", e: "Retailers want simpler, faster, and more visible benefits tied to movement." },
                ],
              },
            ].map((sec) => (
              <section key={sec.cat}>
                <h3 className="text-[11px] font-bold tracking-wider text-foreground mb-2">{sec.cat}</h3>
                <ul className="space-y-2.5">
                  {sec.items.map((it, idx) => (
                    <li key={idx}>
                      <p className="font-semibold text-foreground italic leading-snug">"{it.q}"</p>
                      <p className="text-muted-foreground leading-snug mt-0.5">{it.e}</p>
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
