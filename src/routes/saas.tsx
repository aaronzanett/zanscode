import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Lock, ShieldCheck, KeyRound, FileCheck2, ServerCog, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { FAQ } from "@/components/site/FAQ";

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

const compareRows: { label: string; values: [string | boolean, string | boolean, string | boolean] }[] = [
  { label: "Users", values: ["Up to 10", "Unlimited", "Unlimited"] },
  { label: "Core modules", values: [true, true, true] },
  { label: "Automations & workflows", values: [false, true, true] },
  { label: "Open API access", values: [false, true, true] },
  { label: "SSO / SAML", values: [false, false, true] },
  { label: "Dedicated infrastructure", values: [false, false, true] },
  { label: "Uptime SLA", values: ["—", "99.9%", "99.99%"] },
  { label: "Support", values: ["Email", "Priority", "Dedicated CSM"] },
];

const security = [
  { icon: Lock, t: "Encryption everywhere", d: "AES-256 at rest, TLS 1.3 in transit." },
  { icon: KeyRound, t: "SSO & SAML", d: "Okta, Azure AD, Google Workspace and custom IdPs." },
  { icon: ShieldCheck, t: "Role-based access", d: "Granular permissions and audit logs on every action." },
  { icon: FileCheck2, t: "Compliance-ready", d: "SOC 2 controls, GDPR, and regional data residency." },
  { icon: ServerCog, t: "99.99% uptime", d: "Multi-region active-active architecture for Enterprise." },
];

const testimonials = [
  { quote: "We replaced 5 SaaS tools with Zanscode OS. Cleaner data, lower cost, happier team.", name: "Daniel Tan", role: "CEO, OmniMart" },
  { quote: "Onboarding was the smoothest we've had — live in 9 days with our historical data migrated.", name: "Putri Hapsari", role: "Ops Lead, NusaLogistics" },
];

const faqs = [
  { q: "Can I switch plans later?", a: "Yes. Upgrade or downgrade anytime from the billing page. Changes prorate automatically." },
  { q: "Is there a free trial?", a: "Yes — 14 days on Starter and Business, no credit card required." },
  { q: "Where is my data stored?", a: "By default in the region closest to your team. Enterprise plans support custom regions and on-prem deployments." },
  { q: "Do you offer non-profit or startup discounts?", a: "Yes. Contact us with details — we have programs for early-stage startups and registered non-profits." },
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

      {/* Pricing */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Pricing</span>
            <h2 className="mt-3 text-3xl font-bold">Choose your plan</h2>
          </div>
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

      {/* Modules */}
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

      {/* Comparison table */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Compare plans</span>
            <h2 className="mt-3 text-3xl font-bold">What's in each tier</h2>
          </div>
          <div className="mt-10 overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50 text-left">
                  <th className="px-6 py-4 font-semibold">Feature</th>
                  <th className="px-6 py-4 font-semibold">Starter</th>
                  <th className="px-6 py-4 font-semibold text-brand">Business</th>
                  <th className="px-6 py-4 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr key={row.label} className="border-b border-border last:border-0">
                    <td className="px-6 py-4 font-medium">{row.label}</td>
                    {row.values.map((v, i) => (
                      <td key={i} className="px-6 py-4 text-muted-foreground">
                        {typeof v === "boolean" ? (v ? <Check className="h-4 w-4 text-brand-cyan" /> : <span className="text-muted-foreground/50">—</span>) : v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Security & compliance */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Security & compliance</span>
            <h2 className="mt-3 text-3xl font-bold">Enterprise-grade by default</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {security.map((s) => (
              <div key={s.t} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-brand-foreground">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Loved by teams</span>
            <h2 className="mt-3 text-3xl font-bold">From real customers</h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {testimonials.map((t) => (
              <figure key={t.name} className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft">
                <Quote className="h-6 w-6 text-brand" />
                <blockquote className="mt-4 text-base">"{t.quote}"</blockquote>
                <div className="mt-4 flex items-center gap-1 text-brand-cyan">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <figcaption className="mt-3 text-sm">
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-muted-foreground">{t.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ items={faqs} />
    </SiteLayout>
  );
}
