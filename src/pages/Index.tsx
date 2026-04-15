import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Monitor } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8 animate-slide-up">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Retailer Engagement Platform
          </div>
          <h1 className="font-display font-bold text-4xl text-foreground">JK Cement</h1>
          <p className="text-muted-foreground text-lg">Select your interface to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => navigate("/me")}>
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Smartphone className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
            </div>
            <h2 className="font-display font-bold text-xl text-foreground mb-1">Retailer Engagement App (for ME)</h2>
            <p className="text-sm text-muted-foreground mb-4">MEs use the app with each of their retailers for their day-to-day engagements as part of their field visits.</p>
            <Button variant="field" className="w-full">Open Engagement App →</Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => navigate("/leadership")}>
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Monitor className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
            </div>
            <h2 className="font-display font-bold text-xl text-foreground mb-1">Retailer Intelligence System (for Leadership)</h2>
            <p className="text-sm text-muted-foreground mb-4 whitespace-pre-line">
              {`Enables leadership of JK to have:
-> strategic vision of retailer networks
-> high-quality engagement at ME level`}
            </p>
            <Button variant="outline" className="w-full">Open Dashboard →</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
