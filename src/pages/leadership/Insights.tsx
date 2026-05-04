import LeadershipLayout from "@/components/leadership/LeadershipLayout";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { nationalInsights, type Actionability, type InsightCategory } from "@/data/leadershipData";
import { AlertCircle, Box, HandCoins, Lightbulb, PackageCheck, Store } from "lucide-react";

const categories: { key: InsightCategory; label: string; description: string; icon: typeof Lightbulb }[] = [
  {
    key: "Competition",
    label: "Competition-related",
    description: "Large brand innovations and competitor lock-in strategies emerging from ME conversations.",
    icon: Lightbulb,
  },
  {
    key: "Product Quality",
    label: "Product-quality Related",
    description: "Complaints around packing, damage, weight, labelling, and shelf confidence.",
    icon: PackageCheck,
  },
  {
    key: "Schemes",
    label: "Schemes-related",
    description: "Feedback requesting simpler incentive structures and lower scheme complexity.",
    icon: HandCoins,
  },
  {
    key: "Customer",
    label: "Customer-related",
    description: "Contractor and retailer behavior shifts affecting engagement priorities.",
    icon: Store,
  },
  {
    key: "Demand",
    label: "Demand-related",
    description: "State-level demand signals, including seasonal and structural changes.",
    icon: Box,
  },
];

const actionClass: Record<Actionability, string> = {
  Low: "border-muted bg-muted text-muted-foreground",
  Medium: "border-warning/30 bg-warning/10 text-warning",
  High: "border-primary/30 bg-primary/10 text-primary",
};

const Insights = () => (
  <LeadershipLayout>
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Market Intelligence</p>
        <h1 className="font-display text-2xl font-bold text-foreground">
          What are the market intelligence patterns emerging from the ground across the states?
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Qualitative national roll-up of the ASM Market Insights logic, organized by state impact, recency, and actionability.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {categories.map((category) => {
          const count = nationalInsights.filter((insight) => insight.category === category.key).length;
          return (
            <Card key={category.key} className="p-4 border-border/70 shadow-sm">
              <category.icon className="h-5 w-5 text-primary" />
              <p className="mt-3 text-sm font-semibold text-foreground">{category.label}</p>
              <p className="mt-1 font-display text-2xl font-bold text-foreground">{count}</p>
              <p className="text-xs text-muted-foreground">active patterns</p>
            </Card>
          );
        })}
      </section>

      <section className="space-y-5">
        {categories.map((category) => {
          const insights = nationalInsights.filter((insight) => insight.category === category.key);
          return (
            <div key={category.key} className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <category.icon className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-foreground">{category.label}</h2>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                {insights.map((insight) => (
                  <Card key={insight.id} className="p-5 border-border/70 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold leading-snug text-foreground">{insight.title}</h3>
                      <Badge variant="outline" className={actionClass[insight.actionability]}>
                        {insight.actionability}
                      </Badge>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{insight.summary}</p>
                    <div className="mt-4 space-y-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">State(s) impacted</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {insight.states.map((state) => (
                            <Badge key={state} variant="secondary">{state}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                        <AlertCircle className="h-3.5 w-3.5 text-primary" />
                        {insight.frequency}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  </LeadershipLayout>
);

export default Insights;
