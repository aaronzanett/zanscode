import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Zap, ShieldCheck, Globe2, Smartphone, BarChart3, Plug, ExternalLink,
  Users, Briefcase, Wallet, UserCog, LineChart, Boxes, Headphones,
  Megaphone, Calendar, MessageSquare, ArrowRight, Check, Sparkles, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";

import productApps from "@/assets/product-apps.jpg";
import productPos from "@/assets/product-pos.jpg";
import productSaas from "@/assets/product-saas.jpg";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products & SaaS — Zanscode" },
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
type SaasApp = {
  icon: typeof Users;
  name: string;
  tagline: string;
  desc: string;
  url: string;
  startingPrice: string;
  badge?: "New" | "Popular" | "Beta";
};

const saasGroups: { category: string; description: string; apps: SaasApp[] }[] = [
  {
    category: "Sales & Customers",
    description: "Win more deals and keep customers close.",
    apps: [
      { icon: Users, name: "Zanscode CRM", tagline: "Customer 360°", desc: "Pipeline, deals and a unified view of every customer interaction.", url: "https://crm.zanscode.com", startingPrice: "$19/user/mo", badge: "Popular" },
      { icon: Megaphone, name: "Zanscode Marketing", tagline: "Campaigns that convert", desc: "Email, WhatsApp and social campaigns with built-in attribution.", url: "https://marketing.zanscode.com", startingPrice: "$29/mo" },
      { icon: Headphones, name: "Zanscode Helpdesk", tagline: "Faster support", desc: "Omnichannel ticketing with SLAs, automations and CSAT scoring.", url: "https://helpdesk.zanscode.com", startingPrice: "$15/agent/mo" },
    ],
  },
  {
    category: "Operations & Finance",
    description: "The back-office, without the spreadsheets.",
    apps: [
      { icon: Wallet, name: "Zanscode Finance", tagline: "Books, sorted", desc: "Invoicing, expenses, multi-currency and reporting in one ledger.", url: "https://finance.zanscode.com", startingPrice: "$29/mo" },
      { icon: Boxes, name: "Zanscode Inventory", tagline: "Stock, in sync", desc: "Multi-warehouse stock control with live sync to POS and e-commerce.", url: "https://inventory.zanscode.com", startingPrice: "$39/mo" },
      { icon: Briefcase, name: "Zanscode Projects", tagline: "Ship on time", desc: "Tasks, sprints, time tracking and client collaboration in one tool.", url: "https://projects.zanscode.com", startingPrice: "$12/user/mo" },
    ],
  },
  {
    category: "People & Insights",
    description: "Run your team and see the whole picture.",
    apps: [
      { icon: UserCog, name: "Zanscode HR", tagline: "From hire to retire", desc: "People records, payroll, attendance and performance reviews.", url: "https://hr.zanscode.com", startingPrice: "$5/employee/mo" },
      { icon: Calendar, name: "Zanscode Scheduling", tagline: "Shifts made simple", desc: "Smart shift planning with availability, swaps and labor cost forecasts.", url: "https://scheduling.zanscode.com", startingPrice: "$3/employee/mo", badge: "New" },
      { icon: LineChart, name: "Zanscode BI", tagline: "Decisions in real time", desc: "Live dashboards across every Zanscode app and your existing data.", url: "https://bi.zanscode.com", startingPrice: "$49/mo" },
    ],
  },
];

const featuredSaas = {
  icon: Sparkles,
  name: "Zanscode OS",
  tagline: "The all-in-one operating platform",
  desc: "Run sales, operations, finance, HR and analytics on one connected platform — with a single source of truth and a single bill.",
  url: "https://os.zanscode.com",
  highlights: [
    "Includes 8+ Zanscode SaaS apps",
    "Single sign-on across every module",
    "Unified data, automations and dashboards",
    "Open API and 100+ integrations",
  ],
};

