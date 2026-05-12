import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type ReportRow = {
  me: string;
  area: string;
  retailer: string;
  time: string;
  dealerId: string;
  state: {
    objections: string[];
    actionPoints: string[];
    topicsCovered: string[];
    insights: { id: string; tag: string; text: string; summary: string }[];
    feedbackText: string;
    feedbackSummary: string;
  };
};

const reports: ReportRow[] = [
  {
    me: "Aditya Salve", area: "Pune City", retailer: "Deshpande Hardware", time: "2 hours ago", dealerId: "9",
    state: {
      topicsCovered: ["Walked through JK Putty value proposition", "Reviewed current SKU mix and shelf placement"],
      objections: ["pricing", "weak-support"],
      actionPoints: ["Share updated price list and trade scheme by Friday", "Schedule contractor meet at shop next month"],
      insights: [{ id: "i1", tag: "Competition", text: "UltraTech offering 3% extra discount in Pune City this month.", summary: "UltraTech offering 3% extra discount in Pune City this month." }],
      feedbackText: "Service response time has improved but delivery still inconsistent in peak weeks.",
      feedbackSummary: "Service response time has improved but delivery still inconsistent in peak weeks.",
    },
  },
  {
    me: "Shivam K", area: "Wakad", retailer: "Bhagwati Stores", time: "1 day ago", dealerId: "2",
    state: {
      topicsCovered: ["Introduced new JK Wall Putty pack sizes", "Discussed contractor loyalty program"],
      objections: ["no-demand"],
      actionPoints: ["Drop trial stock of 5kg pack next visit", "Connect retailer with 2 active painters in Wakad"],
      insights: [{ id: "i1", tag: "Demand", text: "Housing project demand rising in Wakad sector — 4 retailers report low stock.", summary: "Housing project demand rising in Wakad sector — 4 retailers report low stock." }],
      feedbackText: "Wants more in-shop branding material and a demo session for painters.",
      feedbackSummary: "Needs in-shop branding and painter demo support.",
    },
  },
  {
    me: "Dheeraj M", area: "Baner", retailer: "Madhu Paints & Hardware", time: "2 days ago", dealerId: "6",
    state: {
      topicsCovered: ["Reviewed last quarter offtake vs target", "Aligned on summer scheme communication"],
      objections: ["preference-shift", "stock"],
      actionPoints: ["Resolve pending stock complaint with depot by EoD", "Send WhatsApp creative for summer scheme"],
      insights: [{ id: "i1", tag: "Scheme", text: "Retailers want extension of Putty cashback offer beyond May 15.", summary: "Retailers want extension of Putty cashback offer beyond May 15." }],
      feedbackText: "Happy with relationship but feels JK is losing shelf share to Birla in Baner.",
      feedbackSummary: "Losing shelf share to Birla in Baner — needs counter strategy.",
    },
  },
  {
    me: "Raj Kumar", area: "Kothrud", retailer: "Deep Electricals & Paints", time: "2 days ago", dealerId: "8",
    state: {
      topicsCovered: ["Walked through differentiated service commitment", "Joint planning for next 30 days"],
      objections: ["weak-support"],
      actionPoints: ["ASM to do joint visit with retailer's top 3 contractors", "Set up monthly sales review cadence"],
      insights: [{ id: "i1", tag: "Customer Behavior", text: "Contractors in Kothrud increasingly asking for premium finish products.", summary: "Contractors in Kothrud increasingly asking for premium finish products." }],
      feedbackText: "Strong relationship; wants exclusive pricing for institutional projects he is bidding on.",
      feedbackSummary: "Wants exclusive institutional pricing support.",
    },
  },
  {
    me: "Sagar", area: "Hinjewadi", retailer: "Jai Stores", time: "2 days ago", dealerId: "1",
    state: {
      topicsCovered: ["Discussed entry of Chetak Paints in Hinjewadi", "Reviewed JK product range for IT-park residential demand"],
      objections: ["preference-shift", "pricing"],
      actionPoints: ["Share competitor counter-pitch deck", "Activate retailer for upcoming Hinjewadi housing launch"],
      insights: [{ id: "i1", tag: "Competition", text: "Chetak Paints reps visiting top contractor-focused dealers in Hinjewadi.", summary: "Chetak Paints reps visiting top contractor-focused dealers in Hinjewadi." }],
      feedbackText: "Worried about losing key contractors to Chetak's aggressive scheme push.",
      feedbackSummary: "Concerned about Chetak's contractor push in Hinjewadi.",
    },
  },
];

