import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionToken,
  safeEqual,
} from "@/src/lib/adminAuth";
import {
  clearLoginFailures,
  getClientIp,
  isLoginBlocked,
  registerLoginFailure,
} from "@/src/lib/rateLimit";

export async function POST(req: Request) {
  const clientKey = getClientIp(req.headers);

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

  let body: { email?: unknown; password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email : "";
  const password = typeof body.password === "string" ? body.password : "";
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword || !process.env.ADMIN_SESSION_SECRET) {
    console.error("Admin auth is not configured");
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }

  // Evaluate both so timing doesn't reveal which field was wrong.
  const emailOk = safeEqual(email, adminEmail);
  const passwordOk = safeEqual(password, adminPassword);

  if (emailOk && passwordOk) {
    clearLoginFailures(clientKey);

    const token = createAdminSessionToken(email);
    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_SESSION_MAX_AGE,
    });
    return response;
  }

  registerLoginFailure(clientKey);

  return NextResponse.json(
    { message: "Unauthorized" },
    { status: 401 }
  );
}
