import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { CalendarDays, MapPin, Ticket } from "lucide-react";
import { getEventBySlug } from "@/lib/data/events";
import { getCityBySlug } from "@/lib/data/cities";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateRange } from "@/lib/utils";
import type { EventItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = await getEventBySlug(slug);
  if (!e) return {};
  return { title: e.title, description: e.description };
}

function buildCalendarUrl(event: EventItem) {
  const start = event.startDate.replace(/-/g, "");
  const end = (event.endDate ?? event.startDate).replace(/-/g, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
    details: event.description,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();
  const city = await getCityBySlug(event.citySlug);

  return (
    <div className="container py-14">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
          <Image src={event.poster} alt={event.title} fill className="object-cover" />
        </div>
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            {event.festivalTag && <Badge variant="accent">{event.festivalTag}</Badge>}
            <Badge variant="outline">{city?.name}</Badge>
            <Badge variant="muted" className="capitalize">{event.category}</Badge>
          </div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">{event.title}</h1>
          <p className="mt-2 text-muted-foreground">Organised by {event.organizer}</p>

          <div className="mt-6 space-y-3 rounded-2xl border border-border bg-surface p-5">
            <p className="flex items-center gap-3 text-sm"><CalendarDays className="h-4 w-4 text-primary" /> {formatDateRange(event.startDate, event.endDate)}</p>
            <p className="flex items-center gap-3 text-sm"><MapPin className="h-4 w-4 text-primary" /> {event.location}</p>
            <p className="flex items-center gap-3 text-sm"><Ticket className="h-4 w-4 text-primary" /> {event.price}</p>
          </div>

          <p className="mt-6 leading-relaxed text-foreground/85">{event.description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <a href={event.registerUrl} target="_blank" rel="noreferrer">Register</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={buildCalendarUrl(event)} target="_blank" rel="noreferrer">Add to Calendar</a>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <a href={event.mapsUrl} target="_blank" rel="noreferrer">View on Maps</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
