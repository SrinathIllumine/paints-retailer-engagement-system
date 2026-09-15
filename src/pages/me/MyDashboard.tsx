import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MeLayout from "@/components/me/MeLayout";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { dealers } from "@/data/mockData";
import { Send, CheckCheck } from "lucide-react";

const formatDate = (d: Date) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const dateFromLastVisit = (lastVisit: string) => {
  const d = new Date();
  const lv = lastVisit.toLowerCase();
  if (lv === "yesterday") d.setDate(d.getDate() - 1);
  else {
    const m = lv.match(/(\d+)\s*days?\s*ago/);
    if (m) d.setDate(d.getDate() - parseInt(m[1], 10));
  }
  return formatDate(d);
};

const buildWaMessage = (dealerName: string, visitDate: string) =>
`*Visit Summary — ${dealerName}*
📅 ${visitDate}
👤 Manish Kumar
🏪 ${dealerName} (Owner / In-shop)

✅ *Action Points / Go-Forwards:*
• Share premium-grade product samples with key builder contacts
• Follow up on credit terms objection within 3 days

🧠 *New Market Insights:*
• Demand for waterproofing solutions rising in nearby residential projects

🔑 *Key Critical Feedback:*
Retailer flagged credit cycle is shorter than competitor. Wants combo schemes with primers.

— Paints ME Team`;
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
  Lightbulb as LightbulbIcon,
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

interface CategoryObjection {
  id: string;
  text: string;
  bestPractices: string[];
}

interface ObjectionCategory {
  id: string;
  name: string;
  percentage: number;
  barClass: string;
  objections: CategoryObjection[];
}

// The 5 standard objection categories, used consistently across ME Dashboard,
// ME Profile, ASM Analytics, and the Leadership dashboard.
const objectionCategories: ObjectionCategory[] = [
  {
    id: "competition",
    name: "Competition Related",
    percentage: 45,
    barClass: "bg-destructive",
    objections: [
      {
        id: "ob1",
        text: "Competitor schemes are more visible and frequent",
        bestPractices: [
          "Show the retailer the current company scheme and explain the direct earning / benefit on his likely purchases.",
          "Prioritize and communicate the most relevant schemes to the retailer instead of sharing every scheme without context.",
          "Increase scheme visibility through every ME interaction — share scheme details on WhatsApp and revisit the retailer before the scheme closes to drive participation.",
        ],
      },
      {
        id: "ob2",
        text: "Customers recognize competitor paint shades faster",
        bestPractices: [
          "Carry the shade card and tinting guide on every visit so customers can compare instantly at the counter.",
          "Coach the retailer's staff on 2-3 close shade matches to our range so they can respond confidently to walk-ins.",
          "Push for better in-shop shade display placement near the entrance to build recall.",
        ],
      },
      {
        id: "ob3",
        text: "Competitors are doing more painter meets and site activities",
        bestPractices: [
          "Propose a painter meet at this retailer's shop and loop in the ME team for scheduling support.",
          "Identify 2-3 active painters in the area and organize a small on-site demo to rebuild visibility.",
          "Share our activation calendar with the retailer so they see upcoming events they can host.",
        ],
      },
    ],
  },
  {
    id: "product-quality",
    name: "Product quality",
    percentage: 30,
    barClass: "bg-warning",
    objections: [
      {
        id: "ob4",
        text: "Retailers feel product consistency changes batch-to-batch",
        bestPractices: [
          "Acknowledge the specific batch issue and log it for QA tracking with the batch number and date.",
          "Offer a replacement/exchange for the affected stock to preserve trust immediately.",
          "Share the quality-control certification process to reassure the retailer on consistency.",
        ],
      },
    ],
  },
  {
    id: "scheme",
    name: "Scheme related",
    percentage: 9,
    barClass: "bg-info",
    objections: [
      {
        id: "ob5",
        text: "Schemes are either unclear or not exciting enough",
        bestPractices: [
          "Simplify the scheme pitch to one clear headline benefit instead of multiple conditions.",
          "Use a visual scheme calendar/poster in-shop so retailers can track progress themselves.",
          "Gather retailer feedback on scheme structure and escalate to ASM for the next cycle's design.",
        ],
      },
    ],
  },
  {
    id: "sku-space",
    name: "SKU Space related",
    percentage: 7,
    barClass: "bg-success",
    objections: [
      {
        id: "ob6",
        text: "No space in shop for additional SKUs",
        bestPractices: [
          "Offer the compact display stand (2-4 sq ft) designed for small shops instead of asking for open floor space.",
          "Start with the top 3-5 fastest-moving SKUs only, rather than the full range, to minimize the space ask.",
          "Position the display near the counter/entrance where it earns its footprint through visibility.",
        ],
      },
    ],
  },
  {
    id: "working-capital",
    name: "Working Capital related",
    percentage: 3,
    barClass: "bg-muted-foreground",
    objections: [
      {
        id: "ob7",
        text: "Credit terms shorter than competitor",
        bestPractices: [
          "Clarify the current credit policy and explain the rationale (risk tier, volume, payment history).",
          "Explore a case-by-case extension for high-performing, long-standing retailers with ASM approval.",
          "Position combo/bundled schemes that improve effective margin without changing credit terms.",
        ],
      },
    ],
  },
];

