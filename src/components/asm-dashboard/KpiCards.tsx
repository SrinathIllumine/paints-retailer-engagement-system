const kpis = [
  { label: "Engagements (week)", value: "342", sub: "Target: 500", pct: 68, color: "bg-warning" },
  { label: "Avg. daily engagements / ME", value: "8.7", sub: "Target: 10 / day", pct: 87, color: "bg-success" },
  { label: "Retailers covered", value: "187", sub: "of 1,400 assigned", pct: 62, color: "bg-info" },
  { label: "Active MEs today", value: "6", sub: "of 7 MEs", pct: 86, color: "bg-warning" },
];

const KpiCards = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
    {kpis.map((k) => (
      <div key={k.label} className="bg-muted rounded-lg p-4">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{k.label}</p>
        <p className="text-[28px] font-medium leading-tight mt-1 text-foreground">{k.value}</p>
        <p className="text-[12px] text-muted-foreground mt-1">{k.sub}</p>
        <div className="h-[3px] bg-background rounded-full mt-2.5 overflow-hidden">
          <div className={`h-full rounded-full ${k.color}`} style={{ width: `${k.pct}%` }} />
        </div>
      </div>
    ))}
  </div>
);

export default KpiCards;
