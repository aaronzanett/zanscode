import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, CalendarDays, Trash2, MapPin, Users2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  useStore, useHydrate, createInterview, updateInterview, deleteInterview,
  formatDateTime,
  type InterviewKind, type InterviewStatus,
} from "@/lib/store";
import { EmptyState, PageHeader } from "@/components/app/EmptyState";
import { toast } from "sonner";

export const Route = createFileRoute("/app/recruitment/interviews")({
  head: () => ({ meta: [{ title: "Interview Scheduling — Recruitment" }] }),
  component: InterviewsPage,
});

const kinds: InterviewKind[] = ["phone", "technical", "culture", "final", "panel"];
const statusStyles: Record<InterviewStatus, string> = {
  scheduled: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  cancelled: "bg-secondary text-muted-foreground",
  "no-show": "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

function InterviewsPage() {
  useHydrate();
  const interviews = useStore((s) => s.interviews);
  const candidates = useStore((s) => s.candidates);
  const jobs = useStore((s) => s.jobs);
  const team = useStore((s) => s.team);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  const sorted = useMemo(() => {
    const now = Date.now();
    if (tab === "upcoming") return interviews.filter((iv) => iv.scheduledAt >= now || iv.status === "scheduled").sort((a, b) => a.scheduledAt - b.scheduledAt);
    return interviews.filter((iv) => iv.scheduledAt < now && iv.status !== "scheduled").sort((a, b) => b.scheduledAt - a.scheduledAt);
  }, [interviews, tab]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Interview Scheduling"
        description="Schedule, run, and capture feedback for every candidate interview."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="brand"><Plus className="h-4 w-4" /> Schedule interview</Button></DialogTrigger>
            <InterviewDialog onClose={() => setOpen(false)} />
          </Dialog>
        }
      />

      <div className="inline-flex rounded-lg border border-border bg-card p-1">
        {(["upcoming", "past"] as const).map((t) => (
          <button
            key={t} type="button" onClick={() => setTab(t)}
            className={`cursor-pointer rounded-md px-3 py-1 text-xs font-semibold capitalize transition ${tab === t ? "bg-gradient-brand text-brand-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"}`}
          >{t}</button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <EmptyState icon={CalendarDays} title={tab === "upcoming" ? "No upcoming interviews" : "No past interviews"} description="Schedule your first interview to start capturing feedback." />
      ) : (
        <div className="space-y-2">
          {sorted.map((iv) => {
            const cand = candidates.find((c) => c.id === iv.candidateId);
            const job = jobs.find((j) => j.id === iv.jobId);
            const interviewers = team.filter((t) => iv.interviewerIds.includes(t.id));
            return (
              <div key={iv.id} className="rounded-xl border border-border bg-card p-4 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-semibold">{cand?.name ?? "Unknown candidate"}</span>
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">{iv.kind}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusStyles[iv.status]}`}>{iv.status}</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{job?.title ?? "—"}</div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {formatDateTime(iv.scheduledAt)} · {iv.durationMins}min</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {iv.location}</span>
                      <span className="inline-flex items-center gap-1"><Users2 className="h-3 w-3" /> {interviewers.map((i) => i.name).join(", ") || "—"}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <select
                      value={iv.status}
                      onChange={(e) => updateInterview(iv.id, { status: e.target.value as InterviewStatus })}
                      className="h-8 cursor-pointer rounded-md border border-input bg-background px-2 text-xs"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="no-show">No-show</option>
                    </select>
                    <Button size="sm" variant="ghost" onClick={() => { if (confirm("Delete this interview?")) { deleteInterview(iv.id); toast.message("Deleted"); } }}>
                      <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                    </Button>
                  </div>
                </div>

                {iv.status === "completed" && (
                  <div className="mt-3 rounded-lg border border-border bg-surface p-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <button key={i} type="button" onClick={() => updateInterview(iv.id, { score: i + 1 })} className="cursor-pointer">
                          <Star className={`h-4 w-4 ${i < iv.score ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                        </button>
                      ))}
                      <span className="ml-2 text-xs text-muted-foreground">Score</span>
                    </div>
                    <Textarea
                      rows={2}
                      value={iv.feedback}
                      onChange={(e) => updateInterview(iv.id, { feedback: e.target.value })}
                      placeholder="Feedback…"
                      className="mt-2"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function InterviewDialog({ onClose }: { onClose: () => void }) {
  const candidates = useStore((s) => s.candidates);
  const jobs = useStore((s) => s.jobs);
  const team = useStore((s) => s.team);
  const [candidateId, setCandidateId] = useState<string>(candidates[0]?.id ?? "");
  const [jobId, setJobId] = useState<string>("");
  const [kind, setKind] = useState<InterviewKind>("technical");
  const [date, setDate] = useState<string>(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [time, setTime] = useState<string>("10:00");
  const [duration, setDuration] = useState("60");
  const [location, setLocation] = useState("Google Meet");
  const [interviewers, setInterviewers] = useState<string[]>([]);

  const submit = () => {
    if (!candidateId) { toast.error("Pick a candidate"); return; }
    const scheduledAt = new Date(`${date}T${time}:00`).getTime();
    createInterview({
      candidateId, jobId: jobId || (candidates.find((c) => c.id === candidateId)?.jobId ?? null),
      kind, scheduledAt, durationMins: Math.max(15, Number(duration) || 30),
      location, interviewerIds: interviewers, status: "scheduled", feedback: "", score: 0,
    });
    toast.success("Interview scheduled");
    onClose();
  };

  const toggleInterviewer = (id: string) => {
    setInterviewers((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  };

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader><DialogTitle>Schedule interview</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Candidate</Label>
            <select value={candidateId} onChange={(e) => setCandidateId(e.target.value)} className="mt-1.5 h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm">
              {candidates.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <Label>Job (override)</Label>
            <select value={jobId} onChange={(e) => setJobId(e.target.value)} className="mt-1.5 h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm">
              <option value="">Use candidate's job</option>
              {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
            </select>
          </div>
          <div>
            <Label>Kind</Label>
            <select value={kind} onChange={(e) => setKind(e.target.value as InterviewKind)} className="mt-1.5 h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm capitalize">
              {kinds.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div>
            <Label>Duration (min)</Label>
            <Input type="number" min={15} step={15} value={duration} onChange={(e) => setDuration(e.target.value)} />
          </div>
          <div>
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <Label>Time</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Location</Label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Google Meet / Office / Phone" />
        </div>
        <div>
          <Label>Interviewers</Label>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {team.map((t) => {
              const on = interviewers.includes(t.id);
              return (
                <button
                  key={t.id} type="button"
                  onClick={() => toggleInterviewer(t.id)}
                  className={`cursor-pointer rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                    on ? "border-brand bg-gradient-brand text-brand-foreground" : "border-border text-muted-foreground hover:border-brand/40 hover:text-foreground"
                  }`}
                >{t.name}</button>
              );
            })}
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="brand" onClick={submit}>Schedule</Button>
      </DialogFooter>
    </DialogContent>
  );
}
