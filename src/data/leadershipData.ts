// National-level mock data for the Leadership Analytics App.
// All numbers are illustrative and aggregate to the constants below.

export const NATIONAL_TOTAL_RETAILERS = 55_000;
export const NATIONAL_RETAILERS_ENGAGED = 41_250;
export const NATIONAL_TOTAL_MES = 400;
export const NATIONAL_ACTIVE_MES = 332;
export const NATIONAL_TOTAL_ASMS = 46;

export const ENGAGEMENT_BENCHMARK_PER_RETAILER = 4; // per quarter
export const NATIONAL_AVG_ENGAGEMENT_PER_RETAILER = 4.6;

export const OBSTACLES_BENCHMARK = 1.0;
export const NATIONAL_AVG_OBSTACLES = 1.2;

export const ACTIVE_ME_DEFINITION_X = 30; // engagements/month threshold

// ---------- States ----------
export type Status = "on-track" | "lagging" | "yet-to-start";

export interface StateRow {
  state: string;
  stateHead: string;
  totalMes: number;
  activeMes: number;
  totalRetailers: number;
  retailersEngaged: number;
  unitsCovered: number; // out of 5
  status: Status;
  segments: { new: number; loyal: number; inactive: number; declining: number };
  areas: AreaRow[];
}

export interface AreaRow {
  area: string;
  asm: string;
  totalMes: number;
  activeMes: number;
  totalRetailers: number;
  retailersEngaged: number;
  unitsCovered: number;
  status: Status;
}

