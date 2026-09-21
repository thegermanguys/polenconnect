import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { getCities } from "@/lib/data/cities";
import { getSportsCategories, getCommunityCategories } from "@/lib/data/categories";
import { SubmitForm } from "@/components/submit/submit-form";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Submit Your Community",
  description: "Add your sports club, restaurant, cultural or music group, or event listing to PolenConnect Germany.",
};

export const dynamic = "force-dynamic";

export default async function SubmitPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string; error?: string }>;
}) {
  const { submitted, error } = await searchParams;

  if (submitted === "1") {
    return (
      <div className="container flex flex-col items-center py-24 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-semibold">Thanks — it&apos;s in review</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Our moderation team checks every submission before it goes live, usually within 48 hours.
          We&apos;ll email you once it&apos;s published.
        </p>
        <Button className="mt-8" asChild>
          <Link href="/submit">Submit another listing</Link>
        </Button>
      </div>
    );
  }

  const [cities, sportsCategories, communityCategories] = await Promise.all([
    getCities(),
    getSportsCategories(),
    getCommunityCategories(),
  ]);

  return (
    <div className="container max-w-3xl py-14">
      <div className="max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Contribute</span>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Submit Your Community
        </h1>
        <p className="mt-4 text-muted-foreground">
          Add your club, restaurant, cultural or music group, or event listing. Every
          submission is reviewed before publishing.
        </p>
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          Something went wrong submitting that: {error}. Please try again.
        </div>
      )}

      <SubmitForm cities={cities} sportsCategories={sportsCategories} communityCategories={communityCategories} />
    </div>
  );
}
