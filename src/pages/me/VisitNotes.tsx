import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MeLayout from "@/components/me/MeLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, FileText, MessageSquare, AlertTriangle, Share2, Edit3 } from "lucide-react";
import { dealers } from "@/data/mockData";

const VisitNotes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dealer = dealers.find((d) => d.id === id) || dealers[0];
  const [isEditing, setIsEditing] = useState(false);
  const [editableNotes, setEditableNotes] = useState(
    "Dealer open to trial order for JK Paint. Requested samples. Agreed to discuss multi-product stocking in next visit."
  );

  const autoNotes = [
    { icon: MessageSquare, label: "Topics Discussed", value: "JK Paint Launch, White Cement Push, Relationship Building" },
    { icon: AlertTriangle, label: "Objections Raised", value: "Already selling 4 paint brands, Working capital concern" },
  ];

  return (
    <MeLayout title="Visit Summary" showBack>
      <div className="p-4 space-y-4">
        <div className="text-center py-4 animate-slide-up">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-8 h-8 text-success" />
          </div>
          <h2 className="font-display font-bold text-xl text-foreground">Visit Summary</h2>
          <p className="text-sm text-muted-foreground mt-1">Review, edit, and share — what you both agreed on</p>
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

        {/* Editable Notes — What We Agreed On */}
        <Card className="p-4 space-y-3 animate-slide-up" style={{ animationDelay: "150ms", animationFillMode: "backwards" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <h3 className="text-sm font-semibold text-foreground">What We Agreed On</h3>
            </div>
            <button onClick={() => setIsEditing(!isEditing)} className="text-xs text-primary font-medium flex items-center gap-1">
              <Edit3 className="w-3 h-3" />
              {isEditing ? "Done" : "Edit"}
            </button>
          </div>
          {isEditing ? (
            <Textarea
              value={editableNotes}
              onChange={(e) => setEditableNotes(e.target.value)}
              className="min-h-[80px] rounded-xl text-sm"
            />
          ) : (
            <p className="text-sm text-foreground/80 leading-relaxed bg-secondary/30 rounded-lg p-3">{editableNotes}</p>
          )}
        </Card>

        {/* Share via WhatsApp */}
        <Card className="p-4 animate-slide-up" style={{ animationDelay: "200ms", animationFillMode: "backwards" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
              <Share2 className="w-5 h-5 text-success" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">Share with Dealer</h3>
              <p className="text-xs text-muted-foreground">Send summary via WhatsApp</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0 text-xs rounded-lg">
              <Share2 className="w-3.5 h-3.5 mr-1" />
              Share
            </Button>
          </div>
        </Card>

        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "250ms", animationFillMode: "backwards" }}>
          <Button variant="field" className="w-full" onClick={() => navigate(`/me/complete/${dealer.id}`)}>
            Confirm &amp; End Visit ✓
          </Button>
          <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => navigate(-1)}>
            Go Back &amp; Edit
          </Button>
        </div>
      </div>
    </MeLayout>
  );
};

export default VisitNotes;
