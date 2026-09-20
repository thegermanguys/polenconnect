import type { Metadata } from "next";
import Link from "next/link";
import { getClubs } from "@/lib/data/clubs";
import { getCities } from "@/lib/data/cities";
import { getCategories } from "@/lib/data/categories";
import { ClubCard } from "@/components/shared/club-card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Clubs & Groups",
  description: "Football and other sports clubs, plus Polonia associations, parishes, and Polish schools across Germany.",
};

export const dynamic = "force-dynamic";

export default async function ClubsPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; category?: string }>;
}) {
  const { city, category } = await searchParams;
  const [clubs, cities, categories] = await Promise.all([getClubs(), getCities(), getCategories()]);
  const clubCategories = categories.filter((c) => c.group === "sports" || c.group === "community");

  let filtered = clubs;
  if (city) filtered = filtered.filter((c) => c.citySlug === city);
  if (category) filtered = filtered.filter((c) => c.categorySlug === category);

  const cityName = cities.find((c) => c.slug === city)?.name;
  const categoryName = clubCategories.find((c) => c.slug === category)?.name;

  const titleParts = [categoryName, cityName && `in ${cityName}`].filter(Boolean);
  const title = titleParts.length > 0 ? titleParts.join(" ") : "Clubs & Groups";

  return (
    <div className="container py-14">
      <div className="max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Community</span>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 text-muted-foreground">
          Sports clubs, cultural organizations, and music groups run by Poles across Germany.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href={category ? `/clubs?category=${category}` : "/clubs"}>
          <Badge variant={!city ? "accent" : "secondary"}>All Cities</Badge>
        </Link>
        {cities
          .filter((c) => clubs.some((cl) => cl.citySlug === c.slug))
          .map((c) => (
            <Link key={c.slug} href={category ? `/clubs?city=${c.slug}&category=${category}` : `/clubs?city=${c.slug}`}>
              <Badge variant={city === c.slug ? "accent" : "secondary"}>{c.name}</Badge>
            </Link>
          ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Link href={city ? `/clubs?city=${city}` : "/clubs"}>
          <Badge variant={!category ? "accent" : "outline"}>All Categories</Badge>
        </Link>
        {clubCategories.map((cat) => (
          <Link key={cat.slug} href={city ? `/clubs?city=${city}&category=${cat.slug}` : `/clubs?category=${cat.slug}`}>
            <Badge variant={category === cat.slug ? "accent" : "outline"}>{cat.name}</Badge>
          </Link>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="font-display text-lg font-semibold">No clubs or groups found</p>
          <p className="mt-2 text-sm text-muted-foreground">Try a different city or category.</p>
        </div>
      )}
    </div>
  );
}