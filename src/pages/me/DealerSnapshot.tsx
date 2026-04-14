import { useParams, useNavigate } from "react-router-dom";
import MeLayout from "@/components/me/MeLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DealerTypeBadge from "@/components/DealerTypeBadge";
import { MapPin, Clock, MessageSquare, Sparkles, Star, Target, IndianRupee } from "lucide-react";
import { dealers } from "@/data/mockData";

const purposes = [
  { icon: Sparkles, label: "New Product Launch", active: true },
  { icon: Star, label: "Relationship Building", active: false },
  { icon: Target, label: "Conversion Attempt", active: false },
  { icon: MessageSquare, label: "Issue Handling", active: false },
];

const revenueLabelMap: Record<string, string> = {
  A: "> ₹2 Cr",
  B: "₹1–2 Cr",
  C: "< ₹1 Cr",
};

const DealerSnapshot = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dealer = dealers.find((d) => d.id === id) || dealers[0];

  return (
    <MeLayout title="Dealer Snapshot" showBack>
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
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-0.5">Category</p>
                <DealerTypeBadge type={dealer.type} />
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-0.5">Revenue Tier</p>
                <div className="flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-foreground" />
                  <span className="font-bold text-foreground">{dealer.revenueCategory}</span>
                  <span className="text-xs text-muted-foreground">{revenueLabelMap[dealer.revenueCategory]}</span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2 bg-secondary/30 rounded-lg p-3">
              <Clock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">{dealer.lastVisit}</p>
                <p className="text-sm text-foreground mt-0.5">{dealer.lastOutcome}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suggested Purpose */}
        <div className="animate-slide-up" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Suggested Visit Purpose</h3>
          <div className="space-y-2">
            {purposes.map((p) => (
              <Card
                key={p.label}
                className={`p-3.5 flex items-center gap-3 tap-target cursor-pointer transition-all ${
                  p.active ? "border-primary bg-primary/5 ring-1 ring-primary/20" : ""
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${p.active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                  <p.icon className="w-4 h-4" />
                </div>
                <span className={`font-medium ${p.active ? "text-foreground" : "text-muted-foreground"}`}>{p.label}</span>
                {p.active && <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Recommended</span>}
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="pt-2 animate-slide-up" style={{ animationDelay: "200ms", animationFillMode: "backwards" }}>
          <Button
            variant="field"
            className="w-full"
            onClick={() => navigate(`/me/conversation/${dealer.id}`)}
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Start Conversation
          </Button>
        </div>
      </div>
    </MeLayout>
  );
};

export default DealerSnapshot;
