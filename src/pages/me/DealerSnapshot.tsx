import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MeLayout from "@/components/me/MeLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import DealerTypeBadge from "@/components/DealerTypeBadge";
import { MapPin, Award, ChevronRight, ChevronDown, ChevronUp, Layers, Rocket, Users, History, MessageSquare, AlertTriangle, CheckCircle2, X, User, BarChart3 } from "lucide-react";
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
    summary: "Discussed multi-product portfolio expansion opportunity",
    actionPoints: [
      { goal: "Trial product samples at a few contractor sites for quality feedback", bullets: ["Request 3 sample kits from JK", "Identify 2-3 contractor contacts for trial"] },
      { goal: "Set up a JK compact display stand near the counter", bullets: ["Coordinate with ME for stand delivery", "Choose location with high visibility"] },
    ],
    feedback: ["Need for improvement in packaging during monsoon", "Delivery timelines need to be more predictable"],
  },
  {
    date: "Apr 5, 2026",
    summary: "Relationship building and understanding retailer business goals",
    actionPoints: [
      { goal: "Explore how JK's product range fits into retailer's growth plans", bullets: ["Discuss product categories of interest", "Identify top-selling segments"] },
    ],
    feedback: ["Would appreciate more product knowledge sessions"],
  },
  {
    date: "Mar 28, 2026",
    summary: "Market intelligence gathering and local demand understanding",
    actionPoints: [
      { goal: "Share insights on local product demand patterns", bullets: ["Compile demand trends from recent conversations", "Discuss with area manager"] },
      { goal: "Follow up on delayed delivery escalation", bullets: ["Track shipment status", "Confirm revised delivery date with retailer"] },
    ],
    feedback: ["Delivery was delayed by 5 days last order", "Would like more frequent ME visits"],
  },
];

// Mock profile details
const getProfileDetails = (dealer: typeof dealers[0]) => ({
  joiningDate: "Jan 2022",
  revenue: revenueLabelMap[dealer.revenueCategory],
  productsHandled: ["Cement", "White Cement", "Putty", "Paints"],
  totalEngagements: 18,
  dimensions: {
    alignmentToJK: dealer.type === "loyal" ? 82 : dealer.type === "new" ? 45 : dealer.type === "declining" ? 28 : 15,
    valueProposition: dealer.type === "loyal" ? 75 : dealer.type === "new" ? 38 : dealer.type === "declining" ? 32 : 20,
    marketAwareness: dealer.type === "loyal" ? 91 : dealer.type === "new" ? 65 : dealer.type === "declining" ? 55 : 40,
  },
  mindset: dealer.type === "loyal" ? "Growth mode" : dealer.type === "new" ? "Exploring mode" : dealer.type === "declining" ? "Stable mode" : "Disengaged mode",
});

const getDimensionColor = (key: string, value: number) => {
  if (key === "marketAwareness") return "bg-success";
  if (value < 40) return "bg-destructive";
  if (value < 60) return "bg-warning";
  return "bg-success";
};

const getDimensionLabel = (key: string, value: number) => {
  if (key === "marketAwareness" && value > 85) return "In Top 5%";
  return null;
};

const DealerSnapshot = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dealer = dealers.find((d) => d.id === id) || dealers[0];
  const [showHistory, setShowHistory] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState<number | null>(null);

  const profile = getProfileDetails(dealer);

  const dimensionMeta: Record<string, { label: string; description: string }> = {
    alignmentToJK: { label: "Alignment to JK", description: "How closely the retailer's business aligns with JK's product vision" },
    valueProposition: { label: "Understanding of Value Proposition", description: "Retailer's grasp of JK's product benefits and differentiators" },
    marketAwareness: { label: "Market Awareness", description: "Retailer's knowledge of local market dynamics and customer needs" },
  };

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
            {/* Profile Details CTA */}
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => setShowProfile(true)}
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Profile Details
              </span>
              <ChevronRight className="w-4 h-4" />
            </Button>

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

        {/* Profile Details Modal */}
        {showProfile && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-card rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-card border-b border-border px-4 py-3 flex items-center justify-between rounded-t-2xl z-10">
                <h3 className="font-display font-bold text-foreground">Profile Details</h3>
                <button onClick={() => setShowProfile(false)} className="p-1 text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-5">
                {/* Generic Details */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Generic Details</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Joining Date as JK retailer</p>
                      <p className="text-sm font-semibold text-foreground">{profile.joiningDate}</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Revenue</p>
                      <p className="text-sm font-semibold text-foreground">{profile.revenue}</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Engagements with JK (This Year)</p>
                      <p className="text-sm font-semibold text-foreground">{profile.totalEngagements}</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Category</p>
                      <DealerTypeBadge type={dealer.type} />
                    </div>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1.5">Products Handled</p>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.productsHandled.map((p) => (
                        <span key={p} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">{p}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Retailer Dimensions */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <BarChart3 className="w-3 h-3" />
                    Retailer Dimensions
                  </h4>
                  {Object.entries(profile.dimensions).map(([key, value]) => {
                    const meta = dimensionMeta[key];
                    const colorClass = getDimensionColor(key, value);
                    const specialLabel = getDimensionLabel(key, value);
                    return (
                      <div key={key} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{meta.label}</span>
                          <div className="flex items-center gap-2">
                            {specialLabel && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium text-primary-foreground bg-[#055136]">{specialLabel}</span>
                            )}
                            <span className="text-sm font-bold text-foreground">{value}%</span>
                          </div>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div className={`h-full ${colorClass} rounded-full transition-all duration-500`} style={{ width: `${value}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground">{meta.description}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Retailer Mindset */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Retailer Mindset</h4>
                  <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold ${
                    profile.mindset === "Growth mode" ? "bg-success/10 text-success" :
                    profile.mindset === "Exploring mode" ? "bg-info/10 text-info" :
                    profile.mindset === "Stable mode" ? "bg-warning/10 text-warning" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {profile.mindset}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
