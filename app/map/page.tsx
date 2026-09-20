import { getCities } from "@/lib/data/cities";
import { MapClient } from "@/components/map/map-client";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const cities = await getCities();
  return <MapClient cities={cities} />;
}
