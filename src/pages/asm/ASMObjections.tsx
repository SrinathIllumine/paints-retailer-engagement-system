import { useMemo, useState } from "react";
import ASMLayout from "@/components/asm/ASMLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RTooltip,
  ResponsiveContainer,
} from "recharts";
import { Search, AlertTriangle, Clock, MapPin } from "lucide-react";
import { objectionBreakdown, dealers } from "@/data/mockData";

const COLORS = [
  "hsl(0,78%,48%)",
  "hsl(30,80%,52%)",
  "hsl(210,80%,52%)",
  "hsl(152,60%,40%)",
  "hsl(220,10%,46%)",
];

interface RetailerObjection {
  retailer: string;
  area: string;
  assignedMe: string;
  objections: number;
  pendingDays: number;
  topObjection: string;
  history: { date: string; me: string; objection: string; note: string }[];
}

const retailerObjections: RetailerObjection[] = [
  {
    retailer: "Krishna Traders",
    area: "Pune South",
    assignedMe: "Anita Deshmukh",
    objections: 5,
    pendingDays: 22,
    topObjection: "Working capital",
    history: [
      { date: "12 Apr", me: "Anita Deshmukh", objection: "Working capital", note: "Asked for 30-day credit window; raised again." },
      { date: "28 Mar", me: "Anita Deshmukh", objection: "Competition from other brands", note: "Asian Paints offering bundled SKUs." },
      { date: "15 Mar", me: "Anita Deshmukh", objection: "Demand-related", note: "Contractor footfall has dropped after monsoon." },
    ],
  },
  {
    retailer: "Gupta Cement House",
    area: "Pune North",
    assignedMe: "Priya Nair",
    objections: 4,
    pendingDays: 18,
    topObjection: "SKU space",
    history: [
      { date: "10 Apr", me: "Priya Nair", objection: "SKU space", note: "Compact display offered, not yet placed." },
      { date: "22 Mar", me: "Priya Nair", objection: "Demand-related", note: "Wants painter-meet support before scaling." },
    ],
  },
  {
    retailer: "Singh Building Centre",
    area: "Pune SW",
    assignedMe: "Vikas Patil",
    objections: 3,
    pendingDays: 14,
    topObjection: "Competition from other brands",
    history: [
      { date: "18 Apr", me: "Vikas Patil", objection: "Competition from other brands", note: "Birla EMI scheme creating pressure." },
      { date: "02 Apr", me: "Vikas Patil", objection: "Poor Product Quality", note: "Two contractors flagged packaging damage." },
    ],
  },
  {
    retailer: "Sharma Building Materials",
    area: "Pune West",
    assignedMe: "Ravi Kumar",
    objections: 3,
    pendingDays: 11,
    topObjection: "Demand-related",
    history: [
      { date: "20 Apr", me: "Ravi Kumar", objection: "Demand-related", note: "Newly mapped retailer, awareness building." },
    ],
  },
  {
    retailer: "Deshpande Hardware Stores",
    area: "Pune North",
    assignedMe: "Priya Nair",
    objections: 3,
    pendingDays: 28,
    topObjection: "Working capital",
    history: [
      { date: "06 Apr", me: "Priya Nair", objection: "Working capital", note: "Wants flexible ordering plan." },
    ],
  },
  {
    retailer: "Patel & Sons Hardware",
    area: "Pune NE",
    assignedMe: "Sunil Sharma",
    objections: 2,
    pendingDays: 9,
    topObjection: "SKU space",
    history: [
      { date: "23 Apr", me: "Sunil Sharma", objection: "SKU space", note: "Open to compact stand if branded well." },
    ],
  },
];

interface AreaObjection {
  area: string;
  mes: string[];
  byType: Record<string, number>;
}

