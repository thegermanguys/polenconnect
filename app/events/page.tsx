import type { Metadata } from "next";
import { getEvents, getUpcomingEvents, getPastEvents } from "@/lib/data/events";
import { EventCard } from "@/components/shared/event-card";
import { getCities } from "@/lib/data/cities";

export const metadata: Metadata = {
  title: "Events",
  description: "Festivals, tournaments, Concerts and meetups happening across Germany.",
};

export const dynamic = "force-dynamic";

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ city?: string }> }) {
  const { city } = await searchParams;
  const [events, cities] = await Promise.all([getEvents(), getCities()]);
  const filtered = city ? events.filter((e) => e.citySlug === city) : events;
  const upcoming = getUpcomingEvents(filtered);
  const past = getPastEvents(filtered);
  const cityName = cities.find((c) => c.slug === city)?.name;

  return (
    <div className="container py-14">
      <div className="max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Calendar</span>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {cityName ? `Events in ${cityName}` : "What's happening"}
        </h1>
        <p className="mt-4 text-muted-foreground">
          Dożynki festivals, football finals, career nights, and more — never miss what matters to the community.
        </p>
      </div>

      {upcoming.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {upcoming.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-sm text-muted-foreground">No upcoming events right now — check back soon.</p>
      )}

      {past.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">Past Events</h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {past.map((e) => (
              <EventCard key={e.id} event={e} isPast />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
