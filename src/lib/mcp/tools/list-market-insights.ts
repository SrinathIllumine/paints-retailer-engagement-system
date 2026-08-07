import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { nationalInsights } from "../../../data/leadershipData";

export default defineTool({
  name: "list_market_insights",
  title: "List market insights",
  description:
    "List field-reported market insights (competition, product quality, schemes, customer, demand) with frequency and actionability.",
  inputSchema: {
    category: z
      .enum(["Competition", "Product Quality", "Schemes", "Customer", "Demand"])
      .optional()
      .describe("Filter by insight category."),
    state: z.string().optional().describe("Filter to insights reported in a given state."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category, state }) => {
    const rows = nationalInsights.filter(
      (i) =>
        (!category || i.category === category) &&
        (!state || i.states.some((s) => s.toLowerCase() === state.toLowerCase())),
    );
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { count: rows.length, insights: rows },
    };
  },
});
