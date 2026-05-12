import { useEffect, useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, Sparkles, Loader2, ChevronDown, MessageSquareWarning, Lightbulb, BookOpen, Mic, MicOff, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// ---------------- Static catalogues ----------------

export type ObjectionMatch = { label: string; bestPractices: string[] };

const OBJECTION_CATALOGUE: { label: string; keywords: string[]; bestPractices: string[] }[] = [
  {
    label: "Demand for premium products has slowed in this area.",
    keywords: ["premium", "slow", "demand", "high-end", "expensive", "costly"],
    bestPractices: [
      "Push mid-range / faster-moving SKUs first instead of forcing premium products immediately.",
      "Identify active premium-selling pockets nearby and understand what customer segment is still buying there.",
    ],
  },
  {
    label: "Demand from contractor / site activity is lower compared to last year.",
    keywords: ["contractor", "site", "activity", "project", "construction", "mason", "lower", "less"],
    bestPractices: [
      "Map active contractors / sites still operating in the area and reconnect them to the retailer.",
      "Focus on smaller renovation and repainting jobs instead of waiting for large project demand.",
    ],
  },
  {
    label: "Demand is coming down as people are delaying painting and renovation work.",
    keywords: ["delay", "delaying", "paint", "painting", "renovation", "repaint", "postpone", "waiting"],
    bestPractices: [
      "Position products around maintenance, waterproofing, and repair needs instead of full repainting.",
      "Encourage retailers to promote smaller pack sizes and budget-friendly combinations to restart buying.",
    ],
  },
];

const toMatch = (o: typeof OBJECTION_CATALOGUE[number]): ObjectionMatch => ({
  label: o.label,
  bestPractices: o.bestPractices,
});

const matchObjections = (text: string): ObjectionMatch[] => {
  const t = text.toLowerCase().trim();
  if (!t) return OBJECTION_CATALOGUE.map(toMatch);
  const scored = OBJECTION_CATALOGUE.map((o) => {
    const score = o.keywords.reduce((acc, kw) => acc + (t.includes(kw) ? 1 : 0), 0);
    return { o, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => toMatch(x.o));
  if (scored.length === 0) return OBJECTION_CATALOGUE.map(toMatch);
  return scored;
};

// ---------------- Static Q2 / Q3 content ----------------

export const BUSINESS_IDEAS = [
  "Trending in the area - many new construction sites are coming up. You may approach the site supervisors to share JK's multi-product portfolio - Putty, Paints & White Cement.",
  "A business growth session can be organized by JK team for your contractors - where they understand how their business can grow using JK's unique value proposition.",
];

export const NEARBY_DGS = [
  { name: "Ramesh Yadav", area: "Sector 14, Pune", phone: "+91 98100 12345" },
];

export const EDUCATION_POINTS = [
  "Promote the newly launched small-sized packs for repainting projects.",
  'Talk about the new "Painter Loyalty Scheme" launched by JK.',
];

// ---------------- State types ----------------

export type EngageState = {
  objections: { transcript: string; matches: ObjectionMatch[] };
  ideas: { selected: number[] };
  education: { selected: number[] };
};

export const newEngageState = (): EngageState => ({
  objections: { transcript: "", matches: [] },
  ideas: { selected: BUSINESS_IDEAS.map((_, i) => i) },
  education: { selected: EDUCATION_POINTS.map((_, i) => i) },
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
  title,
  icon: Icon,
  isOpen,
  onToggle,
}: {
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
      <span className="text-sm font-semibold text-foreground leading-snug">{title}</span>
    </span>
    <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
  </button>
);

const getSR = (): any => {
  if (typeof window === "undefined") return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
};

const EngagePopup = ({ open, onClose, state, setState, onComplete }: Props) => {
  const [openQ, setOpenQ] = useState<number>(1);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [matching, setMatching] = useState(false);
  const [error, setError] = useState("");

  const recRef = useRef<any>(null);
  const shouldListenRef = useRef(false);
  const baseTextRef = useRef("");

  const supportsVoice = !!getSR();

  const updateObjections = (patch: Partial<EngageState["objections"]>) =>
    setState({ ...state, objections: { ...state.objections, ...patch } });

  const runMatch = (text: string) => {
    setMatching(true);
    setTimeout(() => {
      const matches = matchObjections(text);
      updateObjections({ transcript: text, matches });
      setMatching(false);
    }, 400);
  };

  const isAndroid = typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);

  const buildRecognizer = (SR: any) => {
    const rec = new SR();
    rec.lang = "en-IN";
    // Android Chrome's continuous mode is unreliable — it drops audio, throws
    // "no-speech"/"network" errors, and often stops emitting results after a
    // brief pause. Use single-shot mode on Android and restart manually.
    rec.continuous = !isAndroid;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.onresult = (e: any) => {
      let interimChunk = "";
      let finalChunk = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        const t = r[0]?.transcript ?? "";
        if (r.isFinal) finalChunk += t + " ";
        else interimChunk += t;
      }
      if (finalChunk) {
        const merged = (baseTextRef.current + " " + finalChunk).replace(/\s+/g, " ").trim();
        baseTextRef.current = merged;
        updateObjections({ transcript: merged });
      }
      setInterim(interimChunk);
    };
    rec.onerror = (e: any) => {
      const code = e?.error;
      if (code === "not-allowed" || code === "service-not-allowed") {
        setError("Microphone permission blocked. Enable mic access in browser settings.");
        shouldListenRef.current = false;
      } else if (code === "audio-capture") {
        setError("No microphone detected.");
        shouldListenRef.current = false;
      } else if (code === "network") {
        // Transient on Android — let onend restart.
      } else if (code && code !== "no-speech" && code !== "aborted") {
        setError(`Mic: ${code}`);
      }
    };
    rec.onend = () => {
      if (shouldListenRef.current) {
        // Small delay helps Android Chrome avoid "InvalidStateError" loops.
        setTimeout(() => {
          if (!shouldListenRef.current) return;
          try {
            const SR2 = getSR();
            const next = buildRecognizer(SR2);
            recRef.current = next;
            next.start();
          } catch {
            shouldListenRef.current = false;
            setListening(false);
            setInterim("");
            runMatch(baseTextRef.current.trim());
          }
        }, isAndroid ? 250 : 0);
        return;
      }
      setListening(false);
      setInterim("");
      runMatch(baseTextRef.current.trim());
    };
    return rec;
  };

  const startListening = () => {
    const SR = getSR();
    if (!SR) {
      setError("Voice not supported in this browser.");
      return;
    }
    setError("");
    baseTextRef.current = state.objections.transcript.trim();
    shouldListenRef.current = true;
    try {
      const rec = buildRecognizer(SR);
      recRef.current = rec;
      rec.start();
      setListening(true);
    } catch {
      setListening(true);
    }
  };

  const stopListening = () => {
    shouldListenRef.current = false;
    try { recRef.current?.stop(); } catch {}
    setListening(false);
  };

  useEffect(() => () => {
    shouldListenRef.current = false;
    try { recRef.current?.stop(); } catch {}
  }, []);

  if (!open) return null;

  const toggle = (n: number) => setOpenQ(openQ === n ? 0 : n);

  const toggleSelection = (key: "ideas" | "education", idx: number) => {
    const cur = state[key].selected;
    const next = cur.includes(idx) ? cur.filter((x) => x !== idx) : [...cur, idx];
    setState({ ...state, [key]: { ...state[key], selected: next } } as EngageState);
  };

  const liveText = state.objections.transcript + (interim ? (state.objections.transcript ? " " : "") + interim : "");

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 shrink-0">
        <button onClick={onClose} className="p-1 -ml-1 text-muted-foreground hover:text-foreground" aria-label="Back">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.18em] text-xs font-light">DURING</p>
          <h3 className="font-display font-bold text-foreground text-sm leading-tight mt-0.5 truncate">
            Addressing Flashpoints
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-3 space-y-2">
          {/* Q1 — Voice only */}
          <section className="rounded-xl border border-border bg-card overflow-hidden">
            <QHeader icon={MessageSquareWarning} title="Would you like help to handle any retailer objections?" isOpen={openQ === 1} onToggle={() => toggle(1)} />
            {openQ === 1 && (
              <div className="px-3 pb-3 pt-1 border-t border-border/60 space-y-3">
                <div className="flex flex-col items-center justify-center py-3 gap-2.5">
                  <Button
                    type="button"
                    size="lg"
                    variant={listening ? "destructive" : "default"}
                    className="rounded-full h-16 w-16 p-0 shadow-md"
                    onClick={listening ? stopListening : startListening}
                    disabled={!supportsVoice}
                    aria-label={listening ? "Stop recording" : "Start recording"}
                  >
                    {listening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </Button>
                  {listening ? (
                    <p className="text-[11px] text-destructive flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                      Listening… tap to stop
                    </p>
                  ) : (
                    <p className="text-[11px] text-muted-foreground">
                      {state.objections.transcript ? "Tap mic to record again" : "Tap mic and describe the retailer's objection"}
                    </p>
                  )}
                  {!supportsVoice && (
                    <p className="text-[11px] text-destructive">Voice not supported in this browser.</p>
                  )}
                  {error && <p className="text-[11px] text-destructive">{error}</p>}
                </div>

                {liveText && (
                  <div className="rounded-lg border border-border bg-secondary/30 p-2.5">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Captured</p>
                    <p className="text-sm text-foreground/85 leading-relaxed">
                      {liveText}
                      {listening && interim && <span className="text-muted-foreground italic"> …</span>}
                    </p>
                  </div>
                )}

                {matching && (
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin" /> Matching objections…
                  </p>
                )}

                {!matching && state.objections.matches.length > 0 && (
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

                {!matching && state.objections.transcript && state.objections.matches.length === 0 && (
                  <p className="text-[11px] text-muted-foreground">No matching objections found in the catalogue.</p>
                )}
              </div>
            )}
          </section>

          {/* Q2 — static list */}
          <section className="rounded-xl border border-border bg-card overflow-hidden">
            <QHeader icon={Lightbulb} title="Propose new business building ideas" isOpen={openQ === 2} onToggle={() => toggle(2)} />
            {openQ === 2 && (
              <div className="px-3 pb-3 pt-1 border-t border-border/60 space-y-2">
                {BUSINESS_IDEAS.map((p, i) => (
                  <div key={i} className="rounded-lg border border-border p-2.5">
                    <div className="text-sm text-foreground/90 flex gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span className="flex-1">{p}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Q3 — static list */}
          <section className="rounded-xl border border-border bg-card overflow-hidden">
            <QHeader icon={BookOpen} title="Educate on new products and/or schemes" isOpen={openQ === 3} onToggle={() => toggle(3)} />
            {openQ === 3 && (
              <div className="px-3 pb-3 pt-1 border-t border-border/60 space-y-2">
                {EDUCATION_POINTS.map((p, i) => (
                  <div key={i} className="rounded-lg border border-border p-2.5 text-sm text-foreground/90 flex gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="flex-1">{p}</span>
                  </div>
                ))}
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
