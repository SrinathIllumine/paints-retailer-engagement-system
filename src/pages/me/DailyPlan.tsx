import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MeLayout from "@/components/me/MeLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DealerTypeBadge from "@/components/DealerTypeBadge";
import { MapPin, Play, Filter } from "lucide-react";
import { dealers } from "@/data/mockData";

const DailyPlan = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("all");

  const areas = ["all", ...new Set(dealers.map((d) => d.area))];
  const filtered = filter === "all" ? dealers : dealers.filter((d) => d.area === filter);

  return (
    <MeLayout title="Today's Plan">
      <div className="p-4 space-y-4">
        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {areas.map((area) => (
            <button
              key={area}
              onClick={() => setFilter(area)}
              className={`tap-target whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === area
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground border border-border"
              }`}
            >
              {area === "all" ? "All Areas" : area}
            </button>
          ))}
        </div>

        {/* Summary */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="w-4 h-4" />
          <span>{filtered.length} visits planned</span>
        </div>

        {/* Dealer Cards */}
        <div className="space-y-3">
          {filtered.map((dealer, i) => (
            <Card
              key={dealer.id}
              className="p-4 animate-slide-up cursor-pointer active:scale-[0.98] transition-transform"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: "backwards" }}
              onClick={() => navigate(`/me/dealer/${dealer.id}`)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">{dealer.name}</h3>
                    <DealerTypeBadge type={dealer.type} />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{dealer.location}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{dealer.lastVisit}</p>
                </div>
                <Button
                  variant="field"
                  size="sm"
                  className="shrink-0 h-10 px-4 rounded-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/me/dealer/${dealer.id}`);
                  }}
                >
                  <Play className="w-4 h-4 mr-1" />
                  Start
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MeLayout>
  );
};

export default DailyPlan;
