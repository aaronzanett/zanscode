import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import productApps from "@/assets/product-apps.jpg";
import productPos from "@/assets/product-pos.jpg";
import productSaas from "@/assets/product-saas.jpg";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Zanscode" },
      { name: "description", content: "Ready-to-deploy products from Zanscode: ERP, POS, fleet, HR and more." },
      { property: "og:title", content: "Products — Zanscode" },
      { property: "og:description", content: "Ready-to-deploy products to power your operations." },
      { property: "og:image", content: productApps },
    ],
  }),
  component: ProductsPage,
});

const products = [
  { name: "Zanscode ERP", img: productApps, tag: "Enterprise", desc: "End-to-end resource planning across finance, inventory, sales and HR — for mid-market teams." },
  { name: "ZansPOS", img: productPos, tag: "Retail & F&B", desc: "Cloud-connected POS with offline mode, multi-outlet stock, loyalty and analytics." },
  { name: "Zanscode OS", img: productSaas, tag: "SaaS", desc: "Modular operating platform for modern businesses — CRM, projects, finance and BI in one." },
];

function ProductsPage() {
  return (
    <SiteLayout>
      <section className="bg-gradient-soft py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand">Products</span>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Battle-tested platforms, ready for your team.</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            A growing portfolio of finished products built on years of delivering technology for real operations.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
          {products.map((p, i) => (
            <article key={p.name} className={`grid items-center gap-10 rounded-3xl border border-border bg-card p-6 shadow-soft lg:grid-cols-2 lg:p-10 ${i % 2 ? "lg:[&>div:first-child]:order-2" : ""}`}>
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-brand opacity-15 blur-2xl" />
                <img src={p.img} alt={p.name} loading="lazy" className="relative w-full rounded-2xl border border-border" />
              </div>
              <div>
                <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-brand">{p.tag}</span>
                <h2 className="mt-3 text-3xl font-bold">{p.name}</h2>
                <p className="mt-3 text-muted-foreground">{p.desc}</p>
                <div className="mt-6 flex gap-3">
                  <Button asChild variant="brand"><Link to="/contact">Request demo</Link></Button>
                  <Button asChild variant="outline"><Link to="/saas">Learn more</Link></Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
