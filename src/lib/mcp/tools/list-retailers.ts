import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { dealers } from "@/data/mockData";

export default defineTool({
  name: "list_retailers",
  title: "List retailers",
  description:
    "List retailers (dealers) in the Pune trading area with their segment, engagement score, openness and last visit outcome. Optionally filter by segment or area.",
  inputSchema: {
    segment: z
      .enum(["new", "loyal", "inactive", "declining"])
      .optional()
      .describe("Filter by retailer segment."),
    area: z.string().optional().describe("Filter by market area, e.g. 'Hinjewadi'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ segment, area }) => {
    const rows = dealers.filter(
      (d) =>
        (!segment || d.type === segment) &&
        (!area || d.area.toLowerCase().includes(area.toLowerCase())),
    );
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { count: rows.length, retailers: rows },
    };
  },
});
