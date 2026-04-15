import { useState } from "react";
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
  Quote,
  StickyNote,
  Layers,
  Rocket,
  Users,
  ArrowRight,
} from "lucide-react";
import { engagementThemes, dealers } from "@/data/mockData";

const themeIcons: Record<string, typeof Layers> = { Layers, Rocket, Users };

const suggestedTakeaways = [
  "Concern about working capital",
  "Needs market demand proof",
  "Open to trial later",
  "Interested in contractor connect",
  "Wants to see display stand",
  "Agreed to start with limited SKUs",
  "Will discuss with partner",
  "Requested product samples",
  "Positive about JK brand",
  "Needs follow-up in 2 weeks",
];

const EngagementTheme = () => {
  const { themeId, id: dealerId } = useParams();
  const navigate = useNavigate();
  const theme = engagementThemes.find((t) => t.id === themeId) || engagementThemes[0];
  const dealer = dealers.find((d) => d.id === dealerId) || dealers[0];
  const Icon = themeIcons[theme.icon] || Layers;

  const [expandedPoint, setExpandedPoint] = useState<string | null>(theme.discussionPoints[0]?.id || null);
  const [completedPoints, setCompletedPoints] = useState<Set<string>>(new Set());
  const [selectedWhatIfs, setSelectedWhatIfs] = useState<Set<string>>(new Set());
  const [expandedWhatIf, setExpandedWhatIf] = useState<string | null>(null);
  const [selectedChips, setSelectedChips] = useState<Set<string>>(new Set());
  const [additionalNotes, setAdditionalNotes] = useState("");

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

  const allDiscussed = completedPoints.size === theme.discussionPoints.length;

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

        {/* Discussion Points */}
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

        {/* What-Ifs / Objections */}
        {theme.whatIfs.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Lightbulb className="w-3.5 h-3.5" />
              What-Ifs &amp; Objections
            </div>
            <p className="text-xs text-muted-foreground -mt-1">Select any objection the retailer raises - see how peers have addressed it.</p>
            {theme.whatIfs.map((wi) => {
              const isSelected = selectedWhatIfs.has(wi.id);
              const isExpanded = expandedWhatIf === wi.id;

              return (
                <div key={wi.id}>
                  <button
                    className={`w-full tap-target rounded-xl px-4 py-3 text-left text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-warning/10 text-warning border border-warning/30"
                        : "bg-card text-foreground border border-border"
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
                    <div className="mt-2 space-y-2 animate-fade-in">
                      <Card className="p-3 border-info/20 bg-info/5">
                        <div className="flex items-start gap-2">
                          <BookOpen className="w-4 h-4 text-info shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-info uppercase mb-1">SUCCESS STORY FROM OTHER RETAILERS</p>
                            <p className="text-sm text-foreground/80 leading-relaxed">{wi.peerLearning}</p>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-3 border-success/20 bg-success/5">
                        <div className="flex items-start gap-2">
                          <Quote className="w-4 h-4 text-success shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-success uppercase mb-1">RETAILER STORY</p>
                            <p className="text-sm text-foreground/80 leading-relaxed italic">{wi.dealerStory}</p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* AI-Assisted Dealer Notes & Takeaways */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <StickyNote className="w-3.5 h-3.5" />
            RETAILER NOTES & TAKEAWAYS
          </div>
          <p className="text-xs text-muted-foreground -mt-1">Tap to select key takeaways from your discussion.</p>

          {/* Suggestion Chips */}
          <div className="flex flex-wrap gap-2">
            {suggestedTakeaways.map((chip) => {
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

          {/* Optional free text */}
          <Textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Any additional notes (optional)..."
            className="min-h-[60px] rounded-xl bg-card text-sm"
          />
        </div>

        {/* Continue to Summary */}
        <div className="pt-2 animate-slide-up" style={{ animationDelay: "200ms", animationFillMode: "backwards" }}>
          <Button
            variant="field"
            className="w-full"
            onClick={() => navigate(`/me/notes/${dealer.id}`)}
          >
            Continue to Summary
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </MeLayout>
  );
};

export default EngagementTheme;
