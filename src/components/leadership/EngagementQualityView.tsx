import { useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import indiaGeo from "@/data/geo/india-states.json";
import {
  getMarket,
  getStateDistricts,
  stateEngagement,
  STATE_DISTRICT_GEO,
  type MarketReport,
} from "@/data/leadershipReports";
import { geometryToPath, makeProjector, type GeoGeometry, type GeoBounds } from "@/lib/geoProjection";
import MarketPopup from "./MarketPopup";

const VIEW_W = 700;
const VIEW_H = 520;

// Real-world lon/lat extents (computed from the source GeoJSON), used to fit each map into the viewBox.
const INDIA_BOUNDS: GeoBounds = { minLon: 67.8, maxLon: 97.7, minLat: 6.5, maxLat: 37.3 };

const STATE_BOUNDS: Record<string, GeoBounds> = {
  Maharashtra: { minLon: 72.4, maxLon: 81.1, minLat: 15.4, maxLat: 22.3 },
  Gujarat: { minLon: 68.0, maxLon: 74.7, minLat: 19.9, maxLat: 24.9 },
  Rajasthan: { minLon: 69.3, maxLon: 78.5, minLat: 22.9, maxLat: 30.4 },
  Karnataka: { minLon: 73.9, maxLon: 78.8, minLat: 11.4, maxLat: 18.7 },
  "Tamil Nadu": { minLon: 76.0, maxLon: 80.6, minLat: 7.9, maxLat: 13.8 },
  "Uttar Pradesh": { minLon: 76.9, maxLon: 84.8, minLat: 23.7, maxLat: 30.6 },
  "Madhya Pradesh": { minLon: 73.8, maxLon: 83.0, minLat: 20.9, maxLat: 27.1 },
  "West Bengal": { minLon: 85.6, maxLon: 90.1, minLat: 21.3, maxLat: 27.4 },
  Telangana: { minLon: 77.0, maxLon: 81.5, minLat: 15.6, maxLat: 20.1 },
  Punjab: { minLon: 73.7, maxLon: 77.1, minLat: 29.3, maxLat: 32.7 },
  Bihar: { minLon: 83.1, maxLon: 88.5, minLat: 24.1, maxLat: 27.7 },
  Odisha: { minLon: 81.2, maxLon: 87.7, minLat: 17.6, maxLat: 22.8 },
};

const PALETTE = { green: "#1D9E75", orange: "#EF9F27", red: "#E24B4A", muted: "#E2E4E8" };

const scoreColor = (score: number) => (score >= 7 ? PALETTE.green : score >= 5 ? PALETTE.orange : PALETTE.red);

const engagementByState = new Map(stateEngagement.map((s) => [s.state, s]));

interface GeoFeature {
  type: "Feature";
  properties: Record<string, string>;
  geometry: GeoGeometry;
}

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <span className="inline-flex items-center gap-1.5">
    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: color }} />
    <span>{label}</span>
  </span>
);

const EngagementQualityView = () => {
  const [activeState, setActiveState] = useState<string | null>(null); // null = India view
  const [selectedMarket, setSelectedMarket] = useState<MarketReport | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string } | null>(null);

  const indiaPaths = useMemo(() => {
    const project = makeProjector(INDIA_BOUNDS, VIEW_W, VIEW_H);
    return (indiaGeo as { features: GeoFeature[] }).features.map((f) => ({
      key: f.properties.name,
      name: f.properties.name,
      d: geometryToPath(f.geometry, project),
    }));
  }, []);

  const districtPaths = useMemo(() => {
    if (!activeState) return [];
    const geo = STATE_DISTRICT_GEO[activeState];
    const bounds = STATE_BOUNDS[activeState];
    if (!geo || !bounds) return [];
    const project = makeProjector(bounds, VIEW_W, VIEW_H);
    return (geo.features as unknown as GeoFeature[]).map((f, i) => ({
      key: `${f.properties.district}-${i}`,
      name: f.properties.district,
      d: geometryToPath(f.geometry, project),
    }));
  }, [activeState]);

  const handleStateClick = (name: string) => {
    if (STATE_DISTRICT_GEO[name]) setActiveState(name);
  };

  const handleDistrictClick = (district: string) => {
    if (!activeState) return;
    const market = getMarket(activeState, district);
    if (market) setSelectedMarket(market);
  };

  const districtCount = activeState ? getStateDistricts(activeState).length : 0;

  return (
    <div className="space-y-4">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Engagement Quality</p>
        <h1 className="font-display text-2xl font-bold text-foreground">
          What is the engagement quality across markets in the country?
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {activeState
            ? `Click a district to view its market report. ${districtCount} districts shaded by engagement quality.`
            : "Click a shaded state to open its district-level view."}
        </p>
      </header>

      {activeState && (
        <button
          onClick={() => setActiveState(null)}
          className="inline-flex items-center gap-1 text-[12px] font-medium text-destructive hover:underline underline-offset-2"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back to India map
        </button>
      )}

      <div className="bg-card border rounded-lg p-4 relative">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="w-full h-auto"
          role="img"
          aria-label={activeState ? `${activeState} district engagement quality map` : "India engagement quality map"}
        >
          {!activeState
            ? indiaPaths.map((p) => {
                const s = engagementByState.get(p.name);
                const fill = s ? scoreColor(s.score) : PALETTE.muted;
                const clickable = !!s;
                return (
                  <path
                    key={p.key}
                    d={p.d}
                    fill={fill}
                    fillRule="evenodd"
                    stroke="#fff"
                    strokeWidth={0.6}
                    opacity={hovered === p.name && clickable ? 0.78 : 1}
                    onClick={() => handleStateClick(p.name)}
                    onMouseEnter={() => setHovered(p.name)}
                    onMouseMove={(e) => setTooltip({ x: e.clientX, y: e.clientY, label: p.name })}
                    onMouseLeave={() => {
                      setHovered(null);
                      setTooltip(null);
                    }}
                    style={{ cursor: clickable ? "pointer" : "default" }}
                  />
                );
              })
            : districtPaths.map((p) => {
                const market = getMarket(activeState, p.name);
                const fill = market ? scoreColor(market.engagementQuality) : PALETTE.muted;
                return (
                  <path
                    key={p.key}
                    d={p.d}
                    fill={fill}
                    fillRule="evenodd"
                    stroke="#fff"
                    strokeWidth={0.6}
                    opacity={hovered === p.key ? 0.78 : 1}
                    onClick={() => handleDistrictClick(p.name)}
                    onMouseEnter={() => setHovered(p.key)}
                    onMouseMove={(e) => setTooltip({ x: e.clientX, y: e.clientY, label: p.name })}
                    onMouseLeave={() => {
                      setHovered(null);
                      setTooltip(null);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                );
              })}
        </svg>
      </div>

      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none rounded-md bg-foreground text-background text-[11px] font-medium px-2 py-1 shadow-lg"
          style={{ left: tooltip.x + 14, top: tooltip.y + 14 }}
        >
          {tooltip.label}
        </div>
      )}

      <div className="flex items-center gap-4 text-[12px] text-muted-foreground flex-wrap">
        <LegendDot color={PALETTE.green} label="High engagement (7–10)" />
        <LegendDot color={PALETTE.orange} label="Moderate (5–6.9)" />
        <LegendDot color={PALETTE.red} label="Needs attention (below 5)" />
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
