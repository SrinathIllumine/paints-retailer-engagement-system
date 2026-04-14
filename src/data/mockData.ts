export type DealerType = "new" | "loyal" | "inactive" | "declining";
export type OpennessLevel = "high" | "medium" | "low";

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

export const dealers: Dealer[] = [
  { id: "1", name: "Jai Maharashtra Hardware", location: "Pune West", type: "loyal", engagementScore: 85, openness: "high", lastVisit: "2 days ago", lastOutcome: "Positive – ordered JK White Cement", area: "Pune West" },
  { id: "2", name: "Sharma Building Materials", location: "Pune East, MH", type: "new", engagementScore: 40, openness: "medium", lastVisit: "1 week ago", lastOutcome: "Introduction completed", area: "Pune East" },
  { id: "3", name: "Krishna Traders", location: "Pune South, MH", type: "declining", engagementScore: 30, openness: "low", lastVisit: "3 weeks ago", lastOutcome: "Unresponsive – competitor focus", area: "Pune South" },
  { id: "4", name: "Gupta Cement House", location: "Pune North, MH", type: "inactive", engagementScore: 20, openness: "low", lastVisit: "1 month ago", lastOutcome: "Shop closed during visit", area: "Pune North" },
  { id: "5", name: "Rajesh Construction Supply", location: "Pune NE, MH", type: "loyal", engagementScore: 92, openness: "high", lastVisit: "Yesterday", lastOutcome: "JK Paint launch discussion – very interested", area: "Pune NE" },
  { id: "6", name: "Patel & Sons Hardware", location: "Pune SE, MH", type: "new", engagementScore: 55, openness: "high", lastVisit: "3 days ago", lastOutcome: "First meeting – willing to stock", area: "Pune SE" },
  { id: "7", name: "Singh Building Centre", location: "Pune NW, MH", type: "declining", engagementScore: 35, openness: "medium", lastVisit: "2 weeks ago", lastOutcome: "Price concerns raised", area: "Pune NW" },
  { id: "8", name: "Mahalaxmi Traders", location: "Pune SW, MH", type: "loyal", engagementScore: 78, openness: "high", lastVisit: "4 days ago", lastOutcome: "Repeat order placed", area: "Pune SW" },
];

export const discussionPoints: DiscussionPoint[] = [
  {
    id: "1",
    title: "JK Paint Launch – New Product Introduction",
    bullets: [
      "JK Cement is entering the paints category with premium quality offerings",
      "Initial product range covers interior emulsions and exterior coatings",
      "Competitive dealer margins of 18-22% on MRP",
      "Marketing support with in-shop branding and local campaigns",
    ],
    objections: [
      { id: "o1", label: "Already selling 4 paint brands", response: "JK Paint fills a value gap between economy and premium. Your existing brands continue – JK Paint adds an incremental revenue stream. Dealers who carry 5+ brands see 15% higher footfall." },
      { id: "o2", label: "No demand in my area", response: "We've seen a 30% increase in paint demand in similar tier-2 areas. JK Cement's brand recall drives initial trial – 78% of dealers in pilot markets reported first-month sales." },
      { id: "o3", label: "Working capital will get blocked", response: "We offer 30-day credit terms for new launches and a buy-back guarantee on unsold initial stock within 90 days. Minimum order is just 20 units." },
    ],
  },
  {
    id: "2",
    title: "JK White Cement – Seasonal Push",
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
      "Discuss dealer's business growth and how JK can support",
      "Share success stories from similar dealers in the region",
      "Understand competitive landscape in the dealer's area",
    ],
    objections: [
      { id: "o6", label: "JK delivery is often delayed", response: "We've added 3 new distribution points in your zone. Current average delivery time is 48 hours. Share any specific incidents and I'll escalate immediately." },
    ],
  },
  {
    id: "4",
    title: "Value-Added Services & Loyalty Program",
    bullets: [
      "JK Star Dealer program – earn points on every purchase",
      "Annual dealer meet and recognition awards",
      "Technical training for dealer staff on product applications",
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
  totalDealers: 5000,
  conversationsToday: 2000,
  conversationsWeek: 2180,
  engagementQualityIndex: 7.4,
  launchReadiness: 68,
};

export const segmentationData = [
  { type: "new" as DealerType, count: 1250, label: "New Dealers", percentage: 25 },
  { type: "loyal" as DealerType, count: 2000, label: "Loyal Dealers", percentage: 40 },
  { type: "inactive" as DealerType, count: 1000, label: "Inactive Dealers", percentage: 20 },
  { type: "declining" as DealerType, count: 750, label: "Declining Dealers", percentage: 15 },
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
