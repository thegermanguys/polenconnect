"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LogoMark } from "@/components/shared/logo-mark";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/cities", label: "Cities" },
  { href: "/clubs", label: "Clubs" },
  { href: "/events", label: "Events" },
  { href: "/restaurants", label: "Restaurants" },
  { href: "/affiliates", label: "Partner Deals" },
];

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50">
      <div className="glass border-b border-border/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 rounded-xl bg-white/95 px-3 py-1.5 shadow-sm ring-1 ring-border/40">
            <LogoMark className="h-8 w-8 sm:h-9 sm:w-9" />
            <span className="font-display text-lg font-semibold leading-none text-graphite sm:text-xl">
              Polen<span className="text-red-deep">Connect</span>
              <span className="block text-[10px] font-sans font-medium tracking-[0.2em] text-muted-foreground">
                GERMANY
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground",
                  pathname?.startsWith(link.href) && "bg-surface-2 text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" asChild aria-label="Search">
              <Link href="/search">
                <Search className="h-[18px] w-[18px]" />
              </Link>
            </Button>
            <ThemeToggle />
            {/* Sign-in hidden for now — no account-linked features exist yet
                (dashboard is still a placeholder). Re-add once real user
                profiles/favorites are built. Clerk itself stays wired up. */}
            <Button size="sm" className="hidden md:inline-flex" asChild>
              <Link href="/submit">Submit Your Community</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      <div className="bicolor-strip" />

      {open && (
        <div className="glass border-b border-border/60 lg:hidden">
          <nav className="container flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-surface-2"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 px-4">
              <Button size="sm" className="flex-1" asChild>
                <Link href="/submit">Submit</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
