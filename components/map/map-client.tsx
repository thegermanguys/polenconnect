"use client";

import * as React from "react";
import Link from "next/link";
import { MapPin, Users, Building2, CalendarDays, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { City } from "@/lib/types";

// Bounding box roughly covering mainland Germany, used to project lat/lng
// onto the illustrative outline below. Swap this whole component for a
// Google Maps <Map> once NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is configured.
const BOUNDS = { minLat: 47.3, maxLat: 55.1, minLng: 5.9, maxLng: 15.1 };
const VIEW_W = 420;
const VIEW_H = 560;

function project(lat: number, lng: number) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * VIEW_W;
  const y = VIEW_H - ((lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * VIEW_H;
  return { x, y };
}

// Simplified, illustrative Germany silhouette — not survey-accurate.
const GERMANY_OUTLINE =
  "M180 10 L230 25 L260 15 L300 40 L330 70 L340 110 L365 130 L385 170 L400 210 L390 250 L410 290 L395 330 L400 370 L370 400 L375 440 L340 470 L320 510 L280 540 L240 550 L210 520 L180 530 L150 500 L120 510 L90 470 L70 430 L85 390 L60 350 L75 310 L55 270 L70 230 L55 190 L80 150 L70 110 L100 80 L130 50 L160 30 Z";

export function MapClient({ cities }: { cities: City[] }) {
  const [activeSlug, setActiveSlug] = React.useState(cities[0]?.slug);
  const active = cities.find((c) => c.slug === activeSlug) ?? cities[0];

  return (
    <div className="container py-14">
      <div className="max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Map</span>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Poles across Germany
        </h1>
        <p className="mt-4 text-muted-foreground">
          Click a city on the map to see its communities, businesses, and events. This illustrative
          map will be replaced with a live Google Maps view once connected.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
          <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="w-full" role="img" aria-label="Map of Germany">
            <path
              d={GERMANY_OUTLINE}
              className="fill-secondary/10 stroke-secondary/40"
              strokeWidth={2}
            />
            {cities.map((city) => {
              const { x, y } = project(city.lat, city.lng);
              const isActive = city.slug === activeSlug;
              return (
                <g
                  key={city.slug}
                  transform={`translate(${x}, ${y})`}
                  className="cursor-pointer"
                  onClick={() => setActiveSlug(city.slug)}
                >
                  {isActive && <circle r={12} className="fill-accent/25 animate-pulse" />}
                  <circle r={isActive ? 7 : 5} className={isActive ? "fill-primary" : "fill-secondary"} stroke="white" strokeWidth={1.5} />
                  {isActive && (
                    <text y={-14} textAnchor="middle" className="fill-foreground font-sans text-[11px] font-semibold">
                      {city.name}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {active && (
          <div className="flex flex-col justify-center rounded-3xl border border-border bg-surface p-8 shadow-soft">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" /> {active.state}
            </span>
            <h2 className="mt-2 font-display text-3xl font-semibold">{active.name}</h2>
            <p className="mt-3 text-muted-foreground">{active.blurb}</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <MiniStat icon={Users} value={active.communityCount} label="Communities" />
              <MiniStat icon={Building2} value={active.businessCount} label="Businesses" />
              <MiniStat icon={CalendarDays} value={active.eventCount} label="Events" />
            </div>
            <Button className="mt-8 w-fit" asChild>
              <Link href={`/cities/${active.slug}`}>
                Explore {active.name} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, value, label }: { icon: typeof Users; value: number; label: string }) {
  return (
    <div className="rounded-xl bg-surface-2 p-3 text-center">
      <Icon className="mx-auto mb-1 h-4 w-4 text-primary" />
      <p className="font-display text-lg font-bold">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}
