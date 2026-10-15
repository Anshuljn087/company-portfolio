import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const SESSION_COOKIE = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

type SessionPayload = {
  email: string;
  exp: number;
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

export function createAdminSessionToken(email: string) {
  const payload: SessionPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };

  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(payloadB64, getSecret());
  return `${payloadB64}.${signature}`;
}

export function verifyAdminSessionToken(token: string | undefined | null) {
  if (!token) return false;

  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return false;

  let expectedSignature: string;
  try {
    expectedSignature = sign(payloadB64, getSecret());
  } catch {
    return false;
  }
  const actual = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (actual.length !== expected.length) return false;
  if (!timingSafeEqual(actual, expected)) return false;

  let payload: SessionPayload;
  try {
    payload = JSON.parse(base64UrlDecode(payloadB64)) as SessionPayload;
  } catch {
    return false;
  }

  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return false;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || typeof payload.email !== "string") return false;
  if (!safeEqual(payload.email, adminEmail)) return false;

  return true;
}

export async function isAdminFromCookies() {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export const ADMIN_SESSION_COOKIE = SESSION_COOKIE;
export const ADMIN_SESSION_MAX_AGE = SESSION_TTL_SECONDS;
