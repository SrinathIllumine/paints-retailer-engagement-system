import LeadershipLayout from "@/components/leadership/LeadershipLayout";
import { Card } from "@/components/ui/card";
import DealerTypeBadge from "@/components/DealerTypeBadge";
import OpennessBadge from "@/components/OpennessBadge";
import { dealers } from "@/data/mockData";
import { Target, Rocket, TrendingUp, Users, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const strategies = [
  { icon: Rocket, label: "Aligned to JK's Vision", description: "Retailers showing high openness and alignment with JK's multi-product strategy", filter: (d: typeof dealers[0]) => d.openness === "high" },
  { icon: TrendingUp, label: "Inactive Retailers with Growth Mindset", description: "Inactive retailers showing medium+ openness, ready for re-engagement and conversion", filter: (d: typeof dealers[0]) => d.type === "inactive" && d.openness !== "low" },
  { icon: Target, label: "Loyal Retailers with Less Growth", description: "Loyal retailers with good scores but limited recent growth activity", filter: (d: typeof dealers[0]) => d.type === "loyal" && d.engagementScore < 90 },
  { icon: Users, label: "All Declining Retailers", description: "Retailers needing immediate intervention", filter: (d: typeof dealers[0]) => d.type === "declining" },
];

const StrategicSlicing = () => {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const filtered = dealers.filter(strategies[active].filter);

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
                onClick={() => navigate(`/leadership/dealer-profile?dealerId=${dealer.id}`)}
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
      </div>
    </LeadershipLayout>
  );
};

export default StrategicSlicing;
