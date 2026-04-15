import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LeadershipLayout from "@/components/leadership/LeadershipLayout";
import { Card } from "@/components/ui/card";
import DealerTypeBadge from "@/components/DealerTypeBadge";
import OpennessBadge from "@/components/OpennessBadge";
import { segmentationData, dealers, DealerType } from "@/data/mockData";
import { Users, ChevronRight } from "lucide-react";

const colorMap: Record<DealerType, string> = {
  new: "bg-info/10 text-info border-info/20",
  loyal: "bg-success/10 text-success border-success/20",
  inactive: "bg-warning/10 text-warning border-warning/20",
  declining: "bg-destructive/10 text-destructive border-destructive/20",
};

const DealerSegmentation = () => {
  const [selected, setSelected] = useState<DealerType | null>(null);
  const navigate = useNavigate();
  const filteredDealers = selected ? dealers.filter((d) => d.type === selected) : dealers;

  return (
    <LeadershipLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">Retailer Segmentation</h1>
          <p className="text-sm text-muted-foreground mt-1">Retailers grouped by morphology</p>
        </div>

        {/* Segment cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {segmentationData.map((seg) => (
            <Card
              key={seg.type}
              className={`p-4 cursor-pointer transition-all ${selected === seg.type ? "ring-2 ring-primary" : ""} ${colorMap[seg.type]} border`}
              onClick={() => setSelected(selected === seg.type ? null : seg.type)}
            >
              <Users className="w-5 h-5 mb-2" />
              <p className="font-bold text-2xl">{seg.count.toLocaleString()}</p>
              <p className="text-sm font-medium">{seg.label}</p>
              <p className="text-xs opacity-70">{seg.percentage}% of total</p>
            </Card>
          ))}
        </div>

        {/* Retailer List */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">
              {selected ? `${segmentationData.find((s) => s.type === selected)?.label}` : "All Retailers"} ({filteredDealers.length})
            </h3>
          </div>
          <div className="divide-y divide-border">
            {filteredDealers.map((dealer) => (
              <button
                key={dealer.id}
                className="w-full p-4 flex items-center gap-4 hover:bg-secondary/50 transition-colors text-left"
                onClick={() => navigate("/leadership/dealer-profile")}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{dealer.name}</span>
                    <DealerTypeBadge type={dealer.type} />
                  </div>
                  <p className="text-sm text-muted-foreground">{dealer.location}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-foreground">{dealer.engagementScore}/100</p>
                  <OpennessBadge level={dealer.openness} />
                </div>
                <p className="text-xs text-muted-foreground shrink-0 w-24 text-right">{dealer.lastVisit}</p>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        </Card>
      </div>
    </LeadershipLayout>
  );
};

export default DealerSegmentation;
