import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles, LayoutTemplate, Megaphone, Image as ImageIcon, Star, HelpCircle,
  Newspaper, ExternalLink, Pencil, Eye, EyeOff, Plus, GripVertical, Save,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/content-studio")({
  head: () => ({
    meta: [
      { title: "Content Studio — Zanscode OS" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ContentStudioPage,
});

type Section = {
  id: string;
  name: string;
  status: "Published" | "Draft";
  visible: boolean;
  updated: string;
};

const SECTIONS: Section[] = [
  { id: "hero", name: "Hero / Headline", status: "Published", visible: true, updated: "Today, 10:24" },
  { id: "services", name: "Services Showcase", status: "Published", visible: true, updated: "Yesterday" },
  { id: "stats", name: "Impact Stats", status: "Published", visible: true, updated: "2 days ago" },
  { id: "testimonials", name: "Testimonials", status: "Draft", visible: false, updated: "3 days ago" },
  { id: "cta", name: "Bottom CTA", status: "Published", visible: true, updated: "Last week" },
];

const ANNOUNCEMENTS = [
  { id: "a1", title: "Launching new Cloud tier", placement: "Top banner", status: "Live", until: "May 5, 2026" },
  { id: "a2", title: "Ramadan operating hours", placement: "Footer note", status: "Scheduled", until: "Apr 30, 2026" },
];

const FAQS = [
  { id: "f1", q: "Do you work with international clients?", a: "Yes — we serve clients across Asia, Europe, and the US.", live: true },
  { id: "f2", q: "What's the typical project timeline?", a: "Most engagements range from 4 to 12 weeks depending on scope.", live: true },
  { id: "f3", q: "Do you offer maintenance plans?", a: "Yes, monthly retainers are available after launch.", live: false },
];

const MEDIA = [
  { id: "m1", name: "hero-cover.jpg", size: "1.4 MB", used: "Hero" },
  { id: "m2", name: "team-2026.jpg", size: "820 KB", used: "About" },
  { id: "m3", name: "case-acme.png", size: "640 KB", used: "Portfolio" },
  { id: "m4", name: "og-default.png", size: "180 KB", used: "Social share" },
];

function StatusDot({ live }: { live: boolean }) {
  return (
    <span
      className={cn(
        "inline-block h-1.5 w-1.5 rounded-full",
        live ? "bg-emerald-500" : "bg-muted-foreground/40",
      )}
    />
  );
}

function ContentStudioPage() {
  const [sections, setSections] = useState(SECTIONS);
  const [hero, setHero] = useState({
    eyebrow: "Defined by excellence.",
    title: "Software, design & systems that move your business forward.",
    subtitle: "Zanscode partners with ambitious teams to ship products that perform — beautifully.",
    primaryCta: "Start a project",
    secondaryCta: "View our work",
  });
  const [draftDirty, setDraftDirty] = useState(false);

  const toggleVisible = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)),
    );
    setDraftDirty(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3 w-3 text-brand" />
            Front-page workspace
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Content Studio</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Curate everything that appears on the public Zanscode website — sections, hero copy,
            announcements, testimonials, FAQs and media — from one place.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium transition-colors hover:border-brand hover:text-brand"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Preview live site
          </Link>
          <Button size="sm" disabled={!draftDirty} onClick={() => setDraftDirty(false)}>
            <Save className="h-3.5 w-3.5" />
            Publish changes
          </Button>
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Sections live", value: sections.filter((s) => s.visible).length, icon: LayoutTemplate },
          { label: "Announcements", value: ANNOUNCEMENTS.length, icon: Megaphone },
          { label: "FAQs", value: FAQS.length, icon: HelpCircle },
          { label: "Media assets", value: MEDIA.length, icon: ImageIcon },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <s.icon className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="mt-2 text-2xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="sections" className="space-y-4">
        <TabsList className="flex-wrap">
          <TabsTrigger value="sections"><LayoutTemplate className="h-3.5 w-3.5" />Sections</TabsTrigger>
          <TabsTrigger value="hero"><Sparkles className="h-3.5 w-3.5" />Hero copy</TabsTrigger>
          <TabsTrigger value="announcements"><Megaphone className="h-3.5 w-3.5" />Announcements</TabsTrigger>
          <TabsTrigger value="testimonials"><Star className="h-3.5 w-3.5" />Testimonials</TabsTrigger>
          <TabsTrigger value="faqs"><HelpCircle className="h-3.5 w-3.5" />FAQs</TabsTrigger>
          <TabsTrigger value="media"><ImageIcon className="h-3.5 w-3.5" />Media</TabsTrigger>
        </TabsList>

        {/* Sections */}
        <TabsContent value="sections" className="space-y-3">
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold">Front-page sections</h2>
                <p className="text-xs text-muted-foreground">Drag to reorder. Toggle visibility per section.</p>
              </div>
              <Button size="sm" variant="outline">
                <Plus className="h-3.5 w-3.5" />
                Add section
              </Button>
            </div>
            <ul className="divide-y divide-border">
              {sections.map((s) => (
                <li key={s.id} className="flex items-center gap-3 px-4 py-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground/60" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{s.name}</span>
                      <Badge variant={s.status === "Published" ? "default" : "secondary"} className="text-[10px]">
                        {s.status}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">Updated {s.updated}</p>
                  </div>
                  <button
                    onClick={() => toggleVisible(s.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                      s.visible
                        ? "text-foreground hover:bg-secondary"
                        : "text-muted-foreground hover:bg-secondary",
                    )}
                  >
                    {s.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    {s.visible ? "Visible" : "Hidden"}
                  </button>
                  <Button size="sm" variant="ghost">
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        {/* Hero */}
        <TabsContent value="hero">
          <div className="grid gap-4 lg:grid-cols-5">
            <div className="space-y-4 rounded-xl border border-border bg-card p-5 lg:col-span-3">
              <h2 className="text-sm font-semibold">Hero copy</h2>
              <div className="space-y-2">
                <Label htmlFor="eyebrow">Eyebrow</Label>
                <Input id="eyebrow" value={hero.eyebrow} onChange={(e) => { setHero({ ...hero, eyebrow: e.target.value }); setDraftDirty(true); }} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Headline</Label>
                <Textarea id="title" rows={2} value={hero.title} onChange={(e) => { setHero({ ...hero, title: e.target.value }); setDraftDirty(true); }} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Textarea id="subtitle" rows={3} value={hero.subtitle} onChange={(e) => { setHero({ ...hero, subtitle: e.target.value }); setDraftDirty(true); }} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cta1">Primary CTA</Label>
                  <Input id="cta1" value={hero.primaryCta} onChange={(e) => { setHero({ ...hero, primaryCta: e.target.value }); setDraftDirty(true); }} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta2">Secondary CTA</Label>
                  <Input id="cta2" value={hero.secondaryCta} onChange={(e) => { setHero({ ...hero, secondaryCta: e.target.value }); setDraftDirty(true); }} />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-gradient-to-br from-secondary/40 to-card p-6 lg:col-span-2">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Live preview</div>
              <div className="mt-4 space-y-3">
                <span className="inline-block rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand">
                  {hero.eyebrow}
                </span>
                <h3 className="text-2xl font-semibold leading-tight">{hero.title}</h3>
                <p className="text-sm text-muted-foreground">{hero.subtitle}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="rounded-md bg-gradient-brand px-3 py-1.5 text-xs font-semibold text-brand-foreground">{hero.primaryCta}</span>
                  <span className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold">{hero.secondaryCta}</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Announcements */}
        <TabsContent value="announcements">
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold">Announcements & banners</h2>
                <p className="text-xs text-muted-foreground">Promote launches, hours, or notices on the public site.</p>
              </div>
              <Button size="sm">
                <Plus className="h-3.5 w-3.5" />
                New announcement
              </Button>
            </div>
            <ul className="divide-y divide-border">
              {ANNOUNCEMENTS.map((a) => (
                <li key={a.id} className="flex items-center gap-3 px-4 py-3">
                  <Megaphone className="h-4 w-4 text-brand" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{a.title}</span>
                      <Badge variant={a.status === "Live" ? "default" : "secondary"} className="text-[10px]">{a.status}</Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{a.placement} · until {a.until}</p>
                  </div>
                  <Switch defaultChecked={a.status === "Live"} />
                  <Button size="sm" variant="ghost"><Pencil className="h-3.5 w-3.5" /></Button>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        {/* Testimonials */}
        <TabsContent value="testimonials">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { name: "Sari W.", role: "CTO, Acme Corp", quote: "Zanscode delivered ahead of schedule and the polish is unreal." },
              { name: "Mateo R.", role: "Founder, Beta Studio", quote: "They feel like an in-house team. Communication is exceptional." },
              { name: "Anya K.", role: "Head of Product, Nimbus", quote: "Best technical partner we've worked with in years." },
            ].map((t) => (
              <div key={t.name} className="rounded-xl border border-border bg-card p-4">
                <Star className="h-4 w-4 text-amber-500" />
                <p className="mt-2 text-sm leading-relaxed">"{t.quote}"</p>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                  <Button size="sm" variant="ghost"><Pencil className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            ))}
            <button className="flex min-h-[140px] items-center justify-center rounded-xl border border-dashed border-border bg-card/50 text-sm font-medium text-muted-foreground transition-colors hover:border-brand hover:text-brand">
              <Plus className="mr-1 h-4 w-4" />
              Add testimonial
            </button>
          </div>
        </TabsContent>

        {/* FAQs */}
        <TabsContent value="faqs">
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold">Frequently asked questions</h2>
              <Button size="sm"><Plus className="h-3.5 w-3.5" />Add FAQ</Button>
            </div>
            <ul className="divide-y divide-border">
              {FAQS.map((f) => (
                <li key={f.id} className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1.5"><StatusDot live={f.live} /></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{f.q}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{f.a}</p>
                    </div>
                    <Switch defaultChecked={f.live} />
                    <Button size="sm" variant="ghost"><Pencil className="h-3.5 w-3.5" /></Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        {/* Media */}
        <TabsContent value="media">
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold">Media library</h2>
                <p className="text-xs text-muted-foreground">Images and assets used across the public site.</p>
              </div>
              <Button size="sm"><Plus className="h-3.5 w-3.5" />Upload</Button>
            </div>
            <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
              {MEDIA.map((m) => (
                <div key={m.id} className="group overflow-hidden rounded-lg border border-border bg-background transition-colors hover:border-brand">
                  <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-secondary to-secondary/40">
                    <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <div className="px-3 py-2">
                    <p className="truncate text-xs font-medium">{m.name}</p>
                    <p className="mt-0.5 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{m.size}</span>
                      <span className="rounded-full bg-secondary px-1.5 py-0.5">{m.used}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* SEO mini panel */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <Newspaper className="h-4 w-4 text-brand" />
          <h2 className="text-sm font-semibold">SEO & social preview</h2>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Controls how the front page appears on search engines and shared links.</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="seo-title">Meta title</Label>
              <Input id="seo-title" defaultValue="Zanscode — Defined by excellence." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seo-desc">Meta description</Label>
              <Textarea id="seo-desc" rows={3} defaultValue="Software, design and systems that move ambitious teams forward." />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-background p-4">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Search preview</div>
            <div className="mt-2">
              <div className="text-xs text-emerald-700 dark:text-emerald-400">zanscode.com</div>
              <div className="mt-0.5 text-base font-medium text-blue-700 dark:text-blue-400">Zanscode — Defined by excellence.</div>
              <div className="mt-1 text-xs text-muted-foreground">Software, design and systems that move ambitious teams forward.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
