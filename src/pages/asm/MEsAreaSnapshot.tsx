import { useMemo, useState } from "react";
import ASMLayout from "@/components/asm/ASMLayout";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MEProfileDialog from "@/components/leadership/MEProfileDialog";
import { marketingExecutives } from "@/data/meAnalytics";
import { ChevronRight, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const areas = ["All areas", ...Array.from(new Set(marketingExecutives.map((m) => m.area)))];

type Tag = "Low" | "Medium" | "High";
const concentrationTag = (pct: number): Tag => (pct >= 60 ? "High" : pct >= 40 ? "Medium" : "Low");
const tagCls: Record<Tag, string> = {
  Low: "bg-success/15 text-success",
  Medium: "bg-warning/15 text-warning",
  High: "bg-destructive/15 text-destructive",
};
const tagLabel: Record<Tag, string> = {
  Low: "High Coverage",
  Medium: "Medium Coverage",
  High: "Low Coverage",
};

const tagHelp: Record<Tag, string> = {
  Low: "High coverage - visits are spread across the mapped retailer base.",
  Medium: "Medium coverage - some skew toward a smaller set of retailers.",
  High: "Low coverage - majority of visits go to a small subset (Pareto skew).",
};

const MEsAreaSnapshot = () => {
  const [area, setArea] = useState<string>("All areas");
  const [selected, setSelected] = useState<string | null>(null);

  const list = useMemo(
    () => (area === "All areas" ? marketingExecutives : marketingExecutives.filter((m) => m.area === area)),
    [area]
  );

  return (
    <ASMLayout>
      <div className="space-y-6">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">MEs Area Snapshot</h1>
            <p className="text-sm text-muted-foreground mt-1">ME engagement quality contextualised to area.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Area</span>
            <Select value={area} onValueChange={setArea}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                {areas.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground">MEs in view ({list.length})</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1 cursor-help">
                  <Info className="w-3.5 h-3.5" />Coverage status
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">
                Coverage status is derived from how many of the recent visits cluster around the top 5 mapped retailers. High concentration implies low coverage.
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="divide-y divide-border">
            {list.map((m) => {
              const tag = concentrationTag(m.topRetailerConcentration);
              return (
                <button
                  key={m.id}
                  onClick={() => setSelected(m.id)}
                  className="w-full p-4 flex items-center gap-4 hover:bg-secondary/50 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{m.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {m.area} · {m.uniqueRetailersVisited}/{m.mappedRetailers} retailers · +{m.attributesUplift}% retailer attributes uplift
                    </p>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagCls[tag]}`}>{tagLabel[tag]}</span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs">{tagHelp[tag]}</TooltipContent>
                  </Tooltip>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </button>
              );
            })}
            {list.length === 0 && <p className="p-8 text-center text-muted-foreground">No MEs in this area.</p>}
          </div>
        </Card>
      </div>

      <MEProfileDialog meId={selected} context="coverage" onClose={() => setSelected(null)} />
    </ASMLayout>
  );
};

export default MEsAreaSnapshot;
