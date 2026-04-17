import { createFileRoute, Link } from "@tanstack/react-router";
import { Code2, Layout, Cloud, Wrench, Users, Headphones, ShoppingBag, Truck, Stethoscope, GraduationCap, Landmark, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { FAQ } from "@/components/site/FAQ";

export const Route = createFileRoute("/services")({
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

const faqs = [
  { q: "How do you price projects?", a: "Project-based engagements are quoted as a fixed fee after a short discovery. Dedicated teams and staff augmentation are billed monthly per role." },
  { q: "Can you work with our existing tech stack?", a: "Yes — we adapt to your stack rather than forcing a rewrite. Most of our engineers are full-stack across modern web, mobile and cloud." },
  { q: "Do you sign NDAs?", a: "Always. We can sign your NDA before the first conversation, or share ours." },
  { q: "What time zones do you cover?", a: "Our delivery teams overlap with Asia, Europe, and the Americas. We schedule live overlap windows that work for your team." },
];

function ServicesPage() {
  return (
    <SiteLayout>
      <section className="bg-gradient-soft py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand">Services</span>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">From idea to launch — and beyond.</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            We partner with companies to build, ship and operate technology that delivers real business value.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Capabilities</span>
            <h2 className="mt-3 text-3xl font-bold">What we deliver</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.title} className="rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-brand">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-brand-foreground">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">How we work</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p) => (
              <div key={p.n} className="rounded-2xl border border-border bg-card p-6">
                <div className="text-3xl font-bold text-gradient-brand">{p.n}</div>
                <h3 className="mt-2 text-lg font-semibold">{p.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement models */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Engagement models</span>
            <h2 className="mt-3 text-3xl font-bold">Work with us your way</h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {engagements.map((e) => (
              <div key={e.t} className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft">
                <h3 className="text-lg font-semibold">{e.t}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{e.d}</p>
                <div className="mt-4 rounded-lg bg-secondary px-3 py-2 text-xs font-medium text-foreground">{e.best}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Tech stack</span>
            <h2 className="mt-3 text-3xl font-bold">Modern, proven technologies</h2>
            <p className="mt-3 text-muted-foreground">We pick the right tools for your problem — not the trend of the week.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(stack).map(([cat, items]) => (
              <div key={cat} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-brand">{cat}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {items.map((i) => (
                    <li key={i} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Industries</span>
            <h2 className="mt-3 text-3xl font-bold">Domains we know well</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {industries.map((i) => (
              <div key={i.name} className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center hover:shadow-soft">
                <i.icon className="h-7 w-7 text-brand" />
                <span className="mt-3 text-sm font-medium">{i.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ items={faqs} />

      {/* CTA */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold sm:text-4xl">Have a project in mind?</h2>
          <p className="mt-3 text-muted-foreground">Tell us what you're building — we'll propose the right team and plan.</p>
          <div className="mt-8">
            <Button asChild variant="brand" size="lg"><Link to="/contact">Discuss your project</Link></Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
