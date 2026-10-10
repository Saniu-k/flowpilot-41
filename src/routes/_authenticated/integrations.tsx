import { createFileRoute } from '@tanstack/react-router';
import { Integrations } from '@/components/flowpilot/other-views';
import { workspaceQuery,pageHead } from '@/lib/flowpilot/queries';
export const Route=createFileRoute('/_authenticated/integrations')({head:()=>pageHead('Integrations','Configure authorized Gmail and Google Calendar connections.'),loader:({context})=>context.queryClient.ensureQueryData(workspaceQuery()),component:Integrations});
