import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { open: boolean; onClose: () => void; onDone?: () => void };

const cards = [
  {
    n: 1,
    tag: "Long-term Relationship Building",
    title: "Understand the Retailer's Concern for Sales Drop",
    body: "Is it due to demand, competition, pricing, or stock movement?",
  },
  {
    n: 2,
    tag: "Tactical",
    title: "Be Ready with Local Market Updates",
    body: "For example: (i) JK WallMaxx is highly popular in Hinjewadi — there is already an existing demand, the retailer can capitalize on that. (ii) Suggest a better scheme than the competition.",
  },
  {
    n: 3,
    tag: "Operational",
    title: "Go with a Growth Suggestion",
    body: "For example: If the retailer has lost some contractors to competition, suggest arranging a meeting with those contractors where you can present JK's value proposition.",
  },
];

const PreparePopup = ({ open, onClose, onDone }: Props) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="bg-card w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        <div className="sticky top-0 bg-card border-b border-border px-4 py-3 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.18em]">Prepare</p>
            <h3 className="font-display font-bold text-foreground text-sm leading-tight mt-0.5">
              Preparation Points Before Meeting the Retailer
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {cards.map((c) => (
            <div key={c.n} className="rounded-xl border border-info/20 bg-info/5 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {c.n}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{c.tag}</span>
              </div>
              <h4 className="font-display font-bold text-foreground text-sm">{c.title}</h4>
              <p className="text-sm text-foreground/80 leading-relaxed mt-1">{c.body}</p>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border p-3">
          <Button className="w-full" variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export default PreparePopup;
