import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { SearchBar } from "@/components/shared/search-bar";
import { runSearch } from "@/lib/search";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Search",
};

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const { q, type } = await searchParams;
  const query = q ?? "";
  const results = await runSearch(query, type);

  return (
    <div className="container py-14">
      <div className="max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Search</span>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {query ? `Results for "${query}"` : "Search everything"}
        </h1>
      </div>

      <div className="mt-8 max-w-2xl">
        <SearchBar />
      </div>

      {results.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((r, i) => (
            <Link
              key={`${r.type}-${r.href}-${i}`}
              href={r.href}
              className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-soft transition-shadow hover:shadow-lift"
            >
              {r.image ? (
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                  <Image src={r.image} alt={r.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="h-14 w-14 shrink-0 rounded-xl bg-surface-2" />
              )}
              <div className="min-w-0">
                <Badge variant="muted" className="mb-1 capitalize">{r.type}</Badge>
                <p className="truncate font-display font-semibold">{r.title}</p>
                <p className="truncate text-sm text-muted-foreground">{r.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center text-center">
          <SearchX className="h-10 w-10 text-muted-foreground" />
          <p className="mt-4 font-display text-lg font-semibold">No results found</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a different city, category, or keyword.</p>
        </div>
      )}
    </div>
  );
}
