import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Archive, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Shell } from "./shell";
import { Heading, Empty, AddButton } from "./common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { workspaceQuery } from "@/lib/flowpilot/queries";
import { saveEntry, deleteRecord, type Workspace } from "@/lib/flowpilot/data.functions";
export function Memory() {
  const { data } = useSuspenseQuery(workspaceQuery());
  const [kind, setKind] = useState<"memory" | "archive">("memory");
  const [search, setSearch] = useState("");
  const [editor, setEditor] = useState<{ entry?: Workspace["entries"][number] | undefined } | null>(
    null,
  );
  const remove = useServerFn(deleteRecord);
  const qc = useQueryClient();
  const rows = data.entries.filter(
    (e) =>
      e.kind === kind &&
      `${e.title} ${e.content} ${e.category}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <Shell title="Memory & Archive">
      <Heading
        title="Memory & Archive"
        subtitle="The things you choose to keep. Nothing more, nothing less."
        action={
          <AddButton
            label={kind === "memory" ? "Save a memory" : "Add to archive"}
            onClick={() => setEditor({})}
          />
        }
      />
      <div className="view-toolbar">
        <Tabs value={kind} onValueChange={(v) => setKind(v as typeof kind)}>
          <TabsList>
            <TabsTrigger value="memory">
              <BookOpen size={14} />
              Memory
            </TabsTrigger>
            <TabsTrigger value="archive">
              <Archive size={14} />
              Archive
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Input
          placeholder="Search title, content or category…"
          aria-label="Search saved information"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {rows.length ? (
        <div className="entry-grid">
          {rows.map((r) => (
            <article className="entry-card" key={r.id}>
              <span className="chip">{r.category}</span>
              <h3>{r.title}</h3>
              <p>{r.content}</p>
              {r.source && <p className="text-xs mt-3">Source: {r.source}</p>}
              <div className="entry-card-footer">
                <time>{new Date(r.created_at).toLocaleDateString()}</time>
                <div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title="Edit entry"
                    aria-label={`Edit ${r.title}`}
                    onClick={() => setEditor({ entry: r })}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title="Delete entry"
                    aria-label={`Delete ${r.title}`}
                    onClick={async () => {
                      if (!window.confirm(`Delete "${r.title}"?`)) return;
                      try {
                        await remove({ data: { table: "saved_entries", id: r.id, confirm: true } });
                        await qc.invalidateQueries({ queryKey: ["workspace"] });
                      } catch (e) {
                        toast.error(e instanceof Error ? e.message : "Deletion failed");
                      }
                    }}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="panel">
          <Empty
            icon={kind === "memory" ? BookOpen : Archive}
            title={
              search
                ? "No matching entries"
                : kind === "memory"
                  ? "A memory worth keeping"
                  : "Your archive is a clean slate"
            }
            text={
              search
                ? "Try a different search."
                : kind === "memory"
                  ? "Save a preference, project, or important fact you want PixelMirror to remember."
                  : "Keep selected notes, reference information and approved summaries here."
            }
            action={<AddButton label="Save information" onClick={() => setEditor({})} />}
          />
        </div>
      )}
      {editor && (
        <EntryEditor
          key={editor.entry?.id ?? "new"}
          kind={kind}
          entry={editor.entry}
          onClose={() => setEditor(null)}
        />
      )}
    </Shell>
  );
}
function EntryEditor({
  kind,
  entry,
  onClose,
}: {
  kind: "memory" | "archive";
  entry?: Workspace["entries"][number] | undefined;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(entry?.title ?? "");
  const [content, setContent] = useState(entry?.content ?? "");
  const [category, setCategory] = useState(entry?.category ?? "Notes");
  const [source, setSource] = useState(entry?.source ?? "");
  const [busy, setBusy] = useState(false);
  const save = useServerFn(saveEntry);
  const qc = useQueryClient();
  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{entry ? "Edit saved information" : "Save information"}</DialogTitle>
        </DialogHeader>
        <form
          className="form-grid"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              await save({ data: { id: entry?.id, kind, title, content, category, source } });
              await qc.invalidateQueries({ queryKey: ["workspace"] });
              onClose();
              toast.success("Information saved");
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Save failed");
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            Title
            <Input autoFocus required value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            Information
            <Textarea
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </label>
          <label>
            Category
            <Input
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Preferences, Projects, Notes…"
            />
          </label>
          <label>
            Source / reference
            <Input value={source} onChange={(e) => setSource(e.target.value)} />
          </label>
          <p className="text-xs text-muted-foreground">
            This information will be saved to your private{" "}
            {kind === "memory" ? "memory" : "archive"}.
          </p>
          <Button disabled={busy} type="submit">
            {busy ? "Saving…" : "Confirm & save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
