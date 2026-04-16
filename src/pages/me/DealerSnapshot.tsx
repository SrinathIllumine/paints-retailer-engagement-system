import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MeLayout from "@/components/me/MeLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DealerTypeBadge from "@/components/DealerTypeBadge";
import { MapPin, Award, ChevronRight, ChevronDown, ChevronUp, Layers, Rocket, Users, History, MessageSquare, AlertTriangle, CheckCircle2, X } from "lucide-react";
import { dealers, engagementThemes } from "@/data/mockData";

const revenueLabelMap: Record<string, string> = {
  A: "> ₹2 Cr",
  B: "₹1–2 Cr",
  C: "< ₹1 Cr",
};

const themeIcons: Record<string, typeof Layers> = { Layers, Rocket, Users };

// Mock engagement history data
const engagementHistory = [
  {
    date: "Apr 12, 2026",
    summary: "Discussed multi-product portfolio expansion and JK Paint launch opportunity",
    actionPoints: [
      { goal: "Try a sample of paints in a few houses to check quality and get customer feedback", bullets: ["Request 3 sample kits from JK", "Identify 2-3 contractor contacts for trial"] },
      { goal: "Set up a JK compact display stand near the counter", bullets: ["Coordinate with ME for free stand delivery", "Choose location with high visibility"] },
    ],
    feedback: ["Need for improvement in packaging during monsoon", "Delivery timelines need to be more predictable"],
  },
  {
    date: "Apr 5, 2026",
    summary: "Relationship building and enrollment in JK Star Retailer loyalty program",
    actionPoints: [
      { goal: "Complete JK Star enrollment and activate first reward cycle", bullets: ["Submit KYC documents", "Download JK Star app"] },
    ],
    feedback: ["Competitor offering better credit terms on similar products"],
  },
  {
    date: "Mar 28, 2026",
    summary: "Market intelligence gathering and price feedback discussion",
    actionPoints: [
      { goal: "Share competitive pricing data for white cement in the area", bullets: ["Compile pricing from 3 nearby competitors", "Submit report to area manager"] },
      { goal: "Follow up on delayed delivery escalation", bullets: ["Track shipment status", "Confirm revised delivery date with retailer"] },
    ],
    feedback: ["JK delivery was delayed by 5 days last order", "Would like more frequent ME visits"],
  },
];

const DealerSnapshot = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dealer = dealers.find((d) => d.id === id) || dealers[0];
  const [showHistory, setShowHistory] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState<number | null>(null);

  return (
    <MeLayout title="Retailer Snapshot" showBack>
      <div className="p-4 space-y-4">
        {/* Dealer Card */}
        <Card className="overflow-hidden animate-slide-up">
          <div className="bg-primary/5 p-4 border-b border-border/50">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display font-bold text-lg text-foreground">{dealer.name}</h2>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{dealer.location}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{dealer.dealerCode}</p>
              </div>
              <DealerTypeBadge type={dealer.type} />
            </div>
          </div>
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-0.5">Category</p>
                <DealerTypeBadge type={dealer.type} />
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-0.5">Revenue Tier</p>
                <div className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-secondary-foreground" />
                  <span className="font-bold text-foreground">{dealer.revenueCategory}</span>
                  <span className="text-xs text-muted-foreground">{revenueLabelMap[dealer.revenueCategory]}</span>
                </div>
              </div>
            </div>

            {/* View Engagement History CTA */}
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => setShowHistory(true)}
            >
              <span className="flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                View Engagement History
              </span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Engagement History Modal */}
        {showHistory && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-card rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-card border-b border-border px-4 py-3 flex items-center justify-between rounded-t-2xl z-10">
                <h3 className="font-display font-bold text-foreground">Engagement History</h3>
                <button onClick={() => { setShowHistory(false); setExpandedEntry(null); }} className="p-1 text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                {engagementHistory.map((entry, i) => {
                  const isExpanded = expandedEntry === i;
                  return (
                    <div key={i} className="relative pl-6 border-l-2 border-border pb-4 last:pb-0">
                      <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary" />
                      <button
                        className="w-full text-left"
                        onClick={() => setExpandedEntry(isExpanded ? null : i)}
                      >
                        <p className="text-xs text-muted-foreground font-medium">{entry.date}</p>
                        <p className="text-sm text-foreground mt-0.5">{entry.summary}</p>
                        <span className="text-xs text-primary mt-1 inline-flex items-center gap-1">
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          {isExpanded ? "Collapse" : "View details"}
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="mt-3 space-y-3 animate-fade-in">
                          {/* Action Points */}
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

                          {/* Key Critical Feedback */}
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
            </div>
          </div>
        )}

        {/* Customized Engagement Plan */}
        <div className="animate-slide-up" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
          <h3 className="text-sm font-semibold text-muted-foreground mb-1 uppercase tracking-wider">CUSTOMIZED ENGAGEMENT PLAN</h3>
          <p className="text-xs text-muted-foreground mb-3">Guided discussions tailored for {dealer.name} — choose a theme to begin.</p>
          <div className="space-y-3">
            {engagementThemes.map((theme, i) => {
              const Icon = themeIcons[theme.icon] || Layers;
              return (
                <Card
                  key={theme.id}
                  className="p-4 cursor-pointer active:scale-[0.98] transition-all hover:shadow-md animate-slide-up"
                  style={{ animationDelay: `${(i + 2) * 60}ms`, animationFillMode: "backwards" }}
                  onClick={() => navigate(`/me/engagement/${dealer.id}/${theme.id}`)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-xl bg-${theme.color}/10 flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 text-${theme.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm leading-snug">{theme.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{theme.subtitle}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </MeLayout>
  );
};

export default DealerSnapshot;
