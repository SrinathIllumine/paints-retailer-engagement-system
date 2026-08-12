import LeadershipLayout from "@/components/leadership/LeadershipLayout";
import { repeatedInsights } from "@/data/leadershipReports";

const Insights = () => (
  <LeadershipLayout>
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Repeated Insights</p>
        <h1 className="font-display text-2xl font-bold text-foreground">
          What are the repeated insights across markets?
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Patterns reported by MEs and ASMs that keep recurring across multiple markets, grouped by theme.
        </p>
      </header>

      <div className="bg-card border rounded-lg p-5 space-y-7">
        {repeatedInsights.map((sec) => (
          <section key={sec.num} className="grid md:grid-cols-[180px_1fr] gap-4 pb-6 border-b last:border-b-0 last:pb-0">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Section {sec.num}</p>
              <h3 className="text-[14px] font-semibold text-foreground mt-0.5">{sec.title}</h3>
            </div>
            <ol className="space-y-4 list-decimal list-inside">
              {sec.items.map((item, idx) => (
                <li key={idx}>
                  <span className="text-[13px] font-semibold text-foreground leading-snug">{item.title}</span>
                  <p className="text-[12px] text-muted-foreground italic leading-relaxed mt-1 ml-5">{item.detail}</p>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  </LeadershipLayout>
);

export default Insights;
