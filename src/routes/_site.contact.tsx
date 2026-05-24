import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Mail, MapPin, Phone, User, Building2, Target, MessageSquare, Check, ArrowLeft, ArrowRight, Zap, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FAQ } from "@/components/site/FAQ";
import { Reveal } from "@/components/site/Reveal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_site/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Zanscode" },
      { name: "description", content: "Talk to Zanscode about your business technology project." },
      { property: "og:title", content: "Contact Zanscode" },
      { property: "og:description", content: "Get in touch about your project." },
    ],
  }),
  component: ContactPage,
});

type FormData = {
  name: string;
  email: string;
  company: string;
  role: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
};

const empty: FormData = {
  name: "", email: "", company: "", role: "",
  projectType: "", budget: "", timeline: "", message: "",
};

const steps = [
  { id: 0, label: "About you", icon: User, description: "Who we'll be talking to" },
  { id: 1, label: "Company", icon: Building2, description: "Tell us where you work" },
  { id: 2, label: "Project", icon: Target, description: "Scope, budget & timeline" },
  { id: 3, label: "Details", icon: MessageSquare, description: "Anything else we should know" },
] as const;

const projectTypes = ["Custom software", "ERP / Internal system", "SaaS product", "Mobile app", "Other"];
const budgets = ["< $10k", "$10k – $25k", "$25k – $50k", "$50k – $100k", "$100k+"];
const timelines = ["ASAP", "1–3 months", "3–6 months", "Flexible"];

const faqs = [
  { q: "What kinds of projects do you take on?", a: "From quick MVPs to multi-year enterprise platforms across web, mobile, desktop and SaaS — typically for teams that need a long-term technology partner." },
  { q: "How do you price projects?", a: "Project-based engagements are quoted as a fixed fee after a short discovery. Dedicated teams and staff augmentation are billed monthly per role." },
  { q: "How fast can we get started?", a: "Most engagements kick off within 1–2 weeks after a discovery call. For urgent projects we can mobilize a small squad in days." },
  { q: "Can you work with our existing tech stack?", a: "Yes — we adapt to your stack rather than forcing a rewrite. Most of our engineers are full-stack across modern web, mobile and cloud." },
  { q: "Do you sign NDAs?", a: "Always. We can sign your NDA before the first conversation, or share ours." },
  { q: "Who owns the code and IP?", a: "You do. All deliverables, source code and assets are transferred to you under a clear IP assignment." },
  { q: "Do you work with international clients?", a: "Yes. We serve clients across Southeast Asia, Australia, Europe and North America with overlapping working hours." },
  { q: "What time zones do you cover?", a: "Our delivery teams overlap with Asia, Europe, and the Americas. We schedule live overlap windows that work for your team." },
  { q: "Can products be customized for our workflow?", a: "Yes — every product supports configuration, custom modules, and white-labeling. We can extend functionality through the open API or as a paid customization." },
  { q: "Can I use just one SaaS app, or do I need the whole suite?", a: "Each Zanscode SaaS works perfectly on its own. When you adopt more than one, they automatically share data and sign-in — no extra setup required." },
  { q: "Is there a free trial for SaaS apps?", a: "Yes. Every Zanscode SaaS app includes a 14-day free trial — no credit card required. Zanscode OS includes 30 days for full team evaluation." },
  { q: "Is on-premise deployment available?", a: "Yes for ERP and OS. Enterprise plans include on-prem or private-cloud deployments with the same feature set as our managed cloud." },
  { q: "How is data migration handled?", a: "We provide migration tooling and a guided onboarding process — most teams are live with their historical data within 2–4 weeks." },
  { q: "Where are you based and how big is the team?", a: "Headquartered in Jakarta, Indonesia, with 60+ specialists across Southeast Asia and remote contributors globally — engineering, design, product and operations." },
  { q: "Are you hiring?", a: "Yes — we're always interested in talented engineers, designers and product people. See our Careers page for open roles." },
];

function ContactPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(empty);
  const [done, setDone] = useState(false);

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const canContinue = useMemo(() => {
    if (step === 0) return data.name.trim().length > 0 && /\S+@\S+\.\S+/.test(data.email);
    if (step === 1) return data.company.trim().length > 0;
    if (step === 2) return Boolean(data.projectType && data.budget && data.timeline);
    if (step === 3) return data.message.trim().length >= 10;
    return false;
  }, [step, data]);

  const progress = ((step + (done ? 1 : 0)) / steps.length) * 100;

  function next() {
    if (!canContinue) return;
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      submit();
    }
  }

  function submit() {
    setDone(true);
    toast.success("Message sent — we'll get back within 1 business day.");
  }

  function reset() {
    setData(empty);
    setStep(0);
    setDone(false);
  }

  return (
    <>
      <section className="relative overflow-hidden bg-ink py-24 text-background lg:py-28">
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_20%,white_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="pointer-events-none absolute -top-24 right-[-10%] h-96 w-96 rounded-full bg-brand-cyan/25 blur-3xl animate-blob-drift" aria-hidden />
        <div className="pointer-events-none absolute bottom-[-12rem] left-[-6rem] h-96 w-96 rounded-full bg-brand/40 blur-3xl animate-blob-drift [animation-delay:-6s]" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <Reveal>
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 py-1 pl-2 pr-4 text-xs font-medium backdrop-blur">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-cyan/20 text-brand-cyan">
                <Zap className="h-3 w-3" />
              </span>
              <span className="h-3 w-px bg-white/20" aria-hidden />
              <span>We reply within 1 business day</span>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-5 font-display text-[clamp(2.5rem,5.5vw,4.5rem)] font-medium leading-[1] tracking-tight">
              Let's build something <em className="serif-italic text-brand-cyan">powerful.</em>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 max-w-2xl text-lg text-background/75">
              Walk us through your project in a few quick steps — we'll come back with a tailored plan, no pressure.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-8 flex flex-wrap gap-3 text-xs text-background/70">
              {[
                { icon: Clock, label: "30-min discovery call" },
                { icon: ShieldCheck, label: "NDA on request" },
                { icon: Check, label: "Tailored proposal in 3–5 days" },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 backdrop-blur">
                  <Icon className="h-3.5 w-3.5 text-brand-cyan" />
                  {label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {/* Sidebar */}
          <aside className="space-y-4 lg:col-span-1">
            <Reveal>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Get in touch</h3>
                <div className="mt-4 space-y-4">
                  <ContactRow icon={Mail} title="Email" value="hello@zanscode.com" />
                  <ContactRow icon={Phone} title="Phone" value="+1 (555) 010-0123" />
                  <ContactRow icon={MapPin} title="HQ" value={<>Innovation District<br />Jakarta, Indonesia</>} />
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="rounded-2xl border border-border bg-surface p-6">
                <p className="text-sm font-semibold">What happens next?</p>
                <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {[
                    "A specialist reviews your brief.",
                    "We schedule a 30-min discovery call.",
                    "You receive a tailored proposal.",
                  ].map((text, i) => (
                    <li key={text} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
                        {i + 1}
                      </span>
                      <span className="text-foreground/80">{text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="rounded-2xl border border-brand/15 bg-brand/5 p-6">
                <p className="text-sm font-semibold text-brand">Prefer email?</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Drop us a line at{" "}
                  <a href="mailto:hello@zanscode.com" className="font-medium text-brand underline-offset-4 hover:underline">
                    hello@zanscode.com
                  </a>{" "}
                  and we'll route it to the right team.
                </p>
              </div>
            </Reveal>
          </aside>

          {/* Stepper form */}
          <Reveal delay={80} className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
              {/* Progress bar */}
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Step {Math.min(step + 1, steps.length)} of {steps.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-brand transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Step icons */}
              <ol className="mt-6 grid grid-cols-4 gap-2">
                {steps.map((s, i) => {
                  const isDone = done || i < step;
                  const isActive = !done && i === step;
                  const Icon = s.icon;
                  return (
                    <li key={s.id} className="flex flex-col items-center text-center">
                      <button
                        type="button"
                        onClick={() => !done && i < step && setStep(i)}
                        className={cn(
                          "flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300",
                          isActive
                            ? "border-brand bg-brand text-brand-foreground shadow-soft scale-110"
                            : isDone
                            ? "border-brand/40 bg-brand/10 text-brand hover:scale-105"
                            : "border-border bg-secondary text-muted-foreground",
                        )}
                        aria-label={s.label}
                      >
                        {isDone ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                      </button>
                      <span className={cn("mt-2 text-xs font-medium transition-colors", isActive ? "text-foreground" : "text-muted-foreground")}>
                        {s.label}
                      </span>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-8">
                {done ? (
                  <SuccessState onReset={reset} name={data.name} />
                ) : (
                  <div key={step} className="animate-in fade-in slide-in-from-bottom-3 duration-400">
                    <h2 className="text-2xl font-semibold tracking-tight">{steps[step].label}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{steps[step].description}</p>

                    <div className="mt-6 space-y-5">
                      {step === 0 && (
                        <div className="grid gap-5 sm:grid-cols-2">
                          <Field label="Full name" id="name">
                            <Input id="name" value={data.name} onChange={(e) => set("name", e.target.value)} placeholder="Jane Doe" className="contact-input" />
                          </Field>
                          <Field label="Work email" id="email">
                            <Input id="email" type="email" value={data.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@company.com" className="contact-input" />
                          </Field>
                        </div>
                      )}

                      {step === 1 && (
                        <div className="grid gap-5 sm:grid-cols-2">
                          <Field label="Company" id="company">
                            <Input id="company" value={data.company} onChange={(e) => set("company", e.target.value)} placeholder="Acme Inc." className="contact-input" />
                          </Field>
                          <Field label="Your role" id="role" optional>
                            <Input id="role" value={data.role} onChange={(e) => set("role", e.target.value)} placeholder="CTO, Founder…" className="contact-input" />
                          </Field>
                        </div>
                      )}

                      {step === 2 && (
                        <div className="space-y-6">
                          <ChipGroup label="Project type" options={projectTypes} value={data.projectType} onChange={(v) => set("projectType", v)} />
                          <ChipGroup label="Budget range" options={budgets} value={data.budget} onChange={(v) => set("budget", v)} />
                          <ChipGroup label="Timeline" options={timelines} value={data.timeline} onChange={(v) => set("timeline", v)} />
                        </div>
                      )}

                      {step === 3 && (
                        <Field label="Project details" id="message">
                          <Textarea
                            id="message"
                            rows={7}
                            value={data.message}
                            onChange={(e) => set("message", e.target.value)}
                            placeholder="Tell us about your goals, current stack, and any constraints…"
                            className="contact-input resize-none"
                          />
                          <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
                            <span>Minimum 10 characters</span>
                            <span className={cn(data.message.length >= 10 ? "text-brand" : "")}>{data.message.length} chars</span>
                          </div>
                        </Field>
                      )}
                    </div>

                    <div className="mt-8 flex items-center justify-between gap-3">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setStep((s) => Math.max(0, s - 1))}
                        disabled={step === 0}
                        className="group"
                      >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" /> Back
                      </Button>
                      <Button type="button" variant="brand" onClick={next} disabled={!canContinue} className="group">
                        {step === steps.length - 1 ? "Send message" : "Continue"}
                        {step !== steps.length - 1 && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <FAQ
        items={faqs}
        subtitle="Everything you need to know about working with Zanscode — services, products, SaaS, hiring and more."
      />
    </>
  );
}

function ContactRow({ icon: Icon, title, value }: { icon: typeof Mail; title: string; value: React.ReactNode }) {
  return (
    <div className="group flex items-start gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-brand transition-all duration-300 group-hover:bg-brand group-hover:text-brand-foreground group-hover:scale-105">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-sm text-muted-foreground">{value}</div>
      </div>
    </div>
  );
}

function Field({ label, id, optional, children }: { label: string; id: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div className="contact-field">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        {optional && <span className="text-xs text-muted-foreground">Optional</span>}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function ChipGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label className="text-sm font-medium">{label}</Label>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {options.map((opt, i) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              style={{ animationDelay: `${i * 40}ms` }}
              className={cn(
                "animate-in fade-in slide-in-from-bottom-1 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
                active
                  ? "border-brand bg-brand text-brand-foreground shadow-soft scale-[1.03]"
                  : "border-border bg-card text-foreground hover:-translate-y-0.5 hover:border-brand/40 hover:bg-secondary hover:shadow-soft",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SuccessState({ onReset, name }: { onReset: () => void; name: string }) {
  return (
    <div className="flex flex-col items-center py-10 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand">
        <span className="absolute inset-0 animate-ping rounded-full bg-brand/20" aria-hidden />
        <Check className="relative h-8 w-8" />
      </div>
      <h2 className="mt-4 text-2xl font-semibold">Thanks{name ? `, ${name.split(" ")[0]}` : ""}!</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Your message is on its way. A specialist will reach out within one business day with next steps.
      </p>
      <Button variant="ghost" className="mt-6" onClick={onReset}>
        Send another message
      </Button>
    </div>
  );
}
