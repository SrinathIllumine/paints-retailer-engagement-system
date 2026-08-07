import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { engagementThemes, discussionPoints } from "../../../data/mockData";

export default defineTool({
  name: "get_engagement_playbook",
  title: "Get engagement playbook",
  description:
    "Field engagement playbook: conversation themes, discussion points, common retailer objections and the recommended responses / best practices.",
  inputSchema: {
    theme: z.string().optional().describe("Filter themes by id or part of the title."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ theme }) => {
    const q = theme?.trim().toLowerCase();
    const themes = q
      ? engagementThemes.filter((t) => t.id === q || t.title.toLowerCase().includes(q))
      : engagementThemes;
    const payload = { themes, discussionPoints };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
