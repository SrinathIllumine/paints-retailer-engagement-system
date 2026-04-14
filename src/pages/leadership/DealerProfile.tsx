import LeadershipLayout from "@/components/leadership/LeadershipLayout";
import { Card } from "@/components/ui/card";
import DealerTypeBadge from "@/components/DealerTypeBadge";
import OpennessBadge from "@/components/OpennessBadge";
import { dealers } from "@/data/mockData";
import { MapPin, Calendar, MessageSquare, AlertTriangle, CheckCircle2 } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";

const dealer = dealers[0];

const radarData = [
  { attribute: "JK Alignment", value: 85 },
  { attribute: "Value Prop", value: 70 },
  { attribute: "Market Awareness", value: 65 },
  { attribute: "Dealer Mindset", value: 78 },
  { attribute: "Growth Potential", value: 82 },
];

const timeline = [
  { date: "Apr 12, 2026", me: "Ravi Kumar", topics: "JK Paint Launch, White Cement", objections: "Already selling 4 paint brands", outcome: "Open to trial order" },
  { date: "Apr 5, 2026", me: "Ravi Kumar", topics: "Relationship Building, Loyalty Program", objections: "None", outcome: "Enrolled in JK Star Program" },
  { date: "Mar 28, 2026", me: "Sunil Sharma", topics: "Market Intelligence, Price Feedback", objections: "JK delivery is delayed", outcome: "Escalated delivery issue" },
];

const DealerProfile = () => (
  <LeadershipLayout>
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-foreground">Dealer 360° Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Complete engagement intelligence</p>
      </div>

      {/* Dealer Header */}
      <Card className="p-5 flex items-start gap-5">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <span className="font-display font-bold text-xl text-primary">JM</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-xl text-foreground">{dealer.name}</h2>
            <DealerTypeBadge type={dealer.type} />
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{dealer.location}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Last: {dealer.lastVisit}</span>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="text-sm"><span className="font-bold text-foreground">{dealer.engagementScore}</span><span className="text-muted-foreground">/100 Score</span></div>
            <OpennessBadge level={dealer.openness} />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar */}
        <Card className="p-5">
          <h3 className="font-semibold text-foreground mb-4">Dealer Attributes</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="hsl(220,13%,90%)" />
              <PolarAngleAxis dataKey="attribute" tick={{ fontSize: 11 }} stroke="hsl(220,10%,46%)" />
              <Radar dataKey="value" stroke="hsl(0,78%,48%)" fill="hsl(0,78%,48%)" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Timeline */}
        <Card className="p-5">
          <h3 className="font-semibold text-foreground mb-4">Engagement Timeline</h3>
          <div className="space-y-4">
            {timeline.map((entry, i) => (
              <div key={i} className="relative pl-6 border-l-2 border-border pb-4 last:pb-0">
                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary" />
                <p className="text-xs text-muted-foreground">{entry.date} · {entry.me}</p>
                <div className="mt-1 space-y-1">
                  <div className="flex items-start gap-1.5 text-sm">
                    <MessageSquare className="w-3.5 h-3.5 text-info mt-0.5 shrink-0" />
                    <span className="text-foreground">{entry.topics}</span>
                  </div>
                  {entry.objections !== "None" && (
                    <div className="flex items-start gap-1.5 text-sm">
                      <AlertTriangle className="w-3.5 h-3.5 text-warning mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{entry.objections}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-1.5 text-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" />
                    <span className="text-foreground">{entry.outcome}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  </LeadershipLayout>
);

export default DealerProfile;
