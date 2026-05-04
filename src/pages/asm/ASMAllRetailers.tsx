import { useMemo, useState } from "react";
import ASMLayout from "@/components/asm/ASMLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Store, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { dealers } from "@/data/mockData";
import { marketingExecutives } from "@/data/meAnalytics";

type Morphology = "Loyal" | "New" | "Declining" | "Inactive";

interface RetailerRow {
  id: string;
  name: string;
  morphology: Morphology;
  marketArea: string;
  assignedMe: string;
  lastVisited: string;
  engagementUnits: number; // 0..5 attributes covered
  history: { date: string; me: string; outcome: string; actionPoint: string }[];
}

const morphCount: Record<Morphology, number> = {
  Loyal: 674,
  New: 307,
  Declining: 244,
  Inactive: 175,
};

// Build a believable retailer set from the existing dealers + extension rows
const morphCycle: Morphology[] = ["Loyal", "New", "Declining", "Inactive"];
const meCycle = marketingExecutives.map((m) => m.name);

const baseRetailers: RetailerRow[] = dealers.map((d, i) => ({
  id: d.id,
  name: d.name,
  morphology: morphCycle[i % morphCycle.length],
  marketArea: d.area,
  assignedMe: meCycle[i % meCycle.length],
  lastVisited: d.lastVisit.replace("Last visited: ", "").replace("Last weeks ago", "2 weeks ago"),
  engagementUnits: (i % 5) + 1,
  history: [
    { date: "20 Apr", me: meCycle[i % meCycle.length], outcome: d.lastOutcome, actionPoint: "Share new SKU sheet on next visit" },
    { date: "28 Mar", me: meCycle[i % meCycle.length], outcome: "Discussed contractor network expansion", actionPoint: "Connect with 2 local painters" },
    { date: "10 Mar", me: meCycle[i % meCycle.length], outcome: "Introduced Festival scheme", actionPoint: "Decide on display stand placement" },
  ],
}));

// Pad to ~40 rows for a more realistic table
const padded: RetailerRow[] = [];
for (let i = 0; i < 5; i++) {
  baseRetailers.forEach((r, j) => {
    padded.push({
      ...r,
      id: `${r.id}-${i}-${j}`,
      name: i === 0 ? r.name : `${r.name.split(" ")[0]} ${["Branch", "Hub", "Centre", "Outpost", "Depot"][i - 1] ?? ""} ${i}`,
      lastVisited: ["2 days ago", "1 week ago", "3 weeks ago", "1 month ago", "Yesterday"][(i + j) % 5],
      engagementUnits: (((i * 3 + j) % 5) + 1),
    });
  });
}

const PAGE_SIZE = 10;

const EngagementBar = ({ units }: { units: number }) => {
  const pct = (units / 5) * 100;
  const tone =
    units >= 4 ? "bg-success" : units >= 2 ? "bg-info" : "bg-warning";
  return (
    <div className="flex items-center gap-2 min-w-[110px]">
      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
        <div className={`h-full ${tone}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-muted-foreground tabular-nums">{units}/5</span>
    </div>
  );
};

const ASMAllRetailers = () => {
  const [search, setSearch] = useState("");
  const [morph, setMorph] = useState<string>("all");
  const [area, setArea] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<RetailerRow | null>(null);

  const filtered = useMemo(() => {
    return padded.filter((r) => {
      if (morph !== "all" && r.morphology !== morph) return false;
      if (area !== "all" && r.marketArea !== area) return false;
      if (
        search &&
        ![r.name, r.assignedMe, r.marketArea].some((v) =>
          v.toLowerCase().includes(search.toLowerCase()),
        )
      )
        return false;
      return true;
    });
  }, [search, morph, area]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const areas = Array.from(new Set(padded.map((r) => r.marketArea)));

  return (
    <ASMLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            All Retailers Profiles
          </h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" />
            Maharashtra · 50,000+ retailers across India
          </p>
        </div>

        {/* A. Snapshot - morphology */}
        <section>
          <h2 className="text-sm font-semibold text-foreground/70 uppercase tracking-wide mb-3">
            By morphology
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.keys(morphCount) as Morphology[]).map((m) => (
              <Card key={m} className="p-4">
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center mb-2">
                  <Store className="w-4 h-4 text-info" />
                </div>
                <p className="font-display font-bold text-2xl text-foreground">
                  {morphCount[m].toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">{m}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* B. Master table */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-3 flex-wrap">
            <div>
              <h3 className="font-semibold text-foreground">Retailers master</h3>
              <p className="text-xs text-muted-foreground">
                Click any row to view engagement history
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search retailer, ME, area"
                  className="h-8 pl-8 w-56 text-sm"
                />
              </div>
              <Select
                value={morph}
                onValueChange={(v) => {
                  setMorph(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-[180px] text-sm">
                  <SelectValue placeholder="Morphology" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All morphologies</SelectItem>
                  {(Object.keys(morphCount) as Morphology[]).map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={area}
                onValueChange={(v) => {
                  setArea(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-[160px] text-sm">
                  <SelectValue placeholder="Market area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All areas</SelectItem>
                  {areas.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Retailer</TableHead>
                  <TableHead>Morphology</TableHead>
                  <TableHead>Market area</TableHead>
                  <TableHead>Assigned ME</TableHead>
                  <TableHead>Last visited</TableHead>
                  <TableHead>Engagement units covered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.map((r) => (
                  <TableRow
                    key={r.id}
                    className="cursor-pointer"
                    onClick={() => setOpen(r)}
                  >
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {r.morphology}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.marketArea}
                    </TableCell>
                    <TableCell>{r.assignedMe}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {r.lastVisited}
                    </TableCell>
                    <TableCell>
                      <EngagementBar units={r.engagementUnits} />
                    </TableCell>
                  </TableRow>
                ))}
                {pageRows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-sm text-muted-foreground py-8"
                    >
                      No retailers match these filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="p-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing {pageRows.length} of {filtered.length.toLocaleString()} retailers
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              <span>
                Page {page} of {pageCount}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={page === pageCount}
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{open?.name}</DialogTitle>
          </DialogHeader>
          {open && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span>{open.morphology}</span>
                <span>·</span>
                <span>{open.marketArea}</span>
                <span>·</span>
                <span>ME: {open.assignedMe}</span>
                <span>·</span>
                <span>Last visited {open.lastVisited}</span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Engagement units covered
                </p>
                <EngagementBar units={open.engagementUnits} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  Engagement history & action points
                </p>
                <div className="divide-y divide-border border border-border rounded-lg">
                  {open.history.map((h, i) => (
                    <div key={i} className="p-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">{h.date}</span>
                        <span className="text-muted-foreground">{h.me}</span>
                      </div>
                      <p className="text-sm text-foreground/85 mt-1">{h.outcome}</p>
                      <p className="text-xs text-info mt-1">
                        Action point: {h.actionPoint}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </ASMLayout>
  );
};

export default ASMAllRetailers;
