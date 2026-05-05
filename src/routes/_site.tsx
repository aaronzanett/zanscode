import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/_site")({
  component: SiteLayoutRoute,
  // Public pages: no full-screen "workspace loading" splash. Header/Footer
  // stay mounted; only the inner <Outlet /> swaps when navigating.
  pendingComponent: () => null,
});

function SiteLayoutRoute() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
