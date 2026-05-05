import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import {
  ArrowLeft, ArrowRight, Briefcase, Check, Clock, Mail, MapPin, Sparkles,
  Upload, User, FileText, MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SiteLayout } from "@/components/site/SiteLayout";
import { getJobBySlug, getPublishedJobs } from "@/data/jobs";
import { toast } from "sonner";

export const Route = createFileRoute("/_site/apply/$jobSlug")({
  loader: ({ params }) => {
    const job = getJobBySlug(params.jobSlug);
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `Apply: ${loaderData.job.title} — Zanscode` : "Apply — Zanscode" },
      { name: "description", content: loaderData ? `Quick apply for ${loaderData.job.title} at Zanscode.` : "Apply at Zanscode." },
    ],
  }),
  notFoundComponent: () => (
    <SiteLayout>
      <section className="py-24">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Role not found</h1>
          <p className="mt-3 text-muted-foreground">This role may have closed. Browse our other open positions.</p>
          <div className="mt-6">
            <Button asChild variant="brand"><Link to="/careers">View all roles</Link></Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  ),
  component: ApplyPage,
});

const applicationSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(6, "Enter a valid phone number").max(30),
  location: z.string().trim().min(2, "Where are you based?").max(120),
  linkedin: z.string().trim().url("Enter a valid URL").max(255).optional().or(z.literal("")),
  yearsExperience: z.string().min(1, "Select years of experience"),
  resumeName: z.string().min(1, "Please attach your resume"),
  coverNote: z.string().trim().min(20, "At least 20 characters").max(1500, "Max 1500 characters"),
});

type FormData = z.infer<typeof applicationSchema>;

const empty: FormData = {
  fullName: "", email: "", phone: "", location: "",
  linkedin: "", yearsExperience: "", resumeName: "", coverNote: "",
};

const steps = [
  { id: 0, label: "About you", icon: User, description: "How can we reach you?" },
  { id: 1, label: "Experience", icon: FileText, description: "Your background and resume" },
  { id: 2, label: "Why Zanscode", icon: MessageSquare, description: "Tell us what excites you about this role" },
] as const;

const experienceOptions = ["< 1 year", "1–3 years", "3–5 years", "5–8 years", "8+ years"];

