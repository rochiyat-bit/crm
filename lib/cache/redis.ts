import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Create Redis client
const redis = createClient({
  url: REDIS_URL,
});

redis.on('error', (err) => console.error('Redis Client Error', err));
redis.on('connect', () => console.log('✅ Redis connected successfully'));

// Connect to Redis
let isConnected = false;

export async function connectRedis() {
  if (!isConnected) {
    await redis.connect();
    isConnected = true;
  }
  return redis;
}

// Cache utility functions
export const cache = {
  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const client = await connectRedis();
      const value = await client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  /**
   * Set value in cache with TTL (in seconds)
   */
  async set(key: string, value: any, ttl: number = 300): Promise<void> {
    try {
      const client = await connectRedis();
      await client.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  },

  /**
   * Delete key from cache
   */
  async del(key: string): Promise<void> {
    try {
      const client = await connectRedis();
      await client.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  },

  /**
   * Delete keys matching pattern
   */
  async delPattern(pattern: string): Promise<void> {
    try {
      const client = await connectRedis();
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(keys);
      }
    } catch (error) {
      console.error('Cache delete pattern error:', error);
    }
  },

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const client = await connectRedis();
      const result = await client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  },
};

// Cache key generators
export const cacheKeys = {
  dashboardStats: (companyId: string) => `dashboard:stats:${companyId}`,
  userPermissions: (userId: string) => `user:permissions:${userId}`,
  companySettings: (companyId: string) => `company:settings:${companyId}`,
  contactList: (companyId: string, page: number, filters: string) =>
    `contacts:list:${companyId}:${page}:${filters}`,
  dealPipeline: (companyId: string, pipelineId: string) =>
    `deals:pipeline:${companyId}:${pipelineId}`,
  reportResult: (reportId: string) => `report:result:${reportId}`,
  session: (sessionId: string) => `session:${sessionId}`,
};

// Cache TTL constants (in seconds)
export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 900, // 15 minutes
  HOUR: 3600, // 1 hour
  DAY: 86400, // 24 hours
} as const;

export default redis;
