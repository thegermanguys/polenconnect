import Link from "next/link";
import Image from "next/image";
import { Users, Building2, CalendarDays } from "lucide-react";
import type { City } from "@/lib/types";

export function CityCard({ city }: { city: City }) {
  return (
    <Link
      href={`/cities/${city.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src={city.heroImage}
          alt={`${city.name} skyline`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-4">
          <h3 className="font-display text-xl font-semibold text-white">{city.name}</h3>
          <p className="text-xs text-white/80">{city.state}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 divide-x divide-border text-center">
        <Stat icon={Users} value={city.communityCount} label="Communities" />
        <Stat icon={Building2} value={city.businessCount} label="Businesses" />
        <Stat icon={CalendarDays} value={city.eventCount} label="Events" />
      </div>
    </Link>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Users;
  value: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-2 py-3">
      <Icon className="mb-0.5 h-3.5 w-3.5 text-muted-foreground" />
      <span className="font-display text-sm font-semibold">{value}</span>
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
    </div>
  );
}
