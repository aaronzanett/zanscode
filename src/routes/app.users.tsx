import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search, Plus, MoreHorizontal, Mail, Shield, ShieldCheck, ShieldAlert,
  Trash2, Pencil, KeyRound, UserCheck, UserX, Download, Users as UsersIcon,
  CheckCircle2, Clock, Ban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/app/users")({
  head: () => ({
    meta: [
      { title: "Users — Zanscode OS" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: UsersPage,
});

type Role = "Owner" | "Admin" | "Manager" | "Member" | "Viewer";
type Status = "Active" | "Invited" | "Suspended";

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  department: string;
  lastActive: string;
  twoFactor: boolean;
};

const seed: User[] = [
  { id: "u1", name: "Andini Putri", email: "andini@zanscode.com", role: "Owner", status: "Active", department: "Executive", lastActive: "Just now", twoFactor: true },
  { id: "u2", name: "Bayu Setiawan", email: "bayu@zanscode.com", role: "Admin", status: "Active", department: "Engineering", lastActive: "2m ago", twoFactor: true },
  { id: "u3", name: "Citra Lestari", email: "citra@zanscode.com", role: "Manager", status: "Active", department: "Product", lastActive: "1h ago", twoFactor: false },
  { id: "u4", name: "Dimas Pratama", email: "dimas@zanscode.com", role: "Member", status: "Invited", department: "Sales", lastActive: "—", twoFactor: false },
  { id: "u5", name: "Eka Wijaya", email: "eka@zanscode.com", role: "Member", status: "Active", department: "Design", lastActive: "Yesterday", twoFactor: true },
  { id: "u6", name: "Fajar Rahman", email: "fajar@zanscode.com", role: "Viewer", status: "Suspended", department: "Operations", lastActive: "5d ago", twoFactor: false },
  { id: "u7", name: "Gita Maharani", email: "gita@zanscode.com", role: "Manager", status: "Active", department: "Marketing", lastActive: "3h ago", twoFactor: true },
  { id: "u8", name: "Hadi Nugroho", email: "hadi@zanscode.com", role: "Member", status: "Active", department: "Support", lastActive: "30m ago", twoFactor: false },
];

const roles: Role[] = ["Owner", "Admin", "Manager", "Member", "Viewer"];
const statuses: Status[] = ["Active", "Invited", "Suspended"];
const departments = ["Executive", "Engineering", "Product", "Sales", "Design", "Operations", "Marketing", "Support"];

const roleStyles: Record<Role, string> = {
  Owner: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
  Admin: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  Manager: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  Member: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  Viewer: "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
};
const roleIcon: Record<Role, typeof Shield> = {
  Owner: ShieldCheck, Admin: ShieldAlert, Manager: Shield, Member: Shield, Viewer: Shield,
};
const statusStyles: Record<Status, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Invited: "bg-sky-100 text-sky-700",
  Suspended: "bg-rose-100 text-rose-700",
};
const statusIcon: Record<Status, typeof CheckCircle2> = {
  Active: CheckCircle2, Invited: Clock, Suspended: Ban,
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function UsersPage() {
  const [users, setUsers] = useState<User[]>(seed);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "All">("All");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleting, setDeleting] = useState<User | null>(null);
  const [bulkDelete, setBulkDelete] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.department.toLowerCase().includes(q);
      const matchR = roleFilter === "All" || u.role === roleFilter;
      const matchS = statusFilter === "All" || u.status === statusFilter;
      return matchQ && matchR && matchS;
    });
  }, [users, query, roleFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter((u) => u.status === "Active").length,
    invited: users.filter((u) => u.status === "Invited").length,
    admins: users.filter((u) => u.role === "Admin" || u.role === "Owner").length,
  }), [users]);

  const allFilteredSelected = filtered.length > 0 && filtered.every((u) => selected.has(u.id));

  function toggleAll() {
    const next = new Set(selected);
    if (allFilteredSelected) filtered.forEach((u) => next.delete(u.id));
    else filtered.forEach((u) => next.add(u.id));
    setSelected(next);
  }
  function toggleOne(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  }

  function openNew() {
    setEditing({ id: "", name: "", email: "", role: "Member", status: "Invited", department: "Engineering", lastActive: "—", twoFactor: false });
    setEditOpen(true);
  }
  function openEdit(u: User) { setEditing({ ...u }); setEditOpen(true); }

  function saveUser() {
    if (!editing) return;
    if (!editing.name.trim() || !editing.email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    if (editing.id) {
      setUsers((prev) => prev.map((u) => (u.id === editing.id ? editing : u)));
      toast.success(`Updated ${editing.name}`);
    } else {
      const newUser: User = { ...editing, id: `u${Date.now()}` };
      setUsers((prev) => [newUser, ...prev]);
      toast.success(`Invitation sent to ${newUser.email}`);
    }
    setEditOpen(false); setEditing(null);
  }

  function confirmDelete() {
    if (!deleting) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleting.id));
    setSelected((s) => { const n = new Set(s); n.delete(deleting.id); return n; });
    toast.success(`Removed ${deleting.name}`);
    setDeleting(null);
  }

  function confirmBulkDelete() {
    setUsers((prev) => prev.filter((u) => !selected.has(u.id)));
    toast.success(`Removed ${selected.size} user${selected.size === 1 ? "" : "s"}`);
    setSelected(new Set());
    setBulkDelete(false);
  }

  function bulkSetStatus(s: Status) {
    setUsers((prev) => prev.map((u) => (selected.has(u.id) ? { ...u, status: s } : u)));
    toast.success(`Updated ${selected.size} user${selected.size === 1 ? "" : "s"}`);
    setSelected(new Set());
  }

  function resetPassword(u: User) { toast.success(`Reset link sent to ${u.email}`); }
  function resendInvite(u: User) { toast.success(`Invite resent to ${u.email}`); }

  function exportCsv() {
    const header = "Name,Email,Role,Status,Department,2FA,Last active";
    const rows = filtered.map((u) => `"${u.name}","${u.email}",${u.role},${u.status},${u.department},${u.twoFactor ? "Yes" : "No"},${u.lastActive}`);
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "users.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported CSV");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-muted-foreground">Manage team members, roles and permissions.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCsv}><Download className="mr-2 h-4 w-4" /> Export</Button>
          <Button onClick={openNew} className="bg-gradient-brand text-brand-foreground shadow-brand hover:opacity-95">
            <Plus className="mr-2 h-4 w-4" /> Invite user
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: "Total users", v: stats.total, i: UsersIcon, c: "text-brand" },
          { l: "Active", v: stats.active, i: CheckCircle2, c: "text-emerald-600" },
          { l: "Pending invites", v: stats.invited, i: Clock, c: "text-sky-600" },
          { l: "Admins & owners", v: stats.admins, i: ShieldCheck, c: "text-purple-600" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
                <div className="mt-1 text-2xl font-bold">{s.v}</div>
              </div>
              <s.i className={`h-5 w-5 ${s.c}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-soft">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, department…"
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as Role | "All")}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All roles</SelectItem>
            {roles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as Status | "All")}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All statuses</SelectItem>
            {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand/30 bg-brand/5 px-4 py-3">
          <div className="text-sm font-medium">
            {selected.size} selected
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => bulkSetStatus("Active")}>
              <UserCheck className="mr-1.5 h-3.5 w-3.5" /> Activate
            </Button>
            <Button size="sm" variant="outline" onClick={() => bulkSetStatus("Suspended")}>
              <UserX className="mr-1.5 h-3.5 w-3.5" /> Suspend
            </Button>
            <Button size="sm" variant="destructive" onClick={() => setBulkDelete(true)}>
              <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Clear</Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="w-10 px-4 py-3">
                  <Checkbox checked={allFilteredSelected} onCheckedChange={toggleAll} aria-label="Select all" />
                </th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">2FA</th>
                <th className="px-4 py-3">Last active</th>
                <th className="w-12 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-muted-foreground">
                    No users match your filters.
                  </td>
                </tr>
              ) : filtered.map((u) => {
                const RIcon = roleIcon[u.role];
                const SIcon = statusIcon[u.status];
                return (
                  <tr key={u.id} className="hover:bg-secondary/40">
                    <td className="px-4 py-3">
                      <Checkbox checked={selected.has(u.id)} onCheckedChange={() => toggleOne(u.id)} aria-label={`Select ${u.name}`} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-brand text-xs font-semibold text-brand-foreground">
                          {initials(u.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-medium">{u.name}</div>
                          <div className="truncate text-xs text-muted-foreground">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${roleStyles[u.role]}`}>
                        <RIcon className="h-3 w-3" /> {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[u.status]}`}>
                        <SIcon className="h-3 w-3" /> {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{u.department}</td>
                    <td className="px-4 py-3">
                      {u.twoFactor ? (
                        <span className="text-xs font-medium text-emerald-600">Enabled</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Off</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{u.lastActive}</td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openEdit(u)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => resetPassword(u)}><KeyRound className="mr-2 h-4 w-4" /> Reset password</DropdownMenuItem>
                          {u.status === "Invited" && (
                            <DropdownMenuItem onClick={() => resendInvite(u)}><Mail className="mr-2 h-4 w-4" /> Resend invite</DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {u.status !== "Suspended" ? (
                            <DropdownMenuItem onClick={() => { setUsers((p) => p.map((x) => x.id === u.id ? { ...x, status: "Suspended" } : x)); toast.success(`${u.name} suspended`); }}>
                              <UserX className="mr-2 h-4 w-4" /> Suspend
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => { setUsers((p) => p.map((x) => x.id === u.id ? { ...x, status: "Active" } : x)); toast.success(`${u.name} activated`); }}>
                              <UserCheck className="mr-2 h-4 w-4" /> Activate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleting(u)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
          <div>Showing {filtered.length} of {users.length} users</div>
        </div>
      </div>

      {/* Edit / New dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit user" : "Invite a new user"}</DialogTitle>
            <DialogDescription>
              {editing?.id ? "Update profile, role and access." : "We'll email them an invitation to join your workspace."}
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Role</Label>
                  <Select value={editing.role} onValueChange={(v) => setEditing({ ...editing, role: v as Role })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Department</Label>
                  <Select value={editing.department} onValueChange={(v) => setEditing({ ...editing, department: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {editing.id && (
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v as Status })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={editing.twoFactor} onCheckedChange={(v) => setEditing({ ...editing, twoFactor: v === true })} />
                Require two-factor authentication
              </label>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={saveUser} className="bg-gradient-brand text-brand-foreground">
              {editing?.id ? "Save changes" : "Send invite"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete single */}
      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {deleting?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This revokes all access immediately. The user can be re-invited later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove user
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk delete */}
      <AlertDialog open={bulkDelete} onOpenChange={setBulkDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {selected.size} users?</AlertDialogTitle>
            <AlertDialogDescription>
              This will revoke access for all selected users. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove {selected.size} users
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
