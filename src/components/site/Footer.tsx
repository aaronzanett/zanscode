import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Linkedin, Twitter, Github, Youtube, ShieldCheck, Globe } from "lucide-react";
import logo from "@/assets/zanscode-logo.png";

const columns = [
  {
    title: "Products",
    links: [
      { to: "/products" as const, label: "Solutions overview" },
      { to: "/products" as const, label: "Zanscode ERP" },
      { to: "/products" as const, label: "Zanscode POS" },
      { to: "/products" as const, label: "SaaS apps" },
      { to: "/app" as const, label: "Internal app" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about" as const, label: "About us" },
      { to: "/services" as const, label: "Services" },
      { to: "/contact" as const, label: "Contact" },
      { to: "/careers" as const, label: "Careers" },
      { to: "/about" as const, label: "Press kit" },
    ],
  },
  {
    title: "Resources",
    links: [
      { to: "/services" as const, label: "Case studies" },
      { to: "/services" as const, label: "Documentation" },
      { to: "/products" as const, label: "Pricing" },
      { to: "/contact" as const, label: "Support" },
      { to: "/contact" as const, label: "Status" },
    ],
  },
];

const socials = [
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      {/* Main grid */}
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8">
        {/* Brand block */}
        <div className="lg:col-span-4">
          <Link to="/" className="inline-flex items-center">
            <img src={logo} alt="Zanscode" className="h-9 w-auto" />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Zanscode is a SaaS company building modern, industry-ready software for
            business owners and mid-sized companies — so your operations finally run on one system.
          </p>

          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <a href="mailto:hello@zanscode.com" className="text-muted-foreground hover:text-foreground">
                hello@zanscode.com
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <span className="text-muted-foreground">+1 (555) 010-0123</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <span className="text-muted-foreground">Innovation District, Jakarta, Indonesia</span>
            </li>
          </ul>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">{col.title}</h4>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map((link, i) => (
                  <li key={`${col.title}-${i}`}>
                    <Link to={link.to} className="text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Trust strip */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> SOC 2 Type II</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> ISO 27001</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> GDPR Ready</span>
            <span className="inline-flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> Global delivery</span>
          </div>
          <div className="flex items-center gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand hover:text-foreground"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Legal bar */}
      <div className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Zanscode, Inc. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link to="/about" className="hover:text-foreground">Privacy</Link>
            <Link to="/about" className="hover:text-foreground">Terms</Link>
            <Link to="/about" className="hover:text-foreground">Security</Link>
            <Link to="/contact" className="hover:text-foreground">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
