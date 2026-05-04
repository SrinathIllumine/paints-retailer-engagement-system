import LeadershipLayout from "@/components/leadership/LeadershipLayout";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { areaObjections, objectionTypes, segmentObjectionData, stateObjectionMatrix, type ObjectionType } from "@/data/leadershipData";
import { AlertTriangle, MapPinned, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMemo, useState } from "react";

const fmt = (value: number) => value.toLocaleString("en-IN");
const maxHeatValue = Math.max(...Object.values(stateObjectionMatrix).flatMap((row) => Object.values(row)));

const heatClass = (value: number) => {
  const intensity = value / maxHeatValue;
  if (intensity >= 0.82) return "bg-primary text-primary-foreground";
  if (intensity >= 0.62) return "bg-primary/60 text-primary-foreground";
  if (intensity >= 0.42) return "bg-primary/30 text-foreground";
  return "bg-primary/10 text-foreground";
};

const Objections = () => {
  const [selectedObjection, setSelectedObjection] = useState<ObjectionType>(objectionTypes[0]);

  const objectionTotals = useMemo(
    () =>
      objectionTypes.map((type) => ({
        objection: type,
        retailers: Object.values(stateObjectionMatrix).reduce((sum, row) => sum + row[type], 0),
      })),
    [],
  );

  return (
    <LeadershipLayout>
      <div className="space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Retailer Objections</p>
          <h1 className="font-display text-2xl font-bold text-foreground">
            What are common objection patterns across retailers in the country?
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            National pattern detection for systemic vs localized objections raised through ME engagements.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {objectionTotals.slice(0, 3).map((item) => (
            <Card key={item.objection} className="p-5 border-border/70 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">National objection volume</p>
                  <p className="font-display text-xl font-bold text-foreground">{fmt(item.retailers)}</p>
                </div>
              </div>
              <p className="mt-3 font-medium text-foreground">{item.objection}</p>
            </Card>
          ))}
        </section>

        <Card className="p-5 border-border/70 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">State-wise Objection Heatmap</h2>
              <p className="text-sm text-muted-foreground">Intensity indicates retailer count and severity concentration by state.</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-md bg-primary/10 px-2 py-1">Low</span>
              <span className="rounded-md bg-primary/30 px-2 py-1">Medium</span>
              <span className="rounded-md bg-primary/60 px-2 py-1 text-primary-foreground">High</span>
              <span className="rounded-md bg-primary px-2 py-1 text-primary-foreground">Critical</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">State</th>
                  {objectionTypes.map((type) => (
                    <th key={type} className="py-2 pr-3 font-medium">{type}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(stateObjectionMatrix).map(([state, row]) => (
                  <tr key={state} className="border-b border-border/60 last:border-0">
                    <td className="py-2 pr-3 font-semibold text-foreground">{state}</td>
                    {objectionTypes.map((type) => (
                      <td key={type} className="py-2 pr-3">
                        <span className={`inline-flex min-w-14 justify-center rounded-md px-3 py-2 font-semibold ${heatClass(row[type])}`}>
                          {row[type]}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-5 border-border/70 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">Area-wise Objection Breakdown</h2>
                <p className="text-sm text-muted-foreground">Select an objection to view impacted areas and ASM ownership.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {objectionTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedObjection(type)}
                    className={`rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
                      selectedObjection === type
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-2 pr-4 font-medium">Area Name</th>
                    <th className="py-2 pr-4 font-medium">State</th>
                    <th className="py-2 pr-4 font-medium">ASM Assigned</th>
                    <th className="py-2 pr-4 font-medium">Retailers</th>
                    <th className="py-2 pr-4 font-medium">Active MEs</th>
                  </tr>
                </thead>
                <tbody>
                  {areaObjections
                    .slice()
                    .sort((a, b) => b.retailersAffected[selectedObjection] - a.retailersAffected[selectedObjection])
                    .map((area) => (
                      <tr key={`${area.state}-${area.area}`} className="border-b border-border/60 last:border-0">
                        <td className="py-3 pr-4 font-medium text-foreground">{area.area}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{area.state}</td>
                        <td className="py-3 pr-4 text-foreground">{area.asm}</td>
                        <td className="py-3 pr-4 font-semibold text-foreground">{area.retailersAffected[selectedObjection]}</td>
                        <td className="py-3 pr-4 text-foreground">{area.activeMes}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-5 border-border/70 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-info/10 text-info flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">Retailer Segment-wise Objections</h2>
                <p className="text-sm text-muted-foreground">Morphology split for national objection diagnosis.</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={segmentObjectionData.map((row) => ({ segment: row.segment, ...row.counts }))} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="segment" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Legend />
                <Bar dataKey="Demand-related" stackId="a" fill="hsl(var(--primary))" />
                <Bar dataKey="Working capital" stackId="a" fill="hsl(var(--warning))" />
                <Bar dataKey="SKU space" stackId="a" fill="hsl(var(--info))" />
                <Bar dataKey="Competition from other brands" stackId="a" fill="hsl(var(--accent))" />
                <Bar dataKey="Poor Product Quality" stackId="a" fill="hsl(var(--destructive))" />
              </BarChart>
            </ResponsiveContainer>
            <Badge variant="outline" className="mt-3 border-info/30 text-info">
              <MapPinned className="mr-1 h-3 w-3" /> Systemic signals show up across multiple segments.
            </Badge>
          </Card>
        </section>
      </div>
    </LeadershipLayout>
  );
};

export default Objections;
