import { createFileRoute, Link } from "@tanstack/react-router";
import { Zap, ShieldCheck, Globe2, Smartphone, BarChart3, Plug, ExternalLink, Users, Briefcase, Wallet, UserCog, LineChart, Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { FAQ } from "@/components/site/FAQ";
import productApps from "@/assets/product-apps.jpg";
import productPos from "@/assets/product-pos.jpg";
import productSaas from "@/assets/product-saas.jpg";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Zanscode" },
      { name: "description", content: "Explore Zanscode's finished products and SaaS apps — ERP, POS, CRM, HR, BI and more." },
      { property: "og:title", content: "Products & SaaS — Zanscode" },
      { property: "og:description", content: "Finished products and cloud SaaS apps to power every part of your business." },
      { property: "og:image", content: productApps },
    ],
  }),
  component: ProductsPage,
});

const products = [
  { name: "Zanscode ERP", img: productApps, tag: "Enterprise", desc: "End-to-end resource planning across finance, inventory, sales and HR — for mid-market teams." },
  { name: "ZansPOS", img: productPos, tag: "Retail & F&B", desc: "Cloud-connected POS with offline mode, multi-outlet stock, loyalty and analytics." },
  { name: "Zanscode OS", img: productSaas, tag: "SaaS", desc: "Modular operating platform for modern businesses — CRM, projects, finance and BI in one." },
];

// NOTE: Replace these placeholder URLs with each product's real website when ready.
const saasApps = [
  { icon: Users, name: "Zanscode CRM", desc: "Pipeline, deals and a true 360° view of every customer.", url: "https://crm.zanscode.com" },
  { icon: Briefcase, name: "Zanscode Projects", desc: "Tasks, sprints and team time tracking — built for delivery.", url: "https://projects.zanscode.com" },
  { icon: Wallet, name: "Zanscode Finance", desc: "Invoicing, expenses and reporting in one clean ledger.", url: "https://finance.zanscode.com" },
  { icon: UserCog, name: "Zanscode HR", desc: "People, payroll and performance — from hire to retire.", url: "https://hr.zanscode.com" },
  { icon: LineChart, name: "Zanscode BI", desc: "Real-time dashboards that turn raw data into decisions.", url: "https://bi.zanscode.com" },
  { icon: Boxes, name: "Zanscode Inventory", desc: "Multi-warehouse stock control with live sync.", url: "https://inventory.zanscode.com" },
];

const features = [
  { icon: Zap, t: "Fast time-to-value", d: "Deploy in days, not months — pre-built modules for common workflows." },
  { icon: ShieldCheck, t: "Enterprise-grade security", d: "RBAC, SSO, encryption at rest and in transit, audit logs." },
  { icon: Globe2, t: "Multi-region & multi-language", d: "Run globally with localized UI, currency and tax handling." },
  { icon: Smartphone, t: "Mobile-first", d: "Native apps for managers and staff — usable anywhere." },
  { icon: BarChart3, t: "Real-time analytics", d: "Dashboards that update as transactions happen." },
  { icon: Plug, t: "Open APIs", d: "REST and webhooks for any integration you need." },
];

const useCases = [
  { t: "Retail chain consolidation", d: "Unify multi-outlet inventory, sales and reporting under one roof." },
  { t: "Fleet & logistics ops", d: "Live tracking, dispatch, proof-of-delivery and driver scoring." },
  { t: "Service business automation", d: "Quotes, jobs, scheduling, invoicing and follow-ups in one flow." },
  { t: "Internal back-office", d: "Replace spreadsheets with structured workflows your team will actually use." },
];

const integrations = [
  "Stripe", "Xero", "QuickBooks", "Shopify", "WhatsApp Business", "Slack",
  "Google Workspace", "Microsoft 365", "Salesforce", "HubSpot", "Zapier", "Make",
];

const faqs = [
  { q: "Can products be customized for our workflow?", a: "Yes — every product supports configuration, custom modules, and white-labeling. We can extend functionality through the open API or as a paid customization." },
  { q: "Is on-premise deployment available?", a: "Yes for ERP and OS. Enterprise plans include on-prem or private-cloud deployments with the same feature set as our managed cloud." },
  { q: "How is data migration handled?", a: "We provide migration tooling and a guided onboarding process — most teams are live with their historical data within 2–4 weeks." },
  { q: "What support is included?", a: "Email support on all plans. Business and Enterprise add priority response, dedicated success manager, and SLAs up to 99.99% uptime." },
];

function ProductsPage() {
  return (
    <SiteLayout>
      <section className="bg-gradient-soft py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand">Products</span>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Battle-tested platforms, ready for your team.</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            A growing portfolio of finished products built on years of delivering technology for real operations.
          </p>
        </div>
      </section>

      {/* Product showcase */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
          {products.map((p, i) => (
            <article key={p.name} className={`grid items-center gap-10 rounded-3xl border border-border bg-card p-6 shadow-soft lg:grid-cols-2 lg:p-10 ${i % 2 ? "lg:[&>div:first-child]:order-2" : ""}`}>
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-brand opacity-15 blur-2xl" />
                <img src={p.img} alt={p.name} loading="lazy" className="relative w-full rounded-2xl border border-border" />
              </div>
              <div>
                <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-brand">{p.tag}</span>
                <h2 className="mt-3 text-3xl font-bold">{p.name}</h2>
                <p className="mt-3 text-muted-foreground">{p.desc}</p>
                <div className="mt-6 flex gap-3">
                  <Button asChild variant="brand"><Link to="/contact">Request demo</Link></Button>
                  <Button asChild variant="outline"><Link to="/saas">Learn more</Link></Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Key features */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Key capabilities</span>
            <h2 className="mt-3 text-3xl font-bold">Built for serious operations</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.t} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-brand-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{f.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Use cases</span>
            <h2 className="mt-3 text-3xl font-bold">Where teams put us to work</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {useCases.map((u) => (
              <div key={u.t} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <h3 className="text-lg font-semibold">{u.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{u.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Integrations</span>
            <h2 className="mt-3 text-3xl font-bold">Plays nicely with your stack</h2>
            <p className="mt-3 text-muted-foreground">Connect the tools you already use — or build your own with our open API.</p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {integrations.map((i) => (
              <span key={i} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-soft">{i}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ items={faqs} />

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold sm:text-4xl">See it running on your data.</h2>
          <p className="mt-3 text-muted-foreground">Book a guided demo with a product specialist.</p>
          <div className="mt-8">
            <Button asChild variant="brand" size="lg"><Link to="/contact">Request a demo</Link></Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
