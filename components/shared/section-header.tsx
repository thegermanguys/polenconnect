import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  href,
  hrefLabel = "View all",
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:justify-center md:text-center",
        className
      )}
    >
      <div className={cn(align === "center" && "mx-auto max-w-2xl")}>
        {eyebrow && (
          <span className="mb-2 inline-block font-mono text-xs uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </span>
        )}
        <h2 className="text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h2>
        {description && <p className="mt-3 max-w-xl text-muted-foreground">{description}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary"
        >
          {hrefLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
