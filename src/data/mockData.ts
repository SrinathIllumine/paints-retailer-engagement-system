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
        label: "SKU space-related in my area",
        peerLearning: "Retailers in similar markets started with a small trial and saw demand grow as contractors discovered the quality. Initial demand is created through awareness, not existing demand.",
        dealerStory: "",
      },
      {
        id: "wi2",
        label: "Working capital will get blocked",
        peerLearning: "Many retailers start with a minimum order and see turnover within 2-3 weeks. Start small and scale based on traction.",
        dealerStory: "",
      },
      {
        id: "wi3",
        label: "No space in the shop",
        peerLearning: "JK's compact multi-product display stand takes just 4 sq ft and is designed for small shops. It's provided free and positioned for visibility.",
        dealerStory: "",
      },
      {
        id: "wi4",
        label: "What if it doesn't work?",
        peerLearning: "Start with the top 3 proven sellers in your market segment and set a 30-day review checkpoint. Most retailers see traction within the first month.",
        dealerStory: "",
      },
    ],
  },
  {
    id: "et2",
    title: "Getting Initial Success as a New Retailer",
    subtitle: "Build confidence and momentum in the first 90 days",
    icon: "Rocket",
    color: "info",
    discussionPoints: [
      {
        id: "dp4",
        title: "Quick Wins Strategy",
        description: "Focus on high-demand, fast-moving SKUs first",
        detail: "Start with JK's top 5 best-selling SKUs in your area. These products have proven demand and quick turnaround - giving you confidence and cash flow within the first 2-3 weeks.",
      },
      {
        id: "dp5",
        title: "Contractor Network Building",
        description: "Connect with local contractors through JK's network",
        detail: "JK facilitates introductions to active contractors in your area. Building relationships with contractors creates a sustainable pull for JK products through your shop.",
      },
      {
        id: "dp6",
        title: "Marketing & Visibility Support",
        description: "Free in-shop branding and local marketing campaigns",
        detail: "JK provides shop board branding, product displays, and local advertising support at zero cost. This establishes you as an authorized JK retailer and drives footfall from day one.",
      },
    ],
    whatIfs: [
      {
        id: "wi5",
        label: "I already have established brands",
        peerLearning: "JK doesn't replace your existing brands - it adds a premium tier. Retailers who added JK alongside existing brands saw increased footfall without cannibalizing existing sales.",
        dealerStory: "",
      },
      {
        id: "wi6",
        label: "I'm not sure about the quality",
        peerLearning: "JK Cement has 40+ years of trust. Free product samples are available for you and your contractors to test. Most retailers who tested the products were convinced by the quality.",
        dealerStory: "",
      },
    ],
  },
  {
    id: "et3",
    title: "Building a Pool of Contractors / Painters",
    subtitle: "Create a sustainable network of influencers who drive demand",
    icon: "Users",
    color: "success",
    discussionPoints: [
      {
        id: "dp7",
        title: "Contractor Engagement",
        description: "Build lasting relationships with contractors who use JK products",
        detail: "Engage contractors through product training, knowledge sharing, and consistent quality. This positions you as a trusted partner and knowledge hub in your area.",
      },
      {
        id: "dp8",
        title: "Technical Training Sessions",
        description: "Free training builds contractor confidence and trust",
        detail: "JK conducts free application training for contractors at your shop. This positions you as a knowledge hub, builds trust, and ensures contractors apply products correctly - reducing complaints.",
      },
      {
        id: "dp9",
        title: "Painter Meet Programs",
        description: "Organized events to engage painters in your area",
        detail: "JK sponsors painter meets with product demos, lucky draws, and networking. These events build your reputation as a community hub and create word-of-mouth demand for JK products.",
      },
    ],
    whatIfs: [
      {
        id: "wi7",
        label: "Contractors prefer other brands",
        peerLearning: "Contractors follow quality and support. Once contractors attend a JK training session and experience the product, most build a preference over time through consistent results.",
        dealerStory: "",
      },
      {
        id: "wi8",
        label: "I don't know enough contractors",
        peerLearning: "JK's field team helps identify and connect you with active contractors in your area. On average, each new retailer is introduced to 8-12 contractors within the first month.",
        dealerStory: "",
      },
    ],
  },
];

