import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Mail, MapPin, Phone, User, Building2, Target, MessageSquare, Check, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SiteLayout } from "@/components/site/SiteLayout";
import { FAQ } from "@/components/site/FAQ";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
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
    <SiteLayout>
      <section className="relative overflow-hidden bg-gradient-hero py-20 text-white">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,white_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> We reply within 1 business day
          </div>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Let's build something powerful.</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/80">
            Walk us through your project in a few quick steps — we'll come back with a tailored plan.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {/* Sidebar */}
          <aside className="space-y-4 lg:col-span-1">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Get in touch</h3>
              <div className="mt-4 space-y-4">
                <ContactRow icon={Mail} title="Email" value="hello@zanscode.com" />
                <ContactRow icon={Phone} title="Phone" value="+1 (555) 010-0123" />
                <ContactRow icon={MapPin} title="HQ" value={<>Innovation District<br />Jakarta, Indonesia</>} />
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-6">
              <p className="text-sm font-semibold">What happens next?</p>
              <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2"><span className="text-foreground">1.</span> A specialist reviews your brief.</li>
                <li className="flex gap-2"><span className="text-foreground">2.</span> We schedule a 30-min discovery call.</li>
                <li className="flex gap-2"><span className="text-foreground">3.</span> You receive a tailored proposal.</li>
              </ol>
            </div>
          </aside>

          {/* Stepper form */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8 lg:col-span-2">
            {/* Progress bar */}
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Step {Math.min(step + 1, steps.length)} of {steps.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-brand transition-all duration-500 ease-out"
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
                      className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all ${
                        isActive
                          ? "border-brand bg-brand text-brand-foreground shadow-soft scale-105"
                          : isDone
                          ? "border-brand/40 bg-brand/10 text-brand"
                          : "border-border bg-secondary text-muted-foreground"
                      }`}
                      aria-label={s.label}
                    >
                      {isDone ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </button>
                    <span className={`mt-2 text-xs font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
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
                <div key={step} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h2 className="text-xl font-semibold">{steps[step].label}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{steps[step].description}</p>

                  <div className="mt-6 space-y-4">
                    {step === 0 && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Full name" id="name">
                          <Input id="name" value={data.name} onChange={(e) => set("name", e.target.value)} placeholder="Jane Doe" />
                        </Field>
                        <Field label="Work email" id="email">
                          <Input id="email" type="email" value={data.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@company.com" />
                        </Field>
                      </div>
                    )}

                    {step === 1 && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Company" id="company">
                          <Input id="company" value={data.company} onChange={(e) => set("company", e.target.value)} placeholder="Acme Inc." />
                        </Field>
                        <Field label="Your role" id="role">
                          <Input id="role" value={data.role} onChange={(e) => set("role", e.target.value)} placeholder="CTO, Founder…" />
                        </Field>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-5">
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
                        />
                        <p className="mt-1.5 text-xs text-muted-foreground">{data.message.length} characters · minimum 10</p>
                      </Field>
                    )}
                  </div>

                  <div className="mt-8 flex items-center justify-between gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep((s) => Math.max(0, s - 1))}
                      disabled={step === 0}
                    >
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    <Button type="button" variant="brand" onClick={next} disabled={!canContinue}>
                      {step === steps.length - 1 ? "Send message" : "Continue"}
                      {step !== steps.length - 1 && <ArrowRight className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function ContactRow({ icon: Icon, title, value }: { icon: typeof Mail; title: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-brand">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-sm text-muted-foreground">{value}</div>
      </div>
    </div>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function ChipGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                active
                  ? "border-brand bg-brand text-brand-foreground shadow-soft"
                  : "border-border bg-card text-foreground hover:border-brand/40 hover:bg-secondary"
              }`}
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
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand">
        <Check className="h-8 w-8" />
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