const heatmap = [
  { area: "Pune City", e1: 25, e1Sub: "50/200 retailers", e2: 80, e3: 80 },
  { area: "Kothrud", e1: 100, e2: 95, e3: 85 },
  { area: "Baner", e1: 90, e2: 85, e3: 85 },
  { area: "Wakad", e1: 95, e2: 95, e3: 95 },
  { area: "Hinjewadi", e1: 5, e2: 0, e3: 0 },
];

// Red background only for low values; green/yellow keep text color but no background.
const heatColor = (v: number) => {
  if (v >= 80) return "text-success";
  if (v >= 40) return "text-warning";
  return "bg-destructive/15 text-destructive";
};

const objections = [
  { name: "Demand related", value: 30, color: "#E24B4A" },
  { name: "Product quality", value: 18, color: "#9FE1CB" },
  { name: "Competition related", value: 16, color: "#1F3A57" },
  { name: "SKU Space related", value: 16, color: "#5B8DBE" },
  { name: "Working Capital related", value: 16, color: "#EF9F27" },
];

const allInsights = [
  { category: "Common · Scheme", title: "Retailers prefer simple schemes over complex tier-structures.", detail: "JK's 4-tier slab + bonus SKU structure is hard for retailers to understand." },
  { category: "Hinjewadi · Competition", title: "Chetak Paints reps targeting our top contractor-focused dealers.", detail: "Three of our retailers report being approached in the last 2 weeks." },
  { category: "Pune · Demand", title: "Housing project demand rising in Hadapsar sector 62–78.", detail: "7 retailers report low stock levels ahead of June–July peak." },
  { category: "Common · Product Quality", title: "Putty settling time complaint raised for 3rd consecutive week.", detail: "Possible batch quality issue, QC escalation pending." },
  { category: "Kothrud · Customer Behavior", title: "Contractors increasingly asking for premium finish products.", detail: "Shift away from economy SKUs across 6 dealers in last month." },
];

const InsightCard = ({ category, title, detail }: { category: string; title: string; detail: string }) => (
  <div className="bg-card border rounded-lg px-3 py-2.5 hover:shadow-sm transition-shadow">
    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
      {category}
    </p>
    <p className="text-[12px] font-bold text-foreground leading-snug mb-1">{title}</p>
    <p className="text-[12px] text-muted-foreground leading-relaxed">{detail}</p>
  </div>
);

