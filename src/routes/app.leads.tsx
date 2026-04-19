import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/leads")({
  component: Leads,
});

const leads = [
  { name: "Sarah Wijaya", company: "Stellar Retail", source: "Website", score: 87, status: "Hot" },
  { name: "Budi Hartono", company: "Mega Mart", source: "Referral", score: 72, status: "Warm" },
  { name: "Dewi Sari", company: "Coffee Republic", source: "Event", score: 64, status: "Warm" },
  { name: "James Tan", company: "Pacific Logistics", source: "LinkedIn", score: 41, status: "Cold" },
  { name: "Linda Chen", company: "Urban Apparel", source: "Website", score: 91, status: "Hot" },
];

const statusColor = (s: string) =>
  s === "Hot" ? "bg-rose-100 text-rose-700" : s === "Warm" ? "bg-amber-100 text-amber-700" : "bg-sky-100 text-sky-700";

function Leads() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-sm text-muted-foreground">Capture, qualify and route inbound prospects.</p>
        </div>
        <button className="rounded-md bg-gradient-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-brand">+ New lead</button>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-5 py-3">Lead</th><th className="px-5 py-3">Company</th><th className="px-5 py-3">Source</th><th className="px-5 py-3 text-right">Score</th><th className="px-5 py-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.map((l) => (
              <tr key={l.name} className="hover:bg-secondary/50">
                <td className="px-5 py-4 font-medium">{l.name}</td>
                <td className="px-5 py-4">{l.company}</td>
                <td className="px-5 py-4 text-muted-foreground">{l.source}</td>
                <td className="px-5 py-4 text-right font-semibold">{l.score}</td>
                <td className="px-5 py-4"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(l.status)}`}>{l.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
