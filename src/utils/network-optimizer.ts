/**
 * Network optimization utilities for improving web performance
 */

import { detectDeviceCapabilities } from './performance-optimizer';

// Keep a reference to the native fetch to avoid recursion when overriding
let nativeFetchRef: typeof fetch | null = null;

export function getNativeFetch(): typeof fetch {
  return nativeFetchRef || fetch;
}

/**
 * Configuration options for network optimization
 */
export interface NetworkOptimizerConfig {
  /** Whether to use the Cache API for fetch requests */
  useCache?: boolean;
  /** Default cache TTL in seconds */
  cacheTtl?: number;
  /** Maximum cache size in bytes */
  maxCacheSize?: number;
  /** Whether to prefetch critical resources */
  prefetchCritical?: boolean;
  /** Whether to use connection-aware fetching */
  connectionAware?: boolean;
  /** Whether to compress request/response data */
  useCompression?: boolean;
}

/**
 * Default configuration for network optimizer
 */
const DEFAULT_CONFIG: NetworkOptimizerConfig = {
  useCache: true,
  cacheTtl: 300, // 5 minutes
  maxCacheSize: 5 * 1024 * 1024, // 5MB
  prefetchCritical: true,
  connectionAware: true,
  useCompression: true
};

/**
 * Cache storage for network requests
 */
class NetworkCache {
  private cache: Map<string, { data: any; timestamp: number; size: number }> = new Map();
  private totalSize: number = 0;
  private maxSize: number;
  private defaultTtl: number;
  
  constructor(maxSize: number = DEFAULT_CONFIG.maxCacheSize || 5 * 1024 * 1024, defaultTtl: number = DEFAULT_CONFIG.cacheTtl || 300) {
    this.maxSize = maxSize;
    this.defaultTtl = defaultTtl;
  }
  
  /**
   * Sets an item in the cache
   * @param key Cache key
   * @param data Data to cache
   * @param ttl Time to live in seconds
   */
  set(key: string, data: any, ttl: number = this.defaultTtl): void {
    // Estimate size of data
    const size = this.estimateSize(data);
    
    // If this single item is larger than max cache size, don't cache it
    if (size > this.maxSize) {
      console.warn(`Item too large to cache: ${key} (${size} bytes)`);
      return;
    }
    
    // Make room in the cache if needed
    this.ensureSpace(size);
    
    // Add to cache
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      size
    });
    
    this.totalSize += size;
  }
  
  /**
   * Gets an item from the cache
   * @param key Cache key
   * @returns Cached data or null if not found or expired
   */
  get(key: string): any {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    // Check if item is expired
    const age = (Date.now() - item.timestamp) / 1000;
    if (age > this.defaultTtl) {
      // Remove expired item
      this.remove(key);
      return null;
    }
    
    return item.data;
  }
  
  /**
   * Removes an item from the cache
   * @param key Cache key
   */
  remove(key: string): void {
    const item = this.cache.get(key);
    if (item) {
      this.totalSize -= item.size;
      this.cache.delete(key);
    }
  }
  
  /**
   * Clears the entire cache
   */
  clear(): void {
    this.cache.clear();
    this.totalSize = 0;
  }
  
  /**
   * Gets cache statistics
   */
  getStats(): { itemCount: number; totalSize: number; maxSize: number } {
    return {
      itemCount: this.cache.size,
      totalSize: this.totalSize,
      maxSize: this.maxSize
    };
  }
  
  /**
   * Estimates the size of data in bytes
   * @param data Data to estimate size for
   */
  private estimateSize(data: any): number {
    if (data === null || data === undefined) return 0;
    
    if (typeof data === 'string') {
      return data.length * 2; // Approximate size of string in bytes
    }
    
    if (typeof data === 'number') return 8;
    if (typeof data === 'boolean') return 4;
    
    if (data instanceof ArrayBuffer) {
      return data.byteLength;
    }
    
    if (ArrayBuffer.isView(data)) {
      return data.byteLength;
    }
    
    if (data instanceof Blob) {
      return data.size;
    }
    
    if (Array.isArray(data)) {
      return data.reduce((size, item) => size + this.estimateSize(item), 0);
    }
    
    if (typeof data === 'object') {
      try {
        // Approximate size based on JSON string
        return JSON.stringify(data).length * 2;
      } catch (e) {
        // Fallback for objects that can't be stringified
        return Object.keys(data).reduce((size, key) => {
          return size + key.length * 2 + this.estimateSize((data as any)[key]);
        }, 0);
      }
    }
    
    return 8; // Default size for unknown types
  }
  
  /**
   * Ensures there's enough space in the cache for new data
   * @param requiredSize Size in bytes needed
   */
  private ensureSpace(requiredSize: number): void {
    if (this.totalSize + requiredSize <= this.maxSize) return;
    
    // Sort items by age (oldest first)
    const items = Array.from(this.cache.entries()).sort((a, b) => {
      return a[1].timestamp - b[1].timestamp;
    });
    
    // Remove oldest items until we have enough space
    for (const [key] of items) {
      if (this.totalSize + requiredSize <= this.maxSize) break;
      
      this.remove(key);
    }
  }
}

