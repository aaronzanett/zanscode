import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  ArrowUpRight, Sparkles, Quote, Check,
  Code2, Database, Smartphone, Boxes, Compass, PenTool, Hammer, Rocket,
  ShoppingBag, Truck, Building2, Stethoscope, GraduationCap, Landmark,
  TrendingUp, Clock, ShieldCheck, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { ClosingCTA } from "@/components/site/ClosingCTA";
import { isAppSubdomain } from "@/lib/host";
import { isSignedIn } from "@/lib/auth";
import { useStore } from "@/lib/store";
import type { IconName } from "@/lib/store";

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

const industryIconMap: Record<IconName, typeof Code2> = {
  "shopping-bag": ShoppingBag,
  "truck": Truck,
  "building": Building2,
  "stethoscope": Stethoscope,
  "graduation-cap": GraduationCap,
  "landmark": Landmark,
  "rocket": Rocket,
  "boxes": Boxes,
};

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

// Solid accent rotation — matches the testimonial accent lines for consistency
const iconTiles = [
  "bg-brand text-background",
  "bg-brand-cyan text-ink",
  "bg-ink text-background",
];
const industryTiles = [
  { wrap: "bg-cream", icon: "bg-brand text-background", ring: "hover:border-brand/50" },
  { wrap: "bg-background", icon: "bg-brand-cyan text-ink", ring: "hover:border-brand-cyan/60" },
  { wrap: "bg-cream", icon: "bg-ink text-background", ring: "hover:border-ink/40" },
];

