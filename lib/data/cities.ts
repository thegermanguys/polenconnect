import { createClient } from "@/lib/supabase/server";
import type { City } from "@/lib/types";

interface CityRow {
  id: string;
  slug: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  hero_image: string | null;
  blurb: string | null;
  community_count: number;
  business_count: number;
  event_count: number;
  member_count: number;
  is_featured: boolean;
}

function mapCity(row: CityRow): City {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    state: row.state,
    lat: row.lat,
    lng: row.lng,
    heroImage: row.hero_image ?? "",
    blurb: row.blurb ?? "",
    communityCount: row.community_count,
    businessCount: row.business_count,
    eventCount: row.event_count,
    memberCount: row.member_count,
    isFeatured: row.is_featured,
  };
}

/** All cities, alphabetical. */
export async function getCities(): Promise<City[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("cities").select("*").order("name");
  if (error) {
    console.error("getCities:", error.message);
    return [];
  }
  return (data as CityRow[]).map(mapCity);
}

export async function getCityBySlug(slug: string): Promise<City | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return mapCity(data as CityRow);
}

export async function getFeaturedCities(): Promise<City[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .eq("is_featured", true)
    .order("name");
  if (error) {
    console.error("getFeaturedCities:", error.message);
    return [];
  }
  return (data as CityRow[]).map(mapCity);
}

// Homepage marketing banner ("120+ Cities", "600+ Communities", …). These are
// deliberately round, aspirational figures rather than a live COUNT(*) of the
// tables above — bump them by hand as the community actually grows.
export interface PlatformStats {
  cities: number;
  communities: number;
  sportsClubs: number;
  restaurants: number;
  members: number;
}

// Homepage marketing banner ("N+ Cities", "N+ Communities", …). Live counts
// pulled from Supabase — only approved listings count, and "members" is the
// sum of each approved club's member_count.
export async function getPlatformStats(): Promise<PlatformStats> {
  const supabase = await createClient();

  const [
    { count: cities },
    { count: communities },
    { count: sportsClubs },
    { count: restaurants },
    { data: clubMembers },
  ] = await Promise.all([
    supabase.from("cities").select("*", { count: "exact", head: true }),
    supabase
      .from("clubs")
      .select("id, categories!inner(category_group)", { count: "exact", head: true })
      .eq("status", "approved")
      .eq("categories.category_group", "community"),
    supabase
      .from("clubs")
      .select("id, categories!inner(category_group)", { count: "exact", head: true })
      .eq("status", "approved")
      .eq("categories.category_group", "sports"),
    supabase.from("restaurants").select("*", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("clubs").select("member_count").eq("status", "approved"),
  ]);

  const members = (clubMembers ?? []).reduce((sum, row) => sum + (row.member_count ?? 0), 0);

  return {
    cities: cities ?? 0,
    communities: communities ?? 0,
    sportsClubs: sportsClubs ?? 0,
    restaurants: restaurants ?? 0,
    members,
  };
}
