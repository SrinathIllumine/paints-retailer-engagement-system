import LeadershipLayout from "@/components/leadership/LeadershipLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DealerTypeBadge from "@/components/DealerTypeBadge";
import OpennessBadge from "@/components/OpennessBadge";
import { dealers } from "@/data/mockData";
import { Target, Rocket, TrendingUp, Users, ChevronRight, MapPin, Calendar, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";

const strategies = [
  {
    icon: Rocket,
    label: "Aligned to JK's Vision",
    description: "Retailers showing high openness and alignment with JK's multi-product strategy",
    filter: (d: typeof dealers[0]) => d.openness === "high",
    actionPoints: [
      "High alignment cluster - data shows readiness for co-creation, not push",
      "Stories from these retailers can shape narrative for adjacent segments",
    ],
  },
  {
    icon: TrendingUp,
    label: "Inactive Retailers with Growth Mindset",
    description: "Inactive retailers showing medium+ openness, ready for re-engagement and conversion",
    filter: (d: typeof dealers[0]) => d.type === "inactive" && d.openness !== "low",
    actionPoints: [
      "Inactivity here pairs with openness - signals friction, not disinterest",
      "Repeated objections concentrate on service",
    ],
  },
  {
    icon: Target,
    label: "Loyal Retailers with Less Growth",
    description: "Loyal retailers with good scores but limited recent growth activity",
    filter: (d: typeof dealers[0]) => d.type === "loyal" && d.engagementScore < 90,
    actionPoints: [
      "Loyalty without growth often indicates capital or contractor-pull constraints",
      "Engagement quality flattening for loyal retailers",
    ],
  },
  {
    icon: Users,
    label: "All Declining Retailers",
    description: "Retailers needing immediate intervention",
    filter: (d: typeof dealers[0]) => d.type === "declining",
    actionPoints: [
      "Decline pattern correlates with delivery and service signals across regions",
      "Recovery historically tracks better with relationship cadence than transactional offers",
    ],
  },
];

const radarDataForDealer = (dealer: typeof dealers[0]) => [
  { attribute: "JK Alignment", value: Math.min(dealer.engagementScore + 5, 100) },
  { attribute: "Value Prop", value: Math.max(dealer.engagementScore - 15, 20) },
  { attribute: "Market Awareness", value: Math.max(dealer.engagementScore - 20, 15) },
  { attribute: "Openness", value: dealer.openness === "high" ? 85 : dealer.openness === "medium" ? 60 : 35 },
  { attribute: "Growth Potential", value: Math.min(dealer.engagementScore + 2, 100) },
];

const engagementHistory = [
  {
    date: "Apr 12, 2026",
    me: "Ravi Kumar",
    summary: "Discussed multi-product portfolio expansion and JK Paint launch opportunity",
    actionPoints: [
      { goal: "I'll try JK product samples with 2-3 contractors before the next visit", bullets: ["Request 3 sample kits from JK", "Identify 2-3 contractor contacts for trial"] },
    ],
    feedback: ["Packaging feels weak during monsoon handling"],
  },
  {
    date: "Apr 5, 2026",
    me: "Ravi Kumar",
    summary: "Relationship building and enrollment in JK Star Retailer loyalty program",
    actionPoints: [
      { goal: "My top priority for the week will be to complete JK Star enrollment", bullets: ["Submit KYC documents"] },
    ],
    feedback: ["Competitor offering better credit terms on similar products"],
  },
];

const StrategicSlicing = () => {
  const [active, setActive] = useState(0);
  const [selectedDealerId, setSelectedDealerId] = useState<string | null>(null);
  const [expandedEntry, setExpandedEntry] = useState<number | null>(null);
  const filtered = dealers.filter(strategies[active].filter);
  const selectedDealer = selectedDealerId ? dealers.find((d) => d.id === selectedDealerId) : null;

  return (
    <LeadershipLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">Strategic Targeting</h1>
          <p className="text-sm text-muted-foreground mt-1">Smart retailer segments for targeted action</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strategies.map((s, i) => (
            <Card
              key={i}
              className={`p-4 cursor-pointer transition-all ${active === i ? "ring-2 ring-primary border-primary" : "hover:shadow-md"}`}
              onClick={() => setActive(i)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${active === i ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{s.label}</h3>
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                  <p className="text-xs font-medium text-primary mt-1">{dealers.filter(s.filter).length} retailers</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">{strategies[active].label} ({filtered.length})</h3>
          </div>
          <div className="divide-y divide-border">
            {filtered.map((dealer) => (
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
                <OpennessBadge level={dealer.openness} />
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="p-8 text-center text-muted-foreground">No retailers match this criteria</p>
            )}
          </div>
        </Card>

        {/* Retailer profile popup - same pattern as All Retailers */}
        <Dialog open={!!selectedDealer} onOpenChange={(o) => !o && setSelectedDealerId(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedDealer && (
              <>
                <DialogHeader>
                  <DialogTitle className="font-display text-xl">Retailer Profile</DialogTitle>
                </DialogHeader>

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

export default StrategicSlicing;
