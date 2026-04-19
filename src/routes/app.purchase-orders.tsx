import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/purchase-orders")({
  component: PurchaseOrders,
});

const pos = [
  { id: "PO-3041", supplier: "Sinar Elektronik", items: 12, total: "$4,820", eta: "Apr 22", status: "In transit" },
  { id: "PO-3042", supplier: "Global Hardware", items: 4, total: "$2,150", eta: "Apr 30", status: "Confirmed" },
  { id: "PO-3043", supplier: "Pratama Print", items: 22, total: "$680", eta: "Apr 18", status: "Received" },
  { id: "PO-3044", supplier: "Mitra Logistik", items: 1, total: "$340", eta: "Apr 17", status: "Draft" },
];

const statusColor = (s: string) =>
  s === "Received" ? "bg-emerald-100 text-emerald-700"
  : s === "In transit" ? "bg-sky-100 text-sky-700"
  : s === "Confirmed" ? "bg-violet-100 text-violet-700"
  : "bg-secondary text-muted-foreground";

function PurchaseOrders() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Purchase Orders</h1>
          <p className="text-sm text-muted-foreground">Track procurement from draft to receipt.</p>
        </div>
        <button className="rounded-md bg-gradient-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-brand">+ New PO</button>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-5 py-3">PO</th><th className="px-5 py-3">Supplier</th><th className="px-5 py-3 text-right">Items</th><th className="px-5 py-3">ETA</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Total</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pos.map((p) => (
              <tr key={p.id} className="hover:bg-secondary/50">
                <td className="px-5 py-4 font-mono text-xs">{p.id}</td>
                <td className="px-5 py-4 font-medium">{p.supplier}</td>
                <td className="px-5 py-4 text-right">{p.items}</td>
                <td className="px-5 py-4 text-muted-foreground">{p.eta}</td>
                <td className="px-5 py-4"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(p.status)}`}>{p.status}</span></td>
                <td className="px-5 py-4 text-right font-semibold">{p.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
