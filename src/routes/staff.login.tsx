import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";
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

  useEffect(() => {
    if (isSignedIn()) {
      navigate({ to: "/app" });
    }
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
    <div className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-2">
      {/* Left — Form */}
      <div className="flex flex-col justify-between px-6 py-8 sm:px-10 lg:px-16">
        <Link to="/" className="inline-flex items-center gap-2">
          <img src={logo} alt="Zanscode" className="h-9 w-auto" />
        </Link>

        <div className="mx-auto w-full max-w-sm py-10">
          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1 text-[11px] font-medium text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              Staff portal
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in to continue to Zanscode OS.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Work email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@zanscode.com"
                  className="h-11 pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setError("Hubungi admin untuk reset kata sandi.")}
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" variant="brand" className="h-11 w-full group" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-dashed border-border bg-secondary/40 p-3">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3 w-3" />
              Demo accounts
            </div>
            <ul className="mt-2 space-y-1">
              {DEMO_HINTS.map((d) => (
                <li key={d.email}>
                  <button
                    type="button"
                    onClick={() => fillDemo(d.email, d.password)}
                    className="flex w-full items-center justify-between gap-2 rounded px-1 py-0.5 text-left text-xs hover:bg-background"
                  >
                    <span className="font-mono text-foreground">{d.email}</span>
                    <span className="text-muted-foreground">{d.role}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Password = role + <span className="font-mono">123</span>. Mock auth — for demo only.
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Not staff?{" "}
          <Link to="/" className="font-medium text-foreground hover:underline">
            Back to website
          </Link>
        </p>
      </div>

      {/* Right — Brand panel */}
      <div className="relative hidden overflow-hidden bg-gradient-brand lg:block">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)",
          backgroundSize: "40px 40px, 60px 60px",
        }} />
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex h-full flex-col justify-between p-12 text-brand-foreground">
          <div className="flex items-center gap-2 text-sm font-medium opacity-90">
            <ShieldCheck className="h-4 w-4" />
            Zanscode OS · Internal
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl font-bold leading-tight tracking-tight">
              Defined by excellence.
            </h2>
            <p className="mt-4 text-base text-brand-foreground/85">
              Satu ruang kerja terpadu untuk tim Zanscode — CRM, operasional, keuangan,
              dan SDM dalam satu sistem yang aman dan cepat.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <Stat label="Modules" value="14+" />
              <Stat label="Uptime" value="99.98%" />
              <Stat label="Region" value="WIB" />
            </div>
          </div>

          <p className="text-xs opacity-75">
            © {new Date().getFullYear()} Zanscode. Authorized personnel only.
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 backdrop-blur-sm">
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-[11px] uppercase tracking-wider opacity-75">{label}</div>
    </div>
  );
}
