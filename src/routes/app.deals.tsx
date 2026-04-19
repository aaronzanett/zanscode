import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/deals")({
  component: Deals,
});

const deals = [
  { name: "Acme — Annual renewal", value: "$48,000", stage: "Proposal", close: "May 20", owner: "Andi" },
  { name: "Globex — POS rollout", value: "$112,500", stage: "Negotiation", close: "Jun 04", owner: "Maya" },
  { name: "Riverside — Add-on modules", value: "$8,400", stage: "Won", close: "Apr 12", owner: "Andi" },
  { name: "Initech — Pilot", value: "$2,900", stage: "Discovery", close: "Jul 01", owner: "Reza" },
  { name: "Northwind — Migration", value: "$24,000", stage: "Proposal", close: "May 28", owner: "Maya" },
];

const stageColor = (s: string) =>
  s === "Won" ? "bg-emerald-100 text-emerald-700"
  : s === "Negotiation" ? "bg-violet-100 text-violet-700"
  : s === "Proposal" ? "bg-amber-100 text-amber-700"
  : "bg-sky-100 text-sky-700";

function Deals() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Deals</h1>
          <p className="text-sm text-muted-foreground">Active opportunities across the sales cycle.</p>
        </div>
        <button className="rounded-md bg-gradient-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-brand">+ New deal</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { l: "Open pipeline", v: "$195,400" },
          { l: "Weighted forecast", v: "$94,200" },
          { l: "Won this quarter", v: "$62,800" },
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
            <tr><th className="px-5 py-3">Deal</th><th className="px-5 py-3">Stage</th><th className="px-5 py-3">Close</th><th className="px-5 py-3">Owner</th><th className="px-5 py-3 text-right">Value</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {deals.map((d) => (
              <tr key={d.name} className="hover:bg-secondary/50">
                <td className="px-5 py-4 font-medium">{d.name}</td>
                <td className="px-5 py-4"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${stageColor(d.stage)}`}>{d.stage}</span></td>
                <td className="px-5 py-4 text-muted-foreground">{d.close}</td>
                <td className="px-5 py-4">{d.owner}</td>
                <td className="px-5 py-4 text-right font-semibold">{d.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
