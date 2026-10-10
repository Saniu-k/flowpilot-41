import { z } from "zod";
export const stepSchema = z.object({
  action: z.enum(["create_task", "save_memory", "save_archive"]),
  title: z.string(),
  content: z.string(),
  due_at: z.string().nullable(),
  priority: z.enum(["low", "medium", "high"]),
  category: z.string(),
});
export const planSchema = z.object({
  name: z.string(),
  description: z.string(),
  steps: z.array(stepSchema),
});
export function validatePlan(input: unknown) {
  const p = planSchema.parse(input);
  if (!p.name.trim() || p.steps.length < 1 || p.steps.length > 20)
    throw new Error("A named workflow with 1 to 20 steps is required");
  for (const s of p.steps) {
    if (!s.title.trim() || s.title.length > 300)
      throw new Error("A title of up to 300 characters is required");
    if (s.action !== "create_task" && !s.content.trim())
      throw new Error("Saved information cannot be empty");
    if (s.due_at && Number.isNaN(Date.parse(s.due_at))) throw new Error("Invalid due date");
  }
  return p;
}
export function requireApproval(confirm: boolean) {
  if (confirm !== true) throw new Error("Explicit approval required");
}
