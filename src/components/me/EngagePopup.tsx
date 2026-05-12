import { useState } from "react";
import { X, ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export type EngageState = {
  objections: string[];
  actionPoints: string[];
};

export const OBJECTIONS = [
  {
    id: "no-demand",
    label: "No demand in the area",
    sub: "Customers are not asking for JK like before.",
    practices: [
      "Meet painters/contractors in the locality to create pull demand.",
      "Restart momentum through familiar fast-moving SKUs before expanding back into the full range.",
    ],
  },
  {
    id: "preference-shift",
    label: "Painter/Contractor Preference Shift",
    sub: "Painters are recommending other brands now.",
    practices: [
      "Offer a joint visit with a JK technical expert to rebuild painter confidence.",
      "Share recent project success stories from nearby localities where JK was used.",
    ],
  },
  {
    id: "weak-support",
    label: "Weak Company Support",
    sub: "I'm not seeing enough visits, visibility, or local activation support.",
    practices: [
      "Commit to a fixed visit cadence (e.g., every 10 days) and record it.",
      "Propose a visibility improvement — standee, display, or window branding — at the retailer's outlet.",
    ],
  },
  {
    id: "pricing",
    label: "Pricing Not Competitive",
    sub: "Other brands are offering better margins or schemes.",
    practices: [
      "Highlight the value proposition — durability, coverage, and brand pull vs. just price.",
      "Explore if a scheme bundle or combo offer can be proposed through your ASM.",
    ],
  },
  {
    id: "stock",
    label: "Stock/Supply Issues",
    sub: "JK products are not always available when I need them.",
    practices: [
      "Raise the issue with your distributor and give the retailer a committed restock date.",
      "Suggest maintaining a small buffer stock of fast-moving SKUs.",
    ],
  },
];

export const ACTION_POINTS = [
  "Meet key painters/contractors within the next 7 days to generate demand.",
  "Review sales movement together after 2 weeks.",
];

type Props = {
  open: boolean;
  onClose: () => void;
  state: EngageState;
  setState: (s: EngageState) => void;
  onComplete: () => void;
};

const EngagePopup = ({ open, onClose, state, setState, onComplete }: Props) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  if (!open) return null;

  const toggleObj = (id: string) => {
    const next = state.objections.includes(id)
      ? state.objections.filter((x) => x !== id)
      : [...state.objections, id];
    setState({ ...state, objections: next });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="bg-card w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between rounded-t-2xl">
          <div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.18em]">DURING</p>
            <h3 className="font-display font-bold text-foreground text-sm leading-tight mt-0.5">
              Addressing Flashpoints
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-5 flex-1">
          {/* Section A */}
          <section className="space-y-2">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              WHAT IS THE FLASHPOINT YOU ARE FACING WITH THE RETAILER?
            </h4>
            <div className="space-y-2 mt-4">
              {OBJECTIONS.map((o) => {
                const checked = state.objections.includes(o.id);
                const isOpen = expanded[o.id];
                return (
                  <div key={o.id} className={`rounded-xl border p-3 transition-colors ${checked ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}>
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <Checkbox checked={checked} onCheckedChange={() => toggleObj(o.id)} className="mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{o.label}</p>
                        <p className="text-xs text-muted-foreground italic mt-0.5">"{o.sub}"</p>
                      </div>
                    </label>
                    {checked && (
                      <div className="mt-2 pt-2 border-t border-border/60">
                        <button
                          type="button"
                          onClick={() => setExpanded((e) => ({ ...e, [o.id]: !e[o.id] }))}
                          className="flex items-center gap-1 text-xs font-semibold text-info"
                        >
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                          Best Practices
                        </button>
                        {isOpen && (
                          <ol className="mt-2 space-y-1.5 pl-1">
                            {o.practices.map((p, i) => (
                              <li key={i} className="text-xs text-foreground/85 flex gap-2">
                                <span className="text-info font-semibold shrink-0">{i === 0 ? "i)" : "ii)"}</span>
                                <span>{p}</span>
                              </li>
                            ))}
                          </ol>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="bg-card border-t border-border p-3">
          <Button className="w-full" onClick={onComplete}>
            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Complete Engagement Session
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EngagePopup;
