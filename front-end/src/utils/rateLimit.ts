/**
 * Simple in-memory rate limiter for Vercel serverless functions
 * Limits: 5 requests per minute per IP
 */

type RateLimitEntry = {
  count: number;
  resetTime: number;
};

// In-memory store (resets on cold start, which is acceptable for basic protection)
const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  resetInSeconds: number;
};

/**
 * Check if an IP has exceeded the rate limit
 */
export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  // Clean up expired entries periodically
  if (rateLimitStore.size > 1000) {
    cleanupExpiredEntries(now);
  }

  // No previous requests from this IP
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return {
      success: true,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      resetInSeconds: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000),
    };
  }

  // Check if limit exceeded
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    const resetInSeconds = Math.ceil((entry.resetTime - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetInSeconds,
    };
  }

  // Increment counter
  entry.count++;
  return {
    success: true,
    remaining: MAX_REQUESTS_PER_WINDOW - entry.count,
    resetInSeconds: Math.ceil((entry.resetTime - now) / 1000),
  };
}

/**
 * Get client IP from request headers (Vercel-specific)
 */
export function getClientIP(request: Request): string {
  // Vercel provides the real IP in x-forwarded-for
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }

  // Fallback headers
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Last resort fallback
  return 'unknown';
}

/**
 * Clean up expired entries to prevent memory leaks
 */
function cleanupExpiredEntries(now: number): void {
  for (const [ip, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}
