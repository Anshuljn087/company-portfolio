import { connectDB } from "@/src/lib/db";
import { RateLimit } from "@/src/models/RateLimit";

// Counters live in MongoDB so limits hold across serverless instances and
// restarts. Each key has a fixed window that starts at its first hit.

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_FAILURES = 5;

export function getClientIp(headers: Headers) {
  return (
    headers.get("x-real-ip")?.trim() ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown-ip"
  );
}

/** Atomically increments a fixed-window counter and returns the new state. */
async function hit(id: string, windowMs: number) {
  await connectDB();
  const now = new Date();
  const newExpiry = new Date(now.getTime() + windowMs);

  const doc = await RateLimit.findOneAndUpdate(
    { _id: id },
    [
      {
        $set: {
          count: {
            $cond: [
              { $gt: [{ $ifNull: ["$expiresAt", new Date(0)] }, now] },
              { $add: [{ $ifNull: ["$count", 0] }, 1] },
              1,
            ],
          },
          expiresAt: {
            $cond: [
              { $gt: [{ $ifNull: ["$expiresAt", new Date(0)] }, now] },
              "$expiresAt",
              newExpiry,
            ],
          },
        },
      },
    ],
    { upsert: true, new: true },
  ).lean<{ count: number; expiresAt: Date }>();

  return {
    count: doc!.count,
    retryAfterSec: Math.max(
      1,
      Math.ceil((doc!.expiresAt.getTime() - now.getTime()) / 1000),
    ),
  };
}

/** Fixed-window limiter for public endpoints. Counts every call. */
export async function hitRateLimit(
  bucket: string,
  key: string,
  max: number,
  windowMs: number,
) {
  const { count, retryAfterSec } = await hit(`${bucket}:${key}`, windowMs);
  return count > max
    ? { limited: true, retryAfterSec }
    : { limited: false, retryAfterSec: 0 };
}

export async function isLoginBlocked(key: string) {
  await connectDB();
  const doc = await RateLimit.findOne({
    _id: `login:${key}`,
    expiresAt: { $gt: new Date() },
  }).lean<{ count: number; expiresAt: Date }>();

  if (!doc || doc.count < LOGIN_MAX_FAILURES) {
    return { blocked: false, retryAfterSec: 0 };
  }
  return {
    blocked: true,
    retryAfterSec: Math.max(
      1,
      Math.ceil((doc.expiresAt.getTime() - Date.now()) / 1000),
    ),
  };
}

export async function registerLoginFailure(key: string) {
  await hit(`login:${key}`, LOGIN_WINDOW_MS);
}

export async function clearLoginFailures(key: string) {
  await connectDB();
  await RateLimit.deleteOne({ _id: `login:${key}` });
}
