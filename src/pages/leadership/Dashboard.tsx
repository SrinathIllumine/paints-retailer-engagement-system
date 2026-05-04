import LeadershipLayout from "@/components/leadership/LeadershipLayout";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  ACTIVE_ME_DEFINITION_X,
  ENGAGEMENT_BENCHMARK_PER_RETAILER,
  NATIONAL_ACTIVE_MES,
  NATIONAL_AVG_ENGAGEMENT_PER_RETAILER,
  NATIONAL_AVG_OBSTACLES,
  NATIONAL_RETAILERS_ENGAGED,
  NATIONAL_TOTAL_MES,
  NATIONAL_TOTAL_RETAILERS,
  OBSTACLES_BENCHMARK,
  momTrend,
  states,
  type Status,
} from "@/data/leadershipData";
import { Activity, AlertCircle, ArrowDown, ArrowUp, CheckCircle2, MapPinned, Store, Users } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const fmt = (value: number) => value.toLocaleString("en-IN");
const pct = (part: number, total: number) => `${Math.round((part / total) * 100)}%`;

const statusLabel: Record<Status, string> = {
  "on-track": "On-track",
  lagging: "Lagging",
  "yet-to-start": "Yet to Start",
};

const statusClass: Record<Status, string> = {
  "on-track": "border-success/30 bg-success/10 text-success",
  lagging: "border-warning/30 bg-warning/10 text-warning",
  "yet-to-start": "border-destructive/30 bg-destructive/10 text-destructive",
};

const KpiCard = ({
  icon: Icon,
  label,
  value,
  helper,
  direction,
}: {
  icon: typeof Store;
  label: string;
  value: string;
  helper: string;
  direction?: "up" | "down";
}) => (
  <Card className="p-5 border-border/70 shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      {direction === "up" && <ArrowUp className="h-4 w-4 text-success" />}
      {direction === "down" && <ArrowDown className="h-4 w-4 text-destructive" />}
    </div>
    <p className="mt-4 font-display text-2xl font-bold text-foreground">{value}</p>
    <p className="mt-1 text-sm font-medium text-foreground">{label}</p>
    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{helper}</p>
  </Card>
);

