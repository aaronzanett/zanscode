import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, Boxes, LineChart, ShieldCheck, Sparkles, Zap, Building2, ShoppingBag, Truck, Stethoscope, GraduationCap, Landmark, Quote, Clock, TrendingUp, Users2, Workflow, CheckCircle2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { isAppSubdomain } from "@/lib/host";
import { isSignedIn } from "@/lib/auth";

import heroBg from "@/assets/hero-bg.jpg";
import productSaas from "@/assets/product-saas.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zanscode — Technology Solutions for Modern Business" },
      { name: "description", content: "Zanscode builds web, mobile, desktop and SaaS solutions that power well-organized, scalable business systems." },
      { property: "og:title", content: "Zanscode — Technology Solutions for Modern Business" },
      { property: "og:description", content: "Web, mobile, desktop and SaaS solutions for organized, scalable businesses." },
    ],
  }),
  component: HomePage,
});

const outcomes = [
  { icon: Clock, title: "Save hours every week", desc: "Automate quoting, invoicing, scheduling and reporting your team does by hand today." },
  { icon: TrendingUp, title: "Grow revenue with clarity", desc: "See what's working in real time — by outlet, product, customer or salesperson." },
  { icon: Workflow, title: "One system, not ten tabs", desc: "Replace spreadsheets and disconnected tools with a single source of truth." },
  { icon: Users2, title: "Empower your team", desc: "Give managers and staff the same accurate data, on web and mobile." },
  { icon: ShieldCheck, title: "Enterprise-grade security", desc: "RBAC, audit logs, SSO and compliance baked into every product." },
  { icon: LineChart, title: "Decisions backed by data", desc: "Live dashboards turn daily operations into your monthly board report." },
];

const stats = [
  { v: "8,500+", l: "Active business users" },
  { v: "11", l: "Industries served" },
  { v: "30+", l: "Countries live" },
  { v: "99.98%", l: "Platform uptime" },
];

const industries = [
  { icon: ShoppingBag, name: "Retail & F&B" },
  { icon: Truck, name: "Logistics" },
  { icon: Building2, name: "Real Estate" },
  { icon: Stethoscope, name: "Healthcare" },
  { icon: GraduationCap, name: "Education" },
  { icon: Landmark, name: "Finance" },
];

const journey = [
  { n: "01", t: "Pick your product", d: "Choose a Zanscode SaaS that fits your industry — or the full Zanscode OS suite." },
  { n: "02", t: "Onboard in days", d: "Our team migrates your data, configures roles and trains your staff." },
  { n: "03", t: "Run & optimize", d: "Operate daily on one platform, with continuous updates and dedicated support." },
];

const testimonials = [
  { quote: "Zanscode replaced four disconnected tools with one system. Our ops team finally trusts the data.", name: "Anita Wijaya", role: "COO, RetailCo (12 outlets)" },
  { quote: "We cut monthly closing from 9 days to 2. The dashboards are now my morning coffee.", name: "Marcus Lee", role: "CEO, FleetIQ (mid-sized logistics)" },
  { quote: "A true partner — they understand mid-sized businesses, not just enterprises or startups.", name: "Sari Pratama", role: "Owner, EduNext Group" },
];

