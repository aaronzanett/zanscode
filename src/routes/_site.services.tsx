import { createFileRoute, Link } from "@tanstack/react-router";
import { Code2, Layout, Cloud, Wrench, Users, Headphones, ShoppingBag, Truck, Stethoscope, GraduationCap, Landmark, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { ClosingCTA } from "@/components/site/ClosingCTA";


export const Route = createFileRoute("/_site/services")({
  head: () => ({
    meta: [
      { title: "Services — Zanscode" },
      { name: "description", content: "Custom software, product design, cloud, and support services from Zanscode." },
      { property: "og:title", content: "Services — Zanscode" },
      { property: "og:description", content: "Custom software, design, cloud and managed services." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  { icon: Code2, title: "Custom Software", desc: "Web, mobile and desktop applications tailored to your operations." },
  { icon: Layout, title: "Product Design", desc: "User research, UX and UI design that ships measurable outcomes." },
  { icon: Cloud, title: "Cloud & DevOps", desc: "Scalable infrastructure on AWS, GCP and Azure with CI/CD pipelines." },
  { icon: Wrench, title: "System Integration", desc: "Connect your ERP, CRM, payment and 3rd-party services seamlessly." },
  { icon: Users, title: "Dedicated Teams", desc: "Embedded engineers, designers and PMs that scale with you." },
  { icon: Headphones, title: "Managed Support", desc: "24/7 monitoring, maintenance and SLA-backed support." },
];

const process = [
  { n: "01", t: "Discover", d: "Workshops to align goals, users, and constraints." },
  { n: "02", t: "Design", d: "Architecture, UX and a measurable success plan." },
  { n: "03", t: "Build", d: "Iterative delivery with weekly demos and metrics." },
  { n: "04", t: "Scale", d: "Operate, optimize and grow with you long-term." },
];

const stack = {
  Frontend: ["React", "Next.js", "TypeScript", "Tailwind", "React Native", "Flutter"],
  Backend: ["Node.js", "NestJS", "Python", "Go", ".NET", "GraphQL"],
  Data: ["PostgreSQL", "MongoDB", "Redis", "BigQuery", "Kafka", "Elastic"],
  Cloud: ["AWS", "Google Cloud", "Azure", "Cloudflare", "Docker", "Kubernetes"],
};

const engagements = [
  { t: "Project-based", d: "Fixed scope and timeline. Best for well-defined deliverables and MVPs.", best: "Best for: MVPs, redesigns, integrations" },
  { t: "Dedicated team", d: "An embedded squad working as your in-house engineering arm.", best: "Best for: long-running products" },
  { t: "Staff augmentation", d: "Senior specialists plug into your existing team to fill skill gaps.", best: "Best for: scaling capacity fast" },
];

const industries = [
  { icon: ShoppingBag, name: "Retail & F&B" },
  { icon: Truck, name: "Logistics" },
  { icon: Building2, name: "Real Estate" },
  { icon: Stethoscope, name: "Healthcare" },
  { icon: GraduationCap, name: "Education" },
  { icon: Landmark, name: "Finance" },
];

function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-aurora py-24 lg:py-28">
        <div className="pointer-events-none absolute -top-32 right-[-10%] h-96 w-96 rounded-full bg-brand-cyan/15 blur-3xl animate-blob-drift" aria-hidden />
        <div className="pointer-events-none absolute -bottom-32 left-[-10%] h-96 w-96 rounded-full bg-brand/10 blur-3xl animate-blob-drift" style={{ animationDelay: "-11s" }} aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <Reveal variant="fade">
            <p className="kicker">Services</p>
          </Reveal>
          <Reveal variant="up" delay={180}>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,5.5vw,4.5rem)] font-medium leading-[1] tracking-tight">
              From idea to launch — <em className="serif-italic text-brand">and beyond.</em>
            </h1>
          </Reveal>
          <Reveal variant="up" delay={360}>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              We partner with companies to build, ship and operate technology that delivers real business value — across web, mobile, desktop and cloud.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal variant="up" className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Capabilities</span>
            <h2 className="mt-3 text-3xl font-bold">What we deliver</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.title} variant="up" delay={i * 140} as="div">
                <div className="lift group h-full rounded-2xl border border-border bg-card p-6 hover:border-brand/40 hover:shadow-brand">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-brand-foreground transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal variant="up">
            <h2 className="text-3xl font-bold">How we work</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <Reveal key={p.n} variant="up" delay={i * 180} as="div">
                <div className="lift h-full rounded-2xl border border-border bg-card p-6 hover:border-brand/40 hover:shadow-soft">
                  <div className="text-3xl font-bold text-gradient-brand">{p.n}</div>
                  <h3 className="mt-2 text-lg font-semibold">{p.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement models */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal variant="up" className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Engagement models</span>
            <h2 className="mt-3 text-3xl font-bold">Work with us your way</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {engagements.map((e, i) => (
              <Reveal key={e.t} variant="up" delay={i * 180} as="div">
                <div className="lift flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft hover:border-brand/40 hover:shadow-brand">
                  <h3 className="text-lg font-semibold">{e.t}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{e.d}</p>
                  <div className="mt-4 rounded-lg bg-secondary px-3 py-2 text-xs font-medium text-foreground">{e.best}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal variant="up" className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Tech stack</span>
            <h2 className="mt-3 text-3xl font-bold">Modern, proven technologies</h2>
            <p className="mt-3 text-muted-foreground">We pick the right tools for your problem — not the trend of the week.</p>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(stack).map(([cat, items], i) => (
              <Reveal key={cat} variant="up" delay={i * 140} as="div">
                <div className="lift h-full rounded-2xl border border-border bg-card p-6 hover:border-brand/40 hover:shadow-soft">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-brand">{cat}</h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {items.map((it) => (
                      <li key={it} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{it}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal variant="up" className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Industries</span>
            <h2 className="mt-3 text-3xl font-bold">Domains we know well</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {industries.map((i, idx) => (
              <Reveal key={i.name} variant="scale" delay={idx * 100} as="div">
                <div className="lift group flex h-full flex-col items-center rounded-2xl border border-border bg-card p-6 text-center hover:border-brand/30 hover:shadow-soft">
                  <i.icon className="h-7 w-7 text-brand transition-transform duration-500 group-hover:scale-110" />
                  <span className="mt-3 text-sm font-medium">{i.name}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <ClosingCTA
        title={<>Have a project <em className="serif-italic text-brand-cyan">in mind?</em></>}
        description="Tell us what you're building — we'll propose the right team, architecture and timeline to ship it."
        primary={{ label: "Discuss your project", to: "/contact", icon: "arrow-up-right" }}
        secondary={{ label: "Browse products", to: "/products", icon: "arrow-right" }}
      />
    </>
  );
}