export const states: StateRow[] = [
  {
    state: "Maharashtra", stateHead: "R. Iyer", totalMes: 48, activeMes: 42,
    totalRetailers: 7200, retailersEngaged: 5760, unitsCovered: 5, status: "on-track",
    segments: { new: 1080, loyal: 2880, inactive: 1800, declining: 1440 },
    areas: [
      { area: "Pune", asm: "Rajesh Kumar", totalMes: 7, activeMes: 6, totalRetailers: 1300, retailersEngaged: 1100, unitsCovered: 5, status: "on-track" },
      { area: "Mumbai", asm: "S. Bhide", totalMes: 9, activeMes: 8, totalRetailers: 1700, retailersEngaged: 1410, unitsCovered: 4, status: "on-track" },
      { area: "Nagpur", asm: "P. Joshi", totalMes: 6, activeMes: 5, totalRetailers: 1050, retailersEngaged: 780, unitsCovered: 4, status: "lagging" },
      { area: "Nashik", asm: "K. Patil", totalMes: 5, activeMes: 4, totalRetailers: 900, retailersEngaged: 660, unitsCovered: 3, status: "lagging" },
      { area: "Aurangabad", asm: "M. Kale", totalMes: 5, activeMes: 5, totalRetailers: 850, retailersEngaged: 720, unitsCovered: 4, status: "on-track" },
    ],
  },
  {
    state: "Gujarat", stateHead: "H. Mehta", totalMes: 42, activeMes: 36,
    totalRetailers: 6400, retailersEngaged: 4900, unitsCovered: 4, status: "on-track",
    segments: { new: 1024, loyal: 2304, inactive: 1792, declining: 1280 },
    areas: [
      { area: "Ahmedabad", asm: "V. Shah", totalMes: 8, activeMes: 7, totalRetailers: 1400, retailersEngaged: 1180, unitsCovered: 5, status: "on-track" },
      { area: "Surat", asm: "N. Patel", totalMes: 7, activeMes: 6, totalRetailers: 1200, retailersEngaged: 950, unitsCovered: 4, status: "on-track" },
      { area: "Vadodara", asm: "B. Desai", totalMes: 6, activeMes: 5, totalRetailers: 1050, retailersEngaged: 780, unitsCovered: 4, status: "lagging" },
      { area: "Rajkot", asm: "C. Joshi", totalMes: 5, activeMes: 4, totalRetailers: 900, retailersEngaged: 660, unitsCovered: 3, status: "lagging" },
    ],
  },
  {
    state: "Rajasthan", stateHead: "A. Singh", totalMes: 38, activeMes: 33,
    totalRetailers: 5600, retailersEngaged: 4200, unitsCovered: 4, status: "on-track",
    segments: { new: 896, loyal: 2016, inactive: 1568, declining: 1120 },
    areas: [
      { area: "Jaipur", asm: "D. Sharma", totalMes: 9, activeMes: 8, totalRetailers: 1500, retailersEngaged: 1230, unitsCovered: 5, status: "on-track" },
      { area: "Jodhpur", asm: "L. Rathod", totalMes: 6, activeMes: 5, totalRetailers: 1100, retailersEngaged: 820, unitsCovered: 4, status: "on-track" },
      { area: "Udaipur", asm: "T. Mehta", totalMes: 5, activeMes: 4, totalRetailers: 900, retailersEngaged: 620, unitsCovered: 3, status: "lagging" },
    ],
  },
  {
    state: "Karnataka", stateHead: "G. Rao", totalMes: 36, activeMes: 30,
    totalRetailers: 5200, retailersEngaged: 3850, unitsCovered: 4, status: "on-track",
    segments: { new: 832, loyal: 1872, inactive: 1456, declining: 1040 },
    areas: [
      { area: "Bengaluru", asm: "S. Nayak", totalMes: 12, activeMes: 10, totalRetailers: 1900, retailersEngaged: 1480, unitsCovered: 5, status: "on-track" },
      { area: "Mysuru", asm: "R. Gowda", totalMes: 6, activeMes: 5, totalRetailers: 1000, retailersEngaged: 720, unitsCovered: 4, status: "on-track" },
      { area: "Hubballi", asm: "P. Hegde", totalMes: 5, activeMes: 4, totalRetailers: 850, retailersEngaged: 580, unitsCovered: 3, status: "lagging" },
    ],
  },
  {
    state: "Tamil Nadu", stateHead: "K. Subramanian", totalMes: 34, activeMes: 28,
    totalRetailers: 5000, retailersEngaged: 3650, unitsCovered: 3, status: "lagging",
    segments: { new: 800, loyal: 1750, inactive: 1500, declining: 950 },
    areas: [
      { area: "Chennai", asm: "M. Arumugam", totalMes: 11, activeMes: 9, totalRetailers: 1800, retailersEngaged: 1380, unitsCovered: 4, status: "on-track" },
      { area: "Coimbatore", asm: "V. Ramesh", totalMes: 7, activeMes: 6, totalRetailers: 1100, retailersEngaged: 820, unitsCovered: 3, status: "lagging" },
      { area: "Madurai", asm: "S. Pillai", totalMes: 5, activeMes: 4, totalRetailers: 900, retailersEngaged: 560, unitsCovered: 2, status: "lagging" },
    ],
  },
  {
    state: "Uttar Pradesh", stateHead: "R. Pandey", totalMes: 40, activeMes: 31,
    totalRetailers: 5800, retailersEngaged: 4100, unitsCovered: 3, status: "lagging",
    segments: { new: 928, loyal: 2030, inactive: 1740, declining: 1102 },
    areas: [
      { area: "Lucknow", asm: "A. Tripathi", totalMes: 9, activeMes: 7, totalRetailers: 1500, retailersEngaged: 1100, unitsCovered: 4, status: "on-track" },
      { area: "Kanpur", asm: "U. Verma", totalMes: 8, activeMes: 6, totalRetailers: 1300, retailersEngaged: 920, unitsCovered: 3, status: "lagging" },
      { area: "Varanasi", asm: "S. Mishra", totalMes: 5, activeMes: 4, totalRetailers: 900, retailersEngaged: 560, unitsCovered: 2, status: "lagging" },
    ],
  },
  {
    state: "Madhya Pradesh", stateHead: "P. Tiwari", totalMes: 32, activeMes: 24,
    totalRetailers: 4600, retailersEngaged: 3050, unitsCovered: 3, status: "lagging",
    segments: { new: 736, loyal: 1564, inactive: 1380, declining: 920 },
    areas: [
      { area: "Indore", asm: "K. Agrawal", totalMes: 10, activeMes: 8, totalRetailers: 1500, retailersEngaged: 1080, unitsCovered: 4, status: "on-track" },
      { area: "Bhopal", asm: "G. Saxena", totalMes: 7, activeMes: 5, totalRetailers: 1100, retailersEngaged: 720, unitsCovered: 3, status: "lagging" },
    ],
  },
  {
    state: "West Bengal", stateHead: "S. Banerjee", totalMes: 30, activeMes: 22,
    totalRetailers: 4400, retailersEngaged: 2850, unitsCovered: 2, status: "lagging",
    segments: { new: 704, loyal: 1408, inactive: 1408, declining: 880 },
    areas: [
      { area: "Kolkata", asm: "D. Ghosh", totalMes: 12, activeMes: 9, totalRetailers: 1900, retailersEngaged: 1320, unitsCovered: 3, status: "lagging" },
      { area: "Howrah", asm: "B. Dutta", totalMes: 6, activeMes: 4, totalRetailers: 1000, retailersEngaged: 580, unitsCovered: 2, status: "lagging" },
    ],
  },
  {
    state: "Telangana", stateHead: "V. Reddy", totalMes: 28, activeMes: 22,
    totalRetailers: 4200, retailersEngaged: 3050, unitsCovered: 4, status: "on-track",
    segments: { new: 672, loyal: 1512, inactive: 1176, declining: 840 },
    areas: [
      { area: "Hyderabad", asm: "P. Reddy", totalMes: 14, activeMes: 11, totalRetailers: 2100, retailersEngaged: 1620, unitsCovered: 5, status: "on-track" },
      { area: "Warangal", asm: "K. Rao", totalMes: 6, activeMes: 5, totalRetailers: 900, retailersEngaged: 640, unitsCovered: 3, status: "lagging" },
    ],
  },
  {
    state: "Punjab", stateHead: "H. Singh", totalMes: 22, activeMes: 14,
    totalRetailers: 3200, retailersEngaged: 1900, unitsCovered: 2, status: "lagging",
    segments: { new: 512, loyal: 960, inactive: 1024, declining: 704 },
    areas: [
      { area: "Ludhiana", asm: "G. Sandhu", totalMes: 9, activeMes: 6, totalRetailers: 1400, retailersEngaged: 880, unitsCovered: 3, status: "lagging" },
      { area: "Amritsar", asm: "T. Bedi", totalMes: 6, activeMes: 4, totalRetailers: 900, retailersEngaged: 540, unitsCovered: 2, status: "lagging" },
    ],
  },
  {
    state: "Bihar", stateHead: "M. Yadav", totalMes: 24, activeMes: 14,
    totalRetailers: 2900, retailersEngaged: 1650, unitsCovered: 2, status: "lagging",
    segments: { new: 464, loyal: 870, inactive: 928, declining: 638 },
    areas: [
      { area: "Patna", asm: "R. Kumar", totalMes: 10, activeMes: 6, totalRetailers: 1300, retailersEngaged: 760, unitsCovered: 3, status: "lagging" },
      { area: "Gaya", asm: "N. Prasad", totalMes: 5, activeMes: 3, totalRetailers: 700, retailersEngaged: 360, unitsCovered: 1, status: "yet-to-start" },
    ],
  },
  {
    state: "Odisha", stateHead: "B. Patra", totalMes: 16, activeMes: 9,
    totalRetailers: 2300, retailersEngaged: 1140, unitsCovered: 1, status: "yet-to-start",
    segments: { new: 368, loyal: 575, inactive: 805, declining: 552 },
    areas: [
      { area: "Bhubaneswar", asm: "A. Mohanty", totalMes: 8, activeMes: 5, totalRetailers: 1200, retailersEngaged: 640, unitsCovered: 2, status: "lagging" },
      { area: "Cuttack", asm: "K. Sahoo", totalMes: 4, activeMes: 2, totalRetailers: 600, retailersEngaged: 240, unitsCovered: 1, status: "yet-to-start" },
    ],
  },
];

