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
  { id: "1", name: "Jai Maharashtra Hardware", location: "Pune West, MH", type: "loyal", engagementScore: 85, openness: "high", lastVisit: "Last visited: 2 days ago", lastOutcome: "Positive - ordered JK White Cement", area: "Pune West", dealerCode: "JMH-001", revenueCategory: "A", lat: 18.520, lng: 73.840 },
  { id: "2", name: "Sharma Building Materials", location: "Pune West, MH", type: "new", engagementScore: 40, openness: "medium", lastVisit: "Last visited: 1 week ago", lastOutcome: "Introduction completed", area: "Pune West", dealerCode: "SBM-002", revenueCategory: "B", lat: 18.530, lng: 73.920 },
  { id: "3", name: "Krishna Traders", location: "Pune South, MH", type: "declining", engagementScore: 30, openness: "low", lastVisit: "Last visited: 3 weeks ago", lastOutcome: "Unresponsive - competitor focus", area: "Pune South", dealerCode: "KT-003", revenueCategory: "C", lat: 18.480, lng: 73.870 },
  { id: "4", name: "Gupta Cement House", location: "Pune North, MH", type: "inactive", engagementScore: 20, openness: "low", lastVisit: "Last visited: 1 month ago", lastOutcome: "Shop closed during visit", area: "Pune North", dealerCode: "GCH-004", revenueCategory: "C", lat: 18.570, lng: 73.850 },
  { id: "5", name: "Rajesh Construction Supply", location: "Pune NE, MH", type: "loyal", engagementScore: 92, openness: "high", lastVisit: "Last visited: Yesterday", lastOutcome: "JK Paint launch discussion - very interested", area: "Pune NE", dealerCode: "RCS-005", revenueCategory: "A", lat: 18.560, lng: 73.930 },
  { id: "6", name: "Patel & Sons Hardware", location: "Pune NE, MH", type: "new", engagementScore: 55, openness: "high", lastVisit: "Last visited: 3 days ago", lastOutcome: "First meeting - willing to stock", area: "Pune NE", dealerCode: "PSH-006", revenueCategory: "B", lat: 18.490, lng: 73.920 },
  { id: "7", name: "Singh Building Centre", location: "Pune SW, MH", type: "declining", engagementScore: 35, openness: "medium", lastVisit: "Last weeks ago", lastOutcome: "Price concerns raised", area: "Pune SW", dealerCode: "SBC-007", revenueCategory: "B", lat: 18.560, lng: 73.810 },
  { id: "8", name: "Mahalaxmi Traders", location: "Pune SW, MH", type: "loyal", engagementScore: 78, openness: "high", lastVisit: "Last visited: 4 days ago", lastOutcome: "Repeat order placed", area: "Pune SW", dealerCode: "MT-008", revenueCategory: "A", lat: 18.490, lng: 73.820 },
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
        label: "No demand in my area",
        peerLearning: "Ramesh Traders in a similar tier-2 market started with 10 units of JK Putty. Within 3 months, monthly orders grew to 80+ units as contractors discovered the quality. Initial demand is created through awareness, not existing demand.",
        dealerStory: "\"I thought the same thing. But once I placed the JK display, contractors started asking. Now multi-products are 40% of my revenue.\" - Ramesh Traders, Nagpur",
      },
      {
        id: "wi2",
        label: "Working capital will get blocked",
        peerLearning: "JK offers 30-day credit terms for new categories. The average retailer recoups investment within 45 days. Many retailers start with just ₹15,000-20,000 worth of stock across categories.",
        dealerStory: "\"The credit terms made it risk-free. I started small and the stock turned over faster than I expected.\" - Gupta Hardware, Jaipur",
      },
      {
        id: "wi3",
        label: "No space in the shop",
        peerLearning: "JK's compact multi-product display stand takes just 4 sq ft and holds products across all categories. It's designed for small shops. JK provides it free of cost with branding that attracts walk-ins.",
        dealerStory: "\"I was worried about space too. The JK stand fits right by the counter and actually draws attention to higher-margin products.\" - Patel Store, Surat",
      },
      {
        id: "wi4",
        label: "What if it doesn't work?",
        peerLearning: "JK offers a buy-back guarantee on unsold initial stock within 90 days. Of 500+ retailers who started multi-products last year, less than 3% used the buy-back - because the products sell.",
        dealerStory: "\"The buy-back gave me confidence. I never needed it - the products moved within the first month itself.\" - Singh Building, Indore",
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
        description: "Connect with local contractors through JK's referral program",
        detail: "JK provides a list of active contractors in your area and facilitates introductions. Contractors who use JK products get loyalty rewards - driving repeat business to your shop.",
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
        peerLearning: "JK doesn't replace your existing brands - it adds a premium tier. Retailers who added JK alongside existing brands saw 20% increase in overall revenue without cannibalizing existing sales.",
        dealerStory: "\"Adding JK gave my customers a premium option they were looking for. My existing brands continued selling as before.\" - Mehta Hardware, Pune",
      },
      {
        id: "wi6",
        label: "I'm not sure about the quality",
        peerLearning: "JK Cement has 40+ years of trust. Free product samples are available for you and your contractors to test. 95% of retailers who tested the products placed their first order within a week.",
        dealerStory: "\"I tested the putty myself on a wall at home. The finish was clearly superior. After that, I was confident to recommend it.\" - Verma Traders, Bhopal",
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
        title: "Contractor Loyalty Program",
        description: "JK rewards contractors who consistently use JK products",
        detail: "Contractors earn points on every JK product purchase routed through your shop. Points convert to tools, training, and cash rewards. This creates a loyal base of contractors who prefer buying from you.",
      },
      {
        id: "dp8",
        title: "Technical Training Sessions",
        description: "Free training builds contractor confidence and loyalty",
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
        peerLearning: "Contractors follow margins and support. JK's contractor loyalty program offers 15% better rewards than competitor programs. Once contractors attend a JK training session, 70% switch within 3 months.",
        dealerStory: "\"My contractors were loyal to Brand X. After the JK training, they tried the products and never looked back. The quality spoke for itself.\" - Agarwal Building, Lucknow",
      },
      {
        id: "wi8",
        label: "I don't know enough contractors",
        peerLearning: "JK's field team helps identify and connect you with active contractors in your area. On average, each new retailer is introduced to 8-12 contractors within the first month.",
        dealerStory: "\"JK's ME introduced me to 10 contractors I didn't even know were active in my area. Three of them are now my regulars.\" - Rajput Hardware, Kanpur",
      },
    ],
  },
];

