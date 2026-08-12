import { Pie, PieChart, ResponsiveContainer } from "recharts";

const objections = [
  { text: '"Competitor brand offering better margin / discount"', cat: "Competition", count: 38, barColor: "#1D9E75", pillBg: "#E1F5EE", pillText: "#085041" },
  { text: '"Not enough credit period — cash flow is tight"', cat: "Working capital", count: 29, barColor: "#D85A30", pillBg: "#FAECE7", pillText: "#4A1B0C" },
  { text: '"End-customer demand for Waterproofing Solutions is low"', cat: "Demand", count: 26, barColor: "#BA7517", pillBg: "#FAEEDA", pillText: "#412402" },
  { text: '"No shelf space — other brands occupy prime slots"', cat: "SKU space", count: 22, barColor: "#378ADD", pillBg: "#E6F1FB", pillText: "#042C53" },
  { text: '"Our Paints not moving — customers prefer established brands"', cat: "Demand", count: 19, barColor: "#BA7517", pillBg: "#FAEEDA", pillText: "#412402" },
  { text: '"Primer quality inconsistency — painters complaining"', cat: "Product quality", count: 14, barColor: "#E24B4A", pillBg: "#FCEBEB", pillText: "#501313" },
  { text: '"Delivery delays disrupting stock planning"', cat: "Working capital", count: 11, barColor: "#D85A30", pillBg: "#FAECE7", pillText: "#4A1B0C" },
  { text: '"No active scheme on Waterproofing Solutions unlike competitors"', cat: "Competition", count: 9, barColor: "#1D9E75", pillBg: "#E1F5EE", pillText: "#085041" },
];

const donutData = [
  { name: "Demand", value: 29, fill: "#EF9F27" },
  { name: "Product quality", value: 12, fill: "#E24B4A" },
  { name: "Working capital", value: 24, fill: "#D85A30" },
  { name: "SKU space", value: 16, fill: "#378ADD" },
  { name: "Competition", value: 19, fill: "#1D9E75" },
];

const legendOrdered = [
  { name: "Demand", value: 29, fill: "#EF9F27" },
  { name: "Working capital", value: 24, fill: "#D85A30" },
  { name: "Competition", value: 19, fill: "#1D9E75" },
  { name: "SKU space", value: 16, fill: "#378ADD" },
  { name: "Product quality", value: 12, fill: "#E24B4A" },
];

const ObjectionsAndDonut = () => {
  const max = Math.max(...objections.map((o) => o.count));
  return (
    <section className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-3 mb-6">
      <div>
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium mb-4">
          Detailed objections raised this week
        </p>
        {objections.map((o, i) => (
          <div key={i} className="flex items-center gap-2.5 py-2.5 border-t">
            <span className="text-[12px] flex-1 text-foreground">{o.text}</span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0"
              style={{ background: o.pillBg, color: o.pillText }}
            >
              {o.cat}
            </span>
            <div className="w-14 h-1 rounded-full bg-muted overflow-hidden shrink-0">
              <div
                className="h-full rounded-full"
                style={{ width: `${(o.count / max) * 100}%`, background: o.barColor }}
              />
            </div>
            <span className="text-[13px] font-medium min-w-7 text-right text-foreground">{o.count}</span>
          </div>
        ))}
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-3">Objection categories</p>
        <div className="flex flex-wrap gap-3.5 text-xs text-muted-foreground mb-2">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: "#EF9F27" }} />Demand</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: "#E24B4A" }} />Quality</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: "#D85A30" }} />Working capital</span>
        </div>
        <div className="flex flex-wrap gap-3.5 text-xs text-muted-foreground mb-2">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: "#378ADD" }} />SKU space</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: "#1D9E75" }} />Competition</span>
        </div>
        <div style={{ height: 190 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                dataKey="value"
                nameKey="name"
                innerRadius="60%"
                outerRadius="100%"
                paddingAngle={0}
                stroke="none"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2">
          {legendOrdered.map((l) => (
            <div key={l.name} className="flex justify-between text-xs border-t py-1">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-sm" style={{ background: l.fill }} />
                <span className="text-foreground">{l.name}</span>
              </span>
              <span className="font-medium text-foreground">{l.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ObjectionsAndDonut;
