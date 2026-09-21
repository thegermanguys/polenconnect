import type { MetadataRoute } from "next";
import { getCities } from "@/lib/data/cities";
import { getRestaurants } from "@/lib/data/restaurants";
import { getEvents } from "@/lib/data/events";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/cities",
    "/clubs",
    "/restaurants",
    "/events",
    "/map",
    "/search",
    "/submit",
    "/affiliates",
    "/impressum",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const [cities, restaurants, events] = await Promise.all([getCities(), getRestaurants(), getEvents()]);

  const cityRoutes = cities.map((c) => ({ url: `${siteUrl}/cities/${c.slug}`, lastModified: new Date() }));
  const restaurantRoutes = restaurants.map((r) => ({ url: `${siteUrl}/restaurants/${r.slug}`, lastModified: new Date() }));
  const eventRoutes = events.map((e) => ({ url: `${siteUrl}/events/${e.slug}`, lastModified: new Date() }));

  return [...staticRoutes, ...cityRoutes, ...restaurantRoutes, ...eventRoutes];
}
