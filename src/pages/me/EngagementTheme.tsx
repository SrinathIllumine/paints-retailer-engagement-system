import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MeLayout from "@/components/me/MeLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  MessageSquare,
  Lightbulb,
  StickyNote,
  Layers,
  Rocket,
  Users,
  ArrowRight,
  BookOpen,
  TrendingUp,
  
  Radar,
  Sparkles,
} from "lucide-react";
import { engagementThemes, dealers } from "@/data/mockData";
import VoiceTextInput from "@/components/me/VoiceTextInput";

const themeIcons: Record<string, typeof Layers> = { Layers, Rocket, Users };

// Per-theme best practices
const bestPracticesMap: Record<string, string[]> = {
  wi1: [
    "Start with a small trial batch to test actual demand before committing further",
    "Ask 3-4 regular contractors what products they currently source from elsewhere",
    "Place our products near high-traffic areas in the shop for passive visibility",
    "Track weekly enquiries for 30 days to build a real demand picture",
  ],
  wi2: [
    "Begin with our minimum order quantity to limit initial outlay",
    "Focus on fast-moving SKUs that turn over within 2-3 weeks",
    "Monitor sell-through rates to guide future ordering decisions",
    "Reinvest initial margins into gradually expanding the range",
  ],
  wi3: [
    "Use our compact 4 sq ft display stand designed for small shops",
    "Position near the billing counter for maximum visibility with minimal space",
    "Rotate slow-moving items monthly to keep the display fresh",
    "Stack vertically using wall-mounted shelving provided by us",
  ],
  wi4: [
    "Start with the top 3 proven sellers in your market segment",
    "Set a 30-day review checkpoint to assess traction before expanding",
    "Connect with 2-3 nearby retailers who successfully added our products",
    "Track customer feedback to build confidence in the product range",
  ],
  wi5: [
    "Position our range as a premium complement, not a replacement for existing brands",
    "Create a clear display showing good-better-best options for customers",
    "Let customers choose - more options mean more footfall and higher basket value",
    "Highlight our unique product strengths in conversations with contractors",
  ],
  wi6: [
    "Request free product samples for personal testing before stocking",
    "Arrange a contractor application demo at a local site",
    "Share our quality certifications and test reports with enquiring buyers",
    "Start with one product category and validate quality before expanding",
  ],
  wi7: [
    "Organize a hands-on training session for 5-8 key contractors",
    "Share a side-by-side performance comparison to show contractor benefits",
    "Offer exclusive first-access to new products through your shop",
    "Build trust through consistent product quality and availability",
  ],
  wi8: [
    "Request our field team to introduce you to 8-10 active local contractors",
    "Host a small painter meet at your shop for product awareness",
    "Build relationships with contractors through regular engagement",
    "Start with one painter meet and grow based on response",
  ],
};

const themePositiveTakeaways: Record<string, string[]> = {
  et1: [
    "I'll try 2–3 relevant SKUs with contractors before the next meeting to see if it works for me",
    "I'll introduce our products to existing contractor network and get their feedback",
    "To test product performance at select customer sites will be my top priority",
    "Will share contractor feedback regarding the new paint in next meeting",
  ],
  et2: [
    "I'll place initial order of fast-moving SKUs this week to test the waters",
    "Connecting with 3 local contractors for product trials will give me some market exposure",
    "I'll set up a product display in high-visibility area to gain more attention",
    "Share first-month performance review in next visit",
  ],
  et3: [
    "My aim is to identify 5 key contractors for deeper engagement",
    "I'll organize a hands-on product demo at shop to gain contractors' and painters' trust.",
    "We can invite painters to the upcoming brand meet event",
    "I'll collect contractor feedback after first application to understand more about the product",
  ],
};

// Go-forward suggestions (next-step commitments) — independent of action points
const themeGoForwards: Record<string, string[]> = {
  et1: [
    "Schedule follow-up visit within 2 weeks to review trial outcomes",
    "Share our waterproofing & protective solutions brochure on WhatsApp by tomorrow",
    "Coordinate with ASM to arrange contractor meet next month",
  ],
  et2: [
    "Confirm initial order placement before week-end",
    "Send display stand request to area office",
    "Plan joint visit with senior ME for next review cycle",
  ],
  et3: [
    "Block date for in-shop painter meet in next 3 weeks",
    "Share painter contact list with ASM for invites",
    "Follow up on demo feedback within 7 days",
  ],
};