// ---------- Month-on-Month Trend ----------
export const momTrend = [
  { month: "Nov", engagements: 42_500, activeMes: 268 },
  { month: "Dec", engagements: 46_800, activeMes: 281 },
  { month: "Jan", engagements: 51_200, activeMes: 296 },
  { month: "Feb", engagements: 55_400, activeMes: 308 },
  { month: "Mar", engagements: 59_900, activeMes: 320 },
  { month: "Apr", engagements: 63_700, activeMes: 332 },
];

// ---------- Objections ----------
export const objectionTypes = [
  "Demand-related",
  "Working capital",
  "SKU space",
  "Competition from other brands",
  "Poor Product Quality",
] as const;
export type ObjectionType = typeof objectionTypes[number];

// state → objection type → count
export const stateObjectionMatrix: Record<string, Record<ObjectionType, number>> = {
  Maharashtra:    { "Demand-related": 280, "Working capital": 220, "SKU space": 180, "Competition from other brands": 170, "Poor Product Quality": 110 },
  Gujarat:        { "Demand-related": 220, "Working capital": 180, "SKU space": 150, "Competition from other brands": 200, "Poor Product Quality":  90 },
  Rajasthan:      { "Demand-related": 240, "Working capital": 160, "SKU space": 140, "Competition from other brands": 120, "Poor Product Quality":  80 },
  Karnataka:      { "Demand-related": 200, "Working capital": 170, "SKU space": 130, "Competition from other brands": 180, "Poor Product Quality":  90 },
  "Tamil Nadu":   { "Demand-related": 260, "Working capital": 190, "SKU space": 150, "Competition from other brands": 160, "Poor Product Quality": 120 },
  "Uttar Pradesh":{ "Demand-related": 320, "Working capital": 260, "SKU space": 200, "Competition from other brands": 140, "Poor Product Quality": 130 },
  "Madhya Pradesh":{"Demand-related":210, "Working capital": 170, "SKU space": 130, "Competition from other brands": 110, "Poor Product Quality":  90 },
  "West Bengal":  { "Demand-related": 290, "Working capital": 240, "SKU space": 170, "Competition from other brands": 130, "Poor Product Quality": 140 },
  Telangana:      { "Demand-related": 180, "Working capital": 150, "SKU space": 110, "Competition from other brands": 160, "Poor Product Quality":  70 },
  Punjab:         { "Demand-related": 220, "Working capital": 180, "SKU space": 140, "Competition from other brands": 120, "Poor Product Quality":  90 },
  Bihar:          { "Demand-related": 260, "Working capital": 230, "SKU space": 160, "Competition from other brands":  90, "Poor Product Quality": 110 },
  Odisha:         { "Demand-related": 170, "Working capital": 140, "SKU space": 100, "Competition from other brands":  80, "Poor Product Quality":  70 },
};

