import { createFileRoute } from "@tanstack/react-router";
import { Memory } from "@/components/flowpilot/memory";
import { workspaceQuery, pageHead } from "@/lib/flowpilot/queries";
export const Route = createFileRoute("/_authenticated/memory")({
  head: () =>
    pageHead("Memory & Archive", "Inspect and manage only the information you choose to save."),
  loader: ({ context }) => context.queryClient.ensureQueryData(workspaceQuery()),
  component: Memory,
});
