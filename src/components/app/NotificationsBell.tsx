import { useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell, CheckCheck, CircleDollarSign, UserPlus, AlertTriangle, Megaphone, FileText, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type NotifType = "info" | "success" | "warning" | "alert";

type Notif = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: NotifType;
  icon: typeof Bell;
  read: boolean;
};

const SEED: Notif[] = [
  {
    id: "n1",
    title: "New invoice approved",
    description: "INV-2041 for Acme Corp worth $48,500 has been approved.",
    time: "2 minutes ago",
    type: "success",
    icon: CircleDollarSign,
    read: false,
  },
  {
    id: "n2",
    title: "New employee joined",
    description: "Rina Marlina (Designer) has started onboarding today.",
    time: "25 minutes ago",
    type: "info",
    icon: UserPlus,
    read: false,
  },
  {
    id: "n3",
    title: "Stock running low",
    description: "SKU MBP-14-512 has only 3 units left in the main warehouse.",
    time: "1 hour ago",
    type: "warning",
    icon: AlertTriangle,
    read: false,
  },
  {
    id: "n4",
    title: "Team announcement",
    description: "Weekly town hall scheduled for Friday at 3:00 PM WIB.",
    time: "3 hours ago",
    type: "info",
    icon: Megaphone,
    read: true,
  },
  {
    id: "n5",
    title: "Monthly report ready",
    description: "March 2026 financial report has finished processing.",
    time: "Yesterday",
    type: "info",
    icon: FileText,
    read: true,
  },
  {
    id: "n6",
    title: "Timesheets pending approval",
    description: "5 employee timesheets are awaiting your approval.",
    time: "Yesterday",
    type: "warning",
    icon: Clock,
    read: true,
  },
];

const typeStyles: Record<NotifType, string> = {
  info: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  alert: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export function NotificationsBell() {
  const [items, setItems] = useState<Notif[]>(SEED);
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [open, setOpen] = useState(false);

  const unreadCount = useMemo(() => items.filter((i) => !i.read).length, [items]);
  const visible = tab === "unread" ? items.filter((i) => !i.read) : items;

  const markAllRead = () => setItems((prev) => prev.map((i) => ({ ...i, read: true })));
  const markRead = (id: string) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, read: true } : i)));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="relative rounded-lg p-2 transition-colors hover:bg-secondary"
          aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ""}`}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-red-500 px-[3px] text-[9px] font-semibold leading-none text-white ring-2 ring-card">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[360px] overflow-hidden p-0 sm:w-[400px]"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <div className="text-sm font-semibold">Notifications</div>
            <div className="text-xs text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
            </div>
          </div>
          <button
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </button>
        </div>
        <div className="flex border-b border-border px-2 pt-2">
          {(["all", "unread"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "relative px-3 py-2 text-xs font-medium transition-colors",
                tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t === "all" ? "All" : "Unread"}
              {tab === t && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-gradient-brand" />
              )}
            </button>
          ))}
        </div>
        <div className="scrollbar-thin max-h-[380px] overflow-y-auto">
          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <CheckCheck className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">No notifications</p>
              <p className="mt-1 text-xs text-muted-foreground">You're all caught up.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {visible.map((n) => {
                const Icon = n.icon;
                return (
                  <li key={n.id}>
                    <button
                      onClick={() => markRead(n.id)}
                      className={cn(
                        "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/50",
                        !n.read && "bg-primary/[0.03]",
                      )}
                    >
                      <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full", typeStyles[n.type])}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium leading-tight">{n.title}</p>
                          {!n.read && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.description}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground/70">{n.time}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="border-t border-border bg-secondary/30 px-4 py-2.5 text-center">
          <button className="text-xs font-medium text-primary hover:underline">
            View all notifications
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
