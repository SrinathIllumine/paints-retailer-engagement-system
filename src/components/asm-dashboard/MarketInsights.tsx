const cards = [
  { color: "#FAC775", label: "Competition", count: 38, delta: "▲ 12 vs last week", up: true },
  { color: "#B5D4F4", label: "Customer behavior", count: 27, delta: "▲ 3 vs last week", up: true },
  { color: "#C0DD97", label: "Scheme related", count: 19, delta: "▼ 5 vs last week", up: false },
  { color: "#F5C4B3", label: "Product quality", count: 14, delta: "▼ 2 vs last week", up: false },
  { color: "#9FE1CB", label: "Demand signals", count: 31, delta: "▲ 8 vs last week", up: true },
];

const flagged = [
  { color: "#EF9F27", text: "UltraTech running 3% extra discount in Wakad & Kothrud — 18 retailers flagged, 4 signalling shelf space reallocation by May 10" },
  { color: "#1D9E75", text: "Housing project demand rising in Hadapsar sector 62–78, 7 retailers report low stock levels ahead of June–July peak" },
  { color: "#378ADD", text: "12 retailers requesting extension of Putty cashback offer beyond May 15 — scheme team follow-up needed urgently" },
  { color: "#E24B4A", text: "Putty settling time complaint raised for 3rd consecutive week — possible batch quality issue, QC escalation pending" },
];

const MarketInsights = () => (
  <section className="mb-6">
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-[15px] font-medium text-foreground">Market insights</h2>
        <p className="text-[12px] text-muted-foreground">
          Signals collected across retailer visits this week · 129 total
        </p>
      </div>
      <button className="text-[12px] border rounded-md px-2.5 py-1.5 hover:bg-muted">Deep dive ↗</button>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-muted rounded-lg p-3">
          <span className="block w-[18px] h-[18px] rounded mb-2" style={{ background: c.color }} />
          <p className="text-[11px] text-muted-foreground">{c.label}</p>
          <p className="text-[22px] font-medium text-foreground">{c.count}</p>
          <p className={`text-[11px] ${c.up ? "text-success" : "text-destructive"}`}>{c.delta}</p>
        </div>
      ))}
    </div>

    <div className="border-t pt-3">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium mb-2">
        Flagged intel this week
      </p>
      {flagged.map((f, i) => (
        <div key={i} className="flex gap-2 text-xs text-muted-foreground mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: f.color }} />
          <span>{f.text}</span>
        </div>
      ))}
    </div>
  </section>
);

export default MarketInsights;
