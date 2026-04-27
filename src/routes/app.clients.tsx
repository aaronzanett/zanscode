import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Users, Search, Briefcase, Mail, Building2, Trash2, ArrowLeft, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore, useHydrate, createClient, updateClient, deleteClient, formatDate, relativeTime, type ClientStatus } from "@/lib/store";
import { EmptyState, PageHeader } from "@/components/app/EmptyState";

export const Route = createFileRoute("/app/clients")({
  validateSearch: (s: Record<string, unknown>) => ({ id: typeof s.id === "string" ? s.id : undefined }),
  component: ClientsPage,
});

const statusBadge: Record<ClientStatus, string> = {
  lead: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  completed: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  archived: "bg-muted text-muted-foreground",
};

function ClientsPage() {
  useHydrate();
  const { id } = Route.useSearch();
  if (id) return <ClientDetail id={id} />;
  return <ClientsList />;
}

function ClientsList() {
  const clients = useStore((s) => s.clients);
  const projects = useStore((s) => s.projects);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return clients;
    return clients.filter((c) => c.name.toLowerCase().includes(t) || c.contact.toLowerCase().includes(t));
  }, [q, clients]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Clients"
        description="Every project starts with a client. Track relationships from lead to completion."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="brand"><Plus className="h-4 w-4" /> New client</Button>
            </DialogTrigger>
            <ClientDialog onClose={() => setOpen(false)} />
          </Dialog>
        }
      />

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search clients…" className="pl-9" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={clients.length === 0 ? "No clients yet" : "No matching clients"}
          description={clients.length === 0 ? "Create your first client to start linking projects, tasks, and revenue." : "Try a different search term."}
          action={clients.length === 0 ? (
            <Dialog>
              <DialogTrigger asChild><Button variant="brand"><Plus className="h-4 w-4" /> Create first client</Button></DialogTrigger>
              <ClientDialog onClose={() => undefined} />
            </Dialog>
          ) : undefined}
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => {
            const projectCount = projects.filter((p) => p.clientId === c.id).length;
            return (
              <Link
                key={c.id}
                to="/app/clients"
                search={{ id: c.id }}
                className="group rounded-xl border border-border bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-sm font-semibold text-brand-foreground">
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-semibold">{c.name}</div>
                      <div className="truncate text-xs text-muted-foreground">{c.industry}</div>
                    </div>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusBadge[c.status]}`}>{c.status}</span>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Briefcase className="h-3 w-3" /> {projectCount} project{projectCount === 1 ? "" : "s"}</span>
                  <span>Added {relativeTime(c.createdAt)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ClientDialog({ onClose, initial }: { onClose: () => void; initial?: { id: string; name: string; contact: string; email: string; industry: string; status: ClientStatus; notes: string } }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [contact, setContact] = useState(initial?.contact ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [industry, setIndustry] = useState(initial?.industry ?? "");
  const [status, setStatus] = useState<ClientStatus>(initial?.status ?? "lead");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (initial) {
      updateClient(initial.id, { name, contact, email, industry, status, notes });
    } else {
      createClient({ name, contact, email, industry, status, notes });
    }
    onClose();
  };

  return (
    <DialogContent>
      <form onSubmit={submit}>
        <DialogHeader><DialogTitle>{initial ? "Edit client" : "New client"}</DialogTitle></DialogHeader>
        <div className="mt-4 space-y-3">
          <div className="space-y-1.5"><Label>Company name</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Primary contact</Label><Input value={contact} onChange={(e) => setContact(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Industry</Label><Input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Retail, Logistics, F&B…" /></div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as ClientStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5"><Label>Notes</Label><Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
        </div>
        <DialogFooter className="mt-5">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="brand">{initial ? "Save changes" : "Create client"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function ClientDetail({ id }: { id: string }) {
  const client = useStore((s) => s.clients.find((c) => c.id === id));
  const projects = useStore((s) => s.projects.filter((p) => p.clientId === id));
  const transactions = useStore((s) => s.transactions.filter((t) => t.clientId === id));
  const [editOpen, setEditOpen] = useState(false);

  if (!client) {
    return (
      <div className="space-y-4">
        <Link to="/app/clients" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to clients</Link>
        <EmptyState icon={Users} title="Client not found" description="It may have been deleted." />
      </div>
    );
  }

  const onDelete = () => {
    if (confirm(`Delete ${client.name}? This will also remove their projects and tasks.`)) {
      deleteClient(client.id);
      window.history.back();
    }
  };

  return (
    <div className="space-y-5">
      <Link to="/app/clients" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to clients</Link>

      <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-brand text-lg font-bold text-brand-foreground">
              {client.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{client.name}</h1>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusBadge[client.status]}`}>{client.status}</span>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">{client.industry || "Industry not set"}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {client.contact && <span className="inline-flex items-center gap-1"><Building2 className="h-3 w-3" /> {client.contact}</span>}
                {client.email && <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {client.email}</span>}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild><Button variant="outline" size="sm">Edit</Button></DialogTrigger>
              <ClientDialog onClose={() => setEditOpen(false)} initial={client} />
            </Dialog>
            <Button variant="outline" size="sm" onClick={onDelete}><Trash2 className="h-4 w-4" /></Button>
          </div>
        </div>
        {client.notes && (
          <div className="mt-4 rounded-lg border border-border bg-secondary/40 p-3 text-sm">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><MessageSquare className="h-3 w-3" /> Notes</div>
            <p className="whitespace-pre-wrap text-foreground/90">{client.notes}</p>
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
          <div className="text-xs font-medium text-muted-foreground">Projects</div>
          <div className="mt-1 text-2xl font-bold">{projects.length}</div>
          <div className="mt-1 text-xs text-muted-foreground">{projects.filter((p) => p.status === "active").length} active</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
          <div className="text-xs font-medium text-muted-foreground">Transactions</div>
          <div className="mt-1 text-2xl font-bold">{transactions.length}</div>
          <div className="mt-1 text-xs text-muted-foreground">linked</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
          <div className="text-xs font-medium text-muted-foreground">Client since</div>
          <div className="mt-1 text-sm font-semibold">{formatDate(client.createdAt)}</div>
          <div className="mt-1 text-xs text-muted-foreground">{relativeTime(client.createdAt)}</div>
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold">Related projects</h2>
        {projects.length === 0 ? (
          <EmptyState icon={Briefcase} title="No projects yet" description="Create a project for this client from the Projects module." />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {projects.map((p) => (
              <Link key={p.id} to="/app/projects" search={{ id: p.id }} className="rounded-lg border border-border bg-card p-4 shadow-soft transition hover:border-brand/40">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium">{p.name}</div>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{p.status}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.description}</p>
                <div className="mt-3 text-[11px] text-muted-foreground">Due {formatDate(p.dueDate)}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
