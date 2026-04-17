import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MeLayout from "@/components/me/MeLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, FileText, MessageSquare, AlertTriangle, Share2, Edit3, X, Phone } from "lucide-react";
import { dealers, engagementThemes } from "@/data/mockData";

const VisitNotes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dealer = dealers.find((d) => d.id === id) || dealers[0];
  const [isEditing, setIsEditing] = useState(false);
  const [editableNotes, setEditableNotes] = useState(
    "Retailer is open to exploring JK products with contractors. Agreed to trial and share feedback in next visit."
  );
  const [showWhatsAppPreview, setShowWhatsAppPreview] = useState(false);

  const topicsDiscussed = engagementThemes.flatMap(t => t.discussionPoints.map(dp => dp.title)).join(", ");
  const objectionsRaised = engagementThemes.flatMap(t => t.whatIfs.map(wi => wi.label)).slice(0, 3).join(", ");

  const autoNotes = [
    { icon: MessageSquare, label: "Topics Discussed", value: topicsDiscussed },
    { icon: AlertTriangle, label: "Objections Raised", value: objectionsRaised },
  ];

  const whatsAppMessage = `*Visit Summary - ${dealer.name}*\n\n📋 *Topics Discussed:*\n${topicsDiscussed}\n\n⚠️ *Objections Raised:*\n${objectionsRaised}\n\n✅ *What We Agreed On:*\n${editableNotes}\n\n- JK Cement ME Team`;

  return (
    <MeLayout title="Visit Summary" showBack>
      <div className="p-4 space-y-4">
        <div className="text-center py-4 animate-slide-up">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-8 h-8 text-success" />
          </div>
          <h2 className="font-display font-bold text-xl text-foreground">Visit Summary</h2>
          <p className="text-sm text-muted-foreground mt-1">Review, edit, and share - what you both agreed on</p>
        </div>

        <Card className="p-4 space-y-4 animate-slide-up" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
          <h3 className="font-semibold text-foreground">{dealer.name}</h3>
          {autoNotes.map((note, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <note.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-card-foreground font-extrabold">{note.label}</p>
                <p className="text-sm text-foreground mt-0.5">{note.value}</p>
              </div>
            </div>
          ))}
        </Card>

        {/* Editable Notes */}
        <Card className="p-4 space-y-3 animate-slide-up" style={{ animationDelay: "150ms", animationFillMode: "backwards" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <h3 className="text-sm font-semibold text-foreground">ACTION POINTS / GO-FORWARDS</h3>
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
              <h3 className="text-sm font-semibold text-foreground">Share with Retailer</h3>
              <p className="text-xs text-muted-foreground">Send summary via WhatsApp</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0 text-xs rounded-lg" onClick={() => setShowWhatsAppPreview(true)}>
              <Share2 className="w-3.5 h-3.5 mr-1" />
              Share
            </Button>
          </div>
        </Card>

        {/* WhatsApp Preview Modal with contact header */}
        {showWhatsAppPreview && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-card rounded-2xl w-full max-w-sm max-h-[80vh] overflow-y-auto shadow-2xl">
              {/* WhatsApp-style contact header */}
              <div className="bg-[#075e54] rounded-t-2xl px-4 py-3 flex items-center gap-3">
                <button onClick={() => setShowWhatsAppPreview(false)} className="text-white/80">
                  <X className="w-5 h-5" />
                </button>
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">{dealer.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{dealer.name}</p>
                  <p className="text-white/60 text-xs">online</p>
                </div>
                <Phone className="w-4 h-4 text-white/60" />
              </div>

              {/* Chat area */}
              <div className="p-4 bg-[#e5ddd5] min-h-[200px]">
                <div className="bg-[#dcf8c6] rounded-lg rounded-tr-none p-3 shadow-sm max-w-[90%] ml-auto">
                  <p className="text-xs text-gray-800 whitespace-pre-line leading-relaxed">{whatsAppMessage}</p>
                  <p className="text-[10px] text-gray-500 text-right mt-1">Just now ✓✓</p>
                </div>
              </div>

              <div className="p-4 border-t border-border space-y-2 bg-card rounded-b-2xl">
                <Button variant="field" className="w-full" onClick={() => setShowWhatsAppPreview(false)}>
                  Confirm & Share
                </Button>
                <Button variant="ghost" className="w-full text-muted-foreground text-sm" onClick={() => setShowWhatsAppPreview(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

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
