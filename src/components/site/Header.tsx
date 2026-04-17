import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/zanscode-logo.png";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/products", label: "Products" },
  { to: "/saas", label: "SaaS" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="Zanscode" className="h-10 w-auto md:h-11" />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              preload="render"
              className="relative rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
              activeProps={{
                className:
                  "relative rounded-full px-4 py-2 text-sm font-semibold text-foreground bg-secondary/70 active",
              }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link to="/app">Open App</Link>
          </Button>
          <Button asChild size="sm" variant="brand">
            <Link to="/contact">Get a quote</Link>
          </Button>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="space-y-1 px-4 py-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
                activeProps={{ className: "block rounded-md px-3 py-2 text-sm font-semibold text-foreground bg-secondary" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
            <Link to="/app" onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm font-semibold text-foreground">
              Open App
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
