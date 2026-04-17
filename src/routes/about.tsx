import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import aboutTeam from "@/assets/about-team.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Zanscode" },
      { name: "description", content: "Zanscode is a technology startup helping businesses build well-organized systems." },
      { property: "og:title", content: "About Zanscode" },
      { property: "og:description", content: "Our mission, values and the team behind Zanscode." },
      { property: "og:image", content: aboutTeam },
    ],
  }),
  component: AboutPage,
});

const values = [
  { t: "Outcomes over output", d: "We measure ourselves by the results we deliver, not the hours we log." },
  { t: "Engineering excellence", d: "Modern stacks, clean code, automated tests — quality is non-negotiable." },
  { t: "Long-term partnership", d: "We stay with you well past launch, so technology keeps compounding value." },
];

function AboutPage() {
  return (
    <SiteLayout>
      <section className="bg-gradient-soft py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">About</span>
            <h1 className="mt-3 text-4xl font-bold sm:text-5xl">A technology partner for businesses that mean it.</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Zanscode is a startup on a mission to help organizations operate at their best by combining
              well-organized business systems with the latest technology — across web, mobile, desktop and cloud.
            </p>
          </div>
          <img src={aboutTeam} alt="The Zanscode team" loading="lazy" width={1280} height={800} className="rounded-2xl border border-border shadow-brand" />
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">What we believe</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <div key={v.t} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <h3 className="text-lg font-semibold">{v.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 text-center sm:grid-cols-3 sm:px-6 lg:px-8">
          {[{v: "2023", l: "Founded"}, {v: "30+", l: "Specialists"}, {v: "12", l: "Countries served"}].map((s) => (
            <div key={s.l}>
              <div className="text-4xl font-bold text-gradient-brand">{s.v}</div>
              <div className="mt-2 text-sm uppercase tracking-wider text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
