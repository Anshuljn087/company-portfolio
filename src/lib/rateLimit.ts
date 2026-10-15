type AttemptState = {
  count: number;
  windowStart: number;
  blockedUntil: number;
};

const attempts = new Map<string, AttemptState>();
const buckets = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 15 * 60 * 1000;
const BLOCK_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;
const MAX_TRACKED_CLIENTS = 10000;

// Note: state is per server instance. For multi-instance deployments, back
// this with a shared store (e.g. Redis/Upstash).

export function getClientIp(headers: Headers) {
  return (
    headers.get("x-real-ip")?.trim() ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown-ip"
  );
}

function cleanupOldEntries(now: number) {
  if (attempts.size >= MAX_TRACKED_CLIENTS) {
    for (const [key, state] of attempts.entries()) {
      const isExpiredWindow = now - state.windowStart > WINDOW_MS;
      const isUnblocked = state.blockedUntil <= now;
      if (isExpiredWindow && isUnblocked) {
        attempts.delete(key);
      }
    }
  }

  if (buckets.size >= MAX_TRACKED_CLIENTS) {
    for (const [key, state] of buckets.entries()) {
      if (state.resetAt <= now) buckets.delete(key);
    }
  }
}

export function isLoginBlocked(key: string) {
  const now = Date.now();
  const state = attempts.get(key);
  if (!state) return { blocked: false, retryAfterSec: 0 };

  if (state.blockedUntil > now) {
    return {
      blocked: true,
      retryAfterSec: Math.max(
        1,
        Math.ceil((state.blockedUntil - now) / 1000),
      ),
    };
  }

  return { blocked: false, retryAfterSec: 0 };
}

export function registerLoginFailure(key: string) {
  const now = Date.now();
  cleanupOldEntries(now);

  const current = attempts.get(key);
  if (!current) {
    attempts.set(key, { count: 1, windowStart: now, blockedUntil: 0 });
    return;
  }

  if (now - current.windowStart > WINDOW_MS) {
    current.count = 1;
    current.windowStart = now;
    current.blockedUntil = 0;
    attempts.set(key, current);
    return;
  }

  current.count += 1;
  if (current.count >= MAX_FAILURES) {
    current.blockedUntil = now + BLOCK_MS;
  }
  attempts.set(key, current);
}

export function clearLoginFailures(key: string) {
  attempts.delete(key);
}

/** Fixed-window limiter for public endpoints. Counts every call. */
export function hitRateLimit(
  bucket: string,
  key: string,
  max: number,
  windowMs: number,
) {
  const now = Date.now();
  cleanupOldEntries(now);

  const id = `${bucket}:${key}`;
  const current = buckets.get(id);
  if (!current || current.resetAt <= now) {
    buckets.set(id, { count: 1, resetAt: now + windowMs });
    return { limited: false, retryAfterSec: 0 };
  }

  current.count += 1;
  if (current.count > max) {
    return {
      limited: true,
      retryAfterSec: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }
  return { limited: false, retryAfterSec: 0 };
}
