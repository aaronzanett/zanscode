import { Link } from "@tanstack/react-router";
import logo from "@/assets/zanscode-logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <img src={logo} alt="Zanscode" className="h-8 w-auto" />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Zanscode builds technology that powers well-organized, scalable business systems —
            from web and mobile to SaaS and enterprise platforms.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Products</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/products" className="hover:text-foreground">Solutions</Link></li>
            <li><Link to="/saas" className="hover:text-foreground">SaaS</Link></li>
            <li><Link to="/app" className="hover:text-foreground">Internal App</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Zanscode. All rights reserved.</p>
          <p>Built with care for modern businesses.</p>
        </div>
      </div>
    </footer>
  );
}
