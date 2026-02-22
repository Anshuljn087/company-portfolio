import { NextResponse } from "next/server";
import { headers } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
} from "@/src/lib/adminAuth";
import {
  clearLoginFailures,
  isLoginBlocked,
  registerLoginFailure,
} from "@/src/lib/rateLimit";

function getClientIdentifier(
  ipHeader: string | null,
  userAgent: string | null,
) {
  const ip = ipHeader?.split(",")[0]?.trim() || "unknown-ip";
  const ua = userAgent || "unknown-ua";
  return `${ip}:${ua}`;
}

export async function POST(req: Request) {
  const requestHeaders = await headers();
  const ipHeader =
    requestHeaders.get("x-forwarded-for") || requestHeaders.get("x-real-ip");
  const userAgent = requestHeaders.get("user-agent");
  const clientKey = getClientIdentifier(ipHeader, userAgent);

  const blockState = isLoginBlocked(clientKey);
  if (blockState.blocked) {
    return NextResponse.json(
      { message: "Too many login attempts. Try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(blockState.retryAfterSec) },
      },
    );
  }

  const { email, password } = await req.json();

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    clearLoginFailures(clientKey);

    const token = createAdminSessionToken(email);
    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return response;
  }

  registerLoginFailure(clientKey);

  return NextResponse.json(
    { message: "Unauthorized" },
    { status: 401 }
  );
}
