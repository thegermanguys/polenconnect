import Image from "next/image";
import Link from "next/link";
import { Phone, MapPin, Clock, Instagram, Facebook, MessageCircle } from "lucide-react";
import type { Club } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ClubCard({ club }: { club: Club }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all duration-300 hover:shadow-lift">
      <div className="relative h-36 w-full">
        <Image src={club.coverImage} alt={club.name} fill className="object-cover" sizes="400px" />
        {club.isFeatured && (
          <Badge variant="accent" className="absolute left-3 top-3">Featured</Badge>
        )}
        <div className="absolute -bottom-6 left-4 h-14 w-14 overflow-hidden rounded-xl border-4 border-surface shadow-soft">
          <Image src={club.logo} alt={`${club.name} logo`} fill className="object-cover" sizes="56px" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5 pt-9">
        <div>
          <Link href={`/cities/${club.citySlug}/${club.categorySlug}#${club.slug}`} className="font-display text-lg font-semibold hover:text-primary">
            {club.name}
          </Link>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{club.description}</p>
        </div>
        <div className="space-y-1.5 text-sm text-foreground/80">
          <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 shrink-0 text-primary" /> {club.practiceLocation}</p>
          <p className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 shrink-0 text-primary" /> {club.practiceTime}</p>
          <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 shrink-0 text-primary" /> {club.phone}</p>
        </div>
        <div className="flex items-center gap-2 pt-1">
          {club.social.instagram && (
            <a href={club.social.instagram} target="_blank" rel="noreferrer" className="rounded-full bg-surface-2 p-2 hover:bg-primary hover:text-primary-foreground">
              <Instagram className="h-3.5 w-3.5" />
            </a>
          )}
          {club.social.facebook && (
            <a href={club.social.facebook} target="_blank" rel="noreferrer" className="rounded-full bg-surface-2 p-2 hover:bg-primary hover:text-primary-foreground">
              <Facebook className="h-3.5 w-3.5" />
            </a>
          )}
          {club.social.whatsapp && (
            <a href={club.social.whatsapp} target="_blank" rel="noreferrer" className="rounded-full bg-surface-2 p-2 hover:bg-primary hover:text-primary-foreground">
              <MessageCircle className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
        <div className="mt-auto flex gap-2 pt-2">
          <Button size="sm" className="flex-1">Join Club</Button>
          <Button size="sm" variant="outline" className="flex-1" asChild>
            <a href={club.mapsUrl} target="_blank" rel="noreferrer">Google Maps</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
