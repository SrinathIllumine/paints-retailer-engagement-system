import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { dealers } from "../../../data/mockData";

export default defineTool({
  name: "get_retailer",
  title: "Get retailer snapshot",
  description:
    "Get the full snapshot for one retailer by id, dealer code, or (partial) name.",
  inputSchema: {
    query: z.string().min(1).describe("Retailer id, dealer code, or part of the name."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query }) => {
    const q = query.trim().toLowerCase();
    const dealer =
      dealers.find((d) => d.id === q || d.dealerCode.toLowerCase() === q) ??
      dealers.find((d) => d.name.toLowerCase().includes(q));
    if (!dealer) throw new ToolError(`No retailer matched "${query}".`);
    return {
      content: [{ type: "text", text: JSON.stringify(dealer, null, 2) }],
      structuredContent: { retailer: dealer },
    };
  },
});
