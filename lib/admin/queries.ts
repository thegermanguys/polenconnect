import { createAdminClient } from "@/lib/supabase/admin";
import { mapClub, type ClubRow } from "@/lib/data/clubs";
import { mapRestaurant, type RestaurantRow } from "@/lib/data/restaurants";
import { mapEvent, type EventRow } from "@/lib/data/events";
import type { Club, Restaurant, EventItem } from "@/lib/types";

/** Every club/group regardless of status — for the admin management table. */
export async function getAllClubsAdmin(): Promise<Club[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("clubs").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("getAllClubsAdmin:", error.message);
    return [];
  }
  return (data as ClubRow[]).map(mapClub);
}

export async function getAllRestaurantsAdmin(): Promise<Restaurant[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("restaurants").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("getAllRestaurantsAdmin:", error.message);
    return [];
  }
  return (data as RestaurantRow[]).map(mapRestaurant);
}

export async function getAllEventsAdmin(): Promise<EventItem[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("events").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("getAllEventsAdmin:", error.message);
    return [];
  }
  return (data as EventRow[]).map(mapEvent);
}

export interface PendingItem {
  table: "clubs" | "restaurants" | "events";
  id: string;
  name: string;
  citySlug: string;
  typeLabel: string;
}

/** Unified pending queue across clubs, restaurants, and events for the Approvals tab. */
export async function getPendingQueueAdmin(): Promise<PendingItem[]> {
  const [clubs, restaurants, events] = await Promise.all([
    getAllClubsAdmin(),
    getAllRestaurantsAdmin(),
    getAllEventsAdmin(),
  ]);

  return [
    ...clubs
      .filter((c) => c.status === "pending")
      .map((c) => ({
        table: "clubs" as const,
        id: c.id,
        name: c.name,
        citySlug: c.citySlug,
        typeLabel: ["regional-associations", "parishes", "dance-music-groups", "polish-schools", "professional-networks"].includes(c.categorySlug) ? "Group" : "Sports Club",
      })),
    ...restaurants
      .filter((r) => r.status === "pending")
      .map((r) => ({ table: "restaurants" as const, id: r.id, name: r.name, citySlug: r.citySlug, typeLabel: "Restaurant" })),
    ...events
      .filter((e) => e.status === "pending")
      .map((e) => ({ table: "events" as const, id: e.id, name: e.title, citySlug: e.citySlug, typeLabel: "Event" })),
  ];
}
