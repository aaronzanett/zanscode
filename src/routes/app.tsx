import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, Users, UserCog, Briefcase, DollarSign, Boxes, Settings, Bell, Search, Menu, X } from "lucide-react";
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

type NavItem = { to: "/app" | "/app/customers" | "/app/projects" | "/app/finance" | "/app/inventory" | "/app/users" | "/app/settings"; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const sidebar: NavItem[] = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/customers", label: "Customers", icon: Users },
  { to: "/app/projects", label: "Projects", icon: Briefcase },
  { to: "/app/finance", label: "Finance", icon: DollarSign },
  { to: "/app/inventory", label: "Inventory", icon: Boxes },
  { to: "/app/users", label: "Users", icon: UserCog },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      <div className="flex h-16 shrink-0 items-center overflow-hidden border-b border-border px-6">
        <Link to="/" className="flex items-center" onClick={onNavigate}>
          <img src={logo} alt="Zanscode" className="h-9 w-auto" />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {sidebar.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={`group relative flex items-center gap-3 overflow-hidden rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ease-out ${active ? "bg-gradient-brand text-brand-foreground shadow-soft" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
            >
              {active && (
                <span
                  key={pathname}
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer-sweep_900ms_ease-out_forwards]"
                />
              )}
              <item.icon className={`relative h-4 w-4 transition-transform duration-300 ${active ? "scale-110" : ""}`} />
              <span className="relative transition-transform duration-300">{item.label}</span>
            </Link>
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
  const [open, setOpen] = useState(false);

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
        <SidebarContent pathname={loc.pathname} />
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
        <SidebarContent pathname={loc.pathname} onNavigate={() => setOpen(false)} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
          <div className="flex flex-1 items-center gap-2 sm:gap-3">
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-secondary lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Search className="hidden h-4 w-4 text-muted-foreground sm:block" />
            <Input placeholder="Search anything…" className="max-w-md border-0 bg-transparent shadow-none focus-visible:ring-0" />
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
