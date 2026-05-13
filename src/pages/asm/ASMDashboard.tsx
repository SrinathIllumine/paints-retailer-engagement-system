import { useState } from "react";
import ASMLayout from "@/components/asm/ASMLayout";
import { Card } from "@/components/ui/card";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Label,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import asmPhoto from "@/assets/asm-rajesh.jpg";

type Tier = "high" | "moderate" | "low";

const tierFill: Record<Tier, string> = {
  high: "hsl(var(--success))",
  moderate: "hsl(var(--warning))",
  low: "hsl(var(--destructive))",
};

const tierPill: Record<Tier, string> = {
  high: "bg-success/10 text-success",
  moderate: "bg-warning/10 text-warning",
  low: "bg-destructive/10 text-destructive",
};

const tierFromValue = (v: number): Tier =>
  v >= 80 ? "high" : v >= 60 ? "moderate" : "low";

// Engagement quality by market area (sourced from AsmDashboardNew meDetail)
const engagementByArea = [
  { area: "Pune City", value: 90 },
  { area: "Wakad", value: 40 },
  { area: "Baner", value: 65 },
  { area: "Yerwada", value: 70 },
  { area: "Kothrud", value: 90 },
  { area: "Hinjewadi", value: 95 },
].map((d) => ({ ...d, tier: tierFromValue(d.value) }));

interface MeDetailRow {
  area: string;
  me: string;
  covered: string;
  eq: { label: string; tier: Tier };
  time: { label: string; tier: Tier };
  prep: Tier;
}

const meDetail: MeDetailRow[] = [
  { area: "Pune City", me: "Aditya Salve", covered: "120/200", eq: { label: "9/10", tier: "high" }, time: { label: "15 min", tier: "high" }, prep: "high" },
  { area: "Wakad",     me: "Shivam K",     covered: "100/200", eq: { label: "4/10", tier: "low" },  time: { label: "2 min",  tier: "low" },  prep: "low" },
  { area: "Baner",     me: "Dheeraj M",    covered: "150/200", eq: { label: "6.5/10", tier: "moderate" }, time: { label: "8 min", tier: "moderate" }, prep: "low" },
  { area: "Kothrud",   me: "Raj Kumar",    covered: "190/200", eq: { label: "9/10", tier: "high" }, time: { label: "15 min", tier: "high" }, prep: "high" },
  { area: "Yerwada",   me: "Mayank",       covered: "160/200", eq: { label: "7/10", tier: "moderate" }, time: { label: "9 min", tier: "moderate" }, prep: "low" },
  { area: "Hinjewadi", me: "Sagar",        covered: "180/200", eq: { label: "9.5/10", tier: "high" }, time: { label: "15 min", tier: "high" }, prep: "high" },
];

const Pill = ({ tier, children }: { tier: Tier; children: React.ReactNode }) => (
  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tierPill[tier]}`}>
    {children}
  </span>
);

const ASMDashboard = () => {
  const [openDetail, setOpenDetail] = useState(false);

  return (
    <ASMLayout hideFilters>
      <div className="space-y-6">
        {/* A. ASM Identity Header */}
        <Card className="p-5 flex items-center gap-4 flex-wrap">
          <Avatar className="h-16 w-16 ring-2 ring-primary/20">
            <AvatarImage src={asmPhoto} alt="Rajesh Kumar" />
            <AvatarFallback>RK</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h1 className="font-display font-bold text-xl text-foreground">
              Rajesh Kumar
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              ASM · Pune Region · Maharashtra
            </p>
          </div>
          <div className="flex items-center gap-6 text-right">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Team</p>
              <p className="text-sm font-semibold text-foreground">6 MEs</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Markets</p>
              <p className="text-sm font-semibold text-foreground">6 markets</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Region</p>
              <p className="text-sm font-semibold text-foreground">Pune</p>
            </div>
          </div>
        </Card>

        {/* B. Quality of retailer engagement — bar chart */}
        <Card className="p-5">
          <div className="flex items-start justify-between mb-4 gap-3 flex-wrap">
            <div>
              <h3 className="font-semibold text-foreground">
                Quality of retailer engagement
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Engagement quality by market area · benchmark vs company target
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-md px-2 py-1">
              <span className="inline-block w-6 border-t-2 border-dashed border-muted-foreground/70" />
              Company Benchmark (80%)
            </span>
          </div>

          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={engagementByArea}
                margin={{ top: 24, right: 16, left: 0, bottom: 8 }}
              >
                <XAxis
                  dataKey="area"
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                  width={40}
                />
                <ReferenceLine
                  y={80}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="4 4"
                />

                <Bar
                  dataKey="value"
                  radius={[6, 6, 0, 0]}
                  barSize={56}
                  label={{
                    position: "top",
                    fontSize: 12,
                    fill: "hsl(var(--foreground))",
                    formatter: (v: number) => `${v}%`,
                  }}
                >
                  {engagementByArea.map((d) => (
                    <Cell key={d.area} fill={tierFill[d.tier]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border mt-2">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-success" /> High (≥80%)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-warning" /> Moderate (60–79%)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-destructive" /> Low (&lt;60%)
              </span>
            </div>
            <button
              onClick={() => setOpenDetail(true)}
              className="text-primary text-sm font-medium hover:underline"
            >
              Click to view detailed list →
            </button>
          </div>
        </Card>
      </div>

      {/* Detail dialog */}
      <Dialog open={openDetail} onOpenChange={setOpenDetail}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Detailed list of MEs &amp; Engagement Quality</DialogTitle>
            <DialogDescription>
              Pune region · current period
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Area</TableHead>
                  <TableHead>ME</TableHead>
                  <TableHead>Retailers covered</TableHead>
                  <TableHead>Overall engagement quality</TableHead>
                  <TableHead>Avg. time spent</TableHead>
                  <TableHead>Preparation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meDetail.map((r, idx) => (
                  <TableRow
                    key={r.me}
                    className={idx % 2 === 1 ? "bg-muted/30 hover:bg-muted/40" : "hover:bg-muted/40"}
                  >
                    <TableCell className="text-muted-foreground">{r.area}</TableCell>
                    <TableCell className="font-medium text-foreground">{r.me}</TableCell>
                    <TableCell>{r.covered}</TableCell>
                    <TableCell><Pill tier={r.eq.tier}>{r.eq.label}</Pill></TableCell>
                    <TableCell><Pill tier={r.time.tier}>{r.time.label}</Pill></TableCell>
                    <TableCell><Pill tier={r.prep}>{r.prep.toUpperCase()}</Pill></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </ASMLayout>
  );
};

export default ASMDashboard;
