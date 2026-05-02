import { Fragment, useMemo, useState } from "react";
import ASMLayout from "@/components/asm/ASMLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Store,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Trophy,
  AlertOctagon,
  MapPin,
  UserCircle2,
} from "lucide-react";
import { marketingExecutives } from "@/data/meAnalytics";
import MEProfileDialog from "@/components/leadership/MEProfileDialog";
import DealerTypeBadge from "@/components/DealerTypeBadge";
import type { DealerType } from "@/data/mockData";

type View = "daily" | "weekly";

interface KPI {
  icon: typeof Users;
  label: string;
  value: number;
  benchmark: number;
  unit?: string;
  inverse?: boolean; // when true, lower is better
}

const dailyKpis: KPI[] = [
  { icon: Users, label: "Active MEs", value: 6, benchmark: 7 },
  { icon: Store, label: "Active Retailers", value: 218, benchmark: 240 },
  { icon: MessageSquare, label: "Avg. Engagements / ME", value: 9, benchmark: 8 },
  { icon: AlertTriangle, label: "Avg. Objections / Retailer", value: 1.4, benchmark: 1.0, inverse: true },
];

const weeklyKpis: KPI[] = [
  { icon: Users, label: "Active MEs", value: 7, benchmark: 7 },
  { icon: Store, label: "Active Retailers", value: 565, benchmark: 600 },
  { icon: MessageSquare, label: "Avg. Engagements / ME", value: 38, benchmark: 35 },
  { icon: AlertTriangle, label: "Avg. Objections / Retailer", value: 1.2, benchmark: 1.0, inverse: true },
];

const KpiCard = ({ k }: { k: KPI }) => {
  const diff = k.value - k.benchmark;
  const pct = k.benchmark === 0 ? 0 : Math.round((diff / k.benchmark) * 100);
  // determine "good" direction
  const positive = k.inverse ? diff < 0 : diff > 0;
  const flat = diff === 0;
  const tone = flat
    ? "text-muted-foreground"
    : positive
    ? "text-success"
    : "text-success";
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <Card className="p-4">
      <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center mb-2">
        <k.icon className="w-4 h-4 text-info" />
      </div>
      <p className="font-display font-bold text-2xl text-foreground">
        {k.value.toLocaleString()}
        {k.unit ?? ""}
      </p>
      <p className="text-sm text-muted-foreground">{k.label}</p>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-muted-foreground whitespace-pre">
          {k.benchmark === 7 ? "\n" : k.benchmark === 240 ? `Total: ${k.benchmark}` : `Benchmark ${k.benchmark}`}
          {k.unit ?? ""}
        </span>
        {!flat && (
          <span className={`inline-flex items-center gap-1 font-medium whitespace-pre ${tone}`}>
            <Icon className="w-3 h-3" />
            {Math.abs(pct) === 14 ? "\n" : `${Math.abs(pct)}%`}
          </span>
        )}
      </div>
    </Card>
  );
};

// ME breakdown rows — extending base data with split-of-objections + segments
interface MERow {
  meId: string;
  meName: string;
  area: string;
  uniqueRetailersVisited: number;
  totalRetailersMapped: number;
  engagementsCompleted: number;
  objectionSplit: { type: string; count: number; color: string }[];
  segments: Record<DealerType, number>;
}

const meBreakdown: MERow[] = marketingExecutives.map((m, i) => {
  const objectionTemplates = [
    [
      { type: "No demand", count: 12, color: "hsl(0,78%,48%)" },
      { type: "Competition", count: 8, color: "hsl(30,80%,52%)" },
      { type: "Working capital", count: 5, color: "hsl(210,80%,52%)" },
    ],
    [
      { type: "No space", count: 6, color: "hsl(152,60%,40%)" },
      { type: "Working capital", count: 4, color: "hsl(210,80%,52%)" },
      { type: "Competition", count: 3, color: "hsl(30,80%,52%)" },
    ],
    [
      { type: "Working capital", count: 14, color: "hsl(210,80%,52%)" },
      { type: "Competition", count: 11, color: "hsl(30,80%,52%)" },
      { type: "No demand", count: 7, color: "hsl(0,78%,48%)" },
    ],
    [
      { type: "No space", count: 3, color: "hsl(152,60%,40%)" },
      { type: "Competition", count: 2, color: "hsl(30,80%,52%)" },
    ],
    [
      { type: "No space", count: 7, color: "hsl(152,60%,40%)" },
      { type: "No demand", count: 5, color: "hsl(0,78%,48%)" },
      { type: "Quality", count: 3, color: "hsl(220,10%,46%)" },
    ],
  ];
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
    engagementsCompleted: m.visitsLast30d,
    objectionSplit: objectionTemplates[i % objectionTemplates.length],
    segments: segs[i % segs.length],
  };
});

