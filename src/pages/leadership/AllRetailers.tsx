import { useMemo, useState } from "react";
import LeadershipLayout from "@/components/leadership/LeadershipLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DealerTypeBadge from "@/components/DealerTypeBadge";
import OpennessBadge from "@/components/OpennessBadge";
import { dealers, DealerType, objectionBreakdown } from "@/data/mockData";
import { Users, ChevronRight, MapPin, Calendar, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Lightbulb, TrendingUp } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";

const regionOptions = [
  { value: "overall", label: "Overall", enabled: false },
  { value: "MH", label: "MH (Maharashtra)", enabled: true },
  { value: "Mumbai", label: "Mumbai", enabled: false },
  { value: "Delhi", label: "Delhi", enabled: false },
  { value: "South", label: "South", enabled: false },
  { value: "East", label: "East", enabled: false },
];

const segmentMeta: { type: DealerType; label: string; cls: string }[] = [
  { type: "loyal", label: "Loyal", cls: "bg-success/10 text-success border-success/20" },
  { type: "new", label: "New", cls: "bg-info/10 text-info border-info/20" },
  { type: "inactive", label: "Inactive", cls: "bg-warning/10 text-warning border-warning/20" },
  { type: "declining", label: "Declining", cls: "bg-destructive/10 text-destructive border-destructive/20" },
];

const radarDataForDealer = (dealer: typeof dealers[0]) => [
  { attribute: "JK Alignment", value: Math.min(dealer.engagementScore + 5, 100) },
  { attribute: "Value Prop", value: Math.max(dealer.engagementScore - 15, 20) },
  { attribute: "Market Awareness", value: Math.max(dealer.engagementScore - 20, 15) },
  { attribute: "Openness", value: dealer.openness === "high" ? 85 : dealer.openness === "medium" ? 60 : 35 },
  { attribute: "Growth Potential", value: Math.min(dealer.engagementScore + 2, 100) },
];

// First-person retailer voice engagement history
const engagementHistory = [
  {
    date: "Apr 12, 2026",
    me: "Ravi Kumar",
    summary: "Discussed multi-product portfolio expansion and JK Paint launch opportunity",
    actionPoints: [
      { goal: "I'll try JK product samples with 2-3 contractors before the next visit", bullets: ["Request 3 sample kits from JK", "Identify 2-3 contractor contacts for trial"] },
      { goal: "I'll set up a JK compact display stand near my counter this week", bullets: ["Coordinate with ME for free stand delivery", "Choose location with high visibility"] },
    ],
    feedback: ["Packaging feels weak during monsoon handling", "Delivery timelines are not predictable for my planning"],
  },
  {
    date: "Apr 5, 2026",
    me: "Ravi Kumar",
    summary: "Relationship building and enrollment in JK Star Retailer loyalty program",
    actionPoints: [
      { goal: "My top priority for the week will be to complete JK Star enrollment", bullets: ["Submit KYC documents", "Download JK Star app"] },
    ],
    feedback: ["Competitor offering better credit terms on similar products"],
  },
  {
    date: "Mar 28, 2026",
    me: "Sunil Sharma",
    summary: "Market intelligence gathering and price feedback discussion",
    actionPoints: [
      { goal: "I'll share local pricing observations with the area manager this week", bullets: ["Compile pricing from 3 nearby competitors", "Submit report to area manager"] },
      { goal: "I'll follow up on the delayed delivery escalation", bullets: ["Track shipment status", "Confirm revised delivery date"] },
    ],
    feedback: ["My last order was delayed by 5 days — affected my customer commitments", "I'd like more frequent ME visits"],
  },
];

type CategoryFilter = "all" | DealerType;

