"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const SEARCH_SCOPES = [
  { value: "all", label: "Everything" },
  { value: "city", label: "City" },
  { value: "club", label: "Club" },
  { value: "restaurant", label: "Restaurant" },
  { value: "event", label: "Event" },
] as const;

export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [scope, setScope] = React.useState<(typeof SEARCH_SCOPES)[number]["value"]>("all");
  const [query, setQuery] = React.useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (scope !== "all") params.set("type", scope);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-3 flex flex-wrap gap-2">
        {SEARCH_SCOPES.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => setScope(s.value)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors sm:text-sm",
              scope === s.value
                ? "border-accent bg-accent text-accent-foreground"
                : "border-white/25 bg-white/5 text-white/85 hover:bg-white/15"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 rounded-2xl bg-surface p-2 shadow-lift sm:flex-row"
      >
        <div className="flex flex-1 items-center gap-2 px-3">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try “Berlin football”, “Munich restaurant”, “Frankfurt parish”…"
            className="h-12 border-none bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
          />
        </div>
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          Search
        </Button>
      </form>
    </div>
  );
}
