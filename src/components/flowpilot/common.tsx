import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Plus,CalendarDays } from 'lucide-react';
export function Heading({title,subtitle,action}:{title:string;subtitle:string;action?:ReactNode}){return <div className="page-heading"><div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>;}
export function Empty({icon:Icon,title,text,action}:{icon:LucideIcon;title:string;text:string;action?:ReactNode}){return <div className="empty-state"><div className="empty-icon"><Icon size={21}/></div><h3>{title}</h3><p>{text}</p>{action}</div>;}
export function AddButton({onClick,label='Add task'}:{onClick:()=>void;label?:string}){return <Button size="sm" onClick={onClick}><Plus size={15}/>{label}</Button>;}
export function DateLabel(){return <div className="date-label"><CalendarDays size={15}/><span>{new Date().toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}</span></div>;}
