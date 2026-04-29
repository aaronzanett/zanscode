import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bell, CheckCheck, CircleDollarSign, UserPlus, AlertTriangle,
  Megaphone, FileText, Clock, Search, Trash2, ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Zanscode OS" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NotificationsPage,
});

type NotifType = "info" | "success" | "warning" | "alert";
type Notif = {
  id: string;
  title: string;
  description: string;
  time: string;
  category: "Finance" | "Team" | "Inventory" | "System" | "Reports";
  type: NotifType;
  icon: typeof Bell;
  read: boolean;
};

const SEED: Notif[] = [
  { id: "n1", title: "New invoice approved", description: "INV-2041 for Acme Corp worth $48,500 has been approved.", time: "2 minutes ago", category: "Finance", type: "success", icon: CircleDollarSign, read: false },
  { id: "n2", title: "New employee joined", description: "Rina Marlina (Designer) has started onboarding today.", time: "25 minutes ago", category: "Team", type: "info", icon: UserPlus, read: false },
  { id: "n3", title: "Stock running low", description: "SKU MBP-14-512 has only 3 units left in the main warehouse.", time: "1 hour ago", category: "Inventory", type: "warning", icon: AlertTriangle, read: false },
  { id: "n4", title: "Team announcement", description: "Weekly town hall scheduled for Friday at 3:00 PM WIB.", time: "3 hours ago", category: "Team", type: "info", icon: Megaphone, read: true },
  { id: "n5", title: "Monthly report ready", description: "March 2026 financial report has finished processing.", time: "Yesterday", category: "Reports", type: "info", icon: FileText, read: true },
  { id: "n6", title: "Timesheets pending approval", description: "5 employee timesheets are awaiting your approval.", time: "Yesterday", category: "Team", type: "warning", icon: Clock, read: true },
  { id: "n7", title: "Backup completed", description: "Nightly database backup completed successfully (1.2 GB).", time: "2 days ago", category: "System", type: "success", icon: CheckCheck, read: true },
  { id: "n8", title: "Payment received", description: "Beta Studio paid INV-2032 ($12,400) via bank transfer.", time: "3 days ago", category: "Finance", type: "success", icon: CircleDollarSign, read: true },
];

const typeStyles: Record<NotifType, string> = {
  info: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  alert: "bg-red-500/10 text-red-600 dark:text-red-400",
};

function NotificationsPage() {
  const [items, setItems] = useState<Notif[]>(SEED);
  const [tab, setTab] = useState<"all" | "unread" | "read">("all");
  const [query, setQuery] = useState("");

  const unreadCount = useMemo(() => items.filter((i) => !i.read).length, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((n) => {
      if (tab === "unread" && n.read) return false;
      if (tab === "read" && !n.read) return false;
      if (!q) return true;
      return (
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q)
      );
    });
  }, [items, tab, query]);

  const markAllRead = () => setItems((prev) => prev.map((i) => ({ ...i, read: true })));
  const markRead = (id: string) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, read: true } : i)));
  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clearAll = () => setItems([]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            to="/app"
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to dashboard
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}.`
              : "You're all caught up."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            disabled={items.length === 0}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList>
            <TabsTrigger value="all">All ({items.length})</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
            <TabsTrigger value="read">Read ({items.length - unreadCount})</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notifications…"
            className="h-9 pl-8 text-sm"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">No notifications</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {query ? "Try a different search." : "You're all caught up."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((n) => {
              const Icon = n.icon;
              return (
                <li
                  key={n.id}
                  className={cn(
                    "group flex items-start gap-4 px-4 py-4 transition-colors hover:bg-secondary/40 sm:px-5",
                    !n.read && "bg-primary/[0.03]",
                  )}
                >
                  <div className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full", typeStyles[n.type])}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium">{n.title}</p>
                          {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{n.description}</p>
                        <div className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-wide text-muted-foreground/70">
                          <span className="rounded-full bg-secondary px-2 py-0.5 font-medium">{n.category}</span>
                          <span>{n.time}</span>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        {!n.read && (
                          <button
                            onClick={() => markRead(n.id)}
                            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            aria-label="Mark as read"
                            title="Mark as read"
                          >
                            <CheckCheck className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => remove(n.id)}
                          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          aria-label="Remove"
                          title="Remove"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
