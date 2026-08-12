// Data for the Leadership Reports app (3-tab rewrite).
// Self-contained: does not reuse leadershipData.ts so the MCP tools that
// still read from that file are unaffected by this rewrite.

// ---------- Tab 1: Engagement quality across markets ----------

export interface StateEngagement {
  state: string; // must match the `name` property in src/data/geo/india-states.json (Odisha is aliased from "Orissa" in the map component)
  score: number; // 0–10 engagement quality score
  retailersEngaged: number;
  totalRetailers: number;
}

export const stateEngagement: StateEngagement[] = [
  { state: "Maharashtra", score: 7.8, retailersEngaged: 5760, totalRetailers: 7200 },
  { state: "Gujarat", score: 7.2, retailersEngaged: 4900, totalRetailers: 6400 },
  { state: "Rajasthan", score: 6.8, retailersEngaged: 4200, totalRetailers: 5600 },
  { state: "Karnataka", score: 7.0, retailersEngaged: 3850, totalRetailers: 5200 },
  { state: "Tamil Nadu", score: 5.8, retailersEngaged: 3650, totalRetailers: 5000 },
  { state: "Uttar Pradesh", score: 5.2, retailersEngaged: 4100, totalRetailers: 5800 },
  { state: "Madhya Pradesh", score: 5.6, retailersEngaged: 3050, totalRetailers: 4600 },
  { state: "West Bengal", score: 4.4, retailersEngaged: 2850, totalRetailers: 4400 },
  { state: "Telangana", score: 6.9, retailersEngaged: 3050, totalRetailers: 4200 },
  { state: "Punjab", score: 4.0, retailersEngaged: 1900, totalRetailers: 3200 },
  { state: "Bihar", score: 3.6, retailersEngaged: 1650, totalRetailers: 2900 },
  { state: "Odisha", score: 3.0, retailersEngaged: 1140, totalRetailers: 2300 },
];

export interface MarketReport {
  district: string; // must match the `district` property in src/data/geo/maharashtra-districts.json
  market: string;
  tradingAreaPotentialCr: number; // Rs crores, as mapped by DGs
  salesRsLakh: number; // Rs lakhs, our sales from this market
  commonObjections: string[];
  engagementQuality: number; // out of 10
  retailerSuggestions: string;
}

const handAuthoredMarkets: MarketReport[] = [
  {
    district: "Pune",
    market: "Pimpri Chinchwad Market",
    tradingAreaPotentialCr: 50,
    salesRsLakh: 50,
    commonObjections: ["Perception of our Product Quality among contractors is poor", "Birla has better schemes than us"],
    engagementQuality: 4.5,
    retailerSuggestions: "Few large contractors control the market. They are carrying negative perception about our product quality based on past experiences.",
  },
  {
    district: "Mumbai",
    market: "South Mumbai Market",
    tradingAreaPotentialCr: 80,
    salesRsLakh: 62,
    commonObjections: ["Premium segment customers prefer international brands", "Limited shelf space in high-rent retail stores"],
    engagementQuality: 7.8,
    retailerSuggestions: "Retailers here want more co-branded marketing support and faster replenishment cycles to keep up with premium demand.",
  },
  {
    district: "Mumbai Suburban",
    market: "Andheri-Borivali Market",
    tradingAreaPotentialCr: 64,
    salesRsLakh: 46,
    commonObjections: ["Delivery delays during peak festive season", "Painters want faster-drying options for occupied homes"],
    engagementQuality: 7.1,
    retailerSuggestions: "Retailers suggest a dedicated fast-lane delivery slot for this cluster given the density of premium repaint projects.",
  },
  {
    district: "Thane",
    market: "Thane Market",
    tradingAreaPotentialCr: 45,
    salesRsLakh: 31,
    commonObjections: ["New residential projects are demanding bulk waterproofing quotes", "Asian Paints has a stronger dealer network here"],
    engagementQuality: 6.9,
    retailerSuggestions: "Retailers want a waterproofing-specialist ME visit ahead of the monsoon season to capture upcoming project demand.",
  },
  {
    district: "Nagpur",
    market: "Nagpur City Market",
    tradingAreaPotentialCr: 32,
    salesRsLakh: 18,
    commonObjections: ["Nerolac running aggressive discounting this quarter", "Retailers feel scheme payouts are delayed"],
    engagementQuality: 5.6,
    retailerSuggestions: "Faster scheme settlement and a matched counter-offer to the ongoing competitor discount would help retain volume here.",
  },
  {
    district: "Nashik",
    market: "Nashik Market",
    tradingAreaPotentialCr: 28,
    salesRsLakh: 17,
    commonObjections: ["Contractors want smaller pack sizes for repaint jobs", "Limited in-shop display materials"],
    engagementQuality: 6.3,
    retailerSuggestions: "Retailers are asking for more frequent display refreshes and smaller SKUs suited to occupied-home repainting.",
  },
  {
    district: "Aurangabad",
    market: "Aurangabad Market",
    tradingAreaPotentialCr: 24,
    salesRsLakh: 15,
    commonObjections: ["Retailers want simpler scheme structures", "Slow-moving stock is blocking working capital"],
    engagementQuality: 6.5,
    retailerSuggestions: "A points-based scheme with quarterly redemption would be easier to explain to contractors than the current tiered structure.",
  },
  {
    district: "Kolhapur",
    market: "Kolhapur Market",
    tradingAreaPotentialCr: 20,
    salesRsLakh: 11,
    commonObjections: ["Painters recommend a competitor primer more often", "Credit period too short for new SKUs"],
    engagementQuality: 5.9,
    retailerSuggestions: "Retailers suggest extending credit terms for first-time waterproofing solution orders to build trial volume.",
  },
  {
    district: "Solapur",
    market: "Solapur Market",
    tradingAreaPotentialCr: 18,
    salesRsLakh: 8,
    commonObjections: ["Demand has softened after early monsoon onset", "No active scheme on our waterproofing range"],
    engagementQuality: 4.8,
    retailerSuggestions: "Retailers want a seasonal scheme on waterproofing solutions timed to the monsoon to offset the demand dip.",
  },
  {
    district: "Amravati",
    market: "Amravati Market",
    tradingAreaPotentialCr: 14,
    salesRsLakh: 4,
    commonObjections: ["Retailers feel under-served by ME visit frequency", "Competitor brands are more visible on shelf"],
    engagementQuality: 3.8,
    retailerSuggestions: "This market needs urgent trade activation — retailers are open to switching shelf space if visit cadence doesn't improve.",
  },
  {
    district: "Nanded",
    market: "Nanded Market",
    tradingAreaPotentialCr: 16,
    salesRsLakh: 5,
    commonObjections: ["Product consistency changes batch-to-batch, retailers say", "Few active contractors control most of the volume"],
    engagementQuality: 4.1,
    retailerSuggestions: "QC escalation on recent batches plus a contractor-pool building push would help rebuild confidence here.",
  },
  {
    district: "Satara",
    market: "Satara Market",
    tradingAreaPotentialCr: 19,
    salesRsLakh: 10,
    commonObjections: ["Retailers want more painter loyalty scheme visibility", "Shelf space shared with three other brands"],
    engagementQuality: 6.0,
    retailerSuggestions: "A dedicated display stand and clearer painter-scheme communication would help this market gain shelf priority.",
  },
];

