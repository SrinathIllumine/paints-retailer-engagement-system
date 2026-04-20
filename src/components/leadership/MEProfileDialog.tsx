import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MapPin, AlertTriangle, TrendingUp, CheckCircle2 } from "lucide-react";
import { dealers } from "@/data/mockData";
import { marketingExecutives, objectionHeavyPairs } from "@/data/meAnalytics";

interface Props {
  meId: string | null;
  context?: "coverage" | "consistency" | "activation" | "objections" | "uplift";
  onClose: () => void;
}

const contextLabel: Record<NonNullable<Props["context"]>, string> = {
  coverage: "Focused Coverage Pattern",
  consistency: "Consistent Coverage",
  activation: "Inactive to Loyal Activation",
  objections: "Objection-Heavy Pairings",
  uplift: "Attribute Uplift Contribution",
};

const MEProfileDialog = ({ meId, context = "coverage", onClose }: Props) => {
  const me = meId ? marketingExecutives.find((m) => m.id === meId) : null;
  if (!me) return null;

  const myPairs = objectionHeavyPairs.filter((p) => p.meId === me.id);
  const sampleRetailers = dealers.slice(0, 4);

  return (
    <Dialog open={!!meId} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">ME Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-1 pb-3 border-b">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-display font-bold text-xl text-foreground">{me.name}</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-info/10 text-info font-medium">{contextLabel[context]}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{me.area}, {me.region}</span>
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{me.mappedRetailers} mapped retailers</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
          <Card className="p-3">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Visits 30d</p>
            <p className="font-display font-bold text-lg">{me.visitsLast30d}</p>
          </Card>
          <Card className="p-3">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Unique Retailers</p>
            <p className="font-display font-bold text-lg">{me.uniqueRetailersVisited}</p>
          </Card>
          <Card className="p-3">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Top-5 Concentration</p>
            <p className="font-display font-bold text-lg">{me.topRetailerConcentration}%</p>
          </Card>
          <Card className="p-3">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Attribute Uplift</p>
            <p className="font-display font-bold text-lg">+{me.attributesUplift}%</p>
          </Card>
        </div>

        {context === "objections" && myPairs.length > 0 && (
          <Card className="p-4 mt-3">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-warning" />Objection-heavy retailers</h3>
            <ul className="space-y-2 text-sm">
              {myPairs.map((p, i) => {
                const d = dealers.find((x) => x.id === p.dealerId);
                return (
                  <li key={i} className="flex items-center justify-between border-b last:border-b-0 pb-2 last:pb-0">
                    <span className="text-foreground/80">{d?.name ?? p.dealerId}</span>
                    <span className="text-xs text-muted-foreground">{p.objection} - repeated {p.repeatedCount}x</span>
                  </li>
                );
              })}
            </ul>
          </Card>
        )}

        {context === "uplift" && (
          <Card className="p-4 mt-3">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-success" />Attributes improving under this ME</h3>
            <ul className="space-y-1.5 text-sm text-foreground/85">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" />JK Alignment - moving up steadily across the mapped set</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" />Value Proposition understanding - notable jump after multi-product sessions</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" />Market awareness - improving via consistent listening conversations</li>
            </ul>
          </Card>
        )}

        {(context === "coverage" || context === "consistency" || context === "activation") && (
          <Card className="p-4 mt-3">
            <h3 className="font-semibold text-foreground mb-2">Recently engaged retailers</h3>
            <ul className="space-y-1.5 text-sm text-foreground/85">
              {sampleRetailers.map((d) => (
                <li key={d.id} className="flex items-center justify-between border-b last:border-b-0 pb-1.5 last:pb-0">
                  <span>{d.name}</span>
                  <span className="text-xs text-muted-foreground">{d.lastVisit}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        <div className="flex justify-end pt-3">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MEProfileDialog;
