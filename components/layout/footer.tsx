import Link from "next/link";
import { Instagram, Facebook, Youtube, ExternalLink } from "lucide-react";
import { LogoMark } from "@/components/shared/logo-mark";

const columns = [
  {
    title: "Discover",
    links: [
      { href: "/cities", label: "Cities" },
      { href: "/clubs", label: "Clubs" },
      { href: "/map", label: "Map" },
      { href: "/events", label: "Events" },
      { href: "/search", label: "Search" },
    ],
  },
  {
    title: "Life in Germany",
    links: [
      { href: "/restaurants", label: "Restaurants" },
      { href: "/affiliates", label: "Partner Deals" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/submit", label: "Submit Your Community" },
      { href: "/admin", label: "Admin" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="bicolor-strip" />
      <div className="container grid gap-10 py-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <LogoMark className="h-10 w-10" />
            <span className="font-display text-xl font-semibold text-graphite">
              Polen<span className="text-red-deep">Connect</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            The home of Poles in Germany — parishes, cultural associations, restaurants, and events, all in one place.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 hover:bg-primary hover:text-primary-foreground transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 hover:bg-primary hover:text-primary-foreground transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Youtube" className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 hover:bg-primary hover:text-primary-foreground transition-colors">
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-foreground/80 hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border py-6">
        <div className="container flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} PolenConnect Germany. Made for the Polish community in Germany.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link href="/impressum" className="hover:text-foreground">Impressum</Link>
          </div>
          <div className="flex gap-4">
            <Link href="/submit" className="hover:text-foreground">Advertise</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
