import type { Metadata } from "next";
import { CityCard } from "@/components/shared/city-card";
import { getCities } from "@/lib/data/cities";

export const metadata: Metadata = {
  title: "Cities",
  description: "Browse Polish communities, businesses, and events across every major city in Germany.",
};

export const dynamic = "force-dynamic";

export default async function CitiesPage() {
  const cities = await getCities();
  return (
    <div className="container py-14">
      <div className="max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Nationwide</span>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Polish communities, city by city
        </h1>
        <p className="mt-4 text-muted-foreground">
          {cities.length} cities listed and growing. Tap any city to see its sports clubs,
          cultural and music groups, restaurants, and events.
        </p>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cities.map((city) => (
          <CityCard key={city.id} city={city} />
        ))}
      </div>
    </div>
  );
}