const areaObjections: AreaObjection[] = [
  {
    area: "Pune West",
    mes: ["Ravi Kumar"],
    byType: { "Demand-related": 6, "Working capital": 4, "SKU space": 4, "Competition from other brands": 3, "Poor Product Quality": 3 },
  },
  {
    area: "Pune NE",
    mes: ["Sunil Sharma"],
    byType: { "Demand-related": 4, "Working capital": 3, "SKU space": 3, "Competition from other brands": 2, "Poor Product Quality": 2 },
  },
  {
    area: "Pune South",
    mes: ["Anita Deshmukh"],
    byType: { "Demand-related": 8, "Working capital": 7, "SKU space": 4, "Competition from other brands": 5, "Poor Product Quality": 4 },
  },
  {
    area: "Pune SW",
    mes: ["Vikas Patil"],
    byType: { "Demand-related": 3, "Working capital": 2, "SKU space": 2, "Competition from other brands": 3, "Poor Product Quality": 3 },
  },
  {
    area: "Pune North",
    mes: ["Priya Nair"],
    byType: { "Demand-related": 7, "Working capital": 6, "SKU space": 5, "Competition from other brands": 4, "Poor Product Quality": 3 },
  },
];

const objectionTypes = ["Demand-related", "Working capital", "SKU space", "Competition from other brands", "Poor Product Quality"];

const ASMObjections = () => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      retailerObjections.filter((r) =>
        [r.retailer, r.assignedMe, r.area, r.topObjection]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [search],
  );

  return (
    <ASMLayout hideFilters>
      <div className="space-y-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            What are the key Objections raised by Retailers?
          </h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" />
            Pune · 6 MEs · 6 Market Areas
          </p>
        </div>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-foreground">Common objections</h3>
            </div>
            <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              engagement signals
            </span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={objectionBreakdown}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label={({ name, value }) => `${name} (${value}%)`}
              >
                {objectionBreakdown.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <RTooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-3 flex-wrap">
            <div>
              <h3 className="font-semibold text-foreground">Retailer-wise objections</h3>
            </div>
            <div className="ml-auto relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search retailer, ME, area"
                className="h-8 pl-8 w-64 text-sm"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Retailer</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Assigned ME</TableHead>
                  <TableHead>Top objection</TableHead>
                  <TableHead className="text-right">Objections raised</TableHead>
                  <TableHead className="text-right">Pending since</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.retailer}>
                    <TableCell className="font-medium">{r.retailer}</TableCell>
                    <TableCell className="text-muted-foreground">{r.area}</TableCell>
                    <TableCell>{r.assignedMe}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {r.topObjection}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {r.objections}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium ${
                          r.pendingDays > 21
                            ? "text-warning"
                            : r.pendingDays > 14
                            ? "text-info"
                            : "text-muted-foreground"
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {r.pendingDays}d
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Market area objection view</h3>
            <p className="text-xs text-muted-foreground">
              Helps identify area-level initiatives
            </p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Market area</TableHead>
                  <TableHead>MEs</TableHead>
                  {objectionTypes.map((t) => (
                    <TableHead key={t} className="text-right">
                      {t}
                    </TableHead>
                  ))}
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {areaObjections.map((a) => {
                  const total = Object.values(a.byType).reduce((s, x) => s + x, 0);
                  return (
                    <TableRow key={a.area}>
                      <TableCell className="font-medium">{a.area}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {a.mes.join(", ")}
                      </TableCell>
                      {objectionTypes.map((t) => {
                        const v = a.byType[t] ?? 0;
                        const intensity =
                          v >= 8
                            ? "bg-primary/30 text-foreground font-semibold"
                            : v >= 4
                            ? "bg-primary/15 text-foreground"
                            : v > 0
                            ? "bg-secondary text-foreground/70"
                            : "text-muted-foreground/40";
                        return (
                          <TableCell key={t} className="text-right">
                            <span
                              className={`inline-block min-w-[28px] text-center text-xs px-2 py-0.5 rounded ${intensity}`}
                            >
                              {v || "—"}
                            </span>
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-right font-semibold">
                        {total}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </ASMLayout>
  );
};

void dealers;

export default ASMObjections;