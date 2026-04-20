import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, Boxes, Cpu, Globe2, LineChart, ShieldCheck, Smartphone, Sparkles, Zap, Building2, ShoppingBag, Truck, Stethoscope, GraduationCap, Landmark, Search, PenTool, Hammer, Rocket, Star, Quote } from "lucide-react";
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

const features = [
  { icon: Globe2, title: "Web Platforms", desc: "High-performance websites and web apps engineered for scale." },
  { icon: Smartphone, title: "Mobile Apps", desc: "Native and cross-platform Android & iOS experiences." },
  { icon: Cpu, title: "Desktop Software", desc: "Robust desktop tools tailored to operations teams." },
  { icon: Boxes, title: "SaaS Products", desc: "Multi-tenant cloud products with billing & analytics ready." },
  { icon: ShieldCheck, title: "Enterprise Security", desc: "Hardened infrastructure, RBAC, audits, and compliance." },
  { icon: LineChart, title: "Business Intelligence", desc: "Real-time dashboards turning data into decisions." },
];

const stats = [
  { v: "120+", l: "Projects shipped" },
  { v: "45", l: "Enterprise clients" },
  { v: "99.98%", l: "Platform uptime" },
  { v: "24/7", l: "Dedicated support" },
];

const industries = [
  { icon: ShoppingBag, name: "Retail & F&B" },
  { icon: Truck, name: "Logistics" },
  { icon: Building2, name: "Real Estate" },
  { icon: Stethoscope, name: "Healthcare" },
  { icon: GraduationCap, name: "Education" },
  { icon: Landmark, name: "Finance" },
];

const process = [
  { icon: Search, n: "01", t: "Discover", d: "Workshops to map goals, users and constraints." },
  { icon: PenTool, n: "02", t: "Design", d: "Architecture, UX and a measurable success plan." },
  { icon: Hammer, n: "03", t: "Build", d: "Iterative delivery with weekly demos." },
  { icon: Rocket, n: "04", t: "Scale", d: "Operate, optimize and grow long-term." },
];

const testimonials = [
  { quote: "Zanscode replaced four disconnected tools with one system. Our ops team finally trusts the data.", name: "Anita Wijaya", role: "COO, RetailCo" },
  { quote: "Shipped our flagship mobile app in 14 weeks. Quality and communication were outstanding.", name: "Marcus Lee", role: "Founder, FleetIQ" },
  { quote: "A true partner — they think with us, not just for us. The roadmap kept getting better.", name: "Sari Pratama", role: "VP Product, EduNext" },
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
                <Sparkles className="h-3.5 w-3.5" /> Technology partner for ambitious teams
              </span>
            </Reveal>
            <Reveal variant="up" delay={200}>
              <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                Build a business system that <span className="text-shine">runs itself</span>.
              </h1>
            </Reveal>
            <Reveal variant="up" delay={400}>
              <p className="mt-6 max-w-2xl text-lg text-white/80">
                Zanscode designs and ships modern technology — websites, mobile, desktop and SaaS —
                so your operations are organized, automated, and ready to scale.
              </p>
            </Reveal>
            <Reveal variant="up" delay={600}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="xl" variant="brand">
                  <Link to="/contact">Start a project <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="xl" variant="hero">
                  <Link to="/products">Explore products</Link>
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

      {/* Features / What we do */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal variant="up" className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">What we do</span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Everything to run a modern operation</h2>
            <p className="mt-4 text-muted-foreground">
              One partner across every layer of your stack — from customer-facing apps to back-office tooling.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
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
            <p className="mt-4 text-muted-foreground">From storefronts to enterprises — we adapt to how your industry works.</p>
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

      {/* SaaS Highlight */}
      <section className="bg-background py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal variant="up">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Flagship SaaS</span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Zanscode OS — your business, organized.</h2>
            <p className="mt-4 text-muted-foreground">
              An all-in-one operating platform for modern teams: CRM, projects, finance, HR and analytics —
              connected by a single source of truth.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {["Unified workspace across departments", "Real-time KPI dashboards", "Automations & workflows", "Open API & integrations"].map((i, idx) => (
                <li
                  key={i}
                  className="flex items-center gap-2 transition-transform duration-300 hover:translate-x-1"
                  style={{ transitionDelay: `${idx * 30}ms` }}
                >
                  <Zap className="h-4 w-4 text-brand-cyan" /> {i}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex gap-3">
              <Button asChild variant="brand"><Link to="/products">View SaaS lineup</Link></Button>
              <Button asChild variant="outline"><Link to="/app">Try internal demo</Link></Button>
            </div>
          </Reveal>
          <Reveal variant="scale" delay={250}>
            <div className="relative">
              <div className="absolute -inset-6 rounded-3xl bg-gradient-brand opacity-20 blur-3xl animate-blob-drift" />
              <img src={productSaas} alt="Zanscode OS dashboard" loading="lazy" width={1024} height={768} className="relative rounded-2xl border border-border shadow-brand transition-transform duration-500 hover:scale-[1.02]" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal variant="up" className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">How we work</span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">A clear path from idea to scale</h2>
            <p className="mt-4 text-muted-foreground">A proven four-step process that keeps everyone aligned and moving.</p>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <Reveal key={p.n} variant="up" delay={i * 180} as="div">
                <div className="lift group h-full rounded-2xl border border-border bg-card p-6 shadow-soft hover:border-brand/40 hover:shadow-brand">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-brand-foreground transition-transform duration-300 group-hover:scale-110">
                      <p.icon className="h-5 w-5" />
                    </div>
                    <span className="text-2xl font-bold text-gradient-brand">{p.n}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{p.t}</h3>
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
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Testimonials</span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">What partners say</h2>
          </Reveal>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} variant="up" delay={i * 200} as="div">
                <figure className="lift flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft hover:border-brand/40 hover:shadow-brand">
                  <Quote className="h-6 w-6 text-brand" />
                  <blockquote className="mt-4 flex-1 text-sm text-foreground">"{t.quote}"</blockquote>
                  <div className="mt-6 flex items-center gap-1 text-brand-cyan">
                    {Array.from({ length: 5 }).map((_, idx) => <Star key={idx} className="h-4 w-4 fill-current" />)}
                  </div>
                  <figcaption className="mt-3 text-sm">
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
