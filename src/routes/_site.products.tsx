import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Scissors, GraduationCap, UtensilsCrossed, ShoppingBag, Stethoscope, Dumbbell,
  Hotel, Car, Building2, Sparkles as SparklesIcon, Wrench, Truck,
  ExternalLink, ArrowRight, Check, Star, Search, Zap, ShieldCheck,
  Globe2, Smartphone, Plug, BarChart3, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/site/Reveal";

import productApps from "@/assets/product-apps.jpg";

export const Route = createFileRoute("/_site/products")({
  head: () => ({
    meta: [
      { title: "Products & SaaS — Zanscode" },
      { name: "description", content: "Industry-ready SaaS by Zanscode — for barbershops, schools, F&B, retail, clinics, gyms and more. Plus horizontal apps for CRM, finance, HR and BI." },
      { property: "og:title", content: "Products & SaaS — Zanscode" },
      { property: "og:description", content: "SaaS for every industry — barbershops, schools, restaurants, retail, clinics, gyms. Plus a full business app suite." },
      { property: "og:image", content: productApps },
    ],
  }),
  component: ProductsPage,
});

/* ----------------------------- Data ----------------------------- */

type Industry = "Beauty & Wellness" | "Education" | "Food & Beverage" | "Retail" | "Healthcare" | "Fitness" | "Hospitality" | "Automotive" | "Real Estate" | "Services" | "Logistics";

type SaasApp = {
  icon: typeof Scissors;
  name: string;
  tagline: string;
  desc: string;
  url: string;
  startingPrice: string;
  badge?: "New" | "Popular" | "Beta";
  industry: Industry;
  highlights: string[];
};

const industries: { id: Industry; icon: typeof Scissors; label: string; blurb: string; accent: string }[] = [
  { id: "Beauty & Wellness", icon: Scissors, label: "Beauty & Wellness", blurb: "Barbershops, salons, spas", accent: "from-pink-500/20 to-rose-500/20" },
  { id: "Education", icon: GraduationCap, label: "Education", blurb: "Schools, courses, tutors", accent: "from-blue-500/20 to-indigo-500/20" },
  { id: "Food & Beverage", icon: UtensilsCrossed, label: "Food & Beverage", blurb: "Restaurants, cafés, cloud kitchens", accent: "from-orange-500/20 to-amber-500/20" },
  { id: "Retail", icon: ShoppingBag, label: "Retail", blurb: "Single & multi-outlet stores", accent: "from-emerald-500/20 to-teal-500/20" },
  { id: "Healthcare", icon: Stethoscope, label: "Healthcare", blurb: "Clinics, dentists, pharmacies", accent: "from-cyan-500/20 to-sky-500/20" },
  { id: "Fitness", icon: Dumbbell, label: "Fitness", blurb: "Gyms, studios, personal trainers", accent: "from-violet-500/20 to-purple-500/20" },
  { id: "Hospitality", icon: Hotel, label: "Hospitality", blurb: "Hotels, villas, homestays", accent: "from-fuchsia-500/20 to-pink-500/20" },
  { id: "Automotive", icon: Car, label: "Automotive", blurb: "Workshops, car wash, rentals", accent: "from-slate-500/20 to-zinc-500/20" },
  { id: "Real Estate", icon: Building2, label: "Real Estate", blurb: "Agents, property managers", accent: "from-yellow-500/20 to-amber-500/20" },
  { id: "Services", icon: Wrench, label: "Services", blurb: "Cleaning, repair, home services", accent: "from-lime-500/20 to-green-500/20" },
  { id: "Logistics", icon: Truck, label: "Logistics", blurb: "Fleet, delivery, dispatch", accent: "from-red-500/20 to-orange-500/20" },
];

