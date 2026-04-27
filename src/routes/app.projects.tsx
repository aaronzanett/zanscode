import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Briefcase, ArrowLeft, Trash2, Users, CalendarDays, Activity, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useStore, useHydrate, createProject, updateProject, deleteProject, logProjectActivity,
  formatDate, relativeTime, projectProgress, type ProjectStatus,
} from "@/lib/store";
import { EmptyState, PageHeader } from "@/components/app/EmptyState";

export const Route = createFileRoute("/app/projects")({
  validateSearch: (s: Record<string, unknown>) => ({ id: typeof s.id === "string" ? s.id : undefined }),
  component: ProjectsPage,
});

const statusBadge: Record<ProjectStatus, string> = {
  planning: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "on-hold": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  completed: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
};

function ProjectsPage() {
  useHydrate();
  const { id } = Route.useSearch();
  if (id) return <ProjectDetail id={id} />;
  return <ProjectsList />;
}

function ProjectsList() {
  const store = useStore((s) => s);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | ProjectStatus>("all");

  const visible = filter === "all" ? store.projects : store.projects.filter((p) => p.status === filter);

  if (store.clients.length === 0) {
    return (
      <div className="space-y-5">
        <PageHeader title="Projects" description="Every project must be tied to a client." />
        <EmptyState
          icon={Briefcase}
          title="Add a client first"
          description="Projects must be associated with a client. Create a client to begin."
          action={<Link to="/app/clients" search={{}}><Button variant="brand"><Plus className="h-4 w-4" /> Go to clients</Button></Link>}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Projects"
        description="Track delivery across every client engagement."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="brand"><Plus className="h-4 w-4" /> New project</Button></DialogTrigger>
            <ProjectDialog onClose={() => setOpen(false)} />
          </Dialog>
        }
      />

      <div className="flex flex-wrap items-center gap-1 rounded-md bg-secondary p-0.5 text-xs">
        {(["all", "planning", "active", "on-hold", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded px-2.5 py-1 font-medium capitalize transition ${filter === f ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {f.replace("-", " ")}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={store.projects.length === 0 ? "No projects yet" : "No projects match"}
          description={store.projects.length === 0 ? "Kick off your first project — link it to a client and assign team members." : "Try a different filter."}
          action={store.projects.length === 0 ? (
            <Dialog><DialogTrigger asChild><Button variant="brand"><Plus className="h-4 w-4" /> New project</Button></DialogTrigger><ProjectDialog onClose={() => undefined} /></Dialog>
          ) : undefined}
        />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {visible.map((p) => {
            const client = store.clients.find((c) => c.id === p.clientId);
            const progress = projectProgress(p.id, store);
            const taskCount = store.tasks.filter((t) => t.projectId === p.id).length;
            return (
              <Link key={p.id} to="/app/projects" search={{ id: p.id }} className="group rounded-xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{p.name}</div>
                    <div className="mt-0.5 truncate text-xs text-muted-foreground">{client?.name ?? "Unassigned"} · due {formatDate(p.dueDate)}</div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusBadge[p.status]}`}>{p.status}</span>
                </div>
                <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{p.description || "No description."}</p>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Progress</span><span>{progress}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-gradient-brand transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {p.memberIds.length}</span>
                  <span className="inline-flex items-center gap-1"><ListChecks className="h-3 w-3" /> {taskCount} tasks</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProjectDialog({ onClose, initial }: { onClose: () => void; initial?: { id: string; name: string; clientId: string; description: string; status: ProjectStatus; startDate: string; dueDate: string; memberIds: string[] } }) {
  const clients = useStore((s) => s.clients);
  const team = useStore((s) => s.team);
  const [name, setName] = useState(initial?.name ?? "");
  const [clientId, setClientId] = useState(initial?.clientId ?? clients[0]?.id ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<ProjectStatus>(initial?.status ?? "planning");
  const [startDate, setStartDate] = useState(initial?.startDate ?? new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10));
  const [memberIds, setMemberIds] = useState<string[]>(initial?.memberIds ?? []);

  const toggle = (id: string) => setMemberIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !clientId) return;
    if (initial) {
      updateProject(initial.id, { name, clientId, description, status, startDate, dueDate, memberIds });
      logProjectActivity(initial.id, "Project details updated.");
    } else {
      createProject({ name, clientId, description, status, startDate, dueDate, memberIds });
    }
    onClose();
  };

  return (
    <DialogContent className="max-w-lg">
      <form onSubmit={submit}>
        <DialogHeader><DialogTitle>{initial ? "Edit project" : "New project"}</DialogTitle></DialogHeader>
        <div className="mt-4 space-y-3">
          <div className="space-y-1.5"><Label>Project name</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Client</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as ProjectStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on-hold">On hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Start date</Label><Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Due date</Label><Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></div>
          </div>
          <div className="space-y-1.5"><Label>Description</Label><Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          <div className="space-y-1.5">
            <Label>Team members</Label>
            {team.length === 0 ? (
              <p className="text-xs text-muted-foreground">No team members yet. Add some from the Team module.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {team.map((m) => {
                  const on = memberIds.includes(m.id);
                  return (
                    <button type="button" key={m.id} onClick={() => toggle(m.id)} className={`rounded-full border px-2.5 py-1 text-xs transition ${on ? "border-brand bg-gradient-brand text-brand-foreground" : "border-border bg-secondary text-muted-foreground hover:text-foreground"}`}>
                      {m.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="mt-5">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="brand" disabled={!clientId}>{initial ? "Save" : "Create project"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function ProjectDetail({ id }: { id: string }) {
  const store = useStore((s) => s);
  const project = store.projects.find((p) => p.id === id);
  const [editOpen, setEditOpen] = useState(false);

  if (!project) {
    return (
      <div className="space-y-4">
        <Link to="/app/projects" search={{}} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back</Link>
        <EmptyState icon={Briefcase} title="Project not found" description="It may have been deleted." />
      </div>
    );
  }

  const client = store.clients.find((c) => c.id === project.clientId);
  const tasks = store.tasks.filter((t) => t.projectId === project.id);
  const members = store.team.filter((m) => project.memberIds.includes(m.id));
  const progress = projectProgress(project.id, store);

  const onDelete = () => {
    if (confirm(`Delete project "${project.name}"? All its tasks will be removed.`)) {
      deleteProject(project.id);
      window.history.back();
    }
  };

  return (
    <div className="space-y-5">
      <Link to="/app/projects" search={{}} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to projects</Link>

      <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{project.name}</h1>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusBadge[project.status]}`}>{project.status}</span>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {client ? <Link to="/app/clients" search={{ id: client.id }} className="hover:underline">{client.name}</Link> : "No client"}
              {" · "}{formatDate(project.startDate)} → {formatDate(project.dueDate)}
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild><Button variant="outline" size="sm">Edit</Button></DialogTrigger>
              <ProjectDialog onClose={() => setEditOpen(false)} initial={project} />
            </Dialog>
            <Button variant="outline" size="sm" onClick={onDelete}><Trash2 className="h-4 w-4" /></Button>
          </div>
        </div>
        {project.description && <p className="mt-3 text-sm text-foreground/85">{project.description}</p>}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground"><span>Progress</span><span>{progress}% ({tasks.filter((t) => t.stage === "done").length}/{tasks.length} tasks)</span></div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full bg-gradient-brand transition-all" style={{ width: `${progress}%` }} /></div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-soft lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold inline-flex items-center gap-2"><ListChecks className="h-4 w-4 text-brand" /> Tasks</h2>
            <Link to="/app/tasks" search={{ projectId: project.id }} className="text-xs text-brand hover:underline">Open board →</Link>
          </div>
          {tasks.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border bg-secondary/40 px-4 py-6 text-center text-sm text-muted-foreground">
              No tasks yet. <Link to="/app/tasks" search={{ projectId: project.id }} className="text-brand hover:underline">Create the first task →</Link>
            </p>
          ) : (
            <ul className="space-y-1.5">
              {tasks.slice(0, 8).map((t) => {
                const a = store.team.find((m) => m.id === t.assigneeId);
                return (
                  <li key={t.id} className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm">
                    <div className="min-w-0">
                      <div className="truncate font-medium">{t.title}</div>
                      <div className="text-[11px] text-muted-foreground">{t.stage} · {a?.name ?? "Unassigned"}</div>
                    </div>
                    {t.dueDate && <span className="shrink-0 text-[11px] text-muted-foreground">{formatDate(t.dueDate)}</span>}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
            <h2 className="mb-3 text-sm font-semibold inline-flex items-center gap-2"><Users className="h-4 w-4 text-brand" /> Team</h2>
            {members.length === 0 ? (
              <p className="text-xs text-muted-foreground">No members assigned.</p>
            ) : (
              <ul className="space-y-2">
                {members.map((m) => (
                  <li key={m.id} className="flex items-center gap-2 text-sm">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-[10px] font-bold text-brand-foreground">{m.initials}</div>
                    <div className="min-w-0">
                      <div className="truncate font-medium">{m.name}</div>
                      <div className="truncate text-[11px] text-muted-foreground">{m.role}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
            <h2 className="mb-3 text-sm font-semibold inline-flex items-center gap-2"><Activity className="h-4 w-4 text-brand" /> Activity</h2>
            <ul className="space-y-2">
              {project.activity.slice(0, 6).map((a) => (
                <li key={a.id} className="flex items-start gap-2 text-xs">
                  <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  <div className="min-w-0">
                    <div className="text-foreground/90">{a.message}</div>
                    <div className="text-[10px] text-muted-foreground">{relativeTime(a.at)}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
            <h2 className="mb-3 text-sm font-semibold inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-brand" /> Timeline</h2>
            <div className="text-xs text-muted-foreground">Start: <span className="font-medium text-foreground">{formatDate(project.startDate)}</span></div>
            <div className="mt-1 text-xs text-muted-foreground">Due: <span className="font-medium text-foreground">{formatDate(project.dueDate)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
