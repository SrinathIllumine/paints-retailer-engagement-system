import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MeLayout from "@/components/me/MeLayout";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { dealers } from "@/data/mockData";
import { Send, CheckCheck } from "lucide-react";

const todayStr = () => new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const buildWaMessage = (dealerName: string) =>
`*Visit Summary — ${dealerName}*
📅 ${todayStr()}
👤 Manish Kumar from JK
🏪 ${dealerName} (Owner / In-shop)

✅ *Action Points / Go-Forwards:*
• Share JK premium grade samples with key builder contacts
• Follow up on credit terms objection within 3 days

🧠 *New Market Insights:*
• Demand for white cement rising in nearby residential projects

🔑 *Key Critical Feedback:*
Retailer flagged credit cycle is shorter than competitor. Wants combo schemes with putty.

— JK Cement ME Team`;
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  MapPin,
  Briefcase,
  Store,
  Users,
  Clock,
  AlertTriangle,
  Lightbulb,
  History,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  FileText,
  MessageSquare,
} from "lucide-react";

const recentlyVisited = [
  { id: "1", name: "Jai Maharashtra Hardware & Electricals", lastVisit: "2 days ago" },
  { id: "5", name: "Rajesh Construction Supply", lastVisit: "Yesterday" },
  { id: "6", name: "Patel & Sons Hardware", lastVisit: "3 days ago" },
  { id: "8", name: "Mahalaxmi Traders", lastVisit: "4 days ago" },
];

const objectionRetailers = [
  {
    id: "3",
    name: "Krishna Traders",
    topObjection: "Pricing higher than competitor",
    count: 4,
    pendingDays: 21,
    severity: "high" as const,
  },
  {
    id: "7",
    name: "Singh Building Centre",
    topObjection: "Delayed delivery in last cycle",
    count: 2,
    pendingDays: 9,
    severity: "medium" as const,
  },
  {
    id: "9",
    name: "Deshpande Hardware Stores",
    topObjection: "Service follow-up missing",
    count: 1,
    pendingDays: 4,
    severity: "low" as const,
  },
];

const insightRetailers = [
  {
    id: "1",
    name: "Jai Maharashtra Hardware & Electricals",
    count: 3,
    note: "Demand for white cement rising in Hinjewadi residential projects. Asked for combo schemes with putty.",
  },
  {
    id: "5",
    name: "Rajesh Construction Supply",
    count: 2,
    note: "Builders are shifting toward premium grade. Suggests on-site demos for influencer masons.",
  },
  {
    id: "8",
    name: "Mahalaxmi Traders",
    count: 1,
    note: "Competitor running a 30-day credit offer in Pune SW. Recommends a counter scheme by month-end.",
  },
];

const engagementHistory = [
  {
    date: "Apr 12, 2026",
    summary: "Visited Rajesh Construction Supply – multi-product alignment",
    actionPoints: [
      { goal: "Share JK premium grade samples with 2 builder contacts", bullets: ["Pick up sample kits from depot", "Schedule on-site demo next week"] },
      { goal: "Resolve credit terms objection raised during visit", bullets: ["Loop in ASM for revised terms", "Confirm decision with retailer in 3 days"] },
    ],
    feedback: ["Retailer flagged credit cycle is shorter than competitor", "Wants combo schemes with putty"],
  },
  {
    date: "Apr 10, 2026",
    summary: "Visited Patel & Sons Hardware – introduced premium portfolio",
    actionPoints: [
      { goal: "Confirm trial order processing this week", bullets: ["Coordinate with order desk", "Share dispatch ETA with retailer"] },
    ],
    feedback: ["Retailer interested but cautious on first-order quantity"],
  },
  {
    date: "Apr 8, 2026",
    summary: "Visited Jai Maharashtra Hardware – product range discussion",
    actionPoints: [
      { goal: "Log market insight on white cement demand in Hinjewadi", bullets: ["Update insights tracker", "Flag to ASM for area-level view"] },
    ],
    feedback: ["Packaging dampness during monsoon raised again"],
  },
  {
    date: "Apr 3, 2026",
    summary: "Visited Mahalaxmi Traders – relationship continuity",
    actionPoints: [
      { goal: "Share monthly scheme calendar before next visit", bullets: ["Send PDF over WhatsApp", "Confirm receipt"] },
    ],
    feedback: ["Competitor running 30-day credit offer in Pune SW"],
  },
];

const severityClass: Record<"high" | "medium" | "low", string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-muted text-muted-foreground border-border",
};

const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Store;
  label: string;
  value: string;
}) => (
  <Card className="p-3">
    <div className="flex items-center gap-2 mb-1.5">
      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 text-primary" />
      </div>
    </div>
    <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">{label}</p>
    <p className="font-display font-bold text-foreground text-lg leading-tight mt-0.5">{value}</p>
  </Card>
);

