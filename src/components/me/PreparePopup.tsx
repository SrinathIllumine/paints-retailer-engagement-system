import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { open: boolean; onClose: () => void; onDone?: () => void };

const cards = [
  {
    n: 1,
    tag: "Long-term Relationship Building",
    title: "Potential Opportunities in your area identified by DGs",
    body: "i) Meeting Commitments made in the last meeting\nii) Introducing a new scheme",
  },
  {
    n: 2,
    tag: "BUSINESS BUILDING",
    title: "Potential Opportunities in your area identified by DGs",
    body: "For example: (i) JK WallMaxx is highly popular in Hinjewadi — there is already an existing demand, the retailer can capitalize on that. (ii) Suggest a better scheme than the competition.",
  },
  {
    n: 3,
    tag: "Operational",
    title: "Go with a Growth Suggestion",
    body: "i) Meeting Commitments made in the last meeting\nii) Introducing a new scheme",
  },
];

const PreparePopup = ({ open, onClose, onDone }: Props) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 shrink-0">
        <button onClick={onClose} className="p-1 -ml-1 text-muted-foreground hover:text-foreground" aria-label="Back">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.18em]">BEFORE</p>
          <h3 className="font-display font-bold text-foreground text-sm leading-tight mt-0.5 truncate">
            Preparation Points Before Meeting the Retailer
          </h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4 space-y-3">
          {cards.map((c) => (
            <div key={c.n} className="rounded-xl border border-info/20 bg-info/5 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {c.n}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{c.tag}</span>
              </div>
              <h4 className="font-display font-bold text-foreground text-sm">{c.title}</h4>
              <p className="text-sm text-foreground/80 leading-relaxed mt-1 whitespace-pre-line">{c.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border-t border-border p-3 shrink-0">
        <div className="max-w-2xl mx-auto">
          <Button className="w-full" onClick={() => { onDone?.(); onClose(); }}>✓ Mark as Done</Button>
        </div>
      </div>
    </div>
  );
};

export default PreparePopup;
