import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { StatsSection } from "@/components/home/stats";
import { CategoriesGrid } from "@/components/home/categories-grid";
import { CitiesGrid } from "@/components/home/cities-grid";
import { FeaturedClubsSection } from "@/components/home/featured-clubs";
import { FestivalsSection } from "@/components/home/festivals";
import { CtaSection } from "@/components/home/cta-section";

export const metadata: Metadata = {
  title: "The Home of Poles in Germany",
};

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsSection />
      <CategoriesGrid />
      <CitiesGrid />
      <FeaturedClubsSection />
      <FestivalsSection />
      <CtaSection />
    </>
  );
}
