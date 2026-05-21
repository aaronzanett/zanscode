import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, Users, Heart, ArrowRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { ClosingCTA } from "@/components/site/ClosingCTA";

import aboutTeam from "@/assets/about-team.jpg";

export const Route = createFileRoute("/_site/about")({
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

function AboutPage() {
  return (
    <>
      {/* Hero — solid ink, portrait split with framed team image */}
      <section className="relative overflow-hidden bg-ink py-24 text-background lg:py-28">
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-10">
          <div className="lg:col-span-7">
            <Reveal variant="fade">
              <span className="inline-flex items-center gap-2 rounded-full border border-background/20 bg-background/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-cyan">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan" aria-hidden />
                About Zanscode
              </span>
            </Reveal>
            <Reveal variant="up" delay={180}>
              <h1 className="mt-5 font-display text-[clamp(2.5rem,5.5vw,4.75rem)] font-medium leading-[1] tracking-tight">
                A technology partner for businesses that <em className="serif-italic text-brand-cyan">mean it.</em>
              </h1>
            </Reveal>
            <Reveal variant="up" delay={360}>
              <p className="mt-6 max-w-xl text-lg text-background/75">
                Zanscode is a startup on a mission to help organizations operate at their best — combining well-organized business systems with the latest technology across web, mobile, desktop and cloud.
              </p>
            </Reveal>
            <Reveal variant="up" delay={520}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="brand" size="lg"><Link to="/contact">Work with us</Link></Button>
                <Button asChild variant="hero" size="lg"><Link to="/careers">Join the team</Link></Button>
              </div>
            </Reveal>
          </div>
          <Reveal variant="scale" delay={250} className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl border border-background/15" aria-hidden />
              <img src={aboutTeam} alt="The Zanscode team" loading="lazy" width={1280} height={1280} className="relative aspect-square w-full rounded-2xl object-cover ring-1 ring-background/15 transition-transform duration-700 hover:scale-[1.02]" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal variant="up" className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Our values</span>
            <h2 className="mt-3 text-3xl font-bold">What we believe</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.t} variant="up" delay={i * 160} as="div">
                <div className="lift group h-full rounded-2xl border border-border bg-card p-6 shadow-soft hover:border-brand/40 hover:shadow-brand">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-brand-foreground transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Heart className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{v.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline / Story */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal variant="up" className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Our story</span>
            <h2 className="mt-3 text-3xl font-bold">From a small idea to a growing platform</h2>
          </Reveal>
          <ol className="relative mx-auto mt-14 max-w-3xl space-y-8 border-l border-border pl-8">
            {timeline.map((item, i) => (
              <Reveal key={item.t} variant="up" delay={i * 180} as="li" className="relative">
                <span className="absolute -left-[37px] flex h-6 w-6 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-brand-foreground">●</span>
                <div className="text-xs font-semibold uppercase tracking-wider text-brand">{item.year}</div>
                <h3 className="mt-1 text-lg font-semibold">{item.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.d}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 text-center sm:grid-cols-3 sm:px-6 lg:px-8">
          {[{v: "2023", l: "Founded"}, {v: "30+", l: "Specialists"}, {v: "12", l: "Countries served"}].map((s, i) => (
            <Reveal key={s.l} variant="up" delay={i * 180} as="div">
              <div className="text-4xl font-bold text-gradient-brand">{s.v}</div>
              <div className="mt-2 text-sm uppercase tracking-wider text-muted-foreground">{s.l}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Leadership */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal variant="up" className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Leadership</span>
            <h2 className="mt-3 text-3xl font-bold">The people behind Zanscode</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {leaders.map((l, i) => (
              <Reveal key={l.name} variant="up" delay={i * 180} as="div">
                <div className="lift h-full rounded-2xl border border-border bg-card p-6 text-center shadow-soft hover:border-brand/40 hover:shadow-brand">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-brand text-brand-foreground">
                    <Users className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{l.name}</h3>
                  <div className="text-sm text-brand">{l.role}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{l.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal variant="up" className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Partners</span>
            <h2 className="mt-3 text-3xl font-bold">Trusted technology partners</h2>
          </Reveal>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {partners.map((p, i) => (
              <Reveal key={p} variant="scale" delay={i * 100} as="span" className="rounded-xl border border-border bg-card px-6 py-3 text-base font-semibold text-muted-foreground shadow-soft">
                {p}
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <ClosingCTA
        title={<>Build the future <em className="serif-italic text-brand-cyan">with us.</em></>}
        description="We're growing across engineering, design and product. If you care about craft and impact, we'd love to talk."
        primary={{ label: "Join the team", to: "/careers", icon: "arrow-up-right" }}
        secondary={{ label: "Partner with us", to: "/contact", icon: "arrow-right" }}
      />
    </>
  );
}
