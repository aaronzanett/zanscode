import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, CalendarDays, Trash2, MapPin, Users2, Star, Video, Link2, Copy, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateTimePicker } from "@/components/app/DateTimePicker";
import {
  useStore, useHydrate, createInterview, updateInterview, deleteInterview,
  formatDateTime, generateMeetingLink, meetingProviderLabel,
  type InterviewKind, type InterviewStatus, type MeetingProvider,
} from "@/lib/store";
import { EmptyState, PageHeader } from "@/components/app/EmptyState";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/recruitment/interviews")({
  head: () => ({ meta: [{ title: "Interview Scheduling — Recruitment" }] }),
  component: InterviewsPage,
});

const kinds: InterviewKind[] = ["phone", "technical", "culture", "final", "panel"];
const providers: MeetingProvider[] = ["google-meet", "ms-teams", "zoom", "onsite", "phone"];

const statusStyles: Record<InterviewStatus, string> = {
  scheduled: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  cancelled: "bg-secondary text-muted-foreground",
  "no-show": "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

function providerColor(p: MeetingProvider) {
  switch (p) {
    case "google-meet": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    case "ms-teams": return "bg-violet-500/10 text-violet-600 dark:text-violet-400";
    case "zoom": return "bg-sky-500/10 text-sky-600 dark:text-sky-400";
    case "onsite": return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
    case "phone": return "bg-secondary text-muted-foreground";
    default: return "bg-secondary text-muted-foreground";
  }
}

function InterviewsPage() {
  useHydrate();
  const interviews = useStore((s) => s.interviews);
  const candidates = useStore((s) => s.candidates);
  const jobs = useStore((s) => s.jobs);
  const team = useStore((s) => s.team);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  const sorted = useMemo(() => {
    const t = Date.now();
    if (tab === "upcoming") return interviews.filter((iv) => iv.scheduledAt >= t || iv.status === "scheduled").sort((a, b) => a.scheduledAt - b.scheduledAt);
    return interviews.filter((iv) => iv.scheduledAt < t && iv.status !== "scheduled").sort((a, b) => b.scheduledAt - a.scheduledAt);
  }, [interviews, tab]);

  const upcomingCount = interviews.filter((iv) => iv.status === "scheduled" && iv.scheduledAt >= Date.now()).length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Interview Scheduling"
        description="Schedule interviews with one-click Meet/Teams/Zoom links and capture feedback."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="brand"><Plus className="h-4 w-4" /> Schedule interview</Button></DialogTrigger>
            <InterviewDialog onClose={() => setOpen(false)} />
          </Dialog>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Upcoming", value: upcomingCount, icon: CalendarDays },
          { label: "Total", value: interviews.length, icon: Users2 },
          { label: "Completed", value: interviews.filter((iv) => iv.status === "completed").length, icon: Star },
          { label: "Virtual", value: interviews.filter((iv) => ["google-meet", "ms-teams", "zoom"].includes(iv.meetingProvider)).length, icon: Video },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <s.icon className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="mt-2 text-2xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as "upcoming" | "past")}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
      </Tabs>

      {sorted.length === 0 ? (
        <EmptyState icon={CalendarDays} title={tab === "upcoming" ? "No upcoming interviews" : "No past interviews"} description="Schedule your first interview to start capturing feedback." />
      ) : (
        <div className="space-y-2">
          {sorted.map((iv) => {
            const cand = candidates.find((c) => c.id === iv.candidateId);
            const job = jobs.find((j) => j.id === iv.jobId);
            const interviewers = team.filter((t) => iv.interviewerIds.includes(t.id));
            const isVirtual = ["google-meet", "ms-teams", "zoom"].includes(iv.meetingProvider);
            return (
              <div key={iv.id} className="rounded-xl border border-border bg-card p-4 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-semibold">{cand?.name ?? "Unknown candidate"}</span>
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">{iv.kind}</span>
                      <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", statusStyles[iv.status])}>{iv.status}</span>
                      <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", providerColor(iv.meetingProvider))}>
                        <Video className="h-2.5 w-2.5" /> {meetingProviderLabel(iv.meetingProvider)}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{job?.title ?? "—"}</div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {formatDateTime(iv.scheduledAt)} · {iv.durationMins}min</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {iv.location || meetingProviderLabel(iv.meetingProvider)}</span>
                      <span className="inline-flex items-center gap-1"><Users2 className="h-3 w-3" /> {interviewers.map((i) => i.name).join(", ") || "—"}</span>
                    </div>
                    {isVirtual && iv.meetingUrl && (
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <a
                          href={iv.meetingUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-1.5 rounded-md bg-gradient-brand px-2.5 py-1 text-[11px] font-semibold text-brand-foreground shadow-soft transition hover:opacity-90"
                        >
                          <ExternalLink className="h-3 w-3" /> Join {meetingProviderLabel(iv.meetingProvider)}
                        </a>
                        <button
                          type="button"
                          onClick={() => { void navigator.clipboard.writeText(iv.meetingUrl); toast.success("Link copied"); }}
                          className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] font-medium text-muted-foreground transition hover:border-brand hover:text-brand"
                        >
                          <Copy className="h-3 w-3" /> Copy
                        </button>
                        <span className="truncate text-[11px] text-muted-foreground">{iv.meetingUrl}</span>
                      </div>
                    )}
                    {isVirtual && !iv.meetingUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          const url = generateMeetingLink(iv.meetingProvider);
                          updateInterview(iv.id, { meetingUrl: url });
                          toast.success(`${meetingProviderLabel(iv.meetingProvider)} link generated`);
                        }}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition hover:border-brand hover:text-brand"
                      >
                        <Sparkles className="h-3 w-3" /> Generate {meetingProviderLabel(iv.meetingProvider)} link
                      </button>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Select value={iv.status} onValueChange={(v) => updateInterview(iv.id, { status: v as InterviewStatus })}>
                      <SelectTrigger className="h-8 w-[130px] text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="no-show">No-show</SelectItem>
                      </SelectContent>
                    </Select>
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
  const [when, setWhen] = useState<Date>(() => {
    const d = new Date(Date.now() + 86400000);
    d.setHours(10, 0, 0, 0);
    return d;
  });
  const [duration, setDuration] = useState("60");
  const [provider, setProvider] = useState<MeetingProvider>("google-meet");
  const [meetingUrl, setMeetingUrl] = useState<string>("");
  const [location, setLocation] = useState("");
  const [interviewers, setInterviewers] = useState<string[]>([]);

  const isVirtual = provider === "google-meet" || provider === "ms-teams" || provider === "zoom";

  const onProviderChange = (p: MeetingProvider) => {
    setProvider(p);
    if (p === "google-meet" || p === "ms-teams" || p === "zoom") {
      setMeetingUrl(generateMeetingLink(p));
      setLocation(meetingProviderLabel(p));
    } else {
      setMeetingUrl("");
      if (!location || ["Google Meet", "Microsoft Teams", "Zoom"].includes(location)) {
        setLocation(p === "onsite" ? "Zanscode HQ — Jakarta" : p === "phone" ? "Phone call" : "");
      }
    }
  };

  const submit = () => {
    if (!candidateId) { toast.error("Pick a candidate"); return; }
    createInterview({
      candidateId,
      jobId: jobId || (candidates.find((c) => c.id === candidateId)?.jobId ?? null),
      kind,
      scheduledAt: when.getTime(),
      durationMins: Math.max(15, Number(duration) || 30),
      location: location || meetingProviderLabel(provider),
      meetingProvider: provider,
      meetingUrl,
      interviewerIds: interviewers,
      status: "scheduled",
      feedback: "",
      score: 0,
    });
    toast.success("Interview scheduled" + (isVirtual && meetingUrl ? ` · ${meetingProviderLabel(provider)} link ready` : ""));
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
            <Select value={candidateId} onValueChange={setCandidateId}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select candidate" /></SelectTrigger>
              <SelectContent>{candidates.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Job (override)</Label>
            <Select value={jobId || "__auto"} onValueChange={(v) => setJobId(v === "__auto" ? "" : v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__auto">Use candidate's job</SelectItem>
                {jobs.map((j) => <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Kind</Label>
            <Select value={kind} onValueChange={(v) => setKind(v as InterviewKind)}>
              <SelectTrigger className="mt-1.5 capitalize"><SelectValue /></SelectTrigger>
              <SelectContent>{kinds.map((k) => <SelectItem key={k} value={k} className="capitalize">{k}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Duration (min)</Label>
            <Input type="number" min={15} step={15} value={duration} onChange={(e) => setDuration(e.target.value)} />
          </div>
          <div className="col-span-2">
            <Label>When</Label>
            <div className="mt-1.5">
              <DateTimePicker value={when} onChange={setWhen} minDate={new Date()} />
            </div>
          </div>
        </div>

        <div>
          <Label>Meeting</Label>
          <div className="mt-1.5 grid grid-cols-5 gap-1.5">
            {providers.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onProviderChange(p)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-md border px-2 py-2 text-[11px] font-medium transition",
                  provider === p
                    ? "border-brand bg-gradient-brand text-brand-foreground shadow-soft"
                    : "border-border text-muted-foreground hover:border-brand/40 hover:text-foreground",
                )}
              >
                <Video className="h-3.5 w-3.5" />
                {meetingProviderLabel(p)}
              </button>
            ))}
          </div>
          {isVirtual ? (
            <div className="mt-2 flex gap-1.5">
              <Input
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                placeholder={`${meetingProviderLabel(provider)} URL`}
                className="font-mono text-xs"
              />
              <Button type="button" variant="outline" size="sm" onClick={() => setMeetingUrl(generateMeetingLink(provider))}>
                <Sparkles className="h-3.5 w-3.5" /> Generate
              </Button>
            </div>
          ) : (
            <Input
              className="mt-2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={provider === "onsite" ? "Office / address" : "Phone number"}
            />
          )}
          {isVirtual && meetingUrl && (
            <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Link2 className="h-3 w-3" /> Auto-generated demo link — share with candidate
            </p>
          )}
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
