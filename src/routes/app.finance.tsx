import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/finance")({
  component: Finance,
});

const invoices = [
  { id: "INV-2041", c: "Acme Corp", a: "$4,200", s: "Paid", d: "Apr 10" },
  { id: "INV-2042", c: "Globex", a: "$2,100", s: "Overdue", d: "Apr 02" },
  { id: "INV-2043", c: "Riverside Inc", a: "$8,400", s: "Pending", d: "Apr 14" },
  { id: "INV-2044", c: "Initech", a: "$290", s: "Paid", d: "Apr 11" },
];

function Finance() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Finance</h1>
        <p className="text-sm text-muted-foreground">Invoices, expenses and cashflow at a glance.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { l: "Outstanding", v: "$10,790" },
          { l: "Paid this month", v: "$48,200" },
          { l: "Expenses", v: "$12,540" },
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
            <tr><th className="px-5 py-3">Invoice</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Amount</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {invoices.map((i) => (
              <tr key={i.id} className="hover:bg-secondary/50">
                <td className="px-5 py-4 font-mono text-xs">{i.id}</td>
                <td className="px-5 py-4">{i.c}</td>
                <td className="px-5 py-4">{i.d}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${i.s === "Paid" ? "bg-emerald-100 text-emerald-700" : i.s === "Overdue" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>{i.s}</span>
                </td>
                <td className="px-5 py-4 text-right font-semibold">{i.a}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
