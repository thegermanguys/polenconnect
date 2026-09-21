import Link from "next/link";
import { getIcon } from "@/lib/icon-map";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

const groupAccent: Record<Category["group"], string> = {
  sports: "bg-primary/10 text-red-deep group-hover:bg-primary group-hover:text-primary-foreground",
  community: "bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-secondary-foreground",
  food: "bg-accent/15 text-accent-foreground group-hover:bg-accent group-hover:text-accent-foreground",
  life: "bg-flag-gold/10 text-flag-gold group-hover:bg-flag-gold group-hover:text-white",
};

export function CategoryCard({ category, href }: { category: Category; href: string }) {
  const Icon = getIcon(category.icon);
  return (
    <Link
      href={href}
      className="group flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <span
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300",
          groupAccent[category.group]
        )}
      >
        <Icon className="h-6 w-6" />
      </span>
      <div>
        <h3 className="font-display text-base font-semibold">{category.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{category.description}</p>
      </div>
    </Link>
  );
}
