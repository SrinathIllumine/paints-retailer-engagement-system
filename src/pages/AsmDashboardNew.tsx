import { Link } from "react-router-dom";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const reports = [
  { me: "Aditya Salve", area: "Pune City", retailer: "Deshpande Hardware", time: "2 hours ago" },
  { me: "Shivam K", area: "Wakad", retailer: "Bhagwati Stores", time: "1 day ago" },
  { me: "Dheeraj M", area: "Baner", retailer: "Madhu Paints & Hardware", time: "2 days ago" },
  { me: "Raj Kumar", area: "Kothrud", retailer: "Deep Electricals & Paints", time: "2 days ago" },
  { me: "Sagar", area: "Hinjewadi", retailer: "Jai Stores", time: "2 days ago" },
];

const heatmap = [
  { me: "Aditya Salve", area: "Pune City", e1: 25, e1Sub: "50/200 retailers", e2: 80, e3: 80 },
  { me: "Shivam K", area: "Kothrud", e1: 100, e2: 95, e3: 85 },
  { me: "Dheeraj M", area: "Baner", e1: 90, e2: 85, e3: 85 },
  { me: "Raj Kumar", area: "Wakad", e1: 95, e2: 95, e3: 95 },
  { me: "Sagar", area: "Hinjewadi", e1: 5, e2: 0, e3: 0 },
];

const heatColor = (v: number) => {
  if (v >= 80) return "bg-success/15 text-success";
  if (v >= 40) return "bg-warning/15 text-warning";
  return "bg-destructive/15 text-destructive";
};

const objections = [
  { name: "Demand related", value: 30, color: "#E24B4A" },
  { name: "Product quality", value: 18, color: "#9FE1CB" },
  { name: "Competition related", value: 16, color: "#1F3A57" },
  { name: "SKU Space related", value: 16, color: "#5B8DBE" },
  { name: "Working Capital related", value: 16, color: "#EF9F27" },
];

const AsmDashboardNew = () => (
  <div className="min-h-screen bg-background">
    <div className="max-w-screen-xl mx-auto px-6 py-6">
      {/* Header */}
      <header className="mb-4">
        <h1 className="text-[24px] font-bold text-foreground">ASM Reports</h1>
      </header>

      {/* Sub-header strip */}
      <div className="bg-muted rounded-md px-4 py-2.5 mb-5 text-[12px] text-muted-foreground">
        <span className="font-bold text-foreground">Ravi Kumar, ASM, Pune</span>
        <span className="mx-2">|</span>
        <span>Team of 6 MEs</span>
        <span className="mx-2">|</span>
        <span>6 markets</span>
      </div>

      {/* 2x2 grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1 — Engagement Reports */}
        <div className="bg-card border rounded-lg p-4">
          <h2 className="text-[15px] font-bold text-foreground">
            1. Engagement Reports{" "}
            <span className="font-normal text-muted-foreground">(Area-level)</span>
          </h2>
          <p className="text-[12px] italic text-muted-foreground mb-3">
            Recent Reports (as on 12th May 2026)
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">ME</TableHead>
                <TableHead className="font-bold">Area</TableHead>
                <TableHead className="font-bold">Retailer Engaged</TableHead>
                <TableHead className="font-bold">Report</TableHead>
                <TableHead className="font-bold">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((r) => (
                <TableRow key={r.me + r.retailer}>
                  <TableCell>{r.me}</TableCell>
                  <TableCell>{r.area}</TableCell>
                  <TableCell>{r.retailer}</TableCell>
                  <TableCell>
                    <Link
                      to="/me/visit-summary/1"
                      className="text-primary underline underline-offset-2 hover:no-underline"
                    >
                      View Report
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{r.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Card 2 — Heatmap */}
        <div className="bg-card border rounded-lg p-4">
          <h2 className="text-[15px] font-bold text-foreground">
            2. Retailer Engagement Coverage Heatmap
          </h2>
          <p className="text-[12px] italic text-muted-foreground mb-3">
            Overall coverage from 12th March till 12th May
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-2 font-bold">ME</th>
                  <th className="text-left py-2 pr-2 font-bold">Area</th>
                  <th className="text-center py-2 px-2 font-normal">
                    Engagement 1: <span className="font-bold">Value Proposition</span>
                  </th>
                  <th className="text-center py-2 px-2 font-normal">
                    Engagement 2: <span className="font-bold">Expanding Contractor Base</span>
                  </th>
                  <th className="text-center py-2 px-2 font-normal">
                    Engagement 3: <span className="font-bold">Improving Service</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {heatmap.map((row) => (
                  <tr key={row.me} className="border-b last:border-0">
                    <td className="py-2 pr-2 font-medium">{row.me}</td>
                    <td className="py-2 pr-2 text-muted-foreground">{row.area}</td>
                    {[
                      { v: row.e1, sub: row.e1Sub },
                      { v: row.e2 },
                      { v: row.e3 },
                    ].map((c, i) => (
                      <td key={i} className="py-1.5 px-1">
                        <div
                          className={`rounded-md px-2 py-1.5 text-center font-medium ${heatColor(c.v)}`}
                        >
                          <div>{c.v}%</div>
                          {c.sub && (
                            <div className="text-[10px] opacity-70 font-normal">{c.sub}</div>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card 3 — Objections Pie */}
        <div className="bg-card border rounded-lg p-4">
          <h2 className="text-[15px] font-bold text-foreground mb-3">
            3. Top Retailer Objections{" "}
            <span className="font-normal text-muted-foreground">(in the area)</span>
          </h2>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={objections}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={90}
                  label={({ name, value }) => `${name} ${value}%`}
                  labelLine
                >
                  {objections.map((o) => (
                    <Cell key={o.name} fill={o.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 4 — Key Insights */}
        <div className="bg-card border rounded-lg p-4">
          <h2 className="text-[15px] font-bold text-foreground mb-3">
            4. Key insights from markets in Pune
          </h2>

          <div className="bg-muted rounded-md p-3 mb-3">
            <p className="text-[13px] font-bold text-foreground mb-2">
              Common insights across markets
            </p>
            <p className="text-[11px] uppercase tracking-wider text-primary underline underline-offset-2 mb-1.5">
              Scheme-related
            </p>
            <p className="text-[12px] text-foreground leading-relaxed">
              <span className="font-bold">
                Retailers are preferring schemes that are simple with less complex tier-structures
              </span>{" "}
              (instead of complex schemes that run into multiple pages — for e.g. Retailers say
              JK's 4-tier slab + bonus SKU structure is hard to understand)
            </p>
          </div>

          <div className="bg-muted rounded-md p-3">
            <p className="text-[13px] font-bold text-foreground mb-2">Market specific insights</p>
            <p className="text-[11px] uppercase tracking-wider text-primary underline underline-offset-2 mb-1.5">
              In Hinjewadi
            </p>
            <p className="text-[12px] text-foreground leading-relaxed">
              <span className="font-bold">
                Local sales reps from Chetak Paints (new local competitor) are visiting our top
                contractor-focused dealers.
              </span>{" "}
              Three of our retailers report being approached in the last 2 weeks.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AsmDashboardNew;
