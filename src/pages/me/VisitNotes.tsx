import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MeLayout from "@/components/me/MeLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, MessageSquare, AlertTriangle, Share2, X, Phone, Calendar, User, Store, Radar } from "lucide-react";
import { dealers } from "@/data/mockData";

type MarketInsight = { category: string; note: string; summary: string };

type ThemeData = {
  themeTitle: string;
  discussedPoints: string[];
  objections: string[];
  actionPoints: string[];
  feedback: string[];
  marketInsights?: MarketInsight[];
};

const ME_NAME = "Manish Kumar from JK";
const RETAILER_CONTACT = "Owner / In-shop";

const formatToday = () => {
  const d = new Date();
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const VisitNotes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dealer = dealers.find((d) => d.id === id) || dealers[0];

  const stored = useMemo<Record<string, ThemeData>>(() => {
    try {
      const raw = sessionStorage.getItem(`visitData:${dealer.id}`);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed.themes || {};
    } catch {
      return {};
    }
  }, [dealer.id]);

  // Aggregate from saved themes (high-level only)
  const topicsBullets = useMemo(() => {
    const bullets: string[] = [];
    Object.values(stored).forEach((t) => {
      if (!t) return;
      if (t.discussedPoints && t.discussedPoints.length > 0) {
        bullets.push(`${t.themeTitle}: ${t.discussedPoints.join("; ")}`);
      } else {
        bullets.push(t.themeTitle);
      }
    });
    if (bullets.length === 0) {
      bullets.push("Alignment to JK's Vision of Multi-Products: Higher Profit Pool");
      bullets.push("Getting Initial Success as a New Retailer: Quick Wins Strategy");
    }
    return bullets;
  }, [stored]);

  const objectionBullets = useMemo(() => {
    const bullets: string[] = [];
    Object.values(stored).forEach((t) => t?.objections?.forEach((o) => bullets.push(o)));
    if (bullets.length === 0) {
      bullets.push("No demand in my area");
      bullets.push("Working capital will get blocked");
    }
    return Array.from(new Set(bullets));
  }, [stored]);

  const initialActionPoints = useMemo(() => {
    const bullets: string[] = [];
    Object.values(stored).forEach((t) => t?.actionPoints?.forEach((a) => bullets.push(a)));
    if (bullets.length === 0) {
      bullets.push("No actions items from the retailer");
    }
    return bullets;
  }, [stored]);

  const initialFeedback = useMemo(() => {
    const bullets: string[] = [];
    Object.values(stored).forEach((t) => t?.feedback?.forEach((f) => bullets.push(f)));
    if (bullets.length === 0) {
      bullets.push("No key critical feedback from the retailer");
    }
    return bullets;
  }, [stored]);

  const [showWhatsAppPreview, setShowWhatsAppPreview] = useState(false);
  const visitDate = useMemo(() => formatToday(), []);

  const actionPointsList = initialActionPoints;
  const feedbackList = initialFeedback;

  const bulletsToText = (arr: string[]) => arr.map((b) => `• ${b}`).join("\n");

  const whatsAppMessage =
`*Visit Summary - ${dealer.name}*

📅 Date: ${visitDate}
👤 ME: ${ME_NAME}
🏪 Retailer: ${dealer.name} (${RETAILER_CONTACT})

📋 *Topics Discussed:*
${bulletsToText(topicsBullets)}

⚠️ *Objections Raised:*
${bulletsToText(objectionBullets)}

✅ *Action Points / Go-Forwards:*
${bulletsToText(actionPointsList)}

💬 *Key Critical Feedback:*
${bulletsToText(feedbackList)}

- JK Cement ME Team`;

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

        {/* Context Header */}
        <Card className="p-4 bg-primary/5 border-primary/20 animate-slide-up" style={{ animationDelay: "60ms", animationFillMode: "backwards" }}>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <span className="text-muted-foreground">Date:</span>
              <span className="font-semibold text-foreground">{visitDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary shrink-0" />
              <span className="text-muted-foreground">ME:</span>
              <span className="font-semibold text-foreground">{ME_NAME}</span>
            </div>
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-primary shrink-0" />
              <span className="text-muted-foreground">Retailer:</span>
              <span className="font-semibold text-foreground">{dealer.name}</span>
              <span className="text-xs text-muted-foreground">({RETAILER_CONTACT})</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-5 animate-slide-up" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
          {/* Topics Discussed */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wider text-card-foreground font-extrabold">Topics Discussed</p>
              <ul className="mt-1.5 space-y-1">
                {topicsBullets.map((t, i) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Objections Raised */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wider text-card-foreground font-extrabold">Objections Raised</p>
              <ul className="mt-1.5 space-y-1">
                {objectionBullets.map((t, i) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Points / Go-Forwards (read-only) */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-success" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wider text-card-foreground font-extrabold">Action Points / Go-Forwards</p>
              <ul className="mt-1.5 space-y-1">
                {actionPointsList.map((a, i) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Key Critical Feedback (read-only) */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4 text-info" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wider text-card-foreground font-extrabold">Key Critical Feedback</p>
              <ul className="mt-1.5 space-y-1">
                {feedbackList.length > 0 ? feedbackList.map((f, i) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-info mt-1.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                )) : (
                  <li className="text-sm text-muted-foreground italic">No critical feedback noted.</li>
                )}
              </ul>
            </div>
          </div>

          <p className="text-xs text-muted-foreground italic pt-1">
            To edit Action Points or Critical Feedback, go back to the previous step.
          </p>
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

        {/* WhatsApp Preview Modal */}
        {showWhatsAppPreview && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-card rounded-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto shadow-2xl">
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

              {/* Context strip inside preview */}
              <div className="bg-[#dfe7e2] px-4 py-2 border-b border-black/5">
                <div className="text-[11px] text-gray-700 leading-tight">
                  <div><span className="font-semibold">📅 Date:</span> {visitDate}</div>
                  <div><span className="font-semibold">👤 ME:</span> {ME_NAME}</div>
                  <div><span className="font-semibold">🏪 Retailer:</span> {dealer.name} ({RETAILER_CONTACT})</div>
                </div>
              </div>

              {/* Chat area */}
              <div className="p-4 bg-[#e5ddd5] min-h-[200px]">
                <div className="bg-[#dcf8c6] rounded-lg rounded-tr-none p-3 shadow-sm max-w-[92%] ml-auto">
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