function ApplyPage() {
  const { job } = Route.useLoaderData();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [done, setDone] = useState(false);

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const stepFields: Record<number, (keyof FormData)[]> = {
    0: ["fullName", "email", "phone", "location"],
    1: ["linkedin", "yearsExperience", "resumeName"],
    2: ["coverNote"],
  };

  const canContinue = useMemo(() => {
    const fields = stepFields[step];
    const partial = applicationSchema.safeParse(data);
    if (partial.success) return true;
    // For per-step gating, check only this step's fields don't have errors and are filled
    return fields.every((f) => {
      const v = data[f];
      if (f === "linkedin") return true; // optional
      return typeof v === "string" && v.trim().length > 0;
    });
  }, [data, step]);

  function next() {
    if (step < steps.length - 1) {
      // Validate current step's fields
      const fields = stepFields[step];
      const partial: Record<string, unknown> = {};
      fields.forEach((f) => (partial[f] = data[f]));
      // Build a partial schema by picking from full schema
      const stepSchema = applicationSchema.pick(
        Object.fromEntries(fields.map((f) => [f, true])) as Record<keyof FormData, true>,
      );
      const result = stepSchema.safeParse(partial);
      if (!result.success) {
        const next: Partial<Record<keyof FormData, string>> = {};
        result.error.issues.forEach((iss) => {
          const key = iss.path[0] as keyof FormData;
          next[key] = iss.message;
        });
        setErrors(next);
        return;
      }
      setStep((s) => s + 1);
    } else {
      submit();
    }
  }

  function submit() {
    const result = applicationSchema.safeParse(data);
    if (!result.success) {
      const next: Partial<Record<keyof FormData, string>> = {};
      result.error.issues.forEach((iss) => {
        const key = iss.path[0] as keyof FormData;
        next[key] = iss.message;
      });
      setErrors(next);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setDone(true);
    toast.success("Application submitted — we'll be in touch within 3 business days.");
  }

  const progress = (((done ? steps.length : step) + 1) / steps.length) * 100;

  if (done) {
    return (
      <SiteLayout>
        <section className="py-24">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand">
              <Check className="h-8 w-8" />
            </div>
            <h1 className="mt-6 text-3xl font-bold sm:text-4xl">
              Thanks, {data.fullName.split(" ")[0]}!
            </h1>
            <p className="mt-3 text-muted-foreground">
              Your application for <span className="font-semibold text-foreground">{job.title}</span> is in.
              Our talent team will review and get back to you within 3 business days.
            </p>
            <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-left shadow-soft">
              <p className="text-sm font-semibold">What happens next?</p>
              <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2"><span className="text-foreground">1.</span> We review your application carefully.</li>
                <li className="flex gap-2"><span className="text-foreground">2.</span> If there's a match, you'll get an intro chat invite.</li>
                <li className="flex gap-2"><span className="text-foreground">3.</span> Two craft conversations and a final with a founder.</li>
              </ol>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild variant="brand"><Link to="/careers">Browse more roles</Link></Button>
              <Button asChild variant="outline"><Link to="/">Back to home</Link></Button>
            </div>
          </div>
        </section>
      </SiteLayout>
    );
  }

  const otherJobs = getPublishedJobs().filter((j) => j.slug !== job.slug && j.team === job.team).slice(0, 3);

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero py-16 text-white">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-cyan/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-brand/40 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate({ to: "/careers" })}
            className="inline-flex cursor-pointer items-center gap-1 text-sm text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> All roles
          </button>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Quick apply
          </span>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">{job.title}</h1>
          <p className="mt-3 max-w-2xl text-white/80">{job.summary}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/80">
            <span className="inline-flex items-center gap-1"><Briefcase className="h-4 w-4" /> {job.team}</span>
            <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {job.type} · {job.level}</span>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {/* Sidebar */}
          <aside className="space-y-4 lg:col-span-1">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">About this role</h3>
              <p className="mt-3 text-sm text-muted-foreground">{job.summary}</p>
              <ul className="mt-5 space-y-3 text-sm">
                <li className="flex items-start gap-3"><Briefcase className="mt-0.5 h-4 w-4 text-brand" /> <span>{job.team} · {job.level}</span></li>
                <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 text-brand" /> <span>{job.location}</span></li>
                <li className="flex items-start gap-3"><Clock className="mt-0.5 h-4 w-4 text-brand" /> <span>{job.type}</span></li>
              </ul>
            </div>

            {otherJobs.length > 0 && (
              <div className="rounded-2xl border border-border bg-surface p-6">
                <p className="text-sm font-semibold">Similar roles in {job.team}</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {otherJobs.map((j) => (
                    <li key={j.slug}>
                      <Link
                        to="/apply/$jobSlug"
                        params={{ jobSlug: j.slug }}
                        className="cursor-pointer text-muted-foreground hover:text-brand"
                      >
                        {j.title} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>

          {/* Stepper form */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8 lg:col-span-2">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Step {step + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-brand transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
            </div>

            <ol className="mt-6 grid grid-cols-3 gap-2">
              {steps.map((s, i) => {
                const isDone = i < step;
                const isActive = i === step;
                const Icon = s.icon;
                return (
                  <li key={s.id} className="flex flex-col items-center text-center">
                    <button
                      type="button"
                      onClick={() => i < step && setStep(i)}
                      disabled={i > step}
                      className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all ${
                        i < step ? "cursor-pointer" : "cursor-default"
                      } ${
                        isActive
                          ? "scale-105 border-brand bg-brand text-brand-foreground shadow-soft"
                          : isDone
                          ? "border-brand/40 bg-brand/10 text-brand"
                          : "border-border bg-secondary text-muted-foreground"
                      }`}
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
              <h2 className="text-xl font-semibold">{steps[step].label}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{steps[step].description}</p>

              <div className="mt-6 space-y-4">
                {step === 0 && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Full name" id="fullName" error={errors.fullName}>
                        <Input id="fullName" value={data.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Jane Doe" />
                      </Field>
                      <Field label="Email" id="email" error={errors.email}>
                        <Input id="email" type="email" value={data.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@example.com" />
                      </Field>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Phone" id="phone" error={errors.phone}>
                        <Input id="phone" type="tel" value={data.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+62 812 3456 7890" />
                      </Field>
                      <Field label="Location" id="location" error={errors.location}>
                        <Input id="location" value={data.location} onChange={(e) => set("location", e.target.value)} placeholder="Jakarta, Indonesia" />
                      </Field>
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <Field label="LinkedIn URL (optional)" id="linkedin" error={errors.linkedin}>
                      <Input id="linkedin" type="url" value={data.linkedin} onChange={(e) => set("linkedin", e.target.value)} placeholder="https://linkedin.com/in/yourname" />
                    </Field>

                    <div>
                      <Label>Years of experience</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {experienceOptions.map((opt) => {
                          const active = data.yearsExperience === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => set("yearsExperience", opt)}
                              className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-all ${
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
                      {errors.yearsExperience && <p className="mt-1.5 text-xs text-destructive">{errors.yearsExperience}</p>}
                    </div>

                    <Field label="Resume" id="resume" error={errors.resumeName}>
                      <label
                        htmlFor="resume"
                        className="flex cursor-pointer items-center justify-between rounded-md border border-dashed border-border bg-background px-4 py-6 text-sm transition-colors hover:border-brand/40 hover:bg-secondary/50"
                      >
                        <span className="flex items-center gap-3">
                          <Upload className="h-4 w-4 text-brand" />
                          <span className={data.resumeName ? "text-foreground" : "text-muted-foreground"}>
                            {data.resumeName || "Click to upload PDF, DOC or DOCX (max 5MB)"}
                          </span>
                        </span>
                        {data.resumeName && <Check className="h-4 w-4 text-brand" />}
                        <input
                          id="resume"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 5 * 1024 * 1024) {
                              toast.error("Resume must be under 5MB.");
                              return;
                            }
                            set("resumeName", file.name);
                          }}
                        />
                      </label>
                    </Field>
                  </>
                )}

                {step === 2 && (
                  <Field label="Why do you want to join Zanscode?" id="coverNote" error={errors.coverNote}>
                    <Textarea
                      id="coverNote"
                      rows={8}
                      value={data.coverNote}
                      onChange={(e) => set("coverNote", e.target.value)}
                      placeholder="Tell us what excites you about this role and the impact you'd love to make…"
                    />
                    <p className="mt-1.5 text-xs text-muted-foreground">{data.coverNote.length} / 1500 characters · minimum 20</p>
                  </Field>
                )}
              </div>

              <div className="mt-8 flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button type="button" variant="brand" onClick={next} disabled={!canContinue} className="cursor-pointer">
                  {step === steps.length - 1 ? "Submit application" : "Continue"}
                  {step !== steps.length - 1 && <ArrowRight className="h-4 w-4" />}
                </Button>
              </div>

              <p className="mt-6 text-center text-xs text-muted-foreground">
                Prefer email?{" "}
                <a href={`mailto:careers@zanscode.com?subject=Application: ${encodeURIComponent(job.title)}`} className="cursor-pointer font-semibold text-brand hover:underline"><Mail className="mr-1 inline h-3 w-3" />careers@zanscode.com</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({ label, id, error, children }: { label: string; id: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
