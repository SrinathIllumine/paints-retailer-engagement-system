import { useState } from "react";
import { ArrowLeft, CheckCircle2, Sparkles, Loader2, MessageSquareWarning, Lightbulb, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import VoiceTextInput from "@/components/me/VoiceTextInput";

export type EngageSection = {
  text: string;
  summary: string;
  suggestions: string[];
};

export type EngageState = {
  objections: EngageSection;
  ideas: EngageSection;
  education: EngageSection;
};

export const newEngageSection = (): EngageSection => ({ text: "", summary: "", suggestions: [] });

export const newEngageState = (): EngageState => ({
  objections: newEngageSection(),
  ideas: newEngageSection(),
  education: newEngageSection(),
});

type Props = {
  open: boolean;
  onClose: () => void;
  state: EngageState;
  setState: (s: EngageState) => void;
  onComplete: () => void;
};

// ----- Mock suggestion generator (deterministic, keyword-based) -----
const STOP = new Set(["the","a","an","is","are","was","were","of","to","in","on","for","and","or","but","with","as","at","by","from","that","this","it","i","you","he","she","we","they","them","my","our","your","their","so","not","no","yes","do","does","did","have","has","had","will","would","can","could","should","about","into","over"]);

const keywords = (text: string, n = 5) => {
  const freq = new Map<string, number>();
  (text.toLowerCase().match(/[a-z0-9₹%]+/g) || []).forEach((w) => {
    if (STOP.has(w) || w.length <= 2) return;
    freq.set(w, (freq.get(w) || 0) + 1);
  });
  return [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([w]) => w);
};

type SectionKind = "objections" | "ideas" | "education";

const generateSuggestions = (kind: SectionKind, text: string): string[] => {
  const t = text.toLowerCase();
  const kw = keywords(text, 4);
  const focus = kw[0] || "this point";

  if (kind === "objections") {
    const out: string[] = [];
    if (/(margin|price|cheap|costly|expensive|discount)/.test(t))
      out.push("Reframe price into total value: durability, coverage per bag, and pull-through demand vs. cheaper alternatives.");
    if (/(stock|supply|deliver|availab|shortage)/.test(t))
      out.push("Commit to a restock window with the distributor and share a written ETA on the spot to rebuild trust.");
    if (/(painter|contractor|mason|influenc)/.test(t))
      out.push("Offer a joint visit with a JK technical expert to 2 key painters/contractors this fortnight.");
    if (/(scheme|offer|competitor|brand)/.test(t))
      out.push("Position the running JK scheme bundle alongside a nearby success story to neutralise the competitor pitch.");
    while (out.length < 3) out.push(`Acknowledge the concern around "${focus}", then propose one concrete next step before leaving the counter.`);
    return out.slice(0, 3);
  }

  if (kind === "ideas") {
    const out: string[] = [];
    if (/(display|visibility|standee|board|branding)/.test(t))
      out.push("Propose an in-shop visibility refresh — counter standee + window branding — co-funded under the visibility scheme.");
    if (/(painter|contractor|meet|event)/.test(t))
      out.push("Plan a 10-painter meet at the retailer's outlet next month with a JK technical demo.");
    if (/(new|launch|product|wallmaxx|putty|paint|cement)/.test(t))
      out.push("Pilot a single fast-moving new SKU as a 'starter pack' to test demand without full inventory risk.");
    if (/(area|locality|society|project|builder)/.test(t))
      out.push("Map 2 nearby active projects/societies and route those buyers through this retailer with a referral tag.");
    while (out.length < 3) out.push(`Build a 30-day micro-plan around "${focus}" with one measurable weekly checkpoint.`);
    return out.slice(0, 3);
  }

  // education
  const out: string[] = [];
  if (/(scheme|slab|target|incentive|bonus)/.test(t))
    out.push("Walk through the slab maths on a single bag — show exact ₹/bag earned at each volume tier.");
  if (/(wallmaxx|putty|paint|primer|water.?proof)/.test(t))
    out.push("Demo the product feature live (water-mix, coverage, finish) — 2 minutes beats a brochure.");
  if (/(margin|price|mrp|landing)/.test(t))
    out.push("Share the latest price circular and highlight where the new SKU sits vs. the retailer's current best-seller.");
  if (/(competitor|other.?brand|rival)/.test(t))
    out.push("Frame JK's edge in one sentence the retailer can repeat to a customer the next day.");
  while (out.length < 3) out.push(`Leave a one-pager on "${focus}" and confirm the retailer can pitch it back in their own words.`);
  return out.slice(0, 3);
};

// ----- Section card -----
const SECTIONS: { key: SectionKind; icon: any; tag: string; title: string; placeholder: string; label: string; category: string }[] = [
  {
    key: "objections",
    icon: MessageSquareWarning,
    tag: "Section 1",
    title: "Would you like help to handle any retailer objections?",
    placeholder: "e.g. Retailer says JK margins are lower than competition…",
    label: "Type your objections",
    category: "Objection",
  },
  {
    key: "ideas",
    icon: Lightbulb,
    tag: "Section 2",
    title: "Propose new business building ideas",
    placeholder: "e.g. Joint contractor meet, in-shop display refresh…",
    label: "Type business ideas",
    category: "Business Idea",
  },
  {
    key: "education",
    icon: BookOpen,
    tag: "Section 3",
    title: "Educate on new products and/or schemes",
    placeholder: "e.g. New WallMaxx scheme, updated PPC pricing…",
    label: "Type education notes",
    category: "Product / Scheme",
  },
];

const EngagePopup = ({ open, onClose, state, setState, onComplete }: Props) => {
  const [busy, setBusy] = useState<SectionKind | null>(null);
  if (!open) return null;

  const update = (key: SectionKind, patch: Partial<EngageSection>) => {
    setState({ ...state, [key]: { ...state[key], ...patch } });
  };

  const runSuggest = (key: SectionKind) => {
    const txt = state[key].text.trim();
    if (!txt) return;
    setBusy(key);
    setTimeout(() => {
      update(key, { suggestions: generateSuggestions(key, txt) });
      setBusy(null);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 shrink-0">
        <button onClick={onClose} className="p-1 -ml-1 text-muted-foreground hover:text-foreground" aria-label="Back">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.18em]">DURING</p>
          <h3 className="font-display font-bold text-foreground text-sm leading-tight mt-0.5 truncate">
            Addressing Flashpoints
          </h3>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4 space-y-4">
          {SECTIONS.map((sec) => {
            const data = state[sec.key];
            const Icon = sec.icon;
            const loading = busy === sec.key;
            return (
              <section key={sec.key} className="rounded-2xl border border-border bg-card p-4 space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.18em]">{sec.tag}</p>
                    <h4 className="font-display font-bold text-foreground text-sm leading-snug mt-0.5">{sec.title}</h4>
                  </div>
                </div>

                <VoiceTextInput
                  category={sec.category}
                  placeholder={sec.placeholder}
                  label={sec.label}
                  value={data.text}
                  onChange={(v) => update(sec.key, { text: v })}
                  summary={data.summary}
                  onSummaryChange={(v) => update(sec.key, { summary: v })}
                />

                <div>
                  <Button
                    type="button"
                    size="sm"
                    variant="default"
                    disabled={!data.text.trim() || loading}
                    onClick={() => runSuggest(sec.key)}
                  >
                    {loading ? (
                      <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Thinking…</>
                    ) : (
                      <><Sparkles className="w-3.5 h-3.5 mr-1.5" />{data.suggestions.length ? "Refresh suggestions" : "Get suggestions"}</>
                    )}
                  </Button>
                  {!data.text.trim() && (
                    <p className="text-[11px] text-muted-foreground mt-1.5">Add a note above to unlock suggestions.</p>
                  )}
                </div>

                {data.suggestions.length > 0 && (
                  <div className="rounded-xl border border-info/20 bg-info/5 p-3">
                    <p className="text-[11px] font-semibold text-info uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI Suggestions
                    </p>
                    <ol className="space-y-1.5">
                      {data.suggestions.map((s, i) => (
                        <li key={i} className="text-sm text-foreground/85 flex gap-2">
                          <span className="text-info font-semibold shrink-0">{i + 1}.</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-card border-t border-border p-3 shrink-0">
        <div className="max-w-2xl mx-auto">
          <Button className="w-full" onClick={onComplete}>
            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Complete Engagement Session
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EngagePopup;