export interface AreaObjectionRow {
  area: string;
  state: string;
  asm: string;
  activeMes: number;
  retailersAffected: Record<ObjectionType, number>;
}

export const areaObjections: AreaObjectionRow[] = [
  { area: "Pune", state: "Maharashtra", asm: "Rajesh Kumar", activeMes: 6, retailersAffected: { "Demand-related": 92, "Working capital": 74, "SKU space": 60, "Competition from other brands": 58, "Poor Product Quality": 36 } },
  { area: "Mumbai", state: "Maharashtra", asm: "S. Bhide", activeMes: 8, retailersAffected: { "Demand-related": 110, "Working capital": 88, "SKU space": 70, "Competition from other brands": 64, "Poor Product Quality": 44 } },
  { area: "Ahmedabad", state: "Gujarat", asm: "V. Shah", activeMes: 7, retailersAffected: { "Demand-related": 86, "Working capital": 70, "SKU space": 58, "Competition from other brands": 78, "Poor Product Quality": 32 } },
  { area: "Jaipur", state: "Rajasthan", asm: "D. Sharma", activeMes: 8, retailersAffected: { "Demand-related": 96, "Working capital": 64, "SKU space": 56, "Competition from other brands": 48, "Poor Product Quality": 32 } },
  { area: "Bengaluru", state: "Karnataka", asm: "S. Nayak", activeMes: 10, retailersAffected: { "Demand-related": 78, "Working capital": 66, "SKU space": 50, "Competition from other brands": 70, "Poor Product Quality": 35 } },
  { area: "Chennai", state: "Tamil Nadu", asm: "M. Arumugam", activeMes: 9, retailersAffected: { "Demand-related": 104, "Working capital": 76, "SKU space": 60, "Competition from other brands": 64, "Poor Product Quality": 48 } },
  { area: "Lucknow", state: "Uttar Pradesh", asm: "A. Tripathi", activeMes: 7, retailersAffected: { "Demand-related": 128, "Working capital": 104, "SKU space": 80, "Competition from other brands": 56, "Poor Product Quality": 52 } },
  { area: "Kolkata", state: "West Bengal", asm: "D. Ghosh", activeMes: 9, retailersAffected: { "Demand-related": 116, "Working capital": 96, "SKU space": 68, "Competition from other brands": 52, "Poor Product Quality": 56 } },
  { area: "Hyderabad", state: "Telangana", asm: "P. Reddy", activeMes: 11, retailersAffected: { "Demand-related": 72, "Working capital": 60, "SKU space": 44, "Competition from other brands": 64, "Poor Product Quality": 28 } },
  { area: "Patna", state: "Bihar", asm: "R. Kumar", activeMes: 6, retailersAffected: { "Demand-related": 116, "Working capital": 102, "SKU space": 70, "Competition from other brands": 40, "Poor Product Quality": 48 } },
];

