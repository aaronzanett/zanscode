import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Briefcase, Trash2, Eye, EyeOff, ExternalLink, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  useStore, useHydrate, createJob, updateJob, deleteJob,
  formatDate,
  type JobTeam, type JobType, type JobStatus, type JobPosting,
} from "@/lib/store";
import { EmptyState, PageHeader } from "@/components/app/EmptyState";
import { toast } from "sonner";

export const Route = createFileRoute("/app/recruitment/jobs")({
  head: () => ({ meta: [{ title: "Jobs — Recruitment" }] }),
  component: JobsPage,
});

const statusStyles: Record<JobStatus, string> = {
  draft: "bg-secondary text-muted-foreground",
  published: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  closed: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

const departments: JobTeam[] = ["Engineering", "Design", "Product", "Operations", "Sales", "HR", "Finance"];
const jobTypes: JobType[] = ["Full-time", "Contract", "Internship", "Part-time"];

function JobsPage() {
  useHydrate();
  const jobs = useStore((s) => s.jobs);
  const requisitions = useStore((s) => s.requisitions);
  const candidates = useStore((s) => s.candidates);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<JobPosting | null>(null);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Jobs"
        description="Public job postings — toggle Published to make a job appear on the careers page."
        action={
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
            <DialogTrigger asChild><Button variant="brand"><Plus className="h-4 w-4" /> New job</Button></DialogTrigger>
            <JobDialog editing={editing} onClose={() => { setOpen(false); setEditing(null); }} />
          </Dialog>
        }
      />

      <div className="rounded-lg border border-dashed border-border bg-surface/40 px-4 py-2.5 text-xs text-muted-foreground">
        Tip: Published jobs are the single source of truth for the public <Link to="/careers" className="font-semibold text-brand hover:underline">/careers</Link> page.
      </div>

      {jobs.length === 0 ? (
        <EmptyState icon={Briefcase} title="No jobs yet" description="Create your first job posting." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Title</th>
                <th className="px-4 py-2.5 font-semibold">Team</th>
                <th className="px-4 py-2.5 font-semibold">Type</th>
                <th className="px-4 py-2.5 font-semibold">Requisition</th>
                <th className="px-4 py-2.5 font-semibold">Applicants</th>
                <th className="px-4 py-2.5 font-semibold">Status</th>
                <th className="px-4 py-2.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {jobs.map((j) => {
                const req = requisitions.find((r) => r.id === j.requisitionId);
                const applicants = candidates.filter((c) => c.jobId === j.id).length;
                return (
                  <tr key={j.id} className="hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <div className="font-medium">{j.title}</div>
                      <div className="text-xs text-muted-foreground">{j.location} · posted {formatDate(j.postedAt)}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{j.team}</td>
                    <td className="px-4 py-3 text-muted-foreground">{j.type} · {j.level}</td>
                    <td className="px-4 py-3 text-muted-foreground">{req?.code ?? "—"}</td>
                    <td className="px-4 py-3 font-semibold">{applicants}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusStyles[j.status]}`}>
                        {j.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm" variant="ghost"
                          onClick={() => {
                            const next: JobStatus = j.status === "published" ? "draft" : "published";
                            updateJob(j.id, { status: next });
                            toast.success(next === "published" ? "Published to /careers" : "Unpublished");
                          }}
                          title={j.status === "published" ? "Unpublish" : "Publish"}
                        >
                          {j.status === "published" ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5 text-emerald-500" />}
                        </Button>
                        {j.status === "published" && (
                          <Button asChild size="sm" variant="ghost" title="View on careers page">
                            <Link to="/apply/$jobSlug" params={{ jobSlug: j.slug }} target="_blank">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => { setEditing(j); setOpen(true); }}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => { if (confirm(`Delete "${j.title}"?`)) { deleteJob(j.id); toast.message("Deleted"); } }}>
                          <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function JobDialog({ editing, onClose }: { editing: JobPosting | null; onClose: () => void }) {
  const team = useStore((s) => s.team);
  const requisitions = useStore((s) => s.requisitions);
  const [title, setTitle] = useState(editing?.title ?? "");
  const [team_, setTeam] = useState<JobTeam>(editing?.team ?? "Engineering");
  const [type, setType] = useState<JobType>(editing?.type ?? "Full-time");
  const [level, setLevel] = useState(editing?.level ?? "Mid");
  const [location, setLocation] = useState(editing?.location ?? "Remote");
  const [openings, setOpenings] = useState(String(editing?.openings ?? 1));
  const [summary, setSummary] = useState(editing?.summary ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [hm, setHm] = useState<string>(editing?.hiringManagerId ?? team[0]?.id ?? "");
  const [reqId, setReqId] = useState<string>(editing?.requisitionId ?? "");
  const [status, setStatus] = useState<JobStatus>(editing?.status ?? "draft");

  const submit = () => {
    if (!title.trim()) { toast.error("Title is required"); return; }
    if (editing) {
      updateJob(editing.id, {
        title: title.trim(), team: team_, type, level, location, openings: Math.max(1, Number(openings) || 1),
        summary: summary.trim(), description: description.trim(),
        hiringManagerId: hm || null, requisitionId: reqId || null, status,
      });
      toast.success("Job updated");
    } else {
      createJob({
        title: title.trim(), team: team_, type, level, location, openings: Math.max(1, Number(openings) || 1),
        summary: summary.trim(), description: description.trim(),
        hiringManagerId: hm || null, requisitionId: reqId || null, status,
      });
      toast.success(status === "published" ? "Published" : "Saved as draft");
    }
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader><DialogTitle>{editing ? "Edit job" : "New job"}</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div>
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Frontend Engineer" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <Label>Team</Label>
            <select value={team_} onChange={(e) => setTeam(e.target.value as JobTeam)} className="mt-1.5 h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm">
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <Label>Type</Label>
            <select value={type} onChange={(e) => setType(e.target.value as JobType)} className="mt-1.5 h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm">
              {jobTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <Label>Level</Label>
            <Input value={level} onChange={(e) => setLevel(e.target.value)} placeholder="Junior / Mid / Senior" />
          </div>
          <div>
            <Label>Openings</Label>
            <Input type="number" min={1} value={openings} onChange={(e) => setOpenings(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Location</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div>
            <Label>Status</Label>
            <select value={status} onChange={(e) => setStatus(e.target.value as JobStatus)} className="mt-1.5 h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm">
              <option value="draft">Draft (hidden)</option>
              <option value="published">Published (live on /careers)</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <Label>Hiring manager</Label>
            <select value={hm} onChange={(e) => setHm(e.target.value)} className="mt-1.5 h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm">
              <option value="">—</option>
              {team.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <Label>Requisition</Label>
            <select value={reqId} onChange={(e) => setReqId(e.target.value)} className="mt-1.5 h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm">
              <option value="">— None —</option>
              {requisitions.map((r) => <option key={r.id} value={r.id}>{r.code} · {r.title}</option>)}
            </select>
          </div>
        </div>
        <div>
          <Label>Summary (one-liner shown on /careers)</Label>
          <Input value={summary} onChange={(e) => setSummary(e.target.value)} />
        </div>
        <div>
          <Label>Full description</Label>
          <Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="brand" onClick={submit}>{editing ? "Save changes" : "Create job"}</Button>
      </DialogFooter>
    </DialogContent>
  );
}