function HomePage() {
  const navigate = useNavigate();
  const hero = useStore((s) => s.siteContent.hero);
  const sections = useStore((s) => s.siteContent.sections);
  const home = useStore((s) => s.siteContent.home);
  const stats = home.stats;
  const trusted = home.trusted;
  const industries = home.industries.map((i) => ({ name: i.name, icon: industryIconMap[i.icon] ?? Boxes }));
  const testimonials = home.testimonials;

  useEffect(() => {
    if (isAppSubdomain()) {
      navigate({ to: isSignedIn() ? "/app" : "/staff/login" });
    }
  }, [navigate]);

  return (
    <>
      {/* HERO — editorial, with floating stat cards */}
      <section className="relative overflow-hidden bg-cream pt-12 pb-24 sm:pt-16 lg:pt-24 lg:pb-32 paper-grain">

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7 lg:pt-6">
              <Reveal variant="fade">
                  <span className="inline-flex items-center gap-2.5 rounded-full border border-border bg-background/70 py-1.5 pl-2.5 pr-4 text-xs font-medium text-foreground backdrop-blur shadow-soft">
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
                  <em className="serif-italic text-gradient-brand animate-gradient-sweep">
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
                  <Button asChild size="xl" variant="brand" className="group shadow-brand">
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
                  <Reveal key={s.id} variant="up" delay={650 + i * 110} as="div">
                    <div className="group">
                      <dt className="font-display text-3xl font-medium text-foreground transition-colors group-hover:text-brand">
                        {s.value}
                      </dt>
                      <dd className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{s.label}</dd>
                      <div className="mt-3 h-px w-8 bg-brand opacity-60 transition-all duration-500 group-hover:w-20 group-hover:opacity-100" />
                    </div>
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
                      className="aspect-[4/5] w-full object-cover transition-transform duration-[1400ms] hover:scale-105"
                      width={1280}
                      height={1600}
                    />
                  </div>

                  <div className="absolute -left-5 top-10 hidden animate-float-soft sm:block">
                    <div className="rounded-2xl border border-border bg-background p-4 shadow-card">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <TrendingUp className="h-3.5 w-3.5 text-brand" /> Operational lift
                      </div>
                      <div className="mt-1 font-display text-3xl font-medium text-brand">+38%</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">avg. across deployments</div>
                    </div>
                  </div>

                  <div className="absolute -right-4 bottom-20 hidden animate-float-soft sm:block" style={{ animationDelay: "-4s" }}>
                    <div className="rounded-2xl border border-border bg-ink p-4 text-background shadow-brand">
                      <div className="flex items-center gap-2 text-xs text-background/70">
                        <Clock className="h-3.5 w-3.5 text-brand-cyan" /> Time to first ship
                      </div>
                      <div className="mt-1 font-display text-3xl font-medium text-background">14 wks</div>
                      <div className="mt-0.5 text-[11px] text-background/60">discovery to launch</div>
                    </div>
                  </div>

                  <div className="absolute -bottom-5 left-4 right-4 rounded-2xl border border-border bg-background p-4 shadow-card sm:left-10 sm:right-10">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-background">
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

      {/* MARQUEE — trusted by, dark blue band for brand reinforcement */}
      <section className="relative overflow-hidden bg-gradient-hero py-12 text-background">
        <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, oklch(0.72 0.14 215 / 0.4), transparent 50%), radial-gradient(circle at 80% 50%, oklch(0.42 0.16 250 / 0.5), transparent 50%)" }}
        />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <p className="text-center text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-brand-cyan">
            {home.trustedHeadline}
          </p>
        </div>
        <div className="relative mt-6 flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="flex shrink-0 animate-marquee-x gap-14 pr-14">
            {[...trusted, ...trusted].map((logo, i) => (
              <span key={i} className="whitespace-nowrap font-display text-2xl font-medium text-background/80 transition-colors hover:text-background">
                {logo.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* DYNAMIC SECTIONS — editorial split header + colored cards */}
      {sections.filter((sec) => sec.visible).map((sec, secIdx) => {
        const meta = sectionMeta(sec.id, secIdx);
        const onCream = secIdx % 2 === 1;
        return (
          <section key={sec.id} className={`relative ${onCream ? "bg-cream paper-grain" : "bg-background"} py-24 lg:py-32`}>
            {!onCream && (
              <div className="pointer-events-none absolute top-1/2 right-[-10%] h-[24rem] w-[24rem] -translate-y-1/2 rounded-full bg-brand-cyan/10 blur-3xl" aria-hidden />
            )}
            <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
              <div className="grid gap-10 lg:grid-cols-12">
                <Reveal variant="up" className="lg:col-span-5">
                  <p className="kicker">{meta.eyebrow}</p>
                  <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
                    {sec.title.split(" ").slice(0, -1).join(" ")}{" "}
                    <em className="serif-italic text-gradient-brand">{sec.title.split(" ").slice(-1)[0]}</em>
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
                    const tile = iconTiles[i % iconTiles.length];
                    return (
                      <Reveal key={card.id} variant="up" delay={i * 110} as="div">
                        <div className="card-hover group relative h-full overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-soft hover:border-brand/40 hover:shadow-brand">
                          {/* top accent strip */}
                          <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-brand transition-transform duration-500 group-hover:scale-x-100" />
                          {stepLabel && (
                            <span className="absolute right-5 top-5 font-display text-sm tracking-[0.2em] text-muted-foreground/40 transition-colors group-hover:text-brand">{stepLabel}</span>
                          )}
                          <div className={`relative flex h-12 w-12 items-center justify-center rounded-2xl ${tile} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-soft`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <h3 className="relative mt-6 font-display text-xl font-medium text-foreground">{card.title}</h3>
                          {card.description && (
                            <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
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

      {/* INDUSTRIES — colorful varied tiles */}
      <section className="relative bg-background py-24 overflow-hidden">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-brand/8 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <Reveal variant="up" className="mx-auto max-w-2xl text-center">
            <p className="kicker">{home.industriesEyebrow}</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] sm:text-5xl">
              {home.industriesTitle.split(" ").slice(0, -1).join(" ")}{" "}
              <em className="serif-italic text-gradient-brand">{home.industriesTitle.split(" ").slice(-1)[0]}</em>
            </h2>
            <p className="mt-4 text-muted-foreground">{home.industriesSubtitle}</p>
          </Reveal>
          <div className="mt-12 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {industries.map((i, idx) => {
              const tile = industryTiles[idx % industryTiles.length];
              return (
                <Reveal key={i.name} variant="scale" delay={idx * 90} as="div">
                  <div className={`card-hover group flex h-full flex-col items-center rounded-2xl border border-border ${tile.wrap} p-6 text-center ${tile.ring} hover:shadow-soft`}>
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tile.icon} transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3`}>
                      <i.icon className="h-5 w-5" />
                    </div>
                    <span className="mt-4 text-sm font-medium">{i.name}</span>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* QUOTE — dark blue editorial pull quote, high impact */}
      <section className="relative overflow-hidden bg-gradient-hero py-28 text-background lg:py-36">
        <div className="pointer-events-none absolute -top-24 left-[10%] h-[26rem] w-[26rem] rounded-full bg-brand-cyan/30 blur-3xl animate-blob-drift" aria-hidden />
        <div className="pointer-events-none absolute -bottom-24 right-[10%] h-[26rem] w-[26rem] rounded-full bg-brand/40 blur-3xl animate-blob-drift" style={{ animationDelay: "-11s" }} aria-hidden />
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]" aria-hidden
          style={{ backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)", backgroundSize: "64px 64px", maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)" }}
        />
        <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8 lg:px-10">
          <Reveal variant="up">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-background/10 backdrop-blur ring-1 ring-background/20">
              <Quote className="h-6 w-6 text-brand-cyan" />
            </div>
            <blockquote className="mt-10 font-display text-3xl font-medium leading-[1.2] text-background sm:text-4xl lg:text-5xl">
              "{home.pullQuote}"
            </blockquote>
            <div className="mt-8 flex items-center justify-center gap-1 text-brand-cyan">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <figcaption className="mt-6 flex items-center justify-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-cyan to-background/60 ring-2 ring-background/30" />
              <div className="text-left">
                <div className="text-sm font-medium text-background">{home.pullQuoteName}</div>
                <div className="text-sm text-background/70">{home.pullQuoteRole}</div>
              </div>
            </figcaption>
          </Reveal>
        </div>
      </section>

      {/* SAAS PRODUCTS — split with image */}
      <section className="relative bg-background py-24 lg:py-32 overflow-hidden">
        <div className="pointer-events-none absolute -top-32 right-[-15%] h-[34rem] w-[34rem] rounded-full bg-brand/10 blur-3xl" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:px-10">
          <Reveal variant="up" className="lg:col-span-5">
            <p className="kicker">{home.saasEyebrow}</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] sm:text-5xl lg:text-6xl">
              {home.saasTitle.split(" ").slice(0, -2).join(" ")}{" "}
              <em className="serif-italic text-gradient-brand">{home.saasTitle.split(" ").slice(-2).join(" ")}</em>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">{home.saasSubtitle}</p>
            <ul className="mt-8 space-y-3 text-sm">
              {home.saasBullets.map((b) => (
                <li key={b.id} className="group flex items-start gap-3 rounded-xl border border-transparent p-3 transition-colors hover:border-border hover:bg-cream">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-background shadow-soft">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-foreground">{b.text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="brand" className="group shadow-brand">
                <Link to={home.saasPrimaryCtaTo}>
                  {home.saasPrimaryCta}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </Button>
              <Button asChild variant="outline"><Link to={home.saasSecondaryCtaTo}>{home.saasSecondaryCta}</Link></Button>
            </div>
          </Reveal>

          <Reveal variant="scale" delay={200} className="lg:col-span-7">
            <div className="relative">
              <div className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-gradient-brand opacity-20 blur-3xl" />
              <div className="pointer-events-none absolute -top-6 -left-6 h-24 w-24 rounded-2xl bg-brand-cyan/30 blur-2xl" />
              <div className="relative overflow-hidden rounded-3xl border border-border bg-background shadow-card">
                <img src={productSaas} alt="Zanscode SaaS preview" loading="lazy" width={1280} height={960} className="w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.03]" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ink/20 via-transparent to-transparent" />
              </div>
              {/* floating chip */}
              <div className="absolute -bottom-5 left-6 right-6 hidden rounded-2xl border border-border bg-background/95 p-4 shadow-card backdrop-blur sm:left-12 sm:right-12 sm:flex sm:items-center sm:gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-brand text-background">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Built for scale</div>
                  <div className="text-xs text-muted-foreground">Multi-tenant, audit-ready, SSO included</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS — colorful card accents */}
      <section className="relative bg-cream py-24 paper-grain">
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <Reveal variant="up" className="mx-auto max-w-2xl text-center">
            <p className="kicker">{home.testimonialsEyebrow}</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] sm:text-5xl">
              {home.testimonialsTitle.split(" ").slice(0, -1).join(" ")}{" "}
              <em className="serif-italic text-gradient-brand">{home.testimonialsTitle.split(" ").slice(-1)[0]}</em>
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {testimonials.map((t, i) => {
              const accents = ["bg-gradient-brand", "bg-brand-cyan", "bg-ink"];
              const accent = accents[i % accents.length];
              return (
                <Reveal key={t.id} variant="up" delay={i * 180} as="div">
                  <figure className="card-hover group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-background p-7 shadow-soft hover:border-brand/40 hover:shadow-brand">
                    <div className={`absolute inset-x-0 top-0 h-1 ${accent}`} />
                    <div className="flex items-center justify-between">
                      <Quote className="h-7 w-7 text-brand" />
                      <div className="flex gap-0.5 text-brand-cyan">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star key={idx} className="h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <blockquote className="mt-5 flex-1 font-display text-lg leading-relaxed text-foreground">
                      "{t.quote}"
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5 text-sm">
                      <div className={`h-10 w-10 rounded-full ${accent} ring-2 ring-background`} />
                      <div>
                        <div className="font-medium text-foreground">{t.name}</div>
                        <div className="text-muted-foreground">{t.role}</div>
                      </div>
                    </figcaption>
                  </figure>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <ClosingCTA
        title={<>{home.closingTitle}<br />{home.closingHighlight && (<><em className="serif-italic text-brand-cyan">{home.closingHighlight}</em></>)}</>}
        description={home.closingDescription}
      />
    </>
  );
}
