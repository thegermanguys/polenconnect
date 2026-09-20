"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/search-bar";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient pb-20 pt-20 sm:pb-28 sm:pt-28">
      {/* ambient red/gold glow, decorative only */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.10]">
        <div className="absolute -left-10 top-10 h-64 w-64 rounded-full bg-flag-red blur-3xl" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-flag-gold blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="container relative flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/85 sm:text-sm"
        >
          The Home of Poles in Germany 
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl text-balance font-display text-4xl font-semibold leading-[1.08] text-white sm:text-6xl"
        >
          Every Polish person in Germany,
          <br />
          <span className="italic text-accent">one home</span> away from home.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-2xl text-balance text-base text-white/75 sm:text-lg"
        >
          Connect with sports clubs, cultural and music groups, restaurants, and events across Germany — all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 w-full max-w-3xl"
        >
          <SearchBar />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Button size="lg" variant="accent" asChild>
            <Link href="/cities">
              Explore Germany <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="glass" asChild>
            <Link href="/submit">
              <Plus className="h-4 w-4" /> Submit Your Community
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
