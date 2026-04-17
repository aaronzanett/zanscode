import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, MapPin, Briefcase, Clock, Heart, Rocket, GraduationCap,
  Globe2, Coffee, Laptop, Users, Sparkles, Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";


export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — Join Zanscode" },
      { name: "description", content: "Build the future of business technology with Zanscode. Explore open roles in engineering, design, product and operations." },
      { property: "og:title", content: "Careers — Join Zanscode" },
      { property: "og:description", content: "Open roles in engineering, design, product and operations at Zanscode." },
    ],
  }),
  component: CareersPage,
});

const stats = [
  { v: "60+", l: "Team members" },
  { v: "12", l: "Countries" },
  { v: "4.8/5", l: "Glassdoor rating" },
  { v: "92%", l: "Retention rate" },
];

const values = [
  { icon: Rocket, t: "Ship and learn", d: "We move quickly, measure honestly, and improve every iteration." },
  { icon: Heart, t: "People first", d: "We invest in each other — careers, wellbeing, and life outside of work." },
  { icon: Sparkles, t: "Defined by excellence", d: "We hold a high bar — for craft, for impact, and for how we treat each other." },
  { icon: Globe2, t: "Built for the world", d: "We're a global team building products used across continents." },
];

const benefits = [
  { icon: Laptop, t: "Remote-friendly", d: "Work from our hubs in Jakarta, Singapore or fully remote." },
  { icon: Coffee, t: "Flexible hours", d: "Async-first culture. Own your schedule and outcomes." },
  { icon: GraduationCap, t: "Learning budget", d: "$1,500/year for courses, books, and conferences." },
  { icon: Heart, t: "Health coverage", d: "Comprehensive medical, dental and mental health support." },
  { icon: Users, t: "Equity for all", d: "Every full-time hire gets meaningful equity in the company." },
  { icon: Clock, t: "Generous time off", d: "20 days PTO + local holidays + a paid week off in December." },
];

type Job = {
  title: string;
  team: "Engineering" | "Design" | "Product" | "Operations" | "Sales";
  location: string;
  type: "Full-time" | "Contract" | "Internship";
  level: string;
};

const jobs: Job[] = [
  { title: "Senior Full-Stack Engineer", team: "Engineering", location: "Remote / Jakarta", type: "Full-time", level: "Senior" },
  { title: "Mobile Engineer (React Native)", team: "Engineering", location: "Remote / Jakarta", type: "Full-time", level: "Mid" },
  { title: "Platform / DevOps Engineer", team: "Engineering", location: "Remote", type: "Full-time", level: "Senior" },
  { title: "Engineering Intern", team: "Engineering", location: "Jakarta", type: "Internship", level: "Junior" },
  { title: "Product Designer", team: "Design", location: "Remote / Singapore", type: "Full-time", level: "Mid" },
  { title: "Brand & Marketing Designer", team: "Design", location: "Remote", type: "Full-time", level: "Mid" },
  { title: "Senior Product Manager — SaaS", team: "Product", location: "Remote / Jakarta", type: "Full-time", level: "Senior" },
  { title: "Customer Success Manager", team: "Operations", location: "Jakarta", type: "Full-time", level: "Mid" },
  { title: "Implementation Consultant", team: "Operations", location: "Remote (APAC)", type: "Contract", level: "Mid" },
  { title: "Enterprise Account Executive", team: "Sales", location: "Singapore", type: "Full-time", level: "Senior" },
];

const teams = ["All", "Engineering", "Design", "Product", "Operations", "Sales"] as const;

const process = [
  { n: "01", t: "Apply", d: "Send your CV — a short note about why Zanscode goes a long way." },
  { n: "02", t: "Intro chat", d: "30 minutes with our talent team to align on the role and your goals." },
  { n: "03", t: "Craft interview", d: "1–2 conversations with the hiring team focused on your discipline." },
  { n: "04", t: "Final & offer", d: "Meet a founder, then a clear written offer within a week." },
];

const faqs = [
  { q: "Do you sponsor relocation or work permits?", a: "Yes — for select senior roles in Jakarta and Singapore. We handle the visa process and provide a relocation allowance." },
  { q: "Can I work fully remote?", a: "Most engineering, design and product roles are remote-friendly within APAC, EU and Americas time zones (with 4-hour daily overlap with the team)." },
  { q: "I don't see a role that fits — can I still apply?", a: "Absolutely. Send a note to careers@zanscode.com telling us how you'd add value, and we'll keep you in mind as new roles open." },
  { q: "What's the interview process like?", a: "Practical and respectful — typically 3 conversations over 2 weeks. We share questions in advance and give feedback at every stage." },
  { q: "Do you hire interns and new graduates?", a: "Yes. We run a structured 6-month internship program twice a year with a clear path to full-time conversion." },
];

function CareersPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero py-24 text-white">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-brand-cyan/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-96 w-96 rounded-full bg-brand/40 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> We're hiring
          </span>
          <h1 className="mt-5 text-4xl font-bold sm:text-5xl lg:text-6xl">Build technology that moves businesses forward.</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/80">
            Join a global team shipping products used by thousands of teams every day. Curious people, real ownership, work that matters.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="xl" variant="brand">
              <a href="#open-roles">View open roles <ArrowRight className="ml-1 h-4 w-4" /></a>
            </Button>
            <Button asChild size="xl" variant="hero">
              <a href="mailto:careers@zanscode.com">Email us</a>
            </Button>
          </div>
          <dl className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.l}>
                <dt className="text-3xl font-bold">{s.v}</dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-white/60">{s.l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Values */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">How we work</span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Our values</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.t} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-brand-foreground">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{v.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Benefits</span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Taking care of our team</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div key={b.t} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-brand">
                  <b.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{b.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section id="open-roles" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Open roles</span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Find your next role</h2>
            <p className="mt-3 text-muted-foreground">{jobs.length} positions across our teams — fully remote and on-site.</p>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {teams.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground"
              >
                {t}
                {t !== "All" && (
                  <span className="ml-2 text-xs text-brand">
                    {jobs.filter((j) => j.team === t).length}
                  </span>
                )}
              </span>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-4xl divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            {jobs.map((job) => (
              <a
                key={job.title}
                href={`mailto:careers@zanscode.com?subject=Application: ${encodeURIComponent(job.title)}`}
                className="group flex flex-col gap-3 p-5 transition-colors hover:bg-secondary/50 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold group-hover:text-brand">{job.title}</h3>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand">
                      {job.team}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                    <span className="inline-flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {job.type}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {job.level}</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand transition-transform group-hover:translate-x-0.5">
                  Apply <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </a>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't see the right fit?{" "}
            <a href="mailto:careers@zanscode.com" className="font-semibold text-brand hover:underline">
              Send us an open application
            </a>
            .
          </p>
        </div>
      </section>

      {/* Hiring process */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Hiring process</span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">From hello to offer in 2 weeks</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p) => (
              <div key={p.n} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <span className="text-2xl font-bold text-gradient-brand">{p.n}</span>
                <h3 className="mt-3 text-lg font-semibold">{p.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ items={faqs} subtitle="Everything you need to know before applying." />

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to build with us?</h2>
          <p className="mt-3 text-muted-foreground">We can't wait to hear from you.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="brand">
              <a href="#open-roles">See open roles</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="mailto:careers@zanscode.com">
                <Mail className="mr-1 h-4 w-4" /> careers@zanscode.com
              </a>
            </Button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            <Link to="/about" className="hover:text-foreground">Learn more about Zanscode →</Link>
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
