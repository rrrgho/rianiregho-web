// Minimal in-memory throttle (per server instance).
const buckets = new Map<string, { count: number; reset: number }>();

export function isLimited(key: string, max = 5): boolean {
  const e = buckets.get(key);
  return !!e && e.reset > Date.now() && e.count >= max;
}

export function recordFailure(key: string, windowMs = 60_000) {
  const now = Date.now();
  const e = buckets.get(key);
  buckets.set(key, {
    count: e && e.reset > now ? e.count + 1 : 1,
    reset: e && e.reset > now ? e.reset : now + windowMs,
  });
}

export function clearFailures(key: string) {
  buckets.delete(key);
}
