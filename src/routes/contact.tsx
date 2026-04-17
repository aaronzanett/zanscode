import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SiteLayout } from "@/components/site/SiteLayout";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Zanscode" },
      { name: "description", content: "Talk to Zanscode about your business technology project." },
      { property: "og:title", content: "Contact Zanscode" },
      { property: "og:description", content: "Get in touch about your project." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
    toast.success("Message sent — we'll get back within 1 business day.");
    (e.target as HTMLFormElement).reset();
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <SiteLayout>
      <section className="bg-gradient-hero py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold sm:text-5xl">Let's build something powerful.</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/80">Tell us about your team and goals — we'll reply within one business day.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="space-y-6 lg:col-span-1">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-brand text-brand-foreground"><Mail className="h-5 w-5" /></div>
              <div><div className="font-semibold">Email</div><div className="text-sm text-muted-foreground">hello@zanscode.com</div></div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-brand text-brand-foreground"><Phone className="h-5 w-5" /></div>
              <div><div className="font-semibold">Phone</div><div className="text-sm text-muted-foreground">+1 (555) 010-0123</div></div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-brand text-brand-foreground"><MapPin className="h-5 w-5" /></div>
              <div><div className="font-semibold">HQ</div><div className="text-sm text-muted-foreground">Innovation District<br />Jakarta, Indonesia</div></div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-8 shadow-soft lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label htmlFor="name">Full name</Label><Input id="name" required className="mt-1.5" /></div>
              <div><Label htmlFor="email">Work email</Label><Input id="email" type="email" required className="mt-1.5" /></div>
              <div><Label htmlFor="company">Company</Label><Input id="company" className="mt-1.5" /></div>
              <div><Label htmlFor="budget">Budget</Label><Input id="budget" placeholder="e.g. $20k - $50k" className="mt-1.5" /></div>
            </div>
            <div className="mt-4">
              <Label htmlFor="message">Project details</Label>
              <Textarea id="message" rows={6} required className="mt-1.5" placeholder="Tell us about your project, timeline and goals…" />
            </div>
            <Button type="submit" variant="brand" size="lg" className="mt-6" disabled={sent}>
              {sent ? "Sent ✓" : "Send message"}
            </Button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
