import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, FileText, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  useStore, useHydrate, createMPP, updateMPP, deleteMPP,
  formatDate, formatIDR,
  type JobTeam, type MPPStatus,
} from "@/lib/store";
import { EmptyState, PageHeader } from "@/components/app/EmptyState";
import { toast } from "sonner";

export const Route = createFileRoute("/app/recruitment/mpp")({
  head: () => ({ meta: [{ title: "Manpower Planning — Recruitment" }] }),
  component: MPPPage,
});

const statusStyles: Record<MPPStatus, string> = {
  draft: "bg-secondary text-muted-foreground",
  submitted: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  approved: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  rejected: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

const departments: JobTeam[] = ["Engineering", "Design", "Product", "Operations", "Sales", "HR", "Finance"];

function MPPPage() {
  useHydrate();
  const requests = useStore((s) => s.mppRequests);
  const team = useStore((s) => s.team);
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Manpower Planning (MPP)"
        description="Quarterly headcount requests routed for approval — feeds requisitions and job postings."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="brand"><Plus className="h-4 w-4" /> New MPP request</Button>
            </DialogTrigger>
            <MPPDialog onClose={() => setOpen(false)} />
          </Dialog>
        }
      />

      {requests.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No MPP requests yet"
          description="Create the first manpower planning request to start tracking hiring needs."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-soft">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Request</th>
                <th className="px-4 py-2.5 font-semibold">Department</th>
                <th className="px-4 py-2.5 font-semibold">Headcount</th>
                <th className="px-4 py-2.5 font-semibold">Budget</th>
                <th className="px-4 py-2.5 font-semibold">Quarter</th>
                <th className="px-4 py-2.5 font-semibold">Status</th>
                <th className="px-4 py-2.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requests.map((m) => {
                const requestedBy = team.find((t) => t.id === m.requestedById);
                return (
                  <tr key={m.id} className="hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <div className="font-medium">{m.title}</div>
                      <div className="text-xs text-muted-foreground">By {requestedBy?.name ?? "—"} · {formatDate(m.createdAt)}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{m.department}</td>
                    <td className="px-4 py-3 font-semibold">{m.headcount}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatIDR(m.budgetIDR)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{m.targetQuarter}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusStyles[m.status]}`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {m.status === "submitted" && (
                          <>
                            <Button size="sm" variant="ghost" onClick={() => { updateMPP(m.id, { status: "approved" }); toast.success("MPP approved"); }}>
                              <Check className="h-3.5 w-3.5 text-emerald-500" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => { updateMPP(m.id, { status: "rejected" }); toast.message("MPP rejected"); }}>
                              <X className="h-3.5 w-3.5 text-rose-500" />
                            </Button>
                          </>
                        )}
                        {m.status === "draft" && (
                          <Button size="sm" variant="outline" onClick={() => { updateMPP(m.id, { status: "submitted" }); toast.success("Submitted for approval"); }}>
                            Submit
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => { if (confirm("Delete this MPP request?")) { deleteMPP(m.id); toast.message("Deleted"); } }}>
                          <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                        </Button>
                      </div>
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

function MPPDialog({ onClose }: { onClose: () => void }) {
  const team = useStore((s) => s.team);
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState<JobTeam>("Engineering");
  const [headcount, setHeadcount] = useState("1");
  const [budget, setBudget] = useState("0");
  const [quarter, setQuarter] = useState(`${new Date().getFullYear()}-Q${Math.floor(new Date().getMonth() / 3) + 1}`);
  const [requestedById, setRequestedById] = useState<string>(team[0]?.id ?? "");
  const [justification, setJustification] = useState("");

  const submit = (status: MPPStatus) => {
    if (!title.trim()) { toast.error("Title is required"); return; }
    createMPP({
      title: title.trim(),
      department,
      headcount: Math.max(1, Number(headcount) || 1),
      budgetIDR: Math.max(0, Number(budget) || 0),
      targetQuarter: quarter,
      status,
      requestedById: requestedById || null,
      approverId: null,
      notes: "",
      justification: justification.trim(),
    });
    toast.success(status === "draft" ? "Saved as draft" : "MPP submitted");
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader><DialogTitle>New MPP Request</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div>
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Q4 Engineering hiring plan" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Department</Label>
            <select value={department} onChange={(e) => setDepartment(e.target.value as JobTeam)} className="mt-1.5 h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm">
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <Label>Target quarter</Label>
            <Input value={quarter} onChange={(e) => setQuarter(e.target.value)} placeholder="2026-Q4" />
          </div>
          <div>
            <Label>Headcount</Label>
            <Input type="number" min={1} value={headcount} onChange={(e) => setHeadcount(e.target.value)} />
          </div>
          <div>
            <Label>Budget (IDR)</Label>
            <Input type="number" min={0} value={budget} onChange={(e) => setBudget(e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Requested by</Label>
          <select value={requestedById} onChange={(e) => setRequestedById(e.target.value)} className="mt-1.5 h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm">
            <option value="">—</option>
            {team.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <Label>Justification</Label>
          <Textarea rows={3} value={justification} onChange={(e) => setJustification(e.target.value)} placeholder="Why this headcount, what business outcomes…" />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => submit("draft")}>Save draft</Button>
        <Button variant="brand" onClick={() => submit("submitted")}>Submit for approval</Button>
      </DialogFooter>
    </DialogContent>
  );
}
