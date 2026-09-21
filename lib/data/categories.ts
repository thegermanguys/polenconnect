import { createClient } from "@/lib/supabase/server";
import type { Category, CategoryGroup } from "@/lib/types";

interface CategoryRow {
  id: string;
  slug: string;
  name: string;
  icon: string;
  category_group: string;
  description: string | null;
}

function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    icon: row.icon,
    group: row.category_group as CategoryGroup,
    description: row.description ?? "",
  };
}

/** All categories (football, volleyball, regional-associations, …). */
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error) {
    console.error("getCategories:", error.message);
    return [];
  }
  return (data as CategoryRow[]).map(mapCategory);
}

export async function getSportsCategories(): Promise<Category[]> {
  return (await getCategories()).filter((c) => c.group === "sports");
}

export async function getCommunityCategories(): Promise<Category[]> {
  return (await getCategories()).filter((c) => c.group === "community");
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return mapCategory(data as CategoryRow);
}
