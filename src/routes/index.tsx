import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from 'react';
import { Dashboard,LiveDashboard } from '@/components/flowpilot/dashboard';
import { useIdentity } from '@/components/flowpilot/auth-context';
import { pageHead } from '@/lib/flowpilot/queries';
export const Route = createFileRoute("/")({
  head:()=>pageHead('Your day, in focus','Plan your day, manage tasks and review approved workflows in your personal FlowPilot workspace.'),
  component: Index,
});
function Index() {
  const {user}=useIdentity();
  return user?<Suspense fallback={<Dashboard/>}><LiveDashboard/></Suspense>:<Dashboard/>;
}