const StackedBar = ({ split }: { split: MERow["objectionSplit"] }) => {
  const total = split.reduce((s, x) => s + x.count, 0) || 1;
  return (
    <div className="space-y-1.5 min-w-[180px]">
      <div className="h-2 w-full rounded-full overflow-hidden flex bg-secondary">
        {split.map((s) => (
          <div
            key={s.type}
            title={`${s.type}: ${s.count}`}
            style={{
              width: `${(s.count / total) * 100}%`,
              backgroundColor: s.color,
            }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground">
        {split.map((s) => (
          <span key={s.type} className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
            {s.type} ({s.count})
          </span>
        ))}
      </div>
    </div>
  );
};

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

// Daily engagement heatmap data (4 weeks x 7 days), market-area aggregated
const heatmapWeeks = 4;
const heatmapDays = ["M", "T", "W", "T", "F", "S", "S"];
const heatmapData: number[][] = [
  [12, 15, 18, 9, 22, 6, 0],
  [14, 19, 21, 17, 24, 8, 0],
  [11, 16, 20, 18, 26, 10, 2],
  [16, 22, 24, 20, 28, 12, 0],
];

const heatColor = (v: number) => {
  if (v === 0) return "bg-secondary";
  if (v < 8) return "bg-primary/20";
  if (v < 15) return "bg-primary/40";
  if (v < 22) return "bg-primary/65";
  return "bg-primary";
};

// Leaderboard data
interface LeaderRow {
  meId: string;
  meName: string;
  retailersMet: number;
  retailerBenchmark: number;
  engagementUnits: number;
  engagementBenchmark: number;
  actionPoints: number;
}
const leaderboard: LeaderRow[] = [
  { meId: "me4", meName: "Vikas Patil",    retailersMet: 156, retailerBenchmark: 140, engagementUnits: 4, engagementBenchmark: 4, actionPoints: 38 },
  { meId: "me2", meName: "Sunil Sharma",   retailersMet: 142, retailerBenchmark: 140, engagementUnits: 4, engagementBenchmark: 4, actionPoints: 30 },
  { meId: "me5", meName: "Priya Nair",     retailersMet: 104, retailerBenchmark: 140, engagementUnits: 3, engagementBenchmark: 4, actionPoints: 22 },
  { meId: "me1", meName: "Ravi Kumar",     retailersMet: 92,  retailerBenchmark: 140, engagementUnits: 2, engagementBenchmark: 4, actionPoints: 18 },
  { meId: "me3", meName: "Anita Deshmukh", retailersMet: 71,  retailerBenchmark: 140, engagementUnits: 1, engagementBenchmark: 4, actionPoints: 12 },
];

const ASMDashboard = () => {
  const [view, setView] = useState<View>("weekly");
  const [selectedMe, setSelectedMe] = useState<string | null>(null);
  const kpis = useMemo(() => (view === "daily" ? dailyKpis : weeklyKpis), [view]);

  const top = leaderboard[0];
  const bottom = leaderboard[leaderboard.length - 1];

  return (
    <ASMLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">
              How are MEs engaging with retailers?
            </h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              Maharashtra · Raj Kumar (ASM)
            </p>
          </div>
          <Tabs value={view} onValueChange={(v) => setView(v as View)}>
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* A. Snapshot KPIs vs benchmark */}
        <section>
          <h2 className="text-sm font-semibold text-foreground/70 uppercase tracking-wide mb-3">
            Snapshot · {view === "daily" ? "Today" : "This week"}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((k) => (
              <KpiCard key={k.label} k={k} />
            ))}
          </div>
        </section>

        {/* B. ME-wise Engagement Breakdown */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">ME-wise engagement breakdown</h3>
            <p className="text-xs text-muted-foreground">
              Click any row to open the ME profile · objection split shown as stacked bar
            </p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ME</TableHead>
                  <TableHead className="text-right">Unique retailers visited</TableHead>
                  <TableHead className="text-right">Total mapped</TableHead>
                  <TableHead className="text-right">Engagements</TableHead>
                  <TableHead>Objections split</TableHead>
                  <TableHead>Retailer segments</TableHead>
                  <TableHead className="text-center">Profile</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meBreakdown.map((r) => (
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
                    <TableCell className="text-right font-semibold">
                      {r.engagementsCompleted}
                    </TableCell>
                    <TableCell>
                      <StackedBar split={r.objectionSplit} />
                    </TableCell>
                    <TableCell>
                      <SegmentChips segments={r.segments} />
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
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* C. Daily Engagement Report (heatmap) */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">Daily engagement coverage</h3>
              <p className="text-xs text-muted-foreground">
                Engagements per day across all market areas · last 4 weeks
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-0.5">
                <div className="w-3.5 h-3.5 rounded-sm bg-secondary" />
                <div className="w-3.5 h-3.5 rounded-sm bg-primary/20" />
                <div className="w-3.5 h-3.5 rounded-sm bg-primary/40" />
                <div className="w-3.5 h-3.5 rounded-sm bg-primary/65" />
                <div className="w-3.5 h-3.5 rounded-sm bg-primary" />
              </div>
              <span>More</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="inline-grid gap-1.5" style={{ gridTemplateColumns: `auto repeat(${heatmapDays.length}, minmax(0, 1fr))` }}>
              <div />
              {heatmapDays.map((d, i) => (
                <div key={i} className="text-[10px] text-muted-foreground text-center w-8">
                  {d}
                </div>
              ))}
              {heatmapData.map((week, wi) => (
                <Fragment key={`row-${wi}`}>
                  <div className="text-[10px] text-muted-foreground pr-2 self-center">
                    W{wi + 1}
                  </div>
                  {week.map((v, di) => (
                    <div
                      key={`${wi}-${di}`}
                      className={`w-8 h-8 rounded-sm ${heatColor(v)} flex items-center justify-center`}
                      title={`Week ${wi + 1}, ${heatmapDays[di]}: ${v} engagements`}
                    >
                      <span className="text-[9px] text-foreground/70 font-medium">
                        {v || ""}
                      </span>
                    </div>
                  ))}
                </Fragment>
              ))}
            </div>
          </div>
        </Card>

        {/* D. Leaderboard */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Top ME engagement leaderboard</h3>
              <p className="text-xs text-muted-foreground">
                Performance vs benchmark · sorted by retailers met
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
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
                  <TableHead>ME</TableHead>
                  <TableHead className="text-right">Retailers met</TableHead>
                  <TableHead className="text-right">Engagement units</TableHead>
                  <TableHead className="text-right">Action points done</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((r, i) => {
                  const retailerDiff = r.retailersMet - r.retailerBenchmark;
                  const isTop = i === 0;
                  const isBottom = i === leaderboard.length - 1;
                  return (
                    <TableRow
                      key={r.meId}
                      className={`cursor-pointer ${
                        isTop
                          ? "bg-success/5"
                          : isBottom
                          ? "bg-warning/5"
                          : ""
                      }`}
                      onClick={() => setSelectedMe(r.meId)}
                    >
                      <TableCell className="font-semibold text-muted-foreground">
                        {i + 1}
                      </TableCell>
                      <TableCell className="font-medium">{r.meName}</TableCell>
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
                      <TableCell className="text-right font-semibold">
                        {r.actionPoints}
                      </TableCell>
                      <TableCell className="text-center">
                        {isTop && (
                          <span className="inline-flex items-center gap-1 text-success text-xs font-medium">
                            <Trophy className="w-3 h-3" /> Top
                          </span>
                        )}
                        {isBottom && (
                          <span className="inline-flex items-center gap-1 text-warning text-xs font-medium">
                            <AlertOctagon className="w-3 h-3" /> Needs support
                          </span>
                        )}
                        {!isTop && !isBottom && (
                          <span
                            className={`inline-flex items-center gap-1 text-xs ${
                              retailerDiff >= 0 ? "text-success" : "text-muted-foreground"
                            }`}
                          >
                            <ArrowUpRight className="w-3 h-3" />
                            On track
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <MEProfileDialog
        meId={selectedMe}
        context="uplift"
        onClose={() => setSelectedMe(null)}
      />
    </ASMLayout>
  );
};

export default ASMDashboard;
