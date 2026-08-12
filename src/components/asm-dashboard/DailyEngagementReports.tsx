import { useState } from "react";

type Objection = { text: string; cat: string; action: string; status: "agreed" | "pending" };
type Report = {
  id: number;
  me: string;
  retailer: string;
  region: string;
  date: string;
  products: string[];
  objections: Objection[];
  insights: string[];
  meNote: string;
};

const reports: Report[] = [
  { id: 1, me: "Arjun M.", retailer: "Sharma Hardware & Paints", region: "Wakad", date: "May 5", products: ["Waterproofing Solution", "Primer"],
    objections: [
      { text: "Primer settling time inconsistency from last 2 batches", cat: "Product quality", action: "Shared tech spec sheet, escalated batch to QC", status: "agreed" },
      { text: "Requesting Primer cashback extension beyond May 15", cat: "Competition", action: "Flagged to ASM for scheme team follow-up", status: "pending" },
    ],
    insights: ["Nerolac rep visited yesterday with 3% extra discount offer", "Housing project sector 67 — bulk orders likely by June"],
    meNote: "Strong advocate. High potential for Paints cross-sell." },
  { id: 2, me: "Arjun M.", retailer: "Gupta Brothers Traders", region: "Wakad", date: "May 5", products: ["Waterproofing Solution", "Paints"],
    objections: [
      { text: "Wants better bulk pricing for Waterproofing Solution above 500 units", cat: "Working capital", action: "Referred to ASM — approval required", status: "pending" },
      { text: "No Paints SKUs — shelf space needs to be created", cat: "SKU space", action: "Agreed to trial 2 SKUs — delivery within 5 days", status: "agreed" },
    ],
    insights: ["Customers asking for our Paints by name — 8 times this month"],
    meNote: "Priority account. Bulk pricing approval could lock in volume." },
  { id: 3, me: "Priya S.", retailer: "Modi Building Materials", region: "Kothrud", date: "May 5", products: ["Primer", "Paints"],
    objections: [
      { text: "Our Paints not moving — customers ask for Asian Paints", cat: "Demand", action: "Discussed painter program, offered display standee", status: "agreed" },
      { text: "Credit period too short for new Paints SKUs", cat: "Working capital", action: "Retailer requested 45-day credit — escalated to ASM", status: "pending" },
    ],
    insights: ["Asian Paints has in-store display unit — ours has none"],
    meNote: "Display investment here has cluster effect across 4 nearby shops." },
  { id: 4, me: "Ravi K.", retailer: "Agarwal Paint Store", region: "Hadapsar", date: "May 4", products: ["Waterproofing Solution"],
    objections: [
      { text: "Birla Opus offering free painter training — grassroots pull", cat: "Competition", action: "Discussed our retailer partner program, shared brochure", status: "agreed" },
      { text: "No active scheme on Waterproofing Solutions", cat: "Competition", action: "Logged for scheme team — no commitment given", status: "pending" },
    ],
    insights: ["Birla Opus ran painter training last Friday", "Contractor demand up ~30% vs same period last year"],
    meNote: "Trade activation urgently needed in Hadapsar." },
  { id: 5, me: "Sunita P.", retailer: "Krishnamurthy & Sons", region: "Pimpri", date: "May 4", products: ["Primer", "Waterproofing Solution", "Paints"],
    objections: [
      { text: "No shelf space for new Paints SKUs", cat: "SKU space", action: "Agreed to provide branded display shelf in 2 weeks", status: "agreed" },
      { text: "Cash flow tight — delayed payment from contractors", cat: "Working capital", action: "Discussed instalment ordering — referred to ASM", status: "pending" },
    ],
    insights: ["Texture finish enquiries increasing past month"],
    meNote: "Display unit here would be high-ROI. Retailer willing." },
  { id: 6, me: "Deepak R.", retailer: "Verma Paint Centre", region: "Chinchwad", date: "May 3", products: ["Paints"],
    objections: [
      { text: "Customers price sensitive — premium Paints tough to push", cat: "Demand", action: "Introduced economy range, left comparison chart", status: "agreed" },
      { text: "No margin advantage over Asian Paints", cat: "Competition", action: "Shared updated scheme — retailer found acceptable", status: "agreed" },
    ],
    insights: ["Premium texture demand low — economy segment dominant here"],
    meNote: "Needs economy sample follow-up. Conversion possible in 2 visits." },
  { id: 7, me: "Kavita B.", retailer: "Jain Hardware Mart", region: "Shivajinagar", date: "May 3", products: ["Primer"],
    objections: [
      { text: "Local plasterers recommending competitor Primer", cat: "Competition", action: "Escalated plasterer engagement program need to ASM", status: "pending" },
      { text: "Demand dip for Primer vs same period last year", cat: "Demand", action: "Shared seasonal data — rise expected post-monsoon", status: "agreed" },
    ],
    insights: ["New regional Primer brand nearby — ₹320/litre vs ours ₹390"],
    meNote: "Critical — plasterer influence can cascade rapidly." },
  { id: 8, me: "Manish T.", retailer: "Rawat Building Supplies", region: "Kondhwa", date: "Apr 30", products: ["Waterproofing Solution", "Primer"],
    objections: [
      { text: "Delivery delays — lost 2 sales last week", cat: "Working capital", action: "Escalated, shared logistics contact", status: "agreed" },
      { text: "Nerolac visited with aggressive pricing", cat: "Competition", action: "No counter-offer — requested scheme team guidance", status: "pending" },
    ],
    insights: ["2 regular contractors switched to Nerolac this month"],
    meNote: "Urgently needs pricing response. Risk of full switch in 2 weeks." },
];

