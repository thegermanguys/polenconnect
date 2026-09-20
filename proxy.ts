import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, adminSessionToken } from "@/lib/admin/hash";

// Clerk now runs on every request (for real user sessions), while /admin keeps
// its own separate password-based gate, unchanged from before.
export default clerkMiddleware(async (_auth, request) => {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const expected = await adminSessionToken();
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

    if (!expected || token !== expected) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico)).*)",
    "/(api|trpc)(.*)",
  ],
};