const autoDistricts = [
  "Ahmadnagar", "Akola", "Bhandara", "Bid", "Buldana", "Chandrapur", "Dhule",
  "Gadchiroli", "Gondiya", "Hingoli", "Jalgaon", "Jalna", "Latur", "Osmanabad",
  "Palghar", "Parbhani", "Raigarh", "Ratnagiri", "Sangli", "Sindhudurg",
  "Washim", "Wardha", "Yavatmal", "Nandurbar",
];

const objectionVariants = [
  ["Retailers want a simpler, faster-paying scheme structure", "Competitor brands are offering better credit terms"],
  ["Painters are asking for smaller, more affordable pack sizes", "Shelf space is shared with two other established brands"],
  ["Retailers feel ME visit frequency has dropped this quarter", "Demand has softened following the local monsoon onset"],
  ["Stock has been sitting too long and is blocking working capital", "No active scheme on our waterproofing range here"],
];

const suggestionVariants = [
  "Retailers here would respond well to a display-material refresh and a clearer painter loyalty scheme.",
  "A faster scheme settlement cycle and a matched competitor counter-offer would help retain volume in this market.",
  "This market needs a dedicated trade activation push — retailers are open to expanding shelf space with more ME support.",
  "Retailers suggest smaller trial SKUs and extended credit terms to build confidence before committing to bulk orders.",
];

const hashScore = (name: string, min: number, max: number) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return Math.round((min + (h % 1000) / 1000 * (max - min)) * 10) / 10;
};

const autoAuthoredMarkets: MarketReport[] = autoDistricts.map((district, i) => {
  const quality = hashScore(district, 3.0, 8.2);
  const potential = 8 + (hashScore(district + "p", 0, 30));
  const sales = Math.round(potential * (quality / 12) * 10) / 10;
  return {
    district,
    market: `${district} Market`,
    tradingAreaPotentialCr: Math.round(potential),
    salesRsLakh: Math.round(sales),
    commonObjections: objectionVariants[i % objectionVariants.length],
    engagementQuality: quality,
    retailerSuggestions: suggestionVariants[i % suggestionVariants.length],
  };
});

export const maharashtraMarkets: MarketReport[] = [...handAuthoredMarkets, ...autoAuthoredMarkets];

export const getMarketByDistrict = (district: string): MarketReport | undefined =>
  maharashtraMarkets.find((m) => m.district === district);

