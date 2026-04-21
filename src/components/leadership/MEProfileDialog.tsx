import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MapPin } from "lucide-react";
import { dealers } from "@/data/mockData";
import { marketingExecutives } from "@/data/meAnalytics";

interface Props {
  meId: string | null;
  context?: "coverage" | "consistency" | "activation" | "objections" | "uplift";
  period?: "7d" | "30d" | "90d";
  onClose: () => void;
}

const contextLabel: Record<NonNullable<Props["context"]>, string> = {
  coverage: "\n",
  consistency: "Consistent Coverage",
  activation: "Inactive to Loyal Activation",
  objections: "Objection-Heavy Pairings",
  uplift: "​",
};

const periodLabel: Record<NonNullable<Props["period"]>, string> = {
  "7d": "last 7 days",
  "30d": "last 30 days",
  "90d": "last 90 days",
};

const periodMultiplier: Record<NonNullable<Props["period"]>, number> = {
  "7d": 0.25,
  "30d": 1,
  "90d": 2.4,
};

// Deterministic objection summary per ME
const meObjections: Record<string, { type: string; retailers: number }[]> = {
  me1: [
    { type: "No demand in my area", retailers: 12 },
    { type: "Competition from other brands", retailers: 8 },
    { type: "Working capital", retailers: 5 },
  ],
  me2: [
    { type: "No space", retailers: 6 },
    { type: "Working capital", retailers: 4 },
  ],
  me3: [
    { type: "Working capital", retailers: 14 },
    { type: "Competition from other brands", retailers: 11 },
    { type: "No demand in my area", retailers: 7 },
  ],
  me4: [
    { type: "No space", retailers: 3 },
    { type: "Competition from other brands", retailers: 2 },
  ],
  me5: [
    { type: "No space", retailers: 7 },
    { type: "No demand in my area", retailers: 5 },
  ],
};

const MEProfileDialog = ({ meId, context = "coverage", period = "30d", onClose }: Props) => {
  const me = meId ? marketingExecutives.find((m) => m.id === meId) : null;
  if (!me) return null;

  const mult = periodMultiplier[period];
  const visited = Math.round(me.uniqueRetailersVisited * Math.min(mult, 1));
  const engagements = Math.round(me.visitsLast30d * mult);
  const uplift = Math.round(me.attributesUplift * (period === "30d" ? 1 : period === "7d" ? 0.5 : 1.4));

  const objections = meObjections[me.id] ?? [];
  const periodShort = period === "7d" ? "7D" : period === "90d" ? "90D" : "30D";
  // Recently engaged retailers with per-retailer engagement counts
  const lastVisitedDays = ["2 days ago", "4 days ago", "6 days ago", "1 week ago", "2 weeks ago"];
  const recent = dealers.slice(0, 5).map((d, i) => ({
    dealer: d,
    engagements: 6 - i + (i % 2),
    objections: (i % 3),
    lastVisited: lastVisitedDays[i],
  }));

  return (
    <Dialog open={!!meId} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">ME Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-1 pb-3 border-b">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-display font-bold text-xl text-foreground">{me.name}</h2>
            <span className="text-xs px-2 py-0.5 rounded-full text-info font-medium bg-primary-foreground">{contextLabel[context]}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{me.area}, {me.region}</span>
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{me.mappedRetailers} mapped retailers</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
          <Card className="p-3">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Total mapped retailers</p>
            <p className="font-display font-bold text-lg">{me.mappedRetailers}</p>
          </Card>
          <Card className="p-3">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Retailers visited ({periodLabel[period]})</p>
            <p className="font-display font-bold text-lg">{visited}</p>
          </Card>
          <Card className="p-3">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Total engagements ({periodLabel[period]})</p>
            <p className="font-display font-bold text-lg">{engagements}</p>
          </Card>
          <Card className="p-3">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Retailer attributes uplift</p>
            <p className="font-display font-bold text-lg">+{uplift}%</p>
          </Card>
        </div>

        {/* Objections raised */}
        <Card className="p-4 mt-3">
          <h3 className="font-semibold text-foreground mb-2">Objections raised by retailers</h3>
          {objections.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notable objections recorded in this period.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground border-b">
                  <th className="text-left font-medium py-2">Objection type</th>
                  <th className="text-right font-medium py-2">Retailers who raised it</th>
                </tr>
              </thead>
              <tbody>
                {objections.map((o) => (
                  <tr key={o.type} className="border-b last:border-b-0">
                    <td className="py-2 text-foreground/85">{o.type}</td>
                    <td className="py-2 text-right font-semibold">{o.retailers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        {/* Recently engaged retailers */}
        <Card className="p-4 mt-3">
          <h3 className="font-semibold text-foreground mb-2">Recently engaged retailers</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground border-b">
                <th className="text-left font-medium py-2">Retailer</th>
                <th className="text-right font-medium py-2">Engagements in the period ({periodShort})</th>
                <th className="text-right font-medium py-2">Objections in the period</th>
                <th className="text-right font-medium py-2">Last visited</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(({ dealer, engagements, objections: obj, lastVisited }) => (
                <tr key={dealer.id} className="border-b last:border-b-0">
                  <td className="py-2 text-foreground/85">{dealer.name}</td>
                  <td className="py-2 text-right font-semibold">{engagements}</td>
                  <td className="py-2 text-right font-semibold">{obj}</td>
                  <td className="py-2 text-right text-muted-foreground">{lastVisited}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <div className="flex justify-end pt-3">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MEProfileDialog;
