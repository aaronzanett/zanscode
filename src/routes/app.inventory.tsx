import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/inventory")({
  component: Inventory,
});

const items = [
  { sku: "SKU-8821", name: "Wireless Scanner X2", stock: 240, low: 50, loc: "JKT-A" },
  { sku: "SKU-7711", name: "Thermal Receipt Printer", stock: 32, low: 40, loc: "JKT-B" },
  { sku: "SKU-5520", name: "Cash Drawer Pro", stock: 18, low: 25, loc: "BDG-A" },
  { sku: "SKU-4410", name: "POS Tablet 10\"", stock: 96, low: 30, loc: "JKT-A" },
];

function Inventory() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Inventory</h1>
        <p className="text-sm text-muted-foreground">Multi-warehouse stock control.</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-5 py-3">SKU</th><th className="px-5 py-3">Item</th><th className="px-5 py-3">Location</th><th className="px-5 py-3 text-right">Stock</th><th className="px-5 py-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((i) => {
              const low = i.stock < i.low;
              return (
                <tr key={i.sku} className="hover:bg-secondary/50">
                  <td className="px-5 py-4 font-mono text-xs">{i.sku}</td>
                  <td className="px-5 py-4 font-medium">{i.name}</td>
                  <td className="px-5 py-4">{i.loc}</td>
                  <td className="px-5 py-4 text-right">{i.stock}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${low ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>{low ? "Low" : "OK"}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
