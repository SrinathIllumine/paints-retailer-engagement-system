import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MapPin, AlertCircle, Clock, BarChart3, Layers } from "lucide-react";
import { dealers } from "@/data/mockData";
import { marketingExecutives } from "@/data/meAnalytics";
import type { DealerType } from "@/data/mockData";

interface Props {
  meId: string | null;
  context?: "coverage" | "consistency" | "activation" | "objections" | "uplift";
  period?: "7d" | "30d" | "90d";
  onClose: () => void;
}

interface SegmentCoverage {
  total: number;
  covered: number;
}

interface MECoverageDetail {
  highFrequencyAreas: { name: string; visits: number }[];
  recentlyVisited: { name: string; lastVisited: string }[];
  missed: { name: string; lastVisited: string }[];
  segments: Record<DealerType, SegmentCoverage>;
}

const meCoverage: Record<string, MECoverageDetail> = {
  me1: {
    highFrequencyAreas: [
      { name: "Pune West – Aundh", visits: 38 },
      { name: "Pune West – Baner", visits: 26 },
      { name: "Pune West – Pashan", visits: 14 },
    ],
    recentlyVisited: dealers.slice(0, 4).map((d, i) => ({
      name: d.name, lastVisited: ["Today", "Yesterday", "2 days ago", "3 days ago"][i],
    })),
    missed: dealers.slice(6, 9).map((d) => ({ name: d.name, lastVisited: "45+ days ago" })),
    segments: {
      new:       { total: 40,  covered: 18 },
      loyal:     { total: 80,  covered: 62 },
      inactive:  { total: 50,  covered: 12 },
      declining: { total: 35,  covered: 14 },
    },
  },
  me2: {
    highFrequencyAreas: [
      { name: "Pune NE – Wagholi", visits: 21 },
      { name: "Pune NE – Kharadi", visits: 32 },
      { name: "Pune NE – Viman Nagar", visits: 44 },
    ],
    recentlyVisited: dealers.slice(0, 4).map((d, i) => ({
      name: d.name, lastVisited: ["Today", "Today", "Yesterday", "2 days ago"][i],
    })),
    missed: dealers.slice(8, 10).map((d) => ({ name: d.name, lastVisited: "30+ days ago" })),
    segments: {
      new:       { total: 38,  covered: 28 },
      loyal:     { total: 90,  covered: 78 },
      inactive:  { total: 45,  covered: 22 },
      declining: { total: 25,  covered: 14 },
    },
  },
  me3: {
    highFrequencyAreas: [
      { name: "Pune South – NIBM", visits: 9 },
      { name: "Pune South – Wanowrie", visits: 18 },
      { name: "Pune South – Hadapsar", visits: 29 },
    ],
    recentlyVisited: dealers.slice(0, 3).map((d, i) => ({
      name: d.name, lastVisited: ["Yesterday", "3 days ago", "5 days ago"][i],
    })),
    missed: dealers.slice(3, 8).map((d) => ({ name: d.name, lastVisited: "60+ days ago" })),
    segments: {
      new:       { total: 30,  covered: 8 },
      loyal:     { total: 70,  covered: 38 },
      inactive:  { total: 60,  covered: 14 },
      declining: { total: 40,  covered: 11 },
    },
  },
  me4: {
    highFrequencyAreas: [
      { name: "Pune SW – Sinhagad Rd", visits: 28 },
      { name: "Pune SW – Warje", visits: 36 },
      { name: "Pune SW – Kothrud", visits: 48 },
    ],
    recentlyVisited: dealers.slice(0, 4).map((d, i) => ({
      name: d.name, lastVisited: ["Today", "Today", "Yesterday", "Yesterday"][i],
    })),
    missed: [],
    segments: {
      new:       { total: 42,  covered: 36 },
      loyal:     { total: 95,  covered: 88 },
      inactive:  { total: 40,  covered: 30 },
      declining: { total: 24,  covered: 18 },
    },
  },
  me5: {
    highFrequencyAreas: [
      { name: "Pune North – Moshi", visits: 11 },
      { name: "Pune North – Chinchwad", visits: 24 },
      { name: "Pune North – Pimpri", visits: 33 },
    ],
    recentlyVisited: dealers.slice(0, 3).map((d, i) => ({
      name: d.name, lastVisited: ["Today", "2 days ago", "4 days ago"][i],
    })),
    missed: dealers.slice(5, 7).map((d) => ({ name: d.name, lastVisited: "40+ days ago" })),
    segments: {
      new:       { total: 36,  covered: 22 },
      loyal:     { total: 78,  covered: 50 },
      inactive:  { total: 48,  covered: 18 },
      declining: { total: 30,  covered: 12 },
    },
  },
};