const ReportsTable = ({ rows }: { rows: ReportRow[] }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="text-[12px] font-semibold py-2 h-8">ME</TableHead>
        <TableHead className="text-[12px] font-semibold py-2 h-8">Area</TableHead>
        <TableHead className="text-[12px] font-semibold py-2 h-8">Retailer Engaged</TableHead>
        <TableHead className="text-[12px] font-semibold py-2 h-8">Report</TableHead>
        <TableHead className="text-[12px] font-semibold py-2 h-8">Time</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {rows.map((r) => (
        <TableRow key={r.me + r.retailer}>
          <TableCell className="py-2 text-[12px]">{r.me}</TableCell>
          <TableCell className="py-2 text-[12px]">{r.area}</TableCell>
          <TableCell className="py-2 text-[12px]">{r.retailer}</TableCell>
          <TableCell className="py-2 text-[12px]">
            <Link
              to={`/me/visit-summary/${r.dealerId}`}
              state={r.state}
              className="text-primary underline underline-offset-2 hover:no-underline"
            >
              View Report
            </Link>
          </TableCell>
          <TableCell className="py-2 text-[12px] text-muted-foreground">{r.time}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const AsmDashboardNew = () => {
  const navigate = useNavigate();
  const [showAllReports, setShowAllReports] = useState(false);
  const [showAllInsights, setShowAllInsights] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-xl mx-auto px-5 py-3">
        {/* Header */}
        <header className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/")}
              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-[20px] font-bold text-foreground">ASM Reports</h1>
          </div>
        </header>

        {/* Profile block */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-12 w-12 border">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">RK</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-[18px] font-bold text-foreground leading-tight">Ravi Kumar</span>
            <span className="text-[12px] text-muted-foreground leading-tight">ASM, Pune</span>
            <div className="flex gap-1.5 mt-1">
              <span className="text-[11px] bg-muted text-foreground rounded-full px-2 py-0.5">
                Total MEs: <span className="font-semibold">6</span>
              </span>
              <span className="text-[11px] bg-muted text-foreground rounded-full px-2 py-0.5">
                Total Markets: <span className="font-semibold">6</span>
              </span>
            </div>
          </div>
        </div>

        {/* 2x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ height: "calc(100vh - 170px)" }}>
          {/* Card 1 — Engagement Reports */}
          <div className="bg-card border rounded-lg p-3 flex flex-col overflow-hidden">
            <h2 className="text-[15px] font-bold text-foreground">
              1. Engagement Reports{" "}
              <span className="text-[12px] font-normal text-muted-foreground">(Area-level)</span>
            </h2>
            <p className="text-[11px] italic text-muted-foreground mb-2">
              Recent Reports (as on 12th May 2026)
            </p>
            <div className="flex-1 overflow-auto">
              <ReportsTable rows={reports.slice(0, 3)} />
            </div>
            <div className="flex justify-end pt-2">
              <Dialog open={showAllReports} onOpenChange={setShowAllReports}>
                <DialogTrigger asChild>
                  <Button variant="link" size="sm" className="text-primary h-auto p-0 text-[12px]">
                    View more →
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>All Engagement Reports</DialogTitle>
                  </DialogHeader>
                  <div className="max-h-[70vh] overflow-auto">
                    <ReportsTable rows={reports} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Card 2 — Top Retailer Objections */}
          <div className="bg-card border rounded-lg p-3 flex flex-col overflow-hidden">
            <h2 className="text-[15px] font-bold text-foreground mb-2">
              2. Top Retailer Objections{" "}
              <span className="text-[12px] font-normal text-muted-foreground">(in the area)</span>
            </h2>
            <div className="flex-1 min-h-0 grid grid-cols-5 gap-2">
              <div className="col-span-3 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={objections}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      label={({ value }) => `${value}%`}
                      labelLine={false}
                    >
                      {objections.map((o) => (
                        <Cell key={o.name} fill={o.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="col-span-2 flex flex-col justify-center gap-1.5 text-[12px]">
                {objections.map((o) => (
                  <li key={o.name} className="flex items-center gap-2">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ background: o.color }}
                    />
                    <span className="flex-1 truncate">{o.name}</span>
                    <span className="font-semibold text-foreground">{o.value}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card 3 — Heatmap */}
          <div className="bg-card border rounded-lg p-3 flex flex-col overflow-hidden">
            <h2 className="text-[15px] font-bold text-foreground">
              3. Retailer Engagement Coverage Heatmap
            </h2>
            <p className="text-[11px] italic text-muted-foreground mb-2">
              Overall coverage from 12th March till 12th May
            </p>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1.5 pr-2 font-semibold">Area</th>
                    <th className="text-center py-1.5 px-1 font-semibold">
                      Overall Engagement Quality
                    </th>
                    <th className="text-center py-1.5 px-1 font-normal">
                      E1: <span className="font-semibold">Value Prop</span>
                    </th>
                    <th className="text-center py-1.5 px-1 font-normal">
                      E2: <span className="font-semibold">Contractor Base</span>
                    </th>
                    <th className="text-center py-1.5 px-1 font-normal">
                      E3: <span className="font-semibold">Service</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {heatmap.map((row) => {
                    const overall = Math.round((row.e1 + row.e2 + row.e3) / 3);
                    return (
                      <tr key={row.area} className="border-b last:border-0">
                        <td className="py-1.5 pr-2 font-medium">{row.area}</td>
                        <td className="py-1 px-1">
                          <div className={`rounded-md px-2 py-1 text-center font-semibold ${heatColor(overall)}`}>
                            {overall}%
                          </div>
                        </td>
                        {[
                          { v: row.e1, sub: row.e1Sub },
                          { v: row.e2 },
                          { v: row.e3 },
                        ].map((c, i) => (
                          <td key={i} className="py-1 px-1">
                            <div className={`rounded-md px-2 py-1 text-center font-medium ${heatColor(c.v)}`}>
                              <div>{c.v}%</div>
                              {c.sub && (
                                <div className="text-[10px] opacity-70 font-normal">{c.sub}</div>
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card 4 — Key Market Insights */}
          <div className="bg-card border rounded-lg p-3 flex flex-col overflow-hidden">
            <h2 className="text-[15px] font-bold text-foreground mb-2">
              4. Key Market Insights
            </h2>

            <div className="flex-1 overflow-auto space-y-2">
              {allInsights.slice(0, 2).map((it) => (
                <InsightCard key={it.title} {...it} />
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <Dialog open={showAllInsights} onOpenChange={setShowAllInsights}>
                <DialogTrigger asChild>
                  <Button variant="link" size="sm" className="text-primary h-auto p-0 text-[12px]">
                    View all →
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>All Market Insights</DialogTitle>
                  </DialogHeader>
                  <div className="max-h-[70vh] overflow-auto space-y-2">
                    {allInsights.map((it) => (
                      <InsightCard key={it.title} {...it} />
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsmDashboardNew;
