import { createClient } from "@/lib/supabase/server";
import type { EventItem } from "@/lib/types";

export interface EventRow {
  id: string;
  slug: string;
  title: string;
  city_slug: string;
  organizer: string | null;
  poster: string | null;
  location: string | null;
  maps_url: string | null;
  start_date: string;
  end_date: string | null;
  description: string | null;
  category: EventItem["category"];
  festival_tag: EventItem["festivalTag"] | null;
  price: string | null;
  register_url: string | null;
  is_featured: boolean;
  status: "pending" | "approved" | "rejected";
}

export function mapEvent(row: EventRow): EventItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    citySlug: row.city_slug,
    organizer: row.organizer ?? "",
    poster: row.poster ?? "",
    location: row.location ?? "",
    mapsUrl: row.maps_url ?? "",
    startDate: row.start_date,
    endDate: row.end_date ?? undefined,
    description: row.description ?? "",
    category: row.category,
    festivalTag: row.festival_tag ?? undefined,
    price: row.price ?? "",
    registerUrl: row.register_url ?? "",
    isFeatured: row.is_featured,
    status: row.status,
  };
}

export async function getEvents(): Promise<EventItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "approved")
    .order("start_date");
  if (error) {
    console.error("getEvents:", error.message);
    return [];
  }
  return (data as EventRow[]).map(mapEvent);
}

export async function getEventsByCity(citySlug: string): Promise<EventItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "approved")
    .eq("city_slug", citySlug)
    .order("start_date");
  if (error) {
    console.error("getEventsByCity:", error.message);
    return [];
  }
  return (data as EventRow[]).map(mapEvent);
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("status", "approved")
    .maybeSingle();
  if (error || !data) return null;
  return mapEvent(data as EventRow);
}

export async function getFeaturedEvents(): Promise<EventItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "approved")
    .eq("is_featured", true)
    .order("start_date");
  if (error) {
    console.error("getFeaturedEvents:", error.message);
    return [];
  }
  return (data as EventRow[]).map(mapEvent);
}

export async function getFestivalEvents(): Promise<EventItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "approved")
    .not("festival_tag", "is", null)
    .order("start_date");
  if (error) {
    console.error("getFestivalEvents:", error.message);
    return [];
  }
  return (data as EventRow[]).map(mapEvent);
}

// --- Pure date-math helpers — no DB access, operate on whatever list of
// events you already fetched. ------------------------------------------

export function isPastEvent(event: EventItem, now: Date = new Date()): boolean {
  const referenceDate = new Date(event.endDate ?? event.startDate);
  // Compare by end-of-day so an event still counts as "upcoming" for its whole day.
  referenceDate.setHours(23, 59, 59, 999);
  return referenceDate.getTime() < now.getTime();
}

export function getUpcomingEvents(list: EventItem[], now: Date = new Date()): EventItem[] {
  return list
    .filter((e) => !isPastEvent(e, now))
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
}

export function getPastEvents(list: EventItem[], now: Date = new Date()): EventItem[] {
  return list
    .filter((e) => isPastEvent(e, now))
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
}
