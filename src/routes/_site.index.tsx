import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  ArrowUpRight, ArrowRight, Sparkles, Quote, Check,
  Code2, Database, Smartphone, Boxes, Compass, PenTool, Hammer, Rocket,
  ShoppingBag, Truck, Building2, Stethoscope, GraduationCap, Landmark,
  TrendingUp, Clock, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { isAppSubdomain } from "@/lib/host";
import { isSignedIn } from "@/lib/auth";
import { useStore } from "@/lib/store";

import heroBg from "@/assets/hero-bg.jpg";
import productSaas from "@/assets/product-saas.jpg";

export const Route = createFileRoute("/_site/")({
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

const stats = [
  { v: "120+", l: "Systems delivered" },
  { v: "45", l: "Enterprise clients" },
  { v: "11", l: "Industries served" },
  { v: "99.98%", l: "Platform uptime" },
];

const trusted = [
  "MediFarma Group", "FleetIQ", "EduNext", "RetailCo", "NusaStay",
  "GoodHealth", "Klipper", "Cendekia Academy", "BlueRoute", "VitaCare",
];

const industries = [
  { icon: ShoppingBag, name: "Retail & F&B" },
  { icon: Truck, name: "Logistics" },
  { icon: Building2, name: "Real Estate" },
  { icon: Stethoscope, name: "Healthcare" },
  { icon: GraduationCap, name: "Education" },
  { icon: Landmark, name: "Finance" },
];

const testimonials = [
  { quote: "Zanscode rebuilt our operations from scratch. Four tools became one — and our team finally trusts the data.", name: "Anita Wijaya", role: "COO, RetailCo" },
  { quote: "They shipped our logistics platform in 14 weeks. Quality, communication, engineering — outstanding.", name: "Marcus Lee", role: "CEO, FleetIQ" },
  { quote: "A true software partner — they think with us, not just for us. The system keeps getting better quarter after quarter.", name: "Sari Pratama", role: "Owner, EduNext Group" },
];

type SectionMeta = { eyebrow: string; numbered: boolean; icons: Array<typeof Code2> };

function sectionMeta(id: string, idx: number): SectionMeta {
  if (id === "sec-capabilities") {
    return { eyebrow: "What we build", numbered: false, icons: [Code2, Database, Smartphone, Boxes] };
  }
  if (id === "sec-process") {
    return { eyebrow: "How we work", numbered: true, icons: [Compass, PenTool, Hammer, Rocket] };
  }
  return { eyebrow: idx === 0 ? "Highlights" : "More from Zanscode", numbered: false, icons: [Check, Sparkles, Boxes, Code2] };
}

function HomePage() {
  const navigate = useNavigate();
  const hero = useStore((s) => s.siteContent.hero);
  const sections = useStore((s) => s.siteContent.sections);

  useEffect(() => {
    if (isAppSubdomain()) {
      navigate({ to: isSignedIn() ? "/app" : "/staff/login" });
    }
  }, [navigate]);

  return (
    <>
      {/* HERO — editorial, with floating stat cards */}
      <section className="relative overflow-hidden bg-cream pt-12 pb-24 sm:pt-16 lg:pt-24 lg:pb-32 paper-grain">
        <div className="pointer-events-none absolute -top-32 right-[-10%] h-[28rem] w-[28rem] rounded-full bg-brand-cyan/20 blur-3xl animate-blob-drift" aria-hidden />
        <div className="pointer-events-none absolute -bottom-32 left-[-10%] h-[28rem] w-[28rem] rounded-full bg-brand/10 blur-3xl animate-blob-drift" style={{ animationDelay: "-9s" }} aria-hidden />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7 lg:pt-6">
              <Reveal variant="fade">
                  <span className="inline-flex items-center gap-2.5 rounded-full border border-border bg-background/70 py-1.5 pl-2.5 pr-4 text-xs font-medium text-foreground backdrop-blur">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-cyan opacity-70" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-cyan" />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand">Live</span>
                    <span className="h-3 w-px bg-border" aria-hidden />
                    <span>{hero.eyebrow}</span>
                  </span>
              </Reveal>

              <Reveal variant="up" delay={150}>
                <h1 className="mt-8 font-display text-[clamp(2.75rem,6vw,5.25rem)] font-medium leading-[0.98] tracking-tight text-foreground">
                  {hero.title.split(" ").slice(0, -2).join(" ")}{" "}
                  <em className="serif-italic text-gradient-brand">
                    {hero.title.split(" ").slice(-2).join(" ")}
                  </em>
                </h1>
              </Reveal>

              <Reveal variant="up" delay={300}>
                <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">
                  {hero.subtitle}
                </p>
              </Reveal>

              <Reveal variant="up" delay={450}>
                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <Button asChild size="xl" variant="brand" className="group">
                    <Link to={hero.primaryCtaTo as string}>
                      {hero.primaryCta}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </Button>
                  <Button asChild size="xl" variant="outline">
                    <Link to={hero.secondaryCtaTo as string}>{hero.secondaryCta}</Link>
                  </Button>
                </div>
              </Reveal>

              <dl className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
                {stats.map((s, i) => (
                  <Reveal key={s.l} variant="up" delay={650 + i * 110} as="div">
                    <dt className="font-display text-3xl font-medium text-foreground">{s.v}</dt>
                    <dd className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{s.l}</dd>
                  </Reveal>
                ))}
              </dl>
            </div>

            <div className="relative lg:col-span-5">
              <Reveal variant="scale" delay={250}>
                <div className="relative">
                  <div className="relative overflow-hidden rounded-3xl border border-border bg-background shadow-card">
                    <img
                      src={heroBg}
                      alt="Zanscode in motion"
                      className="aspect-[4/5] w-full object-cover"
                      width={1280}
                      height={1600}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand/30 via-transparent to-transparent mix-blend-multiply" />
                  </div>

                  <div className="absolute -left-5 top-10 hidden animate-float-soft sm:block">
                    <div className="rounded-2xl border border-border bg-background p-4 shadow-card">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <TrendingUp className="h-3.5 w-3.5 text-brand" /> Operational lift
                      </div>
                      <div className="mt-1 font-display text-3xl font-medium text-foreground">+38%</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">avg. across deployments</div>
                    </div>
                  </div>

                  <div className="absolute -right-4 bottom-20 hidden animate-float-soft sm:block" style={{ animationDelay: "-4s" }}>
                    <div className="rounded-2xl border border-border bg-background p-4 shadow-card">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 text-brand" /> Time to first ship
                      </div>
                      <div className="mt-1 font-display text-3xl font-medium text-foreground">14 wks</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">discovery to launch</div>
                    </div>
                  </div>

                  <div className="absolute -bottom-5 left-4 right-4 rounded-2xl border border-border bg-background p-4 shadow-card sm:left-10 sm:right-10">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-brand">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground">SOC 2 · ISO 27001</div>
                        <div className="text-xs text-muted-foreground">Security baked into every build</div>
                      </div>
                      <Check className="h-4 w-4 text-brand" />
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE — trusted by */}
      <section className="border-y border-border bg-background py-10 overflow-hidden">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <p className="kicker text-center">Trusted by teams across the region</p>
        </div>
        <div className="mt-6 flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="flex shrink-0 animate-marquee-x gap-14 pr-14">
            {[...trusted, ...trusted].map((name, i) => (
              <span key={i} className="whitespace-nowrap font-display text-2xl font-medium text-muted-foreground/60">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* DYNAMIC SECTIONS — editorial split header + bento-ish grid */}
      {sections.filter((sec) => sec.visible).map((sec, secIdx) => {
        const meta = sectionMeta(sec.id, secIdx);
        const onCream = secIdx % 2 === 1;
        return (
          <section key={sec.id} className={`${onCream ? "bg-cream paper-grain" : "bg-background"} py-24 lg:py-32`}>
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
              <div className="grid gap-10 lg:grid-cols-12">
                <Reveal variant="up" className="lg:col-span-5">
                  <p className="kicker">{meta.eyebrow}</p>
                  <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
                    {sec.title.split(" ").slice(0, -1).join(" ")}{" "}
                    <em className="serif-italic text-brand">{sec.title.split(" ").slice(-1)[0]}</em>
                  </h2>
                </Reveal>
                {sec.subtitle && (
                  <Reveal variant="up" delay={180} className="lg:col-span-7 lg:pt-14">
                    <p className="text-lg leading-relaxed text-muted-foreground">{sec.subtitle}</p>
                  </Reveal>
                )}
              </div>

              {sec.cards.length > 0 && (
                <div className={`mt-16 grid gap-5 ${sec.cards.length >= 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
                  {sec.cards.map((card, i) => {
                    const Icon = meta.icons[i % meta.icons.length];
                    const stepLabel = meta.numbered ? String(i + 1).padStart(2, "0") : null;
                    return (
                      <Reveal key={card.id} variant="up" delay={i * 110} as="div">
                        <div className="card-hover group relative h-full overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-soft hover:border-brand/40 hover:shadow-brand">
                          {stepLabel && (
                            <span className="absolute right-5 top-5 font-display text-sm tracking-[0.2em] text-muted-foreground/50">{stepLabel}</span>
                          )}
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-background transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
                            <Icon className="h-5 w-5" />
                          </div>
                          <h3 className="mt-6 font-display text-xl font-medium text-foreground">{card.title}</h3>
                          {card.description && (
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
                          )}
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        );
      })}

      {/* INDUSTRIES — quiet band */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <Reveal variant="up" className="mx-auto max-w-2xl text-center">
            <p className="kicker">Industries</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] sm:text-5xl">
              Trusted across <em className="serif-italic text-brand">industries</em>
            </h2>
            <p className="mt-4 text-muted-foreground">
              From single-location owners to multi-branch mid-sized companies — Zanscode adapts to how your industry actually operates.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {industries.map((i, idx) => (
              <Reveal key={i.name} variant="scale" delay={idx * 90} as="div">
                <div className="card-hover group flex h-full flex-col items-center rounded-2xl border border-border bg-cream p-6 text-center hover:border-brand/30 hover:shadow-soft">
                  <i.icon className="h-6 w-6 text-brand transition-transform duration-500 group-hover:scale-110" />
                  <span className="mt-3 text-sm font-medium">{i.name}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE — editorial pull quote */}
      <section className="relative bg-cream py-24 lg:py-32 paper-grain">
        <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8 lg:px-10">
          <Reveal variant="up">
            <Quote className="mx-auto h-8 w-8 text-brand" />
            <blockquote className="mt-8 font-display text-3xl font-medium leading-[1.2] text-foreground sm:text-4xl lg:text-5xl">
              "Zanscode doesn't just write code — they design{" "}
              <em className="serif-italic text-brand">how the business runs.</em>"
            </blockquote>
            <figcaption className="mt-10 flex items-center justify-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-brand" />
              <div className="text-left">
                <div className="text-sm font-medium text-foreground">Anita Wijaya</div>
                <div className="text-sm text-muted-foreground">COO, RetailCo (12 outlets)</div>
              </div>
            </figcaption>
          </Reveal>
        </div>
      </section>

      {/* SAAS PRODUCTS — split with image */}
      <section className="bg-background py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:px-10">
          <Reveal variant="up" className="lg:col-span-5">
            <p className="kicker">Ready-made SaaS</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] sm:text-5xl lg:text-6xl">
              Run on a Zanscode product, <em className="serif-italic text-brand">from day one.</em>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Beyond custom systems, we ship a growing line of SaaS products for specific industries — from POS and clinic management to school and field-service apps.
            </p>
            <ul className="mt-8 space-y-4 text-sm">
              {[
                "25+ industry-ready SaaS products",
                "Live, hosted and continuously updated",
                "Customizable when your workflow is unique",
                "Same engineering team behind every release",
              ].map((i) => (
                <li key={i} className="flex items-start gap-3 border-b border-border pb-4 last:border-0">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <span className="text-foreground">{i}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="brand" className="group">
                <Link to="/products">
                  Browse SaaS products
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </Button>
              <Button asChild variant="outline"><Link to="/contact">Talk to our team</Link></Button>
            </div>
          </Reveal>

          <Reveal variant="scale" delay={200} className="lg:col-span-7">
            <div className="relative">
              <div className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-gradient-brand opacity-10 blur-3xl" />
              <div className="relative overflow-hidden rounded-3xl border border-border bg-background shadow-card">
                <img src={productSaas} alt="Zanscode SaaS preview" loading="lazy" width={1280} height={960} className="w-full object-cover" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-cream py-24 paper-grain">
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <Reveal variant="up" className="mx-auto max-w-2xl text-center">
            <p className="kicker">Customer stories</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] sm:text-5xl">
              Loved by owners and <em className="serif-italic text-brand">operators.</em>
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} variant="up" delay={i * 180} as="div">
                <figure className="card-hover flex h-full flex-col rounded-3xl border border-border bg-background p-7 shadow-soft hover:border-brand/40 hover:shadow-brand">
                  <Quote className="h-6 w-6 text-brand" />
                  <blockquote className="mt-4 flex-1 font-display text-lg leading-relaxed text-foreground">
                    "{t.quote}"
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5 text-sm">
                    <div className="h-9 w-9 rounded-full bg-gradient-brand" />
                    <div>
                      <div className="font-medium text-foreground">{t.name}</div>
                      <div className="text-muted-foreground">{t.role}</div>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA — dark editorial */}
      <section className="bg-ink py-24 text-background lg:py-32">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-8 lg:px-10">
          <Reveal variant="up">
            <Sparkles className="mx-auto h-6 w-6 text-brand-cyan" />
            <h2 className="mt-6 font-display text-5xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl">
              Have a system in mind?<br />
              Let's <em className="serif-italic text-brand-cyan">build it.</em>
            </h2>
            <p className="mx-auto mt-7 max-w-xl text-base text-background/70">
              Tell us what you're trying to solve — we'll propose the architecture, team and timeline to get it shipped.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button asChild size="xl" variant="hero" className="group">
                <Link to="/contact">
                  Start a project
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="ghost" className="text-background hover:bg-background/10 hover:text-background">
                <Link to="/services">Explore services <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
