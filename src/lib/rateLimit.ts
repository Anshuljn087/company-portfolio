type AttemptState = {
  count: number;
  windowStart: number;
  blockedUntil: number;
};

const attempts = new Map<string, AttemptState>();

const WINDOW_MS = 15 * 60 * 1000;
const BLOCK_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;
const MAX_TRACKED_CLIENTS = 10000;

function cleanupOldEntries(now: number) {
  if (attempts.size < MAX_TRACKED_CLIENTS) return;

  for (const [key, state] of attempts.entries()) {
    const isExpiredWindow = now - state.windowStart > WINDOW_MS;
    const isUnblocked = state.blockedUntil <= now;
    if (isExpiredWindow && isUnblocked) {
      attempts.delete(key);
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
