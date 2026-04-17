import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/settings")({
  component: Settings,
});

function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage workspace preferences.</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6 shadow-soft max-w-2xl">
        <h2 className="font-semibold">Workspace</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div><Label>Company name</Label><Input className="mt-1.5" defaultValue="Zanscode" /></div>
          <div><Label>Domain</Label><Input className="mt-1.5" defaultValue="zanscode.com" /></div>
          <div><Label>Currency</Label><Input className="mt-1.5" defaultValue="USD" /></div>
          <div><Label>Timezone</Label><Input className="mt-1.5" defaultValue="Asia/Jakarta" /></div>
        </div>
        <Button variant="brand" className="mt-6">Save changes</Button>
      </div>
    </div>
  );
}
