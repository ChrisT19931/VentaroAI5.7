/**
 * Data optimization utilities for improving data fetching and processing performance
 */

/**
 * Configuration options for data optimization
 */
export interface DataOptimizerConfig {
  /** Whether to cache API responses */
  cacheResponses?: boolean;
  /** Cache TTL in milliseconds */
  cacheTtl?: number;
  /** Maximum cache size */
  cacheSize?: number;
  /** Whether to compress data */
  compressData?: boolean;
  /** Whether to batch API requests */
  batchRequests?: boolean;
  /** Whether to prefetch data */
  prefetchData?: boolean;
  /** Whether to use stale-while-revalidate strategy */
  useStaleWhileRevalidate?: boolean;
  /** Whether to optimize for low data usage */
  optimizeForLowData?: boolean;
}

/**
 * Default configuration for data optimization
 */
export const DEFAULT_DATA_CONFIG: DataOptimizerConfig = {
  cacheResponses: true,
  cacheTtl: 5 * 60 * 1000, // 5 minutes
  cacheSize: 100,
  compressData: true,
  batchRequests: true,
  prefetchData: true,
  useStaleWhileRevalidate: true,
  optimizeForLowData: true,
};

/**
 * Cache entry interface
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Simple in-memory cache for API responses
 */
export class DataCache<T = any> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private maxSize: number;
  private defaultTtl: number;
  
  constructor(maxSize: number = 100, defaultTtl: number = 5 * 60 * 1000) {
    this.maxSize = maxSize;
    this.defaultTtl = defaultTtl;
  }
  
  /**
   * Sets a cache entry
   * @param key Cache key
   * @param data Data to cache
   * @param ttl TTL in milliseconds
   */
  set(key: string, data: T, ttl: number = this.defaultTtl): void {
    // Evict oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.getOldestKey();
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
    
    // Add new entry
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }
  
  /**
   * Gets a cache entry
   * @param key Cache key
   * @returns Cached data or null if not found or expired
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check if entry is expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  /**
   * Gets a cache entry even if it's stale
   * @param key Cache key
   * @returns Cached data or null if not found
   */
  getStale(key: string): T | null {
    const entry = this.cache.get(key);
    return entry ? entry.data : null;
  }
  
  /**
   * Checks if a cache entry is stale
   * @param key Cache key
   * @returns Whether the entry is stale
   */
  isStale(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return true;
    }
    
    return Date.now() - entry.timestamp > entry.ttl;
  }
  
  /**
   * Deletes a cache entry
   * @param key Cache key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  /**
   * Clears the cache
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * Gets the oldest key in the cache
   * @returns Oldest key or null if cache is empty
   */
  private getOldestKey(): string | null {
    if (this.cache.size === 0) return null;
    
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;
    
    Array.from(this.cache.entries()).forEach(([key, entry]) => {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    });
    
    return oldestKey;
  }
  
  /**
   * Gets cache statistics
   * @returns Cache statistics
   */
  getStats(): { size: number; maxSize: number; hitRate: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: this.hitCount / (this.hitCount + this.missCount),
    };
  }
  
  // Cache hit/miss tracking
  private hitCount = 0;
  private missCount = 0;
  
  /**
   * Tracks a cache hit
   */
  trackHit(): void {
    this.hitCount++;
  }
  
  /**
   * Tracks a cache miss
   */
  trackMiss(): void {
    this.missCount++;
  }
}

// Create a global cache instance
const globalCache = new DataCache();

/**
 * Optimized fetch function with caching and compression
 * @param url URL to fetch
 * @param options Fetch options
 * @param cacheKey Custom cache key
 * @param cacheTtl Cache TTL in milliseconds
 * @param useStaleWhileRevalidate Whether to use stale-while-revalidate strategy
 */
