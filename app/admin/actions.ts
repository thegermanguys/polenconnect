"use server";

import { redirect } from "next/navigation";
import { isAdminAuthenticated, destroyAdminSession } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";

type EntityTable = "clubs" | "restaurants" | "events";

function assertEntityTable(value: string): EntityTable {
  if (value === "clubs" || value === "restaurants" || value === "events") return value;
  throw new Error(`Invalid table: ${value}`);
}

async function requireAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect("/admin/login");
}

function str(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function socialFromForm(formData: FormData) {
  const social: Record<string, string> = {};
  for (const key of ["instagram", "facebook", "tiktok", "whatsapp", "website"]) {
    const v = str(formData, key);
    if (v) social[key] = v;
  }
  return social;
}

// --- Moderation: approve / reject whatever's in the pending queue ----------

export async function setListingStatusAction(formData: FormData) {
  await requireAdmin();
  const table = assertEntityTable(str(formData, "table"));
  const id = str(formData, "id");
  const status = str(formData, "status");
  if (status !== "approved" && status !== "rejected") throw new Error("Invalid status");

  const supabase = createAdminClient();
  const { error } = await supabase.from(table).update({ status }).eq("id", id);
  if (error) throw new Error(error.message);

  redirect("/admin?tab=approvals");
}

export async function adminLogoutAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}

// --- Direct "add new" — admin-authored, so it publishes immediately --------

export async function createClubAction(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();

  const name = str(formData, "name");
  const slugInput = str(formData, "slug");
  const row = {
    slug: slugify(slugInput || name),
    name,
    city_slug: str(formData, "citySlug"),
    category_slug: str(formData, "categorySlug"),
    logo: str(formData, "logo") || null,
    cover_image: str(formData, "coverImage") || null,
    description: str(formData, "description"),
    phone: str(formData, "phone"),
    email: str(formData, "email"),
    maps_url: str(formData, "mapsUrl"),
    captain_name: str(formData, "captainName"),
    practice_location: str(formData, "practiceLocation"),
    practice_time: str(formData, "practiceTime"),
    contact_person: str(formData, "contactPerson"),
    member_count: Number(str(formData, "memberCount")) || 0,
    is_featured: formData.get("isFeatured") === "on",
    social: socialFromForm(formData),
    status: "approved" as const,
  };

  const { error } = await supabase.from("clubs").insert(row);
  if (error) throw new Error(error.message);
  redirect("/admin?tab=clubs");
}

export async function createRestaurantAction(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();

  const name = str(formData, "name");
  const slugInput = str(formData, "slug");
  const cuisineRaw = str(formData, "cuisine");
  const photosRaw = str(formData, "photos");
  const row = {
    slug: slugify(slugInput || name),
    name,
    city_slug: str(formData, "citySlug"),
    category: str(formData, "category") || "Restaurant",
    logo: str(formData, "logo") || null,
    photos: photosRaw ? photosRaw.split(",").map((s) => s.trim()).filter(Boolean) : [],
    description: str(formData, "description"),
    address: str(formData, "address"),
    phone: str(formData, "phone"),
    maps_url: str(formData, "mapsUrl"),
    cuisine: cuisineRaw ? cuisineRaw.split(",").map((s) => s.trim()).filter(Boolean) : [],
    rating: Number(str(formData, "rating")) || 0,
    review_count: Number(str(formData, "reviewCount")) || 0,
    is_premium: formData.get("isPremium") === "on",
    social: socialFromForm(formData),
    opening_hours: [],
    menu_highlights: [],
    delivery: [],
    status: "approved" as const,
  };

  const { error } = await supabase.from("restaurants").insert(row);
  if (error) throw new Error(error.message);
  redirect("/admin?tab=restaurants");
}

export async function createEventAction(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();

  const title = str(formData, "title");
  const slugInput = str(formData, "slug");
  const row = {
    slug: slugify(slugInput || title),
    title,
    city_slug: str(formData, "citySlug"),
    organizer: str(formData, "organizer"),
    poster: str(formData, "poster") || null,
    location: str(formData, "location"),
    maps_url: str(formData, "mapsUrl"),
    start_date: str(formData, "startDate"),
    end_date: str(formData, "endDate") || null,
    description: str(formData, "description"),
    category: str(formData, "category") || "other",
    festival_tag: str(formData, "festivalTag") || null,
    price: str(formData, "price"),
    register_url: str(formData, "registerUrl"),
    is_featured: formData.get("isFeatured") === "on",
    status: "approved" as const,
  };

  const { error } = await supabase.from("events").insert(row);
  if (error) throw new Error(error.message);
  redirect("/admin?tab=events");
}
