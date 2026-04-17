import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/saas")({
  head: () => ({
    meta: [
      { title: "SaaS — Zanscode" },
      { name: "description", content: "Subscribe to Zanscode SaaS — scale your team with our cloud platforms." },
      { property: "og:title", content: "SaaS Plans — Zanscode" },
      { property: "og:description", content: "Flexible subscription plans for Zanscode SaaS products." },
    ],
  }),
  component: SaasPage,
});

const tiers = [
  { name: "Starter", price: "$29", period: "/user/mo", desc: "For small teams getting organized.", features: ["Up to 10 users", "Core modules", "Email support", "5 GB storage"], variant: "outline" as const },
  { name: "Business", price: "$79", period: "/user/mo", desc: "For growing teams scaling operations.", features: ["Unlimited users", "All modules", "Automations", "Priority support", "100 GB storage"], variant: "brand" as const, highlight: true },
  { name: "Enterprise", price: "Custom", period: "", desc: "For large organizations with custom needs.", features: ["SSO & RBAC", "Dedicated infra", "SLA 99.99%", "On-prem option", "Custom integrations"], variant: "outline" as const },
];

const apps = [
  { name: "Zanscode CRM", desc: "Pipeline, deals, customer 360°." },
  { name: "Zanscode Projects", desc: "Tasks, sprints, and team time tracking." },
  { name: "Zanscode Finance", desc: "Invoicing, expenses, and reporting." },
  { name: "Zanscode HR", desc: "People, payroll and performance." },
  { name: "Zanscode BI", desc: "Real-time dashboards & insights." },
  { name: "Zanscode Inventory", desc: "Multi-warehouse stock control." },
];

function SaasPage() {
  return (
    <SiteLayout>
      <section className="bg-gradient-hero py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-cyan">SaaS Cloud</span>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">One subscription. Your whole business.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Modular SaaS apps that connect into a single, organized operating system for your team.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold">Choose your plan</h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {tiers.map((t) => (
              <div key={t.name} className={`rounded-2xl border p-8 ${t.highlight ? "border-brand bg-card shadow-brand scale-[1.02]" : "border-border bg-card shadow-soft"}`}>
                {t.highlight && <span className="inline-block rounded-full bg-gradient-brand px-3 py-1 text-xs font-semibold text-brand-foreground">Most popular</span>}
                <h3 className="mt-3 text-xl font-bold">{t.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{t.price}</span>
                  <span className="text-sm text-muted-foreground">{t.period}</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-brand-cyan" /> {f}</li>
                  ))}
                </ul>
                <Button asChild className="mt-8 w-full" variant={t.variant}>
                  <Link to="/contact">Get started</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Modules included</h2>
          <p className="mt-2 text-muted-foreground">Mix and match what your team needs today — add more anytime.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {apps.map((a) => (
              <div key={a.name} className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-soft">
                <h3 className="font-semibold">{a.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
