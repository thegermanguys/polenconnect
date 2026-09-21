import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Users, Building2, CalendarDays } from "lucide-react";
import { getCityBySlug } from "@/lib/data/cities";
import { getClubsByCity } from "@/lib/data/clubs";
import { getRestaurantsByCity } from "@/lib/data/restaurants";
import { getEventsByCity } from "@/lib/data/events";
import { getSportsCategories, getCommunityCategories } from "@/lib/data/categories";
import { SectionHeader } from "@/components/shared/section-header";
import { ClubCard } from "@/components/shared/club-card";
import { BusinessCard } from "@/components/shared/business-card";
import { EventCard } from "@/components/shared/event-card";
import { CategoryCard } from "@/components/shared/category-card";
import { Badge } from "@/components/ui/badge";

// New cities/clubs/restaurants/events can appear at any time via the DB, so
// this route always renders fresh rather than being statically generated.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = await getCityBySlug(citySlug);
  if (!city) return {};
  return {
    title: `Polishs in ${city.name}`,
    description: city.blurb,
  };
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params;
  const city = await getCityBySlug(citySlug);
  if (!city) notFound();

  const [clubList, restaurantList, eventList, sportsCategories, communityCategories] = await Promise.all([
    getClubsByCity(city.slug),
    getRestaurantsByCity(city.slug),
    getEventsByCity(city.slug),
    getSportsCategories(),
    getCommunityCategories(),
  ]);

  return (
    <div>
      <section className="relative h-72 w-full overflow-hidden sm:h-96">
        <Image src={city.heroImage} alt={city.name} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/20" />
        <div className="container relative flex h-full flex-col justify-end pb-10">
          <Badge variant="outline" className="mb-3 w-fit bg-surface/80">{city.state}</Badge>
          <h1 className="font-display text-4xl font-semibold sm:text-6xl">{city.name}</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">{city.blurb}</p>
        </div>
      </section>

      <section className="container -mt-8 relative z-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { icon: Users, value: city.communityCount, label: "Communities" },
          { icon: Building2, value: restaurantList.length, label: "Restaurants" },
          { icon: CalendarDays, value: city.eventCount, label: "Events" },
          { icon: Users, value: clubList.length, label: "Clubs & Groups" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-surface p-5 text-center shadow-soft">
            <s.icon className="mx-auto mb-2 h-5 w-5 text-primary" />
            <p className="font-display text-2xl font-bold">{s.value}</p>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="container py-16">
        <SectionHeader eyebrow="Sports" title={`Sports clubs in ${city.name}`} />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {sportsCategories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} href={`/cities/${city.slug}/${cat.slug}`} />
          ))}
        </div>
        {clubList.filter((c) => sportsCategories.some((cat) => cat.slug === c.categorySlug)).length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {clubList
              .filter((c) => sportsCategories.some((cat) => cat.slug === c.categorySlug))
              .map((club) => <ClubCard key={club.id} club={club} />)}
          </div>
        )}
      </section>

      <section className="bg-surface-2/60 py-16">
        <div className="container">
          <SectionHeader eyebrow="Community & Culture" title={`Cultural and music groups in ${city.name}`} />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {communityCategories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} href={`/cities/${city.slug}/${cat.slug}`} />
            ))}
          </div>
          {clubList.filter((c) => communityCategories.some((cat) => cat.slug === c.categorySlug)).length > 0 && (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {clubList
                .filter((c) => communityCategories.some((cat) => cat.slug === c.categorySlug))
                .map((club) => <ClubCard key={club.id} club={club} />)}
            </div>
          )}
        </div>
      </section>

      {restaurantList.length > 0 && (
        <section className="container py-16">
          <SectionHeader eyebrow="Food" title={`Polish restaurants in ${city.name}`} href="/restaurants" />
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {restaurantList.map((r) => <BusinessCard key={r.id} business={r} basePath="/restaurants" />)}
          </div>
        </section>
      )}

      {eventList.length > 0 && (
        <section className="bg-surface-2/60 py-16">
          <div className="container">
            <SectionHeader eyebrow="Events" title={`What's happening in ${city.name}`} href="/events" />
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {eventList.map((e) => <EventCard key={e.id} event={e} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
