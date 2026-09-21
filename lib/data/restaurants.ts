import { createClient } from "@/lib/supabase/server";
import type { Restaurant, SocialLinks } from "@/lib/types";

export interface RestaurantRow {
  id: string;
  slug: string;
  name: string;
  city_slug: string;
  category: string;
  logo: string | null;
  photos: string[] | null;
  description: string | null;
  opening_hours: { day: string; hours: string }[] | null;
  address: string | null;
  maps_url: string | null;
  social: SocialLinks | null;
  phone: string | null;
  rating: number | string | null;
  review_count: number | null;
  is_premium: boolean;
  status: "pending" | "approved" | "rejected";
  cuisine: string[] | null;
  menu_highlights: { name: string; price: string; description?: string }[] | null;
  delivery: { partner: string; url: string }[] | null;
}

export function mapRestaurant(row: RestaurantRow): Restaurant {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    citySlug: row.city_slug,
    category: row.category,
    logo: row.logo ?? "",
    photos: row.photos ?? [],
    description: row.description ?? "",
    openingHours: row.opening_hours ?? [],
    address: row.address ?? "",
    mapsUrl: row.maps_url ?? "",
    social: row.social ?? {},
    phone: row.phone ?? "",
    rating: Number(row.rating ?? 0),
    reviewCount: row.review_count ?? 0,
    isPremium: row.is_premium,
    status: row.status,
    cuisine: row.cuisine ?? [],
    menuHighlights: row.menu_highlights ?? [],
    delivery: row.delivery ?? [],
  };
}

export async function getRestaurants(): Promise<Restaurant[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("status", "approved")
    .order("name");
  if (error) {
    console.error("getRestaurants:", error.message);
    return [];
  }
  return (data as RestaurantRow[]).map(mapRestaurant);
}

export async function getRestaurantsByCity(citySlug: string): Promise<Restaurant[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("status", "approved")
    .eq("city_slug", citySlug)
    .order("name");
  if (error) {
    console.error("getRestaurantsByCity:", error.message);
    return [];
  }
  return (data as RestaurantRow[]).map(mapRestaurant);
}

export async function getRestaurantBySlug(slug: string): Promise<Restaurant | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .eq("status", "approved")
    .maybeSingle();
  if (error || !data) return null;
  return mapRestaurant(data as RestaurantRow);
}
