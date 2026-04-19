import { createFileRoute } from "@tanstack/react-router";
import { FileText, TrendingUp, PieChart, Calculator } from "lucide-react";

export const Route = createFileRoute("/app/reports")({
  component: Reports,
});

const reports = [
  { t: "Profit & Loss", d: "Monthly P&L statement with comparison to last period.", i: TrendingUp },
  { t: "Balance Sheet", d: "Snapshot of assets, liabilities and equity.", i: FileText },
  { t: "Cash Flow", d: "Operating, investing and financing activities.", i: Calculator },
  { t: "Sales by Region", d: "Revenue breakdown across territories and channels.", i: PieChart },
  { t: "Expense by Category", d: "Where the money is going, grouped by category.", i: PieChart },
  { t: "Customer Cohorts", d: "Retention and LTV by signup cohort.", i: TrendingUp },
];

function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-sm text-muted-foreground">Generate financial and operational reports on demand.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <button key={r.t} className="group rounded-xl border border-border bg-card p-5 text-left shadow-soft transition-all hover:border-brand/40 hover:shadow-brand">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-brand"><r.i className="h-4 w-4" /></div>
            <h3 className="mt-3 font-semibold">{r.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{r.d}</p>
            <div className="mt-4 text-xs font-medium text-brand">Generate →</div>
          </button>
        ))}
      </div>
    </div>
  );
}
