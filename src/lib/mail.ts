import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { getClientIp, hitRateLimit } from "@/src/lib/rateLimit";

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

/** Strip CR/LF so user input can't inject headers or fake lines. */
export function oneLine(value: unknown, max = 200) {
  return String(value ?? "")
    .replace(/[\r\n]+/g, " ")
    .trim()
    .slice(0, max);
}

export function getMailConfig() {
  const user = process.env.SMTP_USER || process.env.SMTP_EMAIL;
  const pass = process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST;
  const to = process.env.ADMIN_EMAIL;
  if (!user || !pass || !host || !to) return null;

  const port = Number(process.env.SMTP_PORT) || 587;
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return { transporter, user, to };
}

/** Returns a 429 response if the caller exceeded the limit, else null. */
export function limitPublicRequest(req: Request, bucket: string) {
  const { limited, retryAfterSec } = hitRateLimit(
    bucket,
    getClientIp(req.headers),
    5,
    10 * 60 * 1000,
  );
  if (!limited) return null;
  return NextResponse.json(
    { success: false, error: "Too many requests. Try again later." },
    { status: 429, headers: { "Retry-After": String(retryAfterSec) } },
  );
}
