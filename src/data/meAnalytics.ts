// Analytics data for ME (Marketing Executive) and ASM (Area Sales Manager) views.
// All data is mocked for the prototype but follows the engagement-first narrative
// expected by leadership and ASM personas.

import { dealers } from "./mockData";

export interface MarketingExecutive {
  id: string;
  name: string;
  region: string;
  area: string;
  mappedRetailers: number;
  visitsLast30d: number;
  uniqueRetailersVisited: number;
  topRetailerConcentration: number; // % of visits going to top 5 retailers
  inactiveActivated: number;
  objectionHeavyPairs: number;
  attributesUplift: number; // avg % uplift across tracked attributes
}

export const marketingExecutives: MarketingExecutive[] = [
  { id: "me1", name: "Ravi Kumar",     region: "MH", area: "Pune West", mappedRetailers: 205, visitsLast30d: 168, uniqueRetailersVisited: 92,  topRetailerConcentration: 62, inactiveActivated: 4, objectionHeavyPairs: 2, attributesUplift: 14 },
  { id: "me2", name: "Sunil Sharma",   region: "MH", area: "Pune NE",   mappedRetailers: 198, visitsLast30d: 184, uniqueRetailersVisited: 142, topRetailerConcentration: 28, inactiveActivated: 6, objectionHeavyPairs: 1, attributesUplift: 18 },
  { id: "me3", name: "Anita Deshmukh", region: "MH", area: "Pune South",mappedRetailers: 212, visitsLast30d: 152, uniqueRetailersVisited: 71,  topRetailerConcentration: 71, inactiveActivated: 1, objectionHeavyPairs: 4, attributesUplift: 6 },
  { id: "me4", name: "Vikas Patil",    region: "MH", area: "Pune SW",   mappedRetailers: 201, visitsLast30d: 196, uniqueRetailersVisited: 156, topRetailerConcentration: 22, inactiveActivated: 5, objectionHeavyPairs: 0, attributesUplift: 21 },
  { id: "me5", name: "Priya Nair",     region: "MH", area: "Pune North",mappedRetailers: 192, visitsLast30d: 141, uniqueRetailersVisited: 104, topRetailerConcentration: 44, inactiveActivated: 3, objectionHeavyPairs: 2, attributesUplift: 11 },
];

// MEs whose visit pattern is concentrated on a few top retailers (Pareto / focused coverage)
export const focusedCoverageMEs = marketingExecutives
  .filter((m) => m.topRetailerConcentration >= 60)
  .map((m) => ({
    me: m,
    note: `${m.topRetailerConcentration}% of recent visits went to the top 5 mapped retailers`,
    topRetailers: dealers.slice(0, 3).map((d) => d.name),
  }));

// MEs with broad, consistent coverage of mapped retailers
export const consistentCoverageMEs = marketingExecutives
  .filter((m) => m.uniqueRetailersVisited / m.mappedRetailers >= 0.7)
  .map((m) => ({
    me: m,
    coverage: Math.round((m.uniqueRetailersVisited / m.mappedRetailers) * 100),
    note: `Engaged ${m.uniqueRetailersVisited} of ${m.mappedRetailers} mapped retailers in the last 30 days`,
  }));

// MEs successfully reactivating inactive retailers
export const inactiveToLoyalMEs = marketingExecutives
  .filter((m) => m.inactiveActivated >= 3)
  .sort((a, b) => b.inactiveActivated - a.inactiveActivated)
  .map((m) => ({
    me: m,
    note: `${m.inactiveActivated} previously inactive retailers re-engaged in the last quarter`,
  }));

// Objection-heavy ME-retailer pairings
export const objectionHeavyPairs = [
  { meId: "me1", dealerId: "3", objection: "No demand in my area", repeatedCount: 4 },
  { meId: "me3", dealerId: "4", objection: "Working capital", repeatedCount: 3 },
  { meId: "me3", dealerId: "7", objection: "Competition from other brands", repeatedCount: 5 },
  { meId: "me5", dealerId: "2", objection: "No space", repeatedCount: 2 },
];

// MEs contributing to retailer attribute uplift
export const dimensionUpliftMEs = marketingExecutives
  .filter((m) => m.attributesUplift >= 10)
  .sort((a, b) => b.attributesUplift - a.attributesUplift)
  .map((m) => ({
    me: m,
    dimensions: ["JK Alignment", "Value Prop", "Market Awareness"],
    note: `+${m.attributesUplift}% average uplift across tracked attributes`,
  }));

// ASM aggregate metrics for a chosen time window
export const asmMetrics = {
  region: "Maharashtra",
  mesUnder: marketingExecutives.length,
  totalRetailersInRegion: 1085,
  windows: {
    "7d":  { totalRetailersMet: 218, active: 168, inactive: 50,  newAdded: 6,  conversations: 312 },
    "30d": { totalRetailersMet: 565, active: 412, inactive: 153, newAdded: 21, conversations: 841 },
    "90d": { totalRetailersMet: 902, active: 698, inactive: 204, newAdded: 58, conversations: 1968 },
  },
};

// Root-cause signals tied to each common objection (used in Objection Intelligence View)
export const objectionRootCauses: Record<string, string[]> = {
  "No demand": [
    "Low contractor presence in affected sub-areas",
    "Low market awareness scores among nearby retailers",
    "Affected retailers are mostly new or inactive",
  ],
  "Working capital": [
    "Cluster of small-format retailers with limited revolving capital",
    "Few retailers participating in JK's flexible ordering programs",
    "ME conversations rarely cover working-capital reframing",
  ],
  "No space": [
    "High density of compact-format retailers in the sub-area",
    "Limited adoption of JK's compact display stand",
    "Visit notes seldom mention space-planning support",
  ],
  "Competition from other brands": [
    "Retailers with rigid mindset cluster in this segment",
    "Low coverage of differentiation conversations in visit notes",
    "Few proof-points or trial samples shared in recent visits",
  ],
  "Won't work": [
    "Dominated by retailers with low openness scores",
    "Fewer retailer success stories shared by MEs",
    "Limited follow-through on agreed pilot actions",
  ],
};
