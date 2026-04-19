import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/recruitment")({
  component: Recruitment,
});

const positions = [
  { title: "Senior Backend Engineer", dept: "Engineering", applicants: 38, stage: "Interview", status: "Open" },
  { title: "Account Executive", dept: "Sales", applicants: 24, stage: "Screening", status: "Open" },
  { title: "Product Designer", dept: "Design", applicants: 51, stage: "Offer", status: "Open" },
  { title: "Finance Manager", dept: "Finance", applicants: 12, stage: "Hired", status: "Closed" },
];

function Recruitment() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Recruitment</h1>
          <p className="text-sm text-muted-foreground">Open positions and candidate pipeline.</p>
        </div>
        <button className="rounded-md bg-gradient-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-brand">+ Open position</button>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {positions.map((p) => (
          <div key={p.title} className="rounded-xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-xs text-muted-foreground">{p.dept} • {p.applicants} applicants</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.status === "Open" ? "bg-emerald-100 text-emerald-700" : "bg-secondary text-muted-foreground"}`}>{p.status}</span>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">Current stage</div>
            <div className="mt-1 text-sm font-medium">{p.stage}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
