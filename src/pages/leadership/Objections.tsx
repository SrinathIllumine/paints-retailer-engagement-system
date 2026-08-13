import { useState } from "react";
import LeadershipLayout from "@/components/leadership/LeadershipLayout";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PieChart, Pie, Cell, Tooltip as RTooltip, ResponsiveContainer } from "recharts";
import { AlertTriangle } from "lucide-react";
import { objectionBreakdown, topObjections } from "@/data/leadershipReports";

const groupedTopObjections = topObjections.reduce<{ cat: string; items: { q: string; e: string }[] }[]>(
  (groups, o) => {
    const group = groups.find((g) => g.cat === o.category);
    const item = { q: o.title, e: o.detail };
    if (group) group.items.push(item);
    else groups.push({ cat: o.category, items: [item] });
    return groups;
  },
  [],
);

const Objections = () => {
  const [openTop, setOpenTop] = useState(false);

  return (
    <LeadershipLayout>
      <div className="space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Retailer Objections</p>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Key retailer objections which are repeating across dealers?
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            National roll-up of the most frequently raised retailer concerns, by category.
          </p>
        </header>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-foreground">Key retailer objections across the country</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Share of objections raised by category</p>
            </div>
            <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              engagement signals
            </span>
          </div>
          <ResponsiveContainer width="100%" height={380}>
            <PieChart>
              <Pie
                data={objectionBreakdown}
                cx="50%"
                cy="50%"
                outerRadius={140}
                dataKey="value"
                label={({ name, value }) => `${name} (${value}%)`}
              >
                {objectionBreakdown.map((o) => (
                  <Cell key={o.name} fill={o.color} />
                ))}
              </Pie>
              <RTooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-end pt-2 border-t border-border mt-2">
            <button
              onClick={() => setOpenTop(true)}
              className="text-primary text-sm font-medium hover:underline"
            >
              See top 5 objections in the country →
            </button>
          </div>
        </Card>
      </div>

      <Dialog open={openTop} onOpenChange={setOpenTop}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Top 5 objections in the country</DialogTitle>
            <DialogDescription>Most frequently raised retailer concerns this period</DialogDescription>
          </DialogHeader>
          <div className="max-h-[72vh] overflow-auto pr-1 space-y-6">
            {groupedTopObjections.map((sec) => (
              <section key={sec.cat}>
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-2">{sec.cat}</p>
                <ul className="space-y-3">
                  {sec.items.map((it, idx) => (
                    <li key={idx} className="pl-3 border-l-2 border-primary/40">
                      <p className="text-sm font-medium text-foreground leading-snug">“{it.q}”</p>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{it.e}</p>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </LeadershipLayout>
  );
};

export default Objections;