function HomePage() {
  const navigate = useNavigate();

  // Host-aware: on app.* subdomain, the root path goes straight into the staff app.
  useEffect(() => {
    if (isAppSubdomain()) {
      navigate({ to: isSignedIn() ? "/app" : "/staff/login" });
    }
  }, [navigate]);

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        </div>
        <div className="pointer-events-none absolute -top-32 right-[-10%] h-96 w-96 rounded-full bg-brand-cyan/20 blur-3xl animate-blob-drift" aria-hidden />
        <div className="pointer-events-none absolute -bottom-32 left-[-10%] h-96 w-96 rounded-full bg-white/10 blur-3xl animate-blob-drift" style={{ animationDelay: "-7s" }} aria-hidden />

        <div className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8 lg:py-36">
          <div className="max-w-3xl">
            <Reveal variant="fade">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" /> SaaS built for business owners
              </span>
            </Reveal>
            <Reveal variant="up" delay={200}>
              <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                Run your business on software that <span className="text-shine">actually fits</span>.
              </h1>
            </Reveal>
            <Reveal variant="up" delay={400}>
              <p className="mt-6 max-w-2xl text-lg text-white/80">
                Zanscode is a SaaS company helping business owners and mid-sized companies replace spreadsheets, disconnected tools and manual work with one modern platform — built for the way your industry actually operates.
              </p>
            </Reveal>
            <Reveal variant="up" delay={600}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="xl" variant="brand">
                  <Link to="/products">Explore our SaaS <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="xl" variant="hero">
                  <Link to="/contact"><PlayCircle className="mr-1 h-4 w-4" /> Book a demo</Link>
                </Button>
              </div>
            </Reveal>
            <dl className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((s, i) => (
                <Reveal key={s.l} variant="up" delay={750 + i * 140} as="div">
                  <dt className="text-2xl font-bold text-white sm:text-3xl">{s.v}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-wider text-white/60">{s.l}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal variant="up" className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Why business owners choose Zanscode</span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Outcomes you can measure in weeks</h2>
            <p className="mt-4 text-muted-foreground">
              Built for owners and operators of growing companies who need their business to run more like a system and less like a fire drill.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {outcomes.map((f, i) => (
              <Reveal key={f.title} variant="up" delay={i * 140} as="div">
                <div className="lift group h-full rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-brand hover:border-brand/40">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-brand-foreground transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal variant="up" className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Industries</span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Trusted across industries</h2>
            <p className="mt-4 text-muted-foreground">From single-location owners to multi-branch mid-sized companies — Zanscode adapts to how your industry operates.</p>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {industries.map((i, idx) => (
              <Reveal key={i.name} variant="scale" delay={idx * 110} as="div">
                <div className="lift group flex h-full flex-col items-center rounded-2xl border border-border bg-card p-6 text-center hover:shadow-soft hover:border-brand/30">
                  <i.icon className="h-7 w-7 text-brand transition-transform duration-300 group-hover:scale-110" />
                  <span className="mt-3 text-sm font-medium">{i.name}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SaaS suite highlight */}
      <section className="bg-background py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal variant="up">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">The Zanscode SaaS suite</span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">One vendor. Every part of your business.</h2>
            <p className="mt-4 text-muted-foreground">
              Pick a single product to fix one painful workflow, or run your whole company on the connected suite — sales, operations, finance, HR and analytics on one platform.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "25+ industry-ready SaaS products",
                "Single sign-on across every module",
                "Live dashboards out of the box",
                "Open APIs and 100+ integrations",
              ].map((i, idx) => (
                <li
                  key={i}
                  className="flex items-center gap-2 transition-transform duration-300 hover:translate-x-1"
                  style={{ transitionDelay: `${idx * 30}ms` }}
                >
                  <CheckCircle2 className="h-4 w-4 text-brand-cyan" /> {i}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex gap-3">
              <Button asChild variant="brand"><Link to="/products">Browse all products</Link></Button>
              <Button asChild variant="outline"><Link to="/contact">Talk to sales</Link></Button>
            </div>
          </Reveal>
          <Reveal variant="scale" delay={250}>
            <div className="relative">
              <div className="absolute -inset-6 rounded-3xl bg-gradient-brand opacity-20 blur-3xl animate-blob-drift" />
              <img src={productSaas} alt="Zanscode SaaS suite dashboard" loading="lazy" width={1024} height={768} className="relative rounded-2xl border border-border shadow-brand transition-transform duration-500 hover:scale-[1.02]" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* How to get started */}
      <section className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal variant="up" className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Getting started</span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">From sign-up to running your business — in days</h2>
            <p className="mt-4 text-muted-foreground">No long custom builds. Pick the product, onboard with our team, and start running.</p>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {journey.map((p, i) => (
              <Reveal key={p.n} variant="up" delay={i * 180} as="div">
                <div className="lift group h-full rounded-2xl border border-border bg-card p-6 shadow-soft hover:border-brand/40 hover:shadow-brand">
                  <span className="text-2xl font-bold text-gradient-brand">{p.n}</span>
                  <h3 className="mt-3 text-lg font-semibold">{p.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal variant="up" className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Customer stories</span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Loved by owners and operators</h2>
          </Reveal>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} variant="up" delay={i * 200} as="div">
                <figure className="lift flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft hover:border-brand/40 hover:shadow-brand">
                  <Quote className="h-6 w-6 text-brand" />
                  <blockquote className="mt-4 flex-1 text-sm text-foreground">"{t.quote}"</blockquote>
                  <figcaption className="mt-6 text-sm">
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-muted-foreground">{t.role}</div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      {/* CTA */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal variant="up">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Ready to organize your business with technology?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Tell us about your operation — we'll propose the fastest path from chaos to clarity.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="xl" variant="brand">
                <Link to="/contact">Start a project <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link to="/services">Explore services</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
