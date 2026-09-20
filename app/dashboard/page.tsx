import { getClubs } from "@/lib/data/clubs";
import { getEvents } from "@/lib/data/events";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [clubs, events] = await Promise.all([getClubs(), getEvents()]);
  const myClub = clubs[0];
  const myEvents = events.slice(0, 2);

  if (!myClub) {
    return (
      <div className="container py-14 text-center text-muted-foreground">
        No clubs yet — once one exists, its owner dashboard preview will show up here.
      </div>
    );
  }

  return <DashboardClient myClub={myClub} myEvents={myEvents} />;
}
