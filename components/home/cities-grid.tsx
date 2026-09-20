import { SectionHeader } from "@/components/shared/section-header";
import { CityCard } from "@/components/shared/city-card";
import { getCities } from "@/lib/data/cities";

export async function CitiesGrid() {
  const cities = await getCities();
  return (
    <section className="bg-surface-2/60 py-20">
      <div className="container">
        <SectionHeader
          eyebrow="Nationwide"
          title="Polish communities across Germany"
          description="120+ cities and growing — tap a city to see every club, business, and event near you."
          href="/cities"
          hrefLabel="View all cities"
        />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cities.slice(0, 8).map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      </div>
    </section>
  );
}
