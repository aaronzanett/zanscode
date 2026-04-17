import { createFileRoute, Link } from "@tanstack/react-router";
import { Code2, Layout, Cloud, Wrench, Users, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";

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

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="mt-12">
            <Button asChild variant="brand" size="lg"><Link to="/contact">Discuss your project</Link></Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
