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

  const objBody = (engage.objections.transcript || "").trim();
  const objMatches = engage.objections.matches || [];

  const waObjections = () => {
    if (!objBody && objMatches.length === 0) return "";
    const lines = ["⚠️ *Objections Handled:*"];
    if (objBody) lines.push(objBody);
    objMatches.forEach((m) => {
      lines.push(`• ${m.label}`);
      m.bestPractices.forEach((bp) => lines.push(`   - ${bp}`));
    });
    return lines.join("\n");
  };

  const waIdeas = () => {
    const lines = ["💡 *Business Ideas Proposed:*"];
    BUSINESS_IDEAS.forEach((p) => lines.push(`• ${p}`));
    lines.push("  Nearby DGs:");
    NEARBY_DGS.forEach((dg) => {
      const parts = [];
      if (dg.name) parts.push(dg.name);
      parts.push(dg.area.replace(/\n/g, " "));
      if (dg.phone) parts.push(dg.phone);
      lines.push(`   - ${parts.join(" · ")}`);
    });
    return lines.join("\n");
  };

  const waEducation = () => {
    const lines = ["📘 *Product / Scheme Education:*"];
    EDUCATION_POINTS.forEach((p) => lines.push(`• ${p}`));
    return lines.join("\n");
  };

  const waBlocks = [
    waObjections(),
    waIdeas(),
    waEducation(),
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

  const ObjectionsCard = () => {
    if (!objBody && objMatches.length === 0) return null;
    return (
      <Card className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquareWarning className="w-4 h-4 text-primary" />
          <h4 className="font-display font-bold text-foreground text-sm">Objections Handled</h4>
        </div>
        {objBody && <p className="text-sm text-foreground/85 whitespace-pre-line leading-relaxed">{objBody}</p>}
        {objMatches.length > 0 && (
          <div className="mt-2.5 space-y-2">
            {objMatches.map((m, i) => (
              <div key={i} className="rounded-lg border border-info/20 bg-info/5 p-2.5">
                <p className="text-sm font-semibold text-foreground mb-1">{m.label}</p>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Best practices</p>
                <ul className="space-y-1">
                  {m.bestPractices.map((bp, j) => (
                    <li key={j} className="text-sm text-foreground/85 flex gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-info mt-2 shrink-0" />
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </Card>
    );
  };

  const selectedIdeas = (engage.ideas?.selected || []).map((i) => BUSINESS_IDEAS[i]).filter(Boolean);
  const selectedEducation = (engage.education?.selected || []).map((i) => EDUCATION_POINTS[i]).filter(Boolean);
  const showDG = (engage.ideas?.selected || []).includes(1);

  const IdeasCard = () => {
    if (selectedIdeas.length === 0) return null;
    return (
      <Card className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-primary" />
          <h4 className="font-display font-bold text-foreground text-sm">Business Ideas Proposed</h4>
        </div>
        <ul className="space-y-1.5">
          {selectedIdeas.map((p, i) => (
            <li key={i} className="text-sm text-foreground/85 flex gap-2">
              <span className="text-primary font-semibold shrink-0">{i + 1}.</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
        {showDG && (
          <div className="mt-2.5 rounded-lg border border-border bg-secondary/30 p-2.5">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Nearby DG</p>
            <ul className="space-y-1">
              {NEARBY_DGS.map((dg, i) => (
                <li key={i} className="text-xs text-foreground/85 leading-relaxed">
                  {dg.name && <><span className="font-semibold text-foreground">{dg.name}</span> · </>}
                  {dg.area}
                  {dg.phone && <> · {dg.phone}</>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    );
  };

  const EducationCard = () => {
    if (selectedEducation.length === 0) return null;
    return (
      <Card className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <h4 className="font-display font-bold text-foreground text-sm">Product / Scheme Education</h4>
        </div>
        <ul className="space-y-1.5">
          {selectedEducation.map((p, i) => (
            <li key={i} className="text-sm text-foreground/85 flex gap-2">
              <span className="text-primary font-semibold shrink-0">{i + 1}.</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
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

        <ObjectionsCard />
        <IdeasCard />
        <EducationCard />

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
