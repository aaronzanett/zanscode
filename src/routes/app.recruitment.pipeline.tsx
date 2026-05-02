import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, UserSquare2, Star, Mail, Phone, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  useStore, useHydrate, createCandidate, moveCandidate, updateCandidate, deleteCandidate, addCandidateNote,
  formatDate, relativeTime,
  type CandidateStage,
} from "@/lib/store";
import { EmptyState, PageHeader } from "@/components/app/EmptyState";
import { toast } from "sonner";

export const Route = createFileRoute("/app/recruitment/pipeline")({
  head: () => ({ meta: [{ title: "Candidate Pipeline — Recruitment" }] }),
  component: PipelinePage,
});

const stages: { key: CandidateStage; label: string; tint: string }[] = [
  { key: "applied", label: "Applied", tint: "border-l-slate-400" },
  { key: "screening", label: "Screening", tint: "border-l-sky-400" },
  { key: "interview", label: "Interview", tint: "border-l-violet-400" },
  { key: "offer", label: "Offer", tint: "border-l-amber-400" },
  { key: "hired", label: "Hired", tint: "border-l-emerald-500" },
  { key: "rejected", label: "Rejected", tint: "border-l-rose-400" },
];

function PipelinePage() {
  useHydrate();
  const candidates = useStore((s) => s.candidates);
  const jobs = useStore((s) => s.jobs);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [active, setActive] = useState<string | null>(null);

  const filtered = useMemo(
    () => filter === "all" ? candidates : candidates.filter((c) => c.jobId === filter),
    [candidates, filter],
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Candidate Pipeline"
        description="Drag candidates through stages, take notes, and move toward hire."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="brand"><Plus className="h-4 w-4" /> Add candidate</Button></DialogTrigger>
            <CandidateDialog onClose={() => setOpen(false)} />
          </Dialog>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Filter by job:</Label>
        <select
          value={filter} onChange={(e) => setFilter(e.target.value)}
          className="h-8 cursor-pointer rounded-md border border-input bg-background px-2 text-xs"
        >
          <option value="all">All jobs</option>
          {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
        </select>
        <span className="text-xs text-muted-foreground">{filtered.length} candidate{filtered.length === 1 ? "" : "s"}</span>
      </div>

      {candidates.length === 0 ? (
        <EmptyState icon={UserSquare2} title="No candidates yet" description="Add candidates manually or wait for applications via /careers." />
      ) : (
        <div className="grid gap-3 lg:grid-cols-3 xl:grid-cols-6">
          {stages.map((stage) => {
            const items = filtered.filter((c) => c.stage === stage.key);
            return (
              <div key={stage.key} className="flex min-h-[280px] flex-col rounded-xl border border-border bg-card/60 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wide text-foreground">{stage.label}</div>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map((c) => {
                    const job = jobs.find((j) => j.id === c.jobId);
                    return (
                      <button
                        key={c.id} type="button"
                        onClick={() => setActive(c.id)}
                        className={`group w-full cursor-pointer rounded-lg border border-border ${stage.tint} border-l-4 bg-card p-2.5 text-left text-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="truncate font-semibold">{c.name}</div>
                            <div className="truncate text-xs text-muted-foreground">{job?.title ?? "Unassigned"}</div>
                          </div>
                          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition group-hover:text-brand" />
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span className="inline-flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < c.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                            ))}
                          </span>
                          <span>{relativeTime(c.appliedAt)}</span>
                        </div>
                      </button>
                    );
                  })}
                  {items.length === 0 && (
                    <div className="rounded-lg border border-dashed border-border/60 px-2 py-4 text-center text-[11px] text-muted-foreground">Empty</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CandidateDrawer id={active} onClose={() => setActive(null)} />
    </div>
  );
}

function CandidateDialog({ onClose }: { onClose: () => void }) {
  const jobs = useStore((s) => s.jobs);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [jobId, setJobId] = useState<string>(jobs[0]?.id ?? "");
  const [source, setSource] = useState("LinkedIn");
  const [stage, setStage] = useState<CandidateStage>("applied");
  const [rating, setRating] = useState("3");

  const submit = () => {
    if (!name.trim()) { toast.error("Name is required"); return; }
    createCandidate({
      name: name.trim(), email: email.trim(), phone: phone.trim(),
      jobId: jobId || null, source, stage, rating: Math.max(0, Math.min(5, Number(rating) || 0)),
      resumeUrl: "",
    });
    toast.success("Candidate added");
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader><DialogTitle>Add candidate</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
        </div>
        <div>
          <Label>Job</Label>
          <select value={jobId} onChange={(e) => setJobId(e.target.value)} className="mt-1.5 h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm">
            <option value="">Unassigned</option>
            {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div><Label>Source</Label><Input value={source} onChange={(e) => setSource(e.target.value)} /></div>
          <div>
            <Label>Stage</Label>
            <select value={stage} onChange={(e) => setStage(e.target.value as CandidateStage)} className="mt-1.5 h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm">
              {stages.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
          <div><Label>Rating (0–5)</Label><Input type="number" min={0} max={5} value={rating} onChange={(e) => setRating(e.target.value)} /></div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="brand" onClick={submit}>Add candidate</Button>
      </DialogFooter>
    </DialogContent>
  );
}

function CandidateDrawer({ id, onClose }: { id: string | null; onClose: () => void }) {
  const candidates = useStore((s) => s.candidates);
  const jobs = useStore((s) => s.jobs);
  const team = useStore((s) => s.team);
  const cand = id ? candidates.find((c) => c.id === id) : null;
  const job = cand?.jobId ? jobs.find((j) => j.id === cand.jobId) : null;
  const [note, setNote] = useState("");

  return (
    <Sheet open={!!cand} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {cand && (
          <>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-brand text-sm font-bold text-brand-foreground">
                  {cand.name.split(" ").slice(0, 2).map((p) => p[0]).join("")}
                </span>
                <span>
                  <div className="text-base font-semibold">{cand.name}</div>
                  <div className="text-xs font-normal text-muted-foreground">{job?.title ?? "Unassigned"}</div>
                </span>
              </SheetTitle>
            </SheetHeader>

            <div className="mt-5 space-y-4">
              <div className="space-y-1.5 text-sm">
                {cand.email && <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" /> {cand.email}</div>}
                {cand.phone && <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" /> {cand.phone}</div>}
                <div className="text-xs text-muted-foreground">Applied {formatDate(cand.appliedAt)} · Source: {cand.source}</div>
              </div>

              <div>
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Stage</Label>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {stages.map((s) => (
                    <button
                      key={s.key} type="button"
                      onClick={() => moveCandidate(cand.id, s.key)}
                      className={`cursor-pointer rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide transition ${
                        cand.stage === s.key
                          ? "border-brand bg-gradient-brand text-brand-foreground"
                          : "border-border text-muted-foreground hover:border-brand/40 hover:text-foreground"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Rating</Label>
                <div className="mt-1.5 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i} type="button"
                      onClick={() => updateCandidate(cand.id, { rating: i + 1 })}
                      className="cursor-pointer"
                      aria-label={`Set ${i + 1} stars`}
                    >
                      <Star className={`h-5 w-5 ${i < cand.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Notes</Label>
                <div className="mt-2 flex gap-2">
                  <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note…" />
                  <Button variant="brand" onClick={() => { addCandidateNote(cand.id, note); setNote(""); }}>Add</Button>
                </div>
                <ul className="mt-3 space-y-2">
                  {cand.notes.length === 0 && <li className="text-xs text-muted-foreground">No notes yet.</li>}
                  {cand.notes.map((n) => {
                    const author = team.find((t) => t.id === n.authorId);
                    return (
                      <li key={n.id} className="rounded-lg border border-border bg-surface p-2.5 text-sm">
                        <div className="text-foreground">{n.message}</div>
                        <div className="mt-1 text-[11px] text-muted-foreground">{author?.name ?? "—"} · {relativeTime(n.at)}</div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="ghost" onClick={() => { if (confirm(`Delete candidate ${cand.name}?`)) { deleteCandidate(cand.id); onClose(); toast.message("Deleted"); } }}>
                  <Trash2 className="h-3.5 w-3.5 text-rose-500" /> Delete candidate
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
