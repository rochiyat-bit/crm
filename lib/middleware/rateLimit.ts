import { NextRequest, NextResponse } from 'next/server';
import { connectRedis } from '../cache/redis';

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  keyPrefix?: string; // Redis key prefix
}

/**
 * Rate limiting middleware using Redis
 */
export function rateLimit(options: RateLimitOptions) {
  const { windowMs, maxRequests, keyPrefix = 'ratelimit' } = options;

  return async (request: NextRequest, identifier: string) => {
    try {
      const redis = await connectRedis();
      const key = `${keyPrefix}:${identifier}`;
      const now = Date.now();
      const windowStart = now - windowMs;

      // Remove old entries
      await redis.zRemRangeByScore(key, 0, windowStart);

      // Count requests in current window
      const requestCount = await redis.zCard(key);

      if (requestCount >= maxRequests) {
        return NextResponse.json(
          {
            success: false,
            error: 'Too many requests. Please try again later.',
          },
          {
            status: 429,
            headers: {
              'Retry-After': String(Math.ceil(windowMs / 1000)),
            },
          }
        );
      }

      // Add current request
      await redis.zAdd(key, { score: now, value: `${now}` });
      await redis.expire(key, Math.ceil(windowMs / 1000));

      return null; // No rate limit exceeded
    } catch (error) {
      console.error('Rate limit error:', error);
      // Allow request if rate limiting fails
      return null;
    }
  };
}

/**
 * Get client identifier from request
 */
export function getClientId(request: NextRequest): string {
  // Try to get user ID from session first
  const userId = request.headers.get('x-user-id');
  if (userId) return `user:${userId}`;

  // Fallback to IP address
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';

  return `ip:${ip}`;
}

// Predefined rate limiters
export const globalRateLimit = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '60000'), // 1 minute
  maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  keyPrefix: 'global',
});

export const userRateLimit = rateLimit({
  windowMs: 60000, // 1 minute
  maxRequests: parseInt(process.env.RATE_LIMIT_MAX_PER_USER || '60'),
  keyPrefix: 'user',
});

export const authRateLimit = rateLimit({
  windowMs: 900000, // 15 minutes
  maxRequests: 5,
  keyPrefix: 'auth',
});

export const apiRateLimit = rateLimit({
  windowMs: 60000, // 1 minute
  maxRequests: 100,
  keyPrefix: 'api',
});
