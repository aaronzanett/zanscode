import { createFileRoute, Link } from "@tanstack/react-router";
import { ScrollText, ArrowLeft } from "lucide-react";
import { useStore, useHydrate } from "@/lib/store";

export const Route = createFileRoute("/_site/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Zanscode" },
      {
        name: "description",
        content:
          "The terms and conditions that govern your use of Zanscode's website, products, services, and recruitment process.",
      },
      { property: "og:title", content: "Terms & Conditions — Zanscode" },
      {
        property: "og:description",
        content: "Read the terms governing Zanscode's services, applications, and platform use.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  useHydrate();
  const terms = useStore((s) => s.siteContent.legal.terms);
  const updated = new Date(terms.updatedAt);

  return (
    <div className="bg-background">
      <section className="border-b border-border bg-gradient-to-b from-secondary/30 to-background">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to home
          </Link>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <ScrollText className="h-3 w-3 text-brand" />
            Legal
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{terms.title}</h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">{terms.intro}</p>
          <p className="mt-4 text-xs text-muted-foreground">
            Last updated:{" "}
            <span className="font-medium text-foreground">
              {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(updated)}
            </span>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-1.5 text-sm">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                On this page
              </p>
              {terms.sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {s.heading}
                </a>
              ))}
            </nav>
          </aside>

          <article className="space-y-10">
            {terms.sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="text-xl font-semibold tracking-tight">{s.heading}</h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  {s.body.split(/\n+/).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            ))}

            <div className="rounded-xl border border-border bg-card p-5 text-sm">
              <p className="font-semibold">Questions about these terms?</p>
              <p className="mt-1 text-muted-foreground">
                Email us at{" "}
                <a href="mailto:legal@zanscode.com" className="font-medium text-brand hover:underline">
                  legal@zanscode.com
                </a>{" "}
                or visit our{" "}
                <Link to="/contact" className="font-medium text-brand hover:underline">
                  contact page
                </Link>
                .
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