export const segmentObjectionData: { segment: string; counts: Record<ObjectionType, number> }[] = [
  { segment: "New",       counts: { "Demand-related": 720, "Working capital": 540, "SKU space": 380, "Competition from other brands": 290, "Poor Product Quality": 180 } },
  { segment: "Loyal",     counts: { "Demand-related": 480, "Working capital": 410, "SKU space": 360, "Competition from other brands": 520, "Poor Product Quality": 320 } },
  { segment: "Inactive",  counts: { "Demand-related": 980, "Working capital": 760, "SKU space": 540, "Competition from other brands": 380, "Poor Product Quality": 280 } },
  { segment: "Declining", counts: { "Demand-related": 760, "Working capital": 690, "SKU space": 470, "Competition from other brands": 320, "Poor Product Quality": 360 } },
];

// ---------- Market Insights ----------
export type InsightCategory = "Competition" | "Product Quality" | "Schemes" | "Customer" | "Demand";
export type Actionability = "Low" | "Medium" | "High";

export interface NationalInsight {
  id: string;
  category: InsightCategory;
  title: string;
  summary: string;
  states: string[];
  frequency: string; // e.g. "Reported 14 times in last 30d"
  actionability: Actionability;
}

export const nationalInsights: NationalInsight[] = [
  { id: "n1", category: "Competition", title: "Birla piloting EMI payments for retailers",
    summary: "Birla offering 30/60/90 day EMI on bulk orders. Particularly attractive to declining retailers with working-capital pressure. Adoption rising in west and south.",
    states: ["Maharashtra", "Gujarat", "Karnataka"], frequency: "Reported 22 times in last 30d", actionability: "High" },
  { id: "n2", category: "Competition", title: "Asian Paints bundling Putty SKUs",
    summary: "Schemes on Paints conditional on bundled Putty purchases above 50 bags. Changing monthly putty order decisions across 4 states.",
    states: ["Maharashtra", "Tamil Nadu", "Telangana", "Karnataka"], frequency: "Reported 31 times in last 30d", actionability: "High" },
  { id: "n3", category: "Competition", title: "Chetak Paints aggressive new-entrant push",
    summary: "Local sales reps from Chetak visiting top contractor-focused dealers. Multiple retailers approached in the last 2 weeks.",
    states: ["Maharashtra", "Madhya Pradesh"], frequency: "Reported 9 times in last 30d", actionability: "Medium" },
  { id: "n4", category: "Product Quality", title: "Packaging damage on monsoon dispatches",
    summary: "Retailers across north and east reporting torn outer bags on early-monsoon shipments. No product loss but visible damage hurts shelf presentation.",
    states: ["Uttar Pradesh", "West Bengal", "Bihar", "Maharashtra"], frequency: "Reported 26 times in last 30d", actionability: "High" },
  { id: "n5", category: "Product Quality", title: "Weight variance flagged on 50kg cement",
    summary: "Contractors weighing bags and reporting 0.5–1kg variance. QC tightening request before issue spreads.",
    states: ["Karnataka", "Tamil Nadu"], frequency: "Reported 7 times in last 30d", actionability: "Medium" },
  { id: "n6", category: "Schemes", title: "Asks for simpler retailer loyalty programme",
    summary: "Retailers prefer simple schemes with fewer tiers. JK's 4-tier slab + bonus SKU is hard to explain to contractors.",
    states: ["Maharashtra", "Gujarat", "Rajasthan", "Uttar Pradesh"], frequency: "Reported 18 times in last 30d", actionability: "High" },
  { id: "n7", category: "Schemes", title: "Quarterly points-based redemption ask",
    summary: "Loyal retailers want a points-based scheme with quarterly redemption. Current scheme is volume-locked.",
    states: ["Maharashtra", "Tamil Nadu"], frequency: "Reported 11 times in last 30d", actionability: "Medium" },
  { id: "n8", category: "Customer", title: "Contractor preference shifting to faster-setting cement",
    summary: "Younger contractors in commercial projects asking for faster-setting variants. Older base still prefers standard PPC.",
    states: ["Maharashtra", "Karnataka", "Telangana"], frequency: "Reported 14 times in last 30d", actionability: "Medium" },
  { id: "n9", category: "Customer", title: "Smaller, more frequent orders becoming the norm",
    summary: "Contractors placing 2–3 smaller orders per month instead of one large order, driven by cash-flow caution. Affects minimum-order incentives.",
    states: ["Maharashtra", "Gujarat", "West Bengal"], frequency: "Reported 16 times in last 30d", actionability: "Medium" },
  { id: "n10", category: "Demand", title: "Demand dip after early monsoon onset",
    summary: "Early monsoon onset has paused 30+ small construction sites in north and central. Retailers expect ~20% softer demand for the next 3 weeks.",
    states: ["Uttar Pradesh", "Madhya Pradesh", "Maharashtra"], frequency: "Reported 19 times in last 30d", actionability: "High" },
  { id: "n11", category: "Demand", title: "Festival-led spike expected in white cement",
    summary: "Retailers report contractors stocking up for festival re-finishing work. White cement and putty enquiries up week-on-week.",
    states: ["Gujarat", "Rajasthan", "Maharashtra"], frequency: "Reported 12 times in last 30d", actionability: "Medium" },
  { id: "n12", category: "Demand", title: "Infra-led structural demand uptick",
    summary: "Highway and metro projects driving sustained PPC demand in select states. Opportunity to allocate more SKU coverage.",
    states: ["Telangana", "Karnataka", "Tamil Nadu"], frequency: "Reported 8 times in last 30d", actionability: "Medium" },
];