const meOptions = ["All MEs", "Arjun M.", "Priya S.", "Ravi K.", "Sunita P.", "Deepak R.", "Kavita B.", "Manish T."];
const regionOptions = ["All regions", "Wakad", "Kothrud", "Hadapsar", "Pimpri", "Chinchwad", "Shivajinagar", "Kondhwa"];
const dateOptions = ["All dates", "May 5", "May 4", "May 3", "May 2", "Apr 30", "Apr 29"];

const selectClass = "text-[12px] border rounded-md px-2.5 py-1.5 bg-muted";

const DailyEngagementReports = () => {
  const [me, setMe] = useState("All MEs");
  const [region, setRegion] = useState("All regions");
  const [date, setDate] = useState("All dates");
  const [openId, setOpenId] = useState<number | null>(null);

  const setFilter = (fn: () => void) => {
    fn();
    setOpenId(null);
  };

  const filtered = reports.filter(
    (r) =>
      (me === "All MEs" || r.me === me) &&
      (region === "All regions" || r.region === region) &&
      (date === "All dates" || r.date === date),
  );

  return (
    <section className="mb-6">
      <h2 className="text-[16px] font-medium text-foreground">Daily engagement reports</h2>
      <p className="text-[12px] text-muted-foreground mb-4">
        Each ME completes 9–10 retailer visits per day · click any report to view details
      </p>

      <div className="flex gap-2 flex-wrap mb-4 items-center">
        <select className={selectClass} value={me} onChange={(e) => setFilter(() => setMe(e.target.value))}>
          {meOptions.map((o) => <option key={o}>{o}</option>)}
        </select>
        <select className={selectClass} value={region} onChange={(e) => setFilter(() => setRegion(e.target.value))}>
          {regionOptions.map((o) => <option key={o}>{o}</option>)}
        </select>
        <select className={selectClass} value={date} onChange={(e) => setFilter(() => setDate(e.target.value))}>
          {dateOptions.map((o) => <option key={o}>{o}</option>)}
        </select>
        <span className="text-[12px] text-muted-foreground ml-auto">{filtered.length} reports</span>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <div className="bg-muted grid px-3.5 py-2 grid-cols-[150px_76px_76px_86px_1fr_60px] text-[10px] uppercase tracking-wide text-muted-foreground">
          <span>Retailer</span>
          <span>ME</span>
          <span>Region</span>
          <span>Date</span>
          <span>Products</span>
          <span></span>
        </div>
        {filtered.map((r) => {
          const isOpen = openId === r.id;
          return (
            <div key={r.id}>
              <div
                className="grid grid-cols-[150px_76px_76px_86px_1fr_60px] px-3.5 py-2.5 border-t items-center cursor-pointer hover:bg-muted/50"
                onClick={() => setOpenId(isOpen ? null : r.id)}
              >
                <span className="text-[13px] font-medium text-foreground">{r.retailer}</span>
                <span className="text-[12px] text-muted-foreground">{r.me}</span>
                <span className="text-[12px] text-muted-foreground">{r.region}</span>
                <span className="text-[11px] text-muted-foreground">{r.date}</span>
                <span className="flex flex-wrap gap-1">
                  {r.products.map((p) => (
                    <span key={p} className="text-[10px] border rounded-full px-1.5 py-0.5 bg-muted text-foreground">
                      {p}
                    </span>
                  ))}
                </span>
                <button className="text-[11px] border rounded-md px-2 py-1 hover:bg-background">
                  {isOpen ? "Close" : "View"}
                </button>
              </div>
              {isOpen && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 border-t bg-muted/30">
                  <div className="bg-card border rounded-lg p-3">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">
                      Objections & action points
                    </p>
                    {r.objections.map((o, i) => (
                      <div key={i} className="mb-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[12px] text-foreground">{o.text}</span>
                          <span className="text-[10px] border rounded-full bg-muted text-muted-foreground px-1.5 py-0.5 shrink-0">
                            {o.cat}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: o.status === "agreed" ? "#1D9E75" : "#BA7517" }}
                          />
                          <span className="text-[11px] text-muted-foreground">
                            <span className="font-medium">Action:</span> {o.action}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-2.5 mt-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#1D9E75" }} /> Agreed
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#BA7517" }} /> Pending
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <div className="bg-card border rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">
                        Market insights
                      </p>
                      {r.insights.map((ins, i) => (
                        <div key={i} className="flex gap-2 mb-1.5">
                          <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "#378ADD" }} />
                          <span className="text-[12px] text-muted-foreground">{ins}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-card border rounded-lg p-3" style={{ borderLeft: "2px solid #BA7517" }}>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5">ME note</p>
                      <p className="text-[12px] text-muted-foreground italic">{r.meNote}</p>
                    </div>
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

export default DailyEngagementReports;
