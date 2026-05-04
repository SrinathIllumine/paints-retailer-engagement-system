import LeadershipLayout from "@/components/leadership/LeadershipLayout";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { areaCoverage, engagementUnits, nationalCoverage, stateCoverage, states, type EngagementUnit } from "@/data/leadershipData";
import { Pentagon, RadarIcon, Target } from "lucide-react";
import { useMemo, useState } from "react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";

const toRadarData = (coverage: Record<EngagementUnit, number>, benchmark?: Record<EngagementUnit, number>) =>
  engagementUnits.map((unit) => ({
    unit,
    coverage: coverage[unit],
    benchmark: benchmark?.[unit] ?? 65,
  }));

const avgCoverage = (coverage: Record<EngagementUnit, number>) =>
  Math.round(engagementUnits.reduce((sum, unit) => sum + coverage[unit], 0) / engagementUnits.length);

const gapRows = (coverage: Record<EngagementUnit, number>, benchmark: Record<EngagementUnit, number>) =>
  engagementUnits.map((unit) => ({ unit, coverage: coverage[unit], gap: coverage[unit] - benchmark[unit] }));

const Coverage = () => {
  const [selectedState, setSelectedState] = useState("Maharashtra");
  const selectedAreas = states.find((state) => state.state === selectedState)?.areas ?? [];
  const [selectedArea, setSelectedArea] = useState(selectedAreas[0]?.area ?? "Pune");

  const availableAreas = useMemo(
    () => selectedAreas.filter((area) => areaCoverage[area.area]),
    [selectedAreas],
  );

  const normalizedSelectedArea = availableAreas.some((area) => area.area === selectedArea)
    ? selectedArea
    : availableAreas[0]?.area ?? "Pune";

  const stateData = stateCoverage[selectedState];
  const areaData = areaCoverage[normalizedSelectedArea] ?? areaCoverage.Pune;

  return (
    <LeadershipLayout>
      <div className="space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Engagement Coverage</p>
          <h1 className="font-display text-2xl font-bold text-foreground">
            What’s the coverage of the Engagement Units across the retail network?
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pentagon view of national, state, and area coverage across the same Engagement Units used in ASM analytics.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
          <Card className="p-5 border-border/70 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">National Engagement Coverage</h2>
                <p className="text-sm text-muted-foreground">National aggregate as default benchmark view.</p>
              </div>
              <Badge variant="outline" className="border-primary/30 text-primary">
                {avgCoverage(nationalCoverage)}% avg
              </Badge>
            </div>
            <ResponsiveContainer width="100%" height={360}>
              <RadarChart data={toRadarData(nationalCoverage)} outerRadius="72%">
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="unit" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip />
                <Radar name="National" dataKey="coverage" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.22} strokeWidth={2} />
                <Radar name="Benchmark" dataKey="benchmark" stroke="hsl(var(--info))" fill="hsl(var(--info))" fillOpacity={0.08} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5 border-border/70 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">State-wise View</h2>
                <p className="text-sm text-muted-foreground">Select a state to compare against national coverage.</p>
              </div>
              <select
                value={selectedState}
                onChange={(event) => {
                  const nextState = event.target.value;
                  setSelectedState(nextState);
                  const firstArea = states.find((state) => state.state === nextState)?.areas.find((area) => areaCoverage[area.area])?.area;
                  if (firstArea) setSelectedArea(firstArea);
                }}
                className="h-10 rounded-md border border-input bg-card px-3 text-sm text-foreground"
              >
                {states.map((state) => (
                  <option key={state.state} value={state.state}>{state.state}</option>
                ))}
              </select>
            </div>
            <ResponsiveContainer width="100%" height={360}>
              <RadarChart data={toRadarData(stateData, nationalCoverage)} outerRadius="72%">
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="unit" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip />
                <Radar name={selectedState} dataKey="coverage" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.22} strokeWidth={2} />
                <Radar name="National" dataKey="benchmark" stroke="hsl(var(--info))" fill="hsl(var(--info))" fillOpacity={0.08} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="p-5 border-border/70 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">Area-wise View</h2>
                <p className="text-sm text-muted-foreground">Drill down within a state for area-level pentagon coverage.</p>
              </div>
              <select
                value={normalizedSelectedArea}
                onChange={(event) => setSelectedArea(event.target.value)}
                className="h-10 rounded-md border border-input bg-card px-3 text-sm text-foreground"
              >
                {availableAreas.map((area) => (
                  <option key={area.area} value={area.area}>{area.area}</option>
                ))}
              </select>
            </div>
            <ResponsiveContainer width="100%" height={330}>
              <RadarChart data={toRadarData(areaData, stateData)} outerRadius="72%">
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="unit" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip />
                <Radar name={normalizedSelectedArea} dataKey="coverage" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.22} strokeWidth={2} />
                <Radar name={selectedState} dataKey="benchmark" stroke="hsl(var(--warning))" fill="hsl(var(--warning))" fillOpacity={0.08} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5 border-border/70 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">Gaps vs Benchmarks</h2>
                <p className="text-sm text-muted-foreground">Area gaps compared with selected state and national benchmarks.</p>
              </div>
            </div>
            <div className="space-y-3">
              {gapRows(areaData, stateData).map((row) => (
                <div key={row.unit} className="rounded-md border border-border/70 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">{row.unit}</p>
                    <Badge variant="outline" className={row.gap >= 0 ? "border-success/30 text-success" : "border-destructive/30 text-destructive"}>
                      {row.gap >= 0 ? "+" : ""}{row.gap} pts
                    </Badge>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${row.coverage}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{normalizedSelectedArea}: {row.coverage}% · {selectedState}: {stateData[row.unit]}% · National: {nationalCoverage[row.unit]}%</p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </LeadershipLayout>
  );
};

export default Coverage;
