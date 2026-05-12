import { useLocation, useParams, useNavigate } from "react-router-dom";
import MeLayout from "@/components/me/MeLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, Store, ClipboardList, MessageSquareWarning, Lightbulb, BookOpen, CheckCircle2, Key, Send, CheckCheck, Sparkles } from "lucide-react";
import { dealers } from "@/data/mockData";
import { type EngageState, newEngageState, BUSINESS_IDEAS, NEARBY_DGS, EDUCATION_POINTS } from "@/components/me/EngagePopup";

type Insight = { id: string; tag: string; text: string; summary: string };
type SummaryState = {
  engage: EngageState;
  topicsCovered: string[];
  customActionPoint?: string;
  insights: Insight[];
  feedbackText: string;
  feedbackSummary: string;
};

const todayStr = () => new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const VisitSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const loc = useLocation();
  const dealer = dealers.find((d) => d.id === id) || dealers[0];
  const s = (loc.state as SummaryState) || {
    engage: newEngageState(),
    topicsCovered: [],
    customActionPoint: "",
    insights: [],
    feedbackText: "",
    feedbackSummary: "",
  };
  const engage = s.engage || newEngageState();

  const insightItems = (s.insights || [])
    .map((ins) => ({ tag: ins.tag, body: (ins.summary || ins.text).trim() }))
    .filter((x) => x.body.length > 0);
  const feedback = (s.feedbackSummary || s.feedbackText).trim();

  const actionPoints: string[] = [
    ...(s.topicsCovered || []),
    ...((s.customActionPoint || "").trim() ? [s.customActionPoint!.trim()] : []),
  ];

  const engageBlocks: { key: keyof EngageState; icon: any; title: string; emoji: string }[] = [
    { key: "objections", icon: MessageSquareWarning, title: "Objections Handled", emoji: "⚠️" },
    { key: "ideas", icon: Lightbulb, title: "Business Ideas Proposed", emoji: "💡" },
    { key: "education", icon: BookOpen, title: "Product / Scheme Education", emoji: "📘" },
  ];

  const sectionBody = (k: keyof EngageState) => {
    const sec = engage[k];
    return (sec?.summary || sec?.text || "").trim();
  };
  const sectionSugs = (k: keyof EngageState) => engage[k]?.suggestions || [];

  const waSection = (label: string, emoji: string, body: string, sugs: string[]) => {
    if (!body && sugs.length === 0) return "";
    const lines = [`${emoji} *${label}:*`];
    if (body) lines.push(body);
    if (sugs.length) lines.push(...sugs.map((x, i) => `  ${i + 1}. ${x}`));
    return lines.join("\n");
  };

  const waBlocks = [
    waSection("Objections Handled", "⚠️", sectionBody("objections"), sectionSugs("objections")),
    waSection("Business Ideas Proposed", "💡", sectionBody("ideas"), sectionSugs("ideas")),
    waSection("Product / Scheme Education", "📘", sectionBody("education"), sectionSugs("education")),
    actionPoints.length ? `✅ *Action Points / Go-Forwards:*\n${actionPoints.map((t) => `• ${t}`).join("\n")}` : "",
    insightItems.length ? `🧠 *New Market Insights:*\n${insightItems.map((x) => `• ${x.tag ? `[${x.tag}] ` : ""}${x.body}`).join("\n")}` : "",
    feedback ? `🔑 *Key Critical Feedback:*\n${feedback}` : "",
  ].filter(Boolean);

  const waMessage =
`*Visit Summary — ${dealer.name}*
📅 ${todayStr()}
👤 Manish Kumar from JK
🏪 ${dealer.name} (Owner / In-shop)

${waBlocks.join("\n\n")}

— JK Cement ME Team`;

  const share = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(waMessage)}`, "_blank");
  };

  const EngageCard = ({ k, icon: Icon, title }: { k: keyof EngageState; icon: any; title: string }) => {
    const body = sectionBody(k);
    const sugs = sectionSugs(k);
    if (!body && sugs.length === 0) return null;
    return (
      <Card className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-4 h-4 text-primary" />
          <h4 className="font-display font-bold text-foreground text-sm">{title}</h4>
        </div>
        {body && <p className="text-sm text-foreground/85 whitespace-pre-line leading-relaxed">{body}</p>}
        {sugs.length > 0 && (
          <div className="mt-2.5 rounded-lg border border-info/20 bg-info/5 p-2.5">
            <p className="text-[10px] font-semibold text-info uppercase tracking-wider mb-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Suggestions
            </p>
            <ol className="space-y-1">
              {sugs.map((x, i) => (
                <li key={i} className="text-sm text-foreground/85 flex gap-2">
                  <span className="text-info font-semibold shrink-0">{i + 1}.</span>
                  <span>{x}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </Card>
    );
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

        {engageBlocks.map((b) => <EngageCard key={b.key} k={b.key} icon={b.icon} title={b.title} />)}

        <Card className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <h4 className="font-display font-bold text-foreground text-sm">Action Points / Go-Forwards</h4>
          </div>
          {actionPoints.length ? (
            <ul className="space-y-1.5 pl-1">
              {actionPoints.map((it, i) => (
                <li key={i} className="text-sm text-foreground/85 flex gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground italic">No action points recorded.</p>
          )}
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="w-4 h-4 text-primary" />
            <h4 className="font-display font-bold text-foreground text-sm">New Market Insights</h4>
          </div>
          {insightItems.length ? (
            <ul className="space-y-2">
              {insightItems.map((x, i) => (
                <li key={i} className="text-sm text-foreground/85">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Insight {i + 1}</span>
                    {x.tag && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">{x.tag}</span>}
                  </div>
                  <p className="whitespace-pre-line leading-relaxed">{x.body}</p>
                </li>
              ))}
            </ul>
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
