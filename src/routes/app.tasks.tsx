import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, type DragEvent } from "react";
import { Plus, ListChecks, Briefcase, X, Trash2, Calendar, User, CheckSquare, FileText, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useStore, useHydrate, createTask, updateTask, moveTask, deleteTask,
  addSubtask, toggleSubtask, updateSubtask, deleteSubtask,
  formatDate, relativeTime, type TaskStage, type TaskPriority, type Task, type SubtaskKind,
} from "@/lib/store";
import { EmptyState, PageHeader } from "@/components/app/EmptyState";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/tasks")({
  validateSearch: (s: Record<string, unknown>) => ({
    projectId: typeof s.projectId === "string" ? s.projectId : undefined,
  }),
  component: TasksPage,
});

const STAGES: { id: TaskStage; label: string; color: string }[] = [
  { id: "backlog", label: "Backlog", color: "bg-slate-500" },
  { id: "todo", label: "To Do", color: "bg-sky-500" },
  { id: "in-progress", label: "In Progress", color: "bg-amber-500" },
  { id: "review", label: "Review", color: "bg-violet-500" },
  { id: "done", label: "Done", color: "bg-emerald-500" },
];

const priorityClass: Record<TaskPriority, string> = {
  low: "bg-secondary text-muted-foreground",
  medium: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  high: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

function TasksPage() {
  useHydrate();
  const projects = useStore((s) => s.projects);
  const { projectId } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [selected, setSelected] = useState<string | null>(projectId ?? projects[0]?.id ?? null);
  const [open, setOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const tasks = useStore((s) => s.tasks.filter((t) => t.projectId === selected));
  const project = projects.find((p) => p.id === selected);

  if (projects.length === 0) {
    return (
      <div className="space-y-5">
        <PageHeader title="Tasks" description="Tasks belong to projects. Create a project first." />
        <EmptyState
          icon={ListChecks}
          title="No projects yet"
          description="Tasks live inside projects. Create a project to start the kanban board."
          action={<Link to="/app/projects" search={{ id: undefined }}><Button variant="brand"><Plus className="h-4 w-4" /> Go to projects</Button></Link>}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Tasks"
        description="Kanban board scoped to a single project."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="brand" disabled={!selected}><Plus className="h-4 w-4" /> New task</Button></DialogTrigger>
            {selected && <TaskDialog projectId={selected} onClose={() => setOpen(false)} />}
          </Dialog>
        }
      />

      <div className="flex items-center gap-3">
        <Briefcase className="h-4 w-4 text-muted-foreground" />
        <Select value={selected ?? undefined} onValueChange={(v) => { setSelected(v); navigate({ search: { projectId: v }, replace: true }); }}>
          <SelectTrigger className="w-72"><SelectValue placeholder="Select project" /></SelectTrigger>
          <SelectContent>{projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
        </Select>
        {project && <Link to="/app/projects" search={{ id: project.id }} className="text-xs text-brand hover:underline">Open project →</Link>}
      </div>

      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-5">
        {STAGES.map((stage) => {
          const items = tasks.filter((t) => t.stage === stage.id);
          return (
            <div
              key={stage.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const id = e.dataTransfer.getData("text/plain");
                if (id) moveTask(id, stage.id);
              }}
              className="flex min-h-[200px] flex-col rounded-xl border border-border bg-card/60 p-3 shadow-soft"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${stage.color}`} />
                  <h3 className="text-xs font-semibold uppercase tracking-wide">{stage.label}</h3>
                </div>
                <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">{items.length}</span>
              </div>
              <div className="flex-1 space-y-2">
                {items.length === 0 ? (
                  <p className="rounded-md border border-dashed border-border px-2 py-3 text-center text-[11px] text-muted-foreground">Drop tasks here</p>
                ) : (
                  items.map((t) => <TaskCard key={t.id} task={t} onOpen={() => setActiveTask(t)} />)
                )}
              </div>
            </div>
          );
        })}
      </div>

      {activeTask && <TaskDrawer task={activeTask} onClose={() => setActiveTask(null)} />}
    </div>
  );
}

function TaskCard({ task, onOpen }: { task: Task; onOpen: () => void }) {
  const assignee = useStore((s) => s.team.find((m) => m.id === task.assigneeId));
  return (
    <button
      type="button"
      draggable
      onDragStart={(e: DragEvent<HTMLButtonElement>) => e.dataTransfer.setData("text/plain", task.id)}
      onClick={onOpen}
      className="w-full cursor-grab rounded-lg border border-border bg-background p-3 text-left text-sm shadow-sm transition hover:border-brand/40 hover:shadow-md active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="font-medium leading-snug">{task.title}</div>
        <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase ${priorityClass[task.priority]}`}>{task.priority}</span>
      </div>
      {task.subtasks.length > 0 && (() => {
        const todos = task.subtasks.filter((s) => s.kind === "todo");
        const done = todos.filter((s) => s.done).length;
        return (
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <CheckSquare className="h-3 w-3" />
            {todos.length > 0 ? <span>{done}/{todos.length} done</span> : <span>{task.subtasks.length} notes</span>}
          </div>
        );
      })()}
      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          {assignee ? (
            <><span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-brand text-[8px] font-bold text-brand-foreground">{assignee.initials}</span>{assignee.name.split(" ")[0]}</>
          ) : "Unassigned"}
        </span>
        {task.dueDate && <span>{formatDate(task.dueDate)}</span>}
      </div>
    </button>
  );
}

function TaskDialog({ projectId, onClose, initial }: { projectId: string; onClose: () => void; initial?: Task }) {
  const team = useStore((s) => s.team);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [stage, setStage] = useState<TaskStage>(initial?.stage ?? "todo");
  const [assigneeId, setAssigneeId] = useState<string>(initial?.assigneeId ?? "none");
  const [priority, setPriority] = useState<TaskPriority>(initial?.priority ?? "medium");
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? "");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const data = { title, description, stage, assigneeId: assigneeId === "none" ? null : assigneeId, priority, dueDate: dueDate || null, projectId };
    if (initial) updateTask(initial.id, data);
    else createTask(data);
    onClose();
  };

  return (
    <DialogContent>
      <form onSubmit={submit}>
        <DialogHeader><DialogTitle>{initial ? "Edit task" : "New task"}</DialogTitle></DialogHeader>
        <div className="mt-4 space-y-3">
          <div className="space-y-1.5"><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
          <div className="space-y-1.5"><Label>Description</Label><Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Stage</Label>
              <Select value={stage} onValueChange={(v) => setStage(v as TaskStage)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{STAGES.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Assignee</Label>
              <Select value={assigneeId} onValueChange={setAssigneeId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {team.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Due date</Label><Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></div>
          </div>
        </div>
        <DialogFooter className="mt-5">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="brand">{initial ? "Save" : "Create task"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function TaskDrawer({ task: initialTask, onClose }: { task: Task; onClose: () => void }) {
  const task = useStore((s) => s.tasks.find((t) => t.id === initialTask.id)) ?? initialTask;
  const assignee = useStore((s) => s.team.find((m) => m.id === task.assigneeId));
  const project = useStore((s) => s.projects.find((p) => p.id === task.projectId));
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-background/60 backdrop-blur-sm" onClick={onClose}>
      <div className="h-full w-full max-w-md overflow-y-auto border-l border-border bg-card p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{project?.name}</div>
            <h2 className="mt-1 text-lg font-bold">{task.title}</h2>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <Field label="Stage"><span className="capitalize">{task.stage.replace("-", " ")}</span></Field>
          <Field label="Priority"><span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${priorityClass[task.priority]}`}>{task.priority}</span></Field>
          <Field label="Assignee"><span className="inline-flex items-center gap-1"><User className="h-3 w-3" />{assignee?.name ?? "Unassigned"}</span></Field>
          <Field label="Due date"><span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{task.dueDate ? formatDate(task.dueDate) : "—"}</span></Field>
        </div>

        {task.description && (
          <div className="mt-4">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Description</div>
            <p className="mt-1 whitespace-pre-wrap text-sm text-foreground/90">{task.description}</p>
          </div>
        )}

        <div className="mt-5">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Move to</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {STAGES.map((s) => (
              <button key={s.id} onClick={() => moveTask(task.id, s.id)} className={`rounded-full border px-2.5 py-1 text-xs transition ${task.stage === s.id ? "border-brand bg-gradient-brand text-brand-foreground" : "border-border bg-secondary text-muted-foreground hover:text-foreground"}`}>{s.label}</button>
            ))}
          </div>
        </div>

        {task.updates.length > 0 && (
          <div className="mt-5">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Updates</div>
            <ul className="mt-2 space-y-2">
              {task.updates.map((u) => (
                <li key={u.id} className="rounded-md border border-border bg-background px-3 py-2 text-xs">
                  <div className="text-foreground/90">{u.message}</div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground">{relativeTime(u.at)}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex gap-2">
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild><Button variant="outline" className="flex-1">Edit</Button></DialogTrigger>
            <TaskDialog projectId={task.projectId} onClose={() => setEditOpen(false)} initial={task} />
          </Dialog>
          <Button variant="outline" onClick={() => { if (confirm("Delete this task?")) { deleteTask(task.id); onClose(); } }}><Trash2 className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border bg-background p-2.5">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-foreground">{children}</div>
    </div>
  );
}
