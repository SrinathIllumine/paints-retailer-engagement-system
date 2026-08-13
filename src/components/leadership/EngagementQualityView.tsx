import { useMemo, useState } from "react";
import { ChevronLeft, Search, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import indiaGeo from "@/data/geo/india-states.json";
import {
  getMarket,
  getStateDistricts,
  stateEngagement,
  STATE_DISTRICT_GEO,
  type MarketReport,
} from "@/data/leadershipReports";
import {
  geometryToPath,
  geometryLabelPlacement,
  makeProjector,
  wrapLabel,
  type GeoGeometry,
  type GeoBounds,
} from "@/lib/geoProjection";
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
  "Andaman & Nicobar": { minLon: 92.0, maxLon: 94.5, minLat: 6.5, maxLat: 13.9 },
  "Andhra Pradesh": { minLon: 76.6, maxLon: 85.0, minLat: 12.4, maxLat: 19.4 },
  "Arunachal Pradesh": { minLon: 91.4, maxLon: 97.6, minLat: 26.5, maxLat: 29.7 },
  Assam: { minLon: 89.5, maxLon: 96.2, minLat: 24.0, maxLat: 28.2 },
  Chandigarh: { minLon: 76.6, maxLon: 76.95, minLat: 30.6, maxLat: 30.9 },
  Chhattisgarh: { minLon: 80.1, maxLon: 84.6, minLat: 17.6, maxLat: 24.3 },
  "Dadra & Nagar Haveli": { minLon: 70.7, maxLon: 73.4, minLat: 19.9, maxLat: 20.9 },
  "Daman & Diu": { minLon: 70.7, maxLon: 73.4, minLat: 19.9, maxLat: 20.9 },
  Delhi: { minLon: 76.7, maxLon: 77.5, minLat: 28.3, maxLat: 29.0 },
  Goa: { minLon: 73.5, maxLon: 74.5, minLat: 14.7, maxLat: 16.0 },
  Haryana: { minLon: 74.3, maxLon: 77.75, minLat: 27.5, maxLat: 31.1 },
  "Himachal Pradesh": { minLon: 75.4, maxLon: 79.2, minLat: 30.2, maxLat: 33.4 },
  "Jammu & Kashmir": { minLon: 73.2, maxLon: 77.0, minLat: 32.1, maxLat: 35.3 },
  Jharkhand: { minLon: 83.1, maxLon: 88.2, minLat: 21.8, maxLat: 25.5 },
  Kerala: { minLon: 74.7, maxLon: 77.6, minLat: 8.1, maxLat: 13.0 },
  Ladakh: { minLon: 72.3, maxLon: 80.6, minLat: 32.1, maxLat: 37.3 },
  Lakshadweep: { minLon: 72.0, maxLon: 73.9, minLat: 8.1, maxLat: 11.9 },
  Manipur: { minLon: 92.8, maxLon: 94.9, minLat: 23.6, maxLat: 25.9 },
  Meghalaya: { minLon: 89.65, maxLon: 93.0, minLat: 24.85, maxLat: 26.3 },
  Mizoram: { minLon: 92.1, maxLon: 93.6, minLat: 21.7, maxLat: 24.7 },
  Nagaland: { minLon: 93.15, maxLon: 95.4, minLat: 25.0, maxLat: 27.2 },
  Puducherry: { minLon: 75.3, maxLon: 82.5, minLat: 10.6, maxLat: 17.0 },
  Sikkim: { minLon: 87.85, maxLon: 89.1, minLat: 26.9, maxLat: 28.3 },
  Tripura: { minLon: 91.0, maxLon: 92.5, minLat: 22.75, maxLat: 24.7 },
  Uttarakhand: { minLon: 77.4, maxLon: 81.2, minLat: 28.55, maxLat: 31.6 },
};

const PALETTE = { green: "#1D9E75", orange: "#EF9F27", red: "#E24B4A", muted: "#E2E4E8" };

const scoreColor = (score: number) => (score >= 7 ? PALETTE.green : score >= 5 ? PALETTE.orange : PALETTE.red);

const engagementByState = new Map(stateEngagement.map((s) => [s.state, s]));

// A single fixed font size per view keeps every label visually consistent —
// deliberately not scaled per-region, so a tiny UT and a huge state read the same.
const STATE_LABEL_FONT = 7.5;
const DISTRICT_LABEL_FONT = 6.5;
const LABEL_MAX_LINES = 3;

interface GeoFeature {
  type: "Feature";
  properties: Record<string, string>;
  geometry: GeoGeometry;
}

interface MapPath {
  key: string;
  name: string;
  d: string;
  labelX: number;
  labelY: number;
  fontSize: number;
  lines: string[];
  fill: string;
  clickable: boolean;
}

