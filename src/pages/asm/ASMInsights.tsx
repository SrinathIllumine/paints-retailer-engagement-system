import { useMemo, useState } from "react";
import ASMLayout from "@/components/asm/ASMLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Swords,
  PackageX,
  Tag,
  UserCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  MapPin,
  Lightbulb,
} from "lucide-react";

type Category = "Competition" | "Product Quality" | "Schemes" | "Contractor" | "Demand";

interface Insight {
  id: string;
  category: Category;
  marketArea: string;
  title: string;
  summary: string;
  tags: string[];
  trend: "up" | "down" | "flat";
  reportedAt: string;
  reportedBy: string;
}

const insights: Insight[] = [
  {
    id: "i1",
    category: "Competition",
    marketArea: "Hinjewadi",
    title: "Chetak Paints aggressively entering Hinjewadi",
    summary:
      "Local sales reps from Chetak are visiting our top contractor-focused dealers. Three of our retailers report being approached in the last 2 weeks.",
    tags: ["new-entrant", "contractor-pull", "discount-pressure"],
    trend: "up",
    reportedAt: "20 Apr",
    reportedBy: "Vikas Patil",
  },
  {
    id: "i2",
    category: "Competition",
    marketArea: "Pune SW",
    title: "Birla piloting EMI payments for retailers",
    summary:
      "Birla offering 30/60/90 day EMI on bulk orders. Particularly attractive to declining retailers with working-capital pressure. Two retailers have signed up.",
    tags: ["financing", "retailer-lock-in", "innovation"],
    trend: "up",
    reportedAt: "18 Apr",
    reportedBy: "Vikas Patil",
  },
  {
    id: "i3",
    category: "Competition",
    marketArea: "Pimpri Chinchwad",
    title: "Asian Paints is locking-in retailers with Putty SKUs by bundling with Paints",
    summary:
      "Sudden spike in Asian Paints Putty SKUs in Pimpri Chinchwad.\nRetailers are getting attractive schemes on Paints only if they buy bundled Putty purchases above 50 bags.\nOur retailers report this is changing their decision on monthly putty orders.",
    tags: ["bundling", "lock-in", "sku-strategy"],
    trend: "up",
    reportedAt: "12 Apr",
    reportedBy: "Anita Deshmukh",
  },
  {
    id: "i4",
    category: "Product Quality",
    marketArea: "Pune NE",
    title: "[Positive Feedback] JK Paint Users Happy with Shade Consistencies – This can be part of core value proposition / campaigns",
    summary:
      "Painters are highlighting consistent coverage and zero shade variation in JK Paint products. This is leading to optimal material consumption & even finish, especially on larger surfaces. This can be part of our core value proposition – or ad campaigns.",
    tags: ["quality", "feedback", "coverage"],
    trend: "up",
    reportedAt: "22 Apr",
    reportedBy: "Sunil Sharma",
  },
  {
    id: "i5",
    category: "Product Quality",
    marketArea: "Pune North",
    title: "Retailers pull back on JK Putty orders over packaging concerns",
    summary:
      "Ahead of the monsoon season, retailers are signaling reluctance to stock JK Putty due to ongoing packaging issues. They report that the product’s single-layer packaging fails to withstand high moisture levels during the monsoon, leading to rapid deterioration in quality and rendering the product unusable.",
    tags: ["packaging", "putty", "monsoon"],
    trend: "down",
    reportedAt: "16 Apr",
    reportedBy: "Priya Nair",
  },
  {
    id: "i6",
    category: "Schemes",
    marketArea: "Pune West",
    title: "Mid-tier retailers want better schemes",
    summary:
      "Majority (i.e. mid-tier) retailers want a points-based scheme with quarterly redemption. Current scheme is volume-locked and discourages mid-tier retailers.",
    tags: ["complexity", "communication", "asks"],
    trend: "down",
    reportedAt: "21 Apr",
    reportedBy: "Ravi Kumar",
  },
  {
    id: "i7",
    category: "Schemes",
    marketArea: "Pune South",
    title: "Asks for simpler retailer loyalty programme",
    summary:
      "Loyal retailers want a points-based scheme with quarterly redemption. Current scheme is volume-locked and discourages mid-tier retailers.",
    tags: ["loyalty", "ask", "redesign"],
    trend: "flat",
    reportedAt: "08 Apr",
    reportedBy: "Anita Deshmukh",
  },
  {
    id: "i8",
    category: "Contractor",
    marketArea: "Pune NE",
    title: "Contractor buying behaviour: smaller, more frequent orders",
    summary:
      "Contractors are placing 2–3 smaller orders per month instead of one large one. Driven by cash-flow caution. Affects our minimum-order incentives.",
    tags: ["contractor", "preference-shift", "product-fit"],
    trend: "up",
    reportedAt: "19 Apr",
    reportedBy: "Sunil Sharma",
  },
  {
    id: "i9",
    category: "Contractor",
    marketArea: "Pune SW",
    title: "Many Contractors in Pune are using JK Putty finish for ‘premium interior repaint jobs’",
    summary:
      "Contractors report choosing JK Putty more often in repainting of premium flats and bungalows where homeowners are sensitive to wall feel and lighting appearance. Helps them achieve a cleaner final paint finish with fewer visible surface marks.\n(other locations can also leverage this insight)",
    tags: ["buying-behavior", "frequency", "incentive-fit"],
    trend: "up",
    reportedAt: "14 Apr",
    reportedBy: "Vikas Patil",
  },
  {
    id: "i10",
    category: "Demand",
    marketArea: "Pune North",
    title: "Demand dip after early monsoon",
    summary:
      "Early monsoon onset has paused 30+ small construction sites in Pune North. Retailers expect ~20% softer demand for the next 3 weeks.",
    tags: ["seasonal", "demand-drop", "monsoon"],
    trend: "down",
    reportedAt: "23 Apr",
    reportedBy: "Priya Nair",
  },
  {
    id: "i11",
    category: "Demand",
    marketArea: "Pune West",
    title: "Festival-led spike expected in white cement",
    summary:
      "Retailers report contractors stocking up for festival re-finishing work. White cement and putty enquiries up week-on-week.",
    tags: ["festival", "spike", "white-cement"],
    trend: "up",
    reportedAt: "17 Apr",
    reportedBy: "Ravi Kumar",
  },
];

