import { createFileRoute } from '@tanstack/react-router';
import { Calendar } from '@/components/flowpilot/other-views';
import { workspaceQuery,pageHead } from '@/lib/flowpilot/queries';
export const Route=createFileRoute('/_authenticated/calendar')({head:()=>pageHead('Calendar & Reminders','View task due dates and reminder delivery status.'),loader:({context})=>context.queryClient.ensureQueryData(workspaceQuery()),component:Calendar});
