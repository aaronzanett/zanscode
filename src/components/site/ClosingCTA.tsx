import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";

type CTAButton = {
  label: string;
  to: string;
  icon?: "arrow-up-right" | "arrow-right" | "none";
};

interface ClosingCTAProps {
  title: React.ReactNode;
  description: string;
  primary?: CTAButton;
  secondary?: CTAButton;
}

export function ClosingCTA({
  title,
  description,
  primary = { label: "Start a project", to: "/contact", icon: "arrow-up-right" },
  secondary = { label: "Explore services", to: "/services", icon: "arrow-right" },
}: ClosingCTAProps) {
  return (
    <section className="bg-ink py-24 text-background lg:py-32">
      <div className="mx-auto max-w-5xl px-5 text-center sm:px-8 lg:px-10">
        <Reveal variant="up">
          <Sparkles className="mx-auto h-6 w-6 text-brand-cyan" />
          <h2 className="mt-6 font-display text-5xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl">
            {title}
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-base text-background/70">
            {description}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {primary && (
              <Button asChild size="xl" variant="hero" className="group">
                <Link to={primary.to}>
                  {primary.label}
                  {primary.icon !== "none" && (
                    primary.icon === "arrow-right" ? (
                      <ArrowRight className="ml-1 h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    )
                  )}
                </Link>
              </Button>
            )}
            {secondary && (
              <Button
                asChild
                size="xl"
                variant="ghost"
                className="text-background hover:bg-background/10 hover:text-background"
              >
                <Link to={secondary.to}>
                  {secondary.label}
                  {secondary.icon !== "none" && (
                    secondary.icon === "arrow-up-right" ? (
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    ) : (
                      <ArrowRight className="ml-1 h-4 w-4" />
                    )
                  )}
                </Link>
              </Button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
