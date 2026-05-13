import ASMLayout from "@/components/asm/ASMLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MapPin } from "lucide-react";

type Tier = "high" | "moderate" | "low";
type StatusTone = "green" | "orange" | "red" | "red-strong";

const tierPill: Record<Tier, string> = {
  high: "bg-success/10 text-success",
  moderate: "bg-warning/10 text-warning",
  low: "bg-destructive/10 text-destructive",
};

const statusClass: Record<StatusTone, string> = {
  green: "bg-success/10 text-success border-success/20",
  orange: "bg-warning/10 text-warning border-warning/20",
  red: "bg-destructive/10 text-destructive border-destructive/20",
  "red-strong": "bg-destructive/15 text-destructive border-destructive/30 font-semibold",
};

interface Row {
  me: string;
  area: string;
  eq: Tier;
  sales: Tier;
  status: { label: string; tone: StatusTone };
}

const leaderboard: Row[] = [
  { me: "Aditya Salve", area: "Pune City", eq: "high",     sales: "high",     status: { label: "Top Performer", tone: "green" } },
  { me: "Shivam K",     area: "Wakad",     eq: "moderate", sales: "high",     status: { label: "Can Improve", tone: "orange" } },
  { me: "Dheeraj M",    area: "Baner",     eq: "low",      sales: "moderate", status: { label: "Needs significant Improvement", tone: "red" } },
  { me: "Raj Kumar",    area: "Kothrud",   eq: "low",      sales: "moderate", status: { label: "Needs significant Improvement", tone: "red" } },
  { me: "Sagar",        area: "\u200BHinjenwadi", eq: "low",      sales: "low",      status: { label: "Needs immediate attention", tone: "red-strong" } },
  { me: "Mayank",       area: "Yerwada",   eq: "moderate", sales: "moderate", status: { label: "Can Improve", tone: "orange" } },
];

const Pill = ({ tier }: { tier: Tier }) => (
  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${tierPill[tier]}`}>
    {tier.toUpperCase()}
  </span>
);

const ASMLeaderboard = () => {
  return (
    <ASMLayout hideFilters>
      <div className="space-y-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            ME Leaderboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" />
            ME leaderboard w.r.t. sales &amp; engagement levels · Pune · 6 MEs
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Performance ranking</h3>
            <p className="text-xs text-muted-foreground">
              Combined view of engagement quality &amp; sales growth
            </p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>ME</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Engagement Quality</TableHead>
                  <TableHead>Sales Growth</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((r, i) => (
                  <TableRow key={r.me} className="hover:bg-muted/40">
                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-medium text-foreground">{r.me}</TableCell>
                    <TableCell className="text-muted-foreground">{r.area}</TableCell>
                    <TableCell><Pill tier={r.eq} /></TableCell>
                    <TableCell><Pill tier={r.sales} /></TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs font-medium ${statusClass[r.status.tone]}`}
                      >
                        {r.status.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </ASMLayout>
  );
};

export default ASMLeaderboard;
