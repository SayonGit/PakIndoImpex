/**
 * Minimal in-memory fixed-window rate limiter for form/API abuse prevention.
 * Sufficient for a single-instance deployment; if the app ever runs across
 * multiple server instances, swap this for a shared store (e.g. Redis).
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 8;

export function checkRateLimit(key: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (bucket.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { allowed: true };
}

export function getClientKey(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
