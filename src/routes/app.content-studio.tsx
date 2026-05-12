import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Menu as MenuIcon, LayoutGrid, ExternalLink, Eye, EyeOff, Layers, ArrowUp, ArrowDown, Lock, Info, ScrollText, Plus, Trash2, Home as HomeIcon, BadgeCheck, Quote as QuoteIcon, Megaphone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  useStore, useHydrate,
  updateSiteHero, updateSiteFooter,
  updateNavLink, reorderNav,
  updateFooterColumn, updateFooterLink, reorderFooterColumns, reorderFooterLinks,
  updateSection, updateSectionCard, reorderSections, reorderSectionCards,
  updateLegalTerms, updateLegalSection, addLegalSection, removeLegalSection, reorderLegalSections,
  updateSiteHome,
  addHomeItem, updateHomeItem, removeHomeItem, reorderHomeItems,
  addFooterBadge, updateFooterBadge, removeFooterBadge, reorderFooterBadges,
  updateFooterSocial,
} from "@/lib/store";
import type { IconName, SocialName } from "@/lib/store";

const INDUSTRY_ICONS: { value: IconName; label: string }[] = [
  { value: "shopping-bag", label: "Shopping bag" },
  { value: "truck", label: "Truck" },
  { value: "building", label: "Building" },
  { value: "stethoscope", label: "Stethoscope" },
  { value: "graduation-cap", label: "Graduation cap" },
  { value: "landmark", label: "Landmark" },
  { value: "rocket", label: "Rocket" },
  { value: "boxes", label: "Boxes" },
];

const SOCIAL_LABELS: Record<SocialName, string> = {
  linkedin: "LinkedIn",
  twitter: "Twitter",
  github: "GitHub",
  youtube: "YouTube",
};

