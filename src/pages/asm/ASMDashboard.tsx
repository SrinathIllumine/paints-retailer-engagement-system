import { useMemo, useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Store,
  AlertTriangle,
  Trophy,
  AlertOctagon,
  ArrowUpRight,
  UserCircle2,
  FileText,
  MapPin,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { marketingExecutives } from "@/data/meAnalytics";
import MEProfileDialog from "@/components/leadership/MEProfileDialog";
import DealerTypeBadge from "@/components/DealerTypeBadge";
import type { DealerType } from "@/data/mockData";
import asmPhoto from "@/assets/asm-rajesh.jpg";

// =====================================================
// KPI CARDS — three engagement-centric, status-coded
// =====================================================
type Status = "on-track" | "at-risk" | "off-track";

const statusMeta: Record<Status, { label: string; cls: string }> = {
  "on-track":  { label: "Lagging Behind",  cls: "px-2 py-1 rounded-full text-[11px] font-semibold text-sidebar-ring bg-accent" },
  "at-risk":   { label: "Lagging Behind",   cls: "bg-warning/10 text-warning" },
  "off-track": { label: "Off Track", cls: "bg-destructive/10 text-destructive" },
};

const TOTAL_MES = 7;
const ACTIVE_MES = 6;
const RETAILERS_PER_ME = 200;
const RETAILERS_TARGET = 1400; // 1400
const RETAILERS_MET = 1300; // 1300
const ENGAGEMENTS_PER_ME = 10;
const ENGAGEMENTS_TARGET = 200; // 200
const ENGAGEMENTS_TODAY = 185; // 185
const NATIONAL_AVG_OBJ = 1.0;
const AVG_OBJ_PER_RETAILER = 1.2;

const retailerStatus: Status =
  RETAILERS_MET >= RETAILERS_TARGET * 0.95
    ? "on-track"
    : RETAILERS_MET >= RETAILERS_TARGET * 0.8
    ? "at-risk"
    : "off-track";

const engagementStatus: Status =
  ENGAGEMENTS_TODAY >= ENGAGEMENTS_TARGET * 0.95
    ? "on-track"
    : ENGAGEMENTS_TODAY >= ENGAGEMENTS_TARGET * 0.8
    ? "at-risk"
    : "off-track";

// =====================================================
// ME-WISE BREAKDOWN — Monthly
// =====================================================
interface MERow {
  meId: string;
  meName: string;
  area: string;
  uniqueRetailersVisited: number;
  totalRetailersMapped: number;
  engagementsCovered: number;
  segments: Record<DealerType, number>;
}

const meBreakdown: MERow[] = marketingExecutives.map((m, i) => {
  const segs: Record<DealerType, number>[] = [
    { new: 18, loyal: 32, inactive: 22, declining: 20 },
    { new: 28, loyal: 64, inactive: 30, declining: 20 },
    { new: 12, loyal: 22, inactive: 24, declining: 13 },
    { new: 32, loyal: 70, inactive: 38, declining: 16 },
    { new: 22, loyal: 44, inactive: 26, declining: 12 },
  ];
  return {
    meId: m.id,
    meName: m.name,
    area: m.area,
    uniqueRetailersVisited: m.uniqueRetailersVisited,
    totalRetailersMapped: m.mappedRetailers,
    engagementsCovered: m.visitsLast30d,
    segments: segs[i % segs.length],
  };
});

const SegmentChips = ({ segments }: { segments: Record<DealerType, number> }) => (
  <div className="flex flex-wrap gap-1">
    {(Object.keys(segments) as DealerType[]).map((k) => (
      <div key={k} className="flex items-center gap-1">
        <DealerTypeBadge type={k} />
        <span className="text-xs font-semibold text-foreground/80">{segments[k]}</span>
      </div>
    ))}
  </div>
);

// =====================================================
// DAILY ENGAGEMENT REPORT — area-driven
// =====================================================
const AREAS = [
  "Pimpri Chinchwad",
  "Baner",
  "Hadapsar",
  "Kothrud",
  "Wakad",
  "Undri",
];

interface AreaReport {
  actionPoints: string[];
  activeMes: number;
  totalMes: number;
  retailersCovered: number;
  retailersStatus: Status;
  units: { name: string; pct: number }[];
  topObjections: { name: string; pct: number }[];
}

const baseReport: AreaReport = {
  actionPoints: [
    "Many retailers are facing stocking issues w.r.t Putty due to packaging issues. Refer recommended solutions to MEs before next visit.",
  ],
  activeMes: 6,
  totalMes: 6,
  retailersCovered: 60,
  retailersStatus: "on-track",
  units: [
    { name: "Alignment to multi-product vision", pct: 40 },
    { name: "Getting initial success as a new retailer", pct: 30 },
    { name: "Building contractor / painter pool", pct: 30 },
  ],
  topObjections: [
    { name: "No demand in my area", pct: 45 },
    { name: "No space in the shop", pct: 30 },
    { name: "Working capital will be blocked", pct: 25 },
  ],
};

// =====================================================
// QUARTERLY LEADERBOARD
// =====================================================
interface LeaderRow {
  meId: string;
  meName: string;
  marketArea: string;
  retailersMet: number;
  retailerBenchmark: number;
  engagementUnits: number;
  engagementBenchmark: number;
  actionPoints: number;
  status: Status;
}

const leaderboard: LeaderRow[] = [
  { meId: "me4", meName: "Vikas Patil",    marketArea: "Pune SW",    retailersMet: 468, retailerBenchmark: 420, engagementUnits: 4, engagementBenchmark: 4, actionPoints: 114, status: "on-track" },
  { meId: "me2", meName: "Sunil Sharma",   marketArea: "Pune NE",    retailersMet: 426, retailerBenchmark: 420, engagementUnits: 4, engagementBenchmark: 4, actionPoints:  90, status: "on-track" },
  { meId: "me5", meName: "Priya Nair",     marketArea: "Pune North", retailersMet: 312, retailerBenchmark: 420, engagementUnits: 3, engagementBenchmark: 4, actionPoints:  66, status: "at-risk" },
  { meId: "me1", meName: "Ravi Kumar",     marketArea: "Pune West",  retailersMet: 276, retailerBenchmark: 420, engagementUnits: 2, engagementBenchmark: 4, actionPoints:  54, status: "at-risk" },
  { meId: "me3", meName: "Anita Deshmukh", marketArea: "Pune South", retailersMet: 213, retailerBenchmark: 420, engagementUnits: 1, engagementBenchmark: 4, actionPoints:  36, status: "off-track" },
];

// =====================================================
// COMPONENT
// =====================================================
const ASMDashboard = () => {
  const [selectedMe, setSelectedMe] = useState<string | null>(null);
  const [area, setArea] = useState<string>(AREAS[0]);
  const [showReport, setShowReport] = useState(false);

  const top = leaderboard[0];
  const bottom = leaderboard[leaderboard.length - 1];
  const objStatus: Status = AVG_OBJ_PER_RETAILER > NATIONAL_AVG_OBJ ? "at-risk" : "on-track";
  const objLabel = AVG_OBJ_PER_RETAILER > NATIONAL_AVG_OBJ ? "Needs Attention" : "On Track";

  const report = useMemo<AreaReport>(() => {
    // light variation per area so the dropdown feels live
    const idx = AREAS.indexOf(area);
    const variance = idx;
    return {
      ...baseReport,
      activeMes: Math.max(3, baseReport.totalMes - (variance % 3)),
      retailersCovered: baseReport.retailersCovered - variance * 4,
      retailersStatus:
        variance >= 4 ? "off-track" : variance >= 2 ? "at-risk" : "on-track",
    };
  }, [area]);

  return (
    <ASMLayout hideFilters>
      <div className="space-y-6">
        {/* A. ASM Identity Header */}
        <Card className="p-5 flex items-center gap-4">
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
          <div className="hidden sm:block text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Area in-charge</p>
            <p className="text-sm font-semibold text-foreground">Pune (6 markets)</p>
          </div>
        </Card>

        {/* B. KPI cards — three engagement KPIs */}
        <section>
          <h2 className="text-sm font-semibold text-foreground/70 uppercase tracking-wide mb-3">
            SNAPSHOT
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* 1. Active MEs */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                  <Users className="w-4 h-4 text-info" />
                </div>
                <p className="text-sm text-muted-foreground">Active MEs</p>
              </div>
              <p className="font-display font-bold text-4xl text-foreground text-center">
                {ACTIVE_MES}
              </p>
              <div className="mt-4 flex items-end justify-between text-xs">
                <div>
                  <p className="text-muted-foreground">Total MEs</p>
                  <p className="font-semibold text-foreground text-sm">{TOTAL_MES}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">Active %</p>
                  <p className="font-semibold text-success text-sm">
                    {Math.round((ACTIVE_MES / TOTAL_MES) * 100)}%
                  </p>
                </div>
              </div>
            </Card>

            {/* 2. Active Retailers */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                  <Store className="w-4 h-4 text-info" />
                </div>
                <p className="text-sm text-muted-foreground">Active Retailers Covered</p>
              </div>
              <p className="font-display font-bold text-4xl text-foreground text-center">
                {RETAILERS_MET.toLocaleString()}
              </p>
              <div className="mt-4 flex items-end justify-between text-xs">
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-semibold text-foreground text-sm">
                    {RETAILERS_TARGET.toLocaleString()}
                  </p>
                </div>
                <span className={statusMeta[retailerStatus].cls}>
                  {statusMeta[retailerStatus].label}
                </span>
              </div>
            </Card>

            {/* 3. Average Engagements per ME */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-info" />
                </div>
                <p className="text-sm text-muted-foreground">Avg. Engagements per ME</p>
              </div>
              <p className="font-display font-bold text-4xl text-foreground text-center">
                {ENGAGEMENTS_TODAY}
              </p>
              <div className="mt-4 flex items-end justify-between text-xs">
                <div>
                  <p className="text-muted-foreground">Target</p>
                  <p className="font-semibold text-foreground text-sm">{ENGAGEMENTS_TARGET}</p>
                </div>
                <span className={statusMeta[engagementStatus].cls}>
                  {statusMeta[engagementStatus].label}
                </span>
              </div>
            </Card>

            {/* 4. Avg Objections / Retailer */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-info" />
                </div>
                <p className="text-sm text-muted-foreground">Avg. Objections / Retailer</p>
              </div>
              <p className="font-display font-bold text-4xl text-foreground text-center">
                {AVG_OBJ_PER_RETAILER.toFixed(1)}
              </p>
              <div className="mt-4 flex items-end justify-between text-xs">
                <div>
                  <p className="text-muted-foreground">National Avg.</p>
                  <p className="font-semibold text-foreground text-sm">{NATIONAL_AVG_OBJ.toFixed(1)}</p>
                </div>
                <span className={statusMeta[objStatus].cls}>
                  {objLabel}
                </span>
              </div>
            </Card>
          </div>
        </section>

        {/* C. ME-wise Engagement Breakdown — Monthly */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-semibold text-foreground">ME-wise engagement breakdown</h3>
              <p className="text-xs text-muted-foreground">
                Monthly view · click any row to open the ME profile
              </p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground font-medium">
              Monthly
            </span>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ME</TableHead>
                  <TableHead className="text-right">Unique retailers visited</TableHead>
                  <TableHead className="text-right">Total retailers mapped</TableHead>
                  <TableHead className="text-right">% Unique retailers visited</TableHead>
                  <TableHead className="text-right">Engagements covered</TableHead>
                  <TableHead className="text-center">Profile</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meBreakdown.map((r) => {
                  const pct = Math.round((r.uniqueRetailersVisited / r.totalRetailersMapped) * 100);
                  const pctTone =
                    pct >= 70 ? "text-success" : pct >= 50 ? "text-warning" : "text-destructive";
                  return (
                    <TableRow
                      key={r.meId}
                      className="cursor-pointer"
                      onClick={() => setSelectedMe(r.meId)}
                    >
                      <TableCell>
                        <div className="font-medium text-foreground">{r.meName}</div>
                        <div className="text-xs text-muted-foreground">{r.area}</div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {r.uniqueRetailersVisited}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {r.totalRetailersMapped}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`font-semibold ${pctTone}`}>{pct}%</span>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {r.engagementsCovered}
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMe(r.meId);
                          }}
                          className="inline-flex items-center gap-1 text-primary hover:opacity-80 text-xs font-medium"
                        >
                          <UserCircle2 className="w-4 h-4" />
                          View
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* D. Daily Engagement Coverage — area-driven report */}
        <Card className="p-5">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div>
              <h3 className="font-semibold text-foreground">Daily engagement coverage</h3>
              <p className="text-xs text-muted-foreground">
                Select a market area to view the consolidated ME engagement report
              </p>
            </div>
            <Select value={area} onValueChange={(v) => { setArea(v); setShowReport(true); }}>
              <SelectTrigger className="h-9 w-[220px] text-sm">
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                {AREAS.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <button
            onClick={() => setShowReport((s) => !s)}
            className="w-full text-left rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">{area} · Daily Report</p>
              <p className="text-xs text-muted-foreground">
                {showReport ? "Hide" : "View"} consolidated ME engagement report (PDF-style)
              </p>
            </div>
            <span className="text-xs text-primary font-medium">
              {showReport ? "Hide" : "Open"}
            </span>
          </button>

          {showReport && (
            <div className="mt-4 rounded-lg border border-border bg-background p-6 font-mono text-sm leading-relaxed">
              <div className="text-center border-b border-dashed border-border pb-3 mb-4">
                <p className="font-bold text-foreground">Consolidated 'ME Engagement Report' (Daily)</p>
                <p className="text-muted-foreground mt-1">Rajesh Kumar, ASM, Pune · {area}</p>
              </div>

              <div className="mb-5">
                <p className="font-semibold text-foreground mb-2">Key Action Points (Recommended):</p>
                <ul className="space-y-1.5 text-foreground/85">
                  {report.actionPoints.map((ap, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>{ap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-5">
                <p className="font-semibold text-foreground mb-2">Today's Field Snapshot:</p>
                <ul className="space-y-1 text-foreground/85">
                  <li>- Total MEs active today: {report.activeMes} of {report.totalMes}</li>
                  <li>
                    - Total retailers covered: {report.retailersCovered}{" "}
                    <span className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${statusMeta[report.retailersStatus].cls}`}>
                      {statusMeta[report.retailersStatus].label}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mb-5">
                <p className="font-semibold text-foreground mb-2">Engagement Units Covered:</p>
                <ul className="space-y-1 text-foreground/85">
                  {report.units.map((u) => (
                    <li key={u.name}>- {u.name}: {u.pct}%</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-2">Top Objections:</p>
                <ul className="space-y-1 text-foreground/85">
                  {report.topObjections.map((o) => (
                    <li key={o.name}>- {o.name} ({o.pct}%)</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </Card>

        {/* E. Quarterly Leaderboard */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-semibold text-foreground">Top ME engagement leaderboard</h3>
              <p className="text-xs text-muted-foreground">
                Quarterly view · sorted by retailers met
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground font-medium">
                Quarterly
              </span>
              <span className="inline-flex items-center gap-1 text-success">
                <Trophy className="w-3.5 h-3.5" /> Top: {top.meName}
              </span>
              <span className="inline-flex items-center gap-1 text-warning">
                <AlertOctagon className="w-3.5 h-3.5" /> Watch: {bottom.meName}
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Market area</TableHead>
                  <TableHead className="text-right">Retailers met</TableHead>
                  <TableHead className="text-right">Engagement units covered</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((r, i) => (
                  <TableRow
                    key={r.meId}
                    className="cursor-pointer"
                    onClick={() => setSelectedMe(r.meId)}
                  >
                    <TableCell className="font-semibold text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-medium">{r.meName}</TableCell>
                    <TableCell className="text-muted-foreground">{r.marketArea}</TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold">{r.retailersMet}</span>
                      <span className="text-xs text-muted-foreground ml-1">
                        / {r.retailerBenchmark}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold">{r.engagementUnits}</span>
                      <span className="text-xs text-muted-foreground ml-1">
                        / {r.engagementBenchmark}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusMeta[r.status].cls}`}>
                        {r.status === "on-track" && <ArrowUpRight className="w-3 h-3" />}
                        {r.status === "at-risk" && <AlertOctagon className="w-3 h-3" />}
                        {r.status === "off-track" && <AlertTriangle className="w-3 h-3" />}
                        {statusMeta[r.status].label}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <MEProfileDialog
        meId={selectedMe}
        context="coverage"
        onClose={() => setSelectedMe(null)}
      />
    </ASMLayout>
  );
};

export default ASMDashboard;
