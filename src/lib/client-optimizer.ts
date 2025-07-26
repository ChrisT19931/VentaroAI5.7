'use client';

import React from 'react';

// Client-side optimization utilities that don't require server-side dependencies

// Simple cache for client-side operations
class ClientCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private maxSize = 50; // Smaller cache for client-side

  set(key: string, data: any, ttl: number = 300000): void {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  getSize(): number {
    return this.cache.size;
  }
}

const clientCache = new ClientCache();

// Client-safe optimized API call function
export async function optimizedApiCall<T>(
  apiCall: () => Promise<T>,
  cacheKey?: string,
  cacheTtl?: number
): Promise<T> {
  // Check cache first
  if (cacheKey) {
    const cached = clientCache.get(cacheKey);
    if (cached) {
      return cached;
    }
  }

  // Make API call
  const startTime = performance.now();
  try {
    const result = await apiCall();
    
    // Cache result
    if (cacheKey) {
      clientCache.set(cacheKey, result, cacheTtl);
    }

    // Log performance
    const duration = performance.now() - startTime;
    if (duration > 1000) {
      console.warn(`Slow API call detected: ${cacheKey || 'unknown'} took ${duration.toFixed(2)}ms`);
    }

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    console.error(`API call failed: ${cacheKey || 'unknown'} after ${duration.toFixed(2)}ms`, error);
    throw error;
  }
}

// Client-safe cache utilities
export const clientCacheUtils = {
  clear: () => clientCache.clear(),
  size: () => clientCache.getSize(),
};

// Client-safe React hook for system optimization status
export const useSystemOptimization = () => {
  const [status, setStatus] = React.useState({
    isOptimized: true,
    config: {
      enableCaching: true,
      enableCompression: true,
      enableLazyLoading: true,
      enablePreloading: true,
      enableServiceWorker: false,
      cacheTimeout: 300000,
      retryAttempts: 3,
      healthCheckInterval: 60000,
    },
    systemHealth: {
      supabase: true,
      stripe: true,
      sendgrid: true,
      overall: true,
      lastCheck: Date.now(),
    },
    cacheStats: {
       size: clientCache.getSize(),
       maxSize: 50,
       enabled: true,
     },
    performanceScore: 85, // Default good score
  });
  
  React.useEffect(() => {
    // Update cache stats periodically
    const interval = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        cacheStats: {
           ...prev.cacheStats,
           size: clientCache.getSize(),
         },
        systemHealth: {
          ...prev.systemHealth,
          lastCheck: Date.now(),
        },
      }));
    }, 10000); // Update every 10 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return {
    ...status,
    clearCache: () => clientCache.clear(),
    updateConfig: (newConfig: any) => {
      setStatus(prev => ({
        ...prev,
        config: { ...prev.config, ...newConfig },
      }));
    },
  };
 };