const buildPaths = (
  features: GeoFeature[],
  project: ReturnType<typeof makeProjector>,
  nameOf: (f: GeoFeature) => string,
  keyOf: (f: GeoFeature, i: number) => string,
  scoreOf: (name: string) => number | undefined,
  fontSize: number,
): MapPath[] =>
  features.map((f, i) => {
    const name = nameOf(f);
    const placement = geometryLabelPlacement(f.geometry, project);
    const lines = wrapLabel(name, Math.max(placement.width * 0.86, fontSize * 3), fontSize).slice(0, LABEL_MAX_LINES);
    const score = scoreOf(name);
    return {
      key: keyOf(f, i),
      name,
      d: geometryToPath(f.geometry, project),
      labelX: placement.x,
      labelY: placement.y,
      fontSize,
      lines,
      fill: score !== undefined ? scoreColor(score) : PALETTE.muted,
      clickable: score !== undefined,
    };
  });

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <span className="inline-flex items-center gap-1.5">
    <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: color }} />
    <span>{label}</span>
  </span>
);

const MapLabel = ({ p }: { p: MapPath }) => {
  const lineHeight = p.fontSize * 1.15;
  const startDy = -((p.lines.length - 1) / 2) * lineHeight;
  return (
    <text
      x={p.labelX}
      y={p.labelY}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={p.fontSize}
      fill="#14202b"
      stroke="#ffffff"
      strokeWidth={Math.max(0.4, p.fontSize * 0.14)}
      paintOrder="stroke fill"
      style={{ pointerEvents: "none", fontWeight: 600 }}
    >
      {p.lines.map((line, i) => (
        <tspan key={i} x={p.labelX} dy={i === 0 ? startDy : lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  );
};

const EngagementQualityView = () => {
  const [activeState, setActiveState] = useState<string | null>(null); // null = India view
  const [selectedMarket, setSelectedMarket] = useState<MarketReport | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const indiaPaths = useMemo(() => {
    const project = makeProjector(INDIA_BOUNDS, VIEW_W, VIEW_H);
    return buildPaths(
      (indiaGeo as { features: GeoFeature[] }).features,
      project,
      (f) => f.properties.name,
      (f) => f.properties.name,
      (name) => engagementByState.get(name)?.score,
      STATE_LABEL_FONT,
    );
  }, []);

  const districtPaths = useMemo(() => {
    if (!activeState) return [];
    const geo = STATE_DISTRICT_GEO[activeState];
    const bounds = STATE_BOUNDS[activeState];
    if (!geo || !bounds) return [];
    const project = makeProjector(bounds, VIEW_W, VIEW_H);
    return buildPaths(
      geo.features as unknown as GeoFeature[],
      project,
      (f) => f.properties.district,
      (f, i) => `${f.properties.district}-${i}`,
      (district) => getMarket(activeState, district)?.engagementQuality,
      DISTRICT_LABEL_FONT,
    );
  }, [activeState]);

  const goToIndia = () => {
    setActiveState(null);
    setQuery("");
  };

  const handleStateClick = (name: string) => {
    if (STATE_DISTRICT_GEO[name]) {
      setActiveState(name);
      setQuery("");
    }
  };

  const handleDistrictClick = (district: string) => {
    if (!activeState) return;
    const market = getMarket(activeState, district);
    if (market) setSelectedMarket(market);
  };

  const districtCount = activeState ? getStateDistricts(activeState).length : 0;

  const q = query.trim().toLowerCase();
  const isMatch = (name: string) => q.length > 0 && name.toLowerCase().includes(q);
  const searching = q.length > 0;

  const activePaths = activeState ? districtPaths : indiaPaths;

  return (
    <div className="space-y-3">
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

      <div className="flex items-center justify-between gap-3 flex-wrap">
        {activeState ? (
          <div className="flex items-center gap-3">
            <button
              onClick={goToIndia}
              className="inline-flex items-center gap-1 text-[12px] font-medium text-destructive hover:underline underline-offset-2"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Back to India map
            </button>
            <h2 className="font-display text-lg font-bold text-foreground">{activeState}</h2>
          </div>
        ) : (
          <span />
        )}

        <div className="relative w-full max-w-[260px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={activeState ? "Search district…" : "Search state…"}
            className="h-8 pl-8 pr-7 text-[12px]"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <div className="flex items-center flex-wrap gap-x-5 gap-y-1.5 bg-card border rounded-lg shadow-sm px-4 py-2.5 text-sm font-medium text-foreground">
          <LegendDot color={PALETTE.green} label="High engagement (7–10)" />
          <LegendDot color={PALETTE.orange} label="Moderate (5–6.9)" />
          <LegendDot color={PALETTE.red} label="Needs attention (below 5)" />
        </div>
      </div>

      <div className="bg-card border rounded-lg p-3" style={{ height: "min(76vh, 780px)" }}>
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={activeState ? `${activeState} district engagement quality map` : "India engagement quality map"}
        >
          {activePaths.map((p) => {
            const matched = isMatch(p.name);
            const dimmed = searching && !matched;
            return (
              <g key={p.key} opacity={dimmed ? 0.2 : 1}>
                <path
                  d={p.d}
                  fill={p.fill}
                  fillRule="evenodd"
                  stroke={searching && matched ? "#111827" : "#fff"}
                  strokeWidth={searching && matched ? 2 : 0.6}
                  opacity={!searching && hovered === p.key && p.clickable ? 0.78 : 1}
                  onClick={() => (activeState ? handleDistrictClick(p.name) : handleStateClick(p.name))}
                  onMouseEnter={() => setHovered(p.key)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: p.clickable ? "pointer" : "default" }}
                />
                <MapLabel p={p} />
              </g>
            );
          })}
        </svg>
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
