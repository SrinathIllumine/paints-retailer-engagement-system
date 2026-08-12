import { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { ChevronLeft } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import indiaGeo from "@/data/geo/india-states.json";
import maharashtraGeo from "@/data/geo/maharashtra-districts.json";
import { getMarketByDistrict, stateEngagement, type MarketReport } from "@/data/leadershipReports";
import MarketPopup from "./MarketPopup";

const PALETTE = { green: "#1D9E75", orange: "#EF9F27", red: "#E24B4A", muted: "#E2E4E8" };

const scoreColor = (score: number) => (score >= 7 ? PALETTE.green : score >= 5 ? PALETTE.orange : PALETTE.red);

const engagementByState = new Map(stateEngagement.map((s) => [s.state, s]));

const geographyStyle = (fill: string, clickable: boolean) => ({
  default: { fill, stroke: "#fff", strokeWidth: 0.6, outline: "none", cursor: clickable ? "pointer" : "default" },
  hover: { fill, opacity: clickable ? 0.78 : 1, stroke: "#fff", strokeWidth: 0.6, outline: "none", cursor: clickable ? "pointer" : "default" },
  pressed: { fill, opacity: 0.65, stroke: "#fff", strokeWidth: 0.6, outline: "none" },
});

const stateMarket = (name: string): MarketReport | null => {
  const s = engagementByState.get(name);
  if (!s) return null;
  return {
    district: name,
    market: `${name} — State Overview`,
    tradingAreaPotentialCr: Math.round(s.totalRetailers / 100),
    salesRsLakh: Math.round(s.retailersEngaged / 80),
    commonObjections: [
      "Retailers want simpler, faster-paying scheme structures",
      "Competitor brands are more active with in-shop schemes here",
    ],
    engagementQuality: s.score,
    retailerSuggestions:
      s.score >= 7
        ? `${name} is tracking well above the national average — replicate this state's ME cadence and display support in lagging markets.`
        : `${name}'s engagement quality trails the national average. A focused ME activation push and simpler scheme communication would help close the gap.`,
  };
};

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <span className="inline-flex items-center gap-1.5">
    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: color }} />
    <span>{label}</span>
  </span>
);

const EngagementQualityView = () => {
  const [view, setView] = useState<"india" | "maharashtra">("india");
  const [selectedMarket, setSelectedMarket] = useState<MarketReport | null>(null);

  const handleStateClick = (name: string) => {
    if (name === "Maharashtra") {
      setView("maharashtra");
      return;
    }
    const market = stateMarket(name);
    if (market) setSelectedMarket(market);
  };

  const handleDistrictClick = (district: string) => {
    const market = getMarketByDistrict(district);
    if (market) setSelectedMarket(market);
  };

  const highlightedDistrict = useMemo(() => "Pune", []);

  return (
    <div className="space-y-4">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Engagement Quality</p>
        <h1 className="font-display text-2xl font-bold text-foreground">
          What is the engagement quality across markets in the country?
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {view === "india"
            ? "Click a shaded state to see its market breakdown. Maharashtra opens a district-level view."
            : "Click a district to view its market report. Districts are shaded by engagement quality."}
        </p>
      </header>

      {view === "maharashtra" && (
        <button
          onClick={() => setView("india")}
          className="inline-flex items-center gap-1 text-[12px] font-medium text-destructive hover:underline underline-offset-2"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back to India map
        </button>
      )}

      <div className="bg-card border rounded-lg p-4">
        {view === "india" ? (
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 950, center: [82, 22.5] }}
            width={700}
            height={520}
            style={{ width: "100%", height: "auto" }}
          >
            <Geographies geography={indiaGeo}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const name: string = geo.properties.name;
                  const s = engagementByState.get(name);
                  const fill = s ? scoreColor(s.score) : PALETTE.muted;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => handleStateClick(name)}
                      style={geographyStyle(fill, !!s)}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        ) : (
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 4200, center: [76.6, 19.0] }}
            width={700}
            height={520}
            style={{ width: "100%", height: "auto" }}
          >
            <Geographies geography={maharashtraGeo}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const district: string = geo.properties.district;
                  const market = getMarketByDistrict(district);
                  const fill = market ? scoreColor(market.engagementQuality) : PALETTE.muted;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => handleDistrictClick(district)}
                      style={geographyStyle(fill, !!market)}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        )}
      </div>

      <div className="flex items-center gap-4 text-[12px] text-muted-foreground flex-wrap">
        <LegendDot color={PALETTE.green} label="High engagement (7–10)" />
        <LegendDot color={PALETTE.orange} label="Moderate (5–6.9)" />
        <LegendDot color={PALETTE.red} label="Needs attention (below 5)" />
        {view === "maharashtra" && (
          <span className="ml-auto text-[11px]">
            e.g. {highlightedDistrict} → {getMarketByDistrict(highlightedDistrict)?.market} · click to view
          </span>
        )}
      </div>

      <Dialog open={!!selectedMarket} onOpenChange={(open) => !open && setSelectedMarket(null)}>
        <DialogContent className="max-w-lg bg-card text-foreground border-border p-0 overflow-hidden">
          {selectedMarket && <MarketPopup market={selectedMarket} onBack={() => setSelectedMarket(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EngagementQualityView;
