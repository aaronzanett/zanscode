import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, ClipboardList, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  useStore, useHydrate, createRequisition, updateRequisition, deleteRequisition,
  formatDate,
  type JobTeam, type RequisitionStatus,
} from "@/lib/store";
import { EmptyState, PageHeader } from "@/components/app/EmptyState";
import { toast } from "sonner";

export const Route = createFileRoute("/app/recruitment/requisitions")({
  head: () => ({ meta: [{ title: "Requisitions — Recruitment" }] }),
  component: RequisitionsPage,
});

const statusStyles: Record<RequisitionStatus, string> = {
  open: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "on-hold": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  filled: "bg-secondary text-foreground",
  cancelled: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

const departments: JobTeam[] = ["Engineering", "Design", "Product", "Operations", "Sales", "HR", "Finance"];

function RequisitionsPage() {
  useHydrate();
  const requisitions = useStore((s) => s.requisitions);
  const team = useStore((s) => s.team);
  const mpp = useStore((s) => s.mppRequests);
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Requisitions"
        description="Approved hiring slots, each tied to an MPP and a hiring manager."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="brand"><Plus className="h-4 w-4" /> New requisition</Button></DialogTrigger>
            <RequisitionDialog onClose={() => setOpen(false)} />
          </Dialog>
        }
      />

      {requisitions.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No requisitions yet" description="Create a requisition once an MPP is approved." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {requisitions.map((r) => {
            const hm = team.find((t) => t.id === r.hiringManagerId);
            const m = mpp.find((x) => x.id === r.mppId);
            const pct = r.openings === 0 ? 0 : Math.round((r.filled / r.openings) * 100);
            return (
              <div key={r.id} className="rounded-xl border border-border bg-card p-4 shadow-soft transition hover:border-brand/40 hover:shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-mono text-muted-foreground">{r.code}</div>
                    <div className="truncate text-base font-semibold">{r.title}</div>
                    <div className="text-xs text-muted-foreground">{r.department} · target {formatDate(r.targetStartDate)}</div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusStyles[r.status]}`}>{r.status}</span>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Filled</span>
                    <span className="font-semibold">{r.filled}/{r.openings}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-gradient-brand" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-muted-foreground">Manager:</span> <span className="font-medium">{hm?.name ?? "—"}</span></div>
                  <div><span className="text-muted-foreground">Priority:</span> <span className="font-medium capitalize">{r.priority}</span></div>
                  <div className="col-span-2"><span className="text-muted-foreground">MPP:</span> <span className="font-medium">{m?.title ?? "Standalone"}</span></div>
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <select
                    value={r.status}
                    onChange={(e) => updateRequisition(r.id, { status: e.target.value as RequisitionStatus })}
                    className="h-8 cursor-pointer rounded-md border border-input bg-background px-2 text-xs"
                  >
                    <option value="open">Open</option>
                    <option value="on-hold">On hold</option>
                    <option value="filled">Filled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <Button size="sm" variant="ghost" onClick={() => { if (confirm(`Delete ${r.code}?`)) { deleteRequisition(r.id); toast.message("Deleted"); } }}>
                    <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RequisitionDialog({ onClose }: { onClose: () => void }) {
  const team = useStore((s) => s.team);
  const mpp = useStore((s) => s.mppRequests).filter((m) => m.status === "approved");
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState<JobTeam>("Engineering");
  const [openings, setOpenings] = useState("1");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [hm, setHm] = useState<string>(team[0]?.id ?? "");
  const [mppId, setMppId] = useState<string>("");
  const [target, setTarget] = useState<string>(new Date(Date.now() + 86400000 * 60).toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");

  const submit = () => {
    if (!title.trim()) { toast.error("Title is required"); return; }
    createRequisition({
      title: title.trim(),
      department,
      mppId: mppId || null,
      hiringManagerId: hm || null,
      openings: Math.max(1, Number(openings) || 1),
      filled: 0,
      priority,
      status: "open",
      targetStartDate: target,
      notes: notes.trim(),
    });
    toast.success("Requisition opened");
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader><DialogTitle>New Requisition</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div>
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Frontend Engineer" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Department</Label>
            <select value={department} onChange={(e) => setDepartment(e.target.value as JobTeam)} className="mt-1.5 h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm">
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <Label>Openings</Label>
            <Input type="number" min={1} value={openings} onChange={(e) => setOpenings(e.target.value)} />
          </div>
          <div>
            <Label>Priority</Label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")} className="mt-1.5 h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <Label>Target start</Label>
            <Input type="date" value={target} onChange={(e) => setTarget(e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Hiring manager</Label>
          <select value={hm} onChange={(e) => setHm(e.target.value)} className="mt-1.5 h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm">
            <option value="">—</option>
            {team.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <Label>Linked MPP</Label>
          <select value={mppId} onChange={(e) => setMppId(e.target.value)} className="mt-1.5 h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm">
            <option value="">— Standalone (no MPP) —</option>
            {mpp.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
        </div>
        <div>
          <Label>Notes</Label>
          <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="brand" onClick={submit}>Open requisition</Button>
      </DialogFooter>
    </DialogContent>
  );
}
