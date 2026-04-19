import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/leave")({
  component: Leave,
});

const requests = [
  { name: "Sinta Lestari", type: "Annual", from: "Apr 18", to: "Apr 24", days: 5, status: "Approved" },
  { name: "Reza Mahendra", type: "Sick", from: "Apr 15", to: "Apr 16", days: 2, status: "Approved" },
  { name: "Maya Putri", type: "Annual", from: "May 02", to: "May 05", days: 4, status: "Pending" },
  { name: "Bagus Wicaksono", type: "Personal", from: "Apr 30", to: "Apr 30", days: 1, status: "Pending" },
];

function Leave() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leave</h1>
          <p className="text-sm text-muted-foreground">Time-off requests and balances.</p>
        </div>
        <button className="rounded-md bg-gradient-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-brand">+ Request leave</button>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-5 py-3">Employee</th><th className="px-5 py-3">Type</th><th className="px-5 py-3">From</th><th className="px-5 py-3">To</th><th className="px-5 py-3 text-right">Days</th><th className="px-5 py-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {requests.map((r) => (
              <tr key={r.name + r.from} className="hover:bg-secondary/50">
                <td className="px-5 py-4 font-medium">{r.name}</td>
                <td className="px-5 py-4">{r.type}</td>
                <td className="px-5 py-4 text-muted-foreground">{r.from}</td>
                <td className="px-5 py-4 text-muted-foreground">{r.to}</td>
                <td className="px-5 py-4 text-right">{r.days}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${r.status === "Approved" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
