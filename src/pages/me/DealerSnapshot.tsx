import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MeLayout from "@/components/me/MeLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DealerTypeBadge from "@/components/DealerTypeBadge";
import { MapPin, ChevronRight, ChevronDown, ChevronUp, History, AlertTriangle, CheckCircle2, X, User, ArrowRight, Circle, Lock } from "lucide-react";
import { dealers } from "@/data/mockData";
import PreparePopup from "@/components/me/PreparePopup";
import EngagePopup, { type EngageState } from "@/components/me/EngagePopup";
import DiagnozePopup, { type DiagnozeState, newInsight } from "@/components/me/DiagnozePopup";

const revenueLabelMap: Record<string, string> = {
  A: "> ₹2 Cr",
  B: "₹1–2 Cr",
  C: "< ₹1 Cr",
};

// Mock engagement history data - first-person retailer voice
const engagementHistory = [
  {
    date: "Apr 12, 2026",
    summary: "Discussed multi-product portfolio expansion opportunity",
    actionPoints: [
      { goal: "I'll try JK product samples with 2-3 contractors before the next visit", bullets: ["Request 3 sample kits from JK", "Identify 2-3 contractor contacts for trial"] },
      { goal: "I'll set up a JK compact display stand near my counter this week", bullets: ["Coordinate with ME for stand delivery", "Choose location with high visibility"] },
    ],
    feedback: ["Packaging feels weak during monsoon handling", "Customers are interested more on competitor brands for paints"],
  },
  {
    date: "Apr 5, 2026",
    summary: "Relationship building and understanding retailer business goals",
    actionPoints: [
      { goal: "My top priority will be to map JK's product range to my growth plans", bullets: ["List product categories of interest", "Identify top-selling segments in my shop"] },
    ],
    feedback: ["I'd appreciate more product knowledge sessions for my staff"],
  },
  {
    date: "Mar 28, 2026",
    summary: "Market intelligence gathering and local demand understanding",
    actionPoints: [
      { goal: "I'll share local demand patterns I'm seeing with the ME next visit", bullets: ["Note demand trends from recent customer conversations", "Discuss with area manager"] },
      { goal: "I'll follow up on the delayed delivery escalation this week", bullets: ["Track shipment status", "Confirm revised delivery date"] },
    ],
    feedback: ["My last order was delayed by 5 days - affected my customer commitments", "I'd like more frequent ME visits"],
  },
];

// Mock profile details
const getProfileDetails = (dealer: typeof dealers[0]) => ({
  joiningDate: "Jan 2014",
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
  const [phase, setPhase] = useState<"prepare" | "engage" | "diagnoze" | null>(null);
  const [completed, setCompleted] = useState<{ prepare: boolean; engage: boolean; diagnoze: boolean }>({ prepare: false, engage: false, diagnoze: false });
  const [lockMsg, setLockMsg] = useState<null | "engage" | "diagnoze">(null);
  const [engageState, setEngageState] = useState<EngageState>({ objections: [], actionPoints: [] });
  const [diagnozeState, setDiagnozeState] = useState<DiagnozeState>({
    topicsCovered: [], insights: [newInsight()],
    feedbackText: "", feedbackSummary: "",
  });

  const showLock = (which: "engage" | "diagnoze") => {
    setLockMsg(which);
    setTimeout(() => setLockMsg((m) => (m === which ? null : m)), 2500);
  };

  const allDone = completed.prepare && completed.engage && completed.diagnoze;

  const profile = getProfileDetails(dealer);

  return (
    <MeLayout title="Retailer Snapshot" showBack>
      <div className="p-4 space-y-4">
        {/* Dealer header - plain text, no large card */}
        <div className="animate-slide-up space-y-3">
          <div>
            <h2 className="font-display font-bold text-lg text-foreground">{dealer.name}</h2>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{dealer.location}</span>
              <span className="mx-1">·</span>
              <span>{dealer.dealerCode}</span>
            </div>
            <div className="mt-1.5">
              <DealerTypeBadge type={dealer.type} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="justify-between"
              onClick={() => setShowProfile(true)}
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Profile Details
              </span>
              <ChevronRight className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              className="justify-between"
              onClick={() => setShowHistory(true)}
            >
              <span className="flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                Engagement History
              </span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

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

        {/* Current Scenario */}
        <div className="animate-slide-up" style={{ animationDelay: "60ms", animationFillMode: "backwards" }}>
          <h3 className="text-xs font-bold text-primary mb-2 uppercase tracking-[0.18em]">Current Scenario</h3>
          <Card className="bg-info/5 border-info/20 p-4">
            <p className="text-sm text-foreground/90 leading-relaxed">
              Long-standing retailer since 2014. At this point in time, his sales are coming down w.r.t JK.
            </p>
          </Card>
        </div>

        {/* Customized Engagement Plan — sequential checklist */}
        <div className="animate-slide-up" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Customized Engagement Plan</h3>
          <Card className="bg-info/5 border-info/20 divide-y divide-info/15 overflow-hidden">
            {([
              { key: "prepare", label: "PREPARE", subtitle: "Before The Conversation", locked: false },
              { key: "engage", label: "ENGAGE", subtitle: "During The Conversation", locked: !completed.prepare },
              { key: "diagnoze", label: "DIAGNOZE", subtitle: "Post Conversation", locked: !completed.engage },
            ] as const).map((row) => {
              const done = completed[row.key];
              const locked = row.locked && !done;
              return (
                <button
                  key={row.key}
                  type="button"
                  onClick={() => {
                    if (locked) {
                      showLock(row.key as "engage" | "diagnoze");
                      return;
                    }
                    setPhase(row.key);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors active:scale-[0.99] ${locked ? "opacity-40 cursor-not-allowed" : "hover:bg-info/5"}`}
                  aria-disabled={locked}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {done ? (
                      <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                    )}
                    <span className="font-display font-bold text-primary text-sm tracking-wider">{row.label}</span>
                    <ArrowRight className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm text-foreground/85 truncate">{row.subtitle}</span>
                  </div>
                  {locked ? (
                    <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                </button>
              );
            })}
            {allDone && (
              <div className="px-4 py-3 text-center text-sm font-semibold text-success flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Engagement Complete
              </div>
            )}
          </Card>
          {lockMsg && (
            <p className="text-xs text-muted-foreground mt-2 px-1 animate-fade-in">
              Complete {lockMsg === "engage" ? "PREPARE" : "ENGAGE"} first.
            </p>
          )}
        </div>

        <PreparePopup
          open={phase === "prepare"}
          onClose={() => setPhase(null)}
          onDone={() => setCompleted((c) => ({ ...c, prepare: true }))}
        />
        <EngagePopup
          open={phase === "engage"}
          onClose={() => setPhase(null)}
          state={engageState}
          setState={setEngageState}
          onComplete={() => {
            setCompleted((c) => ({ ...c, engage: true }));
            setPhase(null);
          }}
        />
        <DiagnozePopup
          open={phase === "diagnoze"}
          onClose={() => setPhase(null)}
          state={diagnozeState}
          setState={setDiagnozeState}
          onGenerate={() => {
            setCompleted((c) => ({ ...c, diagnoze: true }));
            setPhase(null);
            navigate(`/me/visit-summary/${dealer.id}`, {
              state: {
                objections: engageState.objections,
                actionPoints: engageState.actionPoints,
                ...diagnozeState,
              },
            });
          }}
        />
      </div>
    </MeLayout>
  );
};

export default DealerSnapshot;
