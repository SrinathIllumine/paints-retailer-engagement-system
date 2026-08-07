import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import {
  NATIONAL_TOTAL_RETAILERS,
  NATIONAL_RETAILERS_ENGAGED,
  NATIONAL_TOTAL_MES,
  NATIONAL_ACTIVE_MES,
  NATIONAL_TOTAL_ASMS,
  NATIONAL_AVG_ENGAGEMENT_PER_RETAILER,
  ENGAGEMENT_BENCHMARK_PER_RETAILER,
  momTrend,
  states,
  topMEs,
} from "../../../data/leadershipData";

export default defineTool({
  name: "get_engagement_overview",
  title: "Get engagement overview",
  description:
    "National retailer-engagement overview: headline KPIs, month-on-month trend, per-state coverage and the top-performing marketing executives.",
  inputSchema: {
    state: z.string().optional().describe("Restrict the state breakdown to one state."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ state }) => {
    const stateRows = state
      ? states.filter((s) => s.state.toLowerCase() === state.toLowerCase())
      : states;
    const payload = {
      kpis: {
        totalRetailers: NATIONAL_TOTAL_RETAILERS,
        retailersEngaged: NATIONAL_RETAILERS_ENGAGED,
        totalMes: NATIONAL_TOTAL_MES,
        activeMes: NATIONAL_ACTIVE_MES,
        totalAsms: NATIONAL_TOTAL_ASMS,
        avgEngagementsPerRetailer: NATIONAL_AVG_ENGAGEMENT_PER_RETAILER,
        benchmarkEngagementsPerRetailer: ENGAGEMENT_BENCHMARK_PER_RETAILER,
      },
      monthOnMonthTrend: momTrend,
      states: stateRows,
      topMarketingExecutives: topMEs,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
