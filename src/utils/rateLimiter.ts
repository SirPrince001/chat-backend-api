
interface RateLimitOptions {
  maxMessages: number;
  timeWindowMs: number;
}

const userTimestamps = new Map<string, number[]>();

export function checkRateLimit(
  userId: string,
  options: RateLimitOptions
): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  if (!userTimestamps.has(userId)) userTimestamps.set(userId, []);

  const timestamps = userTimestamps.get(userId)!;

  // Remove timestamps older than the time window
  const recentTimestamps = timestamps.filter(
    (t) => now - t < options.timeWindowMs
  );
  userTimestamps.set(userId, recentTimestamps);

  if (recentTimestamps.length >= options.maxMessages) {
    // User exceeded limit
    const oldest = recentTimestamps[0]; // possibly undefined
    const retryAfter =
      oldest !== undefined
        ? options.timeWindowMs - (now - oldest)
        : options.timeWindowMs;
    return { allowed: false, retryAfter };
  }

  // Record current timestamp
  recentTimestamps.push(now);

  return { allowed: true };
}
