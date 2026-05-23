import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import {
  ArrowLeft, Briefcase, Check, Clock, Loader2, Mail, MapPin,
  Upload, Send, FileText, ListChecks, Sparkles as SparklesIcon, Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getJobBySlug, getPublishedJobs } from "@/data/jobs";
import { createCandidate, getStoreSnapshot } from "@/lib/store";
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
    <section className="py-24">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">Role not found</h1>
        <p className="mt-3 text-muted-foreground">This role may have closed. Browse our other open positions.</p>
        <div className="mt-6">
          <Button asChild variant="brand"><Link to="/careers">View all roles</Link></Button>
        </div>
      </div>
    </section>
  ),
  component: ApplyPage,
});

const educationLevels = ["D3", "D4", "S1", "S2", "S3", "Other"];

const schema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(6, "Enter a valid phone number").max(30),
  location: z.string().trim().min(2, "Where are you based?").max(160),
  linkedin: z.string().trim().url("Enter a valid URL").max(255).optional().or(z.literal("")),
  lastRole: z.string().trim().max(120).optional().or(z.literal("")),
  lastCompany: z.string().trim().max(120).optional().or(z.literal("")),
  lastWorkFrom: z.string().optional().or(z.literal("")),
  lastWorkTo: z.string().optional().or(z.literal("")),
  educationType: z.enum(["highschool", "university"]),
  educationLevel: z.string().optional().or(z.literal("")),
  educationInstitution: z.string().trim().min(2, "Tell us where you studied").max(160),
  resumeName: z.string().min(1, "Please attach your CV"),
  coverLetter: z.string().trim().max(1500).optional().or(z.literal("")),
  agreed: z.literal(true, { errorMap: () => ({ message: "You must agree to continue" }) }),
});

type FormState = {
  fullName: string; email: string; phone: string; location: string; linkedin: string;
  lastRole: string; lastCompany: string; lastWorkFrom: string; lastWorkTo: string;
  educationType: "highschool" | "university";
  educationLevel: string; educationInstitution: string;
  resumeName: string; coverLetter: string; agreed: boolean;
};

const empty: FormState = {
  fullName: "", email: "", phone: "", location: "", linkedin: "",
  lastRole: "", lastCompany: "", lastWorkFrom: "", lastWorkTo: "",
  educationType: "university", educationLevel: "S1", educationInstitution: "",
  resumeName: "", coverLetter: "", agreed: false,
};

