import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MeLayout from "@/components/me/MeLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  MessageSquare,
  Lightbulb,
  BookOpen,
  StickyNote,
  Layers,
  Rocket,
  Users,
  ArrowRight,
  Target,
} from "lucide-react";
import { engagementThemes, dealers } from "@/data/mockData";

const themeIcons: Record<string, typeof Layers> = { Layers, Rocket, Users };

const strategySuggestions: Record<string, string[]> = {
  wi1: ["Reach out to architects", "Onboard new contractors in your area", "Start with product demos at local sites"],
  wi2: ["Leverage JK's credit terms", "Start with minimum order quantity", "Use fast-moving SKUs to build cash flow"],
  wi3: ["Use JK compact display stand (4 sq ft)", "Place near counter for visibility", "Rotate slow-moving items"],
  wi4: ["Highlight JK buy-back guarantee", "Start with trial order", "Track results for 30 days"],
  wi5: ["Position JK as premium tier alongside existing brands", "Highlight margin difference", "Run side-by-side comparison"],
  wi6: ["Provide free product samples", "Arrange contractor testing", "Share quality certifications"],
  wi7: ["Introduce JK contractor loyalty program", "Organize a training session", "Share margin comparison with competitors"],
  wi8: ["Request JK field team for contractor introductions", "Host a painter meet", "Use JK referral network"],
};

// Per-theme positive takeaways
const themePositiveTakeaways: Record<string, string[]> = {
  et1: [
    "Open to multi-product trial",
    "Interested in JK display stand",
    "Wants to see margin comparison",
    "Agreed to start with limited SKUs",
    "Positive about portfolio expansion",
  ],
  et2: [
    "Excited about quick wins strategy",
    "Interested in contractor connect",
    "Wants marketing support",
    "Ready for first order",
    "Requested product samples",
  ],
  et3: [
    "Willing to host painter meet",
    "Interested in training sessions",
    "Excited about loyalty program",
    "Open to contractor introductions",
    "Ready for follow-up visit",
  ],
};

