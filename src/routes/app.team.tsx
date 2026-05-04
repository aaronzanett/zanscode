import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Plus, UserCog, ArrowLeft, Mail, Briefcase, ListChecks, Trash2, Shield,
  Users as UsersIcon, ShieldCheck, Search, ExternalLink, RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useStore, useHydrate, createMember, updateMember, deleteMember,
  setMemberRole, setMemberStatus, setMemberPermissionOverride, clearMemberOverrides,
  createRole, updateRole, deleteRole,
  effectivePermissions, formatDate,
  PERMISSION_CATALOG, ALL_PERMISSIONS,
  type Permission, type Role, type TeamMember, type MemberStatus,
} from "@/lib/store";
import { EmptyState, PageHeader } from "@/components/app/EmptyState";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/team")({
  validateSearch: (s: Record<string, unknown>): { id?: string; tab?: string } => ({
    id: typeof s.id === "string" ? s.id : undefined,
    tab: typeof s.tab === "string" ? s.tab : undefined,
  }),
  component: TeamPage,
});

function TeamPage() {
  useHydrate();
  const { id } = Route.useSearch();
  if (id) return <MemberDetail id={id} />;
  return <TeamHome />;
}

// ---------- Home: tabs for Members + Roles ----------

function TeamHome() {
  const { tab } = Route.useSearch();
  const navigate = Route.useNavigate();
  const current = tab === "roles" ? "roles" : "members";

  return (
    <div className="space-y-5">
      <PageHeader
        title="Team & Access"
        description="Manage your team, what they can do, and how each role's permissions are shaped."
      />

      <Tabs
        value={current}
        onValueChange={(v) => navigate({ search: { tab: v === "members" ? undefined : v }, replace: true })}
      >
        <TabsList>
          <TabsTrigger value="members"><UsersIcon /> Members</TabsTrigger>
          <TabsTrigger value="roles"><ShieldCheck /> Roles & Permissions</TabsTrigger>
        </TabsList>
        <TabsContent value="members" className="mt-4"><MembersTab /></TabsContent>
        <TabsContent value="roles" className="mt-4"><RolesTab /></TabsContent>
      </Tabs>
    </div>
  );
}

// ---------- Members tab ----------

