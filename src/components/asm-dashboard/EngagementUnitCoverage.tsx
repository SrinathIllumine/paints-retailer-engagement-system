import { useState } from "react";

const comparison = [
  { eu: "Alignment to multi-product vision", nat: 55, zone: 48, delta: -7 },
  { eu: "Initial success as new retailer", nat: 38, zone: 42, delta: 4 },
  { eu: "Building contractor / painter pool", nat: 44, zone: 36, delta: -8 },
  { eu: "Retailer market awareness", nat: 58, zone: 65, delta: 7 },
  { eu: "Value proposition realisation", nat: 35, zone: 26, delta: -9 },
];

const meData = [
  { name: "Arjun M.", area: "Wakad", visits: 248, eu: [118, 96, 86, 148, 62] },
  { name: "Priya S.", area: "Kothrud", visits: 232, eu: [108, 88, 80, 138, 56] },
  { name: "Ravi K.", area: "Hadapsar", visits: 218, eu: [100, 82, 74, 128, 50] },
  { name: "Sunita P.", area: "Pimpri", visits: 204, eu: [92, 76, 68, 118, 44] },
  { name: "Deepak R.", area: "Chinchwad", visits: 188, eu: [84, 70, 62, 110, 40] },
  { name: "Kavita B.", area: "Shivajinagar", visits: 172, eu: [76, 64, 54, 102, 34] },
  { name: "Manish T.", area: "Kondhwa", visits: 158, eu: [66, 56, 46, 92, 28] },
];

const euNames = [
  "Alignment to multi-product vision",
  "Initial success as new retailer",
  "Building contractor / painter pool",
  "Retailer market awareness",
  "Value proposition realisation",
];
const euColors = ["#378ADD", "#1D9E75", "#D85A30", "#BA7517", "#534AB7"];
const natPct = [0.55, 0.38, 0.44, 0.58, 0.35];