const saasStats = [
  { v: "12+", l: "SaaS apps" },
  { v: "8,500+", l: "Active users" },
  { v: "99.98%", l: "Uptime" },
  { v: "30+", l: "Countries" },
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

const testimonial = {
  quote: "We replaced five disconnected tools with three Zanscode SaaS apps. Our team is faster, our data is finally clean, and onboarding new staff takes a day instead of a week.",
  name: "Rendra Suharto",
  role: "COO, NusaMart Group",
};

const faqs = [
  { q: "Can products be customized for our workflow?", a: "Yes — every product supports configuration, custom modules, and white-labeling. We can extend functionality through the open API or as a paid customization." },
  { q: "Can I use just one SaaS app, or do I need the whole suite?", a: "Each Zanscode SaaS works perfectly on its own. When you adopt more than one, they automatically share data and sign-in — no extra setup required." },
  { q: "Is there a free trial?", a: "Yes. Every Zanscode SaaS app includes a 14-day free trial — no credit card required. Zanscode OS includes 30 days for full team evaluation." },
  { q: "Is on-premise deployment available?", a: "Yes for ERP and OS. Enterprise plans include on-prem or private-cloud deployments with the same feature set as our managed cloud." },
  { q: "How is data migration handled?", a: "We provide migration tooling and a guided onboarding process — most teams are live with their historical data within 2–4 weeks." },
];

function ProductsPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-gradient-soft py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand">Products & SaaS</span>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">A complete software stack for modern operations.</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Battle-tested products and a growing family of SaaS apps — pick what you need today, scale to the full suite tomorrow.
          </p>
          <dl className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {saasStats.map((s) => (
              <div key={s.l}>
                <dt className="text-3xl font-bold text-foreground">{s.v}</dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Flagship products */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Flagship products</span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Battle-tested platforms</h2>
          </div>
          {products.map((p, i) => (
            <article key={p.name} className={`grid items-center gap-10 rounded-3xl border border-border bg-card p-6 shadow-soft lg:grid-cols-2 lg:p-10 ${i % 2 ? "lg:[&>div:first-child]:order-2" : ""}`}>
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-brand opacity-15 blur-2xl" />
                <img src={p.img} alt={p.name} loading="lazy" className="relative w-full rounded-2xl border border-border" />
              </div>
              <div>
                <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-brand">{p.tag}</span>
                <h3 className="mt-3 text-3xl font-bold">{p.name}</h3>
                <p className="mt-3 text-muted-foreground">{p.desc}</p>
                <div className="mt-6 flex gap-3">
                  <Button asChild variant="brand"><Link to="/contact">Request demo</Link></Button>
                  <Button asChild variant="outline"><Link to="/contact">Learn more</Link></Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Featured SaaS — Zanscode OS */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-hero p-8 text-white shadow-brand sm:p-12">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-cyan/30 blur-3xl" />
            <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-brand/40 blur-3xl" />
            <div className="relative grid gap-10 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
                  <featuredSaas.icon className="h-3.5 w-3.5" /> Featured SaaS
                </span>
                <h2 className="mt-5 text-3xl font-bold sm:text-4xl">{featuredSaas.name}</h2>
                <p className="mt-2 text-lg text-white/80">{featuredSaas.tagline}</p>
                <p className="mt-4 max-w-xl text-white/70">{featuredSaas.desc}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild size="lg" variant="brand">
                    <a href={featuredSaas.url} target="_blank" rel="noopener noreferrer">
                      Visit Zanscode OS <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="hero">
                    <Link to="/contact">Talk to sales</Link>
                  </Button>
                </div>
              </div>
              <ul className="space-y-3 rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur lg:col-span-2">
                {featuredSaas.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-sm text-white/90">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-cyan" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SaaS app catalog — grouped by category */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">SaaS app catalog</span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">A focused app for every job</h2>
            <p className="mt-3 text-muted-foreground">
              Each Zanscode SaaS lives on its own site. Start with one — adopt more whenever you're ready.
            </p>
          </div>

          <div className="mt-14 space-y-14">
            {saasGroups.map((group) => (
              <div key={group.category}>
                <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <h3 className="text-xl font-bold">{group.category}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
                  </div>
                  <span className="hidden text-xs font-medium text-muted-foreground sm:block">
                    {group.apps.length} apps
                  </span>
                </div>
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {group.apps.map((app) => (
                    <a
                      key={app.name}
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-brand hover:shadow-brand"
                    >
                      {app.badge && (
                        <span className="absolute right-4 top-4 rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-foreground">
                          {app.badge}
                        </span>
                      )}
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-brand-foreground">
                        <app.icon className="h-5 w-5" />
                      </div>
                      <h4 className="mt-5 text-lg font-semibold">{app.name}</h4>
                      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-brand">{app.tagline}</p>
                      <p className="mt-3 flex-1 text-sm text-muted-foreground">{app.desc}</p>
                      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                        <span className="text-xs text-muted-foreground">
                          From <span className="font-semibold text-foreground">{app.startingPrice}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand transition-transform group-hover:translate-x-0.5">
                          Visit site <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="flex justify-center gap-1 text-brand-cyan">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
          </div>
          <blockquote className="mt-6 text-2xl font-medium leading-snug text-foreground sm:text-3xl">
            "{testimonial.quote}"
          </blockquote>
          <figcaption className="mt-6 text-sm">
            <div className="font-semibold">{testimonial.name}</div>
            <div className="text-muted-foreground">{testimonial.role}</div>
          </figcaption>
        </div>
      </section>

      {/* Key features */}
      <section className="py-20">
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
      <section className="bg-surface py-20">
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
      <section className="py-20">
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
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="brand" size="lg"><Link to="/contact">Request a demo</Link></Button>
            <Button asChild variant="outline" size="lg">
              <a href="https://os.zanscode.com" target="_blank" rel="noopener noreferrer">
                Try Zanscode OS <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
