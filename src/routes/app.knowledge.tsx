import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, BookOpen, ArrowLeft, Trash2, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useStore, useHydrate, createDoc, updateDoc, deleteDoc, relativeTime } from "@/lib/store";
import { EmptyState, PageHeader } from "@/components/app/EmptyState";

export const Route = createFileRoute("/app/knowledge")({
  validateSearch: (s: Record<string, unknown>) => ({ id: typeof s.id === "string" ? s.id : undefined }),
  component: KnowledgePage,
});

function KnowledgePage() {
  useHydrate();
  const { id } = Route.useSearch();
  if (id) return <DocDetail id={id} />;
  return <DocsList />;
}

function DocsList() {
  const docs = useStore((s) => s.docs);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return docs;
    return docs.filter((d) => d.title.toLowerCase().includes(t) || d.content.toLowerCase().includes(t));
  }, [q, docs]);

  const categories = useMemo(() => Array.from(new Set(docs.map((d) => d.category).filter(Boolean))).sort(), [docs]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Knowledge Base"
        description="Internal documentation, SOPs, and notes — a living resource the team can rely on."
        action={<Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button variant="brand"><Plus className="h-4 w-4" /> New document</Button></DialogTrigger><DocDialog onClose={() => setOpen(false)} /></Dialog>}
      />

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search documents…" className="pl-9" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={BookOpen} title={docs.length === 0 ? "No documents yet" : "No matching documents"} description={docs.length === 0 ? "Capture how your team works — SOPs, runbooks, decisions, onboarding." : "Try different keywords."} action={docs.length === 0 ? <Dialog><DialogTrigger asChild><Button variant="brand"><Plus className="h-4 w-4" /> Create first doc</Button></DialogTrigger><DocDialog onClose={() => undefined} /></Dialog> : undefined} />
      ) : (
        <div className="space-y-5">
          {categories.map((cat) => {
            const items = filtered.filter((d) => d.category === cat);
            if (items.length === 0) return null;
            return (
              <div key={cat}>
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{cat}</h2>
                <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                  {items.map((d) => (
                    <Link key={d.id} to="/app/knowledge" search={{ id: d.id }} className="group rounded-xl border border-border bg-card p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-brand"><FileText className="h-4 w-4" /></div>
                        <div className="min-w-0">
                          <div className="truncate font-semibold">{d.title}</div>
                          <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{d.content.replace(/[#*`>]/g, "").slice(0, 90)}</div>
                          <div className="mt-2 text-[10px] text-muted-foreground">Updated {relativeTime(d.updatedAt)}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
          {filtered.filter((d) => !d.category).length > 0 && (
            <div>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Uncategorized</h2>
              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                {filtered.filter((d) => !d.category).map((d) => (
                  <Link key={d.id} to="/app/knowledge" search={{ id: d.id }} className="rounded-xl border border-border bg-card p-4 shadow-soft transition hover:border-brand/40">
                    <div className="font-semibold">{d.title}</div>
                    <div className="mt-1 text-[10px] text-muted-foreground">Updated {relativeTime(d.updatedAt)}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DocDialog({ onClose, initial }: { onClose: () => void; initial?: { id: string; title: string; category: string; content: string } }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [content, setContent] = useState(initial?.content ?? "");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (initial) updateDoc(initial.id, { title, category, content });
    else createDoc({ title, category, content });
    onClose();
  };

  return (
    <DialogContent className="max-w-2xl">
      <form onSubmit={submit}>
        <DialogHeader><DialogTitle>{initial ? "Edit document" : "New document"}</DialogTitle></DialogHeader>
        <div className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
            <div className="space-y-1.5"><Label>Category</Label><Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Engineering, Operations…" /></div>
          </div>
          <div className="space-y-1.5"><Label>Content (markdown)</Label><Textarea rows={14} value={content} onChange={(e) => setContent(e.target.value)} className="font-mono text-xs" /></div>
        </div>
        <DialogFooter className="mt-5">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="brand">{initial ? "Save" : "Create"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function DocDetail({ id }: { id: string }) {
  const doc = useStore((s) => s.docs.find((d) => d.id === id));
  const [editOpen, setEditOpen] = useState(false);

  if (!doc) {
    return (
      <div className="space-y-4">
        <Link to="/app/knowledge" search={{ id: undefined }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back</Link>
        <EmptyState icon={BookOpen} title="Document not found" description="It may have been deleted." />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Link to="/app/knowledge" search={{ id: undefined }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to knowledge base</Link>

      <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {doc.category && <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{doc.category}</div>}
            <h1 className="mt-0.5 text-2xl font-bold">{doc.title}</h1>
            <div className="mt-1 text-xs text-muted-foreground">Updated {relativeTime(doc.updatedAt)}</div>
          </div>
          <div className="flex gap-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}><DialogTrigger asChild><Button variant="outline" size="sm">Edit</Button></DialogTrigger><DocDialog onClose={() => setEditOpen(false)} initial={doc} /></Dialog>
            <Button variant="outline" size="sm" onClick={() => { if (confirm("Delete this document?")) { deleteDoc(doc.id); window.history.back(); } }}><Trash2 className="h-4 w-4" /></Button>
          </div>
        </div>
        <div className="mt-5 whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground/90">{doc.content || <span className="text-muted-foreground">(empty)</span>}</div>
      </div>
    </div>
  );
}
