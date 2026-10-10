import { queryOptions } from "@tanstack/react-query";
import { loadWorkspace, loadConversation } from "./data.functions";
export const workspaceQuery = () =>
  queryOptions({ queryKey: ["workspace"], queryFn: () => loadWorkspace() });
export const conversationQuery = (id: string) =>
  queryOptions({
    queryKey: ["conversation", id],
    queryFn: () => loadConversation({ data: { id } }),
  });
export function pageHead(title: string, description: string) {
  return {
    meta: [
      { title: `${title} · FlowPilot AI` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} · FlowPilot AI` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
