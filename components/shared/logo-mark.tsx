import { cn } from "@/lib/utils";

/**
 * Signature mark: a disc split white-over-red — the Polish flag's own band
 * order — with a small gold accent standing in for the crown on the
 * national eagle, without reproducing the emblem itself. Used as the app's
 * icon/favicon and next to the wordmark in the navbar and footer.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="22" fill="hsl(var(--surface))" stroke="hsl(var(--border))" strokeWidth="1" />
      <path d="M2 24a22 22 0 0 1 44 0z" fill="hsl(var(--surface))" />
      <path d="M2 24a22 22 0 0 0 44 0z" fill="hsl(var(--red))" />
      <circle cx="24" cy="24" r="5.5" fill="hsl(var(--gold))" />
      <path d="M24 17.5l1.3 3.9h4.1l-3.3 2.4 1.3 3.9-3.4-2.4-3.4 2.4 1.3-3.9-3.3-2.4h4.1z" fill="hsl(var(--surface))" opacity="0.9" />
    </svg>
  );
}