// ---------- Tab 2: Repeated insights across markets ----------

export interface InsightItem {
  title: string;
  detail: string;
}

export interface InsightSection {
  num: number;
  title: string;
  items: InsightItem[];
}

export const repeatedInsights: InsightSection[] = [
  {
    num: 1,
    title: "Competition Related",
    items: [
      { title: "Birla Opus piloting EMI payments for retailers", detail: "Birla offering 30/60/90 day EMI on bulk orders. Particularly attractive to declining retailers with working-capital pressure. Adoption rising in west and south markets." },
      { title: "Asian Paints locking-in retailers with bundled Primer schemes", detail: "Schemes on Paints are conditional on bundled Primer purchases above 50 units. Changing monthly primer order decisions across four states." },
      { title: "Chetak Paints aggressive new-entrant push", detail: "Local sales reps from Chetak are visiting top contractor-focused dealers. Multiple retailers approached in the last two weeks." },
    ],
  },
  {
    num: 2,
    title: "Product Quality",
    items: [
      { title: "Packaging damage on monsoon dispatches", detail: "Retailers across north and east reporting torn outer packaging on early-monsoon shipments. No product loss but visible damage hurts shelf presentation." },
      { title: "[Positive feedback] Shade consistency praised by painters", detail: "Painters are highlighting consistent coverage and zero shade variation. This is leading to optimal material consumption and even finish on larger surfaces — worth building into core campaigns." },
    ],
  },
  {
    num: 3,
    title: "Schemes Related",
    items: [
      { title: "Retailers are asking for simpler retailer scheme structures", detail: "Retailers prefer schemes with fewer tiers. Our 4-tier slab plus bonus SKU structure is hard to explain to contractors." },
      { title: "Quarterly points-based redemption ask", detail: "Loyal retailers want a points-based scheme with quarterly redemption. Current scheme is volume-locked and discourages mid-tier retailers." },
    ],
  },
  {
    num: 4,
    title: "Contractor Related",
    items: [
      { title: "Experienced contractors are increasingly upselling complete wall systems instead of standalone products", detail: "Rather than discussing only paint, leading contractors are recommending combinations: crack fillers + primer + topcoat. This is especially visible in premium renovation projects where homeowners seek longer repaint life." },
      { title: "Contractors are shifting toward products that protect their reputation, not just improve their margins", detail: "Products linked with fewer callbacks, cracks, and finish complaints are earning stronger long-term loyalty among painters." },
    ],
  },
  {
    num: 5,
    title: "Demand Related",
    items: [
      { title: "Occupied-home repainting is creating demand for cleaner, less messy application experiences", detail: "Homeowners are becoming more sensitive to dust, odour, and furniture disturbance during interior repaint projects." },
      { title: "Festival-led spike expected in premium emulsion paints", detail: "Retailers report contractors stocking up for festival re-finishing work. Emulsion and waterproofing enquiries are up week-on-week." },
    ],
  },
];

// ---------- Tab 3: Key retailer objections ----------

export interface ObjectionSlice {
  name: string;
  value: number; // percentage
  color: string;
}

// Colors match the ASM Analytics App's PALETTE (see src/pages/AsmDashboardNew.tsx)
export const objectionBreakdown: ObjectionSlice[] = [
  { name: "Competition Related", value: 45, color: "#1D9E75" },
  { name: "Product quality", value: 30, color: "#E24B4A" },
  { name: "Scheme related", value: 9, color: "#EF9F27" },
  { name: "SKU Space related", value: 7, color: "#378ADD" },
  { name: "Working Capital related", value: 3, color: "#D85A30" },
];

export interface TopObjection {
  category: string; // eyebrow label, e.g. "Packaging-related"
  title: string;
  detail: string;
}

export const topObjections: TopObjection[] = [
  {
    category: "Packaging-related",
    title: "Retailers are pulling back on Primer orders over packaging concerns",
    detail: "Ahead of the monsoon season, retailers are signaling reluctance to stock our Primer due to ongoing packaging issues. They report that the product's single-layer packaging fails to withstand high moisture levels during the monsoon.",
  },
  {
    category: "Service-related",
    title: "Delayed service and support is affecting painter confidence at the counter",
    detail: "Painters are hesitating to recommend our products as issue resolution is taking too long.",
  },
  {
    category: "Stock-related",
    title: "Stock is sitting too long and blocking working capital",
    detail: "Slow-moving SKUs in mid-tier markets are tying up retailer capital that could otherwise fund faster-turning lines.",
  },
  {
    category: "Product-related",
    title: "Retailers feel product consistency changes batch-to-batch",
    detail: "Especially around workability, smoothness, or drying behavior in the primer.",
  },
  {
    category: "Scheme-related",
    title: "Schemes are either unclear or not exciting enough",
    detail: "Retailers want simpler, faster, and more visible benefits tied to movement.",
  },
];
