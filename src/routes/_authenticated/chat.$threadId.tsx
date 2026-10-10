import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { UIMessage } from "ai";
import { ChatPage } from "@/components/flowpilot/chat";
import { workspaceQuery, conversationQuery, pageHead } from "@/lib/flowpilot/queries";
export const Route = createFileRoute("/_authenticated/chat/$threadId")({
  head: () =>
    pageHead("Conversation", "A private saved conversation with your FlowPilot assistant."),
  loader: async ({ context, params }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(workspaceQuery()),
      context.queryClient.ensureQueryData(conversationQuery(params.threadId)),
    ]);
  },
  component: Thread,
});
function Thread() {
  const { threadId } = Route.useParams();
  const { data: workspace } = useSuspenseQuery(workspaceQuery());
  const { data: thread } = useSuspenseQuery(conversationQuery(threadId));
  return (
    <ChatPage
      threadId={threadId}
      messages={thread.messages as unknown as UIMessage[]}
      workspace={workspace}
    />
  );
}
