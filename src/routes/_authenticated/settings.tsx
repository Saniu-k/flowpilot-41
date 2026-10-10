import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "@/components/flowpilot/other-views";
import { workspaceQuery, pageHead } from "@/lib/flowpilot/queries";
export const Route = createFileRoute("/_authenticated/settings")({
  head: () => pageHead("Settings", "Manage your personal preferences and approval settings."),
  loader: ({ context }) => context.queryClient.ensureQueryData(workspaceQuery()),
  component: Settings,
});
