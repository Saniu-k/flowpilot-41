import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { saveTask, type Workspace } from "@/lib/flowpilot/data.functions";
type Task = Workspace["tasks"][number];
export function TaskEditor({
  open,
  onClose,
  task,
}: {
  open: boolean;
  onClose: () => void;
  task?: Task | undefined;
}) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [date, setDate] = useState(task?.due_at ? localDate(task.due_at) : "");
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    (task?.priority as "low" | "medium" | "high") ?? "medium",
  );
  const [category, setCategory] = useState(task?.category ?? "");
  const [busy, setBusy] = useState(false);
  const save = useServerFn(saveTask);
  const qc = useQueryClient();
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? "Edit task" : "New task"}</DialogTitle>
        </DialogHeader>
        <form
          className="form-grid"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              await save({
                data: {
                  id: task?.id,
                  title,
                  description,
                  due_at: date ? new Date(date).toISOString() : null,
                  priority,
                  category,
                  status: task?.status === "completed" ? "completed" : "pending",
                },
              });
              await qc.invalidateQueries({ queryKey: ["workspace"] });
              toast.success(task ? "Task updated" : "Task created");
              onClose();
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Task could not be saved");
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            Task title
            <Input
              autoFocus
              required
              maxLength={300}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to get done?"
            />
          </label>
          <label>
            Description
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add the details"
            />
          </label>
          <div className="form-two">
            <label>
              Due date & time
              <Input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <label>
              Priority
              <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["low", "medium", "high"].map((p) => (
                    <SelectItem key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          </div>
          <label>
            Project / category
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Personal"
            />
          </label>
          <Button type="submit" disabled={busy}>
            {busy ? "Saving…" : "Save task"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
function localDate(d: string) {
  const date = new Date(d);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}