const AllRetailers = () => {
  const [region, setRegion] = useState<string>("MH");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [selectedDealerId, setSelectedDealerId] = useState<string | null>(null);
  const [expandedEntry, setExpandedEntry] = useState<number | null>(null);

  // For now all dealers are MH. "Overall" disabled; "MH" shows all.
  const regionDealers = useMemo(() => {
    if (region === "MH") return dealers;
    return [];
  }, [region]);

  const filteredDealers = useMemo(() => {
    if (category === "all") return regionDealers;
    return regionDealers.filter((d) => d.type === category);
  }, [regionDealers, category]);

  const summary = useMemo(() => {
    return segmentMeta.map((s) => {
      const count = regionDealers.filter((d) => d.type === s.type).length;
      const total = regionDealers.length || 1;
      const pct = Math.round((count / total) * 100);
      return { ...s, count, pct };
    });
  }, [regionDealers]);

  // Aggregate attribute metrics across the filtered set
  const aggregateAttributes = useMemo(() => {
    if (filteredDealers.length === 0) return [];
    const sums = { "JK Alignment": 0, "Value Prop": 0, "Market Awareness": 0, "Openness": 0, "Growth Potential": 0 } as Record<string, number>;
    filteredDealers.forEach((d) => {
      radarDataForDealer(d).forEach((r) => { sums[r.attribute] += r.value; });
    });
    return Object.entries(sums).map(([attribute, total]) => ({
      attribute,
      value: Math.round(total / filteredDealers.length),
    }));
  }, [filteredDealers]);

  // Synthesized insights based on region + category
  const synthesizedInsights = useMemo(() => {
    const regionLabel = region === "MH" ? "MH" : "this region";
    const segLabel = category === "all" ? "retailers" : `${category} retailers`;
    if (filteredDealers.length === 0) return [];
    const openness = aggregateAttributes.find((a) => a.attribute === "Openness")?.value ?? 0;
    const valueProp = aggregateAttributes.find((a) => a.attribute === "Value Prop")?.value ?? 0;
    const alignment = aggregateAttributes.find((a) => a.attribute === "JK Alignment")?.value ?? 0;
    const insights: string[] = [];
    if (openness >= 60 && valueProp < 60) {
      insights.push(`${segLabel} in ${regionLabel} show high openness but lower understanding of the value proposition — a clear opportunity for targeted product knowledge sessions.`);
    }
    if (alignment >= 70) {
      insights.push(`Alignment to JK is strong among ${segLabel} in ${regionLabel} — consider deeper co-creation on category expansion.`);
    } else {
      insights.push(`Alignment to JK is moderate — invest in story-led engagement to convert intent into advocacy.`);
    }
    if (category === "inactive" || category === "declining") {
      insights.push(`Pattern suggests systemic friction (delivery, service) — a regional listening review is recommended before pushing volume.`);
    }
    if (insights.length === 0) {
      insights.push(`${segLabel} in ${regionLabel} sit in a balanced zone — focus on selective deepening rather than broad initiatives.`);
    }
    return insights;
  }, [filteredDealers, aggregateAttributes, region, category]);

  const selectedDealer = selectedDealerId ? dealers.find((d) => d.id === selectedDealerId) : null;

  return (
    <LeadershipLayout>
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">All Retailers</h1>
            <p className="text-sm text-muted-foreground mt-1">Unified view of retailer morphologies and profiles</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Region</span>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {regionOptions.map((r) => (
                  <SelectItem key={r.value} value={r.value} disabled={!r.enabled}>
                    {r.label}{!r.enabled && " — Coming soon"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="text-sm text-muted-foreground ml-2">Category</span>
            <Select value={category} onValueChange={(v) => setCategory(v as CategoryFilter)}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="loyal">Loyal</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="declining">Declining</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Morphology summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {summary.map((seg) => (
            <Card
              key={seg.type}
              className={`p-4 border cursor-pointer transition-all ${seg.cls} ${category === seg.type ? "ring-2 ring-foreground/20" : "hover:opacity-90"}`}
              onClick={() => setCategory(category === seg.type ? "all" : seg.type)}
            >
              <Users className="w-5 h-5 mb-2" />
              <p className="font-bold text-2xl">{seg.count.toLocaleString()}</p>
              <p className="text-sm font-medium">{seg.label} Retailers</p>
              <p className="text-xs opacity-70">{seg.pct}% of total</p>
            </Card>
          ))}
        </div>

        {/* Region-based insights panel */}
        {regionDealers.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Top objections */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <h3 className="font-semibold text-foreground">Top Objections</h3>
              </div>
              <ul className="space-y-2">
                {objectionBreakdown.slice(0, 5).map((o) => (
                  <li key={o.name} className="flex items-center justify-between text-sm">
                    <span className="text-foreground/80">{o.name}</span>
                    <span className="font-semibold text-foreground">{o.value}%</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Aggregated attribute metrics */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-info" />
                <h3 className="font-semibold text-foreground">Attribute Metrics</h3>
              </div>
              <div className="space-y-2">
                {aggregateAttributes.map((a) => (
                  <div key={a.attribute}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{a.attribute}</span>
                      <span className="font-semibold text-foreground">{a.value}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary/70 rounded-full" style={{ width: `${a.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Synthesized insights */}
            <Card className="p-4 bg-info/5 border-info/20">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-info" />
                <h3 className="font-semibold text-foreground">Leadership Insights</h3>
              </div>
              <ul className="space-y-2 text-sm text-foreground/85">
                {synthesizedInsights.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-info mt-1.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}

        {/* Retailer list */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground">All Retailers ({filteredDealers.length})</h3>
            {category !== "all" && (
              <button className="text-xs text-primary font-medium" onClick={() => setCategory("all")}>Clear category filter</button>
            )}
          </div>
          <div className="divide-y divide-border">
            {filteredDealers.map((dealer) => (
              <button
                key={dealer.id}
                className="w-full p-4 flex items-center gap-4 hover:bg-secondary/50 transition-colors text-left"
                onClick={() => { setSelectedDealerId(dealer.id); setExpandedEntry(null); }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{dealer.name}</span>
                    <DealerTypeBadge type={dealer.type} />
                  </div>
                  <p className="text-sm text-muted-foreground">{dealer.location}</p>
                </div>
                <div className="text-right shrink-0">
                  <OpennessBadge level={dealer.openness} />
                </div>
                <p className="text-xs text-muted-foreground shrink-0 w-24 text-right">{dealer.lastVisit}</p>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            ))}
            {filteredDealers.length === 0 && (
              <p className="p-8 text-center text-muted-foreground">No retailers match the selected filters.</p>
            )}
          </div>
        </Card>

        {/* Retailer profile popup */}
        <Dialog open={!!selectedDealer} onOpenChange={(o) => !o && setSelectedDealerId(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedDealer && (
              <>
                <DialogHeader>
                  <DialogTitle className="font-display text-xl">Retailer Profile</DialogTitle>
                </DialogHeader>

                {/* Header — plain text, no large card, no red */}
                <div className="space-y-1 pb-2 border-b">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-display font-bold text-xl text-foreground">{selectedDealer.name}</h2>
                    <DealerTypeBadge type={selectedDealer.type} />
                    <OpennessBadge level={selectedDealer.openness} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{selectedDealer.location}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{selectedDealer.lastVisit}</span>
                    <span>{selectedDealer.dealerCode}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                  {/* Radar */}
                  <Card className="p-4">
                    <h3 className="font-semibold text-foreground mb-3">Retailer Attributes</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <RadarChart data={radarDataForDealer(selectedDealer)} cx="50%" cy="50%" outerRadius="70%">
                        <PolarGrid stroke="hsl(220,13%,90%)" />
                        <PolarAngleAxis dataKey="attribute" tick={{ fontSize: 11 }} stroke="hsl(220,10%,46%)" />
                        <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={2} />
                      </RadarChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                      {radarDataForDealer(selectedDealer).map((d) => (
                        <div key={d.attribute} className="flex items-center justify-between bg-secondary/40 rounded px-2 py-1.5">
                          <span className="text-muted-foreground">{d.attribute}</span>
                          <span className="font-bold text-foreground">{d.value}%</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Engagement Timeline — same as ME app */}
                  <Card className="p-4">
                    <h3 className="font-semibold text-foreground mb-3">Engagement Timeline</h3>
                    <div className="space-y-4">
                      {engagementHistory.map((entry, i) => {
                        const isExpanded = expandedEntry === i;
                        return (
                          <div key={i} className="relative pl-6 border-l-2 border-border pb-4 last:pb-0">
                            <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary" />
                            <button className="w-full text-left" onClick={() => setExpandedEntry(isExpanded ? null : i)}>
                              <p className="text-xs text-muted-foreground">{entry.date} · {entry.me}</p>
                              <p className="text-sm text-foreground mt-0.5">{entry.summary}</p>
                              <span className="text-xs text-primary mt-1 inline-flex items-center gap-1">
                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                {isExpanded ? "Collapse" : "View details"}
                              </span>
                            </button>
                            {isExpanded && (
                              <div className="mt-3 space-y-3 animate-fade-in">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Action Points
                                  </div>
                                  {entry.actionPoints.map((ap, j) => (
                                    <div key={j} className="bg-secondary/40 rounded-lg p-3">
                                      <p className="text-sm font-medium text-foreground">{ap.goal}</p>
                                      <ul className="mt-1.5 space-y-1">
                                        {ap.bullets.map((b, k) => (
                                          <li key={k} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                            <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                                            {b}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    <AlertTriangle className="w-3 h-3" />
                                    Key Critical Feedback
                                  </div>
                                  {entry.feedback.map((fb, j) => (
                                    <div key={j} className="bg-warning/5 border border-warning/20 rounded-lg px-3 py-2 text-sm text-foreground/80">
                                      {fb}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </div>

                {/* Insights */}
                <Card className="p-4 bg-info/5 border-info/20">
                  <h3 className="font-semibold text-foreground mb-2">Leadership Insights</h3>
                  <ul className="space-y-1.5 text-sm text-foreground/85">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-info mt-1.5 shrink-0" />
                      High openness paired with moderate value-proposition understanding — opportunity for targeted product knowledge sessions.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-info mt-1.5 shrink-0" />
                      Repeated feedback on delivery predictability — consider regional supply review.
                    </li>
                  </ul>
                </Card>

                <div className="flex justify-end pt-2">
                  <Button variant="outline" onClick={() => setSelectedDealerId(null)}>Close</Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </LeadershipLayout>
  );
};

export default AllRetailers;
