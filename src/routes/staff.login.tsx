import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, Loader2, KeyRound, ShieldCheck, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, isSignedIn, DEMO_HINTS } from "@/lib/auth";
import logo from "@/assets/zanscode-logo.png";

export const Route = createFileRoute("/staff/login")({
  head: () => ({
    meta: [
      { title: "Staff Sign In — Zanscode OS" },
      { name: "description", content: "Internal staff portal sign in for Zanscode OS." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: StaffLoginPage,
});

function StaffLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    if (isSignedIn()) navigate({ to: "/app" });
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      navigate({ to: "/app" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_1.05fr]">
        {/* Left — Form */}
        <div className="flex flex-col px-6 py-8 sm:px-10 lg:px-16">
          <div className="flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2">
              <img src={logo} alt="Zanscode" className="h-8 w-auto" />
            </Link>
            <Link
              to="/"
              className="group inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowRight className="h-3.5 w-3.5 rotate-180 transition-transform group-hover:-translate-x-0.5" />
              Back to website
            </Link>
          </div>

          <div className="flex flex-1 items-center">
            <div className="mx-auto w-full max-w-[420px] py-12">
              <div className="mb-9">
                <span className="kicker">Staff portal</span>
                <h1 className="mt-4 font-display text-[40px] leading-[1.05] tracking-tight text-foreground sm:text-[44px]">
                  Welcome back to <span className="text-brand">Zanscode OS</span>.
                </h1>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                  Projects, clients, recruitment, and site content — all in one place.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Work email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@zanscode.com"
                    className="h-12 rounded-xl border-border bg-card px-4 text-[15px] shadow-none transition-all focus-visible:border-brand focus-visible:ring-4 focus-visible:ring-brand/15"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Password
                    </Label>
                    <button
                      type="button"
                      className="text-[11px] font-medium text-muted-foreground transition-colors hover:text-brand"
                      onClick={() => setError("Contact your admin to reset your password.")}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={show ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-12 rounded-xl border-border bg-card px-4 pr-11 text-[15px] shadow-none transition-all focus-visible:border-brand focus-visible:ring-4 focus-visible:ring-brand/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShow((v) => !v)}
                      className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      aria-label={show ? "Hide password" : "Show password"}
                    >
                      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-xs text-destructive">
                    <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="brand"
                  className="group h-12 w-full rounded-xl text-[15px] font-semibold shadow-brand transition-all hover:shadow-glow"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in to workspace
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </Button>

                <div className="flex items-center gap-3 pt-1">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    or
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <button
                  type="button"
                  onClick={() => setShowDemo((v) => !v)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-transparent px-4 py-2.5 text-xs font-medium text-muted-foreground transition-all hover:border-brand/40 hover:bg-secondary hover:text-foreground"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  {showDemo ? "Hide demo accounts" : "Use a demo account"}
                </button>

                {showDemo && (
                  <div className="overflow-hidden rounded-xl border border-border bg-card">
                    <div className="border-b border-border px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Tap to fill
                    </div>
                    <ul className="divide-y divide-border">
                      {DEMO_HINTS.map((d) => (
                        <li key={d.email}>
                          <button
                            type="button"
                            onClick={() => fillDemo(d.email, d.password)}
                            className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-xs transition-colors hover:bg-secondary/60"
                          >
                            <div className="flex min-w-0 items-center gap-2.5">
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand/10 text-[10px] font-bold text-brand">
                                {d.role[0]}
                              </div>
                              <div className="min-w-0">
                                <div className="truncate font-mono text-[11px] text-foreground">{d.email}</div>
                                <div className="text-[10px] text-muted-foreground">Password: {d.password}</div>
                              </div>
                            </div>
                            <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                              {d.role}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </form>
            </div>
          </div>

          <p className="text-center text-[11px] text-muted-foreground lg:text-left">
            Protected by Zanscode security · © {new Date().getFullYear()}
          </p>
        </div>

        {/* Right — Editorial ink panel */}
        <div className="relative hidden overflow-hidden bg-ink text-white lg:block">
          {/* Subtle dot texture */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* Single soft brand glow — no rainbow gradient */}
          <div className="pointer-events-none absolute -right-32 top-1/4 h-[28rem] w-[28rem] rounded-full bg-brand/30 blur-[140px]" />
          <div className="pointer-events-none absolute -left-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-brand-cyan/20 blur-[120px]" />

          <div className="relative flex h-full flex-col justify-between p-10 lg:p-14">
            {/* Top — system status chip */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/85 backdrop-blur">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                All systems operational
              </span>
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/50">
                v2.4
              </span>
            </div>

            {/* Middle — editorial pitch */}
            <div className="max-w-lg">
              <span className="kicker text-brand-cyan">Internal workspace</span>
              <h2 className="mt-4 font-display text-[40px] leading-[1.05] tracking-tight sm:text-[48px]">
                One calm place to ship what matters.
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/70">
                Manage projects, clients, hiring pipelines and homepage content from a single workspace built around how your team actually works.
              </p>

              {/* Feature row — solid, editorial */}
              <div className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                {[
                  { icon: Zap, label: "Fast", sub: "Sub-second nav" },
                  { icon: ShieldCheck, label: "Secure", sub: "Role-based access" },
                  { icon: Users, label: "Shared", sub: "Built for teams" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="bg-ink/40 px-4 py-5 backdrop-blur">
                    <Icon className="h-4 w-4 text-brand-cyan" />
                    <div className="mt-3 text-sm font-semibold">{label}</div>
                    <div className="mt-0.5 text-[11px] text-white/55">{sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom — quiet footer */}
            <div className="flex items-center justify-between text-[11px] text-white/45">
              <span>© {new Date().getFullYear()} Zanscode</span>
              <span className="font-mono tracking-[0.16em] uppercase">Defined by excellence</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
