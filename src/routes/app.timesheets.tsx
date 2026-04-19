import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/timesheets")({
  component: Timesheets,
});

const entries = [
  { name: "Reza Mahendra", project: "Zenith App v2", hours: 38, week: "Apr 14–20", status: "Submitted" },
  { name: "Maya Putri", project: "Acme Onboarding", hours: 22, week: "Apr 14–20", status: "Approved" },
  { name: "Bagus Wicaksono", project: "Q1 Close", hours: 41, week: "Apr 14–20", status: "Submitted" },
  { name: "Andi Pratama", project: "Sales Enablement", hours: 28, week: "Apr 14–20", status: "Draft" },
];

function Timesheets() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Timesheets</h1>
        <p className="text-sm text-muted-foreground">Track time across projects and clients.</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-5 py-3">Employee</th><th className="px-5 py-3">Project</th><th className="px-5 py-3">Week</th><th className="px-5 py-3 text-right">Hours</th><th className="px-5 py-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {entries.map((e) => (
              <tr key={e.name + e.project} className="hover:bg-secondary/50">
                <td className="px-5 py-4 font-medium">{e.name}</td>
                <td className="px-5 py-4">{e.project}</td>
                <td className="px-5 py-4 text-muted-foreground">{e.week}</td>
                <td className="px-5 py-4 text-right font-semibold">{e.hours}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${e.status === "Approved" ? "bg-emerald-100 text-emerald-700" : e.status === "Submitted" ? "bg-amber-100 text-amber-700" : "bg-secondary text-muted-foreground"}`}>{e.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
