import { useMemo, useState } from "react";
import LeadershipLayout from "@/components/leadership/LeadershipLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Swords, PackageX, Tag, UserCircle, TrendingUp } from "lucide-react";
import { insightCategories, repeatedInsights, type InsightCategory } from "@/data/leadershipReports";

const categoryMeta: Record<InsightCategory, { icon: typeof Swords; tone: string; bg: string }> = {
  "Competition Related": { icon: Swords, tone: "text-primary", bg: "bg-primary/10" },
  "Product Quality": { icon: PackageX, tone: "text-warning", bg: "bg-warning/10" },
  "Schemes Related": { icon: Tag, tone: "text-info", bg: "bg-info/10" },
  "Contractor Related": { icon: UserCircle, tone: "text-success", bg: "bg-success/10" },
  "Demand Related": { icon: TrendingUp, tone: "text-foreground", bg: "bg-secondary" },
};

const Insights = () => {
  const [filter, setFilter] = useState<InsightCategory | "all">("all");
  const filtered = useMemo(
    () => (filter === "all" ? repeatedInsights : repeatedInsights.filter((i) => i.category === filter)),
    [filter],
  );

  return (
    <LeadershipLayout>
      <div className="space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Repeated Insights</p>
          <h1 className="font-display text-2xl font-bold text-foreground">
            What are the repeated insights across markets?
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Patterns reported by MEs and ASMs that keep recurring across multiple markets, grouped by theme.
          </p>
        </header>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as InsightCategory | "all")}>
          <TabsList className="flex flex-wrap h-auto">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            {insightCategories.map((c) => (
              <TabsTrigger key={c} value={c} className="text-xs">
                {c}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((insight) => {
            const meta = categoryMeta[insight.category];
            const Icon = meta.icon;
            return (
              <Card key={insight.id} className="p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${meta.bg}`}>
                    <Icon className={`w-4 h-4 ${meta.tone}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className={`text-xs font-medium ${meta.tone}`}>{insight.category}</span>
                    <h3 className="font-semibold text-foreground text-sm mt-1 leading-snug">{insight.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{insight.detail}</p>
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <Card className="p-8 text-center text-sm text-muted-foreground">No insights in this category yet</Card>
        )}
      </div>
    </LeadershipLayout>
  );
};

export default Insights;