const industryApps: SaasApp[] = [
  {
    icon: Scissors, name: "ZansBarber", tagline: "Run your barbershop, beautifully",
    desc: "Online booking, walk-in queue, stylist commissions and loyalty — built for barbers and salons.",
    url: "https://barber.zanscode.com", startingPrice: "$19/chair/mo", badge: "Popular", industry: "Beauty & Wellness",
    highlights: ["Online booking widget", "Stylist commission tracking", "SMS/WhatsApp reminders"],
  },
  {
    icon: SparklesIcon, name: "ZansSpa", tagline: "Spa & wellness, simplified",
    desc: "Therapist scheduling, package & membership management, room utilization and POS in one.",
    url: "https://spa.zanscode.com", startingPrice: "$29/mo", industry: "Beauty & Wellness",
    highlights: ["Memberships & packages", "Room & therapist scheduling", "Tip & gratuity handling"],
  },
  {
    icon: GraduationCap, name: "ZansSchool", tagline: "School operations, made calm",
    desc: "Student information system with attendance, grading, parent portal and tuition billing.",
    url: "https://school.zanscode.com", startingPrice: "$2/student/mo", badge: "Popular", industry: "Education",
    highlights: ["Parent portal & app", "Tuition & invoice automation", "Report cards & transcripts"],
  },
  {
    icon: GraduationCap, name: "ZansClass", tagline: "For tutors & course creators",
    desc: "Class scheduling, attendance, online lessons and recurring billing for tutoring centers.",
    url: "https://class.zanscode.com", startingPrice: "$15/mo", badge: "New", industry: "Education",
    highlights: ["Recurring class billing", "Zoom & Meet integration", "Student progress tracking"],
  },
  {
    icon: UtensilsCrossed, name: "ZansResto", tagline: "Restaurant POS & KDS",
    desc: "Table service, kitchen display, online menu and delivery aggregator sync — works offline.",
    url: "https://resto.zanscode.com", startingPrice: "$39/outlet/mo", badge: "Popular", industry: "Food & Beverage",
    highlights: ["Offline-first POS", "GoFood / GrabFood sync", "Kitchen display system"],
  },
  {
    icon: UtensilsCrossed, name: "ZansKitchen", tagline: "Cloud kitchen control",
    desc: "Multi-brand order routing, prep timing and rider dispatch for ghost kitchens.",
    url: "https://kitchen.zanscode.com", startingPrice: "$49/mo", industry: "Food & Beverage",
    highlights: ["Multi-brand routing", "Prep-time analytics", "Rider dispatch board"],
  },
  {
    icon: ShoppingBag, name: "ZansPOS", tagline: "Modern retail POS",
    desc: "Multi-outlet inventory, barcode scanning, loyalty and e-commerce sync — cloud + offline.",
    url: "https://pos.zanscode.com", startingPrice: "$29/outlet/mo", industry: "Retail",
    highlights: ["Multi-outlet stock sync", "Loyalty & gift cards", "Shopify & Tokopedia sync"],
  },
  {
    icon: Stethoscope, name: "ZansClinic", tagline: "Clinic & EMR in one",
    desc: "Appointments, electronic medical records, e-prescriptions and insurance claims.",
    url: "https://clinic.zanscode.com", startingPrice: "$49/practitioner/mo", industry: "Healthcare",
    highlights: ["EMR with templates", "BPJS/insurance claims", "Patient SMS reminders"],
  },
  {
    icon: Stethoscope, name: "ZansPharma", tagline: "Pharmacy management",
    desc: "Drug inventory with expiry tracking, prescription dispensing and supplier orders.",
    url: "https://pharma.zanscode.com", startingPrice: "$39/mo", industry: "Healthcare",
    highlights: ["Expiry & batch tracking", "Prescription log", "Supplier reorder alerts"],
  },
  {
    icon: Dumbbell, name: "ZansGym", tagline: "Memberships that stick",
    desc: "Member check-in, class booking, trainer payroll and recurring membership billing.",
    url: "https://gym.zanscode.com", startingPrice: "$1/member/mo", badge: "New", industry: "Fitness",
    highlights: ["Door access integration", "Class & PT booking", "Recurring membership billing"],
  },
  {
    icon: Hotel, name: "ZansStay", tagline: "Hotel & villa PMS",
    desc: "Reservations, channel manager, housekeeping and guest folios — connect to OTAs in minutes.",
    url: "https://stay.zanscode.com", startingPrice: "$59/property/mo", industry: "Hospitality",
    highlights: ["Booking.com & Airbnb sync", "Housekeeping board", "Guest folio & invoicing"],
  },
  {
    icon: Car, name: "ZansAuto", tagline: "Workshop & service center",
    desc: "Job cards, vehicle history, parts inventory and digital service quotes for customers.",
    url: "https://auto.zanscode.com", startingPrice: "$39/bay/mo", industry: "Automotive",
    highlights: ["Vehicle service history", "Digital quote approvals", "Parts inventory"],
  },
  {
    icon: Building2, name: "ZansEstate", tagline: "Property management",
    desc: "Listings, tenant screening, lease tracking, rent collection and maintenance tickets.",
    url: "https://estate.zanscode.com", startingPrice: "$3/unit/mo", industry: "Real Estate",
    highlights: ["Tenant portal", "Auto rent collection", "Maintenance tickets"],
  },
  {
    icon: Wrench, name: "ZansField", tagline: "Field service operations",
    desc: "Dispatch, job scheduling, technician mobile app and on-site invoicing for service businesses.",
    url: "https://field.zanscode.com", startingPrice: "$25/tech/mo", industry: "Services",
    highlights: ["Drag-drop dispatch", "Tech mobile app", "On-site card payments"],
  },
  {
    icon: Truck, name: "ZansFleet", tagline: "Fleet & delivery control",
    desc: "Live GPS tracking, route optimization, proof-of-delivery and driver scoring.",
    url: "https://fleet.zanscode.com", startingPrice: "$19/vehicle/mo", industry: "Logistics",
    highlights: ["Live GPS tracking", "Route optimization", "Photo proof of delivery"],
  },
];



