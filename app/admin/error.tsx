"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="container flex flex-col items-center py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertTriangle className="h-7 w-7" />
      </span>
      <h1 className="mt-6 font-display text-2xl font-semibold">That action didn&apos;t go through</h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">{error.message}</p>
      <p className="mt-1 max-w-md text-xs text-muted-foreground">
        Common cause: a city or category value that doesn&apos;t match one already in the database.
      </p>
      <div className="mt-8 flex gap-3">
        <Button variant="outline" onClick={() => reset()}>Try again</Button>
        <Button onClick={() => router.push("/admin")}>Back to admin</Button>
      </div>
    </div>
  );
}
