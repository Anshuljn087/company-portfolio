import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/src/lib/adminAuth";

export async function POST(req: Request) {
  const response = NextResponse.redirect(new URL("/admin/login", req.url));
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
