import LeadershipLayout from "@/components/leadership/LeadershipLayout";
import { Card } from "@/components/ui/card";
import { engagementTrend, objectionBreakdown } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from "recharts";

const COLORS = ["hsl(0,78%,48%)", "hsl(30,80%,52%)", "hsl(210,80%,52%)", "hsl(152,60%,40%)", "hsl(220,10%,46%)"];

const mePerformance = [
  { name: "Ravi Kumar", quality: 8.2, conversations: 45, consistency: 92 },
  { name: "Sunil Sharma", quality: 7.5, conversations: 38, consistency: 85 },
  { name: "Priya Patel", quality: 7.8, conversations: 42, consistency: 88 },
  { name: "Amit Verma", quality: 6.9, conversations: 35, consistency: 76 },
  { name: "Neha Gupta", quality: 8.0, conversations: 40, consistency: 90 },
];

const EngagementAnalytics = () => (
  <LeadershipLayout>
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-foreground">Engagement Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Quality insights across the field force</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Trend */}
        <Card className="p-5">
          <h3 className="font-semibold text-foreground mb-4">Quality Score Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={engagementTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220,10%,46%)" />
              <YAxis domain={[6, 8]} tick={{ fontSize: 12 }} stroke="hsl(220,10%,46%)" />
              <Tooltip />
              <Line type="monotone" dataKey="quality" stroke="hsl(152,60%,40%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(152,60%,40%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Objection Breakdown */}
        <Card className="p-5">
          <h3 className="font-semibold text-foreground mb-4">Common Objections</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={objectionBreakdown} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name} (${value}%)`}>
                {objectionBreakdown.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ME Performance */}
      <Card className="p-5">
        <h3 className="font-semibold text-foreground mb-4">ME Performance – Engagement Quality</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mePerformance} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
            <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 12 }} stroke="hsl(220,10%,46%)" />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} stroke="hsl(220,10%,46%)" />
            <Tooltip />
            <Bar dataKey="quality" fill="hsl(0,78%,48%)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Attrition-proof note */}
      <Card className="p-4 bg-info/5 border-info/20">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-info/20 flex items-center justify-center shrink-0">
            <span className="text-info font-bold text-sm">🔒</span>
          </div>
          <div>
            <h4 className="font-semibold text-foreground text-sm">Attrition-Proof Data</h4>
            <p className="text-sm text-muted-foreground">All engagement history is retained even when MEs change. Dealer intelligence persists independently of field staff assignments.</p>
          </div>
        </div>
      </Card>
    </div>
  </LeadershipLayout>
);

export default EngagementAnalytics;
