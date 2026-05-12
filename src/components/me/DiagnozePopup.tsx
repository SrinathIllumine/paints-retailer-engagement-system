import { useState } from "react";
import { ArrowLeft, ChevronDown, ClipboardList, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import VoiceTextInput from "@/components/me/VoiceTextInput";

export const PREPARE_POINTS = [
  "Meet key painters/contractors within the next 7 days to generate demand.",
  "Review sales movement together after 2 weeks.",
];

const INSIGHT_TAGS = ["Demand-related", "Competitor-related", "Scheme-related"];

export type MarketInsight = {
  id: string;
  tag: string;
  text: string;
  summary: string;
};

export type DiagnozeState = {
  topicsCovered: string[];
  customActionPoint?: string;
  insights: MarketInsight[];
  feedbackText: string;
  feedbackSummary: string;
};

export const newInsight = (): MarketInsight => ({
  id: Math.random().toString(36).slice(2, 9),
  tag: "",
  text: "",
  summary: "",
});

type Props = {
  open: boolean;
  onClose: () => void;
  state: DiagnozeState;
  setState: (s: DiagnozeState) => void;
  onGenerate: () => void;
};

const Q = ({ idx, title, isOpen, onToggle, children }: { idx: number; title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode }) => (
  <div className="rounded-xl border border-border bg-card overflow-hidden">
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between p-3 text-left"
    >
      <span className="text-sm font-semibold text-foreground pr-2">
        <span className="text-primary mr-1.5">Q{idx}.</span>{title}
      </span>
      <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
    </button>
    {isOpen && <div className="px-3 pb-3 pt-0 border-t border-border/60">{children}</div>}
  </div>
);

const DiagnozePopup = ({ open, onClose, state, setState, onGenerate }: Props) => {
  const [openQ, setOpenQ] = useState<number | null>(null);
  if (!open) return null;

  const toggleTopic = (t: string) => {
    const next = state.topicsCovered.includes(t)
      ? state.topicsCovered.filter((x) => x !== t)
      : [...state.topicsCovered, t];
    setState({ ...state, topicsCovered: next });
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 shrink-0">
        <button onClick={onClose} className="p-1 -ml-1 text-muted-foreground hover:text-foreground" aria-label="Back">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.18em]">AFTER</p>
          <h3 className="font-display font-bold text-foreground text-sm leading-tight mt-0.5 truncate">
            Post Meeting With The Retailer
          </h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4 space-y-3">
          <Q idx={1} title="What are the action points agreed by the Retailer?" isOpen={openQ === 1} onToggle={() => setOpenQ(openQ === 1 ? null : 1)}>
            <div className="space-y-2 mt-3">
              {PREPARE_POINTS.map((p) => {
                const checked = state.topicsCovered.includes(p);
                return (
                  <label key={p} className={`flex items-start gap-2.5 rounded-lg border p-2.5 cursor-pointer transition-colors ${checked ? "border-primary/40 bg-primary/5" : "border-border"}`}>
                    <Checkbox checked={checked} onCheckedChange={() => toggleTopic(p)} className="mt-0.5" />
                    <span className="text-sm text-foreground/90">{p}</span>
                  </label>
                );
              })}
              <div className="pt-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Other action point
                </label>
                <textarea
                  value={state.customActionPoint ?? ""}
                  onChange={(e) => setState({ ...state, customActionPoint: e.target.value })}
                  placeholder="Type any other action point agreed by the retailer..."
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-border bg-background p-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
          </Q>

          <Q idx={2} title="Record new market insights" isOpen={openQ === 2} onToggle={() => setOpenQ(openQ === 2 ? null : 2)}>
            <div className="mt-3 space-y-3">
              {state.insights.map((ins, i) => {
                const update = (patch: Partial<MarketInsight>) => {
                  const next = state.insights.map((x) => x.id === ins.id ? { ...x, ...patch } : x);
                  setState({ ...state, insights: next });
                };
                const remove = () => {
                  setState({ ...state, insights: state.insights.filter((x) => x.id !== ins.id) });
                };
                return (
                  <div key={ins.id} className="rounded-xl border border-border bg-background/40 p-2.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Insight {i + 1}</span>
                      {state.insights.length > 1 && (
                        <button type="button" onClick={remove} className="text-muted-foreground hover:text-destructive p-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {INSIGHT_TAGS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => update({ tag: ins.tag === t ? "" : t })}
                          className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${ins.tag === t ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-secondary"}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <VoiceTextInput
                      category={ins.tag || "Market Insight"}
                      placeholder="market-related, competitor-related, scheme-related, etc."
                      value={ins.text}
                      onChange={(v) => update({ text: v })}
                      summary={ins.summary}
                      onSummaryChange={(v) => update({ summary: v })}
                    />
                  </div>
                );
              })}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setState({ ...state, insights: [...state.insights, newInsight()] })}
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Add another insight
              </Button>
            </div>
          </Q>

          <Q idx={3} title="Any comments or suggestions from the dealer" isOpen={openQ === 3} onToggle={() => setOpenQ(openQ === 3 ? null : 3)}>
            <div className="mt-3">
              <VoiceTextInput
                category="Dealer Feedback"
                placeholder="Capture dealer's feedback, suggestions, or requests..."
                value={state.feedbackText}
                onChange={(v) => setState({ ...state, feedbackText: v })}
                summary={state.feedbackSummary}
                onSummaryChange={(v) => setState({ ...state, feedbackSummary: v })}
              />
            </div>
          </Q>
        </div>

        <div className="bg-card border-t border-border p-3">
          <Button className="w-full" onClick={onGenerate}>
            <ClipboardList className="w-4 h-4 mr-1.5" /> Generate Visit Summary
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiagnozePopup;
