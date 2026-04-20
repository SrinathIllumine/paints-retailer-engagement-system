import { useMemo, useState } from "react";
import ASMLayout from "@/components/asm/ASMLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MEProfileDialog from "@/components/leadership/MEProfileDialog";
import { marketingExecutives } from "@/data/meAnalytics";
import { ChevronRight, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Window = "7d" | "30d" | "90d";

const windowMultiplier: Record<Window, number> = { "7d": 0.25, "30d": 1, "90d": 2.4 };

type Tag = "Low" | "Medium" | "High";
const upliftTag = (n: number): Tag => (n >= 15 ? "High" : n >= 8 ? "Medium" : "Low");
const tagCls: Record<Tag, string> = {
  Low: "bg-warning/15 text-warning",
  Medium: "bg-info/15 text-info",
  High: "bg-success/15 text-success",
};
const tagHelp: Record<Tag, string> = {
  Low: "Low engagement uplift - retailer attributes have moved minimally during the period.",
  Medium: "Medium uplift - moderate movement across tracked retailer attributes.",
  High: "High uplift - meaningful improvement in JK alignment, openness or value-prop understanding.",
};

const MEsWeeklySnapshot = () => {
  const [win, setWin] = useState<Window>("7d");
  const [selected, setSelected] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      marketingExecutives.map((m) => ({
        ...m,
        visits: Math.round(m.visitsLast30d * windowMultiplier[win]),
        unique: Math.round(m.uniqueRetailersVisited * Math.min(windowMultiplier[win], 1)),
        uplift: Math.round(m.attributesUplift * windowMultiplier[win] * 0.6),
      })),
    [win]
  );

  return (
    <ASMLayout>
      <div className="space-y-6">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">MEs Weekly Snapshot</h1>
            <p className="text-sm text-muted-foreground mt-1">ME engagement quality contextualised to time period.</p>
          </div>
          <Tabs value={win} onValueChange={(v) => setWin(v as Window)}>
            <TabsList>
              <TabsTrigger value="7d">7 days</TabsTrigger>
              <TabsTrigger value="30d">30 days</TabsTrigger>
              <TabsTrigger value="90d">90 days</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground">MEs ({rows.length})</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1 cursor-help">
                  <Info className="w-3.5 h-3.5" />Uplift tag
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">
                Uplift tag reflects average % movement across tracked retailer attributes during the selected window.
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="divide-y divide-border">
            {rows.map((m) => {
              const tag = upliftTag(m.uplift);
              return (
                <button
                  key={m.id}
                  onClick={() => setSelected(m.id)}
                  className="w-full p-4 flex items-center gap-4 hover:bg-secondary/50 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{m.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {m.area} · {m.visits} visits · {m.unique} unique retailers
                    </p>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagCls[tag]}`}>{tag} uplift</span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs">{tagHelp[tag]}</TooltipContent>
                  </Tooltip>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      <MEProfileDialog meId={selected} context="uplift" onClose={() => setSelected(null)} />
    </ASMLayout>
  );
};

export default MEsWeeklySnapshot;
