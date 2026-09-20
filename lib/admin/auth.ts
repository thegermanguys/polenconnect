import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, adminSessionToken, sha256Hex } from "@/lib/admin/hash";

export async function isAdminAuthenticated(): Promise<boolean> {
  const expected = await adminSessionToken();
  if (!expected) return false;
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE_NAME)?.value === expected;
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const expected = await adminSessionToken();
  if (!expected) return false;
  const attempt = await sha256Hex(password);
  return attempt === expected;
}

export async function createAdminSession(): Promise<void> {
  const expected = await adminSessionToken();
  if (!expected) return;
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14, // 14 days
  });
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
