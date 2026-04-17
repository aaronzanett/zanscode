import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/customers")({
  component: Customers,
});

const rows = [
  { name: "Acme Corp", email: "ops@acme.com", plan: "Business", status: "Active", mrr: "$1,290" },
  { name: "Northwind Ltd", email: "hi@northwind.io", plan: "Starter", status: "Trial", mrr: "$0" },
  { name: "Riverside Inc", email: "team@riverside.co", plan: "Enterprise", status: "Active", mrr: "$8,400" },
  { name: "Globex", email: "biz@globex.com", plan: "Business", status: "Past due", mrr: "$2,100" },
  { name: "Initech", email: "it@initech.com", plan: "Starter", status: "Active", mrr: "$290" },
];

function Customers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-sm text-muted-foreground">Manage your accounts and subscriptions.</p>
        </div>
        <button className="rounded-md bg-gradient-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-brand">+ New customer</button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Plan</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">MRR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.name} className="hover:bg-secondary/50">
                <td className="px-5 py-4">
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.email}</div>
                </td>
                <td className="px-5 py-4">{r.plan}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    r.status === "Active" ? "bg-emerald-100 text-emerald-700" :
                    r.status === "Trial" ? "bg-sky-100 text-sky-700" :
                    "bg-rose-100 text-rose-700"
                  }`}>{r.status}</span>
                </td>
                <td className="px-5 py-4 text-right font-semibold">{r.mrr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
