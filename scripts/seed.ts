// One-time (and re-runnable) migration of the app's original dummy data into
// Supabase. Reads the JSON files in supabase/seed-data/ — which are a direct
// export of what used to live in lib/data/*.ts — and upserts them, keyed on
// `slug`, so running this more than once updates rather than duplicates.
//
// Usage:
//   npm install -D tsx        (one-time)
//   npm run seed
//
// Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, either
// already exported in your shell or present in .env.local (this script reads
// .env.local itself — it does not go through Next.js).

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

// --- tiny .env.local loader, so this works with a plain `tsx` run ----------
function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  for (const rawLine of readFileSync(envPath, "utf8").split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    const isQuoted =
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"));
    if (isQuoted) value = value.slice(1, -1);
    if (!(key in process.env)) process.env[key] = value;
  }
}
loadEnvLocal();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Add both to .env.local (see .env.example) before running the seed script.\n" +
      "SUPABASE_SERVICE_ROLE_KEY is the 'service_role' key from Project Settings -> API\n" +
      "— it's secret, never put it in NEXT_PUBLIC_* or ship it to the browser."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

function readJson(file: string): any[] {
  const p = path.join(process.cwd(), "supabase", "seed-data", file);
  return JSON.parse(readFileSync(p, "utf8"));
}

// --- camelCase (old lib/data/*.ts shape) -> snake_case (DB columns) --------

function toCityRow(c: any) {
  return {
    slug: c.slug,
    name: c.name,
    state: c.state,
    lat: c.lat,
    lng: c.lng,
    hero_image: c.heroImage ?? null,
    blurb: c.blurb ?? null,
    community_count: c.communityCount ?? 0,
    business_count: c.businessCount ?? 0,
    event_count: c.eventCount ?? 0,
    member_count: c.memberCount ?? 0,
    is_featured: !!c.isFeatured,
  };
}

function toCategoryRow(c: any) {
  return {
    slug: c.slug,
    name: c.name,
    icon: c.icon,
    category_group: c.group,
    description: c.description ?? null,
  };
}

function toClubRow(c: any) {
  return {
    slug: c.slug,
    name: c.name,
    city_slug: c.citySlug,
    category_slug: c.categorySlug,
    logo: c.logo ?? null,
    cover_image: c.coverImage ?? null,
    description: c.description ?? null,
    social: c.social ?? {},
    phone: c.phone ?? "",
    email: c.email ?? "",
    maps_url: c.mapsUrl ?? "",
    is_featured: !!c.isFeatured,
    status: c.status ?? "approved",
    captain_name: c.captainName ?? "",
    practice_location: c.practiceLocation ?? "",
    practice_time: c.practiceTime ?? "",
    member_count: c.memberCount ?? 0,
    contact_person: c.contactPerson ?? "",
  };
}

function toRestaurantRow(r: any) {
  return {
    slug: r.slug,
    name: r.name,
    city_slug: r.citySlug,
    category: r.category ?? "Restaurant",
    logo: r.logo ?? null,
    photos: r.photos ?? [],
    description: r.description ?? null,
    opening_hours: r.openingHours ?? [],
    address: r.address ?? "",
    maps_url: r.mapsUrl ?? "",
    social: r.social ?? {},
    phone: r.phone ?? "",
    rating: r.rating ?? 0,
    review_count: r.reviewCount ?? 0,
    is_premium: !!r.isPremium,
    status: r.status ?? "approved",
    cuisine: r.cuisine ?? [],
    menu_highlights: r.menuHighlights ?? [],
    delivery: r.delivery ?? [],
  };
}

function toEventRow(e: any) {
  return {
    slug: e.slug,
    title: e.title,
    city_slug: e.citySlug,
    organizer: e.organizer ?? "",
    poster: e.poster ?? null,
    location: e.location ?? "",
    maps_url: e.mapsUrl ?? "",
    start_date: e.startDate,
    end_date: e.endDate ?? null,
    description: e.description ?? null,
    category: e.category ?? "other",
    festival_tag: e.festivalTag ?? null,
    price: e.price ?? "",
    register_url: e.registerUrl ?? "",
    is_featured: !!e.isFeatured,
    status: e.status ?? "approved",
  };
}

async function upsert(table: string, rows: any[]) {
  if (rows.length === 0) {
    console.log(`  ${table}: nothing to seed`);
    return;
  }
  const { error } = await supabase.from(table).upsert(rows, { onConflict: "slug" });
  if (error) {
    console.error(`  ${table}: FAILED — ${error.message}`);
    process.exit(1);
  }
  console.log(`  ${table}: upserted ${rows.length} row(s)`);
}

async function main() {
  console.log(`Seeding ${SUPABASE_URL} from supabase/seed-data/ ...\n`);

  console.log("Reference data (insert order matters — clubs/restaurants/events below reference these by slug):");
  await upsert("cities", readJson("cities.json").map(toCityRow));
  await upsert("categories", readJson("categories.json").map(toCategoryRow));

  console.log("\nContent:");
  await upsert("clubs", readJson("clubs.json").map(toClubRow));
  await upsert("restaurants", readJson("restaurants.json").map(toRestaurantRow));
  await upsert("events", readJson("events.json").map(toEventRow));

  console.log("\nDone — open the Table Editor in your Supabase project to confirm, then run `npm run dev`.");
}

main().catch((err) => {
  console.error("Seed script crashed:", err);
  process.exit(1);
});
