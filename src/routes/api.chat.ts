import { createFileRoute } from "@tanstack/react-router";
import { handleChat } from "@/lib/flowpilot/chat.server";
export const Route = createFileRoute("/api/chat")({
  server: { handlers: { POST: ({ request }) => handleChat(request) } },
});
