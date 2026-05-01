import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Boxes, Trash2, Users, TrendingDown, DollarSign, ExternalLink, LogIn, Globe, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useStore, useHydrate, createProduct, updateProduct, deleteProduct,
  formatIDR, formatDate, type ProductStatus, type SaaSProduct,
} from "@/lib/store";
import { EmptyState, PageHeader } from "@/components/app/EmptyState";

export const Route = createFileRoute("/app/products")({
  component: ProductsPage,
});

const statusBadge: Record<ProductStatus, string> = {
  live: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  beta: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  sunset: "bg-muted text-muted-foreground",
};

function ProductsPage() {
  useHydrate();
  const products = useStore((s) => s.products);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<SaaSProduct | null>(null);

  const totals = useMemo(() => ({
    users: products.reduce((a, p) => a + p.totalUsers, 0),
    active: products.reduce((a, p) => a + p.activeUsers, 0),
    mrr: products.reduce((a, p) => a + p.mrr, 0),
  }), [products]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="SaaS Products"
        description="Track health and growth of every Zanscode SaaS product."
        action={<Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button variant="brand"><Plus className="h-4 w-4" /> New product</Button></DialogTrigger><ProductDialog onClose={() => setOpen(false)} /></Dialog>}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Summary label="Total users" value={totals.users.toLocaleString()} icon={Users} />
        <Summary label="Active users" value={totals.active.toLocaleString()} icon={Users} />
        <Summary label="MRR" value={formatIDR(totals.mrr)} icon={DollarSign} />
      </div>

      {products.length === 0 ? (
        <EmptyState icon={Boxes} title="No SaaS products yet" description="Add your first product to start tracking users and revenue." action={<Dialog><DialogTrigger asChild><Button variant="brand"><Plus className="h-4 w-4" /> Add product</Button></DialogTrigger><ProductDialog onClose={() => undefined} /></Dialog>} />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {products.map((p) => {
            const activePct = p.totalUsers > 0 ? Math.round((p.activeUsers / p.totalUsers) * 100) : 0;
            return (
              <div key={p.id} className="rounded-xl border border-border bg-card p-5 shadow-soft">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{p.name}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${statusBadge[p.status]}`}>{p.status}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{p.tagline}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setEdit(p)} className="rounded p-1.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground">Edit</button>
                    <button onClick={() => { if (confirm(`Delete ${p.name}?`)) deleteProduct(p.id); }} className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <Metric label="Users" value={p.totalUsers.toLocaleString()} />
                  <Metric label="Active" value={`${p.activeUsers.toLocaleString()}`} sub={`${activePct}%`} />
                  <Metric label="MRR" value={formatIDR(p.mrr)} />
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Active rate</span><span>{activePct}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full bg-gradient-brand" style={{ width: `${activePct}%` }} /></div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><TrendingDown className="h-3 w-3" /> Churn {p.churn}%</span>
                  <span>Launched {formatDate(p.launchedAt)}</span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3">
                  <Button asChild size="sm" variant="brand" className="h-8">
                    <a href={p.adminUrl} target="_blank" rel="noopener noreferrer">
                      <LogIn className="h-3.5 w-3.5" /> Open admin login
                    </a>
                  </Button>
                  {p.marketingUrl ? (
                    <Button asChild size="sm" variant="outline" className="h-8">
                      <a href={p.marketingUrl} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-3.5 w-3.5" /> Public site
                      </a>
                    </Button>
                  ) : null}
                  <CopyUrlButton url={p.adminUrl} />
                  <a
                    href={p.adminUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-brand"
                    title={p.adminUrl}
                  >
                    <ExternalLink className="h-3 w-3" />
                    {(() => { try { return new URL(p.adminUrl).host; } catch { return p.adminUrl; } })()}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        {edit && <ProductDialog onClose={() => setEdit(null)} initial={edit} />}
      </Dialog>
    </div>
  );
}

function CopyUrlButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      size="sm"
      variant="ghost"
      className="h-8"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // ignore
        }
      }}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy URL"}
    </Button>
  );
}

function Summary({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Users }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-brand"><Icon className="h-3.5 w-3.5" /></div>
      </div>
      <div className="mt-2 text-xl font-bold sm:text-2xl">{value}</div>
    </div>
  );
}

function Metric({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-md border border-border bg-background p-2.5">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-bold">{value}</div>
      {sub && <div className="text-[10px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

function ProductDialog({ onClose, initial }: { onClose: () => void; initial?: SaaSProduct }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [tagline, setTagline] = useState(initial?.tagline ?? "");
  const [status, setStatus] = useState<ProductStatus>(initial?.status ?? "beta");
  const [totalUsers, setTotalUsers] = useState(initial?.totalUsers?.toString() ?? "0");
  const [activeUsers, setActiveUsers] = useState(initial?.activeUsers?.toString() ?? "0");
  const [mrr, setMrr] = useState(initial?.mrr?.toString() ?? "0");
  const [churn, setChurn] = useState(initial?.churn?.toString() ?? "0");
  const [launchedAt, setLaunchedAt] = useState(initial?.launchedAt ?? new Date().toISOString().slice(0, 10));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const data = {
      name, tagline, status,
      totalUsers: parseInt(totalUsers) || 0,
      activeUsers: parseInt(activeUsers) || 0,
      mrr: parseFloat(mrr) || 0,
      churn: parseFloat(churn) || 0,
      launchedAt,
    };
    if (initial) updateProduct(initial.id, data);
    else createProduct(data);
    onClose();
  };

  return (
    <DialogContent>
      <form onSubmit={submit}>
        <DialogHeader><DialogTitle>{initial ? "Edit product" : "New SaaS product"}</DialogTitle></DialogHeader>
        <div className="mt-4 space-y-3">
          <div className="space-y-1.5"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
          <div className="space-y-1.5"><Label>Tagline</Label><Input value={tagline} onChange={(e) => setTagline(e.target.value)} /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as ProductStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="beta">Beta</SelectItem>
                  <SelectItem value="sunset">Sunset</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Launched</Label><Input type="date" value={launchedAt} onChange={(e) => setLaunchedAt(e.target.value)} /></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Total users</Label><Input type="number" min="0" value={totalUsers} onChange={(e) => setTotalUsers(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Active users</Label><Input type="number" min="0" value={activeUsers} onChange={(e) => setActiveUsers(e.target.value)} /></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>MRR (IDR)</Label><Input type="number" min="0" value={mrr} onChange={(e) => setMrr(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Churn (%)</Label><Input type="number" min="0" step="0.1" value={churn} onChange={(e) => setChurn(e.target.value)} /></div>
          </div>
        </div>
        <DialogFooter className="mt-5">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="brand">{initial ? "Save" : "Create"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
