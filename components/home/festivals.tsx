import { SectionHeader } from "@/components/shared/section-header";
import { EventCard } from "@/components/shared/event-card";
import { getEvents } from "@/lib/data/events";

export async function FestivalsSection() {
  const events = await getEvents();
  const upcoming = [...events].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return (
    <section className="bg-secondary py-20">
      <div className="container">
        <SectionHeader
          eyebrow="Don't miss out"
          title="Wigilia, Dożynki & Andrzejki — wherever you are"
          description="Festival celebrations and tournaments happening across Germany this season."
          href="/events"
          hrefLabel="See full calendar"
          className="[&_h2]:text-white [&_p]:text-white/70 [&_span]:text-accent [&_a]:text-white"
        />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {upcoming.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