const Dashboard = () => (
  <LeadershipLayout>
    <div className="space-y-6">
      <header className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">National Engagement</p>
          <h1 className="font-display text-2xl font-bold text-foreground">
            At a national level, how are ME–retailer engagements improving on the ground?
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Aggregate view of ASM engagement quality, coverage, and execution health across National → State → Area.
          </p>
        </div>
        <Badge variant="outline" className="w-fit border-primary/30 text-primary">
          Active ME = {ACTIVE_ME_DEFINITION_X}+ engagements/month
        </Badge>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={Store}
          label="Total number of retailers in JK"
          value={`~${fmt(NATIONAL_TOTAL_RETAILERS)}`}
          helper="Nationwide retailer base tracked for ME engagement."
        />
        <KpiCard
          icon={CheckCircle2}
          label="Number of retailers engaged"
          value={fmt(NATIONAL_RETAILERS_ENGAGED)}
          helper={`${pct(NATIONAL_RETAILERS_ENGAGED, NATIONAL_TOTAL_RETAILERS)} engaged nationally this cycle.`}
          direction="up"
        />
        <KpiCard
          icon={Activity}
          label="Avg engagements per retailer"
          value={NATIONAL_AVG_ENGAGEMENT_PER_RETAILER.toFixed(1)}
          helper={`↑ ${(NATIONAL_AVG_ENGAGEMENT_PER_RETAILER - ENGAGEMENT_BENCHMARK_PER_RETAILER).toFixed(1)} vs benchmark ${ENGAGEMENT_BENCHMARK_PER_RETAILER}.`}
          direction="up"
        />
        <KpiCard
          icon={AlertCircle}
          label="Avg obstacles raised per retailer"
          value={NATIONAL_AVG_OBSTACLES.toFixed(1)}
          helper={`↑ ${(NATIONAL_AVG_OBSTACLES - OBSTACLES_BENCHMARK).toFixed(1)} vs benchmark ${OBSTACLES_BENCHMARK.toFixed(1)}.`}
          direction="up"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <KpiCard
          icon={Users}
          label="Total number of MEs in JK"
          value={`~${fmt(NATIONAL_TOTAL_MES)}`}
          helper="National ME field force across states and ASMs."
        />
        <KpiCard
          icon={MapPinned}
          label="Total number of active MEs"
          value={fmt(NATIONAL_ACTIVE_MES)}
          helper={`${pct(NATIONAL_ACTIVE_MES, NATIONAL_TOTAL_MES)} active by the ${ACTIVE_ME_DEFINITION_X}+ engagements/month definition.`}
          direction="up"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_1fr]">
        <Card className="p-5 border-border/70 shadow-sm">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">State-wise Engagement Breakdown</h2>
              <p className="text-sm text-muted-foreground">Expand a state to view area metrics and retailer morphologies.</p>
            </div>
            <Badge variant="secondary">Benchmark: 4 / 5 units</Badge>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {states.map((state) => (
              <AccordionItem key={state.state} value={state.state} className="rounded-md border border-border/70 px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="grid w-full grid-cols-2 gap-3 pr-3 text-left lg:grid-cols-[1.2fr_1fr_0.7fr_0.9fr_0.9fr] lg:items-center">
                    <div>
                      <p className="font-semibold text-foreground">{state.state}</p>
                      <p className="text-xs text-muted-foreground">State Head: {state.stateHead}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Active MEs</p>
                      <p className="font-semibold text-foreground">{state.activeMes}/{state.totalMes}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Retailers Engaged</p>
                      <p className="font-semibold text-foreground">{pct(state.retailersEngaged, state.totalRetailers)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Units Covered</p>
                      <p className="font-semibold text-foreground">{state.unitsCovered}/5</p>
                    </div>
                    <Badge variant="outline" className={`w-fit ${statusClass[state.status]}`}>
                      {statusLabel[state.status]}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pb-4">
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                      {Object.entries(state.segments).map(([segment, count]) => (
                        <div key={segment} className="rounded-md border border-border/70 bg-muted/40 p-3">
                          <p className="text-xs capitalize text-muted-foreground">{segment}</p>
                          <p className="mt-1 font-display text-xl font-bold text-foreground">{fmt(count)}</p>
                        </div>
                      ))}
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[720px] text-sm">
                        <thead>
                          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                            <th className="py-2 pr-4 font-medium">Area</th>
                            <th className="py-2 pr-4 font-medium">ASM Assigned</th>
                            <th className="py-2 pr-4 font-medium">Active MEs</th>
                            <th className="py-2 pr-4 font-medium">Retailers Engaged</th>
                            <th className="py-2 pr-4 font-medium">Units Covered</th>
                            <th className="py-2 pr-4 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {state.areas.map((area) => (
                            <tr key={area.area} className="border-b border-border/60 last:border-0">
                              <td className="py-3 pr-4 font-medium text-foreground">{area.area}</td>
                              <td className="py-3 pr-4 text-muted-foreground">{area.asm}</td>
                              <td className="py-3 pr-4 text-foreground">{area.activeMes}/{area.totalMes}</td>
                              <td className="py-3 pr-4 text-foreground">{pct(area.retailersEngaged, area.totalRetailers)}</td>
                              <td className="py-3 pr-4 text-foreground">{area.unitsCovered}/5</td>
                              <td className="py-3 pr-4">
                                <Badge variant="outline" className={statusClass[area.status]}>{statusLabel[area.status]}</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        <Card className="p-5 border-border/70 shadow-sm">
          <h2 className="font-display text-lg font-bold text-foreground">Month-on-Month Engagement Trend</h2>
          <p className="mb-4 text-sm text-muted-foreground">National engagement growth and active ME trend.</p>
          <ResponsiveContainer width="100%" height={360}>
            <LineChart data={momTrend} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="engagements" name="Engagements" fill="hsl(var(--primary) / 0.12)" stroke="hsl(var(--primary))" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="activeMes" name="Active MEs" stroke="hsl(var(--info))" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </section>
    </div>
  </LeadershipLayout>
);

export default Dashboard;
