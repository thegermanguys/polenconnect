import type { Metadata } from "next";
import { affiliateLinks, affiliateCategoryLabels, affiliateCategoryOrder } from "@/lib/data/affiliates";
import { AffiliateCard } from "@/components/shared/affiliate-card";

export const metadata: Metadata = {
  title: "Partner Deals",
  description: "Bank accounts, health insurance, blocked accounts, SIM cards, and more for Polishs moving to Germany.",
};

export default function AffiliatesPage() {
  return (
    <div className="container py-14">
      <div className="max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Resources</span>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Partner Deals
        </h1>
        <p className="mt-4 text-muted-foreground">
          Trusted services for settling in Germany — bank accounts, health insurance, blocked accounts
          for your visa, SIM cards, and more.
        </p>
        <p className="mt-3 rounded-xl border border-dashed border-border bg-surface-2 p-3 text-xs text-muted-foreground">
          Some of these are affiliate/referral links. Signing up through them may earn a commission
          for our partners at no extra cost to you.
        </p>
      </div>

      <div className="mt-12 space-y-14">
        {affiliateCategoryOrder.map((category) => {
          const items = affiliateLinks.filter((a) => a.category === category);
          if (items.length === 0) return null;
          return (
            <section key={category}>
              <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                {affiliateCategoryLabels[category]}
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((affiliate) => (
                  <AffiliateCard key={affiliate.id} affiliate={affiliate} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}