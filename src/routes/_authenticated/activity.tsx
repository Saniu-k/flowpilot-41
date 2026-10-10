import { createFileRoute } from '@tanstack/react-router';
import { Activity } from '@/components/flowpilot/other-views';
import { workspaceQuery,pageHead } from '@/lib/flowpilot/queries';
export const Route=createFileRoute('/_authenticated/activity')({head:()=>pageHead('Activity history','Review actual action outcomes and execution errors.'),loader:({context})=>context.queryClient.ensureQueryData(workspaceQuery()),component:Activity});