const featuredOS = {
  name: "Zanscode OS",
  tagline: "The all-in-one operating platform",
  desc: "Run sales, operations, finance, HR and analytics on one connected platform — with a single source of truth and a single bill.",
  url: "https://os.zanscode.com",
  highlights: [
    "Includes 8+ Zanscode apps",
    "Single sign-on across every module",
    "Unified data, automations & dashboards",
    "Open API and 100+ integrations",
  ],
};

const stats = [
  { v: "25+", l: "SaaS apps" },
  { v: "11", l: "Industries served" },
  { v: "8,500+", l: "Active users" },
  { v: "30+", l: "Countries" },
];

const features = [
  { icon: Zap, t: "Fast time-to-value", d: "Deploy in days, not months — pre-built modules per industry." },
  { icon: ShieldCheck, t: "Enterprise-grade security", d: "RBAC, SSO, encryption at rest and in transit, audit logs." },
  { icon: Globe2, t: "Multi-region & multi-language", d: "Run globally with localized UI, currency and tax handling." },
  { icon: Smartphone, t: "Mobile-first", d: "Native apps for owners, managers and staff — usable anywhere." },
  { icon: BarChart3, t: "Real-time analytics", d: "Dashboards that update as transactions happen." },
  { icon: Plug, t: "Open APIs", d: "REST and webhooks for any integration you need." },
];

const testimonials = [
  { quote: "ZansBarber turned our 3 shops into one dashboard. Bookings up 38%, no-shows down 60%.", name: "Adit Pratama", role: "Owner, Klipper Barbershop" },
  { quote: "ZansSchool replaced four tools. Parents love the app, our admins finally sleep at night.", name: "Ibu Sari", role: "Principal, Cendekia Academy" },
  { quote: "From one resto to twelve in 18 months — ZansResto scaled with us, never against us.", name: "Reza Hakim", role: "Founder, Nasi Kuning Bahagia" },
];

/* --------------------------- Component --------------------------- */

