import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, UserCog, Trash2, Edit, LogIn } from "lucide-react";

export const Route = createFileRoute("/app/audit-log")({
  component: AuditLog,
});

const events = [
  { who: "admin@zanscode.com", action: "Updated role permissions for Manager", when: "2m ago", icon: UserCog },
  { who: "maya@zanscode.com", action: "Signed in from Jakarta, ID", when: "18m ago", icon: LogIn },
  { who: "bagus@zanscode.com", action: "Edited invoice INV-2043", when: "1h ago", icon: Edit },
  { who: "admin@zanscode.com", action: "Suspended user external@partner.io", when: "3h ago", icon: ShieldCheck },
  { who: "reza@zanscode.com", action: "Deleted draft PO-3045", when: "5h ago", icon: Trash2 },
];

function AuditLog() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Audit Log</h1>
        <p className="text-sm text-muted-foreground">Immutable record of sensitive activity.</p>
      </div>
      <div className="rounded-xl border border-border bg-card shadow-soft">
        <ul className="divide-y divide-border">
          {events.map((e, i) => (
            <li key={i} className="flex items-start gap-4 px-5 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-brand"><e.icon className="h-4 w-4" /></div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{e.action}</div>
                <div className="text-xs text-muted-foreground">{e.who}</div>
              </div>
              <div className="shrink-0 text-xs text-muted-foreground">{e.when}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
