import { describe,it,expect } from 'vitest';
import { validatePlan,requireApproval } from '../lib/flowpilot/validation';
const step={action:'create_task',title:'Finish project',content:'',due_at:null,priority:'medium',category:'Personal'};
describe('FlowPilot trust rules',()=>{
it('requires explicit approval before execution',()=>{expect(()=>requireApproval(false)).toThrow('Explicit approval required');expect(()=>requireApproval(true)).not.toThrow();});
it('rejects unrestricted actions',()=>{expect(()=>validatePlan({name:'Unsafe',description:'',steps:[{...step,action:'execute_code'}]})).toThrow();});
it('rejects sending email through the unconfigured action allowlist',()=>{expect(()=>validatePlan({name:'Send',description:'',steps:[{...step,action:'send_email'}]})).toThrow();});
it('rejects empty saved memory',()=>{expect(()=>validatePlan({name:'Memory',description:'',steps:[{...step,action:'save_memory',content:''}]})).toThrow('Saved information cannot be empty');});
it('validates AI due dates',()=>{expect(()=>validatePlan({name:'Task',description:'',steps:[{...step,due_at:'not-a-date'}]})).toThrow('Invalid due date');});
});
