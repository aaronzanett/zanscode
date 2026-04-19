import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/expenses")({
  component: Expenses,
});

const items = [
  { id: "EXP-1042", who: "Andi", cat: "Travel", desc: "Client visit — Surabaya", amount: "$320", status: "Approved", date: "Apr 11" },
  { id: "EXP-1043", who: "Maya", cat: "Software", desc: "CRM seat upgrade", amount: "$89", status: "Pending", date: "Apr 12" },
  { id: "EXP-1044", who: "Reza", cat: "Hardware", desc: "Test devices", amount: "$540", status: "Approved", date: "Apr 13" },
  { id: "EXP-1045", who: "Bagus", cat: "Meals", desc: "Team dinner", amount: "$110", status: "Rejected", date: "Apr 13" },
];

function Expenses() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Expenses</h1>
          <p className="text-sm text-muted-foreground">Reimbursements and corporate spend.</p>
        </div>
        <button className="rounded-md bg-gradient-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-brand">+ New expense</button>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-5 py-3">ID</th><th className="px-5 py-3">Submitter</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Description</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Amount</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((e) => (
              <tr key={e.id} className="hover:bg-secondary/50">
                <td className="px-5 py-4 font-mono text-xs">{e.id}</td>
                <td className="px-5 py-4">{e.who}</td>
                <td className="px-5 py-4 text-muted-foreground">{e.cat}</td>
                <td className="px-5 py-4">{e.desc}</td>
                <td className="px-5 py-4 text-muted-foreground">{e.date}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${e.status === "Approved" ? "bg-emerald-100 text-emerald-700" : e.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>{e.status}</span>
                </td>
                <td className="px-5 py-4 text-right font-semibold">{e.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
