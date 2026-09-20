import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-2">
        <Compass className="h-8 w-8 text-muted-foreground" />
      </span>
      <h1 className="mt-6 font-display text-3xl font-semibold">Page not found</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        This page doesn't exist yet — maybe it's waiting for your community to submit it.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link href="/">Back home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/submit">Submit a listing</Link>
        </Button>
      </div>
    </div>
  );
}
