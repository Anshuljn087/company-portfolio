import { cookies } from "next/headers";
import { createHmac, randomUUID, timingSafeEqual } from "crypto";
import { connectDB } from "@/src/lib/db";
import { AdminSession } from "@/src/models/AdminSession";

const SESSION_COOKIE = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

type SessionPayload = {
  email: string;
  exp: number;
  jti: string;
};

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing ADMIN_SESSION_SECRET in environment variables");
  }
  return secret;
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(payloadB64: string, secret: string) {
  return createHmac("sha256", secret).update(payloadB64).digest("base64url");
}

/** Constant-time string comparison (hashes first so lengths don't leak). */
export function safeEqual(a: string, b: string) {
  const ha = createHmac("sha256", "cmp").update(a).digest();
  const hb = createHmac("sha256", "cmp").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export async function createAdminSessionToken(email: string) {
  const payload: SessionPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    jti: randomUUID(),
  };

  await connectDB();
  await AdminSession.create({
    _id: payload.jti,
    email,
    expiresAt: new Date(payload.exp * 1000),
  });

  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(payloadB64, getSecret());
  return `${payloadB64}.${signature}`;
}

function parseToken(token: string | undefined | null) {
  if (!token) return null;

  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return null;

  let expectedSignature: string;
  try {
    expectedSignature = sign(payloadB64, getSecret());
  } catch {
    return null;
  }
  const actual = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);
  if (actual.length !== expected.length) return null;
  if (!timingSafeEqual(actual, expected)) return null;

  try {
    return JSON.parse(base64UrlDecode(payloadB64)) as SessionPayload;
  } catch {
    return null;
  }
}

export async function verifyAdminSessionToken(token: string | undefined | null) {
  if (!token) return false;

  const payload = parseToken(token);
  if (!payload || typeof payload.jti !== "string") return false;

  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return false;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || typeof payload.email !== "string") return false;
  if (!safeEqual(payload.email, adminEmail)) return false;

  // Must still exist server-side (logout deletes it).
  await connectDB();
  return Boolean(await AdminSession.exists({ _id: payload.jti }));
}

/** Revokes the session behind a cookie value (used by logout). */
export async function revokeAdminSessionToken(token: string | undefined | null) {
  const payload = parseToken(token);
  if (!payload || typeof payload.jti !== "string") return;
  await connectDB();
  await AdminSession.deleteOne({ _id: payload.jti });
}

export async function isAdminFromCookies() {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export const ADMIN_SESSION_COOKIE = SESSION_COOKIE;
export const ADMIN_SESSION_MAX_AGE = SESSION_TTL_SECONDS;
