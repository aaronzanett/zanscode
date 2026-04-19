import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/payroll")({
  component: Payroll,
});

const runs = [
  { period: "Apr 2026", employees: 42, gross: "$184,200", status: "Scheduled", date: "Apr 28" },
  { period: "Mar 2026", employees: 41, gross: "$181,540", status: "Paid", date: "Mar 28" },
  { period: "Feb 2026", employees: 40, gross: "$176,900", status: "Paid", date: "Feb 28" },
];

function Payroll() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payroll</h1>
          <p className="text-sm text-muted-foreground">Run payroll and review historical disbursements.</p>
        </div>
        <button className="rounded-md bg-gradient-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-brand">Run payroll</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { l: "Headcount", v: "42" },
          { l: "Monthly gross", v: "$184,200" },
          { l: "Next run", v: "Apr 28" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <div className="text-sm text-muted-foreground">{s.l}</div>
            <div className="mt-1 text-2xl font-bold">{s.v}</div>
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-5 py-3">Period</th><th className="px-5 py-3">Employees</th><th className="px-5 py-3">Pay date</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Gross</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {runs.map((r) => (
              <tr key={r.period} className="hover:bg-secondary/50">
                <td className="px-5 py-4 font-medium">{r.period}</td>
                <td className="px-5 py-4">{r.employees}</td>
                <td className="px-5 py-4 text-muted-foreground">{r.date}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${r.status === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{r.status}</span>
                </td>
                <td className="px-5 py-4 text-right font-semibold">{r.gross}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