const categoryMeta: Record<
  Category,
  { icon: typeof Swords; tone: string; bg: string }
> = {
  Competition: { icon: Swords, tone: "text-primary", bg: "bg-primary/10" },
  "Product Quality": { icon: PackageX, tone: "text-warning", bg: "bg-warning/10" },
  Schemes: { icon: Tag, tone: "text-info", bg: "bg-info/10" },
  Contractor: { icon: UserCircle, tone: "text-success", bg: "bg-success/10" },
  Demand: { icon: TrendingUp, tone: "text-foreground", bg: "bg-secondary" },
};

const TrendIcon = ({ t }: { t: Insight["trend"] }) => {
  if (t === "up") return <TrendingUp className="w-3.5 h-3.5 text-success" />;
  if (t === "down") return <TrendingDown className="w-3.5 h-3.5 text-warning" />;
  return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
};

const ASMInsights = () => {
  const [filter, setFilter] = useState<Category | "all">("all");
  const filtered = useMemo(
    () => (filter === "all" ? insights : insights.filter((i) => i.category === filter)),
    [filter],
  );

  return (
    <ASMLayout hideFilters>
      <div className="space-y-6">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">
              Insights from the Market
            </h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              Pune · 8 ground signals from MEs
            </p>
          </div>
          <Button size="sm" variant="outline" className="text-xs">
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add insight
          </Button>
        </div>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as Category | "all")}>
          <TabsList className="flex flex-wrap h-auto">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            {(Object.keys(categoryMeta) as Category[]).map((c) => (
              <TabsTrigger key={c} value={c} className="text-xs">
                {c}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((i) => {
            const meta = categoryMeta[i.category];
            const Icon = meta.icon;
            return (
              <Card key={i.id} className="p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${meta.bg}`}>
                    <Icon className={`w-4 h-4 ${meta.tone}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className={`font-medium ${meta.tone}`}>{i.category}</span>
                      <span>·</span>
                      <span>{i.marketArea}</span>
                      <TrendIcon t={i.trend} />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm mt-1 leading-snug">
                      {i.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                  {i.summary}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {i.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10px] font-normal">
                      #{t}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-muted-foreground">
                  <span>
                    {i.reportedAt} · {i.reportedBy}
                  </span>
                  <Button size="sm" variant="ghost" className="h-7 text-xs">
                    <Lightbulb className="w-3 h-3 mr-1" />
                    Add action note
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <Card className="p-8 text-center text-sm text-muted-foreground">
            No insights in this category yet
          </Card>
        )}
      </div>
    </ASMLayout>
  );
};

export default ASMInsights;
