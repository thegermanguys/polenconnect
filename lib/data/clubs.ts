import { createClient } from "@/lib/supabase/server";
import type { Club, SocialLinks } from "@/lib/types";

export interface ClubRow {
  id: string;
  slug: string;
  name: string;
  city_slug: string;
  category_slug: string;
  logo: string | null;
  cover_image: string | null;
  description: string | null;
  social: SocialLinks | null;
  phone: string | null;
  email: string | null;
  maps_url: string | null;
  is_featured: boolean;
  status: "pending" | "approved" | "rejected";
  captain_name: string | null;
  practice_location: string | null;
  practice_time: string | null;
  member_count: number | null;
  contact_person: string | null;
}

export function mapClub(row: ClubRow): Club {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    citySlug: row.city_slug,
    categorySlug: row.category_slug,
    logo: row.logo ?? "",
    coverImage: row.cover_image ?? "",
    description: row.description ?? "",
    social: row.social ?? {},
    phone: row.phone ?? "",
    email: row.email ?? "",
    mapsUrl: row.maps_url ?? "",
    isFeatured: row.is_featured,
    status: row.status,
    captainName: row.captain_name ?? "",
    practiceLocation: row.practice_location ?? "",
    practiceTime: row.practice_time ?? "",
    memberCount: row.member_count ?? 0,
    contactPerson: row.contact_person ?? "",
  };
}

/** Every approved club, cultural organization, and music group. */
export async function getClubs(): Promise<Club[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clubs")
    .select("*")
    .eq("status", "approved")
    .order("name");
  if (error) {
    console.error("getClubs:", error.message);
    return [];
  }
  return (data as ClubRow[]).map(mapClub);
}

export async function getClubsByCity(citySlug: string): Promise<Club[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clubs")
    .select("*")
    .eq("status", "approved")
    .eq("city_slug", citySlug)
    .order("name");
  if (error) {
    console.error("getClubsByCity:", error.message);
    return [];
  }
  return (data as ClubRow[]).map(mapClub);
}

export async function getClubsByCityAndCategory(citySlug: string, categorySlug: string): Promise<Club[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clubs")
    .select("*")
    .eq("status", "approved")
    .eq("city_slug", citySlug)
    .eq("category_slug", categorySlug)
    .order("name");
  if (error) {
    console.error("getClubsByCityAndCategory:", error.message);
    return [];
  }
  return (data as ClubRow[]).map(mapClub);
}

export async function getClubBySlug(slug: string): Promise<Club | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clubs")
    .select("*")
    .eq("slug", slug)
    .eq("status", "approved")
    .maybeSingle();
  if (error || !data) return null;
  return mapClub(data as ClubRow);
}

export async function getFeaturedClubs(): Promise<Club[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clubs")
    .select("*")
    .eq("status", "approved")
    .eq("is_featured", true)
    .order("name");
  if (error) {
    console.error("getFeaturedClubs:", error.message);
    return [];
  }
  return (data as ClubRow[]).map(mapClub);
}