const segmentMeta: Record<DealerType, { label: string; bar: string; bg: string }> = {
  new:       { label: "New",       bar: "bg-info",        bg: "bg-info/15" },
  loyal:     { label: "Loyal",     bar: "bg-success",     bg: "bg-success/15" },
  inactive:  { label: "Inactive",  bar: "bg-muted-foreground", bg: "bg-secondary" },
  declining: { label: "Declining", bar: "bg-destructive", bg: "bg-destructive/15" },
};

const MEProfileDialog = ({ meId, onClose }: Props) => {
  const me = meId ? marketingExecutives.find((m) => m.id === meId) : null;
  if (!me) return null;

  const cov = meCoverage[me.id] ?? meCoverage.me1;
  const coveragePct = Math.round((me.uniqueRetailersVisited / me.mappedRetailers) * 100);

  // Sort areas in ASCENDING order by visits
  const sortedAreas = [...cov.highFrequencyAreas].sort((a, b) => a.visits - b.visits);
  const maxVisits = Math.max(...sortedAreas.map((a) => a.visits), 1);
  const totalAreaEngagements = sortedAreas.reduce((sum, a) => sum + a.visits, 0);

  return (
    <Dialog open={!!meId} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">ME Profile · Coverage</DialogTitle>
        </DialogHeader>

        <div className="space-y-1 pb-3 border-b">
          <h2 className="font-display font-bold text-xl text-foreground">{me.name}</h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {me.area}, {me.region}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {me.mappedRetailers} mapped retailers
            </span>
          </div>
        </div>

        {/* Coverage summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
          <Card className="p-3">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Mapped retailers</p>
            <p className="font-display font-bold text-lg">{me.mappedRetailers}</p>
          </Card>
          <Card className="p-3">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Unique visited (30d)</p>
            <p className="font-display font-bold text-lg">
              {me.uniqueRetailersVisited}
              <span className="text-sm text-muted-foreground font-normal"> · {coveragePct}%</span>
            </p>
          </Card>
          <Card className="p-3">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Engagements (30d)</p>
            <p className="font-display font-bold text-lg">{me.visitsLast30d}</p>
          </Card>
        </div>

        {/* Recently Visited Retailers (replaces "Regular follow-ups") */}
        <Card className="p-4 mt-3">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-info" />
            Recently visited retailers
          </h3>
          <ul className="divide-y divide-border">
            {cov.recentlyVisited.slice(0, 4).map((r) => (
              <li key={r.name} className="flex items-center justify-between py-2 text-sm">
                <span className="text-foreground/85">{r.name}</span>
                <span className="text-muted-foreground text-xs">{r.lastVisited}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Missed / low-coverage — moved ABOVE high-frequency areas */}
        <Card className="p-4 mt-3">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-warning" />
            Missed / low-coverage retailers
          </h3>
          {cov.missed.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No mapped retailers are currently below the follow-up threshold. 🎉
            </p>
          ) : (
            <div className="space-y-2">
              {cov.missed.map((r) => (
                <div key={r.name} className="flex items-center justify-between text-sm">
                  <span className="text-foreground/85">{r.name}</span>
                  <span className="text-warning font-medium">{r.lastVisited}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* High-frequency visited areas — minimalist ranked bar list, ascending */}
        <Card className="p-4 mt-3">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-success" />
              High-frequency visited areas
            </h3>
            <span className="text-xs text-muted-foreground">
              Total engagements: <span className="font-semibold text-foreground">{totalAreaEngagements}</span>
            </span>
          </div>
          <div className="space-y-2.5">
            {sortedAreas.map((a) => {
              const widthPct = Math.round((a.visits / maxVisits) * 100);
              return (
                <div key={a.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground/85">{a.name}</span>
                    <span className="font-semibold text-foreground tabular-nums">{a.visits}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-success/70 rounded-full transition-all"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Retailer Segments — moved here from breakdown table */}
        <Card className="p-4 mt-3">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            Retailer segments coverage
          </h3>
          <div className="space-y-3">
            {(Object.keys(cov.segments) as DealerType[]).map((key) => {
              const s = cov.segments[key];
              const meta = segmentMeta[key];
              const pct = Math.round((s.covered / s.total) * 100);
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground/85">{meta.label}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      <span className="font-semibold text-foreground">{s.covered}</span> / {s.total}
                      <span className="ml-2">({pct}%)</span>
                    </span>
                  </div>
                  <div className={`h-2.5 rounded-full overflow-hidden ${meta.bg}`}>
                    <div
                      className={`h-full ${meta.bar} rounded-full transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="flex justify-end pt-3">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MEProfileDialog;
