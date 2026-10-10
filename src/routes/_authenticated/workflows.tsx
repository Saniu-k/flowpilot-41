import { createFileRoute } from '@tanstack/react-router';
import { Workflows } from '@/components/flowpilot/workflows';
import { workspaceQuery,pageHead } from '@/lib/flowpilot/queries';
export const Route=createFileRoute('/_authenticated/workflows')({head:()=>pageHead('Workflows','Review structured plans and approve real workflow execution.'),loader:({context})=>context.queryClient.ensureQueryData(workspaceQuery()),component:Workflows});
