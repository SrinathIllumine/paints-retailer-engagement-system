import { useNavigate } from "react-router-dom";
import MeLayout from "@/components/me/MeLayout";
import { Card } from "@/components/ui/card";
import { MessageSquare, Zap, ChevronRight } from "lucide-react";

const MeEntry = () => {
  const navigate = useNavigate();

  return (
    <MeLayout title="Retailer Engagement App" showBack>
      <div className="p-4 space-y-4 flex flex-col justify-center min-h-[70vh]">
        <div className="text-center mb-4 animate-fade-in">
          <h2 className="font-display font-bold text-xl text-foreground">What would you like to do?</h2>
          <p className="text-sm text-muted-foreground mt-1">Choose how you'd like to engage today</p>
        </div>

        <Card
          className="p-5 cursor-pointer active:scale-[0.98] transition-all hover:shadow-md animate-slide-up"
          onClick={() => navigate("/me/area")}
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <MessageSquare className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-foreground text-lg">Proactive Engagement</h3>
              <p className="text-sm text-muted-foreground mt-1">Plan and conduct structured dealer conversations</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 mt-2" />
          </div>
        </Card>

        <Card
          className="p-5 opacity-60 cursor-not-allowed animate-slide-up"
          style={{ animationDelay: "80ms", animationFillMode: "backwards" }}
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
              <Zap className="w-7 h-7 text-warning" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-foreground text-lg">Flashpoints</h3>
              <p className="text-sm text-muted-foreground mt-1">Quick insights and alerts (coming soon)</p>
            </div>
            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full shrink-0 mt-1 font-medium">Soon</span>
          </div>
        </Card>
      </div>
    </MeLayout>
  );
};

export default MeEntry;
