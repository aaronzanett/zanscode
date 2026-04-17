import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/projects")({
  component: Projects,
});

const projects = [
  { n: "Zenith Mobile App v2", c: "Acme Corp", p: 78, due: "May 12", status: "On track" },
  { n: "Internal CRM Migration", c: "Northwind Ltd", p: 42, due: "Jun 03", status: "At risk" },
  { n: "POS Rollout — 12 outlets", c: "Riverside Inc", p: 95, due: "Apr 28", status: "On track" },
  { n: "Finance BI Dashboards", c: "Globex", p: 24, due: "Jul 18", status: "On track" },
];

function Projects() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Projects</h1>
        <p className="text-sm text-muted-foreground">Track delivery across all active engagements.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {projects.map((p) => (
          <div key={p.n} className="rounded-xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{p.n}</h3>
                <p className="text-xs text-muted-foreground">{p.c} • due {p.due}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.status === "On track" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{p.status}</span>
            </div>
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Progress</span><span>{p.p}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-gradient-brand" style={{ width: `${p.p}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