export const discussionPoints: DiscussionPoint[] = [
  {
    id: "1",
    title: "JK Product Range – Multi-Product Awareness",
    bullets: [
      "JK Cement offers a comprehensive product portfolio across categories",
      "Product range covers cement, white cement, putty, and paints",
      "Opportunity to become a one-stop solution for contractors",
      "Marketing support with in-shop branding and visibility materials",
    ],
    objections: [
      { id: "o1", label: "Already selling other brands", response: "JK complements existing brands as a premium option. More product choices mean more footfall and a stronger position as a go-to retailer." },
      { id: "o2", label: "SKU space-related in my area", response: "Demand often starts with visibility. Retailers in similar markets found that once JK products were displayed, contractor enquiries followed naturally." },
      { id: "o3", label: "Not sure about stocking new products", response: "Start with a small trial of fast-moving SKUs. Assess traction over 30 days before deciding on next steps." },
    ],
  },
  {
    id: "2",
    title: "JK White Cement – Seasonal Opportunity",
    bullets: [
      "Festival season typically sees higher demand for white cement",
      "New consumer-friendly packaging in 1kg and 5kg packs",
      "JK provides display materials for in-shop visibility",
      "Contractor demand remains strong year-round",
    ],
    objections: [
      { id: "o4", label: "No space in shop", response: "JK's compact display stand takes just 2 sq ft and is designed for small shops. It's positioned to draw attention without taking floor space." },
      { id: "o5", label: "What if it doesn't sell", response: "White cement has consistent year-round demand. Start with a small quantity and scale based on actual sell-through." },
    ],
  },
  {
    id: "3",
    title: "Relationship & Trust Building",
    bullets: [
      "Check on any pending issues or service gaps",
      "Discuss retailer's business growth and how JK can support",
      "Share success stories from similar retailers in the region",
      "Understand competitive landscape in the retailer's area",
    ],
    objections: [
      { id: "o6", label: "JK delivery is often delayed", response: "We've expanded distribution points in your zone. Share any specific incidents and I'll escalate immediately for resolution." },
    ],
  },
  {
    id: "4",
    title: "Retailer Support & Knowledge Building",
    bullets: [
      "Technical training for retailer staff on product applications",
      "Annual retailer meet and recognition events",
      "Priority access to new product information",
      "Ongoing ME support for business growth conversations",
    ],
    objections: [
      { id: "o7", label: "I don't see enough support from JK", response: "JK is committed to being a long-term partner. Let's identify specific areas where you need more support and we'll work on it together." },
    ],
  },
  {
    id: "5",
    title: "Market Intelligence & Feedback",
    bullets: [
      "Understand customer preferences and trending products",
      "Identify upcoming construction projects in the area",
      "Note any new competitors entering the market",
      "Gather insights on what contractors are looking for",
    ],
    objections: [],
  },
];

export const regions = ["North", "South", "East", "West"];
export const zones = ["Zone A", "Zone B", "Zone C", "Zone D"];

export const kpiData = {
  totalRetailers: 5000,
  conversationsToday: 2000,
  conversationsWeek: 2180,
  engagementQualityIndex: 7.4,
  launchReadiness: 68,
};

export const segmentationData = [
  { type: "new" as DealerType, count: 1250, label: "New Retailers", percentage: 25 },
  { type: "loyal" as DealerType, count: 1900, label: "Loyal Retailers", percentage: 38 },
  { type: "inactive" as DealerType, count: 1250, label: "Inactive Retailers", percentage: 25 },
  { type: "declining" as DealerType, count: 600, label: "Declining Retailers", percentage: 12 },
];

export const engagementTrend = [
  { month: "Jan", conversations: 1800, quality: 6.8 },
  { month: "Feb", conversations: 2100, quality: 7.0 },
  { month: "Mar", conversations: 2400, quality: 7.2 },
  { month: "Apr", conversations: 2180, quality: 7.4 },
  { month: "May", conversations: 2600, quality: 7.1 },
  { month: "Jun", conversations: 2900, quality: 7.6 },
];

export const objectionBreakdown = [
  { name: "SKU space-related", value: 28 },
  { name: "Working capital", value: 22 },
  { name: "SKU space", value: 18 },
  { name: "Competition from other brands", value: 17 },
  { name: "Poor Product Quality", value: 15 },
];
