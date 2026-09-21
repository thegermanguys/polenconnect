"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  value: string;
  label: string;
  index?: number;
  className?: string;
}

export function StatCard({ value, label, index = 0, className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={cn(
        "rounded-2xl border border-border bg-surface p-6 text-center shadow-soft sm:p-8",
        className
      )}
    >
      <p className="font-display text-4xl font-bold text-primary sm:text-5xl">{value}</p>
      <p className="mt-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </motion.div>
  );
}
