import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Menu as MenuIcon, LayoutGrid, Plus, Trash2, ExternalLink, Eye, EyeOff, Layers, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  useStore, useHydrate,
  updateSiteHero, updateSiteFooter,
  addNavLink, updateNavLink, removeNavLink,
  addFooterColumn, updateFooterColumn, removeFooterColumn,
  addFooterLink, updateFooterLink, removeFooterLink,
  addSection, updateSection, removeSection,
  addSectionCard, updateSectionCard, removeSectionCard,
} from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/app/content-studio")({
  head: () => ({
    meta: [
      { title: "Content Studio — Zanscode OS" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ContentStudioPage,
});

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
            Edit the public site — navigation, hero, sections with cards, and footer. Saved locally to your browser in real time.
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
          <Button size="sm" onClick={() => toast.success("All changes are saved automatically")}>
            <Save className="h-3.5 w-3.5" />
            Saved
          </Button>
        </div>
      </div>

      {/* Stat strip */}
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
                  <Label>Primary CTA link</Label>
                  <Input value={site.hero.primaryCtaTo} onChange={(e) => updateSiteHero({ primaryCtaTo: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Secondary CTA label</Label>
                  <Input value={site.hero.secondaryCta} onChange={(e) => updateSiteHero({ secondaryCta: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Secondary CTA link</Label>
                  <Input value={site.hero.secondaryCtaTo} onChange={(e) => updateSiteHero({ secondaryCtaTo: e.target.value })} />
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
                <p className="text-xs text-muted-foreground">Control the top navigation on every public page.</p>
              </div>
              <Button size="sm" onClick={() => addNavLink("New link", "/")}>
                <Plus className="h-3.5 w-3.5" />
                Add link
              </Button>
            </div>
            <ul className="divide-y divide-border">
              {site.nav.map((n) => (
                <li key={n.id} className="grid gap-2 px-4 py-3 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
                  <Input placeholder="Label" value={n.label} onChange={(e) => updateNavLink(n.id, { label: e.target.value })} />
                  <Input placeholder="/path" value={n.to} onChange={(e) => updateNavLink(n.id, { to: e.target.value })} />
                  <Button size="sm" variant="ghost" onClick={() => removeNavLink(n.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </li>
              ))}
              {site.nav.length === 0 && (
                <li className="px-4 py-6 text-center text-xs text-muted-foreground">No navigation links yet.</li>
              )}
            </ul>
          </div>
        </TabsContent>

        {/* Sections + cards */}
        <TabsContent value="sections" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">Front-page sections</h2>
              <p className="text-xs text-muted-foreground">Each section can hold a list of cards rendered on the home page.</p>
            </div>
            <Button size="sm" onClick={addSection}>
              <Plus className="h-3.5 w-3.5" />
              Add section
            </Button>
          </div>

          {site.sections.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              No sections yet. Add your first one.
            </div>
          )}

          {site.sections.map((sec) => (
            <div key={sec.id} className="rounded-xl border border-border bg-card">
              <div className="grid gap-2 border-b border-border px-4 py-3 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-center">
                <Input placeholder="Section title" value={sec.title} onChange={(e) => updateSection(sec.id, { title: e.target.value })} />
                <Input placeholder="Subtitle (optional)" value={sec.subtitle} onChange={(e) => updateSection(sec.id, { subtitle: e.target.value })} />
                <button
                  onClick={() => updateSection(sec.id, { visible: !sec.visible })}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-secondary"
                  title={sec.visible ? "Hide on site" : "Show on site"}
                >
                  {sec.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}
                  {sec.visible ? "Visible" : "Hidden"}
                </button>
                <Button size="sm" variant="ghost" onClick={() => removeSection(sec.id)}>
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </div>

              <div className="space-y-2 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Cards ({sec.cards.length})
                  </span>
                  <Button size="sm" variant="outline" onClick={() => addSectionCard(sec.id)}>
                    <Plus className="h-3.5 w-3.5" />
                    Add card
                  </Button>
                </div>
                {sec.cards.length === 0 ? (
                  <p className="rounded-md border border-dashed border-border bg-background px-3 py-4 text-center text-xs text-muted-foreground">
                    No cards. Add one to display in this section.
                  </p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {sec.cards.map((card) => (
                      <div key={card.id} className="space-y-2 rounded-lg border border-border bg-background p-3">
                        <div className="flex items-center justify-between gap-2">
                          <Input className="h-8" placeholder="Card title" value={card.title} onChange={(e) => updateSectionCard(sec.id, card.id, { title: e.target.value })} />
                          <Button size="sm" variant="ghost" onClick={() => removeSectionCard(sec.id, card.id)}>
                            <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                        </div>
                        <Textarea rows={2} placeholder="Card description" value={card.description} onChange={(e) => updateSectionCard(sec.id, card.id, { description: e.target.value })} />
                      </div>
                    ))}
                  </div>
                )}
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
                <Button size="sm" onClick={addFooterColumn}>
                  <Plus className="h-3.5 w-3.5" />
                  Add column
                </Button>
              </div>
              <div className="mt-3 space-y-3">
                {site.footer.columns.map((col) => (
                  <div key={col.id} className="space-y-2 rounded-lg border border-border bg-background p-3">
                    <div className="flex items-center gap-2">
                      <Input className="h-8 font-semibold" placeholder="Column title" value={col.title} onChange={(e) => updateFooterColumn(col.id, { title: e.target.value })} />
                      <Button size="sm" variant="ghost" onClick={() => removeFooterColumn(col.id)}>
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </div>
                    <ul className="space-y-1.5">
                      {col.links.map((l) => (
                        <li key={l.id} className="grid gap-1.5 sm:grid-cols-[1fr_1fr_auto]">
                          <Input className="h-8" placeholder="Label" value={l.label} onChange={(e) => updateFooterLink(col.id, l.id, { label: e.target.value })} />
                          <Input className="h-8" placeholder="/path" value={l.to} onChange={(e) => updateFooterLink(col.id, l.id, { to: e.target.value })} />
                          <Button size="sm" variant="ghost" onClick={() => removeFooterLink(col.id, l.id)}>
                            <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                    <Button size="sm" variant="outline" className="w-full" onClick={() => addFooterLink(col.id)}>
                      <Plus className="h-3.5 w-3.5" />
                      Add link
                    </Button>
                  </div>
                ))}
                {site.footer.columns.length === 0 && (
                  <p className="rounded-md border border-dashed border-border bg-background px-3 py-4 text-center text-xs text-muted-foreground">
                    No footer columns yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
