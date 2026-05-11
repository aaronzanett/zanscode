import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Menu as MenuIcon, LayoutGrid, ExternalLink, Eye, EyeOff, Layers, ArrowUp, ArrowDown, Lock, Info, ScrollText, Plus, Trash2 } from "lucide-react";
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
} from "@/lib/store";

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
        </TabsContent>
      </Tabs>
    </div>
  );
}