const MARKET_INSIGHT_SECTIONS = [
  { key: "competition", label: "Competition", placeholder: "What competitors are doing — schemes, pricing, push, new SKUs…" },
  { key: "demand", label: "Demand", placeholder: "Demand patterns — projects, seasonality, slow/fast movers…" },
  { key: "productQuality", label: "Product Quality", placeholder: "Any complaints, observations on our or competitor product quality…" },
  { key: "schemes", label: "Schemes", placeholder: "Scheme feedback — what's working, what's missing, retailer asks…" },
  { key: "customerRelated", label: "Customer Related", placeholder: "End-customer behaviour — preferences, brand pull, painter influence…" },
] as const;

type InsightKey = typeof MARKET_INSIGHT_SECTIONS[number]["key"];

const EngagementTheme = () => {
  const { themeId, id: dealerId } = useParams();
  const navigate = useNavigate();
  const theme = engagementThemes.find((t) => t.id === themeId) || engagementThemes[0];
  const dealer = dealers.find((d) => d.id === dealerId) || dealers[0];
  const Icon = themeIcons[theme.icon] || Layers;

  const [completedPoints, setCompletedPoints] = useState<Set<string>>(new Set());
  const [selectedWhatIfs, setSelectedWhatIfs] = useState<Set<string>>(new Set());
  const [expandedBestPractices, setExpandedBestPractices] = useState<Record<string, boolean>>({});
  const [selectedActionPoints, setSelectedActionPoints] = useState<Set<string>>(new Set());
  
  const [retailerFeedback, setRetailerFeedback] = useState("");

  // Market insights state — raw note + AI summary per section
  const [insightNotes, setInsightNotes] = useState<Record<InsightKey, string>>({
    competition: "", demand: "", productQuality: "", schemes: "", customerRelated: "",
  });
  const [insightSummaries, setInsightSummaries] = useState<Record<InsightKey, string>>({
    competition: "", demand: "", productQuality: "", schemes: "", customerRelated: "",
  });

  // Retailer Ideas — single voice/text capture with AI summary
  const [ideaNote, setIdeaNote] = useState("");
  const [ideaSummary, setIdeaSummary] = useState("");

  useEffect(() => {
    setCompletedPoints(new Set());
    setSelectedWhatIfs(new Set());
    setExpandedBestPractices({});
    setSelectedActionPoints(new Set());
    
    setRetailerFeedback("");
    setInsightNotes({ competition: "", demand: "", productQuality: "", schemes: "", customerRelated: "" });
    setInsightSummaries({ competition: "", demand: "", productQuality: "", schemes: "", customerRelated: "" });
    setIdeaNote("");
    setIdeaSummary("");
    window.scrollTo(0, 0);
  }, [themeId]);

  const toggleComplete = (id: string) => {
    const next = new Set(completedPoints);
    if (next.has(id)) next.delete(id); else next.add(id);
    setCompletedPoints(next);
  };

  const toggleWhatIf = (id: string) => {
    const next = new Set(selectedWhatIfs);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedWhatIfs(next);
    if (!expandedBestPractices[id]) setExpandedBestPractices((p) => ({ ...p, [id]: true }));
  };

  const toggleSet = (set: Set<string>, setter: (s: Set<string>) => void, value: string) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value); else next.add(value);
    setter(next);
  };

  const progress = theme.discussionPoints.length > 0
    ? (completedPoints.size / theme.discussionPoints.length) * 100
    : 0;

  const actionPoints = themePositiveTakeaways[theme.id] || themePositiveTakeaways.et1;
  

  return (
    <MeLayout title={theme.title} showBack>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="animate-slide-up flex items-start gap-3">
          <div className={`w-11 h-11 rounded-xl bg-${theme.color}/10 flex items-center justify-center shrink-0`}>
            <Icon className={`w-5 h-5 text-${theme.color}`} />
          </div>
          <div>
            <h2 className="font-display font-bold text-foreground text-base leading-snug">{theme.title}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Conversation with {dealer.name}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="animate-fade-in">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-muted-foreground font-medium">{completedPoints.size} of {theme.discussionPoints.length} discussed</span>
            <span className="font-bold text-foreground">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full bg-${theme.color} rounded-full transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Master accordion of all sections — collapsed by default */}
        <Accordion
          type="multiple"
          className="space-y-3"
        >
          {/* CORE DISCUSSION POINTS */}
          <Card className="overflow-hidden">
            <AccordionItem value="core" className="border-b-0">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <span className="flex items-center gap-2 font-extrabold uppercase tracking-wider text-card-foreground text-xs">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Core Discussion Points
                  <span className="ml-1 text-[10px] text-muted-foreground font-medium normal-case tracking-normal">
                    {completedPoints.size}/{theme.discussionPoints.length}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <Accordion type="multiple" className="space-y-2">
                  {theme.discussionPoints.map((point, i) => {
                    const isDone = completedPoints.has(point.id);
                    return (
                      <AccordionItem
                        key={point.id}
                        value={point.id}
                        className={`border rounded-xl px-3 ${isDone ? "border-success/40 bg-success/5" : "border-border"}`}
                      >
                        <AccordionTrigger className="hover:no-underline py-3">
                          <div className="flex items-start gap-3 text-left flex-1">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isDone ? "bg-success text-success-foreground" : "bg-secondary text-muted-foreground"}`}>
                              {isDone ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-foreground text-sm">{point.title}</h4>
                              <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">{point.description}</p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3">
                          <div className="bg-secondary/40 rounded-lg p-3">
                            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Useful insights for you</p>
                            <p className="text-sm text-foreground/85 leading-relaxed">{point.detail}</p>
                          </div>
                          <Button
                            variant={isDone ? "secondary" : "field"}
                            size="sm"
                            className="w-full"
                            onClick={() => toggleComplete(point.id)}
                          >
                            {isDone ? "Mark as Not Discussed" : "Mark as Discussed ✓"}
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          </Card>

          {/* OBJECTIONS */}
          {theme.whatIfs.length > 0 && (
            <Card className="overflow-hidden">
              <AccordionItem value="objections" className="border-b-0">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <span className="flex items-center gap-2 font-extrabold uppercase tracking-wider text-card-foreground text-xs">
                    <Lightbulb className="w-3.5 h-3.5" />
                    Objections
                    <span className="ml-1 text-[10px] text-muted-foreground font-medium normal-case tracking-normal">
                      {selectedWhatIfs.size} selected
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 space-y-2">
                  <p className="text-xs text-muted-foreground">Select all objections raised by the retailer.</p>
                  {theme.whatIfs.map((wi) => {
                    const isSelected = selectedWhatIfs.has(wi.id);
                    const practices = bestPracticesMap[wi.id] || [];
                    const practicesOpen = expandedBestPractices[wi.id] !== false;
                    return (
                      <Card key={wi.id} className={`overflow-hidden transition-all ${isSelected ? "border-warning/30" : ""}`}>
                        <button
                          type="button"
                          className={`w-full tap-target px-3 py-2.5 text-left text-sm font-medium transition-all ${
                            isSelected ? "bg-warning/10 text-warning" : "bg-card text-foreground"
                          }`}
                          onClick={() => toggleWhatIf(wi.id)}
                        >
                          <span className="flex items-center gap-2">
                            <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                              isSelected ? "border-warning bg-warning text-warning-foreground" : "border-muted-foreground/30"
                            }`}>
                              {isSelected && <CheckCircle2 className="w-3 h-3" />}
                            </span>
                            {wi.label}
                          </span>
                        </button>

                        {isSelected && practices.length > 0 && (
                          <div className="px-3 pb-3 animate-fade-in">
                            <div className="border border-info/20 rounded-lg overflow-hidden">
                              <button
                                type="button"
                                className="w-full flex items-center justify-between px-3 py-2 bg-info/5 text-left"
                                onClick={() => setExpandedBestPractices((prev) => ({ ...prev, [wi.id]: !practicesOpen }))}
                              >
                                <span className="flex items-center gap-2 text-xs font-semibold text-info uppercase">
                                  <BookOpen className="w-3.5 h-3.5" />
                                  Best practices for the retailer
                                </span>
                                {practicesOpen ? <ChevronUp className="w-3.5 h-3.5 text-info" /> : <ChevronDown className="w-3.5 h-3.5 text-info" />}
                              </button>
                              {practicesOpen && (
                                <div className="px-3 pb-3 pt-2 bg-info/5 space-y-1.5 animate-fade-in max-h-48 overflow-y-auto">
                                  {practices.map((practice, idx) => (
                                    <div key={idx} className="bg-background/60 border border-info/15 rounded-lg px-3 py-2 text-sm text-foreground/80">
                                      {practice}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            </Card>
          )}

          {/* RETAILER ACTION POINTS */}
          <Card className="overflow-hidden">
            <AccordionItem value="actions" className="border-b-0">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <span className="flex items-center gap-2 font-extrabold uppercase tracking-wider text-card-foreground text-xs">
                  <StickyNote className="w-3.5 h-3.5" />
                  <span className="flex flex-col items-start leading-tight">
                    RETAILER ACTION POINTS / GO-FORWARDS
                    <span className="text-[10px] text-muted-foreground font-medium normal-case tracking-normal">
                      {selectedActionPoints.size} selected
                    </span>
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 space-y-3">
                <p className="text-xs text-muted-foreground">Commitments the retailer will own.</p>
                {actionPoints.map((chip) => {
                  const isSelected = selectedActionPoints.has(chip);
                  return (
                    <label
                      key={chip}
                      className="flex items-start gap-3 p-3 rounded-xl bg-secondary/40 border border-border/50 cursor-pointer transition-all hover:border-primary/30 tap-target"
                      onClick={() => toggleSet(selectedActionPoints, setSelectedActionPoints, chip)}
                    >
                      <Checkbox checked={isSelected} className="mt-0.5" />
                      <span className="text-sm text-foreground">{chip}</span>
                    </label>
                  );
                })}

                <div className="pt-2 space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Additional Retailer Feedback
                  </label>
                  <Textarea
                    value={retailerFeedback}
                    onChange={(e) => setRetailerFeedback(e.target.value)}
                    placeholder="Capture any additional feedback or context the retailer shared…"
                    className="min-h-[90px] rounded-xl bg-card text-sm"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Card>

          {/* MARKET INSIGHTS */}
          <Card className="overflow-hidden">
            <AccordionItem value="insights" className="border-b-0">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <span className="flex items-center gap-2 font-extrabold uppercase tracking-wider text-card-foreground text-xs">
                  <Radar className="w-3.5 h-3.5" />
                  Market Insights
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <p className="text-xs text-muted-foreground mb-2">
                  Capture field signals — speak or type. AI will summarise into 2–4 sharp lines.
                </p>
                <Accordion type="multiple" className="space-y-2">
                  {MARKET_INSIGHT_SECTIONS.map((s) => {
                    const hasContent = !!insightNotes[s.key]?.trim();
                    return (
                      <AccordionItem
                        key={s.key}
                        value={s.key}
                        className={`border rounded-xl px-3 ${hasContent ? "border-info/30 bg-info/5" : "border-border"}`}
                      >
                        <AccordionTrigger className="hover:no-underline py-3">
                          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                            {s.label}
                            {hasContent && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-info/15 text-info font-medium">captured</span>
                            )}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <VoiceTextInput
                            category={s.label}
                            placeholder={s.placeholder}
                            value={insightNotes[s.key]}
                            onChange={(v) => setInsightNotes((prev) => ({ ...prev, [s.key]: v }))}
                            summary={insightSummaries[s.key]}
                            onSummaryChange={(v) => setInsightSummaries((prev) => ({ ...prev, [s.key]: v }))}
                          />
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          </Card>

          {/* RETAILER IDEAS */}
          <Card className="overflow-hidden">
            <AccordionItem value="ideas" className="border-b-0">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <span className="flex items-center gap-2 font-extrabold uppercase tracking-wider text-card-foreground text-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  Retailer Ideas
                  {(ideaNote.trim() || ideaSummary.trim()) && (
                    <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-info/15 text-info font-medium normal-case tracking-normal">
                      captured
                    </span>
                  )}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <p className="text-xs text-muted-foreground mb-2">
                  Capture suggestions or ideas the retailer shared — speak or type. AI will summarise crisply.
                </p>
                <VoiceTextInput
                  category="Retailer Idea"
                  placeholder="What ideas or suggestions did the retailer share?"
                  value={ideaNote}
                  onChange={setIdeaNote}
                  summary={ideaSummary}
                  onSummaryChange={setIdeaSummary}
                />
              </AccordionContent>
            </AccordionItem>
          </Card>
        </Accordion>

        {/* Save */}
        <div className="pt-2 space-y-2 animate-slide-up" style={{ animationDelay: "200ms", animationFillMode: "backwards" }}>
          <Button
            variant="field"
            className="w-full"
            onClick={() => {
              try {
                const key = `visitData:${dealer.id}`;
                const existing = JSON.parse(sessionStorage.getItem(key) || "{}");
                const themesData = existing.themes || {};
                themesData[theme.id] = {
                  themeTitle: theme.title,
                  discussedPoints: theme.discussionPoints
                    .filter((p) => completedPoints.has(p.id))
                    .map((p) => p.title),
                  objections: theme.whatIfs
                    .filter((w) => selectedWhatIfs.has(w.id))
                    .map((w) => w.label),
                  actionPoints: Array.from(selectedActionPoints),
                  
                  feedback: retailerFeedback.trim() ? [retailerFeedback.trim()] : [],
                  marketInsights: MARKET_INSIGHT_SECTIONS
                    .filter((s) => insightNotes[s.key].trim() || insightSummaries[s.key].trim())
                    .map((s) => ({
                      category: s.label,
                      note: insightNotes[s.key].trim(),
                      summary: insightSummaries[s.key].trim(),
                    })),
                  retailerIdeas: (ideaNote.trim() || ideaSummary.trim())
                    ? { note: ideaNote.trim(), summary: ideaSummary.trim() }
                    : null,
                };
                sessionStorage.setItem(key, JSON.stringify({ ...existing, themes: themesData }));
              } catch {}
              navigate(`/me/notes/${dealer.id}`);
            }}
          >
            Save and Go to Summary Page
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </MeLayout>
  );
};

export default EngagementTheme;
