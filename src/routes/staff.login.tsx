import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, Loader2, Sparkles, Command } from "lucide-react";
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
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,color-mix(in_oklab,var(--brand)_18%,transparent),transparent_70%)]" />
        <div className="absolute -left-40 top-1/3 h-[500px] w-[500px] rounded-full bg-brand/10 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-brand/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        {/* Left — Form */}
        <div className="flex flex-col px-6 py-8 sm:px-10 lg:px-16">
          <div className="flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2">
              <img src={logo} alt="Zanscode" className="h-8 w-auto" />
            </Link>
            <Link
              to="/"
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Back to website
            </Link>
          </div>

          <div className="flex flex-1 items-center">
            <div className="mx-auto w-full max-w-[400px] py-12">
              <div className="mb-8">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card/60 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  Staff portal · secure
                </span>
                <h1 className="mt-5 text-[34px] font-bold leading-tight tracking-tight">
                  Sign in to <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Zanscode OS</span>
                </h1>
                <p className="mt-2 text-[15px] text-muted-foreground">
                  Your internal workspace, all in one place.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">
                    Work email
                  </Label>
                  <div className="group relative">
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@zanscode.com"
                      className="h-12 rounded-xl border-border/80 bg-card/40 px-4 backdrop-blur transition-all focus-visible:ring-2 focus-visible:ring-brand/30"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">
                      Password
                    </Label>
                    <button
                      type="button"
                      className="text-[11px] font-medium text-muted-foreground transition-colors hover:text-brand"
                      onClick={() => setError("Hubungi admin untuk reset kata sandi.")}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="group relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand" />
                    <Input
                      id="password"
                      type={show ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-12 rounded-xl border-border/80 bg-card/40 pl-10 pr-11 backdrop-blur transition-all focus-visible:ring-2 focus-visible:ring-brand/30"
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
                    <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="brand"
                  className="group h-12 w-full rounded-xl text-[15px] font-semibold shadow-lg shadow-brand/20 transition-all hover:shadow-xl hover:shadow-brand/30"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </Button>

                <div className="flex items-center gap-3 py-1">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    or
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <button
                  type="button"
                  onClick={() => setShowDemo((v) => !v)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card/30 px-4 py-2.5 text-xs font-medium text-muted-foreground transition-all hover:border-brand/40 hover:text-foreground"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {showDemo ? "Hide demo accounts" : "Use a demo account"}
                </button>

                {showDemo && (
                  <div className="overflow-hidden rounded-xl border border-border/80 bg-card/40 backdrop-blur">
                    <div className="border-b border-border/60 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Tap to fill
                    </div>
                    <ul className="divide-y divide-border/60">
                      {DEMO_HINTS.map((d) => (
                        <li key={d.email}>
                          <button
                            type="button"
                            onClick={() => fillDemo(d.email, d.password)}
                            className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-xs transition-colors hover:bg-secondary/60"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
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

        {/* Right — Brand panel (full half, no gap) */}
        <div className="relative hidden overflow-hidden bg-gradient-brand md:block">
          {/* Texture */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-[28rem] w-[28rem] rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex h-full flex-col justify-between p-8 text-brand-foreground sm:p-10 lg:p-12">
            <div className="flex items-center gap-2 text-xs font-medium opacity-90">
              <Command className="h-3.5 w-3.5" />
              Zanscode OS · Internal
            </div>

            <div className="max-w-md">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
                <span className="text-base leading-none">👋</span>
                Hai, selamat datang kembali!
              </div>
              <h2 className="text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-[40px]">
                Siap bikin hari ini<br />produktif?
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-brand-foreground/85 sm:text-[15px]">
                Kopi sudah diseduh ☕ — masuk dan lanjutkan dari tempat kamu terakhir berhenti.
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] opacity-75">
              <span>© {new Date().getFullYear()} Zanscode</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