const DeltaPill = ({ value }: { value: number }) => {
  const positive = value >= 0;
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        positive ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
      }`}
    >
      {positive ? "+" : ""}
      {value}%
    </span>
  );
};

const Pentagon = ({ eu }: { eu: number[] }) => {
  const cx = 132;
  const cy = 138;
  const R = 82;
  const angle = (i: number) => -Math.PI / 2 + (2 * Math.PI * i) / 5;
  const point = (i: number, scale: number) => {
    const a = angle(i);
    return [cx + Math.cos(a) * R * scale, cy + Math.sin(a) * R * scale];
  };
  const polyPoints = (scale: number | number[]) =>
    [0, 1, 2, 3, 4]
      .map((i) => {
        const s = Array.isArray(scale) ? scale[i] : scale;
        const [x, y] = point(i, s);
        return `${x},${y}`;
      })
      .join(" ");

  const labels = [
    { l1: "Multi-product", l2: "alignment", anchor: "middle" as const, dx: 0, dy: -14 },
    { l1: "New retailer", l2: "success", anchor: "start" as const, dx: 9, dy: 3 },
    { l1: "Contractor /", l2: "painter pool", anchor: "start" as const, dx: 9, dy: 14 },
    { l1: "Market", l2: "awareness", anchor: "end" as const, dx: -9, dy: 14 },
    { l1: "Value prop", l2: "realisation", anchor: "end" as const, dx: -9, dy: 3 },
  ];

  return (
    <svg viewBox="0 0 264 270" width="100%" style={{ maxWidth: 264 }}>
      {/* legend */}
      <g transform="translate(160, 10)" fontSize="9" fill="hsl(var(--muted-foreground))">
        <line x1="0" y1="4" x2="14" y2="4" stroke="#BA7517" strokeWidth="1.5" />
        <text x="18" y="7">Pune zone</text>
        <line x1="0" y1="18" x2="14" y2="18" stroke="rgba(0,0,0,0.22)" strokeWidth="1" strokeDasharray="3 3" />
        <text x="18" y="21">National avg</text>
      </g>

      {/* grid */}
      {[0.25, 0.5, 0.75, 1].map((s) => (
        <polygon key={s} points={polyPoints(s)} stroke="rgba(0,0,0,0.07)" strokeWidth="0.5" fill="none" />
      ))}
      {/* axes */}
      {[0, 1, 2, 3, 4].map((i) => {
        const [x, y] = point(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(0,0,0,0.09)" strokeWidth="0.5" />;
      })}
      {/* national */}
      <polygon
        points={polyPoints(natPct)}
        stroke="rgba(0,0,0,0.22)"
        strokeDasharray="3 3"
        strokeWidth="1"
        fill="none"
      />
      {/* ME */}
      <polygon
        points={polyPoints(eu.map((v) => v / 200))}
        fill="rgba(186,117,23,0.14)"
        stroke="#BA7517"
        strokeWidth="1.5"
      />
      {/* dots + value labels */}
      {[0, 1, 2, 3, 4].map((i) => {
        const [x, y] = point(i, eu[i] / 200);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={3} fill="#BA7517" />
            <text x={x} y={y - 6} fontSize="9.5" fontWeight="500" fill="#854F0B" textAnchor="middle">
              {Math.round((eu[i] / 200) * 100)}%
            </text>
          </g>
        );
      })}
      {/* labels */}
      {labels.map((lbl, i) => {
        const [x, y] = point(i, 1);
        return (
          <text
            key={i}
            x={x + lbl.dx}
            y={y + lbl.dy}
            fontSize="8.5"
            textAnchor={lbl.anchor}
            fill="hsl(var(--muted-foreground))"
          >
            <tspan x={x + lbl.dx}>{lbl.l1}</tspan>
            <tspan x={x + lbl.dx} dy="10">{lbl.l2}</tspan>
          </text>
        );
      })}
    </svg>
  );
};

const EngagementUnitCoverage = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-[15px] font-medium text-foreground">Engagement unit coverage</h2>
          <p className="text-[12px] text-muted-foreground">
            Overall · % of retailers who have received each engagement unit
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Natl avg EU / retailer</p>
          <p className="text-[20px] font-medium text-foreground">
            2.3 <span className="text-[11px] text-muted-foreground font-normal">of 5</span>
          </p>
        </div>
      </div>

      {/* comparison table */}
      <div className="mb-6 text-[13px]">
        <div className="grid grid-cols-[1fr_100px_100px_90px] text-[10px] uppercase tracking-wide text-muted-foreground border-b pb-2">
          <span>Engagement unit</span>
          <span className="text-right">National</span>
          <span className="text-right">Pune zone</span>
          <span className="text-right">vs national</span>
        </div>
        {comparison.map((c) => (
          <div
            key={c.eu}
            className="grid grid-cols-[1fr_100px_100px_90px] py-2.5 border-t items-center"
          >
            <span className="text-foreground">{c.eu}</span>
            <span className="text-right text-muted-foreground">{c.nat}%</span>
            <span className="text-right text-foreground font-medium">{c.zone}%</span>
            <span className="text-right">
              <DeltaPill value={c.delta} />
            </span>
          </div>
        ))}
      </div>

      {/* ME breakdown */}
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium mb-1">
        Coverage by ME · overall
      </p>
      <p className="text-[11px] text-muted-foreground mb-3">
        Click view to see pentagonal EU breakdown per ME across their 200 retailers
      </p>

      <div className="border rounded-xl overflow-hidden">
        <div className="bg-muted px-3.5 py-2 grid grid-cols-[1fr_110px_90px_90px_120px_64px] text-[10px] uppercase tracking-wide text-muted-foreground">
          <span>ME name</span>
          <span>Market area</span>
          <span className="text-center">Visits so far</span>
          <span className="text-center">Target EU</span>
          <span>EU covered</span>
          <span></span>
        </div>
        {meData.map((me, i) => {
          const total = me.eu.reduce((a, b) => a + b, 0);
          const ratio = (total / 200).toFixed(1);
          const isOpen = openIdx === i;
          return (
            <div key={me.name}>
              <div className="grid grid-cols-[1fr_110px_90px_90px_120px_64px] px-3.5 py-2.5 items-center border-t">
                <span className="text-[13px] font-medium text-foreground">{me.name}</span>
                <span className="text-[12px] text-muted-foreground">{me.area}</span>
                <span className="text-[13px] font-medium text-center">{me.visits}</span>
                <span className="text-[13px] font-medium text-center">1,050</span>
                <span className="text-[13px]">
                  {total} <span className="text-[11px] text-muted-foreground">({ratio}/r)</span>
                </span>
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="text-[11px] border rounded-md px-2 py-1 hover:bg-muted"
                >
                  {isOpen ? "Close" : "View"}
                </button>
              </div>
              {isOpen && (
                <div className="grid grid-cols-1 md:grid-cols-[264px_1fr] gap-4 p-3.5 border-t bg-muted/30">
                  <div className="relative">
                    <Pentagon eu={me.eu} />
                  </div>
                  <div className="relative">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-[11px] text-muted-foreground">
                        Retailers covered per EU · out of 200
                      </p>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          Natl avg EU / retailer
                        </p>
                        <p className="text-[18px] font-medium text-foreground">
                          2.3{" "}
                          <span className="text-[11px] text-muted-foreground font-normal">
                            vs {ratio} here
                          </span>
                        </p>
                      </div>
                    </div>
                    {me.eu.map((count, j) => {
                      const pct = Math.round((count / 200) * 100);
                      const delta = pct - Math.round(natPct[j] * 100);
                      return (
                        <div key={j} className="flex items-center gap-2.5 py-2 border-t">
                          <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: euColors[j] }} />
                          <span className="text-[12px] flex-1 text-foreground">{euNames[j]}</span>
                          <span className="text-[12px] font-medium text-foreground text-right w-8">{count}</span>
                          <div className="w-16 h-1 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${pct}%`, background: euColors[j] }}
                            />
                          </div>
                          <span className="text-[11px] text-muted-foreground w-8 text-right">{pct}%</span>
                          <DeltaPill value={delta} />
                        </div>
                      );
                    })}
                    <p className="text-[11px] text-muted-foreground mt-2.5 pt-2 border-t">
                      Delta shown vs national average per EU
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default EngagementUnitCoverage;
