import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard, Users, UserCog, Briefcase, DollarSign, Boxes, Settings, Search, Menu, X,
  Target, Handshake, GitBranch, IdCard, Wallet, CalendarDays, UserPlus,
  ListChecks, Clock, Receipt, BarChart3, Truck, ClipboardList, LineChart, ShieldCheck,
  ChevronDown, LogOut, Wrench,
} from "lucide-react";
import logo from "@/assets/zanscode-logo.png";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LiveClock } from "@/components/app/LiveClock";
import { NotificationsBell } from "@/components/app/NotificationsBell";
import { getSession, signOut, type StaffSession } from "@/lib/auth";
import { useAppSettings } from "@/hooks/use-app-settings";

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

function SidebarContent({ pathname, onNavigate, query, setQuery, session, onSignOut }: { pathname: string; onNavigate?: () => void; query: string; setQuery: (v: string) => void; session: StaffSession | null; onSignOut: () => void }) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({ ...g, items: g.items.filter((i) => i.label.toLowerCase().includes(q)) }))
      .filter((g) => g.items.length > 0);
  }, [query]);

  // Collapsible state per group; default = all open
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map((g) => [g.label, true]))
  );
  const toggleGroup = (label: string) =>
    setOpenGroups((prev) => ({ ...prev, [label]: !(prev[label] ?? true) }));

  const searching = query.trim().length > 0;

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
      <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-3">
        {filtered.length === 0 && (
          <p className="px-2 py-4 text-center text-xs text-muted-foreground">No matches</p>
        )}
        {filtered.map((group) => {
          const isOpen = searching ? true : (openGroups[group.label] ?? true);
          return (
            <div key={group.label} className="mb-3 last:mb-0">
              <button
                type="button"
                onClick={() => !searching && toggleGroup(group.label)}
                aria-expanded={isOpen}
                disabled={searching}
                className="group flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 transition-colors hover:text-foreground disabled:opacity-100"
              >
                <span>{group.label}</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 transition-transform duration-200 ease-out",
                    isOpen ? "rotate-0" : "-rotate-90",
                  )}
                  strokeWidth={2.5}
                />
              </button>
              <div
                className={cn(
                  "grid transition-all duration-200 ease-out",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <div className="mt-1 space-y-0.5">
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
              </div>
            </div>
          );
        })}
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
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [session, setSession] = useState<StaffSession | null>(null);
  const [checked, setChecked] = useState(false);
  const settings = useAppSettings();

  // Auth guard — redirect to /staff/login if not signed in
  useEffect(() => {
    const s = getSession();
    if (!s) {
      navigate({ to: "/staff/login" });
      return;
    }
    setSession(s);
    setChecked(true);
  }, [navigate]);

  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  const handleSignOut = () => {
    signOut();
    navigate({ to: "/staff/login" });
  };

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-border bg-card lg:flex">
        <SidebarContent pathname={loc.pathname} query={query} setQuery={setQuery} session={session} onSignOut={handleSignOut} />
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
        <SidebarContent pathname={loc.pathname} onNavigate={() => setOpen(false)} query={query} setQuery={setQuery} session={session} onSignOut={handleSignOut} />
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
            <div className="text-sm font-semibold">{settings.appName}</div>
            {settings.maintenanceMode && (
              <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                <Wrench className="h-3 w-3" />
                Maintenance
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <LiveClock />
            <NotificationsBell />
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