const MyDashboard = () => {
  const navigate = useNavigate();
  const [expandedEntry, setExpandedEntry] = useState<number | null>(null);

  return (
    <MeLayout title="My Dashboard" showBack>
      <div className="p-4 space-y-5">
        {/* Profile Header */}
        <Card className="p-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <Avatar className="w-14 h-14 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-display font-bold text-lg">
                MK
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h2 className="font-display font-bold text-foreground text-base leading-tight truncate">
                Manish Kumar
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Marketing Executive</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">Pune West · Maharashtra</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Basic Details / KPIs */}
        <div className="space-y-2 animate-fade-in">
          <p className="text-[11px] font-bold text-primary uppercase tracking-[0.18em]">
            Basic Details
          </p>
          <div className="grid grid-cols-3 gap-2">
            <StatCard icon={Briefcase} label="Exp. in JK" value="3.5 yrs" />
            <StatCard icon={Store} label="Total Retailers" value="76" />
            <StatCard icon={Users} label="Engaged" value="28" />
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-2 animate-fade-in">
          <Accordion type="single" collapsible defaultValue="recent" className="space-y-2">
            {/* Recently Visited */}
            <AccordionItem
              value="recent"
              className="border border-border rounded-xl bg-card overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="font-semibold text-sm text-foreground truncate">
                    Recently visited retailers
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-3">
                <div className="space-y-2">
                  {recentlyVisited.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => navigate(`/me/visit-summary/${r.id}`)}
                      className="w-full text-left p-3 rounded-lg border border-border/60 bg-background hover:bg-accent/40 active:scale-[0.99] transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {r.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Last visited · {r.lastVisit}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-primary font-medium shrink-0">
                          <FileText className="w-3 h-3" />
                          <span>Report</span>
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Objections */}
            <AccordionItem
              value="objections"
              className="border border-border rounded-xl bg-card overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                  </div>
                  <span className="font-semibold text-sm text-foreground truncate">
                    Retailers with objections
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-3">
                <div className="space-y-2">
                  {objectionRetailers.map((r) => (
                    <div
                      key={r.id}
                      className="p-3 rounded-lg border border-border/60 bg-background"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-foreground truncate flex-1">
                          {r.name}
                        </p>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-medium ${severityClass[r.severity]}`}
                        >
                          {r.count} open
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-snug">
                        {r.topObjection}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span
                          className={`text-[11px] font-medium ${
                            r.pendingDays > 14
                              ? "text-destructive"
                              : r.pendingDays > 7
                              ? "text-warning"
                              : "text-muted-foreground"
                          }`}
                        >
                          Pending {r.pendingDays} days
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Insights */}
            <AccordionItem
              value="insights"
              className="border border-border rounded-xl bg-card overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                    <Lightbulb className="w-3.5 h-3.5 text-warning" />
                  </div>
                  <span className="font-semibold text-sm text-foreground truncate">
                    Retailers sharing market insights
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-3">
                <div className="space-y-2">
                  {insightRetailers.map((r) => (
                    <div
                      key={r.id}
                      className="p-3 rounded-lg border border-border/60 bg-background"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-foreground truncate flex-1">
                          {r.name}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-[10px] font-medium bg-warning/10 text-warning border-warning/20"
                        >
                          {r.count} insight{r.count > 1 ? "s" : ""}
                        </Badge>
                      </div>
                      <div className="flex items-start gap-1.5 mt-2">
                        <MessageSquare className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {r.note}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Engagement History */}
            <AccordionItem
              value="history"
              className="border border-border rounded-xl bg-card overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <History className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="font-semibold text-sm text-foreground truncate">
                    Engagement history
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4 pt-1">
                  {engagementHistory.map((entry, i) => {
                    const isExpanded = expandedEntry === i;
                    return (
                      <div
                        key={i}
                        className="relative pl-6 border-l-2 border-border pb-4 last:pb-0"
                      >
                        <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary" />
                        <button
                          className="w-full text-left"
                          onClick={() => setExpandedEntry(isExpanded ? null : i)}
                        >
                          <p className="text-xs text-muted-foreground font-medium">
                            {entry.date}
                          </p>
                          <p className="text-sm text-foreground mt-0.5">
                            {entry.summary}
                          </p>
                          <span className="text-xs text-primary mt-1 inline-flex items-center gap-1">
                            {isExpanded ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
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
                                  <p className="text-sm font-medium text-foreground">
                                    {ap.goal}
                                  </p>
                                  <ul className="mt-1.5 space-y-1">
                                    {ap.bullets.map((b, k) => (
                                      <li
                                        key={k}
                                        className="text-xs text-muted-foreground flex items-start gap-1.5"
                                      >
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
                                <div
                                  key={j}
                                  className="bg-warning/5 border border-warning/20 rounded-lg px-3 py-2 text-sm text-foreground/80"
                                >
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </MeLayout>
  );
};

export default MyDashboard;