// Create a singleton cache instance
const networkCache = new NetworkCache();

/**
 * Optimized fetch function with caching, compression, and connection awareness
 * @param url URL to fetch
 * @param options Fetch options
 * @param cacheOptions Caching options
 */
export async function optimizedFetch<T>(
  url: string,
  options: RequestInit = {},
  cacheOptions: {
    useCache?: boolean;
    cacheTtl?: number;
    cacheKey?: string;
    forceRefresh?: boolean;
  } = {}
): Promise<T> {
  const {
    useCache = DEFAULT_CONFIG.useCache,
    cacheTtl = DEFAULT_CONFIG.cacheTtl,
    cacheKey = url,
    forceRefresh = false
  } = cacheOptions;
  
  // Check if we should use connection-aware fetching
  if (DEFAULT_CONFIG.connectionAware && typeof navigator !== 'undefined' && 'connection' in navigator) {
    const connection = (navigator as any).connection;
    
    // For slow connections, prioritize cache even if forceRefresh is true
    if (connection && (connection.saveData || 
        connection.effectiveType === 'slow-2g' || 
        connection.effectiveType === '2g')) {
      if (useCache && !forceRefresh) {
        const cachedData = networkCache.get(cacheKey);
        if (cachedData) return cachedData;
      }
    }
  }
  
  // Check cache first if enabled and not forcing refresh
  if (useCache && !forceRefresh) {
    const cachedData = networkCache.get(cacheKey);
    if (cachedData) return cachedData;
  }
  
  // Add compression headers if enabled
  if (DEFAULT_CONFIG.useCompression) {
    options.headers = {
      ...(options.headers || {}),
      'Accept-Encoding': 'gzip, deflate, br'
    };
  }
  
  try {
    // Perform the fetch using native fetch to avoid recursion
    const baseFetch = getNativeFetch();
    const response = await baseFetch(url, options);
    
    if (!response.ok) {
      throw new Error(`Network error: ${response.status} ${response.statusText}`);
    }
    
    // Parse the response
    let data: T;
    const contentType = response.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else if (contentType.includes('text/')) {
      data = await response.text() as unknown as T;
    } else {
      // For binary data, use arrayBuffer
      data = await response.arrayBuffer() as unknown as T;
    }
    
    // Cache the response if caching is enabled
    if (useCache) {
      networkCache.set(cacheKey, data, cacheTtl);
    }
    
    return data;
  } catch (error) {
    console.error('Optimized fetch error:', error);
    throw error;
  }
}

/**
 * Prefetches resources to improve perceived performance
 * @param urls URLs to prefetch
 * @param options Prefetch options
 */
