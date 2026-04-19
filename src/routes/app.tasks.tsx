import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/tasks")({
  component: Tasks,
});

const columns = [
  { name: "To Do", items: [{ t: "Draft Q2 sales playbook", a: "Andi" }, { t: "Refresh onboarding deck", a: "Maya" }] },
  { name: "In Progress", items: [{ t: "Acme contract revision", a: "Bagus" }, { t: "POS firmware QA", a: "Reza" }] },
  { name: "Review", items: [{ t: "Quarterly board pack", a: "Bagus" }] },
  { name: "Done", items: [{ t: "Launch internal wiki", a: "Sinta" }, { t: "Hire Product Designer", a: "Sinta" }] },
];

function Tasks() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tasks</h1>
        <p className="text-sm text-muted-foreground">Cross-team work board.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((c) => (
          <div key={c.name} className="rounded-xl border border-border bg-card p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{c.name}</h3>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{c.items.length}</span>
            </div>
            <div className="mt-3 space-y-2">
              {c.items.map((i) => (
                <div key={i.t} className="rounded-lg border border-border bg-background p-3 text-sm">
                  <div className="font-medium">{i.t}</div>
                  <div className="mt-1 text-xs text-muted-foreground">@{i.a}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
