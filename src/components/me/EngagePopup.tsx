import { useState } from "react";
import { ArrowLeft, CheckCircle2, Sparkles, Loader2, ChevronDown, MessageSquareWarning, Lightbulb, BookOpen, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import VoiceTextInput from "@/components/me/VoiceTextInput";

// ---------------- Static catalogues ----------------

export type ObjectionMatch = { label: string; bestPractices: string[] };

const OBJECTION_CATALOGUE: { label: string; keywords: string[]; bestPractices: string[] }[] = [
  {
    label: "Margin / Price too low vs competition",
    keywords: ["margin", "price", "cheap", "costly", "expensive", "discount", "rate", "mrp", "landing"],
    bestPractices: [
      "Reframe price into total value: durability, coverage per bag, and pull-through demand.",
      "Show the per-bag earning at the next slab to make the upside concrete.",
      "Bundle a running visibility/scheme incentive to close the perceived gap.",
    ],
  },
  {
    label: "Stock / Supply / Delivery issue",
    keywords: ["stock", "supply", "deliver", "delivery", "availab", "shortage", "delay", "late"],
    bestPractices: [
      "Commit a written restock ETA on the spot with the distributor's confirmation.",
      "Offer a smaller buffer order to bridge until the next dispatch.",
      "Share the depot contact for direct status checks to rebuild trust.",
    ],
  },
  {
    label: "Painter / Contractor prefers competitor",
    keywords: ["painter", "contractor", "mason", "influenc", "applicator"],
    bestPractices: [
      "Plan a joint visit with a JK technical expert to 2 key painters this fortnight.",
      "Offer a painter meet at the retailer's outlet with a live product demo.",
      "Enrol top painters into the Painter Loyalty Scheme on the same day.",
    ],
  },
  {
    label: "Competitor scheme is stronger",
    keywords: ["scheme", "offer", "competitor", "rival", "other brand", "otherbrand"],
    bestPractices: [
      "Position the running JK scheme bundle vs. the competitor's net landing.",
      "Highlight a nearby retailer success story to neutralise the pitch.",
      "Confirm the scheme validity window so the retailer can plan inventory.",
    ],
  },
  {
    label: "Quality / Packaging concern",
    keywords: ["quality", "packaging", "bag", "torn", "monsoon", "leak", "broken"],
    bestPractices: [
      "Acknowledge, log a quality ticket on the spot, and share the reference number.",
      "Offer replacement of damaged bags from the next dispatch.",
      "Walk through the new packaging spec / batch improvements briefly.",
    ],
  },
];

const matchObjections = (text: string): ObjectionMatch[] => {
  const t = text.toLowerCase();
  if (!t.trim()) return [];
  const scored = OBJECTION_CATALOGUE.map((o) => {
    const score = o.keywords.reduce((acc, kw) => acc + (t.includes(kw) ? 1 : 0), 0);
    return { o, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((x) => ({ label: x.o.label, bestPractices: x.o.bestPractices }));
  return scored;
};

// ---------------- Static Q2 / Q3 content ----------------

export const BUSINESS_IDEAS = [
  "Track the new construction sites and approach their site supervisors.",
  "Expand your contractor base by getting in touch with JK's DGs.",
];

export const NEARBY_DGS = [
  { name: "Ramesh Yadav", area: "Sector 14, Gurgaon", phone: "+91 98100 12345" },
  { name: "", area: "Sector 14, Pune\n·\n+91 98100 12345", phone: "" },
  { name: "Vikas Sharma", area: "DLF Phase 3", phone: "+91 98103 55512" },
];

export const EDUCATION_POINTS = [
  "Promote the newly launched small-sized packs for repainting projects.",
  'Talk about the new "Painter Loyalty Scheme" launched by JK.',
];

// ---------------- State types ----------------

export type EngageState = {
  objections: { text: string; summary: string; matches: ObjectionMatch[] };
  ideas: { points: string[]; dgDetails: typeof NEARBY_DGS };
  education: { points: string[] };
};

export const newEngageState = (): EngageState => ({
  objections: { text: "", summary: "", matches: [] },
  ideas: { points: BUSINESS_IDEAS, dgDetails: NEARBY_DGS },
  education: { points: EDUCATION_POINTS },
});

type Props = {
  open: boolean;
  onClose: () => void;
  state: EngageState;
  setState: (s: EngageState) => void;
  onComplete: () => void;
};

// ---------------- UI ----------------

const QHeader = ({
  idx,
  title,
  icon: Icon,
  isOpen,
  onToggle,
}: {
  idx: number;
  title: string;
  icon: any;
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <button
    type="button"
    onClick={onToggle}
    className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left"
  >
    <span className="flex items-start gap-2 min-w-0">
      <Icon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
      <span className="text-sm font-semibold text-foreground leading-snug">
        <span className="text-primary mr-1">Q{idx}.</span>
        {title}
      </span>
    </span>
    <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
  </button>
);

const EngagePopup = ({ open, onClose, state, setState, onComplete }: Props) => {
  const [openQ, setOpenQ] = useState<number>(1);
  const [busy, setBusy] = useState(false);
  if (!open) return null;

  const updateObjections = (patch: Partial<EngageState["objections"]>) =>
    setState({ ...state, objections: { ...state.objections, ...patch } });

  const runMatch = () => {
    const txt = state.objections.text.trim();
    if (!txt) return;
    setBusy(true);
    setTimeout(() => {
      updateObjections({ matches: matchObjections(txt) });
      setBusy(false);
    }, 400);
  };

  const toggle = (n: number) => setOpenQ(openQ === n ? 0 : n);

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

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-3 space-y-2">
          {/* Q1 */}
          <section className="rounded-xl border border-border bg-card overflow-hidden">
            <QHeader idx={1} icon={MessageSquareWarning} title="Would you like help to handle any retailer objections?" isOpen={openQ === 1} onToggle={() => toggle(1)} />
            {openQ === 1 && (
              <div className="px-3 pb-3 pt-1 border-t border-border/60 space-y-3">
                <VoiceTextInput
                  category="Objection"
                  placeholder="e.g. Retailer says JK margins are lower than competition…"
                  label="Type your objections"
                  value={state.objections.text}
                  onChange={(v) => updateObjections({ text: v })}
                  summary={state.objections.summary}
                  onSummaryChange={(v) => updateObjections({ summary: v })}
                />

                <div>
                  <Button
                    type="button"
                    size="sm"
                    variant="default"
                    disabled={!state.objections.text.trim() || busy}
                    onClick={runMatch}
                  >
                    {busy ? (
                      <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Matching…</>
                    ) : (
                      <><Sparkles className="w-3.5 h-3.5 mr-1.5" />{state.objections.matches.length ? "Re-match objections" : "Match & suggest best practices"}</>
                    )}
                  </Button>
                </div>

                {state.objections.matches.length > 0 && (
                  <div className="space-y-2">
                    {state.objections.matches.map((m, i) => (
                      <div key={i} className="rounded-lg border border-info/20 bg-info/5 p-3">
                        <p className="text-[11px] font-semibold text-info uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Matched Objection
                        </p>
                        <p className="text-sm font-semibold text-foreground mb-1.5">{m.label}</p>
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Best practices</p>
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
              </div>
            )}
          </section>

          {/* Q2 */}
          <section className="rounded-xl border border-border bg-card overflow-hidden">
            <QHeader idx={2} icon={Lightbulb} title="Propose new business building ideas" isOpen={openQ === 2} onToggle={() => toggle(2)} />
            {openQ === 2 && (
              <div className="px-3 pb-3 pt-1 border-t border-border/60 space-y-3">
                <ul className="space-y-2">
                  {BUSINESS_IDEAS.map((p, i) => (
                    <li key={i} className="text-sm text-foreground/90 flex gap-2">
                      <span className="text-primary font-semibold shrink-0">{i + 1}.</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <div className="rounded-lg border border-border bg-secondary/30 p-2.5">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Nearby Demand Generators (DGs)</p>
                  <ul className="space-y-2">
                    {NEARBY_DGS.map((dg, i) => (
                      <li key={i} className="text-sm">
                        <p className="font-semibold text-foreground">{dg.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {dg.area}
                          <span className="mx-1">·</span>
                          <Phone className="w-3 h-3" /> {dg.phone}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </section>

          {/* Q3 */}
          <section className="rounded-xl border border-border bg-card overflow-hidden">
            <QHeader idx={3} icon={BookOpen} title="Educate on new products and/or schemes" isOpen={openQ === 3} onToggle={() => toggle(3)} />
            {openQ === 3 && (
              <div className="px-3 pb-3 pt-1 border-t border-border/60">
                <ul className="space-y-2">
                  {EDUCATION_POINTS.map((p, i) => (
                    <li key={i} className="text-sm text-foreground/90 flex gap-2">
                      <span className="text-primary font-semibold shrink-0">{i + 1}.</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
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
