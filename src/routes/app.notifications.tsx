import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bell, CheckCheck, CircleDollarSign, UserPlus, AlertTriangle,
  Megaphone, FileText, Clock, Search, Trash2, ArrowLeft, ChevronDown, ExternalLink,
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
  details: string;
  time: string;
  category: "Finance" | "Team" | "Inventory" | "System" | "Reports";
  type: NotifType;
  icon: typeof Bell;
  read: boolean;
  actor?: string;
  link?: { to: string; label: string };
};

const SEED: Notif[] = [
  { id: "n1", title: "New invoice approved", description: "INV-2041 for Acme Corp worth $48,500 has been approved.", details: "The invoice was reviewed by Finance and approved for payment processing. Expected settlement within 3 business days via bank transfer. Reference: PO-9921.", time: "2 minutes ago", category: "Finance", type: "success", icon: CircleDollarSign, read: false, actor: "Finance Bot", link: { to: "/app/finance", label: "Open in Finance" } },
  { id: "n2", title: "New employee joined", description: "Rina Marlina (Designer) has started onboarding today.", details: "Rina joins the Product Design team reporting to Adi. Onboarding checklist created with 12 items. First 1:1 scheduled for Thursday 10:00 WIB.", time: "25 minutes ago", category: "Team", type: "info", icon: UserPlus, read: false, actor: "HR System", link: { to: "/app/team", label: "View team" } },
  { id: "n3", title: "Stock running low", description: "SKU MBP-14-512 has only 3 units left in the main warehouse.", details: "Reorder threshold breached (min 5). Last 30-day velocity: 8 units/week. Suggested reorder quantity: 24 units. Lead time from supplier: 7 days.", time: "1 hour ago", category: "Inventory", type: "warning", icon: AlertTriangle, read: false, actor: "Inventory Watcher", link: { to: "/app/products", label: "Manage stock" } },
  { id: "n4", title: "Team announcement", description: "Weekly town hall scheduled for Friday at 3:00 PM WIB.", details: "Agenda: Q1 results recap, new product roadmap, recognitions, and open Q&A. Calendar invite sent to all staff. Recording will be shared after.", time: "3 hours ago", category: "Team", type: "info", icon: Megaphone, read: true, actor: "Owner" },
  { id: "n5", title: "Monthly report ready", description: "March 2026 financial report has finished processing.", details: "Revenue: $312,500 (+8.4% MoM). Expenses: $184,200. Net margin: 41%. Top client: Acme Corp ($72k). Full PDF available in Reports.", time: "Yesterday", category: "Reports", type: "info", icon: FileText, read: true, actor: "Reports Engine", link: { to: "/app/finance", label: "View report" } },
  { id: "n6", title: "Timesheets pending approval", description: "5 employee timesheets are awaiting your approval.", details: "Pending: Rina M., Doni S., Putri A., Bagas P., Indah K. Cutoff for payroll inclusion: Friday 17:00 WIB. Late submissions roll into the next cycle.", time: "Yesterday", category: "Team", type: "warning", icon: Clock, read: true, link: { to: "/app/team", label: "Review timesheets" } },
  { id: "n7", title: "Backup completed", description: "Nightly database backup completed successfully (1.2 GB).", details: "Backup snapshot stored in encrypted cloud storage. Retention: 30 days rolling. Restore tested last on April 22. No anomalies detected.", time: "2 days ago", category: "System", type: "success", icon: CheckCheck, read: true, actor: "System" },
  { id: "n8", title: "Payment received", description: "Beta Studio paid INV-2032 ($12,400) via bank transfer.", details: "Payment matched automatically against INV-2032. Outstanding balance: $0. Receipt emailed to billing@betastudio.com.", time: "3 days ago", category: "Finance", type: "success", icon: CircleDollarSign, read: true, actor: "Finance Bot", link: { to: "/app/finance", label: "Open invoice" } },
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
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

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

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        // Auto-mark read when opened
        setItems((curr) => curr.map((i) => (i.id === id ? { ...i, read: true } : i)));
      }
      return next;
    });
  };

  const markAllRead = () => setItems((prev) => prev.map((i) => ({ ...i, read: true })));
  const markRead = (id: string) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, read: true } : i)));
  const remove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setExpanded((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };
  const clearAll = () => {
    setItems([]);
    setExpanded(new Set());
  };

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
              const isOpen = expanded.has(n.id);
              return (
                <li
                  key={n.id}
                  className={cn(
                    "group transition-colors",
                    !n.read && "bg-primary/[0.03]",
                    isOpen && "bg-secondary/30",
                  )}
                >
                  <button
                    onClick={() => toggleExpand(n.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start gap-4 px-4 py-4 text-left transition-colors hover:bg-secondary/40 sm:px-5"
                  >
                    <div className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full", typeStyles[n.type])}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium">{n.title}</p>
                            {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                          </div>
                          <p className={cn("mt-1 text-sm text-muted-foreground", !isOpen && "line-clamp-1")}>
                            {n.description}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-wide text-muted-foreground/70">
                            <span className="rounded-full bg-secondary px-2 py-0.5 font-medium">{n.category}</span>
                            <span>{n.time}</span>
                            {n.actor && <span>· {n.actor}</span>}
                          </div>
                        </div>
                        <ChevronDown
                          className={cn(
                            "mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                            isOpen && "rotate-180",
                          )}
                        />
                      </div>
                    </div>
                  </button>

                  <div
                    className={cn(
                      "grid transition-all duration-200 ease-out",
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-border/60 bg-background/40 px-4 py-4 sm:px-5 sm:pl-[4.5rem]">
                        <p className="text-sm leading-relaxed text-foreground/80">{n.details}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {n.link && (
                            <Link
                              to={n.link.to}
                              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium transition-colors hover:border-brand hover:text-brand"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              {n.link.label}
                            </Link>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markRead(n.id);
                            }}
                            disabled={n.read}
                            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-40"
                          >
                            <CheckCheck className="h-3.5 w-3.5" />
                            Mark as read
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              remove(n.id);
                            }}
                            className="ml-auto inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        </div>
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