// ---------- Engagement Coverage (Pentagon) ----------
export const engagementUnits = [
  "Alignment to multi-product vision",
  "Initial success as new retailer",
  "Building contractor / painter pool",
  "Resolving critical objections",
  "Activating inactive retailers",
] as const;
export type EngagementUnit = typeof engagementUnits[number];

export const nationalCoverage: Record<EngagementUnit, number> = {
  "Alignment to multi-product vision": 62,
  "Initial success as new retailer": 71,
  "Building contractor / painter pool": 48,
  "Resolving critical objections": 55,
  "Activating inactive retailers": 39,
};

export const stateCoverage: Record<string, Record<EngagementUnit, number>> = {
  Maharashtra: { "Alignment to multi-product vision": 72, "Initial success as new retailer": 78, "Building contractor / painter pool": 58, "Resolving critical objections": 64, "Activating inactive retailers": 49 },
  Gujarat:     { "Alignment to multi-product vision": 68, "Initial success as new retailer": 74, "Building contractor / painter pool": 52, "Resolving critical objections": 60, "Activating inactive retailers": 44 },
  Rajasthan:   { "Alignment to multi-product vision": 64, "Initial success as new retailer": 70, "Building contractor / painter pool": 50, "Resolving critical objections": 56, "Activating inactive retailers": 41 },
  Karnataka:   { "Alignment to multi-product vision": 66, "Initial success as new retailer": 73, "Building contractor / painter pool": 54, "Resolving critical objections": 58, "Activating inactive retailers": 42 },
  "Tamil Nadu":{ "Alignment to multi-product vision": 58, "Initial success as new retailer": 64, "Building contractor / painter pool": 44, "Resolving critical objections": 50, "Activating inactive retailers": 35 },
  "Uttar Pradesh":{ "Alignment to multi-product vision": 52, "Initial success as new retailer": 60, "Building contractor / painter pool": 38, "Resolving critical objections": 46, "Activating inactive retailers": 30 },
  "Madhya Pradesh":{ "Alignment to multi-product vision": 54, "Initial success as new retailer": 62, "Building contractor / painter pool": 40, "Resolving critical objections": 48, "Activating inactive retailers": 32 },
  "West Bengal":{ "Alignment to multi-product vision": 46, "Initial success as new retailer": 54, "Building contractor / painter pool": 34, "Resolving critical objections": 40, "Activating inactive retailers": 26 },
  Telangana:   { "Alignment to multi-product vision": 65, "Initial success as new retailer": 70, "Building contractor / painter pool": 52, "Resolving critical objections": 56, "Activating inactive retailers": 40 },
  Punjab:      { "Alignment to multi-product vision": 44, "Initial success as new retailer": 50, "Building contractor / painter pool": 32, "Resolving critical objections": 38, "Activating inactive retailers": 24 },
  Bihar:       { "Alignment to multi-product vision": 40, "Initial success as new retailer": 48, "Building contractor / painter pool": 28, "Resolving critical objections": 34, "Activating inactive retailers": 22 },
  Odisha:      { "Alignment to multi-product vision": 36, "Initial success as new retailer": 42, "Building contractor / painter pool": 24, "Resolving critical objections": 30, "Activating inactive retailers": 18 },
};

