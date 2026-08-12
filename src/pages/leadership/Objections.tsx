import LeadershipLayout from "@/components/leadership/LeadershipLayout";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { objectionBreakdown, topObjections } from "@/data/leadershipReports";

const Objections = () => (
  <LeadershipLayout>
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Retailer Objections</p>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Key retailer objections which are repeating across dealers?
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          National roll-up of the most frequently raised retailer concerns, by category.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-[15px] font-medium text-foreground mb-3">Key retailer objections across the country</p>
          <div className="grid grid-cols-[160px_1fr] gap-4 items-center">
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={objectionBreakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius="55%"
                    outerRadius="95%"
                    paddingAngle={1}
                    stroke="none"
                  >
                    {objectionBreakdown.map((o) => (
                      <Cell key={o.name} fill={o.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              {objectionBreakdown.map((o) => (
                <div key={o.name} className="flex justify-between items-center text-[12px] border-t first:border-t-0 py-1.5">
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: o.color }} />
                    <span className="text-foreground truncate">{o.name}</span>
                  </span>
                  <span className="font-medium text-foreground ml-2">{o.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <p className="text-[15px] font-medium text-foreground mb-3">Top 5 objections repeating across the country</p>
          <ul className="space-y-4">
            {topObjections.map((o, idx) => (
              <li key={idx} className={idx > 0 ? "pt-4 border-t border-border" : ""}>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">{o.category}</p>
                <p className="text-[13px] font-semibold text-foreground leading-snug mt-0.5">{o.title}</p>
                <p className="text-[12px] text-muted-foreground italic leading-relaxed mt-1">{o.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </LeadershipLayout>
);

export default Objections;