export const Route = createFileRoute("/app/content-studio")({
  head: () => ({
    meta: [
      { title: "Content Studio — Zanscode OS" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ContentStudioPage,
});

function ReorderControls({ index, total, onMove }: { index: number; total: number; onMove: (from: number, to: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-brand hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Move up"
      >
        <ArrowUp className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        disabled={index === total - 1}
        onClick={() => onMove(index, index + 1)}
        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-brand hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Move down"
      >
        <ArrowDown className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function ContentStudioPage() {
  useHydrate();
  const site = useStore((s) => s.siteContent);

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
            Edit the copy of existing front-page blocks and reorder them. Structure is locked to keep the design consistent — changes save locally as you type.
          </p>
        </div>
        <Link
          to="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 self-start rounded-md border border-border bg-card px-3 py-2 text-xs font-medium transition-colors hover:border-brand hover:text-brand"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Preview live site
        </Link>
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
        <p>
          You can <strong className="text-foreground">edit text</strong>, <strong className="text-foreground">toggle visibility</strong>, and <strong className="text-foreground">reorder</strong> items.
          Adding or removing nav links, sections, cards and footer columns is intentionally disabled.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Nav links", value: site.nav.length, icon: MenuIcon },
          { label: "Sections", value: site.sections.length, icon: LayoutGrid },
          { label: "Total cards", value: site.sections.reduce((n, s) => n + s.cards.length, 0), icon: Layers },
          { label: "Footer columns", value: site.footer.columns.length, icon: Layers },
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

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="flex-wrap">
          <TabsTrigger value="hero"><Sparkles className="h-3.5 w-3.5" />Hero</TabsTrigger>
          <TabsTrigger value="nav"><MenuIcon className="h-3.5 w-3.5" />Navigation</TabsTrigger>
          <TabsTrigger value="sections"><LayoutGrid className="h-3.5 w-3.5" />Sections & cards</TabsTrigger>
          <TabsTrigger value="home"><HomeIcon className="h-3.5 w-3.5" />Home blocks</TabsTrigger>
          <TabsTrigger value="footer"><Layers className="h-3.5 w-3.5" />Footer</TabsTrigger>
          <TabsTrigger value="legal"><ScrollText className="h-3.5 w-3.5" />Legal</TabsTrigger>
        </TabsList>

        {/* Hero */}
        <TabsContent value="hero">
          <div className="grid gap-4 lg:grid-cols-5">
            <div className="space-y-4 rounded-xl border border-border bg-card p-5 lg:col-span-3">
              <h2 className="text-sm font-semibold">Hero copy</h2>
              <div className="space-y-2">
                <Label htmlFor="eyebrow">Eyebrow</Label>
                <Input id="eyebrow" value={site.hero.eyebrow} onChange={(e) => updateSiteHero({ eyebrow: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Headline</Label>
                <Textarea id="title" rows={2} value={site.hero.title} onChange={(e) => updateSiteHero({ title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Textarea id="subtitle" rows={3} value={site.hero.subtitle} onChange={(e) => updateSiteHero({ subtitle: e.target.value })} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Primary CTA label</Label>
                  <Input value={site.hero.primaryCta} onChange={(e) => updateSiteHero({ primaryCta: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Secondary CTA label</Label>
                  <Input value={site.hero.secondaryCta} onChange={(e) => updateSiteHero({ secondaryCta: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-gradient-to-br from-secondary/40 to-card p-6 lg:col-span-2">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Live preview</div>
              <div className="mt-4 space-y-3">
                <span className="inline-block rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand">
                  {site.hero.eyebrow}
                </span>
                <h3 className="text-2xl font-semibold leading-tight">{site.hero.title}</h3>
                <p className="text-sm text-muted-foreground">{site.hero.subtitle}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="rounded-md bg-gradient-brand px-3 py-1.5 text-xs font-semibold text-brand-foreground">{site.hero.primaryCta}</span>
                  <span className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold">{site.hero.secondaryCta}</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Navigation */}
        <TabsContent value="nav">
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold">Navbar links</h2>
                <p className="text-xs text-muted-foreground">Rename links or reorder them. Targets are locked to existing pages.</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Lock className="h-3 w-3" />
                Structure locked
              </span>
            </div>
            <ul className="divide-y divide-border">
              {site.nav.map((n, i) => (
                <li key={n.id} className="grid gap-2 px-4 py-3 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                  <Input placeholder="Label" value={n.label} onChange={(e) => updateNavLink(n.id, { label: e.target.value })} />
                  <span className="text-[11px] text-muted-foreground">{n.to}</span>
                  <ReorderControls index={i} total={site.nav.length} onMove={reorderNav} />
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        {/* Sections + cards */}
        <TabsContent value="sections" className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold">Front-page sections</h2>
            <p className="text-xs text-muted-foreground">Edit titles, descriptions and visibility. Reorder sections and the cards inside them.</p>
          </div>

          {site.sections.map((sec, sIdx) => (
            <div key={sec.id} className="rounded-xl border border-border bg-card">
              <div className="grid gap-2 border-b border-border px-4 py-3 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-center">
                <Input placeholder="Section title" value={sec.title} onChange={(e) => updateSection(sec.id, { title: e.target.value })} />
                <Input placeholder="Subtitle" value={sec.subtitle} onChange={(e) => updateSection(sec.id, { subtitle: e.target.value })} />
                <button
                  onClick={() => updateSection(sec.id, { visible: !sec.visible })}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-secondary"
                  title={sec.visible ? "Hide on site" : "Show on site"}
                >
                  {sec.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}
                  {sec.visible ? "Visible" : "Hidden"}
                </button>
                <ReorderControls index={sIdx} total={site.sections.length} onMove={reorderSections} />
              </div>

              <div className="space-y-2 p-4">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Cards ({sec.cards.length})
                </span>
                <div className="grid gap-2 sm:grid-cols-2">
                  {sec.cards.map((card, cIdx) => (
                    <div key={card.id} className="space-y-2 rounded-lg border border-border bg-background p-3">
                      <div className="flex items-center justify-between gap-2">
                        <Input className="h-8" placeholder="Card title" value={card.title} onChange={(e) => updateSectionCard(sec.id, card.id, { title: e.target.value })} />
                        <ReorderControls index={cIdx} total={sec.cards.length} onMove={(f, t) => reorderSectionCards(sec.id, f, t)} />
                      </div>
                      <Textarea rows={2} placeholder="Card description" value={card.description} onChange={(e) => updateSectionCard(sec.id, card.id, { description: e.target.value })} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Footer */}
        <TabsContent value="footer" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3 rounded-xl border border-border bg-card p-5">
              <h2 className="text-sm font-semibold">Brand block</h2>
              <div className="space-y-2">
                <Label>Tagline</Label>
                <Textarea rows={3} value={site.footer.tagline} onChange={(e) => updateSiteFooter({ tagline: e.target.value })} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={site.footer.email} onChange={(e) => updateSiteFooter({ email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={site.footer.phone} onChange={(e) => updateSiteFooter({ phone: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input value={site.footer.address} onChange={(e) => updateSiteFooter({ address: e.target.value })} />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Footer columns</h2>
                <span className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  Structure locked
                </span>
              </div>
              <div className="mt-3 space-y-3">
                {site.footer.columns.map((col, colIdx) => (
                  <div key={col.id} className="space-y-2 rounded-lg border border-border bg-background p-3">
                    <div className="flex items-center gap-2">
                      <Input className="h-8 font-semibold" placeholder="Column title" value={col.title} onChange={(e) => updateFooterColumn(col.id, { title: e.target.value })} />
                      <ReorderControls index={colIdx} total={site.footer.columns.length} onMove={reorderFooterColumns} />
                    </div>
                    <ul className="space-y-1.5">
                      {col.links.map((l, lIdx) => (
                        <li key={l.id} className="grid gap-1.5 sm:grid-cols-[1fr_auto]">
                          <Input className="h-8" placeholder="Label" value={l.label} onChange={(e) => updateFooterLink(col.id, l.id, { label: e.target.value })} />
                          <ReorderControls index={lIdx} total={col.links.length} onMove={(f, t) => reorderFooterLinks(col.id, f, t)} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Trust badges</h2>
                <button
                  type="button"
                  onClick={() => addFooterBadge()}
                  className="inline-flex items-center gap-1.5 rounded-md bg-gradient-brand px-2.5 py-1 text-[11px] font-semibold text-brand-foreground shadow-sm transition-opacity hover:opacity-90"
                >
                  <Plus className="h-3 w-3" /> Add
                </button>
              </div>
              <ul className="mt-3 space-y-1.5">
                {site.footer.badges.map((b, i) => (
                  <li key={b.id} className="grid grid-cols-[1fr_auto_auto] gap-1.5">
                    <Input className="h-8" placeholder="Badge label" value={b.label} onChange={(e) => updateFooterBadge(b.id, { label: e.target.value })} />
                    <ReorderControls index={i} total={site.footer.badges.length} onMove={reorderFooterBadges} />
                    <button
                      type="button"
                      onClick={() => removeFooterBadge(b.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                      aria-label="Delete badge"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Social links</h2>
                <span className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <Lock className="h-3 w-3" /> Structure locked
                </span>
              </div>
              <ul className="mt-3 space-y-1.5">
                {site.footer.socials.map((s) => (
                  <li key={s.id} className="grid grid-cols-[6rem_1fr] items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">{SOCIAL_LABELS[s.name]}</span>
                    <Input className="h-8" placeholder="https://…" value={s.href} onChange={(e) => updateFooterSocial(s.id, { href: e.target.value })} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>

        {/* Home blocks */}
        <TabsContent value="home" className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold">Homepage editorial blocks</h2>
            <p className="text-xs text-muted-foreground">Edit every standalone block on the home page — copy, lists, CTAs and the closing banner.</p>
          </div>

          {/* Stats */}
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h3 className="text-sm font-semibold">Hero stats</h3>
                <p className="text-xs text-muted-foreground">Big numbers shown beneath the hero copy.</p>
              </div>
              <button type="button" onClick={() => addHomeItem("stats")} className="inline-flex items-center gap-1.5 rounded-md bg-gradient-brand px-2.5 py-1 text-[11px] font-semibold text-brand-foreground"><Plus className="h-3 w-3" /> Add</button>
            </div>
            <ul className="divide-y divide-border">
              {site.home.stats.map((s, i) => (
                <li key={s.id} className="grid items-center gap-2 px-4 py-3 sm:grid-cols-[8rem_1fr_auto_auto]">
                  <Input className="h-8" placeholder="120+" value={s.value} onChange={(e) => updateHomeItem("stats", s.id, { value: e.target.value })} />
                  <Input className="h-8" placeholder="Systems delivered" value={s.label} onChange={(e) => updateHomeItem("stats", s.id, { label: e.target.value })} />
                  <ReorderControls index={i} total={site.home.stats.length} onMove={(f, t) => reorderHomeItems("stats", f, t)} />
                  <button type="button" onClick={() => removeHomeItem("stats", s.id)} className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:border-destructive hover:text-destructive" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                </li>
              ))}
            </ul>
          </div>

          {/* Trusted */}
          <div className="rounded-xl border border-border bg-card">
            <div className="space-y-2 border-b border-border px-4 py-3">
              <h3 className="text-sm font-semibold">Trusted-by marquee</h3>
              <Input placeholder="Headline above the marquee" value={site.home.trustedHeadline} onChange={(e) => updateSiteHome({ trustedHeadline: e.target.value })} />
            </div>
            <div className="flex items-center justify-between px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Brands ({site.home.trusted.length})</span>
              <button type="button" onClick={() => addHomeItem("trusted")} className="inline-flex items-center gap-1.5 rounded-md bg-gradient-brand px-2.5 py-1 text-[11px] font-semibold text-brand-foreground"><Plus className="h-3 w-3" /> Add</button>
            </div>
            <ul className="grid gap-2 p-4 sm:grid-cols-2">
              {site.home.trusted.map((t, i) => (
                <li key={t.id} className="grid grid-cols-[1fr_auto_auto] gap-1.5">
                  <Input className="h-8" placeholder="Brand name" value={t.name} onChange={(e) => updateHomeItem("trusted", t.id, { name: e.target.value })} />
                  <ReorderControls index={i} total={site.home.trusted.length} onMove={(f, x) => reorderHomeItems("trusted", f, x)} />
                  <button type="button" onClick={() => removeHomeItem("trusted", t.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:border-destructive hover:text-destructive" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div className="rounded-xl border border-border bg-card">
            <div className="space-y-3 border-b border-border px-4 py-3">
              <h3 className="text-sm font-semibold">Industries band</h3>
              <div className="grid gap-2 sm:grid-cols-3">
                <Input placeholder="Eyebrow" value={site.home.industriesEyebrow} onChange={(e) => updateSiteHome({ industriesEyebrow: e.target.value })} />
                <Input placeholder="Title" value={site.home.industriesTitle} onChange={(e) => updateSiteHome({ industriesTitle: e.target.value })} />
                <Input placeholder="Subtitle" value={site.home.industriesSubtitle} onChange={(e) => updateSiteHome({ industriesSubtitle: e.target.value })} />
              </div>
              <p className="text-[11px] text-muted-foreground">The last word of the title becomes the italicised highlight.</p>
            </div>
            <div className="flex items-center justify-between px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Industries ({site.home.industries.length})</span>
              <button type="button" onClick={() => addHomeItem("industries")} className="inline-flex items-center gap-1.5 rounded-md bg-gradient-brand px-2.5 py-1 text-[11px] font-semibold text-brand-foreground"><Plus className="h-3 w-3" /> Add</button>
            </div>
            <ul className="grid gap-2 p-4 sm:grid-cols-2">
              {site.home.industries.map((it, i) => (
                <li key={it.id} className="grid grid-cols-[1fr_9rem_auto_auto] gap-1.5">
                  <Input className="h-8" placeholder="Industry name" value={it.name} onChange={(e) => updateHomeItem("industries", it.id, { name: e.target.value })} />
                  <select
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                    value={it.icon}
                    onChange={(e) => updateHomeItem("industries", it.id, { icon: e.target.value as IconName })}
                  >
                    {INDUSTRY_ICONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <ReorderControls index={i} total={site.home.industries.length} onMove={(f, x) => reorderHomeItems("industries", f, x)} />
                  <button type="button" onClick={() => removeHomeItem("industries", it.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:border-destructive hover:text-destructive" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                </li>
              ))}
            </ul>
          </div>

          {/* Pull quote */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold"><QuoteIcon className="h-3.5 w-3.5 text-brand" /> Pull quote</h3>
            <Textarea rows={3} placeholder="Quote text" value={site.home.pullQuote} onChange={(e) => updateSiteHome({ pullQuote: e.target.value })} />
            <div className="grid gap-2 sm:grid-cols-2">
              <Input placeholder="Author name" value={site.home.pullQuoteName} onChange={(e) => updateSiteHome({ pullQuoteName: e.target.value })} />
              <Input placeholder="Author role" value={site.home.pullQuoteRole} onChange={(e) => updateSiteHome({ pullQuoteRole: e.target.value })} />
            </div>
          </div>

          {/* SaaS feature */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h3 className="text-sm font-semibold">SaaS feature section</h3>
            <div className="grid gap-2 sm:grid-cols-3">
              <Input placeholder="Eyebrow" value={site.home.saasEyebrow} onChange={(e) => updateSiteHome({ saasEyebrow: e.target.value })} />
              <Input className="sm:col-span-2" placeholder="Title — last 2 words become the highlight" value={site.home.saasTitle} onChange={(e) => updateSiteHome({ saasTitle: e.target.value })} />
            </div>
            <Textarea rows={2} placeholder="Subtitle" value={site.home.saasSubtitle} onChange={(e) => updateSiteHome({ saasSubtitle: e.target.value })} />

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Bullets ({site.home.saasBullets.length})</span>
              <button type="button" onClick={() => addHomeItem("saasBullets")} className="inline-flex items-center gap-1.5 rounded-md bg-gradient-brand px-2.5 py-1 text-[11px] font-semibold text-brand-foreground"><Plus className="h-3 w-3" /> Add</button>
            </div>
            <ul className="space-y-1.5">
              {site.home.saasBullets.map((b, i) => (
                <li key={b.id} className="grid grid-cols-[1fr_auto_auto] gap-1.5">
                  <Input className="h-8" value={b.text} onChange={(e) => updateHomeItem("saasBullets", b.id, { text: e.target.value })} />
                  <ReorderControls index={i} total={site.home.saasBullets.length} onMove={(f, x) => reorderHomeItems("saasBullets", f, x)} />
                  <button type="button" onClick={() => removeHomeItem("saasBullets", b.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:border-destructive hover:text-destructive" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                </li>
              ))}
            </ul>

            <div className="grid gap-2 pt-2 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Primary CTA</Label>
                <Input placeholder="Label" value={site.home.saasPrimaryCta} onChange={(e) => updateSiteHome({ saasPrimaryCta: e.target.value })} />
                <Input placeholder="Link target (e.g. /products)" value={site.home.saasPrimaryCtaTo} onChange={(e) => updateSiteHome({ saasPrimaryCtaTo: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Secondary CTA</Label>
                <Input placeholder="Label" value={site.home.saasSecondaryCta} onChange={(e) => updateSiteHome({ saasSecondaryCta: e.target.value })} />
                <Input placeholder="Link target (e.g. /contact)" value={site.home.saasSecondaryCtaTo} onChange={(e) => updateSiteHome({ saasSecondaryCtaTo: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="rounded-xl border border-border bg-card">
            <div className="space-y-3 border-b border-border px-4 py-3">
              <h3 className="text-sm font-semibold">Testimonials</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                <Input placeholder="Eyebrow" value={site.home.testimonialsEyebrow} onChange={(e) => updateSiteHome({ testimonialsEyebrow: e.target.value })} />
                <Input placeholder="Title — last word becomes the highlight" value={site.home.testimonialsTitle} onChange={(e) => updateSiteHome({ testimonialsTitle: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Quotes ({site.home.testimonials.length})</span>
              <button type="button" onClick={() => addHomeItem("testimonials")} className="inline-flex items-center gap-1.5 rounded-md bg-gradient-brand px-2.5 py-1 text-[11px] font-semibold text-brand-foreground"><Plus className="h-3 w-3" /> Add</button>
            </div>
            <ul className="space-y-3 p-4">
              {site.home.testimonials.map((t, i) => (
                <li key={t.id} className="space-y-2 rounded-lg border border-border bg-background p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Quote {i + 1}</span>
                    <div className="ml-auto flex items-center gap-1">
                      <ReorderControls index={i} total={site.home.testimonials.length} onMove={(f, x) => reorderHomeItems("testimonials", f, x)} />
                      <button type="button" onClick={() => removeHomeItem("testimonials", t.id)} className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:border-destructive hover:text-destructive" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                  <Textarea rows={2} placeholder="Quote" value={t.quote} onChange={(e) => updateHomeItem("testimonials", t.id, { quote: e.target.value })} />
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Input className="h-8" placeholder="Name" value={t.name} onChange={(e) => updateHomeItem("testimonials", t.id, { name: e.target.value })} />
                    <Input className="h-8" placeholder="Role / company" value={t.role} onChange={(e) => updateHomeItem("testimonials", t.id, { role: e.target.value })} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Closing CTA */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold"><Megaphone className="h-3.5 w-3.5 text-brand" /> Closing CTA banner</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Title</Label>
                <Input value={site.home.closingTitle} onChange={(e) => updateSiteHome({ closingTitle: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Italicised highlight (second line)</Label>
                <Input value={site.home.closingHighlight} onChange={(e) => updateSiteHome({ closingHighlight: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Textarea rows={3} value={site.home.closingDescription} onChange={(e) => updateSiteHome({ closingDescription: e.target.value })} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="legal" className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">Terms &amp; Conditions</h2>
              <p className="text-xs text-muted-foreground">
                This content is published at <Link to="/terms" target="_blank" className="font-medium text-brand hover:underline">/terms</Link> and linked from every agreement checkbox on the site.
              </p>
            </div>
            <Link
              to="/terms"
              target="_blank"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium transition-colors hover:border-brand hover:text-brand"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View public page
            </Link>
          </div>

          <div className="space-y-3 rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold">Document header</h3>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={site.legal.terms.title} onChange={(e) => updateLegalTerms({ title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Intro</Label>
              <Textarea rows={3} value={site.legal.terms.intro} onChange={(e) => updateLegalTerms({ intro: e.target.value })} />
            </div>
            <p className="text-xs text-muted-foreground">
              Last updated:{" "}
              <span className="font-medium text-foreground">
                {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(site.legal.terms.updatedAt))}
              </span>
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h3 className="text-sm font-semibold">Sections</h3>
                <p className="text-xs text-muted-foreground">Each section becomes a numbered block on the public Terms page.</p>
              </div>
              <button
                type="button"
                onClick={() => addLegalSection()}
                className="inline-flex items-center gap-1.5 rounded-md bg-gradient-brand px-3 py-1.5 text-xs font-semibold text-brand-foreground shadow-sm transition-opacity hover:opacity-90"
              >
                <Plus className="h-3.5 w-3.5" /> Add section
              </button>
            </div>
            <ul className="divide-y divide-border">
              {site.legal.terms.sections.map((sec, i) => (
                <li key={sec.id} className="space-y-2 p-4">
                  <div className="flex items-center gap-2">
                    <Input
                      className="font-semibold"
                      placeholder="Section heading"
                      value={sec.heading}
                      onChange={(e) => updateLegalSection(sec.id, { heading: e.target.value })}
                    />
                    <ReorderControls index={i} total={site.legal.terms.sections.length} onMove={reorderLegalSections} />
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete "${sec.heading}"?`)) removeLegalSection(sec.id);
                      }}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                      aria-label="Delete section"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <Textarea
                    rows={4}
                    placeholder="Section body — use blank lines to separate paragraphs."
                    value={sec.body}
                    onChange={(e) => updateLegalSection(sec.id, { body: e.target.value })}
                  />
                </li>
              ))}
              {site.legal.terms.sections.length === 0 && (
                <li className="px-4 py-8 text-center text-xs text-muted-foreground">No sections yet — add one to get started.</li>
              )}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
