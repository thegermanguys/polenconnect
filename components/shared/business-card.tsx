import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Phone } from "lucide-react";
import type { Business } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export function BusinessCard({ business, basePath = "/businesses" }: { business: Business; basePath?: string }) {
  return (
    <Link
      href={`${basePath}/${business.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative h-44 w-full">
        <Image
          src={business.photos[0]}
          alt={business.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {business.isPremium && <Badge variant="accent" className="absolute left-3 top-3">Premium</Badge>}
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white">
          <Star className="h-3 w-3 fill-accent text-accent" /> {business.rating} ({business.reviewCount})
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-xs font-medium uppercase tracking-wide text-primary">{business.category}</span>
        <h3 className="font-display text-lg font-semibold">{business.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{business.description}</p>
        <div className="mt-auto space-y-1.5 pt-2 text-sm text-foreground/80">
          <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 shrink-0 text-primary" /> {business.address}</p>
          <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 shrink-0 text-primary" /> {business.phone}</p>
        </div>
      </div>
    </Link>
  );
}
