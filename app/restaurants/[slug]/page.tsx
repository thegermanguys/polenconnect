import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Phone, MapPin, Star, Instagram, Clock, Truck } from "lucide-react";
import { getRestaurantBySlug } from "@/lib/data/restaurants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = await getRestaurantBySlug(slug);
  if (!r) return {};
  return { title: r.name, description: r.description };
}

export default async function RestaurantDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant) notFound();

  return (
    <div className="container py-14">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="grid grid-cols-2 gap-3 overflow-hidden rounded-2xl">
            {restaurant.photos.map((photo, i) => (
              <div key={i} className={`relative h-64 ${i === 0 ? "col-span-2" : ""}`}>
                <Image src={photo} alt={`${restaurant.name} photo ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex gap-2">
                {restaurant.cuisine.map((c) => <Badge key={c} variant="secondary">{c}</Badge>)}
              </div>
              <h1 className="font-display text-3xl font-semibold sm:text-4xl">{restaurant.name}</h1>
            </div>
            <div className="flex shrink-0 items-center gap-1 rounded-full bg-surface-2 px-3 py-1.5 text-sm font-medium">
              <Star className="h-4 w-4 fill-accent text-accent" /> {restaurant.rating}
              <span className="text-muted-foreground">({restaurant.reviewCount})</span>
            </div>
          </div>

          <Separator className="my-6" />
          <p className="leading-relaxed text-foreground/85">{restaurant.description}</p>

          <Separator className="my-6" />
          <h2 className="font-display text-xl font-semibold">Menu Highlights</h2>
          <div className="mt-4 space-y-3">
            {restaurant.menuHighlights.map((item) => (
              <div key={item.name} className="flex items-start justify-between gap-4 rounded-xl border border-border p-4">
                <div>
                  <p className="font-medium">{item.name}</p>
                  {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                </div>
                <span className="shrink-0 font-display font-semibold text-primary">{item.price}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="h-fit space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-soft lg:sticky lg:top-24">
          <p className="flex items-start gap-3 text-sm"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {restaurant.address}</p>
          <p className="flex items-center gap-3 text-sm"><Phone className="h-4 w-4 shrink-0 text-primary" /> {restaurant.phone}</p>
          <div className="space-y-1.5 border-t border-border pt-3">
            {restaurant.openingHours.map((h) => (
              <div key={h.day} className="flex justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground"><Clock className="h-3.5 w-3.5" /> {h.day}</span>
                <span className="font-medium">{h.hours}</span>
              </div>
            ))}
          </div>
          <Button className="w-full" asChild>
            <a href={restaurant.mapsUrl} target="_blank" rel="noreferrer">Google Maps</a>
          </Button>
          <div className="grid grid-cols-2 gap-2">
            {restaurant.delivery.map((d) => (
              <Button key={d.partner} variant="outline" size="sm" asChild>
                <a href={d.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5" /> {d.partner}
                </a>
              </Button>
            ))}
          </div>
          {restaurant.social.instagram && (
            <a href={restaurant.social.instagram} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-surface-2 py-2.5 text-sm font-medium hover:bg-primary hover:text-primary-foreground">
              <Instagram className="h-4 w-4" /> Follow on Instagram
            </a>
          )}
        </aside>
      </div>
    </div>
  );
}