const EngagementTheme = () => {
  const { themeId, id: dealerId } = useParams();
  const navigate = useNavigate();
  const theme = engagementThemes.find((t) => t.id === themeId) || engagementThemes[0];
  const dealer = dealers.find((d) => d.id === dealerId) || dealers[0];
  const Icon = themeIcons[theme.icon] || Layers;

  const currentThemeIndex = engagementThemes.findIndex((t) => t.id === themeId);
  const isLastTheme = currentThemeIndex === engagementThemes.length - 1;
  const nextTheme = !isLastTheme ? engagementThemes[currentThemeIndex + 1] : null;

  // All state is per-theme (resets on themeId change)
  const [expandedPoint, setExpandedPoint] = useState<string | null>(null); // All collapsed by default
  const [completedPoints, setCompletedPoints] = useState<Set<string>>(new Set());
  const [selectedWhatIfs, setSelectedWhatIfs] = useState<Set<string>>(new Set());
  const [expandedWhatIf, setExpandedWhatIf] = useState<string | null>(null);
  const [expandedStory, setExpandedStory] = useState<Record<string, boolean>>({});
  const [expandedStrategy, setExpandedStrategy] = useState<Record<string, boolean>>({});
  const [selectedChips, setSelectedChips] = useState<Set<string>>(new Set());
  const [additionalNotes, setAdditionalNotes] = useState("");

  // Reset all state and scroll to top when theme changes
  useEffect(() => {
    setExpandedPoint(null);
    setCompletedPoints(new Set());
    setSelectedWhatIfs(new Set());
    setExpandedWhatIf(null);
    setExpandedStory({});
    setExpandedStrategy({});
    setSelectedChips(new Set());
    setAdditionalNotes("");
    window.scrollTo(0, 0);
  }, [themeId]);

  const toggleComplete = (id: string) => {
    const next = new Set(completedPoints);
    if (next.has(id)) next.delete(id); else next.add(id);
    setCompletedPoints(next);
  };

  const toggleWhatIf = (id: string) => {
    const next = new Set(selectedWhatIfs);
    if (next.has(id)) {
      next.delete(id);
      if (expandedWhatIf === id) setExpandedWhatIf(null);
    } else {
      next.add(id);
      setExpandedWhatIf(id);
    }
    setSelectedWhatIfs(next);
  };

  const toggleChip = (chip: string) => {
    const next = new Set(selectedChips);
    if (next.has(chip)) next.delete(chip); else next.add(chip);
    setSelectedChips(next);
  };

  const progress = theme.discussionPoints.length > 0
    ? (completedPoints.size / theme.discussionPoints.length) * 100
    : 0;

  const takeaways = themePositiveTakeaways[theme.id] || themePositiveTakeaways.et1;

  return (
    <MeLayout title={theme.title} showBack>
      <div className="p-4 space-y-5">
        {/* Theme Header */}
        <div className="animate-slide-up">
          <Card className={`p-4 border-${theme.color}/30 bg-${theme.color}/5`}>
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-xl bg-${theme.color}/10 flex items-center justify-center shrink-0`}>
                <Icon className={`w-6 h-6 text-${theme.color}`} />
              </div>
              <div>
                <h2 className="font-display font-bold text-foreground text-base leading-snug">{theme.title}</h2>
                <p className="text-xs text-muted-foreground mt-1">Conversation with {dealer.name}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Progress - per this plan only */}
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

        {/* Discussion Points - all collapsed by default */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            CORE DISCUSSION POINTS
          </div>
          {theme.discussionPoints.map((point, i) => {
            const isExpanded = expandedPoint === point.id;
            const isDone = completedPoints.has(point.id);

            return (
              <Card
                key={point.id}
                className={`overflow-hidden transition-all animate-slide-up ${isDone ? "border-success/40 bg-success/5" : ""}`}
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: "backwards" }}
              >
                <button
                  className="w-full p-4 flex items-start gap-3 tap-target text-left"
                  onClick={() => setExpandedPoint(isExpanded ? null : point.id)}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isDone ? "bg-success text-success-foreground" : "bg-secondary text-muted-foreground"}`}>
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-sm font-bold">{i + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground text-base">{point.title}</h4>
                    <p className="mt-0.5 line-clamp-2 text-base font-extrabold font-sans text-muted-foreground">{point.description}</p>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 animate-fade-in">
                    <div className="bg-secondary/40 rounded-lg p-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Insight</p>
                      <p className="text-sm text-foreground/85 leading-relaxed font-normal">{point.detail}</p>
                    </div>
                    <Button
                      variant={isDone ? "secondary" : "field"}
                      size="sm"
                      className="w-full"
                      onClick={() => toggleComplete(point.id)}
                    >
                      {isDone ? "Mark as Not Discussed" : "Mark as Discussed ✓"}
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* What-Ifs / Objections - combined card with collapsible sub-sections */}
        {theme.whatIfs.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Lightbulb className="w-3.5 h-3.5" />
              What-Ifs &amp; Objections
            </div>
            <p className="text-xs text-muted-foreground -mt-1">Select any objection the retailer raises.</p>
            {theme.whatIfs.map((wi) => {
              const isSelected = selectedWhatIfs.has(wi.id);
              const isExpanded = expandedWhatIf === wi.id;
              const suggestions = strategySuggestions[wi.id] || [];
              const storyOpen = expandedStory[wi.id] || false;
              const strategyOpen = expandedStrategy[wi.id] || false;

              return (
                <Card key={wi.id} className={`overflow-hidden transition-all ${isSelected ? "border-warning/30" : ""}`}>
                  {/* Objection header */}
                  <button
                    className={`w-full tap-target px-4 py-3 text-left text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-warning/10 text-warning"
                        : "bg-card text-foreground"
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

                  {isSelected && isExpanded && (
                    <div className="px-4 pb-4 space-y-2 animate-fade-in">
                      {/* Retailer Success Story - collapsed by default */}
                      <div className="border border-success/20 rounded-lg overflow-hidden">
                        <button
                          className="w-full flex items-center justify-between px-3 py-2.5 bg-success/5 text-left"
                          onClick={() => setExpandedStory(prev => ({ ...prev, [wi.id]: !prev[wi.id] }))}
                        >
                          <span className="flex items-center gap-2 text-xs font-semibold text-success uppercase">
                            <BookOpen className="w-3.5 h-3.5" />
                            Retailer Success Story
                          </span>
                          {storyOpen ? <ChevronUp className="w-3.5 h-3.5 text-success" /> : <ChevronDown className="w-3.5 h-3.5 text-success" />}
                        </button>
                        {storyOpen && (
                          <div className="px-3 pb-3 pt-2 bg-success/5 animate-fade-in">
                            <p className="text-sm text-foreground/80 leading-relaxed mb-2">{wi.peerLearning}</p>
                            <p className="text-sm text-foreground/80 leading-relaxed italic border-t border-success/20 pt-2">{wi.dealerStory}</p>
                          </div>
                        )}
                      </div>

                      {/* Core Strategy Suggestions - collapsed by default */}
                      {suggestions.length > 0 && (
                        <div className="border border-info/20 rounded-lg overflow-hidden">
                          <button
                            className="w-full flex items-center justify-between px-3 py-2.5 bg-info/5 text-left"
                            onClick={() => setExpandedStrategy(prev => ({ ...prev, [wi.id]: !prev[wi.id] }))}
                          >
                            <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
                              <Target className="w-3.5 h-3.5" />
                              Core Strategy Suggestions
                            </span>
                            {strategyOpen ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
                          </button>
                          {strategyOpen && (
                            <div className="px-3 pb-3 pt-2 bg-info/5 space-y-1.5 animate-fade-in">
                              {suggestions.map((suggestion, idx) => (
                                <div key={idx} className="bg-background/60 border border-info/15 rounded-lg px-3 py-2.5 text-sm text-foreground/80">
                                  {suggestion}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* Retailer Notes & Takeaways - per engagement plan */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <StickyNote className="w-3.5 h-3.5" />
            RETAILER RESPONSE
          </div>
          <p className="text-xs text-muted-foreground -mt-1">Tap to select key takeaways from your discussion.</p>

          <div className="flex flex-wrap gap-2">
            {takeaways.map((chip) => {
              const isSelected = selectedChips.has(chip);
              return (
                <button
                  key={chip}
                  onClick={() => toggleChip(chip)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all tap-target ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary text-muted-foreground border border-border/50 hover:border-primary/30"
                  }`}
                >
                  {isSelected && <span className="mr-1">✓</span>}
                  {chip}
                </button>
              );
            })}
          </div>

          <Textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Any additional notes (optional)..."
            className="min-h-[60px] rounded-xl bg-card text-sm"
          />
        </div>

        {/* Sequential Navigation */}
        <div className="pt-2 animate-slide-up" style={{ animationDelay: "200ms", animationFillMode: "backwards" }}>
          {isLastTheme ? (
            <Button
              variant="field"
              className="w-full"
              onClick={() => navigate(`/me/notes/${dealer.id}`)}
            >
              Continue to Summary
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              variant="field"
              className="w-full"
              onClick={() => navigate(`/me/engagement/${dealer.id}/${nextTheme!.id}`)}
            >
              Next: {nextTheme!.title}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </MeLayout>
  );
};

export default EngagementTheme;
