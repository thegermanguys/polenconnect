import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="container py-20">
      <div className="relative overflow-hidden rounded-3xl bg-hero-gradient px-8 py-16 text-center sm:px-16">
        <div aria-hidden className="bicolor-strip absolute inset-x-0 top-0" />
        <h2 className="mx-auto max-w-2xl text-balance font-display text-3xl font-semibold text-white sm:text-4xl">
          Run a club, business, or association? Get discovered by thousands of Poles in Germany.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-white/70">
          Listing is free and every submission is reviewed by our moderation team before going live.
        </p>
        <Button size="lg" variant="accent" className="mt-8" asChild>
          <Link href="/submit">
            Submit Your Community <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
