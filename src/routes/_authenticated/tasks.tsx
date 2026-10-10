import { createFileRoute } from "@tanstack/react-router";
import { Tasks } from "@/components/flowpilot/tasks";
import { workspaceQuery, pageHead } from "@/lib/flowpilot/queries";
export const Route = createFileRoute("/_authenticated/tasks")({
  head: () => pageHead("Tasks", "Manage private tasks, due dates and priorities."),
  loader: ({ context }) => context.queryClient.ensureQueryData(workspaceQuery()),
  component: Tasks,
});
