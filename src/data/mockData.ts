export type DealerType = "new" | "loyal" | "inactive" | "declining";
export type OpennessLevel = "high" | "medium" | "low";
export type RevenueCategory = "A" | "B" | "C";

export interface Dealer {
  id: string;
  name: string;
  location: string;
  type: DealerType;
  engagementScore: number;
  openness: OpennessLevel;
  lastVisit: string;
  lastOutcome: string;
  area: string;
  dealerCode: string;
  revenueCategory: RevenueCategory;
  lat: number;
  lng: number;
}

export interface DiscussionPoint {
  id: string;
  title: string;
  bullets: string[];
  objections: Objection[];
}

export interface Objection {
  id: string;
  label: string;
  response: string;
}

export interface EngagementTheme {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  discussionPoints: EngagementDiscussionPoint[];
  whatIfs: WhatIf[];
}

export interface EngagementDiscussionPoint {
  id: string;
  title: string;
  description: string;
  detail: string;
}

export interface WhatIf {
  id: string;
  label: string;
  peerLearning: string;
  dealerStory: string;
}

export const dealers: Dealer[] = [
  { id: "1", name: "Jai Maharashtra Hardware", location: "Pune West, MH", type: "loyal", engagementScore: 85, openness: "high", lastVisit: "Last visited: 2 days ago", lastOutcome: "Positive – productive conversation on product range", area: "Pune West", dealerCode: "JMH-001", revenueCategory: "A", lat: 18.520, lng: 73.840 },
  { id: "2", name: "Sharma Building Materials", location: "Pune West, MH", type: "new", engagementScore: 40, openness: "medium", lastVisit: "Last visited: 1 week ago", lastOutcome: "Introduction completed", area: "Pune West", dealerCode: "SBM-002", revenueCategory: "B", lat: 18.530, lng: 73.920 },
  { id: "3", name: "Krishna Traders", location: "Pune South, MH", type: "declining", engagementScore: 30, openness: "low", lastVisit: "Last visited: 3 weeks ago", lastOutcome: "Unresponsive – competitor focus", area: "Pune South", dealerCode: "KT-003", revenueCategory: "C", lat: 18.480, lng: 73.870 },
  { id: "4", name: "Gupta Cement House", location: "Pune North, MH", type: "inactive", engagementScore: 20, openness: "low", lastVisit: "Last visited: 1 month ago", lastOutcome: "Shop closed during visit", area: "Pune North", dealerCode: "GCH-004", revenueCategory: "C", lat: 18.570, lng: 73.850 },
  { id: "5", name: "Rajesh Construction Supply", location: "Pune NE, MH", type: "loyal", engagementScore: 92, openness: "high", lastVisit: "Last visited: Yesterday", lastOutcome: "Great discussion on expanding product range", area: "Pune NE", dealerCode: "RCS-005", revenueCategory: "A", lat: 18.560, lng: 73.930 },
  { id: "6", name: "Patel & Sons Hardware", location: "Pune NE, MH", type: "new", engagementScore: 55, openness: "high", lastVisit: "Last visited: 3 days ago", lastOutcome: "First meeting – willing to explore JK products", area: "Pune NE", dealerCode: "PSH-006", revenueCategory: "B", lat: 18.490, lng: 73.920 },
  { id: "7", name: "Singh Building Centre", location: "Pune SW, MH", type: "declining", engagementScore: 35, openness: "medium", lastVisit: "Last weeks ago", lastOutcome: "Needs more engagement attention", area: "Pune SW", dealerCode: "SBC-007", revenueCategory: "B", lat: 18.560, lng: 73.810 },
  { id: "8", name: "Mahalaxmi Traders", location: "Pune SW, MH", type: "loyal", engagementScore: 78, openness: "high", lastVisit: "Last visited: 4 days ago", lastOutcome: "Strong relationship – regular engagement", area: "Pune SW", dealerCode: "MT-008", revenueCategory: "A", lat: 18.490, lng: 73.820 },
  { id: "9", name: "Deshpande Hardware Stores", location: "Pune North, MH", type: "inactive", engagementScore: 38, openness: "medium", lastVisit: "Last visited: 5 weeks ago", lastOutcome: "Open to re-engagement – cited service gaps", area: "Pune North", dealerCode: "DHS-009", revenueCategory: "B", lat: 18.580, lng: 73.860 },
];

export const engagementThemes: EngagementTheme[] = [
  {
    id: "et1",
    title: "Alignment to JK's Vision of Multi-Products",
    subtitle: "Help retailers see the opportunity in a multi-product portfolio",
    icon: "Layers",
    color: "primary",
    discussionPoints: [
      {
        id: "dp1",
        title: "Higher Profit Pool",
        description: "Multi-product play increases margins vs single-product reliance",
        detail: "Retailers stocking putty, white cement, and paints see 25-35% higher margins compared to cement-only retailers. The multi-product portfolio reduces dependency on seasonal cement demand and creates year-round revenue streams.",
      },
      {
        id: "dp2",
        title: "Full Customer Solution",
        description: "Capture the entire demand cycle from base to finish",
        detail: "When a contractor visits your shop for cement, they also need putty, white cement, and paints. By offering the complete JK range, you become a one-stop solution - reducing customer leakage to competitors.",
      },
      {
        id: "dp3",
        title: "Low-Risk Expansion",
        description: "Begin with limited SKUs and scale gradually with company support",
        detail: "Start with just 5-8 SKUs across categories. JK provides free display materials, and a dedicated support team. Scale up only when you see traction - zero pressure, full flexibility.",
      },
    ],
    whatIfs: [
      {
        id: "wi1",
        label: "Demand-related in my area",
...
      { id: "o2", label: "Demand-related in my area", response: "Demand often starts with visibility. Retailers in similar markets found that once JK products were displayed, contractor enquiries followed naturally." },
...
export const objectionBreakdown = [
  { name: "Demand-related", value: 28 },
  { name: "Working capital", value: 22 },
  { name: "SKU space", value: 18 },
  { name: "Competition from other brands", value: 17 },
  { name: "Poor Product Quality", value: 15 },
];
