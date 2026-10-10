import { createFileRoute,Link,useNavigate } from '@tanstack/react-router';
import { useSuspenseQuery,useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { MessagesSquare,Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Shell } from '@/components/flowpilot/shell';
import { Heading,Empty } from '@/components/flowpilot/common';
import { Button } from '@/components/ui/button';
import { newConversation } from '@/lib/flowpilot/data.functions';
import { workspaceQuery,pageHead } from '@/lib/flowpilot/queries';
export const Route=createFileRoute('/_authenticated/assistant')({head:()=>pageHead('AI Assistant','Your private saved conversations with FlowPilot AI.'),loader:({context})=>context.queryClient.ensureQueryData(workspaceQuery()),component:Assistant});
function Assistant(){const {data}=useSuspenseQuery(workspaceQuery());const create=useServerFn(newConversation);const nav=useNavigate();const qc=useQueryClient();async function start(){try{const r=await create();await qc.invalidateQueries({queryKey:['workspace']});nav({to:'/chat/$threadId',params:{threadId:r.id}});}catch(e){toast.error(e instanceof Error?e.message:'Could not start conversation');}}return <Shell title="AI Assistant"><Heading title="Your AI assistant" subtitle="A clear space for each project, thought, and next step." action={<Button size="sm" onClick={start}><Plus/>New conversation</Button>}/>{data.conversations.length?<div className="entry-grid">{data.conversations.map(t=><Link key={t.id} to="/chat/$threadId" params={{threadId:t.id}} className="entry-card"><MessagesSquare size={21} className="text-primary"/><h3>{t.title}</h3><p>{new Date(t.updated_at).toLocaleString()}</p></Link>)}</div>:<div className="panel"><Empty icon={MessagesSquare} title="Let's start a conversation" text="Your conversations stay separate, private, and saved." action={<Button onClick={start}><Plus/>New conversation</Button>}/></div>}</Shell>;}
