import { useLocation, useParams, useNavigate } from "react-router-dom";
import MeLayout from "@/components/me/MeLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, Store, ClipboardList, AlertTriangle, CheckCircle2, Lightbulb, Key, Send, CheckCheck } from "lucide-react";
import { dealers } from "@/data/mockData";
import { OBJECTIONS } from "@/components/me/EngagePopup";

type Insight = { id: string; tag: string; text: string; summary: string };
type SummaryState = {
  objections: string[];
  actionPoints: string[];
  topicsCovered: string[];
  insights: Insight[];
  feedbackText: string;
  feedbackSummary: string;
};

const todayStr = () => new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const Section = ({ icon: Icon, title, items, empty }: { icon: any; title: string; items: string[]; empty: string }) => (
  <Card className="p-3">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-4 h-4 text-primary" />
      <h4 className="font-display font-bold text-foreground text-sm">{title}</h4>
    </div>
    {items.length > 0 ? (
      <ul className="space-y-1.5 pl-1">
        {items.map((it, i) => (
          <li key={i} className="text-sm text-foreground/85 flex gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-xs text-muted-foreground italic">{empty}</p>
    )}
  </Card>
);

const VisitSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const loc = useLocation();
  const dealer = dealers.find((d) => d.id === id) || dealers[0];
  const s = (loc.state as SummaryState) || {
    objections: [], actionPoints: [], topicsCovered: [],
    insights: [],
    feedbackText: "", feedbackSummary: "",
  };

  const objectionLabels = s.objections.map((id) => OBJECTIONS.find((o) => o.id === id)?.label).filter(Boolean) as string[];
  const insightItems = (s.insights || [])
    .map((ins) => ({ tag: ins.tag, body: (ins.summary || ins.text).trim() }))
    .filter((x) => x.body.length > 0);
  const feedback = (s.feedbackSummary || s.feedbackText).trim();

  const waMessage =
`*Visit Summary — ${dealer.name}*
📅 ${todayStr()}
👤 Manish Kumar from JK
🏪 ${dealer.name} (Owner / In-shop)

📋 *Topics Discussed:*
${s.topicsCovered.length ? s.topicsCovered.map((t) => `• ${t}`).join("\n") : "• —"}

⚠️ *Objections Raised:*
${objectionLabels.length ? objectionLabels.map((t) => `• ${t}`).join("\n") : "• —"}

✅ *Action Points / Go-Forwards:*
${s.actionPoints.length ? s.actionPoints.map((t) => `• ${t}`).join("\n") : "• —"}

💡 *New Market Insights:*
${insightItems.length ? insightItems.map((x) => `• ${x.tag ? `[${x.tag}] ` : ""}${x.body}`).join("\n") : "• —"}

🔑 *Key Critical Feedback:*
${feedback ? feedback : "—"}

— JK Cement ME Team`;

  const share = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(waMessage)}`, "_blank");
  };

  return (
    <MeLayout title="Visit Summary" showBack>
      <div className="p-4 space-y-4 pb-10">
        <div>
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.18em]">Visit Summary</p>
          <h2 className="font-display font-bold text-base text-foreground leading-tight mt-0.5">{dealer.name}</h2>
        </div>

        <Card className="p-3 bg-info/5 border-info/20">
          <div className="grid grid-cols-1 gap-1.5 text-sm">
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-info" /><span className="text-muted-foreground">Date:</span><span className="font-medium text-foreground">{todayStr()}</span></div>
            <div className="flex items-center gap-2"><User className="w-4 h-4 text-info" /><span className="text-muted-foreground">ME:</span><span className="font-medium text-foreground">Manish Kumar from JK</span></div>
            <div className="flex items-center gap-2"><Store className="w-4 h-4 text-info" /><span className="text-muted-foreground">Retailer:</span><span className="font-medium text-foreground truncate">{dealer.name} (Owner / In-shop)</span></div>
          </div>
        </Card>

        <Section icon={ClipboardList} title="Topics Discussed" items={s.topicsCovered} empty="No prepare points marked as covered." />
        <Section icon={AlertTriangle} title="Objections Raised" items={objectionLabels} empty="No objections recorded." />
        <Section icon={CheckCircle2} title="Action Points / Go-Forwards" items={s.actionPoints} empty="No action points recorded." />

        <Card className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            <h4 className="font-display font-bold text-foreground text-sm">New Market Insight</h4>
            {s.insightTag && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">{s.insightTag}</span>}
          </div>
          {insight ? (
            <p className="text-sm text-foreground/85 whitespace-pre-line leading-relaxed">{insight}</p>
          ) : (
            <p className="text-xs text-muted-foreground italic">No insight recorded.</p>
          )}
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-4 h-4 text-primary" />
            <h4 className="font-display font-bold text-foreground text-sm">Key Critical Feedback</h4>
          </div>
          {feedback ? (
            <p className="text-sm text-foreground/85 whitespace-pre-line leading-relaxed">{feedback}</p>
          ) : (
            <p className="text-xs text-muted-foreground italic">No dealer feedback recorded.</p>
          )}
        </Card>

        {/* WhatsApp preview */}
        <div className="space-y-2 pt-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">WhatsApp Preview</p>
          <div className="bg-[#e5ddd5] rounded-2xl p-3">
            <div className="bg-white rounded-xl rounded-tl-sm p-3 shadow-sm relative max-w-[95%]">
              <pre className="whitespace-pre-wrap font-sans text-[13px] text-foreground/90 leading-relaxed">{waMessage}</pre>
              <div className="flex items-center justify-end gap-1 mt-1.5">
                <span className="text-[10px] text-muted-foreground">Just now</span>
                <CheckCheck className="w-3.5 h-3.5 text-[#34B7F1]" />
              </div>
            </div>
          </div>
          <Button className="w-full bg-[#25D366] hover:bg-[#1ebe57] text-white" onClick={share}>
            <Send className="w-4 h-4 mr-1.5" /> Share via WhatsApp
          </Button>
        </div>

        <Button variant="outline" className="w-full" onClick={() => navigate(`/me/dealer/${dealer.id}`)}>
          Back to Retailer
        </Button>
      </div>
    </MeLayout>
  );
};

export default VisitSummary;
