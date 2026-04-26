import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, LineChart, ShieldCheck, Sparkles, Building2, ShoppingBag, Truck, Stethoscope, GraduationCap, Landmark, Quote, Workflow, CheckCircle2, PlayCircle, Code2, Smartphone, Cloud, Cpu, Plug, Search, PenTool, Hammer, Rocket, Boxes } from "lucide-react";
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
      { title: "Zanscode — Custom Software & Systems for Modern Business" },
      { name: "description", content: "Zanscode designs and builds custom software, business systems and modern web, mobile and cloud applications for business owners and mid-sized companies." },
      { property: "og:title", content: "Zanscode — Custom Software & Systems for Modern Business" },
      { property: "og:description", content: "Custom software, business systems and modern apps engineered for business owners and mid-sized companies." },
    ],
  }),
  component: HomePage,
});

const capabilities = [
  { icon: Code2, title: "Custom business software", desc: "Tailored systems engineered around how your business actually operates — not the other way around." },
  { icon: Workflow, title: "ERP & operations systems", desc: "Inventory, sales, finance, HR and reporting unified into one source of truth." },
  { icon: Smartphone, title: "Web & mobile applications", desc: "Customer-facing and internal apps for web, iOS and Android — fast, modern, reliable." },
  { icon: Cloud, title: "Cloud & DevOps", desc: "Scalable infrastructure on AWS, GCP and Azure with CI/CD, monitoring and SLAs." },
  { icon: Plug, title: "System integration", desc: "Connect ERP, CRM, accounting, payments and 3rd-party services into one workflow." },
  { icon: ShieldCheck, title: "Security & compliance", desc: "RBAC, audit logs, SSO and hardened infrastructure for enterprise-grade trust." },
];

const stats = [
  { v: "120+", l: "Systems delivered" },
  { v: "45", l: "Enterprise clients" },
  { v: "11", l: "Industries served" },
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

const process = [
  { icon: Search, n: "01", t: "Discover", d: "Workshops to map goals, users, workflows and constraints." },
  { icon: PenTool, n: "02", t: "Design", d: "System architecture, UX and a measurable success plan." },
  { icon: Hammer, n: "03", t: "Build", d: "Iterative delivery with weekly demos and tight feedback." },
  { icon: Rocket, n: "04", t: "Scale", d: "Operate, optimize and evolve the system long-term." },
];

const testimonials = [
  { quote: "Zanscode rebuilt our operations system from scratch. What took 4 tools now runs in one — and our team finally trusts the data.", name: "Anita Wijaya", role: "COO, RetailCo (12 outlets)" },
  { quote: "They shipped our custom logistics platform in 14 weeks. Quality, communication and engineering were outstanding.", name: "Marcus Lee", role: "CEO, FleetIQ" },
  { quote: "A true software partner — they think with us, not just for us. The system keeps getting better quarter after quarter.", name: "Sari Pratama", role: "Owner, EduNext Group" },
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
                <Sparkles className="h-3.5 w-3.5" /> Software & systems engineered for your business
              </span>
            </Reveal>
            <Reveal variant="up" delay={200}>
              <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                We design and build the <span className="text-shine">software your business runs on</span>.
              </h1>
            </Reveal>
            <Reveal variant="up" delay={400}>
              <p className="mt-6 max-w-2xl text-lg text-white/80">
                Zanscode is a software company partnering with business owners and mid-sized companies to design, build and operate custom systems — web, mobile, cloud and ERP — engineered around how your business actually works.
              </p>
            </Reveal>
            <Reveal variant="up" delay={600}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="xl" variant="brand">
                  <Link to="/contact">Start a project <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="xl" variant="hero">
                  <Link to="/services"><PlayCircle className="mr-1 h-4 w-4" /> Explore services</Link>
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

      {/* Capabilities */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal variant="up" className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">What we build</span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Custom software, end to end</h2>
            <p className="mt-4 text-muted-foreground">
              From the system architecture to the last pixel — one engineering partner across every layer of your business stack.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((f, i) => (
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
          <Reveal variant="up" delay={300} className="mt-10 text-center">
            <Button asChild variant="outline"><Link to="/services">See all services <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          </Reveal>
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
              Ready to run your business on Zanscode?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Tell us about your business — we'll show you exactly which Zanscode product fits and how fast you can be live.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="xl" variant="brand">
                <Link to="/contact">Book a demo <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link to="/products">See all products</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
