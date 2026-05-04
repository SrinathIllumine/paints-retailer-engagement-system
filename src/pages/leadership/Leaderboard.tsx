import LeadershipLayout from "@/components/leadership/LeadershipLayout";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { objectionTypes, stateObjectionMatrix, states, topMEs } from "@/data/leadershipData";
import { Award, Medal, TrendingDown, TrendingUp, Trophy } from "lucide-react";

const fmt = (value: number) => value.toLocaleString("en-IN");
const avg = (values: number[]) => Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
const growth = (values: number[]) => Math.round(((values[values.length - 1] - values[0]) / values[0]) * 100);

const topStates = [...states].sort((a, b) => b.unitsCovered - a.unitsCovered || b.retailersEngaged / b.totalRetailers - a.retailersEngaged / a.totalRetailers).slice(0, 5);
const bottomStates = [...states].sort((a, b) => a.unitsCovered - b.unitsCovered || a.retailersEngaged / a.totalRetailers - b.retailersEngaged / b.totalRetailers).slice(0, 5);
const topObjections = objectionTypes
  .map((type) => ({ objection: type, count: Object.values(stateObjectionMatrix).reduce((sum, row) => sum + row[type], 0) }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 5);

const Leaderboard = () => (
  <LeadershipLayout>
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Leaderboard</p>
        <h1 className="font-display text-2xl font-bold text-foreground">Leaderboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Rankings focused on engagement consistency, Engagement Units coverage, and objection intensity.
        </p>
      </header>

      <Card className="p-5 border-border/70 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">Top MEs</h2>
            <p className="text-sm text-muted-foreground">MEs with consistent month-on-month engagement.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
          {topMEs.slice(0, 8).map((me, index) => (
            <div key={me.id} className="rounded-md border border-border/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge variant="secondary">#{index + 1}</Badge>
                  <p className="mt-3 font-semibold text-foreground">{me.name}</p>
                  <p className="text-xs text-muted-foreground">{me.area}, {me.state}</p>
                </div>
                <Medal className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-md bg-muted/50 p-2">
                  <p className="text-xs text-muted-foreground">Avg/month</p>
                  <p className="font-semibold text-foreground">{avg(me.monthlyEngagements)}</p>
                </div>
                <div className="rounded-md bg-muted/50 p-2">
                  <p className="text-xs text-muted-foreground">MoM growth</p>
                  <p className="font-semibold text-success">+{growth(me.monthlyEngagements)}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="p-5 border-border/70 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-success" />
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">Top 5 Performing States</h2>
              <p className="text-sm text-muted-foreground">Ranked by Engagement Units Coverage.</p>
            </div>
          </div>
          <div className="space-y-3">
            {topStates.map((state, index) => (
              <div key={state.state} className="flex items-center justify-between gap-3 rounded-md border border-border/70 p-3">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">#{index + 1}</Badge>
                  <div>
                    <p className="font-medium text-foreground">{state.state}</p>
                    <p className="text-xs text-muted-foreground">State Head: {state.stateHead}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl font-bold text-foreground">{state.unitsCovered}/5</p>
                  <p className="text-xs text-muted-foreground">{Math.round((state.retailersEngaged / state.totalRetailers) * 100)}% engaged</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 border-border/70 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <TrendingDown className="h-5 w-5 text-destructive" />
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">Bottom 5 Performing States</h2>
              <p className="text-sm text-muted-foreground">States lagging in Engagement Units Coverage.</p>
            </div>
          </div>
          <div className="space-y-3">
            {bottomStates.map((state, index) => (
              <div key={state.state} className="flex items-center justify-between gap-3 rounded-md border border-border/70 p-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-destructive/30 text-destructive">#{index + 1}</Badge>
                  <div>
                    <p className="font-medium text-foreground">{state.state}</p>
                    <p className="text-xs text-muted-foreground">State Head: {state.stateHead}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl font-bold text-foreground">{state.unitsCovered}/5</p>
                  <p className="text-xs text-muted-foreground">{Math.round((state.retailersEngaged / state.totalRetailers) * 100)}% engaged</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card className="p-5 border-border/70 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <Award className="h-5 w-5 text-primary" />
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">Top 5 Objections (National)</h2>
            <p className="text-sm text-muted-foreground">Most frequently raised objections across the retail network.</p>
          </div>
        </div>
        <div className="space-y-3">
          {topObjections.map((item, index) => {
            const max = topObjections[0].count;
            return (
              <div key={item.objection} className="rounded-md border border-border/70 p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">#{index + 1}</Badge>
                    <p className="font-medium text-foreground">{item.objection}</p>
                  </div>
                  <p className="font-semibold text-foreground">{fmt(item.count)} retailers</p>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${(item.count / max) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  </LeadershipLayout>
);

export default Leaderboard;
