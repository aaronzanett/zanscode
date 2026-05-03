import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Wallet, ArrowDownRight, ArrowUpRight, TrendingUp, Trash2, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useStore, useHydrate, createTransaction, deleteTransaction,
  formatIDR, formatDate, type TxType,
} from "@/lib/store";
import { EmptyState, PageHeader } from "@/components/app/EmptyState";

export const Route = createFileRoute("/app/finance")({
  component: FinancePage,
});

function FinancePage() {
  useHydrate();
  const txs = useStore((s) => s.transactions);
  const projects = useStore((s) => s.projects);
  const clients = useStore((s) => s.clients);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | TxType>("all");

  const totals = useMemo(() => {
    const income = txs.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0);
    const expense = txs.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0);
    return { income, expense, net: income - expense };
  }, [txs]);

  const visible = filter === "all" ? txs : txs.filter((t) => t.type === filter);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Finance"
        description="Every income and expense in one ledger — linked to projects and clients."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="brand"><Plus className="h-4 w-4" /> New transaction</Button></DialogTrigger>
            <TxDialog onClose={() => setOpen(false)} />
          </Dialog>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryCard label="Total income" value={formatIDR(totals.income)} icon={ArrowUpRight} tone="emerald" />
        <SummaryCard label="Total expenses" value={formatIDR(totals.expense)} icon={ArrowDownRight} tone="rose" />
        <SummaryCard label="Net profit" value={formatIDR(totals.net)} icon={TrendingUp} tone={totals.net >= 0 ? "emerald" : "rose"} />
      </div>

      <div className="flex items-center gap-1 rounded-md bg-secondary p-0.5 text-xs w-fit">
        {(["all", "income", "expense"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded px-3 py-1 font-medium capitalize ${filter === f ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{f}</button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title={txs.length === 0 ? "No transactions yet" : "No transactions match"}
          description={txs.length === 0 ? "Log your first income or expense to start tracking the financial state of the business." : "Try a different filter."}
          action={txs.length === 0 ? (
            <Dialog><DialogTrigger asChild><Button variant="brand"><Plus className="h-4 w-4" /> Log first transaction</Button></DialogTrigger><TxDialog onClose={() => undefined} /></Dialog>
          ) : undefined}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-soft">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-secondary/50 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium">Date</th>
                <th className="px-4 py-2.5 text-left font-medium">Description</th>
                <th className="px-4 py-2.5 text-left font-medium">Category</th>
                <th className="px-4 py-2.5 text-left font-medium">Linked to</th>
                <th className="px-4 py-2.5 text-right font-medium">Amount</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((tx) => {
                const project = projects.find((p) => p.id === tx.projectId);
                const client = clients.find((c) => c.id === tx.clientId);
                return (
                  <tr key={tx.id} className="border-t border-border hover:bg-secondary/30">
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{formatDate(tx.date)}</td>
                    <td className="px-4 py-2.5 font-medium">{tx.description}</td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{tx.category}</td>
                    <td className="px-4 py-2.5 text-xs">
                      {project && <Link to="/app/projects" search={{ id: project.id }} className="text-brand hover:underline">{project.name}</Link>}
                      {project && client && " · "}
                      {client && <Link to="/app/clients" search={{ id: client.id }} className="text-brand hover:underline">{client.name}</Link>}
                      {!project && !client && <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className={`px-4 py-2.5 text-right font-semibold ${tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                      {tx.type === "income" ? "+" : "−"} {formatIDR(tx.amount)}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button onClick={() => { if (confirm("Delete this transaction?")) deleteTransaction(tx.id); }} className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
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

function SummaryCard({ label, value, icon: Icon, tone }: { label: string; value: string; icon: typeof ArrowUpRight; tone: "emerald" | "rose" }) {
  const cls = tone === "emerald" ? "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400" : "text-rose-600 bg-rose-500/10 dark:text-rose-400";
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <div className={`flex h-7 w-7 items-center justify-center rounded-md ${cls}`}><Icon className="h-3.5 w-3.5" /></div>
      </div>
      <div className="mt-2 text-xl font-bold sm:text-2xl">{value}</div>
    </div>
  );
}

function TxDialog({ onClose }: { onClose: () => void }) {
  const projects = useStore((s) => s.projects);
  const clients = useStore((s) => s.clients);
  const [type, setType] = useState<TxType>("income");
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [projectId, setProjectId] = useState<string>("none");
  const [clientId, setClientId] = useState<string>("none");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const a = parseFloat(amount);
    if (!a || a <= 0) return;
    createTransaction({
      type, amount: a, category: category.trim() || (type === "income" ? "Other income" : "Other expense"),
      description: description.trim() || "—", date,
      projectId: projectId === "none" ? null : projectId,
      clientId: clientId === "none" ? null : clientId,
    });
    onClose();
  };

  return (
    <DialogContent>
      <form onSubmit={submit}>
        <DialogHeader><DialogTitle>New transaction</DialogTitle></DialogHeader>
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 rounded-md bg-secondary p-0.5">
            {(["income", "expense"] as const).map((t) => (
              <button key={t} type="button" onClick={() => setType(t)} className={`rounded py-1.5 text-sm font-medium capitalize ${type === t ? "bg-card shadow-sm" : "text-muted-foreground"}`}>{t}</button>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Amount (IDR)</Label><Input type="number" min="0" step="1000" value={amount} onChange={(e) => setAmount(e.target.value)} required /></div>
            <div className="space-y-1.5"><Label>Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          </div>
          <div className="space-y-1.5"><Label>Description</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Category</Label><Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder={type === "income" ? "Project payment, SaaS…" : "Payroll, Tools…"} /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Project (optional)</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Client (optional)</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter className="mt-5">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="brand">Save</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
