import { NextResponse, type NextRequest } from "next/server";

// Lightweight gate: unauthenticated visitors never reach admin pages.
// Real verification (HMAC + expiry) still happens in the pages and API routes
// via isAdminFromCookies(); this only checks that a session cookie exists.
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  if (!req.cookies.get("admin_session")?.value) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
