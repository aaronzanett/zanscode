import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, UserCog, ArrowLeft, Mail, Briefcase, ListChecks, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  useStore, useHydrate, createMember, updateMember, deleteMember,
  formatDate,
} from "@/lib/store";
import { EmptyState, PageHeader } from "@/components/app/EmptyState";

export const Route = createFileRoute("/app/team")({
  validateSearch: (s: Record<string, unknown>): { id?: string } => (typeof s.id === "string" ? { id: s.id } : {}),
  component: TeamPage,
});

function TeamPage() {
  useHydrate();
  const { id } = Route.useSearch();
  if (id) return <MemberDetail id={id} />;
  return <TeamList />;
}

function TeamList() {
  const team = useStore((s) => s.team);
  const projects = useStore((s) => s.projects);
  const tasks = useStore((s) => s.tasks);
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Team"
        description="See who's working on what — workload and accountability at a glance."
        action={<Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button variant="brand"><Plus className="h-4 w-4" /> Add member</Button></DialogTrigger><MemberDialog onClose={() => setOpen(false)} /></Dialog>}
      />

      {team.length === 0 ? (
        <EmptyState icon={UserCog} title="No team members yet" description="Add team members so you can assign them to projects and tasks." action={<Dialog><DialogTrigger asChild><Button variant="brand"><Plus className="h-4 w-4" /> Add first member</Button></DialogTrigger><MemberDialog onClose={() => undefined} /></Dialog>} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {team.map((m) => {
            const projectCount = projects.filter((p) => p.memberIds.includes(m.id)).length;
            const taskCount = tasks.filter((t) => t.assigneeId === m.id && t.stage !== "done").length;
            return (
              <Link key={m.id} to="/app/team" search={{ id: m.id }} className="rounded-xl border border-border bg-card p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-brand text-sm font-bold text-brand-foreground">{m.initials}</div>
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{m.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{m.role}</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Briefcase className="h-3 w-3" /> {projectCount} project{projectCount === 1 ? "" : "s"}</span>
                  <span className="inline-flex items-center gap-1"><ListChecks className="h-3 w-3" /> {taskCount} open</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MemberDialog({ onClose, initial }: { onClose: () => void; initial?: { id: string; name: string; email: string; role: string } }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [role, setRole] = useState(initial?.role ?? "");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (initial) updateMember(initial.id, { name, email, role });
    else createMember({ name, email, role });
    onClose();
  };

  return (
    <DialogContent>
      <form onSubmit={submit}>
        <DialogHeader><DialogTitle>{initial ? "Edit member" : "Add team member"}</DialogTitle></DialogHeader>
        <div className="mt-4 space-y-3">
          <div className="space-y-1.5"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
          <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Role</Label><Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Engineer, PM, Designer…" /></div>
        </div>
        <DialogFooter className="mt-5">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="brand">{initial ? "Save" : "Add"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function MemberDetail({ id }: { id: string }) {
  const member = useStore((s) => s.team.find((m) => m.id === id));
  const projects = useStore((s) => s.projects.filter((p) => p.memberIds.includes(id)));
  const tasks = useStore((s) => s.tasks.filter((t) => t.assigneeId === id));
  const [editOpen, setEditOpen] = useState(false);

  if (!member) {
    return (
      <div className="space-y-4">
        <Link to="/app/team" search={{ id: undefined }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back</Link>
        <EmptyState icon={UserCog} title="Member not found" description="They may have been removed." />
      </div>
    );
  }

  const onDelete = () => {
    if (confirm(`Remove ${member.name}? They'll be unassigned from all projects and tasks.`)) {
      deleteMember(member.id);
      window.history.back();
    }
  };

  const open = tasks.filter((t) => t.stage !== "done");
  const done = tasks.filter((t) => t.stage === "done");

  return (
    <div className="space-y-5">
      <Link to="/app/team" search={{ id: undefined }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to team</Link>

      <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-brand text-lg font-bold text-brand-foreground">{member.initials}</div>
            <div>
              <h1 className="text-xl font-bold">{member.name}</h1>
              <p className="text-sm text-muted-foreground">{member.role}</p>
              {member.email && <p className="mt-1 text-xs text-muted-foreground inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {member.email}</p>}
              <p className="mt-0.5 text-xs text-muted-foreground">Joined {formatDate(member.joinedAt)}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}><DialogTrigger asChild><Button variant="outline" size="sm">Edit</Button></DialogTrigger><MemberDialog onClose={() => setEditOpen(false)} initial={member} /></Dialog>
            <Button variant="outline" size="sm" onClick={onDelete}><Trash2 className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Projects" value={projects.length} />
        <Stat label="Open tasks" value={open.length} />
        <Stat label="Completed tasks" value={done.length} />
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold">Projects</h2>
        {projects.length === 0 ? (
          <EmptyState icon={Briefcase} title="No projects assigned" description="Assign this member from a project's edit screen." />
        ) : (
          <div className="grid gap-2 md:grid-cols-2">
            {projects.map((p) => (
              <Link key={p.id} to="/app/projects" search={{ id: p.id }} className="rounded-lg border border-border bg-card p-3 shadow-soft transition hover:border-brand/40">
                <div className="font-medium text-sm">{p.name}</div>
                <div className="mt-0.5 text-xs text-muted-foreground capitalize">{p.status}</div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold">Active tasks</h2>
        {open.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border bg-secondary/40 px-4 py-6 text-center text-sm text-muted-foreground">No open tasks.</p>
        ) : (
          <ul className="space-y-1.5">
            {open.map((t) => (
              <li key={t.id} className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-sm">
                <div>
                  <div className="font-medium">{t.title}</div>
                  <div className="text-[11px] text-muted-foreground capitalize">{t.stage.replace("-", " ")}</div>
                </div>
                {t.dueDate && <span className="text-[11px] text-muted-foreground">{formatDate(t.dueDate)}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}
