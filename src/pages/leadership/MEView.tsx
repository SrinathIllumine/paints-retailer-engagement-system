import { useMemo, useState } from "react";
import LeadershipLayout from "@/components/leadership/LeadershipLayout";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MEProfileDialog from "@/components/leadership/MEProfileDialog";
import { marketingExecutives } from "@/data/meAnalytics";
import { Info, MousePointerClick, Check, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface StateInfo {
  name: string;
  enabled: boolean;
  asms: number;
  mes: number;
  totalRetailers: number;
}

const states: StateInfo[] = [
  { name: "Maharashtra",   enabled: true,  asms: 2, mes: marketingExecutives.length, totalRetailers: 2010 },
  { name: "Gujarat",       enabled: false, asms: 1, mes: 18, totalRetailers: 1640 },
  { name: "Karnataka",     enabled: false, asms: 2, mes: 22, totalRetailers: 1880 },
  { name: "Tamil Nadu",    enabled: false, asms: 2, mes: 24, totalRetailers: 2120 },
  { name: "Rajasthan",     enabled: false, asms: 1, mes: 16, totalRetailers: 1490 },
];

const ENGAGEMENT_TYPES = ["JK alignment", "Value proposition", "Market awareness", "Openness", "Growth potential"] as const;
type EngagementType = typeof ENGAGEMENT_TYPES[number];

interface Row {
  asm: string;
  area: string;
  meId: string;
  meName: string;
  engagements: number;
  objections: number;
  majorObjection: string;
  coveredTypes: EngagementType[];
}

const rows: Row[] = [
  { asm: "Raj Kumar",   area: "Pune West",  meId: "me1", meName: "Ravi Kumar",     engagements: 168, objections: 22, majorObjection: "No demand in my area",       coveredTypes: ["JK alignment", "Value proposition"] },
  { asm: "Raj Kumar",   area: "Pune NE",    meId: "me2", meName: "Sunil Sharma",   engagements: 184, objections: 11, majorObjection: "No space",                   coveredTypes: ["JK alignment", "Value proposition", "Market awareness", "Openness"] },
  { asm: "Raj Kumar",   area: "Pune South", meId: "me3", meName: "Anita Deshmukh", engagements: 152, objections: 38, majorObjection: "Working capital",            coveredTypes: ["JK alignment"] },
  { asm: "Anil Joshi",  area: "Pune SW",    meId: "me4", meName: "Vikas Patil",    engagements: 196, objections: 8,  majorObjection: "No space",                   coveredTypes: ["JK alignment", "Value proposition", "Market awareness", "Openness", "Growth potential"] },
  { asm: "Anil Joshi",  area: "Pune North", meId: "me5", meName: "Priya Nair",     engagements: 141, objections: 17, majorObjection: "No demand in my area",       coveredTypes: ["JK alignment", "Value proposition", "Market awareness"] },
];

const coveragePct = (covered: EngagementType[]) => Math.round((covered.length / ENGAGEMENT_TYPES.length) * 100);

const PctCell = ({ value }: { value: number }) => {
  const tone =
    value >= 70 ? "bg-success/15 text-success" :
    value >= 45 ? "bg-info/15 text-info" :
    "bg-warning/15 text-warning";
  return <span className={`inline-block min-w-[42px] text-center text-xs px-2 py-0.5 rounded-full font-medium ${tone}`}>{value}%</span>;
};

const MEView = () => {
  const [stateName, setStateName] = useState<string>("Maharashtra");
  const [selected, setSelected] = useState<string | null>(null);

  const currentState = useMemo(() => states.find((s) => s.name === stateName)!, [stateName]);

  const totals = useMemo(() => {
    const engagements = rows.reduce((a, r) => a + r.engagements, 0);
    const objections = rows.reduce((a, r) => a + r.objections, 0);
    const avg = (k: keyof Row["coverage"]) => Math.round(rows.reduce((a, r) => a + r.coverage[k], 0) / rows.length);
    return {
      engagements,
      objections,
      coverage: {
        jkAlignment: avg("jkAlignment"),
        valueProp: avg("valueProp"),
        marketAwareness: avg("marketAwareness"),
        openness: avg("openness"),
        growthPotential: avg("growthPotential"),
      },
    };
  }, []);

  return (
    <LeadershipLayout>
      <div className="space-y-6">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">State-wise View</h1>
            <p className="text-sm text-muted-foreground mt-1">
              State-wise visibility into ME engagement effectiveness with retailers
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">State</span>
            <Select value={stateName} onValueChange={setStateName}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                {states.map((s) => (
                  <SelectItem key={s.name} value={s.name} disabled={!s.enabled}>
                    {s.name}{!s.enabled ? " (coming soon)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* State summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Number of ASMs</p>
            <p className="font-display font-bold text-2xl text-foreground mt-1">{currentState.asms}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Number of MEs</p>
            <p className="font-display font-bold text-2xl text-foreground mt-1">{currentState.mes}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total retailers in the state</p>
            <p className="font-display font-bold text-2xl text-foreground mt-1">{currentState.totalRetailers.toLocaleString()}</p>
          </Card>
        </div>

        {/* State-level aggregates */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <h3 className="font-semibold text-foreground">State-level engagement aggregates</h3>
              <p className="text-xs text-muted-foreground">Last 30 days · {currentState.name}</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1 cursor-help">
                  <Info className="w-3.5 h-3.5" />How coverage % is read
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">
                Coverage % shows how often each engagement type was actually covered in ME conversations during the period.
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-sm">
            <div className="rounded-lg bg-secondary/50 p-3">
              <p className="text-xs text-muted-foreground">Total engagements</p>
              <p className="font-display font-bold text-lg">{totals.engagements.toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-3">
              <p className="text-xs text-muted-foreground">Total objections</p>
              <p className="font-display font-bold text-lg">{totals.objections.toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-3">
              <p className="text-xs text-muted-foreground">JK alignment</p>
              <p className="font-display font-bold text-lg">{totals.coverage.jkAlignment}%</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-3">
              <p className="text-xs text-muted-foreground">Value proposition</p>
              <p className="font-display font-bold text-lg">{totals.coverage.valueProp}%</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-3">
              <p className="text-xs text-muted-foreground">Market awareness</p>
              <p className="font-display font-bold text-lg">{totals.coverage.marketAwareness}%</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-3">
              <p className="text-xs text-muted-foreground">Openness</p>
              <p className="font-display font-bold text-lg">{totals.coverage.openness}%</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-3">
              <p className="text-xs text-muted-foreground">Growth potential</p>
              <p className="font-display font-bold text-lg">{totals.coverage.growthPotential}%</p>
            </div>
          </div>
        </Card>

        {/* Main analytics table */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">ASM · ME engagement breakdown</h3>
            <p className="text-xs text-muted-foreground">Last 30 days · click any row to see ME profile</p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ASM</TableHead>
                  <TableHead>Area covered</TableHead>
                  <TableHead>ME</TableHead>
                  <TableHead className="text-right">Engagements (30d)</TableHead>
                  <TableHead className="text-right">Objections (30d)</TableHead>
                  <TableHead className="text-center">JK alignment</TableHead>
                  <TableHead className="text-center">Value prop</TableHead>
                  <TableHead className="text-center">Market awareness</TableHead>
                  <TableHead className="text-center">Openness</TableHead>
                  <TableHead className="text-center">Growth potential</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.meId} className="cursor-pointer" onClick={() => setSelected(r.meId)}>
                    <TableCell className="font-medium">{r.asm}</TableCell>
                    <TableCell className="text-muted-foreground">{r.area}</TableCell>
                    <TableCell>{r.meName}</TableCell>
                    <TableCell className="text-right font-semibold">{r.engagements}</TableCell>
                    <TableCell className="text-right font-semibold">{r.objections}</TableCell>
                    <TableCell className="text-center"><PctCell value={r.coverage.jkAlignment} /></TableCell>
                    <TableCell className="text-center"><PctCell value={r.coverage.valueProp} /></TableCell>
                    <TableCell className="text-center"><PctCell value={r.coverage.marketAwareness} /></TableCell>
                    <TableCell className="text-center"><PctCell value={r.coverage.openness} /></TableCell>
                    <TableCell className="text-center"><PctCell value={r.coverage.growthPotential} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <MEProfileDialog meId={selected} context="uplift" onClose={() => setSelected(null)} />
    </LeadershipLayout>
  );
};

export default MEView;
