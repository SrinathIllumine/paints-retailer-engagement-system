import { useState } from "react";
import { X, ChevronDown, ClipboardList, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import VoiceTextInput from "@/components/me/VoiceTextInput";

export const PREPARE_POINTS = [
  "Understand the Retailer's Concern for Sales Drop",
  "Be Ready with Local Market Updates",
  "Go with a Growth Suggestion",
  "None — dealer was not receptive",
];

const INSIGHT_TAGS = ["Demand-related", "Competitor-related", "Scheme-related"];

export type DiagnozeState = {
  topicsCovered: string[];
  insightTag: string;
  insightText: string;
  insightSummary: string;
  feedbackText: string;
  feedbackSummary: string;
};

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
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="bg-card w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between rounded-t-2xl">
          <div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.18em]">Diagnoze</p>
            <h3 className="font-display font-bold text-foreground text-sm leading-tight mt-0.5">
              Post Meeting With The Retailer
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-3 flex-1">
          <Q idx={1} title="Which of the points were you able to cover?" isOpen={openQ === 1} onToggle={() => setOpenQ(openQ === 1 ? null : 1)}>
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
            </div>
          </Q>

          <Q idx={2} title="Record new market insights" isOpen={openQ === 2} onToggle={() => setOpenQ(openQ === 2 ? null : 2)}>
            <div className="mt-3 space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {INSIGHT_TAGS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setState({ ...state, insightTag: state.insightTag === t ? "" : t })}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${state.insightTag === t ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-secondary"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <VoiceTextInput
                category={state.insightTag || "Market Insight"}
                placeholder="market-related, competitor-related, scheme-related, etc."
                value={state.insightText}
                onChange={(v) => setState({ ...state, insightText: v })}
                summary={state.insightSummary}
                onSummaryChange={(v) => setState({ ...state, insightSummary: v })}
              />
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
