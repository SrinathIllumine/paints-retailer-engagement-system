import { defineMcp } from "@lovable.dev/mcp-js";
import listRetailers from "./tools/list-retailers";
import getRetailer from "./tools/get-retailer";
import listMarketInsights from "./tools/list-market-insights";
import listObjections from "./tools/list-objections";
import getEngagementPlaybook from "./tools/get-engagement-playbook";
import getEngagementOverview from "./tools/get-engagement-overview";

export default defineMcp({
  name: "jk-retailer-engagement-system",
  title: "JK Retailer Engagement System",
  version: "0.1.0",
  instructions:
    "Tools for the JK Cement Retailer Engagement System. Read retailer profiles and segments, field-reported market insights, retailer objection patterns, the engagement playbook (talk tracks and objection handling), and national/state engagement performance. All data is read-only demo data.",
  tools: [
    listRetailers,
    getRetailer,
    listMarketInsights,
    listObjections,
    getEngagementPlaybook,
    getEngagementOverview,
  ],
});
