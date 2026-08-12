import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { MarketReport } from "@/data/leadershipReports";

const PALETTE = {
  green: { bar: "#1D9E75", bg: "#E1F5EE", text: "#085041" },
  orange: { bar: "#BA7517", bg: "#FAEEDA", text: "#412402" },
  red: { bar: "#E24B4A", bg: "#FCEBEB", text: "#501313" },
};

const qualityTone = (q: number) => (q >= 7 ? PALETTE.green : q >= 5 ? PALETTE.orange : PALETTE.red);

interface Props {
  market: MarketReport;
  onBack: () => void;
}

const MarketPopup = ({ market, onBack }: Props) => {
  const tone = qualityTone(market.engagementQuality);

  return (
    <div className="p-6">
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold text-foreground">{market.market}</DialogTitle>
      </DialogHeader>

      <div className="mt-4 space-y-4">
        <div className="rounded-lg bg-muted/40 p-3">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium mb-1.5">Key Market Insight</p>
          <p className="text-[13px] text-foreground leading-relaxed">
            Trading area potential (as mapped by DGs): <span className="font-semibold">₹{market.tradingAreaPotentialCr} crores</span>
          </p>
          <p className="text-[13px] text-foreground leading-relaxed">
            Sales for us from this market: <span className="font-semibold">₹{market.salesRsLakh} lakhs</span>
          </p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium mb-1.5">Common Objections</p>
          <ul className="space-y-1">
            {market.commonObjections.map((o, i) => (
              <li key={i} className="text-[13px] text-foreground leading-snug flex gap-2">
                <span className="text-muted-foreground shrink-0">–</span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg p-3" style={{ background: tone.bg }}>
          <p className="text-[11px] uppercase tracking-wide font-medium mb-1" style={{ color: tone.text }}>
            Overall Engagement Quality in the market
          </p>
          <p className="text-2xl font-bold" style={{ color: tone.bar }}>
            {market.engagementQuality.toFixed(1)}/10
          </p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium mb-1.5">
            Retailer suggestions / comments (common across the market)
          </p>
          <p className="text-[13px] text-muted-foreground italic leading-relaxed">{market.retailerSuggestions}</p>
        </div>

        <div className="flex justify-end pt-1">
          <button onClick={onBack} className="text-[12px] font-medium text-destructive hover:underline underline-offset-2">
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketPopup;