export const areaCoverage: Record<string, Record<EngagementUnit, number>> = {
  Pune:       { "Alignment to multi-product vision": 78, "Initial success as new retailer": 82, "Building contractor / painter pool": 64, "Resolving critical objections": 70, "Activating inactive retailers": 54 },
  Mumbai:     { "Alignment to multi-product vision": 74, "Initial success as new retailer": 80, "Building contractor / painter pool": 58, "Resolving critical objections": 66, "Activating inactive retailers": 50 },
  Nagpur:     { "Alignment to multi-product vision": 64, "Initial success as new retailer": 70, "Building contractor / painter pool": 50, "Resolving critical objections": 56, "Activating inactive retailers": 42 },
  Nashik:     { "Alignment to multi-product vision": 58, "Initial success as new retailer": 64, "Building contractor / painter pool": 46, "Resolving critical objections": 52, "Activating inactive retailers": 38 },
  Aurangabad: { "Alignment to multi-product vision": 70, "Initial success as new retailer": 76, "Building contractor / painter pool": 56, "Resolving critical objections": 62, "Activating inactive retailers": 46 },
  Ahmedabad:  { "Alignment to multi-product vision": 76, "Initial success as new retailer": 80, "Building contractor / painter pool": 60, "Resolving critical objections": 66, "Activating inactive retailers": 50 },
  Surat:      { "Alignment to multi-product vision": 70, "Initial success as new retailer": 76, "Building contractor / painter pool": 54, "Resolving critical objections": 60, "Activating inactive retailers": 44 },
  Bengaluru:  { "Alignment to multi-product vision": 74, "Initial success as new retailer": 80, "Building contractor / painter pool": 60, "Resolving critical objections": 66, "Activating inactive retailers": 48 },
  Chennai:    { "Alignment to multi-product vision": 64, "Initial success as new retailer": 72, "Building contractor / painter pool": 50, "Resolving critical objections": 56, "Activating inactive retailers": 40 },
  Lucknow:    { "Alignment to multi-product vision": 56, "Initial success as new retailer": 64, "Building contractor / painter pool": 42, "Resolving critical objections": 50, "Activating inactive retailers": 32 },
  Kolkata:    { "Alignment to multi-product vision": 50, "Initial success as new retailer": 58, "Building contractor / painter pool": 38, "Resolving critical objections": 44, "Activating inactive retailers": 28 },
  Hyderabad:  { "Alignment to multi-product vision": 70, "Initial success as new retailer": 76, "Building contractor / painter pool": 56, "Resolving critical objections": 62, "Activating inactive retailers": 44 },
  Jaipur:     { "Alignment to multi-product vision": 68, "Initial success as new retailer": 74, "Building contractor / painter pool": 54, "Resolving critical objections": 60, "Activating inactive retailers": 44 },
};

