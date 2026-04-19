import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Users, ShoppingCart, Globe } from "lucide-react";

export const Route = createFileRoute("/app/analytics")({
  component: Analytics,
});

const kpis = [
  { l: "Conversion rate", v: "4.82%", d: "+0.6 pts", i: TrendingUp },
  { l: "Active sessions", v: "12,408", d: "+8.1%", i: Users },
  { l: "Avg. order value", v: "$184", d: "+3.4%", i: ShoppingCart },
  { l: "Top region", v: "Indonesia", d: "62% share", i: Globe },
];

const channels = [
  { c: "Organic Search", v: 38 },
  { c: "Direct", v: 24 },
  { c: "Referral", v: 18 },
  { c: "Paid Ads", v: 12 },
  { c: "Social", v: 8 },
];

function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">Cross-functional insights across product, sales and operations.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.l} className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{k.l}</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-brand"><k.i className="h-4 w-4" /></div>
            </div>
            <div className="mt-3 text-2xl font-bold">{k.v}</div>
            <div className="mt-1 text-xs text-emerald-600">{k.d}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
        <h2 className="font-semibold">Traffic by channel</h2>
        <div className="mt-5 space-y-4">
          {channels.map((c) => (
            <div key={c.c}>
              <div className="flex items-center justify-between text-sm">
                <span>{c.c}</span><span className="text-muted-foreground">{c.v}%</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-gradient-brand" style={{ width: `${c.v * 2.5}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
