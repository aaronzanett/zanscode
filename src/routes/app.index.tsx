import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, DollarSign, ShoppingBag, Users, Activity } from "lucide-react";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

const kpis = [
  { l: "Revenue", v: "$284,392", d: "+12.4%", up: true, i: DollarSign },
  { l: "Active Customers", v: "1,284", d: "+5.2%", up: true, i: Users },
  { l: "Orders Today", v: "342", d: "-2.1%", up: false, i: ShoppingBag },
  { l: "Uptime", v: "99.98%", d: "+0.02%", up: true, i: Activity },
];

const activity = [
  { t: "Invoice #INV-2041 paid", w: "Acme Corp", a: "$4,200", time: "2m ago" },
  { t: "New customer onboarded", w: "Northwind Ltd", a: "—", time: "21m ago" },
  { t: "Project milestone completed", w: "Zenith App v2", a: "—", time: "1h ago" },
  { t: "Stock replenished — SKU 8821", w: "Warehouse JKT", a: "+240", time: "3h ago" },
  { t: "Monthly subscription renewed", w: "Riverside Inc", a: "$1,290", time: "5h ago" },
];

function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back 👋</h1>
        <p className="text-sm text-muted-foreground">Here's what's happening across your business today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.l} className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{k.l}</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-brand"><k.i className="h-4 w-4" /></div>
            </div>
            <div className="mt-3 text-2xl font-bold">{k.v}</div>
            <div className={`mt-1 flex items-center gap-1 text-xs ${k.up ? "text-emerald-600" : "text-rose-600"}`}>
              {k.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />} {k.d} vs last week
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Revenue trend</h2>
            <span className="text-xs text-muted-foreground">Last 30 days</span>
          </div>
          <svg viewBox="0 0 600 200" className="mt-4 h-56 w-full">
            <defs>
              <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.55 0.18 245)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="oklch(0.55 0.18 245)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,150 C50,120 100,160 150,110 S250,40 300,80 S400,150 450,90 S550,30 600,60 L600,200 L0,200 Z" fill="url(#g)" />
            <path d="M0,150 C50,120 100,160 150,110 S250,40 300,80 S400,150 450,90 S550,30 600,60" fill="none" stroke="oklch(0.55 0.18 245)" strokeWidth="2.5" />
          </svg>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-semibold">Recent activity</h2>
          <ul className="mt-4 space-y-4">
            {activity.map((a, i) => (
              <li key={i} className="flex items-start justify-between gap-3 text-sm">
                <div>
                  <div className="font-medium">{a.t}</div>
                  <div className="text-xs text-muted-foreground">{a.w} • {a.time}</div>
                </div>
                <div className="text-xs font-semibold text-brand">{a.a}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
