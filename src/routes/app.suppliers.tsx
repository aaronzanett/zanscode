import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/suppliers")({
  component: Suppliers,
});

const suppliers = [
  { name: "Sinar Elektronik", contact: "Pak Hadi", category: "Electronics", lead: "7d", rating: 4.8 },
  { name: "Mitra Logistik", contact: "Bu Rina", category: "Logistics", lead: "2d", rating: 4.5 },
  { name: "Pratama Print", contact: "Pak Joko", category: "Stationery", lead: "5d", rating: 4.2 },
  { name: "Global Hardware", contact: "Ms. Lin", category: "Hardware", lead: "14d", rating: 4.6 },
];

function Suppliers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Suppliers</h1>
          <p className="text-sm text-muted-foreground">Vendor directory and performance.</p>
        </div>
        <button className="rounded-md bg-gradient-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-brand">+ New supplier</button>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-5 py-3">Supplier</th><th className="px-5 py-3">Contact</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Lead time</th><th className="px-5 py-3 text-right">Rating</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {suppliers.map((s) => (
              <tr key={s.name} className="hover:bg-secondary/50">
                <td className="px-5 py-4 font-medium">{s.name}</td>
                <td className="px-5 py-4">{s.contact}</td>
                <td className="px-5 py-4 text-muted-foreground">{s.category}</td>
                <td className="px-5 py-4">{s.lead}</td>
                <td className="px-5 py-4 text-right font-semibold">{s.rating} ★</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
