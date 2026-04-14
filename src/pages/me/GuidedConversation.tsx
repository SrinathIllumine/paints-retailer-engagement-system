import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MeLayout from "@/components/me/MeLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronUp, CheckCircle2, MessageSquare, Lightbulb } from "lucide-react";
import { discussionPoints, dealers } from "@/data/mockData";

const GuidedConversation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dealer = dealers.find((d) => d.id === id) || dealers[0];
  const [expandedPoint, setExpandedPoint] = useState<string | null>(discussionPoints[0].id);
  const [completedPoints, setCompletedPoints] = useState<Set<string>>(new Set());
  const [selectedObjections, setSelectedObjections] = useState<Set<string>>(new Set());
  const [showResponse, setShowResponse] = useState<string | null>(null);

  const progress = (completedPoints.size / discussionPoints.length) * 100;

  const toggleComplete = (pointId: string) => {
    const next = new Set(completedPoints);
    if (next.has(pointId)) next.delete(pointId);
    else next.add(pointId);
    setCompletedPoints(next);
  };

  const toggleObjection = (objId: string) => {
    const next = new Set(selectedObjections);
    if (next.has(objId)) {
      next.delete(objId);
      if (showResponse === objId) setShowResponse(null);
    } else {
      next.add(objId);
      setShowResponse(objId);
    }
    setSelectedObjections(next);
  };

  return (
    <MeLayout title={dealer.name} showBack>
      <div className="p-4 space-y-4">
        {/* Progress */}
        <div className="space-y-2 animate-fade-in">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">{completedPoints.size} of {discussionPoints.length} covered</span>
            <span className="font-bold text-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Discussion Points */}
        <div className="space-y-3">
          {discussionPoints.map((point, i) => {
            const isExpanded = expandedPoint === point.id;
            const isDone = completedPoints.has(point.id);

            return (
              <Card
                key={point.id}
                className={`overflow-hidden transition-all animate-slide-up ${isDone ? "border-success/40 bg-success/5" : ""}`}
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: "backwards" }}
              >
                {/* Header */}
                <button
                  className="w-full p-4 flex items-center gap-3 tap-target text-left"
                  onClick={() => setExpandedPoint(isExpanded ? null : point.id)}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isDone ? "bg-success text-success-foreground" : "bg-secondary text-muted-foreground"}`}>
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-sm font-bold">{i + 1}</span>}
                  </div>
                  <span className="font-medium text-foreground flex-1 text-sm">{point.title}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3">
                    {/* Talking bullets */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <MessageSquare className="w-3 h-3" />
                        Key Talking Points
                      </div>
                      <ul className="space-y-1.5">
                        {point.bullets.map((b, j) => (
                          <li key={j} className="text-sm text-foreground/80 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Objections */}
                    {point.objections.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          <Lightbulb className="w-3 h-3" />
                          Common Objections
                        </div>
                        <div className="space-y-2">
                          {point.objections.map((obj) => (
                            <div key={obj.id}>
                              <button
                                className={`w-full tap-target rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                                  selectedObjections.has(obj.id)
                                    ? "bg-warning/10 text-warning border border-warning/30"
                                    : "bg-secondary text-secondary-foreground"
                                }`}
                                onClick={() => toggleObjection(obj.id)}
                              >
                                ⚠ {obj.label}
                              </button>
                              {showResponse === obj.id && (
                                <div className="mt-2 p-3 bg-info/5 border border-info/20 rounded-lg text-sm text-foreground/80 animate-fade-in">
                                  <p className="text-xs font-semibold text-info mb-1 uppercase">Recommended Response</p>
                                  {obj.response}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mark Complete */}
                    <Button
                      variant={isDone ? "secondary" : "field"}
                      size="sm"
                      className="w-full"
                      onClick={() => toggleComplete(point.id)}
                    >
                      {isDone ? "Mark Incomplete" : "Mark as Discussed ✓"}
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* End Visit */}
        <Button
          variant="field"
          className="w-full"
          onClick={() => navigate(`/me/notes/${dealer.id}`)}
        >
          Continue to Summary →
        </Button>
      </div>
    </MeLayout>
  );
};

export default GuidedConversation;
