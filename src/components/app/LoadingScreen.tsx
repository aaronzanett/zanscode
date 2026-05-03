import { Sparkles } from "lucide-react";

/**
 * Polished, on-brand loading screen used as the router's pending UI.
 * Clean centered layout with an animated brand mark and a subtle progress shimmer.
 */
export function LoadingScreen({ label = "Loading workspace" }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        {/* Pulsing brand mark */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-2xl bg-brand/30" style={{ animationDuration: "1.8s" }} />
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
