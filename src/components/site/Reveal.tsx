import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealVariant = "up" | "fade" | "scale";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  variant?: RevealVariant;
  delay?: number; // ms
  className?: string;
  /** Animate every time it enters the viewport */
  repeat?: boolean;
  /** Trigger when this fraction is visible */
  threshold?: number;
}

/**
 * Lightweight scroll-reveal wrapper using IntersectionObserver.
 * Animates once by default; respects prefers-reduced-motion via CSS.
 */
export function Reveal({
  children,
  as,
  variant = "up",
  delay = 0,
  className,
  repeat = false,
  threshold = 0.15,
}: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // SSR / no IntersectionObserver fallback
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (!repeat) io.unobserve(entry.target);
          } else if (repeat) {
            setVisible(false);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [repeat, threshold]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={cn("reveal", `reveal-${variant}`, visible && "reveal-visible", className)}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