export function prefetchResources(
  urls: string[],
  options: {
    as?: 'image' | 'style' | 'script' | 'font' | 'fetch';
    type?: string;
    importance?: 'high' | 'low' | 'auto';
  } = {}
): void {
  if (typeof document === 'undefined') return;
  
  const { as = 'fetch', type, importance = 'auto' } = options;
  
  urls.forEach(url => {
    // Skip if already prefetched
    if (document.querySelector(`link[rel="prefetch"][href="${url}"]`)) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = as;
    link.setAttribute('importance', importance);
    
    if (type) {
      link.type = type;
    }
    
    document.head.appendChild(link);
  });
}

/**
 * Optimizes network usage based on device capabilities and user preferences
 * @param isLowPerformance Whether the device is a low-performance device
 * @deprecated Consider using detectDeviceCapabilities().isLowEnd for consistency with the DeviceCapabilities interface
 * @param config Configuration options
 */
export function optimizeNetwork(isLowPerformance: boolean = false, config: NetworkOptimizerConfig = DEFAULT_CONFIG): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const cleanupFunctions: Array<() => void> = [];
  
  // Override fetch with optimized version
  if (mergedConfig.useCache || mergedConfig.connectionAware || mergedConfig.useCompression) {
    const originalFetch = window.fetch;

    // Store native fetch for use inside optimizedFetch
    nativeFetchRef = originalFetch;
    
    window.fetch = async function(input: URL | RequestInfo, init?: RequestInit): Promise<Response> {
      try {
        // Only optimize GET requests
        if (!init || init.method === undefined || init.method === 'GET') {
          const url = typeof input === 'string' ? input : 
                   input instanceof URL ? input.href : 
                   input instanceof Request ? input.url : 
                   String(input);
          
          // Skip optimization for certain types of requests
          const skipOptimization = 
            url.includes('/api/analytics') || // Skip analytics
            url.includes('/socket.io') ||    // Skip websockets
            url.includes('/api/auth') ||     // Skip NextAuth endpoints (sessions, signin, etc.)
            url.endsWith('.mp4') ||         // Skip video
            url.endsWith('.mp3');           // Skip audio
          
          if (!skipOptimization) {
            // Apply optimizations
            const cacheKey = url + (init ? JSON.stringify(init) : '');
            
            return optimizedFetch(url, init, {
              useCache: mergedConfig.useCache,
              cacheTtl: mergedConfig.cacheTtl,
              cacheKey
            }) as unknown as Promise<Response>;
          }
        }
      } catch (error) {
        console.warn('Error in optimized fetch, falling back to original:', error);
      }
      
      // Fall back to original fetch
      return originalFetch.call(window, input as any, init);
    };
    
    // Add cleanup function
    cleanupFunctions.push(() => {
      window.fetch = originalFetch;
    });
  }
  
  // Prefetch critical resources
  if (mergedConfig.prefetchCritical) {
    // Find critical resources to prefetch
    const criticalResources: string[] = [];
    
    // Look for critical resources in link tags
    document.querySelectorAll('link[data-critical="true"]').forEach(link => {
      const href = link.getAttribute('href');
      if (href) criticalResources.push(href);
    });
    
    // Look for critical resources in script tags
    document.querySelectorAll('script[data-critical="true"]').forEach(script => {
      const src = script.getAttribute('src');
      if (src) criticalResources.push(src);
    });
    
    // Look for critical resources in img tags
    document.querySelectorAll('img[data-critical="true"]').forEach(img => {
      const src = img.getAttribute('src');
      if (src) criticalResources.push(src);
    });
    
    // Prefetch critical resources
    if (criticalResources.length > 0) {
      prefetchResources(criticalResources, { importance: 'high' });
    }
  }
  
  // Return cleanup function
  return () => {
    cleanupFunctions.forEach(cleanup => cleanup());
    
    // Clear cache
    networkCache.clear();
  };
}

/**
 * Gets network cache statistics
 */
export function getNetworkCacheStats(): { itemCount: number; totalSize: number; maxSize: number } {
  return networkCache.getStats();
}

/**
 * Clears the network cache
 */
export function clearNetworkCache(): void {
  networkCache.clear();
}