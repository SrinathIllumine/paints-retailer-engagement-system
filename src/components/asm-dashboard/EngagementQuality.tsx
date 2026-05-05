const meQuality = [
  { name: "Arjun M.", visits: 52, target: 50, onTime: "100%", objPV: 2.4, apPV: 1.8, score: 92 },
  { name: "Priya S.", visits: 48, target: 50, onTime: "96%", objPV: 2.1, apPV: 1.6, score: 85 },
  { name: "Ravi K.", visits: 44, target: 50, onTime: "91%", objPV: 1.9, apPV: 1.4, score: 78 },
  { name: "Sunita P.", visits: 40, target: 50, onTime: "88%", objPV: 1.7, apPV: 1.2, score: 71 },
  { name: "Deepak R.", visits: 36, target: 50, onTime: "80%", objPV: 1.5, apPV: 0.9, score: 63 },
  { name: "Kavita B.", visits: 32, target: 50, onTime: "75%", objPV: 1.3, apPV: 0.7, score: 55 },
  { name: "Manish T.", visits: 30, target: 50, onTime: "70%", objPV: 1.1, apPV: 0.6, score: 49 },
];

const tier = (score: number) => {
  if (score >= 85) return { bg: "#E1F5EE", color: "#1D9E75", bar: "#1D9E75" };
  if (score >= 65) return { bg: "#FAEEDA", color: "#BA7517", bar: "#BA7517" };
  return { bg: "#FCEBEB", color: "#E24B4A", bar: "#E24B4A" };
};

const EngagementQuality = () => (
  <section className="mb-6">
    <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
      Engagement quality · per ME
    </p>
    <p className="text-[11px] text-muted-foreground mb-3.5">
      Visits completed, on-time report submissions, objections addressed and action points agreed per visit
    </p>

    <div className="text-[12px]">
      <div className="grid grid-cols-[1fr_180px_100px_120px_120px_100px] text-[10px] uppercase tracking-wide text-muted-foreground border-b pb-2">
        <span>ME name</span>
        <span>Visits done / target</span>
        <span className="text-right">Reports on time</span>
        <span className="text-right">Avg objections / visit</span>
        <span className="text-right">Avg action pts / visit</span>
        <span className="text-right">Quality score</span>
      </div>
      {meQuality.map((m) => {
        const t = tier(m.score);
        return (
          <div
            key={m.name}
            className="grid grid-cols-[1fr_180px_100px_120px_120px_100px] py-2.5 border-t items-center"
          >
            <span className="text-foreground font-medium">{m.name}</span>
            <span className="flex items-center gap-2">
              <span className="text-foreground">
                {m.visits} / {m.target}
              </span>
              <div className="w-14 h-1 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.min(100, (m.visits / m.target) * 100)}%`, background: t.bar }}
                />
              </div>
            </span>
            <span className="text-right text-foreground">{m.onTime}</span>
            <span className="text-right text-foreground">{m.objPV}</span>
            <span className="text-right text-foreground">{m.apPV}</span>
            <span className="text-right">
              <span
                className="rounded-full px-2 py-0.5 text-xs font-medium"
                style={{ background: t.bg, color: t.color }}
              >
                {m.score}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  </section>
);

export default EngagementQuality;
