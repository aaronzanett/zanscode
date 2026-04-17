import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Users, Briefcase, DollarSign, Boxes, Settings, Bell, Search } from "lucide-react";
import logo from "@/assets/zanscode-logo.png";
import { Input } from "@/components/ui/input";

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

type NavItem = { to: "/app" | "/app/customers" | "/app/projects" | "/app/finance" | "/app/inventory" | "/app/settings"; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const sidebar: NavItem[] = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/customers", label: "Customers", icon: Users },
  { to: "/app/projects", label: "Projects", icon: Briefcase },
  { to: "/app/finance", label: "Finance", icon: DollarSign },
  { to: "/app/inventory", label: "Inventory", icon: Boxes },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

function AppLayout() {
  const loc = useLocation();
  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="hidden w-64 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link to="/"><img src={logo} alt="Zanscode" className="h-7 w-auto" /></Link>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {sidebar.map((item) => {
            const active = item.exact ? loc.pathname === item.to : loc.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-gradient-brand text-brand-foreground shadow-soft" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-brand text-sm font-semibold text-brand-foreground">AZ</div>
            <div className="text-sm">
              <div className="font-semibold">Admin</div>
              <div className="text-xs text-muted-foreground">admin@zanscode.com</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <div className="flex flex-1 items-center gap-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search anything…" className="max-w-md border-0 bg-transparent shadow-none focus-visible:ring-0" />
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-lg p-2 hover:bg-secondary"><Bell className="h-4 w-4" /></button>
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Back to site</Link>
          </div>
        </header>
        <div className="flex-1 p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
