import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, Briefcase, CalendarDays, ClipboardList, FileText, UserSquare2,
  TrendingUp,
} from "lucide-react";
import { useStore, useHydrate, formatDateTime, type CandidateStage } from "@/lib/store";
import { PageHeader } from "@/components/app/EmptyState";

export const Route = createFileRoute("/app/recruitment/")({
  head: () => ({
    meta: [
      { title: "Recruitment — Zanscode OS" },
      { name: "description", content: "HR recruitment hub: jobs, candidates, interviews and manpower planning." },
    ],
  }),
  component: RecruitmentOverview,
});

const stageOrder: CandidateStage[] = ["applied", "screening", "interview", "offer", "hired", "rejected"];
const stageLabel: Record<CandidateStage, string> = {
  applied: "Applied",
  screening: "Screening",
  interview: "Interview",
  offer: "Offer",
  hired: "Hired",
  rejected: "Rejected",
};

function RecruitmentOverview() {
  useHydrate();
  const jobs = useStore((s) => s.jobs);
  const candidates = useStore((s) => s.candidates);
  const interviews = useStore((s) => s.interviews);
  const requisitions = useStore((s) => s.requisitions);
  const mpp = useStore((s) => s.mppRequests);

  const publishedJobs = jobs.filter((j) => j.status === "published").length;
  const openReqs = requisitions.filter((r) => r.status === "open").length;
  const activeCandidates = candidates.filter((c) => c.stage !== "hired" && c.stage !== "rejected").length;
  const upcoming = interviews
    .filter((i) => i.status === "scheduled" && i.scheduledAt >= Date.now())
    .sort((a, b) => a.scheduledAt - b.scheduledAt)
    .slice(0, 5);
  const pendingMpp = mpp.filter((m) => m.status === "submitted").length;

  const stageCounts = stageOrder.map((s) => ({ stage: s, count: candidates.filter((c) => c.stage === s).length }));
  const total = candidates.length || 1;

  const stats = [
    { label: "Published jobs", value: publishedJobs, icon: Briefcase, to: "/app/recruitment/jobs" as const },
    { label: "Open requisitions", value: openReqs, icon: ClipboardList, to: "/app/recruitment/requisitions" as const },
    { label: "Active candidates", value: activeCandidates, icon: UserSquare2, to: "/app/recruitment/pipeline" as const },
    { label: "Upcoming interviews", value: upcoming.length, icon: CalendarDays, to: "/app/recruitment/interviews" as const },
    { label: "MPP awaiting approval", value: pendingMpp, icon: FileText, to: "/app/recruitment/mpp" as const },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recruitment"
        description="HR command center — manpower planning, requisitions, jobs, candidates and interviews in one place."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="group rounded-xl border border-border bg-card p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-brand">
                <s.icon className="h-4.5 w-4.5" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
            </div>
            <div className="mt-3 text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Funnel */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Pipeline funnel</h3>
              <p className="text-xs text-muted-foreground">{candidates.length} candidates total</p>
            </div>
            <Link to="/app/recruitment/pipeline" className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline">
              Open pipeline <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-4 space-y-2.5">
            {stageCounts.map(({ stage, count }) => (
              <div key={stage}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{stageLabel[stage]}</span>
                  <span className="text-muted-foreground">{count}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full ${stage === "hired" ? "bg-emerald-500" : stage === "rejected" ? "bg-rose-400" : "bg-gradient-brand"}`}
                    style={{ width: `${(count / total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming interviews */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Upcoming interviews</h3>
            <Link to="/app/recruitment/interviews" className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline">
              All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No interviews scheduled.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {upcoming.map((iv) => {
                const cand = candidates.find((c) => c.id === iv.candidateId);
                const job = jobs.find((j) => j.id === iv.jobId);
                return (
                  <li key={iv.id} className="rounded-lg border border-border bg-surface p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{cand?.name ?? "Unknown candidate"}</div>
                        <div className="truncate text-xs text-muted-foreground">{job?.title ?? "—"} · {iv.kind}</div>
                      </div>
                      <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
                        {iv.kind}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarDays className="h-3 w-3" /> {formatDateTime(iv.scheduledAt)}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Open requisitions</h3>
          <Link to="/app/recruitment/requisitions" className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline">
            Manage <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {requisitions.filter((r) => r.status === "open").length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No open requisitions.</p>
        ) : (
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {requisitions.filter((r) => r.status === "open").map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2.5 text-sm">
                <div className="min-w-0">
                  <div className="truncate font-medium">{r.title}</div>
                  <div className="truncate text-xs text-muted-foreground">{r.code} · {r.department}</div>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-brand" />
                  <span className="font-semibold">{r.filled}/{r.openings}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
