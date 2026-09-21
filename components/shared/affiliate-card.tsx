import { ArrowUpRight } from "lucide-react";
import type { AffiliateLink } from "@/lib/types";
import { Button } from "@/components/ui/button";

export function AffiliateCard({ affiliate }: { affiliate: AffiliateLink }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div>
        <h3 className="font-display text-base font-semibold">{affiliate.name}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{affiliate.description}</p>
      </div>
      <Button size="sm" className="mt-auto w-fit" asChild>
        <a href={affiliate.url} target="_blank" rel="noreferrer sponsored">
          {affiliate.ctaLabel}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </Button>
    </div>
  );
}
