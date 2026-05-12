import { useNavigate } from "react-router-dom";
import MeLayout from "@/components/me/MeLayout";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  { date: "Today", title: "Visit · Rajesh Construction Supply", detail: "Discussed multi-product alignment. Captured 1 objection on credit terms." },
  { date: "Yesterday", title: "Visit · Patel & Sons Hardware", detail: "Introduced premium portfolio. Retailer agreed to a trial order." },
  { date: "2 days ago", title: "Visit · Jai Maharashtra Hardware", detail: "Productive conversation on product range. Logged market insight." },
  { date: "5 days ago", title: "Visit · Mahalaxmi Traders", detail: "Strong relationship continued. Shared scheme calendar for next month." },
  { date: "1 week ago", title: "Visit · Sharma Building Materials", detail: "Introduction completed. Retailer requested catalogue." },
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
            <StatCard icon={Store} label="Total Retailers" value="42" />
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
                      onClick={() => navigate(`/me/dealer/${r.id}`)}
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
                <ol className="relative border-l border-border/70 ml-1.5 space-y-4 pt-1">
                  {engagementHistory.map((e, i) => (
                    <li key={i} className="ml-4">
                      <span className="absolute -left-[5px] mt-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background" />
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                        {e.date}
                      </p>
                      <p className="text-sm font-medium text-foreground mt-0.5 leading-snug">
                        {e.title}
                      </p>
                      <details className="group mt-1">
                        <summary className="text-[11px] text-primary font-medium cursor-pointer list-none flex items-center gap-1">
                          View details
                          <ChevronRight className="w-3 h-3 transition-transform group-open:rotate-90" />
                        </summary>
                        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                          {e.detail}
                        </p>
                      </details>
                    </li>
                  ))}
                </ol>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </MeLayout>
  );
};

export default MyDashboard;
