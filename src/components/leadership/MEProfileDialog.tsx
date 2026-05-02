import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MapPin, CheckCircle2, RotateCcw, AlertCircle } from "lucide-react";
import { dealers } from "@/data/mockData";
import { marketingExecutives } from "@/data/meAnalytics";

interface Props {
  meId: string | null;
  context?: "coverage" | "consistency" | "activation" | "objections" | "uplift";
  period?: "7d" | "30d" | "90d";
  onClose: () => void;
}

// Per-ME deterministic coverage detail
const meCoverage: Record<
  string,
  {
    highFrequencyAreas: { name: string; visits: number }[];
    regularFollowUps: { name: string; lastVisited: string; visits: number }[];
    missed: { name: string; lastVisited: string }[];
  }
> = {
  me1: {
    highFrequencyAreas: [
      { name: "Pune West – Aundh", visits: 38 },
      { name: "Pune West – Baner", visits: 26 },
    ],
    regularFollowUps: dealers.slice(0, 3).map((d, i) => ({
      name: d.name, lastVisited: ["2 days ago", "5 days ago", "1 week ago"][i], visits: 6 - i,
    })),
    missed: dealers.slice(6, 9).map((d) => ({ name: d.name, lastVisited: "45+ days ago" })),
  },
  me2: {
    highFrequencyAreas: [
      { name: "Pune NE – Viman Nagar", visits: 44 },
      { name: "Pune NE – Kharadi", visits: 32 },
      { name: "Pune NE – Wagholi", visits: 21 },
    ],
    regularFollowUps: dealers.slice(0, 4).map((d, i) => ({
      name: d.name, lastVisited: ["1 day ago", "3 days ago", "5 days ago", "1 week ago"][i], visits: 7 - i,
    })),
    missed: dealers.slice(8, 10).map((d) => ({ name: d.name, lastVisited: "30+ days ago" })),
  },
  me3: {
    highFrequencyAreas: [
      { name: "Pune South – Hadapsar", visits: 29 },
    ],
    regularFollowUps: dealers.slice(0, 2).map((d, i) => ({
      name: d.name, lastVisited: ["3 days ago", "1 week ago"][i], visits: 4 - i,
    })),
    missed: dealers.slice(3, 8).map((d) => ({ name: d.name, lastVisited: "60+ days ago" })),
  },
  me4: {
    highFrequencyAreas: [
      { name: "Pune SW – Kothrud", visits: 48 },
      { name: "Pune SW – Warje", visits: 36 },
      { name: "Pune SW – Sinhagad Rd", visits: 28 },
    ],
    regularFollowUps: dealers.slice(0, 5).map((d, i) => ({
      name: d.name, lastVisited: ["1 day ago", "2 days ago", "4 days ago", "5 days ago", "6 days ago"][i], visits: 8 - i,
    })),
    missed: [],
  },
  me5: {
    highFrequencyAreas: [
      { name: "Pune North – Pimpri", visits: 33 },
      { name: "Pune North – Chinchwad", visits: 24 },
    ],
    regularFollowUps: dealers.slice(0, 3).map((d, i) => ({
      name: d.name, lastVisited: ["2 days ago", "6 days ago", "1 week ago"][i], visits: 5 - i,
    })),
    missed: dealers.slice(5, 7).map((d) => ({ name: d.name, lastVisited: "40+ days ago" })),
  },
};

const MEProfileDialog = ({ meId, onClose }: Props) => {
  const me = meId ? marketingExecutives.find((m) => m.id === meId) : null;
  if (!me) return null;

  const cov = meCoverage[me.id] ?? meCoverage.me1;
  const coveragePct = Math.round((me.uniqueRetailersVisited / me.mappedRetailers) * 100);

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

        {/* High-frequency visited areas */}
        <Card className="p-4 mt-3">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success" />
            High-frequency visited areas
          </h3>
          <div className="space-y-2">
            {cov.highFrequencyAreas.map((a) => (
              <div key={a.name} className="flex items-center justify-between text-sm">
                <span className="text-foreground/85">{a.name}</span>
                <span className="font-semibold text-foreground">{a.visits} visits</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Regular follow-ups */}
        <Card className="p-4 mt-3">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-info" />
            Retailers with regular follow-ups
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground border-b">
                <th className="text-left font-medium py-2">Retailer</th>
                <th className="text-right font-medium py-2">Visits (30d)</th>
                <th className="text-right font-medium py-2">Last visited</th>
              </tr>
            </thead>
            <tbody>
              {cov.regularFollowUps.map((r) => (
                <tr key={r.name} className="border-b last:border-b-0">
                  <td className="py-2 text-foreground/85">{r.name}</td>
                  <td className="py-2 text-right font-semibold">{r.visits}</td>
                  <td className="py-2 text-right text-muted-foreground">{r.lastVisited}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Missed / low-coverage */}
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

        <div className="flex justify-end pt-3">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MEProfileDialog;
