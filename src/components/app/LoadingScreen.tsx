import { Sparkles } from "lucide-react";

/**
 * Polished, on-brand loading screen used as the router's pending UI.
 * Features a soft gradient orb, animated brand mark, and a subtle progress shimmer.
 */
export function LoadingScreen({ label = "Loading workspace" }: { label?: string }) {
  return (
    <div className="relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden">
      {/* Ambient gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(600px circle at 30% 30%, color-mix(in oklab, var(--brand) 18%, transparent), transparent 60%), radial-gradient(500px circle at 70% 70%, color-mix(in oklab, var(--primary) 14%, transparent), transparent 60%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-5">
        {/* Pulsing brand mark */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-2xl bg-brand/30" style={{ animationDuration: "1.8s" }} />
          <span className="absolute inset-1 rounded-2xl bg-gradient-brand opacity-90 blur-[1px]" />
          <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-brand-foreground shadow-soft">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </span>
        </div>

        {/* Shimmer progress bar */}
        <div className="h-1 w-44 overflow-hidden rounded-full bg-secondary">
          <div className="loading-shimmer h-full w-1/2 rounded-full bg-gradient-brand" />
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-sm font-medium text-foreground/90">{label}</p>
          <p className="text-xs text-muted-foreground">Just a moment…</p>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
