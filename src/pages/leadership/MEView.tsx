import { useState } from "react";
import LeadershipLayout from "@/components/leadership/LeadershipLayout";
import { Card } from "@/components/ui/card";
import MEProfileDialog from "@/components/leadership/MEProfileDialog";
import {
  focusedCoverageMEs,
  consistentCoverageMEs,
  inactiveToLoyalMEs,
  objectionHeavyPairs,
  dimensionUpliftMEs,
  marketingExecutives,
} from "@/data/meAnalytics";
import { dealers } from "@/data/mockData";
import { Target, Users, Repeat, AlertTriangle, TrendingUp, ChevronRight, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Ctx = "coverage" | "consistency" | "activation" | "objections" | "uplift";

const SectionCard = ({
  icon: Icon,
  title,
  story,
  children,
}: {
  icon: typeof Target;
  title: string;
  story: string;
  children: React.ReactNode;
}) => (
  <Card className="p-5">
    <div className="flex items-start gap-3 mb-3">
      <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{story}</p>
      </div>
    </div>
    <div className="divide-y divide-border">{children}</div>
  </Card>
);

const MERow = ({
  name,
  area,
  note,
  onClick,
}: { name: string; area: string; note: string; onClick: () => void }) => (
  <button
    className="w-full flex items-center gap-3 py-2.5 text-left hover:bg-secondary/40 transition-colors px-1 rounded"
    onClick={onClick}
  >
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-foreground">{name}</p>
      <p className="text-xs text-muted-foreground">{area} · {note}</p>
    </div>
    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
  </button>
);

const MEView = () => {
  const [selected, setSelected] = useState<{ id: string; ctx: Ctx } | null>(null);

  return (
    <LeadershipLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">ME View</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Region-wise visibility into ME engagement effectiveness with retailers
          </p>
        </div>

        {/* Region snapshot */}
        <Card className="p-4 bg-info/5 border-info/20">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <span className="text-foreground/80"><span className="text-muted-foreground">Region:</span> <span className="font-semibold">Maharashtra</span></span>
            <span className="text-foreground/80"><span className="text-muted-foreground">MEs in view:</span> <span className="font-semibold">{marketingExecutives.length}</span></span>
            <span className="text-foreground/80"><span className="text-muted-foreground">Retailers covered:</span> <span className="font-semibold">{dealers.length * 30}</span></span>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground cursor-help">
                  <Info className="w-3.5 h-3.5" />How to read this view
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">
                Each section highlights a behavioural pattern derived from visit data and engagement notes - click any ME to see context.
              </TooltipContent>
            </Tooltip>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SectionCard
            icon={Target}
            title="Focused Coverage Patterns"
            story="MEs concentrating most of their visits on a small set of retailers."
          >
            {focusedCoverageMEs.map(({ me, note }) => (
              <MERow key={me.id} name={me.name} area={me.area} note={note} onClick={() => setSelected({ id: me.id, ctx: "coverage" })} />
            ))}
            {focusedCoverageMEs.length === 0 && <p className="text-sm text-muted-foreground py-2">No concentration patterns flagged.</p>}
          </SectionCard>

          <SectionCard
            icon={Users}
            title="Consistent Coverage Leaders"
            story="MEs regularly engaging the majority of their mapped retailers."
          >
            {consistentCoverageMEs.map(({ me, note }) => (
              <MERow key={me.id} name={me.name} area={me.area} note={note} onClick={() => setSelected({ id: me.id, ctx: "consistency" })} />
            ))}
            {consistentCoverageMEs.length === 0 && <p className="text-sm text-muted-foreground py-2">No consistent coverage leaders this period.</p>}
          </SectionCard>

          <SectionCard
            icon={Repeat}
            title="Inactive to Loyal Conversion"
            story="MEs who have rebuilt momentum with previously inactive retailers."
          >
            {inactiveToLoyalMEs.map(({ me, note }) => (
              <MERow key={me.id} name={me.name} area={me.area} note={note} onClick={() => setSelected({ id: me.id, ctx: "activation" })} />
            ))}
            {inactiveToLoyalMEs.length === 0 && <p className="text-sm text-muted-foreground py-2">No reactivation pattern in the current window.</p>}
          </SectionCard>

          <SectionCard
            icon={AlertTriangle}
            title="Objection-Heavy ME-Retailer Pairs"
            story="Repeating objections in the same pairings - often a coaching or context signal."
          >
            {objectionHeavyPairs.map((p, i) => {
              const me = marketingExecutives.find((m) => m.id === p.meId)!;
              const dealer = dealers.find((d) => d.id === p.dealerId);
              return (
                <MERow
                  key={i}
                  name={`${me.name} ↔ ${dealer?.name ?? "Retailer"}`}
                  area={me.area}
                  note={`${p.objection} - repeated ${p.repeatedCount}x`}
                  onClick={() => setSelected({ id: me.id, ctx: "objections" })}
                />
              );
            })}
          </SectionCard>

          <SectionCard
            icon={TrendingUp}
            title="Dimension Uplift Contributors"
            story="MEs whose retailers show measurable improvement in JK Alignment, Value Prop, Market Awareness or Openness."
          >
            {dimensionUpliftMEs.map(({ me, note }) => (
              <MERow key={me.id} name={me.name} area={me.area} note={note} onClick={() => setSelected({ id: me.id, ctx: "uplift" })} />
            ))}
          </SectionCard>
        </div>
      </div>

      <MEProfileDialog meId={selected?.id ?? null} context={selected?.ctx} onClose={() => setSelected(null)} />
    </LeadershipLayout>
  );
};

export default MEView;
