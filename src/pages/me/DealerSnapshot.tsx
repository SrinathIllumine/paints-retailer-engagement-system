import { useParams, useNavigate } from "react-router-dom";
import MeLayout from "@/components/me/MeLayout";
import { Card, CardContent } from "@/components/ui/card";
import DealerTypeBadge from "@/components/DealerTypeBadge";
import { MapPin, Clock, Award, ChevronRight, Layers, Rocket, Users } from "lucide-react";
import { dealers, engagementThemes } from "@/data/mockData";

const revenueLabelMap: Record<string, string> = {
  A: "> ₹2 Cr",
  B: "₹1–2 Cr",
  C: "< ₹1 Cr",
};

const themeIcons: Record<string, typeof Layers> = { Layers, Rocket, Users };

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
                  <Award className="w-3.5 h-3.5 text-secondary-foreground" />
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

        {/* Customized Engagement Plan */}
        <div className="animate-slide-up" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
          <h3 className="text-sm font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Customized Engagement Plan</h3>
          <p className="text-xs text-muted-foreground mb-3">Guided discussions tailored for {dealer.name} — choose a theme to begin.</p>
          <div className="space-y-3">
            {engagementThemes.map((theme, i) => {
              const Icon = themeIcons[theme.icon] || Layers;
              return (
                <Card
                  key={theme.id}
                  className="p-4 cursor-pointer active:scale-[0.98] transition-all hover:shadow-md animate-slide-up"
                  style={{ animationDelay: `${(i + 2) * 60}ms`, animationFillMode: "backwards" }}
                  onClick={() => navigate(`/me/engagement/${dealer.id}/${theme.id}`)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-xl bg-${theme.color}/10 flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 text-${theme.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm leading-snug">{theme.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{theme.subtitle}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </MeLayout>
  );
};

export default DealerSnapshot;
