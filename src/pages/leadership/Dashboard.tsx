import LeadershipLayout from "@/components/leadership/LeadershipLayout";
import { Card } from "@/components/ui/card";
import { kpiData, engagementTrend, segmentationData } from "@/data/mockData";
import { Users, MessageSquare, TrendingUp, Rocket, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

const kpis = [
  { icon: Users, label: "Total Dealers", value: kpiData.totalDealers.toLocaleString(), change: "+124 this month", color: "text-info" },
  { icon: MessageSquare, label: "Today's Conversations", value: kpiData.conversationsToday.toString(), change: "66.67% of target", color: "text-success" },
  { icon: TrendingUp, label: "Engagement Quality", value: `${kpiData.engagementQualityIndex}/10`, change: "+0.4 vs last month", color: "text-warning" },
  { icon: Rocket, label: "Launch Readiness", value: `${kpiData.launchReadiness}%`, change: "JK Paint Ultima", color: "text-primary" },
];

const Dashboard = () => (
  <LeadershipLayout>
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Dealer engagement overview - April 14, 2026</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <Card key={i} className="kpi-card animate-slide-up" style={{ animationDelay: `${i * 60}ms`, animationFillMode: "backwards" }}>
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-primary-foreground" />
            </div>
            <p className="font-display font-bold text-2xl text-foreground mt-3">{kpi.value}</p>
            <p className="text-sm text-muted-foreground">{kpi.label}</p>
            <p className="text-xs text-success mt-1">{kpi.change}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Trend */}
        <Card className="p-5">
          <h3 className="font-semibold text-foreground mb-4">Engagement Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={engagementTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220,10%,46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220,10%,46%)" />
              <Tooltip />
              <Line type="monotone" dataKey="conversations" stroke="hsl(0,78%,48%)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Dealer Segments */}
        <Card className="p-5">
          <h3 className="font-semibold text-foreground mb-4">Dealer Segmentation</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={segmentationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(220,10%,46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220,10%,46%)" />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(0,78%,48%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  </LeadershipLayout>
);

export default Dashboard;
