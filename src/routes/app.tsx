import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard, Users, UserCog, Briefcase, DollarSign, Boxes, Settings, Bell, Search, Menu, X,
  Target, Handshake, GitBranch, IdCard, Wallet, CalendarDays, UserPlus,
  ListChecks, Clock, Receipt, BarChart3, Truck, ClipboardList, LineChart, ShieldCheck,
  ChevronDown,
} from "lucide-react";
import logo from "@/assets/zanscode-logo.png";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Zanscode OS — Internal Dashboard" },
      { name: "description", content: "Internal company application powered by Zanscode OS." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AppLayout,
});

type AppPath =
  | "/app" | "/app/customers" | "/app/users" | "/app/settings"
  | "/app/leads" | "/app/deals" | "/app/pipeline"
  | "/app/employees" | "/app/payroll" | "/app/leave" | "/app/recruitment"
  | "/app/projects" | "/app/tasks" | "/app/timesheets"
  | "/app/finance" | "/app/expenses" | "/app/reports"
  | "/app/inventory" | "/app/suppliers" | "/app/purchase-orders"
  | "/app/analytics" | "/app/audit-log";

type NavItem = { to: AppPath; label: string; icon: typeof LayoutDashboard; exact?: boolean };
type NavGroup = { label: string; items: NavItem[] };

const groups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { to: "/app/analytics", label: "Analytics", icon: LineChart },
    ],
  },
  {
    label: "CRM",
    items: [
      { to: "/app/customers", label: "Customers", icon: Users },
      { to: "/app/leads", label: "Leads", icon: Target },
      { to: "/app/deals", label: "Deals", icon: Handshake },
      { to: "/app/pipeline", label: "Pipeline", icon: GitBranch },
    ],
  },
  {
    label: "People",
    items: [
      { to: "/app/employees", label: "Employees", icon: IdCard },
      { to: "/app/payroll", label: "Payroll", icon: Wallet },
      { to: "/app/leave", label: "Leave", icon: CalendarDays },
      { to: "/app/recruitment", label: "Recruitment", icon: UserPlus },
    ],
  },
  {
    label: "Operations",
    items: [
      { to: "/app/projects", label: "Projects", icon: Briefcase },
      { to: "/app/tasks", label: "Tasks", icon: ListChecks },
      { to: "/app/timesheets", label: "Timesheets", icon: Clock },
    ],
  },
  {
    label: "Finance",
    items: [
      { to: "/app/finance", label: "Invoices", icon: DollarSign },
      { to: "/app/expenses", label: "Expenses", icon: Receipt },
      { to: "/app/reports", label: "Reports", icon: BarChart3 },
    ],
  },
  {
    label: "Inventory",
    items: [
      { to: "/app/inventory", label: "Items", icon: Boxes },
      { to: "/app/suppliers", label: "Suppliers", icon: Truck },
      { to: "/app/purchase-orders", label: "Purchase Orders", icon: ClipboardList },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/app/users", label: "Users & Roles", icon: UserCog },
      { to: "/app/audit-log", label: "Audit Log", icon: ShieldCheck },
      { to: "/app/settings", label: "Settings", icon: Settings },
    ],
  },
];

function SidebarContent({ pathname, onNavigate, query, setQuery }: { pathname: string; onNavigate?: () => void; query: string; setQuery: (v: string) => void }) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({ ...g, items: g.items.filter((i) => i.label.toLowerCase().includes(q)) }))
      .filter((g) => g.items.length > 0);
  }, [query]);

  return (
    <>
      <div className="flex h-14 shrink-0 items-center overflow-hidden border-b border-border px-5">
        <Link to="/" className="flex items-center" onClick={onNavigate}>
          <img src={logo} alt="Zanscode" className="h-8 w-auto" />
        </Link>
      </div>
      <div className="shrink-0 border-b border-border px-3 py-2.5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Quick find…"
            className="h-8 border-border/70 bg-secondary/50 pl-8 text-xs"
          />
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {filtered.length === 0 && (
          <p className="px-2 py-4 text-center text-xs text-muted-foreground">No matches</p>
        )}
        {filtered.map((group) => (
          <div key={group.label} className="mb-4 last:mb-0">
            <div className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/");
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onNavigate}
                    className={`group relative flex items-center gap-2.5 overflow-hidden rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors ${active ? "bg-gradient-brand text-brand-foreground shadow-soft" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
                  >
                    {active && (
                      <span
                        key={pathname}
                        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer-sweep_900ms_ease-out_forwards]"
                      />
                    )}
                    <item.icon className={`relative h-4 w-4 ${active ? "scale-110" : ""}`} />
                    <span className="relative">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="shrink-0 border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-sm font-semibold text-brand-foreground">AZ</div>
          <div className="min-w-0 text-sm">
            <div className="truncate font-semibold">Admin</div>
            <div className="truncate text-xs text-muted-foreground">admin@zanscode.com</div>
          </div>
        </div>
      </div>
    </>
  );
}

function AppLayout() {
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-border bg-card lg:flex">
        <SidebarContent pathname={loc.pathname} query={query} setQuery={setQuery} />
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card shadow-xl transition-transform duration-300 ease-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent pathname={loc.pathname} onNavigate={() => setOpen(false)} query={query} setQuery={setQuery} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2">
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-secondary lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="text-sm font-semibold">Zanscode OS</div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="rounded-lg p-2 hover:bg-secondary"><Bell className="h-4 w-4" /></button>
            <Link to="/" className="hidden text-xs text-muted-foreground hover:text-foreground sm:inline">← Back to site</Link>
          </div>
        </header>
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
