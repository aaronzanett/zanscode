import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, Users, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { FAQ } from "@/components/site/FAQ";
import aboutTeam from "@/assets/about-team.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Zanscode" },
      { name: "description", content: "Zanscode is a technology startup helping businesses build well-organized systems." },
      { property: "og:title", content: "About Zanscode" },
      { property: "og:description", content: "Our mission, values and the team behind Zanscode." },
      { property: "og:image", content: aboutTeam },
    ],
  }),
  component: AboutPage,
});

const values = [
  { t: "Outcomes over output", d: "We measure ourselves by the results we deliver, not the hours we log." },
  { t: "Engineering excellence", d: "Modern stacks, clean code, automated tests — quality is non-negotiable." },
  { t: "Long-term partnership", d: "We stay with you well past launch, so technology keeps compounding value." },
];

const timeline = [
  { year: "2023", t: "Founded", d: "Zanscode is born with a mission to help businesses run on better systems." },
  { year: "2024", t: "First enterprise wins", d: "Shipped flagship platforms for retail, logistics and education clients." },
  { year: "2024", t: "Zanscode OS launches", d: "Our SaaS platform goes live with CRM, Projects, Finance and BI modules." },
  { year: "2025", t: "Global expansion", d: "Serving customers across 12 countries with a fully distributed team." },
];

const leaders = [
  { name: "Reza Anugrah", role: "Founder & CEO", bio: "15+ years building enterprise systems across fintech and retail." },
  { name: "Mei Lin Tan", role: "Co-founder & CTO", bio: "Cloud architect, ex-AWS. Obsessed with reliable distributed systems." },
  { name: "Joshua Bennett", role: "Head of Design", bio: "Brings clarity to complex products. Previously at top design studios." },
];

const partners = ["AWS", "Google Cloud", "Microsoft", "Stripe", "Cloudflare", "MongoDB"];

const faqs = [
  { q: "Where are you based?", a: "Headquartered in Jakarta, Indonesia, with team members across Southeast Asia and remote contributors globally." },
  { q: "How big is the team?", a: "30+ specialists across engineering, design, product and operations." },
  { q: "Are you hiring?", a: "Yes — we're always interested in talented engineers, designers and product people. Reach out via Contact." },
];

function AboutPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-gradient-soft py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">About</span>
            <h1 className="mt-3 text-4xl font-bold sm:text-5xl">A technology partner for businesses that mean it.</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Zanscode is a startup on a mission to help organizations operate at their best by combining
              well-organized business systems with the latest technology — across web, mobile, desktop and cloud.
            </p>
          </div>
          <img src={aboutTeam} alt="The Zanscode team" loading="lazy" width={1280} height={800} className="rounded-2xl border border-border shadow-brand" />
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Our values</span>
            <h2 className="mt-3 text-3xl font-bold">What we believe</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <div key={v.t} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-brand-foreground">
                  <Heart className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{v.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline / Story */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Our story</span>
            <h2 className="mt-3 text-3xl font-bold">From a small idea to a growing platform</h2>
          </div>
          <ol className="relative mx-auto mt-14 max-w-3xl space-y-8 border-l border-border pl-8">
            {timeline.map((item) => (
              <li key={item.t} className="relative">
                <span className="absolute -left-[37px] flex h-6 w-6 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-brand-foreground">●</span>
                <div className="text-xs font-semibold uppercase tracking-wider text-brand">{item.year}</div>
                <h3 className="mt-1 text-lg font-semibold">{item.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 text-center sm:grid-cols-3 sm:px-6 lg:px-8">
          {[{v: "2023", l: "Founded"}, {v: "30+", l: "Specialists"}, {v: "12", l: "Countries served"}].map((s) => (
            <div key={s.l}>
              <div className="text-4xl font-bold text-gradient-brand">{s.v}</div>
              <div className="mt-2 text-sm uppercase tracking-wider text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Leadership</span>
            <h2 className="mt-3 text-3xl font-bold">The people behind Zanscode</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {leaders.map((l) => (
              <div key={l.name} className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-brand text-brand-foreground">
                  <Users className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{l.name}</h3>
                <div className="text-sm text-brand">{l.role}</div>
                <p className="mt-2 text-sm text-muted-foreground">{l.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Partners</span>
            <h2 className="mt-3 text-3xl font-bold">Trusted technology partners</h2>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {partners.map((p) => (
              <span key={p} className="rounded-xl border border-border bg-card px-6 py-3 text-base font-semibold text-muted-foreground shadow-soft">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ items={faqs} />

      {/* Careers CTA */}
      <section className="bg-gradient-hero py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Briefcase className="mx-auto h-10 w-10 text-brand-cyan" />
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Build the future with us</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            We're growing across engineering, design and product. If you care about craft and impact, we'd love to talk.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="brand">
              <Link to="/contact">Join the team <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="hero">
              <Link to="/contact">Partner with us</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