const insightRetailers = [
  {
    id: "1",
    name: "Jai Maharashtra Hardware & Electricals",
    count: 3,
    note: "Demand for waterproofing solutions rising in Hinjewadi residential projects. Asked for combo schemes with primers.",
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
    summary: "Visited Rajesh Construction Supply – waterproofing solutions alignment",
    actionPoints: [
      { goal: "Share premium-grade product samples with 2 builder contacts", bullets: ["Pick up sample kits from depot", "Schedule on-site demo next week"] },
      { goal: "Resolve credit terms objection raised during visit", bullets: ["Loop in ASM for revised terms", "Confirm decision with retailer in 3 days"] },
    ],
    feedback: ["Retailer flagged credit cycle is shorter than competitor", "Wants combo schemes with primers"],
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
      { goal: "Log market insight on waterproofing solutions demand in Hinjewadi", bullets: ["Update insights tracker", "Flag to ASM for area-level view"] },
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
  const [summaryDealerId, setSummaryDealerId] = useState<string | null>(null);
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const [expandedObjectionId, setExpandedObjectionId] = useState<string | null>(null);
  const openCategory = objectionCategories.find((c) => c.id === openCategoryId) ?? null;
  const summaryDealer = summaryDealerId ? dealers.find((d) => d.id === summaryDealerId) : null;
  const summaryRecent = recentlyVisited.find((r) => r.id === summaryDealerId);
  const summaryName = summaryDealer?.name ?? summaryRecent?.name ?? "";
  const summaryVisitDate = summaryRecent ? dateFromLastVisit(summaryRecent.lastVisit) : formatDate(new Date());
  const waMessage = summaryDealerId ? buildWaMessage(summaryName, summaryVisitDate) : "";
  const shareWa = () => window.open(`https://wa.me/?text=${encodeURIComponent(waMessage)}`, "_blank");

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
            <StatCard icon={Briefcase} label="Experience" value="3.5 yrs" />
            <StatCard icon={Store} label="Total Retailers" value="200" />
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
                      onClick={() => setSummaryDealerId(r.id)}
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
                <div className="mb-3 p-3 rounded-lg border border-border/60 bg-background">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    By objection category
                  </p>
                  <div className="space-y-2">
                    {objectionCategories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setOpenCategoryId(c.id);
                          setExpandedObjectionId(null);
                        }}
                        className="w-full text-left group"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                            {c.name}
                          </span>
                          <span className="text-[11px] font-semibold text-muted-foreground shrink-0">
                            {c.percentage}%
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full ${c.barClass}`}
                            style={{ width: `${c.percentage}%` }}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
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

      <Dialog open={!!summaryDealerId} onOpenChange={(o) => !o && setSummaryDealerId(null)}>
        <DialogContent className="max-w-md p-4 gap-3">
          <DialogHeader>
            <DialogTitle className="text-base">Visit Summary Report</DialogTitle>
          </DialogHeader>
          <div className="bg-[#e5ddd5] rounded-2xl p-3 max-h-[60vh] overflow-y-auto">
            <div className="bg-white rounded-xl rounded-tl-sm p-3 shadow-sm relative">
              <pre className="whitespace-pre-wrap font-sans text-[13px] text-foreground/90 leading-relaxed">{waMessage}</pre>
              <div className="flex items-center justify-end gap-1 mt-1.5">
                <span className="text-[10px] text-muted-foreground">Just now</span>
                <CheckCheck className="w-3.5 h-3.5 text-[#34B7F1]" />
              </div>
            </div>
          </div>
          <Button className="w-full bg-[#25D366] hover:bg-[#1ebe57] text-white" onClick={shareWa}>
            <Send className="w-4 h-4 mr-1.5" /> Share via WhatsApp
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!openCategoryId}
        onOpenChange={(o) => {
          if (!o) {
            setOpenCategoryId(null);
            setExpandedObjectionId(null);
          }
        }}
      >
        <DialogContent className="max-w-md p-4 gap-3">
          <DialogHeader>
            <DialogTitle className="text-base">{openCategory?.name}</DialogTitle>
            <DialogDescription className="text-xs">
              Objections raised in this category · tap one for best practices
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[65vh] overflow-y-auto space-y-2 pr-1">
            {openCategory?.objections.map((ob) => {
              const isExpanded = expandedObjectionId === ob.id;
              return (
                <div
                  key={ob.id}
                  className="rounded-lg border border-border/60 bg-background overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedObjectionId(isExpanded ? null : ob.id)}
                    className="w-full flex items-start justify-between gap-2 p-3 text-left"
                  >
                    <p className="text-sm font-medium text-foreground leading-snug flex-1">
                      {ob.text}
                    </p>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="px-3 pb-3 animate-fade-in">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                        <LightbulbIcon className="w-3 h-3" />
                        Best practices
                      </div>
                      <ul className="space-y-1.5">
                        {ob.bestPractices.map((bp, i) => (
                          <li
                            key={i}
                            className="text-xs text-muted-foreground leading-relaxed flex items-start gap-1.5"
                          >
                            <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                            {bp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </MeLayout>
  );
};

export default MyDashboard;
