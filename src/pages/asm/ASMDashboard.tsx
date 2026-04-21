import { useMemo, useState } from "react";
import ASMLayout from "@/components/asm/ASMLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, MessageSquare, Store, Sparkles, AlertTriangle, MapPin, MousePointerClick, Check, X, UserCircle2 } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip as RTooltip, ResponsiveContainer } from "recharts";
import { asmMetrics, marketingExecutives } from "@/data/meAnalytics";
import { dealers, objectionBreakdown } from "@/data/mockData";
import MEProfileDialog from "@/components/leadership/MEProfileDialog";

const COLORS = ["hsl(0,78%,48%)", "hsl(30,80%,52%)", "hsl(210,80%,52%)", "hsl(152,60%,40%)", "hsl(220,10%,46%)"];
type Window = "7d" | "30d" | "90d";

const ObjectionIntelligenceView = ({
  objection,
  onClose,
}: { objection: string | null; onClose: () => void }) => {
  if (!objection) return null;

  const subAreas = [
    { area: "Pune West", count: 14 },
    { area: "Pune NE",   count: 9 },
    { area: "Pune South",count: 11 },
    { area: "Pune SW",   count: 6 },
  ];
  const byCategory = [
    { label: "Loyal", count: 6 },
    { label: "New", count: 12 },
    { label: "Inactive", count: 14 },
    { label: "Declining", count: 8 },
  ];
  const byRevenue = [
    { label: "A", count: 4 },
    { label: "B", count: 16 },
    { label: "C", count: 20 },
  ];

  const priority = dealers.slice(0, 4).map((d, i) => ({
    dealer: d,
    blocker: objection,
    me: marketingExecutives[i % marketingExecutives.length].name,
    repeated: 2 + (i % 3),
  }));

  return (
    <Dialog open={!!objection} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Objection Intelligence View - {objection}</DialogTitle>
        </DialogHeader>

        {/* Prioritization */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-1">Prioritization View</h3>
          <p className="text-xs text-muted-foreground mb-3">Which retailers need attention first?</p>
          <div className="divide-y divide-border">
            {priority.map((p, i) => (
              <div key={i} className="py-2 flex items-center gap-3 text-sm">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{p.dealer.name}</p>
                  <p className="text-xs text-muted-foreground">Blocker: {p.blocker} · Repeated {p.repeated}x · ME: {p.me}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{p.dealer.lastVisit}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Distribution */}
        <Card className="p-4 mt-3">
          <h3 className="font-semibold text-foreground mb-1">Distribution View</h3>
          <p className="text-xs text-muted-foreground mb-3">Where is the problem happening?</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">By sub-area</p>
              {subAreas.map((s) => (
                <div key={s.area} className="flex items-center justify-between py-1">
                  <span className="text-foreground/80">{s.area}</span>
                  <span className="font-semibold">{s.count}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">By retailer category</p>
              {byCategory.map((s) => (
                <div key={s.label} className="flex items-center justify-between py-1">
                  <span className="text-foreground/80">{s.label}</span>
                  <span className="font-semibold">{s.count}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">By revenue tier</p>
              {byRevenue.map((s) => (
                <div key={s.label} className="flex items-center justify-between py-1">
                  <span className="text-foreground/80">Tier {s.label}</span>
                  <span className="font-semibold">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="flex justify-end pt-3">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ASMDashboard = () => {
  const [window, setWindow] = useState<Window>("30d");
  const [activeObjection, setActiveObjection] = useState<string | null>(null);

  const m = useMemo(() => asmMetrics.windows[window], [window]);

  const cards = [
    { icon: Users,         label: "Number of MEs",                value: asmMetrics.mesUnder },
    { icon: Store,         label: "Total retailers in the region", value: asmMetrics.totalRetailersInRegion },
    { icon: Sparkles,      label: "Retailers met by the MEs",     value: m.totalRetailersMet },
    { icon: MessageSquare, label: "Total engagements with retailers",         value: m.conversations },
  ];

  return (
    <ASMLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">Raj Kumar's Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />{asmMetrics.region}
            </p>
          </div>
          <Tabs value={window} onValueChange={(v) => setWindow(v as Window)}>
            <TabsList>
              <TabsTrigger value="7d">Last 7 days</TabsTrigger>
              <TabsTrigger value="30d">Last 30 days</TabsTrigger>
              <TabsTrigger value="90d">Last 90 days</TabsTrigger>
            </TabsList>
            <TabsContent value="7d" />
            <TabsContent value="30d" />
            <TabsContent value="90d" />
          </Tabs>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => (
            <Card key={c.label} className="p-4">
              <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center mb-2">
                <c.icon className="w-4 h-4 text-info" />
              </div>
              <p className="font-display font-bold text-2xl text-foreground">{c.value.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">{c.label}</p>
            </Card>
          ))}
        </div>

        {/* Objections pie - clickable */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-foreground">Common Objections</h3>
              <p className="text-xs text-muted-foreground">Click any slice to open the Objection Intelligence View</p>
            </div>
            <span className="text-xs text-muted-foreground inline-flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />engagement signals</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={objectionBreakdown}
                cx="50%" cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name} (${value}%)`}
                onClick={(d: any) => setActiveObjection(d?.name ?? null)}
                cursor="pointer"
              >
                {objectionBreakdown.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <RTooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {objectionBreakdown.map((o) => (
              <button
                key={o.name}
                className="text-xs px-2.5 py-1 rounded-full border border-border hover:bg-secondary"
                onClick={() => setActiveObjection(o.name)}
              >
                {o.name} - {o.value}%
              </button>
            ))}
          </div>
        </Card>
      </div>

      <ObjectionIntelligenceView objection={activeObjection} onClose={() => setActiveObjection(null)} />
    </ASMLayout>
  );
};

export default ASMDashboard;
