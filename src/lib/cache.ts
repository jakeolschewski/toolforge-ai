// Cache utility for Redis and in-memory caching
// Supports both Redis (production) and in-memory (development) caching

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

// In-memory cache fallback
class MemoryCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt < now) {
        this.cache.delete(key);
      }
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { data: value, expiresAt });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  destroy() {
    clearInterval(this.cleanupInterval);
    this.cache.clear();
  }
}

// Redis client wrapper
class RedisCache {
  private client: any;
  private connected: boolean = false;

  constructor() {
    // Only initialize Redis in production
    if (process.env.NODE_ENV === 'production' && process.env.REDIS_URL) {
      this.initRedis();
    }
  }

  private async initRedis() {
    try {
      // @ts-ignore - redis is an optional dependency
      const { createClient } = await import('redis');
      this.client = createClient({
        url: process.env.REDIS_URL,
        socket: {
          connectTimeout: 5000,
        },
      });

      this.client.on('error', (err: Error) => {
        console.error('Redis Client Error:', err);
        this.connected = false;
      });

      this.client.on('connect', () => {
        console.log('Redis connected successfully');
        this.connected = true;
      });

      await this.client.connect();
    } catch (error) {
      console.error('Failed to initialize Redis:', error);
      this.connected = false;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.connected || !this.client) return null;

    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    if (!this.connected || !this.client) return;

    try {
      await this.client.setEx(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  async delete(key: string): Promise<void> {
    if (!this.connected || !this.client) return;

    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Redis delete error:', error);
    }
  }

  async clear(): Promise<void> {
    if (!this.connected || !this.client) return;

    try {
      await this.client.flushDb();
    } catch (error) {
      console.error('Redis clear error:', error);
    }
  }
}

// Cache manager that uses Redis in production, memory cache in development
class CacheManager {
  private redisCache: RedisCache;
  private memoryCache: MemoryCache;

  constructor() {
    this.redisCache = new RedisCache();
    this.memoryCache = new MemoryCache();
  }

  private getCache() {
    return process.env.NODE_ENV === 'production' && process.env.REDIS_URL
      ? this.redisCache
      : this.memoryCache;
  }

  async get<T>(key: string): Promise<T | null> {
    return this.getCache().get<T>(key);
  }

  async set<T>(key: string, value: T, ttlSeconds: number = 300): Promise<void> {
    return this.getCache().set(key, value, ttlSeconds);
  }

  async delete(key: string): Promise<void> {
    return this.getCache().delete(key);
  }

  async clear(): Promise<void> {
    return this.getCache().clear();
  }

  destroy() {
    if (this.memoryCache) {
      this.memoryCache.destroy();
    }
  }
}

// Singleton instance
const cacheManager = new CacheManager();

// Cache key generators
export const CacheKeys = {
  tool: (slug: string) => `tool:${slug}`,
  tools: (page: number, limit: number, filters?: string) =>
    `tools:${page}:${limit}${filters ? `:${filters}` : ''}`,
  toolsByCategory: (category: string, page: number) => `tools:category:${category}:${page}`,
  featuredTools: () => `tools:featured`,
  latestTools: () => `tools:latest`,
  categories: () => `categories`,
  reviews: (toolId: string) => `reviews:${toolId}`,
  stats: () => `stats:dashboard`,
  search: (query: string) => `search:${query}`,
  blogPost: (slug: string) => `blog:${slug}`,
  collection: (slug: string) => `collection:${slug}`,
  comparison: (slug: string) => `comparison:${slug}`,
};

// Default TTL values (in seconds)
export const CacheTTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 1800, // 30 minutes
  HOUR: 3600, // 1 hour
  DAY: 86400, // 24 hours
};

// Cached query wrapper
export async function cachedQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = CacheTTL.MEDIUM
): Promise<T> {
  // Try to get from cache
  const cached = await cacheManager.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetcher();

  // Store in cache (don't await to avoid blocking)
  cacheManager.set(key, data, ttl).catch((error) => {
    console.error('Cache set error:', error);
  });

  return data;
}

// Cache invalidation helper
export async function invalidateCache(pattern: string): Promise<void> {
  // For now, just delete the exact key
  // In production with Redis, you could use SCAN to find matching keys
  await cacheManager.delete(pattern);
}

// Batch invalidation
export async function invalidateCachePatterns(patterns: string[]): Promise<void> {
  await Promise.all(patterns.map((pattern) => invalidateCache(pattern)));
}

export { cacheManager as cache };
export default cacheManager;
