import { useState } from "react";
import LeadershipLayout from "@/components/leadership/LeadershipLayout";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DealerTypeBadge from "@/components/DealerTypeBadge";
import OpennessBadge from "@/components/OpennessBadge";
import { dealers } from "@/data/mockData";
import { MapPin, Calendar, ChevronDown, ChevronUp, MessageSquare, AlertTriangle, CheckCircle2 } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";
import { useSearchParams } from "react-router-dom";

const radarDataForDealer = (dealer: typeof dealers[0]) => [
  { attribute: "JK Alignment", value: Math.min(dealer.engagementScore + 5, 100) },
  { attribute: "Value Prop", value: Math.max(dealer.engagementScore - 15, 20) },
  { attribute: "Market Awareness", value: Math.max(dealer.engagementScore - 20, 15) },
  { attribute: "Openness", value: dealer.openness === "high" ? 85 : dealer.openness === "medium" ? 60 : 35 },
  { attribute: "Growth Potential", value: Math.min(dealer.engagementScore + 2, 100) },
];

// Same engagement history structure as ME app
const engagementHistory = [
  {
    date: "Apr 12, 2026",
    me: "Ravi Kumar",
    summary: "Discussed multi-product portfolio expansion and JK Paint launch opportunity",
    actionPoints: [
      { goal: "Try a sample of paints in a few houses to check quality and get customer feedback", bullets: ["Request 3 sample kits from JK", "Identify 2-3 contractor contacts for trial"] },
      { goal: "Set up a JK compact display stand near the counter", bullets: ["Coordinate with ME for free stand delivery", "Choose location with high visibility"] },
    ],
    feedback: ["Need for improvement in packaging during monsoon", "Delivery timelines need to be more predictable"],
  },
  {
    date: "Apr 5, 2026",
    me: "Ravi Kumar",
    summary: "Relationship building and enrollment in JK Star Retailer loyalty program",
    actionPoints: [
      { goal: "Complete JK Star enrollment and activate first reward cycle", bullets: ["Submit KYC documents", "Download JK Star app"] },
    ],
    feedback: ["Competitor offering better credit terms on similar products"],
  },
  {
    date: "Mar 28, 2026",
    me: "Sunil Sharma",
    summary: "Market intelligence gathering and price feedback discussion",
    actionPoints: [
      { goal: "Share competitive pricing data for white cement in the area", bullets: ["Compile pricing from 3 nearby competitors", "Submit report to area manager"] },
      { goal: "Follow up on delayed delivery escalation", bullets: ["Track shipment status", "Confirm revised delivery date with retailer"] },
    ],
    feedback: ["JK delivery was delayed by 5 days last order", "Would like more frequent ME visits"],
  },
];

const DealerProfile = () => {
  const [searchParams] = useSearchParams();
  const initialDealerId = searchParams.get("dealerId") || dealers[0].id;
  const [selectedDealerId, setSelectedDealerId] = useState(initialDealerId);
  const [expandedEntry, setExpandedEntry] = useState<number | null>(null);
  const dealer = dealers.find(d => d.id === selectedDealerId) || dealers[0];
  const radarData = radarDataForDealer(dealer);

  return (
    <LeadershipLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">Retailer Profile</h1>
            <p className="text-sm text-muted-foreground mt-1">Complete engagement intelligence</p>
          </div>
          <Select value={selectedDealerId} onValueChange={setSelectedDealerId}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select retailer" />
            </SelectTrigger>
            <SelectContent>
              {dealers.map(d => (
                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Retailer Header */}
        <Card className="p-5 flex items-start gap-5">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <span className="font-display font-bold text-xl text-primary">{dealer.name.substring(0, 2).toUpperCase()}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-xl text-foreground">{dealer.name}</h2>
              <DealerTypeBadge type={dealer.type} />
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{dealer.location}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{dealer.lastVisit}</span>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <OpennessBadge level={dealer.openness} />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar */}
          <Card className="p-5">
            <h3 className="font-semibold text-foreground mb-4">Retailer Attributes</h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="hsl(220,13%,90%)" />
                <PolarAngleAxis dataKey="attribute" tick={{ fontSize: 11 }} stroke="hsl(220,10%,46%)" />
                <Radar dataKey="value" stroke="hsl(0,78%,48%)" fill="hsl(0,78%,48%)" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          {/* Engagement Timeline - same structure as ME app */}
          <Card className="p-5">
            <h3 className="font-semibold text-foreground mb-4">Engagement Timeline</h3>
            <div className="space-y-4">
              {engagementHistory.map((entry, i) => {
                const isExpanded = expandedEntry === i;
                return (
                  <div key={i} className="relative pl-6 border-l-2 border-border pb-4 last:pb-0">
                    <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary" />
                    <button
                      className="w-full text-left"
                      onClick={() => setExpandedEntry(isExpanded ? null : i)}
                    >
                      <p className="text-xs text-muted-foreground">{entry.date} - {entry.me}</p>
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
      </div>
    </LeadershipLayout>
  );
};

export default DealerProfile;