function ApplyPage() {
  const { job } = Route.useLoaderData();
  const navigate = useNavigate();

  const [data, setData] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = schema.safeParse(data);
    if (!result.success) {
      const next: Partial<Record<keyof FormState, string>> = {};
      result.error.issues.forEach((iss) => { next[iss.path[0] as keyof FormState] = iss.message; });
      setErrors(next);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    createCandidate({
      name: data.fullName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      jobId: job ? findJobId(job.slug) : null,
      source: "Website",
      stage: "applied",
      rating: 0,
      resumeUrl: data.resumeName,
      location: data.location.trim(),
      linkedin: data.linkedin.trim() || undefined,
      lastRole: data.lastRole.trim() || undefined,
      lastCompany: data.lastCompany.trim() || undefined,
      lastWorkFrom: data.lastWorkFrom || undefined,
      lastWorkTo: data.lastWorkTo || undefined,
      education: {
        type: data.educationType,
        level: data.educationType === "university" ? data.educationLevel : undefined,
        institution: data.educationInstitution.trim(),
      },
      coverLetter: data.coverLetter.trim() || undefined,
    });
    setSubmitting(false);
    setDone(true);
    toast.success("Application submitted — we'll be in touch within 3 business days.");
  }

  if (done) {
    return (
      <section className="py-24">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand">
            <Check className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-3xl font-bold sm:text-4xl">Thanks, {data.fullName.split(" ")[0]}!</h1>
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
    );
  }

  const otherJobs = getPublishedJobs().filter((j) => j.slug !== job.slug && j.team === job.team).slice(0, 3);
  const details = buildRoleDetails(job);

  return (
    <>
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
          <span className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 py-1 pl-2 pr-4 text-xs font-semibold backdrop-blur">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-cyan/20 text-brand-cyan">
              <Send className="h-3 w-3" />
            </span>
            <span className="h-3 w-px bg-white/20" aria-hidden />
            <span>Quick apply</span>
          </span>
          <h1 className="mt-5 text-3xl font-bold sm:text-4xl lg:text-5xl">{job.title}</h1>
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
          <aside className="space-y-4 lg:col-span-1 lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
              <div className="border-b border-border bg-surface/60 px-6 py-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">About this role</h3>
              </div>
              <div className="space-y-6 p-6">
                <ul className="grid gap-3 text-sm">
                  <li className="flex items-start gap-3"><Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> <span><span className="text-muted-foreground">Team · </span>{job.team} · {job.level}</span></li>
                  <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> <span><span className="text-muted-foreground">Location · </span>{job.location}</span></li>
                  <li className="flex items-start gap-3"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> <span><span className="text-muted-foreground">Type · </span>{job.type}</span></li>
                </ul>

                <SidebarBlock icon={FileText} title="Overview">
                  <p className="text-sm leading-relaxed text-muted-foreground">{details.overview}</p>
                </SidebarBlock>

                <SidebarBlock icon={ListChecks} title="Responsibilities">
                  <BulletList items={details.responsibilities} />
                </SidebarBlock>

                <SidebarBlock icon={SparklesIcon} title="What we're looking for">
                  <BulletList items={details.requirements} />
                </SidebarBlock>

                <SidebarBlock icon={Gift} title="What we offer">
                  <BulletList items={details.perks} />
                </SidebarBlock>
              </div>
            </div>

            {otherJobs.length > 0 && (
              <div className="rounded-2xl border border-border bg-surface p-6">
                <p className="text-sm font-semibold">Similar roles in {job.team}</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {otherJobs.map((j) => (
                    <li key={j.slug}>
                      <Link to="/apply/$jobSlug" params={{ jobSlug: j.slug }}
                        className="cursor-pointer text-muted-foreground hover:text-brand">
                        {j.title} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>

          {/* Single-page form */}
          <form
            onSubmit={onSubmit}
            className="space-y-8 rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8 lg:col-span-2"
          >
            {/* About you */}
            <Section title="About you" hint="How can we reach you?">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" id="fullName" required error={errors.fullName}>
                  <Input id="fullName" value={data.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Jane Doe" />
                </Field>
                <Field label="Email" id="email" required error={errors.email}>
                  <Input id="email" type="email" value={data.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@example.com" />
                </Field>
                <Field label="WhatsApp / Phone" id="phone" required error={errors.phone}>
                  <Input id="phone" type="tel" value={data.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+62 812 3456 7890" />
                </Field>
                <Field label="Current location" id="location" required error={errors.location}>
                  <Input id="location" value={data.location} onChange={(e) => set("location", e.target.value)} placeholder="Jakarta, Indonesia" />
                </Field>
                <Field label="LinkedIn (optional)" id="linkedin" error={errors.linkedin}>
                  <Input id="linkedin" type="url" value={data.linkedin} onChange={(e) => set("linkedin", e.target.value)} placeholder="https://linkedin.com/in/yourname" />
                </Field>
              </div>
            </Section>

            {/* Experience */}
            <Section title="Most recent experience" hint="Optional — leave blank if you're starting your career.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Role / position" id="lastRole">
                  <Input id="lastRole" value={data.lastRole} onChange={(e) => set("lastRole", e.target.value)} placeholder="Frontend Developer" />
                </Field>
                <Field label="Company" id="lastCompany">
                  <Input id="lastCompany" value={data.lastCompany} onChange={(e) => set("lastCompany", e.target.value)} placeholder="PT Contoh Indonesia" />
                </Field>
                <Field label="From" id="lastWorkFrom">
                  <Input id="lastWorkFrom" type="month" value={data.lastWorkFrom} onChange={(e) => set("lastWorkFrom", e.target.value)} />
                </Field>
                <Field label="Until" id="lastWorkTo">
                  <Input id="lastWorkTo" type="month" value={data.lastWorkTo} onChange={(e) => set("lastWorkTo", e.target.value)} />
                </Field>
              </div>
            </Section>

            {/* Education */}
            <Section title="Education" hint="Your most recent qualification.">
              <RadioGroup
                value={data.educationType}
                onValueChange={(v) => set("educationType", v as "highschool" | "university")}
                className="flex flex-wrap gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="highschool" id="edu-hs" />
                  <Label htmlFor="edu-hs" className="cursor-pointer font-normal">SMA / SMK</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="university" id="edu-uni" />
                  <Label htmlFor="edu-uni" className="cursor-pointer font-normal">Universitas / Politeknik</Label>
                </div>
              </RadioGroup>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {data.educationType === "university" && (
                  <Field label="Level" id="educationLevel">
                    <select
                      id="educationLevel"
                      value={data.educationLevel}
                      onChange={(e) => set("educationLevel", e.target.value)}
                      className="h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm"
                    >
                      {educationLevels.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </Field>
                )}
                <Field
                  label={data.educationType === "highschool" ? "School name" : "University / Politeknik"}
                  id="educationInstitution" required error={errors.educationInstitution}
                >
                  <Input
                    id="educationInstitution"
                    value={data.educationInstitution}
                    onChange={(e) => set("educationInstitution", e.target.value)}
                    placeholder={data.educationType === "highschool" ? "SMK Telkom Malang" : "Universitas Indonesia"}
                  />
                </Field>
              </div>
            </Section>

            {/* CV + cover letter */}
            <Section title="CV & cover letter" hint="A short note helps us understand why you'd be a great fit.">
              <Field label="Resume / CV (PDF or DOCX, max 5MB)" id="resume" required error={errors.resumeName}>
                <label
                  htmlFor="resume"
                  className="flex cursor-pointer items-center justify-between rounded-md border border-dashed border-border bg-background px-4 py-6 text-sm transition-colors hover:border-brand/40 hover:bg-secondary/50"
                >
                  <span className="flex items-center gap-3">
                    <Upload className="h-4 w-4 text-brand" />
                    <span className={data.resumeName ? "text-foreground" : "text-muted-foreground"}>
                      {data.resumeName || "Click to upload PDF, DOC or DOCX"}
                    </span>
                  </span>
                  {data.resumeName && <Check className="h-4 w-4 text-brand" />}
                  <input
                    id="resume" type="file" accept=".pdf,.doc,.docx" className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]; if (!file) return;
                      if (file.size > 5 * 1024 * 1024) { toast.error("Resume must be under 5MB."); return; }
                      set("resumeName", file.name);
                    }}
                  />
                </label>
              </Field>

              <Field label="Cover letter (optional)" id="coverLetter">
                <Textarea
                  id="coverLetter" rows={6}
                  value={data.coverLetter}
                  onChange={(e) => set("coverLetter", e.target.value)}
                  placeholder="Tell us what excites you about this role and the impact you'd love to make…"
                />
                <p className="mt-1.5 text-xs text-muted-foreground">{data.coverLetter.length} / 1500 characters</p>
              </Field>
            </Section>

            {/* Agreement */}
            <div className="flex items-start gap-3 rounded-lg border border-border bg-surface/60 p-4">
              <Checkbox id="agreed" checked={data.agreed} onCheckedChange={(v) => set("agreed", v === true)} className="mt-0.5" />
              <label htmlFor="agreed" className="cursor-pointer text-sm text-foreground">
                I agree to the processing of my personal data for recruitment purposes, confirm the information provided is accurate, and accept the{" "}
                <Link to="/terms" target="_blank" className="font-semibold text-brand hover:underline">
                  Terms &amp; Conditions
                </Link>
                .
                {errors.agreed && <span className="mt-1 block text-xs text-destructive">{errors.agreed}</span>}
              </label>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Prefer email?{" "}
                <a href={`mailto:careers@zanscode.com?subject=Application: ${encodeURIComponent(job.title)}`} className="cursor-pointer font-semibold text-brand hover:underline">
                  <Mail className="mr-1 inline h-3 w-3" />careers@zanscode.com
                </a>
              </p>
              <Button type="submit" variant="brand" size="lg" disabled={submitting} className="cursor-pointer">
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : "Submit application"}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

function findJobId(slug: string): string | null {
  const found = getStoreSnapshot().jobs.find((j) => j.slug === slug);
  return found?.id ?? null;
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label, id, error, required, children,
}: { label: string; id: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <Label htmlFor={id}>{label}{required && <span className="ml-0.5 text-destructive">*</span>}</Label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function SidebarBlock({
  icon: Icon, title, children,
}: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-brand" />
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm text-muted-foreground">
      {items.map((it) => (
        <li key={it} className="flex gap-2 leading-relaxed">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

type RoleDetails = {
  overview: string;
  responsibilities: string[];
  requirements: string[];
  perks: string[];
};

function buildRoleDetails(job: { slug: string; title: string; team: string; level: string; type: string; summary: string }): RoleDetails {
  const stored = getStoreSnapshot().jobs.find((j) => j.slug === job.slug);
  const overview = stored?.description?.trim() || job.summary;

  const teamResponsibilities: Record<string, string[]> = {
    Engineering: [
      "Design, build and ship features end-to-end with the product team.",
      "Write clean, well-tested code and review pull requests from peers.",
      "Improve performance, reliability and developer experience over time.",
      "Collaborate with design to translate flows into polished UI.",
    ],
    Design: [
      "Own the end-to-end design process — research, flows, prototypes, hand-off.",
      "Partner with engineering and product to ship high-quality experiences.",
      "Contribute to and evolve our shared design system.",
      "Use data and user feedback to refine and iterate on your work.",
    ],
    Product: [
      "Own the roadmap and outcomes for your area of the product.",
      "Run discovery with customers and translate insights into bets.",
      "Write clear PRDs and partner closely with design and engineering.",
      "Measure launches and iterate based on impact, not output.",
    ],
    Operations: [
      "Own onboarding, adoption and ongoing success for assigned customers.",
      "Coordinate cross-functionally to remove blockers for the team.",
      "Build playbooks that scale repeatable operational excellence.",
      "Surface customer signals back to product and engineering.",
    ],
    Sales: [
      "Own the full sales cycle from prospecting through close.",
      "Build strategic relationships with key accounts across the region.",
      "Partner with marketing and product to shape go-to-market plays.",
      "Forecast accurately and keep the pipeline clean in our CRM.",
    ],
    HR: [
      "Own end-to-end recruitment for your assigned teams.",
      "Partner with hiring managers on role design and interview loops.",
      "Champion candidate experience at every touchpoint.",
      "Use data to improve speed, quality and diversity of hiring.",
    ],
    Finance: [
      "Own monthly close, reporting and key financial controls.",
      "Partner with team leads on budgets, forecasts and reviews.",
      "Build dashboards that make financial health easy to see.",
      "Keep us compliant across local tax and regulatory requirements.",
    ],
  };

  const teamRequirements: Record<string, string[]> = {
    Engineering: [
      "Strong fundamentals in TypeScript and modern web stacks.",
      "Experience shipping production software end-to-end.",
      "Care for code quality, testing and clear technical communication.",
      "Comfort working async across time zones.",
    ],
    Design: [
      "A portfolio that shows real shipped product work.",
      "Strong systems thinking and an eye for craft.",
      "Fluency in Figma and modern prototyping tools.",
      "Comfort collaborating directly with engineering and product.",
    ],
    Product: [
      "Track record of shipping impactful B2B or SaaS products.",
      "Strong discovery, writing and prioritization skills.",
      "Data fluency — comfortable in SQL or analytics tools.",
      "Excellent communication across technical and non-technical audiences.",
    ],
    Operations: [
      "Experience supporting customers or running internal operations.",
      "Sharp written and verbal communication.",
      "Bias for documentation and repeatable processes.",
      "Calm, organized and customer-obsessed under pressure.",
    ],
    Sales: [
      "Proven quota attainment in B2B SaaS, ideally enterprise.",
      "Strong discovery and value-based selling skills.",
      "Comfort navigating complex, multi-stakeholder deals.",
      "Disciplined CRM hygiene and forecasting habits.",
    ],
    HR: [
      "Experience in full-cycle technical or commercial recruiting.",
      "Strong sourcing skills and a quality-first mindset.",
      "Excellent stakeholder and candidate communication.",
      "Comfort using data to drive hiring decisions.",
    ],
    Finance: [
      "Solid accounting or FP&A foundation.",
      "Comfort with spreadsheets, BI tools and finance systems.",
      "High attention to detail and ownership of outcomes.",
      "Strong communication with non-finance partners.",
    ],
  };

  const intern = job.type === "Internship" || /intern/i.test(job.title);
  const baseReq = teamRequirements[job.team] ?? teamRequirements.Engineering;
  const requirements = intern
    ? [
        "Currently studying or a recent graduate in a related field.",
        "Eagerness to learn, ask questions and take ownership.",
        "Solid fundamentals in your craft — coursework or projects welcome.",
        "Available for a six-month structured program in Jakarta.",
      ]
    : baseReq;

  const responsibilities = teamResponsibilities[job.team] ?? teamResponsibilities.Engineering;

  const perks = [
    "Competitive salary and meaningful equity for full-time hires.",
    "Remote-friendly with hubs in Jakarta and Singapore.",
    "Learning budget for courses, books and conferences.",
    "Comprehensive health coverage and generous time off.",
  ];

  return { overview, responsibilities, requirements, perks };
}

