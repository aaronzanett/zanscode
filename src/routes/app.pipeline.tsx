import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/pipeline")({
  component: Pipeline,
});

const stages = [
  { name: "Discovery", deals: [{ n: "Initech Pilot", v: "$2.9k" }, { n: "BlueOcean Demo", v: "$5.4k" }] },
  { name: "Proposal", deals: [{ n: "Acme Renewal", v: "$48k" }, { n: "Northwind Migration", v: "$24k" }] },
  { name: "Negotiation", deals: [{ n: "Globex POS", v: "$112k" }] },
  { name: "Won", deals: [{ n: "Riverside Add-on", v: "$8.4k" }, { n: "Mesa Monthly", v: "$1.2k" }] },
];

function Pipeline() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pipeline</h1>
        <p className="text-sm text-muted-foreground">Visualise deal flow across stages.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stages.map((s) => (
          <div key={s.name} className="rounded-xl border border-border bg-card p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{s.name}</h3>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{s.deals.length}</span>
            </div>
            <div className="mt-3 space-y-2">
              {s.deals.map((d) => (
                <div key={d.n} className="rounded-lg border border-border bg-background p-3 text-sm">
                  <div className="font-medium">{d.n}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{d.v}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
