import { useParams, useNavigate } from "react-router-dom";
import MeLayout from "@/components/me/MeLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OpennessBadge from "@/components/OpennessBadge";
import { CheckCircle2, ArrowRight, Star } from "lucide-react";
import { dealers } from "@/data/mockData";

const VisitComplete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dealer = dealers.find((d) => d.id === id) || dealers[0];

  return (
    <MeLayout title="Visit Complete">
      <div className="p-4 space-y-5 flex flex-col items-center text-center">
        <div className="pt-8 animate-slide-up">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <h2 className="font-display font-bold text-2xl text-foreground">Visit Completed!</h2>
          <p className="text-muted-foreground mt-1">{dealer.name}</p>
        </div>

        <Card className="p-4 w-full text-left space-y-3 animate-slide-up" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Auto-Tagged Results</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Dealer Openness</p>
              <div className="mt-1"><OpennessBadge level="high" /></div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Engagement Quality</p>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-warning text-warning" />
                ))}
                <Star className="w-4 h-4 text-muted-foreground/30" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 w-full text-left animate-slide-up" style={{ animationDelay: "200ms", animationFillMode: "backwards" }}>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Next Visit Focus</h3>
          <div className="flex items-center gap-2 bg-info/5 border border-info/20 rounded-lg p-3">
            <ArrowRight className="w-4 h-4 text-info shrink-0" />
            <p className="text-sm text-foreground">Follow up on JK Paint sample delivery. Confirm trial order quantity.</p>
          </div>
        </Card>

        <Button variant="field" className="w-full mt-4" onClick={() => navigate("/me")}>
          Back to Daily Plan
        </Button>
      </div>
    </MeLayout>
  );
};

export default VisitComplete;
