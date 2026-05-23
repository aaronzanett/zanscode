import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Menu, X, ArrowRight, Globe, LogIn, Check } from "lucide-react";
import logo from "@/assets/zanscode-logo.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

type Lang = "en" | "id";
const LANG_KEY = "zanscode.lang";
const LANG_LABELS: Record<Lang, { short: string; name: string }> = {
  en: { short: "EN", name: "English" },
  id: { short: "ID", name: "Bahasa Indonesia" },
};

function useLanguage(): [Lang, (l: Lang) => void] {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    try {
      const v = window.localStorage.getItem(LANG_KEY) as Lang | null;
      if (v === "en" || v === "id") setLang(v);
    } catch {}
  }, []);
  const update = (l: Lang) => {
    setLang(l);
    try {
      window.localStorage.setItem(LANG_KEY, l);
      document.documentElement.lang = l;
    } catch {}
  };
  return [lang, update];
}

function LanguageSwitcher({ className }: { className?: string }) {
  const [lang, setLang] = useLanguage();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "group inline-flex h-9 items-center gap-1.5 rounded-full border border-transparent px-3 text-sm font-medium text-muted-foreground transition-all hover:border-border hover:bg-secondary/60 hover:text-foreground",
            className,
          )}
          aria-label="Change language"
        >
          <Globe className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
          <span className="inline-block w-5 text-center font-semibold tracking-wide tabular-nums">{LANG_LABELS[lang].short}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
          <DropdownMenuItem
            key={l}
            onSelect={() => setLang(l)}
            className="flex items-center justify-between gap-3"
          >
            <span className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-muted-foreground">
                {LANG_LABELS[l].short}
              </span>
              <span>{LANG_LABELS[l].name}</span>
            </span>
            {lang === l && <Check className="h-4 w-4 text-brand" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const nav = useStore((s) => s.siteContent.nav);
  const location = useLocation();
  const pathname = location.pathname;

  // Sliding pill indicator
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number; visible: boolean }>(
    { left: 0, width: 0, visible: false },
  );

  const activeIdx = nav.findIndex((n) => {
    if (n.to === "/") return pathname === "/";
    if (n.to === "/careers" && pathname.startsWith("/apply/")) return true;
    return pathname === n.to || pathname.startsWith(n.to + "/");
  });
  const targetIdx = hoverIdx ?? (activeIdx >= 0 ? activeIdx : null);

  useLayoutEffect(() => {
    if (targetIdx === null) {
      setIndicator((p) => ({ ...p, visible: false }));
      return;
    }
    const measure = () => {
      const el = itemRefs.current[targetIdx];
      const parent = listRef.current;
      if (!el || !parent) return;
      setIndicator({
        left: el.offsetLeft,
        width: el.offsetWidth,
        visible: true,
      });
    };
    measure();
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [targetIdx, nav, pathname]);

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
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 shrink-0 group" onClick={() => setOpen(false)}>
          <img
            src={logo}
            alt="Zanscode"
            className="h-10 w-auto lg:h-11 transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>

        <nav className="hidden lg:flex">
          <div
            ref={listRef}
            className="relative flex items-center rounded-full border border-border/60 bg-secondary/30 p-1"
            onMouseLeave={() => setHoverIdx(null)}
          >
            {/* Sliding pill indicator */}
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute top-1 bottom-1 rounded-full bg-brand shadow-soft transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                indicator.visible ? "opacity-100" : "opacity-0",
              )}
              style={{
                transform: `translateX(${indicator.left - 4}px)`,
                width: indicator.width,
              }}
            />
            {nav.map((n, i) => {
              const isTarget = i === targetIdx;
              return (
                <Link
                  key={n.id}
                  to={n.to as string}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  onMouseEnter={() => setHoverIdx(i)}
                  onFocus={() => setHoverIdx(i)}
                  onBlur={() => setHoverIdx(null)}
                  className={cn(
                    "relative z-10 inline-flex items-center justify-center rounded-full px-5 py-1.5 text-sm font-medium leading-none transition-colors duration-300",
                    isTarget ? "text-white" : "text-muted-foreground hover:text-foreground",
                  )}
                  activeOptions={{ exact: n.to === "/" }}
                >
                  {n.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="hidden items-center gap-1 lg:flex">
          <LanguageSwitcher />
          <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
          <Button asChild size="sm" variant="ghost" className="group rounded-full text-muted-foreground hover:text-foreground">
            <Link to="/staff/login">
              <LogIn className="transition-transform duration-300 group-hover:-translate-x-0.5" />
              Sign in
            </Link>
          </Button>
          <Button asChild size="sm" variant="brand" className="group rounded-full shadow-soft">
            <Link to="/contact">
              Get started
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <LanguageSwitcher />
          <button
            className={cn(
              "relative inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary",
              open && "bg-secondary",
            )}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <Menu className={cn("absolute h-6 w-6 transition-all duration-300", open ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100")} />
            <X className={cn("absolute h-6 w-6 transition-all duration-300", open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0")} />
          </button>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-x-0 top-16 bottom-0 z-40 bg-background/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <div
        className={cn(
          "fixed inset-x-0 top-16 z-40 origin-top border-b border-border bg-background shadow-lg transition-all duration-300 ease-out lg:hidden",
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0",
        )}
      >
        <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <ul className="space-y-1">
            {nav.map((n, i) => {
              const isActive = i === activeIdx;
              return (
                <li
                  key={n.id}
                  className={cn("transform transition-all duration-300", open ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0")}
                  style={{ transitionDelay: open ? `${80 + i * 40}ms` : "0ms" }}
                >
                  <Link
                    to={n.to as string}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition-colors",
                      isActive
                        ? "bg-secondary font-semibold text-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    <span>{n.label}</span>
                    <ArrowRight className="h-4 w-4 opacity-40" />
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 grid gap-2">
            <Button asChild size="lg" variant="outline" className="w-full group rounded-full">
              <Link to="/staff/login" onClick={() => setOpen(false)}>
                <LogIn className="transition-transform duration-300 group-hover:-translate-x-0.5" />
                Sign in
              </Link>
            </Button>
            <Button asChild size="lg" variant="brand" className="w-full group rounded-full">
              <Link to="/contact" onClick={() => setOpen(false)}>
                Get started
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