function MembersTab() {
  const team = useStore((s) => s.team);
  const roles = useStore((s) => s.roles);
  const projects = useStore((s) => s.projects);
  const tasks = useStore((s) => s.tasks);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return team.filter((m) => {
      if (roleFilter !== "all" && m.roleId !== roleFilter) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q)
      );
    });
  }, [team, query, roleFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, title…" className="h-9 pl-8" />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="h-9 w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {roles.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="ml-auto">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="brand"><Plus className="h-4 w-4" /> Invite member</Button>
            </DialogTrigger>
            <MemberDialog onClose={() => setOpen(false)} />
          </Dialog>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={UserCog}
          title={team.length === 0 ? "No team members yet" : "No matches"}
          description={team.length === 0 ? "Invite your first team member to start assigning work and granting access." : "Try a different filter."}
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((m) => {
            const role = roles.find((r) => r.id === m.roleId);
            const memberProjects = projects.filter((p) => p.memberIds.includes(m.id));
            const openTasks = tasks.filter((t) => t.assigneeId === m.id && t.stage !== "done");
            const overrideCount = m.grants.length + m.revokes.length;
            return (
              <div key={m.id} className="group flex flex-col rounded-xl border border-border bg-card p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md">
                <Link to="/app/team" search={{ id: m.id }} className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-sm font-bold text-brand-foreground">{m.initials}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold">{m.name}</span>
                      <StatusDot status={m.status} />
                    </div>
                    <div className="truncate text-xs text-muted-foreground">{m.role}</div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      {role && <RoleBadge role={role} />}
                      {overrideCount > 0 && (
                        <Badge variant="outline" className="text-[10px]">+{overrideCount} override{overrideCount === 1 ? "" : "s"}</Badge>
                      )}
                    </div>
                  </div>
                </Link>

                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Briefcase className="h-3 w-3" /> {memberProjects.length} project{memberProjects.length === 1 ? "" : "s"}</span>
                  <span className="inline-flex items-center gap-1"><ListChecks className="h-3 w-3" /> {openTasks.length} open</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Link to="/app/tasks" search={{ projectId: memberProjects[0]?.id }} className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-[11px] font-medium text-muted-foreground transition hover:border-brand hover:text-foreground">
                    <ListChecks className="h-3 w-3" /> Tasks
                  </Link>
                  {memberProjects[0] && (
                    <Link to="/app/projects" search={{ id: memberProjects[0].id }} className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-[11px] font-medium text-muted-foreground transition hover:border-brand hover:text-foreground">
                      <Briefcase className="h-3 w-3" /> Projects
                    </Link>
                  )}
                  <Link to="/app/team" search={{ id: m.id }} className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-[11px] font-medium text-muted-foreground transition hover:border-brand hover:text-foreground">
                    <Shield className="h-3 w-3" /> Access
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusDot({ status }: { status: MemberStatus }) {
  const map: Record<MemberStatus, { color: string; label: string }> = {
    active: { color: "bg-emerald-500", label: "Active" },
    invited: { color: "bg-amber-500", label: "Invited" },
    suspended: { color: "bg-rose-500", label: "Suspended" },
  };
  return (
    <span title={map[status].label} className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
      <span className={cn("h-1.5 w-1.5 rounded-full", map[status].color)} /> {map[status].label}
    </span>
  );
}

function RoleBadge({ role }: { role: Role }) {
  return (
    <Badge variant="secondary" className="text-[10px]">
      <Shield className={cn("h-3 w-3", role.color)} />
      {role.name}
    </Badge>
  );
}

// ---------- Member dialog (invite / edit basics) ----------

function MemberDialog({ onClose, initial }: { onClose: () => void; initial?: TeamMember }) {
  const roles = useStore((s) => s.roles);
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [roleId, setRoleId] = useState(initial?.roleId ?? "role-staff");
  const [status, setStatus] = useState<MemberStatus>(initial?.status ?? "invited");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (initial) updateMember(initial.id, { name, email, role, roleId, status });
    else createMember({ name, email, role, roleId, status });
    onClose();
  };

  return (
    <DialogContent>
      <form onSubmit={submit}>
        <DialogHeader><DialogTitle>{initial ? "Edit member" : "Invite team member"}</DialogTitle></DialogHeader>
        <div className="mt-4 grid gap-3">
          <div className="space-y-1.5"><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
          <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div className="space-y-1.5"><Label>Job title</Label><Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Engineer, PM, Designer…" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Access role</Label>
              <Select value={roleId} onValueChange={setRoleId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{roles.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as MemberStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="invited">Invited</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter className="mt-5">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="brand">{initial ? "Save" : "Send invite"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

// ---------- Member detail (with per-user permission overrides) ----------

function MemberDetail({ id }: { id: string }) {
  const member = useStore((s) => s.team.find((m) => m.id === id));
  const roles = useStore((s) => s.roles);
  const projects = useStore((s) => s.projects.filter((p) => p.memberIds.includes(id)));
  const tasks = useStore((s) => s.tasks.filter((t) => t.assigneeId === id));
  const [editOpen, setEditOpen] = useState(false);

  if (!member) {
    return (
      <div className="space-y-4">
        <Link to="/app/team" search={{}} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back</Link>
        <EmptyState icon={UserCog} title="Member not found" description="They may have been removed." />
      </div>
    );
  }

  const role = roles.find((r) => r.id === member.roleId);
  const effective = effectivePermissions(member, roles);

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
      <Link to="/app/team" search={{}} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to team</Link>

      <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-brand text-lg font-bold text-brand-foreground">{member.initials}</div>
            <div>
              <h1 className="text-xl font-bold">{member.name}</h1>
              <p className="text-sm text-muted-foreground">{member.role}</p>
              {member.email && <p className="mt-1 text-xs text-muted-foreground inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {member.email}</p>}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {role && <RoleBadge role={role} />}
                <StatusDot status={member.status} />
                <span className="text-[11px] text-muted-foreground">Joined {formatDate(member.joinedAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="w-44">
              <Select value={member.roleId} onValueChange={(v) => setMemberRole(member.id, v)}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{roles.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Select value={member.status} onValueChange={(v) => setMemberStatus(member.id, v as MemberStatus)}>
              <SelectTrigger className="h-9 w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="invited">Invited</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={editOpen} onOpenChange={setEditOpen}><DialogTrigger asChild><Button variant="outline" size="sm">Edit</Button></DialogTrigger><MemberDialog onClose={() => setEditOpen(false)} initial={member} /></Dialog>
            <Button variant="outline" size="sm" onClick={onDelete}><Trash2 className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="Projects" value={projects.length} />
        <Stat label="Open tasks" value={open.length} />
        <Stat label="Completed tasks" value={done.length} />
        <Stat label="Effective permissions" value={effective.size} />
      </div>

      {/* Permission overrides */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold inline-flex items-center gap-1.5"><Shield className="h-4 w-4 text-brand" /> Access overrides</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Tweak this user's permissions on top of their role. Inherits from <span className="font-medium text-foreground">{role?.name ?? "—"}</span> by default.</p>
          </div>
          {(member.grants.length + member.revokes.length > 0) && (
            <Button size="sm" variant="ghost" onClick={() => clearMemberOverrides(member.id)}>
              <RotateCcw className="h-3.5 w-3.5" /> Reset to role
            </Button>
          )}
        </div>

        <div className="mt-4 space-y-4">
          {PERMISSION_CATALOG.map((g) => (
            <div key={g.group}>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{g.group}</div>
              <div className="grid gap-1.5 md:grid-cols-2">
                {g.items.map((p) => {
                  const fromRole = (role?.permissions ?? []).includes(p.key);
                  const granted = member.grants.includes(p.key);
                  const revoked = member.revokes.includes(p.key);
                  const mode: "inherit" | "grant" | "revoke" = granted ? "grant" : revoked ? "revoke" : "inherit";
                  const final = effective.has(p.key);
                  return (
                    <div key={p.key} className={cn("flex items-center justify-between gap-3 rounded-md border bg-background px-3 py-2 text-sm", final ? "border-border" : "border-dashed border-border/60 opacity-80")}>
                      <div className="min-w-0">
                        <div className="truncate font-medium">{p.label}</div>
                        <div className="text-[10px] text-muted-foreground">
                          Role: {fromRole ? "granted" : "not granted"} · Final: <span className={final ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>{final ? "allowed" : "denied"}</span>
                        </div>
                      </div>
                      <Select value={mode} onValueChange={(v) => setMemberPermissionOverride(member.id, p.key, v as "inherit" | "grant" | "revoke")}>
                        <SelectTrigger className="h-7 w-32 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inherit">Inherit</SelectItem>
                          <SelectItem value="grant">Grant</SelectItem>
                          <SelectItem value="revoke">Revoke</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Projects</h2>
          <Link to="/app/projects" search={{}} className="text-xs text-brand hover:underline inline-flex items-center gap-1">All projects <ExternalLink className="h-3 w-3" /></Link>
        </div>
        {projects.length === 0 ? (
          <EmptyState icon={Briefcase} title="No projects assigned" description="Assign this member from a project's edit screen." />
        ) : (
          <div className="grid gap-2 md:grid-cols-2">
            {projects.map((p) => (
              <Link key={p.id} to="/app/projects" search={{ id: p.id }} className="group rounded-lg border border-border bg-card p-3 shadow-soft transition hover:border-brand/40">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{p.name}</div>
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{p.status}</span>
                </div>
                <div className="mt-2 flex gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground"><Briefcase className="h-3 w-3" /> Project</span>
                  <Link to="/app/tasks" search={{ projectId: p.id }} className="inline-flex items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground hover:text-brand"><ListChecks className="h-3 w-3" /> Tasks</Link>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Active tasks */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Active tasks</h2>
          <Link to="/app/tasks" search={{ projectId: projects[0]?.id }} className="text-xs text-brand hover:underline inline-flex items-center gap-1">Open board <ExternalLink className="h-3 w-3" /></Link>
        </div>
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

// ---------- Roles tab ----------

function RolesTab() {
  const roles = useStore((s) => s.roles);
  const team = useStore((s) => s.team);
  const [editing, setEditing] = useState<Role | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Define what each role can see and do across the app. Members inherit permissions from their role and can be tweaked individually.</p>
        <Button variant="brand" onClick={() => setCreating(true)}><Plus className="h-4 w-4" /> New role</Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {roles.map((r) => {
          const memberCount = team.filter((m) => m.roleId === r.id).length;
          return (
            <button key={r.id} type="button" onClick={() => setEditing(r)} className="group flex flex-col rounded-xl border border-border bg-card p-4 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2">
                  <Shield className={cn("h-4 w-4", r.color)} />
                  <span className="font-semibold">{r.name}</span>
                </div>
                {r.builtIn && <Badge variant="outline" className="text-[10px]">Built-in</Badge>}
              </div>
              <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{r.description}</p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{r.permissions.length} / {ALL_PERMISSIONS.length} permissions</span>
                <span>{memberCount} member{memberCount === 1 ? "" : "s"}</span>
              </div>
            </button>
          );
        })}
      </div>

      {editing && <RoleDialog role={editing} onClose={() => setEditing(null)} />}
      {creating && <RoleDialog onClose={() => setCreating(false)} />}
    </div>
  );
}

function RoleDialog({ role, onClose }: { role?: Role; onClose: () => void }) {
  const [name, setName] = useState(role?.name ?? "New role");
  const [description, setDescription] = useState(role?.description ?? "");
  const [perms, setPerms] = useState<Set<Permission>>(new Set(role?.permissions ?? []));

  const toggle = (p: Permission) => {
    const next = new Set(perms);
    if (next.has(p)) next.delete(p); else next.add(p);
    setPerms(next);
  };

  const toggleAll = (group: { items: { key: Permission }[] }, on: boolean) => {
    const next = new Set(perms);
    for (const i of group.items) {
      if (on) next.add(i.key); else next.delete(i.key);
    }
    setPerms(next);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name: name.trim() || "Untitled role", description, color: role?.color ?? "text-sky-600 dark:text-sky-400", permissions: Array.from(perms) };
    if (role) updateRole(role.id, payload);
    else createRole(payload);
    onClose();
  };

  const onDelete = () => {
    if (!role || role.builtIn) return;
    if (confirm(`Delete role "${role.name}"? Members with this role will fall back to Staff.`)) {
      deleteRole(role.id);
      onClose();
    }
  };

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-2xl">
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle className="inline-flex items-center gap-2">
              <Shield className="h-4 w-4 text-brand" />
              {role ? `Edit role · ${role.name}` : "Create role"}
              {role?.builtIn && <Badge variant="outline" className="text-[10px]">Built-in</Badge>}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Permissions selected</Label><div className="rounded-md border border-border bg-secondary/30 px-3 py-2 text-sm text-muted-foreground">{perms.size} of {ALL_PERMISSIONS.length}</div></div>
            </div>
            <div className="space-y-1.5"><Label>Description</Label><Textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} /></div>

            <div className="max-h-[40vh] overflow-y-auto rounded-md border border-border bg-background p-3">
              {PERMISSION_CATALOG.map((g) => {
                const allOn = g.items.every((i) => perms.has(i.key));
                const someOn = g.items.some((i) => perms.has(i.key));
                return (
                  <div key={g.group} className="mb-3 last:mb-0">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{g.group}</div>
                      <button type="button" onClick={() => toggleAll(g, !allOn)} className="text-[11px] text-brand hover:underline">
                        {allOn ? "Clear" : someOn ? "Select all" : "Select all"}
                      </button>
                    </div>
                    <div className="grid gap-1.5 sm:grid-cols-2">
                      {g.items.map((p) => (
                        <label key={p.key} className="flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-sm">
                          <Checkbox checked={perms.has(p.key)} onCheckedChange={() => toggle(p.key)} />
                          <span className="truncate">{p.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <DialogFooter className="mt-5 sm:justify-between">
            <div>
              {role && !role.builtIn && (
                <Button type="button" variant="outline" size="sm" onClick={onDelete}>
                  <Trash2 className="h-4 w-4" /> Delete role
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="brand">{role ? "Save changes" : "Create role"}</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
