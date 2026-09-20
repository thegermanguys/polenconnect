import { StatCard } from "@/components/shared/stat-card";
import { getPlatformStats } from "@/lib/data/cities";

export async function StatsSection() {
  const platformStats = await getPlatformStats();
  const items = [
    { value: `${platformStats.cities}+`, label: "Cities" },
    { value: `${platformStats.communities}+`, label: "Communities" },
    { value: `${platformStats.sportsClubs}+`, label: "Sports Clubs" },
    { value: `${platformStats.restaurants}+`, label: "Restaurants" },
    { value: `${platformStats.members}+`, label: "Members" },
  ];

  return (
    <section className="container -mt-10 relative z-10">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item, i) => (
          <StatCard key={item.label} value={item.value} label={item.label} index={i} />
        ))}
      </div>
    </section>
  );
}
