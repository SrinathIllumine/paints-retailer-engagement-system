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
} from "lucide-react";
import { engagementThemes } from "@/data/mockData";

const themeIcons: Record<string, typeof Layers> = { Layers, Rocket, Users };

const EngagementTheme = () => {
  const { themeId } = useParams();
  const navigate = useNavigate();
  const theme = engagementThemes.find((t) => t.id === themeId) || engagementThemes[0];
  const Icon = themeIcons[theme.icon] || Layers;

  const [expandedPoint, setExpandedPoint] = useState<string | null>(theme.discussionPoints[0]?.id || null);
  const [completedPoints, setCompletedPoints] = useState<Set<string>>(new Set());
  const [selectedWhatIfs, setSelectedWhatIfs] = useState<Set<string>>(new Set());
  const [expandedWhatIf, setExpandedWhatIf] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

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

  const progress = theme.discussionPoints.length > 0
    ? (completedPoints.size / theme.discussionPoints.length) * 100
    : 0;

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
                <p className="text-xs text-muted-foreground mt-1">{theme.subtitle}</p>
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

        {/* Discussion Points — Visual Cards */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            Discussion Points
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
                    <h4 className="font-semibold text-foreground text-sm">{point.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{point.description}</p>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 animate-fade-in">
                    <div className="bg-secondary/40 rounded-lg p-3">
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
            <p className="text-xs text-muted-foreground -mt-1">Select any objection the dealer raises — see how peers have addressed it.</p>
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
                      {/* Peer Learning */}
                      <Card className="p-3 border-info/20 bg-info/5">
                        <div className="flex items-start gap-2">
                          <BookOpen className="w-4 h-4 text-info shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-info uppercase mb-1">Peer Learning</p>
                            <p className="text-sm text-foreground/80 leading-relaxed">{wi.peerLearning}</p>
                          </div>
                        </div>
                      </Card>

                      {/* Dealer Story */}
                      <Card className="p-3 border-success/20 bg-success/5">
                        <div className="flex items-start gap-2">
                          <Quote className="w-4 h-4 text-success shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-success uppercase mb-1">Dealer Story</p>
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

        {/* Dealer Notes */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <StickyNote className="w-3.5 h-3.5" />
            Dealer Notes &amp; Takeaways
          </div>
          <p className="text-xs text-muted-foreground -mt-0.5">Capture what you both agreed on — outcomes, not instructions.</p>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., Agreed to try 5 SKUs of JK Putty. Will follow up in 2 weeks with contractor intro..."
            className="min-h-[100px] rounded-xl bg-card text-sm"
          />
        </div>

        {/* Continue */}
        <Button
          variant="field"
          className="w-full"
          onClick={() => navigate("/me")}
        >
          Save &amp; Return to My Area →
        </Button>
      </div>
    </MeLayout>
  );
};

export default EngagementTheme;
