import { useParams, useNavigate } from "react-router-dom";
import MeLayout from "@/components/me/MeLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, MessageSquare, AlertTriangle } from "lucide-react";
import { dealers } from "@/data/mockData";

const VisitNotes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dealer = dealers.find((d) => d.id === id) || dealers[0];

  const autoNotes = [
    { icon: MessageSquare, label: "Topics Discussed", value: "JK Paint Launch, White Cement Push, Relationship Building" },
    { icon: AlertTriangle, label: "Objections Raised", value: "Already selling 4 paint brands, Working capital concern" },
    { icon: CheckCircle2, label: "Outcomes", value: "Dealer open to trial order for JK Paint. Requested samples." },
  ];

  return (
    <MeLayout title="Visit Summary" showBack>
      <div className="p-4 space-y-4">
        <div className="text-center py-4 animate-slide-up">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-8 h-8 text-success" />
          </div>
          <h2 className="font-display font-bold text-xl text-foreground">Auto-Generated Notes</h2>
          <p className="text-sm text-muted-foreground mt-1">Review and confirm – no typing needed</p>
        </div>

        <Card className="p-4 space-y-4 animate-slide-up" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
          <h3 className="font-semibold text-foreground">{dealer.name}</h3>
          {autoNotes.map((note, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <note.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{note.label}</p>
                <p className="text-sm text-foreground mt-0.5">{note.value}</p>
              </div>
            </div>
          ))}
        </Card>

        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "200ms", animationFillMode: "backwards" }}>
          <Button variant="field" className="w-full" onClick={() => navigate(`/me/complete/${dealer.id}`)}>
            Confirm & End Visit ✓
          </Button>
          <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => navigate(-1)}>
            Go Back & Edit
          </Button>
        </div>
      </div>
    </MeLayout>
  );
};

export default VisitNotes;
