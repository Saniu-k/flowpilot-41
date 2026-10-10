import { createContext,useContext,useEffect,useState,type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useRouter } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
const AuthContext=createContext<{user:User|null;ready:boolean}>({user:null,ready:false});
export function AuthProvider({children}:{children:ReactNode}){const [state,setState]=useState<{user:User|null;ready:boolean}>({user:null,ready:false});const router=useRouter();const qc=useQueryClient();useEffect(()=>{let active=true;supabase.auth.getUser().then(({data})=>{if(active)setState({user:data.user,ready:true});});const {data}=supabase.auth.onAuthStateChange((event,session)=>{if(event==='INITIAL_SESSION'){setState({user:session?.user??null,ready:true});return;}if(!['SIGNED_IN','SIGNED_OUT','USER_UPDATED'].includes(event))return;setState({user:session?.user??null,ready:true});if(event==='SIGNED_OUT')qc.clear();else qc.invalidateQueries();router.invalidate();});return()=>{active=false;data.subscription.unsubscribe();};},[router,qc]);return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;}
export const useIdentity=()=>useContext(AuthContext);
