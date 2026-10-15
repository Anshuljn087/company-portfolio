import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  revokeAdminSessionToken,
} from "@/src/lib/adminAuth";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  try {
    await revokeAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
  } catch (err) {
    console.error("LOGOUT REVOKE ERROR:", err);
  }

  // 303 so the browser follows the redirect with GET after the form POST.
  const response = NextResponse.redirect(new URL("/admin/login", req.url), 303);
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
