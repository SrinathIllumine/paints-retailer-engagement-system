import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { objectionTypes, stateObjectionMatrix, areaObjections } from "@/data/leadershipData";
import { objectionBreakdown } from "@/data/mockData";

export default defineTool({
  name: "list_objections",
  title: "List retailer objections",
  description:
    "Retailer objection mix — overall share, per-state counts and per-area breakdown. Optionally scope to one state.",
  inputSchema: {
    state: z.string().optional().describe("Restrict counts to a single state, e.g. 'Maharashtra'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ state }) => {
    const key = state
      ? Object.keys(stateObjectionMatrix).find((s) => s.toLowerCase() === state.toLowerCase())
      : undefined;
    const payload = {
      objectionTypes: [...objectionTypes],
      overallSharePercent: objectionBreakdown,
      stateCounts: key ? { [key]: stateObjectionMatrix[key] } : stateObjectionMatrix,
      areaBreakdown: areaObjections,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
