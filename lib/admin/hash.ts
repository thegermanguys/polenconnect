// Pure helpers only — no next/headers, no Node-only APIs — so this file can
// be safely imported from BOTH middleware.ts (Edge runtime) and Server
// Actions / Server Components (Node runtime). Everything here uses the Web
// Crypto API (globalThis.crypto.subtle), which both runtimes provide.

export const ADMIN_COOKIE_NAME = "nc_admin_session";

export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * The value the session cookie should hold when signed in — the hash of
 * ADMIN_PASSWORD, so the raw password is never itself stored in a cookie.
 * Returns null if ADMIN_PASSWORD isn't set (which makes the admin area
 * unreachable until it is — see .env.example).
 */
export async function adminSessionToken(): Promise<string | null> {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return null;
  return sha256Hex(secret);
}