// ---------- Leaderboard ----------
export interface TopME {
  id: string;
  name: string;
  state: string;
  area: string;
  monthlyEngagements: number[]; // last 6 months
}

export const topMEs: TopME[] = [
  { id: "lme1", name: "Vikas Patil",     state: "Maharashtra",  area: "Pune SW",     monthlyEngagements: [180, 188, 192, 196, 198, 204] },
  { id: "lme2", name: "Sunil Sharma",    state: "Maharashtra",  area: "Pune NE",     monthlyEngagements: [162, 170, 174, 180, 184, 190] },
  { id: "lme3", name: "G. Sandhu",       state: "Punjab",       area: "Ludhiana",    monthlyEngagements: [150, 158, 162, 168, 176, 182] },
  { id: "lme4", name: "M. Arumugam",     state: "Tamil Nadu",   area: "Chennai",     monthlyEngagements: [148, 152, 160, 168, 172, 178] },
  { id: "lme5", name: "S. Nayak",        state: "Karnataka",    area: "Bengaluru",   monthlyEngagements: [140, 148, 156, 162, 170, 176] },
  { id: "lme6", name: "V. Shah",         state: "Gujarat",      area: "Ahmedabad",   monthlyEngagements: [138, 146, 152, 158, 166, 172] },
  { id: "lme7", name: "P. Reddy",        state: "Telangana",    area: "Hyderabad",   monthlyEngagements: [136, 144, 150, 156, 164, 170] },
  { id: "lme8", name: "D. Sharma",       state: "Rajasthan",    area: "Jaipur",      monthlyEngagements: [132, 140, 146, 152, 160, 168] },
];