function ProductsPage() {
  const [activeIndustry, setActiveIndustry] = useState<Industry | "All">("All");
  const [query, setQuery] = useState("");

  const filteredIndustryApps = useMemo(() => {
    return industryApps.filter((app) => {
      const matchIndustry = activeIndustry === "All" || app.industry === activeIndustry;
      const q = query.trim().toLowerCase();
      const matchQuery = !q || app.name.toLowerCase().includes(q) || app.desc.toLowerCase().includes(q) || app.tagline.toLowerCase().includes(q);
      return matchIndustry && matchQuery;
    });
  }, [activeIndustry, query]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-soft py-20">
        <div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-brand/10 blur-3xl animate-blob-drift" aria-hidden />
        <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-brand-cyan/15 blur-3xl animate-blob-drift" style={{ animationDelay: "-14s" }} aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal variant="fade">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand shadow-soft">
              <Sparkles className="h-3.5 w-3.5" /> SaaS for every business
            </span>
          </Reveal>
          <Reveal variant="up" delay={200}>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold sm:text-5xl lg:text-6xl">
              SaaS isn't just for tech. <span className="text-gradient-brand">It's for your business.</span>
            </h1>
          </Reveal>
          <Reveal variant="up" delay={400}>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              From barbershops to schools, restaurants to clinics — Zanscode builds focused SaaS apps for the way your industry actually works. Pick one, or run your whole company on the suite.
            </p>
          </Reveal>
          <Reveal variant="up" delay={600}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="brand" size="lg"><Link to="/contact">Find your app</Link></Button>
              <Button asChild variant="outline" size="lg">
                <a href={featuredOS.url} target="_blank" rel="noopener noreferrer">
                  Explore Zanscode OS <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </div>
          </Reveal>
          <dl className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.l} variant="up" delay={750 + i * 140} as="div" className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur">
                <dt className="text-3xl font-bold text-foreground">{s.v}</dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.l}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Industry picker */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">By industry</span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Find SaaS that speaks your trade</h2>
            <p className="mt-3 text-muted-foreground">
              Tap an industry to see the apps built for it. Every Zanscode SaaS is shaped by real owners and operators in that field.
            </p>
          </div>

          {/* Industry chips */}
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveIndustry("All")}
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                activeIndustry === "All"
                  ? "border-brand bg-brand text-brand-foreground shadow-brand"
                  : "border-border bg-card text-foreground hover:border-brand/50"
              }`}
            >
              All industries
            </button>
            {industries.map((ind) => {
              const active = activeIndustry === ind.id;
              return (
                <button
                  key={ind.id}
                  onClick={() => setActiveIndustry(ind.id)}
                  className={`group inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                    active
                      ? "border-brand bg-brand text-brand-foreground shadow-brand"
                      : "border-border bg-card text-foreground hover:-translate-y-0.5 hover:border-brand/50"
                  }`}
                >
                  <ind.icon className="h-4 w-4" />
                  {ind.label}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="mx-auto mt-8 max-w-md">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search apps — try 'booking', 'inventory', 'payroll'…"
                className="pl-9"
              />
            </div>
          </div>

          {/* Industry app grid */}
          <div className="mt-12">
            {filteredIndustryApps.length === 0 ? (
              <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                <p className="text-muted-foreground">No apps match your filters yet.</p>
                <Button variant="outline" className="mt-4" onClick={() => { setActiveIndustry("All"); setQuery(""); }}>
                  Reset filters
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredIndustryApps.map((app) => {
                  const ind = industries.find((i) => i.id === app.industry)!;
                  return (
                    <a
                      key={app.name}
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:border-brand hover:shadow-brand"
                    >
                      <div className={`relative h-24 bg-gradient-to-br ${ind.accent}`}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-card/70 to-transparent" />
                        <div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-xl bg-card shadow-soft">
                          <app.icon className="h-6 w-6 text-brand" />
                        </div>
                        <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground backdrop-blur">
                          <ind.icon className="h-3 w-3" /> {app.industry}
                        </span>
                        {app.badge && (
                          <span className="absolute -bottom-2 right-5 rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-foreground shadow-brand">
                            {app.badge}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="text-lg font-semibold">{app.name}</h3>
                        <p className="mt-1 text-xs font-medium uppercase tracking-wider text-brand">{app.tagline}</p>
                        <p className="mt-3 text-sm text-muted-foreground">{app.desc}</p>
                        {app.highlights.length > 0 && (
                          <ul className="mt-4 space-y-1.5">
                            {app.highlights.map((h) => (
                              <li key={h} className="flex items-start gap-2 text-xs text-muted-foreground">
                                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-cyan" />
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                          <span className="text-xs text-muted-foreground">
                            From <span className="font-semibold text-foreground">{app.startingPrice}</span>
                          </span>
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand transition-transform group-hover:translate-x-0.5">
                            Visit site <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured — Zanscode OS */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-hero p-8 text-white shadow-brand sm:p-12">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-cyan/30 blur-3xl" />
            <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-brand/40 blur-3xl" />
            <div className="relative grid gap-10 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5" /> Featured platform
                </span>
                <h2 className="mt-5 text-3xl font-bold sm:text-4xl">{featuredOS.name}</h2>
                <p className="mt-2 text-lg text-white/80">{featuredOS.tagline}</p>
                <p className="mt-4 max-w-xl text-white/70">{featuredOS.desc}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild size="lg" variant="brand">
                    <a href={featuredOS.url} target="_blank" rel="noopener noreferrer">
                      Visit Zanscode OS <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="hero">
                    <Link to="/contact">Talk to sales</Link>
                  </Button>
                </div>
              </div>
              <ul className="space-y-3 rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur lg:col-span-2">
                {featuredOS.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-sm text-white/90">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-cyan" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>



      {/* Testimonials */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Loved across industries</span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Owners. Operators. Real wins.</h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex gap-1 text-brand-cyan">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <blockquote className="mt-4 flex-1 text-base leading-relaxed text-foreground">"{t.quote}"</blockquote>
                <figcaption className="mt-6 border-t border-border pt-4 text-sm">
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-muted-foreground">{t.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Why Zanscode */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Why Zanscode</span>
            <h2 className="mt-3 text-3xl font-bold">Built for serious operations</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.t} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-brand-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{f.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 pt-4">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-gradient-soft p-10 shadow-soft sm:p-14">
            <h2 className="text-3xl font-bold sm:text-4xl">Don't see your industry?</h2>
            <p className="mt-3 text-muted-foreground">
              We're always shipping new SaaS. Tell us what you run — we'll point you at the closest fit, or build it.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild variant="brand" size="lg"><Link to="/contact">Request a demo</Link></Button>
              <Button asChild variant="outline" size="lg"><Link to="/services">Explore custom builds</Link></Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
