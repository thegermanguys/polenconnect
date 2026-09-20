import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getCityBySlug } from "@/lib/data/cities";
import { getCategoryBySlug } from "@/lib/data/categories";
import { getClubsByCityAndCategory } from "@/lib/data/clubs";
import { ClubCard } from "@/components/shared/club-card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; category: string }>;
}): Promise<Metadata> {
  const { city: citySlug, category: categorySlug } = await params;
  const [city, category] = await Promise.all([getCityBySlug(citySlug), getCategoryBySlug(categorySlug)]);
  if (!city || !category) return {};
  const entityLabel = category.group === "community" ? "Groups" : "Clubs";
  return { title: `${category.name} ${entityLabel} in ${city.name}` };
}

export default async function CityCategoryPage({
  params,
}: {
  params: Promise<{ city: string; category: string }>;
}) {
  const { city: citySlug, category: categorySlug } = await params;
  const [city, category] = await Promise.all([getCityBySlug(citySlug), getCategoryBySlug(categorySlug)]);
  if (!city || !category) notFound();

  const clubList = await getClubsByCityAndCategory(city.slug, category.slug);
  const entityLabel = category.group === "community" ? "Groups" : "Clubs";

  return (
    <div className="container py-14">
      <div className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/cities" className="hover:text-foreground">Cities</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/cities/${city.slug}`} className="hover:text-foreground">{city.name}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{category.name}</span>
      </div>

      <div className="max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{city.name}</span>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {category.name} {entityLabel}
        </h1>
        <p className="mt-4 text-muted-foreground">{category.description}</p>
      </div>

      {clubList.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clubList.map((club) => (
            <div key={club.id} id={club.slug}>
              <ClubCard club={club} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="font-display text-lg font-semibold">No {category.name.toLowerCase()} {entityLabel.toLowerCase()} listed in {city.name} yet</p>
          <p className="mt-2 text-sm text-muted-foreground">Be the first to put your {entityLabel === "Groups" ? "group" : "club"} on the map.</p>
          <Button className="mt-6" asChild>
            <Link href="/submit">Submit Your {entityLabel === "Groups" ? "Group" : "Club"}</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
