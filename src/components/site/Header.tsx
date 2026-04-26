import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import logo from "@/assets/zanscode-logo.png";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
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

        <div className="hidden items-center gap-1 md:flex">
          <Link
            to="/staff/login"
            className="rounded-full px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Staff sign in
          </Link>
          <Button asChild size="sm" variant="brand" className="group">
            <Link to="/contact">
              Book a demo
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>

        <button
          className={cn(
            "relative inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary md:hidden",
            open && "bg-secondary",
          )}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <Menu
            className={cn(
              "absolute h-6 w-6 transition-all duration-300",
              open ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100",
            )}
          />
          <X
            className={cn(
              "absolute h-6 w-6 transition-all duration-300",
              open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0",
            )}
          />
        </button>
      </div>

      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-x-0 top-16 bottom-0 z-40 bg-background/60 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile panel */}
      <div
        className={cn(
          "fixed inset-x-0 top-16 z-40 origin-top border-b border-border bg-background shadow-lg transition-all duration-300 ease-out md:hidden",
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-3 opacity-0",
        )}
      >
        <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <ul className="space-y-1">
            {nav.map((n, i) => (
              <li
                key={n.to}
                className={cn(
                  "transform transition-all duration-300",
                  open ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0",
                )}
                style={{ transitionDelay: open ? `${80 + i * 40}ms` : "0ms" }}
              >
                <Link
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  activeProps={{
                    className:
                      "flex items-center justify-between rounded-lg px-4 py-3 text-base font-semibold text-foreground bg-secondary",
                  }}
                  activeOptions={{ exact: n.to === "/" }}
                >
                  <span>{n.label}</span>
                  <ArrowRight className="h-4 w-4 opacity-40" />
                </Link>
              </li>
            ))}
          </ul>
          <div
            className={cn(
              "mt-4 transform transition-all duration-300",
              open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
            )}
            style={{ transitionDelay: open ? `${80 + nav.length * 40}ms` : "0ms" }}
          >
            <Button asChild size="lg" variant="brand" className="w-full group">
              <Link to="/contact" onClick={() => setOpen(false)}>
                Get a quote
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