export const discussionPoints: DiscussionPoint[] = [
  {
    id: "1",
    title: "JK Paint Launch - New Product Introduction",
    bullets: [
      "JK Cement is entering the paints category with premium quality offerings",
      "Initial product range covers interior emulsions and exterior coatings",
      "Competitive retailer margins of 18-22% on MRP",
      "Marketing support with in-shop branding and local campaigns",
    ],
    objections: [
      { id: "o1", label: "Already selling 4 paint brands", response: "JK Paint fills a value gap between economy and premium. Your existing brands continue - JK Paint adds an incremental revenue stream. Retailers who carry 5+ brands see 15% higher footfall." },
      { id: "o2", label: "No demand in my area", response: "We've seen a 30% increase in paint demand in similar tier-2 areas. JK Cement's brand recall drives initial trial - 78% of retailers in pilot markets reported first-month sales." },
      { id: "o3", label: "Working capital will get blocked", response: "We offer 30-day credit terms for new launches and a buy-back guarantee on unsold initial stock within 90 days. Minimum order is just 20 units." },
    ],
  },
  {
    id: "2",
    title: "JK White Cement - Seasonal Push",
    bullets: [
      "Festival season demand typically 40% higher for white cement",
      "New packaging in 1kg and 5kg consumer packs",
      "Scheme: Buy 50 bags, get 5 free until month-end",
      "POS materials available for in-shop display",
    ],
    objections: [
      { id: "o4", label: "No space in shop", response: "Our compact display stand takes just 2 sq ft and holds 30 units. We provide it free of cost. Visibility drives impulse purchases." },
      { id: "o5", label: "What if it doesn't sell", response: "White cement has consistent year-round demand. With the festival push, return rate is under 2%. We support with contractor referrals in your area." },
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
      { id: "o6", label: "JK delivery is often delayed", response: "We've added 3 new distribution points in your zone. Current average delivery time is 48 hours. Share any specific incidents and I'll escalate immediately." },
    ],
  },
  {
    id: "4",
    title: "Value-Added Services & Loyalty Program",
    bullets: [
      "JK Star Retailer program - earn points on every purchase",
      "Annual retailer meet and recognition awards",
      "Technical training for retailer staff on product applications",
      "Priority access to new product launches",
    ],
    objections: [
      { id: "o7", label: "Other brands give better incentives", response: "JK Star program offers cumulative benefits worth 3-5% additional margin annually. Plus exclusive access to contractor networks and project leads." },
    ],
  },
  {
    id: "5",
    title: "Market Intelligence & Feedback",
    bullets: [
      "Gather pricing feedback vs competitors",
      "Understand customer preferences and trending products",
      "Identify upcoming construction projects in the area",
      "Note any new competitors entering the market",
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
  { type: "loyal" as DealerType, count: 2000, label: "Loyal Retailers", percentage: 40 },
  { type: "inactive" as DealerType, count: 1000, label: "Inactive Retailers", percentage: 20 },
  { type: "declining" as DealerType, count: 750, label: "Declining Retailers", percentage: 15 },
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
  { name: "No demand", value: 28 },
  { name: "Working capital", value: 22 },
  { name: "No space", value: 18 },
  { name: "Other brands", value: 17 },
  { name: "Won't work", value: 15 },
];