export async function optimizedFetch<T>(
  url: string,
  options: RequestInit = {},
  cacheKey: string = url,
  cacheTtl: number = DEFAULT_DATA_CONFIG.cacheTtl!,
  useStaleWhileRevalidate: boolean = DEFAULT_DATA_CONFIG.useStaleWhileRevalidate!
): Promise<T> {
  // Check if the response is in the cache
  const cachedResponse = globalCache.get(cacheKey) as T;
  
  if (cachedResponse) {
    globalCache.trackHit();
    return cachedResponse;
  }
  
  globalCache.trackMiss();
  
  // If using stale-while-revalidate, check for stale data
  let staleResponse: T | null = null;
  if (useStaleWhileRevalidate) {
    staleResponse = globalCache.getStale(cacheKey) as T;
  }
  
  // Fetch fresh data
  const fetchPromise = fetch(url, options)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data: T) => {
      // Cache the response
      globalCache.set(cacheKey, data, cacheTtl);
      return data;
    });
  
  // Return stale data immediately if available, and update in the background
  if (staleResponse && useStaleWhileRevalidate) {
    fetchPromise.catch(error => {
      console.error('Background fetch failed:', error);
    });
    return staleResponse;
  }
  
  // Otherwise, wait for the fetch to complete
  return fetchPromise;
}

/**
 * Batches multiple API requests into a single request
 * @param urls Array of URLs to fetch
 * @param batchUrl URL for the batch API endpoint
 * @param options Fetch options
 */
export async function batchFetch<T>(
  urls: string[],
  batchUrl: string,
  options: RequestInit = {}
): Promise<Record<string, T>> {
  // Create the batch request payload
  const payload = {
    urls,
  };
  
  // Send the batch request
  const response = await fetch(batchUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(payload),
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Prefetches data for future use
 * @param urls Array of URLs to prefetch
 * @param cacheTtl Cache TTL in milliseconds
 */
export function prefetchData(
  urls: string[],
  cacheTtl: number = DEFAULT_DATA_CONFIG.cacheTtl!
): void {
  urls.forEach(url => {
    // Skip if already in cache
    if (globalCache.get(url)) {
      return;
    }
    
    // Prefetch in the background
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        globalCache.set(url, data, cacheTtl);
      })
      .catch(error => {
        console.error('Prefetch failed:', error);
      });
  });
}

/**
 * Compresses data using JSON.stringify with a replacer function
 * @param data Data to compress
 * @returns Compressed data
 */
export function compressData<T>(data: T): string {
  // Simple compression by removing whitespace
  return JSON.stringify(data);
}

/**
 * Decompresses data using JSON.parse
 * @param compressedData Compressed data
 * @returns Decompressed data
 */
export function decompressData<T>(compressedData: string): T {
  return JSON.parse(compressedData);
}

/**
 * Initializes data optimization
 * @param config Configuration options
 */
export function initializeDataOptimization(config: DataOptimizerConfig = DEFAULT_DATA_CONFIG): () => void {
  const {
    cacheResponses,
    cacheTtl,
    cacheSize,
    prefetchData: shouldPrefetchData,
    optimizeForLowData,
  } = { ...DEFAULT_DATA_CONFIG, ...config };
  
  // Configure the global cache
  if (cacheResponses) {
    globalCache.clear();
  }
  
  // Prefetch critical data if enabled
  if (shouldPrefetchData) {
    // Prefetch data for the current page
    const prefetchLinks = document.querySelectorAll('link[rel="prefetch"][as="fetch"]');
    const prefetchUrls = Array.from(prefetchLinks).map(link => link.getAttribute('href')).filter(Boolean) as string[];
    
    if (prefetchUrls.length > 0) {
      prefetchData(prefetchUrls, cacheTtl);
    }
  }
  
  // Set up save-data detection
  const saveData = (navigator as any).connection?.saveData || false;
  
  // Apply low data optimizations if enabled and save-data is set
  if (optimizeForLowData && saveData) {
    // Disable prefetching
    document.querySelectorAll('link[rel="prefetch"]').forEach(link => {
      link.remove();
    });
    
    // Disable preloading
    document.querySelectorAll('link[rel="preload"]').forEach(link => {
      // Keep critical preloads
      if (!link.hasAttribute('data-critical')) {
        link.remove();
      }
    });
  }
  
  // Return a cleanup function
  return () => {
    // No cleanup needed
  };
}

/**
 * Gets the global data cache instance
 * @returns Global data cache instance
 */
export function getDataCache<T>(): DataCache<T> {
  return globalCache as DataCache<T>;
}